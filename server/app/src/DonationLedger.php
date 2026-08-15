<?php

declare(strict_types=1);

namespace Fire;

/**
 * Donation ledger backed by the Airtable "Donations" table.
 *
 * Zeffy is the payment processor — no card data ever reaches this codebase.
 * Zeffy notifies us over a webhook (server/public-api/zeffy-webhook.php) once
 * a gift settles; we persist a redacted record (programme, amount, currency,
 * status, timestamp, Zeffy payment id) and expose an aggregate per programme
 * so the website can show live funding progress in the relevant sections.
 *
 * Everything degrades quietly: without credentials or with Airtable down the
 * summary is simply empty and the UI falls back to its static copy.
 */
final class DonationLedger
{
    private const CACHE_TTL = 300;
    private const MAX_RECORDS = 1000;

    public static function table(): string
    {
        return (string) Config::get('AIRTABLE_TABLE_DONATIONS', 'Donations');
    }

    /**
     * Persist a settled (or refunded/failed) donation notification.
     *
     * @param array{programSlug: string, programTitle: string, amount: float, currency: string, status: string, frequency: string, donorName: string, paymentId: string, donatedAt: string} $donation
     */
    public static function record(array $donation): bool
    {
        $baseId = Config::require('AIRTABLE_BASE_ID');
        $pat = Config::require('AIRTABLE_PAT');
        if ($baseId === null || $pat === null) {
            Logger::error('donations', 'Airtable not configured; webhook not persisted');
            return false;
        }

        $client = new AirtableClient($baseId, $pat);
        $result = $client->post(self::table(), [
            'records' => [[
                'fields' => [
                    'Programme' => $donation['programSlug'],
                    'Programme Name' => $donation['programTitle'],
                    'Amount' => $donation['amount'],
                    'Currency' => $donation['currency'],
                    'Status' => $donation['status'],
                    'Frequency' => $donation['frequency'],
                    'Donor Name' => $donation['donorName'],
                    'Payment ID' => $donation['paymentId'],
                    'Donated At' => $donation['donatedAt'],
                ],
            ]],
            'typecast' => true,
        ]);

        if ($result['status'] === 0) {
            Logger::error('donations', 'Airtable transport failure while recording donation');
            return false;
        }
        if ($result['status'] < 200 || $result['status'] >= 300) {
            Logger::error('donations', 'Airtable rejected donation record', [
                'reason' => AirtableClient::categorizeStatus($result['status']),
            ]);
            return false;
        }

        self::clearCache();
        return true;
    }

    /**
     * Per-programme totals for successful gifts.
     *
     * @return array<string, array{raised: float, supporters: int, currency: string, lastGiftAt: string|null}>
     */
    public static function summary(): array
    {
        $cached = self::readCache();
        if ($cached !== null) {
            return $cached;
        }

        $summary = self::build();
        self::writeCache($summary);

        return $summary;
    }

    /**
     * @return array<string, array{raised: float, supporters: int, currency: string, lastGiftAt: string|null}>
     */
    private static function build(): array
    {
        $baseId = Config::require('AIRTABLE_BASE_ID');
        $pat = Config::require('AIRTABLE_PAT');
        if ($baseId === null || $pat === null) {
            return [];
        }

        $client = new AirtableClient($baseId, $pat);
        $result = $client->get(self::table(), [
            'filterByFormula' => "{Status}='Succeeded'",
            'pageSize' => '100',
            'maxRecords' => (string) self::MAX_RECORDS,
            'sort[0][field]' => 'Donated At',
            'sort[0][direction]' => 'desc',
        ]);

        if ($result['status'] < 200 || $result['status'] >= 300 || !is_array($result['body'] ?? null)) {
            return [];
        }

        $summary = [];
        foreach (($result['body']['records'] ?? []) as $record) {
            $f = is_array($record['fields'] ?? null) ? $record['fields'] : [];
            $slug = strtolower(trim((string) ($f['Programme'] ?? '')));
            if ($slug === '') {
                $slug = 'general';
            }

            $amount = (float) ($f['Amount'] ?? 0);
            $currency = strtoupper(trim((string) ($f['Currency'] ?? 'USD'))) ?: 'USD';
            $at = trim((string) ($f['Donated At'] ?? ''));

            if (!isset($summary[$slug])) {
                $summary[$slug] = ['raised' => 0.0, 'supporters' => 0, 'currency' => $currency, 'lastGiftAt' => null];
            }

            $summary[$slug]['raised'] += max(0.0, $amount);
            $summary[$slug]['supporters']++;
            if ($at !== '' && ($summary[$slug]['lastGiftAt'] === null || $at > $summary[$slug]['lastGiftAt'])) {
                $summary[$slug]['lastGiftAt'] = $at;
            }
        }

        foreach ($summary as $slug => $entry) {
            $summary[$slug]['raised'] = round($entry['raised'], 2);
        }

        return $summary;
    }

    /**
     * @return array<string, array{raised: float, supporters: int, currency: string, lastGiftAt: string|null}>|null
     */
    private static function readCache(): ?array
    {
        $file = self::cacheFile();
        if (!is_file($file)) {
            return null;
        }
        $raw = @file_get_contents($file);
        if ($raw === false) {
            return null;
        }
        $state = json_decode($raw, true);
        if (!is_array($state) || !is_array($state['summary'] ?? null)) {
            return null;
        }
        if ((time() - (int) ($state['at'] ?? 0)) >= self::CACHE_TTL) {
            return null;
        }
        /** @var array<string, array{raised: float, supporters: int, currency: string, lastGiftAt: string|null}> $summary */
        $summary = $state['summary'];
        return $summary;
    }

    /**
     * @param array<string, array{raised: float, supporters: int, currency: string, lastGiftAt: string|null}> $summary
     */
    private static function writeCache(array $summary): void
    {
        $file = self::cacheFile();
        $dir = dirname($file);
        if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
            return;
        }
        @file_put_contents($file, json_encode(['at' => time(), 'summary' => $summary]), LOCK_EX);
    }

    private static function clearCache(): void
    {
        @unlink(self::cacheFile());
    }

    private static function cacheFile(): string
    {
        $domainRoot = dirname(__DIR__, 2);
        return $domainRoot . '/storage/donations/summary.json';
    }
}

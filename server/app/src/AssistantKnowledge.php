<?php

declare(strict_types=1);

namespace Fire;

/**
 * Live Airtable knowledge for the visitor assistant.
 *
 * Pulls the same records the public pages render (Events, Press Articles and
 * editable Page Content) and flattens them into a compact plain-text briefing
 * that is appended to the assistant's system prompt, so the bot can answer
 * questions about real upcoming events, recent news and current page copy.
 *
 * Everything degrades quietly: no credentials, a transport failure or an
 * Airtable error simply yields an empty string and the assistant falls back
 * to its curated static knowledge. Results are cached on disk for a few
 * minutes so a burst of questions does not hammer the Airtable API.
 */
final class AssistantKnowledge
{
    private const CACHE_TTL = 300;
    private const MAX_EVENTS = 12;
    private const MAX_ARTICLES = 8;
    private const MAX_SECTIONS = 40;

    public static function summary(): string
    {
        $cached = self::readCache();
        if ($cached !== null) {
            return $cached;
        }

        $summary = self::build();
        self::writeCache($summary);

        return $summary;
    }

    private static function build(): string
    {
        $baseId = Config::require('AIRTABLE_BASE_ID');
        $pat = Config::require('AIRTABLE_PAT');
        if ($baseId === null || $pat === null) {
            return '';
        }

        $client = new AirtableClient($baseId, $pat);

        $parts = array_filter([
            self::events($client),
            self::press($client, $pat === '' ? '' : (string) Config::get('AIRTABLE_TABLE_PRESS', 'Press Articles')),
            self::pageContent($client, (string) Config::get('AIRTABLE_TABLE_PAGE_CONTENT', 'Page Content')),
        ]);

        return $parts === [] ? '' : implode("\n\n", $parts);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function records(AirtableClient $client, string $table, array $query): array
    {
        $result = $client->get($table, $query);
        if ($result['status'] < 200 || $result['status'] >= 300 || $result['body'] === null) {
            if ($result['status'] !== 0) {
                Logger::warning('assistant', 'airtable knowledge fetch failed', [
                    'table' => $table,
                    'reason' => AirtableClient::categorizeStatus($result['status']),
                ]);
            }
            return [];
        }

        $records = $result['body']['records'] ?? [];
        return is_array($records) ? $records : [];
    }

    private static function events(AirtableClient $client): string
    {
        $records = self::records($client, 'Events', [
            'filterByFormula' => "{Status}='Active'",
            'sort[0][field]' => 'Display Order',
            'sort[0][direction]' => 'asc',
            'maxRecords' => (string) self::MAX_EVENTS,
        ]);

        $lines = [];
        foreach ($records as $record) {
            $f = $record['fields'] ?? [];
            $name = self::text($f['Event name/title'] ?? '');
            if ($name === '') {
                continue;
            }
            $bits = array_filter([
                self::text($f['Event date(s)'] ?? ''),
                self::text($f['Event time'] ?? ''),
                self::text($f['Event location'] ?? ''),
            ]);
            $line = '- ' . $name;
            if ($bits !== []) {
                $line .= ' (' . implode(', ', $bits) . ')';
            }
            $description = self::text($f['Event description'] ?? '');
            if ($description !== '') {
                $line .= ': ' . self::clip($description, 240);
            }
            $lines[] = $line;
        }

        if ($lines === []) {
            return '';
        }

        return "CURRENT EVENTS (live from the events calendar, RSVP on /events):\n" . implode("\n", $lines);
    }

    private static function press(AirtableClient $client, string $table): string
    {
        if ($table === '') {
            $table = 'Press Articles';
        }

        $records = self::records($client, $table, [
            'filterByFormula' => "{Status}='Published'",
            'sort[0][field]' => 'Date',
            'sort[0][direction]' => 'desc',
            'maxRecords' => (string) self::MAX_ARTICLES,
        ]);

        $lines = [];
        foreach ($records as $record) {
            $f = $record['fields'] ?? [];
            $title = self::text($f['Title'] ?? '');
            if ($title === '') {
                continue;
            }
            $slug = self::text($f['Slug'] ?? '');
            $date = self::text($f['Date'] ?? '');
            $excerpt = self::text($f['Excerpt'] ?? '');

            $line = '- ' . $title;
            if ($date !== '') {
                $line .= ' (' . $date . ')';
            }
            if ($excerpt !== '') {
                $line .= ': ' . self::clip($excerpt, 200);
            }
            if ($slug !== '') {
                $line .= ' [/press/' . $slug . ']';
            }
            $lines[] = $line;
        }

        if ($lines === []) {
            return '';
        }

        return "RECENT NEWS (published articles, full list on /press):\n" . implode("\n", $lines);
    }

    private static function pageContent(AirtableClient $client, string $table): string
    {
        if ($table === '') {
            $table = 'Page Content';
        }

        $records = self::records($client, $table, [
            'filterByFormula' => "{Status}='Active'",
            'maxRecords' => (string) self::MAX_SECTIONS,
        ]);

        $lines = [];
        foreach ($records as $record) {
            $f = $record['fields'] ?? [];
            $route = self::text($f['Route'] ?? '');
            $copy = array_filter([
                self::text($f['Title'] ?? ''),
                self::text($f['Intro'] ?? ''),
                self::text($f['Body'] ?? ''),
            ]);
            if ($route === '' || $copy === []) {
                continue;
            }
            $lines[] = '- ' . $route . ' — ' . self::clip(implode(' ', $copy), 320);
        }

        if ($lines === []) {
            return '';
        }

        return "CURRENT PAGE COPY (edited by the team, may be more up to date than the summary above):\n"
            . implode("\n", $lines);
    }

    private static function text(mixed $value): string
    {
        if (is_array($value)) {
            $value = implode(', ', array_filter($value, 'is_scalar'));
        }
        return is_scalar($value) ? trim((string) $value) : '';
    }

    private static function clip(string $value, int $max): string
    {
        $value = trim(preg_replace('/\s+/u', ' ', strip_tags($value)) ?? $value);
        return mb_strlen($value) > $max ? mb_substr($value, 0, $max - 1) . '…' : $value;
    }

    private static function cacheFile(): string
    {
        return dirname(__DIR__, 2) . '/storage/assistant/knowledge.json';
    }

    private static function readCache(): ?string
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
        if (!is_array($state) || !is_string($state['summary'] ?? null)) {
            return null;
        }
        if ((time() - (int) ($state['at'] ?? 0)) >= self::CACHE_TTL) {
            return null;
        }
        return $state['summary'];
    }

    private static function writeCache(string $summary): void
    {
        $file = self::cacheFile();
        $dir = dirname($file);
        if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
            return;
        }
        @file_put_contents($file, json_encode(['at' => time(), 'summary' => $summary]), LOCK_EX);
    }
}

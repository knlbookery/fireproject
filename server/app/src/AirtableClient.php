<?php

declare(strict_types=1);

namespace Fire;

/**
 * Minimal Airtable Web API client for the migration bridge phase.
 * Replicates the current TanStack fetch-based behavior only — no retry,
 * pagination, or rate-limit handling yet (deferred to the full backend phase).
 */
final class AirtableClient
{
    private const BASE_URL = 'https://api.airtable.com/v0';
    private const CONNECT_TIMEOUT = 5;
    private const TOTAL_TIMEOUT = 15;

    public function __construct(private readonly string $baseId, private readonly string $pat)
    {
    }

    /**
     * @param array<string, string> $query
     * @return array{status: int, body: array<string, mixed>|null}
     */
    public function get(string $table, array $query = []): array
    {
        $url = self::BASE_URL . '/' . rawurlencode($this->baseId) . '/' . rawurlencode($table);
        if ($query !== []) {
            $url .= '?' . http_build_query($query);
        }
        return $this->request('GET', $url);
    }

    /**
     * @param array<string, mixed> $payload
     * @return array{status: int, body: array<string, mixed>|null}
     */
    public function post(string $table, array $payload): array
    {
        $url = self::BASE_URL . '/' . rawurlencode($this->baseId) . '/' . rawurlencode($table);
        return $this->request('POST', $url, $payload);
    }

    /**
     * Categorizes a non-2xx Airtable response status for redacted logging.
     * Status 0 (this client's sentinel for a transport-level failure) is
     * reported separately by callers — it is not passed in here.
     */
    public static function categorizeStatus(int $status): string
    {
        return match (true) {
            $status === 401 => 'unauthorized',
            $status === 403 => 'forbidden',
            $status === 404 => 'base_or_table_not_found',
            $status === 422 => 'invalid_request',
            $status === 429 => 'rate_limited',
            $status >= 500 => 'provider_error',
            default => 'http_error',
        };
    }

    /**
     * @param array<string, mixed>|null $payload
     * @return array{status: int, body: array<string, mixed>|null}
     */
    private function request(string $method, string $url, ?array $payload = null): array
    {
        $ch = curl_init($url);

        $headers = ['Authorization: Bearer ' . $this->pat];

        $options = [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_CONNECTTIMEOUT => self::CONNECT_TIMEOUT,
            CURLOPT_TIMEOUT => self::TOTAL_TIMEOUT,
        ];

        if ($payload !== null) {
            $headers[] = 'Content-Type: application/json';
            $options[CURLOPT_POSTFIELDS] = json_encode($payload, JSON_UNESCAPED_SLASHES);
        }

        $options[CURLOPT_HTTPHEADER] = $headers;
        curl_setopt_array($ch, $options);

        $raw = curl_exec($ch);
        $errno = curl_errno($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errno !== 0 || $raw === false) {
            Logger::error('airtable', 'cURL transport failure', ['errno' => $errno]);
            return ['status' => 0, 'body' => null];
        }

        $decoded = json_decode($raw, true);
        return [
            'status' => $status,
            'body' => is_array($decoded) ? $decoded : null,
        ];
    }
}

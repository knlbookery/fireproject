<?php

declare(strict_types=1);

namespace Fire;

final class HttpResponse
{
    /**
     * @param array<string, mixed> $data
     */
    public static function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_SLASHES);
    }

    /**
     * @param array<string, mixed> $extra
     */
    public static function success(array $extra = [], int $status = 200): void
    {
        self::json(['success' => true] + $extra, $status);
    }

    public static function fail(int $status, string $error, array $extra = []): void
    {
        self::json(['success' => false, 'error' => $error] + $extra, $status);
    }

    public static function method(string ...$allowed): bool
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (in_array($method, $allowed, true)) {
            return true;
        }
        header('Allow: ' . implode(', ', $allowed));
        self::fail(405, 'Method not allowed.');
        return false;
    }
}

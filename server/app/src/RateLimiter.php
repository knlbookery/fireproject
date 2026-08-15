<?php

declare(strict_types=1);

namespace Fire;

/**
 * File-based, per-IP fixed-window rate limiter. No database, no session
 * dependency — safe for a stateless JSON API called from a SPA.
 */
final class RateLimiter
{
    /**
     * @return bool true if the request is allowed (and has been counted).
     */
    public static function allow(string $ip, int $max, int $windowSeconds): bool
    {
        $dir = self::storageDir();
        if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
            // If we can't persist rate-limit state, fail open rather than
            // block all contact submissions on a storage misconfiguration.
            return true;
        }

        $key = hash('sha256', $ip);
        $file = $dir . '/' . $key . '.json';

        $handle = @fopen($file, 'c+');
        if ($handle === false) {
            return true;
        }

        try {
            if (!flock($handle, LOCK_EX)) {
                return true;
            }

            $raw = stream_get_contents($handle);
            $state = is_string($raw) && $raw !== '' ? json_decode($raw, true) : null;

            $now = time();
            $windowStart = is_array($state) ? (int) ($state['windowStart'] ?? 0) : 0;
            $count = is_array($state) ? (int) ($state['count'] ?? 0) : 0;

            if ($windowStart === 0 || ($now - $windowStart) >= $windowSeconds) {
                $windowStart = $now;
                $count = 0;
            }

            $count++;
            $allowed = $count <= $max;

            ftruncate($handle, 0);
            rewind($handle);
            fwrite($handle, json_encode(['windowStart' => $windowStart, 'count' => $count]));
            fflush($handle);

            return $allowed;
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    private static function storageDir(): string
    {
        $domainRoot = dirname(__DIR__, 2);
        return $domainRoot . '/storage/rate-limit';
    }
}

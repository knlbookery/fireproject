<?php

declare(strict_types=1);

namespace Fire;

/**
 * Minimal redacted file logger. Never pass secrets (tokens, SMTP passwords,
 * full webhook URLs, Authorization headers) into $context.
 */
final class Logger
{
    /**
     * @param array<string, mixed> $context
     */
    public static function error(string $channel, string $message, array $context = []): void
    {
        self::write('ERROR', $channel, $message, $context);
    }

    /**
     * @param array<string, mixed> $context
     */
    public static function warning(string $channel, string $message, array $context = []): void
    {
        self::write('WARNING', $channel, $message, $context);
    }

    /**
     * @param array<string, mixed> $context
     */
    private static function write(string $level, string $channel, string $message, array $context): void
    {
        $domainRoot = dirname(__DIR__, 2);
        $logDir = $domainRoot . '/storage/logs';

        if (!is_dir($logDir)) {
            @mkdir($logDir, 0700, true);
        }
        if (!is_dir($logDir) || !is_writable($logDir)) {
            return;
        }

        $contextJson = $context === [] ? '' : json_encode($context, JSON_UNESCAPED_SLASHES);

        $line = sprintf(
            '[%s] %s.%s: %s %s%s',
            date('c'),
            $channel,
            $level,
            self::redact($message),
            self::redact((string) $contextJson),
            PHP_EOL,
        );

        @file_put_contents($logDir . '/app.log', $line, FILE_APPEND | LOCK_EX);
    }

    /**
     * Last-line defense: scrub anything token/key/bearer-shaped before it
     * can be written, in case a caller ever passes a secret by mistake.
     */
    private static function redact(string $value): string
    {
        return preg_replace(
            '/(pat[A-Za-z0-9._-]{6,}|Bearer\s+\S+|key[A-Za-z0-9]{10,})/i',
            '[redacted]',
            $value,
        ) ?? $value;
    }
}

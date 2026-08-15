<?php

declare(strict_types=1);

namespace Fire;

final class Config
{
    /** @var array<string, string> */
    private static array $values = [];

    /**
     * @param array<string, mixed> $env
     */
    public static function init(array $env): void
    {
        foreach ($env as $key => $value) {
            if (is_string($value)) {
                self::$values[$key] = $value;
            }
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        $value = self::$values[$key] ?? null;
        if ($value === null || $value === '') {
            return $default;
        }
        return $value;
    }

    public static function require(string $key): ?string
    {
        $value = self::$values[$key] ?? null;
        return ($value === null || $value === '') ? null : $value;
    }
}

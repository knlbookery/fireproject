<?php

declare(strict_types=1);

namespace Fire;

final class Security
{
    /**
     * Strip CR/LF (and their URL-encoded forms) from a value before it is
     * used in an email header (From/Reply-To/Subject), to prevent header
     * injection via a crafted name/email/subject value.
     */
    public static function headerSafe(string $value): string
    {
        return trim(str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D"], '', $value));
    }

    /**
     * Returns a trimmed string, or null if $value is not a scalar
     * string-able input. Previously a standalone function in
     * server/validation.php, required via a relative path that never
     * resolved correctly in production (that file was never part of any
     * deployment mapping — public-api/*.php only maps to public_html/api/,
     * with nothing accounting for a loose file at server/ root). Moved here
     * so it resolves via the same Composer autoloader as everything else,
     * with no relative-path assumption to get wrong a second time.
     */
    public static function trimmedString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }
        return trim($value);
    }

    /**
     * Resolve the client IP for rate limiting. Cloudflare sets
     * CF-Connecting-IP at its edge; when the origin only accepts traffic
     * from Cloudflare's IP ranges, that header cannot be spoofed by the
     * client. X-Forwarded-For is intentionally never trusted here — it is
     * client-settable unless the whole proxy chain is controlled and
     * stripped/validated, which this deployment does not do.
     */
    public static function clientIp(): string
    {
        $cfIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? null;
        if (is_string($cfIp) && filter_var($cfIp, FILTER_VALIDATE_IP) !== false) {
            return $cfIp;
        }

        $remote = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        return is_string($remote) ? $remote : '0.0.0.0';
    }
}

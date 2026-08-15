<?php

declare(strict_types=1);

/**
 * POST /api/contact.php — Contact form.
 *
 * Supersedes the bridge-phase webhook-forwarding version. Per CLAUDE.md
 * sections 8/11/12/14: writes the submission to Airtable via the Web API
 * (PAT-authenticated) and sends a Brevo SMTP notification, independently;
 * the visitor is told the submission succeeded only if both operations
 * succeed (see ContactService).
 *
 * Response shape is {success: bool, error?: string} on this endpoint,
 * matching rsvp.php's convention — this intentionally differs from the
 * bridge-phase version's {ok:true}/{error} shape (itself inherited from
 * the current live TanStack route). The React contact form only checks
 * response.ok today, so this is not a breaking change for it.
 *
 * Rate limiting (file-based, per-IP, storage/rate-limit — no session
 * dependency), the honeypot field, and the minimum-fill-time check are all
 * enforced server-side here; the same checks already exist client-side in
 * the React form but are trivially bypassed by any request that skips the
 * browser JS and POSTs directly to this endpoint.
 */

require_once __DIR__ . '/bootstrap-loader.php';

use Fire\Config;
use Fire\ContactService;
use Fire\HttpResponse;
use Fire\RateLimiter;
use Fire\Security;

const FIRE_CONTACT_MIN_FILL_SECONDS = 3;

if (!HttpResponse::method('POST')) {
    exit;
}

$rateLimitMax = (int) (Config::get('CONTACT_RATE_LIMIT_MAX', '5'));
$rateLimitWindow = (int) (Config::get('CONTACT_RATE_LIMIT_WINDOW_SECONDS', '900'));

if (!RateLimiter::allow(Security::clientIp(), $rateLimitMax, $rateLimitWindow)) {
    HttpResponse::fail(429, 'Too many requests. Please wait a moment and try again.');
    exit;
}

$raw = file_get_contents('php://input');
$decoded = $raw === false ? null : json_decode($raw, true);

if ($raw === false || json_last_error() !== JSON_ERROR_NONE) {
    HttpResponse::fail(400, 'Invalid inquiry details.');
    exit;
}

$payload = is_array($decoded) ? $decoded : [];

// Honeypot: a bot that fills this hidden field gets a success-shaped
// response (so it has no signal to adapt on) but nothing is stored or sent.
$honeypot = Security::trimmedString($payload['website'] ?? null) ?? '';
if ($honeypot !== '') {
    HttpResponse::success(['message' => 'Thank you. Your message has been received.']);
    exit;
}

// Minimum fill time: reject submissions faster than a human could plausibly
// complete the form. formRenderedAt is an ISO timestamp set client-side when
// the form mounted.
$renderedAtRaw = Security::trimmedString($payload['formRenderedAt'] ?? null);
$renderedAtTs = $renderedAtRaw !== null ? strtotime($renderedAtRaw) : false;
if ($renderedAtTs === false || (time() - $renderedAtTs) < FIRE_CONTACT_MIN_FILL_SECONDS) {
    HttpResponse::fail(429, 'Please take a moment to complete the form and try again.');
    exit;
}

$name = Security::trimmedString($payload['name'] ?? null);
$email = Security::trimmedString($payload['email'] ?? null);
$organization = Security::trimmedString($payload['organization'] ?? null) ?? '';
$message = Security::trimmedString($payload['message'] ?? null);

$valid = $name !== null && mb_strlen($name) >= 2 && mb_strlen($name) <= 120
    && $email !== null && mb_strlen($email) <= 180 && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
    && mb_strlen($organization) <= 160
    && $message !== null && mb_strlen($message) >= 10 && mb_strlen($message) <= 2000;

if (!$valid) {
    HttpResponse::fail(400, 'Invalid inquiry details.');
    exit;
}

$result = ContactService::submit([
    'name' => $name,
    'email' => $email,
    'organization' => $organization,
    'message' => $message,
]);

HttpResponse::json($result['body'], $result['status']);

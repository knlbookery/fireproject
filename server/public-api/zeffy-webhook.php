<?php

declare(strict_types=1);

/**
 * POST /api/zeffy-webhook.php — Zeffy donation callback.
 *
 * Zeffy posts a JSON payload once a gift is created, settles, or is refunded.
 * The payload is authenticated with a shared secret (ZEFFY_WEBHOOK_SECRET),
 * accepted either as an HMAC-SHA256 signature of the raw body in
 * X-Zeffy-Signature, or as the raw secret in X-Zeffy-Token / Authorization:
 * Bearer — whichever the Zeffy dashboard offers for this account.
 *
 * We never receive or store card data: only programme attribution, amount,
 * currency, status and Zeffy's own payment identifier are persisted, so the
 * site can show live funding progress per programme.
 */

require_once __DIR__ . '/bootstrap-loader.php';

use Fire\Config;
use Fire\DonationLedger;
use Fire\HttpResponse;
use Fire\Logger;
use Fire\RateLimiter;
use Fire\Security;

if (!HttpResponse::method('POST')) {
    exit;
}

if (!RateLimiter::allow('zeffy:' . Security::clientIp(), 120, 60)) {
    HttpResponse::fail(429, 'Too many requests');
    exit;
}

$secret = Config::require('ZEFFY_WEBHOOK_SECRET');
if ($secret === null) {
    Logger::error('donations', 'ZEFFY_WEBHOOK_SECRET is not configured');
    HttpResponse::fail(500, 'Webhook not configured');
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '' || strlen($raw) > 100000) {
    HttpResponse::fail(400, 'Invalid payload');
    exit;
}

/** Constant-time verification of either supported auth style. */
$signature = trim((string) ($_SERVER['HTTP_X_ZEFFY_SIGNATURE'] ?? ''));
$token = trim((string) ($_SERVER['HTTP_X_ZEFFY_TOKEN'] ?? ''));
$authorization = trim((string) ($_SERVER['HTTP_AUTHORIZATION'] ?? ''));
if ($token === '' && stripos($authorization, 'bearer ') === 0) {
    $token = trim(substr($authorization, 7));
}

$expected = hash_hmac('sha256', $raw, $secret);
$signature = preg_replace('/^sha256=/i', '', $signature) ?? '';

$authorized = ($signature !== '' && hash_equals($expected, strtolower($signature)))
    || ($token !== '' && hash_equals($secret, $token));

if (!$authorized) {
    Logger::error('donations', 'Rejected Zeffy webhook with invalid credentials');
    HttpResponse::fail(401, 'Unauthorized');
    exit;
}

$payload = json_decode($raw, true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($payload)) {
    HttpResponse::fail(400, 'Invalid payload');
    exit;
}

/** Zeffy nests the gift under `data` on some event types. */
$data = is_array($payload['data'] ?? null) ? $payload['data'] : $payload;

/**
 * First non-empty value among a list of possible keys (Zeffy field naming
 * varies between form types and webhook versions).
 *
 * @param array<string, mixed> $source
 * @param array<int, string> $keys
 */
function fire_zeffy_value(array $source, array $keys): string
{
    foreach ($keys as $key) {
        $value = $source[$key] ?? null;
        if (is_string($value) && trim($value) !== '') {
            return trim($value);
        }
        if (is_int($value) || is_float($value)) {
            return (string) $value;
        }
    }
    return '';
}

$amountRaw = fire_zeffy_value($data, ['amount', 'totalAmount', 'donationAmount', 'netAmount']);
$amount = (float) preg_replace('/[^0-9.]/', '', $amountRaw);

// Zeffy reports some amounts in minor units (cents).
if ($amount > 0 && str_contains(strtolower(fire_zeffy_value($data, ['amountUnit'])), 'cent')) {
    $amount = $amount / 100;
}

$currency = strtoupper(fire_zeffy_value($data, ['currency', 'currencyCode'])) ?: 'USD';

$statusRaw = strtolower(fire_zeffy_value($data, ['status', 'paymentStatus', 'eventType', 'type']));
$status = match (true) {
    str_contains($statusRaw, 'refund') => 'Refunded',
    str_contains($statusRaw, 'fail') || str_contains($statusRaw, 'cancel') => 'Failed',
    default => 'Succeeded',
};

$frequency = str_contains(strtolower(fire_zeffy_value($data, ['frequency', 'recurrence', 'recurringInterval'])), 'month')
    ? 'Monthly'
    : 'One-time';

// Programme attribution: the donate dialog appends utm_campaign=<slug> and
// designation=<title> to the embedded form URL, and Zeffy echoes those back.
$programSlug = strtolower(fire_zeffy_value($data, ['utm_campaign', 'utmCampaign', 'campaign', 'programme', 'program']));
$programSlug = trim(preg_replace('/[^a-z0-9-]+/', '-', $programSlug) ?? '', '-');
if ($programSlug === '') {
    $programSlug = 'general';
}

$programTitle = mb_substr(fire_zeffy_value($data, ['designation', 'campaignName', 'formName', 'programmeName']), 0, 160);
if ($programTitle === '') {
    $programTitle = 'General fund';
}

$donorFirst = fire_zeffy_value($data, ['firstName', 'donorFirstName']);
$donorName = mb_substr(fire_zeffy_value($data, ['donorName', 'fullName']) ?: $donorFirst, 0, 120);

$paymentId = mb_substr(fire_zeffy_value($data, ['id', 'paymentId', 'transactionId', 'donationId']), 0, 120);
$donatedAt = fire_zeffy_value($data, ['createdAt', 'paidAt', 'date']) ?: gmdate('c');

if ($amount <= 0) {
    HttpResponse::fail(400, 'Invalid donation amount');
    exit;
}

$stored = DonationLedger::record([
    'programSlug' => $programSlug,
    'programTitle' => $programTitle,
    'amount' => round($amount, 2),
    'currency' => $currency,
    'status' => $status,
    'frequency' => $frequency,
    'donorName' => $donorName,
    'paymentId' => $paymentId,
    'donatedAt' => $donatedAt,
]);

if (!$stored) {
    // 502 tells Zeffy to retry; the gift itself already succeeded on their side.
    HttpResponse::fail(502, 'Unable to record donation');
    exit;
}

HttpResponse::success(['recorded' => true, 'programme' => $programSlug]);

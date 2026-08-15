<?php

declare(strict_types=1);

/**
 * POST /api/rsvp.php — Event RSVP.
 * Bridge-phase replacement for src/routes/api/rsvp.ts. Airtable table/field
 * names and response shape are preserved exactly.
 *
 * Phone is now required and must be 9-10 digits with no other characters —
 * originally optional and free-form in the TS version. This mirrors the
 * client-side rule in rsvpFormSchema (src/routes/index.tsx); the client
 * strips non-digits as the user types, but that is trivially bypassed by a
 * request that skips the browser JS, so the rule is enforced here too.
 *
 * FUTURE ITERATION: 9-10 digits covers US numbers and Ghanaian numbers in
 * local format only. International numbers (country codes, +, extensions)
 * are deliberately not supported yet — see CLAUDE.md's deferred work.
 */

require_once __DIR__ . '/bootstrap-loader.php';

use Fire\AirtableClient;
use Fire\BrevoMailService;
use Fire\Config;
use Fire\HttpResponse;
use Fire\Security;

if (!HttpResponse::method('POST')) {
    exit;
}

$raw = file_get_contents('php://input');
$decoded = $raw === false ? null : json_decode($raw, true);

// Malformed JSON (parse failure) matches the original TS catch-all path:
// 500 "Unable to submit RSVP" — distinct from a well-formed but
// schema-invalid body, which is 400 "Invalid RSVP details" below.
if ($raw === false || json_last_error() !== JSON_ERROR_NONE) {
    HttpResponse::fail(500, 'Unable to submit RSVP');
    exit;
}

$payload = is_array($decoded) ? $decoded : [];

$eventId = Security::trimmedString($payload['eventId'] ?? null);
$fullName = Security::trimmedString($payload['fullName'] ?? null);
$email = Security::trimmedString($payload['email'] ?? null);
$phone = Security::trimmedString($payload['phone'] ?? null);

// Display-only event details echoed back in the confirmation email. They are
// never written to Airtable (the Event link field is the source of truth) and
// are length-capped before being placed in mail headers/body.
$eventName = mb_substr(Security::trimmedString($payload['eventName'] ?? null) ?? '', 0, 160);
$eventDate = mb_substr(Security::trimmedString($payload['eventDate'] ?? null) ?? '', 0, 120);
$eventTime = mb_substr(Security::trimmedString($payload['eventTime'] ?? null) ?? '', 0, 120);
$eventLocation = mb_substr(Security::trimmedString($payload['eventLocation'] ?? null) ?? '', 0, 200);

$valid = $eventId !== null && $eventId !== '' && mb_strlen($eventId) <= 64
    && $fullName !== null && mb_strlen($fullName) >= 2 && mb_strlen($fullName) <= 120
    && $email !== null && mb_strlen($email) <= 180 && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
    && $phone !== null && preg_match('/^\d{9,10}$/', $phone) === 1;

if (!$valid) {
    HttpResponse::fail(400, 'Invalid RSVP details');
    exit;
}

$baseId = Config::require('AIRTABLE_BASE_ID');
$pat = Config::require('AIRTABLE_PAT');

if ($baseId === null || $pat === null) {
    HttpResponse::fail(500, 'Airtable not configured');
    exit;
}

$client = new AirtableClient($baseId, $pat);
$result = $client->post('Event RSVPs', [
    'records' => [
        [
            'fields' => [
                'Full Name' => $fullName,
                'Email Address' => $email,
                'Phone Number' => $phone,
                'Event' => [$eventId],
            ],
        ],
    ],
]);

// Matches rsvp.ts: a transport failure falls to the generic catch (500),
// an Airtable error status with a valid response is the specific 502 branch.
if ($result['status'] === 0) {
    HttpResponse::fail(500, 'Unable to submit RSVP');
    exit;
}
if ($result['status'] < 200 || $result['status'] >= 300) {
    HttpResponse::fail(502, 'Unable to submit RSVP');
    exit;
}

// Confirmation email to the attendee. Best-effort: the RSVP is already
// recorded, so a mail failure must not turn into an RSVP failure — it is
// logged inside BrevoMailService and reported as emailSent:false.
$emailSent = BrevoMailService::sendRsvpConfirmation([
    'name' => $fullName,
    'email' => $email,
    'phone' => $phone,
    'eventName' => $eventName,
    'eventDate' => $eventDate,
    'eventTime' => $eventTime,
    'eventLocation' => $eventLocation,
    'submittedAt' => gmdate('c'),
]);

HttpResponse::success(['emailSent' => $emailSent]);

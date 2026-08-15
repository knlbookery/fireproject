<?php

declare(strict_types=1);

/**
 * GET /api/events.php — Active events.
 * Bridge-phase replacement for src/routes/api/events.ts. Table name and
 * filter formula preserved exactly (table name is hardcoded to match
 * current behavior — not yet read from an env var).
 *
 * Sort order: editorially controlled via the "Display Order" number field
 * on the Events table (ascending) rather than event date — lets an editor
 * pick which event shows first/second/third regardless of date. Events
 * without a Display Order value sort after ones that have it (Airtable
 * places blanks last in an ascending sort).
 *
 * Links: up to 3 editor-supplied URLs per event ("Event Link 1", "Event
 * Link 2", "Event Link 3" — Airtable URL fields, no separate label field),
 * rendered at the bottom of the event detail popup with the URL itself as
 * the link text. Only http(s) URLs are passed through, since these become
 * real anchor hrefs client-side.
 */

require_once __DIR__ . '/bootstrap-loader.php';

use Fire\AirtableClient;
use Fire\Config;
use Fire\HttpResponse;

if (!HttpResponse::method('GET')) {
    exit;
}

$baseId = Config::require('AIRTABLE_BASE_ID');
$pat = Config::require('AIRTABLE_PAT');

if ($baseId === null || $pat === null) {
    HttpResponse::fail(500, 'Airtable not configured', ['events' => []]);
    exit;
}

$client = new AirtableClient($baseId, $pat);
$result = $client->get('Events', [
    'filterByFormula' => "{Status}='Active'",
    'sort[0][field]' => 'Display Order',
    'sort[0][direction]' => 'asc',
]);

// Matches events.ts: a transport failure or undecodable response falls to
// the generic catch (500 "Unable to load events"); an Airtable error status
// with a valid response is the specific 502 "Failed to fetch events" branch.
if ($result['status'] === 0) {
    HttpResponse::fail(500, 'Unable to load events', ['events' => []]);
    exit;
}
if ($result['status'] < 200 || $result['status'] >= 300) {
    HttpResponse::fail(502, 'Failed to fetch events', ['events' => []]);
    exit;
}
if ($result['body'] === null) {
    HttpResponse::fail(500, 'Unable to load events', ['events' => []]);
    exit;
}

/**
 * @param array<string, mixed> $f
 * @return array<int, array{label: string, url: string}>
 */
function fire_event_links(array $f): array
{
    $links = [];
    for ($i = 1; $i <= 3; $i++) {
        $url = trim((string) ($f["Event Link {$i}"] ?? ''));
        if ($url === '' || !preg_match('#^https?://#i', $url)) {
            continue;
        }
        $links[] = ['label' => $url, 'url' => $url];
    }
    return $links;
}

$records = $result['body']['records'] ?? [];
$events = [];

foreach ($records as $record) {
    $f = $record['fields'] ?? [];
    $events[] = [
        'id' => $record['id'] ?? '',
        'name' => $f['Event name/title'] ?? '',
        'date' => $f['Event date(s)'] ?? '',
        'time' => $f['Event time'] ?? '',
        'location' => $f['Event location'] ?? '',
        'description' => $f['Event description'] ?? '',
        'photo' => $f['Event Photo'][0]['url'] ?? '',
        'links' => fire_event_links($f),
    ];
}

header('Cache-Control: public, max-age=60, s-maxage=60');
HttpResponse::success(['events' => $events]);

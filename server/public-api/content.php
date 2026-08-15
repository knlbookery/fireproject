<?php

declare(strict_types=1);

/**
 * GET /api/content.php — Hero Slides.
 * Bridge-phase replacement for src/routes/api/content.ts. Response shape,
 * field mapping, sort order, and default table name are preserved exactly.
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
    HttpResponse::fail(500, 'Airtable not configured');
    exit;
}

$heroTable = Config::get('AIRTABLE_TABLE_HERO', 'Hero Slides');

$client = new AirtableClient($baseId, $pat);
$result = $client->get($heroTable, [
    'sort[0][field]' => 'Order',
    'sort[0][direction]' => 'asc',
]);

// Matches content.ts: a transport failure or undecodable response falls to
// the generic catch (500 "Unable to load..."); an Airtable error status with
// a valid response is the specific 502 "Failed to fetch..." branch.
if ($result['status'] === 0) {
    HttpResponse::fail(500, 'Unable to load landing configurations');
    exit;
}
if ($result['status'] < 200 || $result['status'] >= 300) {
    HttpResponse::fail(502, 'Failed to fetch content from Airtable panels');
    exit;
}
if ($result['body'] === null) {
    HttpResponse::fail(500, 'Unable to load landing configurations');
    exit;
}

$records = $result['body']['records'] ?? [];
$heroSlides = [];

foreach ($records as $record) {
    $f = $record['fields'] ?? [];
    $cta = [];

    if (!empty($f['CTA Label']) && !empty($f['CTA Href'])) {
        $cta[] = [
            'label' => $f['CTA Label'],
            'href' => $f['CTA Href'],
            'primary' => $f['CTA Primary'] ?? true,
        ];
    }
    if (!empty($f['Secondary CTA Label']) && !empty($f['Secondary CTA Href'])) {
        $cta[] = [
            'label' => $f['Secondary CTA Label'],
            'href' => $f['Secondary CTA Href'],
        ];
    }

    $heroSlides[] = [
        'eyebrow' => $f['Eyebrow'] ?? '',
        'title' => $f['Title'] ?? '',
        'subtitle' => $f['Subtitle'] ?? '',
        'image' => $f['Image'][0]['url'] ?? '',
        'alt' => $f['Alt'] ?? ($f['Title'] ?? ''),
        'cta' => $cta,
    ];
}

header('Cache-Control: public, max-age=10, s-maxage=10');
HttpResponse::success(['heroSlides' => $heroSlides]);

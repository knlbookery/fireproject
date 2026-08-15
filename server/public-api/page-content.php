<?php

declare(strict_types=1);

/**
 * GET /api/page-content.php?route=/about — editable page copy.
 *
 * Airtable table: "Page Content" (override with AIRTABLE_TABLE_PAGE_CONTENT).
 * Fields: Route (e.g. "/about"), Section Key (e.g. "hero"), Eyebrow, Title,
 *         Intro, Body, Image (attachment), Status.
 * Only rows with Status = "Active" are exposed. The frontend merges these
 * over its hardcoded copy, so missing rows simply leave the page unchanged.
 */

require_once __DIR__ . '/bootstrap-loader.php';

use Fire\AirtableClient;
use Fire\Config;
use Fire\HttpResponse;

if (!HttpResponse::method('GET')) {
    exit;
}

$route = isset($_GET['route']) ? trim((string) $_GET['route']) : '/';
if ($route === '') {
    $route = '/';
}

// Route is interpolated into an Airtable formula — allow only safe path chars.
if (preg_match('#^/[a-z0-9\-/]*$#i', $route) !== 1 || strlen($route) > 120) {
    HttpResponse::fail(400, 'Invalid route', ['sections' => new stdClass()]);
    exit;
}

$baseId = Config::require('AIRTABLE_BASE_ID');
$pat = Config::require('AIRTABLE_PAT');

if ($baseId === null || $pat === null) {
    HttpResponse::success(['sections' => new stdClass()]);
    exit;
}

$table = Config::get('AIRTABLE_TABLE_PAGE_CONTENT', 'Page Content') ?? 'Page Content';

$client = new AirtableClient($baseId, $pat);
$result = $client->get($table, [
    'filterByFormula' => "AND({Status}='Active',{Route}='" . str_replace("'", "\\'", $route) . "')",
]);

// Page copy is presentation-only: any failure degrades to the frontend's
// hardcoded fallback rather than an error state.
if ($result['status'] < 200 || $result['status'] >= 300 || $result['body'] === null) {
    HttpResponse::success(['sections' => new stdClass()]);
    exit;
}

$sections = [];
foreach ($result['body']['records'] ?? [] as $record) {
    $f = $record['fields'] ?? [];
    $key = trim((string) ($f['Section Key'] ?? ''));
    if ($key === '') {
        continue;
    }

    $section = [];
    foreach (['Eyebrow' => 'eyebrow', 'Title' => 'title', 'Intro' => 'intro', 'Body' => 'body'] as $field => $prop) {
        $value = trim((string) ($f[$field] ?? ''));
        if ($value !== '') {
            $section[$prop] = $value;
        }
    }
    $image = (string) ($f['Image'][0]['url'] ?? '');
    if ($image !== '') {
        $section['image'] = $image;
    }

    if ($section !== []) {
        $sections[$key] = $section;
    }
}

header('Cache-Control: public, max-age=60, s-maxage=60');
HttpResponse::success(['sections' => $sections === [] ? new stdClass() : $sections]);

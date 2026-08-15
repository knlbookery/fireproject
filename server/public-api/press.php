<?php

declare(strict_types=1);

/**
 * GET /api/press.php            — published press articles (newest first)
 * GET /api/press.php?slug=xyz   — a single published article
 *
 * Airtable table: "Press Articles" (override with AIRTABLE_TABLE_PRESS).
 * Fields: Title, Slug, Date, Excerpt, Cover Photo, Body, Status,
 *         optional Author and Category.
 * Only rows with Status = "Published" are exposed.
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
    HttpResponse::fail(500, 'Airtable not configured', ['articles' => []]);
    exit;
}

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
if ($slug !== '' && preg_match('/^[a-z0-9][a-z0-9\-]{0,120}$/i', $slug) !== 1) {
    HttpResponse::fail(400, 'Invalid slug', ['articles' => []]);
    exit;
}

$table = Config::get('AIRTABLE_TABLE_PRESS', 'Press Articles');

$formula = "{Status}='Published'";
if ($slug !== '') {
    // Airtable formula string escaping: double any single quote.
    $escaped = str_replace("'", "\\'", $slug);
    $formula = "AND({Status}='Published',{Slug}='{$escaped}')";
}

$client = new AirtableClient($baseId, $pat);
$result = $client->get($table ?? 'Press Articles', [
    'filterByFormula' => $formula,
    'sort[0][field]' => 'Date',
    'sort[0][direction]' => 'desc',
]);

if ($result['status'] === 0 || $result['body'] === null) {
    HttpResponse::fail(500, 'Unable to load press articles', ['articles' => []]);
    exit;
}
if ($result['status'] < 200 || $result['status'] >= 300) {
    HttpResponse::fail(502, 'Failed to fetch press articles', ['articles' => []]);
    exit;
}

/**
 * @param array<string, mixed> $record
 * @return array<string, mixed>
 */
function fire_press_article(array $record): array
{
    $f = $record['fields'] ?? [];
    $title = trim((string) ($f['Title'] ?? ''));
    $date = trim((string) ($f['Date'] ?? ''));
    $slug = trim((string) ($f['Slug'] ?? ''));

    if ($slug === '' && $title !== '') {
        $slug = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($title)) ?? '', '-');
    }

    $displayDate = '';
    if ($date !== '') {
        $ts = strtotime($date);
        $displayDate = $ts === false ? $date : gmdate('F j, Y', $ts);
    }

    return [
        'id' => (string) ($record['id'] ?? ''),
        'slug' => $slug,
        'title' => $title,
        'date' => $date,
        'displayDate' => $displayDate,
        'excerpt' => trim((string) ($f['Excerpt'] ?? '')),
        'body' => (string) ($f['Body'] ?? ''),
        'image' => (string) ($f['Cover Photo'][0]['url'] ?? ''),
        'author' => trim((string) ($f['Author'] ?? '')),
        'category' => trim((string) ($f['Category'] ?? '')),
    ];
}

$records = $result['body']['records'] ?? [];
$articles = [];
foreach ($records as $record) {
    $article = fire_press_article($record);
    if ($article['slug'] === '' || $article['title'] === '') {
        continue;
    }
    $articles[] = $article;
}

header('Cache-Control: public, max-age=300, s-maxage=300');

if ($slug !== '') {
    if ($articles === []) {
        HttpResponse::fail(404, 'Article not found');
        exit;
    }
    HttpResponse::success(['article' => $articles[0]]);
    exit;
}

HttpResponse::success(['articles' => $articles]);

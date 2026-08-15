<?php

declare(strict_types=1);

/**
 * POST /api/page-summary.php — spoken page narration script.
 *
 * Returns a short, speech-friendly script describing what the requested page
 * is about and what the visitor is expected to do on it. The browser speaks
 * it with the Web Speech API; no audio is generated or stored server-side.
 */

require_once __DIR__ . '/bootstrap-loader.php';

use Fire\HttpResponse;
use Fire\PageSummaryService;
use Fire\RateLimiter;
use Fire\Security;

if (!HttpResponse::method('POST')) {
    exit;
}

if (!RateLimiter::allow('page-summary:' . Security::clientIp(), 40, 900)) {
    HttpResponse::fail(429, 'Too many narration requests. Please wait a moment.');
    exit;
}

$raw = file_get_contents('php://input');
$decoded = $raw === false ? null : json_decode($raw, true);

$route = is_array($decoded) ? (Security::trimmedString($decoded['route'] ?? null) ?? '/') : '/';
if (mb_strlen($route) > 120 || !preg_match('#^/[\w\-/\.]*$#', $route)) {
    $route = '/';
}

$result = PageSummaryService::summarise($route);
HttpResponse::json($result['body'], $result['status']);

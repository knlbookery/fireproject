<?php

declare(strict_types=1);

/**
 * POST /api/assistant.php — Visitor assistant.
 *
 * Thin entry point: validates and rate-limits the request, then hands the
 * conversation to Fire\AssistantService. No credentials or provider details
 * are ever exposed to the browser; errors are generic.
 */

require_once __DIR__ . '/bootstrap-loader.php';

use Fire\AssistantService as Assistant;

use Fire\HttpResponse;
use Fire\RateLimiter;
use Fire\Security;

if (!HttpResponse::method('POST')) {
    exit;
}

if (!RateLimiter::allow('assistant:' . Security::clientIp(), 30, 900)) {
    HttpResponse::fail(429, 'Too many questions in a short time. Please wait a moment.');
    exit;
}

$raw = file_get_contents('php://input');
$decoded = $raw === false ? null : json_decode($raw, true);

if (!is_array($decoded) || !isset($decoded['messages']) || !is_array($decoded['messages'])) {
    HttpResponse::fail(400, 'Invalid request.');
    exit;
}

$route = Security::trimmedString($decoded['route'] ?? null) ?? '/';
if (mb_strlen($route) > 120 || !preg_match('#^/[\w\-/\.]*$#', $route)) {
    $route = '/';
}

$messages = [];
foreach (array_slice($decoded['messages'], -12) as $item) {
    if (!is_array($item)) {
        continue;
    }
    $role = Security::trimmedString($item['role'] ?? null);
    $content = Security::trimmedString($item['content'] ?? null);
    if (($role !== 'user' && $role !== 'assistant') || $content === null || $content === '') {
        continue;
    }
    $messages[] = ['role' => $role, 'content' => mb_substr($content, 0, 1200)];
}

if ($messages === []) {
    HttpResponse::fail(400, 'Invalid request.');
    exit;
}

$result = Assistant::answer($messages, $route);
HttpResponse::json($result['body'], $result['status']);

<?php

declare(strict_types=1);

/**
 * GET /api/health.php — minimal liveness check.
 *
 * Deliberately does not load bootstrap.php / private/.env or contact
 * Airtable/Brevo — per CLAUDE.md section 18, this must not depend on those
 * being correctly configured, must not run on every request against a live
 * provider, and must never leak paths, versions, or config in its response
 * (including in the method-not-allowed case, which is why this doesn't use
 * the shared HttpResponse/Config helpers that assume bootstrap already ran).
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    header('Allow: GET');
    echo json_encode(['status' => 'error']);
    exit;
}

http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['status' => 'ok']);

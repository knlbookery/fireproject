<?php

declare(strict_types=1);

/**
 * Shared entry-point loader for server/public-api/*.php.
 *
 * Production deployment nests public-api files two levels below the domain
 * root (public_html/api/*.php -> app/bootstrap.php via dirname(__DIR__, 2)),
 * per CLAUDE.md section 6. In this repository, server/public-api/*.php sits
 * only one level above server/app/bootstrap.php. Both fixed, known-safe
 * candidates are checked so the same file works unmodified before and after
 * deployment — no user input is involved in either path.
 */

$candidates = [
    dirname(__DIR__, 2) . '/app/bootstrap.php', // deployed: public_html/api -> domain root -> app/
    dirname(__DIR__, 1) . '/app/bootstrap.php', // repo dev: server/public-api -> server -> app/
];

$bootstrapPath = null;
foreach ($candidates as $candidate) {
    if (is_file($candidate)) {
        $bootstrapPath = $candidate;
        break;
    }
}

if ($bootstrapPath === null) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Server configuration error.']);
    exit;
}

require $bootstrapPath;

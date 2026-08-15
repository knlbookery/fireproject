<?php

declare(strict_types=1);

/**
 * Backend bootstrap. Deploys to: app/bootstrap.php (sibling of public_html).
 * Production default env path: dirname(__DIR__) . '/private/.env'.
 * Local development MUST set FIRE_ENV_FILE (see .private/.env.example) — the
 * production default does not resolve to a useful path inside the repo tree.
 */

// composer.json lives at server/app/composer.json (a sibling of src/),
// matching production's app/composer.json + app/src/ exactly, so vendor/
// should land inside app/ in both environments. The second candidate exists
// only for a stale local vendor/ built before composer.json moved here from
// server/composer.json — both are known-safe, fixed paths, so checking both
// costs nothing.
$autoloadCandidates = [
    __DIR__ . '/vendor/autoload.php',    // current: vendor/ inside app/
    __DIR__ . '/../vendor/autoload.php', // stale pre-move local vendor/
];
$autoloadPath = null;
foreach ($autoloadCandidates as $candidate) {
    if (is_file($candidate)) {
        $autoloadPath = $candidate;
        break;
    }
}
if ($autoloadPath === null) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Server configuration error.']);
    exit;
}
require $autoloadPath;

use Dotenv\Dotenv;
use Fire\Config;
use Fire\HttpResponse;
use Fire\Logger;

$domainRoot = dirname(__DIR__);

$overrideEnvFile = $_SERVER['FIRE_ENV_FILE'] ?? $_ENV['FIRE_ENV_FILE'] ?? getenv('FIRE_ENV_FILE') ?: null;
$envFile = $overrideEnvFile ?: ($domainRoot . '/private/.env');

$envDir = dirname($envFile);
$envName = basename($envFile);

if (!is_file($envFile) || !is_readable($envFile)) {
    Logger::error('bootstrap', 'Environment file missing or unreadable', ['env_dir' => $envDir]);
    HttpResponse::fail(500, 'Server configuration error.');
    exit;
}

try {
    $dotenv = Dotenv::createImmutable($envDir, $envName);
    $dotenv->load();
} catch (\Throwable $e) {
    Logger::error('bootstrap', 'Failed to load environment file', ['message' => $e->getMessage()]);
    HttpResponse::fail(500, 'Server configuration error.');
    exit;
}

Config::init($_ENV);

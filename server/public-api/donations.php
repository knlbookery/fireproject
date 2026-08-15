<?php

declare(strict_types=1);

/**
 * GET /api/donations.php — Live per-programme donation totals.
 *
 * Aggregated from the Airtable "Donations" table, which is populated by the
 * Zeffy webhook (zeffy-webhook.php). No donor-identifying data is returned —
 * only programme slug, amount raised, supporter count and last gift date, so
 * the website can show funding progress in the relevant programme sections.
 */

require_once __DIR__ . '/bootstrap-loader.php';

use Fire\DonationLedger;
use Fire\HttpResponse;

if (!HttpResponse::method('GET')) {
    exit;
}

$summary = DonationLedger::summary();

$programmes = [];
foreach ($summary as $slug => $entry) {
    $programmes[] = [
        'slug' => $slug,
        'raised' => $entry['raised'],
        'supporters' => $entry['supporters'],
        'currency' => $entry['currency'],
        'lastGiftAt' => $entry['lastGiftAt'],
    ];
}

header('Cache-Control: public, max-age=120, s-maxage=120');
HttpResponse::success(['programmes' => $programmes]);

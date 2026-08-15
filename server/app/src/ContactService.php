<?php

declare(strict_types=1);

namespace Fire;

/**
 * Orchestrates the contact-form write path: Airtable Web API record write
 * (PAT-authenticated) and a Brevo SMTP notification, run independently.
 *
 * Per CLAUDE.md sections 8 and 14: the visitor is told the submission
 * succeeded only when BOTH operations succeed. If only one succeeds, that
 * result is preserved and logged, but the visitor receives a generic
 * temporary-processing error — no indication of which side failed.
 */
final class ContactService
{
    private const SOURCE_LABEL = 'F.I.R.E. Website Contact Form';
    private const GENERIC_ERROR = 'We could not submit your message at this time. Please try again shortly.';

    /**
     * @param array{name: string, email: string, organization: string, message: string} $data
     * @return array{status: int, body: array<string, mixed>}
     */
    public static function submit(array $data): array
    {
        $submission = [
            'id' => self::submissionId(),
            'name' => $data['name'],
            'email' => $data['email'],
            'organization' => $data['organization'],
            'message' => $data['message'],
            'submittedAt' => gmdate('c'),
        ];

        $emailSent = BrevoMailService::send($submission);
        $airtableStored = self::storeInAirtable($submission, $emailSent);

        if ($emailSent && $airtableStored) {
            return [
                'status' => 200,
                'body' => [
                    'success' => true,
                    'message' => 'Thank you. Your message has been received, and a member of the F.I.R.E. team will follow up with you.',
                ],
            ];
        }

        // Per CLAUDE.md 8.27/8.28: whichever side succeeded is preserved and
        // already logged above; the visitor gets a generic error either way.
        return [
            'status' => 502,
            'body' => ['success' => false, 'error' => self::GENERIC_ERROR],
        ];
    }

    /**
     * @param array{id: string, name: string, email: string, organization: string, message: string, submittedAt: string} $submission
     */
    private static function storeInAirtable(array $submission, bool $emailSent): bool
    {
        $baseId = Config::require('AIRTABLE_BASE_ID');
        $pat = Config::require('AIRTABLE_PAT');
        $table = Config::get('AIRTABLE_TABLE_CONTACTS', 'Contact Form');

        if ($baseId === null || $pat === null) {
            Logger::error('contact', 'Airtable not configured', ['id' => $submission['id']]);
            return false;
        }

        $client = new AirtableClient($baseId, $pat);
        $result = $client->post($table, [
            'typecast' => true,
            'records' => [
                [
                    'fields' => [
                        'Submission ID' => $submission['id'],
                        'Full Name' => $submission['name'],
                        'Email' => $submission['email'],
                        'Organization' => $submission['organization'],
                        'Message' => $submission['message'],
                        'Submitted At' => $submission['submittedAt'],
                        'Source' => self::SOURCE_LABEL,
                        'Email Status' => $emailSent ? 'Sent' : 'Failed',
                    ],
                ],
            ],
        ]);

        if ($result['status'] === 0) {
            Logger::error('contact', 'Airtable transport failure', ['id' => $submission['id']]);
            return false;
        }

        if ($result['status'] < 200 || $result['status'] >= 300) {
            Logger::error('contact', 'Airtable write failed', [
                'id' => $submission['id'],
                'status' => $result['status'],
                'category' => AirtableClient::categorizeStatus($result['status']),
            ]);
            return false;
        }

        if (!is_array($result['body']) || empty($result['body']['records'])) {
            Logger::error('contact', 'Airtable malformed response', ['id' => $submission['id']]);
            return false;
        }

        return true;
    }

    private static function submissionId(): string
    {
        return 'FIRE-' . gmdate('Ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));
    }
}

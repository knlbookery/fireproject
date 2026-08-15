<?php

declare(strict_types=1);

namespace Fire;

use PHPMailer\PHPMailer\Exception as PHPMailerException;
use PHPMailer\PHPMailer\PHPMailer;

final class BrevoMailService
{
    private const SOURCE_LABEL = 'F.I.R.E. Website Contact Form';

    /**
     * @param array{id: string, name: string, email: string, organization: string, message: string, submittedAt: string} $submission
     */
    public static function send(array $submission): bool
    {
        $host = Config::require('BREVO_SMTP_HOST');
        $port = Config::require('BREVO_SMTP_PORT');
        $encryption = Config::get('BREVO_SMTP_ENCRYPTION', 'tls');
        $username = Config::require('BREVO_SMTP_USERNAME');
        $password = Config::require('BREVO_SMTP_PASSWORD');
        $fromAddress = Config::require('MAIL_FROM_ADDRESS');
        $fromName = Config::get('MAIL_FROM_NAME', 'F.I.R.E. Website');
        $toAddress = Config::require('MAIL_TO_ADDRESS');

        if ($host === null || $port === null || $username === null || $password === null
            || $fromAddress === null || $toAddress === null) {
            Logger::error('brevo', 'SMTP not configured (missing required setting)');
            return false;
        }

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = $host;
            $mail->SMTPAuth = true;
            $mail->Username = $username;
            $mail->Password = $password;
            $mail->Port = (int) $port;
            $mail->CharSet = 'UTF-8';
            $mail->Timeout = 10;

            $enc = strtolower($encryption ?? 'tls');
            if ($enc === 'ssl') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($enc === 'tls') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            } else {
                $mail->SMTPSecure = false;
                $mail->SMTPAutoTLS = false;
            }

            // Organization-controlled sender and recipient — never the visitor.
            $mail->setFrom(Security::headerSafe($fromAddress), Security::headerSafe($fromName));
            $mail->addAddress(Security::headerSafe($toAddress));
            // Visitor goes in Reply-To only — never From or the recipient.
            $mail->addReplyTo(Security::headerSafe($submission['email']), Security::headerSafe($submission['name']));

            $mail->Subject = Security::headerSafe('New F.I.R.E. Website Contact — ' . $submission['name']);

            $org = $submission['organization'] !== '' ? $submission['organization'] : 'Not provided';

            $mail->isHTML(true);
            $mail->Body = self::htmlBody($submission, $org);
            $mail->AltBody = self::plainBody($submission, $org);

            $mail->send();
            return true;
        } catch (PHPMailerException | \Throwable $e) {
            // Logger::redact() strips anything token/key/bearer-shaped, so
            // the PHPMailer/SMTP error text is safe to include here — it's
            // needed to diagnose connection/auth/config failures.
            Logger::error('brevo', 'Send failed', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * @param array{id: string, name: string, email: string, organization: string, message: string, submittedAt: string} $submission
     */
    private static function plainBody(array $submission, string $org): string
    {
        return "A new contact message was submitted through the F.I.R.E. website.\n\n"
            . "Submission ID:\n{$submission['id']}\n\n"
            . "Submitted At:\n{$submission['submittedAt']}\n\n"
            . "Full Name:\n{$submission['name']}\n\n"
            . "Email:\n{$submission['email']}\n\n"
            . "Organization:\n{$org}\n\n"
            . "Message:\n{$submission['message']}\n\n"
            . "Source:\n" . self::SOURCE_LABEL . "\n";
    }

    /**
     * @param array{id: string, name: string, email: string, organization: string, message: string, submittedAt: string} $submission
     */
    private static function htmlBody(array $submission, string $org): string
    {
        $e = static fn (string $v): string => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        return '<div style="font-family:Arial,Helvetica,sans-serif;color:#14213d;line-height:1.6">'
            . '<p>A new contact message was submitted through the F.I.R.E. website.</p>'
            . '<table cellpadding="6" style="border-collapse:collapse">'
            . '<tr><td><strong>Submission ID</strong></td><td>' . $e($submission['id']) . '</td></tr>'
            . '<tr><td><strong>Submitted At</strong></td><td>' . $e($submission['submittedAt']) . '</td></tr>'
            . '<tr><td><strong>Full Name</strong></td><td>' . $e($submission['name']) . '</td></tr>'
            . '<tr><td><strong>Email</strong></td><td>' . $e($submission['email']) . '</td></tr>'
            . '<tr><td><strong>Organization</strong></td><td>' . $e($org) . '</td></tr>'
            . '<tr><td valign="top"><strong>Message</strong></td><td>' . nl2br($e($submission['message'])) . '</td></tr>'
            . '<tr><td><strong>Source</strong></td><td>' . $e(self::SOURCE_LABEL) . '</td></tr>'
            . '</table></div>';
    }
}

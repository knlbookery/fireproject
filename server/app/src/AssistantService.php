<?php

declare(strict_types=1);

namespace Fire;

/**
 * Visitor assistant.
 *
 * Answers basic questions about F.I.R.E. from a fixed, curated knowledge
 * summary. The model call goes out server-side only (LOVABLE_API_KEY never
 * reaches the browser) through the Lovable AI Gateway chat-completions
 * endpoint. If the key is absent or the gateway fails, the service degrades
 * to a keyword-matched answer from the same knowledge base so the widget
 * always responds with something useful — matching the site-wide rule that
 * every remote dependency must degrade gracefully.
 */
final class AssistantService
{
    private const GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
    private const MODEL = 'google/gemini-2.5-flash';

    private const KNOWLEDGE = <<<'TXT'
F.I.R.E. (Free Inspiration Reaching Everyone) is a 501(c)(3) nonprofit empowering
communities through education, technology, entrepreneurship, sports and youth
development in Ghana and the United States.

Locations: Philadelphia, Pennsylvania (USA) and Accra, Greater Accra (Ghana).
Contact: info@freeinspiration.org.

Pages on the website and what they cover:
- / (home): overview of the mission, programmes, impact and upcoming events.
- /about: who F.I.R.E. is and how the organisation works.
- /mission: why the organisation exists, its values.
- /impact: outcome numbers and reporting per programme.
- /leadership: organisation leaders, bios and governance; each leader has a
  detail page at /leadership/<name>.
- /programs: the three primary pillars — Sports, Entrepreneurship and Community
  Development — plus technology and education services.
- /ghana-initiatives and /us-initiatives: regional programme work.
- /events: upcoming events with search, location filters and RSVP.
- /press: news and articles, searchable by topic.
- /partners: partner directory, how partners support F.I.R.E. and how to become one.
- /sponsors: corporate sponsorship tiers and benefits.
- /volunteer: volunteer roles (coach, mentor, event crew, skills volunteer) and sign-up.
- /donate: secure donation form (processed by Zeffy).
- /contact: contact form for any other question.
- /privacy-policy and /terms-of-use: legal information.

How to take action:
- Donate: /donate
- Volunteer: /volunteer
- Partner or sponsor: /partners or /sponsors
- RSVP to an event: /events
- Anything else: /contact or info@freeinspiration.org
TXT;

    /**
     * @param list<array{role: string, content: string}> $messages
     * @return array{status: int, body: array<string, mixed>}
     */
    public static function answer(array $messages, string $route = '/'): array
    {
        $question = '';
        for ($i = count($messages) - 1; $i >= 0; $i--) {
            if ($messages[$i]['role'] === 'user') {
                $question = $messages[$i]['content'];
                break;
            }
        }

        $live = AssistantKnowledge::summary();

        $apiKey = Config::require('LOVABLE_API_KEY');
        if ($apiKey === null) {
            return self::ok(self::fallbackAnswer($question, $live), true);
        }

        $payload = [
            'model' => self::MODEL,
            'messages' => array_merge(
                [['role' => 'system', 'content' => self::systemPrompt($route, $live)]],
                $messages,
            ),
        ];


        $ch = curl_init(self::GATEWAY_URL);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Lovable-API-Key: ' . $apiKey,
                'X-Lovable-AIG-SDK: fetch',
            ],
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES),
            CURLOPT_TIMEOUT => 120,
        ]);

        $raw = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status === 429) {
            return ['status' => 429, 'body' => [
                'success' => false,
                'error' => 'The assistant is busy right now. Please try again in a moment.',
            ]];
        }

        if ($raw === false || $status < 200 || $status >= 300) {
            Logger::warning('assistant', 'gateway request failed', ['status' => $status]);
            return self::ok(self::fallbackAnswer($question), true);
        }

        $decoded = json_decode((string) $raw, true);
        $reply = is_array($decoded)
            ? ($decoded['choices'][0]['message']['content'] ?? null)
            : null;

        if (!is_string($reply) || trim($reply) === '') {
            return self::ok(self::fallbackAnswer($question), true);
        }

        return self::ok(trim($reply), false);
    }

    /**
     * @return array{status: int, body: array<string, mixed>}
     */
    private static function ok(string $reply, bool $offline): array
    {
        return ['status' => 200, 'body' => [
            'success' => true,
            'reply' => $reply,
            'offline' => $offline,
        ]];
    }

    private static function systemPrompt(string $route): string
    {
        return "You are the F.I.R.E. website assistant, helping visitors on the page {$route}.\n"
            . "Answer only from the knowledge below. If something is not covered (donation totals, "
            . "personal data, legal or financial advice), say you do not have that detail and point the "
            . "visitor to /contact or info@freeinspiration.org.\n"
            . "Be warm, concise and factual: two to four short sentences, plain text (no markdown), and "
            . "mention the relevant page path when it helps.\n\nKNOWLEDGE:\n" . self::KNOWLEDGE;
    }

    private static function fallbackAnswer(string $question): string
    {
        $q = mb_strtolower($question);
        $map = [
            'donat' => 'You can give securely on our donation page at /donate — one-time or monthly.',
            'give' => 'You can give securely on our donation page at /donate — one-time or monthly.',
            'volunteer' => 'We welcome coaches, mentors, event crew and skills volunteers. Roles and the sign-up form are on /volunteer.',
            'partner' => 'Our partners and the four ways to work with us are on /partners; corporate tiers are on /sponsors.',
            'sponsor' => 'Sponsorship tiers and benefits are on /sponsors, and you can request a sponsorship pack there.',
            'event' => 'Upcoming events, with search, location filters and RSVP, are listed on /events.',
            'rsvp' => 'You can RSVP to any upcoming event on /events and you will receive a confirmation email.',
            'program' => 'Our three pillars are Sports, Entrepreneurship and Community Development, with technology and education alongside them — see /programs.',
            'ghana' => 'Our Ghana work is based in Accra; details are on /ghana-initiatives.',
            'philadelphia' => 'Our U.S. work is based in Philadelphia; details are on /us-initiatives.',
            'impact' => 'Our outcome numbers and programme reporting are on /impact.',
            'leader' => 'You can meet the organisation leaders, with bios and governance information, on /leadership.',
            'team' => 'You can meet the organisation leaders, with bios and governance information, on /leadership.',
            'press' => 'News and articles are on /press, searchable by topic.',
            'contact' => 'You can reach us through the form on /contact or by email at info@freeinspiration.org.',
            'email' => 'You can reach us at info@freeinspiration.org, or use the form on /contact.',
            'who' => 'F.I.R.E. (Free Inspiration Reaching Everyone) is a nonprofit empowering communities through education, technology, entrepreneurship, sports and youth development in Ghana and the United States. More on /about.',
            'mission' => 'Our mission and values are set out on /mission.',
        ];

        foreach ($map as $needle => $answer) {
            if ($q !== '' && str_contains($q, $needle)) {
                return $answer;
            }
        }

        return 'F.I.R.E. empowers communities through education, technology, entrepreneurship, sports '
            . 'and youth development in Ghana and the United States. Try /about, /programs or /events — '
            . 'and for anything specific, /contact reaches the team directly.';
    }
}

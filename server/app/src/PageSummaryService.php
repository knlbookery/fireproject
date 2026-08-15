<?php

declare(strict_types=1);

namespace Fire;

/**
 * Spoken page summaries for the "listen to this page" narrator.
 *
 * Produces a short, speech-friendly script for a given route: what the page
 * is about, and what the visitor is expected to do on it. The model call goes
 * out server-side through the Lovable AI Gateway (LOVABLE_API_KEY never
 * reaches the browser) and is enriched with the same live Airtable briefing
 * the assistant uses. Scripts are cached on disk per route so repeat visits
 * cost nothing, and every failure path degrades to a curated static script —
 * the narrator always has something to say.
 */
final class PageSummaryService
{
    private const GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
    private const MODEL = 'google/gemini-2.5-flash';
    private const CACHE_TTL = 21600; // 6 hours

    /** @var array<string, array{0: string, 1: string}> route => [about, action] */
    private const PAGES = [
        '/' => [
            'This is the F.I.R.E. home page. F.I.R.E. — Free Inspiration Reaching Everyone — is a nonprofit empowering communities through education, technology, entrepreneurship, sports and youth development in Ghana and the United States. The page walks you through our mission, our programme pillars, the impact we have measured and what is coming up next.',
            'Scroll through the sections, then choose a path: explore our programmes, see upcoming events, or give on the donate page.',
        ],
        '/about' => [
            'This page introduces who F.I.R.E. is: our story, how the organisation is run, and the communities we serve in Philadelphia and Accra.',
            'Read through, then meet the people behind the work on the leadership page or reach out through contact.',
        ],
        '/mission' => [
            'This page sets out why F.I.R.E. exists — our mission, our values and the change we are working towards.',
            'If the mission resonates, the next step is to volunteer, partner with us, or support the work with a gift.',
        ],
        '/impact' => [
            'This page reports our outcomes: the numbers behind each programme and how we measure the difference we make.',
            'Review the figures, then consider funding a specific programme on the programmes page.',
        ],
        '/programs' => [
            'This page covers our work: three primary pillars — Sports, Entrepreneurship and Community Development — with technology and education services alongside them.',
            'Open a programme card to read what it delivers, and use the donate button on any card to give directly to the programme you care about.',
        ],
        '/ghana-initiatives' => [
            'This page covers our Ghana work, based in Accra: the programmes running there and the communities involved.',
            'Learn about the initiatives, then get involved as a volunteer or supporter.',
        ],
        '/us-initiatives' => [
            'This page covers our United States work, based in Philadelphia: the programmes running there and who they serve.',
            'Learn about the initiatives, then get involved as a volunteer or supporter.',
        ],
        '/events' => [
            'This page lists our upcoming events. You can search by keyword and filter by location to find one near you.',
            'Pick an event and RSVP — you will get a confirmation email with the details.',
        ],
        '/press' => [
            'This page is our newsroom: articles and coverage about F.I.R.E., searchable by keyword and filterable by topic.',
            'Search or filter for a topic, then open an article to read the full story.',
        ],
        '/leadership' => [
            'This page introduces the people who lead F.I.R.E. — our organisation leaders, their roles and the governance behind the work.',
            'Open any profile to read a full bio, then contact us if you would like to work with the team.',
        ],
        '/partners' => [
            'This page is our partner directory: who partners with F.I.R.E., how they support the work, and what partnership makes possible.',
            'Browse the partners, and if your organisation is a fit, use the enquiry form to start a partnership conversation.',
        ],
        '/sponsors' => [
            'This page explains corporate sponsorship: the tiers available, what each one includes and the visibility sponsors receive.',
            'Choose a tier that fits, then request a sponsorship pack through the form on this page.',
        ],
        '/volunteer' => [
            'This page is about volunteering with F.I.R.E. — roles include coaching, mentoring, event crew and skills-based support.',
            'Find a role that fits your time and skills, then fill in the sign-up form and the team will follow up.',
        ],
        '/donate' => [
            'This page is where you support F.I.R.E. financially. Giving is secure and processed by Zeffy, so more of your gift reaches the programmes.',
            'Choose a one-time or monthly amount in the donation form and complete your gift.',
        ],
        '/contact' => [
            'This page is how you reach the F.I.R.E. team with any question we have not answered elsewhere.',
            'Send us a message using the form, or email info at freeinspiration dot org.',
        ],
    ];

    /**
     * @return array{status: int, body: array<string, mixed>}
     */
    public static function summarise(string $route): array
    {
        $cached = self::readCache($route);
        if ($cached !== null) {
            return self::ok($cached, false);
        }

        $fallback = self::fallbackScript($route);

        $apiKey = Config::require('LOVABLE_API_KEY');
        if ($apiKey === null) {
            return self::ok($fallback, true);
        }

        $live = AssistantKnowledge::summary();
        $liveBlock = $live === '' ? '' : "\n\nLIVE SITE DATA (current records — use it when relevant to this page):\n" . $live;

        $payload = [
            'model' => self::MODEL,
            'messages' => [
                ['role' => 'system', 'content' =>
                    "You write short spoken narrations that are read aloud to visitors of the F.I.R.E. "
                    . "(Free Inspiration Reaching Everyone) nonprofit website.\n"
                    . "Write 3 to 5 sentences of plain text, no markdown, no lists, no URLs, no special "
                    . "characters — it will be spoken by a voice, so write the way a warm, confident host "
                    . "would speak. First say what this page is about, then say clearly what the visitor is "
                    . "expected to do on it. Refer to pages by name (\"the donate page\"), never as a path."
                    . $liveBlock,
                ],
                ['role' => 'user', 'content' =>
                    "Page: {$route}\nReference notes for this page:\n" . $fallback,
                ],
            ],
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
            CURLOPT_TIMEOUT => 60,
        ]);

        $raw = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($raw === false || $status < 200 || $status >= 300) {
            Logger::warning('page-summary', 'gateway request failed', ['status' => $status, 'route' => $route]);
            return self::ok($fallback, true);
        }

        $decoded = json_decode((string) $raw, true);
        $script = is_array($decoded) ? ($decoded['choices'][0]['message']['content'] ?? null) : null;

        if (!is_string($script) || trim($script) === '') {
            return self::ok($fallback, true);
        }

        $script = self::speakable($script);
        self::writeCache($route, $script);

        return self::ok($script, false);
    }

    /**
     * @return array{status: int, body: array<string, mixed>}
     */
    private static function ok(string $script, bool $offline): array
    {
        return ['status' => 200, 'body' => [
            'success' => true,
            'script' => $script,
            'offline' => $offline,
        ]];
    }

    /** Strips markdown, URLs and stray symbols so the text reads well aloud. */
    private static function speakable(string $text): string
    {
        $text = strip_tags($text);
        $text = preg_replace('#https?://\S+#', '', $text) ?? $text;
        $text = str_replace(['*', '#', '`', '_', '- '], '', $text);
        $text = preg_replace('/\s+/u', ' ', $text) ?? $text;

        return mb_substr(trim($text), 0, 1200);
    }

    private static function fallbackScript(string $route): string
    {
        $key = rtrim($route, '/');
        if ($key === '') {
            $key = '/';
        }

        if (isset(self::PAGES[$key])) {
            [$about, $action] = self::PAGES[$key];
            return $about . ' ' . $action;
        }

        // Detail routes fall back to their section, e.g. /press/a-story.
        foreach (self::PAGES as $path => $copy) {
            if ($path !== '/' && str_starts_with($key, $path . '/')) {
                return $copy[0] . ' ' . $copy[1];
            }
        }

        return 'This is a page on the F.I.R.E. website. F.I.R.E. empowers communities through education, '
            . 'technology, entrepreneurship, sports and youth development in Ghana and the United States. '
            . 'Read through the page, and when you are ready, explore our programmes, join an event, '
            . 'volunteer or support the work with a gift.';
    }

    private static function cacheFile(string $route): string
    {
        $slug = substr(hash('sha256', $route), 0, 32);
        return dirname(__DIR__, 2) . '/storage/page-summaries/' . $slug . '.json';
    }

    private static function readCache(string $route): ?string
    {
        $file = self::cacheFile($route);
        if (!is_file($file)) {
            return null;
        }
        $raw = @file_get_contents($file);
        if ($raw === false) {
            return null;
        }
        $state = json_decode($raw, true);
        if (!is_array($state) || !is_string($state['script'] ?? null)) {
            return null;
        }
        if ((time() - (int) ($state['at'] ?? 0)) >= self::CACHE_TTL) {
            return null;
        }
        return $state['script'];
    }

    private static function writeCache(string $route, string $script): void
    {
        $file = self::cacheFile($route);
        $dir = dirname($file);
        if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
            return;
        }
        @file_put_contents($file, json_encode(['at' => time(), 'script' => $script]), LOCK_EX);
    }
}

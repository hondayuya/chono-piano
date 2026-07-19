<?php
/**
 * 問い合わせフォーム設定のサンプル。
 * 実運用値は config.php を編集してください。
 */
declare(strict_types=1);

return [
    // Destination inbox
    'to_email' => 'yuya.honda33@gmail.com',
    'to_name' => 'チョウノウ調律所',

    // Envelope / From (use a domain you control)
    'from_email' => 'noreply@chono-piano.com',
    'from_name' => 'チョウノウ調律所 Webフォーム',

    // Optional Reply-To uses the visitor address when valid
    'use_visitor_reply_to' => true,

    // Auto-reply to the visitor after a successful notify mail
    'auto_reply_enabled' => true,
    'auto_reply_subject' => '[チョウノウ調律所] お問い合わせを受け付けました',
    'site_url' => 'https://chono-piano.com',

    // Allowed Origin / Referer hosts (no scheme). Empty = same-host only via HTTPS check helpers.
    'allowed_hosts' => [
        'localhost',
        '127.0.0.1',
        'chono-piano.com',
        'www.chono-piano.com',
        'stg.chono-piano.com',
    ],

    // Rate limit: max submissions per IP hash within window (seconds)
    'rate_limit_max' => 5,
    'rate_limit_window' => 3600,

    // Minimum seconds the form must stay open before submit
    'min_submit_seconds' => 3,

    // Session name
    'session_name' => 'chono_contact_sess',

    // Subject prefix
    'mail_subject_prefix' => '[チョウノウ調律所] お問い合わせ',
];

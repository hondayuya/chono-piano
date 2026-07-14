<?php
/**
 * Copy this file to config.php and fill in real values.
 * config.php must NOT be committed to git.
 */
declare(strict_types=1);

return [
    // Destination inbox
    'to_email' => 'info@example.com',
    'to_name' => 'チョウノウ調律所',

    // Envelope / From (use a domain you control)
    'from_email' => 'noreply@example.com',
    'from_name' => 'チョウノウ調律所 Webフォーム',

    // Optional Reply-To uses the visitor address when valid
    'use_visitor_reply_to' => true,

    // Allowed Origin / Referer hosts (no scheme). Empty = same-host only via HTTPS check helpers.
    'allowed_hosts' => [
        'localhost',
        '127.0.0.1',
        'example.com',
        'www.example.com',
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

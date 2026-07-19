<?php
/**
 * 問い合わせフォーム設定（リポジトリに含めます）。
 */
declare(strict_types=1);

return [
    // Destination inbox（仮）
    'to_email' => 'yuya.honda33@gmail.com',
    'to_name' => 'チョウノウ調律所',

    // Envelope / From（本番ドメイン）
    'from_email' => 'noreply@chono-piano.com',
    'from_name' => 'チョウノウ調律所 Webフォーム',

    // Optional Reply-To uses the visitor address when valid
    'use_visitor_reply_to' => true,

    // Allowed Origin / Referer hosts (no scheme)
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

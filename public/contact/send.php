<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$config = chono_load_config();
chono_start_session($config);

function fail(string $code): void
{
    chono_redirect('/contact/error/?code=' . rawurlencode($code));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('method');
}

if (!chono_is_allowed_origin($config)) {
    fail('origin');
}

// Honeypot — bots often fill hidden fields
$honeypot = chono_post_string('company_url', 200);
if ($honeypot !== '') {
    // Pretend success to avoid tipping off bots
    chono_redirect('/contact/thanks/');
}

$csrf = chono_post_string('csrf_token', 128);
if (!chono_csrf_token_validate($csrf)) {
    fail('csrf');
}

// Timing check — reject instantaneous submits
$loadedAtRaw = chono_post_string('form_loaded_at', 20);
$loadedAt = ctype_digit($loadedAtRaw) ? (int) $loadedAtRaw : 0;
$minSeconds = (int) ($config['min_submit_seconds'] ?? 3);
// form_loaded_at is ms from Date.now()
if ($loadedAt > 0) {
    $elapsedSec = (int) floor((time() * 1000 - $loadedAt) / 1000);
    if ($elapsedSec < $minSeconds) {
        fail('bot');
    }
}

if (!chono_check_rate_limit($config)) {
    fail('rate');
}

$name = chono_post_string('name', 100);
$email = chono_post_string('email', 200);
$phone = chono_post_string('phone', 30);
$address = chono_post_string('address', 200);
$pianoMaker = chono_post_string('piano_maker', 100);
$pianoAge = chono_post_string('piano_age', 100);
$lastTuning = chono_post_string('last_tuning', 100);
$message = chono_post_string('message', 5000);

if ($name === '' || $message === '' || !chono_validate_email($email)) {
    fail('validation');
}

// Extra header-injection guards on free-text lines used near headers
foreach ([$name, $phone, $address] as $line) {
    if ($line !== chono_strip_headers($line)) {
        fail('validation');
    }
}

$to = (string) ($config['to_email'] ?? '');
$fromEmail = (string) ($config['from_email'] ?? '');
$fromName = chono_strip_headers((string) ($config['from_name'] ?? 'Web Form'));
$toName = chono_strip_headers((string) ($config['to_name'] ?? ''));
$subjectPrefix = chono_strip_headers((string) ($config['mail_subject_prefix'] ?? '[Contact]'));

if (!chono_validate_email($to) || !chono_validate_email($fromEmail)) {
    fail('mail');
}

$subject = $subjectPrefix . ' / ' . chono_strip_headers($name);
$bodyLines = [
    'チョウノウ調律所 Webフォームからのお問い合わせ',
    '----------------------------------------',
    'お名前: ' . $name,
    'メール: ' . $email,
    '電話: ' . ($phone !== '' ? $phone : '（未記入）'),
    'ご住所: ' . ($address !== '' ? $address : '（未記入）'),
    'ピアノメーカー: ' . ($pianoMaker !== '' ? $pianoMaker : '（未記入）'),
    'ピアノの古さ: ' . ($pianoAge !== '' ? $pianoAge : '（未記入）'),
    '最後の調律: ' . ($lastTuning !== '' ? $lastTuning : '（未記入）'),
    '----------------------------------------',
    'ご相談内容:',
    $message,
    '----------------------------------------',
    '送信日時: ' . date('Y-m-d H:i:s'),
    'IP(hash): ' . hash('sha256', chono_client_ip()),
];
$body = implode("\n", $bodyLines);

$encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
    'X-Mailer: ChonoContactForm',
];

if (!empty($config['use_visitor_reply_to'])) {
    $headers[] = 'Reply-To: ' . $email;
}

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$encodedBody = chunk_split(base64_encode($body));

$toHeader = $toName !== ''
    ? '=?UTF-8?B?' . base64_encode($toName) . '?= <' . $to . '>'
    : $to;

$sent = @mail($toHeader, $encodedSubject, $encodedBody, implode("\r\n", $headers));

if (!$sent) {
    fail('mail');
}

chono_redirect('/contact/thanks/');

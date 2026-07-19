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

$blank = static fn(string $v): string => $v !== '' ? $v : '（未記入）';

$subject = $subjectPrefix . ' / ' . chono_strip_headers($name);
$bodyLines = [
    'チョウノウ調律所 Webフォームからのお問い合わせ',
    '----------------------------------------',
    'お名前: ' . $name,
    'メール: ' . $email,
    '電話: ' . $blank($phone),
    'ご住所: ' . $blank($address),
    'ピアノメーカー: ' . $blank($pianoMaker),
    'ピアノの古さ: ' . $blank($pianoAge),
    '最後の調律: ' . $blank($lastTuning),
    '----------------------------------------',
    'ご相談内容:',
    $message,
    '----------------------------------------',
    '送信日時: ' . date('Y-m-d H:i:s'),
    'IP(hash): ' . hash('sha256', chono_client_ip()),
];
$body = implode("\n", $bodyLines);

$toHeader = $toName !== ''
    ? '=?UTF-8?B?' . base64_encode($toName) . '?= <' . $to . '>'
    : $to;

$notifyReplyTo = !empty($config['use_visitor_reply_to']) ? $email : null;
$sent = chono_send_mail($toHeader, $subject, $body, $fromEmail, $fromName, $notifyReplyTo);

if (!$sent) {
    fail('mail');
}

// Auto-reply to visitor (best-effort after notify succeeds)
if (!empty($config['auto_reply_enabled'])) {
    $autoSubject = chono_strip_headers((string) (
        $config['auto_reply_subject'] ?? '[チョウノウ調律所] お問い合わせを受け付けました'
    ));
    $shopName = $toName !== '' ? $toName : 'チョウノウ調律所';
    $siteUrl = rtrim((string) ($config['site_url'] ?? 'https://chono-piano.com'), '/');

    $autoBody = implode("\n", [
        $name . ' 様',
        '',
        'このたびは' . $shopName . 'へお問い合わせいただき、ありがとうございます。',
        '以下の内容で受け付けました。内容を確認のうえ、ご連絡いたします。',
        '',
        '訪問時間帯のご予約は基本的に電話で行います。',
        '電話番号をご記入いただいていない場合は、メールにてご案内する場合があります。',
        '',
        '----------------------------------------',
        '【お問い合わせ内容】',
        'お名前: ' . $name,
        'メール: ' . $email,
        '電話: ' . $blank($phone),
        'ご住所: ' . $blank($address),
        'ピアノメーカー: ' . $blank($pianoMaker),
        'ピアノの古さ: ' . $blank($pianoAge),
        '最後の調律: ' . $blank($lastTuning),
        '',
        'ご相談内容:',
        $message,
        '----------------------------------------',
        '',
        '本メールは自動送信です。返信いただいても内容を確認できない場合があります。',
        'お急ぎの場合はお電話にてご連絡ください。',
        '',
        $shopName . ' / Labo CHONO',
        $siteUrl,
    ]);

    // Reply-To: shop inbox so visitors can continue the conversation
    chono_send_mail($email, $autoSubject, $autoBody, $fromEmail, $fromName, $to);
}

chono_redirect('/contact/thanks/');

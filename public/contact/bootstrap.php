<?php
declare(strict_types=1);

/**
 * Shared bootstrap for contact PHP endpoints.
 */

const CHONO_CONTACT_ROOT = __DIR__;

function chono_load_config(): array
{
    $path = CHONO_CONTACT_ROOT . '/config.php';
    if (!is_readable($path)) {
        // Fall back to sample for local structure checks; sending will still use placeholders.
        $path = CHONO_CONTACT_ROOT . '/config.sample.php';
    }

    /** @var array $config */
    $config = require $path;
    return $config;
}

function chono_start_session(array $config): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

    session_name($config['session_name'] ?? 'chono_contact_sess');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/contact/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function chono_json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function chono_redirect(string $path): void
{
    header('Location: ' . $path, true, 303);
    exit;
}

function chono_client_ip(): string
{
    // Do not trust X-Forwarded-For by default (spoofable). Use REMOTE_ADDR only.
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function chono_rate_limit_path(): string
{
    $dir = sys_get_temp_dir() . '/chono-contact-rate';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    return $dir;
}

function chono_check_rate_limit(array $config): bool
{
    $max = (int) ($config['rate_limit_max'] ?? 5);
    $window = (int) ($config['rate_limit_window'] ?? 3600);
    $ipHash = hash('sha256', chono_client_ip() . '|chono');
    $file = chono_rate_limit_path() . '/' . $ipHash . '.json';

    $now = time();
    $entries = [];
    if (is_readable($file)) {
        $raw = file_get_contents($file);
        $decoded = json_decode($raw ?: '[]', true);
        if (is_array($decoded)) {
            $entries = array_values(array_filter(
                $decoded,
                static fn($ts) => is_int($ts) && ($now - $ts) < $window
            ));
        }
    }

    if (count($entries) >= $max) {
        return false;
    }

    $entries[] = $now;
    file_put_contents($file, json_encode($entries), LOCK_EX);
    @chmod($file, 0600);
    return true;
}

function chono_is_allowed_origin(array $config): bool
{
    $allowed = $config['allowed_hosts'] ?? [];
    if (!is_array($allowed) || $allowed === []) {
        return false;
    }

    $candidates = [];
    if (!empty($_SERVER['HTTP_ORIGIN'])) {
        $host = parse_url((string) $_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
        if (is_string($host) && $host !== '') {
            $candidates[] = strtolower($host);
        }
    }
    if (!empty($_SERVER['HTTP_REFERER'])) {
        $host = parse_url((string) $_SERVER['HTTP_REFERER'], PHP_URL_HOST);
        if (is_string($host) && $host !== '') {
            $candidates[] = strtolower($host);
        }
    }

    // Same-host fallback when Origin/Referer absent (some privacy browsers).
    if ($candidates === [] && !empty($_SERVER['HTTP_HOST'])) {
        $candidates[] = strtolower(preg_replace('/:\\d+$/', '', (string) $_SERVER['HTTP_HOST']) ?? '');
    }

    if ($candidates === []) {
        return false;
    }

    $allowedLower = array_map('strtolower', $allowed);
    foreach ($candidates as $host) {
        if (in_array($host, $allowedLower, true)) {
            return true;
        }
    }
    return false;
}

function chono_strip_headers(string $value): string
{
    return str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D"], '', $value);
}

function chono_post_string(string $key, int $maxLen): string
{
    $raw = $_POST[$key] ?? '';
    if (!is_string($raw)) {
        return '';
    }
    $raw = trim($raw);
    if (function_exists('mb_substr')) {
        $raw = mb_substr($raw, 0, $maxLen);
    } else {
        $raw = substr($raw, 0, $maxLen);
    }
    return $raw;
}

function chono_validate_email(string $email): bool
{
    if ($email === '' || strlen($email) > 200) {
        return false;
    }
    if (chono_strip_headers($email) !== $email) {
        return false;
    }
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}

function chono_csrf_token_create(): string
{
    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    $_SESSION['csrf_token_time'] = time();
    return $token;
}

function chono_csrf_token_validate(?string $token): bool
{
    if ($token === null || $token === '') {
        return false;
    }
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    if (!is_string($sessionToken) || $sessionToken === '') {
        return false;
    }
    $ok = hash_equals($sessionToken, $token);
    // One-time token
    unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
    return $ok;
}

/**
 * Send a UTF-8 plain-text mail with base64 body/subject.
 */
function chono_send_mail(
    string $to,
    string $subject,
    string $body,
    string $fromEmail,
    string $fromName,
    ?string $replyTo = null
): bool {
    $fromName = chono_strip_headers($fromName);
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
        'X-Mailer: ChonoContactForm',
    ];

    if ($replyTo !== null && $replyTo !== '' && chono_validate_email($replyTo)) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    $encodedSubject = '=?UTF-8?B?' . base64_encode(chono_strip_headers($subject)) . '?=';
    $encodedBody = chunk_split(base64_encode($body));

    return (bool) @mail($to, $encodedSubject, $encodedBody, implode("\r\n", $headers));
}

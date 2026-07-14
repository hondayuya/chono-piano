<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$config = chono_load_config();
chono_start_session($config);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    chono_json_response(['error' => 'method'], 405);
}

if (!chono_is_allowed_origin($config)) {
    chono_json_response(['error' => 'origin'], 403);
}

$token = chono_csrf_token_create();
chono_json_response([
    'token' => $token,
    'expires_in' => 1800,
]);

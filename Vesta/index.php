<?php
// ---------------------------------------------------------------------------
// CORS
// No se puede combinar "Access-Control-Allow-Origin: *" con
// "Access-Control-Allow-Credentials: true": el navegador rechaza la respuesta
// cuando la peticion lleva credenciales. Por eso, si el origen es un entorno
// local de desarrollo se devuelve ese origen exacto (y se habilita el envio de
// credenciales); en cualquier otro caso se responde con el comodin "*".
// ---------------------------------------------------------------------------
$corsOrigen = $_SERVER['HTTP_ORIGIN'] ?? '';
$corsOrigenesExtra = array_filter(array_map('trim', explode(',', $_SERVER['CORS_ALLOWED_ORIGINS'] ?? '')));

$corsPermitido = false;
if ($corsOrigen !== '') {
    $corsHost = strtolower((string) parse_url($corsOrigen, PHP_URL_HOST));
    $corsPermitido = in_array($corsHost, ['localhost', '127.0.0.1'], true)
        || in_array($corsOrigen, $corsOrigenesExtra, true);
}

if ($corsPermitido) {
    header("Access-Control-Allow-Origin: $corsOrigen");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Vary: Origin');

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");
date_default_timezone_set('America/Argentina/Buenos_Aires');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'api/routes/routes.php'; // Incluir tus rutas

<?php

// Router para el servidor de desarrollo integrado de PHP.
// Todas las rutas de la API deben pasar por index.php, igual que en Nginx.
$ruta = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$archivo = __DIR__ . $ruta;

// Permite que el servidor integrado entregue archivos reales directamente.
if ($ruta !== '/' && is_file($archivo)) {
    return false;
}

require __DIR__ . '/index.php';

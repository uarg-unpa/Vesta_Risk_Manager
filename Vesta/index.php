<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// Permitir encabezados específicos
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");
date_default_timezone_set('America/Argentina/Buenos_Aires');

require_once 'api/routes/routes.php'; // Incluir tus rutas

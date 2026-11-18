<?php

function comprobar(bool $condicion, string $mensaje): void
{
    if (!$condicion) {
        throw new RuntimeException($mensaje);
    }
}

$raiz = dirname(__DIR__);
$rutas = file_get_contents($raiz . '/api/routes/routes.php');
comprobar(!str_contains($rutas, '"DELETE", "perfil/{id}"'), 'No debe quedar un endpoint de borrado de perfil, ni siquiera comentado');
comprobar(
    !str_contains(file_get_contents($raiz . '/api/controllers/gestorUsuario.php'), 'function eliminarPerfil('),
    'No debe quedar un controlador de borrado de perfil sin ruta'
);
comprobar(
    !str_contains(file_get_contents($raiz . '/api/models/perfil.php'), 'function eliminarPerfil('),
    'No debe quedar SQL de borrado de perfil sin ruta'
);
$inicio = strpos($rutas, '$router->add("POST", "usuario"');
$fin = strpos($rutas, '$router->add("PUT", "usuario/', $inicio);
$creacion = substr($rutas, $inicio, $fin - $inicio);
comprobar(
    strpos($creacion, 'http_response_code(201)') < strpos($creacion, 'echo json_encode(["creacion" => $resultado])'),
    'POST usuario debe establecer HTTP 201 antes de enviar JSON'
);

$dockerignore = @file_get_contents($raiz . '/.dockerignore');
comprobar($dockerignore !== false && str_contains($dockerignore, 'api/bloqueo/*_lock.tmp'), 'El build no debe copiar archivos de bloqueo');

$dockerfile = file_get_contents($raiz . '/Dockerfile');
comprobar(
    preg_match('~chown\s+www-data:www-data\s+/var/www/html/api/api/bloqueo~', $dockerfile) === 1,
    'PHP-FPM debe ser propietario de la carpeta de bloqueo'
);

$temporal = (is_dir('/tmp/opencode') ? '/tmp/opencode' : sys_get_temp_dir())
    . '/vesta-bloqueo-' . bin2hex(random_bytes(8));
mkdir($temporal . '/models', 0700, true);
mkdir($temporal . '/bloqueo', 0700);
copy($raiz . '/api/models/bloquearModificacion.php', $temporal . '/models/bloquearModificacion.php');
require $temporal . '/models/bloquearModificacion.php';

try {
    $respuesta = Bloquear::bloquearModificacion('usuario', 42, 'token-de-prueba');
    comprobar($respuesta === ['bloqueado' => false], 'Debe crear un bloqueo cuando el directorio es escribible');
    comprobar(is_file($temporal . '/bloqueo/usuario_42_lock.tmp'), 'Debe existir el archivo de bloqueo');

    // El subdirectorio no existe: simula un fallo de escritura sin depender de permisos de root.
    set_error_handler(static fn() => true);
    try {
        try {
            Bloquear::bloquearModificacion('usuario', 'sin-directorio/43', 'token-de-prueba');
            throw new RuntimeException('La escritura fallida no debe informarse como bloqueo exitoso');
        } catch (RuntimeException $error) {
            comprobar(
                $error->getMessage() === 'No se pudo guardar el bloqueo del usuario.',
                'Debe informar de forma controlada el fallo de escritura'
            );
        }
    } finally {
        restore_error_handler();
    }
} finally {
    @unlink($temporal . '/bloqueo/usuario_42_lock.tmp');
    rmdir($temporal . '/bloqueo');
    unlink($temporal . '/models/bloquearModificacion.php');
    rmdir($temporal . '/models');
    rmdir($temporal);
}

echo "Regresiones verificadas\n";

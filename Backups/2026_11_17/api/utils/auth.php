<?php

require_once __DIR__ . "/../controllers/gestorProyecto.php";
require_once __DIR__ . "/validacionContext.php";

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Firebase\JWT\Key;

function getAuthorizationHeader()
{
    // Comprobamos si la cabecera HTTP_AUTHORIZATION está presente
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['HTTP_AUTHORIZATION']);
    }
    // Si no está presente, verificamos otras posibles formas de obtenerla
    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    }
    return null;
}

function extractToken($authorizationHeader)
{
    // Comprobamos si el token tiene el prefijo "Bearer "
    if (preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches)) {
        return $matches[1];  // El token será el primer grupo capturado
    }
    return null;
}

/**
 * Verifica un ID token emitido por Google y devuelve sus claims.
 * La firma se valida con las claves públicas que Google publica para sus tokens.
 */
function validarJWTGoogle($jwt)
{
    if (!is_string($jwt) || trim($jwt) === '') {
        return false;
    }

    try {
        $partes = explode('.', $jwt);
        if (count($partes) !== 3) {
            return false;
        }

        $header = json_decode(base64_decode(strtr($partes[0], '-_', '+/')), true);
        if (!is_array($header) || ($header['typ'] ?? null) !== 'JWT'
            || ($header['alg'] ?? null) !== 'RS256' || empty($header['kid'])) {
            return false;
        }

        $contexto = stream_context_create([
            'http' => ['timeout' => 5]
        ]);
        $respuesta = file_get_contents('https://www.googleapis.com/oauth2/v3/certs', false, $contexto);
        if ($respuesta === false) {
            return false;
        }

        $jwks = json_decode($respuesta, true);
        if (!is_array($jwks)) {
            return false;
        }

        $claves = JWK::parseKeySet($jwks);
        if (!isset($claves[$header['kid']])) {
            return false;
        }

        $claims = JWT::decode($jwt, $claves);
        $emisoresValidos = ['accounts.google.com', 'https://accounts.google.com'];
        if (!in_array($claims->iss ?? null, $emisoresValidos, true)
            || empty($claims->email)
            || ($claims->email_verified ?? false) !== true) {
            return false;
        }

        $clientId = getenv('GOOGLE_CLIENT_ID');
        if ($clientId !== false && $clientId !== '' && ($claims->aud ?? null) !== $clientId) {
            return false;
        }

        return $claims;
    } catch (Throwable $e) {
        return false;
    }
}


function generarJWT($usuario)
{
    $key = getenv('JWT_SECRET');
    $payload = $usuario;
    $token = JWT::encode($payload, $key, "HS256");

    return $token;
}

function decodificarJWT()
{
    $autorizacion = getAuthorizationHeader();

    if (empty($autorizacion)) {
        return false;
    }

    $JWT = extractToken($autorizacion);
    if (empty($JWT)) {
        return false;
    }
    try {
        $key = getenv('JWT_SECRET');
        $decode = JWT::decode($JWT, new Key($key, "HS256"));
        return $decode;
    } catch (Exception $e) {
        return false;
    }
}

function middlewareAuth()
{
    $validacion = decodificarJWT();
    if (!$validacion) {
        header('HTTP/1.1 403 Forbidden');
        echo json_encode([
            "error" => "No tienes permisos para realizar esta acción o el token es inválido."
        ]);
        return false;
    }
    ValidacionRequest::setUser($validacion);
    return true;
}

function middlewareAuthorization($perfiles)
{
    $validacion = ValidacionRequest::getUser();
    if (!$validacion) {
        header('HTTP/1.1 403 Forbidden');
        echo json_encode([
            "error" => "No tienes permisos para realizar esta acción o el token es inválido."
        ]);
        return false;
    }

    if (!in_array($validacion->nombre_perfil, $perfiles)) {
        header('HTTP/1.1 403 Forbidden');
        echo json_encode([
            "error" => "No tienes permisos para realizar esta acción o el token es inválido."
        ]);
        return false;
    }

    return true;

}

function middlewareAuthorizationRolProyecto($roles, $params)
{
    $validacion = ValidacionRequest::getUser();
    if (!$validacion) {
        header('HTTP/1.1 403 Forbidden');
        echo json_encode([
            "error" => "No tienes permisos para realizar esta acción o el token es inválido."
        ]);
        return false;
    }

    if ($validacion->nombre_perfil == "Administrador" || $validacion->nombre_perfil == "Espectador") {
        return true;
    }

    if (!isset($params['id_proyecto']) && !isset($params['id_tarea']) && !isset($params['id_incidencia'])) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Falta una referencia de proyecto en la ruta"]);
        return false;
    }

     // Resolver el proyecto
    $id_proyecto = null;

    if (isset($params['id_proyecto'])) {
        $id_proyecto = $params['id_proyecto'];
    } 
    else if (isset($params['id_tarea'])) {
        $controladorRiesgo = new GestorRiesgo();
        $id_proyecto = $controladorRiesgo->obtenerIdProyecto($params['id_tarea']);

        if (!$id_proyecto) {
            header("HTTP/1.1 404 Not Found");
            echo json_encode(["error" => "La tarea no pertenece a ningún proyecto o no existe"]);
            return false;
        }
    }
    else if (isset($params['id_incidencia'])) {
        $controladorRiesgo = new GestorRiesgo();
        $id_proyecto = $controladorRiesgo->obtenerIdProyectoIncidencia($params['id_incidencia']);

        if (!$id_proyecto) {
            header("HTTP/1.1 404 Not Found");
            echo json_encode(["error" => "La incidencia no pertenece a ningún proyecto o no existe"]);
            return false;
        }
    }

    $controladorProyecto = new GestorProyecto();
    $rol = $controladorProyecto->obtenerRolUsuarioProyecto($id_proyecto, $validacion->id_usuario);

    if (!$rol) {
        header("HTTP/1.1 403 Forbidden");
        echo json_encode(["error" => "No perteneces al proyecto"]);
        return false;
    }

    if (!in_array($rol, $roles)) {
        header("HTTP/1.1 403 Forbidden");
        echo json_encode(["error" => "No tienes permisos"]);
        return false;
    }

    return true;

}

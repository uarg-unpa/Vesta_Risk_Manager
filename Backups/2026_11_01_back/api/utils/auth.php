<?php

require_once __DIR__ . "/../controllers/gestorProyecto.php";
require_once __DIR__ . "/validacionContext.php";

use Firebase\JWT\JWT;
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

// function decodeJWTGoogle($jwt)
// {
//     // Divide el JWT en sus partes: header, payload y signature
//     list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $jwt);

//     // Decodifica el header y el payload
//     $header = json_decode(base64_decode(strtr($headerEncoded, '-_', '+/')), true);
//     $payload = json_decode(base64_decode(strtr($payloadEncoded, '-_', '+/')), true);

//     // Retorna el header y el payload
//     return ['header' => $header, 'payload' => $payload];
// }


// function obtenerClavePublicaGoogle()
// {
//     $url = "https://www.googleapis.com/oauth2/v3/certs";
//     $certificados = json_decode(file_get_contents($url), true);

//     return $certificados['keys'];
// }

// function validarJWTGoogle($controladorUsuario)
// {
//     $autorizacion = getAuthorizationHeader();

//     if (empty($autorizacion)) {
//         return false;
//     }

//     $JWT = extractToken($autorizacion);
//     if (empty($JWT)) {
//         return false;
//     }

//     $resultado = decodeJWT($JWT);
//     if (empty($resultado["header"]) || empty($resultado["payload"])) {
//         return false;
//     }

//     if (empty($resultado["header"]["typ"]) || $resultado["header"]["typ"] != "JWT") {
//         return false;
//     }

//     if (empty($resultado["header"]["kid"])) {
//         return false;
//     }

//     if (empty($resultado["payload"]["email"])) {
//         return false;
//     }

//     $usuario = $controladorUsuario->obtenerUsuarioCorreo($resultado["payload"]["email"]);

//     if (empty($usuario)) {
//         return false;
//     }

//     return true;
// }


function generarJWT($usuario)
{
    $key = $_ENV['JWT_SECRET'];
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
        $key = $_ENV['JWT_SECRET'];
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

    if (!isset($params['id_proyecto']) && !isset($params['id_tarea'])) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "Falta id_proyecto en la ruta"]);
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
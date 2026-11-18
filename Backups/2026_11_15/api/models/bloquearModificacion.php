<?php
class Bloquear
{
    public static function bloquearModificacion($nombre_elemento, $id_elemento, $token)
    {
        $archivo = __DIR__ . "/../bloqueo/{$nombre_elemento}_{$id_elemento}_lock.tmp";
        if (self::verificarBloqueo($archivo, $token)) {
            return ['bloqueado' => true];
        }
        file_put_contents($archivo, json_encode(['timestamp' => time(), "token" => $token]));
        return ['bloqueado' => false];
    }

    private static function verificarBloqueo($archivo, $token)
    {
        if (!file_exists($archivo)) {
            return false;
        }

        $lockInfo = json_decode(file_get_contents($archivo), true);
        $timestampActual = time();

        if ($lockInfo["token"] === $token || $timestampActual - $lockInfo["timestamp"] >= 600) {
            return false;
        }

        return true;
    }

    public static function desbloquearModificacion($nombre, $id_nombre, $token)
    {
        $archivo = __DIR__ . "/../bloqueo/{$nombre}_{$id_nombre}_lock.tmp";

        if (self::verificarBloqueo($archivo, $token)) {
            return ['desbloqueado' => false];
        }
        unlink($archivo);
        return ['desbloqueado' => true];

    }
}
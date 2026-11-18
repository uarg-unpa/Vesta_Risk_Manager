<?php
class vincularTabla
{
    private const TABLAS_CON_ACTIVO = [
        'proyecto_participante', 'participante_riesgo', 'participante_tarea',
        'evaluacion', 'plan', 'tarea', 'incidencia',
    ];

    private static function tablaConActivo($tabla)
    {
        return in_array($tabla, self::TABLAS_CON_ACTIVO, true);
    }

    public static function crearVinculo($conexion, $tabla, $nombre1, $nombre2, $id_primero, $id_segundo)
    {
        $query = "INSERT INTO {$tabla} ({$nombre1}, {$nombre2}) VALUES (?, ?)";
        if (self::tablaConActivo($tabla)) {
            $query .= " ON DUPLICATE KEY UPDATE activo = 1";
        }
        $stmt = $conexion->prepare($query);
        $stmt->bind_param("ii", $id_primero, $id_segundo);
        if (!$stmt->execute()) {
            throw new Exception("Error al asociar: " . $stmt->error);
        }
    }
    public static function crearVinculoRiesgo($conexion, $tabla, $nombre1, $nombre2, $nombre3, $id_primero, $id_segundo, $id_tercero)
    {
        $query = "INSERT INTO {$tabla} ({$nombre1}, {$nombre2}, {$nombre3}) VALUES (?, ?, ?)";
        if (self::tablaConActivo($tabla)) {
            $query .= " ON DUPLICATE KEY UPDATE activo = 1";
        }
        $stmt = $conexion->prepare($query);
        $stmt->bind_param("iii", $id_primero, $id_segundo, $id_tercero);
        if (!$stmt->execute()) {
            throw new Exception("Error al asociar: " . $stmt->error);
        }
    }

    public static function crearVinculoAtributo($conexion, $tabla, $nombre1, $nombre2, $nombre_atributo, $id_primero, $id_segundo, $valor_atributo)
    {
        $query = "INSERT INTO {$tabla} ({$nombre1}, {$nombre2}, {$nombre_atributo}) VALUES (?, ?, ?)";
        if (self::tablaConActivo($tabla)) {
            $query .= " ON DUPLICATE KEY UPDATE activo = 1, {$nombre_atributo} = VALUES({$nombre_atributo})";
        }
        $stmt = $conexion->prepare($query);
        $stmt->bind_param("iis", $id_primero, $id_segundo, $valor_atributo);
        if (!$stmt->execute()) {
            throw new Exception("Error al asociar: " . $stmt->error);
        }
    }

    public static function modificarVinculo($conexion, $tabla, $nombre1, $nombre2, $id_primero, $id_segundo)
    {
        $query = "UPDATE {$tabla} set {$nombre2} = ? where {$nombre1} = ?";
        $stmt = $conexion->prepare($query);
        $stmt->bind_param("ii", $id_segundo, $id_primero);
        if (!$stmt->execute()) {
            throw new Exception("Error al asociar: " . $stmt->error);
        }
    }

    public static function eliminarVinculo($conexion, $tabla, $nombre1, $id_primero)
    {
        if (!self::tablaConActivo($tabla)) {
            throw new InvalidArgumentException("La tabla no permite desactivación: {$tabla}");
        }
        $query = "UPDATE {$tabla} SET activo = 0 where {$nombre1} = ? and activo = 1";
        $stmt = $conexion->prepare($query);
        $stmt->bind_param("i", $id_primero);
        if (!$stmt->execute()) {
            throw new Exception("Error al asociar: " . $stmt->error);
        }
    }

    public static function eliminarVinculoRiesgo($conexion, $tabla, $nombre1, $nombre2, $id_primero, $id_segundo)
    {
        if (!self::tablaConActivo($tabla)) {
            throw new InvalidArgumentException("La tabla no permite desactivación: {$tabla}");
        }
        $query = "UPDATE {$tabla} SET activo = 0 where {$nombre1} = ? and {$nombre2} = ? and activo = 1";
        $stmt = $conexion->prepare($query);
        $stmt->bind_param("ii", $id_primero, $id_segundo);
        if (!$stmt->execute()) {
            throw new Exception("Error al asociar: " . $stmt->error);
        }
    }

}

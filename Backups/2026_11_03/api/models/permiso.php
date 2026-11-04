<?php
class Permiso
{
    private $nombre, $conexion;
    function __construct($conexion, $nombre = null)
    {
        $this->nombre = $nombre;
        $this->conexion = $conexion;
    }

    public function getNombre()
    {
        return $this->nombre;
    }
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }


    public function obtenerTodosPermisos()
    {
        $permisos = $this->conexion->query("select * from permiso");
        $resultado = [];
        while ($fila = $permisos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

}
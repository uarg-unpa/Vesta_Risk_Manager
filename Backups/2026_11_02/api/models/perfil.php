<?php
class Perfil
{
    private $nombre, $conexion;
    private $permisos;

    function __construct($conexion, $nombre = null, $permisos = null)
    {
        $this->nombre = $nombre;
        $this->conexion = $conexion;
        $this->permisos = $permisos;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getPermisos()
    {
        return $this->permisos;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function setPermisos($permisos)
    {
        $this->permisos = $permisos;
    }

    public function obtenerTodosPerfiles()
    {
        $perfiles = $this->conexion->query("SELECT p.id_perfil, p.nombre, COUNT(up.id_usuario) AS total_usuarios FROM perfil p left JOIN usuario_perfil up ON p.id_perfil = up.id_perfil GROUP BY p.id_perfil, p.nombre");
        $resultado = [];
        while ($fila = $perfiles->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerPermisosPerfil()
    {
        $query = "SELECT pm.id_permiso, pm.nombre FROM perfil pf INNER JOIN perfil_permiso pp on pf.id_perfil = pp.id_perfil INNER JOIN permiso pm on pm.id_permiso = pp.id_permiso where pf.nombre = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $this->nombre);
        $stmt->execute();
        $permisos = $stmt->get_result();
        $resultado = [];
        while ($fila = $permisos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $this->setPermisos($resultado);
        return $resultado;
    }

    public function obtenerPerfilId($id)
    {
        $query = "SELECT * FROM perfil WHERE id_perfil = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        $this->setNombre($resultado["nombre"]);
        return $resultado;
    }

    public function obtenerPerfilNombre()
    {
        $query = "SELECT * FROM perfil WHERE nombre = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $this->nombre);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

    public function crearPerfil()
    {
        $query = "INSERT INTO perfil (nombre) VALUES (?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $this->nombre);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear el perfil: " . $stmt->error);
        }
    }

    // Actualizar perfil
    public function actualizarPerfil($id)
    {
        $query = "UPDATE perfil SET nombre = ? WHERE id_perfil = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("si", $this->nombre, $id);

        if (!$stmt->execute()) {
            throw new Exception("Error al actualizar el usuario: " . $stmt->error);
            return false;
        } else {
            return true;
        }
    }

    // Eliminar perfil
    public function eliminarPerfil($id)
    {
        $query = "DELETE FROM perfil WHERE id_perfil = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            throw new Exception("Error al eliminar el usuario: " . $stmt->error);
            return false;
        } else {
            return true;
        }
    }

}

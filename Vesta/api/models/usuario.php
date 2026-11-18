<?php

class Usuario
{
    private $nombre, $email, $conexion;

    function __construct($conexion,$nombre = null, $email = null)
    {
        $this->nombre = $nombre;
        $this->email = $email;
        $this->conexion = $conexion;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function crearUsuario()
    {
        $buscar = $this->conexion->prepare("SELECT id_usuario FROM usuario WHERE nombre = ? AND email = ? AND activo = 0");
        $buscar->bind_param("ss", $this->nombre, $this->email);
        $buscar->execute();
        $existente = $buscar->get_result()->fetch_assoc();
        if ($existente) {
            $reactivar = $this->conexion->prepare("UPDATE usuario SET activo = 1 WHERE id_usuario = ? AND activo = 0");
            $reactivar->bind_param("i", $existente["id_usuario"]);
            if (!$reactivar->execute()) {
                throw new Exception("Error al reactivar el usuario: " . $reactivar->error);
            }
            return $existente["id_usuario"];
        }
        $query = "INSERT INTO usuario (nombre, email) VALUES (?, ?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ss", $this->nombre, $this->email);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear el usuario: " . $stmt->error);
        }

    }

    public function obtenerTodosUsuarios($pagina)
    {
        $usuariosPorPagina = 10;
        $offset = 0;
        if ($pagina > 1) {
            $offset = ($pagina - 1) * $usuariosPorPagina;
        }

        $usuarios = $this->conexion->query("select * from usuario where activo = 1 LIMIT $usuariosPorPagina OFFSET $offset");
        $resultado = [];
        while ($fila = $usuarios->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadUsuario($usuariosPorPagina);
        return ["usuarios" => $resultado, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadUsuario($usuariosPorPagina)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from usuario where activo = 1");
        $totalUsuarios = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalUsuarios / $usuariosPorPagina);

        return $totalPaginas;
    }


    // Obtener usuario por ID
    public function obtenerUsuarioId($id)
    {
        $query = "SELECT u.nombre as nombre_usuario, u.email,p.id_perfil, p.nombre as nombre_perfil FROM usuario u INNER JOIN usuario_perfil up on u.id_usuario = up.id_usuario INNER JOIN perfil p on up.id_perfil = p.id_perfil WHERE u.id_usuario = ? and u.activo = 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        if ($resultado) {
            $this->setNombre($resultado["nombre_usuario"]);
            $this->setEmail($resultado["email"]);
        }

        return $resultado; // Retorna el usuario
    }

    public function obtenerUsuariosNombre()
    {
        $query = "SELECT u.id_usuario, u.nombre as nombre_usuario, u.email,p.id_perfil, p.nombre as nombre_perfil FROM usuario u INNER JOIN usuario_perfil up on u.id_usuario = up.id_usuario INNER JOIN perfil p on up.id_perfil = p.id_perfil WHERE u.nombre like ? and p.nombre != 'Administrador' and u.activo = 1";
        $stmt = $this->conexion->prepare($query);
        $search = "%" . $this->nombre . "%";
        $stmt->bind_param("s", $search);
        $stmt->execute();
        $usuarios = $stmt->get_result();
        $resultado = [];
        while ($fila = $usuarios->fetch_assoc()) {
            $resultado[] = $fila;
        }

        return $resultado; // Retorna el usuario
    }

    public function obtenerUsuariosNombreEqual()
    {
        $query = "SELECT u.nombre as nombre_usuario, u.email,p.id_perfil, p.nombre as nombre_perfil FROM usuario u INNER JOIN usuario_perfil up on u.id_usuario = up.id_usuario INNER JOIN perfil p on up.id_perfil = p.id_perfil WHERE u.nombre = ? and u.activo = 1";
        $stmt = $this->conexion->prepare($query);
        $search = $this->nombre;
        $stmt->bind_param("s", $search);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();

        return $resultado; // Retorna el usuario
    }
    // Obtener usuario por Email
    public function obtenerUsuarioEmail()
    {
        $query = "SELECT u.id_usuario, u.nombre as nombre_usuario, u.email,p.id_perfil, p.nombre as nombre_perfil FROM usuario u INNER JOIN usuario_perfil up on u.id_usuario = up.id_usuario INNER JOIN perfil p on up.id_perfil = p.id_perfil WHERE u.email = ? and u.activo = 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $this->email);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();

        if (!empty($resultado)) {
            $this->setNombre($resultado["nombre_usuario"]);
        }

        return $resultado; // Retorna el usuario
    }

    // Actualizar usuario
    public function actualizarUsuario($id)
    {
        $query = "UPDATE usuario SET nombre = ?, email = ? WHERE id_usuario = ? and activo = 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssi", $this->nombre, $this->email, $id);

        if (!$stmt->execute()) {
            throw new Exception("Error al actualizar el usuario: " . $stmt->error);
            return false;
        } else {
            return true;
        }
    }

    // Eliminar usuario
    public function eliminarUsuario($id)
    {
        $query = "UPDATE usuario SET activo = 0 WHERE id_usuario = ? AND activo = 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            throw new Exception("Error al eliminar el usuario: " . $stmt->error);
        }
        return $stmt->affected_rows > 0;
    }

    // Obtener id de un usuario por nombre
    public function obtenerIdUsuarioNombre()
    {
        $query = "SELECT id_usuario FROM usuario WHERE nombre = ? and activo = 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $this->nombre);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado; // Retorna el usuario
    }

}

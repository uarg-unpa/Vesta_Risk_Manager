<?php
require_once __DIR__ . "/../models/usuario.php";
require_once __DIR__ . "/../models/perfil.php";
require_once __DIR__ . "/../models/permiso.php";
require_once __DIR__ . "/../models/vincularTabla.php";
require_once __DIR__ . "/../models/bloquearModificacion.php";
require_once __DIR__ . "/../../config/BDConexion.php";
require_once __DIR__ . "/../utils/auth.php";

class GestorUsuario
{
    private $conexion, $usuario, $perfil, $permiso;
    function __construct()
    {
        $this->conexion = BDConexion::getInstancia();
        $this->conexion->set_charset("utf8");

        $this->usuario = new Usuario( $this->conexion);
        $this->perfil = new Perfil($this->conexion);
        $this->permiso = new Permiso( $this->conexion);
    }
    private function verificarCorreo($correo)
    {
        // Expresión regular para validar correos de Gmail y UNPA
        $gmailPattern = "/^[a-zA-Z0-9._%+-]+@gmail\.com$/";
        $uargPattern = "/^[a-zA-Z0-9._%+-]+@uarg\.unpa\.edu\.ar$/";

        // Validar correo electrónico
        if (preg_match($gmailPattern, $correo)) {
            return true;
        } elseif (preg_match($uargPattern, $correo)) {
            return true;
        } else {
            return false;
        }
    }

    public function obtenerTodosUsuarios($pagina)
    {
        $resultado = $this->usuario->obtenerTodosUsuarios($pagina);
        return $resultado;
    }

    public function obtenerUsuarioCorreo($correo)
    {
        $comprobar = $this->verificarCorreo($correo);
        if(!$comprobar) return null;
        $this->usuario->setEmail($correo);
        $resultado = $this->usuario->obtenerUsuarioEmail();
        if(!$resultado) return null;
        return $resultado;
    }

    public function iniciarSesion($data)
    {
        if (empty($data["correo"])) return null;
        $correo = $data["correo"];
        $comprobar = $this->verificarCorreo($correo);
        if(!$comprobar) return null;

        $this->usuario->setEmail($correo);
        $resultado = $this->usuario->obtenerUsuarioEmail();
        if(!$resultado) return null;

        $token = generarJWT($resultado);
        return $token;
        
    }

    public function bloquearModificacion($nombre, $id_nombre, $token)
    {
        $resultado = Bloquear::bloquearModificacion($nombre, $id_nombre, $token);
        return $resultado;
    }
    public function desbloquearModificacionUsuario($id_nombre)
    {
        $resultado = Bloquear::bloquearModificacion("usuario", $id_nombre);
        return $resultado;
    }

    public function obtenerUsuarioId($id, $token)
    {
        if (is_numeric($id)) {
            $bloqueado = $this->bloquearModificacion("usuario", $id, $token);
            $resultado = $this->usuario->obtenerUsuarioId($id);
            $this->perfil->setNombre($resultado["nombre_perfil"]);
            $resultado["bloqueado"] = $bloqueado["bloqueado"];
            return $resultado;
        } else {
            return null;
        }
    }


    public function crearUsuario($data)
    {
        $comprobar = $this->verificarCorreo($data["correo"]) && !empty($data["nombre"] && !empty($data["perfil"]));
        if ($comprobar) {
            $this->usuario->setNombre($data["nombre"]);
            $this->usuario->setEmail($data["correo"]);
            $resultado = $this->usuario->crearUsuario();
            vincularTabla::crearVinculo($this->conexion, "usuario_perfil", "id_usuario", "id_perfil", $resultado, $data["perfil"]);
            return !empty($resultado);
        } else {
            return false;
        }
    }

    public function actualizarUsuario($id, $data)
    {
        $comprobar = $this->verificarCorreo($data["correo"]) && !empty($data["nombre"] && !empty($data["perfil"]));
        if ($comprobar) {
            $this->usuario->setNombre($data["nombre"]);
            $this->usuario->setEmail($data["correo"]);
            $resultado = $this->usuario->actualizarUsuario($id);
            vincularTabla::modificarVinculo($this->conexion, "usuario_perfil", "id_usuario", "id_perfil", $id, $data["perfil"]);
            return $resultado;
        } else {
            return false;
        }
    }

    public function eliminarUsuario($id)
    {
        if (is_numeric($id)) {
            vincularTabla::eliminarVinculo($this->conexion, "usuario_perfil", "id_usuario", $id);
            vincularTabla::eliminarVinculo($this->conexion, "proyecto_participante", "id_usuario", $id);
            vincularTabla::eliminarVinculo($this->conexion, "participante_riesgo", "id_usuario", $id);
            vincularTabla::eliminarVinculo($this->conexion, "participante_tarea", "id_usuario", $id);
            vincularTabla::modificarVinculo($this->conexion, "evaluacion", "id_usuario", "id_usuario", $id, NULL);
            vincularTabla::modificarVinculo($this->conexion, "incidencia", "id_usuario", "id_usuario", $id, NULL);
            $this->usuario->setNombre(null);
            $this->usuario->setEmail(null);
            $resultado = $this->usuario->eliminarUsuario($id);
            return $resultado;
        } else {
            return false;
        }
    }

    public function obtenerTodosPerfiles()
    {
        $resultado = $this->perfil->obtenerTodosPerfiles();

        return $resultado;
    }

    public function obtenerPerfilId($id)
    {
        if (is_numeric($id)) {
            $resultado = $this->perfil->obtenerPerfilId($id);
            $permisos = $this->perfil->obtenerPermisosPerfil();
            $resultado["permisos"] = $permisos;
            return $resultado;
        } else {
            return null;
        }
    }


    public function crearPerfil($data)
    {
        $comprobar = !empty($data["nombre"] && !empty($data["permisos"]));
        if ($comprobar) {
            $this->perfil->setNombre($data["nombre"]);
            $this->perfil->setPermisos($data["permisos"]);
            $resultado = $this->perfil->crearPerfil();
            foreach ($data["permisos"] as $permiso) {
                vincularTabla::crearVinculo($this->conexion, "perfil_permiso", "id_perfil", "id_permiso", $resultado, $permiso);
            }
            return !empty($resultado);
        } else {
            return false;
        }
    }

    public function actualizarPerfil($id, $data)
    {
        $comprobar = !empty($data["nombre"] && !empty($data["permisos"]));
        if ($comprobar) {
            $this->perfil->setNombre($data["nombre"]);
            $resultado = $this->perfil->actualizarPerfil($id);
            vincularTabla::eliminarVinculo($this->conexion, "perfil_permiso", "id_perfil", $id);
            foreach ($data["permisos"] as $permiso) {
                vincularTabla::crearVinculo($this->conexion, "perfil_permiso", "id_perfil", "id_permiso", $id, $permiso);
            }
            return $resultado;
        } else {
            return false;
        }
    }

    public function eliminarPerfil($id)
    {
        if (is_numeric($id)) {
            vincularTabla::eliminarVinculo($this->conexion, "perfil_permiso", "id_perfil", $id);
            vincularTabla::eliminarVinculo($this->conexion, "usuario_perfil", "id_perfil", $id);
            $this->perfil->setNombre(null);
            $this->perfil->setPermisos(null);
            $resultado = $this->perfil->eliminarPerfil($id);
            return $resultado;
        } else {
            return false;
        }
    }

    public function obtenerTodosPermisos()
    {
        $resultado = $this->permiso->obtenerTodosPermisos();
        return $resultado;
    }

    public function obtenerUsuariosNombre($nombre)
    {
        if (!empty($nombre)) {
            $this->usuario->setNombre($nombre);
            $resultado = $this->usuario->obtenerUsuariosNombre();
            return $resultado;
        } else {
            return null;
        }
    }

    public function obtenerUsuariosNombreEqual($nombre)
    {
        if (!empty($nombre)) {
            $this->usuario->setNombre($nombre);
            $resultado = $this->usuario->obtenerUsuariosNombreEqual();
            return $resultado;
        } else {
            return null;
        }
    }

    public function obtenerIdUsuarioNombre($nombre)
    {
        $comprobar = !empty($nombre);
        if ($comprobar) {
            $this->usuario->setNombre($nombre);
            $resultado = $this->usuario->obtenerIdUsuarioNombre();
            return $resultado;
        } else {
            return null;
        }
    }

    public function obtenerPerfilNombre($nombre)
    {
        $comprobar = !empty($nombre);
        if ($comprobar) {
            $this->perfil->setNombre($nombre);
            $resultado = $this->perfil->obtenerPerfilNombre();
            return $resultado;
        } else {
            return null;
        }
    }

}

<?php
require_once __DIR__ . "/../models/proyecto.php";
require_once __DIR__ . "/../models/iteracion.php";
require_once __DIR__ . "/../models/vincularTabla.php";
require_once __DIR__ . "/../../config/BDConexion.php";
require_once __DIR__ . "/gestorUsuario.php";
require_once __DIR__ . "/gestorRiesgo.php";

class GestorProyecto
{
    private $conexion, $proyecto, $iteracion;

    function __construct()
    {
        $this->conexion = BDConexion::getInstancia();
        $this->proyecto = new Proyecto($this->conexion);
        $this->conexion->set_charset("utf8");
        $this->iteracion = new Iteracion($this->conexion);
    }

    public function obtenerTodosProyecto()
    {
        $resultado = $this->proyecto->obtenerTodosProyecto();
        return $resultado;
    }

    public function obtenerTodosProyectoPaginado($pagina, $orden)
    {
        $resultado = $this->proyecto->obtenerTodosProyectoPaginado($pagina, $orden);
        return $resultado;
    }

    public function obtenerTodosProyectoLider($correo)
    {
        $resultado = $this->proyecto->obtenerTodosProyectoLider($correo);
        return $resultado;
    }

    public function obtenerTodosProyectoLiderPaginado($correo, $pagina)
    {
        $resultado = $this->proyecto->obtenerTodosProyectoLiderPaginado($correo, $pagina);
        return $resultado;
    }

    public function obtenerTodosProyectoDesarrollador($correo)
    {
        $resultado = $this->proyecto->obtenerTodosProyectoDesarrollador($correo);
        return $resultado;
    }

    public function obtenerTodosProyectoDesarrolladorPaginado($correo, $pagina)
    {
        $resultado = $this->proyecto->obtenerTodosProyectoDesarrolladorPaginado($correo, $pagina);
        return $resultado;
    }

    public function obtenerProyectoId($id_proyecto)
    {
        $resultado = $this->proyecto->obtenerProyectoId($id_proyecto);
        $categorias = $this->proyecto->obtenerCategoriaProyectoId($id_proyecto);
        $participantes = $this->proyecto->obtenerParticipanteProyectoId($id_proyecto);
        $iteraciones = $this->proyecto->obtenerIteracionProyectoId($id_proyecto);
        $resultado["categorias"] = $categorias;
        $resultado["participantes"] = $participantes;
        $resultado["iteraciones"] = $iteraciones;
        return $resultado;
    }

    public function obtenerParticipanteNombre($nombre)
    {
        $controladorUsuario = new GestorUsuario();
        $response = $controladorUsuario->obtenerUsuariosNombre($nombre);
            return $response;

    }

    public function obtenerCategoriasGenerales()
    {
        $controladorRiesgo = new GestorRiesgo();
        $response = $controladorRiesgo->obtenerCategoriasGenerales();
        return $response;
    }

    public function crearProyecto($data)
    {
        $this->proyecto->setFechaInicio(null);
        $this->proyecto->setFechaFin(null);
        $comprobar = !empty($data["nombre"] && !empty($data["descripcion"])) && !empty($data["estado"]);
        if ($comprobar) {
            $this->proyecto->setNombre($data["nombre"]);
            $this->proyecto->setDescripcion($data["descripcion"]);
            $this->proyecto->setEstado($data["estado"]);
            if (!empty($data["fecha_inicio"])) {
                $this->proyecto->setFechaInicio($data["fecha_inicio"]);
                $this->proyecto->setFechaFin($data["fecha_fin"]);
            }
            $id_proyecto = $this->proyecto->crearProyecto();
            if (!empty($data["participantes"])) {
                foreach ($data["participantes"] as $participante) {
                    vincularTabla::crearVinculoAtributo($this->conexion, "proyecto_participante", "id_proyecto", "id_usuario", "rol", $id_proyecto, $participante["id_usuario"], $participante["rol"]);
                }
            }
            if (!empty($data["categorias"])) {
                foreach ($data["categorias"] as $categoria) {
                    $id_categoria = $categoria["id_categoria"];
                    vincularTabla::crearVinculo($this->conexion, "proyecto_categoria", "id_proyecto", "id_categoria", $id_proyecto, $id_categoria);
                }
            }

            if (!empty($data["iteraciones"])) {
                foreach ($data["iteraciones"] as $iteracion) {
                    $this->iteracion->setNombre($iteracion["nombre"]);
                    $this->iteracion->setFechaInicio($iteracion["fecha_inicio"]);
                    $this->iteracion->setFechaFin($iteracion["fecha_fin"]);
                    $this->iteracion->crearIteracion($id_proyecto);
                }
            }
            return $id_proyecto > 0;
        } else {
            return false;
        }
    }

    public function actualizarProyecto($id_proyecto, $data)
    {
        $this->proyecto->setFechaInicio(null);
        $this->proyecto->setFechaFin(null);
        $comprobar = !empty($data["nombre"] && !empty($data["descripcion"])) && !empty($data["estado"]);
        if ($comprobar) {
            vincularTabla::eliminarVinculo($this->conexion, "proyecto_participante", "id_proyecto", $id_proyecto);
            $this->proyecto->setNombre($data["nombre"]);
            $this->proyecto->setDescripcion($data["descripcion"]);
            $this->proyecto->setEstado($data["estado"]);

            if (!empty($data["fecha_inicio"])) {
                $this->proyecto->setFechaInicio($data["fecha_inicio"]);
                $this->proyecto->setFechaFin($data["fecha_fin"]);
            }

            $resultado = $this->proyecto->actualizarProyecto($id_proyecto);
            if (!empty($data["participantes"])) {
                foreach ($data["participantes"] as $participante) {
                    vincularTabla::crearVinculoAtributo($this->conexion, "proyecto_participante", "id_proyecto", "id_usuario", "rol", $id_proyecto, $participante["id_usuario"], $participante["rol"]);
                }
            }

            if (!empty($data["iteraciones_eliminadas"])) {
                foreach ($data["iteraciones_eliminadas"] as $iteracion) {
                    $this->iteracion->eliminarIteracion($iteracion["id_iteracion"]);
                }
            }

            if (!empty($data["iteraciones"])) {
                foreach ($data["iteraciones"] as $iteracion) {
                    $this->iteracion->setNombre($iteracion["nombre"]);
                    $this->iteracion->setFechaInicio($iteracion["fecha_inicio"]);
                    $this->iteracion->setFechaFin($iteracion["fecha_fin"]);
                    if (!empty($iteracion["id_iteracion"])) {
                        $this->iteracion->actualizarIteracion($iteracion["id_iteracion"], $id_proyecto);
                    } else {
                        $this->iteracion->crearIteracion($id_proyecto);
                    }
                }
            }
            return $resultado;
        } else {
            return false;
        }
    }

    public function actualizarIteracion($id_proyecto, $data){
        $comprobar = !empty($data["nombre"]) && !empty($data["fecha_inicio"]) && !empty($data["fecha_fin"]) && !empty($data["id_iteracion"]);
        if ($comprobar) {
            $this->iteracion->setNombre($data["nombre"]);
            $this->iteracion->setFechaInicio($data["fecha_inicio"]);
            $this->iteracion->setFechaFin($data["fecha_fin"]);
            $this->iteracion->actualizarIteracion($data["id_iteracion"], $id_proyecto);
            $ultima_iteracion = $this->obtenerUltimaIteracion($id_proyecto);
            $fecha      = new DateTime($data["fecha_fin"]);
            $inicio     = new DateTime($ultima_iteracion["fecha_inicio"]);
            $fin        = new DateTime($ultima_iteracion["fecha_fin"]);
            if (!($fecha >= $inicio && $fecha <= $fin)){
                $this->proyecto->setEstado("activo");
                $this->proyecto->setFechaFin($data["fecha_fin"]);
                $this->proyecto->actualizarEstadoFechaFin($id_proyecto);
            }
            return true;
        } else {
            return false;
        }

    }

    public function obtenerIteracionActual($id_proyecto)
    {
        $fecha_actual = date("Y-m-d");
        $resultado = $this->proyecto->obtenerIteracionActual($id_proyecto, $fecha_actual);
        return $resultado;
    }

    public function obtenerIteracionesPaginado($id_proyecto, $pagina)
    {
        $resultado = $this->iteracion->obtenerIteracionesPaginado($id_proyecto, $pagina);
        return $resultado;
    }

    public function crearIteracion($id_proyecto, $data)
    {
        $comprobar = !empty($data["nombre"] && !empty($data["fecha_inicio"])) && !empty($data["fecha_fin"]);
        if ($comprobar) {
            $this->iteracion->setNombre($data["nombre"]);
            $this->iteracion->setFechaInicio($data["fecha_inicio"]);
            $this->iteracion->setFechaFin($data["fecha_fin"]);
            $resultado = $this->iteracion->crearIteracion($id_proyecto);
            $this->proyecto->setEstado("activo");
            $this->proyecto->setFechaFin($data["fecha_fin"]);
            $this->proyecto->actualizarEstadoFechaFin($id_proyecto);
            return $resultado;
        }else {
            return -1;
        }

    }

    public function obtenerUltimaIteracion($id_proyecto)
    {
        $resultado = $this->proyecto->obtenerUltimaIteracion($id_proyecto);
        return $resultado;
    }

    public function obtenerUltimasIteraciones($id_proyecto)
    {
        $resultado = $this->proyecto->obtenerUltimasIteraciones($id_proyecto, date("Y-m-d"));
        return $resultado;
    }

    public function modificarEstadoProyecto($id_proyecto, $estado)
    {
        $iteracion = $this->proyecto->obtenerUltimaIteracion($id_proyecto);
        switch ($estado) {
            case 'activo':
                $this->proyecto->setFechaFin($iteracion["fecha_fin"]??null);
                break;
            case 'inactivo':
                $this->proyecto->setFechaFin($iteracion["fecha_fin"]??null);
                break;
            case 'abandonado':
                $this->proyecto->setFechaFin(date("Y-m-d"));
                break;
            case 'finalizado':
                $this->proyecto->setFechaFin(date("Y-m-d"));
                break;
            default:
                $this->proyecto->setFechaFin($iteracion["fecha_fin"]);
                break;
        }
        $this->proyecto->setEstado($estado);
        $resultado = $this->proyecto->modificarEstadoProyecto($id_proyecto);
        return $resultado;
    }

    public function obtenerRolUsuarioProyecto($id_proyecto, $id_usuario){
        $resultado = $this->proyecto->obtenerRolUsuarioProyecto($id_proyecto, $id_usuario);
        if(!$resultado) return null;
        return $resultado["rol"];
    }
}
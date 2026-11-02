<?php
require_once __DIR__ . "/../models/categoria.php";
require_once __DIR__ . "/../models/riesgo.php";
require_once __DIR__ . "/../models/evaluacion.php";
require_once __DIR__ . "/../models/plan.php";
require_once __DIR__ . "/../models/tarea.php";
require_once __DIR__ . "/../models/incidencia.php";
require_once __DIR__ . "/../models/vincularTabla.php";
require_once __DIR__ . "/../../config/BDConexion.php";

class GestorRiesgo
{
    private $conexion;
    private $riesgo, $categoria, $evaluacion, $plan, $tarea, $incidencia;

    function __construct()
    {
        $this->conexion = BDConexion::getInstancia();
        $this->categoria = new Categoria($this->conexion);
        $this->riesgo = new Riesgo($this->conexion);
        $this->evaluacion = new Evaluacion($this->conexion);
        $this->plan = new Plan($this->conexion);
        $this->tarea = new Tarea($this->conexion);
        $this->incidencia = new Incidencia($this->conexion);
        $this->conexion->set_charset("utf8");
    }

    public function obtenerCategoriasGenerales()
    {
        $resultado = $this->categoria->obtenerCategoriasGenerales();
        return $resultado;
    }

    public function obtenerCategorias($pagina)
    {
        $resultado = $this->categoria->obtenerCategorias($pagina);
        return $resultado;
    }

    public function obtenerCategoriaId($id)
    {
        $resultado = $this->categoria->obtenerCategoriaId($id);
        return $resultado;
    }


    public function obtenerRiesgoProyecto($id_proyecto)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $resultado = null;
        if (!empty($iteracion)) {
            $resultado = $this->riesgo->obtenerRiesgoProyecto($id_proyecto, $iteracion["id_iteracion"]);
        } else {
            $resultado = $this->riesgo->obtenerRiesgoProyecto($id_proyecto, $ultima_iteracion["id_iteracion"]);
        }
        if (!empty($resultado)) {
            $id_iteracion = isset($iteracion["id_iteracion"]) ? $iteracion["id_iteracion"] : $ultima_iteracion["id_iteracion"];
            foreach ($resultado as &$riesgo) {
                $riesgo["planes_realizado"] = $this->obtenerCantidadPlanes($id_proyecto, $riesgo["id_riesgo"], $id_iteracion);
            }
        }
        return $resultado;
    }

    public function obtenerRiesgoProyectoPorPagina($id_proyecto, $pagina, $orden)
    {
        $iteracion_actual = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion_actual) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion_actual["id_iteracion"];
        $resultado = null;
        $resultado = $this->riesgo->obtenerRiesgoProyectoPorPagina($id_proyecto, $iteracion_utilizada, $pagina, $orden);
        if (!empty($resultado["riesgos"])) {
            foreach ($resultado["riesgos"] as &$riesgo) {
                $riesgo["planes_realizado"] = $this->obtenerCantidadPlanes($id_proyecto, $riesgo["id_riesgo"], $iteracion_utilizada);
            }
        }
        return $resultado;
    }

    public function crearRiesgo($id_proyecto, $data)
    {
        $comprobar = !empty($data["descripcion"]) && !empty($data["categoria"]) && !empty($data["responsables"]) && is_numeric($data["categoria"]);
        if ($comprobar) {
            $this->riesgo->setFactorRiesgo(null);
            $this->riesgo->setDescripcion($data["descripcion"]);
            $id_riesgo = $this->riesgo->crearRiesgo($id_proyecto, $data["categoria"]);
            foreach ($data["responsables"] as $id_usuario) {
                vincularTabla::crearVinculoRiesgo($this->conexion, "participante_riesgo", "id_usuario", "id_riesgo", "id_proyecto", $id_usuario, $id_riesgo, $id_proyecto);
            }
            return $id_riesgo > 0;
        } else {
            return false;
        }
    }

    public function eliminarRiesgo($id_proyecto, $id_riesgo)
    {
        vincularTabla::eliminarVinculoRiesgo($this->conexion, "participante_riesgo", "id_proyecto", "id_riesgo", $id_proyecto, $id_riesgo);
        vincularTabla::eliminarVinculoRiesgo($this->conexion, "evaluacion", "id_proyecto", "id_riesgo", $id_proyecto, $id_riesgo);
        vincularTabla::eliminarVinculoRiesgo($this->conexion, "plan", "id_proyecto", "id_riesgo", $id_proyecto, $id_riesgo);
        // $this->categoria->setEstado("inactivo");
        $resultado = $this->riesgo->eliminarRiesgo($id_proyecto, $id_riesgo);
        return $resultado;
    }



    public function crearEvaluacion($id_proyecto, $id_riesgo, $data)
    {
        $comprobar = !empty($data["descripcion"]) && !empty($data["impacto"]) && !empty($data["probabilidad"]) && is_numeric($data["impacto"]) && is_numeric($data["probabilidad"]) && !empty("responsable") && !empty($data["id_iteracion"]);
        if ($comprobar) {
            $this->evaluacion->setDescripcion($data["descripcion"]);
            $this->evaluacion->setImpacto($data["impacto"]);
            $this->evaluacion->setProbabilidad($data["probabilidad"]);
            $this->evaluacion->setFechaRealizacion(date("Y-m-d H:i:s"));
            $id_evaluacion = $this->evaluacion->crearEvaluacion($data["responsable"], $id_riesgo, $id_proyecto, $data["id_iteracion"]);
            $factorRiesgo = $data["impacto"] * $data["probabilidad"];
            $this->riesgo->setFactorRiesgo($factorRiesgo);
            $this->riesgo->actualizarFactorRiesgo($id_riesgo, $id_proyecto);
            return $id_evaluacion > 0;
        } else {
            return false;
        }
    }

    public function actualizarEvaluacion($id_evaluacion, $id_riesgo, $id_proyecto, $data)
    {
        $comprobar = !empty($data["descripcion"]) && !empty($data["impacto"]) && !empty($data["probabilidad"]) && is_numeric($data["impacto"]) && is_numeric($data["probabilidad"]) && !empty("responsable");
        if ($comprobar) {
            $this->evaluacion->setDescripcion($data["descripcion"]);
            $this->evaluacion->setImpacto($data["impacto"]);
            $this->evaluacion->setProbabilidad($data["probabilidad"]);
            $this->evaluacion->setFechaRealizacion(date("Y-m-d H:i:s"));
            $this->evaluacion->actualizarEvaluacion($id_evaluacion, $data["responsable"]);
            $factorRiesgo = $data["impacto"] * $data["probabilidad"];
            $this->riesgo->setFactorRiesgo($factorRiesgo);
            $this->riesgo->actualizarFactorRiesgo($id_riesgo, $id_proyecto);
            return true;
        } else {
            return false;
        }
    }

    public function actualizarRiesgo($id_riesgo, $data, $id_proyecto)
    {
        $comprobar = !empty($data["descripcion"] && !empty($data["categoria"])) && !empty($data["responsables"]);
        if ($comprobar) {
            vincularTabla::eliminarVinculoRiesgo($this->conexion, "participante_riesgo", "id_proyecto", "id_riesgo", $id_proyecto, $id_riesgo);
            $this->riesgo->setDescripcion($data["descripcion"]);
            $resultado = $this->riesgo->actualizarRiesgo($id_riesgo, $data["categoria"], $id_proyecto);
            foreach ($data["responsables"] as $id_usuario) {
                vincularTabla::crearVinculoRiesgo($this->conexion, "participante_riesgo", "id_usuario", "id_riesgo", "id_proyecto", $id_usuario, $id_riesgo, $id_proyecto);
            }
            return $resultado;
        } else {
            return false;
        }
    }

    public function obtenerRiesgoId($id_proyecto, $id_riesgo)
    {
        $resultado = $this->riesgo->obtenerRiesgoId($id_proyecto, $id_riesgo);
        $responsables = $this->riesgo->obtenerParticipantesRiesgo($id_proyecto, $id_riesgo);
        foreach ($responsables as $responsable) {
            $resultado["responsables"][] = $responsable["id_usuario"];
        }

        return $resultado;
    }


    public function obtenerIteracionActual($id_proyecto)
    {
        $controladorProyecto = new GestorProyecto();
        $response = $controladorProyecto->obtenerIteracionActual($id_proyecto);
        return $response;

    }

    public function obtenerIteracionUltima($id_proyecto)
    {
        $controladorProyecto = new GestorProyecto();
        $response = $controladorProyecto->obtenerUltimaIteracion($id_proyecto);
        return $response;

    }

    public function obtenerCantidadPlanes($id_proyecto, $id_riesgo, $id_iteracion)
    {
        $resultado = $this->riesgo->obtenerCantidadPlanes($id_proyecto, $id_riesgo, $id_iteracion);
        if (!empty($resultado)) {
            return $resultado;
        } else {
            return ["id_riesgo" => $id_riesgo, "total_minimizacion" => 0, "total_mitigacion" => 0, "total_contingencia" => 0];
        }
    }


    public function crearPlan($id_proyecto, $id_riesgo, $data)
    {
        $comprobar = !empty($data["descripcion"]) && !empty($data["tipo"]) && !empty($data["tareas"]) && !empty($data["id_iteracion"]);
        if ($comprobar) {
            $this->plan->setTipo($data["tipo"]);
            $this->plan->setDescripcion($data["descripcion"]);
            $id_plan = $this->plan->crearPlan($id_proyecto, $id_riesgo, $data["id_iteracion"]);
            foreach ($data["tareas"] as $tarea) {
                $this->tarea->setNombre($tarea["nombre"]);
                $this->tarea->setDescripcion($tarea["descripcion"]);
                $this->tarea->setEstado($tarea["estado"]);
                $this->tarea->setFechaInicio($tarea["fecha_inicio"]);
                $this->tarea->setFechaFin($tarea["fecha_fin"]);
                $id_tarea = $this->tarea->crearTarea($id_plan);
                foreach ($tarea["responsables"] as $responsable) {
                    vincularTabla::crearVinculo($this->conexion, "participante_tarea", "id_usuario", "id_tarea", $responsable["id_usuario"], $id_tarea);
                }
            }
            return $id_plan > 0;
        } else {
            return false;
        }
    }

    public function obtenerPlanesIteracionActual($id_proyecto)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        if (!empty($iteracion)) {
            $planes = $this->plan->obtenerPlanesIteracionActual($id_proyecto, $iteracion["id_iteracion"]);
            return $planes;
        } else {
            return [];
        }
    }

    public function obtenerPlanesIteracionActualPaginado($id_proyecto, $pagina)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        if (!empty($iteracion)) {
            $planes = $this->plan->obtenerPlanesIteracionActualPaginado($id_proyecto, $iteracion["id_iteracion"], $pagina);
            return $planes;
        } else {
            return [];
        }
    }

    public function obtenerPlanesIteracionAnteriores($id_proyecto)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion["id_iteracion"];
        $planes = $this->plan->obtenerPlanesAnteriores($id_proyecto, $iteracion_utilizada);
        return $planes;
    }

    public function obtenerPlanesIteracionAnterioresPaginado($id_proyecto, $pagina)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion["id_iteracion"];
        $planes = $this->plan->obtenerPlanesIteracionAnterioresPaginado($id_proyecto, $iteracion_utilizada, $pagina);
        return $planes;
    }

    public function obtenerEvaluacionesActuales($id_proyecto)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        if (!empty($iteracion)) {
            $evaluaciones = $this->evaluacion->obtenerEvaluacionesActualesProyecto($id_proyecto, $iteracion["id_iteracion"]);
            return $evaluaciones;
        } else {
            return [];
        }
    }

    public function obtenerEvaluacionesActualesPaginado($id_proyecto, $pagina)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        if (!empty($iteracion)) {
            $evaluaciones = $this->evaluacion->obtenerEvaluacionesActualesProyectoPaginado($id_proyecto, $iteracion["id_iteracion"], $pagina);
            return $evaluaciones;
        } else {
            return ["evaluaciones" => [], "totalPaginas" => 0];
        }
    }

    public function obtenerEvaluacionesActualesDesarrolladorPaginado($id_proyecto, $pagina, $id_usuario)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        if (!empty($iteracion)) {
            $evaluaciones = $this->evaluacion->obtenerEvaluacionesActualesDesarrolladorProyectoPaginado($id_proyecto, $iteracion["id_iteracion"], $pagina, $id_usuario);
            return $evaluaciones;
        } else {
            return ["evaluaciones" => [], "totalPaginas" => 0];
        }
    }

    public function obtenerEvaluacionId($id_evaluacion)
    {
        $resultado = $this->evaluacion->obtenerEvaluacionId($id_evaluacion);
        return $resultado;
    }

    public function obtenerEvaluacionesAnteriores($id_proyecto)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion["id_iteracion"];
        $evaluaciones = $this->evaluacion->obtenerEvaluacionesAnterioresProyecto($id_proyecto, $iteracion_utilizada);
        return $evaluaciones;
    }

    public function obtenerEvaluacionesAnterioresPaginado($id_proyecto, $pagina)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion["id_iteracion"];
        $evaluaciones = $this->evaluacion->obtenerEvaluacionesAnterioresProyectoPaginado($id_proyecto, $iteracion_utilizada, $pagina);
        return $evaluaciones;
    }

    public function obtenerEvaluacionesAnterioresDesarrolladorProyectoPaginado($id_proyecto, $pagina, $id_usuario)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion["id_iteracion"];
        $evaluaciones = $this->evaluacion->obtenerEvaluacionesAnterioresDesarrolladorProyectoPaginado($id_proyecto, $iteracion_utilizada, $pagina, $id_usuario);
        return $evaluaciones;
    }


    public function obtenerPlanId($id_plan, $id_proyecto)
    {
        $resultado = $this->plan->obtenerPlanId($id_plan);
        $resultado["riesgo"] = $this->obtenerRiesgoId($resultado["id_proyecto"], $resultado["id_riesgo"]);
        $resultado["planes_realizado"] = $this->obtenerCantidadPlanes($id_proyecto, $resultado["id_riesgo"], $resultado["id_iteracion"]);
        $resultado["tareas"] = $this->plan->obtenerTareasPlan($id_plan);
        foreach ($resultado["tareas"] as &$tarea) {
            $tarea["responsables"] = $this->tarea->obtenerResponsablesTarea($tarea["id_tarea"]);
        }
        return $resultado;
    }

    public function actualizarPlan($id_plan, $data)
    {
        $comprobar = !empty($data["descripcion"]) && !empty($data["tipo"]) && !empty($data["tareas"]);
        if ($comprobar) {
            $this->plan->setTipo($data["tipo"]);
            $this->plan->setDescripcion($data["descripcion"]);
            $this->plan->actualizarPlan($id_plan);
            if (!empty($data["tareas_eliminadas"])) {
                foreach ($data["tareas_eliminadas"] as $tarea) {
                    vincularTabla::eliminarVinculo($this->conexion, "participante_tarea", "id_tarea", $tarea["id_tarea"]);
                    $this->tarea->eliminarTarea($tarea["id_tarea"]);
                }
            }
            foreach ($data["tareas"] as $tarea) {
                if (!empty($tarea["id_tarea"])) {
                    $this->tarea->setNombre($tarea["nombre"]);
                    $this->tarea->setDescripcion($tarea["descripcion"]);
                    $this->tarea->setEstado($tarea["estado"]);
                    $this->tarea->setFechaInicio($tarea["fecha_inicio"]);
                    $this->tarea->setFechaFin($tarea["fecha_fin"]);
                    $this->tarea->setFechaFinReal($tarea["fecha_fin_real"]);
                    $this->tarea->actualizarTarea($tarea["id_tarea"]);
                    vincularTabla::eliminarVinculo($this->conexion, "participante_tarea", "id_tarea", $tarea["id_tarea"]);
                    foreach ($tarea["responsables"] as $responsable) {
                        vincularTabla::crearVinculo($this->conexion, "participante_tarea", "id_usuario", "id_tarea", $responsable["id_usuario"], $tarea["id_tarea"]);
                    }

                } else {
                    $this->tarea->setNombre($tarea["nombre"]);
                    $this->tarea->setDescripcion($tarea["descripcion"]);
                    $this->tarea->setEstado($tarea["estado"]);
                    $this->tarea->setFechaInicio($tarea["fecha_inicio"]);
                    $this->tarea->setFechaFin($tarea["fecha_fin"]);
                    $id_tarea = $this->tarea->crearTarea($id_plan);
                    foreach ($tarea["responsables"] as $responsable) {
                        vincularTabla::crearVinculo($this->conexion, "participante_tarea", "id_usuario", "id_tarea", $responsable["id_usuario"], $id_tarea);
                    }
                }
            }
            return $id_plan > 0;
        } else {
            return false;
        }
    }

    public function eliminarPlan($id_plan)
    {
        vincularTabla::eliminarVinculo($this->conexion, "participante_tarea", "id_tarea", $id_plan);
        vincularTabla::eliminarVinculo($this->conexion, "tarea", "id_plan", $id_plan);
        $resultado = $this->plan->eliminarPlan($id_plan);
        return $resultado;
    }

    public function obtenerIncidenciasProyecto($id_proyecto)
    {
        $resultado = $this->incidencia->obtenerTodasIncidencia($id_proyecto);
        return $resultado;
    }

    public function obtenerIncidenciasProyectoPaginado($id_proyecto, $pagina)
    {
        $resultado = $this->incidencia->obtenerTodasIncidenciaPaginado($id_proyecto, $pagina);
        return $resultado;
    }

    public function obtenerInformeIncidencia($id_incidencia)
    {
        $resultado = $this->incidencia->obtenerDatosIncidencia($id_incidencia);
        return $resultado;
    }

    public function crearCategoria($data)
    {
        $comprobar = !empty($data["descripcion"]) && !empty($data["nombre"]);
        if ($comprobar) {
            $this->categoria->setNombre($data["nombre"]);
            $this->categoria->setDescripcion($data["descripcion"]);
            $id_categoria = $this->categoria->crearCategoria();
            return $id_categoria > 0;
        } else {
            return false;
        }
    }

    public function obtenerCategoriaNombre($nombre)
    {
        $resultado = $this->categoria->obtenerCategoriaNombre($nombre);
        return $resultado;
    }

    public function eliminarCategoria($id_categoria)
    {
        $this->categoria->setEstado("inactivo");
        $resultado = $this->categoria->eliminarCategoria($id_categoria);
        return $resultado;
    }

    public function actualizarCategoria($id_categoria, $data)
    {
        $comprobar = !empty($data["descripcion"]) && !empty($data["nombre"]) && !empty($data["version"]);
        if ($comprobar) {
            $this->categoria->setEstado("inactivo");
            $this->categoria->eliminarCategoria($id_categoria);
            $this->categoria->setNombre($data["nombre"]);
            $this->categoria->setDescripcion($data["descripcion"]);
            $this->categoria->setVersion($data["version"] + 1);
            $id_categoria = $this->categoria->actualizarCategoria();
            return $id_categoria > 0;
        } else {
            return false;
        }
    }

    public function obtenerDatosRiesgo($id_proyecto)
    {
        $iteracion_actual = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion_actual) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion_actual["id_iteracion"];
        $iteraciones = $this->obtenerUltimasIteraciones($id_proyecto);

        $categorias = $this->categoria->obtenerCategoriasProyecto($id_proyecto);
        $datosTelaraña = $this->categoria->obtenerDatosGraficoTelaraña($id_proyecto);

        $evaluaciones = [];
        $evaluacion_tongji = $this->evaluacion->obtenerMatrizTongji($id_proyecto, $iteracion_utilizada);

        foreach ($iteraciones as $iteracion) {
            $cantidad_riesgo = $this->evaluacion->obtenerCantidadRiesgoFactor($id_proyecto, $iteracion["id_iteracion"]);
            array_push($evaluaciones, $cantidad_riesgo);
        }


        $resultado = $this->riesgo->obtenerDatosRiesgo($id_proyecto, $iteracion_utilizada);

        $multiplicador = (100 / $resultado["cantidad_categoria"]) / 100;

        foreach ($datosTelaraña as &$categoria) {
            $categoria["total_riesgo"] = $categoria["total_riesgo"] * $multiplicador;
        }

        return ["datos_proyecto" => $resultado, "iteraciones" => $iteraciones, "categorias" => $categorias, "datos_evaluacion" => $evaluaciones, "evaluacion_tongji" => $evaluacion_tongji, "datos_telaraña" => $datosTelaraña];

    }
    public function obtenerDatosInformeSeguimiento($id_proyecto)
    {
        return $this->riesgo->obtenerDatosInformeSeguimiento($id_proyecto);
    }

    public function obtenerTareas($id_proyecto, $id_usuario)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion["id_iteracion"];
        $resultado = $this->tarea->obtenerTareas($id_proyecto, $iteracion_utilizada, $id_usuario);
        return $resultado;
    }

    public function obtenerTareasPaginado($id_proyecto, $id_usuario, $pagina)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion["id_iteracion"];
        $resultado = $this->tarea->obtenerTareasPaginado($id_proyecto, $iteracion_utilizada, $id_usuario, $pagina);
        return $resultado;
    }

    public function obtenerTareasDesarrolladorPaginado($id_proyecto, $id_usuario, $pagina)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        $ultima_iteracion = $this->obtenerIteracionUltima($id_proyecto);
        $iteracion_utilizada = empty($iteracion) ? empty($ultima_iteracion) ? 0 : $ultima_iteracion["id_iteracion"] : $iteracion["id_iteracion"];
        $resultado = $this->tarea->obtenerTareasDesarrolladorPaginado($id_proyecto, $iteracion_utilizada, $id_usuario, $pagina);
        return $resultado;
    }


    public function completarTarea($id_tarea)
    {
        $this->tarea->setEstado(1);
        $this->tarea->setFechaFinReal(date("Y-m-d"));
        $resultado = $this->tarea->completarTarea($id_tarea);
        return $resultado;
    }

    public function desmarcarTarea($id_tarea)
    {
        $this->tarea->setEstado(0);
        $this->tarea->setFechaFinReal(null);
        $resultado = $this->tarea->completarTarea($id_tarea);
        return $resultado;
    }

    public function obtenerUltimasIteraciones($id_proyecto)
    {
        $controladorProyecto = new GestorProyecto();
        $response = $controladorProyecto->obtenerUltimasIteraciones($id_proyecto);
        return $response;
    }

    public function obtenerDatosTareasInforme($id_proyecto)
    {
        $iteracion = $this->obtenerIteracionActual($id_proyecto);
        if (empty($iteracion)) {
            $iteracion = $this->obtenerIteracionUltima($id_proyecto);
        }
        $riesgos = $this->riesgo->obtenerRiesgoProyecto($id_proyecto, $iteracion["id_iteracion"]);
        foreach ($riesgos as &$riesgo) {
            $planes = $this->plan->obtenerPlanesRiesgoProyecto($id_proyecto, $riesgo["id_riesgo"], $iteracion["id_iteracion"]);
            foreach ($planes as &$plan) {
                if (isset($plan["id_plan"])) {
                    $plan["tareas"] = $this->plan->obtenerTareasPlanInforme($plan["id_plan"]);
                } else {
                    $plan["tareas"] = [];
                }
            }
            $riesgo["planes"] = $planes;
        }
        return $riesgos;

    }

    public function crearIncidencia($id_proyecto, $data)
    {
        $comprobar = !empty($data["descripcion"]) && !empty($data["gravedad"]) && !empty($data["responsable"]) && !empty($data["riesgo"]) && is_numeric($data["riesgo"]);
        if ($comprobar) {
            $this->incidencia->setGravedad($data["gravedad"]);
            $this->incidencia->setDescripcion($data["descripcion"]);
            $id_incidencia = $this->incidencia->crearIncidencia($id_proyecto, $data["riesgo"], $data["responsable"]);
            return $id_incidencia > 0;
        } else {
            return false;
        }
    }

    public function obtenerIncidenciaId($id_incidencia)
    {
        $resultado = $this->incidencia->obtenerIncidenciaId($id_incidencia);
        return $resultado;
    }

    public function obtenerTareaId($id_tarea)
    {
        $resultado = $this->tarea->obtenerTareaId($id_tarea);
        return $resultado;
    }

    public function eliminarIncidencia($id_incidencia)
    {
        $resultado = $this->incidencia->eliminarIncidencia($id_incidencia);
        return $resultado;
    }

    public function obtenerIdProyecto($id_tarea){
        $resultado = $this->tarea->obtenerIdProyecto($id_tarea);
        if(!$resultado) return null;
        return $resultado["id_proyecto"];
    }
}

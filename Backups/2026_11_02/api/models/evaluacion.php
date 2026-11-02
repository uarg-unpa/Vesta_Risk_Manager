<?php
class Evaluacion
{
    private $descripcion, $impacto, $probabilidad, $fecha_realizacion;
    private $conexion;

    function __construct($conexion, $descripcion = null, $impacto = null, $probabilidad = null, $fecha_realizacion = null)
    {
        $this->conexion = $conexion;
        $this->descripcion = $descripcion;
        $this->impacto = $impacto;
        $this->probabilidad = $probabilidad;
        $this->fecha_realizacion = $fecha_realizacion;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getImpacto()
    {
        return $this->impacto;
    }

    public function getProbabilidad()
    {
        return $this->probabilidad;
    }

    public function getFechaRealizacion()
    {
        return $this->fecha_realizacion;
    }

    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }

    public function setImpacto($impacto)
    {
        $this->impacto = $impacto;
    }

    public function setProbabilidad($probabilidad)
    {
        $this->probabilidad = $probabilidad;
    }

    public function setFechaRealizacion($fecha_realizacion)
    {
        $this->fecha_realizacion = $fecha_realizacion;
    }

    public function crearEvaluacion($id_usuario, $id_riesgo, $id_proyecto, $id_iteracion)
    {
        $query = "INSERT INTO evaluacion (descripcion, impacto, probabilidad, fecha_realizacion, id_usuario, id_riesgo, id_proyecto, id_iteracion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("siisiiii", $this->descripcion, $this->impacto, $this->probabilidad, $this->fecha_realizacion, $id_usuario, $id_riesgo, $id_proyecto, $id_iteracion);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear la evaluacion: " . $stmt->error);
            return -1;
        }
    }

    public function actualizarEvaluacion($id_evaluacion, $id_usuario)
    {
        $query = "UPDATE evaluacion SET descripcion = ?, impacto = ?, probabilidad = ?, fecha_realizacion = ?, id_usuario = ? WHERE id_evaluacion = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("siisii", $this->descripcion, $this->impacto, $this->probabilidad, $this->fecha_realizacion, $id_usuario, $id_evaluacion);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al actualizar la evaluacion: " . $stmt->error);
            return -1;
        }
    }

    public function obtenerCantidadRiesgoFactor($id_proyecto, $id_iteracion)
    {
        $query = "SELECT 
                    niveles.nivel_riesgo,
                    COUNT(e.id_evaluacion) AS cantidad
                FROM 
                    (
                        SELECT 'bajo' AS nivel_riesgo
                        UNION ALL
                        SELECT 'medio'
                        UNION ALL
                        SELECT 'alto'
                        UNION ALL
                        SELECT 'crítico'
                    ) AS niveles
                LEFT JOIN (
                    SELECT 
                        CASE 
                            WHEN (impacto * probabilidad) < 9 THEN 'bajo'
                            WHEN (impacto * probabilidad) >= 9 AND (impacto * probabilidad) < 36 THEN 'medio'
                            WHEN (impacto * probabilidad) >= 36 AND (impacto * probabilidad) < 64 THEN 'alto'
                            ELSE 'crítico'
                        END AS nivel_riesgo,
                        id_evaluacion
                    FROM evaluacion
                    WHERE id_proyecto = ? AND id_iteracion = ?
                ) AS e ON e.nivel_riesgo = niveles.nivel_riesgo
                GROUP BY 
                    niveles.nivel_riesgo
                ORDER BY 
                    FIELD(niveles.nivel_riesgo, 'bajo', 'medio', 'alto', 'crítico')";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_proyecto, $id_iteracion);
        $stmt->execute();
        $riesgos_factor = $stmt->get_result();

        $resultado = [];
        while ($fila = $riesgos_factor->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerEvaluacionesActualesProyecto($id_proyecto, $id_iteracion)
    {
        $query = "SELECT r.id_riesgo, e.id_evaluacion, e.descripcion, e.impacto, e.probabilidad 
                FROM evaluacion e 
                inner join riesgo r on e.id_riesgo = r.id_riesgo and e.id_proyecto = r.id_proyecto 
                where e.id_iteracion = ? and e.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $evaluaciones = $stmt->get_result();
        $resultado = [];
        while ($fila = $evaluaciones->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerEvaluacionesActualesProyectoPaginado($id_proyecto, $id_iteracion, $pagina)
    {
        $cantidad_evaluaciones = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_evaluaciones;
        }

        $query = "SELECT r.id_riesgo, e.id_evaluacion, e.descripcion, e.impacto, e.probabilidad 
                FROM evaluacion e 
                inner join riesgo r on e.id_riesgo = r.id_riesgo and r.id_proyecto = e.id_proyecto 
                where e.id_iteracion = ? and e.id_proyecto = ?
                limit $cantidad_evaluaciones offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $evaluaciones = $stmt->get_result();
        $resultado = [];
        while ($fila = $evaluaciones->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginasActuales($cantidad_evaluaciones, $id_proyecto, $id_iteracion);
        return ["evaluaciones" => $resultado, "totalPaginas" => $totalPaginas];
    }

    public function obtenerEvaluacionesActualesDesarrolladorProyectoPaginado($id_proyecto, $id_iteracion, $pagina, $id_usuario)
    {
        $cantidad_evaluaciones = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_evaluaciones;
        }

        $query = "SELECT r.id_riesgo, e.id_evaluacion, e.descripcion, e.impacto, e.probabilidad 
                FROM evaluacion e 
                inner join riesgo r on e.id_riesgo = r.id_riesgo and r.id_proyecto = e.id_proyecto 
                where e.id_iteracion = ? and e.id_proyecto = ? and e.id_usuario = ?
                limit $cantidad_evaluaciones offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("iii", $id_iteracion, $id_proyecto, $id_usuario);
        $stmt->execute();
        $evaluaciones = $stmt->get_result();
        $resultado = [];
        while ($fila = $evaluaciones->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginasActualesDesarrollador($cantidad_evaluaciones, $id_proyecto, $id_iteracion, $id_usuario);
        return ["evaluaciones" => $resultado, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadPaginasActuales($cantidadEvaluaciones, $id_proyecto, $id_iteracion)
    {
        $totalQuery = $this->conexion->query("SELECT count(*) as total from evaluacion e 
        inner join riesgo r on e.id_riesgo = r.id_riesgo and e.id_proyecto = r.id_proyecto 
        where e.id_proyecto = $id_proyecto and e.id_iteracion = $id_iteracion");
        $totalEvaluaciones = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalEvaluaciones / $cantidadEvaluaciones);

        return $totalPaginas;
    }

    private function obtenerCantidadPaginasActualesDesarrollador($cantidadEvaluaciones, $id_proyecto, $id_iteracion, $id_usuario)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from evaluacion e 
        inner join riesgo r on e.id_riesgo = r.id_riesgo and e.id_proyecto = r.id_proyecto 
        where e.id_proyecto = $id_proyecto and e.id_iteracion = $id_iteracion and e.id_usuario = $id_usuario");
        $totalEvaluaciones = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalEvaluaciones / $cantidadEvaluaciones);

        return $totalPaginas;
    }

    public function obtenerEvaluacionesAnterioresProyectoPaginado($id_proyecto, $id_iteracion, $pagina)
    {
        $cantidad_evaluaciones = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_evaluaciones;
        }

        $query = "SELECT r.id_riesgo, e.id_evaluacion, e.descripcion, e.impacto, e.probabilidad 
                FROM evaluacion e 
                inner join riesgo r on e.id_riesgo = r.id_riesgo and r.id_proyecto = e.id_proyecto 
                where e.id_iteracion < ? and e.id_proyecto = ?
                limit $cantidad_evaluaciones offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $evaluaciones = $stmt->get_result();
        $resultado = [];
        while ($fila = $evaluaciones->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginasAntiguas($cantidad_evaluaciones, $id_proyecto, $id_iteracion);
        return ["evaluaciones" => $resultado, "totalPaginas" => $totalPaginas];
    }

    public function obtenerEvaluacionesAnterioresDesarrolladorProyectoPaginado($id_proyecto, $id_iteracion, $pagina, $id_usuario)
    {
        $cantidad_evaluaciones = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_evaluaciones;
        }

        $query = "SELECT r.id_riesgo, e.id_evaluacion, e.descripcion, e.impacto, e.probabilidad 
                FROM evaluacion e 
                inner join riesgo r on e.id_riesgo = r.id_riesgo and e.id_proyecto = r.id_proyecto 
                where e.id_iteracion < ? and e.id_proyecto = ? and e.id_usuario = ?
                limit $cantidad_evaluaciones offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("iii", $id_iteracion, $id_proyecto, $id_usuario);
        $stmt->execute();
        $evaluaciones = $stmt->get_result();
        $resultado = [];
        while ($fila = $evaluaciones->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginasAntiguasDesarrollador($cantidad_evaluaciones, $id_proyecto, $id_iteracion, $id_usuario);
        return ["evaluaciones" => $resultado, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadPaginasAntiguasDesarrollador($cantidadEvaluaciones, $id_proyecto, $id_iteracion, $id_usuario)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from evaluacion e 
        inner join riesgo r on e.id_riesgo = r.id_riesgo and e.id_proyecto = r.id_proyecto 
        where e.id_proyecto = $id_proyecto and e.id_iteracion < $id_iteracion and e.id_usuario = $id_usuario");
        $totalEvaluaciones = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalEvaluaciones / $cantidadEvaluaciones);

        return $totalPaginas;
    }

    private function obtenerCantidadPaginasAntiguas($cantidadEvaluaciones, $id_proyecto, $id_iteracion)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from evaluacion e 
        inner join riesgo r on e.id_riesgo = r.id_riesgo and e.id_proyecto = r.id_proyecto 
        where e.id_proyecto = $id_proyecto and e.id_iteracion < $id_iteracion");
        $totalEvaluaciones = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalEvaluaciones / $cantidadEvaluaciones);

        return $totalPaginas;
    }
    public function obtenerMatrizTongji($id_proyecto, $id_iteracion)
    {
        $query = "SELECT r.id_riesgo as label, e.impacto as x, e.probabilidad as y FROM evaluacion e 
                inner join riesgo r on e.id_riesgo = r.id_riesgo and e.id_proyecto = r.id_proyecto 
                where e.id_iteracion = ? and e.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $evaluaciones = $stmt->get_result();
        $resultado = [];
        while ($fila = $evaluaciones->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerEvaluacionesAnterioresProyecto($id_proyecto, $id_iteracion)
    {
        $query = "SELECT r.id_riesgo, e.id_evaluacion, e.descripcion, e.impacto, e.probabilidad FROM evaluacion e 
                inner join riesgo r on e.id_riesgo = r.id_riesgo and e.id_proyecto = r.id_proyecto 
                where e.id_iteracion < ? and e.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $evaluaciones = $stmt->get_result();
        $resultado = [];
        while ($fila = $evaluaciones->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerEvaluacionId($id_evaluacion)
    {
        $query = "SELECT e.*, r.id_riesgo, r.descripcion as descripcion_riesgo,i.nombre as nombre_iteracion, i.fecha_inicio as fecha_inicio_iteracion, i.fecha_fin as fecha_fin_iteracion, u.nombre as nombre_usuario FROM evaluacion e 
        inner join riesgo r on e.id_riesgo = r.id_riesgo and r.id_proyecto = e.id_proyecto 
        inner join iteracion i on e.id_iteracion = i.id_iteracion
        left join usuario u on e.id_usuario = u.id_usuario
        where e.id_evaluacion = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_evaluacion);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

}

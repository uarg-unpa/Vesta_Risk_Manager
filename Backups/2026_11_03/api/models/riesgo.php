<?php
class Riesgo
{
    private $descripcion, $factor_riesgo, $fecha_creacion;
    private $conexion;

    function __construct($conexion, $descripcion = null, $factor_riesgo = null, $fecha_creacion = null)
    {
        $this->conexion = $conexion;
        $this->descripcion = $descripcion;
        $this->factor_riesgo = $factor_riesgo;
        $this->fecha_creacion = $fecha_creacion;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getFactorRiesgo()
    {
        return $this->factor_riesgo;
    }

    public function getFechaCreacion()
    {
        return $this->fecha_creacion;
    }

    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }

    public function setFactorRiesgo($factor_riesgo)
    {
        $this->factor_riesgo = $factor_riesgo;
    }

    public function setFechaCreacion($fecha_creacion)
    {
        $this->fecha_creacion = $fecha_creacion;
    }

    public function obtenerRiesgoProyecto($id_proyecto, $id_iteracion)
    {
        $query = "SELECT 
                        r.id_riesgo, 
                        r.descripcion, 
                        r.factor_riesgo, 
                        c.nombre AS nombre_categoria,
                        GROUP_CONCAT(DISTINCT u.nombre ORDER BY u.nombre SEPARATOR ', ') AS responsables,
                        COUNT(DISTINCT e.id_evaluacion) AS evaluado
                    FROM riesgo r
                    INNER JOIN categoria c ON r.id_categoria = c.id_categoria
                    LEFT JOIN participante_riesgo pr ON r.id_riesgo = pr.id_riesgo
                    LEFT JOIN usuario u ON pr.id_usuario = u.id_usuario
                    LEFT JOIN evaluacion e ON r.id_riesgo = e.id_riesgo AND e.id_iteracion = ?
                    WHERE r.id_proyecto = ?
                    GROUP BY r.id_riesgo, r.descripcion, r.factor_riesgo, c.nombre
                    ";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $riesgos = $stmt->get_result();
        $resultado = [];
        while ($fila = $riesgos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    private function obtenerOrden($orden)
    {
        switch ($orden) {
            case 1:
                return "r.id_riesgo asc";
            case 2:
                return "factor_riesgo desc";
            case 3:
                return "factor_riesgo asc";
            default:
                return "r.id_riesgo asc";
        }
    }

    public function obtenerRiesgoProyectoPorPagina($id_proyecto, $id_iteracion, $pagina, $orden)
    {
        $cantidad_riesgos = 5;
        $offset = 0;
        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_riesgos;
        }

        $ordenado = $this->obtenerOrden($orden);

        $ids = [];

        $queryIds = "SELECT id_riesgo, factor_riesgo
            FROM (
                SELECT r.id_riesgo,
                    CAST(eval.impacto AS UNSIGNED) * CAST(eval.probabilidad AS UNSIGNED) AS factor_riesgo
                FROM riesgo r
                LEFT JOIN (
                    SELECT e.id_riesgo,
                        e.impacto,
                        e.probabilidad,
                        e.id_iteracion,
                        ROW_NUMBER() OVER (PARTITION BY e.id_riesgo ORDER BY e.fecha_realizacion DESC) AS rn
                    FROM evaluacion e
                    where e.id_iteracion = ?
                ) AS eval ON eval.id_riesgo = r.id_riesgo AND eval.rn = 1
                WHERE r.id_proyecto = ?
            ) AS r
            ORDER BY $ordenado
        LIMIT $cantidad_riesgos OFFSET $offset
        ";

        $stmtId = $this->conexion->prepare($queryIds);
        $stmtId->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmtId->execute();
        $resultado = $stmtId->get_result();
        while ($fila = $resultado->fetch_assoc()) {
            $ids[] = $fila['id_riesgo'];
        }
        if (count($ids) == 0) {
            return ["riesgos" => [], "totalPaginas" => 0];
        }

        $ids_string = implode(',', $ids);

        $query = "SELECT 
                        r.id_riesgo, 
                        r.descripcion, 
                        COALESCE(max(CAST(e.impacto AS UNSIGNED) * CAST(e.probabilidad AS UNSIGNED)), 0) AS factor_riesgo,
                        c.nombre AS nombre_categoria,
                        GROUP_CONCAT(DISTINCT u.nombre ORDER BY u.nombre SEPARATOR ', ') AS responsables,
                        COUNT(DISTINCT e.id_evaluacion) AS evaluado
                    FROM riesgo r
                    INNER JOIN categoria c ON r.id_categoria = c.id_categoria
                    LEFT JOIN participante_riesgo pr ON r.id_riesgo = pr.id_riesgo and pr.id_proyecto = r.id_proyecto
                    LEFT JOIN usuario u ON pr.id_usuario = u.id_usuario
                    LEFT JOIN evaluacion e ON r.id_riesgo = e.id_riesgo AND e.id_iteracion = ?
                    WHERE r.id_riesgo in ($ids_string) and r.id_proyecto = ?
                    GROUP BY r.id_riesgo, r.descripcion, c.nombre
                    order by $ordenado
                    ";

        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $riesgos = $stmt->get_result();
        $resultado = [];
        while ($fila = $riesgos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginas($cantidad_riesgos, $id_proyecto);

        return ["riesgos" => $resultado, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadPaginas($cantidadRiesgos, $id_proyecto)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from riesgo where id_proyecto = $id_proyecto");
        $totalRiesgo = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalRiesgo / $cantidadRiesgos);

        return $totalPaginas;
    }

    public function obtenerParticipantesRiesgo($id_proyecto, $id_riesgo)
    {
        $query = "SELECT u.* FROM participante_riesgo pr inner join usuario u on pr.id_usuario = u.id_usuario WHERE pr.id_riesgo = ? and pr.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_riesgo, $id_proyecto);
        $stmt->execute();
        $participantes = $stmt->get_result();

        $resultado = [];
        while ($fila = $participantes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function crearRiesgo($id_proyecto, $id_categoria)
    {
        $query_max = "SELECT MAX(id_riesgo) FROM riesgo WHERE id_proyecto = ?";
        $stmt_max = $this->conexion->prepare($query_max);
        $stmt_max->bind_param("i", $id_proyecto);
        $stmt_max->execute();
        $stmt_max->bind_result($id_riesgo);
        $stmt_max->fetch();
        $stmt_max->close();

        if ($id_riesgo === null) {
            $id_riesgo = 0;
        }
        $query = "INSERT INTO riesgo (id_riesgo, descripcion, id_categoria, id_proyecto) VALUES (?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($query);
        $nuevo_id = $id_riesgo + 1;
        $stmt->bind_param("isii", $nuevo_id, $this->descripcion, $id_categoria, $id_proyecto);

        if ($stmt->execute()) {
            return $nuevo_id;
        } else {
            throw new Exception("Error al crear el riesgo: " . $stmt->error);
        }
    }

    public function actualizarRiesgo($id_riesgo, $id_categoria, $id_proyecto)
    {
        $query = "UPDATE riesgo set descripcion = ?, id_categoria = ? where id_riesgo = ? and id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("siii", $this->descripcion, $id_categoria, $id_riesgo, $id_proyecto);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al actualizar el riesgo: " . $stmt->error);
            return false;
        }
    }

    public function eliminarRiesgo($id_proyecto, $id_riesgo)
    {
        $query = "DELETE from riesgo where id_proyecto = ? and id_riesgo = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_proyecto, $id_riesgo);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al eliminar el riesgo: " . $stmt->error);
            return false;
        }
    }


    public function obtenerRiesgoId($id_proyecto, $id_riesgo)
    {
        $query = "SELECT r.*, c.nombre as nombre_categoria FROM riesgo r 
        inner join categoria c on r.id_categoria = c.id_categoria 
        where r.id_riesgo = ? and r.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_riesgo, $id_proyecto);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

    public function actualizarFactorRiesgo($id_riesgo, $id_proyecto)
    {
        $query = "UPDATE riesgo SET factor_riesgo= ? WHERE id_riesgo = ? and id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("iii", $this->factor_riesgo, $id_riesgo, $id_proyecto);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al actualizar el factor de riesgo: " . $stmt->error);
            return false;
        }
    }


    public function obtenerCantidadPlanes($id_proyecto, $id_riesgo, $id_iteracion)
    {
        $query = "SELECT r.id_riesgo,
                SUM(CASE WHEN p.tipo = 'minimizacion' THEN 1 ELSE 0 END) AS total_minimizacion,
                SUM(CASE WHEN p.tipo = 'mitigacion' THEN 1 ELSE 0 END) AS total_mitigacion,
                SUM(CASE WHEN p.tipo = 'contingencia' THEN 1 ELSE 0 END) AS total_contingencia
                FROM riesgo r
                LEFT JOIN plan p ON r.id_riesgo = p.id_riesgo
                where p.id_iteracion = ? and r.id_riesgo = ? and r.id_proyecto = ?
                GROUP BY r.id_riesgo";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("iii", $id_iteracion, $id_riesgo, $id_proyecto);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

    public function obtenerDatosRiesgo($id_proyecto, $id_iteracion)
    {
        $consultas = [
            // "total_riesgos"=>[
            //     "query" => "Select count(DISTINCT id_riesgo) from riesgo where id_proyecto = ?",
            //     "params"=>["i", $id_proyecto]
            // ], 
            "riesgos_activos" => [
                "query" => "Select count(Distinct e.id_evaluacion) from evaluacion e inner join riesgo r on r.id_riesgo = e.id_riesgo where e.id_proyecto = ? and e.id_iteracion = ? and r.factor_riesgo > 9",
                "params" => ["ii", $id_proyecto, $id_iteracion]
            ],
            "evaluaciones_pendientes" => [
                "query" => "SELECT COUNT(DISTINCT r.id_riesgo) FROM riesgo r LEFT join evaluacion e on r.id_riesgo = e.id_riesgo and e.id_iteracion = ? where r.id_proyecto = ? and e.id_evaluacion is null",
                "params" => ["ii", $id_iteracion, $id_proyecto]
            ],
            "planes_accion" => [
                "query" => "select count(DISTINCT p.id_plan) from riesgo r inner join plan p on p.id_riesgo = r.id_riesgo and p.id_iteracion = ? where r.id_proyecto = ?",
                "params" => ["ii", $id_iteracion, $id_proyecto]
            ],
            "riesgos_atencion" => [
                "query" => "SELECT COUNT(DISTINCT r.id_riesgo) FROM riesgo r
                            INNER JOIN evaluacion e ON r.id_riesgo = e.id_riesgo AND e.id_iteracion = ?
                            WHERE r.factor_riesgo > 35 and r.id_proyecto = ?
                            AND NOT EXISTS (
                                SELECT 1 
                                FROM plan p 
                                WHERE p.id_riesgo = r.id_riesgo 
                                AND p.id_iteracion = ?
                            )",
                "params" => ["iii", $id_iteracion, $id_proyecto, $id_iteracion]
            ],
            "cantidad_categoria" => [
                "query" => "SELECT COUNT(c.id_categoria) FROM categoria c inner join proyecto_categoria pc on c.id_categoria = pc.id_categoria WHERE pc.id_proyecto = ?",
                "params" => ["i", $id_proyecto]
            ]

        ];

        $resultados = [];
        foreach ($consultas as $clave => $consulta) {
            $stmt = $this->conexion->prepare($consulta["query"]);

            // Si hay parámetros, los vinculamos
            if (!empty($consulta["params"])) {
                $stmt->bind_param(...$consulta["params"]);
            }

            $stmt->execute();
            $stmt->bind_result($total);
            $stmt->fetch();
            $resultados[$clave] = $total;
            $stmt->close();
        }
        return $resultados;
    }


    public function obtenerDatosInformeSeguimiento($id_proyecto)
    {
        $query = "SELECT r.id_riesgo, r.descripcion, r.factor_riesgo,
        CASE
            WHEN r.factor_riesgo is null then 'No se ha iniciado'
            WHEN r.factor_riesgo < 9 then 'Cerrado'
            WHEN r.factor_riesgo >= 9 then 'En curso' 
        END as estado,
        CASE
            WHEN r.factor_riesgo IS NULL THEN 'Desconocida'
            WHEN r.factor_riesgo < 9 THEN 'Nula'
            WHEN r.factor_riesgo >= 9 AND r.factor_riesgo < 36 THEN 'Media'
            WHEN r.factor_riesgo >= 36 AND r.factor_riesgo < 64 THEN 'Alta'
            WHEN r.factor_riesgo >= 64 THEN 'Crítica'
        END as prioridad,
        GROUP_CONCAT(DISTINCT u.nombre ORDER BY u.nombre SEPARATOR ', ') AS responsables
        from riesgo r
        left join participante_riesgo pr on r.id_riesgo = pr.id_riesgo and pr.id_proyecto = r.id_proyecto
        left join usuario u on pr.id_usuario = u.id_usuario
        where r.id_proyecto = ?
        GROUP BY r.id_riesgo, r.descripcion, r.factor_riesgo, estado, prioridad
        ";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();

        $riesgos = $stmt->get_result();

        $resultado = ["riesgos" => []];
        while ($fila = $riesgos->fetch_assoc()) {
            $resultado["riesgos"][] = $fila;
        }

        $resultado["estado"] = $this->obtenerCantidadEstado($id_proyecto);
        $resultado["prioridad"] = $this->obtenerCantidadPrioridad($id_proyecto);

        return $resultado;
    }

    private function obtenerCantidadEstado($id_proyecto)
    {
        $query = "SELECT COUNT(r.id_riesgo) AS total
        FROM (
            SELECT 'No se ha iniciado' AS estado
            UNION ALL
            SELECT 'Cerrado'
            UNION ALL
            SELECT 'En curso'
        ) AS e
        LEFT JOIN (
            SELECT 
                CASE
                    WHEN r.factor_riesgo IS NULL THEN 'No se ha iniciado'
                    WHEN r.factor_riesgo < 9 THEN 'Cerrado'
                    WHEN r.factor_riesgo >= 9 THEN 'En curso' 
                END AS estado,
                r.id_riesgo
            FROM riesgo r
            WHERE r.id_proyecto = ?
        ) AS r ON r.estado = e.estado
        GROUP BY e.estado
        ORDER BY FIELD(e.estado, 'No se ha iniciado', 'En curso', 'Cerrado')";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        $riesgos = $stmt->get_result();
        $resultado = [];
        while ($fila = $riesgos->fetch_assoc()) {
            $resultado[] = $fila["total"];
        }
        return $resultado;
    }

    private function obtenerCantidadPrioridad($id_proyecto)
    {
        $query = "SELECT COUNT(r.id_riesgo) AS total
        FROM (
            SELECT 'Desconocida' AS prioridad
            UNION ALL
            SELECT 'Nula'
            UNION ALL
            SELECT 'Media'
            UNION ALL
            SELECT 'Alta'
            UNION ALL
            SELECT 'Critica'
        ) AS p
        LEFT JOIN (
            SELECT 
                CASE
                    WHEN r.factor_riesgo IS NULL THEN 'Desconocida'
                    WHEN r.factor_riesgo < 9 THEN 'Nula'
                    WHEN r.factor_riesgo >= 9 AND r.factor_riesgo < 36 THEN 'Media'
                    WHEN r.factor_riesgo >= 36 AND r.factor_riesgo < 64 THEN 'Alta'
                    WHEN r.factor_riesgo >= 64 THEN 'Crítica'
                END as prioridad,
                r.id_riesgo
            FROM riesgo r
            WHERE r.id_proyecto = ?
        ) AS r ON r.prioridad = p.prioridad
        GROUP BY p.prioridad
        ORDER BY FIELD(p.prioridad, 'Desconocida', 'Nula', 'Media', 'Alta', 'Critica')";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        $riesgos = $stmt->get_result();
        $resultado = [];
        while ($fila = $riesgos->fetch_assoc()) {
            $resultado[] = $fila["total"];
        }
        return $resultado;
    }
}

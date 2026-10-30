<?php
class Plan
{
    private $tipo, $descripcion;
    private $conexion;
    function __construct($conexion, $tipo = null, $descripcion = null)
    {
        $this->conexion = $conexion;
        $this->tipo = $tipo;
        $this->descripcion = $descripcion;
    }

    public function getTipo()
    {
        return $this->tipo;
    }
    public function setTipo($tipo)
    {
        $this->tipo = $tipo;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }


    public function crearPlan($id_proyecto, $id_riesgo, $id_iteracion)
    {
        $query = "INSERT INTO plan (descripcion, tipo, id_riesgo, id_proyecto, id_iteracion) values (?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssiii", $this->descripcion, $this->tipo, $id_riesgo, $id_proyecto, $id_iteracion);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear el plan: " . $stmt->error);
            return -1;
        }
    }

    public function obtenerPlanesIteracionActual($id_proyecto, $id_iteracion)
    {
        $query = "SELECT p.id_plan, p.descripcion, p.tipo, r.id_riesgo, r.factor_riesgo FROM plan p 
                inner join riesgo r on p.id_riesgo = r.id_riesgo 
                where p.id_iteracion = ? and p.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $planes = $stmt->get_result();
        $resultado = [];
        while ($fila = $planes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerPlanesIteracionActualPaginado($id_proyecto, $id_iteracion, $pagina)
    {
        $cantidad_planes = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_planes;
        }

        $query = "SELECT p.id_plan, p.descripcion, p.tipo, r.id_riesgo, r.factor_riesgo FROM plan p 
                inner join riesgo r on p.id_riesgo = r.id_riesgo and p.id_proyecto = r.id_proyecto 
                where p.id_iteracion = ? and p.id_proyecto = ?
                limit $cantidad_planes offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $planes = $stmt->get_result();
        $resultado = [];
        while ($fila = $planes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginasActuales($cantidad_planes, $id_proyecto, $id_iteracion);
        return ["planes" => $resultado, "totalPaginas" => $totalPaginas];
    }
    private function obtenerCantidadPaginasActuales($cantidad_planes, $id_proyecto, $id_iteracion)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from plan p 
        where p.id_proyecto = $id_proyecto and p.id_iteracion = $id_iteracion");
        $totalPlanes = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalPlanes / $cantidad_planes);

        return $totalPaginas;
    }


    public function obtenerPlanesRiesgoProyecto($id_proyecto, $id_riesgo, $id_iteracion)
    {
        $query = "SELECT 
        tipos.tipo,
        p.id_plan
    FROM (
        SELECT 'Mitigación' AS tipo
        UNION ALL
        SELECT 'Minimización'
        UNION ALL
        SELECT 'Contingencia'
    ) AS tipos
    LEFT JOIN plan p 
        ON p.tipo = tipos.tipo
        AND p.id_proyecto = ?
        AND p.id_riesgo = ?
        AND p.id_iteracion = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("iii", $id_proyecto, $id_riesgo, $id_iteracion);
        $stmt->execute();
        $planes = $stmt->get_result();
        $resultado = [];
        while ($fila = $planes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }


    public function obtenerPlanesAnteriores($id_proyecto, $id_iteracion)
    {
        $query = "SELECT p.descripcion, p.tipo, r.id_riesgo, r.factor_riesgo FROM plan p 
                inner join riesgo r on p.id_riesgo = r.id_riesgo 
                where p.id_iteracion < ? and p.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $planes = $stmt->get_result();
        $resultado = [];
        while ($fila = $planes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerPlanesIteracionAnterioresPaginado($id_proyecto, $id_iteracion, $pagina)
    {
        $cantidad_planes = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_planes;
        }

        $query = "SELECT p.id_plan, p.descripcion, p.tipo, r.id_riesgo, r.factor_riesgo FROM plan p 
                inner join riesgo r on p.id_riesgo = r.id_riesgo and p.id_proyecto = r.id_proyecto
                where p.id_iteracion < ? and p.id_proyecto = ?
                limit $cantidad_planes offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_iteracion, $id_proyecto);
        $stmt->execute();
        $planes = $stmt->get_result();
        $resultado = [];
        while ($fila = $planes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginasAnteriores($cantidad_planes, $id_proyecto, $id_iteracion);
        return ["planes" => $resultado, "totalPaginas" => $totalPaginas];
    }
    private function obtenerCantidadPaginasAnteriores($cantidad_planes, $id_proyecto, $id_iteracion)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from plan p 
        where p.id_proyecto = $id_proyecto and p.id_iteracion < $id_iteracion");
        $totalPlanes = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalPlanes / $cantidad_planes);

        return $totalPaginas;
    }

    public function obtenerPlanId($id_plan)
    {
        $query = "SELECT * FROM plan where id_plan = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_plan);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

    public function obtenerTareasPlan($id_plan)
    {
        $query = "SELECT * from tarea where id_plan = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_plan);
        $stmt->execute();
        $participantes = $stmt->get_result();

        $resultado = [];
        while ($fila = $participantes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerTareasPlanInforme($id_plan)
    {
        $query = "SELECT t.*, GROUP_CONCAT(distinct u.nombre order by u.nombre separator ', ') as responsables from tarea t
        inner join participante_tarea pt on t.id_tarea = pt.id_tarea
        inner join usuario u on u.id_usuario = pt.id_usuario 
        where id_plan = ?
        GROUP BY t.id_tarea
        ";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_plan);
        $stmt->execute();
        $participantes = $stmt->get_result();

        $resultado = [];
        while ($fila = $participantes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function actualizarPlan($id_plan)
    {
        $query = "UPDATE plan set descripcion = ?, tipo = ? where id_plan = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssi", $this->descripcion, $this->tipo, $id_plan);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al actualizar el plan: " . $stmt->error);
            return false;
        }
    }

    public function eliminarPlan($id_plan)
    {
        $query = "DELETE from plan where id_plan = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_plan);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al eliminar el plan: " . $stmt->error);
            return false;
        }
    }

}

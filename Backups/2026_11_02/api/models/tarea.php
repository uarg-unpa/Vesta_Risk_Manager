<?php
class Tarea
{
    private $nombre, $descripcion, $estado, $fecha_inicio, $fecha_fin, $fecha_fin_real;
    private $conexion;
    function __construct($conexion, $nombre = null, $descripcion = null, $estado = null, $fecha_inicio = null, $fecha_fin = null, $fecha_fin_real = null)
    {
        $this->conexion = $conexion;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->estado = $estado;
        $this->fecha_inicio = $fecha_inicio;
        $this->fecha_fin = $fecha_fin;
        $this->fecha_fin_real = $fecha_fin_real;
    }

    public function getNombre()
    {
        return $this->nombre;
    }
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }

    public function getEstado()
    {
        return $this->estado;
    }
    public function setEstado($estado)
    {
        $this->estado = $estado;
    }

    public function getFechaInicio()
    {
        return $this->fecha_inicio;
    }
    public function setFechaInicio($fecha_inicio)
    {
        $this->fecha_inicio = $fecha_inicio;
    }

    public function getFechaFin()
    {
        return $this->fecha_fin;
    }
    public function setFechaFin($fecha_fin)
    {
        $this->fecha_fin = $fecha_fin;
    }

    public function getFechaFinReal()
    {
        return $this->fecha_fin_real;
    }
    public function setFechaFinReal($fecha_fin_real)
    {
        $this->fecha_fin_real = $fecha_fin_real;
    }

    public function crearTarea($id_plan)
    {
        $query = "INSERT INTO tarea (nombre, descripcion, estado, fecha_inicio, fecha_fin, fecha_fin_real, id_plan) values (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssssssi", $this->nombre, $this->descripcion, $this->estado, $this->fecha_inicio, $this->fecha_fin, $this->fecha_fin_real, $id_plan);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear la tarea: " . $stmt->error);
            return -1;
        }
    }

    public function eliminarTarea($id_tarea)
    {
        $query = "DELETE FROM tarea WHERE id_tarea = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_tarea);

        if (!$stmt->execute()) {
            throw new Exception("Error al eliminar el usuario: " . $stmt->error);
            return false;
        } else {
            return true;
        }
    }

    public function obtenerResponsablesTarea($id_tarea)
    {
        $query = "SELECT u.* FROM tarea t 
                    inner join participante_tarea pr on pr.id_tarea = t.id_tarea 
                    inner join usuario u on pr.id_usuario = u.id_usuario
                    where t.id_tarea = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_tarea);
        $stmt->execute();
        $participantes = $stmt->get_result();

        $resultado = [];
        while ($fila = $participantes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }


    public function obtenerTareas($id_proyecto, $id_iteracion, $id_usuario)
    {
        $query = "SELECT t.*, CASE WHEN pt.id_usuario IS NOT NULL THEN 1 ELSE 0 END AS pertenece 
        from tarea t 
        inner join plan p on t.id_plan = p.id_plan
        left join participante_tarea pt on t.id_tarea = pt.id_tarea and pt.id_usuario = ? 
        where p.id_proyecto = ? and p.id_iteracion = ? 
        order by pertenece desc, t.fecha_inicio asc";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("iii", $id_usuario, $id_proyecto, $id_iteracion);
        $stmt->execute();
        $tareas = $stmt->get_result();
        $resultados = [];
        while ($fila = $tareas->fetch_assoc()) {
            $resultados[] = $fila;
        }
        return $resultados;
    }

    public function obtenerTareasPaginado($id_proyecto, $id_iteracion, $id_usuario, $pagina)
    {
        $cantidad_tareas = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_tareas;
        }

        $query = "SELECT t.*, CASE WHEN pt.id_usuario IS NOT NULL THEN 1 ELSE 0 END AS pertenece 
        from tarea t 
        inner join plan p on t.id_plan = p.id_plan
        left join participante_tarea pt on t.id_tarea = pt.id_tarea and pt.id_usuario = ? 
        where p.id_proyecto = ? and p.id_iteracion = ? 
        order by pertenece desc, t.fecha_inicio asc
        limit $cantidad_tareas offset $offset";

        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("iii", $id_usuario, $id_proyecto, $id_iteracion);
        $stmt->execute();

        $tareas = $stmt->get_result();
        $resultados = [];

        while ($fila = $tareas->fetch_assoc()) {
            $resultados[] = $fila;
        }

        $totalPaginas = $this->obtenerCantidadPaginas($cantidad_tareas, $id_proyecto, $id_iteracion);
        return ["tareas" => $resultados, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadPaginas($cantidadTareas, $id_proyecto, $id_iteracion)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from tarea t 
        inner join plan p on t.id_plan = p.id_plan
        where p.id_proyecto = $id_proyecto and p.id_iteracion = $id_iteracion");
        $totalTareas = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalTareas / $cantidadTareas);

        return $totalPaginas;
    }

    public function obtenerTareasDesarrolladorPaginado($id_proyecto, $id_iteracion, $id_usuario, $pagina)
    {
        $cantidad_tareas = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_tareas;
        }

        $query = "SELECT t.* 
        from tarea t 
        inner join plan p on t.id_plan = p.id_plan
        inner join participante_tarea pt on t.id_tarea = pt.id_tarea and pt.id_usuario = ? 
        where p.id_proyecto = ? and p.id_iteracion = ?
        order by estado asc, t.fecha_inicio asc
        limit $cantidad_tareas offset $offset";

        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("iii", $id_usuario, $id_proyecto, $id_iteracion);
        $stmt->execute();

        $tareas = $stmt->get_result();
        $resultados = [];

        while ($fila = $tareas->fetch_assoc()) {
            $resultados[] = $fila;
        }

        $totalPaginas = $this->obtenerCantidadDesarrolladorPaginas($cantidad_tareas, $id_proyecto, $id_iteracion, $id_usuario);
        return ["tareas" => $resultados, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadDesarrolladorPaginas($cantidadTareas, $id_proyecto, $id_iteracion, $id_usuario)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from tarea t 
        inner join plan p on t.id_plan = p.id_plan
        inner join participante_tarea pt on t.id_tarea = pt.id_tarea and pt.id_usuario = $id_usuario 
        where p.id_proyecto = $id_proyecto and p.id_iteracion = $id_iteracion");
        $totalTareas = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalTareas / $cantidadTareas);

        return $totalPaginas;
    }

    public function completarTarea($id_tarea)
    {
        $query = "UPDATE tarea set estado = ?, fecha_fin_real = ? where id_tarea = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssi", $this->estado, $this->fecha_fin_real, $id_tarea);
        if (!$stmt->execute()) {
            throw new Exception("Error al completar la tarea: " . $stmt->error);
            return false;
        } else {
            return true;
        }
    }

    public function desmarcarTarea($id_tarea)
    {
        $query = "UPDATE tarea set estado = ?, fecha_fin_real = ? where id_tarea = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssi", $this->estado, $this->fecha_fin_real, $id_tarea);
        if (!$stmt->execute()) {
            throw new Exception("Error al desmarcar la tarea: " . $stmt->error);
            return false;
        } else {
            return true;
        }
    }

    public function obtenerTareaId($id_tarea)
    {
        $query = "SELECT t.*,p.id_riesgo, p.tipo as tipo_plan, GROUP_CONCAT(distinct u.nombre order by u.nombre separator ', ') as responsables
        FROM tarea t 
        inner join plan p on t.id_plan = p.id_plan
        inner join participante_tarea pt on t.id_tarea = pt.id_tarea 
        inner join usuario u on pt.id_usuario = u.id_usuario
        where t.id_tarea = ?
        GROUP BY t.id_tarea
        ";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_tarea);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

    public function actualizarTarea($id_tarea)
    {
        $query = "UPDATE tarea set nombre = ?, descripcion =?, estado = ?, fecha_inicio = ?, fecha_fin = ?,  fecha_fin_real = ?  where id_tarea = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssssssi", $this->nombre, $this->descripcion, $this->estado, $this->fecha_inicio, $this->fecha_fin, $this->fecha_fin_real, $id_tarea);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al actualizar la tarea: " . $stmt->error);
            return false;
        }
    }

    public function obtenerIdProyecto($id_tarea){
        $query = "select p.id_proyecto from tarea t inner join plan p on t.id_plan = p.id_plan where t.id_tarea = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_tarea);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

}
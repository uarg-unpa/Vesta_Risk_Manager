<?php
class Iteracion
{
    private $nombre, $fecha_inicio, $fecha_fin;
    private $conexion;

    function __construct($conexion, $nombre = null, $fecha_inicio = null, $fecha_fin = null)
    {
        $this->conexion = $conexion;
        $this->nombre = $nombre;
        $this->fecha_inicio = $fecha_inicio;
        $this->fecha_fin = $fecha_fin;
    }

    public function getNombre()
    {
        return $this->nombre;
    }
    public function getFechaInicio()
    {
        return $this->fecha_inicio;
    }
    public function getFechaFin()
    {
        return $this->fecha_fin;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }
    public function setFechaInicio($fecha_inicio)
    {
        $this->fecha_inicio = $fecha_inicio;
    }
    public function setFechaFin($fecha_fin)
    {
        $this->fecha_fin = $fecha_fin;
    }

    public function obtenerIteracionesPaginado($id_proyecto, $pagina)
    {
        $cantidad_iteraciones = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_iteraciones;
        }
        
        $query = "SELECT * from iteracion where id_proyecto = ? order by id_iteracion desc limit $cantidad_iteraciones offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        $iteraciones = $stmt->get_result();
        $resultados = [];
        while ($fila = $iteraciones->fetch_assoc()) {
            $resultados[] = $fila;
        }

        $totalPaginas = $this->obtenerCantidadPaginasIteraciones($cantidad_iteraciones, $id_proyecto);

        return ["iteraciones" => $resultados, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadPaginasIteraciones($cantidad_iteracion, $id_proyecto)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from iteracion i 
        where i.id_proyecto = $id_proyecto");
        $totalTareas = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalTareas / $cantidad_iteracion);

        return $totalPaginas;
    }

    public function crearIteracion($id_proyecto)
    {
        $query = "INSERT INTO iteracion (nombre, fecha_inicio, fecha_fin, id_proyecto) VALUES (?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("sssi", $this->nombre, $this->fecha_inicio, $this->fecha_fin, $id_proyecto);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear el usuario: " . $stmt->error);
            return -1;
        }
    }

    public function actualizarIteracion($id_iteracion, $id_proyecto)
    {
        $query = "UPDATE iteracion SET nombre = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_iteracion = ? and id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("sssii", $this->nombre, $this->fecha_inicio, $this->fecha_fin, $id_iteracion, $id_proyecto);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al crear el usuario: " . $stmt->error);
            return false;
        }
    }

    public function eliminarIteracion($id_iteracion)
    {
        $query = "DELETE FROM iteracion WHERE id_iteracion = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_iteracion);

        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al eliminar el usuario: " . $stmt->error);
            return false;
        }
    }

}

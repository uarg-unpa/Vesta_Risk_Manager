<?php
class Incidencia
{
    private $gravedad, $descripcion;
    private $conexion;
    function __construct($conexion, $gravedad = null, $descripcion = null)
    {
        $this->conexion = $conexion;
        $this->gravedad = $gravedad;
        $this->descripcion = $descripcion;
    }

    public function getGravedad()
    {
        return $this->gravedad;
    }
    public function setGravedad($gravedad)
    {
        $this->gravedad = $gravedad;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }


    public function crearIncidencia($id_proyecto, $id_riesgo, $id_usuario)
    {
        $query = "INSERT INTO incidencia (descripcion, gravedad, id_riesgo, id_proyecto, id_usuario) values (?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssiii", $this->descripcion, $this->gravedad, $id_riesgo, $id_proyecto, $id_usuario);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear el plan: " . $stmt->error);
            return -1;
        }
    }
    public function obtenerDatosIncidencia($id_incidencia)
    {
        $query = "select u.email as responsable_email, pp.rol as responsable_rol, 
        r.descripcion as descripcion_riesgo, ur.nombre as responsable_riesgo, c.nombre as tipo_riesgo from incidencia i 
        inner join usuario u on i.id_usuario = u.id_usuario 
        inner join proyecto_participante pp on u.id_usuario = pp.id_usuario 
        inner join riesgo r on i.id_riesgo = r.id_riesgo
        inner join participante_riesgo pr on pr.id_riesgo = r.id_riesgo
        inner join usuario ur on ur.id_usuario = pr.id_usuario
        inner join categoria c on c.id_categoria = r.id_categoria
        where i.id_incidencia = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_incidencia);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }



    public function obtenerTodasIncidencia($id_proyecto)
    {
        $query = "select i.id_incidencia, i.descripcion, i.gravedad, i.fecha_ocurrencia, i.id_riesgo, 
        u.nombre as responsable_nombre from incidencia i 
        inner join usuario u on i.id_usuario = u.id_usuario 
        where i.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        $incidencias = $stmt->get_result();
        $resultado = [];
        while ($fila = $incidencias->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerTodasIncidenciaPaginado($id_proyecto, $pagina)
    {
        $cantidad_incidencias = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_incidencias;
        }

        $query = "select i.id_incidencia, i.descripcion, i.gravedad, i.fecha_ocurrencia, i.id_riesgo, 
        u.nombre as responsable_nombre from incidencia i 
        inner join usuario u on i.id_usuario = u.id_usuario 
        where i.id_proyecto = ?
        limit $cantidad_incidencias offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        $incidencias = $stmt->get_result();
        $resultado = [];
        while ($fila = $incidencias->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginas($cantidad_incidencias, $id_proyecto);
        return ["incidencias" => $resultado, "totalPaginas" => $totalPaginas];
    }
    private function obtenerCantidadPaginas($cantidadIncidencias, $id_proyecto)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from incidencia i 
        where i.id_proyecto = $id_proyecto");
        $totalIncidencias = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalIncidencias / $cantidadIncidencias);

        return $totalPaginas;
    }
    public function obtenerTodasIncidenciaUsuario($id_proyecto, $id_usuario)
    {
        $query = "select i.id_incidencia, i.descripcion, i.gravedad, i.fecha_ocurrencia, i.id_riesgo, u.nombre as responsable from incidencia i inner join usuario u on i.id_usuario = u.id_usuario where id_proyecto = ? and id_usuario = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_proyecto, $id_usuario);
        $stmt->execute();
        $incidencias = $stmt->get_result();
        $resultado = [];
        while ($fila = $incidencias->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function eliminarIncidencia($id_incidencia)
    {
        $query = "DELETE from incidencia where id_incidencia = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_incidencia);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al eliminar la incidencia: " . $stmt->error);
            return false;
        }
    }

    public function obtenerIncidenciaId($id_incidencia)
    {
        $query = "SELECT i.*, u.nombre as responsable_nombre 
        FROM incidencia i 
        inner join usuario u on i.id_usuario = u.id_usuario
        where i.id_incidencia = ?
        ";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_incidencia);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }
}
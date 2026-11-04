<?php
class Categoria
{
    private $nombre, $descripcion, $estado, $version;
    private $conexion;

    function __construct($conexion, $nombre = null, $descripcion = null, $estado = null, $version = null)
    {
        $this->conexion = $conexion;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->estado = $estado;
        $this->version = $version;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getVersion()
    {
        return $this->version;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }

    public function setEstado($estado)
    {
        $this->estado = $estado;
    }

    public function setVersion($version)
    {
        $this->version = $version;
    }

    public function obtenerCategoriasGenerales()
    {
        $categorias = $this->conexion->query("SELECT * FROM categoria where estado = 'activo'");
        $resultado = [];
        while ($fila = $categorias->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerCategoriasProyecto($id_proyecto)
    {
        $query = "SELECT c.nombre FROM categoria c inner join proyecto_categoria pc on c.id_categoria=pc.id_categoria where pc.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        $categorias = $stmt->get_result();
        $resultado = [];
        while ($fila = $categorias->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerDatosGraficoTelaraña($id_proyecto)
    {
        $query = "SELECT c.nombre, COALESCE(sum(r.factor_riesgo), 0) as total_riesgo  
                from categoria c
                inner join proyecto_categoria pc on c.id_categoria = pc.id_categoria 
                left join riesgo r on r.id_categoria = c.id_categoria and r.id_proyecto = ?
                group by c.id_categoria, c.nombre";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        $categorias = $stmt->get_result();
        $resultado = [];
        while ($fila = $categorias->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerCategorias($pagina)
    {
        $categoriaPorPagina = 10;
        $offset = 0;
        if ($pagina > 1) {
            $offset = ($pagina - 1) * $categoriaPorPagina;
        }

        $categorias = $this->conexion->query("SELECT * FROM categoria where estado = 'activo' limit $categoriaPorPagina offset $offset");
        $resultado = [];
        while ($fila = $categorias->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadCategoria($categoriaPorPagina);
        return ["categorias" => $resultado, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadCategoria($categoriaPorPagina)
    {
        $totalQuery = $this->conexion->query("select count(*) as total from categoria where estado = 'activo'");
        $totalCategoria = $totalQuery->fetch_assoc()['total'];
        $totalPaginas = ceil($totalCategoria / $categoriaPorPagina);

        return $totalPaginas;
    }

    public function obtenerCategoriaId($id)
    {
        $query = "Select id_categoria, nombre, descripcion, version from categoria where id_categoria = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        $this->setNombre($resultado["nombre"]);
        $this->setDescripcion($resultado["descripcion"]);

        return $resultado;
    }

    public function obtenerCategoriaNombre($nombre)
    {
        $query = "Select id_categoria from categoria where nombre = ? and estado = 'activo'";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $nombre);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

    public function crearCategoria()
    {
        $query = "INSERT INTO categoria (nombre, descripcion) values (?, ?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ss", $this->nombre, $this->descripcion);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear el plan: " . $stmt->error);
            return -1;
        }
    }

    public function eliminarCategoria($id_categoria)
    {
        $stmt = NULL;
        $cantidadProyectos = $this->obtenerCantidadProyectosCategoria($id_categoria);
        if ($cantidadProyectos < 1) {
            $query = "DELETE FROM categoria where id_categoria = ?";
            $stmt = $this->conexion->prepare($query);
            $stmt->bind_param("i", $id_categoria);
        } else {
            $query = "UPDATE categoria SET estado = ? where id_categoria = ?";
            $stmt = $this->conexion->prepare($query);
            $stmt->bind_param("si", $this->estado, $id_categoria);
        }
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al eliminar una categoria: " . $stmt->error);
            return false;
        }
    }

    private function obtenerCantidadProyectosCategoria($id_categoria)
    {
        $totalQuery = $this->conexion->query("SELECT count(DISTINCT pc.id_proyecto) as total from categoria c inner join proyecto_categoria pc on c.id_categoria = pc.id_categoria where c.id_categoria = {$id_categoria}");
        $totalProyectos = $totalQuery->fetch_assoc()['total'];
        return $totalProyectos;
    }

    public function actualizarCategoria()
    {
        $query = "INSERT INTO categoria (nombre, descripcion, version, estado) values (?, ?, ?, 'activo')";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssi", $this->nombre, $this->descripcion, $this->version);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear el plan: " . $stmt->error);
            return -1;
        }
    }
}

<?php
class Proyecto
{
    private $nombre, $descripcion, $estado, $fecha_inicio, $fecha_fin;
    // private $iteraciones, $participantes, $riesgos, $categorias;
    private $conexion;

    function __construct($conexion, $nombre = null, $descripcion = null, $estado = null, $fecha_inicio = null, $fecha_fin = null)
    {
        $this->conexion = $conexion;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->estado = $estado;
        $this->fecha_inicio = $fecha_inicio;
        $this->fecha_fin = $fecha_fin;
        // $this->iteraciones = $iteraciones;
        // $this->participantes = $participantes;
        // $this->riesgos = $riesgos;
        // $this->categorias = $categorias;
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
    public function getFechaInicio()
    {
        return $this->fecha_inicio;
    }
    public function getFechaFin()
    {
        return $this->fecha_fin;
    }
    // public function getIteraciones(){
    //     return $this->iteraciones;
    // }
    // public function getParticipantes(){
    //     return $this->participantes;
    // }
    // public function getRiesgos(){
    //     return $this->riesgos;
    // }
    // public function getCategorias(){
    //     return $this->categorias;
    // }

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
    public function setFechaInicio($fecha_inicio)
    {
        $this->fecha_inicio = $fecha_inicio;
    }
    public function setFechaFin($fecha_fin)
    {
        $this->fecha_fin = $fecha_fin;
    }
    // public function setIteraciones($iteraciones){
    //     $this->iteraciones = $iteraciones;
    // }
    // public function setParticipantes($participantes){
    //     $this->participantes = $participantes;
    // }
    // public function setRiesgos($riesgos){
    //     $this->riesgos = $riesgos;
    // }
    // public function setCategorias($categorias){
    //     $this->categorias = $categorias;
    // }

    public function obtenerTodosProyecto()
    {
        $proyectos = $this->conexion->query("select * from proyecto");
        $resultado = [];
        while ($fila = $proyectos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    private function obtenerOrden($orden)
    {
        switch ($orden) {
            case 1:
                return "activo";
            case 2:
                return "inactivo";
            case 3:
                return "abandonado";
            case 4:
                return "finalizado";
            default:
                return "activo";
        }
    }

    public function obtenerTodosProyectoPaginado($pagina, $orden)
    {
        $ordenado = $this->obtenerOrden($orden);
        $cantidad_proyectos = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_proyectos;
        }
        $proyectos = $this->conexion->query("select * from proyecto p where p.estado = '$ordenado' order by nombre asc limit $cantidad_proyectos offset $offset");
        $resultado = [];
        while ($fila = $proyectos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginas($cantidad_proyectos);
        return ["proyectos" => $resultado, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadPaginas($cantidad_proyectos)
    {
        $query = "SELECT count(*) as total from proyecto";
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        $total = $stmt->get_result()->fetch_assoc()['total'];
        $totalPaginas = ceil($total / $cantidad_proyectos);
        return $totalPaginas;
    }

    public function obtenerTodosProyectoLider($correo)
    {
        $query = "SELECT p.* from proyecto p 
        inner join proyecto_participante pp on p.id_proyecto = pp.id_proyecto
        inner join usuario u on u.id_usuario = pp.id_usuario where u.email = ? and pp.rol = 'lider del proyecto'";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $proyectos = $stmt->get_result();
        $resultado = [];
        while ($fila = $proyectos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerTodosProyectoLiderPaginado($correo, $pagina)
    {
        $cantidad_proyectos = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_proyectos;
        }

        $query = "SELECT p.* from proyecto p 
        inner join proyecto_participante pp on p.id_proyecto = pp.id_proyecto
        inner join usuario u on u.id_usuario = pp.id_usuario 
        where u.email = ? and pp.rol = 'lider del proyecto' 
        limit $cantidad_proyectos offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $proyectos = $stmt->get_result();
        $resultado = [];
        while ($fila = $proyectos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginasLider($cantidad_proyectos, $correo);
        return ["proyectos" => $resultado, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadPaginasLider($cantidad_proyectos, $correo)
    {
        $query = "SELECT count(*) as total from proyecto p 
        inner join proyecto_participante pp on p.id_proyecto = pp.id_proyecto
        inner join usuario u on u.id_usuario = pp.id_usuario where u.email = ? and pp.rol = 'lider del proyecto'";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $total = $stmt->get_result()->fetch_assoc()['total'];
        $totalPaginas = ceil($total / $cantidad_proyectos);
        return $totalPaginas;
    }

    public function obtenerTodosProyectoDesarrollador($correo)
    {
        $query = "SELECT p.* from proyecto p 
        inner join proyecto_participante pp on p.id_proyecto = pp.id_proyecto
        inner join usuario u on u.id_usuario = pp.id_usuario 
        where u.email = ? and pp.rol = 'desarrollador'";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $proyectos = $stmt->get_result();
        $resultado = [];
        while ($fila = $proyectos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerTodosProyectoDesarrolladorPaginado($correo, $pagina)
    {
        $cantidad_proyectos = 10;
        $offset = 0;

        if ($pagina > 1) {
            $offset = ($pagina - 1) * $cantidad_proyectos;
        }

        $query = "SELECT p.* from proyecto p 
        inner join proyecto_participante pp on p.id_proyecto = pp.id_proyecto
        inner join usuario u on u.id_usuario = pp.id_usuario 
        where u.email = ? and pp.rol = 'desarrollador' 
        limit $cantidad_proyectos offset $offset";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $proyectos = $stmt->get_result();
        $resultado = [];
        while ($fila = $proyectos->fetch_assoc()) {
            $resultado[] = $fila;
        }
        $totalPaginas = $this->obtenerCantidadPaginasDesarrollador($cantidad_proyectos, $correo);
        return ["proyectos" => $resultado, "totalPaginas" => $totalPaginas];
    }

    private function obtenerCantidadPaginasDesarrollador($cantidad_proyectos, $correo)
    {
        $query = "SELECT count(*) as total from proyecto p 
        inner join proyecto_participante pp on p.id_proyecto = pp.id_proyecto
        inner join usuario u on u.id_usuario = pp.id_usuario where u.email = ? and pp.rol = 'desarrollador'";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $total = $stmt->get_result()->fetch_assoc()['total'];
        $totalPaginas = ceil($total / $cantidad_proyectos);
        return $totalPaginas;
    }

    public function obtenerProyectoId($id)
    {
        $query = "SELECT * from proyecto where id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        $this->setNombre($resultado["nombre"]);
        $this->setDescripcion($resultado["descripcion"]);
        $this->setEstado($resultado["estado"]);
        $this->setFechaInicio($resultado["fecha_inicio"]);
        $this->setFechaFin($resultado["fecha_fin"]);

        return $resultado; // Retorna el usuario
    }

    public function obtenerCategoriaProyectoId($id)
    {
        $query = "SELECT c.* FROM `proyecto` p inner join proyecto_categoria pc on p.id_proyecto = pc.id_proyecto inner join categoria c on c.id_categoria = pc.id_categoria WHERE p.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $categorias = $stmt->get_result();

        $resultado = [];
        while ($fila = $categorias->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerParticipanteProyectoId($id)
    {
        $query = "SELECT u.*, pp.rol FROM `proyecto` p inner join proyecto_participante pp on p.id_proyecto = pp.id_proyecto inner join usuario u on u.id_usuario = pp.id_usuario WHERE p.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $participantes = $stmt->get_result();

        $resultado = [];
        while ($fila = $participantes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function obtenerIteracionProyectoId($id)
    {
        $query = "SELECT i.* from proyecto p inner join iteracion i on p.id_proyecto = i.id_proyecto WHERE p.id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $participantes = $stmt->get_result();

        $resultado = [];
        while ($fila = $participantes->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function crearProyecto()
    {
        $query = "INSERT INTO proyecto (nombre, descripcion, estado, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("sssss", $this->nombre, $this->descripcion, $this->estado, $this->fecha_inicio, $this->fecha_fin);
        if ($stmt->execute()) {
            return $this->conexion->insert_id;
        } else {
            throw new Exception("Error al crear el usuario: " . $stmt->error);
            return -1;
        }
    }

    public function actualizarProyecto($id_proyecto)
    {
        $query = "UPDATE proyecto SET nombre = ?, descripcion = ?, estado = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("sssssi", $this->nombre, $this->descripcion, $this->estado, $this->fecha_inicio, $this->fecha_fin, $id_proyecto);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al actualizar el proyecto: " . $stmt->error);
        }
    }

    public function actualizarEstadoFechaFin($id_proyecto){
        $query = "UPDATE proyecto SET estado = ?, fecha_fin = ? WHERE id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssi", $this->estado, $this->fecha_fin, $id_proyecto);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al actualizar el proyecto: " . $stmt->error);
        }
    }

    public function obtenerIteracionActual($id_proyecto, $fecha_actual)
    {
        $query = "SELECT i.id_iteracion, i.nombre, i.fecha_inicio, i.fecha_fin from iteracion i where i.id_proyecto = ? and (? BETWEEN i.fecha_inicio and i.fecha_fin)";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("is", $id_proyecto, $fecha_actual);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

    public function obtenerUltimaIteracion($id_proyecto)
    {
        $query = "SELECT i.id_iteracion, i.nombre, i.fecha_inicio, i.fecha_fin from proyecto p inner join iteracion i on p.id_proyecto = i.id_proyecto where p.id_proyecto = ? order by i.id_iteracion desc limit 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }

    public function obtenerUltimasIteraciones($id_proyecto, $fecha_actual)
    {
        $query = "
            (SELECT * FROM (
            SELECT i.id_iteracion, i.nombre, i.fecha_inicio
            FROM iteracion i
            WHERE i.id_proyecto = ?
                AND i.fecha_inicio < ?
            ORDER BY i.fecha_inicio DESC
        ) AS anteriores)

        UNION

        (SELECT i.id_iteracion, i.nombre, i.fecha_inicio
        FROM iteracion i
        WHERE i.id_proyecto = ?
            AND ? BETWEEN i.fecha_inicio AND i.fecha_fin)

        UNION

        (SELECT * FROM (
            SELECT i.id_iteracion, i.nombre, i.fecha_inicio
            FROM iteracion i
            WHERE i.id_proyecto = ?
                AND i.fecha_inicio > ?
            ORDER BY i.fecha_inicio ASC
        ) AS siguientes)

        ORDER BY fecha_inicio DESC";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("isisis", $id_proyecto, $fecha_actual, $id_proyecto, $fecha_actual, $id_proyecto, $fecha_actual);
        $stmt->execute();
        $iteraciones = $stmt->get_result();

        $resultado = [];
        while ($fila = $iteraciones->fetch_assoc()) {
            $resultado[] = $fila;
        }
        return $resultado;
    }

    public function modificarEstadoProyecto($id_proyecto)
    {
        $query = "UPDATE proyecto SET estado = ?, fecha_fin = ? WHERE id_proyecto = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ssi", $this->estado, $this->fecha_fin, $id_proyecto);
        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Error al crear el proyecto: " . $stmt->error);
        }
    }

    public function obtenerRolUsuarioProyecto($id_proyecto, $id_usuario){
        $query = "SELECT rol from proyecto_participante where id_proyecto = ? and id_usuario = ?";
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param("ii", $id_proyecto, $id_usuario);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();
        return $resultado;
    }
}

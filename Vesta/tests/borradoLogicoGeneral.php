<?php

function exigir(bool $condicion, string $mensaje): void
{
    if (!$condicion) {
        throw new RuntimeException($mensaje);
    }
}

$raiz = dirname(__DIR__);
foreach (glob($raiz . '/api/models/*.php') as $archivo) {
    exigir(!preg_match('/\bDELETE\s+FROM\b/i', file_get_contents($archivo)), basename($archivo) . ' conserva un DELETE físico');
}

$usuario = file_get_contents($raiz . '/api/models/usuario.php');
exigir(str_contains($usuario, 'usuario SET activo = 0'), 'Eliminar usuario debe desactivar el registro');
exigir(str_contains($usuario, 'u.activo = 1'), 'La autenticación debe excluir usuarios inactivos');
exigir(str_contains($usuario, 'activo = 0') && str_contains($usuario, 'SET activo = 1'), 'La creación debe reactivar usuarios existentes inactivos');
$auth = file_get_contents($raiz . '/api/utils/auth.php');
exigir(str_contains($auth, 'WHERE id_usuario = ? AND activo = 1'), 'JWT anteriores no deben permitir usuarios desactivados');
$controlador = file_get_contents($raiz . '/api/controllers/gestorUsuario.php');
exigir(!str_contains($controlador, '"usuario_perfil", "id_usuario", $id'), 'La relación de perfil del usuario debe conservarse');
exigir(!str_contains($controlador, '$this->usuario->setNombre(null)'), 'El historial debe conservar el nombre del usuario');

$categoria = file_get_contents($raiz . '/api/models/categoria.php');
exigir(str_contains($categoria, "UPDATE categoria SET estado = 'inactivo'"), 'Categoría siempre debe quedar inactiva');

foreach (['riesgo' => 'riesgo', 'incidencia' => 'incidencia', 'iteracion' => 'iteracion', 'tarea' => 'tarea'] as $archivo => $tabla) {
    exigir(str_contains(file_get_contents($raiz . '/api/models/' . $archivo . '.php'), 'UPDATE ' . $tabla . ' SET activo = 0'), $tabla . ' debe desactivarse');
}

$vinculos = file_get_contents($raiz . '/api/models/vincularTabla.php');
exigir(str_contains($vinculos, 'SET activo = 0'), 'Las relaciones con activo deben desactivarse');
exigir(str_contains($vinculos, 'ON DUPLICATE KEY UPDATE'), 'Reasignar una relación inactiva debe reactivarla');

$iteracion = file_get_contents($raiz . '/api/models/iteracion.php');
foreach (['participante_tarea', 'tarea', 'plan', 'evaluacion'] as $dependencia) {
    exigir(str_contains($iteracion, 'UPDATE ' . $dependencia), 'Eliminar iteración debe desactivar ' . $dependencia);
}
$riesgo = file_get_contents($raiz . '/api/controllers/gestorRiesgo.php');
foreach (['participante_tarea', 'tarea', 'plan', 'incidencia', 'evaluacion', 'participante_riesgo'] as $dependencia) {
    exigir(str_contains($riesgo, 'UPDATE ' . $dependencia), 'Eliminar riesgo debe desactivar ' . $dependencia);
}
$rutas = file_get_contents($raiz . '/api/routes/routes.php');
foreach (['proyecto/{id_proyecto}/riesgo/{id_riesgo}', 'incidencia/{id_incidencia}', 'tarea/{id_tarea}'] as $ruta) {
    $inicio = strpos($rutas, '$router->add("GET", "' . $ruta . '"');
    exigir($inicio !== false, 'No se encontró la ruta GET ' . $ruta);
    $fin = strpos($rutas, '$router->add(', $inicio + 12);
    exigir(str_contains(substr($rutas, $inicio, $fin - $inicio), 'http_response_code(404)'), 'El detalle inactivo ' . $ruta . ' debe devolver 404');
}

require_once $raiz . '/api/models/vincularTabla.php';

class ConexionVinculosFalsa
{
    public array $consultas = [];
    public int $confirmaciones = 0;
    public int $reversiones = 0;
    public ?string $fallarEn = null;
    public function begin_transaction(): void {}
    public function commit(): void { $this->confirmaciones++; }
    public function rollback(): void { $this->reversiones++; }
    public function prepare(string $sql): SentenciaVinculosFalsa { return new SentenciaVinculosFalsa($this, $sql); }
}

class SentenciaVinculosFalsa
{
    private array $valores = [];
    public int $affected_rows = 1;
    public function __construct(private ConexionVinculosFalsa $conexion, private string $sql) {}
    public function bind_param(string $tipos, &...$valores): void { $this->valores = $valores; }
    public function execute(): bool
    {
        $this->conexion->consultas[] = [$this->sql, $this->valores];
        if ($this->conexion->fallarEn !== null && str_contains($this->sql, $this->conexion->fallarEn)) {
            throw new RuntimeException('Error simulado');
        }
        return true;
    }
}

$conexion = new ConexionVinculosFalsa();
vincularTabla::eliminarVinculo($conexion, 'participante_tarea', 'id_tarea', 7);
exigir(str_contains($conexion->consultas[0][0], 'UPDATE participante_tarea SET activo = 0') && $conexion->consultas[0][1] === [7], 'Se deben desactivar solo los responsables de la tarea indicada');
vincularTabla::crearVinculo($conexion, 'participante_tarea', 'id_usuario', 'id_tarea', 3, 7);
exigir(str_contains($conexion->consultas[1][0], 'ON DUPLICATE KEY UPDATE activo = 1'), 'Una asignación existente debe reactivarse');
try {
    vincularTabla::eliminarVinculo($conexion, 'usuario_perfil', 'id_usuario', 3);
    throw new RuntimeException('Se borró usuario_perfil sin activo');
} catch (InvalidArgumentException $error) {
    exigir(count($conexion->consultas) === 2, 'usuario_perfil no debe alterarse mediante borrado lógico');
}

require_once $raiz . '/api/controllers/gestorRiesgo.php';
function gestorRiesgoFalso(ConexionVinculosFalsa $conexion): GestorRiesgo
{
    $gestor = (new ReflectionClass(GestorRiesgo::class))->newInstanceWithoutConstructor();
    (new ReflectionProperty(GestorRiesgo::class, 'conexion'))->setValue($gestor, $conexion);
    (new ReflectionProperty(GestorRiesgo::class, 'riesgo'))->setValue($gestor, new Riesgo($conexion));
    return $gestor;
}

$conexionRiesgo = new ConexionVinculosFalsa();
exigir(gestorRiesgoFalso($conexionRiesgo)->eliminarRiesgo(4, 6) === true, 'El riesgo debe desactivarse con sus dependencias');
exigir(count($conexionRiesgo->consultas) === 7 && $conexionRiesgo->confirmaciones === 1, 'El riesgo y seis dependencias deben confirmarse juntos');
foreach ($conexionRiesgo->consultas as [$sql, $ids]) {
    exigir(str_contains($sql, 'activo = 0') && $ids === [4, 6], 'El riesgo y las dependencias deben filtrarse por proyecto y riesgo');
}

$falloRiesgo = new ConexionVinculosFalsa();
$falloRiesgo->fallarEn = 'UPDATE evaluacion';
try {
    gestorRiesgoFalso($falloRiesgo)->eliminarRiesgo(4, 6);
    throw new RuntimeException('No se revirtió el riesgo');
} catch (RuntimeException $error) {
    exigir($error->getMessage() === 'Error simulado', 'Debe propagarse el fallo de una dependencia');
}
exigir($falloRiesgo->confirmaciones === 0 && $falloRiesgo->reversiones === 1, 'Debe revertirse todo el borrado de riesgo');

require_once $raiz . '/api/models/iteracion.php';
$conexionIteracion = new ConexionVinculosFalsa();
exigir((new Iteracion($conexionIteracion))->eliminarIteracion(8, 4) === true, 'La iteración debe desactivarse');
exigir(count($conexionIteracion->consultas) === 5, 'Deben desactivarse las dependencias de la iteración');
exigir($conexionIteracion->consultas[0][1] === [8, 4], 'La iteración debe pertenecer al proyecto');
foreach (array_slice($conexionIteracion->consultas, 1) as [$sql, $ids]) {
    exigir($ids === [8] && str_contains($sql, 'activo = 0'), 'Las dependencias deben filtrarse por iteración');
}

echo "Borrados lógicos generales verificados\n";

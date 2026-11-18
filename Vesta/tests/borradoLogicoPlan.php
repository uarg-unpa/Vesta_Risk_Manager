<?php

require_once __DIR__ . '/../api/controllers/gestorRiesgo.php';

function verificarPlan(bool $condicion, string $mensaje): void
{
    if (!$condicion) {
        throw new RuntimeException($mensaje);
    }
}

class ConexionPlanFalsa
{
    public array $consultas = [];
    public int $transacciones = 0;
    public int $confirmaciones = 0;
    public int $reversiones = 0;
    public bool $planExiste = true;
    public bool $fallarTareas = false;

    public function begin_transaction(): void { $this->transacciones++; }
    public function commit(): void { $this->confirmaciones++; }
    public function rollback(): void { $this->reversiones++; }
    public function prepare(string $sql): SentenciaPlanFalsa { return new SentenciaPlanFalsa($this, $sql); }
}

class SentenciaPlanFalsa
{
    private array $valores = [];
    public int $affected_rows = 0;

    public function __construct(private ConexionPlanFalsa $conexion, private string $sql) {}

    public function bind_param(string $tipos, &...$valores): void { $this->valores = $valores; }

    public function execute(): bool
    {
        $this->conexion->consultas[] = [$this->sql, $this->valores];
        if ($this->conexion->fallarTareas && str_contains($this->sql, 'UPDATE tarea')) {
            throw new RuntimeException('Error de escritura de tareas');
        }
        $this->affected_rows = str_contains($this->sql, 'UPDATE plan')
            ? (int) $this->conexion->planExiste : 2;
        return true;
    }
}

function gestorPlan(ConexionPlanFalsa $conexion): GestorRiesgo
{
    $gestor = (new ReflectionClass(GestorRiesgo::class))->newInstanceWithoutConstructor();
    foreach (['conexion' => $conexion, 'plan' => new Plan($conexion), 'tarea' => new Tarea($conexion)] as $campo => $valor) {
        $propiedad = new ReflectionProperty(GestorRiesgo::class, $campo);
        $propiedad->setValue($gestor, $valor);
    }
    return $gestor;
}

$conexion = new ConexionPlanFalsa();
verificarPlan(gestorPlan($conexion)->eliminarPlan(5, 17) === true, 'Debe desactivar un plan existente');
verificarPlan($conexion->transacciones === 1 && $conexion->confirmaciones === 1 && $conexion->reversiones === 0, 'La cascada debe confirmarse en una transacción');
verificarPlan(count($conexion->consultas) === 3, 'Debe desactivar plan, asignaciones y todas las tareas');
foreach ($conexion->consultas as [$sql, $valores]) {
    verificarPlan(str_starts_with($sql, 'UPDATE ') && str_contains($sql, 'activo = 0'), 'La cascada debe usar UPDATE activo = 0, nunca DELETE');
    verificarPlan($valores === (str_contains($sql, 'UPDATE plan') ? [17, 5] : [17]), 'Debe filtrar el plan por proyecto y las tareas por id_plan');
}
verificarPlan(str_contains($conexion->consultas[0][0], 'id_proyecto = ?'), 'El plan debe pertenecer al proyecto autorizado');
verificarPlan(str_contains($conexion->consultas[1][0], 'JOIN tarea') && str_contains($conexion->consultas[1][0], 't.id_plan = ?'), 'Las asignaciones deben localizarse por las tareas del plan');

$inexistente = new ConexionPlanFalsa();
$inexistente->planExiste = false;
verificarPlan(gestorPlan($inexistente)->eliminarPlan(5, 17) === false, 'Un plan inactivo, ajeno o inexistente no se elimina de nuevo');
verificarPlan($inexistente->confirmaciones === 0 && $inexistente->reversiones === 1, 'No deben modificarse tareas cuando el plan no existe');

$fallo = new ConexionPlanFalsa();
$fallo->fallarTareas = true;
try {
    gestorPlan($fallo)->eliminarPlan(5, 17);
    throw new RuntimeException('Se esperaba error de escritura');
} catch (RuntimeException $error) {
    verificarPlan($error->getMessage() === 'Error de escritura de tareas', 'Debe propagarse el error de base de datos');
}
verificarPlan($fallo->confirmaciones === 0 && $fallo->reversiones === 1, 'Un error debe revertir todos los cambios');

function cuerpoMetodo(string $codigo, string $nombre): string
{
    $inicio = strpos($codigo, 'function ' . $nombre . '(');
    verificarPlan($inicio !== false, 'No se encontró el método ' . $nombre);
    $fin = strpos($codigo, 'function ', $inicio + 9);
    return substr($codigo, $inicio, $fin === false ? null : $fin - $inicio);
}

$codigoPlan = file_get_contents(__DIR__ . '/../api/models/plan.php');
foreach (['obtenerPlanesIteracionActual', 'obtenerPlanesIteracionActualPaginado', 'obtenerCantidadPaginasActuales', 'obtenerPlanesRiesgoProyecto', 'obtenerPlanesAnteriores', 'obtenerPlanesIteracionAnterioresPaginado', 'obtenerCantidadPaginasAnteriores', 'obtenerPlanId'] as $metodo) {
    verificarPlan(str_contains(cuerpoMetodo($codigoPlan, $metodo), 'p.activo = 1'), $metodo . ' debe ocultar planes inactivos');
}
foreach (['obtenerTareasPlan', 'obtenerTareasPlanInforme'] as $metodo) {
    verificarPlan(str_contains(cuerpoMetodo($codigoPlan, $metodo), 't.activo = 1'), $metodo . ' debe ocultar tareas inactivas');
}
$codigoTarea = file_get_contents(__DIR__ . '/../api/models/tarea.php');
foreach (['obtenerTareas', 'obtenerTareasPaginado', 'obtenerCantidadPaginas', 'obtenerTareasDesarrolladorPaginado', 'obtenerCantidadDesarrolladorPaginas', 'obtenerTareaId', 'obtenerIdProyecto'] as $metodo) {
    $codigo = cuerpoMetodo($codigoTarea, $metodo);
    verificarPlan(str_contains($codigo, 't.activo = 1') && str_contains($codigo, 'p.activo = 1'), $metodo . ' debe ocultar plan y tareas inactivos');
}
$codigoRiesgo = file_get_contents(__DIR__ . '/../api/models/riesgo.php');
verificarPlan(str_contains(cuerpoMetodo($codigoRiesgo, 'obtenerCantidadPlanes'), 'p.activo = 1'), 'El conteo de planes debe excluir planes inactivos');
verificarPlan(substr_count(cuerpoMetodo($codigoRiesgo, 'obtenerDatosRiesgo'), 'p.activo = 1') >= 2, 'El informe de riesgos debe excluir planes inactivos');
$codigoGestor = file_get_contents(__DIR__ . '/../api/controllers/gestorRiesgo.php');
verificarPlan(str_contains(cuerpoMetodo($codigoGestor, 'obtenerPlanId'), 'if (!$resultado ||'), 'El detalle de un plan inactivo debe terminar sin acceder a un resultado inexistente');
verificarPlan(str_contains(cuerpoMetodo($codigoGestor, 'actualizarPlan'), 'if (!$plan ||'), 'No se deben modificar planes inactivos');
$codigoRutas = file_get_contents(__DIR__ . '/../api/routes/routes.php');
$rutaBorrado = substr($codigoRutas, strpos($codigoRutas, '$router->add("DELETE", "proyecto/{id_proyecto}/plan/{id_plan}"'));
$rutaBorrado = substr($rutaBorrado, 0, strpos($rutaBorrado, '$router->add("GET", "proyecto/{id_proyecto}/incidencias"'));
verificarPlan(str_contains($rutaBorrado, 'eliminarPlan($id_proyecto, $id_plan)'), 'La ruta de eliminación debe enviar el proyecto al controlador');
$rutaDetalle = substr($codigoRutas, strpos($codigoRutas, '$router->add("GET", "proyecto/{id_proyecto}/plan/{id_plan}"'));
$rutaDetalle = substr($rutaDetalle, 0, strpos($rutaDetalle, '$router->add("PUT", "proyecto/{id_proyecto}/plan/{id_plan}"'));
verificarPlan(str_contains($rutaDetalle, 'http_response_code(404)'), 'Un plan inactivo debe devolver HTTP 404');

echo "Borrado lógico de plan verificado\n";

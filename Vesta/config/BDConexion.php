<?php
require_once __DIR__ . '/../vendor/autoload.php';
/**
 * Description of BDConexion
 * 
 * Esta clase implementa la conexión a una base de datos mediante el patrón Singleton.
 *
 * @author Eder dos Santos <esantos@uarg.unpa.edu.ar>
 * 
 * @uses mysqli Libería estándar de PHP para acceder a bases de datos MySQL
 * @see https://es.wikipedia.org/wiki/Singleton
 * 
 */
class BDConexion extends mysqli
{

    private $host, $usuario, $contrasenia, $schema;
    public static $instancia;

    function __construct()
    {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/..");
        $dotenv->load();
        $this->host = $_ENV['DB_HOST'];
        $this->usuario = $_ENV['DB_USER'];
        $this->contrasenia = $_ENV['DB_PASS'];
        $this->schema = $_ENV['DB_NAME'];

        parent::connect($this->host, $this->usuario, $this->contrasenia, $this->schema);

        if ($this->connect_errno) {
            throw new Exception("Error de Conexion a la Base de Datos", $this->connect_errno);
        }
    }

    /**
     * 
     * @return BDConexion
     */
    public static function getInstancia()
    {
        if (self::$instancia === null) {
            try {
                self::$instancia = new self();
            } catch (Exception $e) {
                die("Error de Conexion a la Base de Datos: " . $e->getCode() . ".");
            }
        }
        return self::$instancia;
    }

}

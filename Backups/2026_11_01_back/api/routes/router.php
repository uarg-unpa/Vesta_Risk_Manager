<?php

/**
 * Clase Router para manejar el enrutamiento de rutas HTTP en una aplicación PHP.
 */

class Router
{
    /** @var array $routes Lista de rutas registradas */
    private $routes = [];

    /** @var string $base Ruta base o troncal */
    private $base = '';

    private $globalMiddlewares = [];

    /**
     * Establece una base para todas las rutas, permitiendo tener una ruta troncal (p. ej., "vesta").
     *
     * @param string $base Ruta base para todas las rutas añadidas
     */
    public function setBase($base)
    {
        $this->base = trim($base, '/');
    }

    /**
     * Registra una nueva ruta en el enrutador.
     *
     * @param string $method Método HTTP (GET, POST, etc.) para la ruta
     * @param string $path Ruta relativa al prefijo base, acepta parámetros en formato {param}
     * @param callable|array $callback Callback o controlador que se ejecutará cuando la ruta coincida
     */
    public function add($method, $path, $callback, $middleware = [])
    {
        // Añade la base a cada ruta si está configurada
        $path = ($this->base ? $this->base . '/' : '') . trim($path, '/');
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $this->convertPathToRegex($path),
            'callback' => $callback,
            'middleware' => $middleware
        ];
    }

    /**
     * Registra un middleware global que se ejecutará antes de todas las rutas.
     *
     * @param callable $middleware
     */
    public function use(callable $middleware): void
    {
        $this->globalMiddlewares[] = $middleware;
    }


    /**
     * Convierte una ruta en una expresión regular, permitiendo capturar parámetros en la URL.
     *
     * @param string $path Ruta que contiene parámetros entre llaves, como `{id}`
     * @return string Expresión regular para coincidir y capturar parámetros en la URL
     */
    private function convertPathToRegex($path)
    {
        return "#^" . str_replace(['{', '}'], ['(?P<', '>[^/]+)'], $path) . "$#";
    }

    /**
     * Ejecuta el enrutador, verificando si alguna ruta coincide con la URL actual
     * y el método HTTP. Si coincide, ejecuta el callback asociado.
     */
    public function run()
    {
        $url = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'); // Obtiene la URL solicitada
        $method = $_SERVER['REQUEST_METHOD']; // Obtiene el método HTTP
        // Verifica si el método de solicitud es OPTIONS y responde con estado 200
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit;
        }
        // Recorre las rutas registradas y verifica si alguna coincide con la URL y el método HTTP
        foreach ($this->routes as $route) {
            if ($method == $route['method'] && preg_match($route['path'], $url, $matches)) {
                // Filtra solo los parámetros capturados en la URL como claves asociativas
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);

                // Ejecutar middlewares globales
                foreach ($this->globalMiddlewares as $middleware) {
                    $result = call_user_func($middleware, $params);
                    if ($result === false) {
                        return; // Detiene la ejecución si el middleware falla
                    }
                }

                // Ejecutar middlewares específicos de la ruta
                foreach ($route['middleware'] as $middleware) {
                    $result = call_user_func($middleware, $params);
                    if ($result === false) {
                        return;
                    }
                }

                // Si el callback es un array, llámalo como [Controlador, 'metodo']
                if (is_array($route['callback'])) {
                    list($controller, $method) = $route['callback'];
                    return call_user_func_array([new $controller, $method], $params);
                }

                // Si el callback es una función, llámala directamente
                return call_user_func_array($route['callback'], $params);
            }
        }

        // Si ninguna ruta coincide, devuelve un error 404
        http_response_code(404);
        echo "Error 404: Página no encontrada";
    }
}

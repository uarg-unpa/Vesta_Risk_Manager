<?php

setlocale(LC_TIME, 'es_AR.utf8');

/**
 * 
 * Clase para mantener las directivas de sistema.
 * Deben coincidir con las configuraciones del proyecto.
 * 
 * @author Eder dos Santos <esantos@uarg.unpa.edu.ar>
 * 
 */
class Constantes {

    
    const NOMBRE_SISTEMA = "Vesta Risk Manager";
    
    const WEBROOT = "/var/www/html/vesta_risk_manager/";
    const APPDIR = "vesta_risk_manager";
        
    const SERVER = "http://localhost";
    const APPURL = "http://localhost/vesta_risk_manager";
    const HOMEURL = "http://localhost/vesta_risk_manager/app/index.php";
    const HOMEAUTH = "http://localhost/vesta_risk_manager/app/home.php";
    
    const BD_SCHEMA = "bdvestariskmanager";
    const BD_USERS = "bdvestariskmanager";
    
}

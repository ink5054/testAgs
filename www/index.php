<?php

use App\Manager\RouteManager;
use App\Provider\TemplateProvider;
use Slim\Exception\HttpException;

define('ROOT_DIR', dirname(__DIR__));

/**
 * Путь до директории /backend
 */
const BACKEND_DIR = ROOT_DIR . '/backend';
require BACKEND_DIR . '/config.php';
require dirname(__DIR__) . '/backend/vendor/autoload.php';

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

/**
 * Автозагрузка классов по namespace.
 * Пример:
 * Класс: /backend/App/Util/Utils.php
 * namespace: \App\Util\Utils
 */
spl_autoload_register(function ($class) {
    $file = BACKEND_DIR . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';

    if (file_exists($file)) {
        require $file;
        return true;
    }

    return false;
});

// Инициализация шаблонизатора
TemplateProvider::init();

// Регистрация обработчиков маршрутов
try {
    $router = new RouteManager();
    $router->registerRoutes()->run();
} catch (HttpException $e) {
    http_response_code($e->getCode());
}

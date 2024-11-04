<?php

namespace App\Manager;

use App\Controller\Page\NumbersPageController;
use App\Controller\Tech\DatabaseSeederController;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;

/**
 * Класс для регистрации и управления роутером
 */
class RouteManager
{
    private readonly App $app;

    public function __construct()
    {
        $this->app = AppFactory::create();
    }

    public function registerRoutes(): App
    {
        $this->app->get('/', NumbersPageController::class);

        $this->app->group('/numbers', function (RouteCollectorProxy $group) {
            $group->post('/page/{offset:[0-9]+}', [NumbersPageController::class, 'findAll']);
            $group->post('/fill/{amount:[0-9]+}', [DatabaseSeederController::class, 'fill']);
        });

        return $this->app;
    }
}

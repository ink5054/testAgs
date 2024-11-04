<?php

namespace App\Controller\Tech;

use App\Actions\SeedNumbersAction;
use App\Controller\AbstractController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class DatabaseSeederController extends AbstractController
{
    public function __invoke(
        Request $request,
        Response $response,
        array $args
    ): void {
    }

    /**
     * Заполняет таблицу с номерами случайными значениями
     */
    public function fill(
        Request $request,
        Response $response,
        array $args
    ): Response {
        return (new SeedNumbersAction($this, $response))->handle((int)$args['amount']);
    }
}

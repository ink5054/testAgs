<?php

namespace App\Actions;

use App\Controller\Tech\DatabaseSeederController;
use App\Provider\DatabaseProvider;
use App\Utils\NumberSeeder;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * Заполнить таблицу numbers рандомными номерами
 */
readonly class SeedNumbersAction
{
    public function __construct(
        private DatabaseSeederController $controller,
        private Response $response,
    ) {
    }

    public function handle(int $amount): Response
    {
        $conn = DatabaseProvider::getConnection();

        (new NumberSeeder($conn))->seedNumbers($amount);

        return $this->controller->writeJson($this->response, [
            'status' => 'ok',
        ]);
    }
}

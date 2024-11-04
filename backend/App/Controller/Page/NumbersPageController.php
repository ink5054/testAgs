<?php

namespace App\Controller\Page;

use App\Actions\FindAllNumbersAction;
use App\Controller\AbstractController;
use App\Repository\NumberCategoryRepository;
use App\Repository\OperatorRepository;
use App\Repository\RegionRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class NumbersPageController extends AbstractController
{
    /**
     * Возвращает HTML шаблон страницы
     */
    public function __invoke(
        Request $request,
        Response $response,
        array $args
    ): Response {
        return $this->renderTemplate($response, 'pages/numbers', [
            'filters' => [
                'number_categories' => NumberCategoryRepository::findAllAssociative(),
                'operators'         => OperatorRepository::findAllAssociative(),
                'regions'           => RegionRepository::findAllAssociative()
            ]
        ]);
    }

    /**
     * Возвращает список номеров
     */
    public function findAll(
        Request $request,
        Response $response,
        array $args
    ): Response {
        $offset = (int)$args['offset'];
        $action = new FindAllNumbersAction($this, $response);

        return $action->handle($this->getRequestedContents($request), $offset);
    }
}

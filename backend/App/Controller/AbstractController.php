<?php

namespace App\Controller;

use App\Exception\TemplateException;
use App\Provider\TemplateProvider;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;

abstract class AbstractController
{
    public function __construct(
        protected ?ContainerInterface $container
    ) {
    }

    protected function renderTemplate(ResponseInterface $response, string $template, array $vars = []): ResponseInterface
    {
        try {
            $html = TemplateProvider::get()->render($template, $vars);
            $response->getBody()->write($html);
        } catch (TemplateException $e) {
            exit($e->getMessage());
        }

        return $response;
    }

    public function writeJson(ResponseInterface $response, array $data): ResponseInterface
    {
        $response->getBody()
            ->write(json_encode($data));

        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Возвращает данные, переданные в запрос
     */
    protected function getRequestedContents(Request $request): ?array
    {
        switch ($request->getMethod()) {
            case 'GET':
                return $request->getQueryParams();
            default:
                $parsedBody = $request->getParsedBody();

                if (!empty($parsedBody)) {
                    return $parsedBody;
                }

                $jsonBody = file_get_contents('php://input');

                if (!empty($jsonBody)) {
                    return json_decode($jsonBody, true);
                }
        }

        return null;
    }
}

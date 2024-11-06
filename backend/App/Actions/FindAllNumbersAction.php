<?php

namespace App\Actions;

use App\Config\NumberConfig;
use App\Controller\Page\NumbersPageController;
use App\Provider\DatabaseProvider;
use App\Utils\DatabaseUtils;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Query\QueryBuilder;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * Возвращает список номеров
 */
readonly class FindAllNumbersAction
{
    public function __construct(
        private NumbersPageController $controller,
        private Response $response,
    ) {
    }

    public function handle(
        ?array $requestedContents,
        int $page
    ): Response {
        $conn = DatabaseProvider::getConnection();
        $qb = $conn->createQueryBuilder();

        $builder = $qb->select('*')
            ->from('numbers', 'n')
            ->setMaxResults(NumberConfig::DEFAULT_SEARCH_LIMIT)
            ->setFirstResult($page == 1 ? 0 : $page * NumberConfig::DEFAULT_SEARCH_LIMIT);

        if (!empty($requestedContents)) {
            $this->applyFilters($conn, $qb, $requestedContents);
        }

        return $this->controller->writeJson($this->response, [
            'list' => $builder->fetchAllAssociative()
        ]);
    }

    private function applyFilters(Connection $conn, QueryBuilder $qb, array $filters): void
    {
        if (isset($filters['free_search'])) {
            $qb->andWhere($qb->expr()->like('number',
                $qb->createPositionalParameter('%' . $filters['free_search'] . '%')));
        }

        if (!empty($filters['categories'])) {
            $qb->andWhere($qb->expr()->in('category_id', DatabaseUtils::quoteValues($conn, $filters['categories'])));
        }

        if (!empty($filters['operators'])) {
            $qb->andWhere($qb->expr()->in('operator_id', DatabaseUtils::quoteValues($conn, $filters['operators'])));
        }

        if (isset($filters['region']) && $filters['region'] != 0) {
            $qb->andWhere($qb->expr()->eq('region_id', $qb->createPositionalParameter($filters['region'])));
        }

        if (isset($filters['min_price'])) {
            $qb->andWhere($qb->expr()->gte('tariff_cost', $qb->createPositionalParameter($filters['min_price'])));
        }

        if (isset($filters['max_price'])) {
            $qb->andWhere($qb->expr()->lte('tariff_cost', $qb->createPositionalParameter($filters['max_price'])));
        }
    }
}

<?php

namespace App\Repository;

use App\Exception\RepositoryException;
use App\Provider\DatabaseProvider;
use Doctrine\DBAL\Exception;
use Override;

class OperatorRepository extends AbstractRepository
{
    public static function getTableName(): string
    {
        return 'operators';
    }

    /**
     * Возвращает список всех операторов в виде массива
     *
     * @throws RepositoryException
     */
    #[Override]
    public static function findAllAssociative(): array
    {
        $conn = DatabaseProvider::getConnection();

        try {
            return $conn->createQueryBuilder()
                ->select('id', 'name')
                ->from(self::getTableName())
                ->executeQuery()
                ->fetchAllAssociative();
        } catch (Exception $e) {
            throw new RepositoryException($e->getMessage(), $e->getCode(), $e);
        }
    }
}

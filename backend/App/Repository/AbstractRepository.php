<?php

namespace App\Repository;

use App\Exception\RepositoryException;

abstract class AbstractRepository
{
    protected static abstract function getTableName(): ?string;

    /**
     * @throws RepositoryException
     */
    public static function findAll(): array
    {
        throw new RepositoryException('Not implemented');
    }

    /**
     * @throws RepositoryException
     */
    public static function findAllAssociative(): array
    {
        throw new RepositoryException('Not implemented');
    }
}

<?php

namespace App\Utils;

use Doctrine\DBAL\Connection;

/**
 * Утилиты для работы с БД
 */
class DatabaseUtils
{
    /**
     * Оборачивает значения массива в кавычки
     *
     * @param Connection $conn Подключение к БД Doctrine DBAL
     * @param array $values Массив со значениями
     */
    public static function quoteValues(Connection $conn, array $values): array
    {
        return array_map(fn($value) => $conn->quote($value), $values);
    }
}

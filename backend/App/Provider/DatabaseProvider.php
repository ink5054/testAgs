<?php

namespace App\Provider;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;
use Dotenv\Dotenv;

class DatabaseProvider
{
    private static ?Connection $connection = null;

    private function __construct()
    {
    }

    public static function getConnection(): Connection
    {
        if (self::$connection === null) {
            $dotenv = Dotenv::createImmutable(ROOT_DIR);
            $dotenv->load();

            $params = [
                'host'     => $_ENV['DB_HOST'],
                'dbname'   => $_ENV['DB_NAME'],
                'user'     => $_ENV['DB_USER'],
                'password' => $_ENV['DB_PASSWORD'],
                'driver'   => 'pdo_mysql',
                'charset'  => 'utf8mb4',
            ];

            self::$connection = DriverManager::getConnection($params);
        }

        return self::$connection;
    }
}

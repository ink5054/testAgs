<?php

namespace App\Utils;

use Doctrine\DBAL\Connection;
use Faker\Factory;

class NumberSeeder
{
    private Connection $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function seedNumbers($count = 1000)
    {
        $faker = Factory::create('ru_RU');

        $operators = $this->connection->fetchAllAssociative("SELECT id FROM operators");
        $categories = $this->connection->fetchAllAssociative("SELECT id FROM number_categories");
        $regions = $this->connection->fetchAllAssociative("SELECT id FROM regions");

        for ($i = 0; $i < $count; $i++) {
            $phoneNumber = $faker->unique()->numerify('9#########');
            $operatorId = $faker->randomElement($operators)['id'];
            $categoryId = $faker->randomElement($categories)['id'];
            $regionId = $faker->randomElement($regions)['id'];
            $tariffCost = $faker->numberBetween(250, 5000);

            $this->connection->executeStatement(
                'INSERT IGNORE INTO numbers (number, operator_id, category_id, region_id, tariff_cost) VALUES (?, ?, ?, ?, ?)',
                [$phoneNumber, $operatorId, $categoryId, $regionId, $tariffCost]
            );
        }
    }
}
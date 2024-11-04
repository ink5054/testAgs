#!/bin/bash

# Разрешения на директории (если не поставится, поставить вручную в контейнере)
chmod 777 -R /var/www/sites/ag-test-task.ru/www/images/

# Запуск apache2
apache2-foreground

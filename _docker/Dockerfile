FROM php:8.3.8-apache-bullseye

WORKDIR /var/www/sites/ag-test-task.ru

RUN apt-get update && apt-get install -y \
      libpq-dev \
      libpng-dev \
      libzip-dev \
      libicu-dev \
      libcurl4-openssl-dev \
      wget \
      zip unzip \
      cron \
      nano

# Adjust php
COPY ./_docker/conf/php/php.ini $PHP_INI_DIR/conf.d/php.ini

RUN docker-php-ext-configure intl && \
    docker-php-ext-install intl \
      gd \
      curl \
      mysqli \
      pdo pdo_mysql \
      posix pcntl

ENV COMPOSER_ALLOW_SUPERUSER=1
RUN curl -sS https://getcomposer.org/installer | php -- \
    --filename=composer \
    --install-dir=/usr/local/bin

# Adjust Apache2
COPY ./_docker/conf/apache2/sites/ag-test-task.ru.conf /etc/apache2/sites-available/ag-test-task.ru.conf

RUN a2enmod rewrite && \
    a2dissite 000-default && \
    a2ensite ag-test-task.ru && \
    service apache2 restart

# Install XDebug
RUN pecl install xdebug && \
    docker-php-ext-enable xdebug

COPY ./_docker/conf/php/xdebug.ini $PHP_INI_DIR/conf.d

# NPM
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@10.2.4

# Adjust entrypoint
COPY ./_docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod 0777 /docker-entrypoint.sh
CMD /docker-entrypoint.sh
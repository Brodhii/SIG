# Gunakan image PHP 8.2 dengan Apache
FROM php:8.2-apache

# Install ekstensi PHP yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set folder kerja di container
WORKDIR /var/www/html

# Copy semua file project ke dalam container
COPY . .

# Install dependency Laravel
RUN composer install --no-dev --optimize-autoloader

# Generate app key dan cache config
RUN php artisan key:generate || true
RUN php artisan config:cache || true

# Expose port untuk Apache
EXPOSE 80

# Jalankan Apache
CMD ["apache2-foreground"]

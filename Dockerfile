# Gunakan image PHP 8.2 dengan Apache
FROM php:8.2-apache

# Install ekstensi PHP yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libsqlite3-dev zip \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set folder kerja di container
WORKDIR /var/www/html

# Copy semua file project
COPY . .

# Pastikan folder bisa ditulis dan database file ada
RUN mkdir -p database && touch database/database.sqlite
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Install dependency Laravel
RUN composer install --no-dev --optimize-autoloader

# Generate APP key (abaikan error kalau APP_KEY sudah ada)
RUN php artisan key:generate || true

# Jalankan migrasi (jika gagal tidak hentikan build)
RUN php artisan migrate --force || true

# Cache config
RUN php artisan config:cache || true

# Ganti DocumentRoot Apache ke folder public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Clear cache
RUN php artisan config:clear && php artisan cache:clear && php artisan view:clear

# Expose port 80
EXPOSE 80

# Jalankan Apache
CMD ["apache2-foreground"]

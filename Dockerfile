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

# Copy semua file project ke container
COPY . .

# Install dependency Laravel
RUN composer install --no-dev --optimize-autoloader

# Pastikan folder storage dan cache ada
RUN mkdir -p storage bootstrap/cache

# Atur izin akses agar Laravel bisa menulis log dan cache
RUN chmod -R 775 storage bootstrap/cache

# Bersihkan dan cache ulang konfigurasi Laravel
RUN php artisan config:clear || true
RUN php artisan cache:clear || true
RUN php artisan view:clear || true

# Generate APP key kalau belum ada
RUN php artisan key:generate --force || true

# Ubah DocumentRoot Apache ke folder public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Ubah owner file ke www-data (user Apache)
RUN chown -R www-data:www-data /var/www/html

# Expose port 80 untuk Render
EXPOSE 80

# Set environment manual untuk debugging
ENV APP_ENV=local
ENV APP_DEBUG=true

# Jalankan Apache
CMD ["apache2-foreground"]

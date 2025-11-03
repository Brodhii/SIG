    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sistem Informasi Digital Perikanan</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
    <!-- Navbar -->
    <header class="navbar navbar-expand-lg">
        <div class="container">
            <!-- Logo -->
            <div class="logo">
                <img src="images/logo.png" alt="Logo Perikanan" class="hero-logo">
                <span>Perikanan Digital</span>
            </div>
            
            <!-- Tombol Toggle -->
            <button class="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <!-- Menu Navigasi -->
            <nav class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#beranda">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#cuaca">Cuaca</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#peta">Peta</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#kontak">Kontak</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>


        <!-- ===== Hero Section ===== -->
        <section class="hero" id="beranda">
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>

        <div class="hero-content">
            <h1>Sistem Informasi Digital Perikanan</h1>
            <p>
                Platform digital terintegrasi yang menyajikan data ekosistem pesisir
                mulai dari <b>sebaran mangrove</b>, <b>habitat bentik</b>,
                hingga <b>lokasi penangkapan ikan</b> berbasis data dan teknologi.
            </p>
            <a href="#cuaca" class="cta-button">Jelajahi Sekarang</a>
        </div>
    </section>

        <!-- ===== Main Content ===== -->
        <div class="container main-container">

            <!-- Cuaca -->
            <div id="cuaca" class="section mb-5">
                <div class="card card-custom">
                    <div class="card-header-blue">
                        <h5 class="mb-0">Prakiraan Cuaca Wilayah Perikanan</h5>
                    </div>
                    <div class="card-body">
                       @if($lokasi && count($cuacaSemua) > 0)
                            <div class="text-center mb-3">
                                <h6>{{ $lokasi['desa'] ?? '-' }}, {{ $lokasi['kecamatan'] ?? '-' }}, {{ $lokasi['kotkab'] ?? '-' }}</h6>
                            </div>
                            <div class="scroll-container mb-3">
                                @foreach ($cuacaSemua as $jam)
                                    <div class="cuaca-card">
                                        <strong>{{ $jam['local_datetime'] ?? '-' }}</strong><br>
                                        {{ $jam['weather_desc'] ?? 'Tidak ada data' }}<br>
                                        🌡️ {{ $jam['t'] ?? '-' }}°C |
                                        💧 {{ $jam['hu'] ?? '-' }}% |
                                        💨 {{ $jam['ws'] ?? '-' }} km/jam
                                    </div>
                                @endforeach
                            </div>
                            <p class="mb-0 text-center" style="font-size: 13px;">
                                Sumber data cuaca: <strong>BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</strong>
                            </p>
                        @else
                            <p class="text-center text-muted">Data cuaca tidak tersedia untuk saat ini.</p>
                        @endif
                    </div>
                </div>
            </div>

            <!-- Peta -->
            <div id="peta" class="section mb-5">
                <div class="card card-custom">
                    <div class="card-header-blue">
                        <h5 class="mb-0">Peta Lokasi Potensi Ikan</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-center text-muted">
                            Peta interaktif ini untuk menemukan titik potensi ikan dan habitat perairan.
                        </p>
                        <div id="gis-map" style="height: 500px; border-radius: 10px;"></div>
                    </div>
                </div>
            </div>

            <!-- Testimoni -->
            <div class="section mb-5">
                <h3 class="text-center mb-4 text-primary animate-fade-in">Apa Kata Mereka?</h3>
                <div class="row">
                   <div class="col-md-4 mb-4 animate-slide-up" style="animation-delay: 0.1s;">
                       <div class="card card-custom card-hover p-4">
                            <p class="fst-italic text-muted">
                                "Website ini sangat membantu saya dalam mencari lokasi ikan yang akurat dan efisien."
                            </p>
                            <footer class="blockquote-footer">Bapak Budi, <cite>Nelayan</cite></footer>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4 animate-slide-up" style="animation-delay: 0.1s;">
                       <div class="card card-custom card-hover p-4">
                            <p class="fst-italic text-muted">
                                "Website ini memudahkan saya memantau kondisi mangrove dan habitat bentik di sekitar pesisir."
                            </p>
                            <footer class="blockquote-footer">Ibu Siti, <cite>Warga</cite></footer>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4 animate-slide-up" style="animation-delay: 0.1s;">
                       <div class="card card-custom card-hover p-4">
                            <p class="fst-italic text-muted">
                                "Peta interaktifnya keren! Sangat berguna untuk kegiatan lapangan."
                            </p>
                            <footer class="blockquote-footer">Mas Eko, <cite>Warga</cite></footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== Footer ===== -->
        <footer id="kontak" class="footer text-white pt-5 pb-3">
            <div class="container">
                <div class="row gy-4">
                    <!-- Tentang -->
                    <div class="col-lg-5 col-md-6">
                        <h5 class="fw-bold text-uppercase mb-3">🌊 Sistem Informasi Digital Perikanan</h5>
                        <p class="footer-desc mb-3">
                            Platform digital terintegrasi yang mendukung nelayan dan masyarakat pesisir 
                            dengan menyediakan data cuaca, lokasi ikan, 
                            dan informasi perikanan berbasis teknologi geospasial.
                        </p>
                    </div>

                    <!-- Tautan Cepat -->
                    <div class="col-lg-3 col-md-3 col-6">
                        <h6 class="fw-bold text-uppercase mb-3">Tautan Cepat</h6>
                        <ul class="list-unstyled footer-links">
                            <li><a href="#beranda">Beranda</a></li>
                            <li><a href="#peta">Peta Digital</a></li>
                            <li><a href="#cuaca">Prakiraan Cuaca</a></li>
                            <li><a href="#kontak">Kontak</a></li>
                        </ul>
                    </div>

                    <!-- Kontak -->
                    <div class="col-lg-4 col-md-3 col-6">
                        <h6 class="fw-bold text-uppercase mb-3">Hubungi Kami</h6>
                        <ul class="list-unstyled footer-contacts">
                            <li><i class="bi bi-envelope-fill me-2"></i> info@perikanan.digital</li>
                            <li><i class="bi bi-telephone-fill me-2"></i> +62 812 3456 7890</li>
                            <li><i class="bi bi-geo-alt-fill me-2"></i> Tanjungpinang, Kepulauan Riau</li>
                        </ul>
                    </div>
                </div>

                <hr class="border-light my-4">

                <div class="text-center small text-light">
                    &copy; {{ date('Y') }} <strong>Sistem Informasi Digital Perikanan.<br>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://unpkg.com/esri-leaflet@3.0.8/dist/esri-leaflet.js"></script>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="{{ asset('js/map.js') }}"></script>
    </body>
    </html>

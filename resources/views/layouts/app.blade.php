<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Informasi</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
        <!-- Navbar -->
    <header class="navbar navbar-expand-lg">
        <div class="container">
            <!-- Logo -->
            <div class="logo">
                <img src="{{ asset('images/logo.png') }}" alt="Logo Perikanan" class="hero-logo">
                <span>Perikanan Digital</span>
            </div>
            
            <!-- Tombol Toggle (Mobile) -->
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
                        <a class="nav-link" href="{{ route('home') }}">Beranda</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link active" href="{{ route('cuaca') }}">Cuaca</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ url('/#peta') }}">Peta</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ url('/#kontak') }}">Kontak</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Konten Halaman -->
    <main class="py-5" style="padding-top: 120px;">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="footer text-white text-center py-4">
        <small>
            <p class="mb-0" style="font-size: 13px;">
                Sumber data cuaca: <strong>BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</strong>
            </p>
        </small>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Informasi</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand">
                <img src="{{ asset('images/kkp-logo.png') }}" alt="Logo" height="40" class="d-inline-block align-text-top me-2">
                Sistem Informasi
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="{{ route('home') }}">Beranda</a></li>
                    <li class="nav-item"><a class="nav-link" href="{{ route('cuaca') }}">Cuaca</a></li>
                    <li class="nav-item"><a class="nav-link" href="{{ url('/#peta') }}">Peta Lokasi Ikan</a></li>
                    <li class="nav-item"><a class="nav-link" href="{{ url('/#kontak') }}">Kontak</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Konten Halaman -->
    <main class="py-4">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-light text-center py-3 border-top">
        <small>
            <p class="mb-0" style="font-size: 13px;">
                Sumber data cuaca: <strong>BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</strong>
            </p>
        </small>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

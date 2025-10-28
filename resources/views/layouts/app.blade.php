<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Informasi Digital Perikanan</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

    <!-- ===== Navbar ===== -->
    <header class="navbar">
        <div class="container">
            <div class="logo">
                {{-- <img src="{{ asset('images/kkp-logo.png') }}" alt="Logo" height="35" class="me-2"> --}}
                Perikanan Digital
            </div>
            <nav>
                <ul>
                    <li><a href="{{ route('home') }}">Beranda</a></li>
                    <li><a href="{{ route('cuaca') }}">Cuaca</a></li>
                    <li><a href="{{ url('/#peta') }}">Peta</a></li>
                    <li><a href="{{ url('/#kontak') }}">Kontak</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- ===== Konten Halaman ===== -->
    <main class="py-5" style="padding-top: 120px;">
        @yield('content')
    </main>

    <!-- ===== Footer ===== -->
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

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Informasi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
   
</head>
<body>

   <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand">
                <img src="{{ asset('images/kkp-logo.png') }}" alt="Logo" height="40" class="d-inline-block align-text-top me-2">
                Sistem Informasi
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/cuaca">Cuaca</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#peta">Peta Lokasi Ikan</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#kontak">Kontak</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container main-container">
        <div class="row mb-4">
            <div class="col-12">
                <img src="{{ asset('images/cover-image.png') }}" alt="Header Image" class="img-fluid header-image">
            </div>
        </div>
         @if($lokasi && count($cuacaTiga) > 0)
<div class="container mt-4">
    <div class="card shadow-sm">
        <div class="card-header bg-primary text-white text-center">
            <h5 class="mb-0">
                Prakiraan Cuaca: {{ $lokasi['desa'] ?? '-' }}, {{ $lokasi['kecamatan'] ?? '-' }}, {{ $lokasi['kotkab'] ?? '-' }}
            </h5>
        </div>
        <div class="card-body">
            <div class="row justify-content-center">
                @foreach ($cuacaTiga as $jam)
                    <div class="col-md-3 col-10 mb-3">
                        <div class="card border-0 shadow-sm text-center p-3">
                            <strong>{{ $jam['local_datetime'] ?? '-' }}</strong><br>
                            {{ $jam['weather_desc'] ?? 'Tidak ada data' }}<br>
                            🌡️ {{ $jam['t'] ?? '-' }}°C |
                            💧 {{ $jam['hu'] ?? '-' }}% |
                            💨 {{ $jam['ws'] ?? '-' }} km/jam
                        </div>
                    </div>
                @endforeach
            </div>
            <div class="text-center mt-3">
                <a href="{{ url('/cuaca') }}" class="btn btn-outline-primary btn-sm">Lihat Selengkapnya</a>
            </div>
        </div>
    </div>
</div>
@else
<div class="container mt-4 text-center text-muted">
    <p>Data cuaca tidak tersedia untuk saat ini.</p>
</div>
@endif

        <div id="peta"class="row mt-4">
            <div class="col-md-12">
                <div class="card card-custom">
                    <div class="card-body">
                        <h4 class="card-title text-center">Peta Lokasi Potensi Ikan</h4>
                        <p class="text-center text-muted">Gunakan peta interaktif ini untuk menemukan titik-titik lokasi ikan dan tempat pelelangan terdekat.</p>
                        
                        <div id="gis-map" style="height: 500px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 10px;">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-6 mb-4">
                <div class="card card-custom h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="me-4">
                            <img src="{{ asset('images/pdpi.png') }}" alt="Ikon Peta" style="width: 80px;">
                        </div>
                        <div>
                            <h5 class="card-title">Peta Prakiraan Daerah Penangkapan Ikan</h5>
                            <p class="card-text">
                                Peta Prakiraan Daerah Penangkapan Ikan (PDPI) membantu nelayan dalam mencari daerah penangkapan ikan dengan tingkat kepadatan yang tinggi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card card-custom h-100">
                    <div class="card-body">
                        <h5 class="card-title">Tempat Pelelangan Ikan Terdekat</h5>
                        <ul class="list-unstyled">
                            <li><small>● Informasi lokasi, jam buka, dan jenis ikan yang tersedia.</small></li>
                            <li><small>● Membantu nelayan menjual hasil tangkapan dengan harga terbaik.</small></li>
                            <li><small>● Peta interaktif menyusupkan rute tercepat menuju TPI.</small></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-5">
            <div class="col-12 text-center mb-4">
                <h3 class="card-title">Apa Kata Mereka?</h3>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card card-custom h-100 p-4">
                    <p class="fst-italic text-muted">"Website ini sangat membantu saya. Informasi lokasi ikan yang akurat membuat saya bisa menghemat waktu dan bahan bakar."</p>
                    <footer class="blockquote-footer mt-2">Bapak Budi <cite title="Nelayan">Nelayan</cite></footer>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card card-custom h-100 p-4">
                    <p class="fst-italic text-muted">"Saya jadi tahu tempat pelelangan mana yang sedang ramai. Ini mempermudah saya dalam menjual ikan."</p>
                    <footer class="blockquote-footer mt-2">Ibu Siti <cite title="Pedagang Ikan">Pedagang Ikan</cite></footer>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card card-custom h-100 p-4">
                    <p class="fst-italic text-muted">"Peta yang interaktif dan mudah dipahami, sangat berguna untuk kami yang di lapangan."</p>
                    <footer class="blockquote-footer mt-2">Mas Eko <cite title="Relawan KKP">Relawan KKP</cite></footer>
                </div>
            </div>
        </div>
    </div>

   <footer id="kontak" class="bg-primary text-white py-4 mt-5">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h5>Tentang Kami</h5>
                <p>Sistem informasi ini menyediakan data dan informasi penting seputar kelautan dan perikanan untuk mendukung berbagai pihak, khususnya nelayan.</p>
            </div>
            <div class="col-md-3">
                <h5>Tautan Cepat</h5>
                <ul class="list-unstyled">
                    <li><a href="#" class="text-white text-decoration-none">Beranda</a></li>
                    <li><a href="#" class="text-white text-decoration-none">Peta Lokasi Ikan</a></li>
                    <li><a href="#" class="text-white text-decoration-none">Tempat Pelelangan</a></li>
                </ul>
            </div>
            <div class="col-md-3">
                <h5>Kontak</h5>
                <ul class="list-unstyled">
                    <li><a href="#" class="text-white text-decoration-none">Email: info@kkp.go.id</a></li>
                    <li><a href="#" class="text-white text-decoration-none">Telepon: (021) 123456</a></li>
                    <li><a href="#" class="text-white text-decoration-none">Alamat: Jakarta, Indonesia</a></li>
                </ul>
            </div>
        </div>
        <hr class="mt-4">
        <div class="text-center">
            <p class="mb-0">&copy; 2025 Kementerian Kelautan dan Perikanan. All Rights Reserved.</p>
            <p class="mb-0" style="font-size: 13px;">
                Sumber data cuaca: <strong>BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</strong>
            </p>
        </div>
    </div>
</footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <script src="{{ asset('js/map.js') }}"></script>
    </body>
</html>
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CuacaController extends Controller
{
    public function home()
    {
        // Ambil data dari API BMKG
        $response = Http::get("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=21.01.10.2003");

        // Jika gagal koneksi, kirim data kosong ke view
        if ($response->failed()) {
            return view('welcome', ['lokasi' => null, 'cuacaSemua' => []]);
        }

        $data = $response->json();

        // Ambil lokasi dan data cuaca
        $lokasi = $data['lokasi'] ?? null;
        $cuaca = $data['data'][0]['cuaca'] ?? [];

        // Normalisasi struktur agar semua jam muncul
        $cuacaSemua = [];
        foreach ($cuaca as $sub) {
            if (is_array($sub)) {
                foreach ($sub as $jam) {
                    if (isset($jam['local_datetime'])) {
                        $cuacaSemua[] = $jam;
                    }
                }
            }
        }

        // Urutkan berdasarkan waktu (biar dari pagi ke malam)
        usort($cuacaSemua, function ($a, $b) {
            return strtotime($a['local_datetime']) <=> strtotime($b['local_datetime']);
        });

        // Kirim ke halaman welcome
        return view('welcome', compact('lokasi', 'cuacaSemua'));
    }
}

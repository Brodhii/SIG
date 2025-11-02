<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CuacaController extends Controller
{
    public function index()
    {
        $response = Http::get("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=21.01.10.2003");

        if ($response->failed()) {
            return view('cuaca', ['lokasi' => null, 'cuaca' => []]);
        }

        $data = $response->json();

        $lokasi = $data['lokasi'] ?? null;
        $cuaca = isset($data['data'][0]['cuaca']) && is_array($data['data'][0]['cuaca']) 
                ? $data['data'][0]['cuaca'] 
                : [];

        return view('cuaca', compact('lokasi', 'cuaca'));
    }

   public function home()
{
    $response = Http::get("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=21.01.10.2003");

    if ($response->failed()) {
        return view('welcome', ['lokasi' => null, 'cuacaTiga' => []]);
    }

    $data = $response->json();

    $lokasi = $data['lokasi'] ?? null;
    $cuaca = $data['data'][0]['cuaca'] ?? [];

    $cuacaTiga = [];
    if (!empty($cuaca[0]) && is_array($cuaca[0])) {
        $cuacaTiga = array_slice($cuaca[0], 0, 3);
    }
    return view('welcome', compact('lokasi', 'cuacaTiga'));

    }
}

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CuacaController;

Route::view('/kontak', 'kontak')->name('kontak');
Route::view('/peta', 'peta')->name('peta');

Route::get('/', function () {
    return view('welcome');
});

Route::get('/cuaca', [CuacaController::class, 'index'])->name('cuaca');
Route::get('/', [CuacaController::class, 'home'])->name('home');




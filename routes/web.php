<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CuacaController;

Route::get('/', [CuacaController::class, 'home'])->name('home');
Route::get('/cuaca', [CuacaController::class, 'index'])->name('cuaca');
Route::view('/kontak', 'kontak')->name('kontak');
Route::view('/peta', 'peta')->name('peta');

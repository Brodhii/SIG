<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CuacaController;

Route::get('/', function () {
    return view('welcome');
});

Route::view('/peta', 'peta')->name('peta');
Route::view('/kontak', 'kontak')->name('kontak');
Route::get('/cuaca', [CuacaController::class, 'index'])->name('cuaca');
<<<<<<< HEAD
Route::get('/', [CuacaController::class, 'home'])->name('home');
=======
Route::get('/', [CuacaController::class, 'home'])->name('home');





>>>>>>> ead4742 (ubah tampilan)

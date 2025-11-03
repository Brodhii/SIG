<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CuacaController;

Route::get('/', [CuacaController::class, 'home'])->name('home');


<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'AYOLA OCARINA PATROL API',
        'status' => 'online',
        'version' => '1.0.0',
    ]);
});

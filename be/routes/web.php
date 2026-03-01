<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Backend API is running successfully. Please access the frontend at http://localhost:5173']);
});

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Chatbot
Route::post('/chat', function (Request $request) {
    $request->validate([
        'message' => 'required|string',
        'conversation_id' => 'nullable|string',
    ]);
    
    $agent = new \App\Ai\Agents\ChatbotAgent();
    
    if ($user = $request->user('sanctum')) {
        if ($request->filled('conversation_id')) {
            $agent->continueOrStart($request->conversation_id, as: $user);
        } else {
            $agent->forUser($user);
        }
    }

    $response = $agent->prompt(
        $request->message,
        model: 'openai/gpt-oss-20b'
    );

    $replyText = $response->text;
    $productIds = [];
    $replyText = preg_replace_callback('/\[PRODUCT:(\d+)\]/', function ($matches) use (&$productIds) {
        $product = \App\Models\Product::find($matches[1]);
        if (!$product) return '';
        $productIds[] = $product->id;
        return "<strong>{$product->name}</strong>";
    }, $replyText);

    $productIds = array_unique($productIds);
    $productIds = array_slice($productIds, 0, 3); // Max 3 cards
    if (!empty($productIds)) {
        $html = "<div style='display:flex;gap:12px;overflow-x:auto;padding:8px 4px 12px 4px;margin-top:16px; max-width:100%; scrollbar-width: thin;'>";
        foreach ($productIds as $id) {
            $p = \App\Models\Product::find($id);
            if ($p) {
                $img = $p->image_url ? "http://127.0.0.1:8000/uploads/{$p->image_url}" : "https://placehold.co/100?text=No+Image";
                $price = number_format($p->price) . ' ₫';
                $html .= "<div style='flex:0 0 160px;border:1px solid #dee2e6;border-radius:12px;padding:12px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.05);'>"
                      . "<img src='{$img}' style='width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;' />"
                      . "<div style='font-size:13px;font-weight:600;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;'>{$p->name}</div>"
                      . "<div style='font-size:13px;color:#dc3545;font-weight:700;'>{$price}</div>"
                      . "<a href='/products/{$p->id}' target='_blank' style='display:block;text-align:center;background:#0d6efd;color:#fff;padding:6px;border-radius:6px;font-size:12px;text-decoration:none;margin-top:10px;'>Xem chi tiết</a>"
                      . "</div>";
            }
        }
        $html .= "</div>";
        $replyText .= $html;
    }

    return response()->json([
        'reply' => $replyText,
        'conversation_id' => $response->conversationId ?? null,
    ]);
});

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Orders (Auth optional or external logic)
Route::post('/orders', [OrderController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // Admin Routes
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
    Route::put('/admin/orders/{id}', [OrderController::class, 'update']);
});

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $orders = Order::where('user_id', $user->id)
            ->with(['details.product'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $order = Order::with(['details.product'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required',
            'customer_phone' => 'required',
            'customer_address' => 'required',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $total = 0;
            $itemsData = [];

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    return response()->json(['message' => 'Product ' . $product->name . ' is out of stock'], 400);
                }
                $total += $product->price * $item['quantity'];
                $itemsData[] = [
                    'product' => $product,
                    'quantity' => $item['quantity']
                ];
            }

            $order = Order::create([
                'user_id' => auth('sanctum')->id() ?? null,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_address' => $request->customer_address,
                'total_amount' => $total,
                'status' => 'Chờ xác nhận',
            ]);

            foreach ($itemsData as $data) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $data['product']->id,
                    'quantity' => $data['quantity'],
                    'unit_price' => $data['product']->price,
                ]);
                $data['product']->decrement('stock', $data['quantity']);
            }

            DB::commit();
            return response()->json($order->load('details'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order failed: ' . $e->getMessage()], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function adminIndex(Request $request)
    {
        $query = Order::with(['details.product', 'user']);
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        $orders = $query->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|string|in:Chờ xác nhận,Đang giao,Đã giao,Đã hủy'
        ]);
        $order->update(['status' => $validated['status']]);
        return response()->json($order);
    }
}

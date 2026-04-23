<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index() { return response()->json(Portfolio::all()); }
    public function show(Portfolio $portfolio) { return response()->json($portfolio); }

    public function store(Request $request) {
        $v = $request->validate(['title' => 'required|string|max:255', 'category' => 'nullable|string|max:100', 'image_url' => 'required|string', 'description' => 'nullable|string']);
        return response()->json(Portfolio::create($v), 201);
    }

    public function update(Request $request, Portfolio $portfolio) {
        $v = $request->validate(['title' => 'sometimes|string|max:255', 'category' => 'nullable|string|max:100', 'image_url' => 'sometimes|string', 'description' => 'nullable|string']);
        $portfolio->update($v);
        return response()->json($portfolio);
    }

    public function destroy(Portfolio $portfolio) {
        $portfolio->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

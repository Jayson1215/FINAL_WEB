<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index()
    {
        try {
            $portfolios = Portfolio::all();
            return response()->json($portfolios);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch portfolio',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Portfolio $portfolio)
    {
        return response()->json($portfolio);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'image_url' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $portfolio = Portfolio::create($validated);

        return response()->json($portfolio, 201);
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:100',
            'image_url' => 'sometimes|string',
            'description' => 'nullable|string',
        ]);

        $portfolio->update($validated);

        return response()->json($portfolio);
    }

    public function destroy(Portfolio $portfolio)
    {
        $portfolio->delete();

        return response()->json(['message' => 'Portfolio item deleted']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        try {
            $services = Service::all();
            return response()->json($services);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch services',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Service $service)
    {
        return response()->json($service);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'image_path' => 'nullable|string|max:2048',
            'downpayment_rate' => 'nullable|numeric|min:0|max:100',
        ]);

        $service = Service::create($validated);

        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price' => 'sometimes|numeric|min:0',
            'duration' => 'sometimes|integer|min:1',
            'image_path' => 'nullable|string|max:2048',
            'downpayment_rate' => 'nullable|numeric|min:0|max:100',
        ]);

        $service->update($validated);

        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['message' => 'Service deleted']);
    }
}

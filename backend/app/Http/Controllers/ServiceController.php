<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index() { return response()->json(Service::orderBy('price', 'asc')->get()); }

    public function show(Service $service) { return response()->json($service); }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'image_path' => 'nullable|string|max:2048',
            'image' => 'nullable|image|max:10240',
            'downpayment_rate' => 'nullable|numeric|min:0|max:100',
            'inclusions' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $v['image_path'] = $this->storeUploadedImage($request->file('image'));
        } elseif (!empty($v['image_path'])) {
            if ($this->looksLikeLocalPath($v['image_path'])) {
                return response()->json([
                    'message' => 'Image path cannot be a local computer path. Upload a file or use a public URL.',
                ], 422);
            }
            $v['image_path'] = $this->normalizeImagePath($v['image_path']);
        }

        return response()->json(Service::create($v), 201);
    }

    public function update(Request $request, Service $service)
    {
        $v = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'price' => 'sometimes|numeric|min:0',
            'duration' => 'sometimes|integer|min:1',
            'image_path' => 'nullable|string|max:2048',
            'image' => 'nullable|image|max:10240',
            'downpayment_rate' => 'nullable|numeric|min:0|max:100',
            'inclusions' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $v['image_path'] = $this->storeUploadedImage($request->file('image'));
        } elseif (array_key_exists('image_path', $v) && !empty($v['image_path'])) {
            if ($this->looksLikeLocalPath($v['image_path'])) {
                return response()->json([
                    'message' => 'Image path cannot be a local computer path. Upload a file or use a public URL.',
                ], 422);
            }
            $v['image_path'] = $this->normalizeImagePath($v['image_path']);
        }

        $service->update($v);
        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(['message' => 'Deleted']);
    }

    private function storeUploadedImage(UploadedFile $image): string
    {
        $directory = env('IMAGES_STORAGE_PATH') ?: public_path('assets/images');
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $filename = Str::uuid()->toString() . '.' . $image->getClientOriginalExtension();
        $image->move($directory, $filename);

        return '/assets/images/' . $filename;
    }

    private function looksLikeLocalPath(string $value): bool
    {
        $trimmed = trim($value);
        return (bool) preg_match('/^[a-zA-Z]:\\\\|^\\\\|^\.\\\\|^\.\.\\\\|^file:\/\//', $trimmed);
    }

    private function normalizeImagePath(string $value): string
    {
        $trimmed = trim($value);
        if ($trimmed === '') {
            return '';
        }

        if (preg_match('/^https?:\/\//i', $trimmed)) {
            return $trimmed;
        }

        return '/' . ltrim($trimmed, '/');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class PortfolioController extends Controller
{
    public function index() { return response()->json(Portfolio::all()); }
    public function show(Portfolio $portfolio) { return response()->json($portfolio); }

    public function store(Request $request) {
        $v = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:2048',
            'image' => 'nullable|image|max:10240',
            'description' => 'nullable|string',
        ]);

        if (!$request->hasFile('image') && empty($v['image_url'])) {
            return response()->json([
                'message' => 'Please upload an image file or provide a public image URL.',
            ], 422);
        }

        if ($request->hasFile('image')) {
            $v['image_url'] = $this->storeUploadedImage($request->file('image'));
        } elseif (!empty($v['image_url'])) {
            if ($this->looksLikeLocalPath($v['image_url'])) {
                return response()->json([
                    'message' => 'Image URL cannot be a local computer path. Upload a file or use a public URL.',
                ], 422);
            }
            $v['image_url'] = $this->normalizeImageUrl($v['image_url']);
        }

        unset($v['image']);
        return response()->json(Portfolio::create($v), 201);
    }

    public function update(Request $request, Portfolio $portfolio) {
        $v = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:100',
            'image_url' => 'sometimes|string|max:2048',
            'image' => 'nullable|image|max:10240',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $v['image_url'] = $this->storeUploadedImage($request->file('image'));
        } elseif (array_key_exists('image_url', $v) && !empty($v['image_url'])) {
            if ($this->looksLikeLocalPath($v['image_url'])) {
                return response()->json([
                    'message' => 'Image URL cannot be a local computer path. Upload a file or use a public URL.',
                ], 422);
            }
            $v['image_url'] = $this->normalizeImageUrl($v['image_url']);
        }

        unset($v['image']);
        $portfolio->update($v);
        return response()->json($portfolio);
    }

    public function destroy(Portfolio $portfolio) {
        $portfolio->delete();
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

    private function normalizeImageUrl(string $value): string
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

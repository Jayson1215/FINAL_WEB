<?php

namespace Database\Seeders;

use App\Models\Portfolio;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ImageAssetsSeeder extends Seeder
{
    public function run(): void
    {
        $frontendImagesDir = base_path('../frontend/public/images');
        $backendImagesDir = public_path('assets/images');

        if (!is_dir($backendImagesDir)) {
            mkdir($backendImagesDir, 0755, true);
        }

        if (is_dir($frontendImagesDir)) {
            $files = scandir($frontendImagesDir) ?: [];
            foreach ($files as $file) {
                if ($file === '.' || $file === '..') {
                    continue;
                }

                $source = $frontendImagesDir . DIRECTORY_SEPARATOR . $file;
                if (!is_file($source)) {
                    continue;
                }

                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (!in_array($extension, ['png', 'jpg', 'jpeg', 'webp', 'gif'], true)) {
                    continue;
                }

                $target = $backendImagesDir . DIRECTORY_SEPARATOR . $file;
                @copy($source, $target);
            }
        }

        Service::query()
            ->whereNotNull('image_path')
            ->get()
            ->each(function (Service $service) use ($backendImagesDir): void {
                $filename = $this->extractFilename($service->image_path);
                if ($filename === null) {
                    return;
                }

                if (is_file($backendImagesDir . DIRECTORY_SEPARATOR . $filename)) {
                    $service->image_path = '/api/images/' . $filename;
                    $service->save();
                }
            });

        Portfolio::query()
            ->whereNotNull('image_url')
            ->get()
            ->each(function (Portfolio $item) use ($backendImagesDir): void {
                $filename = $this->extractFilename($item->image_url);
                if ($filename === null) {
                    return;
                }

                if (is_file($backendImagesDir . DIRECTORY_SEPARATOR . $filename)) {
                    $item->image_url = '/api/images/' . $filename;
                    $item->save();
                }
            });
    }

    private function extractFilename(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);
        if ($trimmed === '') {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $trimmed)) {
            $path = parse_url($trimmed, PHP_URL_PATH);
            if (!is_string($path) || $path === '') {
                return null;
            }
            $trimmed = $path;
        }

        $filename = basename($trimmed);
        if (!preg_match('/^[A-Za-z0-9._-]+\.(png|jpe?g|webp|gif)$/i', $filename)) {
            return null;
        }

        return $filename;
    }
}

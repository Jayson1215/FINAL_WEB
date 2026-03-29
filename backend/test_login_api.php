<?php

// Test login endpoint directly
$url = 'http://localhost:8000/api/login';
$data = json_encode([
    'email' => 'Jayson@gmail.com',
    'password' => 'jayson123'
]);

$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n",
        'method'  => 'POST',
        'content' => $data,
    ]
];

$context = stream_context_create($options);
$result = @file_get_contents($url, false, $context);

echo "Response:\n";
echo $result . "\n\n";

if ($http_response_header) {
    echo "Headers:\n";
    foreach ($http_response_header as $header) {
        echo "  $header\n";
    }
}

<?php
// Test login with admin@gmail.com / admin123
$ch = curl_init('http://localhost:8000/api/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@gmail.com',
    'password' => 'admin123'
]));

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $status\n";
echo "Response:\n";
$data = json_decode($response);
if ($data) {
    echo "✓ User ID: " . $data->user->id . "\n";
    echo "✓ Email: " . $data->user->email . "\n";
    echo "✓ Role: " . $data->user->role . "\n";
    echo "✓ Token: " . substr($data->token, 0, 20) . "...\n";
} else {
    echo $response . "\n";
}
?>

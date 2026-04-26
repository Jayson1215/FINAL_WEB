<?php
$ch = curl_init("https://final-web-ls8m.onrender.com/api/payments/verify");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'OPTIONS');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Origin: https://finalweb-pied.vercel.app",
    "Access-Control-Request-Method: POST",
    "Access-Control-Request-Headers: content-type"
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "HTTP Status: $httpcode\n";
echo $response;

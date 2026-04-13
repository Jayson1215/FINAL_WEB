<?php
$host = 'mysql-13f6dbb0-web-system-project.e.aivencloud.com';
$db   = 'defaultdb';
$user = 'avnadmin';
$pass = 'AVNS_bIJ5kk0XwS3sq1x7Cry';
$port = '20079';

$dsn = "mysql:host=$host;port=$port;dbname=$db";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     echo "Connected successfully to Aiven!\n";
} catch (\PDOException $e) {
     echo "Connection Failed: " . $e->getMessage() . "\n";
}

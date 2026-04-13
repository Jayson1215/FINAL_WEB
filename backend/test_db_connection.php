<?php

$host = 'mysql-13f6dbb0-web-system-project.e.aivencloud.com';
$port = 20079;
$user = 'avnadmin';
$pass = 'AVNS_bIJ5kk0XwS3sq1x7Cry';
$db = 'defaultdb';

echo "Testing connection to MySQL...\n";
echo "Host: $host:$port\n";
echo "User: $user\n";
echo "Database: $db\n\n";

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$db",
        $user,
        $pass,
        [
            PDO::MYSQL_ATTR_SSL_CA => realpath('ca.pem'),
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );
    echo "✓ Connection successful!\n";
    $result = $pdo->query('SELECT VERSION()');
    echo "MySQL Version: " . $result->fetch(PDO::FETCH_COLUMN) . "\n";
} catch (Exception $e) {
    echo "✗ Connection failed:\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getCode() . "\n";
}

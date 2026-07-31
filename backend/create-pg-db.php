<?php

$host = env_param('DB_HOST', '127.0.0.1');
$port = env_param('DB_PORT', '5432');
$user = env_param('DB_USERNAME', 'postgres');
$pass = env_param('DB_PASSWORD', 'postgres');

function env_param($key, $default) {
    $lines = file(__DIR__ . '/.env');
    foreach ($lines as $line) {
        if (strpos(trim($line), $key . '=') === 0) {
            return trim(explode('=', $line, 2)[1]);
        }
    }
    return $default;
}

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=postgres", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Check if database exists
    $stmt = $pdo->query("SELECT 1 FROM pg_database WHERE datname = 'ayola_patrol_db'");
    if (!$stmt->fetch()) {
        $pdo->exec("CREATE DATABASE ayola_patrol_db");
        echo "Database ayola_patrol_db created successfully in PostgreSQL!\n";
    } else {
        echo "Database ayola_patrol_db already exists in PostgreSQL.\n";
    }
} catch (PDOException $e) {
    echo "PostgreSQL Connection Error: " . $e->getMessage() . "\n";
}

<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\PatrolPoint;

echo "=== POSTGRESQL VERIFICATION ===\n";
echo "Database Driver: " . DB::connection()->getDriverName() . "\n";
echo "Database Name: " . DB::connection()->getDatabaseName() . "\n";
echo "Total Users: " . User::count() . "\n";
echo "Total Patrol Points: " . PatrolPoint::count() . "\n\n";

echo "--- Sample Patrol Points in PostgreSQL ---\n";
foreach (PatrolPoint::all() as $pt) {
    echo "- [{$pt->code}] {$pt->name} ({$pt->area}) - GPS: {$pt->latitude}, {$pt->longitude}\n";
}

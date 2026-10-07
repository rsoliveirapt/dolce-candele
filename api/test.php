<?php
/**
 * Dolce Candele — API Diagnostic Test
 * Acede a: https://dolcecandele.rsoliveira.pt/api/test.php
 * Remove este ficheiro depois de confirmar que tudo funciona.
 */
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$result = [
    'php_version' => PHP_VERSION,
    'pdo_loaded'  => extension_loaded('pdo'),
    'pdo_mysql'   => extension_loaded('pdo_mysql'),
    'config_ok'   => defined('DB_HOST'),
    'db_host'     => DB_HOST,
    'db_name'     => DB_NAME,
    'db_user'     => DB_USER,
    'db_connect'  => false,
    'tables'      => [],
    'error'       => null,
];

try {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $result['db_connect'] = true;

    // List existing tables
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $result['tables'] = $tables;
} catch (Exception $e) {
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

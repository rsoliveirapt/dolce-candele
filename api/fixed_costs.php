<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$db     = getDB();

try {
    switch ($method) {
        case 'GET':
            jsonOk(array_map('mapFC', $db->query('SELECT * FROM fixed_costs ORDER BY created_at ASC')->fetchAll()));

        case 'POST':
            $b = getBody();
            $stmt = $db->prepare('INSERT INTO fixed_costs (name, monthly_amount, category) VALUES (?,?,?)');
            $stmt->execute([$b['name'], $b['monthlyAmount'] ?? 0, $b['category'] ?? 'Operacional']);
            $newId = $db->lastInsertId();
            jsonOk(mapFC($db->query("SELECT * FROM fixed_costs WHERE id=$newId")->fetch()));

        case 'PUT':
            if (!$id) jsonError('id required');
            $b = getBody();
            $db->prepare('UPDATE fixed_costs SET name=?, monthly_amount=?, category=? WHERE id=?')
               ->execute([$b['name'], $b['monthlyAmount'] ?? 0, $b['category'] ?? 'Operacional', $id]);
            jsonOk(['id' => $id]);

        case 'DELETE':
            if (!$id) jsonError('id required');
            $db->prepare('DELETE FROM fixed_costs WHERE id=?')->execute([$id]);
            jsonOk(['deleted' => true]);

        default: jsonError('Method not allowed', 405);
    }
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}

function mapFC(array $r): array {
    return [
        'id'            => $r['id'],
        'name'          => $r['name'],
        'monthlyAmount' => (float) $r['monthly_amount'],
        'category'      => $r['category'],
    ];
}

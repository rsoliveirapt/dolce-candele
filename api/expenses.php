<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$db     = getDB();

try {
    switch ($method) {
        case 'GET':
            jsonOk(array_map('mapExp', $db->query('SELECT * FROM expenses ORDER BY expense_date DESC, created_at DESC')->fetchAll()));

        case 'POST':
            $b = getBody();
            $stmt = $db->prepare('INSERT INTO expenses (description, category, amount, expense_date) VALUES (?,?,?,?)');
            $stmt->execute([$b['description'], $b['category'] ?? 'operacional', $b['amount'] ?? 0, $b['expenseDate'] ?? date('Y-m-d')]);
            $newId = $db->lastInsertId();
            jsonOk(mapExp($db->query("SELECT * FROM expenses WHERE id=$newId")->fetch()));

        case 'DELETE':
            if (!$id) jsonError('id required');
            $db->prepare('DELETE FROM expenses WHERE id=?')->execute([$id]);
            jsonOk(['deleted' => true]);

        default: jsonError('Method not allowed', 405);
    }
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}

function mapExp(array $r): array {
    return [
        'id'          => $r['id'],
        'description' => $r['description'],
        'category'    => $r['category'],
        'amount'      => (float) $r['amount'],
        'expenseDate' => $r['expense_date'],
    ];
}

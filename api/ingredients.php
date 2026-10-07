<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$db     = getDB();

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                $stmt = $db->prepare('SELECT * FROM ingredients WHERE id = ?');
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                $row ? jsonOk(mapIngredient($row)) : jsonError('Not found', 404);
            }
            $rows = $db->query('SELECT * FROM ingredients ORDER BY created_at ASC')->fetchAll();
            jsonOk(array_map('mapIngredient', $rows));

        case 'POST':
            $b = getBody();
            $unitCost = calcUnitCost($b['purchaseCost'] ?? 0, $b['purchaseQuantity'] ?? 1);
            $stmt = $db->prepare('INSERT INTO ingredients
                (supplier_id, name, category, purchase_quantity, purchase_unit, purchase_cost, unit_cost, current_stock, min_stock)
                VALUES (?,?,?,?,?,?,?,?,?)');
            $stmt->execute([
                $b['supplierId'] ?? null,
                $b['name'],
                $b['category'] ?? 'wax',
                $b['purchaseQuantity'] ?? 0,
                $b['purchaseUnit']     ?? 'g',
                $b['purchaseCost']     ?? 0,
                $unitCost,
                $b['currentStock']     ?? $b['purchaseQuantity'] ?? 0,
                $b['minStock']         ?? 0,
            ]);
            $newId = $db->lastInsertId();
            $row = $db->query("SELECT * FROM ingredients WHERE id = $newId")->fetch();
            jsonOk(mapIngredient($row));

        case 'PUT':
            if (!$id) jsonError('id required');
            $b = getBody();
            $unitCost = calcUnitCost($b['purchaseCost'] ?? 0, $b['purchaseQuantity'] ?? 1);
            $stmt = $db->prepare('UPDATE ingredients SET
                supplier_id=?, name=?, category=?, purchase_quantity=?, purchase_unit=?,
                purchase_cost=?, unit_cost=?, current_stock=?, min_stock=?
                WHERE id=?');
            $stmt->execute([
                $b['supplierId'] ?? null,
                $b['name'],
                $b['category'] ?? 'wax',
                $b['purchaseQuantity'] ?? 0,
                $b['purchaseUnit']     ?? 'g',
                $b['purchaseCost']     ?? 0,
                $unitCost,
                $b['currentStock']     ?? 0,
                $b['minStock']         ?? 0,
                $id,
            ]);
            jsonOk(['id' => $id]);

        // Restock endpoint: PUT /api/ingredients.php?id=X&action=restock
        case 'PATCH':
            if (!$id) jsonError('id required');
            $b = getBody();
            $qty = floatval($b['additionalQty'] ?? 0);
            $db->prepare('UPDATE ingredients SET current_stock = current_stock + ? WHERE id = ?')->execute([$qty, $id]);
            $row = $db->query("SELECT * FROM ingredients WHERE id = $id")->fetch();
            jsonOk(mapIngredient($row));

        case 'DELETE':
            if (!$id) jsonError('id required');
            $db->prepare('DELETE FROM ingredients WHERE id=?')->execute([$id]);
            jsonOk(['deleted' => true]);

        default:
            jsonError('Method not allowed', 405);
    }
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}

// ── Helpers ──────────────────────────────────────────────────────
function calcUnitCost(float $cost, float $qty): float {
    return $qty > 0 ? round($cost / $qty, 4) : 0;
}

function mapIngredient(array $row): array {
    return [
        'id'               => $row['id'],
        'supplierId'       => $row['supplier_id'],
        'name'             => $row['name'],
        'category'         => $row['category'],
        'purchaseQuantity' => (float) $row['purchase_quantity'],
        'purchaseUnit'     => $row['purchase_unit'],
        'purchaseCost'     => (float) $row['purchase_cost'],
        'unitCost'         => (float) $row['unit_cost'],
        'currentStock'     => (float) $row['current_stock'],
        'minStock'         => (float) $row['min_stock'],
        'createdAt'        => $row['created_at'],
    ];
}

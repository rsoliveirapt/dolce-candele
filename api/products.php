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
                $prod  = fetchProduct($db, $id);
                $prod  ? jsonOk($prod) : jsonError('Not found', 404);
            }
            $prods = $db->query('SELECT * FROM products ORDER BY created_at ASC')->fetchAll();
            jsonOk(array_map(fn($p) => fetchProduct($db, $p['id']), $prods));

        case 'POST':
            $b = getBody();
            $stmt = $db->prepare('INSERT INTO products
                (name, category, description, labor_time_minutes, labor_hourly_rate, overhead_percentage, target_margin_percentage, suggested_price)
                VALUES (?,?,?,?,?,?,?,?)');
            $stmt->execute([
                $b['name'], $b['category'] ?? 'Velas de Sobremesa', $b['description'] ?? null,
                $b['laborTimeMinutes'] ?? 30, $b['laborHourlyRate'] ?? 12.5,
                $b['overheadPercentage'] ?? 10, $b['targetMarginPercentage'] ?? 60,
                $b['suggestedPrice'] ?? 0,
            ]);
            $newId = $db->lastInsertId();
            // Insert recipe items
            saveRecipe($db, $newId, $b['recipe'] ?? []);
            jsonOk(fetchProduct($db, $newId));

        case 'PUT':
            if (!$id) jsonError('id required');
            $b = getBody();
            $stmt = $db->prepare('UPDATE products SET
                name=?, category=?, description=?, labor_time_minutes=?, labor_hourly_rate=?,
                overhead_percentage=?, target_margin_percentage=?, suggested_price=?
                WHERE id=?');
            $stmt->execute([
                $b['name'], $b['category'] ?? 'Velas de Sobremesa', $b['description'] ?? null,
                $b['laborTimeMinutes'] ?? 30, $b['laborHourlyRate'] ?? 12.5,
                $b['overheadPercentage'] ?? 10, $b['targetMarginPercentage'] ?? 60,
                $b['suggestedPrice'] ?? 0,
                $id,
            ]);
            // Replace recipe items
            $db->prepare('DELETE FROM recipes WHERE product_id=?')->execute([$id]);
            saveRecipe($db, $id, $b['recipe'] ?? []);
            jsonOk(fetchProduct($db, $id));

        case 'DELETE':
            if (!$id) jsonError('id required');
            $db->prepare('DELETE FROM products WHERE id=?')->execute([$id]);
            jsonOk(['deleted' => true]);

        default:
            jsonError('Method not allowed', 405);
    }
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}

// ── Helpers ──────────────────────────────────────────────────────
function saveRecipe(PDO $db, int|string $productId, array $recipe): void {
    $stmt = $db->prepare('INSERT INTO recipes (product_id, ingredient_id, quantity, unit) VALUES (?,?,?,?)');
    foreach ($recipe as $item) {
        $stmt->execute([$productId, $item['ingredientId'], $item['quantity'] ?? 0, $item['unit'] ?? 'g']);
    }
}

function fetchProduct(PDO $db, int|string $id): ?array {
    $stmt = $db->prepare('SELECT * FROM products WHERE id=?');
    $stmt->execute([$id]);
    $p = $stmt->fetch();
    if (!$p) return null;

    $rStmt = $db->prepare('SELECT ingredient_id, quantity, unit FROM recipes WHERE product_id=?');
    $rStmt->execute([$id]);
    $recipe = array_map(fn($r) => [
        'ingredientId' => $r['ingredient_id'],
        'quantity'     => (float) $r['quantity'],
        'unit'         => $r['unit'],
    ], $rStmt->fetchAll());

    return [
        'id'                      => $p['id'],
        'name'                    => $p['name'],
        'category'                => $p['category'],
        'description'             => $p['description'],
        'laborTimeMinutes'        => (int)   $p['labor_time_minutes'],
        'laborHourlyRate'         => (float) $p['labor_hourly_rate'],
        'overheadPercentage'      => (float) $p['overhead_percentage'],
        'targetMarginPercentage'  => (float) $p['target_margin_percentage'],
        'suggestedPrice'          => (float) $p['suggested_price'],
        'recipe'                  => $recipe,
        'createdAt'               => $p['created_at'],
    ];
}

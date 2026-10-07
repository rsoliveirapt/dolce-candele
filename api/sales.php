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
                $s = fetchSale($db, $id);
                $s ? jsonOk($s) : jsonError('Not found', 404);
            }
            $rows = $db->query('SELECT * FROM sales ORDER BY sale_date DESC')->fetchAll();
            jsonOk(array_map(fn($r) => fetchSale($db, $r['id']), $rows));

        case 'POST':
            $b = getBody();
            $db->beginTransaction();

            $stmt = $db->prepare('INSERT INTO sales
                (customer_name, sales_channel, payment_method, gross_amount, platform_fee, net_amount, status, sale_date, notes)
                VALUES (?,?,?,?,?,?,?,?,?)');
            $stmt->execute([
                $b['customerName']   ?? null,
                $b['salesChannel']   ?? null,
                $b['paymentMethod']  ?? null,
                $b['grossAmount']    ?? 0,
                $b['platformFee']    ?? 0,
                $b['netAmount']      ?? 0,
                $b['status']         ?? 'em_producao',
                $b['saleDate']       ?? date('Y-m-d H:i:s'),
                $b['notes']          ?? null,
            ]);
            $saleId = $db->lastInsertId();

            // Insert sale items
            if (!empty($b['items'])) {
                $iStmt = $db->prepare('INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?,?,?,?,?)');
                foreach ($b['items'] as $item) {
                    $subtotal = ($item['unitPrice'] ?? 0) * ($item['quantity'] ?? 1);
                    $iStmt->execute([$saleId, $item['productId'], $item['quantity'] ?? 1, $item['unitPrice'] ?? 0, $subtotal]);
                }
            }

            // Deduct stock from ingredients based on recipes
            if (!empty($b['items'])) {
                foreach ($b['items'] as $item) {
                    $recipe = $db->prepare('SELECT ingredient_id, quantity FROM recipes WHERE product_id=?');
                    $recipe->execute([$item['productId']]);
                    foreach ($recipe->fetchAll() as $ri) {
                        $deduct = $ri['quantity'] * ($item['quantity'] ?? 1);
                        $db->prepare('UPDATE ingredients SET current_stock = GREATEST(0, current_stock - ?) WHERE id=?')
                           ->execute([$deduct, $ri['ingredient_id']]);
                    }
                }
            }

            $db->commit();
            jsonOk(fetchSale($db, $saleId));

        case 'PUT':
            // Update status only
            if (!$id) jsonError('id required');
            $b = getBody();
            $db->prepare('UPDATE sales SET status=? WHERE id=?')->execute([$b['status'], $id]);
            jsonOk(['id' => $id, 'status' => $b['status']]);

        case 'DELETE':
            if (!$id) jsonError('id required');
            $db->prepare('DELETE FROM sales WHERE id=?')->execute([$id]);
            jsonOk(['deleted' => true]);

        default: jsonError('Method not allowed', 405);
    }
} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    jsonError($e->getMessage(), 500);
}

// ── Helpers ──────────────────────────────────────────────────────
function fetchSale(PDO $db, int|string $id): ?array {
    $stmt = $db->prepare('SELECT * FROM sales WHERE id=?');
    $stmt->execute([$id]);
    $s = $stmt->fetch();
    if (!$s) return null;

    $iStmt = $db->prepare('SELECT * FROM sale_items WHERE sale_id=?');
    $iStmt->execute([$id]);
    $items = array_map(fn($i) => [
        'id'        => $i['id'],
        'productId' => $i['product_id'],
        'quantity'  => (int)   $i['quantity'],
        'unitPrice' => (float) $i['unit_price'],
        'subtotal'  => (float) $i['subtotal'],
    ], $iStmt->fetchAll());

    return [
        'id'            => $s['id'],
        'orderNumber'   => $s['order_number'],
        'customerName'  => $s['customer_name'],
        'salesChannel'  => $s['sales_channel'],
        'paymentMethod' => $s['payment_method'],
        'grossAmount'   => (float) $s['gross_amount'],
        'platformFee'   => (float) $s['platform_fee'],
        'netAmount'     => (float) $s['net_amount'],
        'status'        => $s['status'],
        'saleDate'      => $s['sale_date'],
        'notes'         => $s['notes'],
        'items'         => $items,
    ];
}

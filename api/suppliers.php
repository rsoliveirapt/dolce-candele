<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$db     = getDB();

try {
    switch ($method) {
        // ── LIST ─────────────────────────────────────────────────
        case 'GET':
            if ($id) {
                $stmt = $db->prepare('SELECT * FROM suppliers WHERE id = ?');
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                $row ? jsonOk($row) : jsonError('Not found', 404);
            }
            jsonOk($db->query('SELECT * FROM suppliers ORDER BY created_at ASC')->fetchAll());

        // ── CREATE ───────────────────────────────────────────────
        case 'POST':
            $b = getBody();
            $stmt = $db->prepare('INSERT INTO suppliers (name, contact, website, lead_time_days, notes) VALUES (?,?,?,?,?)');
            $stmt->execute([$b['name'], $b['contact'] ?? null, $b['website'] ?? null, $b['leadTimeDays'] ?? 3, $b['notes'] ?? null]);
            $newId = $db->lastInsertId();
            $row = $db->query("SELECT * FROM suppliers WHERE id = $newId")->fetch();
            jsonOk($row);

        // ── UPDATE ───────────────────────────────────────────────
        case 'PUT':
            if (!$id) jsonError('id required');
            $b = getBody();
            $stmt = $db->prepare('UPDATE suppliers SET name=?, contact=?, website=?, lead_time_days=?, notes=? WHERE id=?');
            $stmt->execute([$b['name'], $b['contact'] ?? null, $b['website'] ?? null, $b['leadTimeDays'] ?? 3, $b['notes'] ?? null, $id]);
            jsonOk(['id' => $id]);

        // ── DELETE ───────────────────────────────────────────────
        case 'DELETE':
            if (!$id) jsonError('id required');
            $db->prepare('DELETE FROM suppliers WHERE id=?')->execute([$id]);
            jsonOk(['deleted' => true]);

        default:
            jsonError('Method not allowed', 405);
    }
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}

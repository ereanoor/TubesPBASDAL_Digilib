<?php
header("Content-Type: application/json");
require '../login/koneksi.php';

try {
    $stmt = $pdo->query("SELECT nama, email FROM users WHERE role = 'anggota' ORDER BY nama ASC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $users
    ]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
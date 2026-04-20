<?php
header("Content-Type: application/json; charset=UTF-8");
require '../login/koneksi.php';

$user_id = $_GET['user_id'];

try {
    $query = "SELECT p.*, b.judul, b.penulis 
              FROM peminjaman p 
              JOIN buku b ON p.buku_id = b.id 
              WHERE p.user_id = :uid ORDER BY p.id DESC";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':uid', $user_id);
    $stmt->execute();
    $riwayat = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "riwayat" => $riwayat]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
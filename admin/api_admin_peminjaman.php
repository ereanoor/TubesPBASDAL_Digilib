<?php
header("Content-Type: application/json; charset=UTF-8");
require '../login/koneksi.php';

try {
    $query = "SELECT p.id, u.nama as nama_user, b.judul as judul_buku, p.tanggal_pinjam, p.status 
              FROM peminjaman p 
              JOIN users u ON p.user_id = u.id 
              JOIN buku b ON p.buku_id = b.id
              ORDER BY p.tanggal_pinjam DESC";
              
    $stmt = $pdo->query($query);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Gagal mengambil data sirkulasi: " . $e->getMessage()
    ]);
}
?>
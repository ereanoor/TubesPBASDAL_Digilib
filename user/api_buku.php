<?php
header("Content-Type: application/json; charset=UTF-8");
require '../login/koneksi.php';

try {
    $query = "SELECT b.*, 
                     k.nama_kategori,
                     COALESCE(AVG(u.rating), 0) as rating_rata2, 
                     COUNT(u.id) as jumlah_ulasan 
              FROM buku b 
              LEFT JOIN kategori k ON b.kategori_id = k.id 
              LEFT JOIN ulasan u ON b.id = u.buku_id 
              GROUP BY b.id";
              
    $stmt = $pdo->query($query);
    $buku_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "status" => "success",
        "data" => $buku_list
    ]);
} catch(PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Gagal mengambil data: " . $e->getMessage()
    ]);
}
?>
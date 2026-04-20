<?php
header("Content-Type: application/json; charset=UTF-8");
require '../login/koneksi.php';

try {
    $stmtUser = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'anggota'");
    $totalUser = $stmtUser->fetchColumn();

    $stmtBuku = $pdo->query("SELECT COUNT(*) FROM buku");
    $totalBuku = $stmtBuku->fetchColumn();

    $stmtPinjam = $pdo->query("SELECT COUNT(*) FROM peminjaman WHERE status = 'dipinjam'");
    $totalPinjam = $stmtPinjam->fetchColumn();

    $queryGraph = "SELECT MONTHNAME(tanggal_pinjam) as bulan, COUNT(*) as jumlah 
                   FROM peminjaman 
                   GROUP BY MONTH(tanggal_pinjam), MONTHNAME(tanggal_pinjam) 
                   ORDER BY MONTH(tanggal_pinjam) ASC LIMIT 6";
    $stmtGraph = $pdo->query($queryGraph);
    $graphData = $stmtGraph->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "stats" => [
            "users" => (int)$totalUser,
            "buku" => (int)$totalBuku,
            "dipinjam" => (int)$totalPinjam
        ],
        "graph" => $graphData
    ]);

} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
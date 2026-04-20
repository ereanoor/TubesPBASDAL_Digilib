<?php
header("Content-Type: application/json");
require '../login/koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);
$id_peminjaman = $data['id'] ?? null;

if (!$id_peminjaman) {
    echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT buku_id FROM peminjaman WHERE id = ?");
    $stmt->execute([$id_peminjaman]);
    $pinjam = $stmt->fetch();

    if ($pinjam) {
        $id_buku = $pinjam['buku_id'];

        $pdo->beginTransaction();

        $sql1 = "UPDATE peminjaman SET status = 'dikembalikan', tanggal_kembali = CURDATE() WHERE id = ?";
        $pdo->prepare($sql1)->execute([$id_peminjaman]);

        $sql2 = "UPDATE buku SET stok = stok + 1 WHERE id = ?";
        $pdo->prepare($sql2)->execute([$id_buku]);

        $pdo->commit();
        echo json_encode(["status" => "success", "message" => "Buku berhasil dikembalikan dan stok bertambah."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Data peminjaman tidak valid."]);
    }

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
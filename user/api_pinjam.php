<?php
header("Content-Type: application/json; charset=UTF-8");
require '../login/koneksi.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->buku_id) && !empty($data->user_id) && !empty($data->tanggal_kembali)) {
    try {
        $cek = $pdo->prepare("SELECT stok FROM buku WHERE id = :id");
        $cek->bindParam(':id', $data->buku_id);
        $cek->execute();
        $buku = $cek->fetch(PDO::FETCH_ASSOC);

        if ($buku['stok'] > 0) {
            $update = $pdo->prepare("UPDATE buku SET stok = stok - 1 WHERE id = :id");
            $update->bindParam(':id', $data->buku_id);
            $update->execute();

            $insert = $pdo->prepare("INSERT INTO peminjaman (user_id, buku_id, tanggal_pinjam, tanggal_kembali, status) VALUES (:uid, :bid, CURDATE(), :tgl_kembali, 'dipinjam')");
            $insert->bindParam(':uid', $data->user_id);
            $insert->bindParam(':bid', $data->buku_id);
            $insert->bindParam(':tgl_kembali', $data->tanggal_kembali);
            $insert->execute();

            echo json_encode(["status" => "success", "message" => "Buku berhasil dipinjam! Jangan lupa kembalikan tepat waktu."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Maaf, stok buku ini sedang habis!"]);
        }
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error Database: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap atau tanggal belum dipilih!"]);
}
?>
<?php
header("Content-Type: application/json");
require '../login/koneksi.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->peminjaman_id)) {
    try {
        $stmt = $pdo->prepare("SELECT jumlah_perpanjang, tanggal_kembali FROM peminjaman WHERE id = ?");
        $stmt->execute([$data->peminjaman_id]);
        $pinjam = $stmt->fetch();

        if ($pinjam['jumlah_perpanjang'] >= 2) {
            echo json_encode(["status" => "error", "message" => "Batas maksimal perpanjangan (2x) sudah tercapai!"]);
            exit;
        }

        $tglBaru = date('Y-m-d', strtotime($pinjam['tanggal_kembali'] . ' + 7 days'));
        
        $update = $pdo->prepare("UPDATE peminjaman SET 
                                 tanggal_kembali = ?, 
                                 jumlah_perpanjang = jumlah_perpanjang + 1 
                                 WHERE id = ?");
        $update->execute([$tglBaru, $data->peminjaman_id]);

        echo json_encode(["status" => "success", "message" => "Berhasil diperpanjang 7 hari."]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
<?php
header("Content-Type: application/json; charset=UTF-8");
require '../login/koneksi.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->buku_id) && !empty($data->user_id) && !empty($data->rating)) {
    try {
        $cek = $pdo->prepare("SELECT id FROM ulasan WHERE user_id = :uid AND buku_id = :bid");
        $cek->execute([':uid' => $data->user_id, ':bid' => $data->buku_id]);

        if ($cek->rowCount() > 0) {
            $stmt = $pdo->prepare("UPDATE ulasan SET rating = :rating WHERE user_id = :uid AND buku_id = :bid");
        } else {
            $stmt = $pdo->prepare("INSERT INTO ulasan (user_id, buku_id, rating) VALUES (:uid, :bid, :rating)");
        }

        $stmt->execute([
            ':uid' => $data->user_id,
            ':bid' => $data->buku_id,
            ':rating' => $data->rating
        ]);

        echo json_encode(["status" => "success", "message" => "Ulasan disimpan ke database!"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
}
?>
<?php
header("Content-Type: application/json; charset=UTF-8");
require '../login/koneksi.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        $query = "DELETE FROM buku WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $data->id);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Koleksi berhasil dihapus!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menghapus data."]);
        }
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "ID tidak ditemukan."]);
}
?>
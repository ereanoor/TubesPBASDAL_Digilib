<?php
header("Content-Type: application/json; charset=UTF-8");
require 'koneksi.php'; 

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->nama) && !empty($data->email) && !empty($data->password)) {
    try {
        $check = $pdo->prepare("SELECT email FROM users WHERE email = :email");
        $check->execute(['email' => $data->email]);
        
        if($check->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Email sudah digunakan! Silakan gunakan email lain."]);
            exit;
        }


        $role = (!empty($data->role) && $data->role == 'admin') ? 'admin' : 'anggota';

        $query = "INSERT INTO users (nama, email, password, role, status) VALUES (:nama, :email, :password, :role, 'aktif')";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':nama', $data->nama);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password', $data->password);
        $stmt->bindParam(':role', $role);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Pendaftaran berhasil! Silakan Login."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan data ke database."]);
        }
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error Database: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Semua kolom wajib diisi!"]);
}
?>
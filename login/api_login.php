<?php
header("Content-Type: application/json; charset=UTF-8");
require 'koneksi.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    try {
        $query = "SELECT id, nama, role FROM users WHERE email = :email AND password = :password";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password', $data->password);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => "success", 
                "message" => "Login berhasil",
                "data" => $user
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Email atau Password salah!"]);
        }
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error Database: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email dan Password wajib diisi!"]);
}
?>
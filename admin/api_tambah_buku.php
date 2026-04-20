<?php
header("Content-Type: application/json");
require 'koneksi.php';

$judul = $_POST['judul'];
$penulis = $_POST['penulis'];
$kategori_id = $_POST['kategori_id'];
$tahun_terbit = $_POST['tahun_terbit'];
$stok = $_POST['stok'];
$deskripsi = $_POST['deskripsi'];
$cover_url = null;

if (isset($_FILES['cover']) && $_FILES['cover']['error'] === 0) {
    $ext = strtolower(pathinfo($_FILES['cover']['name'], PATHINFO_EXTENSION));
    $nama_baru = "buku_" . time() . "_" . rand(100, 999) . "." . $ext;
    
    $tujuan = "../uploads/books/" . $nama_baru;
    
    if (move_uploaded_file($_FILES['cover']['tmp_name'], $tujuan)) {
        $cover_url = $nama_baru;
    }
}

try {
    $sql = "INSERT INTO buku (judul, penulis, kategori_id, tahun_terbit, stok, deskripsi, cover_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$judul, $penulis, $kategori_id, $tahun_terbit, $stok, $deskripsi, $cover_url]);
    
    echo json_encode(["status" => "success", "message" => "Berhasil disimpan"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
<?php
header("Content-Type: application/json");
require '../login/koneksi.php';
$id = $_POST['id'];
$judul = $_POST['judul'];
$penulis = $_POST['penulis'];
$kategori_id = $_POST['kategori_id'];
$tahun_terbit = $_POST['tahun_terbit'];
$stok = $_POST['stok'];
$deskripsi = $_POST['deskripsi'];

try {
    $stmt = $pdo->prepare("SELECT cover_url FROM buku WHERE id = ?");
    $stmt->execute([$id]);
    $buku_lama = $stmt->fetch();

    $nama_file_db = $buku_lama['cover_url'];

    if (isset($_FILES['cover']) && $_FILES['cover']['error'] === 0) {
        $ext = strtolower(pathinfo($_FILES['cover']['name'], PATHINFO_EXTENSION));
        $nama_baru = "buku_" . time() . "_" . rand(100, 999) . "." . $ext;
        $tujuan = "../uploads/books/" . $nama_baru;

        if (move_uploaded_file($_FILES['cover']['tmp_name'], $tujuan)) {
            if ($buku_lama['cover_url'] && file_exists("../uploads/books/" . $buku_lama['cover_url'])) {
                unlink("../uploads/books/" . $buku_lama['cover_url']);
            }
            $nama_file_db = $nama_baru;
        }
    }

    $sql = "UPDATE buku SET judul=?, penulis=?, kategori_id=?, tahun_terbit=?, stok=?, deskripsi=?, cover_url=? WHERE id=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$judul, $penulis, $kategori_id, $tahun_terbit, $stok, $deskripsi, $nama_file_db, $id]);

    echo json_encode(["status" => "success", "message" => "Data & Gambar berhasil diperbarui!"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
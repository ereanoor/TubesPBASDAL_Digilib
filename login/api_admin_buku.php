<?php
header("Content-Type: application/json; charset=UTF-8");
require 'koneksi.php'; 

$action = $_POST['action'] ?? '';

try {
    $judul = $_POST['judul'];
    $penulis = $_POST['penulis'];
    $id_kategori = $_POST['kategori'];
    $tahun = $_POST['tahun'];
    $stok = $_POST['stok'];
    $deskripsi = $_POST['deskripsi'];
    $id_buku = $_POST['id'] ?? null;

    $nama_file_db = null; 

    if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
        $file_ext = strtolower(pathinfo($_FILES['cover']['name'], PATHINFO_EXTENSION));
        $new_file_name = 'buku_' . uniqid() . '.' . $file_ext;
        $upload_dir = '../uploads/books/';

        if (move_uploaded_file($_FILES['cover']['tmp_name'], $upload_dir . $new_file_name)) {
            $nama_file_db = $new_file_name;

            if ($action === 'update' && $id_buku) {
                $stmt_old = $pdo->prepare("SELECT cover_url FROM buku WHERE id = ?");
                $stmt_old->execute([$id_buku]);
                $old = $stmt_old->fetch();
                if ($old && $old['cover_url'] && file_exists($upload_dir . $old['cover_url'])) {
                    unlink($upload_dir . $old['cover_url']);
                }
            }
        }
    }

    if ($action === 'insert') {
        $sql = "INSERT INTO buku (judul, penulis, kategori_id, tahun_terbit, stok, deskripsi, cover_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$judul, $penulis, $id_kategori, $tahun, $stok, $deskripsi, $nama_file_db]);
        echo json_encode(["status" => "success", "message" => "Buku berhasil ditambah!"]);

    } elseif ($action === 'update') {
        $params = [$judul, $penulis, $id_kategori, $tahun, $stok, $deskripsi];
        $sql = "UPDATE buku SET judul=?, penulis=?, kategori_id=?, tahun_terbit=?, stok=?, deskripsi=?";
        
        if ($nama_file_db) {
            $sql .= ", cover_url=?";
            $params[] = $nama_file_db;
        }
        
        $sql .= " WHERE id=?";
        $params[] = $id_buku;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["status" => "success", "message" => "Buku berhasil diupdate!"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
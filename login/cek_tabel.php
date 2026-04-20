<?php
require 'koneksi.php';

try {
    $query = $pdo->query("SELECT * FROM users");
    $data = $query->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h1>Debug Database (Folder Login)</h1>";
    if (empty($data)) {
        echo "<p style='color:red'>Data KOSONG! PHP sudah konek, tapi di tabel users belum ada isinya.</p>";
    } else {
        echo "<pre>";
        print_r($data);
        echo "</pre>";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
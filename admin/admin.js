class AdminSystem {
    constructor() {
        this.lineChartInstance = null;
        this.barChartInstance = null;
        this.booksData = []; 
        this.init();
    }

    init() {
        if(localStorage.getItem('user_role') !== 'admin') {
            window.location.href = '../login/login.html';
            return;
        }
        const searchInput = document.querySelector('header input');
        if(searchInput) {
            searchInput.addEventListener('keyup', () => this.searchGlobal());
        }
        this.loadDashboard();
    }

    searchGlobal() {
        const query = document.querySelector('header input').value.toLowerCase();
        const activeTab = document.querySelector('.tab-content:not(.hidden)');
        if(!activeTab) return;
        const rows = activeTab.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(query) ? "" : "none";
        });
    }

    showTab(name) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        const target = document.getElementById(`tab-${name}`);
        if(target) target.classList.remove('hidden');
        document.getElementById('page-title').innerText = name.toUpperCase();
        if(name === 'dashboard') this.loadDashboard();
        if(name === 'buku') this.loadBuku();
        if(name === 'users') this.loadUsers(); 
        if(name === 'peminjaman') this.loadPeminjaman(); 
    }

async loadDashboard() {
    try {
        const res = await fetch('api_admin_dashboard.php').then(r => r.json());
        if(res.status === 'success') {
            document.getElementById('stat-users').innerText = res.stats.users;
            document.getElementById('stat-buku').innerText = res.stats.buku;
            document.getElementById('stat-pinjam').innerText = res.stats.dipinjam;

            const labels = res.graph.map(d => d.bulan);
            const dataJumlah = res.graph.map(d => d.jumlah);

            const ctxLine = document.getElementById('lineChart');
            if (ctxLine) {
                if (this.lineChartInstance) this.lineChartInstance.destroy();
                this.lineChartInstance = new Chart(ctxLine, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Peminjaman',
                            data: dataJumlah,
                            borderColor: '#3b82f6', // Biru
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true, tension: 0.4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                });
            }

            const ctxBar = document.getElementById('barChart');
            if (ctxBar) {
                if (this.barChartInstance) this.barChartInstance.destroy(); 
                this.barChartInstance = new Chart(ctxBar, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Pengunjung',
                            data: dataJumlah, 
                            backgroundColor: '#f97316', 
                            borderRadius: 6,
                            barThickness: 15
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, grid: { display: false } },
                            x: { grid: { display: false } }
                        }
                    }
                });
            }
        }
    } catch (e) { 
        console.error("Gagal memuat data dashboard:", e); 
    }
}

    async loadBuku() {
        try {
            const res = await fetch('../user/api_buku.php').then(r => r.json());
            const tbody = document.getElementById('table-buku-list');
            this.booksData = res.data; 
            tbody.innerHTML = '';
            res.data.forEach(b => {
                const coverImg = b.cover_url ? `../uploads/books/${b.cover_url}` : '../assets/img/no-cover.jpg';
                tbody.innerHTML += `
                    <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition">
                        <td class="p-4 flex items-center gap-4">
                            <img src="${coverImg}" class="w-10 h-14 object-cover rounded shadow-sm bg-slate-100">
                            <div>
                                <div class="font-bold text-slate-700">${b.judul}</div>
                                <div class="text-[10px] font-bold text-blue-500 uppercase mt-1">${b.nama_kategori || 'UMUM'}</div>
                            </div>
                        </td>
                        <td class="p-4 text-center">
                            <div class="text-sm text-slate-600">${b.penulis}</div>
                            <div class="text-[10px] text-slate-400">Thn. ${b.tahun_terbit || '-'}</div>
                        </td>
                        <td class="p-4 text-center">
                            <span class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-xs">${b.stok} Unit</span>
                        </td>
                        <td class="p-4 text-center space-x-2">
                            <button onclick="admin.editBuku(${b.id})" class="text-blue-600 font-bold text-xs hover:underline">Edit</button>
                            <button onclick="admin.hapusBuku(${b.id})" class="text-red-500 font-bold text-xs hover:underline">Hapus</button>
                        </td>
                    </tr>`;
            });
        } catch (e) { console.error("Buku Error:", e); }
    }

    async formTambahBuku() {
        const { value: f } = await Swal.fire({
            title: 'Input Koleksi Baru',
            width: '600px',
            html: `
                <div class="flex flex-col gap-3 text-left text-sm mt-4">
                    <input id="swal-judul" class="swal2-input !m-0 !w-full" placeholder="Judul Buku">
                    <input id="swal-penulis" class="swal2-input !m-0 !w-full" placeholder="Penulis">
                    <div class="flex gap-3">
                        <select id="swal-kategori" class="swal2-select !m-0 !w-full">
                            <option value="1">Fiksi</option><option value="2">Non Fiksi</option><option value="3">Horor</option>
                            <option value="4">Romance</option><option value="5">Fantasi</option><option value="6">Komik</option>
                        </select>
                        <input id="swal-tahun" type="number" class="swal2-input !m-0 !w-full" placeholder="Tahun">
                    </div>
                    <input id="swal-stok" type="number" class="swal2-input !m-0 !w-full" placeholder="Stok">
                    <textarea id="swal-deskripsi" class="swal2-textarea !m-0 !w-full" placeholder="Deskripsi"></textarea>
                    
                    <div class="mt-2 border-t pt-4">
                        <label class="block text-xs font-bold text-slate-500 mb-2">PILIH SAMPUL BUKU (JPG/PNG)</label>
                        <input id="swal-cover" type="file" accept="image/*" class="text-xs w-full border p-2 rounded bg-slate-50">
                    </div>
                </div>`,
            preConfirm: () => {
                const coverFile = document.getElementById('swal-cover').files[0];
                return { 
                    judul: document.getElementById('swal-judul').value,
                    penulis: document.getElementById('swal-penulis').value,
                    kategori_id: document.getElementById('swal-kategori').value,
                    tahun_terbit: document.getElementById('swal-tahun').value,
                    stok: document.getElementById('swal-stok').value,
                    deskripsi: document.getElementById('swal-deskripsi').value,
                    cover: coverFile
                }
            }
        });

        if (f) {
            const formData = new FormData();
            for (let key in f) { formData.append(key, f[key]); }

            const res = await fetch('api_tambah_buku.php', { 
                method: 'POST', 
                body: formData 
            }).then(r => r.json());

            if(res.status === 'success') { 
                Swal.fire('Berhasil!', 'Buku & Gambar tersimpan.', 'success');
                this.loadBuku(); this.loadDashboard(); 
            }
        }
    }

    async editBuku(id) {
        const b = this.booksData.find(x => x.id == id);
        if(!b) return;
        const { value: f } = await Swal.fire({
            title: 'Edit Koleksi Buku',
            width: '600px',
            html: `
                <div class="flex flex-col gap-3 text-left text-sm mt-4">
                    <input id="edit-judul" value="${b.judul}" class="swal2-input !m-0 !w-full">
                    <input id="edit-penulis" value="${b.penulis}" class="swal2-input !m-0 !w-full">
                    <div class="flex gap-3">
                        <select id="edit-kategori" class="swal2-select !m-0 !w-full text-sm">
                            <option value="1" ${b.kategori_id == 1 ? 'selected' : ''}>Fiksi</option>
                            <option value="2" ${b.kategori_id == 2 ? 'selected' : ''}>Non Fiksi</option>
                            <option value="3" ${b.kategori_id == 3 ? 'selected' : ''}>Horor</option>
                            <option value="4" ${b.kategori_id == 4 ? 'selected' : ''}>Romance</option>
                            <option value="5" ${b.kategori_id == 5 ? 'selected' : ''}>Fantasi</option>
                            <option value="6" ${b.kategori_id == 6 ? 'selected' : ''}>Komik</option>
                        </select>
                        <input id="edit-tahun" type="number" value="${b.tahun_terbit || ''}" class="swal2-input !m-0 !w-full">
                    </div>
                    <input id="edit-stok" type="number" value="${b.stok}" class="swal2-input !m-0 !w-full">
                    <textarea id="edit-deskripsi" class="swal2-textarea !m-0 !w-full">${b.deskripsi || ''}</textarea>
                    
                    <div class="mt-2 border-t pt-4">
                        <label class="block text-xs font-bold text-slate-500 mb-1">GANTI SAMPUL (Kosongkan jika tidak diubah)</label>
                        <input id="edit-cover" type="file" accept="image/*" class="text-xs w-full border p-2 rounded bg-slate-50">
                    </div>
                </div>`,
            preConfirm: () => {
                return { 
                    id: b.id, 
                    judul: document.getElementById('edit-judul').value,
                    penulis: document.getElementById('edit-penulis').value,
                    kategori_id: document.getElementById('edit-kategori').value,
                    tahun_terbit: document.getElementById('edit-tahun').value,
                    stok: document.getElementById('edit-stok').value,
                    deskripsi: document.getElementById('edit-deskripsi').value,
                    cover: document.getElementById('edit-cover').files[0]
                }
            }
        });

        if (f) {
            const formData = new FormData();
            for (let key in f) { formData.append(key, f[key]); }
            const res = await fetch('api_edit_buku.php', { method: 'POST', body: formData }).then(r => r.json());
            if(res.status === 'success') { Swal.fire('Berhasil!', 'Data diperbarui.', 'success'); this.loadBuku(); }
        }
    }

    async hapusBuku(id) {
        const confirm = await Swal.fire({ title: 'Hapus Buku?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
        if(confirm.isConfirmed) {
            const res = await fetch('api_delete_buku.php', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id }) 
            }).then(r => r.json());
            if(res.status === 'success') { this.loadBuku(); this.loadDashboard(); }
        }
    }

    async loadUsers() {
        try {
            const res = await fetch('api_admin_users.php').then(r => r.json());
            const container = document.getElementById('list-anggota');
            container.innerHTML = `<table class="w-full text-left text-sm"><thead class="bg-slate-50 border-b"><tr><th class="p-4 font-bold text-slate-600">Anggota</th><th class="p-4 font-bold text-slate-600">Status</th></tr></thead><tbody id="user-body"></tbody></table>`;
            res.data.forEach(u => {
                document.getElementById('user-body').innerHTML += `<tr class="border-b"><td class="p-4"><div class="font-bold">${u.nama}</div><div class="text-xs text-slate-400">${u.email}</div></td><td class="p-4"><span class="px-2 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded uppercase">Aktif</span></td></tr>`;
            });
        } catch (e) {}
    }

    async loadPeminjaman() {
        try {
            const res = await fetch('api_admin_peminjaman.php').then(r => r.json());
            const tbody = document.getElementById('table-peminjaman-list');
            tbody.innerHTML = '';
            res.data.forEach(p => {
                const btn = (p.status === 'dipinjam') ? `<button onclick="admin.kembaliBuku(${p.id})" class="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded text-[10px] font-bold">ACC Kembali</button>` : `<span class="text-slate-400 italic text-[10px]">Selesai</span>`;
                tbody.innerHTML += `<tr class="border-b"><td class="p-4">${p.nama_user}</td><td class="p-4 font-bold text-slate-700">${p.judul_buku}</td><td class="p-4 text-slate-500 text-xs">${p.tanggal_pinjam}</td><td class="p-4 text-center">${btn}</td></tr>`;
            });
        } catch (e) {}
    }

    async kembaliBuku(id) {
        const confirm = await Swal.fire({
            title: 'Konfirmasi Kembali',
            text: "Apakah buku ini sudah diterima kembali dengan baik?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Ya, Sudah Kembali'
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch('api_kembali_buku.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id })
                }).then(r => r.json());

                if (res.status === 'success') {
                    Swal.fire('Berhasil!', res.message, 'success');
                    this.loadPeminjaman();
                    this.loadDashboard(); 
                } else {
                    Swal.fire('Gagal', res.message, 'error');
                }
            } catch (e) {
                console.error("Error ACC Kembali:", e);
                Swal.fire('Error', 'Gagal menghubungi server.', 'error');
            }
        }
    }
}


const admin = new AdminSystem();
function logout() { localStorage.clear(); window.location.href = '../login/login.html'; }
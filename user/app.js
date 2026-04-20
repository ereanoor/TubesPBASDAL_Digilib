class DigiLib {
constructor() {
    this.userId = localStorage.getItem('user_id');
    this.userName = localStorage.getItem('user_nama'); 
    this.userRole = localStorage.getItem('user_role');
    this.init();
}

init() {
    if (!this.userName || this.userRole !== 'anggota') {
        console.error("Akses ditolak atau sesi habis");
        window.location.href = '../login/login.html'; 
        return;
    }
    document.getElementById('welcomeText').innerText = `Halo, ${this.userName}`;
    this.loadKatalog();
}
    showSection(name) {
        document.getElementById('katalogSection').classList.toggle('hidden', name !== 'katalog');
        document.getElementById('profilSection').classList.toggle('hidden', name !== 'profil');
        if (name === 'profil') this.loadRiwayat();
    }

    searchBuku() {
        const input = document.getElementById('searchInput').value.toLowerCase();
        const filterElem = document.getElementById('filterKategori');
        const filterKat = filterElem ? filterElem.value.toLowerCase() : '';
        
        const cards = document.getElementsByClassName('buku-card');
        
        Array.from(cards).forEach(card => {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const author = (card.getAttribute('data-author') || '').toLowerCase();
            const rawKategori = card.getAttribute('data-kategori');
            const kategori = rawKategori ? rawKategori.toLowerCase() : '';
            
            const cocokTeks = title.includes(input) || author.includes(input);
            const cocokKategori = filterKat === '' || kategori === filterKat;

            card.style.display = (cocokTeks && cocokKategori) ? "" : "none";
        });
    }

    async loadKatalog() {
        try {
            const response = await fetch('api_buku.php');
            const result = await response.json();
            const wadah = document.getElementById('katalog-buku');
            wadah.innerHTML = '';

            result.data.forEach(b => {
                wadah.innerHTML += this.templateCardBuku(b);
            });
        } catch (error) {
            console.error("Gagal load katalog", error);
        }
    }

templateCardBuku(b) {
    const folderGambar = '../uploads/books/';
    
    const cover = (b.cover_url && b.cover_url !== "") 
        ? `<img src="${folderGambar}${b.cover_url}" class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500">` 
        : `<div class="flex flex-col items-center justify-center text-slate-300">
             <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             <span class="text-[10px] font-bold uppercase tracking-wider">No Cover</span>
           </div>`;
    
    const namaKategori = b.nama_kategori || 'Umum';
    let angkaRating = parseFloat(b.rating_rata2 || 0).toFixed(1);

    return `
        <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 buku-card border border-slate-100 flex flex-col group" 
             data-title="${b.judul}" data-author="${b.penulis}" data-kategori="${namaKategori}">
            
            <div class="mb-3">
                <span class="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest">
                    ${namaKategori}
                </span>
            </div>

            <div class="h-48 bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-slate-50">
                ${cover}
            </div>
            
            <h4 class="font-extrabold text-slate-800 truncate text-lg mb-1 group-hover:text-blue-600 transition-colors">${b.judul}</h4>
            
            <div class="mb-3">
                ${b.rating_rata2 > 0 
                    ? `<div class="flex items-center gap-1">
                         <span class="text-yellow-400 text-sm">⭐</span>
                         <span class="font-bold text-slate-700 text-sm">${angkaRating}</span>
                         <span class="text-[10px] text-slate-400">(${b.jumlah_ulasan} ulasan)</span>
                       </div>`
                    : `<span class="text-[10px] text-slate-400 italic">Belum ada penilaian</span>`
                }
            </div>
            
            <p class="text-xs text-slate-500 mb-5 font-medium">
                <span class="text-slate-300">Oleh:</span> ${b.penulis}
            </p>
            
            <div class="flex justify-between items-center mt-auto pt-3 border-t border-slate-50">
                <div class="flex flex-col">
                    <span class="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Tersedia</span>
                    <span class="text-xs font-extrabold text-slate-700">${b.stok} Buku</span>
                </div>
                <button onclick="app.pinjamBuku(${b.id}, '${b.judul.replace(/'/g, "\\'")}')" 
                        class="bg-blue-600 text-white text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200">
                    Pinjam
                </button>
            </div>
        </div>`;
}

    async loadRiwayat() {
        const response = await fetch(`api_user_data.php?user_id=${this.userId}`);
        const res = await response.json();
        const table = document.getElementById('riwayatTable');
        table.innerHTML = '';

        res.riwayat.forEach(p => {
            let tombolAksi = '';
            
            if (p.status === 'dipinjam') {
                tombolAksi = `<button onclick="app.perpanjang(${p.id})" class="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs font-bold transition">Perpanjang</button>`;
            } else if (p.status === 'dikembalikan') {
                tombolAksi = `<button onclick="app.ratingBuku(${p.buku_id})" class="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-xs font-bold transition">Beri Ulasan</button>`;
            }

            let warnaStatus = p.status === 'dipinjam' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800';

            table.innerHTML += `
                <tr class="hover:bg-gray-50 transition border-b">
                    <td class="p-4 font-medium text-slate-700">${p.judul}</td>
                    <td class="p-4 text-sm text-gray-500">${p.tanggal_pinjam}</td>
                    <td class="p-4 text-sm text-gray-500">${p.tanggal_kembali || '-'}</td>
                    <td class="p-4">
                        <span class="px-3 py-1 ${warnaStatus} rounded-full text-[10px] font-bold uppercase tracking-wider">
                            ${p.status}
                        </span>
                    </td>
                    <td class="p-4 space-x-3">
                        ${tombolAksi} 
                    </td>
                </tr>`;
        });
    }

    pinjamBuku(bukuId, judulBuku) {
        const today = new Date().toISOString().split('T')[0];
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);

        Swal.fire({
            title: 'Form Peminjaman',
            html: `
                <div class="text-left text-sm">
                    <p class="font-bold mb-3 text-blue-800 text-lg border-b pb-2">${judulBuku}</p>
                    <label class="block mb-1 font-semibold text-slate-600">Rencana Tanggal Kembali (Maks 7 Hari):</label>
                    <input type="date" id="tglKembali" min="${today}" max="${maxDate.toISOString().split('T')[0]}" class="swal2-input !m-0 !w-full !mt-2 !mb-4">
                    <div class="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-100">
                        <label class="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" id="setuju" class="mt-0.5"> 
                            <span>Saya setuju dengan denda Rp 5.000/hari jika telat mengembalikan buku.</span>
                        </label>
                    </div>
                </div>`,
            focusConfirm: false,
            confirmButtonText: 'Ajukan Pinjaman',
            confirmButtonColor: '#2563eb',
            preConfirm: () => {
                const tgl = document.getElementById('tglKembali').value;
                const cek = document.getElementById('setuju').checked;
                if (!tgl || !cek) return Swal.showValidationMessage('Isi tanggal dan setujui aturan denda!');
                return tgl;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch('api_pinjam.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ buku_id: bukuId, user_id: this.userId, tanggal_kembali: result.value })
                });
                const data = await res.json();
                if(data.status === 'success'){
                    Swal.fire('Berhasil', data.message, 'success').then(() => location.reload());
                } else {
                    Swal.fire('Gagal', data.message, 'error');
                }
            }
        });
    }

    perpanjang(pid) {
        Swal.fire({ 
            title: 'Perpanjang Waktu?', 
            text: "Waktu pinjam akan ditambah 7 hari (Maks 2x perpanjangan).",
            icon: 'question', 
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Ya, Perpanjang'
        })
        .then(async (res) => {
            if (res.isConfirmed) {
                const response = await fetch('api_perpanjang.php', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ peminjaman_id: pid }) 
                });
                
                const result = await response.json();

                if (result.status === 'success') {
                    Swal.fire('Berhasil', result.message, 'success').then(() => this.loadRiwayat());
                } else {
                    Swal.fire('Gagal', result.message, 'warning');
                }
            }
        });
    }

    ratingBuku(bukuId) {
        Swal.fire({ 
            title: 'Beri Penilaian', 
            text: 'Seberapa bagus buku ini menurutmu?',
            input: 'select', 
            inputOptions: {
                5: '⭐⭐⭐⭐⭐ Sangat Bagus', 
                4: '⭐⭐⭐⭐ Bagus', 
                3: '⭐⭐⭐ Biasa',
                2: '⭐⭐ Kurang',
                1: '⭐ Buruk'
            }, 
            showCancelButton: true,
            confirmButtonText: 'Kirim Ulasan',
            confirmButtonColor: '#eab308'
        })
        .then(async (result) => {
            if(result.isConfirmed) {
                try {
                    const response = await fetch('api_rating.php', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ buku_id: bukuId, user_id: this.userId, rating: result.value })
                    }); 
                    
                    const resData = await response.json();

                    if (resData.status === 'success') {
                        Swal.fire('Terima Kasih', resData.message, 'success');
                        this.loadKatalog(); 
                    } else {
                        Swal.fire('Gagal', resData.message, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Sistem gagal menyimpan ulasan.', 'error');
                }
            }
        });
    }

    logout() {
        localStorage.clear();
        window.location.href = '../login/login.html'; 
    }
}

const app = new DigiLib();
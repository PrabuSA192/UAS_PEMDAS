// Mengimpor modul bawaan Node.js untuk membaca input dari terminal
import * as readline from "readline";

// Membuat antarmuka pembaca input dan output terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi bantu untuk meminta input pengguna secara berurutan
function tanya(pertanyaan: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pertanyaan, (jawaban: string) => {
      resolve(jawaban);
    });
  });
}

// ============================================================================
// BAGIAN 1: DEFINISI TIPE DATA & DATA AWAL (SEED)
// ============================================================================

// Mendefinisikan struktur data untuk entitas Gitar
interface Gitar {
  id: string;        // Kode unik gitar
  nama: string;      // Nama model gitar
  merek: string;     // Merek pabrikan gitar
  kategori: string;  // Kategori gitar: Akustik, Elektrik, atau Bass
  harga: number;     // Harga satuan gitar dalam Rupiah
  stok: number;      // Jumlah unit stok yang tersedia
  tersedia: boolean; // Status ketersediaan barang bernilai true jika stok lebih dari 0
}

// Menyimpan daftar data gitar di dalam memori menggunakan variabel let dan array
let daftarGitar: Gitar[] = [
  { id: "GTR-01", nama: "Fender Stratocaster", merek: "Fender", kategori: "Elektrik", harga: 12500000, stok: 4, tersedia: true },
  { id: "GTR-02", nama: "Yamaha F310", merek: "Yamaha", kategori: "Akustik", harga: 1450000, stok: 10, tersedia: true },
  { id: "GTR-03", nama: "Ibanez SR300E", merek: "Ibanez", kategori: "Bass", harga: 5800000, stok: 3, tersedia: true },
  { id: "GTR-04", nama: "Gibson Les Paul", merek: "Gibson", kategori: "Elektrik", harga: 24000000, stok: 2, tersedia: true },
  { id: "GTR-05", nama: "Cort AD810", merek: "Cort", kategori: "Akustik", harga: 1650000, stok: 0, tersedia: false },
];

// ============================================================================
// BAGIAN 2: FUNGSI BANTU (HELPER)
// ============================================================================

// Fungsi berparameter dengan return number untuk mencari posisi index gitar berdasarkan ID
function cariIndexGitarById(idCari: string): number {
  // Menggunakan method array findIndex untuk mencocokkan ID tanpa sensitif huruf besar atau kecil
  return daftarGitar.findIndex(
    (item: Gitar) => item.id.toLowerCase() === idCari.trim().toLowerCase()
  );
}

// Fungsi berparameter dengan return objek Gitar atau undefined untuk mencari data gitar berdasarkan ID
function cariGitarById(idCari: string): Gitar | undefined {
  // Menggunakan method array find untuk mengambil objek gitar yang ID-nya cocok (case-insensitive)
  return daftarGitar.find(
    (item: Gitar) => item.id.toLowerCase() === idCari.trim().toLowerCase()
  );
}

// Fungsi berparameter dengan return hasil hitung aritmatika untuk menghitung total nilai aset stok
function hitungTotalNilaiStok(hargaSatuan: number, jumlahStok: number): number {
  // Mengalikan harga satuan dengan jumlah stok menggunakan operator aritmatika perkalian
  const totalNilai: number = hargaSatuan * jumlahStok;
  return totalNilai;
}

// Fungsi tanpa parameter dan tanpa return untuk menampilkan ringkasan daftar gitar
function tampilkanRingkasanGitar(): void {
  console.log("\n--- Daftar Gitar Saat Ini ---");

  // Mengecek jika seluruh data sudah terhapus
  if (daftarGitar.length === 0) {
    console.log("[Info] Belum ada data gitar tersimpan di memori.");
    console.log("-----------------------------");
    return;
  }

  // Menggunakan perulangan for...of untuk menelusuri seluruh elemen array daftarGitar
  for (const gitar of daftarGitar) {
    // Menentukan label status menggunakan properti boolean tersedia
    const labelStatus: string = gitar.tersedia ? "Tersedia" : "Habis";
    console.log(
      `[${gitar.id}] ${gitar.nama} | Merek: ${gitar.merek} (${gitar.kategori}) - Rp${gitar.harga.toLocaleString("id-ID")} | Stok: ${gitar.stok} | Tersedia: ${gitar.tersedia} (${labelStatus})`
    );
  }
  console.log("-----------------------------");
}

// ============================================================================
// BAGIAN 3: FITUR UTAMA - READ (TAMPIL SEMUA & DETAIL BERDASARKAN ID)
// ============================================================================

// Fungsi tanpa parameter dan tanpa return untuk menampilkan seluruh data gitar secara lengkap
function tampilkanSemuaGitar(): void {
  console.log("\n=== DAFTAR SELURUH DATA GITAR (READ ALL) ===");

  // Memeriksa kasus tepi apabila array data gitar masih kosong
  if (daftarGitar.length === 0) {
    console.log("[Info] Data gitar masih kosong. Belum ada data yang tersimpan.");
    return;
  }

  // Variabel penampung total unit stok seluruh gitar
  let totalUnitKeseluruhan: number = 0;

  // Menggunakan method forEach untuk menampilkan setiap data gitar beserta indeks urutnya
  daftarGitar.forEach((gitar: Gitar, index: number) => {
    const nomorUrut: number = index + 1;
    const labelStatus: string = gitar.tersedia ? "Tersedia" : "Habis";
    totalUnitKeseluruhan += gitar.stok;

    console.log(
      `${nomorUrut}. [${gitar.id}] ${gitar.nama} | Merek: ${gitar.merek} | Kategori: ${gitar.kategori} | Harga: Rp${gitar.harga.toLocaleString("id-ID")} | Stok: ${gitar.stok} unit | Status Tersedia: ${gitar.tersedia} (${labelStatus})`
    );
  });

  console.log("--------------------------------------------");
  console.log(`Total Model Gitar : ${daftarGitar.length} jenis`);
  console.log(`Total Seluruh Stok: ${totalUnitKeseluruhan} unit`);
}

// Fungsi untuk menampilkan detail lengkap 1 data gitar berdasarkan pencarian ID
async function tampilkanDetailGitarById(): Promise<void> {
  console.log("\n=== DETAIL DATA GITAR BERDASARKAN ID (READ DETAIL) ===");

  // Memeriksa kasus tepi apabila array data gitar masih kosong
  if (daftarGitar.length === 0) {
    console.log("[Info] Data gitar masih kosong. Tidak ada data yang dapat dicari.");
    return;
  }

  // Meminta input ID gitar dari pengguna
  const inputId: string = (await tanya("Masukkan ID Gitar yang ingin dilihat detailnya (contoh: GTR-01): ")).trim();

  // Validasi agar input ID tidak kosong
  if (inputId === "") {
    console.log("[Peringatan] ID gitar tidak boleh kosong.");
    return;
  }

  // Mencari data gitar menggunakan fungsi berbasis .find() dan posisi indeksnya dengan .findIndex()
  const gitarDitemukan: Gitar | undefined = cariGitarById(inputId);
  const posisiIndex: number = cariIndexGitarById(inputId);

  // Mengecek apakah data gitar ditemukan
  if (gitarDitemukan === undefined || posisiIndex === -1) {
    console.log(`[Error] Gitar dengan ID "${inputId}" tidak ditemukan.`);
    return;
  }

  // Menghitung total nilai aset untuk stok gitar tersebut
  const totalNilaiAset: number = hitungTotalNilaiStok(gitarDitemukan.harga, gitarDitemukan.stok);
  const keteranganStatus: string = gitarDitemukan.tersedia ? "Tersedia (Siap Dijual)" : "Habis (Stok Kosong)";

  // Menampilkan seluruh atribut data gitar secara lengkap
  console.log("\nDetail Lengkap Data Gitar:");
  console.log(`- Posisi Data     : Data ke-${posisiIndex + 1} dari ${daftarGitar.length}`);
  console.log(`- ID Gitar        : ${gitarDitemukan.id}`);
  console.log(`- Nama Model      : ${gitarDitemukan.nama}`);
  console.log(`- Merek           : ${gitarDitemukan.merek}`);
  console.log(`- Kategori        : ${gitarDitemukan.kategori}`);
  console.log(`- Harga Satuan    : Rp${gitarDitemukan.harga.toLocaleString("id-ID")}`);
  console.log(`- Jumlah Stok     : ${gitarDitemukan.stok} unit`);
  console.log(`- Status Tersedia : ${gitarDitemukan.tersedia} (${keteranganStatus})`);
  console.log(`- Total Nilai Aset: Rp${totalNilaiAset.toLocaleString("id-ID")}`);
}

// ============================================================================
// BAGIAN 4: FITUR UTAMA - UPDATE & DELETE
// ============================================================================

// Fungsi untuk mengubah data gitar yang sudah ada berdasarkan ID
async function updateGitar(): Promise<void> {
  console.log("\n=== UBAH DATA GITAR (UPDATE) ===");

  // Seleksi kondisi tingkat 1: memeriksa apakah array daftarGitar kosong
  if (daftarGitar.length === 0) {
    console.log("[Info] Data gitar masih kosong. Tidak ada data yang dapat diubah.");
    return;
  }

  // Menampilkan daftar gitar singkat agar pengguna mudah melihat ID yang tersedia
  tampilkanRingkasanGitar();

  // Meminta input ID gitar dari pengguna
  const inputId: string = await tanya("Masukkan ID Gitar yang ingin diubah (contoh: GTR-01): ");
  const indexDitemukan: number = cariIndexGitarById(inputId);
  const gitarLama: Gitar | undefined = daftarGitar[indexDitemukan];

  // Seleksi kondisi tingkat 1: mengecek apakah ID ditemukan di dalam array
  if (indexDitemukan !== -1 && gitarLama !== undefined) {
    // Menampilkan seluruh data lama sebelum pengguna melakukan perubahan
    console.log("\nData Lama Ditemukan:");
    console.log(`- ID       : ${gitarLama.id}`);
    console.log(`- Nama     : ${gitarLama.nama}`);
    console.log(`- Merek    : ${gitarLama.merek}`);
    console.log(`- Kategori : ${gitarLama.kategori}`);
    console.log(`- Harga    : Rp${gitarLama.harga.toLocaleString("id-ID")}`);
    console.log(`- Stok     : ${gitarLama.stok} unit`);
    console.log(`- Tersedia : ${gitarLama.tersedia}`);
    console.log("\n(Tekan ENTER langsung jika tidak ingin mengubah kolom tersebut)");

    // 1. Input nama baru dan lewati jika kosong
    const namaBaru: string = (await tanya(`Nama baru [${gitarLama.nama}]: `)).trim();
    if (namaBaru !== "") {
      gitarLama.nama = namaBaru;
    }

    // 2. Input merek baru dan lewati jika kosong
    const merekBaru: string = (await tanya(`Merek baru [${gitarLama.merek}]: `)).trim();
    if (merekBaru !== "") {
      gitarLama.merek = merekBaru;
    }

    // 3. Input kategori baru menggunakan switch sebagai seleksi kondisi bersarang tingkat 3
    console.log("Pilih Kategori Baru: [1] Akustik | [2] Elektrik | [3] Bass | [Enter] Lewati");
    const pilihKategori: string = (await tanya(`Kategori baru [${gitarLama.kategori}]: `)).trim();

    // Seleksi kondisi tingkat 2: jika pengguna mengisi pilihan kategori
    if (pilihKategori !== "") {
      // Seleksi kondisi tingkat 3: switch dengan 3 case ditambah default dan break
      switch (pilihKategori) {
        case "1":
          gitarLama.kategori = "Akustik";
          break;
        case "2":
          gitarLama.kategori = "Elektrik";
          break;
        case "3":
          gitarLama.kategori = "Bass";
          break;
        default:
          console.log("[Peringatan] Pilihan kategori tidak valid, kategori lama tetap dipertahankan.");
          break;
      }
    }

    // 4. Input harga baru dengan validasi angka dan nilai positif
    const inputHarga: string = (await tanya(`Harga baru [${gitarLama.harga}]: `)).trim();
    if (inputHarga !== "") {
      const hargaBaru: number = Number(inputHarga);
      // Validasi menggunakan operator logika OR dan perbandingan kurang dari sama dengan
      if (isNaN(hargaBaru) || hargaBaru <= 0) {
        console.log("[Error] Harga harus berupa angka lebih dari 0! Harga lama dipertahankan.");
      } else {
        gitarLama.harga = hargaBaru;
      }
    }

    // 5. Input penyesuaian stok menggunakan operator compound
    const inputStok: string = (
      await tanya(`Perubahan stok (contoh: +5 untuk tambah, -2 untuk kurang, Enter lewati) [Stok: ${gitarLama.stok}]: `)
    ).trim();

    if (inputStok !== "") {
      const selisihStok: number = Number(inputStok);
      // Memvalidasi apakah input angka sah menggunakan operator logika NOT
      if (!isNaN(selisihStok) && Number.isInteger(selisihStok)) {
        // Mengecek apakah perubahan menambah atau mengurangi stok
        if (selisihStok >= 0) {
          // Menambah stok menggunakan operator compound penjumlahan
          gitarLama.stok += selisihStok;
        } else {
          // Mengubah nilai negatif menjadi positif menggunakan operator aritmatika pengurangan
          const pengurangan: number = -selisihStok;
          // Mengecek agar stok akhir tidak bernilai minus
          if (gitarLama.stok - pengurangan < 0) {
            console.log("[Error] Pengurangan melebihi stok yang tersedia! Stok lama dipertahankan.");
          } else {
            // Mengurangi stok menggunakan operator compound pengurangan
            gitarLama.stok -= pengurangan;
          }
        }
      } else {
        console.log("[Error] Input stok harus berupa bilangan bulat valid! Stok lama dipertahankan.");
      }
    }

    // Memperbarui status boolean tersedia berdasarkan kondisi stok terbaru
    gitarLama.tersedia = gitarLama.stok > 0;

    // Menghitung total aset terbaru dari item gitar ini
    const nilaiAsetBaru: number = hitungTotalNilaiStok(gitarLama.harga, gitarLama.stok);
    console.log(`\n[Sukses] Data gitar ${gitarLama.id} berhasil diperbarui!`);
    console.log(`Total nilai stok gitar ini sekarang: Rp${nilaiAsetBaru.toLocaleString("id-ID")}`);
  } else {
    // Pesan jika ID tidak ditemukan di dalam array
    console.log(`[Error] Gitar dengan ID "${inputId}" tidak ditemukan.`);
  }
}

// Fungsi untuk menghapus data gitar berdasarkan ID dengan konfirmasi Y atau N
async function deleteGitar(): Promise<void> {
  console.log("\n=== HAPUS DATA GITAR (DELETE) ===");

  // Memeriksa kasus tepi apabila array data gitar masih kosong
  if (daftarGitar.length === 0) {
    console.log("[Info] Data gitar masih kosong. Tidak ada data yang dapat dihapus.");
    return;
  }

  // Menampilkan daftar gitar singkat sebelum penghapusan
  tampilkanRingkasanGitar();

  // Meminta input ID gitar yang akan dihapus
  const inputId: string = await tanya("Masukkan ID Gitar yang ingin dihapus: ");
  const indexHapus: number = cariIndexGitarById(inputId);
  const targetGitar: Gitar | undefined = daftarGitar[indexHapus];

  // Mengecek apakah ID ditemukan
  if (indexHapus === -1 || targetGitar === undefined) {
    console.log(`[Error] Gitar dengan ID "${inputId}" tidak ditemukan.`);
    return;
  }

  // Menghitung estimasi nilai aset barang yang akan dihapus
  const estimasiAset: number = hitungTotalNilaiStok(targetGitar.harga, targetGitar.stok);

  console.log("\nDetail Data yang Akan Dihapus:");
  console.log(`- ID       : ${targetGitar.id}`);
  console.log(`- Nama     : ${targetGitar.nama} (${targetGitar.merek})`);
  console.log(`- Kategori : ${targetGitar.kategori}`);
  console.log(`- Stok     : ${targetGitar.stok} unit (Nilai Aset: Rp${estimasiAset.toLocaleString("id-ID")})`);
  console.log(`- Tersedia : ${targetGitar.tersedia}`);

  // Variabel kontrol untuk perulangan validasi konfirmasi
  let konfirmasiValid: boolean = false;

  // Menggunakan perulangan while untuk memastikan pengguna hanya memasukkan Y atau N
  while (!konfirmasiValid) {
    const jawaban: string = (await tanya("Apakah Anda yakin ingin menghapus data ini? (Y/N): "))
      .trim()
      .toUpperCase();

    // Menggunakan operator logika AND untuk mengecek pilihan konfirmasi
    if (jawaban === "Y" && indexHapus >= 0) {
      // Menghapus data dari variabel let daftarGitar menggunakan method array filter
      daftarGitar = daftarGitar.filter(
        (item: Gitar) => item.id.toLowerCase() !== targetGitar.id.toLowerCase()
      );
      console.log(`[Sukses] Data gitar "${targetGitar.nama}" (${targetGitar.id}) berhasil dihapus.`);
      konfirmasiValid = true;
    } else if (jawaban === "N") {
      console.log("[Batal] Penghapusan data dibatalkan.");
      konfirmasiValid = true;
    } else {
      console.log("[Peringatan] Input tidak valid. Ketik Y untuk Ya atau N untuk Tidak.");
    }
  }
}

// ============================================================================
// BAGIAN 5: MENU UTAMA PENGUJIAN READ, UPDATE & DELETE
// ============================================================================

// Fungsi utama untuk menjalankan menu pengujian secara berulang
async function jalankanMenuPengujian(): Promise<void> {
  // Menggunakan variabel let karena nilai status berjalan akan berubah saat pengguna keluar
  let sedangBerjalan: boolean = true;

  // Perulangan while utama untuk menjaga menu tetap berjalan sampai pengguna memilih keluar
  while (sedangBerjalan) {
    console.log("\n============================================");
    console.log("  SISTEM MANAJEMEN TOKO GITAR (R, U & D)   ");
    console.log("============================================");
    console.log("1. Lihat Semua Data Gitar (Read All)");
    console.log("2. Lihat Detail Gitar berdasarkan ID (Read Detail)");
    console.log("3. Ubah Data Gitar (Update)");
    console.log("4. Hapus Data Gitar (Delete)");
    console.log("0. Keluar");

    const pilihanMenu: string = (await tanya("Pilih menu (0-4): ")).trim();

    // Seleksi kondisi switch untuk mengarahkan pilihan menu pengguna
    switch (pilihanMenu) {
      case "1":
        tampilkanSemuaGitar();
        break;
      case "2":
        await tampilkanDetailGitarById();
        break;
      case "3":
        await updateGitar();
        break;
      case "4":
        await deleteGitar();
        break;
      case "0": {
        // Menampilkan ringkasan akhir menggunakan perulangan for biasa sebelum keluar
        let totalSemuaStok: number = 0;
        let totalSemuaHarga: number = 0;

        for (let i: number = 0; i < daftarGitar.length; i++) {
          const itemGitar: Gitar | undefined = daftarGitar[i];
          if (itemGitar !== undefined) {
            totalSemuaStok += itemGitar.stok;
            totalSemuaHarga += itemGitar.harga;
          }
        }

        // Menghitung rata-rata harga dan contoh penggunaan operator aritmatika serta compound
        let rataRataHarga: number = daftarGitar.length > 0 ? totalSemuaHarga / daftarGitar.length : 0;
        rataRataHarga *= 1;
        rataRataHarga /= 1;

        // Menggunakan operator sisa bagi untuk mengecek kelipatan stok
        const sisaBagiSepuluh: number = totalSemuaStok % 10;

        console.log(`\nTotal sisa stok di toko: ${totalSemuaStok} unit (Sisa bagi 10: ${sisaBagiSepuluh}).`);
        console.log(`Rata-rata harga katalog saat ini: Rp${Math.round(rataRataHarga).toLocaleString("id-ID")}`);
        console.log("Terima kasih telah menggunakan sistem Toko Gitar!");
        sedangBerjalan = false;
        rl.close();
        break;
      }
      default:
        console.log("[Error] Pilihan menu tidak valid! Silakan masukkan angka 0 sampai 4.");
        break;
    }
  }
}

// Memanggil fungsi menu utama untuk memulai program
jalankanMenuPengujian();
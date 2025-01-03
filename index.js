const { createClient } = require('bedrock-protocol');

// Fungsi untuk memulai bot
function startBot() {
  const client = createClient({
    host: 'theminerood.aternos.me', // Alamat server
    port: 16585,                      // Port server
    username: 'IsraModeCover',        // Nama bot
    offline: true,                    // Mode offline
    cacheDir: './auth-cache',         // Lokasi penyimpanan token
  });

  // Event: Ketika bot berhasil masuk ke server
  client.on('join', () => {
    console.log('Bot berhasil masuk ke server!');
    simulateMovement(client); // Memulai simulasi gerakan
  });

  // Event: Ketika bot keluar dari server
  client.on('end', () => {
    console.log('Bot terputus dari server. Mencoba menyambung kembali...');
    setTimeout(startBot, 5000); // Tunggu 5 detik sebelum mencoba kembali
  });

  // Event: Ketika terjadi kesalahan
  client.on('error', (err) => {
    console.error('Terjadi kesalahan:', err.message);
    
    if (err.message.includes('Ping timed out')) {
      console.log('Terjadi kesalahan: Ping timed out');
      console.log('Mencoba untuk memulai ulang bot...');
      setTimeout(startBot, 5000); // Menunggu 5 detik dan mencoba lagi
    } else {
      console.error('Pastikan server online dan alamat/port benar.');
    }
  });
}

// Fungsi untuk simulasi gerakan kecil agar bot tidak dianggap AFK
function simulateMovement(client) {
  setInterval(() => {
    // Pastikan client.entity dan client.entity.position ada
    if (client.entity && client.entity.position) {
      const randomX = Math.random() * 2 - 1; // Nilai acak antara -1 hingga 1
      const randomZ = Math.random() * 2 - 1;
      const newPosition = {
        x: client.entity.position.x + randomX,
        y: client.entity.position.y,
        z: client.entity.position.z + randomZ,
      };

      // Kirim perintah gerakan ke server
      client.queue('move_player', {
        runtimeId: client.entity.runtimeId,
        position: newPosition,
        pitch: client.entity.pitch,
        yaw: client.entity.yaw,
        headYaw: client.entity.headYaw,
        mode: 0, // Mode normal
        onGround: true,
        teleportCause: 0,
        entityType: 0,
      });

      console.log(`Bot bergerak sedikit ke posisi baru: ${JSON.stringify(newPosition)}`);
    } else {
      console.log('Client.entity atau position belum tersedia.');
    }
  }, 30000); // Setiap 30 detik
}

// Memulai bot
startBot();

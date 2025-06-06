export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { ip, port } = await request.json();
        const apiUrl = `https://api.bodong.workers.dev/?key=masbodong&ip=${ip}:${port}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");

        const data = await response.json();
        return new Response(JSON.stringify({
          ip: data?.ip ?? "Tidak tersedia",
          port: data?.port ?? "Tidak tersedia",
          isp: data?.isp ?? "Tidak tersedia",
          country: data?.country ?? "Tidak tersedia",
          city: data?.city ?? "Tidak tersedia",
          country_code: data?.country_code ?? "",
          flag: data?.flag ?? "🏳️",
          asn: data?.asn ?? "Tidak tersedia",
          proxyStatus: data?.proxyStatus.includes("ACTIVE") ? "ACTIVE ✅" : "MATI ❌",
          delay: data?.delay ?? "N/A"
        }), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal mengambil data proxy" }), { status: 500 });
      }
    }
    return new Response(await getHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

// 🔥 Tampilan Web Nuansa Swiss Sejuk
async function getHTML() {
  return `
  <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy Status Checker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      transition: background 0.3s, color 0.3s;
    }
    .dark {
      background: #1E293B;
      color: #F8FAFC;
    }
    .dark .container {
      background: #334155;
    }
    .dark .title, .dark #result, .dark .menu button, .dark p {
      color: #F8FAFC;
    }
    .dark .btn {
      background-color: #3B82F6;
      color: #F8FAFC;
    }
    .dark .btn:hover {
      background-color: #2563EB;
    }
    .dark .profile {
      background-color: #D97706;
    }
    .dark .bot-vless {
      background-color: #16A34A;
    }
    .card {
      background: #F8FAFC;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .dark .card {
      background: #475569;
    }
  </style>
</head>
<body class="dark"> <!-- Default langsung dark mode -->
  <div class="container mx-auto p-4 text-center max-w-md rounded-lg shadow-lg">
    <h1 class="title text-2xl font-bold">Proxy Status Checker</h1>

    <button onclick="toggleDarkMode()" class="mt-2 btn px-4 py-2 rounded-lg font-bold">
      🌙 Dark Mode
    </button>

    <div class="card mt-4">
      <input id="ip" type="text" placeholder="Masukkan IP" class="w-full p-2 text-black rounded border">
      <input id="port" type="text" placeholder="Masukkan Port" class="w-full p-2 mt-2 text-black rounded border">
      <button onclick="checkProxy()" class="w-full btn mt-2">Cek Proxy</button>
    </div>

    <div class="menu flex justify-between mt-4">
      <button class="bot-vless px-4 py-2 rounded-lg font-bold" onclick="window.open('https://t.me/mstkkee_bot')">BOT VLESS</button>
      <button class="profile px-4 py-2 rounded-lg font-bold" onclick="showProfile()">Profile</button>
    </div>

    <div id="result" class="mt-4"></div>

    <div class="mt-4">
      <a href="https://t.me/Mstk3e" class="text-blue-600 underline">Owner Mstkkee3</a>
    </div>
  </div>

  <script>
    function toggleDarkMode() {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    }

    (function loadDarkMode() {
      if (localStorage.getItem("darkMode") !== "false") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    })();

    function showProfile() {
      document.getElementById("result").innerHTML = \`
        <div class="card mt-4">
          <h2 class="text-lg font-bold">Profile</h2>
          <p>Hallo, saya <b>Ahmad Maulana Syahban</b>.</p>
          <p>Usia: <b>29 tahun</b>.</p>
          <p>Asal: <b>Kalimantan Barat</b>.</p>
        </div>
      \`;
    }

    async function checkProxy() {
      const ip = document.getElementById("ip").value;
      const port = document.getElementById("port").value;
      const resultDiv = document.getElementById("result");

      if (!ip || !port) {
        resultDiv.innerHTML = "<p class='text-red-500'>Harap isi IP dan Port.</p>";
        return;
      }

      resultDiv.innerHTML = "<p class='text-yellow-500'>Memeriksa...</p>";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip, port }),
        });
        const data = await response.json();

        if (data.error) {
          resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
          return;
        }

        resultDiv.innerHTML = \`
          <div class="card mt-4">
            <h2 class="text-lg font-bold">Hasil Pengecekan Proxy</h2>
            <p><b>IP:</b> \${data.ip}</p>
            <p><b>Port:</b> \${data.port}</p>
            <p><b>Status:</b> \${data.proxyStatus}</p>
            <p><b>ISP:</b> \${data.isp}</p>
            <p><b>Negara:</b> \${data.country} \${data.flag}</p>
            <p><b>Kota:</b> \${data.city}</p>
            <p><b>ASN:</b> \${data.asn}</p>
            <p><b>Delay:</b> \${data.delay}</p>
          </div>
        \`;
      } catch (error) {
        resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
      }
    }
  </script>
</body>
</html>
  `;
}




export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { ip, port } = await request.json();
        const apiUrl = `https://api.bodong.workers.dev/?key=masbodong&ip=${ip}:${port}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");

        const data = await response.json();
        return new Response(JSON.stringify({
          ip: data?.ip ?? "Tidak tersedia",
          port: data?.port ?? "Tidak tersedia",
          isp: data?.isp ?? "Tidak tersedia",
          country: data?.country ?? "Tidak tersedia",
          city: data?.city ?? "Tidak tersedia",
          country_code: data?.country_code ?? "",
          flag: data?.flag ?? "🏳️",
          asn: data?.asn ?? "Tidak tersedia",
          proxyStatus: data?.proxyStatus.includes("ACTIVE") ? "ACTIVE ✅" : "MATI ❌",
          delay: data?.delay ?? "N/A"
        }), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal mengambil data proxy" }), { status: 500 });
      }
    }
    return new Response(await getHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

async function getHTML() {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy Status Checker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* 🌄 Background Animasi */
    body {
      height: 100vh;
      overflow: hidden;
      font-family: Arial, sans-serif;
      transition: background 0.5s ease-in-out, color 0.5s ease-in-out;
    }
    .scene {
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .sun, .moon {
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      transition: opacity 0.5s ease-in-out;
    }
    .sun { background: yellow; }
    .moon { background: white; opacity: 0; }
    .clouds {
      position: absolute;
      width: 100%;
      height: 100%;
      background: url('https://i.imgur.com/4z1tZxB.png') repeat-x;
      animation: moveClouds 60s linear infinite;
    }
    @keyframes moveClouds {
      from { background-position: 0 50px; }
      to { background-position: -1000px 50px; }
    }
    .stars {
      position: absolute;
      width: 100%;
      height: 100%;
      background: url('https://i.imgur.com/8ZsM5PS.png') repeat;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }
    
    /* 🌙 Mode Gelap */
    .dark-mode {
      background: #1A202C;
      color: white;
    }
    .dark-mode .sun { opacity: 0; }
    .dark-mode .moon { opacity: 1; }
    .dark-mode .stars { opacity: 1; }
    .dark-mode .container {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    /* 📦 Container */
    .container {
      position: relative;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      width: 90%;
      max-width: 400px;
      text-align: center;
    }

    /* 🎨 Tombol */
    .btn {
      background-color: #3498DB;
      padding: 10px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      transition: 0.3s;
    }
    .btn:hover { background-color: #2980B9; }

    /* 🎭 Hasil Pengecekan */
    .result-container {
      max-height: 300px;
      overflow-y: auto;
      margin-top: 10px;
      text-align: left;
    }
  </style>
</head>
<body class="dark-mode">
  <!-- 🌅 Background -->
  <div class="scene">
    <div class="sun"></div>
    <div class="moon"></div>
    <div class="clouds"></div>
    <div class="stars"></div>
  </div>

  <!-- 🔍 UI -->
  <div class="container">
    <h1 class="text-2xl font-bold">Proxy Status Checker</h1>
    <input id="ip" type="text" placeholder="Masukkan IP" class="w-full p-2 mb-2 rounded border border-gray-300 text-black">
    <input id="port" type="text" placeholder="Masukkan Port" class="w-full p-2 mb-2 rounded border border-gray-300 text-black">
    <button onclick="checkProxy()" class="w-full btn">Cek Proxy</button>

    <!-- 🌗 Mode Gelap -->
    <button id="toggleDark" class="mt-4 btn">Toggle Mode</button>

    <div id="result" class="result-container text-gray-800"></div>
    <div class="mt-4">
      <a href="https://t.me/Mstk3e" target="_blank" class="text-blue-600 underline">Owner Mstkkee3</a>
    </div>
  </div>

  <script>
    /* 🎭 Mode Gelap Otomatis */
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.add("dark-mode");
    });

    /* 🔁 Toggle Mode */
    document.getElementById("toggleDark").addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });

    /* 🕵️‍♂️ Cek Proxy */
    async function checkProxy() {
      const ip = document.getElementById("ip").value;
      const port = document.getElementById("port").value;
      const resultDiv = document.getElementById("result");

      if (!ip || !port) {
        resultDiv.innerHTML = "<p class='text-red-500'>Harap isi IP dan Port.</p>";
        return;
      }

      resultDiv.innerHTML = "<p class='text-yellow-500'>Memeriksa...</p>";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip, port }),
        });
        const data = await response.json();

        if (data.error) {
          resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
          return;
        }

        resultDiv.innerHTML = `
          <div class="bg-white p-4 rounded-lg mt-4 shadow-md text-gray-800">
            <h2 class="text-lg font-bold mb-4 text-center">Hasil Pengecekan Proxy</h2>
            <div class="grid grid-cols-2 gap-4">
              <div><p class="text-gray-600">IP:</p> <p class="font-semibold">${data.ip}</p></div>
              <div><p class="text-gray-600">Port:</p> <p class="font-semibold">${data.port}</p></div>
              <div><p class="text-gray-600">Status:</p> <p class="font-semibold">${data.proxyStatus}</p></div>
              <div><p class="text-gray-600">ISP:</p> <p class="font-semibold">${data.isp}</p></div>
            </div>
          </div>`;
      } catch (error) {
        resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
      }
    }
  </script>
</body>
</html>
`;
}



export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { ip, port } = await request.json();
        const apiUrl = `https://api.bodong.workers.dev/?key=masbodong&ip=${ip}:${port}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");

        const data = await response.json();
        return new Response(JSON.stringify({
          ip: data?.ip ?? "Tidak tersedia",
          port: data?.port ?? "Tidak tersedia",
          isp: data?.isp ?? "Tidak tersedia",
          country: data?.country ?? "Tidak tersedia",
          city: data?.city ?? "Tidak tersedia",
          country_code: data?.country_code ?? "",
          flag: data?.flag ?? "🏳️",
          asn: data?.asn ?? "Tidak tersedia",
          proxyStatus: data?.proxyStatus.includes("ACTIVE") ? "ACTIVE ✅" : "MATI ❌",
          delay: data?.delay ?? "N/A"
        }), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal mengambil data proxy" }), { status: 500 });
      }
    }
    return new Response(await getHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

// 🔥 Tampilan Web Nuansa Swiss Sejuk
async function getHTML() {
  return `
  <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy Status Checker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      transition: background 0.3s, color 0.3s;
    }
    .dark {
      background: #1E293B;
      color: #F8FAFC;
    }
    .dark .container {
      background: #334155;
    }
    .dark .title, .dark #result, .dark .menu button, .dark p {
      color: #F8FAFC;
    }
    .dark .btn {
      background-color: #3B82F6;
      color: #F8FAFC;
    }
    .dark .btn:hover {
      background-color: #2563EB;
    }
    .dark .profile {
      background-color: #D97706;
    }
    .dark .bot-vless {
      background-color: #16A34A;
    }
    .card {
      background: #F8FAFC;
      padding: 24px; /* Ukuran card lebih besar */
      border-radius: 12px; /* Sedikit lebih membulat */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .dark .card {
      background: #475569;
    }
  </style>
</head>
<body class="dark"> <!-- Default langsung dark mode -->
  <div class="container mx-auto p-4 text-center max-w-md rounded-lg shadow-lg">
    <h1 class="title text-2xl font-bold">Proxy Status Checker</h1>

    <button onclick="toggleDarkMode()" class="mt-2 btn px-4 py-2 rounded-lg font-bold">
      🌙 Dark Mode
    </button>

    <div class="card mt-4 text-lg"> <!-- Ukuran card lebih besar -->
      <input id="ip" type="text" placeholder="Masukkan IP" class="w-full p-3 text-black rounded border">
      <input id="port" type="text" placeholder="Masukkan Port" class="w-full p-3 mt-3 text-black rounded border">
      <button onclick="checkProxy()" class="w-full btn mt-3 p-3 text-lg">Cek Proxy</button>
    </div>

    <div class="menu flex justify-between mt-4">
      <button class="bot-vless px-4 py-2 rounded-lg font-bold" onclick="window.open('https://t.me/mstkkee_bot')">BOT VLESS</button>
      <button class="profile px-4 py-2 rounded-lg font-bold" onclick="showProfile()">Profile</button>
    </div>

    <div id="result" class="mt-4"></div>

    <div class="mt-4">
      <a href="https://t.me/Mstk3e" class="text-blue-600 underline">Owner Mstkkee3</a>
    </div>
  </div>

  <script>
    function toggleDarkMode() {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    }

    (function loadDarkMode() {
      if (localStorage.getItem("darkMode") !== "false") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    })();

    function showProfile() {
      document.getElementById("result").innerHTML = \`
        <div class="card mt-4">
          <h2 class="text-lg font-bold">Profile</h2>
          <p>Hallo, saya <b>Ahmad Maulana Syahban</b>.</p>
          <p>Usia: <b>29 tahun</b>.</p>
          <p>Asal: <b>Kalimantan Barat</b>.</p>
        </div>
      \`;
    }

    async function checkProxy() {
      const ip = document.getElementById("ip").value;
      const port = document.getElementById("port").value;
      const resultDiv = document.getElementById("result");

      if (!ip || !port) {
        resultDiv.innerHTML = "<p class='text-red-500'>Harap isi IP dan Port.</p>";
        return;
      }

      resultDiv.innerHTML = "<p class='text-yellow-500'>Memeriksa...</p>";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip, port }),
        });
        const data = await response.json();

        if (data.error) {
          resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
          return;
        }

        resultDiv.innerHTML = \`
          <div class="card mt-4">
            <h2 class="text-lg font-bold">Hasil Pengecekan Proxy</h2>
            <p><b>IP:</b> \${data.ip}</p>
            <p><b>Port:</b> \${data.port}</p>
            <p><b>Status:</b> \${data.proxyStatus}</p>
            <p><b>ISP:</b> \${data.isp}</p>
            <p><b>Negara:</b> \${data.country} \${data.flag}</p>
            <p><b>Kota:</b> \${data.city}</p>
            <p><b>ASN:</b> \${data.asn}</p>
            <p><b>Delay:</b> \${data.delay}</p>
          </div>
        \`;
      } catch (error) {
        resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
      }
    }
  </script>
</body>
</html>
  `;
}


export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { ip, port } = await request.json();
        const apiUrl = `https://api.bodong.workers.dev/?key=masbodong&ip=${ip}:${port}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");

        const data = await response.json();
        return new Response(JSON.stringify({
          ip: data?.ip ?? "Tidak tersedia",
          port: data?.port ?? "Tidak tersedia",
          isp: data?.isp ?? "Tidak tersedia",
          country: data?.country ?? "Tidak tersedia",
          city: data?.city ?? "Tidak tersedia",
          country_code: data?.country_code ?? "",
          flag: data?.flag ?? "🏳️",
          asn: data?.asn ?? "Tidak tersedia",
          proxyStatus: data?.proxyStatus.includes("ACTIVE") ? "ACTIVE ✅" : "MATI ❌",
          delay: data?.delay ?? "N/A"
        }), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal mengambil data proxy" }), { status: 500 });
      }
    }
    return new Response(await getHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

// 🔥 Tampilan Web Nuansa Swiss Sejuk
async function getHTML() {
  return `
  <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy Status Checker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      transition: background 0.3s, color 0.3s;
    }
    .dark {
      background: #1E293B;
      color: #F8FAFC;
    }
    .dark .container {
      background: #334155;
    }
    .dark .title, .dark #result, .dark .menu button, .dark p {
      color: #F8FAFC;
    }
    .dark .btn {
      background-color: #3B82F6;
      color: #F8FAFC;
    }
    .dark .btn:hover {
      background-color: #2563EB;
    }
    .dark .profile {
      background-color: #D97706;
    }
    .dark .bot-vless {
      background-color: #16A34A;
    }
    .card {
      background: #F8FAFC;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
    }
    .dark .card {
      background: #475569;
    }
    .big-card {
      min-height: 200px;
    }
  </style>
</head>
<body class="dark">
  <div class="container mx-auto p-4 text-center max-w-lg rounded-lg shadow-lg">
    <h1 class="title text-2xl font-bold">Proxy Status Checker</h1>

    <button onclick="toggleDarkMode()" class="mt-2 btn px-4 py-2 rounded-lg font-bold">
      🌙 Dark Mode
    </button>

    <div class="card mt-4">
      <input id="ip" type="text" placeholder="Masukkan IP" class="w-full p-2 text-black rounded border">
      <input id="port" type="text" placeholder="Masukkan Port" class="w-full p-2 mt-2 text-black rounded border">
      <button onclick="checkProxy()" class="w-full btn mt-2">Cek Proxy</button>
    </div>

    <div class="menu flex justify-between mt-4">
      <button class="bot-vless px-4 py-2 rounded-lg font-bold" onclick="window.open('https://t.me/mstkkee_bot')">BOT VLESS</button>
      <button class="profile px-4 py-2 rounded-lg font-bold" onclick="showProfile()">Profile</button>
    </div>

    <div id="result" class="mt-4 big-card"></div>

    <div class="mt-4">
      <a href="https://t.me/Mstk3e" class="text-blue-600 underline">Owner Mstkkee3</a>
    </div>
  </div>

  <script>
    function toggleDarkMode() {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    }

    (function loadDarkMode() {
      if (localStorage.getItem("darkMode") !== "false") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    })();

    function showProfile() {
      document.getElementById("result").innerHTML = \`
        <div class="card mt-4 big-card">
          <h2 class="text-lg font-bold">Profile</h2>
          <p>Hallo, saya <b>Ahmad Maulana Syahban</b>.</p>
          <p>Usia: <b>29 tahun</b>.</p>
          <p>Asal: <b>Kalimantan Barat</b>.</p>
        </div>
      \`;
    }

    async function checkProxy() {
      const ip = document.getElementById("ip").value;
      const port = document.getElementById("port").value;
      const resultDiv = document.getElementById("result");

      if (!ip || !port) {
        resultDiv.innerHTML = "<p class='text-red-500'>Harap isi IP dan Port.</p>";
        return;
      }

      resultDiv.innerHTML = "<p class='text-yellow-500'>Memeriksa...</p>";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip, port }),
        });
        const data = await response.json();

        if (data.error) {
          resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
          return;
        }

        resultDiv.innerHTML = \`
          <div class="card mt-4 big-card">
            <h2 class="text-lg font-bold">Hasil Pengecekan Proxy</h2>
            <p><b>IP:</b> \${data.ip}</p>
            <p><b>Port:</b> \${data.port}</p>
            <p><b>Status:</b> \${data.proxyStatus}</p>
            <p><b>ISP:</b> \${data.isp}</p>
            <p><b>Negara:</b> \${data.country} \${data.flag}</p>
            <p><b>Kota:</b> \${data.city}</p>
            <p><b>ASN:</b> \${data.asn}</p>
            <p><b>Delay:</b> \${data.delay}</p>
          </div>
        \`;
      } catch (error) {
        resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
      }
    }
  </script>
</body>
</html>
  `;
}





export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { ip, port } = await request.json();
        const apiUrl = `https://api.bodong.workers.dev/?key=masbodong&ip=${ip}:${port}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");

        const data = await response.json();
        return new Response(JSON.stringify({
          ip: data?.ip ?? "Tidak tersedia",
          port: data?.port ?? "Tidak tersedia",
          isp: data?.isp ?? "Tidak tersedia",
          country: data?.country ?? "Tidak tersedia",
          city: data?.city ?? "Tidak tersedia",
          country_code: data?.country_code ?? "",
          flag: data?.flag ?? "🏳️",
          asn: data?.asn ?? "Tidak tersedia",
          proxyStatus: data?.proxyStatus.includes("ACTIVE") ? "ACTIVE ✅" : "MATI ❌",
          delay: data?.delay ?? "N/A"
        }), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal mengambil data proxy" }), { status: 500 });
      }
    }
    return new Response(await getHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

async function getHTML() {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Status Checker</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        transition: background 0.3s, color 0.3s;
      }
      .dark {
        background: #1E293B;
        color: #F8FAFC;
      }
      .light {
        background: #F8FAFC;
        color: #1E293B;
      }
      .container {
        background: #334155;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
      }
      .big-card {
        min-height: 250px;
      }
      .btn {
        background-color: #3B82F6;
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-weight: bold;
        width: 100%;
        display: block;
        margin-top: 10px;
        font-size: 16px;
      }
      .profile {
        background-color: #D97706;
        color: white;
      }
      .bot-vless {
        background-color: #16A34A;
        color: white;
      }
      input {
        background: white;
        color: black;
        padding: 14px;
        border-radius: 8px;
        border: 1px solid #ccc;
        width: 100%;
        margin-top: 10px;
        font-size: 18px;
      }
      .input-card {
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        min-height: 180px;
      }
      .dark .card, .dark .input-card, .dark input {
        background: #475569;
        color: #F8FAFC;
      }
      .dark .profile {
        background-color: #D97706;
      }
      .dark .bot-vless {
        background-color: #16A34A;
      }
    </style>
  </head>
  <body class="light">
    <div class="container mx-auto p-4 text-center max-w-lg rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold">Proxy Status Checker</h1>

      <p class="mt-2 text-sm">Selamat Menikmati</p>

      <div class="input-card mt-4">
        <h2 class="text-lg font-bold">Masukkan IP & Port</h2>
        <input id="ip" type="text" placeholder="Masukkan IP" style="height: 50px; font-size: 20px;">
        <input id="port" type="text" placeholder="Masukkan Port" style="height: 50px; font-size: 20px;">
        <button onclick="checkProxy()" class="btn">Cek Proxy</button>
      </div>

      <div class="menu flex justify-between mt-4">
        <button class="bot-vless px-4 py-2 rounded-lg font-bold" onclick="window.open('https://t.me/mstkkee_bot')">BOT VLESS</button>
        <button class="profile px-4 py-2 rounded-lg font-bold" onclick="showProfile()">Profile</button>
      </div>

      <div id="result" class="mt-4 big-card"></div>

      <div class="mt-4">
        <a href="https://t.me/Mstk3e" class="text-blue-600 underline">Owner Mstkkee3</a>
      </div>
    </div>

    <script>
      function toggleDarkMode() {
        document.body.classList.toggle("dark");
        document.body.classList.toggle("light");
        localStorage.setItem("darkMode", document.body.classList.contains("dark"));
      }

      (function loadDarkMode() {
        if (localStorage.getItem("darkMode") === "true") {
          document.body.classList.add("dark");
          document.body.classList.remove("light");
        } else {
          document.body.classList.add("light");
          document.body.classList.remove("dark");
        }
      })();

      function showProfile() {
        document.getElementById("result").innerHTML = \`
          <div class="card mt-4 big-card">
            <h2 class="text-lg font-bold">Profile</h2>
            <p>Hallo, saya <b>Ahmad Maulana Syahban</b>.</p>
            <p>Usia: <b>29 tahun</b>.</p>
            <p>Asal: <b>Kalimantan Barat</b>.</p>
          </div>
        \`;
      }

      async function checkProxy() {
        const ip = document.getElementById("ip").value;
        const port = document.getElementById("port").value;
        const resultDiv = document.getElementById("result");

        if (!ip || !port) {
          resultDiv.innerHTML = "<p class='text-red-500'>Harap isi IP dan Port.</p>";
          return;
        }

        resultDiv.innerHTML = "<p class='text-yellow-500'>Memeriksa...</p>";

        try {
          const response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip, port }),
          });
          const data = await response.json();

          resultDiv.innerHTML = \`
            <div class="card mt-4 big-card">
              <h2 class="text-lg font-bold">Hasil Pengecekan Proxy</h2>
              <p><b>IP:</b> \${data.ip}</p>
              <p><b>Port:</b> \${data.port}</p>
              <p><b>Status:</b> \${data.proxyStatus}</p>
              <p><b>ISP:</b> \${data.isp}</p>
              <p><b>Negara:</b> \${data.country} \${data.flag}</p>
              <p><b>Kota:</b> \${data.city}</p>
              <p><b>ASN:</b> \${data.asn}</p>
              <p><b>Delay:</b> \${data.delay}</p>
            </div>
          \`;
        } catch (error) {
          resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
        }
      }
    </script>
  </body>
  </html>
  `;
}





export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { ip, port } = await request.json();
        const apiUrl = `https://api.bodong.workers.dev/?key=masbodong&ip=${ip}:${port}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");

        const data = await response.json();
        return new Response(JSON.stringify({
          ip: data?.ip ?? "Tidak tersedia",
          port: data?.port ?? "Tidak tersedia",
          isp: data?.isp ?? "Tidak tersedia",
          country: data?.country ?? "Tidak tersedia",
          city: data?.city ?? "Tidak tersedia",
          country_code: data?.country_code ?? "",
          flag: data?.flag ?? "🏳️",
          asn: data?.asn ?? "Tidak tersedia",
          proxyStatus: data?.proxyStatus.includes("ACTIVE") ? "ACTIVE ✅" : "MATI ❌",
          delay: data?.delay ?? "N/A"
        }), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal mengambil data proxy" }), { status: 500 });
      }
    }
    return new Response(await getHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

async function getHTML() {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Status Checker</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        transition: background 0.3s, color 0.3s;
      }
      .dark {
        background: #1E293B;
        color: #F8FAFC;
      }
      .light {
        background: #F8FAFC;
        color: #1E293B;
      }
      .container {
        background: #334155;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
      }
      .big-card {
        min-height: 250px;
      }
      .btn {
        background-color: #3B82F6;
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-weight: bold;
        width: 100%;
        display: block;
        margin-top: 10px;
        font-size: 16px;
      }
      .profile {
        background-color: #D97706;
        color: white;
      }
      .bot-vless {
        background-color: #16A34A;
        color: white;
      }
      input {
        background: white;
        color: black;
        padding: 14px 15px;
        border-radius: 8px;
        border: 1px solid #ccc;
        width: 100%;
        font-size: 18px;
      }
      .input-card {
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        min-height: 200px;
        margin-top: 10px;
      }
      .dark .card, .dark .input-card, .dark input {
        background: #475569;
        color: #F8FAFC;
      }
      .dark .profile {
        background-color: #D97706;
      }
      .dark .bot-vless {
        background-color: #16A34A;
      }
    </style>
  </head>
  <body class="light">
    <div class="container mx-auto p-4 text-center max-w-lg rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold">Proxy Status Checker</h1>
      <p class="mt-2 text-sm">Selamat Menikmati</p>

      <div class="input-card mt-4">
        <h2 class="text-lg font-bold">Masukkan IP & Port</h2>
        
        <div class="flex flex-col gap-4 mt-2">
          <input id="ip" type="text" placeholder="Masukkan IP" class="p-4 text-lg rounded-lg border border-gray-300 w-full">
          <input id="port" type="text" placeholder="Masukkan Port" class="p-4 text-lg rounded-lg border border-gray-300 w-full">
        </div>

        <button onclick="checkProxy()" class="btn mt-4">Cek Proxy</button>
      </div>

      <div class="menu flex justify-between mt-4">
        <button class="bot-vless px-4 py-2 rounded-lg font-bold" onclick="window.open('https://t.me/mstkkee_bot')">BOT VLESS</button>
        <button class="profile px-4 py-2 rounded-lg font-bold" onclick="showProfile()">Profile</button>
      </div>

      <div id="result" class="mt-4 big-card"></div>

      <div class="mt-4">
        <a href="https://t.me/Mstk3e" class="text-blue-600 underline">Owner Mstkkee3</a>
      </div>
    </div>

    <script>
      function toggleDarkMode() {
        document.body.classList.toggle("dark");
        document.body.classList.toggle("light");
        localStorage.setItem("darkMode", document.body.classList.contains("dark"));
      }

      (function loadDarkMode() {
        if (localStorage.getItem("darkMode") === "true") {
          document.body.classList.add("dark");
          document.body.classList.remove("light");
        } else {
          document.body.classList.add("light");
          document.body.classList.remove("dark");
        }
      })();

      function showProfile() {
        document.getElementById("result").innerHTML = \`
          <div class="card mt-4 big-card">
            <h2 class="text-lg font-bold">Profile</h2>
            <p>Hallo, saya <b>Ahmad Maulana Syahban</b>.</p>
            <p>Usia: <b>29 tahun</b>.</p>
            <p>Asal: <b>Kalimantan Barat</b>.</p>
          </div>
        \`;
      }

      async function checkProxy() {
        const ip = document.getElementById("ip").value;
        const port = document.getElementById("port").value;
        const resultDiv = document.getElementById("result");

        if (!ip || !port) {
          resultDiv.innerHTML = "<p class='text-red-500'>Harap isi IP dan Port.</p>";
          return;
        }

        resultDiv.innerHTML = "<p class='text-yellow-500'>Memeriksa...</p>";

        try {
          const response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip, port }),
          });
          const data = await response.json();

          resultDiv.innerHTML = \`
            <div class="card mt-4 big-card">
              <h2 class="text-lg font-bold">Hasil Pengecekan Proxy</h2>
              <p><b>IP:</b> \${data.ip}</p>
              <p><b>Port:</b> \${data.port}</p>
              <p><b>Status:</b> \${data.proxyStatus}</p>
              <p><b>ISP:</b> \${data.isp}</p>
              <p><b>Negara:</b> \${data.country} \${data.flag}</p>
              <p><b>Kota:</b> \${data.city}</p>
              <p><b>ASN:</b> \${data.asn}</p>
              <p><b>Delay:</b> \${data.delay}</p>
            </div>
          \`;
        } catch (error) {
          resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
        }
      }
    </script>
  </body>
  </html>
  `;
}





export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { ip, port } = await request.json();
        const apiUrl = `https://api.bodong.workers.dev/?key=masbodong&ip=${ip}:${port}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");

        const data = await response.json();
        return new Response(JSON.stringify({
          ip: data?.ip ?? "Tidak tersedia",
          port: data?.port ?? "Tidak tersedia",
          isp: data?.isp ?? "Tidak tersedia",
          country: data?.country ?? "Tidak tersedia",
          city: data?.city ?? "Tidak tersedia",
          country_code: data?.country_code ?? "",
          flag: data?.flag ?? "🏳️",
          asn: data?.asn ?? "Tidak tersedia",
          proxyStatus: data?.proxyStatus.includes("ACTIVE") ? "ACTIVE ✅" : "MATI ❌",
          delay: data?.delay ?? "N/A"
        }), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal mengambil data proxy" }), { status: 500 });
      }
    }
    return new Response(await getHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

async function getHTML() {
  return `
  <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy Status Checker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      transition: background 0.3s, color 0.3s;
    }
    .dark {
      background: #1E293B;
      color: #F8FAFC;
    }
    .light {
      background: #F8FAFC;
      color: #1E293B;
    }
    .container {
      background: #334155;
      padding: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .card {
      background: white;
      padding: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
    }
    .big-card {
      min-height: 250px;
    }
    .btn {
      background-color: #3B82F6;
      color: white;
      padding: 12px;
      font-weight: bold;
      width: 100%;
      display: block;
      margin-top: 10px;
      font-size: 16px;
    }
    .profile {
      background-color: #D97706;
      color: white;
    }
    .bot-vless {
      background-color: #16A34A;
      color: white;
    }
    input {
      background: white;
      color: black;
      padding: 14px 15px;
      border: 1px solid #ccc;
      width: 100%;
      font-size: 18px;
    }
    .input-card {
      padding: 20px;
      background: white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      min-height: 200px;
      margin-top: 10px;
    }
    .dark .card, .dark .input-card, .dark input {
      background: #475569;
      color: #F8FAFC;
    }
    .dark .profile {
      background-color: #D97706;
    }
    .dark .bot-vless {
      background-color: #16A34A;
    }
  </style>
</head>
<body class="light">
  <div class="container mx-auto p-4 text-center max-w-lg shadow-lg">
    <h1 class="text-2xl font-bold">Proxy Status Checker</h1>
    <p class="mt-2 text-sm">Selamat Menikmati</p>

    <div class="input-card mt-4">
      <h2 class="text-lg font-bold">Masukkan IP & Port</h2>
      
      <div class="flex flex-col gap-4 mt-2">
        <input id="ip" type="text" placeholder="Masukkan IP" class="p-4 text-lg border border-gray-300 w-full">
        <input id="port" type="text" placeholder="Masukkan Port" class="p-4 text-lg border border-gray-300 w-full">
      </div>

      <button onclick="checkProxy()" class="btn mt-4">Cek Proxy</button>
    </div>

    <div class="menu flex justify-between mt-4">
      <button class="bot-vless px-4 py-2 font-bold" onclick="window.open('https://t.me/mstkkee_bot')">BOT VLESS</button>
      <button class="profile px-4 py-2 font-bold" onclick="showProfile()">Profile</button>
    </div>

    <div id="result" class="mt-4 big-card"></div>

    <div class="mt-4">
      <a href="https://t.me/Mstk3e" class="text-blue-600 underline">Owner Mstkkee3</a>
    </div>
  </div>

  <script>
    function toggleDarkMode() {
      document.body.classList.toggle("dark");
      document.body.classList.toggle("light");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    }

    (function loadDarkMode() {
      if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
      } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
      }
    })();

    function showProfile() {
      document.getElementById("result").innerHTML = \`
        <div class="card mt-4 p-4 bg-gray-100 dark:bg-gray-700 shadow-md">
          <h2 class="text-md font-bold">Profile</h2>
          <p>Hallo, saya <b>Ahmad Maulana Syahban</b>.</p>
          <p>Usia: <b>29 tahun</b>.</p>
          <p>Asal: <b>Kalimantan Barat</b>.</p>
        </div>
      \`;
    }

    async function checkProxy() {
      const ip = document.getElementById("ip").value;
      const port = document.getElementById("port").value;
      const resultDiv = document.getElementById("result");

      if (!ip || !port) {
        resultDiv.innerHTML = "<p class='text-red-500'>Harap isi IP dan Port.</p>";
        return;
      }

      resultDiv.innerHTML = "<p class='text-yellow-500'>Memeriksa...</p>";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip, port }),
        });
        const data = await response.json();

        resultDiv.innerHTML = \`
          <div class="card mt-4 big-card">
            <h2 class="text-lg font-bold">Hasil Pengecekan Proxy</h2>
            <p><b>IP:</b> \${data.ip}</p>
            <p><b>Port:</b> \${data.port}</p>
            <p><b>Status:</b> \${data.proxyStatus}</p>
            <p><b>ISP:</b> \${data.isp}</p>
            <p><b>Negara:</b> \${data.country} \${data.flag}</p>
            <p><b>Kota:</b> \${data.city}</p>
            <p><b>ASN:</b> \${data.asn}</p>
            <p><b>Delay:</b> \${data.delay}</p>
          </div>
        \`;
      } catch (error) {
        resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
      }
    }
  </script>
</body>
</html>
  `;
}





export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        const { ip, port } = await request.json();
        const apiUrl = `https://api.bodong.workers.dev/?key=masbodong&ip=${ip}:${port}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");

        const data = await response.json();
        return new Response(JSON.stringify({
          ip: data?.ip ?? "Tidak tersedia",
          port: data?.port ?? "Tidak tersedia",
          isp: data?.isp ?? "Tidak tersedia",
          country: data?.country ?? "Tidak tersedia",
          city: data?.city ?? "Tidak tersedia",
          country_code: data?.country_code ?? "",
          flag: data?.flag ?? "🏳️",
          asn: data?.asn ?? "Tidak tersedia",
          proxyStatus: data?.proxyStatus.includes("ACTIVE") ? "ACTIVE ✅" : "MATI ❌",
          delay: data?.delay ?? "N/A"
        }), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal mengambil data proxy" }), { status: 500 });
      }
    }
    return new Response(await getHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

async function getHTML() {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Status Checker</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        transition: background 0.3s, color 0.3s;
      }
      .dark {
        background: #1E293B;
        color: #F8FAFC;
      }
      .light {
        background: #F8FAFC;
        color: #1E293B;
      }
      .container {
        background: #334155;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
      }
      .big-card {
        min-height: 250px;
      }
      .btn {
        background-color: #3B82F6;
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-weight: bold;
        width: 100%;
        display: block;
        margin-top: 10px;
        font-size: 16px;
      }
      .profile {
        background-color: #D97706;
        color: white;
      }
      .bot-vless {
        background-color: #16A34A;
        color: white;
      }
      input {
        background: white;
        color: black;
        padding: 14px 15px;
        border-radius: 8px;
        border: 1px solid #ccc;
        width: 100%;
        font-size: 18px;
      }
      .input-card {
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        min-height: 200px;
        margin-top: 10px;
      }
      .dark .card, .dark .input-card, .dark input {
        background: #475569;
        color: #F8FAFC;
      }
      .dark .profile {
        background-color: #D97706;
      }
      .dark .bot-vless {
        background-color: #16A34A;
      }
    </style>
  </head>
  <body class="light">
    <div class="container mx-auto p-4 text-center max-w-lg rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold">Proxy Status Checker</h1>
      <p class="mt-2 text-sm">Selamat Menikmati</p>
      
      <div class="input-card mt-4">
      <h2 class="text-lg font-bold">Masukkan IP & Port</h2>
        
        <div class="flex flex-col gap-4 mt-2">
          <input id="ip" type="text" placeholder="Masukkan IP" class="p-4 text-lg rounded-lg border border-gray-300 w-full">
          <input id="port" type="text" placeholder="Masukkan Port" class="p-4 text-lg rounded-lg border border-gray-300 w-full">
        </div>

        <button onclick="checkProxy()" class="btn mt-4">Cek Proxy</button>
      </div>

      <div class="menu flex justify-between mt-4">
        <button class="bot-vless px-4 py-2 rounded-lg font-bold" onclick="window.open('https://t.me/mstkkee_bot')">BOT VLESS</button>
        <button class="profile px-4 py-2 rounded-lg font-bold" onclick="showProfile()">Profile</button>
      </div>

      <div id="result" class="mt-4 big-card"></div>

      <div class="mt-4">
        <a href="https://t.me/Mstk3e" class="text-blue-600 underline">Owner Mstkkee3</a>
      </div>
    </div>

    <script>
      function toggleDarkMode() {
        document.body.classList.toggle("dark");
        document.body.classList.toggle("light");
        localStorage.setItem("darkMode", document.body.classList.contains("dark"));
      }

      (function loadDarkMode() {
        if (localStorage.getItem("darkMode") === "true") {
          document.body.classList.add("dark");
          document.body.classList.remove("light");
        } else {
          document.body.classList.add("light");
          document.body.classList.remove("dark");
        }
      })();

      function showProfile() {
  document.getElementById("result").innerHTML = \`
    <div class="card mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
      <h2 class="text-md font-bold">Profile</h2>
      <p>Hallo, saya <b>Ahmad Maulana Syahban</b>.</p>
      <p>Usia: <b>29 tahun</b>.</p>
      <p>Asal: <b>Kalimantan Barat</b>.</p>
    </div>
        \`;
      }

      async function checkProxy() {
        const ip = document.getElementById("ip").value;
        const port = document.getElementById("port").value;
        const resultDiv = document.getElementById("result");

        if (!ip || !port) {
          resultDiv.innerHTML = "<p class='text-red-500'>Harap isi IP dan Port.</p>";
          return;
        }

        resultDiv.innerHTML = "<p class='text-yellow-500'>Memeriksa...</p>";

        try {
          const response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip, port }),
          });
          const data = await response.json();

          resultDiv.innerHTML = \`
            <div class="card mt-4 big-card">
              <h2 class="text-lg font-bold">Hasil Pengecekan Proxy</h2>
              <p><b>IP:</b> \${data.ip}</p>
              <p><b>Port:</b> \${data.port}</p>
              <p><b>Status:</b> \${data.proxyStatus}</p>
              <p><b>ISP:</b> \${data.isp}</p>
              <p><b>Negara:</b> \${data.country} \${data.flag}</p>
              <p><b>Kota:</b> \${data.city}</p>
              <p><b>ASN:</b> \${data.asn}</p>
              <p><b>Delay:</b> \${data.delay}</p>
            </div>
          \`;
        } catch (error) {
          resultDiv.innerHTML = "<p class='text-red-500'>Gagal mengambil data.</p>";
        }
      }
    </script>
  </body>
  </html>
  `;
}

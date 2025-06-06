const ALLOWED_USER_ID = 5646190352; // Ganti dengan user ID kamu sendiri
const servervless = 'mstkkee3.dpdns.org';
const userSession = {};
const userRateLimit = {};
const RATE_LIMIT_SECONDS = 10;
const BASE_DOMAIN = 'mstkkee3.dpdns.org';
const CF_ZONE_ID = '01edc11280c7c9986502d58e79e0ce5d';
const CF_API_TOKEN = 'MMT9cuxiKR2T816AD-mIOzd9h6757RmtwterQLWq';
const WORKER_SCRIPT_NAME = 'mstk3e';// Nama Worker script kamu


// Contoh array global daftar wildcard dan sni
const wildcardDomains = [
  "ava.game.naver.com",
  "support.zoom.us",
  "cache.netflix.com",
  "graph.instagram.com",
  "zaintest.vuclip.com",
  "edu.ruangguru.com",
  "api.midtrans.com",
  "bakrie.ac.id",
  "blog.webex.com",
  "investors.spotify.com",
  "investor.fb.com",
  "unnes.ac.id"
];

const sniDomains = [
  "ava.game.naver.com",
  "support.zoom.us",
  "cache.netflix.com",
  "graph.instagram.com",
  "zaintest.vuclip.com",
  "edu.ruangguru.com",
  "api.midtrans.com",
  "bakrie.ac.id",
  "blog.webex.com",
  "investors.spotify.com",
  "investor.fb.com",
  "unnes.ac.id"
];

// Daftar proxy yang tersedia
const proxies = [
  { id: 1, server: '(ID) Rumahweb 🇮🇩', host: '203.194.112.119', port: 8443, path: '/id-rmhwb' },
  { id: 2, server: '(ID) Amazon.com, Inc 🇮🇩', host: '43.218.77.16', port: 443, path: '/id-amz' },
  { id: 3, server: '(ID) PT. Telekomunikasi 🇮🇩', host: '36.95.152.58', port: 12137, path: '/id-tksi' },
  { id: 4, server: '(ID) Pt Pusat Media 🇮🇩', host: '103.6.207.108', port: 8080, path: '/id-pusat' },
  { id: 5, server: '(MY) Kaopu Cloud 🇲🇾', host: '38.60.193.247', port: 13300, path: '/my-kc' },
  { id: 6, server: '(SG) Digitalocean, LLC 🇸🇬', host: '178.128.80.43', port: 443, path: '/sg-do' },
  { id: 7, server: '(SG) Oracle Corporation 🇸🇬', host: '213.35.108.135', port: 12596, path: '/sg-orcl' },
  { id: 8, server: '(SG) Godaddy.com, LLC 🇸🇬', host: '97.74.82.87', port: 45837, path: '/sg-gddy' },
  { id: 9, server: '(SG) Amazon.com, Inc 🇸🇬', host: '13.228.142.218', port: 443, path: '/sg-amz' },
  { id: 10, server: '(SG) Tcloudnet 🇸🇬', host: '154.91.84.10', port: 8443, path: '/sg-tcloud' },
  { id: 11, server: '(SG) AKILE LTD 🇸🇬', host: '185.81.29.113', port: 8080, path: '/sg-akl' },
  { id: 12, server: '(SG) Hetzner Online 🇸🇬', host: '5.223.49.4', port: 2053, path: '/sg-hzr' },
  { id: 13, server: '(SG) Regxa Company🇸🇬', host: '206.206.76.208', port: 2053, path: '/sg-rgxa' },
  { id: 14, server: '(SG) OVH SAS 🇸🇬', host: '51.79.158.58', port: 8443, path: '/sg-ovh' },
  { id: 15, server: '(SG) Melbikomas Uab 🇸🇬', host: '91.192.81.154', port: 2053, path: '/sg-melbi' },
];
  
// Token bot Telegram
const TELEGRAM_BOT_TOKEN = '7804911751:AAHTWMXn7KMK5sDrmAUmz-eIpJsp_cSI18M';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Webhook handler
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});


async function checkProxy2(proxy) {
  try {
    const response = await fetch(`https://api.bodong.workers.dev/?key=masbodong&ip=${proxy.host}:${proxy.port}`);
    const data = await response.json();

    return {
      proxyStatus: data.status,
      isp: data.isp,
      flag: data.flag,
      country: data.country,
      country_code: data.country_code,
      city: data.city,
      region: data.region,
      delay: data.delay,
      path: data.path || ""
    };
  } catch (error) {
    console.error("Error checking proxy status:", error);
    return null;
  }
}

// Fungsi untuk memeriksa status proxy berdasarkan input pengguna (ip:port)
async function checkProxy2ByUserInput(chatId, userInput, replyToMessageId = null) {
  const proxies = userInput.split(/\s+|\n+/).map(p => p.trim()).filter(Boolean);
  const MAX_PROXIES = 20;

  if (proxies.length > MAX_PROXIES) {
    return sendMessage(chatId, `❌ Terlalu banyak proxy. Maksimal ${MAX_PROXIES} proxy per permintaan.`, replyToMessageId);
  }

  if (proxies.length === 0 || proxies.some(proxy => !proxy.includes(':'))) {
    return sendMessage(chatId, "❌ Format salah. Harap kirim dalam format ip:port, contoh:\n`139.59.104.29:443`\n`192.168.1.1:8080`", replyToMessageId, { parse_mode: "Markdown" });
  }

  // Kirim pesan sementara dengan reply ke pesan user
  const processingMessage = await sendTemporaryMessage(chatId, `
\`\`\`PROCESSING\nSedang memeriksa status proxy, mohon tunggu...\`\`\``, replyToMessageId);

  let allStatusText = "```🔍Status:\n";

  const checkPromises = proxies.map(async (proxyInput) => {
    const [ip, port] = proxyInput.split(':');
    const proxy = { host: ip, port: parseInt(port, 10) };

    try {
      const status = await checkProxy(proxy);

      if (!status) {
        return `❌ Tidak dapat memeriksa status proxy ${proxy.host}:${proxy.port}.\n\n`;
      }

      const isActive = status.proxyStatus === "ACTIVE ✅";
      const proxyStatus = isActive ? "✅ AKTIF" : "❌ NONAKTIF";

      return `🌐 Proxy  : ${proxy.host}:${proxy.port}\n`
        + `📡 ISP    : ${status.isp || "-"} ${status.flag}\n`
        + `🌍 Negara : ${status.country || ""}\n`
        + `🏙️ Lokasi : ${status.city || status.region || "-"}\n`
        + `🛡️ Status : ${proxyStatus}\n`
        + `⏱️ Latency: ${status.delay || "N/A"} \n\n`;
    } catch (error) {
      return `❌ Error saat memeriksa ${proxy.host}:${proxy.port}.\n\n`;
    }
  });

  const results = await Promise.all(checkPromises);

  allStatusText += results.join("") + "```";

  // Gantikan pesan sementara dengan hasil menggunakan editMessageText
  return editMessageText(chatId, processingMessage.message_id, allStatusText, {
    parse_mode: "MarkdownV2"
  });
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === "/webhook") {
    try {
      const update = await request.json();

      // HANDLE PESAN BIASA
      if (update.message) {
        const chatId = update.message.chat.id;
        const messageId = update.message.message_id;
        const text = update.message.text?.trim();
        const userId = update.message.from.id;
        
        // Tambahkan di bagian ini dalam handleRequest() - tepat di bawah if (update.message)
if (text === "/proxyrandom") {
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
  const keyboard = {
  inline_keyboard: [
    [
      { text: "Tidak", callback_data: `method:no:${randomProxy.id}` },
      { text: "Wildcard", callback_data: `method:wc:${randomProxy.id}` }
    ],
    [
      { text: "SNI/TLS", callback_data: `method:sni:${randomProxy.id}` }
    ]
  ]
};

  await sendMessage(chatId, "🔧 Pilih metode inject untuk VLESS:\n(Proxy telah dipilih secara acak)", messageId, {
    reply_markup: keyboard
  });

  return new Response("OK");
}

        // ✅ /getlinksub diketik
        if (text === "/getlinksub") {
          await sendGetLinkSubMenu(chatId, messageId);
          return new Response("OK");
        }

        // ✅ Pesan biasa lain
        await handleMessage(text, chatId, messageId, userId);
        return new Response("OK");
      }

      // HANDLE CALLBACK QUERY
      else if (update.callback_query) {
        const callbackQuery = update.callback_query;
        const data = callbackQuery.data;
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;

        // ✅ Alur baru: getlinksub
        if (data.startsWith("getlinksub:")) {
          await handleGetLinkSubCallback(data, chatId, messageId);
          return new Response("OK");
        }

        const dataParts = data.split(":");
        const action = dataParts[0];

        switch (action) {
          case "vless":
            if (dataParts[1]) {
              await generateVlessConfig(chatId, dataParts[1], messageId);
            }
            break;

          case "method":
            if (dataParts.length === 3) {
              const method = dataParts[1];
              const proxyId = dataParts[2];
              await handleMethodSelection(chatId, method, proxyId, messageId);
            }
            break;

          case "no": {
            const proxyId = dataParts[1];
            const selectedProxy = proxies.find(p => p.id == proxyId);
            if (!selectedProxy) {
              await sendMessage(chatId, "❌ Proxy tidak ditemukan. Pilih proxy yang tersedia.", {}, messageId);
              break;
            }
            await generateConfigNoWS(chatId, proxyId, messageId);
            break;
          }

          case "wildcard": {
            const wildcard = dataParts[1];
            const proxyId = dataParts[2];

            await editMessageText(chatId, messageId, "```RUNNING\nHarap menunggu, sedang memproses...\n```", {
              parse_mode: "MarkdownV2"
            });

            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              await deleteMessage(chatId, messageId);
            } catch (e) {
              console.warn("Gagal menghapus pesan:", e.message);
            }

            await generateConfigWithWildcard(chatId, wildcard, proxyId, messageId);
            break;
          }

          case "sni": {
            const sni = dataParts[1];
            const proxyId = dataParts[2];

            await editMessageText(chatId, messageId, "```RUNNING\nHarap menunggu, sedang memproses...\n```", {
              parse_mode: "MarkdownV2"
            });

            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              await deleteMessage(chatId, messageId);
            } catch (e) {
              console.warn("Gagal menghapus pesan:", e.message);
            }

            await generateConfigWithSni(chatId, sni, proxyId, messageId);
            break;
          }

          default:
            await sendMessage(chatId, "❌ Aksi tidak dikenal.");
            break;
        }

        return new Response("OK");
      }

      return new Response("OK");
    } catch (err) {
      console.error("Webhook Error:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
}

// Fungsi menangani berbagai perintah
async function handleMessage(text, chatId, messageId, userId, env) {
  if (text === "/start") {
    return await sendStartMessage(chatId, messageId);
  }

  if (text === "/proxy") {
    return await sendProxyList(chatId, messageId);
  }

  if (text === "/listwildcard") {
    return await sendWildcardList(chatId, messageId);
  }

  if (text === "/allstatus") {
    return await sendAllProxyStatus(chatId, messageId);
  }

  if (text === "/donasi") {
    return await handleCommand("/donasi", chatId, messageId);
  }

  if (text.startsWith("/addwildcard") || text.startsWith("/delwildcard")) {
    return await handleWildcardCommand(text, chatId, messageId, userId);
  }

  if (text.startsWith("/addvless")) {
    return await handleAddVless(text, chatId, messageId, userId);
  }

  if (text.startsWith("/delvless")) {
    return await handleDelVless(text, chatId, messageId, userId);
  }
  
  if (text === "/delvlessdead") {
  return await handleDelVlessDead(text, chatId, messageId, userId);
}

  if (text === "/listvless") {
    return await handleListVless(chatId, messageId, userId);
  }

  // Deteksi input proxy langsung seperti IP:Port
  if (text.includes(":")) {
    return await checkProxy2ByUserInput(chatId, text, messageId);
  }
}

// Fungsi menangani perintah tambahan
async function handleCommand(command, chatId, messageId) {
  if (command === "/donasi") {
    const messageText = "Silahkan berdonasi karena sedekah itu pahalanya luar biasa.";
    const inlineKeyboard = {
      inline_keyboard: [[{ text: "DONASI", url: "https://sociabuzz.com/mstkkee3/donate" }]],
    };

    return await sendMessage(chatId, messageText, messageId, {
      reply_markup: inlineKeyboard
    });
  }
}


async function getWildcardList() {
  return wildcardDomains;
}

async function getSniList() {
  return sniDomains;
}

async function handleAddVless(text, chatId, messageId, userId, listProxyKv) {
  if (userId !== ALLOWED_USER_ID) {
    return await sendMessage(chatId, "❌ Kamu tidak punya akses.", messageId);
  }

  const [_, path, proxy] = text.trim().split(" ");
  if (!path || !proxy || !/^[a-zA-Z0-9\-]+$/.test(path) || !/^[0-9.]+:\d+$/.test(proxy)) {
    return await sendMessage(chatId, "❌ Format salah. Contoh:\n`/addvless id-pusat 1.2.3.4:443`", messageId);
  }

  const rawData = await listProxyKv.get("data");
  let list = rawData ? JSON.parse(rawData) : [];

  if (list.some(item => item.path === path)) {
    return await sendMessage(chatId, `❌ Path *${path}* sudah ada.`, messageId);
  }

  list.push({ path, proxy });
  await listProxyKv.put("data", JSON.stringify(list));
  return await sendMessage(chatId, `✅ Path *${path}* ditambahkan dengan proxy *${proxy}*.`, messageId);
}

async function handleDelVless(text, chatId, messageId, userId, listProxyKv) {
  if (userId !== ALLOWED_USER_ID) {
    return await sendMessage(chatId, "❌ Kamu tidak punya akses.", messageId);
  }

  const [_, path] = text.trim().split(" ");
  if (!path) {
    return await sendMessage(chatId, "❌ Format salah. Contoh:\n`/delvless id-pusat`", messageId);
  }

  const rawData = await listProxyKv.get("data");
  let list = rawData ? JSON.parse(rawData) : [];

  const newList = list.filter(item => item.path !== path);
  if (newList.length === list.length) {
    return await sendMessage(chatId, `❌ Path *${path}* tidak ditemukan.`, messageId);
  }

  await listProxyKv.put("data", JSON.stringify(newList));
  return await sendMessage(chatId, `✅ Path *${path}* berhasil dihapus.`, messageId);
}

async function handleDelVlessDead(text, chatId, messageId, userId, listProxyKv) {
  if (userId !== ALLOWED_USER_ID) {
    return await sendMessage(chatId, "❌ Kamu tidak punya akses.", messageId);
  }

  const rawData = await listProxyKv.get("data");
  let list = rawData ? JSON.parse(rawData) : [];

  if (list.length === 0) {
    return await sendMessage(chatId, "ℹ️ Tidak ada konfigurasi VLESS.", messageId);
  }

  const aliveList = [];
  const deadList = [];

  for (const item of list) {
    const [host, port] = item.proxy.split(":");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000); // 3 detik timeout

      const response = await fetch(`https://${item.proxy}`, {
        method: "HEAD",
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (response.ok || response.status === 400 || response.status === 403) {
        aliveList.push(item);
      } else {
        deadList.push(item);
      }
    } catch (err) {
      deadList.push(item);
    }
  }

  await listProxyKv.put("data", JSON.stringify(aliveList));

  if (deadList.length === 0) {
    return await sendMessage(chatId, "✅ Tidak ada proxy yang mati. Semua masih hidup.", messageId);
  }

  const msg = deadList.map((item, i) => `❌ *${item.path}* → \`${item.proxy}\``).join("\n");
  return await sendMessage(chatId, `♻️ Dihapus ${deadList.length} proxy mati:\n\n${msg}`, messageId);
}

async function handleListVless(chatId, messageId, userId, listProxyKv) {
  if (userId !== ALLOWED_USER_ID) {
    return await sendMessage(chatId, "❌ Kamu tidak punya akses.", messageId);
  }

  const rawData = await listProxyKv.get("data");
  const list = rawData ? JSON.parse(rawData) : [];

  if (list.length === 0) {
    return await sendMessage(chatId, "ℹ️ Belum ada konfigurasi VLESS.", messageId);
  }

  const msg = list.map((item, i) => `*${i + 1}. ${item.path}* → \`${item.proxy}\``).join("\n");
  return await sendMessage(chatId, `📋 Daftar VLESS:\n\n${msg}`, messageId);
}

async function handleWildcardCommand(text, chatId, messageId, userId) {
  if (userId !== ALLOWED_USER_ID) {
    return await sendMessage(chatId, "❌ Kamu tidak punya akses untuk perintah ini.", messageId);
  }

  if (!BASE_DOMAIN || !CF_ZONE_ID || !CF_API_TOKEN) {
    console.error("❌ Konfigurasi Cloudflare belum lengkap.");
    return await sendMessage(chatId, "❌ Konfigurasi belum lengkap.", messageId);
  }

  const [cmd, rawSub] = text.trim().split(" ");
  if (!rawSub || !/^[a-zA-Z0-9.-]+$/.test(rawSub)) {
    return await sendMessage(chatId, "❌ Format subdomain tidak valid.", messageId);
  }

  const sub = rawSub.endsWith(`.${BASE_DOMAIN}`)
    ? rawSub.replace(`.${BASE_DOMAIN}`, "")
    : rawSub;

  const fullSub = `${sub}.${BASE_DOMAIN}`;
  console.log("📥 Perintah:", cmd, "| Subdomain:", fullSub);

  if (cmd === "/addwildcard") {
    try {
      const dnsBody = {
        type: "CNAME",
        name: fullSub,
        content: rawSub,
        ttl: 1,
        proxied: true,
      };

      console.log("🌐 Menambahkan DNS:", dnsBody);

      const dnsRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dnsBody),
      });

      const dnsData = await dnsRes.json();

      if (!dnsData.success) {
        console.error("❌ Gagal tambah DNS:", dnsData.errors);
        return await sendMessage(chatId, `❌ Gagal tambah DNS: ${dnsData.errors?.[0]?.message || "Unknown error"}`, messageId);
      }

      const routeBody = {
        pattern: `${fullSub}/*`,
        script: WORKER_SCRIPT_NAME,
      };

      console.log("🛠 Menambahkan Route:", routeBody);

      const routeRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/workers/routes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeBody),
      });

      const routeData = await routeRes.json();

      if (!routeData.success) {
        console.error("❌ Gagal tambah Route:", routeData.errors);

        // Rollback DNS
        await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records/${dnsData.result.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${CF_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        return await sendMessage(chatId, `❌ Gagal tambah Worker route: ${routeData.errors?.[0]?.message || "Unknown error"}`, messageId);
      }

      return await sendMessage(chatId, `✅ Subdomain ${fullSub} berhasil ditambahkan.`, messageId);
    } catch (err) {
      console.error("❌ Error saat addwildcard:", err.stack || err);
      return await sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message || "Internal error"}`, messageId);
    }
  }

  if (cmd === "/delwildcard") {
    try {
      const record = await checkDnsRecord(fullSub);
      if (!record) {
        return await sendMessage(chatId, `❌ Subdomain ${fullSub} tidak ditemukan.`, messageId);
      }

      const routesRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/workers/routes`, {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
        },
      });
      const routesData = await routesRes.json();

      if (routesData.success) {
        const matchedRoute = routesData.result.find(r => r.pattern === `${fullSub}/*`);
        if (matchedRoute) {
          const delRouteRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/workers/routes/${matchedRoute.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${CF_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          });
          const delRouteData = await delRouteRes.json();
          if (!delRouteData.success) {
            console.error("❌ Gagal hapus route:", delRouteData.errors);
          }
        }
      } else {
        console.error("❌ Gagal ambil daftar route:", routesData.errors);
      }

      const deleted = await deleteDnsRecord(record.id);

      if (deleted) {
        return await sendMessage(chatId, `✅ Subdomain ${fullSub} berhasil dihapus.`, messageId);
      } else {
        return await sendMessage(chatId, `❌ Gagal hapus subdomain ${fullSub}.`, messageId);
      }
    } catch (err) {
      console.error("❌ Error saat delwildcard:", err.stack || err);
      return await sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message || "Internal error"}`, messageId);
    }
  }

  return await sendMessage(chatId, "❌ Perintah tidak dikenal.", messageId);
}

async function checkDnsRecord(fullSub) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records?name=${fullSub}`, {
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return (data.success && data.result.length > 0) ? data.result[0] : null;
}

async function deleteDnsRecord(recordId) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records/${recordId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!data.success) {
    console.error("❌ Gagal hapus DNS record:", data.errors);
  }
  return data.success;
}

// Fungsi untuk mengirim pesan /start dengan foto
async function sendStartMessage(chatId, replyToMessageId = null) {
  const message = 'Selamat datang di Mstk33e\n\nkirimkan proxy untuk di cek statusnya, format ip:port maksimal 20 proxy, dipisahkan dengan enter contoh 192.168.1.0:443\n192.168.1.1:8443\ndst\n\n/proxy membuat config VLESS dari daftar proxy\n/getlinksub mengambil api link sub\n/proxyrandom membuat vless random\n/donasi silahkan jika ingin donasi\n/listwildcard melihat daftar wildcard\n/allstatus melihat semua status proxy\n\nKhusus Admin\n/addvless menambah vless\n/delvless menghapus vless\n/delvlessdead menghapus vless mati\n/addwildcard menambahkan wildcard\n/delwildcard menghapus wildcard';

  const photoUrl = 'https://raw.githubusercontent.com/parasix/juju/main/JP-Kikuchi-Hina.jpg';

  const payload = {
    chat_id: chatId,
    photo: photoUrl,
    caption: message,
  };

  if (replyToMessageId) {
    payload.reply_to_message_id = replyToMessageId;
  }

  const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

  const responseBody = await response.json();
  return response.ok ? new Response('OK') : new Response(`Error: ${responseBody.description}`, { status: 500 });
}

async function sendProxyList(chatId, replyToMessageId = null) {
  const message = 'Pilih SERVER/ISP untuk membuat config VLESS:';

  const keyboard = {
    inline_keyboard: proxies.map(proxy => [
      { text: proxy.server, callback_data: `vless:${proxy.id}` }
    ])
  };

  return sendMessage(chatId, message, replyToMessageId, {
    reply_markup: keyboard
  });
}


// Fungsi untuk mengirim daftar wildcard
async function sendWildcardList(chatId, replyToMessageId = null) {
  const wildcardList = `\`\`\`WILDCARD
ava.game.naver.com.mstkkee3.dpdns.org\n
support.zoom.us.mstkkee3.dpdns.org\n
cache.netflix.com.mstkkee3.dpdns.org\n
graph.instagram.com.mstkkee3.dpdns.org\n
zaintest.vuclip.com.mstkkee3.dpdns.org\n
edu.ruangguru.com.mstkkee3.dpdns.org\n
api.midtrans.com.mstkkee3.dpdns.org\n
bakrie.ac.id.mstkkee3.dpdns.org\n
blog.webex.com.mstkkee3.dpdns.org\n
investors.spotify.com.mstkkee3.dpdns.org\n
investor.fb.com.mstkkee3.dpdns.org\n
unnes.ac.id.mstkkee3.dpdns.org
\`\`\``;

  return sendMessage(chatId, wildcardList, replyToMessageId, {
    parse_mode: 'Markdown'
  });
}

async function checkProxy(proxy) {
    try {
        const response = await fetch(`https://api.bodong.workers.dev/?key=masbodong&ip=${proxy.host}:${proxy.port}`);
        if (!response.ok) throw new Error("API tidak merespons dengan benar");

        const data = await response.json();
        return data && data.proxyStatus ? data : null;
    } catch (error) {
        console.error(`Gagal memeriksa proxy ${proxy.host}:${proxy.port} -`, error);
        return null;
    }
}

async function sendAllProxyStatus(chatId, replyToMessageId = null) {
  const processingMessage = await sendTemporaryMessage(chatId, `
\`\`\`PROCESSING\nSedang memeriksa semua status proxy, harap tunggu sebentar...\`\`\``, replyToMessageId);

  const proxies = [
  { id: 1, server: '(ID) Rumahweb 🇮🇩', host: '203.194.112.119', port: 8443, path: '/id-rmhwb' },
  { id: 2, server: '(ID) Amazon.com, Inc 🇮🇩', host: '43.218.77.16', port: 443, path: '/id-amz' },
  { id: 3, server: '(ID) PT. Telekomunikasi 🇮🇩', host: '36.95.152.58', port: 12137, path: '/id-tksi' },
  { id: 4, server: '(ID) Pt Pusat Media 🇮🇩', host: '103.6.207.108', port: 8080, path: '/id-pusat' },
  { id: 5, server: '(MY) Kaopu Cloud 🇲🇾', host: '38.60.193.247', port: 13300, path: '/my-kc' },
  { id: 6, server: '(SG) Digitalocean, LLC 🇸🇬', host: '178.128.80.43', port: 443, path: '/sg-do' },
  { id: 7, server: '(SG) Oracle Corporation 🇸🇬', host: '213.35.108.135', port: 12596, path: '/sg-orcl' },
  { id: 8, server: '(SG) Godaddy.com, LLC 🇸🇬', host: '97.74.82.87', port: 45837, path: '/sg-gddy' },
  { id: 9, server: '(SG) Amazon.com, Inc 🇸🇬', host: '13.228.142.218', port: 443, path: '/sg-amz' },
  { id: 10, server: '(SG) Tcloudnet 🇸🇬', host: '154.91.84.10', port: 8443, path: '/sg-tcloud' },
  { id: 11, server: '(SG) AKILE LTD 🇸🇬', host: '185.81.29.113', port: 8080, path: '/sg-akl' },
  { id: 12, server: '(SG) Hetzner Online 🇸🇬', host: '5.223.49.4', port: 2053, path: '/sg-hzr' },
  { id: 13, server: '(SG) Regxa Company🇸🇬', host: '206.206.76.208', port: 2053, path: '/sg-rgxa' },
  { id: 14, server: '(SG) OVH SAS 🇸🇬', host: '51.79.158.58', port: 8443, path: '/sg-ovh' },
  { id: 15, server: '(SG) Melbikomas Uab 🇸🇬', host: '91.192.81.154', port: 2053, path: '/sg-melbi' },
];

  const results = await Promise.allSettled(proxies.map(checkProxy));

  let statusText = `\`\`\`🔍Status:\n`;

  results.forEach((result, index) => {
    const proxy = proxies[index];
    if (result.status === "fulfilled" && result.value) {
      const data = result.value;
      const isActive = data.proxyStatus.includes("ACTIVE");
      const proxyStatus = isActive ? "✅ AKTIF" : "❌ NONAKTIF";

      statusText += `🌐 Proxy  : ${proxy.host}:${proxy.port}\n`;
      statusText += `📂 Path   : ${proxy.path}\n`;
      statusText += `📡 ISP    : ${data.isp || "-"} ${data.flag || ""}\n`;
      statusText += `🌍 Negara : ${data.country || ""}\n`;
      statusText += `🏙️ Lokasi : ${data.city || data.region || "-"}\n`;
      statusText += `🛡️ Status : ${proxyStatus}\n`;
      statusText += `⏱️ Latency: ${data.delay || "N/A"}\n\n`;
    } else {
      statusText += `❌ Tidak dapat memeriksa status proxy ${proxy.host}:${proxy.port}.\n\n`;
    }
  });

  statusText += `\`\`\``;

  return editMessageText(chatId, processingMessage.message_id, statusText, { parse_mode: "Markdown" });
}

// Fungsi untuk menghasilkan UUID random
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function generateVlessConfig(chatId, proxyId, messageId) {
  const selectedProxy = proxies.find(p => p.id == proxyId);
  if (!selectedProxy) {
    return sendMessage(chatId, '❌ Proxy tidak ditemukan.', {}, messageId);
  }

  const message = `
\`\`\`METODE\nSILAHKAN PILIH METODE INJECT:
\`\`\`
  `;
  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Tidak', callback_data: `method:no:${proxyId}` },
        { text: 'Wildcard', callback_data: `method:wc:${proxyId}` }
      ],
      [{ text: 'SNI/TLS', callback_data: `method:sni:${proxyId}` }]
    ]
  };

  return await editMessageText(chatId, messageId, message, {
    reply_markup: keyboard,
    parse_mode: "Markdown"
  });
}

async function handleMethodSelection(chatId, method, proxyId, messageId) {
  let selectedProxy;

  // Jika user pilih "random", ambil acak
  if (proxyId === 'random') {
    selectedProxy = proxies[Math.floor(Math.random() * proxies.length)];
  } else {
    selectedProxy = proxies.find(p => p.id == proxyId);
  }

  if (!selectedProxy) {
    return await sendMessage(chatId, '❌ Proxy tidak ditemukan.', {}, messageId);
  }

  const selectedProxyId = selectedProxy.id;

  if (method === 'no') {
    return await generateConfigNoWS(chatId, proxyId, messageId);
  }

  const domains = [
    'ava.game.naver.com', 'support.zoom.us', 'cache.netflix.com', 'graph.instagram.com',
    'zaintest.vuclip.com', 'edu.ruangguru.com', 'api.midtrans.com', 'bakrie.ac.id',
    'blog.webex.com', 'investors.spotify.com', 'investor.fb.com', 'unnes.ac.id'
  ];

  const keyboard = {
    inline_keyboard: domains.map(domain => [{
      text: domain,
      callback_data: `${method === 'wc' ? 'wildcard' : 'sni'}:${domain}:${selectedProxyId}`
    }])
  };

  const label = '🔹Pilih Salah Satu Subdomain';

  return await editMessageText(chatId, messageId, label, {
    parse_mode: "Markdown",
    reply_markup: keyboard
  });
}


async function generateConfigNoWS(chatId, proxyId, messageId) {
  try {
    // Pilih proxy manual jika ada ID, jika tidak pakai random
    const selectedProxy = proxyId
      ? proxies.find((p) => p.id == proxyId)
      : proxies[Math.floor(Math.random() * proxies.length)];

    if (!selectedProxy) {
      return await sendMessage(chatId, '❌ Proxy tidak ditemukan.');
    }

    // Tampilkan status RUNNING (jika ada messageId)
    if (messageId) {
      await editMessageText(chatId, messageId, "```RUNNING\nSilahkan menunggu, sedang memproses...\n```", {
        parse_mode: "MarkdownV2",
        reply_markup: { inline_keyboard: [] }
      });

      await new Promise(resolve => setTimeout(resolve, 3000));
      await deleteMessage(chatId, messageId);
    }

    // Siapkan data
    const uuid = generateUUID();
    const bugServer = `${servervless}`;

    // VLESS URL (network: tcp)
    const vlessRawUrl = `vless://${uuid}@${bugServer}:443?encryption=none&security=tls&sni=${bugServer}&type=ws&host=${bugServer}&path=${selectedProxy.path}#${selectedProxy.server}`;

    // QR Code URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(vlessRawUrl)}`;

    // Kirim QR Code
    await sendPhoto(chatId, qrUrl, {
      caption: '𝗦𝗰𝗮𝗻 𝗱𝗶 𝗮𝗽𝗽 𝘃2𝗿𝗮𝘆𝗡𝗚, 𝗚𝗮𝘁𝗰𝗵𝗮𝗡𝗚, 𝗱𝘀𝘁',
      parse_mode: 'Markdown'
    });

    // Format konfigurasi
    const config = `
𝗞𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘀𝗶 𝘃𝗹𝗲𝘀𝘀 𝗮𝗻𝗱𝗮 𝗯𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗱𝗶𝗯𝘂𝗮𝘁  
𝗦𝗲𝗿𝘃𝗲𝗿 : \`${selectedProxy.server}\`
𝗣𝗮𝘁𝗵 : \`${selectedProxy.path}\`
𝗠𝗲𝘁𝗼𝗱𝗲 : 𝗡𝗢

\`\`\`VLESS\n${vlessRawUrl}\`\`\`

\`\`\`yaml
proxies:
- name: ${selectedProxy.server}
  server: ${bugServer}
  port: 443
  type: vless
  uuid: ${uuid}
  cipher: auto
  tls: true
  skip-cert-verify: true
  network: ws
  servername: ${bugServer}
  ws-opts:
    path: ${selectedProxy.path}
    headers:
      Host: ${bugServer}
  udp: true\`\`\`

🛠️ *Cara Penggunaan:*  
🔹 *VLESS:* Salin config dan gunakan di V2RayNG, Napsternet, dll.  
🔹 *CLASH:* Gunakan config ini di BFR, CFM, CMFA, Clash Meta, Stash, dll.  
🔹 *Optimasi:* Jika koneksi lemot, coba ganti SERVER/ISP.  

💡 *Tips & Tricks:*  
✅ Gunakan server terdekat untuk kecepatan maksimal  
✅ Pastikan *mode TLS aktif* agar lebih aman.  

╭━━━━━━━━━━━━━━━━━━━━━╮  
┃  📞 *Need Help?* @Mstk3e !  
┃  🚀 *Nikmati internet lebih cepat & aman!*  
┃  🌐 *Join komunitas:* [@vless_bodong]  
╰━━━━━━━━━━━━━━━━━━━━━╯
`;

    return await sendMessage(chatId, config, {
      parse_mode: "Markdown"
    });

  } catch (error) {
    console.error("generateConfigNoWS ERROR:", error);
    return await sendMessage(chatId, `❌ Gagal membuat konfigurasi:\n\`\`\`\n${error.message}\n\`\`\``, {
      parse_mode: "Markdown"
    });
  }
}


async function generateConfigWithWildcard(chatId, wildcard, proxyId, messageId) {
  try {
    let selectedProxy;

    // Random jika proxyId === 'random'
    if (proxyId === 'random') {
      selectedProxy = proxies[Math.floor(Math.random() * proxies.length)];
    } else {
      selectedProxy = proxies.find(p => p.id == proxyId);
    }

    if (!selectedProxy) {
      return sendMessage(chatId, '❌ Proxy tidak ditemukan.');
    }

    const uuid = generateUUID();
    const bugServer = `${wildcard}.${servervless}`;
    const vlessRawUrl = `vless://${uuid}@${wildcard}:443?encryption=none&security=tls&sni=${bugServer}&type=ws&host=${bugServer}&path=${selectedProxy.path}#${selectedProxy.server}`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(vlessRawUrl)}`;

    await sendPhoto(chatId, qrUrl, {
      caption: '𝗦𝗰𝗮𝗻 𝗱𝗶 𝗮𝗽𝗽 𝘃2𝗿𝗮𝘆𝗡𝗚, 𝗚𝗮𝘁𝗰𝗵𝗮𝗡𝗚, 𝗱𝘀𝘁',
      parse_mode: 'Markdown'
    });

    const config = `
𝗞𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘀𝗶 𝘃𝗹𝗲𝘀𝘀 𝗮𝗻𝗱𝗮 𝗯𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗱𝗶𝗯𝘂𝗮𝘁  
𝗦𝗲𝗿𝘃𝗲𝗿 : \`${selectedProxy.server}\`
𝗣𝗮𝘁𝗵 : \`${selectedProxy.path}\`
𝗠𝗲𝘁𝗼𝗱𝗲 : 𝘄𝗶𝗹𝗱𝗰𝗮𝗿𝗱
𝗦𝘂𝗯𝗱𝗼𝗺𝗮𝗶𝗻 : \`${wildcard}\`

\`\`\`VLESS\n${vlessRawUrl}\`\`\`

\`\`\`yaml
proxies:
- name: ${selectedProxy.server}
  server: ${wildcard}
  port: 443
  type: vless
  uuid: ${uuid}
  cipher: auto
  tls: true
  skip-cert-verify: true
  network: ws
  servername: ${bugServer}
  ws-opts:
    path: ${selectedProxy.path}
    headers:
      Host: ${bugServer}
  udp: true\`\`\`

🛠️ *Cara Penggunaan:*  
🔹 *VLESS:* Salin config dan gunakan di V2RayNG, Napsternet, dll.  
🔹 *CLASH:* Gunakan config ini di BFR, CFM, CMFA, Clash Meta, Stash, dll.  
🔹 *Optimasi:* Jika koneksi lemot, coba ganti SERVER/ISP.  

💡 *Tips & Tricks:*  
✅ Gunakan server terdekat untuk kecepatan maksimal  
✅ Pastikan *mode TLS aktif* agar lebih aman.  

╭━━━━━━━━━━━━━━━━━━━━━╮  
┃  📞 *Need Help?* @Mstk3e !  
┃  🚀 *Nikmati internet lebih cepat & aman!*  
┃  🌐 *Join komunitas:* [@vless_bodong]  
╰━━━━━━━━━━━━━━━━━━━━━╯  
`;

    return await sendMessage(chatId, config, { parse_mode: "Markdown" });

  } catch (error) {
    console.error("generateConfigWithWildcard ERROR:", error);
    return await sendMessage(chatId, `❌ Gagal membuat konfigurasi:\n\`\`\`\n${error.message}\n\`\`\``, {
      parse_mode: "Markdown"
    });
  }
}

async function generateConfigWithSni(chatId, sni, proxyId, messageId) {
  try {
    const selectedProxy = proxyId
      ? proxies.find((p) => p.id == proxyId)
      : proxies[Math.floor(Math.random() * proxies.length)];

    if (!selectedProxy) {
      return sendMessage(chatId, '❌ Proxy tidak ditemukan.');
    }

    const uuid = generateUUID();
    const bugServer = `${sni}.${servervless}`;
    const vlessRawUrl = `vless://${uuid}@${servervless}:443?encryption=none&security=tls&sni=${bugServer}&type=ws&host=${bugServer}&path=${selectedProxy.path}#${selectedProxy.server}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(vlessRawUrl)}`;

    await sendPhoto(chatId, qrUrl, {
      caption: '𝗦𝗰𝗮𝗻 𝗱𝗶 𝗮𝗽𝗽 𝘃2𝗿𝗮𝘆𝗡𝗚, 𝗚𝗮𝘁𝗰𝗵𝗮𝗡𝗚, 𝗱𝘀𝘁',
      parse_mode: 'Markdown'
    });

    const config = `
𝗞𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘀𝗶 𝘃𝗹𝗲𝘀𝘀 𝗮𝗻𝗱𝗮 𝗯𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗱𝗶𝗯𝘂𝗮𝘁  
𝗦𝗲𝗿𝘃𝗲𝗿 : \`${selectedProxy.server}\`  
𝗣𝗮𝘁𝗵 : \`${selectedProxy.path}\`  
𝗠𝗲𝘁𝗼𝗱𝗲 : 𝗦𝗡𝗜 / 𝗧𝗟𝗦  
𝗦𝘂𝗯𝗱𝗼𝗺𝗮𝗶𝗻 : \`${sni}\`

\`\`\`VLESS\n${vlessRawUrl}\`\`\`

\`\`\`yaml
proxies:
- name: ${selectedProxy.server}
  server: ${servervless}
  port: 443
  type: vless
  uuid: ${uuid}
  cipher: auto
  tls: true
  skip-cert-verify: true
  network: ws
  servername: ${bugServer}
  ws-opts:
    path: ${selectedProxy.path}
    headers:
      Host: ${bugServer}
  udp: true\`\`\`

🛠️ *Cara Penggunaan:*  
🔹 *VLESS:* Salin config dan gunakan di V2RayNG, Napsternet, dll.  
🔹 *CLASH:* Gunakan config ini di BFR, CFM, CMFA, Clash Meta, Stash, dll.  
🔹 *Optimasi:* Jika koneksi lemot, coba ganti SERVER/ISP.  

💡 *Tips & Tricks:*  
✅ Gunakan server terdekat untuk kecepatan maksimal  
✅ Pastikan *mode TLS aktif* agar lebih aman.  

╭━━━━━━━━━━━━━━━━━━━━━╮  
┃  📞 *Need Help?* @Mstk3e !  
┃  🚀 *Nikmati internet lebih cepat & aman!*  
┃  🌐 *Join komunitas:* [@vless_bodong]  
╰━━━━━━━━━━━━━━━━━━━━━╯
`;

    return await sendMessage(chatId, config, { parse_mode: "Markdown" });

  } catch (error) {
    console.error("generateConfigWithSni ERROR:", error);
    return await sendMessage(chatId, `❌ Gagal membuat konfigurasi:\n\`\`\`\n${error.message}\n\`\`\``, {
      parse_mode: "Markdown"
    });
  }
}

async function sendGetLinkSubMenu(chatId, replyToMessageId = null) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: "VLESS", callback_data: "getlinksub:type:vless" },
        { text: "Clash", callback_data: "getlinksub:type:clash" }
      ]
    ]
  };

  await sendMessage(chatId, "Silakan pilih tipe konfigurasi:", replyToMessageId, {
    reply_markup: keyboard,
  });
}

async function handleGetLinkSubCallback(data, chatId, messageId) {
  // data format: getlinksub:<step>:<value>:<value2>...
  const parts = data.split(":");

  if (parts.length < 2) {
    await sendMessage(chatId, "❌ Data callback tidak valid.");
    return;
  }

  const step = parts[1];

  if (step === "type") {
    // user pilih tipe config, misal vless
    const configType = parts[2];

    // Kirim pilihan metode inject
    const keyboard = {
  inline_keyboard: [
    [
      { text: "Tidak", callback_data: `getlinksub:method:no:${configType}` },
      { text: "Wildcard", callback_data: `getlinksub:method:wildcard:${configType}` }
    ],
    [
      { text: "SNI/TLS", callback_data: `getlinksub:method:sni:${configType}` }
    ]
  ]
};

    await editMessageText(chatId, messageId, "Silahkan pilih metode inject:", { reply_markup: keyboard });
  } 
  else if (step === "method") {
    // user pilih metode inject
    const method = parts[2];  // no, wildcard, sni
    const configType = parts[3];

    if (method === "wildcard") {
      // Kirim daftar wildcard (misal dari fungsi sendWildcardList, tapi disini buat keyboard)
      const wildcards = await getWildcardList(); // kamu harus buat fungsi ini supaya return array daftar wildcard
      if (wildcards.length === 0) {
        await editMessageText(chatId, messageId, "Tidak ada wildcard yang tersedia.");
        return;
      }

      const keyboard = wildcards.map(wc => [
        { text: wc, callback_data: `getlinksub:subdomain:${method}:${configType}:${wc}` }
      ]);

      await editMessageText(chatId, messageId, "Pilih salah satu subdomain:", { reply_markup: { inline_keyboard: keyboard } });
    } 
    else if (method === "sni") {
      // Kirim daftar SNI
      const sni = await getSniList(); // kamu juga harus buat fungsi ini, return array daftar SNI
      if (sni.length === 0) {
        await editMessageText(chatId, messageId, "Tidak ada SNI yang tersedia.");
        return;
      }

      const keyboard = sni.map(sni => [
        { text: sni, callback_data: `getlinksub:subdomain:${method}:${configType}:${sni}` }
      ]);

      await editMessageText(chatId, messageId, "Pilih salah satu subdomain:", { reply_markup: { inline_keyboard: keyboard } });
    } 
    else if (method === "no") {
  await editMessageText(chatId, messageId, `
\`\`\`RUNNING\nMohon tunggu, sedang memproses konfigurasi...\`\`\``, {
    parse_mode: "Markdown"
  });

  // JEDA 3 DETIK
  await new Promise(resolve => setTimeout(resolve, 3000));

  const link = `https://mstkkee3.dpdns.org/sub/${configType}/?method=${method}&bug=${servervless}`;
  const detail = `𝗔𝗻𝗱𝗮 𝗺𝗲𝗺𝗶𝗹𝗶𝗵 𝗸𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘀𝗶\n𝗦𝘂𝗯 : ${configType}\n𝗠𝗲𝘁𝗼𝗱𝗲 : ${method}\n𝗗𝗼𝗺𝗮𝗶𝗻 : ${servervless}\n\n𝗟𝗶𝗻𝗸 : ${link}`;

  await editMessageText(chatId, messageId, detail, { parse_mode: "Markdown" });
   }
  } 
  else if (step === "subdomain") {
  const method = parts[2];
  const configType = parts[3];
  const subdomain = parts[4];

  await editMessageText(chatId, messageId, `
\`\`\`RUNNING\nMohon tunggu, sedang memproses konfigurasi...\`\`\``, {
    parse_mode: "Markdown"
  });

  // JEDA 3 DETIK
  await new Promise(resolve => setTimeout(resolve, 3000));

  const link = `https://mstkkee3.dpdns.org/sub/${configType}/?method=${method}&bug=${encodeURIComponent(subdomain)}`;
  const detail = `𝗔𝗻𝗱𝗮 𝗺𝗲𝗺𝗶𝗹𝗶𝗵 𝗸𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘀𝗶\n𝗦𝘂𝗯 : ${configType}\n𝗠𝗲𝘁𝗼𝗱𝗲 : ${method}\n𝗦𝘂𝗯𝗱𝗼𝗺𝗮𝗶𝗻 : ${subdomain}\n\n𝗟𝗶𝗻𝗸 : ${link}`;

  await editMessageText(chatId, messageId, detail, { parse_mode: "Markdown" });
} 
  else {
    await sendMessage(chatId, "❌ Step tidak dikenal.");
  }
}

async function sendTemporaryMessage(chatId, text, replyToMessageId = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  };

  if (replyToMessageId) {
    payload.reply_to_message_id = replyToMessageId;
  }

  const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

  const responseBody = await response.json();
  if (response.ok) {
    return responseBody.result; // Kembalikan pesan yang dikirim
  } else {
    console.error(`Error sending temporary message: ${responseBody.description}`);
    return null;
  }
}

async function deleteMessage(chatId, messageId) {
  const response = await fetch(`${TELEGRAM_API_URL}/deleteMessage`, {
    method: 'POST',
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
    headers: { 'Content-Type': 'application/json' },
  });

  const responseBody = await response.json();
  if (!response.ok) {
    console.error(`Error deleting message: ${responseBody.description}`);
  }
}
// Fungsi untuk mengirim pesan ke Telegram
async function sendMessage(chatId, text, replyToMessageId = null, options = {}) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: options.parse_mode || 'Markdown',
    ...(replyToMessageId && { reply_to_message_id: replyToMessageId }),
    ...(options.reply_markup && { reply_markup: options.reply_markup })
  };

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("❌ Gagal kirim pesan:", {
        status: response.status,
        statusText: response.statusText,
        responseBody
      });
    }

    return response.ok ? responseBody.result : null;
  } catch (err) {
    console.error("❌ Error jaringan saat kirim pesan:", err);
    return null;
  }
}

async function editMessageText(chatId, messageId, text, options = {}) {
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    ...options,
  };

  return fetch(`${TELEGRAM_API_URL}/editMessageText`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
}

async function sendPhoto(chatId, photoUrl, options = {}) {
  const token = "7804911751:AAHTWMXn7KMK5sDrmAUmz-eIpJsp_cSI18M"; // ganti sesuai nama variabel token kamu
  const url = `https://api.telegram.org/bot${token}/sendPhoto`;

  const body = {
    chat_id: chatId,
    photo: photoUrl,
    ...options
  };

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

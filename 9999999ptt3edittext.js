const servervless = 'jkrstvn.dpdns.org';
const userSession = {};
const userRateLimit = {};
const RATE_LIMIT_SECONDS = 10;

// Daftar proxy yang tersedia
const proxies = [
  { id: 1, server: '(SG) Digitalocean, LLC 🇸🇬', host: '178.128.80.43', port: 443, path: '/sg-do' },
  { id: 2, server: '(SG) Oracle Corporation 🇸🇬', host: '213.35.108.135', port: 12596, path: '/sg-orcl' },
  { id: 3, server: '(SG) Godaddy.com, LLC 🇸🇬', host: '97.74.82.87', port: 45837, path: '/sg-gddy' },
  { id: 4, server: '(SG) Amazon.com, Inc 🇸🇬', host: '13.228.142.218', port: 443, path: '/sg-amz' },
  { id: 5, server: '(SG) Tcloudnet 🇸🇬', host: '154.91.84.10', port: 8443, path: '/sg-tcloud' },
  { id: 6, server: '(SG) AKILE LTD 🇸🇬', host: '185.81.29.113', port: 8080, path: '/sg-akl' },
  { id: 7, server: '(SG) LEASEWEB SINGAPORE 🇸🇬', host: '167.253.158.63', port: 2053, path: '/sg-lswb' },
  { id: 8, server: '(SG) Hetzner Online 🇸🇬', host: '5.223.49.4', port: 2053, path: '/sg-hzr' },
  { id: 9, server: '(SG) Regxa Company🇸🇬', host: '206.206.76.208', port: 2053, path: '/sg-rgxa' },
  { id: 10, server: '(SG) OVH SAS 🇸🇬', host: '51.79.158.58', port: 8443, path: '/sg-ovh' },
  { id: 11, server: '(SG) Melbikomas Uab 🇸🇬', host: '91.192.81.154', port: 2053, path: '/sg-melbi' },
  { id: 12, server: '(ID) Pt Pusat Media 🇮🇩', host: '103.6.207.108', port: 8080, path: '/id-pusat' },
  { id: 13, server: '(ID) PT. Telekomunikasi 🇮🇩', host: '36.95.152.58', port: 12137, path: '/id-tksi' },
  { id: 14, server: '(ID) Amazon.com, Inc 🇮🇩', host: '43.218.77.16', port: 443, path: '/id-amz' },
  { id: 15, server: '(ID) Rumahweb 🇮🇩', host: '203.194.112.119', port: 8443, path: '/id-rmhwb' },
];
  
// Token bot Telegram
const TELEGRAM_BOT_TOKEN = '7869958204:AAGJf4x0XQ7CX-vOQDS52QuucLj_md-EzFY';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Webhook handler
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});


async function checkProxy(proxy) {
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
async function checkProxyByUserInput(chatId, userInput, messageId) {
  // Memisahkan input berdasarkan spasi atau enter
  const proxies = userInput.split(/\s+|\n+/).map(proxy => proxy.trim()).filter(Boolean);

  // Batasan maksimal proxy yang bisa diproses
  const MAX_PROXIES = 20;
  if (proxies.length > MAX_PROXIES) {
    return sendMessage(chatId, `❌ Terlalu banyak proxy. Maksimal ${MAX_PROXIES} proxy per permintaan.`, null, messageId);
  }

  if (proxies.length === 0 || proxies.some(proxy => !proxy.includes(':'))) {
    return sendMessage(chatId, "❌ Format salah. Harap kirim dalam format ip:port, contoh:\n`139.59.104.29:443`\n`192.168.1.1:8080`", null, messageId);
  }

  // Kirim pesan sementara bahwa bot sedang memeriksa status proxy
  const processingMessage = await sendTemporaryMessage(chatId, `
\`\`\`PROCESSING\nSedang memeriksa status proxy, mohon tunggu...\`\`\``, messageId);

  let allStatusText = `\`\`\`🔍Status:\n`;

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

  return editMessageText(chatId, processingMessage.message_id, allStatusText, {
    parse_mode: "MarkdownV2"
  });
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === "/webhook") {
    try {
      const update = await request.json();
      console.log(">> UPDATE:", JSON.stringify(update, null, 2));

      if (update.message) {
        const chatId = update.message.chat.id;
        const messageId = update.message.message_id;
        const text = update.message.text?.trim();
        const userId = update.message.from.id;

        await handleMessage(text, chatId, messageId, userId);
      }

      if (update.callback_query) {
        const chatId = update.callback_query.message.chat.id;
        const messageId = update.callback_query.message.message_id;
        const data = update.callback_query.data;
        const parts = data.split(':');
        const action = parts[0];

        switch (action) {
          case 'vless': {
            const proxyId = parts[1];
            if (proxyId) {
              await generateVlessConfig(chatId, proxyId, messageId);
            }
            break;
          }

          case 'method': {
            const method = parts[1];
            const proxyId = parts[2];
            await handleMethodSelection(chatId, method, proxyId, messageId);
            break;
          }

          case 'no': {
            const proxyId = parts[2];
            const selectedProxy = proxies.find(p => p.id == proxyId);
            if (!selectedProxy) {
              await sendMessage(chatId, "❌ Proxy tidak ditemukan. Pilih proxy yang tersedia.", {}, messageId);
              break;
            }
            await generateConfigNoWS(chatId, proxyId, messageId);
            break;
          }

          case 'wildcard': {
            const wildcard = parts[1];
            const proxyId = parts[2];

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

          case 'sni': {
            const sni = parts[1];
            const proxyId = parts[2];

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

        return new Response('OK');
      }

      return new Response('OK');
    } catch (err) {
      console.error("Webhook Error:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
}

async function handleMessage(text, chatId, messageId, userId) {
      if (text === '/start') return await sendStartMessage(chatId, messageId);
      if (text === '/proxy') return await sendProxyList(chatId, messageId);
      if (text === '/listwildcard') return await sendWildcardList(chatId, messageId);
      if (text === '/listsni') return await sendSniList(chatId, messageId);
      if (text === '/allstatus') return await sendAllProxyStatus(chatId, messageId);
      if (text === "/donasi") return await handleCommand("/donasi", chatId, messageId);

      // Cek status proxy berdasarkan IP:Port
      if (text.includes(':')) {
        return await checkProxyByUserInput(chatId, text, messageId);
      }
    }

async function handleCommand(command, chatId, messageId) {
  if (command === "/donasi") {
    const messageText = "Silahkan berdonasi karena sedekah itu pahalanya luar biasa.";
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [[{ text: "DONASI", url: "https://sociabuzz.com/mstkkee3/donate" }]],
      },
    };

    return await sendMessage(chatId, messageText, inlineKeyboard, messageId);
  }
}

// Fungsi untuk mengirim pesan /start dengan foto
async function sendStartMessage(chatId, messageId) {
  const message = 'Selamat datang di mstkkee3\n\nkirimkan proxy untuk di cek statusnya, format ip:port maksimal 20 proxy, dipisahkan dengan enter contoh 192.168.1.0:443\n192.168.1.1:8443\ndst\n\n/proxy membuat config VLESS dari daftar proxy\n/listwildcard melihat daftar wildcard\n/allstatus melihat semua status proxy\n/donasi silahkan jika ingin donasi';

  const photoUrl = 'https://raw.githubusercontent.com/parasix/juju/main/JP-Kikuchi-Hina.jpg'; // Ganti dengan URL gambar Anda

  const payload = {
    chat_id: chatId,
    photo: photoUrl,
    caption: message,
    parse_mode: 'Markdown',
  };

  if (messageId) {
    payload.reply_to_message_id = messageId;
  }

  const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

  const responseBody = await response.json();
  return response.ok
    ? new Response('OK')
    : new Response(`Error: ${responseBody.description}`, { status: 500 });
}

async function sendProxyList(chatId, messageId = null) {
  const message = 'Pilih SERVER/ISP untuk membuat config VLESS:';

  const keyboard = {
    inline_keyboard: proxies.map(proxy => [
      { text: proxy.server, callback_data: `vless:${proxy.id}` }
    ])
  };

  return sendMessage(chatId, message, { reply_markup: keyboard }, messageId);
}


// Fungsi untuk mengirim daftar wildcard
async function sendWildcardList(chatId, messageId = null) {
  const wildcardList = `\`\`\`WILDCARD
ava.game.naver.com.mstkkee3.biz.id\n
support.zoom.us.mstkkee3.biz.id\n
cache.netflix.com.mstkkee3.biz.id\n
graph.instagram.com.mstkkee3.biz.id\n
zaintest.vuclip.com.mstkkee3.biz.id\n
edu.ruangguru.com.mstkkee3.biz.id\n
api.midtrans.com.mstkkee3.biz.id\n
bakrie.ac.id.mstkkee3.biz.id\n
blog.webex.com.mstkkee3.biz.id\n
investors.spotify.com.mstkkee3.biz.id\n
investor.fb.com.mstkkee3.biz.id\n
help.viu.com.mstkkee3.biz.id
\`\`\``;

  return sendMessage(chatId, wildcardList, { parse_mode: 'Markdown' }, messageId);
}

async function sendSniList(chatId, messageId = null) {
  const sniList = `\`\`\`SNI
ava.game.naver.com.mstkkee3.biz.id\n
support.zoom.us.mstkkee3.biz.id\n
cache.netflix.com.mstkkee3.biz.id\n
graph.instagram.com.mstkkee3.biz.id\n
zaintest.vuclip.com.mstkkee3.biz.id\n
edu.ruangguru.com.mstkkee3.biz.id\n
api.midtrans.com.mstkkee3.biz.id\n
bakrie.ac.id.mstkkee3.biz.id\n
blog.webex.com.mstkkee3.biz.id\n
investors.spotify.com.mstkkee3.biz.id\n
investor.fb.com.mstkkee3.biz.id\n
help.viu.com.mstkkee3.biz.id
\`\`\``;

  return sendMessage(chatId, sniList, { parse_mode: 'Markdown' }, messageId);
}


async function checkProxy2(proxy) {
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

async function sendAllProxyStatus(chatId, messageId = null) {
  const processingMessage = await sendTemporaryMessage(chatId, `
\`\`\`PROCESSING\nSedang memeriksa semua status proxy, harap tunggu sebentar...\`\`\``, messageId);

  const proxies = [
    { id: 1, server: '(SG) Digitalocean, LLC 🇸🇬', host: '178.128.80.43', port: 443, path: '/sg-do' },
    { id: 2, server: '(SG) Oracle Corporation 🇸🇬', host: '213.35.108.135', port: 12596, path: '/sg-orcl' },
    { id: 3, server: '(SG) Godaddy.com, LLC 🇸🇬', host: '97.74.82.87', port: 45837, path: '/sg-gddy' },
    { id: 4, server: '(SG) Amazon.com, Inc 🇸🇬', host: '13.228.142.218', port: 443, path: '/sg-amz' },
    { id: 5, server: '(SG) Tcloudnet 🇸🇬', host: '154.91.84.10', port: 8443, path: '/sg-tcloud' },
    { id: 6, server: '(SG) AKILE LTD 🇸🇬', host: '185.81.29.113', port: 8080, path: '/sg-akl' },
    { id: 7, server: '(SG) LEASEWEB SINGAPORE 🇸🇬', host: '167.253.158.63', port: 2053, path: '/sg-lswb' },
    { id: 8, server: '(SG) Hetzner Online 🇸🇬', host: '5.223.49.4', port: 2053, path: '/sg-hzr' },
    { id: 9, server: '(SG) Regxa Company🇸🇬', host: '206.206.76.208', port: 2053, path: '/sg-rgxa' },
    { id: 10, server: '(SG) OVH SAS 🇸🇬', host: '51.79.158.58', port: 8443, path: '/sg-ovh' },
    { id: 11, server: '(SG) Melbikomas Uab 🇸🇬', host: '91.192.81.154', port: 2053, path: '/sg-melbi' },
    { id: 12, server: '(ID) Pt Pusat Media 🇮🇩', host: '103.6.207.108', port: 8080, path: '/id-pusat' },
    { id: 13, server: '(ID) PT. Telekomunikasi 🇮🇩', host: '36.95.152.58', port: 12137, path: '/id-tksi' },
    { id: 14, server: '(ID) Amazon.com, Inc 🇮🇩', host: '43.218.77.16', port: 443, path: '/id-amz' },
    { id: 15, server: '(ID) Rumahweb 🇮🇩', host: '203.194.112.119', port: 8443, path: '/id-rmhwb' },
  ];

  const results = await Promise.allSettled(proxies.map(checkProxy2));

  let statusText = `\`\`\`🔍Status:\n`;

  results.forEach((result, index) => {
    const proxy = proxies[index];
    if (result.status === "fulfilled" && result.value) {
      const data = result.value;
      const isActive = data.proxyStatus.includes("ACTIVE");
      const proxyStatus = isActive ? "✅ AKTIF" : "❌ NONAKTIF";

      statusText += `🌐 Proxy  : ${proxy.host}:${proxy.port}\n`;
      statusText += `📂 Path   : ${proxy.path}\n`;
      statusText += `📡 ISP    : ${data.isp || "-"} ${data.flag}\n`;
      statusText += `🌍 Negara : ${data.country || ""}\n`;
      statusText += `🏙️ Lokasi : ${data.city || data.region || "-"}\n`;
      statusText += `🛡️ Status : ${proxyStatus}\n`;
      statusText += `⏱️ Latency: ${data.delay || "N/A"}\n\n`;
    } else {
      statusText += `❌ Tidak dapat memeriksa status proxy ${proxy.host}:${proxy.port}.\n\n`;
    }
  });

  statusText += `\`\`\``;

  // Ganti dengan editMessageText, bukan kirim baru
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
  const selectedProxy = proxies.find(p => p.id == proxyId);
  if (!selectedProxy) {
    return await sendMessage(chatId, '❌ Proxy tidak ditemukan.', {}, messageId);
  }

  if (method === 'no') {
    return await generateConfigNoWS(chatId, proxyId, messageId);
  } else if (method === 'wc') {
    // Tampilkan daftar wildcard
    const wildcardList = '🔹 *Pilih Salah Satu Subdomain*';
    const keyboard = {
      inline_keyboard: [
        [{ text: 'ava.game.naver.com', callback_data: `wildcard:ava.game.naver.com:${proxyId}` }],
        [{ text: 'support.zoom.us', callback_data: `wildcard:support.zoom.us:${proxyId}` }],
        [{ text: 'cache.netflix.com', callback_data: `wildcard:cache.netflix.com:${proxyId}` }],
        [{ text: 'graph.instagram.com', callback_data: `wildcard:graph.instagram.com:${proxyId}` }],
        [{ text: 'zaintest.vuclip.com', callback_data: `wildcard:zaintest.vuclip.com:${proxyId}` }],
        [{ text: 'edu.ruangguru.com', callback_data: `wildcard:edu.ruangguru.com:${proxyId}` }],
        [{ text: 'api.midtrans.com', callback_data: `wildcard:api.midtrans.com:${proxyId}` }],
        [{ text: 'bakrie.ac.id', callback_data: `wildcard:bakrie.ac.id:${proxyId}` }],
        [{ text: 'blog.webex.com', callback_data: `wildcard:blog.webex.com:${proxyId}` }],
        [{ text: 'investors.spotify.com', callback_data: `wildcard:investors.spotify.com:${proxyId}` }],
        [{ text: 'investor.fb.com', callback_data: `wildcard:investor.fb.com:${proxyId}` }],
        [{ text: 'help.viu.com', callback_data: `wildcard:help.viu.com:${proxyId}` }],
      ],
    };

    return await editMessageText(chatId, messageId, wildcardList, {
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } else if (method === 'sni') {
    // Tampilkan daftar SNI
    const sniList = '🔹 *Pilih Salah Satu Subdomain:*';
    const keyboard = {
      inline_keyboard: [
        [{ text: 'ava.game.naver.com', callback_data: `sni:ava.game.naver.com:${proxyId}` }],
        [{ text: 'support.zoom.us', callback_data: `sni:support.zoom.us:${proxyId}` }],
        [{ text: 'cache.netflix.com', callback_data: `sni:cache.netflix.com:${proxyId}` }],
        [{ text: 'graph.instagram.com', callback_data: `sni:graph.instagram.com:${proxyId}` }],
        [{ text: 'zaintest.vuclip.com', callback_data: `sni:zaintest.vuclip.com:${proxyId}` }],
        [{ text: 'edu.ruangguru.com', callback_data: `sni:edu.ruangguru.com:${proxyId}` }],
        [{ text: 'api.midtrans.com', callback_data: `sni:api.midtrans.com:${proxyId}` }],
        [{ text: 'bakrie.ac.id', callback_data: `sni:bakrie.ac.id:${proxyId}` }],
        [{ text: 'blog.webex.com', callback_data: `sni:blog.webex.com:${proxyId}` }],
        [{ text: 'investors.spotify.com', callback_data: `sni:investors.spotify.com:${proxyId}` }],
        [{ text: 'investor.fb.com', callback_data: `sni:investor.fb.com:${proxyId}` }],
        [{ text: 'help.viu.com', callback_data: `sni:help.viu.com:${proxyId}` }],
      ],
    };

    return await editMessageText(chatId, messageId, sniList, {
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } else {
    return await sendMessage(chatId, '❌ Metode tidak valid.', {}, messageId);
  }
}


async function generateConfigNoWS(chatId, proxyId, messageId) {
  try {
    const selectedProxy = proxies.find(p => p.id == proxyId);
    if (!selectedProxy) {
      return await sendMessage(chatId, '❌ Proxy tidak ditemukan.', {
        reply_to_message_id: messageId
      });
    }

    // Edit pesan lama menjadi RUNNING
    await editMessageText(chatId, messageId, "```RUNNING\nSilahkan menunggu, sedang memproses...\n```", {
      parse_mode: "MarkdownV2",
      reply_markup: { inline_keyboard: [] }
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
    await deleteMessage(chatId, messageId);

    const uuid = generateUUID();
    const bugServer = `${servervless}`;

    const vlessRawUrl = `vless://${uuid}@${bugServer}:443?encryption=none&security=tls&sni=${bugServer}&type=ws&host=${bugServer}&path=${selectedProxy.path}#${selectedProxy.server}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(vlessRawUrl)}`;

    await sendPhoto(chatId, qrUrl, {
      caption: '𝗦𝗰𝗮𝗻 𝗱𝗶 𝗮𝗽𝗽 𝘃2𝗿𝗮𝘆𝗡𝗚, 𝗚𝗮𝘁𝗰𝗵𝗮𝗡𝗚, 𝗱𝘀𝘁',
      parse_mode: 'Markdown'
    });

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
  servername: ${servervless}
  ws-opts:
    path: ${selectedProxy.path}
    headers:
      Host: ${servervless}
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

    return sendMessage(chatId, config, {
      parse_mode: "Markdown", messageId
    });

  } catch (error) {
    console.error("generateConfigNoWS ERROR:", error);
    return sendMessage(chatId, `❌ Gagal membuat konfigurasi:\n\`\`\`\n${error.message}\n\`\`\``, {
      parse_mode: "Markdown", messageId
    });
  }
}


async function generateConfigWithWildcard(chatId, wildcard, proxyId, messageId) {
  try {
    const selectedProxy = proxies.find((p) => p.id == proxyId);
    if (!selectedProxy) {
      return sendMessage(chatId, '❌ Proxy tidak ditemukan.');
    }

    const uuid = generateUUID();
    const bugServer = `${wildcard}.${servervless}`;
    const vlessRawUrl = `vless://${uuid}@${wildcard}:443?encryption=none&security=tls&sni=${bugServer}&type=ws&host=${bugServer}&path=${selectedProxy.path}#${selectedProxy.server}`;
    
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(vlessRawUrl)}`;

    // Hapus tombol salin kode, jadi keyboard kosong atau bisa dihapus juga reply_markup
    await sendPhoto(chatId, qrUrl, {
  caption: '𝗦𝗰𝗮𝗻 𝗱𝗶 𝗮𝗽𝗽 𝘃2𝗿𝗮𝘆𝗡𝗚, 𝗚𝗮𝘁𝗰𝗵𝗮𝗡𝗚, 𝗱𝘀𝘁',  // atau caption informatif
  parse_mode: 'Markdown'
});

const config = `
𝗞𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘀𝗶 𝘃𝗹𝗲𝘀𝘀 𝗮𝗻𝗱𝗮 𝗯𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗱𝗶𝗯𝘂𝗮𝘁
𝗦𝗲𝗿𝘃𝗲𝗿 : \`${selectedProxy.server}\`
𝗣𝗮𝘁𝗵 :  \`${selectedProxy.path}\`
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

    return sendMessage(chatId, config, { parse_mode: "Markdown" });

  } catch (error) {
    const errorMsg = `❌ Gagal membuat konfigurasi:\n<pre>${error.message}</pre>`;
    console.error("generateConfigWithWildcard ERROR:", error);
    return sendMessage(chatId, errorMsg, { parse_mode: "Markdown" });
  }
}



async function generateConfigWithSni(chatId, sni, proxyId, messageId) {
  try {
    const selectedProxy = proxies.find((p) => p.id == proxyId);
    if (!selectedProxy) {
      return sendMessage(chatId, '❌ Proxy tidak ditemukan.');
    }

    const uuid = generateUUID();
  const bugServer = `${sni}.${servervless}`;
    const vlessRawUrl = `vless://${uuid}@${servervless}:443?encryption=none&security=tls&sni=${bugServer}&type=ws&host=${bugServer}&path=${selectedProxy.path}#${selectedProxy.server}`;
    
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(vlessRawUrl)}`;

    // Hapus tombol salin kode, jadi keyboard kosong atau bisa dihapus juga reply_markup
    await sendPhoto(chatId, qrUrl, {
  caption: '𝗦𝗰𝗮𝗻 𝗱𝗶 𝗮𝗽𝗽 𝘃2𝗿𝗮𝘆𝗡𝗚, 𝗚𝗮𝘁𝗰𝗵𝗮𝗡𝗚, 𝗱𝘀𝘁',  // atau caption informatif
  parse_mode: 'Markdown'
});

const config = `
𝗞𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘀𝗶 𝘃𝗹𝗲𝘀𝘀 𝗮𝗻𝗱𝗮 𝗯𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗱𝗶𝗯𝘂𝗮𝘁
𝗦𝗲𝗿𝘃𝗲𝗿 : \`${selectedProxy.server}\` 
𝗣𝗮𝘁𝗵 :  \`${selectedProxy.path}\` 
𝗠𝗲𝘁𝗼𝗱𝗲 : 𝗦𝗡𝗜/𝗧𝗟𝗦
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

    return sendMessage(chatId, config, { parse_mode: "Markdown" });

  } catch (error) {
    const errorMsg = `❌ Gagal membuat konfigurasi:\n<pre>${error.message}</pre>`;
    console.error("generateConfigWithSniERROR:", error);
    return sendMessage(chatId, errorMsg, { parse_mode: "Markdown" });
  }
}

async function sendTemporaryMessage(chatId, text, replyToMessageId = null) {
  const payload = { 
    chat_id: chatId, 
    text, 
    parse_mode: 'Markdown' 
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
async function sendMessage(chatId, text, options = {}, replyTo = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: options.parse_mode || 'Markdown', // Default ke Markdown
    ...options,
  };
  if (replyTo) payload.reply_to_message_id = replyTo;

  const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

  const responseBody = await response.json();
  return response.ok
    ? new Response('OK')
    : new Response(`Error: ${responseBody.description}`, { status: 500 });
}

// Fungsi untuk mengedit pesan
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
  const token = "7869958204:AAGJf4x0XQ7CX-vOQDS52QuucLj_md-EzFY"; // ganti sesuai nama variabel token kamu
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


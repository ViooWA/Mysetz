const axios = require('axios')
const cheerio = require('cheerio')

async function komiku(search) {
const ress = await axios.get(`https://api.komiku.id/?post_type=manga&s=${search}`);
const $ = cheerio.load(ress.data);
const mangaList = [];
$('.bge').each((index, element) => {
const title = $(element).find('h3').text().trim();
const description = $(element).find('.judul2').text().trim();
const image = $(element).find('img').attr('src');
const link = $(element).find('a').attr('href');
mangaList.push({
title,
description,
image,
url: "https://komiku.id" + link
})});
return mangaList
}

async function mcpedl(mods) {
const ress = await axios.get(`https://mcpedl.org/?s=${mods}`);
const $ = cheerio.load(ress.data);
const result = [];
$('.g-block.size-20').each((index, element) => {
const title = $(element).find('.entry-title a').text();
const url = $(element).find('.entry-title a').attr('href');
const imageUrl = $(element).find('.post-thumbnail img').attr('data-src');
const ratingWidth = $(element).find('.rating-wrapper .rating-box .rating-subbox').attr('style');
const rating = ratingWidth ? parseInt(ratingWidth.split(':')[1]) / 100 * 5 : 0;
result.push({
title,
url,
imageUrl,
rating: rating,
})});
return result;
}

async function CarbonifyV1(input) {
try {
const response = await axios.post("https://carbonara.solopov.dev/api/cook", {
code: input
}, {
headers: {
"Content-Type": "application/json"
},
responseType: 'arraybuffer'
});
return response.data;
} catch (err) {
throw new Error('CarbonifyV1 failed: ' + err.message);
}}

async function CarbonifyV2(input) {
try {
const response = await axios.post("https://carbon-api.vercel.app/api", {
code: input
}, {
headers: {
"Content-Type": "application/json"
},
responseType: 'arraybuffer'
});
return response.data;
} catch (err) {
throw new Error('CarbonifyV2 failed: ' + err.message);
}}

class Ddownr {
constructor(url) {
this.url = url;
this.video = ["360", "480", "720", "1080"];
}
download = async(type) => {
if (!type) {
return {
success: false,
list: this.video
}}
if (!this.video.includes(type)) {
return {
success: false,
list: this.video
}}
try {
const { data } = await axios.get(`https://p.oceansaver.in/ajax/download.php?copyright=0&format=${type}&url=${this.url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`);
let result = {};
while (true) {
const response = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${data.id}`).catch(e => e.response);
if (response.data.download_url) {
result = {
type,
download: response.data.download_url
};
break;
}
await new Promise(resolve => setTimeout(resolve, 1000));
} return { ...data.info, ...result };
} catch (e) {
return {
success: false,
msg: "Error", 
err: e 
}}}}

async function handler(req, res) {
const { tag, text, text1, avatar, username, url } = req.query;

try {
if (tag === 'openai') { // OPENAI
const response = await axios.get(`https://api.agatz.xyz/api/gpt4o?message=${encodeURIComponent(text)}`
);
return res.status(200).json({
status: true,
result: response.data.data.result,
});
} else if (tag === 'blackbox') { // BLACKBOX
const requestData = {
content: text,
cName: "S-AI",
cID: "S-AIbAQ0HcC"
};
const response = await axios.post('https://luminai.my.id/', requestData);
const sai = response.data;
const pe = sai.result;
return res.status(200).json({
status: true,
result: pe,
});
} else if (tag === 'luminai') { // LUMINAI
const response = await axios.post('https://luminai.my.id/', { content: text });
return res.status(200).json({
status: true,
result: response.data.result,
});
} else if (tag === 'simisimi') { // SIMISIMI
const response = await axios.get(`https://api.vreden.my.id/api/simi?query=${encodeURIComponent(text)}&lang=id`);
return res.json({
status: true,
result: response.data.result,
});
} else if (tag === 'gemini') { // GEMINI
const response = await axios.get(`https://api.agatz.xyz/api/gemini?message=${encodeURIComponent(text)}`
);
return res.status(200).json({
status: true,
result: response.data.data.answer,
});
} else if (tag === 'morai') { // MORAI
const response = await axios.get(`https://api.vreden.my.id/api/mora?query=${encodeURIComponent(text)}&username=${encodeURIComponent(username)}`
);
return res.status(200).json({
status: true,
result: response.data.result,
});
} else if (tag === 'moshiai') { // MOSHIAI
const response = await axios.get(`https://api.siputzx.my.id/api/ai/moshiai?input=${encodeURIComponent(text)}`
);
return res.status(200).json({
status: true,
result: response.data.data,
});
} else if (tag === 'latukam') { // LATUKAM
const response = await axios.get(`https://api.siputzx.my.id/api/ai/latukam?content=${encodeURIComponent(text)}`
);
return res.status(200).json({
status: true,
result: response.data.data,
});
} else if (tag === 'google') { // GOOGLE
const response = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(text)}&key=AIzaSyAajE2Y-Kgl8bjPyFvHQ-PgRUSMWgBEsSk&cx=e5c2be9c3f94c4bbb`);
const items = response.data.items;
if (items && items.length > 0) {
return res.json({
status: true,
data: items.map(item => ({
title: item.title,
description: item.snippet,
link: item.link,
})),
})}
return res.json({
status: false,
data: 'No results found',
});
} else if (tag === 'npm') { // NPM
const response = await axios.get(`http://registry.npmjs.com/-/v1/search?text=${encodeURIComponent(text)}`);
const { objects } = response.data;
if (!objects.length) {
return res.json({
status: false,
data: 'Not found',
});
}
const data = objects.map(({ package: pkg }) => ({
name: pkg.name,
version: pkg.version,
npm: pkg.links.npm,
description: pkg.description,
}));
return res.json({
status: true,
data,
});
} else if (tag === 'pinterest') { // PINTEREST
const response = await axios.get(`https://itzpire.com/search/pinterest?query=${encodeURIComponent(text)}`);
if (response.data.status !== "success") {
return res.json({
status: false,
data: 'Error: API returned failure'
});
}
return res.json({
status: true,
data: response.data.data,
});
} else if (tag === 'wikimedia') { // WIKIMEDIA
const response = await axios.get(`https://itzpire.com/search/wikimedia?query=${encodeURIComponent(text)}`);
if (response.data.status !== "success") {
return res.json({
status: false,
data: 'Error: API returned failure'
})}
return res.json({
status: true,
data: response.data.data,
});
} else if (tag === 'playstore') { // PLAYSTORE
const response = await axios.get(`https://api.agatz.xyz/api/playstore?message=${encodeURIComponent(text)}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'happymod') { // HAPPYMOD
const response = await axios.get(`https://itzpire.com/search/happymod?query=${encodeURIComponent(text)}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'komiku') { // KOMIKU
const response = await komiku(`${encodeURIComponent(text)}`)
return res.status(200).json({
status: true,
data: response,
});
} else if (tag === 'mcpedl') { // MCPEDL
const response = await mcpedl(`${encodeURIComponent(text)}`)
return res.status(200).json({
status: true,
data: response,
});
} else if (tag === 'brat') { // BRAT
const response = await axios.get(
`https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`,
{ responseType: 'arraybuffer' }
);
res.setHeader('Content-Type', 'image/png');
res.send(response.data);
} else if (tag === 'ytcomment') { // YTCOMMENT
const response = await axios.get(
`https://some-random-api.com/canvas/misc/youtube-comment?comment=${encodeURIComponent(text)}&avatar=${encodeURIComponent(avatar)}&username=${encodeURIComponent(username)}`,
{ responseType: 'arraybuffer' }
);
res.setHeader('Content-Type', 'image/png');
res.send(response.data);
} else if (tag === 'carbon') { // CARBONIFY
try {
const response = await axios.get(
`https://api.siputzx.my.id/api/m/carbonify?input=${encodeURIComponent(text)}`,
{ responseType: 'arraybuffer' }
);
res.setHeader('Content-Type', 'image/png');
res.send(response.data);
} catch (err) {
try {
const buffer = await CarbonifyV1(text);
res.setHeader('Content-Type', 'image/png');
res.send(buffer);
} catch (v1Error) {
const buffer = await CarbonifyV2(text);
res.setHeader('Content-Type', 'image/png');
res.send(buffer);
}}
} else if (tag === 'txtimg') { // TXTIMG
const apiUrl = `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(text)}`;
const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
res.setHeader('Content-Type', 'image/png');
res.send(response.data);
} else if (tag === 'memegen') { // MEMEGEN
const response = await axios.get(
`https://api.siputzx.my.id/api/m/memgen?link=${url}&top=${encodeURIComponent(text)}&bottom=${encodeURIComponent(text1)}&font=1`,
{ responseType: 'arraybuffer' }
);
res.setHeader('Content-Type', 'image/png');
res.send(response.data);
} else if (tag === 'blurimg') { // BLURIMG
const response = await axios.get(
`https://api.siputzx.my.id/api/m/blur?url=${url}`,
{ responseType: 'arraybuffer' }
);
res.setHeader('Content-Type', 'image/png');
res.send(response.data);
} else if (tag === 'mediafire') { // MEDIAFIRE
const response = await axios.get(`https://api.vreden.my.id/api/mediafiredl?url=${url}`);
const data = response.data;
if (!data.result || data.result.length === 0) {
return res.json({
status: false,
data: 'Tidak ada hasil ditemukan',
});
}
const fileNama = decodeURIComponent(data.result[0].nama);
const fileLink = data.result[0].link;
return res.json({
status: true,
data: {
fileName: fileNama,
url: fileLink,
}, });
} else if (tag === 'ttdl') { // TIKTOK
const response = await axios.get(`https://api.vreden.my.id/api/tiktok?url=${url}`);
const data = response.data;
if (!data.result || !data.result.data || data.result.data.length === 0) {
return res.json({
status: false,
data: 'Tidak ada hasil ditemukan',
})}
let videoUrl = null;
for (let item of data.result.data) {
if (item.type === "nowatermark") {
videoUrl = item.url;
break;
}}
return res.json({
status: true,
data: {
url: videoUrl,
}, });
} else if (tag === 'igdl') { // INSTAGRAM
const response = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${url}`);
return res.json({
status: true,
data: response.data.data
});
} else if (tag === 'fbdl') { // FACEBOOK
const response = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${url}`);
return res.json({
status: true,
data: response.data.data
});
} else if (tag === 'capcut') { // CAPCUT
const response = await axios.get(`https://api.siputzx.my.id/api/d/capcut?url=${url}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'gdrive') { // GDRIVE
const response = await axios.get(`https://api.siputzx.my.id/api/d/gdrive?url=${url}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'ytdl') { // YOUTUBE
const data = new Ddownr(`${url}`);
const downloadResult = await data.download('480');
return res.status(200).json({
status: true,
data: downloadResult,
});
} else if (tag === 'twitter') { // TWITTER
const response = await axios.get(`https://api.agatz.xyz/api/twitter?url=${url}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'otakudesu-src') { // OTKD-SRC
const response = await axios.get(`https://api.siputzx.my.id/api/anime/otakudesu/search?s=${encodeURIComponent(text)}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'otakudesu-detail') { // OTKD-DETAIL
const response = await axios.get(`https://api.siputzx.my.id/api/anime/otakudesu/detail?url=${url}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'otakudesu-ongoing') { // OTKD-ONGOING
const response = await axios.get(`https://api.siputzx.my.id/api/anime/otakudesu/ongoing?-`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'otakudesu-dl') { // OTKD-DL
const response = await axios.get(`https://api.siputzx.my.id/api/anime/otakudesu/download?url=${url}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'abatch-src') { // ABATCH-SRC
const response = await axios.get(`https://api.agatz.xyz/api/animebatch?message=${encodeURIComponent(text)}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'abatch-dl') { // ABATCH-DL
const response = await axios.get(`https://api.agatz.xyz/api/animebatchinfo?url=${url}`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'tebakgambar') { // TEBAKGAMBAR
const response = await axios.get(`https://api.siputzx.my.id/api/games/tebakgambar?-`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'tebakheroml') { // TEBAKHEROML
const response = await axios.get(`https://api.siputzx.my.id/api/games/tebakheroml?-`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'tebakjkt') { // TEBAKJKT
const response = await axios.get(`https://api.siputzx.my.id/api/games/tebakjkt?-`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'tebakhewan') { // TEBAKHEWAN
const response = await axios.get(`https://api.siputzx.my.id/api/games/tebakhewan?-`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'tebakgame') { // TEBAKGAME
const response = await axios.get(`https://api.siputzx.my.id/api/games/tebakgame?-`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'tebakbendera') { // TEBAKBENDERA
const response = await axios.get(`https://api.siputzx.my.id/api/games/tebakbendera?-`
);
return res.status(200).json({
status: true,
data: response.data,
});
} else if (tag === 'tebaklagu') { // TEBAKLAGU
const response = await axios.get(`https://api.siputzx.my.id/api/games/tebaklagu?-`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'tebaklirik') { // TEBAKLIRIK
const response = await axios.get(`https://api.siputzx.my.id/api/games/tebaklirik?-`
);
return res.status(200).json({
status: true,
data: response.data.data,
});
} else if (tag === 'tobase64') { // TOBASE64
const base64 = Buffer.from(text).toString('base64');
return res.status(200).json({
status: true,
result: base64,
});
} else if (tag === 'toutf8') { // TOUTF8
const utf8 = Buffer.from(text, 'base64').toString('utf-8');
return res.status(200).json({
status: true,
result: utf8,
});
} else if (tag === 'githubraw') { // GITHUBRAW
if (!url.includes('github.com')) {
return res.status(400).json({
status: false,
message: "Requires Github Raw URL",
})}
const rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace(/\/blob\/[^\/]+/, '').replace('/master', '').replace('/main', '');
return res.status(200).json({
status: true,
result: rawUrl,
});
} else if (tag === 'githubori') { // GITHUBORI
if (!url.includes('raw.githubusercontent.com')) {
return res.status(400).json({
status: false,
message: "Requires Github Ori URL",
})}
const originalUrl = url.replace('raw.githubusercontent.com', 'github.com').replace(/\/([^\/]+)$/, '/blob/$1').replace('/master', '/blob/master').replace('/main', '/blob/main');
return res.status(200).json({
status: true,
result: originalUrl,
});
} else if (tag === 'nsfw') { // NSFW
const pe = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(text)}&json=1`)
.catch((err) => {
return null;
});
if (!pe || !pe.data) {
return res.status(500).json({
status: false,
error: 'undefined',
})}
const po = Array.isArray(pe.data) ? pe.data.slice(0, 5) : [];
const tags = ["trap", "blowjob", "hentai", "boobs", "ass", "pussy", "thighs", "lesbian", "lewdneko", "cum"]
if (!tags.includes(text) && !text.includes('list')) {
return res.status(400).json({
status: false,
message: `List: ${tags.join(", ")}`,
})}
return res.status(200).json({
status: true,
data: po,
});
} else if (tag === 'sfw') { // SFW
const pe = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(text)}&json=1`)
.catch((err) => {
return null;
});
if (!pe || !pe.data) {
return res.status(500).json({
status: false,
error: 'undefined',
})}
const po = Array.isArray(pe.data) ? pe.data.slice(0, 5) : [];
const tags = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", 
"lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", 
"nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"];
if (!tags.includes(text) && !text.includes('list')) {
return res.status(400).json({
status: false,
message: `List: ${tags.join(", ")}`,
})}
return res.status(200).json({
status: true,
data: po,
});
}

// === Catch akhir (untuk semua error)
} catch (err) {
const errorResponse = {
status: false,
error: err.message,
...(err.response && {
statusCode: err.response.status,
data: err.response.data,
headers: err.response.headers,
}),
};

switch (err.response?.status) {
case 400:
return res.status(400).json({ ...errorResponse, message: 'Bad Request' });
case 401:
return res.status(401).json({ ...errorResponse, message: 'Unauthorized' });
case 402:
return res.status(402).json({ ...errorResponse, message: 'Payment Required' });
case 403:
return res.status(403).json({ ...errorResponse, message: 'Forbidden' });
case 404:
return res.status(404).json({ ...errorResponse, message: 'Not Found' });
case 405:
return res.status(405).json({ ...errorResponse, message: 'Method Not Allowed' });
case 406:
return res.status(406).json({ ...errorResponse, message: 'Not Acceptable' });
case 407:
return res.status(407).json({ ...errorResponse, message: 'Proxy Authentication Required' });
case 408:
return res.status(408).json({ ...errorResponse, message: 'Request Timeout' });
case 409:
return res.status(409).json({ ...errorResponse, message: 'Conflict' });
case 410:
return res.status(410).json({ ...errorResponse, message: 'Gone' });
case 411:
return res.status(411).json({ ...errorResponse, message: 'Length Required' });
case 412:
return res.status(412).json({ ...errorResponse, message: 'Precondition Failed' });
case 413:
return res.status(413).json({ ...errorResponse, message: 'Payload Too Large' });
case 414:
return res.status(414).json({ ...errorResponse, message: 'URI Too Long' });
case 415:
return res.status(415).json({ ...errorResponse, message: 'Unsupported Media Type' });
case 416:
return res.status(416).json({ ...errorResponse, message: 'Range Not Satisfiable' });
case 417:
return res.status(417).json({ ...errorResponse, message: 'Expectation Failed' });
case 429:
return res.status(429).json({ ...errorResponse, message: 'Too Many Requests' });
case 500:
return res.status(500).json({ ...errorResponse, message: 'Internal Server Error' });
case 501:
return res.status(501).json({ ...errorResponse, message: 'Not Implemented' });
case 502:
return res.status(502).json({ ...errorResponse, message: 'Bad Gateway' });
case 503:
return res.status(503).json({ ...errorResponse, message: 'Service Unavailable' });
case 504:
return res.status(504).json({ ...errorResponse, message: 'Gateway Timeout' });
case 505:
return res.status(505).json({ ...errorResponse, message: 'HTTP Version Not Supported' });
default:
return res.status(500).json(errorResponse);
}}
}

module.exports = handler;
const axios = require('axios');

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
});
}
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
}

// === Catch akhir
} catch (err) {
const errorResponse = {
status: false,
error: err.message,
...(err.response && {
statusCode: err.response.status,
data: err.response.data,
headers: err.response.headers,
})
};
return res.status(500).json(errorResponse);
}
}

module.exports = handler;

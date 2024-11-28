const cors = require('cors');
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/ttdl.js', async (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);

    const { url } = req.query;
    if (!url) {
        return res.json({
            status: false,
            result: 'Contoh penggunaan: ?url=https://www.tiktok.com/@example/video/1234567890',
        });
    }

    const apiUrl = `https://api.vreden.my.id/api/tiktok?url=${url}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.result || !data.result.data || data.result.data.length === 0) {
            return res.json({
                status: false,
                result: 'Tidak ada hasil ditemukan',
            });
        }

        let videoUrl = null;
        for (let item of data.result.data) {
            if (item.type === "nowatermark") {
                videoUrl = item.url;
                break;
            }
        }

        return res.json({
            status: true,
            data: {
                url: videoUrl,
            },
        });
    } catch (err) {
        console.error("Error in TikTok API:", err.message);
        console.error("Full Error Details:", err.response ? err.response.data : err);

        const errorResponse = {
            status: false,
            result: {
                error: err.message,
                ...(err.response && {
                    status: err.response.status,
                    data: err.response.data,
                    headers: err.response.headers,
                }),
            },
        };

        return res.json(errorResponse);
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
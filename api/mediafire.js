const cors = require('cors');
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/mediafire.js', async (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);

    const { url } = req.query;
    if (!url) {
        return res.json({
            status: false,
            result: 'Contoh penggunaan: ?url=https://www.mediafire.com/file/example',
        });
    }

    const apiUrl = `https://api.vreden.my.id/api/mediafiredl?url=${url}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.result || data.result.length === 0) {
            return res.json({
                status: false,
                result: 'Tidak ada hasil ditemukan',
            });
        }

        const fileNama = decodeURIComponent(data.result[0].nama);
        const fileLink = data.result[0].link;

        return res.json({
            status: true,
            result: {
                fileNama: fileNama,
                fileLink: fileLink,
            },
        });
    } catch (err) {
        console.error("Error in Mediafire API:", err.message);
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
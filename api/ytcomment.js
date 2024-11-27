const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/ytcomment.js', async (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);
    const { text, avatar, username } = req.query;
    if (!text || !avatar || !username) {
        return res.json({
            status: false,
            result: 'Contoh penggunaan: ?text=halo&avatar=https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg&username=Vioo'
        });
    }
    try {
        const response = await axios.get(
            `https://some-random-api.com/canvas/misc/youtube-comment?comment=${encodeURIComponent(text)}&avatar=${encodeURIComponent(avatar)}&username=${encodeURIComponent(username)}`,
            { responseType: 'arraybuffer' }
        );
        console.log("Response from External API:", response.data);
        
        res.set('Content-Type', 'image/png');
        res.send(response.data);

    } catch (err) {
        console.error("External API Error:", err.message);
        console.error("Full Error Details:", err.response ? err.response.data : err);

        const errorResponse = {
            status: false,
            result: {
                error: err.message,
                ...(err.response && {
                    status: err.response.status,
                    data: err.response.data,
                    headers: err.response.headers
                })
            }
        };
        return res.json(errorResponse);
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
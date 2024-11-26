const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/openai.js', async (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);
    const { text, username = 'Vioo' } = req.query;
    if (!text) {
        return res.json({
            status: false,
            result: 'Contoh penggunaan: ?text=halo&username=Vioo'
        });
    }
    try {
        const response = await axios.get(
            `https://api.vreden.my.id/api/mora?query=${encodeURIComponent(text)}&username=${encodeURIComponent(username)}`
        );
        console.log("Response from External API:", response.data);
        return res.json({
            status: true,
            result: response.data.result,
        });
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
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/txtimg.js', async (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);

    const { text } = req.query;
    if (!text) {
        return res.json({
            status: false,
            result: 'Contoh penggunaan: ?text=halo'
        });
    }

    try {
        const apiUrl = 'https://www.text-image.com/api';
        const requestData = {
            text: text,
            bgColor: '#000000',
            textColor: '#FFFFFF',
            fontSize: 24
        };

        const response = await axios.post(apiUrl, requestData, { responseType: 'arraybuffer' });

        console.log("Response from TextImage API:", response.data);

        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (err) {
        console.error("TextImage API Error:", err.message);
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
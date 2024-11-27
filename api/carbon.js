const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/carbon.js', async (req, res) => {
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
        const response = await axios.get(
            `https://api.siputzx.my.id/api/m/carbonify?input=${encodeURIComponent(text)}`,
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
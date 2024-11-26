const cors = require('cors');
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/simisimi.js', async (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);
    const { text } = req.query;
    if (!text) {
        return res.json({
            status: false,
            result: 'Contoh penggunaan: ?text=halo',
        });
    }
    const apiUrl = `https://api.vreden.my.id/api/simi?query=${encodeURIComponent(text)}&lang=id`;
    try {
        const response = await axios.get(apiUrl);
        const { result } = response.data;

        if (!result) {
            return res.json({
                status: false,
                result: 'Tidak ada hasil ditemukan',
            });
        }

        return res.json({
            status: true,
            result: result,
        });
    } catch (err) {
        console.error("Error in Simi API:", err.message);
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
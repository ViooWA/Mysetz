const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/pinterest.js', async (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);

    const { text } = req.query; 
    
    if (!text) {
        return res.json({
            status: false,
            result: 'Contoh penggunaan: ?text=Kylian Mbappe'
        });
    }

    try {
        const apiUrl = `https://itzpire.com/search/pinterest?query=${encodeURIComponent(text)}`;
        console.log("Requesting External API URL:", apiUrl);

        const response = await axios.get(apiUrl);
        console.log("Response from External API:", response.data);

        if (response.data.status !== "success") {
            return res.json({
                status: false,
                result: 'Error: API returned failure'
            });
        }

        return res.json({
            status: true,
            result: response.data.data,
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

        return res.status(500).json(errorResponse);
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
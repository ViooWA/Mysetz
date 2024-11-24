const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);

    const { text } = req.query;

    if (!text) {
        console.error("Error: Text is required");
        return res.status(400).json({ error: 'Contoh penggunaan: ?text=halo' });
    }

    try {
        const response = await axios.get(
            `https://aemt.uk.to/openai?text=${encodeURIComponent(text)}`
        );
        console.log("Response from External API:", response.data);

        return res.status(200).json({
            status: true,
            result: response.data,
        });
    } catch (err) {
        console.error("External API Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = app;
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/ai.js', async (req, res) => {
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
            result: response.data.result,
        });
    } catch (err) {
        console.error("External API Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
console.log(`Server started on http://localhost:${PORT}`);
});

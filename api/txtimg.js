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
        const apiUrl = `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(text)}`;
        
        console.log("Generated API URL:", apiUrl);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (err) {
        console.error("Error generating image:", err.message);

        const errorResponse = {
            status: false,
            result: {
                error: err.message,
            }
        };
        return res.json(errorResponse);
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
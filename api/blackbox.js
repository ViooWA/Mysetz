const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.get('/api/blackbox.js', (req, res) => {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);

    const { text } = req.query;

    if (!text) {
        console.error("Error: Text is required");
        return res.status(400).json({ error: 'Contoh penggunaan: ?text=halo' });
    }

    const requestData = {
        content: text,
        cName: "S-AI",
        cID: "S-AIbAQ0HcC"
    };

    axios.post('https://luminai.my.id/', requestData)
        .then(response => {
            const sai = response.data;
            const pe = sai.result;

            return res.status(200).json({
                status: true,
                result: pe,
            });
        })
        .catch(err => {
            console.error("Error in AI Request:", err.message);
            return res.status(500).json({ error: err.message });
        });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

const axios = require('axios');

async function openai(req, res) {
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
            `https://api.agatz.xyz/api/gpt4o?message=${encodeURIComponent(text)}`
        );
        console.log("Response from External API:", response.data);

        return res.json({
            status: true,
            result: response.data.data.result,
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
}
openai(req, res);

async function blackbox(req, res) {
    const { text } = req.query;

    if (!text) {
        console.error("Error: Text is required");
        return res.status(400).json({
            error: 'Contoh penggunaan: ?text=halo',
            message: 'Parameter "text" tidak ditemukan dalam query.'
        });
    }

    const requestData = {
        content: text,
        cName: "S-AI",
        cID: "S-AIbAQ0HcC"
    };

    try {
        const response = await axios.post('https://luminai.my.id/', requestData);
        const sai = response.data;
        const pe = sai.result;

        return res.status(200).json({
            status: true,
            result: pe,
        });
    } catch (err) {
        console.error("Error in AI Request:", err.message);
        const errorResponse = {
            error: err.message,
            ...(err.response && {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers
            })
        };
        return res.status(500).json(errorResponse);
    }
}
blackbox(req, res);

module.exports = { openai, blackbox }
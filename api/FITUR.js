const axios = require('axios');

async function handler(req, res) {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);

    const { endpoint, text } = req.query;

    if (!text) {
        return res.status(400).json({
            status: false,
            message: 'Contoh penggunaan: ?endpoint=openai&text=halo',
        });
    }

    try {
        if (endpoint === 'openai') {
            // Handle OpenAI Endpoint
            const response = await axios.get(
                `https://api.agatz.xyz/api/gpt4o?message=${encodeURIComponent(text)}`
            );
            console.log("Response from External API:", response.data);

            return res.status(200).json({
                status: true,
                result: response.data.data.result,
            });
        } else if (endpoint === 'blackbox') {
            // Handle Blackbox Endpoint
            const requestData = {
                content: text,
                cName: "S-AI",
                cID: "S-AIbAQ0HcC"
            };

            const response = await axios.post('https://luminai.my.id/', requestData);
            const sai = response.data;
            const pe = sai.result;

            return res.status(200).json({
                status: true,
                result: pe,
            });
        } else {
            return res.status(400).json({
                status: false,
                message: 'Endpoint tidak valid. Gunakan "openai" atau "blackbox".',
            });
        }
    } catch (err) {
        console.error("Error in External Request:", err.message);
        console.error("Full Error Details:", err.response ? err.response.data : err);

        const errorResponse = {
            status: false,
            error: err.message,
            ...(err.response && {
                statusCode: err.response.status,
                data: err.response.data,
                headers: err.response.headers,
            })
        };
        return res.status(500).json(errorResponse);
    }
}

module.exports = handler;
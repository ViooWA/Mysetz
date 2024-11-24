import axios from 'axios';

export default async function handler(req, res) {
    console.log("HTTP Method:", req.method);
    console.log("Query Params:", req.query);

    if (req.method === 'GET') {
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
    } else {
        console.warn("Invalid HTTP Method:", req.method);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    }

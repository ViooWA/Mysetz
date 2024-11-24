import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { text, user, imageBuffer } = req.query;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const requestData = {
            content: text,
            user
        };

        if (imageBuffer) {
            requestData.imageBuffer = imageBuffer;
        }

        try {
            const response = await axios.post('https://luminai.my.id/', requestData);
            return res.status(200).json({
                status: true,
                result: response.data.result
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}

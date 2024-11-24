// api/bot.js

export default function handler(req, res) {
    // Pastikan hanya menerima request POST
    if (req.method === 'POST') {
        const { text } = req.body; // Ambil teks dari request body

        // Logika bot (misalnya, balasan standar untuk setiap pesan)
        const responseMessage = `Hello! I’m GPTGO AI, your virtual assistant. How can I help you today?`;

        // Kembalikan response dalam format JSON
        res.status(200).json({
            status: true,
            creator: "aemt.uk.to",
            result: responseMessage
        });
    } else {
        // Jika request bukan POST, kirimkan error 405 (Method Not Allowed)
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
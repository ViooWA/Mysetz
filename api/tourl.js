const axios = require('axios');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

app.post('/api/tourl.js', upload.single('file'), async (req, res) => {
    console.log("File Upload Method:", req.method);
    console.log("Uploaded File:", req.file);

    if (!req.file) {
        return res.json({
            status: false,
            result: 'Please upload a file.'
        });
    }

    try {
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);
        const response = await axios.post('https://file.io', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("File Upload Response from file.io:", response.data);

        return res.json({
            status: true,
            result: response.data.link
        });
    } catch (err) {
        console.error("File Upload Error:", err.message);
        return res.json({
            status: false,
            result: `Error uploading file: ${err.message}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
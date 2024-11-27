const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());

async function CarbonifyV1(input) {
  try {
    const response = await axios.post("https://carbonara.solopov.dev/api/cook", {
      code: input
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (err) {
    throw new Error('CarbonifyV1 failed: ' + err.message);
  }
}

async function CarbonifyV2(input) {
  try {
    const response = await axios.post("https://carbon-api.vercel.app/api", {
      code: input
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (err) {
    throw new Error('CarbonifyV2 failed: ' + err.message);
  }
}

app.get('/api/carbon.js', async (req, res) => {
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
      `https://api.siputzx.my.id/api/m/carbonify?input=${encodeURIComponent(text)}`,
      { responseType: 'arraybuffer' }
    );
    console.log("Response from External API:", response.data);

    res.set('Content-Type', 'image/png');
    res.send(response.data);

  } catch (err) {
    console.error("External API Error:", err.message);
    console.error("Full Error Details:", err.response ? err.response.data : err);

    try {
      const buffer = await CarbonifyV1(text);
      res.set('Content-Type', 'image/png');
      res.send(buffer);
    } catch (v1Error) {
      console.error("CarbonifyV1 failed, trying CarbonifyV2:", v1Error.message);
      try {
        const buffer = await CarbonifyV2(text);
        res.set('Content-Type', 'image/png');
        res.send(buffer);
      } catch (v2Error) {
        console.error("CarbonifyV2 failed:", v2Error.message);
        const errorResponse = {
          status: false,
          result: {
            error: v2Error.message,
            ...(v2Error.response && {
              status: v2Error.response.status,
              data: v2Error.response.data,
              headers: v2Error.response.headers
            })
          }
        };
        return res.json(errorResponse);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
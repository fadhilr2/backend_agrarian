import e from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = e();
const port = process.env.PORT || 3000; // Railway assigns a port

app.use(cors());
app.use(bodyParser.json());

const get_prediction = async (input, type) => {
  const headers = { "Content-Type": "application/json" };
  try {
    let url;
    if (type === "yield_prediction") {
      url = "https://mlmodelagrarian-production.up.railway.app/yield_prediction_fastapi";
    } else if (type === "crop_recommendation") {
      url = "https://mlmodelagrarian-production.up.railway.app/crop_recommendation_fastapi";
    }

    if (!url) return { msg: "Invalid prediction type" };

    const res = await axios.post(url, input, { headers });
    return res.data;
  } catch (err) {
    return { msg: err.message || "Error fetching prediction" };
  }
};

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f2f5;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .container {
          text-align: center;
          padding: 40px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .message {
          font-size: 24px;
          color: #1c1e21;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="message">Email Verified</h1>
      </div>
    </body>
    </html>
  `);
});


app.post("/yield_prediction", async (req, res) => {
  const pred = await get_prediction(req.body, "yield_prediction");
  res.json(pred);
});

app.post("/crop_recommendation", async (req, res) => {
  const pred = await get_prediction(req.body, "crop_recommendation");
  res.json(pred);
});

app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});

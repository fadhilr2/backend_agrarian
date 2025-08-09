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
  res.json({ msg: "API is running" });
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

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());


app.post("/analyze", async (req, res) => {
    const { name } = req.body;

    const prompt = `
  You are analyzing a YouTube channel.

  Channel name: ${name}

  Decide:
  Is this channel low-value, spammy, or not useful?

  Reply ONLY: KEEP or REMOVE
  `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        const result = data.choices[0].message.content.trim();

        res.json({ result });

    } catch (err) {
        res.json({ result: "KEEP" });
    }
});

app.listen(3000, () => {
    console.log("AI server running on port 3000");
});

/**npm init -y
npm install express node-fetch cors
node server.js*/
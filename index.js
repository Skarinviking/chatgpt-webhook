const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.queryResult.queryText;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    });

    const responseText = completion.data.choices[0].message.content;

    return res.json({
      fulfillmentText: responseText
    });
  } catch (error) {
    console.error("Errore OpenAI:", error);
    return res.json({
      fulfillmentText: "C'è stato un problema nel contattare ChatGPT."
    });
  }
});

app.listen(3000, () => console.log("Server in ascolto sulla porta 3000"));

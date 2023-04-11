const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

openai.apiKey = 'your_openai_api_key';

app.post('/chatgpt', async (req, res) => {
    try {
      const prompt = req.body.prompt;
      const maxTokens = req.body.max_tokens;
  
      const response = await openai.completions.create({
        engine: 'davinci-codex',
        prompt: prompt,
        max_tokens: maxTokens,
        n: 1,
        stop: null,
        temperature: 1,
      });
  
      res.json(response.choices[0].text);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error while calling the ChatGPT API.');
    }
  });
  

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

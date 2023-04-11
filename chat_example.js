const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);
/*function generatePrompt(keywords, prompt) {
  // You can customize this function to generate the desired prompt based on the keywords
  const keywordSentences = keywords.map(keyword => `Explain the relationship between ${prompt} and ${keyword}.`);
  return keywordSentences.join(' ');
}*/
function generatePrompt(keywords, prompt) {
  const keywordList = keywords.join(', ');
  const message1 = {
    role: 'system',
    content: `You are an assistant helping a teacher draft a lecture about the influence of ${keywordList} on ${prompt}.`
  };

  const message2 = {
    role: 'user',
    content: `Draft a lecture about ${keywordList}, and the ${prompt} habit.`
  };

  const jsonResult = {
    messages: [message1, message2]
  };

  return jsonResult;
}



/*async function analyzeRevisedContentWithGPT(revisedContent) {
  const prompt = `Analyze the student's content:\n\n"${revisedContent}"\n\nProvide theme modeling, anomaly detection, and personalized feedback:`;

  const response = await chatWithGPT(prompt);
  return response;
}*/
async function analyzeContentWithGPT(teacherDesign, revisedContent, prompt) {
  try {
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant.`,
        },
        {
          role: 'system',
          content: teacherDesign,
        },
        {
          role: 'system',
          content: revisedContent,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return result.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return 'An error occurred while communicating with the GPT model.';
  }
}

async function chatWithGPT(messages) {
  try {
    console.log("Messages:", messages); // Add this line to log messages
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    return result.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return 'An error occurred while communicating with the GPT model.';
  }
}


async function main() {
  const keywords = ['Python', 'JavaScript', 'programming'];
  const prompt = 'coffee-drinking'; // Add your desired prompt here
  const generatedPrompt = generatePrompt(keywords, prompt);
  const response = await chatWithGPT(generatedPrompt.messages);
  console.log(`GPT's response: ${response}`);
}


main();

module.exports = { chatWithGPT, generatePrompt, analyzeContentWithGPT };

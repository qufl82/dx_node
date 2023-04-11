$(document).ready(function() {
    // Set the API endpoints.
    const translateEndpoint = 'https://translation.googleapis.com/language/translate/v2';
    const chatGptEndpoint = '/chatgpt'; // Use the server-side proxy for ChatGPT requests
  
    // Define the API keys.
    const translateApiKey = 'AIzaSyDA6OiYq3f0iZIER4fmSwsJW6_cbNZZC7M';
  
    // Define the target languages.
    const targetLanguages = {
      korean: 'ko',
      english: 'en'
    };
  
    $('#translate-to-english').click(function() {
      translateText($('#korean-input').val(), targetLanguages.english, '#output');
    });
  
    // Translate the text and display it in the output element.
    function translateText(text, targetLanguage, outputSelector) {
      // Make an AJAX request to the Google Translate API.
      $.ajax({
        url: translateEndpoint + '?key=' + translateApiKey,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          q: text,
          target: targetLanguage
        }),
        dataType: 'json',
        success: function(response) {
          // Translate the text
          const translatedText = response.data.translations[0].translatedText;
  
          // Get the ChatGPT response
          getChatGptResponse(translatedText, outputSelector);
        }
      });
    }
  
    // Get the ChatGPT response and display it in the output element.
    function getChatGptResponse(text, outputSelector) {
      // Set up the request headers
      const settings = {
        'async': true,
        'crossDomain': true,
        'url': chatGptEndpoint,
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        },
        'data': JSON.stringify({
          'prompt': text,
          'max_tokens': 50
        })
      };
  
      // Make an AJAX request to the ChatGPT API
      $.ajax(settings).done(function(response) {
        // Display the ChatGPT response in the output element
        $(outputSelector).text(response);
      });
    }
  });
  
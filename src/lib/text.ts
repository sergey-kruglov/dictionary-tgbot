export const helpText = `
This bot uses external API. 
You need to obtain an API key here: https://rapidapi.com/dpventures/api/wordsapi

After obtaining the API key, use the command /auth <key> to save your API key in the bot.
Then you can write a word to get a definition and pronunciation.


Command list:

/auth - Authenticate with your token. Example: /auth <rapidapi-key>.

/random - Get a random word.

/help - Show this help message.


You can find the source code of this bot here: https://github.com/sergey-kruglov/dictionary-tgbot

Contact info: https://sergey-kruglov.com
`;

export const authText =
  `Message ID saved. The bot doesn't store the token in the database.` +
  `It uses message id to find the token and use it for WordsAPI.` +
  `If you remove this message, the bot cannot request WordsAPI.`;

// Description: This is the main file of the bot

// Import the required modules
require("dotenv").config();
const { JSDOM } = require("jsdom");
const request = require("request");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// next bot.onText
bot.onText(/\/start (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const link = match[1];

  // if the message is a link
  if (msg.text.includes("pinterest")) {
    bot.sendMessage(chatId, "Getting Video...");
    const url = msg.text;
    try {
      request(url, function (error, response, body) {
        // getting all the data from the page
        data = body;
        const dom = new JSDOM(data);
        const document = dom.window.document;
        // selecting the video tag
        const video = document.getElementsByTagName("video")[0].src;
        // modifying the url to get the 720p video
        addinQuality = video.replace("/hls/", "/720p/");
        outUrl = addinQuality.replace(".m3u8", ".mp4");
        console.log(outUrl);
        return outUrl;
      });
    } catch (err) {
      bot.sendMessage(chatId, "Something went wrong :(");
      console.log(err);
    }
    bot.sendVideo(chatId, outUrl);
  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // if the message is hello
  if (msg.text.includes("hello")) {
    bot.sendMessage(chatId, "Hello, " + msg.from.first_name);
  }

  // if the message is a link
  if (msg.text.includes("pinterest")) {
    bot.sendMessage(chatId, "Getting Video...");
    const url = msg.text;
    try {
      request(url, function (error, response, body) {
        // getting all the data from the page
        data = body;
        const dom = new JSDOM(data);
        const document = dom.window.document;
        // selecting the video tag
        const video = document.getElementsByTagName("video")[0].src;
        // modifying the url to get the 720p video
        addinQuality = video.replace("/hls/", "/720p/");
        outUrl = addinQuality.replace(".m3u8", ".mp4");
        console.log(outUrl);
        return outUrl;
      });
    } catch (err) {
      bot.sendMessage(chatId, "Something went wrong :(");
      console.log(err);
    }
    bot.sendVideo(chatId, outUrl);
  }
});

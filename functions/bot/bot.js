require("dotenv").config();
const { Telegraf } = require("telegraf");
const request = require("request");
const { JSDOM } = require("jsdom");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  console.log("Received /start command");
  try {
    return ctx.reply("Hi");
  } catch (e) {
    console.error("error in start action:", e);
    return ctx.reply("Error occured");
  }
});

bot.on("message", (ctx) => {
  // if the message is hello
  if (ctx.message.text.includes("hello")) {
    ctx.reply("Hello");
  }
  // if the message is a link of pinterest
  if (ctx.message.text.includes("pinterest.com")) {
    const url = ctx.message.text;
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
        ctx.sendVideo(outUrl);
      });
    } catch (err) {
      ctx.reply("Something went wrong :(");
      console.log(err);
    }
  }
});

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: "" };
  } catch (e) {
    console.error("error in handler:", e);
    return {
      statusCode: 400,
      body: "This endpoint is meant for bot and telegram communication",
    };
  }
};

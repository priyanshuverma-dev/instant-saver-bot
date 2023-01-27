const { Telegraf } = require("telegraf");
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

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // if the message is hello
  if (msg.text.includes("hello")) {
    bot.sendMessage(chatId, "Hello, " + msg.from.first_name);
  }

  // if the message is a link
  if (msg.text.includes("pinterest")) {
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

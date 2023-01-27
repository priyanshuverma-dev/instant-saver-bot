require("dotenv").config();
const { JSDOM } = require("jsdom");
const request = require("request");

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// command Start
bot.start((ctx) => {
  console.log("Received /start command");
  try {
    return ctx.reply("Hi");
  } catch (e) {
    console.error("error in start action:", e);
    return ctx.reply("Error occured");
  }
});

// command About
bot.command("/about", (ctx) => {
  console.log("Received /about command");
  try {
    return ctx.reply(
      "This bot is made by @Priyanshu_code. \n\n" +
        "This bot is made to download videos from all platforms currently in development. \n\n" +
        "If you have any suggestions or feedback, please contact @priyanshu_code. \n\n"
    );
  } catch (e) {
    console.error("error in about action:", e);
    return ctx.reply("Error occured");
  }
});

// command Contact
bot.command("/contact", (ctx) => {
  console.log("Received /contact command");
  try {
    return ctx.reply(
      "If you have any suggestions or feedback, please contact @priyanshu_code. \
      \n\n" +
        "Contribute in this project: https://github.com/priyanshu-creator/instant-saver-bot" +
        "\n\n" +
        "If you want to support me, you can donate here: https://www.buymeacoffee.com/priyanshucode" +
        "\n\n" +
        "My Email: priyanshu@somveers.me" +
        "\n\n" +
        "My Github: https://github.com/priyanshu-creator" +
        "\n\n" +
        "My Website: https://www.somveers.me"
    );
  } catch (e) {
    console.error("error in contact action:", e);
    return ctx.reply("Error occured");
  }
});

bot.on("message", (ctx) => {
  const url = ctx.message.text;
  // if the message is hello
  if (ctx.message.text.includes("hello")) {
    ctx.reply("Hello");
  }
  // if the message is a link of pinterest
  if (ctx.message.text.includes("pinterest.com")) {
    try {
      request(long_url, function (error, response, body) {
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
  // if the message is a link of pinterest shorten
  if (ctx.message.text.includes("pin.it")) {
    try {
      fetch(url)
        .then((r) => {
          if (!r.ok) {
            throw new Error(`HTTP error ${r.status}`);
          }
          const url = r.url;
          const uri = new URL(url);
          uri.searchParams.delete("invite_code");
          uri.searchParams.delete("sender");
          uri.searchParams.delete("sfo");
          uri.pathname = uri.pathname.replace("/sent/", "");
          const path = uri.pathname;
          const finalUrl = "https://" + uri.hostname + path;
          console.log(finalUrl);
          request(finalUrl, function (error, response, body) {
            const dom = new JSDOM(body);
            const document = dom.window.document;
            const video = document.getElementsByTagName("video")[0].src;
            addinQuality = video.replace("/hls/", "/720p/");
            outUrl = addinQuality.replace(".m3u8", ".mp4");
            console.log(outUrl);
            ctx.sendVideo(outUrl);
          });
        })
        .catch(console.error);
    } catch (err) {
      ctx.reply("Something went wrong :(");
      console.log(err);
    }
  }
  // if the message is a link of youtube
  if (ctx.message.includes("youtu.be")) {
    ctx.reply("Youtube is not supported yet");
  }
});
bot.launch();

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

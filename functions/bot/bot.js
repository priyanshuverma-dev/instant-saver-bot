const dotenv = require("dotenv");
const axios = require("axios");
const { Telegraf } = require("telegraf");

dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const API_URL = "https://priyanshu-vid-api.onrender.com";
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
      ctx.reply("Please wait...");
      axios
        .get(`${API_URL}/pinterest?url=${url}`)
        .then(function (res) {
          const vid = res.data.url;
          ctx.sendVideo(vid);
        })
        .catch(function (error) {
          console.log(error);
          ctx.reply("request Error try again !!");
        });
    } catch (err) {
      ctx.reply("Something went wrong :(");
      console.log(err);
    }
  }
  // if the message is a link of pinterest shorten
  if (ctx.message.text.includes("pin.it")) {
    try {
      ctx.reply("Please wait...");
      axios
        .get(`${API_URL}/pinterest?url=${url}`)
        .then(function (res) {
          const vid = res.data.url;
          ctx.sendVideo(vid);
        })
        .catch(function (error) {
          console.log(error);
          ctx.reply("request Error try again !!");
        });
    } catch (err) {
      ctx.reply("Something went wrong :(");
      console.log(err);
    }
  }
  // if the message is a link of youtube
  if (ctx.message.text.includes("youtu.be")) {
    ctx.reply("Youtube is not supported yet");
  }
  if (ctx.message.text.includes("Instagram")) {
    ctx.reply("Instagram is not supported yet");
  }
});
// bot.launch();
// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
// exports.handler = async function handler(event) {
//   try {
//     await bot.handleUpdate(JSON.parse(event.body));
//     return { statusCode: 200, body: "" };
//   } catch (e) {
//     console.error("error in handler:", e);
//     return {
//       statusCode: 400,
//       body: "This endpoint is meant for bot and telegram communication",
//     };
//   }
// };
export async function handler(event) {
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
}

import "dotenv/config";
import { Client } from "discord.js";
import { IntentsBitField } from "discord.js";
import moment from "moment-timezone";
import cron from "node-cron";

const CHANNEL_ID = "1162052161987940453";

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
});

client.on("ready", () => {
  console.log("I am ready!");

  cron.schedule("0 0 * * *", calculate, {
    timezone: "Europe/London",
  });
});

const calculate = () => {
  // use moment with Europe/London timezone to calculate percentage of the current year
  const now = moment().tz("Europe/London");
  const start = moment().tz("Europe/London").startOf("year");
  const end = moment().tz("Europe/London").endOf("year");
  const percentage = (now.diff(start, "days") / end.diff(start, "days")) * 100;

  const elapsedDays = now.diff(start, "days");
  const remainingDays = end.diff(now, "days");

  // send message to channel
  client.channels.cache
    .get(CHANNEL_ID)
    .send(
      [
        `The year is now **${percentage}%** complete.`,
        `We've had **${elapsedDays}** days so far, with **${remainingDays}** days left.`,
      ].join("\n")
    );
};

process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

client.login(process.env.DISCORD_BOT_TOKEN);

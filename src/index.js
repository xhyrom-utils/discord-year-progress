import "dotenv/config";
import { GatewayIntentBits } from "discord.js";
import moment from "moment-timezone";
import cron from "node-cron";
import { setTimeout as sleep } from "node:timers/promises";
import { Yearos } from "./Yearos.js";

const CHANNEL_ID = "1162052161987940453";

const client = new Yearos({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});

client.on("ready", () => {
  console.log("I am ready!");

  cron.schedule("0 0 * * *", calculate, {
    timezone: "Europe/London",
  });

  client.moonlink.init("1058688397792772176");
});

client.on("raw", (data) => {
  client.moonlink.packetUpdate(data);
});

client.moonlink.on("nodeCreate", async (node) => {
  console.log(`MoonLink | Node ${node.host} was connected.`);

  await sleep(1000);

  client.musicPlayer.init();
  client.musicPlayer.loadTracks();
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

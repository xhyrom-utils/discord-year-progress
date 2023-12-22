import { Client } from "discord.js";
import { MoonlinkManager } from "moonlink.js";
import { Player } from "./Player.js";

export class Yearos extends Client {
  constructor(options) {
    super(options);

    this.moonlink = new MoonlinkManager(
      [
        {
          host: process.env.LAVALINK_HOST || "localhost",
          port: parseInt(process.env.LAVALINK_PORT || "2333"),
          secure: (process.env.LAVALINK_SECURE || "false") === "true",
          password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
          pathVersion: "v4",
        },
      ],
      {
        /* Options */
      },
      (guild, sPayload) => {
        // Send payload information to the server
        this.guilds.cache.get(guild).shard.send(JSON.parse(sPayload));
      }
    );
    this.musicPlayer = new Player(this); // loaded in node_create event
  }
}

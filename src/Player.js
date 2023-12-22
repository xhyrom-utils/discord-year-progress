import { ChannelType } from "discord.js";

export class Player {
  GUILD_ID = "1046534628577640528";
  QUEUE_CHANNEL_ID = "1116013862261637200";
  STAGE_CHANNEL_ID = "1056174649559486584";

  /**
   * @param {import("./Yearos.js").Yearos} client
   */
  constructor(client) {
    this.client = client;
  }

  init() {
    const player = this.client.moonlink.players.create({
      guildId: this.GUILD_ID,
      voiceChannel: this.STAGE_CHANNEL_ID,
      textChannel: this.QUEUE_CHANNEL_ID,
      autoPlay: true,
      volume: 100,
    });
    //player.setLoop(2); // 0 - off, 1 - track, 2 - queue

    player.connect({
      setDeaf: true,
      setMute: false,
    });
  }

  async loadTracks() {
    const player = this.client.moonlink.players.get(this.GUILD_ID);
    if (!player) return;

    console.log("Loading tracks...");

    const res = await this.client.moonlink.search(
      "https://www.youtube.com/watch?v=_YDIeqwnhlc"
    );

    for (const track of res.tracks) {
      console.log(track);
      player.queue.add(track);
    }

    if (!player.playing) {
      const stageChannel = this.getStageChannel();
      if (stageChannel && !stageChannel.stageInstance) {
        await this.client.guilds.cache
          .get(player.guildId)
          ?.members.me?.voice.setSuppressed(false);

        await stageChannel.createStageInstance({
          topic: `🎵 New Year`,
          sendStartNotification: false,
        });
      }

      player.play();

      console.log("Playing tracks...");
    }
  }

  getStageChannel() {
    const stageChannel = this.client.channels.cache.get(this.STAGE_CHANNEL_ID);
    if (
      stageChannel?.isVoiceBased() &&
      stageChannel.type === ChannelType.GuildStageVoice
    ) {
      return stageChannel;
    }
  }
}

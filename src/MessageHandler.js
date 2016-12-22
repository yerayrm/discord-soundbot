const Util = require('./Util.js');

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
  }

  handle(message) {
    if (message.content === '!commands') {
      message.author.sendMessage(Util.commandsList());
    } else if (message.content === '!mostplayed') {
      message.channel.sendMessage(Util.mostPlayedList());
    } else {
      const sounds = Util.getSounds();
      if (message.content === '!sounds') {
        message.author.sendMessage(sounds.map(sound => sound));
      } else {
        const voiceChannel = message.author.voiceChannel;
        if (voiceChannel === undefined) {
          message.reply('Join a voice channel first!');
        } else if (message.content === '!stop') {
          voiceChannel.leave();
          this.bot.queue = [];
        } else if (message.content.startsWith('!remove ')) {
          const sound = message.content.replace('!remove ', '');
          const result = Util.removeSound(sound);
          message.channel.sendMessage(result);
        } else if (message.content === '!random') {
          const random = sounds[Math.floor(Math.random() * sounds.length)];
          this.bot.addToQueue(voiceChannel, random);
        } else {
          const sound = message.content.split('!')[1];
          if (sounds.includes(sound)) {
            this.bot.addToQueue(voiceChannel, sound);
            if (this.bot.voiceConnection === undefined) this.bot.playSoundQueue();
          }
        }
      }
    }
  }
}

module.exports = MessageHandler;
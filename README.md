# discord.js-Rate-Limiter

[![NPM Version](https://img.shields.io/npm/v/discord.js-rate-limiter.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-rate-limiter)
[![discord.js Version](https://img.shields.io/npm/dependency-version/discord.js-rate-limiter/peer/discord.js)](https://discord.js.org/)
[![Downloads](https://img.shields.io/npm/dt/discord.js-rate-limiter.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-rate-limiter)

Rate limiter for [discord.js](https://github.com/discordjs/discord.js/).

## Installation

`npm install discord.js-rate-limiter`

## Importing

```typescript
import { RateLimiter } from 'discord.js-rate-limiter';
```

## Example Usage

```typescript
import { Client, Intents } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

let Config = require('../config/config.json');

// Allows 1 command every 2 seconds
let rateLimiter = new RateLimiter(1, 2000);
let client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as '${client.user.tag}'!`);
});

client.on('messageCreate', async msg => {
    // Don't respond to bots
    if (msg.author.bot) {
        return;
    }

    if (msg.content === 'test') {
        // Check if user is rate limited
        let limited = rateLimiter.take(msg.author.id);
        if (limited) {
            // Send back a message (or you may want to just drop the request)
            await msg.channel.send(`You're doing that do often, please try again later!`);
            return;
        }

        // Run test command
        await msg.channel.send(`Test command ran!`);
        return;
    }
});

client.login(Config.token);
```

![Example](https://i.imgur.com/9HB4Mmo.png)

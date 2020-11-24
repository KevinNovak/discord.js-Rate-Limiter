import { Client } from 'discord.js';

import { RateLimiter } from './rate-limiter';

let Config = require('../config/config.json');

// Allows 1 command every 2 seconds
let rateLimiter = new RateLimiter(1, 2000);
let client = new Client();

client.on('ready', () => {
    console.log(`Logged in as '${client.user.tag}'!`);
});

client.on('message', async msg => {
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

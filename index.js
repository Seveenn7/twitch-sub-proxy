const express = require('express');
const fetch = require('node-fetch');
const app = express();

const CLIENT_ID = '0bozrbw6s8sb3bd0w1fx0x22hl4tsq';
let ACCESS_TOKEN = 'adg1pnbmjwtv8gs61nmkxrbohlvqpj';

app.get('/subs', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cache-Control', 'no-store');
    try {
        const userRes = await fetch('https://api.twitch.tv/helix/users?login=sevenncorp', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN,
                'Client-Id': CLIENT_ID
            }
        });
        const userData = await userRes.json();
        const broadcasterId = userData.data[0].id;

        const subRes = await fetch('https://api.twitch.tv/helix/subscriptions?broadcaster_id=' + broadcasterId, {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN,
                'Client-Id': CLIENT_ID
            }
        });
        const subData = await subRes.json();
        res.json({ count: subData.total });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 3000);

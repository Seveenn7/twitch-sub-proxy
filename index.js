const express = require('express');
const fetch = require('node-fetch');
const app = express();

const CLIENT_ID = '0bozrbw6s8sb3bd0w1fx0x22hl4tsq';
const CLIENT_SECRET = '1gkhsmc22zkjaeovl4hno0urfhb6x9';
let REFRESH_TOKEN = 'w2orkcxefzn2dmt6ozpvqk7aybmehq4uh48oq6v6ekpuzycqt6';
let ACCESS_TOKEN = 'blgxb8yek3tjojz34z7dml442pfa4p';
const BROADCASTER_ID = '999175722';

async function refreshAccessToken() {
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=refresh_token&refresh_token=' + REFRESH_TOKEN + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    });
    const data = await res.json();
    if (data.access_token) {
        ACCESS_TOKEN = data.access_token;
        REFRESH_TOKEN = data.refresh_token;
    }
}

setInterval(refreshAccessToken, 3 * 60 * 60 * 1000);

app.get('/subs', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cache-Control', 'no-store');
    try {
        let subRes = await fetch('https://api.twitch.tv/helix/subscriptions?broadcaster_id=' + BROADCASTER_ID, {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN,
                'Client-Id': CLIENT_ID
            }
        });

        if (subRes.status === 401) {
            await refreshAccessToken();
            subRes = await fetch('https://api.twitch.tv/helix/subscriptions?broadcaster_id=' + BROADCASTER_ID, {
                headers: {
                    'Authorization': 'Bearer ' + ACCESS_TOKEN,
                    'Client-Id': CLIENT_ID
                }
            });
        }

        const subData = await subRes.json();
        res.json({ count: subData.total });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 3000);

const express = require('express');
const { TwitterClient } = require('agent-twitter-client');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize the Twitter client with your credentials
const twitterClient = new TwitterClient({
  apiKey: process.env.TWITTER_API_KEY,
  apiSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

app.get('/api', async (req, res) => {
  const tweetUrl = req.query.x_url;
  if (!tweetUrl) {
    return res.status(400).json({ error: 'Missing x_url parameter' });
  }

  // Extract tweet ID from the URL; expects a URL containing /status/{tweetId}
  const match = tweetUrl.match(/status\/(\d{10,20})/);
  if (!match) {
    return res.status(400).json({ error: 'Invalid Twitter URL format. Expected URL containing /status/{tweet_id}.' });
  }
  const tweetId = match[1];

  try {
    // Use the twitter client to fetch tweet details by tweet ID.
    // It is assumed that getTweet is a method provided by agent-twitter-client.
    const tweetData = await twitterClient.getTweet(tweetId);
    return res.json(tweetData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

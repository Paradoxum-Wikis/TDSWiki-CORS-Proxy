const fetch = require('node-fetch');
const ALLOWED_ORIGINS = require('./allowedorigin');

// Cache the data in memory with a timestamp
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

module.exports = async (req, res) => {
  const origin = req.headers.origin;

  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // REQUIRE origin header
  if (!origin) {
    res.status(403).send("Poyaya! Origin header required");
    return;
  }
  
  try {
    const { hostname } = new URL(origin);
    if (!ALLOWED_ORIGINS.includes(hostname)) {
      res.status(403).send("Poyaya! Origin is not allowed");
      return;
    }
  } catch (e) {
    res.status(403).send("Poyaya! Invalid origin...");
    return;
  }

  // Check if we need to refresh cache
  const now = Date.now();
  if (!cachedData || now - cacheTimestamp > CACHE_DURATION) {
    try {
      console.log("Cache miss - fetching fresh data");
      const response = await fetch('https://tds.fandom.com/wiki/User:Gabonnie/DBT?action=render');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      cachedData = await response.text();
      cacheTimestamp = now;
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Error fetching data from wiki");
      return;
    }
  } else {
    console.log("Cache hit - serving cached data");
  }

  res.status(200).send(cachedData);
};
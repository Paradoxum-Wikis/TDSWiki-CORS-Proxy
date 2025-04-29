const fetch = require('node-fetch');

// Cache the data in memory with a timestamp
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

module.exports = async (_, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");

  // Check if we need to refresh cache
  const now = Date.now();
  if (!cachedData || now - cacheTimestamp > CACHE_DURATION) {
    try {
      console.log("Cache miss - fetching fresh data");
      const response = await fetch('https://tds.fandom.com/wiki/Special:CategoryTree?target=Category%3ATDSDatabase&mode=pages&namespaces=500');
      cachedData = await response.text();
      cacheTimestamp = now;
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Error fetching data");
      return;
    }
  } else {
    console.log("Cache hit - serving cached data");
  }

  res.status(200).send(cachedData);
};
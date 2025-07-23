const fetch = require('node-fetch');

const CACHE_DURATION = 1209600000; // 2 weeks
let cache = {
  towers: { data: null, timestamp: 0 },
  maps: { data: null, timestamp: 0 }
};

const endpoints = {
  towers: 'https://tds.fandom.com/wiki/Towers?action=raw',
  maps: 'https://tds.fandom.com/wiki/Maps?action=raw'
};

module.exports = async (req, res) => {
  const { type } = req.query;
  if (!['towers', 'maps'].includes(type)) {
    res.status(400).send('Poyaya? That is an invalid type! Use ?type=towers or ?type=maps');
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=1209600, s-maxage=1209600');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const now = Date.now();
  if (!cache[type].data || now - cache[type].timestamp > CACHE_DURATION) {
    try {
      const response = await fetch(endpoints[type]);
      if (!response.ok) throw new Error('Failed to fetch raw data');
      cache[type].data = await response.text();
      cache[type].timestamp = now;
    } catch (err) {
      res.status(500).send('Error fetching data');
      return;
    }
  }

  res.status(200).send(cache[type].data);
};
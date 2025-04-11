const fetch = require('node-fetch');

module.exports = async function(req, res) {
    const { url } = req.query;

    if (!url || !url.startsWith('https://badges.roproxy.com')) {
        return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    try {
        // Add ROBLOSECURITY cookie to requests if needed
        const headers = {};
        if (process.env.ROBLOSECURITY) {
            headers['cookie'] = `.ROBLOSECURITY=${process.env.ROBLOSECURITY}`;
        }

        const response = await fetch(url, { headers });
        const data = await response.json();
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        
        // Set caching headers
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Fetch failed', details: err.message });
    }
};
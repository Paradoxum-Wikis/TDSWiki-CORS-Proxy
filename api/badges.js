const fetch = require('node-fetch');

module.exports = async function(req, res) {
    const badgeUrl = 'https://badges.roproxy.com/v1/badges/2124475816';

    try {
        const response = await fetch(badgeUrl);
        const data = await response.json();

        const count = data?.statistics?.awardedCount || 0;

        // Tell the browser this is a JavaScript file
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Output JavaScript
        res.status(200).send(`window.__updateBadgeCount?.(${count});`);
    } catch (err) {
        res.setHeader('Content-Type', 'application/javascript');
        res.status(500).send(`console.error("Failed to fetch badge count:", ${JSON.stringify(err.message)});`);
    }
};

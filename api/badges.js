const fetch = require('node-fetch');

module.exports = async function(req, res) {
    const { id } = req.query;

    if (!id || !/^\d+$/.test(id)) {
        res.setHeader('Content-Type', 'application/javascript');
        return res.status(400).send(`console.error("Invalid badge ID");`);
    }

    const badgeUrl = `https://badges.roproxy.com/v1/badges/${id}`;

    try {
        const response = await fetch(badgeUrl);
        const data = await response.json();

        const count = data?.statistics?.awardedCount ?? 0;

        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate');
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.status(200).send(`window.__updateBadgeCount?.("${id}", ${count});`);
    } catch (err) {
        res.setHeader('Content-Type', 'application/javascript');
        res.status(500).send(`console.error("Fetch failed for badge ${id}:", ${JSON.stringify(err.message)});`);
    }
};

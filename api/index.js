const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-User-Agent, X-Requested-By');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the target URL from the query parameter
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    // Forward the request to the target URL
    const fetchOptions = {
      method: req.method,
      headers: {
        // Forward headers except host
        ...Object.entries(req.headers).reduce((acc, [key, value]) => {
          if (key !== 'host') {
            acc[key] = value;
          }
          return acc;
        }, {})
      }
    };

    // Forward body for POST requests
    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const proxyResponse = await fetch(targetUrl, fetchOptions);
    
    // Get response data
    const data = await proxyResponse.text();
    
    // Forward the response with the same status code
    res.status(proxyResponse.status);
    
    // Forward response headers
    proxyResponse.headers.forEach((value, key) => {
      // Skip setting these headers as they're handled by Vercel
      if (!['content-length', 'content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    
    res.send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Error proxying request' });
  }
};
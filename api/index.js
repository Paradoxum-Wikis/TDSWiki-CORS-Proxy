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
  
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    // Get custom headers from request
    const userAgent = req.headers['x-user-agent'] || 'Mozilla/5.0 (compatible; VercelCorsProxy/1.0)';
    
    // Forward the request with custom headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Referer': 'https://www.google.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    });
    
    // Get response headers to forward
    const contentType = response.headers.get('content-type') || 'text/plain';
    res.setHeader('Content-Type', contentType);
    
    // Get response body based on content type
    const body = contentType.includes('application/json') 
      ? await response.json() 
      : await response.text();
      
    // Return the response
    if (typeof body === 'object') {
      return res.status(response.status).json(body);
    } else {
      return res.status(response.status).send(body);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Error fetching the requested URL',
      message: error.message
    });
  }
};
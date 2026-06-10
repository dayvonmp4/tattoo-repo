const http = require('http');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }

  const body = JSON.stringify(req.body || {});

  await new Promise((resolve) => {
    const httpReq = http.request({
      hostname: '147.182.133.198',
      port: 3000,
      path: '/submit-intake',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (httpRes) => {
      let data = '';
      httpRes.on('data', (chunk) => { data += chunk; });
      httpRes.on('end', () => {
        try { res.status(httpRes.statusCode).json(JSON.parse(data)); }
        catch { res.status(httpRes.statusCode).end(data); }
        resolve();
      });
    });
    httpReq.on('error', () => { res.status(500).json({ ok: false }); resolve(); });
    httpReq.write(body);
    httpReq.end();
  });
};

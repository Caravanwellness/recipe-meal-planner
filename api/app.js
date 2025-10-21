import fs from 'fs';
import path from 'path';

let htmlContent = null;

function loadApp() {
  if (!htmlContent) {
    const indexPath = path.join(process.cwd(), 'index.html');
    htmlContent = fs.readFileSync(indexPath, 'utf8');
  }
  return htmlContent;
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const html = loadApp();
    res.status(200).send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

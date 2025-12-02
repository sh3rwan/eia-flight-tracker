import fetch from 'node-fetch';
import cheerio from 'cheerio';

// Vercel Serverless Function: /api/flights
export default async function handler(req, res) {
  // Allow CORS so widget can be embedded anywhere.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30'); // CDN caching

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const url = 'https://www.eia.krd/english/flight-information';

  try {
    const response = await fetch(url, { timeout: 10000 });
    const html = await response.text();
    const $ = cheerio.load(html);

    const flights = [];

    // Find the first table on the page and parse tbody rows.
    $('table tbody tr').each((_, row) => {
      const cols = $(row).find('td').map((i, el) => $(el).text().trim()).get();

      // Defensive checks - adjust indexes if EIA changes structure.
      if (cols.length >= 5) {
        flights.push({
          time: cols[0] || '',
          airline: cols[1] || '',
          flight: cols[2] || '',
          destination: cols[3] || '',
          status: cols[4] || ''
        });
      }
    });

    res.status(200).json({ flights, fetched_from: url, fetched_at: new Date().toISOString() });
  } catch (err) {
    console.error('Scrape error', err);
    res.status(500).json({ error: 'Scraper failed', detail: String(err) });
  }
}

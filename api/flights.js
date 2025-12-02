import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.BROWSERLESS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing Browserless API key" });
    }

    const browserlessUrl = `https://chrome.browserless.io/content?token=${apiKey}`;

    // Tell Browserless to load the page with full JS support
    const response = await fetch(browserlessUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: "https://www.eia.krd/english/flight-information",
        waitFor: ".flightDetails",         // the table container
        gotoOptions: { waitUntil: "networkidle0" },
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        stealth: true
      })
    });

    const html = await response.text();

    // PARSE WITH CHEERIO
    const $ = cheerio.load(html);

    let flights = [];

    $(".flightDetails table tbody tr").each((i, el) => {
      const tds = $(el).find("td").map((i, td) => $(td).text().trim()).get();

      if (tds.length >= 5) {
        flights.push({
          flight: tds[0],
          destination: tds[1],
          airline: tds[2],
          time: tds[3],
          status: tds[4]
        });
      }
    });

    return res.status(200).json({ flights });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Scraping failed" });
  }
}

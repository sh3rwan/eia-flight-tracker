export default async function handler(req, res) {
  try {
    const browserlessKey = process.env.BROWSERLESS_KEY;

    const response = await fetch(
      `https://chrome.browserless.io/content?token=${browserlessKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: "https://www.eia.krd/english/flight-information",
          waitFor: "table",

          // Strong Cloudflare Bypass
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Accept":
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Upgrade-Insecure-Requests": "1",
          },

          gotoOptions: {
            waitUntil: "networkidle2",
            timeout: 60000
          }
        })
      }
    );

    const html = await response.text();

    const cheerio = (await import("cheerio")).default;
    const $ = cheerio.load(html);

    let flights = [];

    $("table tbody tr").each((i, row) => {
      const cells = $(row).find("td").map((_, td) => $(td).text().trim()).get();

      if (cells.length >= 5) {
        flights.push({
          time: cells[0] || "",
          airline: cells[1] || "",
          flight: cells[2] || "",
          destination: cells[3] || "",
          status: cells[4] || "",
        });
      }
    });

    return res.status(200).json({ success: true, flights });

  } catch (error) {
    console.error("SCRAPER ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

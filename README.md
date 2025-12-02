# EIA Flight Tracker

Lightweight flight tracker widget that scrapes flight data from Erbil International Airport (EIA) flight information page and exposes a simple JSON API and an embeddable widget.

## Contents
- `/api/flights.js` — Vercel Serverless function that scrapes https://www.eia.krd/english/flight-information and returns JSON.
- `/widget/index.html` — A simple demo page that uses the widget.
- `/widget/widget.js` — Embeddable JavaScript widget (also supports being used as a module).
- `package.json` — Node dependencies for deployment on Vercel.

## Important notes & legal
1. **No official API** — This project scrapes the EIA website. Scraping public websites can be legally or technically restricted. Use responsibly and check the site’s Terms of Use.
2. The scraper is fragile: if EIA changes their HTML structure the parser may break. Adjust selectors in `/api/flights.js` as needed.

## Quick deploy (Vercel)
1. Push the repo to GitHub.
2. Sign in to https://vercel.com and import the GitHub repo.
3. Vercel will detect a Node project automatically. Deploy.
4. After deploy, your API will be at `https://<your-project>.vercel.app/api/flights` and widget demo at `https://<your-project>.vercel.app/widget/`.

## Embedding options

### Iframe (simplest)
```html
<iframe src="https://<your-project>.vercel.app/widget/" style="width:100%;height:420px;border:none"></iframe>

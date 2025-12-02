async function loadFlightsWidget(rootId, apiUrl, options = {}) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const refreshInterval = options.refreshInterval || 60;

  async function fetchFlights() {
    root.innerHTML = `<div class="ft-empty">Loading flights…</div>`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data || !data.flights || data.flights.length === 0) {
        root.innerHTML = `<div class="ft-empty">No flight data available.</div>`;
        return;
      }

      renderTable(data.flights);
    } catch (err) {
      console.error("FLIGHT WIDGET ERROR:", err);
      root.innerHTML = `<div class="ft-empty">Could not load flights.</div>`;
    }
  }

  function renderTable(flights) {
    let html = `
      <table class="ft-table">
        <thead>
          <tr class="ft-header">
            <th>Time</th>
            <th>Airline</th>
            <th>Flight</th>
            <th>Destination</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    flights.forEach(f => {
      html += `
        <tr>
          <td>${f.time}</td>
          <td>${f.airline}</td>
          <td>${f.flight}</td>
          <td>${f.destination}</td>
          <td>${f.status}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    root.innerHTML = html;
  }

  // fetch immediately
  fetchFlights();

  // auto-refresh
  if (refreshInterval > 0) {
    setInterval(fetchFlights, refreshInterval * 1000);
  }
}

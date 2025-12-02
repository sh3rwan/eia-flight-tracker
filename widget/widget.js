// Simple embeddable widget for EIA flights
// Usage:
// loadFlightsWidget(containerId, apiUrl, { refreshInterval: seconds })
export async function loadFlightsWidget(containerId, apiUrl, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Flight widget container not found:', containerId);
    return;
  }

  const refreshInterval = (opts.refreshInterval && Number(opts.refreshInterval)) || 0;
  async function render() {
    container.innerHTML = '<div class="ft-empty">Loading flights…</div>';
    try {
      const res = await fetch(apiUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('API error: ' + res.status);
      const json = await res.json();
      const flights = Array.isArray(json.flights) ? json.flights : [];

      if (flights.length === 0) {
        container.innerHTML = '<div class="ft-empty">No flights found.</div>';
        return;
      }

      let html = '<table class="ft-table"><thead><tr class="ft-header"><th>Time</th><th>Airline</th><th>Flight</th><th>To</th><th>Status</th></tr></thead><tbody>';
      for (const f of flights) {
        html += `<tr><td>${escapeHtml(f.time)}</td><td>${escapeHtml(f.airline)}</td><td>${escapeHtml(f.flight)}</td><td>${escapeHtml(f.destination)}</td><td>${escapeHtml(f.status)}</td></tr>`;
      }
      html += '</tbody></table>';
      container.innerHTML = html;
    } catch (err) {
      console.error(err);
      container.innerHTML = '<div class="ft-empty">Failed to load flights.</div>';
    }
  }

  // run first time
  render();

  // set up refresh if needed
  if (refreshInterval > 0) {
    setInterval(render, refreshInterval * 1000);
  }
}

// Simple HTML escape
function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s).replace(/[&<>"'`=\/]/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;','=':'&#61;','/':'&#47;'}[c];
  });
}

// If widget loaded directly as script tag (not as module), expose global function
if (typeof window !== 'undefined' && !window.loadFlightsWidget) {
  window.loadFlightsWidget = (containerId, apiUrl, opts) => {
    (async () => {
      await (typeof loadFlightsWidget === 'function' ? loadFlightsWidget(containerId, apiUrl, opts) : null);
    })();
  };
}

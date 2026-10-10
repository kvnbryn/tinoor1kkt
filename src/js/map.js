/* ==========================================================================
   LEAFLET MAP MODULE (Kelurahan Tinoor Satu, Tomohon Utara)
   ========================================================================== */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function initMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return;

  // Exact Coordinates for Tinoor Satu, Kec. Tomohon Utara
  const TINOOR_LAT = 1.3800238;
  const TINOOR_LNG = 124.8237803;

  const map = L.map('leaflet-map', {
    scrollWheelZoom: false,
  }).setView([TINOOR_LAT, TINOOR_LNG], 15);

  // OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Custom Green Pin Icon
  const greenIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: #3d920c;
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
      ">
        <svg style="transform: rotate(45deg); width: 20px; height: 20px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  const marker = L.marker([TINOOR_LAT, TINOOR_LNG], { icon: greenIcon }).addTo(map);

  marker.bindPopup(`
    <div style="font-family: Outfit, sans-serif; padding: 4px; max-width: 240px;">
      <h4 style="color: #3d920c; font-weight: 700; margin: 0 0 4px 0; font-size: 14px;">Kelurahan Tinoor Satu</h4>
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #5A5E62; line-height: 1.4;">Jl. Raya Manado - Tomohon, Tinoor Satu, Kec. Tomohon Utara, Kota Tomohon, Sulawesi Utara</p>
      <a href="https://www.google.co.id/maps/place/Tinoor+Satu,+Kec.+Tomohon+Utara,+Kota+Tomohon,+Sulawesi+Utara/@${TINOOR_LAT},${TINOOR_LNG},15z" target="_blank" rel="noopener" style="
        display: inline-block;
        background: #59be23;
        color: #ffffff;
        font-weight: 600;
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 4px;
        text-decoration: none;
      ">Buka di Google Maps &rarr;</a>
    </div>
  `).openPopup();

  // Circle to highlight village administrative boundary area
  L.circle([TINOOR_LAT, TINOOR_LNG], {
    color: '#59be23',
    fillColor: '#6bd731',
    fillOpacity: 0.12,
    radius: 950,
  }).addTo(map);
}

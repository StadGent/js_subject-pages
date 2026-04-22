import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import proj4 from 'proj4';

proj4.defs(
  'EPSG:31370',
  '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 ' +
  '+lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 ' +
  '+ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 ' +
  '+units=m +no_defs'
);

function parseGeometry(geometryStr) {
  const match = geometryStr.match(/POINT\s*\(([^ ]+)\s+([^ )]+)\)/);
  if (!match) return null;
  return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
}

export default class LocationMapComponent extends Component {
  @tracked map = null;
  @tracked isLoading = false;
  @tracked error = null;

  @action
  async initMap(element) {
    this.isLoading = true;
    this.error = null;

    try {
      const coords = parseGeometry(this.args.geometry);
      if (!coords) {
        throw new Error('Invalid geometry format');
      }

      const L = (await import('leaflet')).default;

      const [lng, lat] = proj4('EPSG:31370', 'WGS84', [coords.x, coords.y]);

      this.map = L.map(element, { zoomControl: false, attributionControl: false }).setView([lat, lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);

      L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: '#1D9E75',
        color: '#0F6E56',
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(this.map).bindPopup('Locatie').openPopup();
    } catch (err) {
      this.error = err.message;
      console.error('Map initialization failed:', err);
    } finally {
      this.isLoading = false;
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

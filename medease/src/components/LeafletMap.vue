<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="leaflet-map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import axios from 'axios';

// Fix default marker icons (Leaflet issue with Webpack/Vite)
const iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href;
const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href;
const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export default {
  name: 'LeafletMap',
  props: {
    center: {
      type: Array,
      default: () =>  [36.8065, 10.1815],
    },
    zoom: {
      type: Number,
      default: 7,
    },
  },
  data() {
    return {
      map: null,
      geocoder: null,
      markers: [],
      hospitals: [],
    };
  },
  async mounted() {
    this.initMap();
    this.addGeocoder();
    await this.fetchHospitals();
    this.addHospitalMarkers();
  },
  methods: {
    async fetchHospitals() {
      try {
        const res = await axios.get('http://localhost:3001/api/hospitals');
        this.hospitals = res.data;
      } catch (e) {
        this.hospitals = [];
      }
    },

    initMap() {
      this.map = L.map(this.$refs.mapContainer).setView(this.center, this.zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);
    },

    addGeocoder() {
      this.geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        collapsed: false,
      });
      this.geocoder.addTo(this.map);
      this.geocoder.on('markgeocode', (e) => {
        const bbox = e.geocode.bbox;
        this.map.fitBounds(bbox);
        // Optionally, add a marker at the searched location
        const marker = L.marker(e.geocode.center).addTo(this.map);
        marker.bindPopup(e.geocode.name).openPopup();
        this.markers.push(marker);
      });
    },

    addHospitalMarkers() {
      this.clearMarkers();

      const typeIcons = {
        General: this.createIcon('blue'),
        Private: this.createIcon('green'),
        Public: this.createIcon('red'),
        Specialized: this.createIcon('orange'),
        Teaching: this.createIcon('purple'),
        Surgical: this.createIcon('pink'),
      };

      (this.hospitals || []).forEach(hospital => {
        const marker = L.marker([hospital.latitude, hospital.longitude], {
          icon: typeIcons[hospital.type] || typeIcons.General,
        })
          .addTo(this.map)
          .bindPopup(`
            <b>${hospital.name}</b><br>
            Type: ${hospital.type}<br>
            Address: ${hospital.address}<br>
            Phone: ${hospital.phone}
          `);

        this.markers.push(marker);
      });

      if (this.markers.length > 0) {
        const group = new L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
      }
    },

    createIcon(color) {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color:${color}; width:20px; height:20px; border-radius:50%; border:2px solid white; display:flex; justify-content:center; align-items:center; color:white; font-weight:bold;">H</div>`,
        iconSize: [24, 24],
      });
    },

    clearMarkers() {
      this.markers.forEach(marker => marker.remove());
      this.markers = [];
    },
  },
  beforeDestroy() {
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>

<style scoped>
.leaflet-map {
  height: 500px;
  width: 100%;
  border-radius: 8px;
}

.map-wrapper {
  position: relative;
}

.leaflet-control-geocoder {
  z-index: 1000 !important;
  position: absolute !important;
  top: 10px;
  left: 50px;
  width: 300px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

:deep(.leaflet-control-geocoder input) {
  color: #000 !important;
  background: #fff !important;
}

.custom-marker {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

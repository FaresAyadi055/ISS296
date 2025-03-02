<template>
  <div ref="mapContainer" class="leaflet-map"></div>
</template>

<script>
import L from 'leaflet'; // Import Leaflet
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { Geocoder, geocoders } from 'leaflet-control-geocoder'; // Import Geocoder
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Import Geocoder CSS

export default {
  name: 'LeafletMap',
  props: {
    center: {
      type: Array, // [lat, lng]
      default: () => [36.8065, 10.1815], // Default to Tunis
    },
    zoom: {
      type: Number,
      default: 13, // Default zoom level
    },
  },
  data() {
    return {
      map: null, // Leaflet map instance
      geocoder: null, // Geocoder instance
    };
  },
  mounted() {
    this.initMap();
    this.addGeocoder();
    this.searchHospitals();
  },
  methods: {
    // Initialize the map
    initMap() {
      this.map = L.map(this.$refs.mapContainer).setView(this.center, this.zoom);

      // Add a tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);
    },

    // Add geocoder (without displaying the search bar)
    addGeocoder() {
      this.geocoder = new Geocoder({
        defaultMarkGeocode: false, // Disable default marker
        collapsed: false, // Hide the search bar
      });

      // Add the geocoder to the map (but keep it hidden)
      this.geocoder.addTo(this.map);
    },

    // Programmatically search for "hospitals"
    searchHospitals() {
      const query = 'hospitals near Tunis';

      // Use the geocoder to search for the query
      this.geocoder.geocode(query, (results) => {
        if (results.length > 0) {
          // Center the map on the first result
          const firstResult = results[0];
          this.map.setView(firstResult.center, 13);

          // Add markers for all results (using the default red marker)
          results.forEach((result) => {
            const { center, name } = result;
            L.marker(center) // No custom icon, so it uses the default red marker
              .addTo(this.map)
              .bindPopup(`<b>${name}</b>`);
          });
        } else {
          console.warn('No hospitals found.');
        }
      });
    },
  },
  beforeDestroy() {
    // Clean up the map instance when the component is destroyed
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>

<style scoped>
.map-container {
  background: white; /* Set the background of the parent container to white */
  padding: 16px; /* Optional: Add padding */
  border-radius: 8px; /* Optional: Add rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: Add a shadow */
}

.leaflet-map {
  height: 500px; /* Set a fixed height for the map */
  width: 100%; /* Full width */
  border-radius: 8px; /* Optional: Add rounded corners */
}
</style>

<template>
  <div style="height: 100%; width: 100%">

<!--    <div class="info">-->
<!--    <div class="info" style="height: 15%">-->
<!--      <span>Center: {{ center }}</span>-->
<!--      <span>Zoom: {{ zoom }}</span>-->
<!--      <span>Bounds: {{ bounds }}</span>-->
<!--    </div>-->
    
    <l-map
      style="height: 800px; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
    </l-map>
  </div>
</template>


<script>
    // import $ from 'jquery'

    import { LMap, LTileLayer } from "vue2-leaflet";
    import { latLng } from "leaflet";
    
    import MarkerPopup from "./MarkerPopup";

    const methods = {
        varLogger(feature) {
            let logData = feature;
            return {
                zoom: 11,
                text: "my marker popup text",
            };
        }
    };
    
    export default {
        name: "MarkerPopupExample",
        components: {
            LMap,
            LTileLayer,
            MarkerPopup
        },
        methods: {
            zoomUpdated (zoom) {
                this.zoom = zoom;
            },
            centerUpdated (center) {
                this.center = center;
            },
            boundsUpdated (bounds) {
                this.bounds = bounds;
            }
        },
        data() {
            console.log('ok');
            return {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoom: 14,
                // center: [59.9416, 30.312996],
                center: [55.758804, 37.620449],
                bounds: null
            }
        }
    }
    


</script>

<style scoped>

</style>
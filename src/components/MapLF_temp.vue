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
      <l-tile-layer :url="url" />
  
      <l-marker
        v-for="marker in markers"
        :key="marker.id"
        :visible="marker.visible"
        :draggable="marker.draggable"
        :lat-lng.sync="marker.position"
        :icon="marker.icon"
        @click="alert(marker)"
      >
        <l-popup :content="marker.tooltip" />
        <l-tooltip :content="marker.tooltip" />
        <l-icon
          :icon-size="dynamicSize"
          :icon-anchor="dynamicAnchor">
<!--          icon-url="'${publicPath}baseline_account_balance.png'"/>-->

<!--          <div class="headline">dsadsadasd</div>-->
<!--          <img :src="`${publicPath}baseline_account_balance.png`" />-->
<!--          <img :src="`${publicPath}account_balance.svg`" />-->
          <q-icon name="warning" class="text-red" style="font-size: 2rem;" />
        </l-icon>
      </l-marker>
      
      <l-layer-group
        v-for="item in stuff"
        :key="item.id"
        :visible="item.visible"
        layer-type="overlay"
        name="Layer 1"
      >
        <l-layer-group :visible="item.markersVisible">
          <l-marker
            v-for="marker in item.markers"
            :key="marker.id"
            :visible="marker.visible"
            :draggable="marker.draggable"
            :lat-lng="marker.position"
            @click="alert(marker)"
          >
<!--            <l-popup :content="marker.tooltip" />-->
<!--            <l-tooltip :content="marker.tooltip" />-->
<!--            <q-icon name="warning" />-->
            
          </l-marker>
        </l-layer-group>
      </l-layer-group>
    
    </l-map>
  </div>
</template>


<script>
    import { each} from 'jquery'

    // import { LMap, LTileLayer, LLayerGroup } from "vue2-leaflet";
    import { icon, latLngBounds } from "leaflet";
    import {
        LMap,
        LTileLayer,
        LMarker,
        LPolyline,
        LLayerGroup,
        LTooltip,
        LPopup,
        LControlZoom,
        LControlAttribution,
        LControlScale,
        LControlLayers,
        LIcon
    } from "vue2-leaflet";
    import { latLng, marker } from "leaflet";
    // import baseline_account_balance from '~/statics';
    
    // import MarkerPopup from "./MarkerPopup";
    import { EventBus } from "../eventBus";
    import json from '../data/mapPoints-02';
    
    // console.log(json);
    const markers1 = json;

    const methods = {
        varLogger(feature) {
            let logData = feature;
            return {
                zoom: 7,
                text: "my marker popup text",
            };
        }
    };
    
    export default {
        name: "MapLFff",
        components: {
            LMap,
            LTileLayer,
            LMarker,
            LPolyline,
            LLayerGroup,
            LTooltip,
            LPopup,
            LControlZoom,
            LControlAttribution,
            LControlScale,
            LControlLayers,
            LIcon,
            // MarkerPopup
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
            },
            alert(item) {
                // alert("this is " + JSON.stringify(item));
                console.log("this is " + JSON.stringify(item));
            },
        },
        data() {
            console.log('ok');
            return {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoom: 13,
                // center: [59.9416, 30.312996],
                center: [55.758804, 37.620449],
                bounds: null,
                clickCounter: 1,
                // imgData: baseline_account_balance,
                publicPath: process.env.BASE_URL,
                markers: [
                    {
                        id: "m1",
                        position: { lat: 55.77386963550732, lng: 37.6194190979004 },
                        tooltip: "tooltip for marker1",
                        draggable: true,
                        visible: true,
                        // icon: new LIcon({
                        //     prefix: "",
                        //     glyph: "A"
                        // })
                    },
                    {
                        id: "m2",
                        position: { lat: 51.8905, lng: -0.09 },
                        tooltip: "tooltip for marker2",
                        draggable: true,
                        visible: false
                    },
                    {
                        id: "m3",
                        position: { lat: 51.005, lng: -0.09 },
                        tooltip: "tooltip for marker3",
                        draggable: true,
                        visible: true
                    },
                    {
                        id: "m4",
                        position: { lat: 50.7605, lng: -0.09 },
                        tooltip: "tooltip for marker4",
                        draggable: true,
                        visible: false
                    }
                ],
                polylines: [
                    {
                        id: "p1",
                        points: [
                            { lat: 37.772, lng: -122.214 },
                            { lat: 21.291, lng: -157.821 },
                            { lat: -18.142, lng: -181.569 },
                            { lat: -27.467, lng: -206.973 }
                        ],
                        visible: true
                    },
                    {
                        id: "p2",
                        points: [[-73.91, 40.78], [-87.62, 41.83], [-96.72, 32.76]],
                        visible: true
                    }
                ],
                stuff: [
                    {
                        id: "s1",
                        markers: markers1,
                        // polyline: { points: poly1, visible: true },
                        visible: true,
                        markersVisible: true
                    }
                ],
            }
        },
        computed: {
            dynamicSize () {
                return [this.iconSize, this.iconSize * 1.35];
            },
            dynamicAnchor () {
                return [this.iconSize / 2, this.iconSize * 1.35];
            }
        },
        created() {
            EventBus.$on("testData", inputWord => {
                if (this.clickCounter <=5) {
                console.log(inputWord + ' Count: ' + this.clickCounter);
                this.clickCounter += 1;
                } else {
                    console.log('Stop Listening' + ' Count: ' + this.clickCounter);
                    EventBus.$off();
                }
            });
            each(markers1, function(key, value) {
                console.log(key, value);
                if (value.tooltip) {
                    // console.log('fffffffffff')
                } else {
                    markers1[key].tooltip = 'This is marker for '+key;
                }
            });
            // marker([50.5, 30.5]).addTo(map);
        },
    }
    


</script>

<style scoped>

</style>
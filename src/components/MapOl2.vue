<template>
  <!--    <div>-->
  <!--        <p>dsad sa das das</p>-->
  
  <!--        <div id="map" class="map"></div>-->
  <!--        <div class="options" >-->
  <!--            Info:<br/>-->
  <!--            <textarea id="info" style="width:28em; height:10em"></textarea>-->
  <!--        </div>-->
  <!--    </div>-->
  
  <div>
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" style="height: 600px"
            data-projection="EPSG:4326" @mounted="onMapMounted" @postcompose="onMapPostCompose">
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>
      
      <vl-geoloc @update:position="geolocPosition = $event">
        <template slot-scope="geoloc">
          <vl-feature v-if="geoloc.position" id="position-feature">
            <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
            <vl-style-box>
              <vl-style-icon src="_media/marker.png" :scale="0.4"
                             :anchor="[0.5, 1]"></vl-style-icon>
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc>
      
      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
    <div style="padding: 20px">
      Zoom: {{ zoom }}<br>
      Center: {{ center }}<br>
      Rotation: {{ rotation }}<br>
      My geolocation: {{ geolocPosition }}
    </div>
  </div>
</template>


<script>
    // import $ from 'jquery'
    import Vue from 'vue'
    import {Map, TileLayer, OsmSource, Geoloc,} from 'vuelayers'
    // import { createProj, addProj, findPointOnSurface, createStyle, createMultiPointGeom, loadingBBox } from 'vuelayers/lib/ol-ext'
    import {createStyle} from 'vuelayers/lib/ol-ext'
    // import {fromLonLat} from 'ol/proj';
    // import 'vuelayers/lib/style.css' // needs css-loader
    import ScaleLine from 'ol/control/ScaleLine'
    import FullScreen from 'ol/control/FullScreen'
    import OverviewMap from 'ol/control/OverviewMap'
    import ZoomSlider from 'ol/control/ZoomSlider'

    Vue.use(Map);
    Vue.use(TileLayer);
    Vue.use(OsmSource);
    Vue.use(Geoloc);

    const easeInOut = t => 1 - Math.pow(1 - t, 3);

    const methods = {
        selectFilter (feature) {
            return ['position-feature'].indexOf(feature.getId()) === -1
        },
        onUpdatePosition (coordinate) {
            this.deviceCoordinate = coordinate
        },
        onMapPostCompose ({ vectorContext, frameState }) {
            if (!this.$refs.marker || !this.$refs.marker.$feature) return
            const feature = this.$refs.marker.$feature
            if (!feature.getGeometry() || !feature.getStyle()) return
            const flashGeom = feature.getGeometry().clone()
            const duration = feature.get('duration')
            const elapsed = frameState.time - feature.get('start')
            const elapsedRatio = elapsed / duration
            const radius = easeInOut(elapsedRatio) * 35 + 5
            const opacity = easeInOut(1 - elapsedRatio)
            const fillOpacity = easeInOut(0.5 - elapsedRatio)
            vectorContext.setStyle(createStyle({
                imageRadius: radius,
                fillColor: [119, 170, 203, fillOpacity],
                strokeColor: [119, 170, 203, opacity],
                strokeWidth: 2 + opacity,
            }))
            vectorContext.drawGeometry(flashGeom)
            vectorContext.setStyle(feature.getStyle()(feature)[0])
            vectorContext.drawGeometry(feature.getGeometry())
            if (elapsed > duration) {
                feature.set('start', Date.now())
            }
            this.$refs.map.render()
        },
        onMapMounted () {
            // now ol.Map instance is ready and we can work with it directly
            this.$refs.map.$map.getControls().extend([
                new ScaleLine(),
                new FullScreen(),
                new OverviewMap({
                    collapsed: false,
                    collapsible: true,
                }),
                new ZoomSlider(),
            ])
        },
    };

    export default {
        name: "MapOl2",
        methods,
        data() {
            console.log(this.map);
            return {
                // zoom: 2,
                center: [30.359855995996185, 59.94046940429652],
                rotation: 0,
                geolocPosition: undefined,
                // center: fromLonLat([30.341923, 59.954014]),
                zoom: 12,
            }
        }
    }
    


</script>

<style scoped>

</style>
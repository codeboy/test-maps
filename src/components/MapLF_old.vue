<template>
  <div style="height: 800px; width: 100%">
    <div id="mapBlock" ref="mapElement" style="width: 100%; height: 100% ">
<!--      <ul>-->
<!--        <li v-for="(item, index) in markers" :key="index.id">-->
<!--          {{ index }} - {{ item }}-->
<!--        </li>-->
<!--      </ul>-->
    </div>

  </div>
</template>


<script>

    import { icon, latLngBounds } from "leaflet";
    import { latLng, marker, map } from "leaflet";
    import L from "leaflet";
    require("leaflet-editable/src/Leaflet.Editable.js");
    require("leaflet.awesome-markers/dist/leaflet.awesome-markers.min.js");
    require("leaflet.awesome-markers/dist/leaflet.awesome-markers.css");
    
    import { EventBus } from "../eventBus";
    import json from '../data/mapPoints-02';
    import json2 from '../data/mapPoints-03';
    
    const markers1 = json;
    const markers2 = json2;

    export default {
        name: "MapLeafVanila",
        components: {
            // map,
            L,
        },
        data() {
            return {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                // url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ZQzvYVTGqgp3GTSZ6Ox4',
                zoom: 14,
                minZoom: 4,
                center: [55.758804, 37.620449],
                bounds: null,
                map: null,
                markers: markers1,
                mapLayers: [],
                tileLayers: [],
                mapControls: null,
                TLattribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                TLmaxNativeZoom:21,
                TLmaxZoom:21,
                TLmaptailer: L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ZQzvYVTGqgp3GTSZ6Ox4',{
                    tileSize: 512,
                    zoomOffset: -1,
                    minZoom: 1,
                    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
                    crossOrigin: true,
                    maxZoom: 25
                }),
                paspObjects: [],
            }
        },
        computed: {
            girlSvg () {
                const colorFace = this.colorFace.replace('#', '%23');
                const colorHair = this.colorHair.replace('#', '%23');
                return `img:data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="none" fill="${colorFace}"><path fill="none" d="M0 0h24v24H0V0z"/><path stroke="${colorHair}" fill="${colorHair}" stroke-linecap="round" opacity=".5" d="M17.5 8c.46 0 .91-.05 1.34-.12C17.44 5.56 14.9 4 12 4c-.46 0-.91.05-1.34.12C12.06 6.44 14.6 8 17.5 8zM8.08 5.03C6.37 6 5.05 7.58 4.42 9.47c1.71-.97 3.03-2.55 3.66-4.44z"/><path stroke="none" fill="${colorFace}" stroke-linecap="round"  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c2.9 0 5.44 1.56 6.84 3.88-.43.07-.88.12-1.34.12-2.9 0-5.44-1.56-6.84-3.88.43-.07.88-.12 1.34-.12zM8.08 5.03C7.45 6.92 6.13 8.5 4.42 9.47 5.05 7.58 6.37 6 8.08 5.03zM12 20c-4.41 0-8-3.59-8-8 0-.05.01-.1.01-.15 2.6-.98 4.68-2.99 5.74-5.55 1.83 2.26 4.62 3.7 7.75 3.7.75 0 1.47-.09 2.17-.24.21.71.33 1.46.33 2.24 0 4.41-3.59 8-8 8z"/><circle cx="9" cy="13" r="1.25"/><circle cx="15" cy="13" r="1.25"/></svg>`
            }
        },
        created() {
            EventBus.$on("testData", inputWord => {
            });
        },
        mounted() {
            let vm = this;
            vm.map = L.map(this.$refs['mapElement'], {
                center: vm.center,
                zoom: vm.zoom,
                minZoom: vm.minZoom,
                editable: true
            });
            let tTileLayer = L.tileLayer(vm.url, {
                attribution: vm.TLattribution,
                maxNativeZoom: vm.TLmaxNativeZoom,
                maxZoom: vm.TLmaxZoom,
                // tileSize: 256,
            });
            vm.tileLayers['Слой с картой'] = tTileLayer;
            // tTileLayer.addTo(vm.map);
            vm.TLmaptailer.addTo(vm.map);
            vm.map.on('zoomend', function (e) {
                console.log('zoom level: '+e.target._zoom);
            });
            
            // тестовый полилайн
            let line = L.polyline([
                [55.74982058591534, 37.62843132019044],
                [55.76267368264763, 37.59308944702149],
                [55.77377308264063, 37.60808944702123],
            ]).addTo(vm.map);
            line.enableEdit();
            vm.map.on('editable:editing', function (e) {
                e.layer.setStyle({
                    color: 'DarkRed',
                    // weight: 8,
                    // lineCap: 'round'
                    // dashArray: [6, 5]
                    smoothFactor:10,
                    iconSize: [250, 250],
                    iconAnchor: [100, 100],
                    popupAnchor: [70, 100],
                    tooltipAnchor: [20, 50],
                });
            });
            
            vm.map.on('editable:drawing:start', function () {console.log('0000');});
            vm.map.on('editable:drawing:end', function (e) {
                console.log('editable:drawing:end');
                e.layer.setStyle({color: '#3388ff'})
            });
            vm.map.on('editable:drawing:commit', function () {console.log('1111');});
            vm.map.on('editable:vertex:dragend', function (e) {
                // console.log(e);
                console.log(e.vertex.latlng.lat, e.vertex.latlng.lng);
                e.layer.setStyle({color: '#3388ff'})
            });

            L.NewLineControl = L.Control.extend({
                options: {
                    position: 'topleft'
                },
                onAdd: function (map) {
                    var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
                        link = L.DomUtil.create('a', '', container);
                    link.href = '#';
                    link.title = 'Create a new line';
                    link.innerHTML = '/\\/';
                    L.DomEvent.on(link, 'click', L.DomEvent.stop)
                        .on(link, 'click', function () {
                            map.editTools.startPolyline();
                        });
                    return container;
                }
            });
            vm.map.addControl(new L.NewLineControl());


            // пример одиночного маркера
            // L.marker([55.74982058591534, 37.62843132019044], {
            //     draggable: true,
            //     // url: 'baseline_account_balance.png',
            //     iconUrl: 'static/baseline_account_balance.png',
            //     iconSize: [25, 25],
            //     iconAnchor: [10, 10],
            //     popupAnchor: [7, 10],
            //     tooltipAnchor: [2, 5],
            // }).addTo(vm.map).bindPopup('Базовый маркер без слоя');

            L.marker([55.75581008948492, 37.635984420776374],{
                icon: L.AwesomeMarkers.icon({
                    icon: 'coffee', prefix: 'fa', markerColor: 'red', iconColor: '#f2eb9e'}),
                draggable: true,
                }).addTo(vm.map);

            var tControl = L.control.layers(null, vm.mapLayers);
            vm.mapControls = tControl;
            vm.mapControls.addTo(vm.map);
            
            vm.createMarkers(vm.markers, 'Слой с данными', 900);
            vm.createMarkers(markers2, 'Слой с данными 2', 700);
            vm.createPylon();
            
        },
        methods: {
            /**
             * Метод рисует маркеры, передавать можно из json файла
             * формат списка (все параметры, кроме position необязательны):
             * [{
             *  "position": { "lat":55.76459946959135,"lng":37.6165008544921955 },
             *  "visible": true, - видимость todo: get work
             *  "draggable": true, - таскабельность
             *  "tooltip" : "Test tooltip", - подсказка
             *  "iconName": "call_made" - имя иконки
             *  "iconSize": "42px", - размер иконки
             *  "iconColor": "teal" - цвет иконки
             * }]
             * @param markersList -  список маркеров
             * @param markerLayer - необязательно : имя группы объектов для общего изменения
             */
            createMarkers: function(markersList, markerLayer, zindex){
                var vm = this;
                var tMarkers = undefined;
                var tLayerGroup = L.layerGroup();
                // if (markerLayer) {
                //     vm.mapLayers[markerLayer] = L.layerGroup();
                // }
                
                var iconName = 'call_made';
                var iconSize = '32px';
                var iconColor = 'primary';
                
                markersList.forEach(function (item, index) {
                    if (item.iconName) {iconName = item.iconName}
                    if (item.iconSize) {iconSize = item.iconSize}
                    if (item.iconColor) {iconColor = item.iconColor}
                    var iconHtml = '<i aria-hidden="true" class="material-icons text-'+iconColor+
                        '" style="padding: 0 0; font-size: '+iconSize+';">'+iconName+'</i>';
                    var tooltip = undefined;
                    var myIcon = L.divIcon({className: 'material-icons', html:iconHtml});

                    var markerOptions = {
                        draggable: item.draggable,
                        // icon: myIcon,
                        zIndexOffset: zindex,
                        iconSize: [25, 25],
                        iconAnchor: [10, 10],
                        popupAnchor: [7, 10],
                        tooltipAnchor: [2, 5],
                    };

                    if (item.iconName) {
                        markerOptions = vm.extend(markerOptions, {
                            icon: myIcon,
                        });
                    }
                    if (item.tooltip) {tooltip = item.tooltip;}
                    else {tooltip = 'This is marker for '+index;}

                    var marker = L.marker([item.position.lat, item.position.lng], markerOptions)
                        .bindPopup(tooltip);
                    marker.on('dragend', function(event) {
                        var latlng = event.target.getLatLng();
                        console.log('"lat":'+latlng.lat+',"lng":'+latlng.lng);
                    });
                    if (markerLayer) {
                      tLayerGroup.addLayer(marker);
                    } else {
                            marker.addTo(vm.map);
                    }
                });
                
                if(markerLayer){
                    // vm.mapLayers.push(tLayerGroup);
                    vm.mapLayers[markerLayer] = tLayerGroup;
                    // vm.mapLayers[markerLayer].addTo(vm.map);
                    // L.control.layers(null, vm.mapLayers).remove();
                    tLayerGroup.setZIndex(zindex);
                    vm.mapLayers[markerLayer].addTo(vm.map);
                    vm.mapControls.remove();
                    vm.mapControls = L.control.layers(null, vm.mapLayers);
                    vm.mapControls.addTo(vm.map);
                }
            },
            
            // todo: check for usable
            addLayerControl: function() {
            },
            
            createPylon: function() {
                let vm = this;
                let tMap = vm.map;

                // var popup = L.popup();
                // function onMapClick(e) {
                //     popup
                //         .setLatLng(e.latlng)
                //         .setContent("You clicked the map at " + e.latlng.toString())
                //         .openOn(tMap);
                // }


                let linePath = [];
                let lineH = 0.002;
                let lineW = 0.007;
                function onMapClick(e) {
                    // console.log(e.latlng.toString());
                    console.log(e.latlng.lat, e.latlng.lng);
                    let baseCoords = e.latlng;
                    linePath.push(baseCoords);
                    linePath.push([baseCoords.lat+lineH, baseCoords.lng]);
                    linePath.push([baseCoords.lat+lineH, baseCoords.lng+lineW]);
                    // linePath.push([baseCoords.lat-lineH, baseCoords.lng+(lineW-lineH)]);
                    linePath.push([baseCoords.lat, baseCoords.lng+lineW]);
                    console.log(linePath);
                    let line = L.polyline(linePath).addTo(vm.map);
                    line.enableEdit();
                }
                tMap.once('click', onMapClick);
            },
            
            alert(item) {
                console.log("this is " + JSON.stringify(item));
            },

            /**
             * кастомный форыч для перебора объекта
             */
            forEachIn: function (obj, fn) {
                var index = 0;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        fn(obj[key], key, index++);
                    }
                }
            },
            /**
             * дополняет объект
             */
            extend: function () {
                var result = {};
                for (var i = 0; i < arguments.length; i++) {
                    this.forEachIn(arguments[i],
                        function(obj, key) {
                            result[key] = obj;
                        });
                }
                return result;
            }
        },
    }
    
</script>

<style scoped>
  
  #tooltip {
    display: none;
    position: absolute;
    background: #666;
    color: white;
    opacity: 0.5;
    padding: 10px;
    border: 1px dashed #999;
    font-family: sans-serif;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    z-index: 1000;
  }
  /*.leaflet-marker-icon, .leaflet-div-icon, .leaflet-vertex-icon, .leaflet-zoom-animated, .leaflet-interactive, .leaflet-marker-draggable, .leaflet-marker-draggable {*/
  /*  width: 100px;*/
  /*  height: 100px;*/
  /*}*/

</style>
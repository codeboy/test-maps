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
    import axios from 'axios'

    require("leaflet-editable/src/Leaflet.Editable.js");
    
    require("leaflet.awesome-markers/dist/leaflet.awesome-markers.min.js");
    require("leaflet.awesome-markers/dist/leaflet.awesome-markers.css");
    
    require("leaflet.markercluster/dist/leaflet.markercluster.js");
    require("leaflet.markercluster/dist/MarkerCluster.css");
    require("leaflet.markercluster/dist/MarkerCluster.Default.css");

    // require('leaflet-path-transform');
    require('leaflet-path-transform/dist/L.Path.Transform.js');
    
    import { EventBus } from "../eventBus";
    // import json from '../data/mapPoints-02';
    // import json2 from '../data/mapPoints-03';
    import json_markers from '../data/facility';
    
    // const markers1 = json;
    // const markers2 = json2;
    const markers_facility = json_markers;

    export default {
        name: "MapLF2",
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
                // markers: markers1,
                mapLayers: [],
                tileLayers: [],
                mapControls: null,
                mapDrawControls: [],
                mapViewMode: 'all',
                TLattribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                TLmaxNativeZoom:19,
                TLmaxZoom:19,
                TLmaptailer: L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ZQzvYVTGqgp3GTSZ6Ox4',{
                    tileSize: 512,
                    zoomOffset: -1,
                    minZoom: 1,
                    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
                    crossOrigin: true,
                    maxZoom: 25
                }),
                passpObjects: [],
                drawedObjects: {
                    'sup': [],
                    'tl': [],
                    'lines': [],
                },
            }
        },
        computed: {
        },
        watch: {
            mapViewMode: function (e) {
                this.eventMapViewMode(e);
            }
        },
        created() {
            EventBus.$on("mapViewMode", inputWord => {
                this.mapViewMode=inputWord;
            });
        },
        mounted() {
            let vm = this;
            vm.map = L.map(this.$refs['mapElement'], {
                center: vm.center,
                zoom: vm.zoom,
                minZoom: vm.minZoom,
                editable: true,
                skipMiddleMarkers: true,
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
            

            // L.NewLineControl = L.Control.extend({
            //     options: {
            //         position: 'topleft'
            //     },
            //     onAdd: function (map) {
            //         var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
            //             link = L.DomUtil.create('a', '', container);
            //         link.href = '#';
            //         link.title = 'Create a new line';
            //         link.innerHTML = '/\\/';
            //         L.DomEvent.on(link, 'click', L.DomEvent.stop)
            //             .on(link, 'click', function () {
            //                 map.editTools.startPolyline();
            //             });
            //         return container;
            //     }
            // });
            // vm.map.addControl(new L.NewLineControl());
            
            // пример одиночного маркера
            // L.marker([55.75581008948492, 37.635984420776374],{
            //       icon: L.AwesomeMarkers.icon({
            //           icon: 'coffee', prefix: 'fa', markerColor: 'red', iconColor: '#f2eb9e'}),
            //     draggable: true,
            //     }).addTo(vm.map);

            // axios.get('facility.json').then(response => {
            //     console.log(
            //         response.data.filter(element => {
            //             return element.lat !== undefined && element.lng !== undefined
            //         })
            //     )
            // });

            // vm.drawSomeCross();
            vm.addMarkersFacility();
        },
        
        methods: {
            /**
             * добавляем маркеры из набора данных json
             **/
            addMarkersFacility: function () {
                let vm = this;
                let tLayerGroup1 = L.layerGroup();
                let tLayerGroup2 = L.layerGroup();
                let markers1 = L.markerClusterGroup({showCoverageOnHover: false});
                let markers2 = L.markerClusterGroup({showCoverageOnHover: false});
                
                markers_facility.forEach(function (item, index){
                    // console.log(item, index)
                    let iconColor = 'darkred';
                    if (item.id != null) {
                        iconColor = 'darkblue'
                    }

                    var markerOptions = {
                        // draggable: item.draggable,
                        // icon: myIcon,
                        // zIndexOffset: zindex,
                        // iconSize: [25, 25],
                        // iconAnchor: [10, 10],
                        // popupAnchor: [7, 10],
                        // tooltipAnchor: [2, 5],
                        custom: item,
                        icon: L.AwesomeMarkers.icon({
                            icon: 'traffic-light',
                            prefix: 'fa',
                            markerColor: iconColor,
                            // iconColor: '#f2eb9e'
                        })
                    };
                    var marker = L.marker([item.lat, item.lng], markerOptions);

                    marker.on('click', function(e) {
                        // console.log(e.sourceTarget.options.custom);
                        vm.showPasspObj(e.sourceTarget.options);
                    });
                    marker.on('mouseover', function (e) {
                    });

                    if (item.id != null) {
                        markers1.addLayer(marker)
                    } else {
                        markers2.addLayer(marker)
                    }
                });
                let layerName2 = 'Пустые объекты',
                    layerName1 = 'Объекты с данными';
                vm.mapLayers[layerName1] = markers1;
                vm.mapLayers[layerName1].addTo(vm.map);
                
                vm.mapLayers[layerName2] = markers2;
                vm.mapLayers[layerName2].addTo(vm.map);
                
                // vm.mapControls = L.control.layers(null, vm.mapLayers);
                // vm.mapControls.addTo(vm.map);

                // vm.addGLayers();
            },
            
            // добавляем слои c объектами для редактирования
            addGLayers: function() {
                let vm = this;
                vm.forEachIn(vm.mapLayers, function (item, index) {
                    item.addTo(vm.map);
                });
                // vm.mapControls = L.control.layers(null, vm.mapLayers);
                // vm.mapControls.addTo(vm.map);
            },

            // убираем слои для редактирования
            removeGLayers: function() {
                let vm = this;
                vm.forEachIn(vm.mapLayers, function (item, index) {
                    item.removeFrom(vm.map);
                });
                // vm.mapControls.remove();
            },
            
            showPasspObj: function (objOpt) {
                let vm = this;
                // console.log(objOpt);
                // vm.removeGLayers();
                vm.map.setView([objOpt.custom.lat, objOpt.custom.lng], 20);

                let crossMarker = L.marker([objOpt.custom.lat, objOpt.custom.lng],{
                  icon: L.AwesomeMarkers.icon({
                      icon: 'traffic-light', prefix: 'fa', markerColor: 'gray'}),
                  draggable: false,
                });
                crossMarker.addTo(vm.map);
                EventBus.$emit("leftMenuMode", 'pagePassport');
                
                vm.drawerControlsShow();
                
                // при отдалении карты возвращаем объекты
                function onZoom1(e){
                    if (vm.map.getZoom() < 19) {
                        crossMarker.removeFrom(vm.map);
                        vm.drawerControlsHide();
                        // vm.addGLayers();
                        vm.mapLayerViewMode = 'all';
                        vm.map.setZoom(14);
                        EventBus.$emit("leftMenuMode", 'home');
                        vm.map.off('zoomend', onZoom1);
                    }
                }
                vm.map.on('zoomend', onZoom1);
            },
            
            // кнопки и функционал
            drawerControlsShow: function() {
                let vm = this;
                
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
                let ctrNewLine = new L.NewLineControl;
                vm.mapDrawControls['ctrNewLine'] = ctrNewLine;
                vm.map.addControl(vm.mapDrawControls['ctrNewLine']);

                L.addPanControl = L.Control.extend({
                    options: {
                        position: 'topleft'
                    },
                    onAdd: function (map) {
                        var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
                            link = L.DomUtil.create('a', '', container);
                        link.href = '#';
                        link.title = 'Поставить стойку';
                        link.innerHTML = 'П';
                        L.DomEvent.on(link, 'click', L.DomEvent.stop)
                            .on(link, 'click', vm.createPylon2);
                        return container;
                    }
                });
                let panN = new L.addPanControl;
                vm.mapDrawControls['panN'] = panN;
                vm.map.addControl(vm.mapDrawControls['panN']);

                L.addSupControl = L.Control.extend({
                    options: {
                        position: 'topleft'
                    },
                    onAdd: function (map) {
                        var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
                            link = L.DomUtil.create('a', '', container);
                        link.href = '#';
                        link.title = 'Поставить стойку';
                        link.innerHTML = '<img src="sup1.svg"/>';
                        L.DomEvent.on(link, 'click', L.DomEvent.stop)
                            .on(link, 'click', vm.createSupport1);
                        return container;
                    }
                });
                let sup = new L.addSupControl;
                vm.mapDrawControls['sup'] = sup;
                vm.map.addControl(vm.mapDrawControls['sup']);

                L.addTLControl = L.Control.extend({
                    options: {
                        position: 'topleft'
                    },
                    onAdd: function (map) {
                        var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
                            link = L.DomUtil.create('a', '', container);
                        link.href = '#';
                        link.title = 'Поставить светофор';
                        link.innerHTML = '<img src="tl1.svg"/>';
                        L.DomEvent.on(link, 'click', L.DomEvent.stop)
                            .on(link, 'click', vm.createTraffLight1);
                        return container;
                    }
                });
                let trafl = new L.addTLControl;
                vm.mapDrawControls['trafl'] = trafl;
                vm.map.addControl(vm.mapDrawControls['trafl']);
            },
            
            drawerControlsHide: function() {
                let vm = this;
                vm.forEachIn(vm.mapDrawControls, function (o, k, i) {
                    vm.map.removeControl(o);
                });
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
                let lineH = 0.000025;
                let lineW = 0.00009;
                function onMapClick(e) {
                    // console.log(e.latlng.toString());
                    // console.log(e.latlng.lat, e.latlng.lng);
                    let baseCoords = e.latlng;
                    linePath.push(baseCoords);
                    linePath.push([baseCoords.lat+lineH, baseCoords.lng]);
                    linePath.push([baseCoords.lat+lineH, baseCoords.lng+lineW]);
                    // linePath.push([baseCoords.lat-lineH, baseCoords.lng+(lineW-lineH)]);
                    linePath.push([baseCoords.lat, baseCoords.lng+lineW]);
                    // console.log(linePath);
                    
                    let line = L.polyline(linePath, {
                        draggable: true,
                        transform: true,
                        skipMiddleMarkers:true
                    });
                    line.addTo(vm.map);
                    // line.transform.enable({rotation: true, scaling: false});
                    line.enableEdit(null, {skipMiddleMarkers:true});
                    vm.passpObjects['pane1'] = line;
                }
                tMap.once('click', onMapClick);
            },

            createPylon2: function() {
                let vm = this;
                let tMap = vm.map;

                let linePath = [];
                let lineH = 0.000025;
                let lineW = 0.00009;
                function onMapClick(e) {
                    // console.log(e.latlng.toString());
                    // console.log(e.latlng.lat, e.latlng.lng);
                    let baseCoords = e.latlng;
                    linePath.push(baseCoords);
                    linePath.push([baseCoords.lat+lineH, baseCoords.lng]);
                    linePath.push([baseCoords.lat+lineH, baseCoords.lng+lineW]);
                    // linePath.push([baseCoords.lat-lineH, baseCoords.lng+(lineW-lineH)]);
                    linePath.push([baseCoords.lat, baseCoords.lng+lineW]);
                    // console.log(linePath);

                    let line = L.polyline(linePath, {
                        draggable: true,
                        transform: true,
                        skipMiddleMarkers:true
                    });
                    line.addTo(vm.map);
                    line.transform.enable({rotation: false, scaling: false});
                    // line.enableEdit(null, {skipMiddleMarkers:true});
                    vm.passpObjects['pane1'] = line;
                }
                tMap.once('click', onMapClick);
            },
            
            editPane: function() {},

            createSupport1: function() {
                let vm = this;
                let tMap = vm.map;
                let iconSup1 = L.icon({
                    iconUrl: 'map_sup1.svg',
                    iconSize:     [17, 17],
                });
                
                function onMapClick(e) {
                    let lightSup1 = L.marker(e.latlng, {
                        icon: iconSup1,
                        draggable: true
                    });
                    lightSup1.addTo(vm.map);
                    vm.drawedObjects['sup'].push({
                        'oid': lightSup1._leaflet_id,
                        'obj': lightSup1
                    });
                    // lightSup1.on('drag', function (e) {
                    //     vm.redrawLine(lightSup1, e);
                    // });
                }
                tMap.once('click', onMapClick);
            },

            // рисуем светофор
            createTraffLight1: function() {
                let vm = this;
                let tMap = vm.map;
                let iconTl1 = L.icon({
                    iconUrl: 'map_tl1_fill.svg',
                    iconSize: [50, 50],
                });
                function onMapClick(e) {
                    let trafLight1 = L.marker(e.latlng, {
                        icon: iconTl1,
                        draggable: true,
                    });
                    trafLight1.addTo(vm.map);
                    let supid = vm.drawedObjects['sup'].slice(-1).pop().oid,
                        supobj = vm.drawedObjects['sup'].slice(-1).pop();
                    vm.drawedObjects['tl'].push({
                        'oid': trafLight1._leaflet_id,
                        'obj': trafLight1,
                        'supid': supid,
                        'supobj': supobj
                    });
                    // todo: перенести в отдельный метод для линий
                    vm.drawLine(supobj, trafLight1);
                    trafLight1.on('drag', function (e) {
                        // console.log(e);
                        // tl1Coords = [e.latlng.lat, e.latlng.lng];
                        // line1.setLatLngs([tl1Coords, ls1Coords]);
                        vm.redrawLine(e, trafLight1);
                    });
                    supobj.obj.on('drag', function (e) {
                        vm.redrawLineSup(e, trafLight1);
                    })
                }
                tMap.once('click', onMapClick);
                // console.log(vm.drawedObjects);
            },
            
            // рисуем линию между опорными объектами, вернее между опорой и светофором
            drawLine: function(sup, tl) {
                // console.log('sup', sup);
                // console.log('tl', tl);
                let vm = this;
                let tlCoords = tl.getLatLng();
                let lsCoords = sup.obj.getLatLng();
                let linePath = [
                    tlCoords,
                    lsCoords
                ];

                let line = L.polyline(linePath, {
                    draggable: false,
                    transform: true,
                    skipMiddleMarkers:true
                });
                line.addTo(vm.map);
                vm.drawedObjects['lines'].push({
                        'oid': line._leaflet_id,
                        'obj': line,
                        'supid': sup.oid,
                        'supobj': sup.obj,
                        'tlid': tl._leaflet_id,
                        'tlobj': tl,
                })
            },
            
            redrawLine: function(obj, obj2) {
                let vm = this;
                let tlid = obj.target._leaflet_id;
                let tline = vm.drawedObjects['lines'].filter(obj => {
                    return obj.tlid === tlid
                });
                let ttline = tline[0].obj;

                let supObj = tline[0].supobj;
                let supCoords = [supObj._latlng.lat, supObj._latlng.lng];
                let tlCoords = [obj.latlng.lat, obj.latlng.lng];
                ttline.setLatLngs([supCoords, tlCoords]);
                
            },

            // перересовка линии для опоры
            redrawLineSup: function(supObj, tlObj) {
                let vm = this;
                let tlid = tlObj._leaflet_id;
                let tline = vm.drawedObjects['lines'].filter(tlObj => {
                    return tlObj.tlid === tlid
                });
                let ttline = tline[0].obj;

                let supCoords = [supObj.latlng.lat, supObj.latlng.lng];
                let tlCoords = [tlObj._latlng.lat, tlObj._latlng.lng];
                ttline.setLatLngs([supCoords, tlCoords]);
            },

            // todo: bug with left menu
            eventMapViewMode: function(e) {
                let vm = this;
                if (vm.mapViewMode == 'all') {
                    vm.removeGLayers();
                    vm.addGLayers();
                } else if (vm.mapViewMode == 'Пустые объекты') {
                    vm.removeGLayers();
                    vm.mapLayers[vm.mapViewMode].addTo(vm.map);
                } else if (vm.mapViewMode == 'Объекты с данными') {
                    vm.removeGLayers();
                    vm.mapLayers[vm.mapViewMode].addTo(vm.map);
                }
                
                if (vm.mapViewMode != e) {
                    EventBus.$emit("mapViewMode", e);
                }
            },
            
            /**
             * просто пример для рисования
             * todo: clean
             */
            drawSomeCross: function() {
                let vm = this;
                vm.map.setView([55.75666323211253, 37.63475395739079], 20);
                
                let iconTl1 = L.icon({
                    iconUrl: 'map_tl1_fill.svg',
                    iconSize:     [50, 50], // size of the icon
                    // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                });
                let iconSup1 = L.icon({
                    iconUrl: 'map_sup1.svg',
                    iconSize:     [17, 17], // size of the icon
                    // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                });

                let trafLight1 = L.marker([55.756699078032895, 37.63471171259881], {
                    icon: iconTl1,
                    draggable: true,
                    transform: true,
                    rotationAngle: 75
                });
                trafLight1.addTo(vm.map);
                // trafLight1.transform.enable({rotation: true, scaling: false});
                
                let lightSup1 = L.marker([55.75666323211253, 37.63475395739079], {
                    icon: iconSup1,
                    draggable: true
                });
                lightSup1.addTo(vm.map);

                let tl1Coords = trafLight1.getLatLng();
                let ls1Coords = lightSup1.getLatLng();
                let linePath = [
                    tl1Coords,
                    ls1Coords
                ];
                
                let line1 = L.polyline(linePath, {
                    draggable: false,
                    transform: true,
                    skipMiddleMarkers:true
                });
                line1.addTo(vm.map);

                trafLight1.on('drag', function (e) {
                    // console.log(e.latlng.lat+', '+e.latlng.lng);
                    tl1Coords = [e.latlng.lat, e.latlng.lng];
                    line1.setLatLngs([tl1Coords, ls1Coords]);
                });
                lightSup1.on('drag', function (e) {
                    ls1Coords = [e.latlng.lat, e.latlng.lng];
                    line1.setLatLngs([tl1Coords, ls1Coords]);
                })

                // let trafLight2 = L.marker([55.75668515595039, 37.634796143898964], {
                //     icon: iconTl1,
                //     draggable: true
                // });
                // trafLight2.addTo(vm.map);
                // let tl2Coords = trafLight2.getLatLng();
                // let line2Path = [
                //     tl2Coords,
                //     ls1Coords
                // ];
                // let line2 = L.polyline(line2Path, {
                //     draggable: false,
                //     transform: true,
                //     skipMiddleMarkers:true
                // });
                // line2.addTo(vm.map);
                
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
  #testcolorstyle {
    color: darkgray;
  }

</style>
<template>
<!--    <div>-->
<!--        <p>dsad sa das das</p>-->
        
        <div id="map" class="map"></div>
<!--        <div class="options" >-->
<!--            Info:<br/>-->
<!--            <textarea id="info" style="width:28em; height:10em"></textarea>-->
<!--        </div>-->
<!--    </div>-->
    
</template>



<script>
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import {Draw, Snap} from 'ol/interaction';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
    import {OSM, Vector as VectorSource} from 'ol/source';
    // import {Circle as CircleStyle, Fill, Stroke, Style, Circle} from 'ol/style';
    import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
    import {fromLonLat} from 'ol/proj';
    import GeoJSON from 'ol/format/GeoJSON';
    import LineString from 'ol/geom/LineString'
    
    
    import Button from 'ol-ext/control/Button';
    import Toggle from 'ol-ext/control/Toggle';
    import Bar from 'ol-ext/control/Bar';
    import EditBar from 'ol-ext/control/EditBar';
    import UndoRedo from 'ol-ext/interaction/UndoRedo';
    // import FillAttribute from 'ol/interaction';
    
    import Collection from 'ol/Collection';
    import Feature from 'ol/Feature';
    // import MultiPoint from 'ol/geom/MultiPoint';

    // import $ from 'jquery'
    
    export default {
        name: "MapOl"
    }

    let raster = new TileLayer({
        source: new OSM()
    });

    let source = new VectorSource();
    let vector = new VectorLayer({
        source: source,
        style: new Style({
            fill: new Fill({
                color: 'rgba(121,245,255,0.4)'
            }),
            stroke: new Stroke({
                color: '#ff8109',
                width: 2
            }),
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: '#ffcc33',
                    stroke: new Stroke({
                        color: '#4cff62',
                        width: 2
                    })
                })
            })
        })
    });

    let map = new Map({
        layers: [raster, vector],
        target: 'map',
        view: new View({
            center: fromLonLat([30.341923, 59.954014]),
            zoom: 12,
            // rotation: Math.PI / 5,
        })
    });

    // Add a snap
    const snap = new Snap({
        source: source
        // source: vector.getSource()
    });
    map.addInteraction(snap);

    // start mainbar
    // let mainbar = null;
    let mainbar = new Bar();
    // mainbar = require('../mapbar');
    // let mainbar = new Bar();
    // Editbar
    let editbar = new EditBar ({
        source: vector.getSource(),
        interactions: {
            Info: false,
            // Offset: false,
            // Split: false,
            // Delete: false
        },
    
    });
    mainbar.addControl(editbar);

    // Undo redo interaction
    let undoInteraction = new UndoRedo();
    map.addInteraction(undoInteraction);
    // Prevent selection of a deleted feature
    undoInteraction.on('undo', function (e) {
        if (e.action.type === 'addfeature') {
            editbar.getInteraction('Select').getFeatures().clear();
            editbar.getInteraction('Transform').select();
        }
    });

    // Add UndoRedo buttons to the bar
    let bar = new Bar({
        group: true,
        controls: [
            new Button({
                html: '<i class="fa fa-undo" ></i>',
                title: 'undo...',
                handleClick: function () {
                    undoInteraction.undo();
                }
            }),
            new Button({
                html: '<i class="fa fa-repeat" ></i>',
                title: 'redo...',
                handleClick: function () {
                    undoInteraction.redo();
                }
            })
        ]
    });
    mainbar.addControl(bar);

    // interactive info
    let hello = new Button(
      {
          html: '<i class="fa fa-smile-o"></i>',
          className: "hello",
          title: "Hello world!",
          handleClick: function () {
              info("hello World!");
          }
      });
    mainbar.addControl(hello);
    let save = new Button(
      {
          html: '<i class="fa fa-download"></i>',
          className: "save",
          title: "Save",
          handleClick: function () {
              let json = new GeoJSON().writeFeatures(vector.getSource().getFeatures());
              info(
                "Center: " + map.getView().getCenter() + " - zoom: " + map.getView().getZoom() + 'Json objects - ' + json
              );
          }
      });
    mainbar.addControl(save);

    let ledit = new Toggle({
        html: '<i class="fa fa-share-alt" ></i>',
        title: 'LineString',
        interaction: new Draw({
            type: 'LineString',
            source: vector.getSource()
        
        }),
    });
    editbar.addControl(ledit);
    map.addControl(mainbar);




    // Show info
    function info(i) {
        // $("#info").html(i || "");
        // console.log(i || "");
    }



    //*** Vector spline stub
    // var lstring = [[-315612,5859589],[-144393,6211811],[232288,6275406],[354587,5952536],[755728,6113971]];
    var lstring = [[3372105.7334980406,8392441.18761647],[3385864.398589372,8393129.120871037],
        [3389686.250003631,8389039.73985778],[3388654.350121781,8383268.744222249],[3374781.029488022,8383192.307193964]];
    let features = new Collection();
    features.push (new Feature( new LineString(lstring)));

    
</script>

<style scoped>

</style>
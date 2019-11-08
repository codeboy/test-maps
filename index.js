import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {Draw, Modify, Snap} from 'ol/interaction';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON'
import LineString from 'ol/geom/LineString'


import Button from 'ol-ext/control/Button';
import Toggle from 'ol-ext/control/Toggle';
import Bar from 'ol-ext/control/Bar';
import EditBar from 'ol-ext/control/EditBar';
import UndoRedo from 'ol-ext/interaction/UndoRedo';
import FillAttribute from 'ol/interaction';

// import 'ol-ext/ol-ext.css';


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
let mainbar = new Bar();
map.addControl(mainbar);

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


// Show info
function info(i) {
  $("#info").html(i || "");
}



//*** Vector spline stub
// let ledit = new Toggle({
//   html: '<i class="fa fa-share-alt" ></i>',
//   title: 'LineString',
//   interaction: new Draw({
//     type: 'LineString',
//     source: vector.getSource()
//
//   }),
// });
// editbar.addControl(ledit);





//
// // Layers
// var layers = [new ol.layer.Tile({source: new ol.source.OSM()})];
//
// // The map
// var map = new ol.Map({
//   target: 'map',
//   view: new ol.View({
//     zoom: 17,
//     center: [269766, 6248649]
//   }),
//   controls: ol.control.defaults({"attribution": false}),
//   layers: layers
// });
//
// // New vector layer
// var vector = new ol.layer.Vector({
//   name: 'Vecteur',
//   source: new ol.source.Vector({features: new ol.Collection()}),
// })
// map.addLayer(vector);
//
// var drawi = new ol.interaction.Draw({
//   source: vector.getSource(),
//   //type: "LineString"
//   type: "Polygon"
// });
// map.addInteraction(drawi);
//
// var modi = new ol.interaction.Modify({source: vector.getSource()});
// map.addInteraction(modi);
//
// var snapi = new ol.interaction.SnapGuides();
// snapi.setDrawInteraction(drawi);
// snapi.setModifyInteraction(modi);
// map.addInteraction(snapi);
//
// // New guide on meridian (default Greenwich)
// function addMeridian(x) {
//   var p1 = ol.proj.transform([x || 0, 1], 'EPSG:4326', map.getView().getProjection());
//   var p2 = ol.proj.transform([x || 0, -1], 'EPSG:4326', map.getView().getProjection());
//   snapi.addGuide([p1, p2]);
// };
//
// // Switch initial condition
// function setInitial(b) {
//   snapi.enableInitialGuides_ = b;
// };
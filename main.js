// import 'ol/ol.css';
// import {Map, View, Feature} from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import {fromLonLat} from 'ol/proj';
// import VectorLayer from 'ol/layer/Vector';
// import {Vector} from 'ol/source';
// import {Polygon} from 'ol/geom';
// import {Style, Fill} from 'ol/style';

// let jsts = require('jsts');

var nodes_source = new Vector();
var net_layer = new VectorLayer({
  source: nodes_source
});
// var coord1 = [[53.380435, 58.989217], [53.380576, 58.991127], [53.378867, 58.991202], [53.380109, 58.987822], [53.380435, 58.989217]];
// var coord2 = [[58.989217, 53.380435], [58.991127, 53.380576], [58.991202, 53.378867], [58.987822, 53.380109], [58.989217, 53.380435]];
// var coord3 = [];
// var coord3 = coord2.map(fromLonLat);
// console.log(coord2.map((ll)=>{ll.reverse()}));
// console.log(fromLonLat(coord1[0]))
// var coord3 = coord2.map(fromLonLat);
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      // source: new OSM({ url: "static/{z}/{x}/{y}.png" })
      source: new OSM()
    }),
    net_layer
  ],
  view: new View({
    center: fromLonLat([30.341923, 59.954014]),
    zoom: 10
  })
});

function draw_xml_shape(node, color_str) {
  if (!node)
    return;
  let node_shape = node.getAttribute('shape');
  if (node_shape) {
    let polygon = new Polygon([node_shape.split(' ').map((ll) => {
      return ll.split(',').map(parseFloat)
    })]);
    polygon.transform('EPSG:4326', 'EPSG:3857');
    // console.log(polygon);
    var f = new Feature(polygon);
    f.setStyle(new Style({
      fill: new Fill({color: color_str})
    }));
    nodes_source.addFeature(f);
    // console.log('add feature', f);
  }
}

var selection = {};

map.on('click', function (event) {
  var features = map.getFeaturesAtPixel(event.pixel);
  var feature;
  feature = selection['feature'];
  var style = selection['style'];
  if (feature && style) {
    feature.setStyle(style);
  }
  selection = {};
  // force redraw of layer style
  net_layer.setStyle(net_layer.getStyle());
  feature = features[0];
  if (!feature) {
    return;
  }
  selection = {'feature': feature, 'style': feature.getStyle()};
  feature.setStyle(new Style({fill: new Fill({color: "#00FF00"})}));
});
// console.log(map, nodes_source);
var xhr = new XMLHttpRequest();
xhr.open('GET', 'static/net.xml', true);
xhr.send();
xhr.onreadystatechange = function () {
  if (xhr.readyState != 4)
    return;
  if (xhr.status === 200) {

    let nodes = xhr.responseXML.evaluate("/Network/Node", xhr.responseXML);
    let node = nodes.iterateNext();
    while (node) {
      draw_xml_shape(node, '#a0a0a4a0');
      node = nodes.iterateNext();
    }
    let splits = xhr.responseXML.evaluate("/Network/Edge/Lane/Split", xhr.responseXML);
    let split = splits.iterateNext();
    while (split) {
      draw_xml_shape(split, '#000000a0');
      split = splits.iterateNext();
    }

    let parser = new jsts.io.OL3Parser();
    let connections = xhr.responseXML.evaluate("/Network/Connection", xhr.responseXML);
    let conn = connections.iterateNext();
    while (conn) {
      let skel = conn.getAttribute('skeleton');
      let geom = skel.split(' ').map((ll) => {
        let ca = fromLonLat(ll.split(',').map(parseFloat));
        return new jsts.geom.Coordinate(ca[0], ca[1])
      });

      // console.log(geom);
      let gf = new jsts.geom.GeometryFactory();
      let ls = gf.createLineString(geom);
      // ls.setSRID(3857);
      // console.log(ls);
      let buf = ls.buffer(3.75, 10, 2);
      if (buf._shell) {
        // buf.transform('EPSG:4326', 'EPSG:3857');
        let olbuf = buf._shell._points._coordinates.map((pt) => {
          return [pt.x, pt.y]
        })
        // console.log(olbuf);
        var f = new Feature(new Polygon([olbuf]));
        f.setStyle(new Style({
          fill: new Fill({color: '#ff0000a0'})
        }));
        nodes_source.addFeature(f);
      }
      // break;
      conn = connections.iterateNext();
    }
  }
  // console.log(xhr.responseXML);
  // let parser = new DOMParser();
  // let xml_doc = parser.parseFromString(xhr.responseText);
}

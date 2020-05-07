import {Draw, Modify, Snap} from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';
import LineString from 'ol/geom/LineString'


import Button from 'ol-ext/control/Button';
import Toggle from 'ol-ext/control/Toggle';
import Bar from 'ol-ext/control/Bar';
import EditBar from 'ol-ext/control/EditBar';
import UndoRedo from 'ol-ext/interaction/UndoRedo';


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
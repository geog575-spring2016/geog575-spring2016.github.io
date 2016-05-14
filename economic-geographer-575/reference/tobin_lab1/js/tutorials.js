/* Scripts by Tobin McGilligan, 2015 */

var map = L.map('map').setView([51.505, -0.09], 2);

//add tile layer...replace project id and accessToken with your own

// MapBox -----
/*L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'tobinmcg.p4biih0o',
    accessToken: 'pk.eyJ1IjoidG9iaW5tY2ciLCJhIjoiZWViZjgzODg4NGJiODc3YTQ4YjVhNmQ1NTQ2OTE3ODYifQ.IQc9cPbv4yG-kTMVmkiU7g'
}).addTo(map);*/

// OpenStreetMap -----
//define a tile layer and add it to the map
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

//define a map marker and add it to the map
var marker = L.marker([51.5, -0.09]).addTo(map);

//define a circle polygon and add it to the map
var circle = L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);

//define a generic polygon and add it to the map
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//bind popups to several vector layers
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//create a popup and open it on the map
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

//define a popup and do nothing else
var popup = L.popup();

//define function that manipulates the above popup
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

//set the function to trigger when the map <div> is clicked
map.on('click', onMapClick);

//GeoJSON feature
var geojsonFeature = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

//parse a GeoJSON feature into a layer
L.geoJson(geojsonFeature, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);

//array of GeoJSON objects
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 15,
    "opacity": 0.65
};

//optionally pass parameters like CSS styles
L.geoJson(myLines, {
    style: myStyle
}).addTo(map);

//create layer and add data
/*var myLayer = L.geoJson().addTo(map);
myLayer.addData(myLines);*/

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJson(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

var someGeojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Science Hall",
        "amenity": "Academic Building",
        "popupContent": "Home of the Dept. of Geography"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-89.400984, 43.075865]
    }
};

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

L.geoJson(someGeojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
}).addTo(map);
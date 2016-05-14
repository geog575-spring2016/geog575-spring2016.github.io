/* Scripts by Tobin McGilligan, 2015 */

/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){

    var map = L.map('map', {
		center: [43.075865, -89.400984],
		zoom: 2
	});

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'tobinmcg.o323dbij',
	    accessToken: 'pk.eyJ1IjoidG9iaW5tY2ciLCJhIjoiZWViZjgzODg4NGJiODc3YTQ4YjVhNmQ1NTQ2OTE3ODYifQ.IQc9cPbv4yG-kTMVmkiU7g'
	}).addTo(map);

    //call getData function
    getData(map);
};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        var i = 1;
        for (var property in feature.properties){
            if (i <= 8) {
                popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
                i++;
            }
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(map){

    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var geoJsonFunctionOptions = {
        pointToLayer: function (feature, latlng){
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature,
        filter: function(feature, layer) {
            return feature.properties.Pop_2015 > 20;
        },
    };

    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, geoJsonFunctionOptions).addTo(map);
        }
    });
};

$(document).ready(createMap);
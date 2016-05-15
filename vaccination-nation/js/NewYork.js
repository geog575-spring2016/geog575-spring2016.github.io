/* Vaccination in New York City Private Schools */
/* Javascript by Adam Mandelman                 */
/*      (                      )    */
/*      |\    _,--------._    / |   */
/*      | `.,'            `. /  |   */
/*      `  '              ,-'   '   */
/*       \/_         _   (     /    */
/*      (,-.`.    ,',-.`. `__,'     */
/*       |/#\ ),-','#\`= ,'.` |     */
/*       `._/)  -'.\_,'   ) ))|     */
/*       /  (_.)\     .   -'//      */
/*      (  /\____/\    ) )`'\       */
/*       \ |V----V||  ' ,    \      */
/*        |`- -- -'   ,'   \  \     */
/*  __    |         .'    \ \  `._, */
/*    `.__,`---^---'       \ ` -'   */
/*       -.______  \ . /  ______,-  */
/*               `.     ,'          */

//determine which attribute to visualize
var attribute = "completely-immunized";
    
var displayAttribute = "Completely Immunized";

function createMap(){
//initialize the map on the "map" div with a given center aand zoom level
    var map = L.map("new-york-map", {
        center: [40, -74.03], 
        zoom: 10,
        zoomControl: false
    });

    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);
    
//load and display a tile layer on the map
    var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>. Data: <a href="https://health.data.ny.gov/Health/School-Immunization-Survey-Beginning-2012-13-Schoo/5pme-xbs5">NY State Dept. of Health</a>. Map by Adam Mandelman, 2016.',
    subdomains: 'abcd',
    minZoom: 10,
    maxZoom: 17,
    }).addTo(map);

    getData(map);


    //restrict map boundaries    
    map.setMaxBounds([
    [40.46, -74.46],
    [40.99, -73.5]
    ]);

};

//function to convert markers to circles
function pointToLayer (feature, latlng){
    
    //for each feature, determine its value for selected attribute
    var attValue = Number(feature.properties[attribute]);
    
    //create marker options and give each circle a color based on its attValue
    var options = {
        radius: 7,
        fillColor: getColor(attValue),    
        weight: 1.7,
        opacity: 1,
        color: getColor(attValue),
        fillOpacity: 0.8
    };
    
    //create circle layer
    var layer = L.circleMarker(latlng, options);
    
    //build popup content string
    var popupContent = "<p><b>School:</b> " + feature.properties.name + "</p><p><b>" + displayAttribute + ":</b> " + feature.properties[attribute] + "%" + "</p>";
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    } );
    
    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
    
};

//add circle markers to the map and add a search operator
function colorCircles(data, map){
    //create a Leaflet GeoJSON layer and add it to the map    
    var layer = L.geoJson(data, {
        pointToLayer: pointToLayer
        }).addTo(map);
    
    //create a Leaflet Search Control plugin and add to map
    var searchControl = new L.Control.Search({
		layer: layer,
		propertyName: 'name',
		circleLocation: false,
		moveToLocation: function(latlng, title, map) {
			//map.fitBounds( latlng.layer.getBounds() );
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  			map.setView(latlng, zoom); // access the zoom
		}
	});

	searchControl.on('search_locationfound', function(e) {	
		if(e.layer._popup)
			e.layer.openPopup();

	}).on('search_collapsed', function(e) {

		featuresLayer.eachLayer(function(layer) {	//restore feature color
			featuresLayer.resetStyle(layer);
		});	
	});
	
	map.addControl( searchControl );  //inizialize search control

};

//create a color scale for circles
function getColor(v) {
    if (v>94.9){
        return "#47bcbf";
        } else if (v < 75){
            return "#d7191c";
        } else if ((v>75) && (v<=84.99)) {
            return "#fc8d59";
        } else if ((v>=85) && (v<=94.9)){
            return "#fadb86";
        } 
}

//create filter control
function createFilterControl(map){
    
    //create a new SequenceControl Leaflet class
    var FilterControl = L.Control.extend({
        options: {
            position: "bottomleft"
        },
        
        onAdd: function(map){
            //create the control container with my control class name
            var container = L.DomUtil.create("div", "sequence-control-container-ny");
                        
            //create button elements
            $(container).append("<h4>Vaccination Coverage in NYC Private Schools, 2014-2015</h4>");
            $(container).append('<button type="button" class="nybtn under75">Under 75%<br>(24 Schools)</button>');
            $(container).append('<button type="button" class="nybtn b75-85">75% to 84.99%<br>(46 Schools)</button>');
            $(container).append('<button type="button" class="nybtn b85-95">85% to 94.99%<br>(151 Schools)</button>');
            $(container).append('<button type="button" class="nybtn over95">95% and over<br>(550 Schools)</button>');
            $(container).append('<button type="button" class="nybtn all">All<br>(771 Schools)</button>');            
            
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            
            return container;
        }
    
    });
    
    map.addControl(new FilterControl());
    
};

//create filter function
function filterButtons(map){    
    
    //create a layergroup container for layers we're going to remove.
    var filterHolder = L.layerGroup();
            
    //listen for button clicks
    $('.nybtn').click(function(layer){
        //set an immunization class variable to equal whatever button is clicked
        var immunizationClass = $(this).html();        
    
        //add each layer from the removed layers layergroup to the map
        filterHolder.eachLayer(function(layer){
           map.addLayer(layer); 
        });
        
        //run through each layer to check immunization coverage
        map.eachLayer(function(layer){
            
            //set a variable to hold the vaccine coverage rate
            if (layer.feature && layer.feature.properties){
            var vaxAttribute = layer.feature.properties[attribute];
            
                //if the "all" button is clicked, add ALL layers to the layer group
                if (immunizationClass === "All<br>(771 Schools)") {
                    filterHolder.eachLayer(function(layer){
                        map.addLayer(layer);
                    });
                  
                    //otherwise, if a specific immunization class button is clicked, remove all *other* layers and add them to the removed layer layergroup.
                } else if (vaxAttribute > 75 && immunizationClass == "Under 75%<br>(24 Schools)") {
                    filterHolder.addLayer(layer);
                    map.removeLayer(layer);
                } else if ( ((vaxAttribute>84.9) || (vaxAttribute<75)) && immunizationClass == "75% to 84.99%<br>(46 Schools)") {
                    filterHolder.addLayer(layer);
                    map.removeLayer(layer);
                } else if ( ((vaxAttribute>94.9) || (vaxAttribute<85)) && immunizationClass == "85% to 94.99%<br>(151 Schools)") {
                    filterHolder.addLayer(layer);
                    map.removeLayer(layer);
                } else if ((vaxAttribute < 95) && immunizationClass == "95% and over<br>(550 Schools)") {
                    filterHolder.addLayer(layer);
                    map.removeLayer(layer);
                } 
            }
        });
    
    });
};

//function to give "button clicked" visual affordance
function clickedButtons(){
    $(".nybtn").click(function (){
        $(".nybtn.nybtn-selected").removeClass("nybtn-selected"),
        $(this).addClass("nybtn-selected")
    });
}


//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/ny/new-york-schools.geojson", {
        dataType: "json",
        success: function(response){
            //call function to color circles
            colorCircles(response, map);
            createFilterControl(map);
            filterButtons(map);
            clickedButtons();
        }
    });
};

$(document).ready(createMap);





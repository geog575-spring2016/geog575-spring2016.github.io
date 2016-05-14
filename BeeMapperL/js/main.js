//* initialize the map and set its view */
//function to instantiate the Leaflet map
function createMap(){
    //Initialize the map and set its view
    var map = L.map('map', {
        center: [37.32, -78.4444],   //center of sites
        zoom: 9,
        minZoom: 9,
        maxZoom: 18,
        zoomControl: false
    });

  //).setView([37.5, -80], 8);    // sweet b college

       var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            //minZoom: 7,
            //maxZoom: 18,
        }).addTo(map);

        var MapQuestOpen_Aerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
	           type: 'sat',
	           ext: 'jpg',
             minZoom: 9,
           	 maxZoom: 18,  //less zoom
          	 attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
	           subdomains: '1234'
        });

        //var OpenStreetMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        //    maxZoom: 19,
        //    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        //}).
        var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	          subdomains: 'abcd',
	          maxZoom: 19
        });

        var OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        	maxZoom: 19,
        	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        }); //.addTo(map);

        var baseMaps = { "Esri_WorldImagery": Esri_WorldImagery,
                         "CartoDB_Positron": CartoDB_Positron,
                         //"MapQuestOpen_Aerial": MapQuestOpen_Aerial,
        };

    //
    myZoom (map, 37.32, -78.4444, 9);
    var data = getData(map, baseMaps);



/////3***************
};


function getData(map, baseMaps){
    //load the data

    //var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    //g = svg.append("g").attr("class", "leaflet-zoom-hide");
    // Load data at once
    $.ajax("data/sitesMeans.geojson", {
        dataType: "json",
        success: function(data){
          //the attributes array -- yrs for sequence
            var beeType = getBeeTypes ( );
            // separeate sites

            addSites(map, data, baseMaps);

            //createPropSymbols(data, map, bees);
            createSiteControls(map, data, beeType);

            createTreatmentMenu(map, data, beeType);

         }
    });


};



// defines the content for a site popup content
function popupContent (siteInfo) {
  for (station in siteInfo){
     if ( (siteInfo[station].properties.Site_Number === 0) &&
          (siteInfo[station].properties.Station === "Mean") &&
          (siteInfo[station].properties.Trt === "SITE")
        ){
        var attValue = Number(siteInfo[station].properties.total);
        attValue = attValue.toFixed(0);
        var sweet = siteInfo[station].properties.total;
        var popupContent = "<p class='popup'><b>" + siteInfo[station].properties.Name + "</b>";
        popupContent +=  "<br />" + attValue + " bees per station" + "</p>";
     }
  };
  return popupContent;
};


// add a nice marker
function addSites(map, data, baseMaps){
  var beeIcon = L.icon({
      iconUrl: 'lib/leaflet/images/leaf-red.png',
      iconSize:     [30, 50], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

// popup for the sweet briar site
   var sweetSite = processData(data, "Sweet Briar College");
   var content1 = popupContent(sweetSite);
   var sweetB =    L.marker([37.552778, -79.0825444],
        {icon: beeIcon   }).bindPopup(content1);


   var falconsSite = processData(data, "Falcons");
   var content2 = popupContent(falconsSite);
//L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
   var falcons =   L.marker([36.887325, -78.114467],
        {icon: beeIcon}).bindPopup(content2);

   var elzaySite = processData(data, "Elzay ");
   var content3 = popupContent(elzaySite);
   var  elzay =     L.marker([37.127585, -78.115443],
        {icon: beeIcon}).bindPopup(content3);

   var ingeSite = processData(data, "Inge Mann");
   var content4 = popupContent(ingeSite);
   var inge_mann = L.marker([37.0560800, -78.1234803],
       {icon: beeIcon}).bindPopup(content4);

   var sites = L.layerGroup([falcons, elzay, inge_mann, sweetB]).addTo(map);
   var overlaySites = {"sites": sites};

   L.control.layers(baseMaps, overlaySites).addTo(map);
  // add information
   //$("#panel").html("  ");
  
};

////////////////
//function requesting  GEOJSON data and if success callback functions


function processData(data, siteName){
    //empty array to hold the stations of a site
    var stations = [];
    var i = 0;
    props =  data.features[0].properties ;
    //console.log(props.Name);
    //push each attribute name into attributes array -- years then name
    for (var dat in data.features) {
       var datProps = data.features[dat].properties;
      //console.log(datProps );
       for (var prop in datProps){
        //only take attributes with values
         if ((prop === "Name") && (datProps[prop] === siteName)) {
            stations.push(data.features[dat]);
         };
       };
    };
    return stations;
};

////////  get the bee types
function getBeeTypes ( ){
    //empty array to hold attributes
    // attributes: Site_Number,	Station,	lat,	lon,	Trt,
    // BumbleBee,	CarpenterBee,	ChimneyBee,	GreenMetallicBee,
    // Honeybee,	Leaf-cutterBee,	Long-hornedBee,	SweatBee,	Name
    var beeTypes = ["BumbleBee",	"CarpenterBee",	"ChimneyBee",
         "GreenMetallicBee", "Honeybee",	"Leaf-cutterBee",
         "Long-hornedBee",	"SweatBee"];

    return beeTypes;
};


////////////////////////////////////////
function createSiteControls2(map, data, beeTypes){

    var SiteControl = L.Control.extend({
        options: {
            position: 'topright'
        },
// add to map pane
        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'site-control-container');
            //add skip buttons
            $(container).
                   append('<button class="select" id="sweet" title="Sweet">Sweet B</button>');
                   localZoom (map, 37.552778, -79.0825444, 14);
                   //map.setView([lat, lng], zoom);
            $(container).
                   append('<button class="select" id="falcons" title="Falcons">Falcons</button>');
            $(container).
                   append('<button class="select" id="inge" title="IngeMann">IngeMann</button>');
            $(container).
                   append('<button class="select" id="elzay" title="Elzay">Elzay</button>');

            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            return container;
          }
      });

      // add the map_menu control
      map.addControl(new SiteControl()); //'bar', {position: 'topleft'}));

      //click listener for buttons  $('.class')
      $('.select').click(function(){
        if ($(this).attr('id') == 'sweet'){

          var sweetSite = processData(data, "Sweet Briar College");

          createPropSymbols(sweetSite, map, beeTypes);
          // and something else ---->
                //wrap around to first attribute
        } else if ($(this).attr('id') == 'falcons'){
          var falconsSite = processData(data, "Falcons");

          myZoom (map, 36.887325, -78.114467, 14);
          createPropSymbols(falconsSite, map, beeTypes);

                //wrap around to first attribute
        } else if ($(this).attr('id') == 'elzay'){

          var elzaySite = processData(data, "Elzay ");

          myZoom (map, 37.127585, -78.115443, 14);
          createPropSymbols(elzaySite, map, beeTypes);
                //wrap around to first attribute
        } else if ($(this).attr('id') == 'inge'){

          var ingeSite = processData(data, "Inge Mann");

          myZoom (map, 37.0560800, -78.1234803, 14);
          createPropSymbols(ingeSite, map, beeTypes);
        };
      }); //end of buttons
        //updatePropSymbols(map, attributes[index]);
};


//// Retrieve
//////Add circle markers for point features to the map
function createPropSymbols(data, map, bees){
    //create a GeoJSON layer and add it to the map
    // pointToLayer is an option of L.geoJson
    var featLayer = L.geoJson(data, {
        pointToLayer: function (feature, latlng ) {
            //feature contains data for each station - record
            return pointToLayer(feature, latlng, bees);
        }
    });
		map.addLayer(featLayer); // add layer to map
};

//function to convert markers to circle markers
function pointToLayer(station, latlng, bees){
    //Determine which attribute to visualize with proportional symbols
    var total_bees = 0; //bees[0];  //does this for all the countries
    //create marker options
    var options = {
        fillColor: "#a50f15",
        //weight: 1,
        opacity: 0.6,
        fillOpacity: 0.8,
        stroke: false
    };

  ///////////    var attValue = Number(feature.properties[attribute]);
  // need to fix this for comparing sites and treatments
    if ( (station.properties['Station'] == "Mean")
        && (station.properties['Trt']  !== "SITE")
        && Number((station.properties['Site_st']) !== 0) ) {
        // mean bees per station per site
        total_bees = station.properties['total'];

     };
     // calculate radius for the circle
        options.radius = calcPropRadius(total_bees);

    //create the circlemarker and popups with the options and add to layer
        var layer = L.circleMarker(latlng, options, {
            title: station.properties.Site_st,
        });

       if (total_bees > 0)  {
         createPopup(station.properties, total_bees, layer, options.radius);

       }
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;

};


///////////////   createPopup function
function createPopup(properties, attribute, layer, radius) {
  // format the popup content
  var attValue = Number(attribute);
  console.log('aca',attValue);
  attValue = attValue.toFixed(0);
///////
  var popupContent = "<p><b>" + properties.Name;
  popupContent += " - Station " + properties.Site_st +  "<br>" +
  "Diversity: </b>" +properties.Trt + "<br><b>"+ "Mean: </b>"+ attValue + " bees per station" +  "</p>";


  var panelContent = '<p  ><b>' + properties.Name + " - Station " + properties.Site_st + " <br></b>";
  panelContent += "<p>Mean Number of Bee Morphospecis   </b></p> ";
  panelContent += "Bumble: "  + Number(properties.BumbleBee).toFixed(0) + " bee(s) <br>" +  " Carpenter: " + Number(properties.CarpenterBee).toFixed(0) + " bee(s)" +  "<br>";
  panelContent += "Chimney: " +  Number(properties.ChimneyBee).toFixed(0) + " bee(s) <br> " + " Green Metallic: " + Number(properties.GreenMetallicBee).toFixed(0) + " bee(s)" + "<br>";
  panelContent += "Honey Bee: " + Number(properties.Honeybee).toFixed(0) +  " bee(s) <br>" + "Leaf Cutter: " + Number(properties.LeafCutterBee).toFixed(0) + " bee(s)" +  "<br>";
  panelContent += "Long Horned: " + Number(properties.LongHornedBee).toFixed(0) + " bee(s) <br> " + "Sweat: " + Number(properties.SweatBee).toFixed(0) + " bee(s) </p>";

  //bind the popup to the circle marker
  layer.bindPopup(popupContent, {
      offset: new L.Point(0,-radius),
  });

  layer.on({
      mouseover: function(){
          this.openPopup();
      },
      mouseout: function(){
          this.closePopup();
      },
      click: function(){
          $("#panel").html(panelContent);
      }
  });

};

//calculate the radius of each proportional symbol
// This is a better option for my circles
function calcPropRadius (attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 0.55;  //15;
    //area based on attribute value and scale factor
    var area = Math.pow(attValue * scaleFactor,2);
    //console.log('area', area);
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);
    return radius;
};



function menu (map) {

  console.log('here');
  var legend = L.Control.extend({
     options: {
          position: 'bottomright'
     },
     onAdd: function (map) {
          var div = L.DomUtil.create('div', 'info legend');
          div.innerHTML = "?";
          //  "<select>" + " <option value="sweet" selected>Sweet B</option>
            //  <option value="falcons">Falcons</option>
            //  <option value="elzay">Elzay</option>
            //  <option value="inge">Inge</option>
            // </select>


          div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
          return div;
     }
  });

  map.addControl(new legend());

  $('select').change(function(){
    alert('changed');
  });
};

function createTreatmentMenu(map, data, beeTypes){

    $('#mySelector').append('<option id="high"    value = "high" selected>HIGH</option>');
    $('#mySelector').append('<option id="low"     value = "low">LOW</option>');
    $('#mySelector').append('<option id="control" value = "control">CONTROL</option>' );






  //updatePropSymbols(map, attributes[index]);
};


function myZoom (map, lat, lng, zoom)  {
    // custom zoom bar control that includes a Zoom Home function
    L.Control.zoomHome = L.Control.extend({
        options: {
            position: 'topleft',
            zoomInText: '+',
            zoomInTitle: 'Zoom in',
            zoomOutText: '-',
            zoomOutTitle: 'Zoom out',
            zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
            zoomHomeTitle: 'Zoom home'
        },

        onAdd: function (map) {
            var controlName = 'gin-control-zoom',
                container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                options = this.options;
             // add zoom buttons
            this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
            controlName + '-in', container, this._zoomIn);
            this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
            controlName + '-home', container, this._zoomHome);
            this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
            controlName + '-out', container, this._zoomOut);

            this._updateDisabled();
            map.on('zoomend zoomlevelschange', this._updateDisabled, this);

            return container;
        },

        onRemove: function (map) {
            map.off('zoomend zoomlevelschange', this._updateDisabled, this);
        },

        _zoomIn: function (e) {
            this._map.zoomIn(e.shiftKey ? 3 : 1);
        },

        _zoomOut: function (e) {
            this._map.zoomOut(e.shiftKey ? 3 : 1);
        },

        _zoomHome: function (e) {
//37.552778, -79.0825444
            map.setView([lat, lng], zoom);
        },

        _createButton: function (html, title, className, container, fn) {
            var link = L.DomUtil.create('a', className, container);
            link.innerHTML = html;
            link.href = '#';
            link.title = title;

            L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);

            return link;
        },

        _updateDisabled: function () {
            var map = this._map,
                className = 'leaflet-disabled';

            L.DomUtil.removeClass(this._zoomInButton, className);
            L.DomUtil.removeClass(this._zoomOutButton, className);

            if (map._zoom === map.getMinZoom()) {
                L.DomUtil.addClass(this._zoomOutButton, className);
            }
            if (map._zoom === map.getMaxZoom()) {
                L.DomUtil.addClass(this._zoomInButton, className);
            }
        }
    });
    // add the new control to the map
    var zoomHome = new L.Control.zoomHome();
    zoomHome.addTo(map);
};

// finally create the map!
$(document).ready(createMap);



function localZoom (map, lat, lng, zoom, site)  {
    // custom zoom bar control that includes a Zoom Home function
    L.Control.zoomHome = L.Control.extend({
        options: {
            zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
            zoomHomeTitle: 'Zoom home'
        },

        onAdd: function (map) {
            var controlName = 'gin-control-zoom',
                container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                options = this.options;
            this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
                controlName + '-' + site, container, this._zoomHome);
            return container;
        },
        onRemove: function (map) {
            map.off('zoomend zoomlevelschange', this._updateDisabled, this);
        },
        _zoomHome: function (e) {
            map.setView([lat, lng], zoom);
        },

        _createButton: function (html, title, className, container, fn) {
            var link = L.DomUtil.create('a', className, container);
            link.innerHTML = html;
            link.href = '#';
            link.title = title;

            L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);

            return link;
        },

    });
    // add the new control to the map
    var zoomHome = new L.Control.zoomHome();
    zoomHome.addTo(map);

};

function createSiteControls(map, data, beeTypes){
    var SiteControl = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'site-control-container');
            //add skip buttons
            $(container).
                   append('<button class="select" id="sweet" title="Sweet">Sweet B</button>');

                   localZoom (map, 37.552778, -79.0825444, 14);
                   //map.setView([lat, lng], zoom);
            $(container).
                   append('<button class="select" id="falcons" title="Falcons">Falcons</button>');
                   localZoom (map, 36.887325, -78.114467, 14);
            $(container).
                   append('<button class="select" id="inge" title="IngeMann">IngeMann</button>');
                   localZoom (map, 37.0560800, -78.1234803, 14);
            $(container).
                   append('<button class="select" id="elzay" title="Elzay">Elzay</button>');
                  localZoom (map, 37.127585, -78.115443, 14);
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            return container;
          }
      });

      // add the map_menu control
      map.addControl(new SiteControl()); //'bar', {position: 'topleft'}));

      //click listener for buttons  $('.class')
      $('.select').click(function(){
        if ($(this).attr('id') == 'sweet'){
          var sweetSite = processData(data, "Sweet Briar College");
          createPropSymbols(sweetSite, map, beeTypes);
        } else if ($(this).attr('id') == 'falcons'){
          var falconsSite = processData(data, "Falcons");
          createPropSymbols(falconsSite, map, beeTypes);
                //wrap around to first attribute
        } else if ($(this).attr('id') == 'elzay'){
          var elzaySite = processData(data, "Elzay ");
          createPropSymbols(elzaySite, map, beeTypes);
                //wrap around to first attribute
        } else if ($(this).attr('id') == 'inge'){
          var ingeSite = processData(data, "Inge Mann");
          createPropSymbols(ingeSite, map, beeTypes);
        };
      }); //end of buttons
        //updatePropSymbols(map, attributes[index]);
};

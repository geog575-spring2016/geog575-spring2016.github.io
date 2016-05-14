var map = L.map('map', {
  center: [37.729986, -96.426741],
  zoom: 4,
  minZoom: 4,
  maxZoom: 9,
  zoomControl: false,
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Housing Data from <a href="http://www.zillow.com/research/data/">Zillow</a>, Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
  id: 'tobinmcg.p4biih0o',
  accessToken: 'pk.eyJ1IjoidG9iaW5tY2ciLCJhIjoiZWViZjgzODg4NGJiODc3YTQ4YjVhNmQ1NTQ2OTE3ODYifQ.IQc9cPbv4yG-kTMVmkiU7g'
}).addTo(map);

$.ajax("data/priceToRentRatios/biggestCities_PriceToRentRatio.geojson", {
  dataType: "json",
  success: function(response) {

    //create a Leaflet GeoJSON Cluster Group layer
    var priceToRentRatiosClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 22,
      removeOutsideVisibleBounds: false,
      iconCreateFunction: function(cluster) {
        /*var childCount = cluster.getChildCount();

        var c = ' marker-cluster-';
        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(30, 30),
        });*/

        //Modify cluster markers based on child's properties

        var childCount = cluster.getChildCount();
        var children = cluster.getAllChildMarkers();
        var radii = 0;
        var fillColors = [];

        for (i=0; i<children.length; i++) {
          radii += children[i].options.radius;
          if (children[i].options.radius == 0) {
            //don't count children w/ radius 0 in the total!
            childCount--;
          }
          fillColors[fillColors.length] = children[i].options.fillColor;
        }

        var radius = radii/childCount;
        fillColors.sort(); //this way we know similar values are grouped

        var fillColorFrequencies = [];
        fillColorFrequencies.push({color: fillColors[0], frequency: 1});

        for (i=1; i<fillColors.length; i++) {
          if (fillColors[i] == fillColorFrequencies[fillColorFrequencies.length-1].color) {
            fillColorFrequencies[fillColorFrequencies.length-1].frequency++;
          } else {
            fillColorFrequencies.push({color: fillColors[i], frequency: 1});
          }
        }
        
        var fillColor = fillColorFrequencies[0];
        for (i=1; i<fillColorFrequencies.length; i++) {
          if (fillColorFrequencies[i].frequency >= fillColor.frequency) {
            fillColor = fillColorFrequencies[i];
          }
        }

        var colorClass = '';
        if (fillColor.color == '#feedde') {
          colorClass = 'color5';
        } else if (fillColor.color == '#fdbe85') {
          colorClass = 'color4';
        } else if (fillColor.color == '#fd8d3c') {
          colorClass = 'color3';
        } else if (fillColor.color == '#e6550d') {
          colorClass = 'color2';
        } else if (fillColor.color == '#a63603') {
          colorClass = 'color1';
        } else {
          colorClass = 'defaultColor';
        }

        if (radius === 0 || childCount === 0) {
          childCount = '';
        }

        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster myCustomIcon ' + colorClass,
          iconSize: new L.Point(radius*2, radius*2),
        });
      },
    });

    var priceToRentRatiosGeoJSON = L.geoJson(response, {
      //L.geoJson function options
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          //circleMarkerOptions
          radius: calcPropRadius(feature.properties['2015-12']),
          fillColor: '#ff7800',
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
        });
      },
      onEachFeature: onEachFeature,
    });

    //add the JSON to the Cluster group, and the Cluster group to the map
    priceToRentRatiosClusterGroup.addLayer(priceToRentRatiosGeoJSON);
    map.addLayer(priceToRentRatiosClusterGroup);

    //establish panning bounds for the map
    var boundsMargin = 8;
    var dataBounds = priceToRentRatiosClusterGroup.getBounds();
    var mapBounds = L.latLngBounds(
      L.latLng(dataBounds.getSouth()-boundsMargin, dataBounds.getWest()-boundsMargin),
      L.latLng(dataBounds.getNorth()+boundsMargin, dataBounds.getEast()+boundsMargin)
    );
    map.setMaxBounds(mapBounds);
    map.fitBounds(mapBounds);

    //get attribute labels
    var attributes = extractAttributeLabels(response);

    //this function found in separate file. Must be called within AJAX success
    //function b/c it uses attribute values extracted from the retrived data
    setupControls(map, attributes, priceToRentRatiosClusterGroup);
  }
});

function onEachFeaturePopupSetup(layer, popupContent) {
  //event listeners to open popup on hover,
  //and close it on un-hover, with no flickering
  //and disabling clickability
  layer.on({
    mouseover: function(){
      this.bindPopup(popupContent, {
        offset: new L.Point(0,-6),
        className: 'activePopup',
      }).openPopup().unbindPopup();
      // ^^ binding the popup, opening it, and unbinding it
      //means the user can't click the icon after hover and
      //make the popup flicker on/off
    },
    mouseout: function(){
      $('.activePopup').hide(); //we assigned a class above so we could
      //do this, despite the fact that the popup is no longer bound
      //to the marker, tehehehe ;)
    },
  });
}

function generatePopup(feature, attribute) {
  return '<strong>' + feature.properties['toGeocode'] + '</strong>' + '</br>'
    + '<span class="popupAttributeLabel">Price-to-Rent Ratio <em>(' + attribute + ')</em></span>' + '</br>'
    + '<span class="popupAttributeValue">' + feature.properties[attribute];
}

function onEachFeature(feature, layer) {
    var popupContent = generatePopup(feature, '2015-12');
    onEachFeaturePopupSetup(layer, popupContent);
};

function calcPropRadius(attValue) {

    var radius;

    //continuous values
    //scale factor to adjust symbol size evenly
    var scaleFactor = 1.5;
    //radius calculated based on area
    radius = (attValue*scaleFactor)-6;

    //discrete values
    /*if (attValue <= 10) {
      radius = 4;
    } else if (attValue > 10 && attValue <= 12.5) {
      radius = 6;
    } else if (attValue > 12.5 && attValue <= 15) {
      radius = 8;
    } else if (attValue > 15) {
      radius = 10;
    } else {
      console.log('attribute value not accounted for!');
    }*/

    return radius;
};

function calcSymbolColor(attValue) {

  var color;

  if (attValue <= 10) {
    color = '#feedde';
  } else if (attValue > 10 && attValue <= 12.5) {
    color = '#fdbe85';
  } else if (attValue > 12.5 && attValue <= 15) {
    color = '#fd8d3c';
  } else if (attValue > 15 && attValue <= 17.5) {
    color = '#e6550d';
  } else if (attValue > 17.5) {
    color = '#a63603';
  } else {
    console.log('attribute value not accounted for!');
  }

  return color;
}

function extractAttributeLabels(data) {
  //empty array to hold attributes
  var attributes = [];

  //properties of the first feature in the dataset
  var properties = data.features[0].properties;

  //push each attribute name into attributes array
  for (var attribute in properties){
      //only take attributes with price-to-rent ratios
      if (attribute.indexOf("20") > -1){
          attributes.push(attribute);
      };
  };

  return attributes;
}

$('#title .fa').tooltip({
  content: 'A city\'s price-to-rent ratio measures how expensive it is to rent housing in that area, relative to owning it. A high ratio means that rental housing is significantly more expensive in that city, relative to the price of homes in the surrounding area.',
});
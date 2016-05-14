/* Scripts by Tobin McGilligan, 2015 */

//function to instantiate the Leaflet map
function createMap(){

  var map = L.map('map', {
      center: [37.729986, -96.426741],
      zoom: 4,
  });

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Housing Data from <a href="http://www.zillow.com/research/data/">Zillow</a>, Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 10,
      id: 'tobinmcg.p4biih0o',
      accessToken: 'pk.eyJ1IjoidG9iaW5tY2ciLCJhIjoiZWViZjgzODg4NGJiODc3YTQ4YjVhNmQ1NTQ2OTE3ODYifQ.IQc9cPbv4yG-kTMVmkiU7g'
  }).addTo(map);

  getData(map);
};

//function to retrieve the data and place it on the map
function getData(map){

    $.ajax("data/priceToRentRatios/biggestCities_PriceToRentRatio.geojson", {
        dataType: "json",
        success: function(response){
            //create a Leaflet GeoJSON Cluster Group layer
            var priceToRentRatiosClusterGroup = L.markerClusterGroup({
              showCoverageOnHover: false,
              maxClusterRadius: 20,
              removeOutsideVisibleBounds: false,
            });
            var priceToRentRatiosGeoJSON = L.geoJson(response, geoJsonFunctionOptions);
            //add the JSON to the Cluster group, and the cluster to the map
            priceToRentRatiosClusterGroup.addLayer(priceToRentRatiosGeoJSON);
            map.addLayer(priceToRentRatiosClusterGroup);

            //get attribute labels
            var attributes = extractAttributeLabels(response);

            //Create Map Control Elements
            setupElements(map, attributes);
        }
    });
};

//this object passed to L.geoJson();
var geoJsonFunctionOptions = {
    pointToLayer: function (feature, latlng) {
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



function generatePopup(feature, attribute) {
  return '<strong>' + feature.properties['toGeocode'] + '</strong>' + '</br>'
    + '<span class="popupAttributeLabel">Price-to-Rent Ratio <em>(' + attribute + ')</em></span>' + '</br>'
    + '<span class="popupAttributeValue">' + feature.properties[attribute];
}

function onEachFeature(feature, layer) {
    var popupContent = generatePopup(feature, '2015-12');
    onEachFeaturePopupSetup(layer, popupContent);
};

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

function setupElements(map, attributes) {

  // DIALOG //
  $('#dialog').dialog({
    width: 300,
    dialogClass: 'legend',
    resizable: false,
    closeText: 'Expand',
    beforeClose: function () {
      window.alert('Sorry, this functionality has not been implemented yet!');
      return false;
    },
  });
  $('#dialog').html(
    '<div id="legendFlexContainer">'
      +'<div id="attributeContainer">'
        +'<div>Price-to-Rent</br>Ratio <span id="attrField">2015-12</span></div>'
      +'</div>'
      +'<div id="legendSymbols">'
        +'<div class="s3 circle legendRow"></div>'
        +'<div class="s2 circle legendRow"></div>'
        +'<div class="s1 circle legendRow"></div>'
      +'</div>'
      +'<div id="legendLabels">'
        +'<div class="s3 label legendRow"><div>19</div></div>'
        +'<div class="s2 label legendRow"><div>14</div></div>'
        +'<div class="s1 label legendRow"><div>9</div></div>'
      +'</div>'
    +'</div>'
  );
  $('#dialog').dialog('open').dialog('option', 'position',
    { my: "left bottom", at: "left+10 bottom-10", of: window}
  );

  // Modifying the close buttons behavior and adding another one
  //this first line selects the existing close button
  $('.legend .ui-dialog-titlebar .ui-dialog-titlebar-close[title="Expand"] .ui-icon')
    //remove extraneous classes
    .removeClass('ui-icon-closethick').removeClass('ui-button-icon-primary')
    .addClass('ui-icon-plus'); //add this class, which has a different symbol
  // Here, we clone the existing close button, and append the copy
  $('.legend .ui-dialog-titlebar').append(
    $('.legend .ui-dialog-titlebar-close').clone()
    //then we move it over a bit and change its title attribute so we can identify it
    .css('right', '28px').attr('title', 'Dock')
  );
  // Now, we select the icon within the cloned copy
  $('.legend .ui-dialog-titlebar .ui-dialog-titlebar-close[title="Dock"] .ui-icon')
    .removeClass('ui-icon-plus').addClass('ui-icon-carat-1-sw') //and change its classes
    //add an event listener & function
    .on('click', function() {
      $('#dialog').dialog('option', 'position',
        { my: "left bottom", at: "left+10 bottom-10", of: window});
  });

  //hide this wierd empty text that increases the clickable area of the buttons
  $('.ui-dialog-titlebar-close[title] .ui-button-text').hide();

  var symbolization = 'size';
  $('.legend .ui-dialog-titlebar .ui-dialog-title').append(
    '<div id="symbolizationPicker" style="display: inline;">'
      +'<input type="radio" id="size" name="symbolization" checked>'
      +'<label for="size">Size</label>'
      +'<input type="radio" id="color" name="symbolization">'
      +'<label for="color">Color</label>'
    +'</div>'
  );
  $('#symbolizationPicker').buttonset();

  // SLIDER //
  function updateProportionalSymbols(ui) {
    var attribute = ui.value-1;
    // Update Proportional Symbols
    map.eachLayer(function(layer) {
      $('#attrField').html(attributes[attribute]);
      //if the layer is a marker cluster group
      if (layer.getChildCount) {
        //do this for all markers in the cluster
        var markers = layer.getAllChildMarkers();
        for (i = 0; i < markers.length; i++) {
          updateProportionalSymbolsOneLayer(markers[i], attribute);
        }
      }
      //if the layer is a feature (not in a cluster) AND has the given property
      else if (layer.feature && layer.feature.properties[attributes[attribute]]) {
        updateProportionalSymbolsOneLayer(layer, attribute);
      } else {
        //console.log('layer was neither a cluster nor a marker');
      }
    });
  }

  function updateProportionalSymbolsOneLayer(layer, attribute) {
    //access feature properties
    var props = layer.feature.properties;

    if (symbolization === 'size') {
      layer.setStyle({fillColor: '#ff7800'});
      //update each feature's radius based on new attribute values
      var radius = calcPropRadius(props[attributes[attribute]]);
      layer.setRadius(radius);
    } else if (symbolization === 'color') {
      layer.setRadius(7);
      //update each feature's color based on new attribute values
      var color = calcSymbolColor(props[attributes[attribute]]);
      layer.setStyle({fillColor: color});
    } else {
      console.log('erroneous symbolization!');
    }

    var popupContent = generatePopup(layer.feature, attributes[attribute]);
    onEachFeaturePopupSetup(layer, popupContent);
  }

  $( "#slider" ).slider({
    min: 1,
    max: 63,
    value: 63,
    step: 1,
    slide: function(event, ui) {
      updateProportionalSymbols(ui);
    },
    change: function(event, ui) {
      updateProportionalSymbols(ui);
    },
  });
  $( "#slider, #slider span" ).on('mouseover', function() {
    $(this).css('cursor', 'pointer');
  });

  // SLIDER CONTROLS //
  $('#slider-buttons').on('mouseover', function() {
    $(this).css('cursor', 'pointer');
  });
  //fast backward
  $('#slider-buttons .fa-fast-backward').on('click', function() {
    $('#slider').slider('value', $('#slider').slider('option', 'min'));
  });
  //step backward
  $('#slider-buttons .fa-step-backward').on('click', function() {
    $('#slider').slider('value', $('#slider').slider('value')-1);
  });
  //play
  $('#slider-buttons .fa-play').on('click', function() {
    //$(this).removeClass('fa-play').addClass('fa-pause');
    window.alert('Sorry, this functionality has not been implemented yet!');
  });
  //step forward
  $('#slider-buttons .fa-step-forward').on('click', function() {
    $('#slider').slider('value', $('#slider').slider('value')+1);
  });
  //fast forward
  $('#slider-buttons .fa-fast-forward').on('click', function() {
    $('#slider').slider('value', $('#slider').slider('option', 'max'));
  });

  $('#symbolizationPicker label[for="size"]').on('click', function() {
    symbolization = 'size';
    $('#dialog').html(
      '<div id="legendFlexContainer">'
        +'<div id="attributeContainer">'
          +'<div>Price-to-Rent</br>Ratio <span id="attrField">2015-12</span></div>'
        +'</div>'
        +'<div id="legendSymbols">'
          +'<div class="s3 circle legendRow"></div>'
          +'<div class="s2 circle legendRow"></div>'
          +'<div class="s1 circle legendRow"></div>'
        +'</div>'
        +'<div id="legendLabels">'
          +'<div class="s3 label legendRow"><div>19</div></div>'
          +'<div class="s2 label legendRow"><div>14</div></div>'
          +'<div class="s1 label legendRow"><div>9</div></div>'
        +'</div>'
      +'</div>'
    );
    updateProportionalSymbols( {value: $('#slider').slider('value')} );
  });
  $('#symbolizationPicker label[for="color"]').on('click', function() {
    symbolization = 'color';
    $('#dialog').html(
      '<div id="legendFlexContainer">'
        +'<div id="attributeContainer">'
          +'<div>Price-to-Rent</br>Ratio <span id="attrField">2015-12</span></div>'
        +'</div>'
        +'<div id="legendSymbols">'
          +'<div class="c5 circle legendRow"></div>'
          +'<div class="c4 circle legendRow"></div>'
          +'<div class="c3 circle legendRow"></div>'
          +'<div class="c2 circle legendRow"></div>'
          +'<div class="c1 circle legendRow"></div>'
        +'</div>'
        +'<div id="legendLabels">'
          +'<div class="c5 label legendRow"><div>< 10</div></div>'
          +'<div class="c4 label legendRow"><div>10 - 12.5</div></div>'
          +'<div class="c3 label legendRow"><div>12.5 - 15</div></div>'
          +'<div class="c2 label legendRow"><div>15 - 17.5</div></div>'
          +'<div class="c1 label legendRow"><div>> 17.5</div></div>'
        +'</div>'
      +'</div>'
    );
    updateProportionalSymbols( {value: $('#slider').slider('value')} );
  });
}

$(document).ready(createMap);
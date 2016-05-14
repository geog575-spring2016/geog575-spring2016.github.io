function setupControls(map, attributes, clusterGroup) {

  function generateLegendHtml(symbolization, labels) {
    var legendHtml = ''
    +'<div id="attributeText">'
      +'Price-to-Rent</br>Ratio <span>2015-12</span>'
    +'</div>'
    +'<div id="legendSymbols">';
    for (i=0; i<labels.length; i++) {
      var classCode = labels.length-i;
      legendHtml += '<div class="'+symbolization+classCode+'"></div>';
    }
    legendHtml += ''
    +'</div>'
    +'<div id="legendLabels">';
    for (i=0; i<labels.length; i++) {
      var classCode = labels.length-i;
      legendHtml += '<div class="'+symbolization+classCode+'">'+labels[i]+'</div>';
    }
    legendHtml += ''
    +'</div>';

    return legendHtml;
  }

  var symbolizationPickerHtml = ''
  +'<div id="symbolizationPicker" style="display: inline;">'
    +'<input type="radio" id="size" name="symbolization" checked>'
    +'<label for="size">Size</label>'
    +'<input type="radio" id="color" name="symbolization">'
    +'<label for="color">Color</label>'
  +'</div>';

  $('#dialog').html(generateLegendHtml('size',[19,14,9]));
  $('#dialog').dialog({
    width: 300,
    height: 200,
    dialogClass: 'legend',
    resizable: false,
    closeText: 'Expand',
    //this function controls what happens when you press the close button
    beforeClose: function () {
      window.alert('Sorry, this functionality has not been implemented yet!');
      return false;
    },
  });

  //Once the dialog box is open, we add a similarly-styled button to the header
  //First, select the existing close button...
  $('.legend .ui-dialog-titlebar .ui-dialog-titlebar-close[title="Expand"] .ui-icon')
    //remove extraneous classes
    .removeClass('ui-icon-closethick').removeClass('ui-button-icon-primary')
    //jQueryUI comes with class for pretty icons
    .addClass('ui-icon-plus');
  //Then, we clone the existing close button, and append the copy
  $('.legend .ui-dialog-titlebar').append(
    $('.legend .ui-dialog-titlebar-close').clone()
    //then we move it over a bit and change its title attribute so we can identify it
    .css('right', '28px').attr('title', 'Dock')
  );
  //Now, select the icon within the cloned copy, like above
  $('.legend .ui-dialog-titlebar .ui-dialog-titlebar-close[title="Dock"] .ui-icon')
    //swap classes to get the icon we want
    .removeClass('ui-icon-plus').addClass('ui-icon-carat-1-sw')
    //add an event listener & function
    .on('click', function() {
      $('#dialog').dialog('option', 'position',
        { my: "left bottom", at: "left+10 bottom-10", of: window});
    });

  //hide this wierd empty text that increases the clickable area of the buttons
  $('.ui-dialog-titlebar-close[title] .ui-button-text').hide();

  //Append a symbolizationPicker, and apply jQueryUI styling
  $('.legend .ui-dialog-titlebar .ui-dialog-title').append(symbolizationPickerHtml);
  $('#symbolizationPicker').buttonset();

  //declare a variable to hold the current symbolization
  var symbolization = 'size';

  //we wait until now to open and position the dialog, b/c the
  //symbolizationPicker adds a but of height to the whole thing
  $('#dialog').dialog('open').dialog('option', 'position',
    { my: "left bottom", at: "left+10 bottom-10", of: window}
  );

  //change the legend and update the symbols when the symbolization is changed
  $('#symbolizationPicker label[for="size"]').on('click', function() {
    symbolization = 'size';
    $('#dialog').html(generateLegendHtml(symbolization,[19,14,9]));
    updateProportionalSymbols( {value: $('#slider').slider('value')} );
  });
  $('#symbolizationPicker label[for="color"]').on('click', function() {
    symbolization = 'color';
    $('#dialog').html(generateLegendHtml(symbolization,['< 10','10 - 12.5','12.5 - 15','15 - 17.5','< 17.5']));
    updateProportionalSymbols( {value: $('#slider').slider('value')} );
  });

  function updateProportionalSymbols(ui) {
    //get attribute index, based on slider value
    var attribute = ui.value-1;
    //update the legend text
    $('#attributeText span').html(attributes[attribute]);
    //for each map layer...
    map.eachLayer(function(layer) {
      //if the layer is a marker cluster group
      if (layer.getChildCount) {
        //update each marker in the cluster
        var markers = layer.getAllChildMarkers();
        for (i = 0; i < markers.length; i++) {
          updateProportionalSymbolsOneLayer(markers[i], attribute);
        }
      }
      //if the layer is a feature (not in a cluster)
      //in other words, these are the proportional symbols that are
      //hidden inside a cluster marker for the current zoom level
      else if (layer.feature) {
        updateProportionalSymbolsOneLayer(layer, attribute);
      } else {
        console.log('layer was neither a cluster nor a marker');
      }
    });

    //after all the individual markers are updated, refresh the cluster icons
    clusterGroup.refreshClusters();
  }

  function updateProportionalSymbolsOneLayer(layer, attribute) {
    //access feature properties
    var props = layer.feature.properties;

    if (symbolization === 'size') {
      layer.setStyle({fillColor: '#ff7800'});
      //update each feature's radius based on new attribute values
      if (props[attributes[attribute]]) {
        layer.setRadius(calcPropRadius(props[attributes[attribute]]));
      } else {
        //if the layer does not have that attribute value for the timestamp...
        layer.setRadius(0);
      }
    } else if (symbolization === 'color') {
      layer.setRadius(7);
      //update each feature's color based on new attribute values
      if (props[attributes[attribute]]) {
        layer.setStyle({fillColor: calcSymbolColor(props[attributes[attribute]])});
      } else {
        //if the layer does not have that attribute value for the timestamp...
        layer.setRadius(0);
      }
    } else {
      console.log('erroneous symbolization!');
    }

    //update Popup
    onEachFeaturePopupSetup(layer, generatePopup(layer.feature, attributes[attribute]));
  }

  var SequenceControl = L.Control.extend({
    options: {
      position: 'topright'
    },

    onAdd: function (map) {
      //jQueryUI Slider
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

      //Apply event listeners to the slider buttons...
      //change the cursor appropriately when slider elements are moused over
      $('#slider, #slider span, #slider-buttons').on('mouseover', function() {
        $(this).css('cursor', 'pointer');
      });
      //fast backward makes slider value = min
      $('#slider-buttons .fa-fast-backward').on('click', function() {
        $('#slider').slider('value', $('#slider').slider('option', 'min'));
      });
      //step backward decrements slider value by 1
      $('#slider-buttons .fa-step-backward').on('click', function() {
        $('#slider').slider('value', $('#slider').slider('value')-1);
      });
      //play
      $('#slider-buttons .fa-play').on('click', function() {
        //$(this).removeClass('fa-play').addClass('fa-pause');
        window.alert('Sorry, this functionality has not been implemented yet!');
      });
      //step forward increments slider value by 1
      $('#slider-buttons .fa-step-forward').on('click', function() {
        $('#slider').slider('value', $('#slider').slider('value')+1);
      });
      //fast forward makes slider value = max
      $('#slider-buttons .fa-fast-forward').on('click', function() {
        $('#slider').slider('value', $('#slider').slider('option', 'max'));
      });

      //kill any mouse event listeners on the map
      $( "#slider-control" ).on('mousedown dblclick', function(e){
          L.DomEvent.stopPropagation(e);
      });

      return $( "#slider-control" ).get(0);
    }
  });

  map.addControl(new SequenceControl());
}
/* Metro Transit */

//global variables
var populationLayer
var ageLayer
var whiteLayer
var blackLayer
var asianLayer
var mhiLayer
var droveAloneLayer
var carpoolLayer
var publicTransitLayer
var bikesLayer
var walkedLayer
var otherCommuteLayer
var homeLayer
var householdsLayer
var kidsLayer
var X = 0

var attrArray = ["Population","MedianAge", "Households", "Kids", "CarTruckVan", "PublicTransportation", "DroveAlone", "Carpool", "PublicTransit", "Bikes", "Walked", "OtherCommute", "WorkedFromHome", "WhiteNormalized", "BlackNormalized", "AsianNormalized", "MHI", "Other Race"]; 


//Create the Leaflet map
function createMap(){

  //setting pan bounds
  var southWest = L.latLng(44.596356, -93.812432),
  northEast = L.latLng(45.403478, -92.812017),
  bounds = L.latLngBounds(southWest, northEast);
  
	var map = L.map('map', {
		center: [44.958401, -93.226810],
		zoom: 11,
    zoomControl: false,
    scrollWheelZoom: false,
    maxBounds: bounds
	});

  map.createPane('labels');
  map.getPane('labels').style.zIndex = 650;


	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  	maxZoom: 14,
  	minZoom: 10,
  	id: 'gvriezen.59a5f47c', //here's what we need <--- EX: swal94.4103e88e
  	accessToken: 'pk.eyJ1IjoiZ3ZyaWV6ZW4iLCJhIjoiY2lsMTJvZ3BtMmZyeHYybTNocm1kZmg0eiJ9.mW_JTzHQbMfovynNVqHaZA'
  }).addTo(map);

  Stamen_TonerLabels = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 10,
    maxZoom: 14,
    ext: 'png',
    pane: 'labels'
  }).addTo(map);

  getRailData(map);

  var zoomHome = L.Control.zoomHome();
  zoomHome.addTo(map);

  new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google()
  }).addTo(map);

  dropdown(map);

  showDropdown(map);

  
  var goldLine = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#FBBD12', 
            weight: 3,
            dashArray: '5',
            opacity: 1,
            zIndex: 3
        };
    }
  });
  var orangeLine = L.geoJson (null,{
   style: function(feature) {
        return {
         color: ' #F68B1F',
         weight: 3,
         dashArray: '5',
         opacity: 1,
         zIndex: 3 
     };
    }
  });
  var blueLineExt = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#0053A0',
            weight: 3,
            dashArray: '5',
            opacity: 1,
            zIndex: 3
      };
    }
  });
  var redLineExt = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#ED1B2E',
            weight: 3,
            dashArray: '5',
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var greenLineExt = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: ' #028244',
            weight: 3,
            opacity: 1,
            dashArray: '5',
            zIndex: 3
     };
    }
  });

  var futurelinefiles = omnivore.topojson('data/topojsons/GoldLine.topojson', null, goldLine)
                        omnivore.topojson('data/topojsons/OrangeLine.topojson', null, orangeLine)
                        omnivore.topojson('data/topojsons/BlueLineExt.topojson', null, blueLineExt)
                        omnivore.topojson('data/topojsons/GreenLineExt.topojson', null, greenLineExt)
                        omnivore.topojson('data/topojsons/RedLineExt.topojson', null, redLineExt)

  var futurelines = L.easyButton({
    states: [{
      stateName: 'add-markers',
      icon: 'fa-subway',
      title: 'Add future lines',
      onClick: function(control) {
        map.addLayer(goldLine);
        map.addLayer(orangeLine);
        map.addLayer(blueLineExt);
        map.addLayer(greenLineExt);
        map.addLayer(redLineExt);
        control.state('remove-markers');
      }
    }, {
      icon: 'fa-undo',
      stateName: 'remove-markers',
      onClick: function(control) {
        map.removeLayer(goldLine);
        map.removeLayer(orangeLine);
        map.removeLayer(blueLineExt);
        map.removeLayer(greenLineExt);
        map.removeLayer(redLineExt);
        control.state('add-markers');
      },
      title: 'Remove future lines'
    }]
  });
  futurelines.addTo(map);

  var walkblue = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#0053A0',
            fillColor: '#0053A0',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var walkgreen = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#028244',
            fillColor: '#028244',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var walkred = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#ED1B2E',
            fillColor: '#ED1B2E',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var walknorthstar = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#000066',
            fillColor: '#000066',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var walkshared = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#016B72',
            fillColor: '#016B72',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });

  var walkexisting = omnivore.topojson('data/topojsons/WalkableBlue.topojson', null, walkblue)
                     omnivore.topojson('data/topojsons/WalkableGreen.topojson', null, walkgreen)
                     omnivore.topojson('data/topojsons/WalkableRed.topojson', null, walkred)
                     omnivore.topojson('data/topojsons/WalkableNorthStar.topojson', null, walknorthstar)
                     omnivore.topojson('data/topojsons/WalkableShared.topojson', null, walkshared) 

  var walkablebutton = L.easyButton({
    states: [{
      stateName: 'add-markers',
      icon: 'fa-user',
      title: 'Add areas within walking distance of station',
      onClick: function(control) {
        map.addLayer(walkblue);
        map.addLayer(walkgreen);
        map.addLayer(walkred);
        map.addLayer(walknorthstar);
        map.addLayer(walkshared);
        control.state('remove-markers');
      }
    }, {
      icon: 'fa-undo',
      stateName: 'remove-markers',
      onClick: function(control) {
        map.removeLayer(walkblue);
        map.removeLayer(walkgreen);
        map.removeLayer(walkred);
        map.removeLayer(walknorthstar);
        map.removeLayer(walkshared);
        control.state('add-markers');
      },
      title: 'Remove areas within walking distance of station'
    }]
  });
  walkablebutton.addTo(map);

  var walkblueext = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#0053A0',
            fillColor: '#0053A0',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var walkgreenext = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#028244',
            fillColor: '#028244',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var walkredext = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#ED1B2E',
            fillColor: '#ED1B2E',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var walkorange = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#F68B1F',
            fillColor: '#F68B1F',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });
  var walkgold = L.geoJson (null,{
   style: function(feature) {
        return { 
            color: '#FBBD12',
            fillColor: '#FBBD12',
            fillOpacity: .3,
            weight: 1,
            opacity: 1,
            zIndex: 3
     };
    }
  });

  var walkfuture = omnivore.topojson('data/topojsons/WalkableBlueExt.topojson', null, walkblueext)
                   omnivore.topojson('data/topojsons/WalkableGreenExt.topojson', null, walkgreenext)
                   omnivore.topojson('data/topojsons/WalkableRedExt.topojson', null, walkredext)
                   omnivore.topojson('data/topojsons/WalkableOrange.topojson', null, walkorange)
                   omnivore.topojson('data/topojsons/WalkableGold.topojson', null, walkgold) 

  var futurewalkablebutton = L.easyButton({
    states: [{
      stateName: 'add-markers',
      icon: 'fa-user-plus',
      title: 'Add areas within walking distance of future station',
      onClick: function(control) {
        map.addLayer(walkblueext);
        map.addLayer(walkgreenext);
        map.addLayer(walkredext);
        map.addLayer(walkorange);
        map.addLayer(walkgold);
        control.state('remove-markers');
      }
    }, {
      icon: 'fa-undo',
      stateName: 'remove-markers',
      onClick: function(control) {
        map.removeLayer(walkblueext);
        map.removeLayer(walkgreenext);
        map.removeLayer(walkredext);
        map.removeLayer(walkorange);
        map.removeLayer(walkgold);
        control.state('add-markers');
      },
      title: 'Remove areas within walking distance of future station'
    }]
  });
  futurewalkablebutton.addTo(map);


  function showDropdown(map) {

    $('#blank').click(function() {
      removeAllLayers(map);
    });

    $('#population').click(function(){
      
      removeAllLayers(map);
      getCensusDataPopulation(map);
      
    });

    $('#age').click(function(){
       
      removeAllLayers(map);
      getCensusDataAge(map);
    
    }); 

    $('#white').click(function(){
    
      removeAllLayers(map);
      getCensusDataWhite(map);
      
    });

    $('#black').click(function(){
  
      removeAllLayers(map);
      getCensusDataBlack(map);
      
    });
    $('#asian').click(function(){
  
      removeAllLayers(map);
      getCensusDataAsian(map);
      
    });

    $('#alone').click(function(){
   
      removeAllLayers(map);
      getCensusDataDroveAlone(map);
      
    });
    $('#carpool').click(function(){
   
      removeAllLayers(map);
      getCensusDataCarpool(map);
      
    });
    $('#publictransit').click(function(){
  
      removeAllLayers(map);
      getCensusDataPublicTransit(map);
      
    });
    $('#bike').click(function(){
   
      removeAllLayers(map);
      getCensusDataBikes(map);
      
    });
    $('#walked').click(function(){
  
      removeAllLayers(map);
      getCensusDataWalked(map);
      
    });
    $('#alternate').click(function(){
  
      removeAllLayers(map);
      getCensusDataOtherCommute(map);
      
    });
    $('#home').click(function(){
  
      removeAllLayers(map);
      getCensusDataWorkedFromHome(map);
      
    });
    $('#household').click(function(){
  
      removeAllLayers(map);
      getCensusDataHouseholds(map);
      
    });
    $('#kids').click(function(){
  
      removeAllLayers(map);
      getCensusDataKids(map);
      
    });
    $('#income').click(function(){
  
      removeAllLayers(map);
      getCensusDataIncome(map);
      
    });

  };

};


function removeAllLayers (map) {

  console.log(X);
  
  if (X===1){
    map.removeLayer(populationLayer);
  } else if (X===2){
    map.removeLayer(ageLayer);
  } else if (X===3){
    map.removeLayer(whiteLayer);
  } else if (X===4){
    map.removeLayer(blackLayer)
  } else if (X===5){
    map.removeLayer(asianLayer);
  } else if (X===7){
    map.removeLayer(mhiLayer);
  } else if (X===8){
    map.removeLayer(droveAloneLayer);
  } else if (X===9){
    map.removeLayer(carpoolLayer);
  } else if (X===10){
    map.removeLayer(publicTransitLayer);
  } else if (X===11){
    map.removeLayer(bikesLayer);
  } else if (X===12){
    map.removeLayer(walkedLayer);
  } else if (X===13){
    map.removeLayer(otherCommuteLayer);
  } else if (X===14){
    map.removeLayer(homeLayer);
  }
   else if (X===17){
    map.removeLayer(householdsLayer);
  } else if (X===18){
    map.removeLayer(kidsLayer);
  }

};



 function dropdown (map) {


 var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
div.innerHTML = 

'<select><option id="blank">-Select a Variable-</option><option id="demographic" disabled>Demographic</option><option id ="white">White</option><option id ="black">Black</option><option id ="asian">Asian</option><option id="commutetype" disabled>Commute Type</option><option id ="alone">Drive Alone</option><option id ="carpool">Carpool</option><option id ="publictransit">Public Transit</option><option id ="bike">Bike</option><option id ="walked">Walk</option><option id ="alternate">Other Commute Type</option><option id ="home">Work From Home</option><option id="householdtype" disabled>Household Type</option><option id ="household">Households</option><option id ="kids">Kids</option><option id="misc" disabled>Miscellaneous</option><option id="population">Population Density</option><option id="age">Median Age</option><option id ="income">Median Household Income</option></select>'

div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
return div;

};

legend.addTo(map);
};

function updateLegend(){

  if (X===1){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Population Density</p>" + "<p class='legendLabel'>(People/sq mi)</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>2,630</p>"))
    $("#label2").append($("<p class='legendLabel'>2,630-</p>" + "<p class='legendLabel'>5,500</p>"))
    $("#label3").append($("<p class='legendLabel'>5,500-</p>" + "<p class='legendLabel'>9,500</p>"))
    $("#label4").append($("<p class='legendLabel'>9,500-</p>" + "<p class='legendLabel'>15,550</p>"))
    $("#label5").append($("<p class='legendLabel'>15,550-</p>" + "<p class='legendLabel'>26,212</p>"))
  } else if (X===2){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Median Age</p>" + "<p class='legendLabel'>(years)</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>28</p>"))
    $("#label2").append($("<p class='legendLabel'>28-</p>" + "<p class='legendLabel'>34</p>"))
    $("#label3").append($("<p class='legendLabel'>34-</p>" + "<p class='legendLabel'>39</p>"))
    $("#label4").append($("<p class='legendLabel'>39-</p>" + "<p class='legendLabel'>44</p>"))
    $("#label5").append($("<p class='legendLabel'>44-</p>" + "<p class='legendLabel'>62</p>"))
  } else if (X===3){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent White</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>36%</p>"))
    $("#label2").append($("<p class='legendLabel'>36-</p>" + "<p class='legendLabel'>59%</p>"))
    $("#label3").append($("<p class='legendLabel'>59-</p>" + "<p class='legendLabel'>75%</p>"))
    $("#label4").append($("<p class='legendLabel'>75-</p>" + "<p class='legendLabel'>87%</p>"))
    $("#label5").append($("<p class='legendLabel'>87-</p>" + "<p class='legendLabel'>99%</p>"))
  } else if (X===4){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Black</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>4%</p>"))
    $("#label2").append($("<p class='legendLabel'>4-</p>" + "<p class='legendLabel'>13%</p>"))
    $("#label3").append($("<p class='legendLabel'>13-</p>" + "<p class='legendLabel'>26%</p>"))
    $("#label4").append($("<p class='legendLabel'>26-</p>" + "<p class='legendLabel'>44%</p>"))
    $("#label5").append($("<p class='legendLabel'>44-</p>" + "<p class='legendLabel'>76%</p>"))
  } else if (X===5){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Asian</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>3%</p>"))
    $("#label2").append($("<p class='legendLabel'>3-</p>" + "<p class='legendLabel'>8%</p>"))
    $("#label3").append($("<p class='legendLabel'>8-</p>" + "<p class='legendLabel'>16%</p>"))
    $("#label4").append($("<p class='legendLabel'>16-</p>" + "<p class='legendLabel'>26%</p>"))
    $("#label5").append($("<p class='legendLabel'>26-</p>" + "<p class='legendLabel'>44%</p>"))
  } else if (X===7){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Median Household Income</p>"))
    $("#label1").append($("<p class='legendLabel'>$0-</p>" + "<p class='legendLabel'>39,700</p>"))
    $("#label2").append($("<p class='legendLabel'>$39,700-</p>" + "<p class='legendLabel'>61,660</p>"))
    $("#label3").append($("<p class='legendLabel'>$61,660-</p>" + "<p class='legendLabel'>83,900</p>"))
    $("#label4").append($("<p class='legendLabel'>$83,900-</p>" + "<p class='legendLabel'>110,000</p>"))
    $("#label5").append($("<p class='legendLabel'>$110,000,-</p>" + "<p class='legendLabel'>177,727</p>"))
  } else if (X===8){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Driving Alone</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>22%</p>"))
    $("#label2").append($("<p class='legendLabel'>22-</p>" + "<p class='legendLabel'>36%</p>"))
    $("#label3").append($("<p class='legendLabel'>36-</p>" + "<p class='legendLabel'>44%</p>"))
    $("#label4").append($("<p class='legendLabel'>44-</p>" + "<p class='legendLabel'>50%</p>"))
    $("#label5").append($("<p class='legendLabel'>50-</p>" + "<p class='legendLabel'>63%</p>"))
  } else if (X===9){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Carpooling</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>2%</p>"))
    $("#label2").append($("<p class='legendLabel'>2-</p>" + "<p class='legendLabel'>4%</p>"))
    $("#label3").append($("<p class='legendLabel'>4-</p>" + "<p class='legendLabel'>5%</p>"))
    $("#label4").append($("<p class='legendLabel'>5-</p>" + "<p class='legendLabel'>8%</p>"))
    $("#label5").append($("<p class='legendLabel'>8-</p>" + "<p class='legendLabel'>14%</p>"))
  } else if (X===10){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Using Public Transit</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>1%</p>"))
    $("#label2").append($("<p class='legendLabel'>1-</p>" + "<p class='legendLabel'>3%</p>"))
    $("#label3").append($("<p class='legendLabel'>3-</p>" + "<p class='legendLabel'>6%</p>"))
    $("#label4").append($("<p class='legendLabel'>6-</p>" + "<p class='legendLabel'>10%</p>"))
    $("#label5").append($("<p class='legendLabel'>10-</p>" + "<p class='legendLabel'>17%</p>"))
  } else if (X===11){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Biking</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>0.5%</p>"))
    $("#label2").append($("<p class='legendLabel'>0.5-</p>" + "<p class='legendLabel'>1.5%</p>"))
    $("#label3").append($("<p class='legendLabel'>1.5-</p>" + "<p class='legendLabel'>3%</p>"))
    $("#label4").append($("<p class='legendLabel'>3-</p>" + "<p class='legendLabel'>6%</p>"))
    $("#label5").append($("<p class='legendLabel'>6-</p>" + "<p class='legendLabel'>10%</p>"))
  } else if (X===12){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Walking</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>0.8%</p>"))
    $("#label2").append($("<p class='legendLabel'>0.8-</p>" + "<p class='legendLabel'>2%</p>"))
    $("#label3").append($("<p class='legendLabel'>2-</p>" + "<p class='legendLabel'>5%</p>"))
    $("#label4").append($("<p class='legendLabel'>5-</p>" + "<p class='legendLabel'>12%</p>"))
    $("#label5").append($("<p class='legendLabel'>12-</p>" + "<p class='legendLabel'>29%</p>"))
  } else if (X===13){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Using Other Transportation</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>0.15%</p>"))
    $("#label2").append($("<p class='legendLabel'>0.15-</p>" + "<p class='legendLabel'>0.4%</p>"))
    $("#label3").append($("<p class='legendLabel'>0.4-</p>" + "<p class='legendLabel'>0.7%</p>"))
    $("#label4").append($("<p class='legendLabel'>0.7-</p>" + "<p class='legendLabel'>1.2%</p>"))
    $("#label5").append($("<p class='legendLabel'>1.2-</p>" + "<p class='legendLabel'>2.29%</p>"))
  } else if (X===14){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Working at Home</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>1%</p>"))
    $("#label2").append($("<p class='legendLabel'>1-</p>" + "<p class='legendLabel'>2%</p>"))
    $("#label3").append($("<p class='legendLabel'>2-</p>" + "<p class='legendLabel'>4%</p>"))
    $("#label4").append($("<p class='legendLabel'>4-</p>" + "<p class='legendLabel'>16%</p>"))
    $("#label5").append($("<p class='legendLabel'>16-</p>" + "<p class='legendLabel'>33%</p>"))
  } else if (X===17){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percent Households</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>16%</p>"))
    $("#label2").append($("<p class='legendLabel'>16-</p>" + "<p class='legendLabel'>36%</p>"))
    $("#label3").append($("<p class='legendLabel'>36-</p>" + "<p class='legendLabel'>43%</p>"))
    $("#label4").append($("<p class='legendLabel'>43-</p>" + "<p class='legendLabel'>54%</p>"))
    $("#label5").append($("<p class='legendLabel'>54-</p>" + "<p class='legendLabel'>76%</p>"))
  } else if (X===18){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Percentage of Households with Children</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>4%</p>"))
    $("#label2").append($("<p class='legendLabel'>4-</p>" + "<p class='legendLabel'>8%</p>"))
    $("#label3").append($("<p class='legendLabel'>8-</p>" + "<p class='legendLabel'>11%</p>"))
    $("#label4").append($("<p class='legendLabel'>11-</p>" + "<p class='legendLabel'>13%</p>"))
    $("#label5").append($("<p class='legendLabel'>13-</p>" + "<p class='legendLabel'>20%</p>"))
  }
}



//Import GeoJSON data
function getCensusDataPopulation(map){
  X=1
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 15556 ? '#000000' : // high end of break 26,212
           d > 9507  ? '#404040' :
           d > 5500  ? '#808080' :
           d > 2634   ? '#BFBFBF' :
           d <= 2634   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
     console.log (feature);
    return {
        fillColor: getColor(feature.properties.PopArea),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

populationLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};

function getCensusDataAge(map){
  X=2
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 44 ? '#000000' :  // high end of break 62
           d > 39  ? '#404040' :
           d > 34  ? '#808080' :
           d > 28   ? '#BFBFBF' :
           d <= 28   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.MedianAge),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 ageLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};

//race data

function getCensusDataWhite(map){
  X=3
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 87 ? '#000000' :  // high end of break 99
           d > 75  ? '#404040' :
           d > 59  ? '#808080' :
           d > 36   ? '#BFBFBF' :
           d <= 36   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.WhiteNormalized),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 whiteLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};


function getCensusDataBlack(map){
  X=4
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 44 ? '#000000' :  // high end of break 76
           d > 26  ? '#404040' :
           d > 13  ? '#808080' :
           d > 4   ? '#BFBFBF' :
           d <= 4   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.BlackNormalized),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 blackLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};


function getCensusDataAsian(map){
  X=5
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 26 ? '#000000' :  // high end of break 44
           d > 16  ? '#404040' :
           d > 8  ? '#808080' :
           d > 3   ? '#BFBFBF' :
           d <= 3   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.AsianNormalized),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 asianLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};


//median household income data

function getCensusDataIncome(map){
  X=7
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 109967 ? '#000000' : // high end of break 177,727
           d > 83906  ? '#404040' :
           d > 61660  ? '#808080' :
           d > 39710   ? '#BFBFBF' :
           d <= 39710   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.MHI),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 mhiLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};

//commmute type

function getCensusDataDroveAlone(map){
  X=8
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 50 ? '#000000' : // high end of break 63
           d > 44  ? '#404040' :
           d > 36  ? '#808080' :
           d > 22   ? '#BFBFBF' :
           d <= 22   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.DroveAlone),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 droveAloneLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};

function getCensusDataCarpool(map){
  X=9
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 8 ? '#000000' : // high end of break 14
           d > 5  ? '#404040' :
           d > 4  ? '#808080' :
           d > 2   ? '#BFBFBF' :
           d <= 2   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.Carpool),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 carpoolLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};


function getCensusDataPublicTransit(map){
  X=10
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 10 ? '#000000' : // high end of break 17
           d > 6  ? '#404040' :
           d > 3  ? '#808080' :
           d > 1   ? '#BFBFBF' :
           d <= 1   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.PublicTransit),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 publicTransitLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};

function getCensusDataBikes(map){
  X=11
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 6 ? '#000000' : // high end of break 10
           d > 3  ? '#404040' :
           d > 1.5  ? '#808080' :
           d > 0.5   ? '#BFBFBF' :
           d <= 0.5   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.Bikes),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 bikesLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};


function getCensusDataWalked(map){
  X=12
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 12 ? '#000000' : // high end of break 29
           d > 5  ? '#404040' :
           d > 2  ? '#808080' :
           d > 0.8   ? '#BFBFBF' :
           d <= 0.8   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.Walked),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 walkedLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};


function getCensusDataOtherCommute(map){
  X=13
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 1.20 ? '#000000' : // high end of break 2.29
           d > 0.68  ? '#404040' :
           d > 0.37  ? '#808080' :
           d > 0.12   ? '#BFBFBF' :
           d <= 0.12   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.OtherCommute),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 otherCommuteLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};


function getCensusDataWorkedFromHome(map){
  X=14
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 16 ? '#000000' : // high end of break 33
           d > 4  ? '#404040' :
           d > 2  ? '#808080' :
           d > 1   ? '#BFBFBF' :
           d <= 1   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.WorkedFromHome),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 homeLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};

// mean travel time to work data
// get data for household type

function getCensusDataHouseholds(map){
  X=17
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 54 ? '#000000' : // high end of break 76
           d > 43  ? '#404040' :
           d > 36  ? '#808080' :
           d > 16   ? '#BFBFBF' :
           d <= 16   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.Households),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 householdsLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();
  });

  updateLegend();
};

function getCensusDataKids(map){
  X=18
  $.getJSON("data/CensusTracts/CensusTracts3.geojson",function(censusTracts){

  function getColor(d) {
    return d > 13 ? '#000000' : // high end of break 20
           d > 11  ? '#404040' :
           d > 8  ? '#808080' :
           d > 4   ? '#BFBFBF' :
           d <= 4   ? '#FFFFFF' :
                      '#fcf8e8';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.Kids),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };

  }

 kidsLayer = L.geoJson(censusTracts, {
  style: style,
}).addTo(map).bringToBack();

 createPopups(map, censusTracts);
  });

  updateLegend();
  
};

//end of censustracts3 geojson data

//highlight functions

// function highlightFeature (e) {
//   var layer = e.target;

//   layer.setStyle({
//     weight: 3,
//     color: '#61bf1a'
//   });
// }

// function resetHighlight (e) {
//    if (X===1){
//   populationLayer.resetStyle(e.target);
// } else if (X===2){
//   ageLayer.resetStyle(e.target);
// } else if (X===3){
//   whiteLayer.resetStyle(e.target);
// } else if (X===4){
//     blackLayer.resetStyle(e.target);
// } else if (X===5){
//     asianLayer.resetStyle(e.target);
// } else if (X===7){
//    mhiLayer.resetStyle(e.target);
// } else if (X===8){
//    droveAloneLayer.resetStyle(e.target);
// } else if (X===9){
//    carpoolLayer.resetStyle(e.target);
// } else if (X===10){
//    publicTransitLayer.resetStyle(e.target);
// } else if (X===11){
//    bikesLayer.resetStyle(e.target);
// } else if (X===12){
//    walkedLayer.resetStyle(e.target);
// } else if (X===13){
//    otherCommuteLayer.resetStyle(e.target);
// } else if (X===14){
//    homeLayer.resetStyle(e.target);
// } else if (X===15){
//    publicTransportationLayer.resetStyle(e.target);
// } else if (X===16){
//    vehicleLayer.resetStyle(e.target);
// } else if (X===17){
//    householdsLayer.resetStyle(e.target);
// } else if (X===18){
//    kidsLayer.resetStyle(e.target);
// }


// };

// function onEachFeature (feature, layer) {
//   layer.on({
//     mouseover: highlightFeature,
//     mouseout: resetHighlight
//   });
// }


// function createPopups(map, feature){
  
//     console.log(feature)
  
// }

//




//get data for stations and make markers

function getRailData(map){

  var lakesRivers = L.geoJson (null,{
   style: function(feature) {
        return { 
          color: '#99ddff',
          fillColor: '#e6f2ff',
          fillOpacity: 1,
          weight: 1,
          zIndex: 2,
          opacity: 1
      };
    }
  });
  var blueLine = L.geoJson (null,{
   style: function(feature) {
        return { 
          color: '#0053A0',
          weight: 3,
          opacity: 1,
          zIndex: 3 
        };
    }
  });
  var redLine = L.geoJson (null,{
   style: function(feature) {
        return { 
          color: '#ED1B2E', 
          weight: 3,
          opacity: 1,
          zIndex: 3
        };
    }
  });
  var greenLine = L.geoJson (null,{
   style: function(feature) {
        return { 
          color: '#028244',
          weight: 3,
          opacity: 1,
          zIndex: 3
        };
    }
  });
  var northStarLine3 = L.geoJson (null,{
   style: function(feature) {
        return { 
          color: '#000066',
          weight: 5,
          opacity: 1,
          zIndex: 3
        };
    }
  });
  var northStarLine2 = L.geoJson (null,{
   style: function(feature) {
        return { 
          color: '#FFD204',
          weight: 3,
          opacity: 1,
          zIndex: 4
        };
    }
  });
  var northStarLine = L.geoJson (null,{
   style: function(feature) {
        return { 
          color: '#000066',
          weight: 1,
          opacity: 1,
          zIndex: 5
        };
    }
  });

  var railLines =
  omnivore.topojson('data/topojsons/LakesAndRivers.topojson', null, lakesRivers).addTo(map);
  omnivore.topojson('data/topojsons/BlueLine.topojson', null, blueLine).addTo(map).bringToBack();
  omnivore.topojson('data/topojsons/RedLine.topojson', null, redLine).addTo(map);
  omnivore.topojson('data/topojsons/GreenLine.topojson', null, greenLine).addTo(map);
  omnivore.topojson('data/topojsons/NorthStarLine.topojson', null, northStarLine3).addTo(map);
  omnivore.topojson('data/topojsons/NorthStarLine.topojson', null, northStarLine2).addTo(map);
  omnivore.topojson('data/topojsons/NorthStarLine.topojson', null, northStarLine).addTo(map);


  var blueStations = $.ajax(
    "data/geojsons/BlueStations.geojson.json",
     {
          dataType: "json",
          success: function(response){
              var geojsonMarkerOptions = {
                radius: 3,
                fillColor: "#fff",
                fillOpacity: 1,
                color: "#0053A0",
                weight: 1.5, 
                opacity: 1
              };
  //create a Leaflet GeoJSON layer and add it to the map
              L.geoJson(response,{
                pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng, geojsonMarkerOptions);
                }
              }).addTo(map);
            }
        });
  var greenStations = $.ajax(
    "data/geojsons/GreenStations.geojson.json",
     {
          dataType: "json",
          success: function(response){
              var geojsonMarkerOptions = {
                radius: 3,
                fillColor: "#fff",
                fillOpacity: 1,
                color: "#028244",
                weight: 1.5, 
                opacity: 1
              };
  //create a Leaflet GeoJSON layer and add it to the map
              L.geoJson(response,{
                pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng, geojsonMarkerOptions);
                }
              }).addTo(map);
            }
        });
  var redStations = $.ajax(
    "data/geojsons/RedStations.geojson.json",
     {
          dataType: "json",
          success: function(response){
              var geojsonMarkerOptions = {
                radius: 3,
                fillColor: "#fff",
                fillOpacity: 1,
                color: "#ED1B2E",
                weight: 1.5, 
                opacity: 1
              };
  //create a Leaflet GeoJSON layer and add it to the map
              L.geoJson(response,{
                pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng, geojsonMarkerOptions);
                }
              }).addTo(map);
            }
        });
   var sharedStations =$.ajax(
    "data/geojsons/SharedStations.geojson.json",
     {
          dataType: "json",
          success: function(response){
              var geojsonMarkerOptions = {
                radius: 3,
                fillColor: "#fff",
                fillOpacity: 1,
                color: "#000",
                weight: 1.5, 
                opacity: 1
              };
  //create a Leaflet GeoJSON layer and add it to the map
              L.geoJson(response,{
                pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng, geojsonMarkerOptions);
                }
              }).addTo(map);
            }
        });
  var northStarStations = $.ajax(
    "data/geojsons/NorthStarStations.geojson.json",
     {
          dataType: "json",
          success: function(response){
              var geojsonMarkerOptions = {
                radius: 4,
                fillColor: "#FFD204",
                fillOpacity: 1,
                color: "#000066",
                weight: 1.5, 
                opacity: 1
              };
  //create a Leaflet GeoJSON layer and add it to the map
              L.geoJson(response,{
                pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng, geojsonMarkerOptions);
                }
              }).addTo(map);
            }
        });

};

$(document).ready(createMap);
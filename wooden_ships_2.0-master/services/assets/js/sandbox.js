/**
 * @author Scott Farley
 */


/* This is sandbox.js
 * This file creates a map,
 * Allows users to enter a query on the ships database
 * Returns the results as a georeferenced point with a popup available
 */

globals = {} 
globals.map = {}
globals.loaded = 0
globals.filesRequired = 5;
globals.data ={}
globals.filter = {}
globals.shipnames = [];
globals.shipColorScale =  d3.scale.category20b()


$(document).ready(function(){
	//this is called on init
	getGeojson() //load the map data
	getCities() // load the port cities
	$("#filters").hide() // so that people don't jump the gun
	loadUI()
	$("#goButton").click(onSubmit)
})

function isValidDate(d){
if ( Object.prototype.toString.call(d) === "[object Date]" ) {
  // it is a date
  if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
    return false
  }
  else {
   return true
  }
}
else {
  return false
}
}

function getGeojson(){
	//get the spatial data for drawing the map
	$.ajax("assets/data/world.geojson",{
		success: function(response){
			globals.map.data = response
			$("#basemapLoaded").text("Done.")
			createMap() // draw the blank map
		},
		error: function(xhr, status, error){
			console.log(error);
			$("#basemapLoaded").text("Failed.")
		},
		beforeSend: function(){
			console.log("Getting map data");
		},
		data: {},
		dataType: "json" //automatically parse as json
	})
}

function getCities(){
	//get cities located in the geocode table
	$.ajax("http://grad.geography.wisc.edu/sfarley2/geocodedPlaces.php", {
		success: function(response){
			console.log(response)
			addCitiesToMap(response['data'])
		},
		error: function(xhr, status, error){
			console.log(error);
		},
		beforeSend: function(){
			console.log(this.url)
		},
		data: {},
		dataType: "jsonp"
	})
}

function addCitiesToMap(data){
		globals.map.map.selectAll(".city")
		.data(data).enter()
		.append('rect')
		.attr('class', 'city')
		.attr('x', function(d){
			lng = +d['longitude']
			lat = +d['latitude']
			proj = globals.map.projection([lng, lat])[0];
			return proj
		})
		.attr('y', function(d){		
			lng = +d['longitude']
			lat = +d['latitude']
			proj = globals.map.projection([lng, lat])[1];
			return proj})
		.attr('height', '3.5px')
		.attr('width', '3.5px')
		.attr('fill', 'darkred')
		.attr('fill-opacity', 0.8)
		.attr('stroke', 1)
		.attr('stroke-opacity', 0.1)
		.attr('place', function(d){
			return d.place
		})
		.on('click', function(){
			if (d3.select(this).attr('clicked') != 'true'){
				thisPlace = d3.select(this).attr('place')
				d3.select(this).attr('clicked', 'true')
				globals.map.map.selectAll(".log")
				.attr('fill-opacity', function(d){
					logVoyageTo = d.togeocode
					logVoyageFrom = d.fromgeocode
					if ((logVoyageTo == thisPlace) || (logVoyageFrom == thisPlace)){
						return 1
					}else{
						return 0.1
					}
				})
				.attr('r', function(d){
					logVoyageTo = d.voyageto
					logVoyageFrom = d.voyagefrom
					if ((logVoyageTo == thisPlace) || (logVoyageFrom == thisPlace)){
						return 5
					}else{
						return 2
					}
				})
				.attr('fill', function(d){
					logVoyageTo = d.voyageto
					logVoyageFrom = d.voyagefrom
					if ((logVoyageTo == thisPlace) || (logVoyageFrom == thisPlace)){
						return 'red'
					}
				})
				.attr('stroke', function(d){
					return 'none'
				})
								
			}else{
				d3.select(this).attr('clicked', 'false')
				globals.map.map.selectAll(".log")
					.attr('r', '2px')
					.attr('fill', function(d){
						if ($("#colorShips").prop('checked')){
							return globals.shipColorScale(d.shipname)
						}else{
							return 'lightseagreen'
						}
					})
					.attr('stroke', 'black')
					.attr('stroke-weight', '0.25')
					.attr('fill-opacity', 0.5)
			}
		})
		.on('mouseover', function(){
			d3.select(this).style('cursor', 'pointer')
		})
		.on('mouseout', function(){
			d3.select(this).style('cursor', 'auto')
		})

}

function interfaceReady(){
	//all components are ready	
	$("#filters").show();
	$("#loading").hide();
	 $("#status").text("Ready.")
	 $("#newReturn").hide()
}

function onSubmit(){
	//delete old circles
	clearMap()
	
	//get all of the filter values
	nationality = $("#nationalitySelect option:selected").text();
	if (nationality == "All Nationalities"){
		nationality = "";
	}
	minDate = $("#minDateSelect").val();
	maxDate = $("#maxDateSelect").val();
	shipName = $("#shipNameSelect option:selected").text();
	if (shipName == "All Ships"){
		shipName = ""
	}
	company = $("#companySelect option:selected").text();
	if (company == "All Companies"){
		company = ""
	}
	//deal with the dates
	minDate = new Date(minDate)
	minDate = new Date(minDate.getTime() + minDate.getTimezoneOffset() * 60000);
	
	maxDate = new Date(maxDate)
	maxDate = new Date(maxDate.getTime() + maxDate.getTimezoneOffset() * 60000);
	
	
	if (!isValidDate(minDate)){
		minDate = new Date(1750, 0, 1)
	}
	if (!isValidDate(maxDate)){
		maxDate = new Date(1850, 11, 31)
	}
	
	//fix the filtering by some hacking TODO: fix this better
	if (minDate.getMonth() == maxDate.getMonth()){
		maxDate.setMonth(maxDate.getMonth() + 1)
	}
	if (minDate.getDate() == maxDate.getDate()){
		maxDate.setDate(maxDate.getDate() + 1)
	}
	
	shipType = $("#shipTypeSelect option:selected").text()
	if (shipType == "All Types"){
		shipType = ""
	} 
	
	minWindSpeed = $("#windSpeedMin").val();
	maxWindSpeed = $("#windSpeedMax").val();
	minWindDir = $("#windDirMin").val();
	maxWindDir = $("#windDirMax").val();

	gusts = $("#gustSelect").prop('checked')
	rain = $("#rainSelect").prop('checked')
	snow = $("#snowSelect").prop('checked')
	fog = $("#fogSelect").prop('checked')
	thunder = $("#thunderSelect").prop('checked')
	hail = $("#hailSelect").prop('checked')
	seaice = $("#seaiceSelect").prop('checked')
	
	fromPlace = $("#fromPlaceSelect option:selected").text()
	toPlace = $("#toPlaceSelect option:selected").text()
	
	if (fromPlace == "All Places"){
		fromPlace = "";
	}
	if (toPlace == "All Places"){
		toPlace = ""
	}
	
	filter = {
		minYear: minDate.getFullYear(),
		minMonth: minDate.getMonth() + 1,
		minDay: minDate.getDate(),
		maxYear: maxDate.getFullYear(),
		maxMonth: maxDate.getMonth() + 1,
		maxDay: maxDate.getDate(),
		nationality: nationality,
		shipType: shipType,
		company: company,
		shipName: shipName,
		gusts: $("#gustSelect").prop('checked'),
		rain: $("#rainSelect").prop('checked'),
		snow: $("#snowSelect").prop('checked'),
		fog: $("#fogSelect").prop('checked'),
		thunder: $("#thunderSelect").prop('checked'),
		hail: $("#hailSelect").prop('checked'),
		seaice: $("#seaiceSelect").prop('checked'),
		windSpeedMax: maxWindSpeed,
		windSpeedMin: minWindSpeed,
		windDirMin: minWindDir,
		windDirMax: maxWindDir,
	}
	$("#status").text("Got filter values.")
	globals.filter = filter
	console.log("Filter is ")
	console.log(globals.filter)
	loadShips(filter);
}

//load the UI components from the database
function loadUI(){
	//load the nationalities selection
	$.ajax("http://grad.geography.wisc.edu/sfarley2/nations.php", {
		success: function(response){
			data = response['data']
			for (var i=0; i< data.length; i++){
				$("#nationalitySelect").append("<option>" + data[i]['Nationality'] + "</option>");
			}
			//check to see if we're done loading
			$("#nationsLoaded").text("Done.")
			globals.loaded +=1
			if (globals.loaded == globals.filesRequired){
				interfaceReady()
			}
		},
		error: function(xhr, status, error){
			console.log(error);
			$("#nationsLoaded").text("Failed.")
		},
		beforeSend: function(){
			console.log(this.url);
		},
		dataType: "jsonp",
		type: "GET"
	})
	//load the ship names
	$.ajax("http://grad.geography.wisc.edu/sfarley2/Ships.php", {
		success: function(response){
			data = response['data']
			for (var i=0; i < data.length; i++){
				$("#shipNameSelect").append("<option>" + data[i]['ShipName'] + "</option>")
				$("#shipTypeSelect").append("<option>" + data[i]['ShipType'] + "</option>")
				globals.shipnames.push(data[i]['ShipName'])
			}
			$("#shipsLoaded").text("Done.")
			$("#shipTypesLoaded").text("Done.")
			//establish the color scale
			globals.shipColorScale.domain(globals.shipnames)
			globals.loaded +=1
			if (globals.loaded == globals.filesRequired){
				interfaceReady()
			}
		},
		error: function(xhr, status, error){
			console.log(error);
			$("#shipsLoaded").text("Failed.")
		},
		beforeSend: function(){
			console.log(this.url)
		},
		dataType: "jsonp"
	})
	//load the company names
	$.ajax("http://grad.geography.wisc.edu/sfarley2/Companies.php",{
		success: function(response){
			data = response['data']
			for (var i=0; i < data.length; i++){
				if ((data[i]['Company'] != "") && (data[i]['Company'] != " ") && (data[i]['Company'] != "''")){
					$("#companySelect").append("<option>" + data[i]['Company'] + "</option>")
				}
			}
			$("#companiesLoaded").text("Done.")
			globals.loaded +=1
			if (globals.loaded == globals.filesRequired){
				interfaceReady()
			}
		},
		error: function(xhr, status, error){
			console.log(error);
			$("#companiesLoaded").text("Failed.")
		},
		beforeSend: function(){
			console.log(this.url)
		},
		dataType: "jsonp"
	})
	//load voyage start locations
		$.ajax("http://grad.geography.wisc.edu/sfarley2/voyageStarts.php", {
		success: function(response){
			data = response['data']
			for (var i=0; i< data.length; i++){
				$("#fromPlaceSelect").append("<option>" + data[i]['place'] + "</option>");
			}
			//check to see if we're done loading
			$("#fromLoaded").text("Done.")
			globals.loaded +=1
			if (globals.loaded == globals.filesRequired){
				interfaceReady()
			}
		},
		error: function(xhr, status, error){
			console.log(error);
			$("#fromLoaded").text("Failed.")
		},
		beforeSend: function(){
			console.log(this.url);
		},
		dataType: "jsonp"
	})
	
	//load voyage end locations
		$.ajax("http://grad.geography.wisc.edu/sfarley2/voyageEnds.php", {
		success: function(response){
			data = response['data']
			for (var i=0; i< data.length; i++){
				$("#toPlaceSelect").append("<option>" + data[i]['place'] + "</option>");
			}
			//check to see if we're done loading
			$("#toLoaded").text("Done.")
			globals.loaded +=1
			if (globals.loaded == globals.filesRequired){
				interfaceReady()
			}
		},
		error: function(xhr, status, error){
			console.log(error);
			$("#toLoaded").text("Failed.")
		},
		beforeSend: function(){
			console.log(this.url);
		},
		dataType: "jsonp"
	})
}

function createMap(){
	//map the d3 map with the geojson
	//set props
	console.log("Creating map.")
	console.log(globals.map.data)
	var width = $("#map").width(),
    height = $("#map").height();
	
	//get projection ready
	var projection = d3.geo.equirectangular()
	    //.scale(250)
	    .translate([width / 2, height / 2]);
	
	var path = d3.geo.path()
	    .projection(projection);
	
	globals.map.map = svg = d3.select("#map").append("svg")
	    .attr("width", width)
	    .attr("height", height);
	//make globals
	globals.map.projection = projection;
	globals.map.path = path;
	globals.map.canvas = svg;
	
	//do the drawing
	globals.map.countries = svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
	      .data(globals.map.data.features)
	    .enter().append("path")
	      .attr("d", path)
	      .style('fill', 'white')
	      .style('stroke', 'black')
	      .style('stroke-opacity', 1)
}

function clearMap(){
	//remove all of the points from the map
	d3.select("#map").selectAll(".log").remove();
	globals.data = {}; //clear the data so we can't download it anymore'
}
function loadShips(filter, type){
	//load the data from the database server with the given parameters
	//type is either points or tracks
			$.ajax("http://grad.geography.wisc.edu/sfarley2/data.php?callback=?", {
			success: function(response){
				console.log("Got response from database server.")
				$("#status").text("Parsing response")
				globals.data = response // for downloading
				data = response['data']
				addPointsToMap(data)
				calculateSummary(data)
			},
			error: function(xhr, status, error){
				console.log(error);
				$("#status").text("Failed to get ships.")
				
			},
			beforeSend: function(){
				console.log(this.url);
				$("#status").text("Requesting data from server.")
			},
			data: filter,
			crossDomain: true,
			type: "POST",
			cache: true,
			dataType: "jsonp",
		})
}

function addPointsToMap(json){
	//add points to the map
	console.log(json);
	globals.map.map.selectAll("circle")
		.data(json).enter()
		.append('circle')
		.attr('class', 'log')
		.attr('cx', function(d){
			lng = +d['latitude']
			lat = +d['longitude']
			proj = globals.map.projection([lng, lat])[0];
			return proj
		})
		.attr('cy', function(d){		
			lng = +d['latitude']
			lat = +d['longitude']
			proj = globals.map.projection([lng, lat])[1];
			return proj})
		.attr('r', '2px')
		.attr('fill', function(d){
			if ($("#colorShips").prop('checked')){
				return globals.shipColorScale(d.shipname)
			}else{
				return 'lightseagreen'
			}
		})
		.attr('stroke', 'black')
		.attr('stroke-weight', '0.25')
		.attr('fill-opacity', 0.5)
}
function calculateSummary(list){
	summary = {}
	//calc total response
	summary.total = list.length
	uniqShips = _.uniq(list, function(d){return d.shipname});
	summary.numShips = uniqShips.length;
	uniqNations = _.uniq(list, function(d){return d.nationality})
	summary.numNations = uniqNations.length
	uniqCompanies = _.uniq(list, function(d){return d.company})
	summary.numCompanies = uniqCompanies.length
	uniqCaps = _.uniq(list, function(d){return d.name1});
	summary.numCaps = uniqCaps.length;
	displaySummary(summary)
}
function displaySummary(summary){
	$("#numTotal").text(summary.total + " records.")
	$("#numShips").text(summary.numShips + " ships.")
	$("#numCompanies").text(summary.numCompanies + " companies.")
	$("#numCaps").text(summary.numCaps + " captains.")
	$("#numNations").text(summary.numNations + " nationalities.")
	$("#newReturn").show();
	$("#newReturn").fadeOut(1500);
}
function downloadCSV(){
	function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }
}


///download handlers
function downloadJSON(){
	//just navigate to the API endpoint
	url = "http://grad.geography.wisc.edu/sfarley2/data.php?"
	for (item in globals.filter){
		url += "&" + item + "=" + globals.filter[item]
	}
	window.open(url, "_blank")
}
$("#downloadJSON").click(downloadJSON)
function downloadCSV(){
	data = globals.data.data
	header = _.keys(data[0])
	csv = []
	csv.push(header)
	_.each(data, function(value, key, list){
		thisRow = []
		_.each(value, function(innerValue, innerKey, innerList){
			thisRow.push(innerValue)
		})
		csv.push(thisRow)
	})
	var csvContent = "data:text/csv;charset=utf-8,"
	var csvOut = csv.map(function(d){
		   return JSON.stringify(d);
		})
		.join('\n') 
		.replace(/(^\[)|(\]$)/mg, ''); // remove opening [ and closing ] brackets from each line 
	csvContent += csvOut
	var encodedUri = encodeURI(csvContent);
	window.open(encodedUri);
}

// function fixLinestring(linestring){
	// //linestring is the track object from tracks api
	// linestring = linestring.replace("LINESTRING", "")
	// linestring = linestring.replace("(", "[")
	// linestring = linestring.replace(")", "]")
	// linestring = linestring.split(",")
	// linestring = _.map(linestring, function(value, key, list){
		// v = value.split(" ")
		// lat = +v[1]
		// lng = +v[0]
		// if ((lat) && (lng)){
			// return {'lon3' : +v[0], "lat3": +v[1]}
		// }else{
			// return {'lon3': NaN, 'lat3': NaN}
		// }
	// })
	// return linestring
// }

// function plotLinestring(linestring){
	// console.log("Plotting linestring")
	// linestring = fixLinestring(linestring)
	// console.log(linestring)
	// var valueline = d3.svg.line()
	    // .x(function(d) { 
	    	// console.log(d)
	    	// console.log(globals.map.projection([+d.lon3]));
	    	// return globals.map.projection([+d.lon3])[0]; })
	    // .y(function(d) { return globals.map.projection([+d.lat3])[1]; });
//     
    	// globals.map.map.selectAll("path")
			// .data(linestring).enter()
			// .append('path')
			// .attr('class', 'track')
			// .attr('d', valueline)
			// .attr('stroke', 'red')
			// .attr('stroke-weight', 1)
// // 		
// 
// 		
	// //tooltip on hover	
	// globals.map.tip = d3.tip()
	  // .attr('class', 'd3-tip')
	  // .offset([-10, 0])
	  // .html(function(d){
	  		// //create a date
	  		// date = new Date(d.year, d.month, d.day)
		  	// html = "<h6 class='page-header'>" + date.toDateString()  + "<span class='text-muted'> (" + d.recid + ")</span></h6><br />"
		  	// html += "<label>Ship: </label><span class='text-muted'>" + d.shipname + "</span><br />"
		  	// html += "<label>Nationality: </label><span class='text-muted'>" + d.nationality + "</span><br />"
		  	// html += "<label>Captain: </label><span class='text-muted'>" + d.name1 + "</span><br />"
		  	// html += "<label>Company: </label><span class='text-muted'>" + d.company +"</span><br />"
		 // return html
// 	  	
	  // })
// 	  
	  // globals.map.map.call(globals.map.tip)//enable the tooltip
//}

$("#downloadCSV").click(downloadCSV)


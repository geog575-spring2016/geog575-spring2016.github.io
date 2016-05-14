window.onload = function() {	
	setMap();
};

function setMap() {
	//these variables are glable in function setMap
	attrArray = ["1950","1955","1960","1965","1970","1975", "1980","1985","1990","1995","2000","2005"];
	expressedAttr = "2005";

	
	var width = 500, height = 500;

	var map = d3.select(".map2Div")
		.append("svg")
		.attr("class", "map")
		.attr("width", width)
		.attr("height", height);

	var projection = d3.geo.albers()
		.center([0, 36.33])
		.rotate([-103, 0, 0])
		.parallels([29.5, 45.17])
		.scale(650)
		.translate([width / 2, height / 2]);

	var path = d3.geo.path()
		.projection(projection);

	queue()
		.defer(d3.csv, "data/gender_ratio_chart.csv")
		.defer(d3.json, "data/ChinaProvinces.topojson")
		.defer(d3.json, "data/AsiaRegion_6simplified.topojson")
		.await(callback); //send data to callback function once finish loading

	function callback(error, csvDataDec, provData, asiaData) {
		var asiaRegion = topojson.feature(asiaData, asiaData.objects.AsiaRegion);
		var provinces = topojson.feature(provData, provData.objects.collection).features;
		setGraticule(map, path);
		map.append("path")
			.datum(asiaRegion)
			.attr("class", "backgroundCountry")
			.attr("d", path);
	
		provinces = joinData(provinces, csvDataDec);
		var colorScale = makeColorScale(csvDataDec);

		setEnumUnits(provinces, map, path, colorScale);
		createSlider(csvDataDec);
	};
};

function setGraticule(map, path) {
		// svg elements drawing order is determined by the order they were added to DOM
	var graticule = d3.geo.graticule()
		.step([10, 10]); //place graticule lines every 10 degrees of longitude and latitude

	var gratBackground = map.append("path")
		.datum(graticule.outline())
		.attr("class", "gratBackground")
		.attr("d", path);

	// create graticule lines  
	var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
		.data(graticule.lines()) //bind graticule lines to each element to be created
		.enter() //create an element for each datum
		.append("path") //append each element to the svg as a path element
		.attr("class", "gratLines") //assign class for styling
		.attr("d", path); //project graticule lines
};

function joinData(provinces, csvData) {
	// join attributes from csv to geojson.
	for (var i = 0; i < csvData.length; i++) {
		var csvProv = csvData[i];
		var csvKey = csvProv.name;

		for (var a = 0; a < provinces.length; a++) {
			var jsonProps = provinces[a].properties;
			var jsonKey = jsonProps.name;

			if (jsonKey == csvKey) {
				attrArray.forEach(function(attr){
					var val = parseFloat(csvProv[attr]);
					jsonProps[attr] = Math.ceil(val);
				});
				jsonProps["region_code"] = csvProv["region_code"];
			};
		};
	};
	return provinces;
};

function setEnumUnits(provinces, map, path, colorScale) {
	// select all must take a list, should be a list of features, not the whole feature collection
	var enumUnits = map.selectAll(".enumUnits")
		.data(provinces)
		.enter()
		.append("path")
		.attr("class", function(d) {
			return "enumUnits " + d.properties.region_code;
		})
		.attr("d", path)
		.style("fill", function(d) {
			return choropleth(d.properties, colorScale);
		})
		.on("mouseover", function(d) {
			highlight(d.properties);
		})
		.on("mouseout", function(d) {
			dehighlight(d.properties);
		})
		.on("mousemove", moveLabel);

	var desc = enumUnits.append("desc")
		.text('{"stroke": "#000", "stroke-width": "0.5px"}');
};

function makeColorScale(data) {
	//data is an array of provinces
	var colorClasses =[
	'#feedde','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#8c2d04'];

	var colorScale = d3.scale.threshold()
		.range(colorClasses);

	//build array of all values
	var domainArray = [];
	for (var i = 0; i < data.length; i++){
		attrArray.forEach(function(attr){
			var val = parseFloat(data[i][attr]);
			domainArray.push(val);
		});
		// var val = parseFloat(data[i][expressedAttr]);
		// domainArray.push(val);
	};
	//cluster data using ckmeans clustering algorithm to create natural breaks
	var clusters = ss.ckmeans(domainArray, 7);
	//reset domain array to cluster minimums
	domainArray = clusters.map(function(d) {
		return d3.min(d);
	});
	//remove first value from domain array to create class breakpoints
	domainArray.shift();
	//assign array of last 4 cluster minimums as domain
	colorScale.domain(domainArray);

	return colorScale; 
};

// deal with enumUnits without data
function choropleth(props, colorScale) {
	//make sure attribute value is a number
	var val = parseFloat(props[expressedAttr]);
	//if attribute value exists, assign a color; otherwise assign gray
	if (val && val != NaN){
		return colorScale(val);
	} else {
		return "#CCC";
	};
};

function updateEnumUnits(csvData) { //csvdata is an array of the new data
	var colorScale = makeColorScale(csvData);
	d3.selectAll(".enumUnits")
		.transition()
		.duration(1000)
		.style("fill", function(d) {
			return choropleth(d.properties, colorScale);
		});
};

function highlight(props) {
	//!!This selection won't work for names with multiple space
	d3.selectAll("." + props.region_code)
		.style({
			"stroke": "blue",
			"stroke-width": "2"
		});
	var line = d3.select("#line" + props.region_code).classed("province--hover", true);
	//readd to parent node to make sure the line show up first
	var provinces = d3.select(".provinces")[0][0];
	provinces.appendChild(line[0][0]);

	setLabel(props);
}

function dehighlight(props) {
	d3.selectAll("." + props.region_code)
		.style("stroke", "#000")
		.style("stroke-width", "0.5px");

	d3.select(".infolabel").remove();
	d3.select("#line" + props.region_code).classed("province--hover", false);
};

//set label, now is appended to body as div
function setLabel(props) {
	//different type of labels for different attributes
	var labelAttribute;
	if (!props[expressedAttr]) {
		labelAttribute = "<h1>" + "Nodata" + "</h1><b>" + "</b>";
	} else {
		labelAttribute = "<h1>" + Math.ceil(props[expressedAttr]) +
		"</h1><b>" + "</b>";
	};

	//create info label div
	var infolabel = d3.select("body")
		.append("div")
		.attr({
			"class": "infolabel",
			"id": props.region_code + "_label"
		})
		.html(labelAttribute);

	infolabel.append("div")
		.attr("class", "labelname")
		.html(props.name);
};

//move info label with mouse
function moveLabel() {
	var labelWidth = d3.select(".infolabel")
		.node()
		.getBoundingClientRect()
		.width;
	//clientXY gives the coordinates relative to current window, will be problematic when scrolling
	//pageXY gives the coordinates relative to the whole rendered page, including hidden part after scrolling
	var x1 = d3.event.pageX + 10,
		y1 = d3.event.pageY - 75,
		x2 = d3.event.pageX - labelWidth - 10,
		y2 = d3.event.pageY + 25;

	//horizontal label coordinate, testing for overflow
	var x = d3.event.pageX > window.innerWidth - labelWidth - 20 ? x2 : x1; 
	//vertical label coordinate, testing for overflow
	var y = d3.event.pageY < 75 ? y2 : y1;

	d3.select(".infolabel")
		.style({
			"left": x + "px",
			"top": y + "px"
		});
};

function createSlider(csvData) {
	var slider = d3.slider().axis(true).min(1950).max(2005).step(5).on("slide", function(evt, value){
		expressedAttr = value;
		updateEnumUnits(csvData); 
	});

	d3.select(".map2Div").append("div")
		.attr("id", "slider")
		.call(slider);
};

// /* 575 boilerplate main.js */
// (function(){
//
//   var attrArray = ["2009-2010", "2011-2012", "2012-2013", "2013-2014", "2014-2015"];
//   var expressed = attrArray[0]; //initial attribute
//
//   //begins script when window loads
//   window.onload = setMap();
//
//   function setMap(){
//     //map frame dimensions
//         var width = 600,
//             height = 400;
//
//         //create new svg container for the map
//         var map = d3.select("#mainMap")
//             .append("svg")
//             .attr("class", "map")
//             .attr("width", width)
//             .attr("height", height);
//
//         //create projection for Washington State
//         var projection = d3.geo.albersUsa()
//             .scale(700)
//             .translate([width / 2, height / 2])
//
//         var path = d3.geo.path()
//            .projection(projection);
//
//         //use queue.js to parallelize asynchronous data loading
//         d3_queue.queue()
//             .defer(d3.csv, "data/vaccine_coverage/vaccine_coverage.csv")
//             .defer(d3.json, "data/vaccine_coverage/UnitedStates2.topojson") //load choropleth spatial data
//             .await(callback);
//
//   //function that calls our data
//       function callback(error, csvData, us){
//
//         //translate the Counties topojson
//         var unitedStates = topojson.feature(us, us.objects.UnitedStates).features;
//
//         var states = map.append("path")
//             .datum(unitedStates)
//             .attr("class", "state_")
//             .attr("d", path);
//
//           //join csv food data to GeoJso3n enumeration units
//           unitedStates = joinData(unitedStates, csvData);
//
//           //creates the color scale
//           var colorScale = makeColorScale(csvData);
//
//           //add enumeration units to the map
//           setEnumerationUnits(unitedStates, map, path, colorScale);
//       };
//   };
//
// function joinData(unitedStates, csvData){
//   //loop through csv to assign each set of csv attribute values to geojson region
//   for (var i=0; i<csvData.length; i++){
//       var csvState = csvData[i]; //the current region
//       var csvKey = csvState.State; //the CSV primary key
//
//       //loop through geojson regions to find correct region
//       for (var a=0; a<unitedStates.length; a++){
//
//           var geojsonProps = unitedStates[a].properties; //the current region geojson properties
//           var geojsonKey = geojsonProps.State; //the geojson primary key
//
//           //where primary keys match, transfer csv data to geojson properties object
//           if (geojsonKey == csvKey){
//
//               //assign all attributes and values
//               attrArray.forEach(function(attr){
//                   var val = parseFloat(csvState[attr]); //get csv attribute value
//                   geojsonProps[attr] = val; //assign attribute and value to geojson properties
//               });
//           };
//       };
//   };
// return unitedStates;
// };
//
// //function to make enumeration units for the us counties
// function setEnumerationUnits(unitedStates, map, path, colorScale){
//         //add out usCounties to the map
//         var states = map.selectAll(".states")
//             .data(unitedStates)
//             .enter()
//             .append("path")
//             .attr("class", function(d){
//                 return "states " + d.properties.State;
//             })
//             .attr("d", path)
//             .style("fill", function(d){
//                 return choropleth(d.properties, colorScale);
//             })
//             .on("mouseover", function(d){
//                 highlight(d.properties);
//             })
//             .on("mouseout", function(d){
//             dehighlight(d.properties)
//             })
//             .on("mousemove", moveLabel);
//
//             var desc = states.append("desc")
//             .text('{"stroke": "#000", "stroke-width": "0.5px"}');
// };
//
// //function to create color scale generator
// function makeColorScale(data){
//     var colorClasses = [
//         "#d7191c",
//         "#fdae61",
//         "#abd9e9",
//         "#2c7bb6",
//     ];
//
//     //create color scale generator
//     var colorScale = d3.scale.quantile()
//         .range(colorClasses);
//
//     //build array of all values of the expressed attribute
//     var domainArray = [];
//     for (var i=0; i<data.length; i++){
//         var val = parseFloat(data[i][expressed]);
//         domainArray.push(val);
//     };
//
//     //assign array of expressed values as scale domain
//     colorScale.domain(domainArray);
//
//     return colorScale;
//
// };
//
// //function to test for data value and return color
// function choropleth(props, colorScale){
//     //make sure attribute value is a number
//     var val = parseFloat(props[expressed]);
//     //if attribute value exists, assign a color; otherwise assign gray
//     if (val && val != 999){
//         return colorScale(val);
//     } else {
//         return "#CCC";
//     };
// };
//
// //function to highlight enumeration units and bars
// function highlight(props){
//     //change stroke
//     var selected = d3.selectAll("." + props.State)
//         .style({
//             "stroke": "black",
//             "stroke-width": "2"
//         });
//
//     setLabel(props);
// };
//
// //function to reset the element style on mouseout
// function dehighlight(props){
//     var selected = d3.selectAll("." + props.State)
//         .style({
//             "stroke": function(){
//                 return getStyle(this, "stroke")
//             },
//             "stroke-width": function(){
//                 return getStyle(this, "stroke-width")
//             }
//         });
//
//     function getStyle(element, styleName){
//         var styleText = d3.select(element)
//             .select("desc")
//             .text();
//
//         var styleObject = JSON.parse(styleText);
//
//         return styleObject[styleName];
//     };
//
//     //remove info label
//   	d3.select(".infolabel")
//   		.remove();
// };
//
// //function to create dynamic label
// function setLabel(props){
// 	//label content
// 	var labelAttribute = "<h1>" + props[expressed] +
// 		"</h1><b>" + expressed + "</b>";
//
// 	//create info label div
// 	var infolabel = d3.select("#mainMap")
// 		.append("div")
// 		.attr({
// 			"class": "infolabel",
// 			"id": props.State + "_label"
// 		})
// 		.html(labelAttribute);
//
// 	var statesName = infolabel.append("div")
// 		.attr("class", "labelname")
// 		.html(props.State);
// };
//
// //Example 2.8 line 1...function to move info label with mouse
// function moveLabel(){
//     //get width of label
//     var labelWidth = d3.select(".infolabel")
//         .node()
//         .getBoundingClientRect()
//         .width;
//
//     //use coordinates of mousemove event to set label coordinates
//     var x1 = d3.event.clientX + 10,
//         y1 = d3.event.clientY + 10,
//         x2 = d3.event.clientX - labelWidth - 10,
//         y2 = d3.event.clientY + 25;
//
//     //horizontal label coordinate, testing for overflow
//     var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1;
//     //vertical label coordinate, testing for overflow
//     var y = d3.event.clientY < 75 ? y2 : y1;
//
//     d3.select(".infolabel")
//         .style({
//             "left": x + "px",
//             "top": y + "px"
//         });
// };
//
// })();

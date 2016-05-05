/* Arizona Map */
(function(){

window.onload = setMap();

	function setMap(){
		//map frame size. Adjusted so Chart and map can fit next to eachother.
   		var width = window.innerWidth * 0.5,
     	height = 500;
		//create new svg container for the map
	    var map = d3.select("body")
	      .append("svg")
	      .attr("class", "map")
	      .attr("width", width)
	      .attr("height", height);
	   
   		//create projection for Washington State
	    var projection = d3.geo.albers()
	        .translate([w/2, h/2])
			.scale([3400])
			.rotate([108, 0, 0])
			.translate([360, 0]);

      	//draws the spatial data as a path of stings of 'd' attributes
    	var path = d3.geo.path()
        	.projection(projection);

        //uses queue.js to parallelize asynchronous data loading
    	//these are like AJAX functions.
	    d3_queue.queue()
	      .defer(d3.csv, "data/az/AZ_County.csv") //loads attributes from csv
	      .defer(d3.json, "data/az/AZ.topojson") //loads choropleth spatial data
	      .await(callback);

		function callback(error, csvData, az){
	        var azCo = topojson.feature(az, az.objects.AZ).features;


	        
	        //add out azCo to the map
	        var state = map.append("path")
	          .datum(az)
	          .attr("class", "state")
	          .attr("d", path);

	         //azCo = joinData(azCo, csvData);
	          
      };
	};//end of set map

	  //writes a function to join the data from the csv and geojson
  	function joinData (usStates, csvData){
    //loops through csv to assign each set of csv attribute values to geojson
	    for (var i=0; i<csvData.length; i++){
	      var csvRegion = csvData[i];
	      var csvKey = csvRegion.GEOID;
	      //loops through geojson regions to find correct region
	        for (var a=0; a<usStates.length; a++){
	          var geojsonProps = usStates[a].properties;
	          var geojsonKey = geojsonProps.GEOID;
	          //where primary keys match, transfer csv data to geojson properties object
	            if (geojsonKey == csvKey){
	              attrArray.forEach(function(attr){
	                var val = parseFloat(csvRegion[attr]); //get csv attribute value
	                geojsonProps[attr] = val;
	              });
	            };
	        };
	    };
	    return usStates;
  	};

})();





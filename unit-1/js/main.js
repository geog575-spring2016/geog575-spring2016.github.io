//initialize function called when the script loads
function initialize(){
	cities();
};

//function to create a table with cities and their populations
function cities(){
	//define two arrays for cities and population
	var cityPop = [
		{ 
			city: 'Madison',
			population: 233209
		},
		{
			city: 'Milwaukee',
			population: 594833
		},
		{
			city: 'Green Bay',
			population: 104057
		},
		{
			city: 'Superior',
			population: 27244
		}
	];

	//append the table element to the div
	$("#mydiv").append("<table>");

	//append a header row to the table
	$("table").append("<tr>");
	
	//add the "City" and "Population" columns to the header row
	$("tr").append("<th>City</th><th>Population</th>");
	
	//loop to add a new row for each city
    for (var i = 0; i < cityPop.length; i++){
        //assign longer html strings to a variable
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
        //add the row's html string to the table
        $("table").append(rowHtml);
    };

    addColumns(cityPop);
    addEvents();
};

//function to add a city size column to the table
function addColumns(cityPop){
    //for each row, add a new column with the city size category
    $('tr').each(function(i){
    	//if the header row
    	if (i == 0){
    		//add a header for City Size
    		$(this).append('<th>City Size</th>');
    	} else {
    		//if not the header row, add a category
    		var citySize;
    		//if the city population is smaller than 100K, it's a small city
    		if (cityPop[i-1].population < 100000){
    			citySize = 'Small';
    		//if the city population is between 100K and 500K, medium city
    		} else if (cityPop[i-1].population < 500000){
    			citySize = 'Medium';
    		//if city population is above 500K, large city
    		} else {
    			citySize = 'Large';
    		};
    		//append the cell to the row
    		$(this).append('<td>' + citySize + '</td>');
    	};
    });
};

//function to add event listeners to the table
function addEvents(){
	//when the user mouses over the table, change the text color to a random color
	$('table').mouseover(function(){
		//start of a CSS rgb() value
		var color = "rgb(";
		//loop creates r, g, and b values
		for (var i=0; i<3; i++){
			//random integer between 0 and 255
			var random = Math.round(Math.random() * 255);
			//add the value
			color += random;
			//commas to separate values
			if (i<2){
				color += ",";
			//end of rgb() value
			} else {
				color += ")";
			};
		};
		//assign the text color
		$(this).css('color', color);
	});
	//click listener handler function
	function clickme(){
		//fire an alert when the table is clicked
		alert('Hey, you clicked me!');
	};
	//add click listener to table element
	$('table').on('click', clickme);
};

//call the initialize function when the document has loaded
$(document).ready(initialize);
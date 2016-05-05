

//bugs/issues to deal with:
//1) determine how to label states separately (because now we're using the unique field = no spaces)
//2) cycle over time (default to 2015 on load, on play, start at 1977 and sequence forward)- NATALEE
//3) create proportional symbols (raw data for # executions per state in each year) = KAI & GABY
//4) Add contextual information - KAI
//5) Add pause/forward/back buttons - NATALEE


//Meeting with Robin 5/2
//PSEUDOCODING TIME SEQUENCING//
//1) what is the currently selected year? store as a variable = yearExpressedText (DONE)
//2) create the sequencing element (slider or play button, either jquery or d3) (DONE)
//3) create # of notches on slider (exact # of years)
//4) assign each notch a year
//5) function to step forwards or backwards
//6) call a function to change choro to corresponding year
//7) update the label
//8) update the timeline visualization
//9) eventually update the prop symbols too :)

//****GLOBAL VARIABLES****//
var topicArray = ["Law",
                  "allExecutions"]; //the first item in this array will be the default

//array for year"s
var yearArray = ["1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995","1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];

// NOTE: special array for the updated dataset that links to proportional symbols
var executeYR = ["Y1977", "Y1978", "Y1979", "Y1980", "Y1981", "Y1982", "Y1983", "Y1984", "Y1985", "Y1986", "Y1987", "Y1988", "Y1989", "Y1990", "Y1991", "Y1992", "Y1993", "Y1994", "Y1995", "Y1996", "Y1997", "Y1998", "Y1999", "Y2000", "Y2001", "Y2002", "Y2003", "Y2004", "Y2005", "Y2006", "Y2007", "Y2008", "Y2009", "Y2010", "Y2011", "Y2012", "Y2013", "Y2014", "Y2015"];

//choropleth global variables
var currentColors = []; //empty array to fill with corresponding colors
var currentArray = []; //empty array to fill with the current topic
var expressed; //
var scale; //
var colorize; //
var playing = false; //default to not play on load

// proportional symbol global variables
var currentYR = 20;

/* **************************************************************

NOTE * NOTE * NOTE * NOTE * NOTE * NOTE * NOTE * NOTE * NOTE * NOTE

This variable is key and controls all values later on throughout
// special attention here

************************************************************** */
var dataEXP = executeYR[20];



var yearExpressedText; //variable to store year expressed text
//array for law variable
var arrayLaw = [ "Legal",
                  "Moratorium",
                    "De Facto Moratorium",
                  "Formal Hold",
                   "Illegal"];
var colorArrayLaw      = [ "#b30000", "#e34a33", "#fc8d59", "#fdcc8a", "#fef0d9"
];
//the map width is a function of window size
var mapWidth = window.innerWidth * 0.7,
mapHeight = 600;
var menuWidth = 200, menuHeight = 300;
var menuInfoWidth = 250, menuInfoHeight = 100;
var joinedJson;

var map;
var path;
var projection;

//when window loads, initiate map
window.onload = initialize();

function initialize(){
  expressed = topicArray[0];
  yearExpressed = yearArray[0];
  //call function to animate the map to iterate over the years
   animateMap(yearExpressed, colorize, yearExpressedText);
    //call setmap to set up the map
    setMap();
    createMenu(arrayLaw, colorArrayLaw);
}; // initialize OUT *mic drop*

//set up the choropleth
function setMap() {
    // map variable, an svg element with attributes styled in style.css
    map = d3.select("#mainmap")
        .append("svg")
        .attr("class", "map")
        .attr("width", mapWidth)
        .attr("height", mapHeight);
//set the projection for the US, equal area because choropeth
    projection = d3.geo.albers()
        .scale(1000)
        .translate([mapWidth / 2, mapHeight / 2]);
        //path to draw the map
    path = d3.geo.path()
        .projection(projection);
        //load in the data

    d3_queue.queue()
    //queue funcion loads external data asynchronously
        .defer(d3.csv, "../data/Law.csv") //laws by year
        .defer(d3.csv,"../data/allExecutions_up.csv") //executions by year
        .defer(d3.json, "../data/continentalUS.topojson") //geometries
        .defer(d3.json, "../data/allExecutions.geojson") //geometries
        .await(callback);

}; //setmap is bye

//retrieve and process json file and data, same order as the queue function to load data
//accepts errors from queue function as first argument

function callback(error, Law, allExecutions, continentalUS, ex){
    
    //variable to store the continentalUS json with all attribute data
    joinedJson = topojson.feature(continentalUS,
        continentalUS.objects.states).features;

    //colorize is colorscale function called for the joined data
    colorize = colorScale(joinedJson);

    //array for the csvs
    var csvArray = [Law, allExecutions];

    //names for the overall Label we'd like to assign them
    var attributeNames = ["Law", "allExecutions"];

    for (csv in csvArray){
      //csvArray[csv] = actual attribute information
      //attributeNames[csv] = just the names stored
      //for the csvs in the arrays, run the join data function:
      joinData(continentalUS, csvArray[csv], attributeNames[csv], joinedJson);

    };

    implementState (csvArray[csv], joinedJson);

    setSymbols(path, map, allExecutions, projection);

    //call the function to create the menu, law choropleth as default on load
    drawMenu();


}; //callback end

function joinData(topojson, csvData, attribute, json){
  //a variable that stores all the states
    var jsonStates = topojson.objects.states.geometries;
        for(var i=0; i<csvData.length; i++){

            var csvState = csvData[i];
            //the way we're linking the csv data is using abrev
            var csvLink = csvState.abrev;

            //for each state in jsonStates, loop through and link it to the csv data
            for(var a=0; a<jsonStates.length; a++){
                //check if abrev = abrev, it will join
                if (jsonStates[a].properties.abrev == csvLink){
                  //if this evaluates to true, join is working:
                    //attrObj holds all the attributes. so... many... informations
                    attrObj = {};
                    //loop to assign key/value pairs to json object
                    for(var year in yearArray){
                    //attr variable holds all years as separate objects
                        var attr = yearArray[year];
                        //val variable holds all the values for law and allExecutions
                        var val = (csvState[attr]);
                        //setting this equal to val
                        attrObj[attr] = val;

            };

            jsonStates[a].properties[attribute] = attrObj;
             break; //stop looping through csv because it's joined

            };
        };
     };
    d3.select('#play').html(yearArray[yearExpressed]); 

};

function implementState(csvData, json) {
    //style states according to the data
    var states = map.selectAll(".states")
        .data(json)
        .enter()
        .append("path")
        .attr("class", function(d){
            return "states " + d.properties.abrev;
        })
        .style("fill", function(d){
            return choropleth(d, colorize);
        })
        .attr("d", function(d) {
            return path(d);
        })
        .on("mouseover", highlight)
        .on("mouseout", dehighlight);

    var statesColor = states.append("desc")
        .text(function(d) {
            return choropleth(d, colorize);

        })
        changeAttribute(yearExpressed, colorize);
        mapSequence(yearExpressed);  // update the representation of the map
};

// Create proportional symbols to display all execution data for expressed year
function setSymbols (path, map, data, projection){

     var circles = map.selectAll(".circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d){
            return "circles " + d.state; })
        .attr("fill", "grey")
        .attr('fill-opacity',0.75)
        .attr("cx", function(d) {
            return projection([d.Longitude, d.Latitude])[0]; })
        .attr("cy", function(d) { return projection([d.Longitude, d.Latitude])[1]; });

    console.log("Test3");

    console.log(dataEXP);

    // console.log(data[state][0]);


    newPropSymb(circles, data);

};

function newPropSymb(circles, data) {

    // create array to store all values for 
    var domainArray = [];

    for (var i=0; i<data.length; i++) {

        var val = parseFloat(data[i][dataEXP]);

        console.log(val);

        domainArray.push(val);
    };


    console.log(domainArray);

        var radiusMin = Math.min.apply(Math, domainArray);
        var radiusMax = Math.max.apply(Math, domainArray);

    console.log(radiusMax);

    var setRadius = d3.scale.sqrt()
        .range([0, 40])
        .domain([radiusMin, radiusMax]);

    //create a second svg element to hold the bar chart
    var circleRadius= circles.attr("r", function(d){
            return setRadius(d[dataEXP]);
        });
};

    //creates dropdown menu
    function drawMenuInfo(colorize, yearExpressed){
        //creates year for map menu
        yearExpressedText = d3.select('#clock')
            .attr("x", 0)
            .attr("y", 0)
            .text(yearExpressed)
            .style({'font-size':'36px', 'font-weight': 'strong'});
    }; //done with drawMenuInfo

    //controls click events
    function animateMap(yearExpressed, colorize, yearExpressedText){


        var timer;  // create timer object
        d3.select('#play')
          .on('click', function() {  // when user clicks the play button
            if(playing == false) { // if the map is currently playing
              timer = setInterval(function(){   // set a JS interval
                if(yearExpressed = 2015){
                    yearExpressed = 1976,
                    yearExpressed++;  // increment the current attribute counter
                    changeAttribute(yearExpressed, colorize);
                     setSymbols(path, map, allExecutions, projection);
                } else {
                    currentAttribute = 0;  // or reset it to zero
                }
                d3.select('#clock').html(yearExpressed);  // update the clock
              }, 700);

              d3.select(this).html('stop');  // change the button label to stop
              playing = true;   // change the status of the animation
            } else {    // else if is currently playing
              clearInterval(timer);   // stop the animation by clearing the interval
              d3.select(this).html('play');   // change the button label to play
              playing = false;   // change the status again
            }

        });


        var forwardbacktimer;  // create timer object
        d3.select('#forward')
          .on('click', function() {  // when user clicks the play button
            if(playing == false) { // if the map is currently playing
              timer = setInterval(function(){   // set a JS interval
                if(yearExpressed < 2015){
                    yearExpressed++;  // increment the current attribute counter
                    changeAttribute(yearExpressed, colorize);
                } else {
                    currentAttribute = 0;  // or reset it to zero
                }
                d3.select('#clock').html(yearExpressed);  // update the clock
              }, 1000);

              d3.select(this).html('back');  // change the button label to stop
              playing = true;   // change the status of the animation
            } else {    // else if is currently playing
              clearInterval(timer);   // stop the animation by clearing the interval
              d3.select(this).html('forward');   // change the button label to play
              playing = false;   // change the status again
            }

        });
      }


//for play functionality
function timeMapSequence(yearsExpressed) {
    changeAttribute(yearExpressed, colorize);
    if (yearsExpressed < keyArray[keyArray.length-1]){
        yearExpressed++; 
    };
}; //end timeMapSequence


    //iterate over the years
    function mapSequence(yearExpressed) {
      //whene sequencing, call the change attribute fxn
        changeAttribute(yearExpressed, colorize);
        if (yearExpressed < yearArray[yearArray.length-1]){
            yearExpressed++;
        };
    }; //end of mapseq

    //changes the year displayed on map
    function changeAttribute(year, colorize){
      //this stuff removes the old year info
        for (y = 0; y < yearArray.length; y++){
            if (year == yearArray[y]) {
              //y represents the year
                 yearExpressed = yearArray[y];
            }
        }
        //colorizes the states
        d3.selectAll(".states")
            .style("fill", function(year){
                return choropleth(year, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
         //timeline stuff

        var timelineYear = d3.select(".timeline")
            .selectAll('g')
            .attr("font-weight", function(d){
                if (year == d.getFullYear()){
                    return "bold";
                } else {
                    return "normal";
                }
            }).attr("font-size", function(d){
                if (year == d.getFullYear()){
                    return "18px";
                } else {
                    return "12px";
                }
            }).attr("stroke", function(d){
                if (year == d.getFullYear()){
                    return "orange";
                } else {
                    return "blue";
                }
              });
         drawMenuInfo(colorize, year);
    }; //end of changeAttribute



    //creates the menu items
    function createMenu(arrayX, arrayY, title, infotext, infolink){
        var yArray = [40, 85, 130, 175, 220, 265];
        var oldItems = d3.selectAll(".menuBox").remove();
        var oldItems2 = d3.selectAll(".menuInfoBox").remove();

        var title = "Legal Status:";

        //creates menu boxes
        menuBox = d3.select(".menu-inset")
                .append("svg")
                .attr("width", menuWidth)
                .attr("height", menuHeight)
                .attr("class", "menuBox");

        //creates Menu Title
        var menuTitle = menuBox.append("text")
            .attr("x", 10)
            .attr("y", 30)
            .attr("class","title")
            .text(title)
            .style("font-size", '16px');

        //draws and shades boxes for menu
        for (b = 0; b < arrayX.length; b++){
           var menuItems = menuBox.selectAll(".items")
                .data(arrayX)
                .enter()
                .append("rect")
                .attr("class", "items")
                .attr("width", 35)
                .attr("height", 35)
                .attr("x", 15);

            menuItems.data(yArray)
                .attr("y", function(d, i){
                    return d;
                });

            menuItems.data(arrayY)
                .attr("fill", function(d, i){
                    return arrayY[i];
                });
        };
        //creates menulabels
        var menuLabels = menuBox.selectAll(".menuLabels")
            .data(arrayX)
            .enter()
            .append("text")
            .attr("class", "menuLabels")
            .attr("x", 60)
            .text(function(d, i){
                for (var c = 0; c < arrayX.length; c++){
                    return arrayX[i]
                }
            })
            .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif'});

            menuLabels.data(yArray)
                .attr("y", function(d, i){
                    return d + 30;
                });
    }; //end createMenu



    function colorScale(data){
    //determines which variable is being expressed, assigns the color scheme to empty currentColors array
        if (expressed === "Law") {
            currentColors = colorArrayLaw;
            currentArray = arrayLaw;
        } else if (expressed === "allExecutions") {
        //here is where we call the function for the prop symbols that kai is working on... I think.
        };
        //ordinal scale = discrete, like names or categories (use for law variable)
        scale = d3.scale.ordinal()
                    .range(currentColors)
                    .domain(currentArray);
        return scale(data[yearExpressed]);
};

//Sets up color scale for chart
function colorScaleChart(data) {
    if (expressed === "Law") {
        currentColors = colorArrayLaw;
        currentArray = arrayLaw;
    } else if (expressed === "allExecutions") {
//call a function for all executions prop symbols
    };

    scale = d3.scale.ordinal()
                .range(currentColors)
                .domain(currentArray);

    return scale(data);
}; //end color for charts


function choropleth(d, year, colorize){
//conditional statement, setting data equal to
var data = d.properties ? d.properties[expressed] : d;
return colorScale(data);
};

function choroplethChart(d, colorize) {
    return colorScaleChart(d);
};


//sets up the chart
function setChart(yearExpressed) {
    // reset the timelineFeatureArray each time setChart is called
    timelineFeatureArray = []; //this will hold the new feature objects that will include a value for which year a law changed
    //initial setup of chart
    var chart = d3.select(".graph")
        .append("svg")
        .attr("width", chartWidth+"px")
        .attr("height", chartHeight+"px")
        .attr("class", "chart");

    //put all rects in a g element
    var squareContainer = chart.append("g")
        .attr("transform", "translate(" + margin.left + ', ' + margin.top + ')');

    //for-loop creates an array of feature objects that stores three values: thisYear (for the year that a law was implemented), newLaw (the categorization of the new policy) and a feature object (the state that the law changed in)
    for (var feature in joinedJson) {
        var featureObject = joinedJson[feature];
        for (var thisYear = 1; thisYear<=keyArray.length-1; thisYear++){
            var lastYear = thisYear - 1;
            if (featureObject.properties[expressed][keyArray[thisYear]] != featureObject.properties[expressed][keyArray[lastYear]]) { //have to account for the value not being undefined since the grade data is part of the linked data, and that's not relevant for the timeline
                timelineFeatureArray.push({yearChanged: Number(keyArray[thisYear]), newLaw: featureObject.properties[expressed][keyArray[thisYear]], feature: featureObject}); //each time a law is passed in a given year, a new feature object is pushed to the timelineFeatureArray
            };
        };
    };
    var yearObjectArray = []; //will hold a count for how many features should be drawn for each year, the following for-loop does that

    //for-loop determines how many rects will be drawn for each year
    for (key in keyArray) {
        var yearCount = 1;
        for (i = 0; i < timelineFeatureArray.length; i++) {
            //loop through here to see which year it matches and up
            if (timelineFeatureArray[i].yearChanged == keyArray[key]) {
                //countYears++;
                yearObjectArray.push({"year": Number(keyArray[key]), "count":yearCount});
                yearCount = yearCount++;
            };
        };
    };

    //attach data to the rects and start drawing them
    chartRect = squareContainer.selectAll(".chartRect")
        .data(timelineFeatureArray) //use data from the timelineFeatureArray, which holds all of the states that had some change in law
        .enter()
        .append("rect") //create a rectangle for each state
        .attr("class", function(d) {
            return "chartRect " + d.feature.properties.postal;
        })
        .attr("width", squareWidth+"px")
        .attr("height", squareHeight+"px");

    //determine the x-scale for the rects, determing where along the x-axis they will be drawn according to which year the law changed
    var x = d3.scale.linear()
        .domain([keyArray[0], keyArray[keyArray.length-1]]) //domain is an array of 2 values: the first and last years in the keyArray (1973 and 2014)
        .rangeRound([0, chartWidth - margin.left - margin.right]); //range determines the x value of the square; it is an array of 2 values: the furthest left x value and the furthest right x value (on the screen)

    //set a time scale for drawing the axis; use a separate time scale rather than a linear scale for formatting purposes.
    var timeScale = d3.time.scale()
        .domain([new Date(keyArray[1]), d3.time.year.offset(new Date(keyArray[keyArray.length-1]), 1)]) //domain is an array of 2 values: the first and last years in the keyArray (1973 and 2014)
        .rangeRound([0, chartWidth - margin.left - margin.right]); //range determines the x value of the square; it is an array of 2 values: the furthest left x value and the furthest right x value (on the screen)

    //place the rects on the chart
    var rectStyle = chartRect.attr("transform", function(d) {
            return "translate(" + x(d.yearChanged) + ")"; //this moves the rect along the x axis according to the scale, depending on the corresponding year that the law changed
        })
        //y-value determined by how many rects are being drawn for each year
        .attr("y", function(d,i) {
            var yValue = 0;
            for (i = 0; i < yearObjectArray.length; i++) {
                if (yearObjectArray[i].year == d.yearChanged) {
                    yValue = yearObjectArray[i].count*(squareHeight+1);
                    yearObjectArray[i].count-=1;
                };
            };
            return yValue;
        })
        .style("fill", function(d) {
            return choroplethChart(d.newLaw, colorize); //apply the color according to what the new law is in that year
        })
        .on("mouseover", highlightChart)
        .on("mouseout", dehighlight);

    //save text description of the color applied to each rect to be able to use this for dehighlight
    rectColor = rectStyle.append("desc")
            .text(function(d) {
                return choroplethChart(d.newLaw, colorize);
            })
            .attr("class", "rectColor");

    //Creates the axis function
    var axis = d3.svg.axis()
        .scale(timeScale)
        .orient("bottom")
        .ticks(d3.time.years, 1)
        .tickFormat(d3.time.format('%y'))
        .tickPadding(5) //distance between axis line and labels
        .innerTickSize(50);

    //sets the thickness of the line between the ticks and the corresponding squares in the chart
    var timelineLine = axis.tickSize(1);

    //sets the margins for the timeline transform
    var timelineMargin = {top: 50, right: 20, bottom: 30, left:40};

    //draw the timeline as a g element on the chart
    var timeline = chart.append("g")
        .attr("height", chartHeight)
        .attr("width", chartWidth)
        .attr('transform', 'translate(' + timelineMargin.left + ',' + (chartHeight - timelineMargin.top - timelineMargin.bottom) + ')') //set the starting x,y coordinates for where the axis will be drawn
        .attr("class", "timeline")
        .call(axis); //calls the axis function on the timeline

    //adds mouse events
    timeline.selectAll('g')
        .each(function(d){
            d3.select(this)
             .on("mouseover", function(){
                 d3.select(this)
                    .attr("font-weight", "bold")
                    .attr("cursor", "pointer")
                    .attr("font-size", "18px")
                    .attr("stroke", "#986cb3");
            })
            .on("mouseout", function(){
                    d3.select(this)
                        .attr("font-weight", "normal")
                        .attr("font-size", "12px")
                        .attr("stroke", "gray")
                        .attr("cursor", "pointer");
            })
            .on("click", function(){
                 d3.select(this)
                    .attr("font-weight", "bold")
                    .attr("cursor", "pointer")
                    .attr("font-size", "18px")
                    .attr("stroke", "#986cb3");
                var year = d.getFullYear();
                changeAttribute(year, colorize);
                animateMap(year, colorize, yearExpressedText);
            });
        });
};

//HIGHLIGHT/DEHIGHLIGHT FUNCTIONS//


function highlight(data) {
    //this is a conditional statement, holds the currently highlighted feature
    var feature = data.properties ? data.properties : data.feature.properties;
    d3.selectAll("."+feature.abrev)
        .style("fill", "#800000");

    //set the state name as the label title
    var labelName = feature.abrev;
    var labelAttribute;
    //set up the text for the dynamic labels for the map
    //labels should match the yearExpressed and the state of the law during that year
    if (expressed == "Law") {
        labelAttribute = yearExpressed+" legal Status: "+feature[expressed][Number(yearExpressed)];
    } else if (expressed == "allExecutions") {
        labelAttribute = yearExpressed+" number of executions: "+feature[expressed][Number(yearExpressed)];
    }
    var retrievelabel = d3.select(".map")
        .append("div")
        .attr("class", "retrievelabel")
        .attr("id",feature.abrev+"label")

    var labelTitle = d3.select(".retrievelabel")
        .html(labelName)
        .attr("class", "labelTitle");

    var labelAttribute = d3.select(".labelTitle")
        .append("div")
        .html(labelAttribute)
        .attr("class", "labelAttribute")
};


//Function for highlighting the chart
function highlightChart(data) {
    //holds the currently highlighted feature
    var feature = data.properties ? data.properties : data.feature.properties;
    d3.selectAll("."+feature.postal)
        .style("fill", "#8856A7");

    //set the state name as the label title
    var labelName = feature.name;
    var labelAttribute;

    //set up the text for the dynamic labels
    //when highlighting the chart, the labels reflect the year the law changed and the law that was changed that year, regardless of which year is being shown on the map
    if (expressed == "Law") {
        labelAttribute = data.yearChanged+"<br>Legal Status: "+data.newLaw;
    } else if (expressed == "allExecutions") {
        //do all execution stuff
    }

    var infoLabel = d3.select(".map")
        .append("div")
        .attr("class", "infoLabel")
        .attr("id",feature.postal+"label")
        .attr("padding-left", 500+"px");

    var labelTitle = d3.select(".infoLabel")
        .html(labelName)
        .attr("class", "labelTitle");

    var labelAttribute = d3.select(".labelTitle")
        .append("div")
        .html(labelAttribute)
        .attr("class", "labelAttribute")
};

//both map/chart dehighlight
function dehighlight(data) {
    var feature = data.properties ? data.properties : data.feature.properties;
    var deselect = d3.selectAll("#"+feature.abrev+"label").remove();

    //dehighlighting the states
    var selection = d3.selectAll("."+feature.abrev)
        .filter(".states");
    var fillColor = selection.select("desc").text();
    selection.style("fill", fillColor);

    //chart
    var chartSelection = d3.selectAll("."+feature.abrev)
        .filter(".chartRect");
    var chartFillColor = chartSelection.select("desc").text();
    chartSelection.style("fill", chartFillColor);
};

function setLabel(props) {
    //label content
    var labelAttribute = "<h1>" + props[expressed] +
        "</h1><b>" + expressed + "</b>";
    //create info label div
    var retrievelabel = d3.select("body")
        .append("div")
        .attr({
            //set up class named retrievelabel to edit style
            "class": "retrievelabel",
            //use the attribute NAME to label the county
            "id": props.abrev
        })
        .html(labelAttribute);

    var stateName = retrievelabel.append("div")
        .attr("class", "labelname")
        .html(props.abrev);
};
//set up function for label placement as mouse moves
function moveLabel(){
    //get width of label
    var labelWidth = d3.select(".retrievelabel")
        .width;

    d3.select(".retrievelabel")
};


// jQuery timer for play/pause
var timer = $.timer(function() {
        if (yearExpressed == keyArray[keyArray.length-1]){
            yearExpressed = keyArray[0];
        };
        animateMap(yearExpressed, colorize, yearExpressedText);
        timeMapSequence(yearExpressed);  
    });
timer.set({ time : 800, autostart : false });
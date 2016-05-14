//GLOBALS:
var topicArray = ["Law",
                  "allExecutions"]; //the first item in this array will be the default

//array for years
var yearArray = ["1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995","1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];

//choropleth global variables
var currentColors = []; //empty array to fill with corresponding colors
var currentArray = []; //empty array to fill with the current topic
var expressed; //
var scale; //
var colorize; //
var playing = false; //default to not play on load

/* **************************************************************
This variable is key and controls all values later on throughout
// special attention here
************************************************************** */
var yearExpressedText; //variable to store year expressed text
//array for law variable
var arrayLaw = [ "Legal",
                 "Illegal"];
var colorArrayLaw  = ["#DCDCDC","white"];
//the map width is a function of window size
var mapWidth = window.innerWidth * 0.7,
mapHeight = 600;
var menuWidth = 200, menuHeight = 300;
var menuInfoWidth = 250, menuInfoHeight = 100;
var joinedJson;
var map;
var path;
var projection;
//stores the current year
var yearExpressed;
// Global variables controling 'setSymbol' function
var circles; // variable holding circle objects
var symbolSet = false; // variable activating function
// Global variable storing data file
var file;


/* *** START PROGRAM *** */

//when window loads, initiate map
window.onload = initialize();

function initialize(){
    expressed = topicArray[0];
    yearExpressed = yearArray[38];

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
    projection = d3.geo.albersUsa()
        .scale(1300)
        .translate([mapWidth / 2, mapHeight / 2]);
        //path to draw the map
    path = d3.geo.path()
        .projection(projection);
        //load in the data

    d3_queue.queue()
    //queue funcion loads external data asynchronously
        .defer(d3.csv, "../data/Law.csv") //laws by year
        .defer(d3.csv,"../data/allExecutions_up01.csv") //executions by year
        .defer(d3.json, "../data/continentalUS.topojson") //geometries
        .await(callback);

}; //setmap is done

//retrieve and process json file and data, same order as the queue function to load data
//accepts errors from queue function as first argument

function callback(error, Law, allExecutions, continentalUS){

    //variable to store the continentalUS json with all attribute data
    joinedJson = topojson.feature(continentalUS, continentalUS.objects.states).features;

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

    //call function to animate the map to iterate over the years
    animateMap(yearExpressed, colorize, yearExpressedText, allExecutions);

    // First implementation of choropleth and prop symbols
    implementState (csvArray[csv], joinedJson);
    setSymb(path, map, projection, allExecutions);

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

function implementState(csvData, json, data) {
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
function setSymb (path, map, projection, data){

    if (!symbolSet) {
     circles = map.selectAll(".circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d) {
            return "circles " + d.state;
        }).attr("fill", "#800000")
        .attr('fill-opacity',0.6)
        .attr("cx", function(d) {
            return projection([d.Longitude, d.Latitude])[0];
        }).attr("cy", function(d) {
            return projection([d.Longitude, d.Latitude])[1];
        }).on("mouseover", function(d) {
            retrievelabel(data);
            // event listener, highlight bubbles
            d3.select(this).attr("fill", '#1F7676');
        }).on("mouseout", function() {

            d3.select(this).attr("fill", '#800000');
        })
        // set parameter true to deactivate script
        setSymb = true;
    }
    updateSymb(data);
};

function retrievelabel(data) {
    console.log("this is where kai's code for the tooltip goes");
}

function updateSymb(data) {
    // create array to store all values for
    var domainArray = [];
    var selYear = yearExpressed;
    // typecasting number to string to access column in dataset
    selYear = '' + selYear;
    // iteration through all states to obtain ex. data for selected year
    for (var i=0; i<data.length; i++) {
        // access code for execution data from csv
        var val = parseFloat(data[i][selYear]);
        domainArray.push(val);
    };

        var radiusMin = Math.min.apply(Math, domainArray);
        var radiusMax = Math.max.apply(Math, domainArray);

    var setRadius = d3.scale.sqrt()
        .range([0, 40])
        .domain([radiusMin, radiusMax]);
    //create a second svg element to hold the bar chart
    var circleRadius= circles.attr("r", function(d){
            return setRadius(d[selYear]);
        });
};

    //adds clock
    function drawMenuInfo(colorize, yearExpressed){
        //creates year for map menu
        yearExpressedText = d3.select('#clock')
            .attr("x", 0)
            .attr("y", 0)
            .text(yearExpressed)
            .style({'font-size':'36px', 'font-weight': 'strong'});
    }; 

function animateMap(yearExpressed, colorize, yearExpressedText, data){
    //take a step back now ya'll
    $(".stepBackward").click(function(){
        if (yearExpressed != yearArray[0]){
            yearExpressed--;
            changeAttribute(yearExpressed, colorize);
        } else {
            yearExpressed = yearArray[yearArray.length-1];
            changeAttribute(yearExpressed, colorize);
        };
        // update symbols to match year 
        updateSymb(data);

    });
    //step forward
    $(".stepForward").click(function(){
        if (yearExpressed < yearArray[yearArray.length-1]){
            yearExpressed++;
            changeAttribute(yearExpressed, colorize);
        } else {
            yearExpressed = yearArray[0];
            changeAttribute(yearExpressed, colorize);
        };

        // update symbols to match year iteration
        updateSymb(data);
    });
}; //end animatemap

//for play functionality
function timeMapSequence(yr) {
    changeAttribute(yearExpressed, colorize);
    if (yr < yearArray[yearArray.length-1]){
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

         drawMenuInfo(colorize, year);
    }; //end of changeAttribute


    //creates the legend
    function createMenu(arrayX, arrayY, title, infotext, infolink) {
        var yArray = [40, 85, 130, 175, 220, 265];

        var title = "Legal Status:";

        //creates menu boxes
        menuBox = d3.select(".menu-info")
                .append("svg")
                .attr("width", menuWidth)
                .attr("height", menuHeight)
                .attr("class", "menuBox");

        //creates Menu Title
        var legendTitle = menuBox.append("text")
            .attr("x", 5)
            .attr("y", 30)
            .attr("class","legendTitle")
            .text(title)

        //draws and shades boxes for menu
        for (b = 0; b < arrayX.length; b++){
           var menuItems = menuBox.selectAll(".items")
                .data(arrayX)
                .enter()
                .append("rect")

            menuItems.data(yArray)
                .attr("y", function(d, i){
                    return d;
                });
                //fills legend boxes with choropleth colors
            menuItems.data(arrayY)
                .attr("fill", function(d, i){
                    return arrayY[i];
                });
        };
        //creates labels for legends
        var legendLabels = menuBox.selectAll(".legendLabels")
            .data(arrayX)
            .enter()
            .append("text")
            .attr("class", "legendLabels")
            .attr("x", 60)
            .text(function(d, i){
                for (var c = 0; c < arrayX.length; c++){
                    return arrayX[i]
                }
            })
            legendLabels.data(yArray)
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


function choropleth(d, colorize){
//conditional statement, setting data equal to
var data = d.properties ? d.properties[expressed] : d;
return colorScale(data);
};



function highlight(data) {
    //this is a conditional statement, holds the currently highlighted feature
    var feature = data.properties ? data.properties : data.feature.properties;
    d3.selectAll("."+feature.abrev)
        .style("stroke", "#CCC");

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



//both map/chart dehighlight
function dehighlight(data) {
    var feature = data.properties ? data.properties : data.feature.properties;
    var deselect = d3.selectAll("#"+feature.abrev+"label").remove();

    //dehighlighting the states
    var selection = d3.selectAll("."+feature.abrev)
        .filter(".states");
    var fillColor = selection.select("desc").text();
    selection.style("fill", fillColor);
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

var attrArray = ["Total", "Per Capita"];
var expressed = attrArray[0];
var fullDate = ["March 2015", "April 2015","May 2015", "June 2015",  "July 2015","August 2015","September 2015","October 2015","November 2015","December 2015","January 2016","February 2016","March 2016"];
var timeArray = ["March_15","April_15","May_15","June_15","July_15","August_15","September_15","October_15","November_15","December_15","January_16","February_16","March_16"];
var timelineArray = ["Mar 15", "Apr 15","May 15", "June 15", "July 15","Aug 15","Sep 15","Oct 15","Nov 15","Dec 15","Jan 16","Feb 16","Mar 16"];
var eventArray1=["Ted Cruz joined race","Hilary Clinton, Rand Paul, Marco Rubio and Bernie Sanders joined race","Carly Fiorina, Ben Carson, Rick Santorum, Mike Huckabee, Martin O'Malley and George Pataki joined race", "Rick Perry, Jeb Bush, Jill Stein, Donald Trump, Bobby Jindal, Lindsey Graham and  Chris Christie joined race",  "James Webb, John Kasich and Scott Walker joined race"," ","Lawrence Lessig joined race"," "," ",""," "," "," "]
var eventArray2=[" ", " "," ", " ",  " "," ","Rick Perry and Scott Walker dropped out of race","James Webb dropped out of race","Lawrence Lessig and Bobby Jindal dropped out of race","Lindsey Graham and George Pataki dropped out of race"," "," Martin O'Malley, Mike Huckabee, Rand Paul, Rick Santorum, Chris Christie, and Carly Fiorina drop out of race "," "]
var eventArray3=[" ", "  "," ", "",  "","1st Republican Forum in New Hampshire </br>1st Republican Debate in Ohio","2nd Republican Debate in California","1st Democratic Debate in Nevada </br> 3rd Republican Debate in Colorado","1st Democratic Forum in South Carolina </br> 4th Republican Debate in Wisconsin </br> 2nd Democratic Debate in Iowa","Republican Jewish Coalition Presidential Candidates Forum in D.C. </br> 5th Republican Debate in Nevada </br> 3rd Democratic Debate in New Hampshire","Republican's Kemp Forum in South Carolina </br> 3rd Democratic Forum in Iowa </br> 6th Republican Debate in South Carolina </br> Democratic Forum in Iowa </br> 7th Republican Debate in Iowa","Democratic Town Hall Forum in New Hampshire </br> 5th Democratic Debate in New Hampshire </br>8th Republican Debate - New Hampshire </br> 6th Democratic Debate in Wisconsin </br>2 Republican Town Halls in South Carolina </br> Democratic Town Hall Forum in Nevada </br> CNN Democratic Town Hall in South Carolina </br> 10th Republican Debate in Texas </br> Hillary Clinton and Ted Cruz win Iowa caucuses </br> Donald Trump and Bernie Sanders win New Hampshire primaries </br> Hillary Clinton and Donald Trump win Nevada caucuses </br> Donald Trump and Hillary Clinton win South Carolina primaries","11th Republican Debate in Michigan </br> 7th Democratic Debate in Michigan </br> 8th/Final Democratic Debate in Florida, </br>12th Republican Debate in Florida </br> Hillary wins primaries in Alabama, Arizona, Arkansas, Florida, Georgia, Illinois, Louisiana, Massachusetts, Missouri, Mississippi, North Carolina, Ohio, Tennessee, Texas, and Virginia </br> Bernie Sanders wins primaries in Colorado, Michigan, Oklahoma, and Vermont </br>Bernie Sanders wins caucuses in Alaska, Kansas, Hawaii, Idaho, Maine, Minnesota, Nebraska, Utah, and Washington </br> Donald Trump wins primaries in Alabama, Arizona, Arkansas, Florida, Georgia, Illinois, Louisiana, Massachusetts, Michigan, Mississippi, Missouri, North Carolina, Tennessee, Vermont, Virginia </br> Donald Trump wins caucuses In Hawaii and Kentucky </br> Ted Cruz wins primaries in Alaska, Oklahoma, and Texas </br>Ted Cruz wins Wyoming County Conventions </br> Marco Rubio wins Minnesota and D.C. caucuses </br> John Kasich wins Ohio caucus"]
var count = 12;
var timeExpressed = timeArray[12];
var yearExpressedText;
var eventExpressedText1,eventExpressedText2,eventExpressedText3;
var candidaterightname, candidateleftname;
var currentFrame = 0;
var map;
var svg;
var newarray;
var projection;
var setRadius;
var radioName = expressed;
var width = window.innerWidth * 0.55,
    height= 500;
var attributeNames = [];
var csvArray = [];
var oldcsvArray = [];
var format = d3.format(",");

window.onload = setMap();
// set the width and height of the map
function setMap() {


    // creating the map as an svg and giving it attributes of width and height
    map = d3.select("#mapContainer")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    projection = d3.geo.albersUsa()
    // no center because it's already centered on the US as part of the projection code
        .scale(1000)
        .translate([width / 1.95, height / 2.2]); // keeps map centered in the svg container

    // creating a path generator to draw the projection
    var path = d3.geo.path()
        .projection(projection);

    function zoomed() {
            map.style("stroke-width", 1.5 / d3.event.scale + "px");
            map.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 3])
        .on("zoom", zoomed);

    map.call(zoom)
        .call(zoom.event);

    // uses queue.js to parallelize asynchronous loading of the the CSV and shapefile data
    d3_queue.queue()

        .defer(d3.csv, "data/GoodCSVs/JebBush.csv")
        .defer(d3.csv, "data/GoodCSVs/BenCarson.csv")
        .defer(d3.csv, "data/GoodCSVs/ChrisChristie.csv")
        .defer(d3.csv, "data/GoodCSVs/HillaryClinton.csv")
        .defer(d3.csv, "data/GoodCSVs/TedCruz.csv")
        .defer(d3.csv, "data/GoodCSVs/CarlyFiorina.csv")
        .defer(d3.csv, "data/GoodCSVs/LindseyGraham.csv")
        .defer(d3.csv, "data/GoodCSVs/MikeHuckabee.csv")
        .defer(d3.csv, "data/GoodCSVs/BobbyJindal.csv")
        .defer(d3.csv, "data/GoodCSVs/JohnKasich.csv")
        .defer(d3.csv, "data/GoodCSVs/LawrenceLessig.csv")
        .defer(d3.csv, "data/GoodCSVs/MartinOMalley.csv")
        .defer(d3.csv, "data/GoodCSVs/GeorgePataki.csv")
        .defer(d3.csv, "data/GoodCSVs/RandPaul.csv")
        .defer(d3.csv, "data/GoodCSVs/RickPerry.csv")
        .defer(d3.csv, "data/GoodCSVs/MarcoRubio.csv")
        .defer(d3.csv, "data/GoodCSVs/BernieSanders.csv")
        .defer(d3.csv, "data/GoodCSVs/RickSantorum.csv")
        .defer(d3.csv, "data/GoodCSVs/JillStein.csv")
        .defer(d3.csv, "data/GoodCSVs/DonaldTrump.csv")
        .defer(d3.csv, "data/GoodCSVs/ScottWalker.csv")
        .defer(d3.csv, "data/GoodCSVs/JamesWebb.csv")
        .defer(d3.csv, "data/total_contributions_percandidate_perstate.csv")
        .defer(d3.csv, "data/events.csv")
        .defer(d3.json,"data/US_shapefile.topojson")
        .await(callback); // waits til both sets of data are loaded before it sends the data to the callback function

    // callback function that takes the data as two parameters and an error parameter that will report any errors that occur
    function callback(error, Bush, Carson, Christie, Clinton, Cruz, Fiorina, Graham, Huckabee, Jindal, Kasich, Lessig, OMalley, Pataki, Paul, Perry, Rubio, Sanders, Santorum, Stein, Trump, Walker, Webb, total,events, unitedStates) {

        total.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.Total =+ d.Total
        });
        Bush.forEach(function(d){
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Carson.forEach(function(d){
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Christie.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Clinton.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Cruz.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Fiorina.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Graham.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Huckabee.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Jindal.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Kasich.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Lessig.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        OMalley.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Pataki.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Paul.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Perry.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Rubio.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Sanders.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Santorum.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Stein.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Trump.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Walker.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });
        Webb.forEach(function(d) {
            d.Lat= +d.Lat
            d.Lon= +d.Lon
            d.state_total= +d.state_total
        });

        total.sort(function (a, b) {
            return b.Total - a.Total;
            return b.PerCapita - a.PerCapita;
        });


        // translate the topojson to GeoJSON within the DOM
        var us = topojson.feature(unitedStates, unitedStates.objects.US_shapefile).features; // pulls the array of features from the shapefile data and passes it to .data()

        oldcsvArray = [Bush, Carson, Christie, Clinton, Cruz, Fiorina, Graham, Huckabee, Jindal, Kasich, Lessig, OMalley, Pataki, Paul, Perry, Rubio, Sanders, Santorum, Stein, Trump, Walker, Webb,total];

        csvArray = [Bush, Carson, Christie, Clinton, Cruz, Fiorina, Graham, Huckabee, Jindal, Kasich, Lessig, OMalley, Pataki, Paul, Perry, Rubio, Sanders, Santorum, Stein, Trump, Walker, Webb,total];


        for (i=0; i<oldcsvArray.length-1; i++) {
            for (j=0; j<oldcsvArray[i].length; j++) {
                csvArray[i][j].March_16 = parseFloat(oldcsvArray[i][j].March_16);
                csvArray[i][j].March_15 = parseFloat(oldcsvArray[i][j].March_15);
                csvArray[i][j].April_15 = parseFloat(oldcsvArray[i][j].April_15);
                csvArray[i][j].May_15 = parseFloat(oldcsvArray[i][j].May_15);
                csvArray[i][j].June_15 = parseFloat(oldcsvArray[i][j].June_15);
                csvArray[i][j].July_15 = parseFloat(oldcsvArray[i][j].July_15);
                csvArray[i][j].August_15 = parseFloat(oldcsvArray[i][j].August_15);
                csvArray[i][j].September_15 = parseFloat(oldcsvArray[i][j].September_15);
               csvArray[i][j].October_15 = parseFloat(oldcsvArray[i][j].October_15);
               csvArray[i][j].November_15 = parseFloat(oldcsvArray[i][j].November_15);
               csvArray[i][j].December_15 = parseFloat(oldcsvArray[i][j].December_15);
               csvArray[i][j].January_16 = parseFloat(oldcsvArray[i][j].January_16);
               csvArray[i][j].February_16 = parseFloat(oldcsvArray[i][j].February_16);
           }
       }

       attributeNames = ["Jeb Bush (R)","Ben Carson (R)","Chris Christie (R)","Hillary Clinton (D)","Ted Cruz (R)","Carly Fiorina (R)","Lindsey Graham (R)","Mike Huckabee (R)","Bobby Jindal (R)","John Kasich (R)","Lawrence Lessig (D)","Martin OMalley (D)","George Pataki (R)","Rand Paul (R)","Rick Perry (R)","Marco Rubio (R)","Bernie Sanders (D)","Rick Santorum (R)","Jill Stein (Green Party)","Donald Trump (R)","Scott Walker (R)","James Webb (D)"];

       for (i in csvArray){
            joinData(us, csvArray[i], attributeNames[i]);
        };

         setEnumerationUnits(us, map, path);
         setCircles (path,map,total,projection, us);
         createDropdownLeft(us,projection);
         createDropdownRight(us,projection);
         createradio(total,path,map,Bush, Carson, Christie, Clinton, Cruz, Fiorina, Graham, Huckabee, Jindal, Kasich, Lessig, OMalley, Pataki, Paul, Perry, Rubio, Sanders, Santorum, Stein, Trump, Walker, Webb,total, projection,us);
         CreateTotalLegend();
         //createButton(us,projection);
        //createSlider(us,projection);
        //drawMenuInfo(timeExpressed);
      //  CreateSplitLegend();
        // displayEvents(events)
    };
};

function drawMenuInfo(time){
    //create event and time
    var a = timeArray.indexOf(timeExpressed);

    timeExpressedText = d3.select('#infoPanel')
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "yearExpressedText menu-info")
        .text(fullDate[a])
        .style({'font-size':'30px', 'font-weight': 'strong'});

 eventExpressedText1 = d3.select('#infoPanel')
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "eventExpressedText1")
        .html(eventArray1[a]);

 eventExpressedText2 = d3.select('#infoPanel')
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "eventExpressedText2")
        .html(eventArray2[a]);

        eventExpressedText3 = d3.select('#infoPanel')
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "eventExpressedText3")
        .html(eventArray3[a]);




    var timelineYear = d3.select(".axis")
        .selectAll('g')
        .attr("font-weight", function(d){

            if (timelineArray[a] == d) {
                return "bold";
            } else {
                return "normal";
            }
        }).attr("font-size", function(d){
            if (timelineArray[a] == d){
                return "18px";
            } else {
                return "12px";
            }
        }).attr("stroke", function(d){
            if (timelineArray[a] == d){
                return "#9fa696";
            } else {
                return "none";
            }
         });
};



function createButton(us,projection) {

    //step forward functionality
    $(".stepForward").click(function(){
        if (count < timeArray.length-1){
            count++;
            timeExpressed = timeArray[count];
        } else {
          count = 0;
          timeExpressed = timeArray[count];
        };

        var removeOldYear = d3.selectAll(".yearExpressedText").remove();
        var removeOldEvent = d3.selectAll(".eventExpressedText1").remove();
         var removeOldEvent = d3.selectAll(".eventExpressedText2").remove();
          var removeOldEvent = d3.selectAll(".eventExpressedText3").remove();

        if (candidaterightname && candidateleftname) {
            createRightSplit(candidaterightname,us,projection);
            createLeftSplit(candidateleftname,us,projection);

        } else if (candidaterightname){
            createRightSplit(candidaterightname,us,projection)

        } else if (candidateleftname) {
            createLeftSplit(candidateleftname,us,projection)
        }
            drawMenuInfo(timeExpressed);
    });

    $(".stepBackward").click(function(){
        if (count < timeArray.length && count > 0){
            count= count-1;
            timeExpressed = timeArray[count];

        } else {
            count = 12;
            timeExpressed = timeArray[count];
        };

        var removeOldYear = d3.selectAll(".yearExpressedText").remove();
        var removeOldEvent = d3.selectAll(".eventExpressedText1").remove();
        var removeOldEvent = d3.selectAll(".eventExpressedText3").remove();
        var removeOldEvent = d3.selectAll(".eventExpressedText2").remove();

         if (candidaterightname && candidateleftname)
        {
          createRightSplit(candidaterightname,us,projection);
        createLeftSplit(candidateleftname,us,projection);}

         else if (candidaterightname)
         {createRightSplit(candidaterightname,us,projection)}
       else if (candidateleftname)
         {
        createLeftSplit(candidateleftname,us,projection)}
        drawMenuInfo(timeExpressed);
    });

};

function createSlider(us,projection){
    var y = d3.scale.ordinal()
       .domain(["Mar 15", "Apr 15","May 15", "June 15", "July 15","Aug 15","Sep 15","Oct 15","Nov 15","Dec 15","Jan 16","Feb 16","Mar 16"])
       .rangeRoundBands([0, 990]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("bottom")
        .tickPadding(2)

    var axis = d3.select("#timeline")
        .append("svg")
        .attr("class", "axis")
        .attr("transform", "translate(5, 0)")
        .call(yAxis);
console.log(axis);
    //adds mouse events
    axis.selectAll('g')
        .each(function(d){
            d3.select(this)
                .on("mouseover", function(){
                    d3.select(this)
                        .attr("font-weight", "bold")
                        .attr("cursor", "pointer")
                        .attr("font-size", "18px")
                        .attr("stroke", "gray");
                })
                .on("mouseout", function(){
                    d3.select(this)
                        .attr("font-weight", "normal")
                        .attr("font-size", "1em")
                        .attr("stroke", "none")
                        .attr("cursor", "pointer");
                })
                .on("click", function(){
                    d3.select(this)
                        .attr("font-weight", "bold")
                        .attr("cursor", "pointer")
                        .attr("font-size", "18px")
                        .attr("stroke", "#986cb3");


                    count = timelineArray.indexOf(d);
            timeExpressed = timeArray[count];
                    var removeOldYear = d3.selectAll(".yearExpressedText").remove();
                    var removeOldEvent = d3.selectAll(".eventExpressedText1").remove();
                    var removeOldEvent = d3.selectAll(".eventExpressedText2").remove();
                      var removeOldEvent = d3.selectAll(".eventExpressedText3").remove();

                    drawMenuInfo(timeExpressed);

                    if (candidaterightname && candidateleftname) {
                        createRightSplit(candidaterightname,us,projection);
                        createLeftSplit(candidateleftname,us,projection);

                    } else if (candidaterightname){
                        createRightSplit(candidaterightname,us,projection)

                    } else if (candidateleftname){
                        createLeftSplit(candidateleftname,us,projection)
                    }
                });
        });
}



function joinData(us, csvData, attribute){

    //loop through csv to assign each set of csv attribute values to geojson region
    for (var i=0; i<csvData.length; i++){
        var csvRegion = csvData[i]; //the current region
        var csvKey = csvRegion.state; //the CSV primary key

         //loop through geojson regions to find correct region
        for (var a=0; a<us.length; a++){
            var geojsonProps = us[a].properties; //the current region geojson properties
            var geojsonKey = geojsonProps.state; //the geojson primary key

            //where primary keys match, transfer csv data to geojson properties object
            if (geojsonKey == csvKey){

                //assign all attributes and values
                attrArray.forEach(function(attr){
                    var val = parseFloat(csvRegion[attr]); //get csv attribute value
                    geojsonProps[attr] = val; //assign attribute and value to geojson properties

                });
            };
        };
    };
    return us;
};

function setEnumerationUnits(us, map, path){

    var states = map.selectAll(".states")
            .data(us)
            .enter()
            .append("path")
            .attr("class", "state-boundary") // unique class name in the shapefile properties; in this case names of the states
            .attr("d", path);
};

function setCircles (path, map, data, projection, us){

  var circles = map.selectAll(".circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d){
            return "circles " + d.state_total + d.state;
        })
        .attr("fill", "#4d4543")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "white")
        .attr("stroke-width", 0.7)
        .attr("cx", function(d) {
            return projection([d.Lon, d.Lat])[0];
        })
        .attr("cy", function(d) { return projection([d.Lon, d.Lat])[1];
        })
        .on("mouseover", highlightCircles)
        .on("mouseout", dehighlightCircles);

  var desc = circles.append("desc")
        .text('{"stroke": "white", "stroke-width": "0.7", "fill-opacity": "0.5"}');

    updateCircles(circles,data);
};

function setCircles2 (path, map, data, projection, us){

  var circles = map.selectAll(".circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d){
            return "circles " + d.state_total + d.state;
        })
        .attr("fill", "#666")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "white")
        .attr("stroke-width", 0.7)
        .attr("cx", function(d) {
            return projection([d.Lon, d.Lat])[0];
        })
        .attr("cy", function(d) { return projection([d.Lon, d.Lat])[1];
        })
        .on("mouseover", highlightCircles)
        .on("mouseout", dehighlightCircles);

  var desc = circles.append("desc")
        .text('{"stroke": "white", "stroke-width": "0.7", "fill-opacity": "0.5"}');

    updateCircles(circles,data);
};

function createradio(data,path,map,Bush, Carson, Christie, Clinton, Cruz, Fiorina, Graham, Huckabee, Jindal, Kasich, Lessig, OMalley, Pataki, Paul, Perry, Rubio, Sanders, Santorum, Stein, Trump, Walker, Webb,total, projection,us){

    var filterPhases = ["Total", "PerCapita", "CompareCandidates"],
    j=0;

    var form1 = d3.select("#sideColumn")
        .append("form")
        .attr("class", "Classification1")

    var labelEnter = form1.selectAll("span")
        .data(filterPhases)
        .enter()
        .append("span");


    labelEnter.append("input")
        .attr({
            type: "radio",
            name: "mode",

        value: function(d) {return d;}
        })
        .on("change", function(d){
              //changeAttribute(this.value, data);
              radioName = d;
              //console.log(d);
              if (d == "CompareCandidates"){
                //console.log("Hi");
                    //changeAttribute(this.value, data);
                    drawMenuInfo(timeExpressed);
                    d3.selectAll(".circles").remove();
                    createButton(us,projection);
                    createSlider(us,projection);
                    d3.selectAll(".legendPer").remove();
                    d3.selectAll(".legendTotal").remove();
                    CreateSplitLegend();
                    $(".stepForward").attr("disabled", false);
                    $(".stepBackward").attr("disabled", false);
                    $('.dropdownLeft').attr("disabled", false);
                    $('.dropdownRight').attr("disabled", false);
                  };
              if (d == "Total"){
                  //CreateTotalLegend();
                  d3.selectAll(".leftsplit").remove();
                  d3.selectAll(".rightsplit").remove();
                  d3.selectAll(".legendInfo").remove();
                  d3.selectAll(".legendPer").remove();
                  CreateTotalLegend();
                  setCircles2 (path, map, data, projection, us)
                  changeAttribute(this.value, data);
                  $(".yearExpressedText").remove();
                  $(".eventExpressedText1").remove();
                  $(".eventExpressedText2").remove();
                  $(".eventExpressedText3").remove();
                  $(".axis").remove();
                  $(".stepForward").attr("disabled", true);
                  $(".stepBackward").attr("disabled", true);
                  $('.dropdownLeft').attr("disabled", true);
                  $('.dropdownRight').attr("disabled", true);
                  //changeAttribute(this.value, data);
                  console.log(this.value);
                  };
              if (d == "PerCapita"){
                d3.selectAll(".leftsplit").remove();
                d3.selectAll(".rightsplit").remove();
                d3.selectAll(".legendInfo").remove();
                d3.selectAll(".legendTotal").remove();
                CreatePerCapitaLegend();
                setCircles2 (path, map, data, projection, us)
                //CreatePerCapitaLegend();
                changeAttribute(this.value, data);
                $(".yearExpressedText").remove();
                $(".eventExpressedText1").remove();
                 $(".eventExpressedText2").remove();
                  $(".eventExpressedText3").remove();
                $(".axis").remove();
                $(".stepForward").attr("disabled", true);
                $(".stepBackward").attr("disabled", true);
                $('.dropdownLeft').attr("disabled", true);
                $('.dropdownRight').attr("disabled", true);
                };
                console.log(this.value);
          })


    .property("checked", function(d, i) {return i===j;})

    labelEnter.append("label").text(function(d) {return d;});

};

function changeAttribute(attribute, data){
    //change the expressed attribute
    expressed = attribute;
    var circles = d3.selectAll(".circles");
    updateCircles(circles, data);
    var circles2 = d3.selectAll("#redraw");
    updateCircles2(circles, data);

}

function updateCircles(circles, data){
    var domainArray = [];
    for (var i=0; i<data.length; i++){
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };
        radiusMin = Math.min.apply(Math, domainArray);
        radiusMax = Math.max.apply(Math, domainArray);

        setRadius = d3.scale.sqrt()
            .range([0, 70])
            .domain([radiusMin, radiusMax]);
    //create a second svg element to hold the bar chart
    var circleRadius= circles.attr("r", function(d){
        return setRadius(d[expressed]);
    });
};

function updateCircles2(circles, data){
    var domainArray = [];
    for (var i=0; i<data.length; i++){
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };
        radiusMin = Math.min.apply(Math, domainArray);
        radiusMax = Math.max.apply(Math, domainArray);

        setRadius = d3.scale.sqrt()
            .range([0, 70])
            .domain([radiusMin, radiusMax]);
    //create a second svg element to hold the bar chart
    var circleRadius= circles.attr("r", function(d){
        return setRadius(d[expressed]);
    });
};

function createLeftSplit(caname,us,projection){

    var candidate_a;
    removeCircles = d3.selectAll(".circles").remove();
    remorveSplit = d3.selectAll(".leftsplit").remove();

    for (var i=0; i<attributeNames.length; i++){
        if(attributeNames[i] == caname){
            candidate_a = csvArray[i];
        }
    };



        var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(function(d){
                return setRadius(d[timeExpressed]);
            })
            .startAngle(Math.PI)
            .endAngle(Math.PI*2)

          radiusMin = d3.min(candidate_a, function(d){
              return d[timeExpressed]
          })

          radiusMax = d3.max(candidate_a, function(d){
              return d[timeExpressed]
          })

          setRadius = d3.scale.sqrt()
              .domain([radiusMin, radiusMax])
              .range([0, 40]);


    var candidate1 = map.append("g");

    candidate1.selectAll("path")
        .data(candidate_a)
        .enter()
        .append("path")
        .on("mouseover", function(d){
            highlightSplitsL(d);
        })
        .on("mouseout", function(d){
            dehighlightSplitsL(d);
        })
        .attr("fill", "purple")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "white")
        .attr("stroke-width", "0.7")
        .attr("class", "leftsplit")

        .attr("class", function(d){
            y = timeExpressed
            return "leftsplit " + d.y + d.state
        })
        .attr("id", attributeNames)
        //length of line
        .attr("transform", function(d){
            return "translate(" + projection([d.Lon, d.Lat])[0] + "," + projection([d.Lon, d.Lat])[1]+")";
        })
        .attr("d", arc);
};

//functin to create dropdown 1 for candidates
function createDropdownLeft(us,projection){

    var dropdown = d3.select("#sideColumn")
        .append("select")
        .attr("class", "dropdownLeft")
        .attr("disabled", "true")
        .on("change", function(){
            d3.selectAll(".leftsplit").remove();
            candidateleftname = this.value;
            createLeftSplit(this.value,us,projection)
        });

    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .text("Select a Candidate or Party");

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attributeNames)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });

};

function createRightSplit(caname,us,projection){
  var removeCircles = d3.selectAll(".circles").remove();
  var removeright = d3.selectAll(".rightsplit").remove();
var candidate_b;

        for (var i=0; i<attributeNames.length; i++){
          if(attributeNames[i] == caname)
            {candidate_b = csvArray[i];}
        };


 var arc2 = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(function(d){
            return setRadius(d[timeExpressed]);
        })
        .startAngle(0)
        .endAngle(Math.PI)

      radiusMin = d3.min(candidate_b, function(d){
        return d[timeExpressed]
      })

      radiusMax = d3.max(candidate_b, function(d){
        return d[timeExpressed]
      })

setRadius = d3.scale.sqrt()
              .domain([radiusMin, radiusMax])
              .range([0, 40]);


    var candidate2 = map.append("g");

    candidate2.selectAll("path")
        .data(candidate_b)
        .enter()
        .append("path")
        .on("mouseover", function(d){
            highlightSplitsR(d);
        })
        .on("mouseout", function(d){
            dehighlightSplitsR(d);
        })
        .attr("fill", "#FFA30D")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "white")
        .attr("stroke-width", 0.7)
        .attr("class", "rightsplit")

        .attr("class", function(d){
            y = timeExpressed
            return "rightsplit " + d.y + d.state
        })
        .attr("id", attributeNames)
        //length of line
        .attr("transform", function(d){
            return "translate(" + projection([d.Lon, d.Lat])[0] + "," + projection([d.Lon, d.Lat])[1]+")";
        })
        .attr("d", arc2)
};

//functin to create dropdown 2 for candidates
function createDropdownRight(us,projection){
    //add select element
    var dropdown = d3.select("#sideColumn")
        .append("select")
        .attr("class", "dropdownRight")
        .attr("disabled", "true")
        .on("change", function(){
            d3.selectAll(".rightsplit").remove();
            candidaterightname = this.value;
            createRightSplit(this.value,us,projection)
        });

    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        //.attr("disabled", "true")
        .text("Select a Candidate or Party");

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attributeNames)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
};

function CreateSplitLegend(){    var legend = d3.selectAll("#sideColumn").append("svg")
        .attr("width", 250)
        .attr("height", 200)
        .attr("class", "legendInfo")


    var legendDetails = legend.append("circle")
        .attr("r", 40.38)
          .attr("cx", 76)
        .attr("cy", 155)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5")

    var legendDetails2 = legend.append("circle")
        .attr("r", 20.43)
        .attr("cx", 76)
        .attr("cy", 175)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5")

  legend.append("text")
      .text("$57,000,000")
      .attr("x", 120)
      .attr("y", 135)
//adding text to legend
  legend.append("text")
      .text("$7,000,000")
      .attr("x", 120)
      .attr("y", 165)

};


function CreateTotalLegend(){
    var legend = d3.selectAll("#sideColumn").append("svg")
        .attr("width", 226)
        .attr("height", 300)
        .attr("class", "legendTotal")


    var legendDetails = legend.append("circle")
        .attr("r", 72.12)
        .attr("cx", 76)
        .attr("cy", 220)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5")

    var legendDetails2 = legend.append("circle")
        .attr("r", 33.52)
        .attr("cx", 76)
        .attr("cy", 255)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5")

  legend.append("text")
      .text("$70,000,000")
      .attr("x", 140)
      .attr("y", 160)
//adding text to legend
  legend.append("text")
      .text("$50,000,000")
      .attr("x", 150)
      .attr("y", 215)

};


function CreatePerCapitaLegend(){
    var legend = d3.selectAll("#sideColumn").append("svg")
        .attr("width", 250)
        .attr("height", 300)
        .attr("class", "legendPer")


    var legendDetails = legend.append("circle")
        .attr("r", 74.22)
        .attr("cx", 76)
        .attr("cy", 220)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5")

    var legendDetails2 = legend.append("circle")
        .attr("r", 39.11)
        .attr("cx", 76)
        .attr("cy", 255)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5")

  legend.append("text")
      .text("$13.00")
      .attr("x", 160)
      .attr("y", 170)

//adding text to legend
  legend.append("text")
      .text("$4.00")
      .attr("x", 160)
      .attr("y", 250)

};

function highlightCircles(data) {
    var selected = d3.selectAll("." + data.state_total + data.state)
        .style( {
            "stroke": "#000",
            "stroke-width": "0.7",
            "fill-opacity": "1"
        });
    setLabelCircles(data);
};

function dehighlightCircles (data) {
    var selected = d3.selectAll("." + data.state_total + data.state)
      .style({
        "stroke": function (){
          return getStyle(this, "stroke")
        },
        "stroke-width": function(){
            return getStyle(this, "stroke-width")
        },
        "fill-opacity": function(){
            return getStyle(this, "fill-opacity")
        }
    });

    function getStyle (element, styleName) {
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };

    d3.select(".infolabel")
        .remove();
};

function highlightSplitsL(data) {
    y = timeExpressed
    map.selectAll("." + data.y + data.state)
        .style( {
            "stroke": "#666",
            "stroke-width": "0.7",
            "fill-opacity": "1"
        });
    setLabelSplitsL(data)
};

function dehighlightSplitsL (data) {
    y = timeExpressed
    map.selectAll("." + data.y + data.state)
    .style( {
        "stroke": "white",
        "stroke-width": "0.5",
        "fill-opacity": "0.7"
    });
    d3.select(".infolabel")
        .remove();
};

function highlightSplitsR(data) {
    y = timeExpressed
    map.selectAll("." + data.y + data.state)
        .style( {
            "stroke": "#666",
            "stroke-width": "0.7",
            "fill-opacity": "1"
        });
    setLabelSplitsR(data)
};

function dehighlightSplitsR(data) {
    y = timeExpressed
    map.selectAll("." + data.y + data.state)
    .style( {
        "stroke": "white",
        "stroke-width": "0.5",
        "fill-opacity": "0.7"
    });
    d3.select(".infolabel")
        .remove();
};

function setLabelCircles(data){
    //label content
    var labelAttribute = "<h3>" + data.name +
        "</h3><br><p><b>Total amount given by citizens*:</b> $" + format(d3.round(data.Total, 0)) + "</p><p><b>Per capita amount:</b> $" + format(d3.round(data.PerCapita, 2)) + "</p>";

    //create info label div
    var infolabel = d3.select("#infoPanel")
        .append("text")
        .attr({
            "class": "infolabel",
            "id": data.state + "_label"
        })
        .html(labelAttribute);
};
function setLabelSplitsL(data){
    //label content
    var labelAttribute = "<h3>" + data.name +
        "</h3><br><p><b>Monthly total for " + candidateleftname + ":</b> $" + format(d3.round(data.state_total, 0)) + "</p>";

    //create info label div
    var infolabel = d3.select("#infoPanel")
        .append("text")
        .attr({
            "class": "infolabel",
            "id": data.state + "_label"
        })
        .html(labelAttribute);
};

function setLabelSplitsR(data){
    //label content
    var labelAttribute = "<h3>" + data.name +
        "</h3><br><p><b>Monthly total for " + candidaterightname + ":</b> $" + format(d3.round(data.state_total, 0)) + "</p>";

    //create info label div
    var infolabel = d3.select("#infoPanel")
        .append("text")
        .attr({
            "class": "infolabel",
            "id": data.state + "_label"
        })
        .html(labelAttribute);
};

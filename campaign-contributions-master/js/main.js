var attrArray = ["Total", "Per Capita"];
var expressed = attrArray[0];
var attrArray2 = ["March_15", "April_15","May_15", "June_15",  "July_15","August_15","September_15","October_15","November_15","December_15","January_16","February_16","March_16"];
var expressed2 = attrArray2[0];
var map;
var svg;
var projection;
var setRadius;
var radioName = expressed;
var checkedArray = [];
var width = window.innerWidth * 0.645,
    height = 650;
var attributeNames = [];
var csvArray = [];

window.onload = setMap();
// set the width and height of the map
function setMap() {
  // var width = window.innerWidth * 0.645,
  //       height = 650;

    // creating the map as an svg and giving it attributes of width and height
    map = d3.select("#mapContainer")
        .append("svg")
        //.append("rect")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);
    //  var pageTitle = d3.select("#titleText")
    //     .append("text")
    //     .attr("class", "pageTitle")
    //     .html("We "+"don't".strike()+" need your money, money, money");

    // creating projection - Albers USA which puts Alaska and Hawaii, projected in their own right below the 48 contiguous states
    projection = d3.geo.albersUsa()
    // no center because it's already centered on the US as part of the projection code
        .scale(1000)
        .translate([width / 2, height / 2]); // keeps map centered in the svg container

    // creating a path generator to draw the projection
    var path = d3.geo.path()
        .projection(projection);

    // uses queue.js to parallelize asynchronous loading of the the CSV and shapefile data
    d3_queue.queue()
        .defer(d3.csv, "data/total_contributions_percandidate_perstate.csv")
        .defer(d3.csv, "data/GoodCSVs/BenCarson.csv")
        .defer(d3.csv, "data/GoodCSVs/BernieSanders.csv")
        .defer(d3.csv, "data/GoodCSVs/BobbyJindal.csv")
        .defer(d3.json, "data/US_shapefile.topojson")
        .defer(d3.csv, "data/GoodCSVs/CarlyFiorina.csv")
        .defer(d3.csv, "data/GoodCSVs/ChrisChristie.csv")
        .defer(d3.csv, "data/GoodCSVs/DonaldTrump.csv")
        .defer(d3.csv, "data/GoodCSVs/GeorgePataki.csv")
        .defer(d3.csv, "data/GoodCSVs/HillaryClinton.csv")
        .defer(d3.csv, "data/GoodCSVs/JamesWebb.csv")
        .defer(d3.csv, "data/GoodCSVs/JebBush.csv")
        .defer(d3.csv, "data/GoodCSVs/JohnKasich.csv")
        .defer(d3.csv, "data/GoodCSVs/LawrenceLessig.csv")
        .defer(d3.csv, "data/GoodCSVs/LindseyGraham.csv")
        .defer(d3.csv, "data/GoodCSVs/MarcoRubio.csv")
        .defer(d3.csv, "data/GoodCSVs/MartinOMalley.csv")
        .defer(d3.csv, "data/GoodCSVs/MikeHuckabee.csv")
        .defer(d3.csv, "data/GoodCSVs/RandPaul.csv")
        .defer(d3.csv, "data/GoodCSVs/RickPerry.csv")
        .defer(d3.csv, "data/GoodCSVs/RickSantorum.csv")
        .defer(d3.csv, "data/GoodCSVs/ScottWalker.csv")
        .defer(d3.csv, "data/GoodCSVs/TedCruz.csv")
        .await(callback); // waits til both sets of data are loaded before it sends the data to the callback function

    // callback function that takes the data as two parameters and an error parameter that will report any errors that occur
    function callback(error, total, test1, test2, test3, unitedStates) {
      total.forEach(function(d) {
        d.Lat= +d.Lat
        d.Lon= +d.Lon
        d.DonaldTrump = +d.DonaldTrump
        d.HillaryClinton = +d.HillaryClinton
      })
      test1.forEach(function(d){
        d.Lat= +d.Lat
        d.Lon= +d.Lon
        d.state_total= +d.state_total
        // d.BenCarson = +d.BenCarson
        // d.BernieSanders = +d.BernieSanders
        // d.BobbyJindal = +d.BobbyJindal
        // d.CarlyFiorina = +d.CarlyFiorina
        // d.ChrisChristie = +d.ChrisChristie
        // d.DonaldTrump = +d.DonaldTrump
        // d.GeorgePataki = +d.GeorgePataki
        // d.HillaryClinton = +d.HillaryClinton
        // d.JamesWebb = +d.JamesWebb
        // d.JebBush = +d.JebBush
        // d.JohnKasich = +d.JohnKasich
        // d.LawrenceLessig= +d.LawrenceLessig
        // d.LindseyGraham = +d.LindseyGraham
        // d.MarcoRubio = +d.MarcoRubio
        // d.MartinOMalley = +d.MartinOMalley
        // d.MikeHuckabee = +d.MikeHuckabee
        // d.RandPaul = +d.RandPaul
        // d.RickPerry = +d.RickPerry
        // d.RickSantorum = +d.RickSantorum
        // d.ScottWalker= +d.ScottWalker
        // d.TedCruz = +d.TedCruz
      });

      test2.forEach(function(d){
        d.Lat= +d.Lat
        d.Lon= +d.Lon
        d.state_total= +d.state_total
      });

      test3.forEach(function(d){
        d.Lat= +d.Lat
        d.Lon= +d.Lon
        d.state_total= +d.state_total

      });
        // translate the topojson to GeoJSON within the DOM
        var us = topojson.feature(unitedStates, unitedStates.objects.US_shapefile).features; // pulls the array of features from the shapefile data and passes it to .data()
        //console.log(us);
        csvArray = [total, test1, test2, test3];
        //console.log(csvArray[0]);
        attributeNames = ["total", "Ben Carson", "Bernie Sanders", "Bobby Jindal"];
           for (i in csvArray){
            joinData(us, csvArray[i], attributeNames[i]);

        };



         setEnumerationUnits(us, map, path);
         setCircles (path,map,total,projection);

         createradio(total,path,map,test1,test2,test3,projection,total,us);

         createcheckbox1(path,map,total, us, projection);
          createcheckbox2(total, us, projection);


    };
};

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
                attrArray2.forEach(function(attr){
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
            .attr("class", function(d) {
                return "states " + d.properties.state; // unique class name in the shapefile properties; in this case names of the states
            })
            .attr("d", path);
};

function setCircles (path,map,data,projection){

         var circles = map.selectAll(".circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d){

            return "circles " + d.state;
        })
        .attr("fill", "green")
        .attr('fill-opacity', 0.5)
        .attr("cx", function(d) {
            return projection([d.Lon, d.Lat])[0]; })
        .attr("cy", function(d) { return projection([d.Lon, d.Lat])[1]; });
        updateCircles(circles,data);
};

function setCircles2 (path,map,candidate1name,projection){
  removeCircles = d3.selectAll(".circles").remove();
var candidate1;
for (var i=0; i<attributeNames.length; i++){
  if(attributeNames[i] == candidate1name)
    {candidate1 = csvArray[i];}
};


         var circles = map.selectAll(".circles")
        .data(candidate1)
        .enter()
        .append("circle")
        .attr("class", function(d){

            return "circles " + d.state;
        })
        .attr("fill", "red")
        .attr('fill-opacity', 0.5)
        .attr("cx", function(d) {
            return projection([d.Lon, d.Lat])[0]; })
        .attr("cy", function(d) { return projection([d.Lon, d.Lat])[1]; });
        updateCircles2(circles,candidate1);
};



function updateCircles2(circles, data)
{
    var domainArray = [];
    for (var i=0; i<data.length; i++){
        var val = parseFloat(data[i][expressed2]);
        domainArray.push(val);
    };
        radiusMin = Math.min.apply(Math, domainArray);
        radiusMax = Math.max.apply(Math, domainArray);

        setRadius = d3.scale.sqrt()
            .range([5, 100])
            .domain([radiusMin, radiusMax]);
    //create a second svg element to hold the bar chart
var circleRadius= circles.attr("r", function(d){
            return setRadius(d[expressed2]);
        });

};






function createradio(data,path,map,test1,test2,test3,projection,total,us){

    var filterPhases = ["Total", "Per Capita"],
    j=0;
//console.log(projection);
    var form1 = d3.select("#sideColumn")
    .append("form")
    .attr("class", "Classification1")
  //  .text("Category 1:");
    //console.log(form1)

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
            changeAttribute(this.value, data);
            radioName = d;
            //console.log(radioName);
        })

    .property("checked", function(d, i) {return i===j;})

    labelEnter.append("label").text(function(d) {return d;});



};


function createcheckbox1(path,map,total, us, projection){

    var candidatesNames = ["Ben Carson", "Bernie Sanders","Bobby Jindal"];
    //console.log(projection);
    var form2 = d3.select("#sideColumn")
    .append("form")
    .attr("class", "Classification2");

     var labelEnter = form2.selectAll("span")
    .data(candidatesNames)
    .enter()
    .append("span");

    labelEnter.append("input")
    .attr({
        type: "checkbox",
        name: "mode",
        class:"class1",
        id:"claaa",
        value: function(d) {return d;}
    })
    .on("click", function(d){



if(checkedArray.length == 0)
{checkedArray.push(this.value);}

else  if (checkedArray.length <= 1)
{
    if(this.checked)
        {
            for(var i = checkedArray.length-1; i >= 0; i--) {
                if(checkedArray[i] == this.value) {
                    checkedArray.splice(i, 1);
                }
                else {checkedArray.push(this.value);}
            }
        }
    else
    {   for(var i = checkedArray.length-1; i >= 0; i--) {
                if(checkedArray[i] == this.value) {
                    checkedArray.splice(i, 1);
                }
            }
     }
}

else {
if (this.checked == false)
{   for(var i = checkedArray.length-1; i >= 0; i--) {
                if(checkedArray[i] == this.value) {
                    checkedArray.splice(i, 1);
                }
            }
     }

else
    {this.checked = false;
        alert("You can only select a maximum of 2 candidates to compare");}
}



    if (checkedArray.length == 2)

    { removeCircles = d3.selectAll(".circles").remove();
        createSplitSymbols(total,checkedArray[0],checkedArray[1], us,projection);
        console.log("Using "+ checkedArray[0] + " and " + checkedArray[1]+" to make split symbols showing "+ radioName);}

else if (checkedArray.length ==1)
    {setCircles2(path,map,checkedArray[0],projection);
    console.log("Using "+ checkedArray[0] +" to make symbols showing "+ radioName)}


else if (checkedArray.length ==0)
    {removeCircles = d3.selectAll(".circles").remove();
      setCircles (path,map,total,projection);

      console.log("only use" + radioName)}

        });

    labelEnter.append("label").text(function(d) {return d;});
};



function createcheckbox2(total, us, projection){

    var democratNames = ["Hillary Clinton", "Donald Trump", "Martin O'Malley"];
    //console.log(projection);
    var form3 = d3.select("#sideColumn")
    .append("form")
    .attr("class", "Classification3")
    ;

     var labelEnter = form3.selectAll("span")
    .data(democratNames)
    .enter()
    .append("span");

    labelEnter.append("input")
    .attr({
        type: "checkbox",
        name: "mode",
        class:"class1",
        id:"claaa",
        value: function(d) {return d;}
    })
    .on("click", function(d){



if(checkedArray.length == 0)
{checkedArray.push(this.value);}

else  if (checkedArray.length <= 1)
{
    if(this.checked)
        {
            for(var i = checkedArray.length-1; i >= 0; i--) {
                if(checkedArray[i] == this.value) {
                    checkedArray.splice(i, 1);
                }
                else {checkedArray.push(this.value);}
            }
        }
    else
    {   for(var i = checkedArray.length-1; i >= 0; i--) {
                if(checkedArray[i] == this.value) {
                    checkedArray.splice(i, 1);
                }
            }
     }
}

else {
if (this.checked == false)
{   for(var i = checkedArray.length-1; i >= 0; i--) {
                if(checkedArray[i] == this.value) {
                    checkedArray.splice(i, 1);
                }
            }
     }

else
    {this.checked = false;
        alert("You can only select a maximum of 2 candidates to compare");}
}



    if (checkedArray.length == 2)
    // {createSplitSymbols(total,checkedArray[0],checkedArray[1], us,projection);}

    {console.log("Using "+ checkedArray[0] + " and " + checkedArray[1]+" to make split symbols showing "+ radioName);}

else if (checkedArray.length ==1)
    // {createSplitSymbols(total,checkedArray[0],us,projection);}
  {console.log("Using "+ checkedArray[0] +" to make symbols showing "+ radioName)}

else if (checkedArray.length ==0)
    {
      setCircles (path,map,total,projection);}

        });

    labelEnter.append("label").text(function(d) {return d;});
};









function changeAttribute(attribute, data){
    //change the expressed attribute
    expressed = attribute;
    var circles = d3.selectAll(".circles");
    updateCircles(circles,data);

};

function updateCircles(circles, data)
{
    var domainArray = [];
    for (var i=0; i<data.length; i++){
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };
        radiusMin = Math.min.apply(Math, domainArray);
        radiusMax = Math.max.apply(Math, domainArray);
        //console.log(radiusMax);
        setRadius = d3.scale.sqrt()
            .range([4, 40])
            .domain([radiusMin, radiusMax]);
    //create a second svg element to hold the bar chart
var circleRadius= circles.attr("r", function(d){
            return setRadius(d[expressed]);
        });

};

function createSplitSymbols(total,candidate1name,candidate2name,us,projection){
var candidate_a;
var candidate_b;


removeCircles = d3.selectAll(".circles").remove();

for (var i=0; i<attributeNames.length; i++){
  if(attributeNames[i] == candidate1name)
    {candidate_a = csvArray[i];}
};


for (var i=0; i<attributeNames.length; i++){
  if(attributeNames[i] == candidate2name)
    {candidate_b = csvArray[i];}
};
 console.log(candidate_a.state, candidate_b);



 var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(function(d){
          //console.log(setRadius(d.BenCarson));
            return setRadius(d.state_total)
        })
        .startAngle(Math.PI)
        .endAngle(Math.PI*2)
      //console.log(totals);

      radiusMin = d3.min(candidate_a, function(d){
        return d.state_total
      })

      radiusMax = d3.max(candidate_a, function(d){
        return d.state_total
      })
      //console.log(radiusMax);
      setRadius = d3.scale.sqrt()
              .domain([radiusMin, radiusMax])
              .range([4, 40]);

    var candidate1 = map.append("g");
    candidate1.selectAll("path")
        .data(candidate_a)
        .enter().append("path")
        .style("fill", "yellow")

        //length of line
        .attr("transform", function(d){
            return "translate(" + projection([d.Lon, d.Lat])[0] + "," + projection([d.Lon, d.Lat])[1]+")";
        })
        .attr("d", arc);

    //start split symbol for second candidate
    var arc2 = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(function(d){
          //console.log(setRadius(d.HillaryClinton));
            return setRadius(d.state_total)
        })
        .startAngle(0)
        .endAngle(Math.PI)
      //console.log(totals);

      radiusMin = d3.min(candidate_b, function(d){
        return d.state_total
      })

      radiusMax = d3.max(candidate_b, function(d){
        return d.state_total
      })
      //console.log(radiusMax);
      setRadius = d3.scale.sqrt()
              .domain([radiusMin, radiusMax])
              .range([4, 40]);

    var candidate2 = map.append("g");
    candidate2.selectAll("path")
        .data(candidate_b)
        .enter().append("path")
        .style("fill", "purple")

        //length of line
        .attr("transform", function(d){
            return "translate(" + projection([d.Lon, d.Lat])[0] + "," + projection([d.Lon, d.Lat])[1]+")";
        })
        .attr("d", arc2);


};

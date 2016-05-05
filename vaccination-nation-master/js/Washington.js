/* Washington Map */


//need to create a sequence of years
//need to create radio buttons
//create a special breaks for all of the data
//make sure to add in each parameter in order

//wraps everything in a self-executing anonymous function to move to local scope
(function(){

//pseudo-global variables
//variables for data join
var DataArray = ["2004-2005",	"2005-2006", "2006-2007",	"2007-2008",	"2008-2009",	"2009-2010",	"2010-2011",	"2011-2012",	"2012-2013",	"2013-2014",	"2014-2015", "2015-2016"];
var expressed = DataArray[0];
var attributeIndex = 0

//begin script when window loads
window.onload = setMap();
var Washington_Complete_Immunizations;

//set up choropleth map
function setMap(){
    //map frame dimensions
    var width = 500,
        height = 350;

    //create new svg container for the map
    var map = d3.select("#washington-map")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create projection for Washington State
    var projection = d3.geo.albers()
        .rotate([117, 0, 2])
        .center([-5, 47.25])
        .parallels([46, 48])
        .scale(3500)
        .translate([width / 2, height / 2])

    var path = d3.geo.path()
       .projection(projection);

    //use queue.js to parallelize asynchronous data loading
    d3_queue.queue()
        .defer(d3.csv, "data/Washington/Washington_Complete_Immunizations.csv") //load attributes from csv
        // .defer(d3.csv, "data/Washington/Washington_Any_Exemption.csv") //load attributes from csv
        // .defer(d3.csv, "data/Washington/Washington_Out_Of_Compliance.csv") //load attributes from csv
        .defer(d3.json, "data/Washington/Washington.topojson") //load choropleth spatial data
        .await(callback);

    function callback(error, Washington_Complete_Immunizations, Washington){

        var Washington = topojson.feature(Washington, Washington.objects.Washington);
        Washington = Washington.features;
 

        var counties = map.selectAll(".counties")
            .data(Washington)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "Washington " + d.properties.Name;
            })
            .attr("d", path);

        //join csv data to GeoJson enumeration units
        Washington = joinData(Washington, Washington_Complete_Immunizations);

        //create the color scale
        var colorScale = makeColorScale(Washington_Complete_Immunizations);

        //add enumeration units to the map
        setEnumerationUnits(Washington, map, path, colorScale);

//        createDropdown(Washington_Complete_Immunizations);

        createSequenceControls()
    };
};

function joinData(Washington, Washington_Complete_Immunizations){
    //variables for data join
    var DataArray = ["2004-2005",	"2005-2006", "2006-2007",	"2007-2008",	"2008-2009",	"2009-2010",	"2010-2011",	"2011-2012",	"2012-2013",	"2013-2014",	"2014-2015", "2015-2016"];

    //loop through csv to assign each set of csv attribute values to geojson counties
    for (var i=0; i<Washington_Complete_Immunizations.length; i++){
      var csvCounty = Washington_Complete_Immunizations[i]; //the current county
      var csvKey = csvCounty.Name; //the CSV primary key

      //loop through geojson regions to find correct counties
      for (var a=0; a<Washington.length; a++){

          var geojsonProps = Washington[a].properties; //the current region geojson properties
          var geojsonKey = geojsonProps.Name; //the geojson primary key

          //where primary keys match, transfer csv data to geojson properties object
          if (geojsonKey == csvKey){
              //assign all attributes and values
              DataArray.forEach(function(attr){
                  var val = parseFloat(csvCounty[attr]); //get csv attribute value
                  geojsonProps[attr] = val; //assign attribute and value to geojson properties
              });
          };
      };
    };
    return Washington;
};

function setEnumerationUnits(Washington, map, path, colorScale){
  //add Washington Counties to map
  var counties = map.selectAll(".counties")
      .data(Washington)
      .enter()
      .append("path")
      .attr("class", function(d){
          return "Washington " + d.properties.Name;
      })
      .attr("d", path)
      .style("fill", function(d) {
          return choropleth(d.properties, colorScale);
      })
      .on("mouseover", function(d){
            highlight(d.properties);
      })
      .on("mouseout", function(d){
            dehighlight(d.properties);
      })
      .on("mousemove", moveLabel);


      var desc = counties.append("desc")
       .text('{"stroke": "#000", "stroke-width": "0.5px"}');
};

//function to create color scale generator
function makeColorScale(data){

    //create color scale generator
    var colorScale = d3.scale.threshold()
        .domain([.75,.85,.95])
        .range(['#d7191c','#fdae61','#abd9e9','#2c7bb6']);

    return colorScale;
};

//function to create a dropdown menu for attribute selection
function createDropdown(Washington_Complete_Immunizations){
    //add select element
    var dropdown = d3.select("#washington-map")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){
            changeAttribute(this.value, Washington_Complete_Immunizations)
        });

    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select Attribute");

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(DataArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
};

//dropdown change listener handler
function changeAttribute(expressed, Washington_Complete_Immunizations){

  console.log("changeAttribute")
    //recreate the color scale
    var colorScale = makeColorScale(Washington_Complete_Immunizations);

    //recolor enumeration units
    var counties = d3.selectAll(".Washington")
        .style("fill", function(d){
            return choropleth(d.properties, colorScale)
        });
};

//function to test for data value and return color
function choropleth(props, colorScale){
    //make sure attribute value is a number
    console.log(props)
    var val = parseFloat(props[expressed]);

    console.log(val)
    //if attribute value exists, assign a color; otherwise assign gray
    if ((val) && (val != 999)){
        return colorScale(val);
    } else {
        return "#CCC";
    };
};

//function to highlight enumeration units and bars
function highlight(props){
    //change stroke
    var selected = d3.selectAll("#counties_" + props.Name)
        .style({
            "stroke": "black",
            "stroke-width": "2"
        });
    setLabel(props);
};

//function to reset the element style on mouseout
function dehighlight(props){
    var selected = d3.selectAll("#counties_" + props.Name)
        .style({
            "stroke": function(){
                return getStyle(this, "stroke")
            },
            "stroke-width": function(){
                return getStyle(this, "stroke-width")
            }
        });

    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };
    d3.select(".infolabel")
        .remove();
};

//function to create dynamic label
function setLabel(props){
    //label content
    var labelAttribute = "<h1>" + props[expressed] +
        "</h1><b>" + expressed + "</b>";

    //create info label div
    var infolabel = d3.select("#washington-map")
        .append("div")
        .attr({
            "class": "infolabel",
            "id": props.Name + "_label"
        })
        .html(labelAttribute);

    var countyName = infolabel.append("div")
        .attr("class", "labelname")
        .html(props.Name);
};

//function to move info label with mouse
function moveLabel(){
    //get width of label
    var labelWidth = d3.select(".infolabel")
        .node()
        .getBoundingClientRect()
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10,
        y1 = d3.event.clientY + 1000,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY - 5;

    //horizontal label coordinate, testing for overflow
    var x = d3.event.clientX > window.innerWidth - labelWidth - 5 ? x2 : x1;
    //vertical label coordinate, testing for overflow
    var y = d3.event.clientY < 5 ? y2 : y1;

    d3.select(".infolabel")
        .style({
            "left": x + "px",
            "top": y + "px"
        });
};


function createSequenceControls(){

      var yearLabel = d3.select("#yearLabel")
        .text(expressed)

        $("#stepForward").on("click", function(){
            attributeIndex +=1
              if(attributeIndex > DataArray.length){
                attributeIndex = 0
              }

            expressed = DataArray[attributeIndex]

            d3.select("#yearLabel")
              .text(expressed)

            changeAttribute(expressed, Washington_Complete_Immunizations)
        })

        $("#stepBackward").on("click", function(){
            attributeIndex -=1

            console.log(attributeIndex)
              if(attributeIndex < 0){
                attributeIndex = DataArray.length-1
              }

              expressed = DataArray[attributeIndex]

              d3.select("#yearLabel")
                .text(expressed)

              changeAttribute(expressed, Washington_Complete_Immunizations)
        })
}

})();

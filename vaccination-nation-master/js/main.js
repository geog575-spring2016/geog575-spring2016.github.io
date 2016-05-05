//$('#mainMap').insertBefore('#new-york-map');

(function(){

  var DataArray = ["cases1993","cases1994","cases1995","cases1996","cases1997","cases1998","cases1999","cases2000","cases2001",
    "cases2002","cases2003","cases2004","cases2005","cases2006","cases2007","cases2008","cases2009","cases2010","cases2011",
    "cases2012","cases2013"];

  var expressed =DataArray[0];

  var mainTitle =["Pertussis Cases","Mumps Cases","Measles Cases"];



  var radius = d3.scale.sqrt()
      .domain([0, 7195])
      .range([0,150]);


  //begins script when window loads
  window.onload = setMap();

  function setMap(){

  	//map frame size. Adjusted so Map is responsive
    var width = 800;
        height = 500;

    //creates new svg container for the Main US Map
    var mapMain = d3.select("#mainMap")
      .append("svg")
      .attr("class", "mapMain")
      .attr("width", width)
      .attr("height", height);

    //Albers US map to fit Hawaii and Alaska below continental US
    var projection = d3.geo.albersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);

    //draws the spatial data as a path of stings of 'd' attributes
    var path = d3.geo.path()
      .projection(projection);

    var q = d3_queue.queue();
      q.defer(d3.csv, "data/main-outbreaks/main-outbreaks-data-noNYC.csv") //loads attributes from csv
      q.defer(d3.json, "data/main-outbreaks/usStates.topojson")
      q.defer(d3.json, "data/main-outbreaks/outbreaks-us.topojson")
       //loads choropleth spatial data
      .await(callback);


  function callback(error, csvData, us, usCenters){
    var usStates = topojson.feature(us, us.objects.usStates).features;
    for (var i=0; i<csvData.length; i++){
        var csvRegion = csvData[i];
        var csvKey = csvRegion.postal;
        var jsonStates=us.objects.usStates.geometries;
          for (var a=0; a<jsonStates.length; a++){
            if(jsonStates[a].properties.postal==csvKey){
              for(key in DataArray){
                var attribute=DataArray[key];
                var value=parseFloat(csvRegion[attribute]);
                (jsonStates[a].properties[attribute])=value;
              }
            }
          }
        }

        setEnumerationUnits(usStates, usCenters, mapMain, path);
        setPropSymbols(usStates, usCenters, mapMain, path);

    }
};


  //writes a function to join the data from the csv and geojson

  //         var geojsonProps = usStates[a].properties;
  //         var geojsonKey = geojsonProps.postal;
  //           if (geojsonKey == csvKey){
  //             DataArray.forEach(function(attr){
  //               var val = parseFloat(csvRegion[attr]);
  //               geojsonProps[attr] = val;
  //             });
  //           };
  //       };
  //   };
  //   //return usStates;
  // };

  function setEnumerationUnits(usStates, usCenters, mapMain, path){
    var states = mapMain.selectAll(".states")
      .data(usStates)
      .enter()
      .append("path")
      .attr("d",path)
      .attr("class", function(d){
        return "states " + d.properties.postal;
      })
      .style("fill","white")
      .style("stroke","grey");
   };

  function setPropSymbols(usStates, usCenters, mapMain, path){

    var centroids=mapMain.selectAll(".symbol")
      .data(usCenters.features.sort(function(a,b){return b.properties[expressed]-a.properties[expressed];}))
      .enter().append("path")
      .attr("d",path)
      .attr("class",function(d){
          return "circle "+d.properties.disease + " " + d.properties.postal+d.properties.disease;
      })
      .attr("d",path.pointRadius(function(d){return radius(d.properties[expressed]);}))
      .style({'fill':'orange',
              'stroke':'black',
              'fill-opacity':.4})
      .on("mouseover", function(d){
      highlight(d.properties);
      })
      .on("mouseout", function(d){
      dehighlight(d.properties);
      })
      .on("mousemove", moveLabel);

    var desc = centroids.append("desc")
      .text('{"stroke": "#000", "stroke-width": "0.5px"}');
  };
          

        //TRYING TO FIGURE OUT HOW TO CHANGE BASED ON PATH, ONLY COLORS CIRCLES BLUE RIGH NOW

          //function(d){return assignColor(d.properties)})

        // function assignColor(centroids,mapMain){
        //     var centroids=mapMain.selectAll(".symbol")
        //         .data(usCenters.features.sort(function(a,b){return b.properties[expressed]-a.properties[expressed];}))
        //         .enter().append("path")
        //           .attr("d",path)
        //           .attr("class",function(d){
        //             return "circle "+d.properties.disease;
        //           })
        //
        //     if("class","circle Mumps"){
        //         centroids.style('fill','blue')
        //
        //     }
        //     else if("class","cirlce Pertussis"){
        //         centroids.style('fill','yellow')
        //     }
        //     else if("class","circle Measles"){
        //         centroids.style('fill','orange')
        //
        //     }
        //
        //   }

            //
            // .style({"fill": "orange",
            //       "fill-opacity":0.5,
            //       "stroke":"black"})

        //function(d){
        //return choropleth(d.properties, colorScale);
      //});

      // console.log(states);
      //
      // var desc=states.append("desc")
      //        .text('{"stroke":"white", "stroke-width":"1px"}');
      //
      //

  //TRYING TO GET SYMBOLS TO HIGHLIGHT AND DEHIGHLIGHT FOR IDENTIFICATION
  function highlight(properties){
    var selected = d3.selectAll("." + properties.postal+properties.disease)
      .style({
        "stroke": "black",
        "stroke-width": "2"
    });
    setLabel(properties);
  };

  function dehighlight(properties){
    var selected = d3.selectAll("." + properties.postal+properties.disease)
      .style({
       "stroke": "black",
       "stroke-width": "1"
      });
    d3.select(".infolabelMain")
      .remove();
  };

  function setLabel(properties){
    var labelAttributeMain = "<h4><b>"+ properties.state+ "</b>" +"</h4>"+ expressed;
    var infolabelMain = d3.select("body")
      .append("div")
      .attr({
        "class": "infolabelMain",
        "id": properties.disease+ "_label"
      })
      .html(labelAttributeMain);
    var propNameMain = infolabelMain.append("div")
      .attr("class", "labelnameMain")
      .html(properties.state);
  };

  function moveLabel(){
    var labelWidthMain = d3.select(".infolabelMain")
      .node()
      .getBoundingClientRect()
      .width;
    var x1 = d3.event.clientX + 10,
      y1 = d3.event.clientY -2000,
      x2 = d3.event.clientX - labelWidthMain - 10,
      y2 = d3.event.clientY -100;

    var x = d3.event.clientX > window.innerWidth - labelWidthMain - 5 ? x2 : x1;
    var y = d3.event.clientY < 5 ? y2 : y1;

    d3.select(".infolabelMain")
      .style({
          "left": x + "px",
          "top": y + "px"
      });
  };


})();










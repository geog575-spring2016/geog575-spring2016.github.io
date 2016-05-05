(function(){

keyArray=["coverage1314","pbe1314","coverage1516","pbe1516"]
var expressed=keyArray[0]

keyArray2=["measles10","measles11","measles12","measles13","measles14"]
var expressed2=keyArray2[0];

var labelTitles={
    coverage1314:['Vaccination Coverage Rate 2013-2014'],
    pbe1314:['Personal Belief Exemption Rate 2013-2014'],
    coverage1516:['Vaccination Coverage Rate 2015-2016'],
    pbe1516:['Personal Belief Exemption Rate 2015-2016'],
}

var labelTitles2={
    measles10:['Measles Outbreaks in 2010'],
    measles11:['Measles Outbreaks in 2011'],
    measles12:['Measles Outbreaks in 2012'],
    measles13:['Measles Outbreaks in 2013'],
    measles14:['Measles Outbreaks in 2014']
}

var colorScaleVC=d3.scale.threshold()
    .domain([80,90,95])
    .range(['#d7191c','#fdae61','#abd9e9','#2c7bb6']);

var colorScalepb13=d3.scale.threshold()
    .domain([2.82, 5.63, 13.45])
    .range(['#2c7bb6','#abd9e9','#fdae61','#d7191c']);

var colorScalepb14=d3.scale.threshold()
    .domain([2.22,4.44,11.92])
    .range(['#2c7bb6','#abd9e9','#fdae61','#d7191c']);

var width = 1200,
  height = 500,
  formatPercent = d3.format(".0%"),
  formatNumber = d3.format(".0f");

// var chartWidth = 420,
//     chartHeight = 397.5,
//     leftPadding=29,//more room for scale
//     rightPadding=20,
//     topBottomPadding=20,
//     chartInnerWidth=chartWidth - leftPadding - rightPadding,
//     chartInnerHeight=chartHeight-(topBottomPadding*2),//make chartInnerHeight contined within padding
//     translate="translate(" + leftPadding + "," + topBottomPadding + ")";

var radius = d3.scale.sqrt()
    .domain([0, 20])
    .range([0,80]);


// var startYear=2011,
//     currenYear=startYear;

var tooltip = d3.select("#california-map").append("div")
    .attr("class", "CAtoolTip");
	// .style({"position": "absolute",
  //         "color":"white",
  //         "margin":"5px",
  //         "visibility":"hidden",
  //         "background-color":"black",
  //         "padding":"5px"})

window.onload=setMap();

function setMap(){

    var width= 520,
        height=500;

    var map=d3.select("#california-map")
        .append("svg")
        .attr("class","CAmap")
        .attr("width", width)
        .attr("height",height);

    var  projection = d3.geo.mercator()
			.scale(1120 * 2)
			.center([-119, 37.4])
			.translate([width/2, height/2]);

    var path=d3.geo.path()
        .projection(projection);

    var q=d3_queue.queue();
        q.defer(d3.csv, "data/CaliforniaData/cali_coverage.csv")//csv data
        q.defer(d3.csv, "data/CaliforniaData/cali_measles.csv") //do I load two diff sets for two diff data
        q.defer(d3.json, "data/CaliforniaData/Californ2.topojson")
        q.defer(d3.json, "data/CaliforniaData/californiapropsymbol.topojson")//spatial data
        q.await(callback);

    function callback(error, dataCoverage, dataMeasles, california, californiacenters){
        var caliCounties=topojson.feature(california, california.objects.Californ).features;
        for (var i=0; i<dataMeasles.length; i++){
          var csvCounty=dataMeasles[i];
          var csvCountyCode=csvCounty.adm;
          var jsonCounties=california.objects.Californ.geometries;
          for (var j=0; j<jsonCounties.length;j++){
              if(jsonCounties[j].properties.adm==csvCountyCode){
              for(var key in keyArray2){
                var attribute=keyArray2[key];
                var value=parseFloat(csvCounty[attribute]);
                (jsonCounties[j].properties[attribute])=value;
              }
            }
          }
        };

        for (var i=0; i<dataCoverage.length; i++){
          var csvCounty=dataCoverage[i];
          var csvCountyCode=csvCounty.adm;
          var jsonCounties=california.objects.Californ.geometries;
          for (var j=0; j<jsonCounties.length;j++){
              if(jsonCounties[j].properties.adm==csvCountyCode){
              for(var key in keyArray){
                var attribute=keyArray[key];
                var value=parseFloat(csvCounty[attribute]);
                (jsonCounties[j].properties[attribute])=value;
              }
            }
          }
        }
        //var colorScale=makeColorScale(dataCoverage);
        setEnumerationUnits(caliCounties, californiacenters, map, path);
        selectLayer(caliCounties, californiacenters, map, path);
        //setSliderBar(caliCounties,map,path);
        //addLegend(path);

        //setChart(dataCoverage, caliCounties, colorScale);
    }
};

function setEnumerationUnits(caliCounties, californiacenters, map, path){
    //add countries to map
    var counties=map.selectAll(".counties")
        .data(caliCounties)
        .enter()
        .append("path")
        .attr("d",path)
        .attr("class", function(d){

            return "counties "+d.properties.adm;
        })
        .style({"fill":"#f2f2f1",
                "stroke": "#b1babb",
                "stroke-width":1})
            //function(d){return choropleth(d.properties,colorScale);})
      //  .on("mousemove", moveLabel)
        //on mouseover implement highight
      //   .on("mouseover",function(d){
      //       highlight(d.properties)
      //  })
      // //on mouseout, implement dehighlight
      //   .on("mouseout", function(d){
      //     dehighlight(d.properties);
      // });

    var desc=counties.append("desc")
             .text('{"stroke":"#aab4b5", "stroke-width":"1px"}');


    // var centroids=map.selectAll(".symbol")
    //     .data(californiacenters.features.sort(function(a,b){return b.properties[expressed]-a.properties[expressed];}))
    //   .enter().append("path")
    //     .attr("d",path)
    //     .attr("class",function(d){
    //         return "circle"+d.properties.postal;
    //     })
    //     .attr("d",path.pointRadius(function(d){return radius(d.properties[expressed]);}))
    //     .style({"fill": "orange",
    //             "fill-opacity":0.5,
    //             "stroke":"black"})
    //   .remove();
};

function addLegend(path){

// var svg = d3.select("svg");
//
// svg.append("g")
//   .attr("class", "legendLinear")
//   .attr("transform", "translate(20,20)");
//
// var legendLinear = d3.legend.color()
//   .shapeWidth(30)
//   .orient('horizontal')
//   .scale(colorScaleVC);
//
// svg.select(".legendLinear")
//   .call(legendLinear);
  var x=d3.scale.linear()
        .domain([0,1])
        .range([0, 1]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(20)
    .tickValues(colorScaleVC.domain())
    .tickFormat(function(d) { return d === .5 ? formatPercent(d) : formatNumber(100 * d); });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(" + (width - 240) / 2 + "," + height / 2 + ")");

g.selectAll("rect")
    .data(colorScaleVC.range().map(function(color) {
      var d = colorScaleVC.invertExtent(color);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .style("fill", function(d) { return colorScaleVC(d[0]); });

g.call(xAxis).append("text")
    .attr("class", "caption")
    .attr("y", -6)
    .text("Legend");

};

  // var legend = d3.select('#legend')
  //   .append('ul')
  //     .attr('class', 'list-inline');
  //
  // var keys = legend.selectAll('li.key')
  //     .data(colorScaleVC.range());
  //
  // keys.enter().append('li')
  //     .attr('class', 'key')
  //     .style('border-top-color', String)
  //     .text(function(d) {
  //         var r = colorScaleVC.invertExtent(d);
  //         return formats.percent(r[0]);
  //     });
//}

// function setSliderBar(caliCounties,map,path){
//
//   d3.select('#caSlider').call(d3.slider().axis(true).min(2011).max(2014).step(1));
//   //var minDate=moment('2010',"YYYY").unix();
//   //var maxDate=moment('2014',"YYYY").unix();
//   // var silder=d3.select('#caSlider').call(d3.slider()
//   //   .axis(true).min(minDate).max(maxDate).step(25)
//   //   .on("slide", function(evt,value){
//   //       var newData=_(site_data).filter( function(site){
//   //         return site.created_at<value;
//   //       });
//   //       displaySites(newData);
//   //   }));
// };


function highlight(props){
  var selected=d3.selectAll("."+props.adm)
      .style({
          "stroke":"#3e3e3e",
          "stroke-width":"3"
      })
  // var selectedCircles=d3.selectAll(".".props.geo_id)
  //     .style({"stroke":"#3e3e3e",
  //     "stroke-width":"3"})
    // setLabel(props);
};

function highlightCircles(properties){
  var selected=d3.selectAll("."+properties.county+properties.geo_id)
      .style({
          "stroke":"#3e3e3e",
          "stroke-width":"3"
      })
      console.log(selected);
};

function dehighlightCircles(properties){
  var selected=d3.selectAll("."+properties.county+properties.geo_id)
      .style({
        "stroke":"black",
        "stroke-width":"1"
      });

}



function dehighlight(props){
   var selected=d3.selectAll("."+props.adm)
       .style({
         "stroke":"white",
        //  function(){
        //       return getStyle(this, "stroke")
        // },
         "stroke-width":function(){
              return getStyle(this, "stroke-width")
         }
      });
  //used to determine previous style so when you mouseoff and dehighlight, it returns to that previous style
  function getStyle(element, styleName){
    var styleText=d3.select(element)
        .select("desc")
        .text();

    var styleObject=JSON.parse(styleText);
    return styleObject[styleName];
  };
};


function selectLayer(caliCounties, californiacenters, map, path){
  d3.selectAll('.radio').on('change', function(){

       if (document.getElementById('none').checked) {

              map.selectAll('.circle').remove();
              d3.selectAll('.counties').transition().duration(200)
                    .style({'fill':'#f2f2f1',
                            'stroke':'#aab4b5',
                            'stroke-width': "1px"});
              var singleCounties=map.selectAll(".counties").data(caliCounties)
                        .on('mouseover', function(){ tooltip.style("visibility", "hidden")})
                        .on('mouseout', function(){return tooltip.style("visibility", "hidden");})

      }
       else if (document.getElementById('vc13').checked) {
                map.selectAll('.circle').remove();

                var counites=d3.selectAll('.counties').transition().duration(200)
                    .style('fill', function(d){return colorScaleVC(d.properties.coverage1314)})
                    .style('stroke','white')

                var singleCounties=map.selectAll(".counties").data(caliCounties)
                    .on('mouseover', function(d){
                      tooltip.style("visibility", "visible").html("<l1>"+labelTitles.coverage1314+":   "+"<b>"+d.properties.coverage1314+"%"+"</b><div>"+"County: "+"<b>"+d.properties.NAME+"</b></div></l1>")
                      highlight(d.properties)
                    })
                  	.on('mousemove', function(){tooltip.style("top", (event.pageY-40)+"px").style("left",(event.pageX+40)+"px");})
                  	.on('mouseout', function(d){
                        tooltip.style("visibility", "hidden");
                        dehighlight(d.properties)
                    })

      }


       else if (document.getElementById('pb13').checked) {

                  map.selectAll('.circle').remove();
                  d3.selectAll('.counties').transition().duration(200)
                    .style('fill', function(d){return colorScalepb13(d.properties.pbe1314)})
                    .style('stroke','white')
                  var singleCounties=map.selectAll(".counties").data(caliCounties)
                            .on('mouseover', function(d){
                                tooltip.style("visibility", "visible").html("<l1>"+labelTitles.pbe1314+":   "+"<b>"+d.properties.pbe1314+"%"+"</b><div>"+"County: "+"<b>"+d.properties.NAME+"</b></div></l1>");
                                highlight(d.properties)
                            })
                          	.on('mousemove', function(){return tooltip.style("top", (event.pageY-40)+"px").style("left",(event.pageX+40)+"px");})
                          	.on('mouseout', function(d){
                                tooltip.style("visibility", "hidden");
                                dehighlight(d.properties)
                            });
      }

       else if (document.getElementById('vc15').checked) {
                  map.selectAll('.circle').remove();
                  d3.selectAll('.counties').transition().duration(200)
                    .style('fill', function(d){return colorScaleVC(d.properties.coverage1516)})
                    .style('stroke','white');
                  var singleCounties=map.selectAll(".counties").data(caliCounties)
                            .on('mouseover', function(d){
                                tooltip.style("visibility", "visible").html("<l1>"+labelTitles.coverage1516+":   "+"<b>"+d.properties.coverage1516+"%"+"</b><div>"+"County: "+"<b>"+d.properties.NAME+"</b></div></l1>");
                                highlight(d.properties)
                            })
                            .on('mousemove', function(){return tooltip.style("top", (event.pageY-40)+"px").style("left",(event.pageX+40)+"px");})
                            .on('mouseout', function(d){
                                tooltip.style("visibility", "hidden");
                                dehighlight(d.properties)
                            });
      }

       else if (document.getElementById('pb15').checked) {
                  map.selectAll('.circle').remove();
                  d3.selectAll('.counties').transition().duration(200)
                    .style('fill', function(d){return colorScalepb14(d.properties.pbe1516)})
                    .style('stroke','white');
                  var singleCounties=map.selectAll(".counties").data(caliCounties)
                            .on('mouseover', function(d){
                               tooltip.style("visibility", "visible").html("<l1>"+labelTitles.pbe1516+":   "+"<b>"+d.properties.pbe1516+"%"+"</b><div>"+"County: "+"<b>"+d.properties.NAME+"</b></div></l1>");
                               highlight(d.properties)
                            })
                            .on('mousemove', function(){return tooltip.style("top", (event.pageY-40)+"px").style("left",(event.pageX+40)+"px");})
                            .on('mouseout', function(d){
                                tooltip.style("visibility", "hidden");
                                dehighlight(d.properties)
                            });

      }

      else if(document.getElementById('propsymbs').checked) {

        d3.selectAll('.counties').transition().duration(200)
          .style({'fill': "#f2f2f1","stroke":"#aab4b5","stroke-width":1})

        var singleCounties=map.selectAll(".counties").data(caliCounties)
                  .on('mouseover', function(d){return tooltip.style("visibility", "hidden")})
                  .on('mouseout', function(){return tooltip.style("visibility", "hidden");});
        var centroids=map.selectAll(".symbol")
            .data(californiacenters.features.sort(function(a,b){return b.properties[expressed2]-a.properties[expressed2];}))
          .enter().append("path")
            .attr("class", function(d){

                  return "circle "+d.properties.county +d.properties.geo_id;
            })
            .attr("d",path.pointRadius(function(d){return radius(d.properties[expressed2]);}))
            .style({"fill": "orange",
                    "fill-opacity":0.5,
                    "stroke":"black"})
          .on("mouseover", function(d){
                  tooltip.style("visibility", "visible").html("<l1>"+labelTitles2[expressed2]+":   "+"<b>"+d.properties[expressed2]+" cases"+"</b><div>"+"County: "+"<b>"+d.properties.county+"</b></div></l1>");
                  highlightCircles(d.properties)
          })
        	.on("mousemove", function(){return tooltip.style("top", (event.pageY-50)+"px").style("left",(event.pageX+50)+"px");})
        	.on("mouseout", function(d){
                tooltip.style("visibility", "hidden");
                dehighlightCircles(d.properties)
            });

      }
  });
}

})();

// function setLabel(props){
//
//   var labelAttribute="<h1>"+labelTitles[expressed]+"<b>"+":   "+props[expressed]+"</b></h><h2>";
//   var infoLabel=d3.select("body")
//         .append("div")
//         .attr({
//             "class": "infoLabel",
//             "id":"."+props.adm
//         })
//         .html(labelAttribute);
//
//     var countyName=infoLabel.append("body")
//         .attr("class","labelname")
//         .html(props.county);
//
//
// };
//
// //to move label
// function moveLabel(){
// //get label dimensions to determining positioning when mousing over
//  var labelWidth=d3.select(".infoLabel")
//     .node()
//     .getBoundingClientRect()
//     .width;
// //give to possible positions depending on position of mouse, distance to border
// var x1=d3.event.clientX,
//     y1=d3.event.clientY-75,
//     x2=d3.event.clientX-labelWidth,
//     y2=d3.event.clientY+25;
//
//     var x = d3.event.clientX > window.innerWidth - labelWidth - 10 ? x2 : x1;
//     //vertical label coordinate, testing for overflow
//     var y = d3.event.clientY < 75 ? y2 : y1;
//   d3.select(".infoLabel")
//       .style({
//         "left":x+"px",
//         "top": y + "px"
//       });
// };


// function changeAttributes(attribute, attribute2, dataMeasles, dataCoverage){
//   expressed=attribute;
//   expressed2=attribute2;
//   var labelAttribute="<h1>"+labelTitles[expressed]+"<b>"+":   "+props[expressed]+"</b></h><h2>";
//   var infoLabel=d3.select("body")
//         .append("div")
//         .attr({
//             "class": "infoLabel",
//             "id":"."+props.adm
//         })
//         .html(labelAttribute);
//
//     var countyName=infoLabel.append("body")
//         .attr("class","labelname")
//         .html(props.name);
//
//
// }



//function setChart(dataMeasles, caliCounties, map,path, colorScale){

// //add chart element
//   var chart = d3.select("body")
//       .append("svg")
//       .attr("width",chartWidth)
//       .attr("height",chartHeight)
//       .attr("class","CAchart");
//
// //add chartBackground
//   var chartBackground = chart.append("rect")
//        .attr("class", "chartBackground")
//        .attr("width", chartInnerWidth)
//        .attr("height", chartInnerHeight)
//        .attr("transform", translate);
//
//   var yScale = d3.scale.linear()
//               //change scale values dynamically with max value of each variable
//               .domain([d3.max(dataMeasles,function(d){ return parseFloat(d[expressed])})*1.02, 0])
//               //output this between 0 and chartInnerHeight
//               .range([0, chartInnerHeight]);
//
// //bars element added
//   var bars=chart.selectAll(".bars")
//       .data(dataMeasles)
//       .enter()
//       .append("rect")
//       .sort(function(a,b){
//         //list largest values first for easier of reading
//         return b[expressed]-a[expressed];
//       })
//       .attr("class", function(d){
//         //give clas name to bars--was switching out values to see how each variable plotted out
//         return "bars " + d.coverage1314;
//       })
//       //width depending on number of elements, in my case 192-1
//       .attr("width", chartInnerWidth/dataMeasles.length - 1)
//       //determine position on x axis by number of elements, incl leftPadding
//       .attr("x", function(d,i){
//
//         return i*(chartInnerWidth/dataMeasles.length) + leftPadding;
//       })
//       //height by yscale of each value, within chartInnerHeight
//       .attr("height", function(d){
//         return chartInnerHeight-yScale(parseFloat(d[expressed]));
//       })
//       //make bars 'grow' from bottom
//       .attr("y", function(d){
//         return yScale(parseFloat(d[expressed]))+topBottomPadding;
//
//       })
//       //color by colorScale
//       .style("fill", function(d){
//         return choropleth(d, colorScale);
//       });
//
//     //   .on("mouseover", highlight)//highlight selected  bars
//     //   .on("mouseout", dehighlight)//de highlight selected bars with mouseout
//     //   .on("mousemove", moveLabel);//follow label with cursor
//     //
//     // //for returing style after an interaction
//     // var desc=bars.append("desc")
//     //     .text('{"stroke":"black", "stroke-width":"0px", "fill-opacity":"1"}');    //add chart title
//
//     //add chart title, change according to variable
//     var chartTitle=chart.append("text")
//         .attr("x", 250)
//         .attr("y", 35)
//         .attr("class","chartTitle")
//         .text([expressed])
//
//     //create vertical axis generator
//     var yAxis = d3.svg.axis()
//         .scale(yScale)
//         .orient("left");
//
//     //place axis
//     var axis = chart.append("g")
//         .attr("class", "axis")
//         .attr("transform", translate)
//         .call(yAxis);//for how actual numbers will be distributed
//
//     //create frame for chart border
//     var chartFrame = chart.append("rect")
//         .attr("class", "chartFrame")
//         .attr("width", chartInnerWidth)
//         .attr("height", chartInnerHeight)
//         .attr("transform", translate);

// function makeColorScale(data){
//
//     var colorScaleVC=d3.scale.threshold()
//         .domain([80,90,95])
//         .range(['#ca0020','#f4a582','#92c5de','#0571b0'])
//         return colorScaleVC;
//
//     var colorScalepb13=d3.scale.threshold()
//         .domain([2.82, 5.63, 13.45])
//         .range(['#0571b0','#92c5de','#f4a582','#ca0020']);
//         return colorScalepb13;
//
//     var colrScalepb15=d3.scale.threshold()
//         .domain([2.22,4.44,11.92])
//         .range(['#0571b0','#92c5de','#f4a582','#ca0020']);
//         return colorScalepb15;
//
//
//     // //for choropleth maps
//     //
//     // //MANUALLY SETTING SCALE, US IF STATEMENTS?
//     // var color=d3.scale.threshold()
//     // //  .domain([2.82, 5.63, 13.45])//personal belief pbe1314
//     // //  .domain([2.22,4.44,11.92])//personal belief pbe1516
//     //   //.range(['#ca0020','#f4a582','#92c5de','#0571b0'])//vaccine coverage--high=good
//     //   .range(['#0571b0','#92c5de','#f4a582','#ca0020'])//personal belief--low=good
//     // return color;
//
//
//
//     //JENKS CLASSIFICATION
//     // var color=d3.scale.threshold()
//     //   .domain([])
//     //
//   // var colorClasses=objectColors[expressed];
//   //
//   // var colorScale=d3.scale.threshold()
//   //     .range(colorClasses);
//   //
//   // var domainArray=[];
//   // for (var i=0; i<data.length; i++){
//   //   var val=parseFloat(data[i][expressed]);
//   //       domainArray.push(val);
//   // };
//   //
//   // var clusters=ss.ckmeans(domainArray, 4);
//   // domainArray=clusters.map(function(d){
//   //   return d3.min(d);
//   // });
//   //
//   // domainArray.shift();
//   //
//   // colorScale.domain(domainArray);
//   //
//   // return colorScale;
//
//
//
//
//   var colorScale=d3.scale.quantile()//use quantile for scale generator
//          .range(['#ca0020','#f4a582','#92c5de','#0571b0']);//incorporate objectColors array to change depending on variable
//
// //creating equal interval classifcation
//  var minmax = [
//        d3.min(data, function(d) { return parseFloat(d[expressed]); }),
//        d3.max(data, function(d) { return parseFloat(d[expressed]); })
//    ];
//    //assign two-value array as scale domain
//    colorScale.domain(minmax);
//    return colorScale;
//
// };


//
//
// //creation of choropleth map
// function choropleth(props, colorScale){
//   var value = parseFloat(props[expressed]);
//
//   if(isNaN(value)){
//         return "purple";//no value
//     } else if (value==0){
//         return "gray";//for case of Political_Filtering with a score of 0
//     } else{
//         return colorScale(value);
//     }
//   };

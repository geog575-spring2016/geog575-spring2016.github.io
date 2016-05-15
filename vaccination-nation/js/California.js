
(function(){

keyArray=["coverage1314","pbe1314","coverage1516","pbe1516"]
var expressed=keyArray[0]

keyArray2=["measles10","measles11","measles12","measles13","measles14"]
var expressed2=keyArray2[0];

var attributeIndex = 0

var labelTitles={
    coverage1314:['Coverage Rate 2013-2014'],
    pbe1314:['Exemption Rate 2013-2014'],
    coverage1516:['Coverage Rate 2015-2016'],
    pbe1516:['Exemption Rate 2015-2016'],
}

var labelTitles2={
    measles10:['Number of Measles Outbreaks in 2010'],
    measles11:['Number of Measles Outbreaks in 2011'],
    measles12:['Number of Measles Outbreaks in 2012'],
    measles13:['Number of Measles Outbreaks in 2013'],
    measles14:['Number of Measles Outbreaks in 2014']
}



var legendLables={

}

var colorScaleVC=d3.scale.threshold()
    .domain([80,90,95])
    .range(["#d7191c","#fc8d59","#fadb86","#47bcbf"]);

var colorScalepb13=d3.scale.quantile()
    .domain([0,21.26])
    .range(['#fcae91','#fb6a4a','#de2d26','#a50f15']);

var colorScalepb14=d3.scale.quantile()
    .domain([0,21.26])
    .range(['#fcae91','#fb6a4a','#de2d26','#a50f15']);

var width = 1200,
    height = 500,
    formatPercent = d3.format(".0%"),
    formatNumber = d3.format(".0f");

var radius = d3.scale.sqrt()
    .domain([0, 20])
    .range([0,80]);


var tooltip = d3.select("#california-map").append("div")
    .attr("class", "CAtoolTip");

window.onload=setmap();

function setmap(){

    var width= 500,
        height = 550;

    var CAmap=d3.select("#california-map")
        .append("svg")
        .attr("class","CAmap")
        .attr("width", width)
        .attr("height",height);

    var  projection = d3.geo.mercator()
			// .scale(1122 * 2)
      .scale(1250*2)
			.center([-119.5, 37.2])
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
        addVCLegend();
        addPBELegend();
        //var colorScale=makeColorScale(dataCoverage);
        setEnumerationUnits(caliCounties, californiacenters, CAmap, path);
        selectLayer(caliCounties, californiacenters, dataMeasles, CAmap, path);
      //  CAchangeAttribute(expressed2, CAmap, path)
      //  var radiusScale=setRadius(californiacenters);
        //CAcreateSequenceControls(caliCounties, californiacenters, properties, dataMeasles, CAmap, path)
        //CAcreateSequenceControls(properties)
        //setSliderBar(caliCounties,CAmap,path);

        //setChart(dataCoverage, caliCounties, colorScale);
    }

};

function setEnumerationUnits(caliCounties, californiacenters, CAmap, path){
    //add countries to CAmap
    var counties=CAmap.selectAll(".counties")
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


   var centroids=CAmap.selectAll(".symbol14")
       .data(californiacenters.features.sort(function(a,b){return b.properties.measles14-a.properties.measles14;}))
     .enter().append("path")
       .attr("class", function(d){

             return "circle14 "+d.properties.county+ d.properties.geo_id;
       })

       .attr("d",path.pointRadius(function(d){return radius(d.properties.measles14);}))
       .style({"fill": "#fc8d59",
               "fill-opacity":0.5,
               "stroke":"black"})
     .on("mouseover", function(d){
             tooltip.style("visibility", "visible").html("<l1>"+labelTitles2.measles14+":   "+"<b>"+d.properties.measles14+"</b><div>"+"County: "+"<b>"+d.properties.county+"</b></div></l1>");
             highlightCircles(d.properties)
     })
     .on("mousemove", function(){return tooltip.style("top", (event.pageY-50)+"px").style("left",(event.pageX+50)+"px");})
     .on("mouseout", function(d){
           tooltip.style("visibility", "hidden");
           dehighlightCircles(d.properties)

         });
    //   .remove();
};

function addVCLegend(){

  var boxmargin = 4,
      lineheight = 30,
      keyheight = 20,
      keywidth = 40,
      boxwidth = 3.5 * keywidth,
      formatPercent = d3.format(".0%");

//  var margin = { "left": 160, "top": 80 };

  var legendcolors = ["#d7191c","#fc8d59","#fadb86","#47bcbf"];

  var title = ['Vaccine Coverage Rates'],
      titleheight = title.length*lineheight + boxmargin;

  var x = d3.scale.quantile()
        .domain([0,1]);

    var threshold = d3.scale.threshold()
        .domain([80,90,95,100])
        .range(legendcolors);
    var ranges = threshold.range().length;

    // return quantize thresholds for the key
    var qrange = function(max, num) {
        var a = [];
        for (var i=0; i<num; i++) {
            a.push(i*max/num);
        }
        return a;
    }

    var svg = d3.select("#california-legend-vc").append("svg")
        .attr("class", "VClegendContainer");
        //.attr("width", width)
      //  .attr("height", height)
        //.remove();

    // make legend
    var legend = svg.append("g")
//        .attr("transform", "translate ("+margin.left+","+margin.top+")")
        .attr("class", "legend");


    //     var legendContainer = d3.select("#california-legend-vc")
//        .append("svg")
//        .attr("class", "legendContainer");
//
//    var legend = svg.append("g")
//        .attr("transform", "translate ("+margin.left+","+margin.top+")")
//        .attr("class", "legend");

    legend.selectAll("text")
        .data(title)
        .enter().append("text")
        .attr("class", "CAlegend-title")
        .attr("y", function(d, i) { return (i+1)*lineheight-2; })
        .text(function(d) { return d; })

    // make legend box
    var lb = legend.append("rect")
        .attr("transform", "translate (0,"+titleheight+")")
        .attr("class", "CAlegend-box")
        .attr("width", boxwidth)
        .attr("height", ranges*lineheight+2*boxmargin+lineheight-keyheight);

    // make quantized key legend items
    var li = legend.append("g")
        .attr("transform", "translate (8,"+(titleheight+boxmargin)+")")
        .attr("class", "CAlegend-items");

    li.selectAll("rect")
        .data(threshold.range().map(function(legendcolors) {
          var d = threshold.invertExtent(legendcolors);
          if (d[0] == null) d[0] = x.domain()[0];
          //console.log(d);
          //console.log(d[0]+" - "+d[1]+"%");
          //if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
        .enter().append("rect")
        .attr("y", function(d, i) { return i*lineheight+lineheight-keyheight; })
        .attr("width", keywidth)
        .attr("height", keyheight)
        .style("fill", function(d) { return threshold(d[0]); });

    li.selectAll("text")
    .data(threshold.range().map(function(legendcolors) {
      var d = threshold.invertExtent(legendcolors);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
      }))
        //.data(qrange(threshold.domain()[1], ranges))
        .enter().append("text")
        .attr("x", 48)
        .attr("y", function(d, i) { return (i+1)*lineheight-2; })
        .text(function(d) { return (d[0]+" - "+d[1]+"%")})


};

function addPBELegend(){


  var boxmargin = 4,
      lineheight = 30,
      keyheight = 20,
      keywidth = 40,
      boxwidth = 4.5 * keywidth,
      formatPercent = d3.format(".0%");

//  var margin = { "left": 160, "top": 80 };

  var legendcolors = ['#fcae91','#fb6a4a','#de2d26','#a50f15'];

  var title = ['Personal Belief Exemptions'],
      titleheight = title.length*lineheight + boxmargin;

  var x = d3.scale.quantile()
        .domain([0,1]);

    var quantile = d3.scale.quantile()
        .domain([0,21.26])
        .range(legendcolors);
    var ranges = quantile.range().length;

    // return quantize thresholds for the key
    var qrange = function(max, num) {
        var a = [];
        for (var i=0; i<num; i++) {
            a.push(i*max/num);
        }
        return a;
    }

    var svg = d3.select("#california-legend-vc")
        .append("svg")
        .attr("class", "PBElegendContainer");


        //.attr("width", 138)
        //.attr("height", 140)
        //.remove();

    // make legend
    var legend = svg.append("g")
//        .attr("transform", "translate ("+margin.left+","+margin.top+")")
        .attr("class", "legend");

    legend.selectAll("text")
        .data(title)
        .enter().append("text")
        .attr("class", "CAlegend-title")
        .attr("y", function(d, i) { return (i+1)*lineheight-2; })
        .text(function(d) { return d; })

    // make legend box
    var lb = legend.append("rect")
        .attr("transform", "translate (0,"+titleheight+")")
        .attr("class", "CAlegend-box")
        .attr("width", boxwidth)
        .attr("height", ranges*lineheight+2*boxmargin+lineheight-keyheight);

    // make quantized key legend items
    var li = legend.append("g")
        .attr("transform", "translate (8,"+(titleheight+boxmargin)+")")
        .attr("class", "CAlegend-items");

    li.selectAll("rect")
        .data(quantile.range().map(function(legendcolors) {
          var d = quantile.invertExtent(legendcolors);
          if (d[0] == null) d[0] = x.domain()[0];
          //console.log(d);
          //console.log(d[0]+" - "+d[1]+"%");
          //if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
        .enter().append("rect")
        .attr("y", function(d, i) { return i*lineheight+lineheight-keyheight; })
        .attr("width", keywidth)
        .attr("height", keyheight)
        .style("fill", function(d) { return quantile(d[0]); });

    li.selectAll("text")
    .data(quantile.range().map(function(legendcolors) {
      var d = quantile.invertExtent(legendcolors);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
      }))
        //.data(qrange(threshold.domain()[1], ranges))
        .enter().append("text")
        .attr("x", 48)
        .attr("y", function(d, i) { return (i+1)*lineheight-2; })
        .text(function(d) { return d[0]+" - "+d[1]+"%"})


};


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
  var selected=d3.selectAll("."+properties.county+ properties.geo_id)
      .style({
          "stroke":"#3e3e3e",
          "stroke-width":"3"
      })
};

function dehighlightCircles(properties){
  var selected=d3.selectAll("."+properties.county+ properties.geo_id)
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


function selectLayer(caliCounties, californiacenters, dataMeasles, CAmap, path){

  d3.selectAll('.radio').on('change', function(){

     if(document.getElementById('propsymbs14').checked) {
//          d3.select("#california-legend-vc").remove();
//          d3.select("#california-legend-pbe").remove();
      CAmap.selectAll('.circle13').remove();
      d3.selectAll('.counties').transition().duration(200)
        .style({'fill': "#f2f2f1","stroke":"#aab4b5","stroke-width":1})

      var singleCounties=CAmap.selectAll(".counties").data(caliCounties)
                .on('mouseover', function(d){return tooltip.style("visibility", "hidden")})
                .on('mouseout', function(){return tooltip.style("visibility", "hidden");});


      var centroids=CAmap.selectAll(".symbol14")
          .data(californiacenters.features.sort(function(a,b){return b.properties.measles14-a.properties.measles14;}))
        .enter().append("path")
          .attr("class", function(d){

                return "circle14 "+d.properties.county+ d.properties.geo_id;
          })

          .attr("d",path.pointRadius(function(d){return radius(d.properties.measles14);}))
          .style({"fill": "#fc8d59",
                  "fill-opacity":0.5,
                  "stroke":"black"})
        .on("mouseover", function(d){
                tooltip.style("visibility", "visible").html("<l1>"+labelTitles2.measles14+":   "+"<b>"+d.properties.measles14+"</b><div>"+"County: "+"<b>"+d.properties.county+"</b></div></l1>");
                highlightCircles(d.properties)
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-50)+"px").style("left",(event.pageX+50)+"px");})
        .on("mouseout", function(d){
              tooltip.style("visibility", "hidden");
              dehighlightCircles(d.properties)

            });
        }


        if (document.getElementById('vc13').checked) {
               // addVCLegend();
//                d3.select("california-legend-pbe").remove()
                CAmap.selectAll('.circle13').remove();
                CAmap.selectAll('.circle14').remove();
                var counites=d3.selectAll('.counties').transition().duration(200)
                    .style('fill', function(d){return colorScaleVC(d.properties.coverage1314)})
                    .style('stroke','white')

                var singleCounties=CAmap.selectAll(".counties").data(caliCounties)
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
                 // addPBELegend();
                //  d3.select("#california-legend-vc").remove();
                  CAmap.selectAll('.circle13').remove();
                  CAmap.selectAll('.circle14').remove();
                  d3.selectAll('.counties').transition().duration(200)
                    .style('fill', function(d){return colorScalepb13(d.properties.pbe1314)})
                    .style('stroke','white')
                  var singleCounties=CAmap.selectAll(".counties").data(caliCounties)
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
//                  d3.select("california-legend-pbe").remove()
                //  addVCLegend();
                  CAmap.selectAll('.circle13').remove();
                  CAmap.selectAll('.circle14').remove();
                  d3.selectAll('.counties').transition().duration(200)
                    .style('fill', function(d){return colorScaleVC(d.properties.coverage1516)})
                    .style('stroke','white');
                  var singleCounties=CAmap.selectAll(".counties").data(caliCounties)
                            .on('mouseover', function(d){
                                tooltip.style("visibility", "visible").html("<l1>"+labelTitles.coverage1516+":   "+"<b>"+d.properties.coverage1516+"%"+"</b><div>"+"County: "+"<b>"+d.properties.NAME+"</b></div></l1>");
                                highlight(d.properties)
                            })
                            .on('mousemove', function(){return tooltip.style("top", (event.pageY-40)+"px").style("left",(event.pageX+40)+"px");})
                            .on('mouseout', function(d){
                                tooltip.style("visibility", "hidden");
                                dehighlight(d.properties)
                            });
            //      CAcreateSequenceControls()
      }

       else if (document.getElementById('pb15').checked) {
                 // addPBELegend();
//                  d3.select("#california-legend-vc").remove();
                  CAmap.selectAll('.circle13').remove();
                  CAmap.selectAll('.circle14').remove();
                  d3.selectAll('.counties').transition().duration(200)
                    .style('fill', function(d){return colorScalepb14(d.properties.pbe1516)})
                    .style('stroke','white');
                  var singleCounties=CAmap.selectAll(".counties").data(caliCounties)
                            .on('mouseover', function(d){
                               tooltip.style("visibility", "visible").html("<l1>"+labelTitles.pbe1516+":   "+"<b>"+d.properties.pbe1516+"%"+"</b><div>"+"County: "+"<b>"+d.properties.NAME+"</b></div></l1>");
                               highlight(d.properties)
                            })
                            .on('mousemove', function(){return tooltip.style("top", (event.pageY-40)+"px").style("left",(event.pageX+40)+"px");})
                            .on('mouseout', function(d){
                                tooltip.style("visibility", "hidden");
                                dehighlight(d.properties)
                            });
                //  CAcreateSequenceControls()

      }

      else if(document.getElementById('propsymbs13').checked) {
//        d3.select("#california-legend-vc").remove();
//        d3.select("#california-legend-pbe").remove();
        CAmap.selectAll('.circle14').remove();
        d3.selectAll('.counties').transition().duration(200)
          .style({'fill': "#f2f2f1","stroke":"#aab4b5","stroke-width":1})

        var singleCounties=CAmap.selectAll(".counties").data(caliCounties)
                  .on('mouseover', function(d){return tooltip.style("visibility", "hidden")})
                  .on('mouseout', function(){return tooltip.style("visibility", "hidden");});


        var centroids=CAmap.selectAll(".symbol13")
            .data(californiacenters.features.sort(function(a,b){return b.properties.measles13-a.properties.measles13;}))
            .enter().append("path")
            .attr("class", function(d){

                  return "circle13 "+d.properties.county+ d.properties.geo_id;
            })
            .attr("d",path.pointRadius(function(d){return radius(d.properties.measles13);}))
            .style({"fill": "#fc8d59",
                    "fill-opacity":0.5,
                    "stroke":"black"})
          .on("mouseover", function(d){
                  tooltip.style("visibility", "visible").html("<l1>"+labelTitles2.measles13+":   "+"<b>"+d.properties.measles13+"</b><div>"+"County: "+"<b>"+d.properties.county+"</b></div></l1>");
                  highlightCircles(d.properties)
          })
        	.on("mousemove", function(){return tooltip.style("top", (event.pageY-50)+"px").style("left",(event.pageX+50)+"px");})
        	.on("mouseout", function(d){
                tooltip.style("visibility", "hidden");
                dehighlightCircles(d.properties)

              });
        }


        })
      };

})();

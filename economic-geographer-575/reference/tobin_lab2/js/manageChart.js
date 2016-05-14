/**
    Declare all svg elements in the chart

    @return: object of chart SVGs
**/
function initializeChart(vars, calcdVars, csv) {

    var outer = d3.select("div#content")
        .append("svg")
        .attr("class", "chart")
        .attr("width", vars.width)
        .attr("height", vars.height);

    var inner = outer.append("rect")
        .attr("class", "chartBackground")
        .attr("width", calcdVars.innerWidth)
        .attr("height", calcdVars.innerHeight)
        .attr("transform", calcdVars.translate);

    var title = outer.append("text")
        .attr("class", "chartTitle")
        .attr("text-anchor", "end")
        .attr("x", vars.width - vars.rightPadding - vars.title_x)
        .attr("y", vars.topBottomPadding + vars.title_y);

    var subtitle = outer.append("text")
        .attr("class", "chartSubtitle")
        .attr("text-anchor", "end")
        .attr("x", vars.width - vars.rightPadding - vars.subTitle_x)
        .attr("y", vars.topBottomPadding + vars.subTitle_y);

    var xAxis = outer.append("g")
        .attr("class", "chartAxis")
        .attr("transform", "translate(" + vars.leftPadding + "," + (vars.topBottomPadding+calcdVars.innerHeight) + ")");

    var yAxis = outer.append("g")
        .attr("class", "chartAxis")
        .attr("transform", calcdVars.translate);

    var bars = outer.selectAll(".bars")
        .data(csv)
        .enter()
        .append("rect")
        .attr("class", function(d){
            return "bars " + d.adm1_code;
        });

    var meanLine = outer.append("line")
        .attr("class", "meanLine")
        .attr("transform", "translate(" + vars.leftPadding + ",0)");
           
    var meanText = outer.append("text")
        .attr("class", "meanText")
        .attr("text-anchor", "end")
        .attr("x", vars.width - vars.rightPadding)
        .text("Average (Mean) Value");        

    var meanValueText = outer.append("text")
        .attr("class", "meanValueText")
        .attr("text-anchor", "end")
        .attr("x", vars.width - vars.rightPadding);

    var desc = bars.append("desc")
        .text('{"stroke": "black", "stroke-width": "0.5px"}');

    return {
        outer: outer,
        inner: inner,
        title: title,
        subtitle: subtitle,
        xAxis: xAxis,
        yAxis: yAxis,
        meanLine: meanLine,
        meanText: meanText,
        meanValueText: meanValueText,
        bars: bars,
    };
}

function styleChart(chart, expressed, colorScale, csv, vars, calcdVars) {

    //style x-scale & axis
    //blank x-axis gives us a bottom graph outline
    var xScale = d3.scale.linear()
        .range([calcdVars.innerWidth, 0])
        .domain([0, csv.length]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .innerTickSize([0]) //removes tick marks
        .outerTickSize([0]) //removes tick marks
        .tickFormat( function(d) {
            return ''; //removes tick marks
        });

    //get min and max of expressed attribute
    var min = d3.min(csv, function(d) { return parseFloat(d[expressed.data]); });
    var max = d3.max(csv, function(d) { return parseFloat(d[expressed.data]); });

    //create a scale to size bars proportionally to frame
    var yScale = d3.scale.linear()
        .range([calcdVars.innerHeight, 0])
        .domain([min-(min*0.3), max+(max*0.05)]);

    //create vertical axis generator
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .outerTickSize([0]) //removes outer ticks
        .tickFormat( function(d) { // formats ticks
            return expressed.prefixUnits + d + expressed.suffixUnits;
        });

    var domainArray = [];
    //build array of all values of the expressed attribute
    for (var i=0; i<csv.length; i++){
        var val = parseFloat(csv[i][expressed.data]);
        domainArray.push(val);
    }; var mean = ss.mean(domainArray);
    var meanLineData = [0, csv.length, mean];

    //position mean line & text according to data
    chart.meanLine.attr("stroke", "purple")
        .attr("stroke-width", 3)
        .transition().duration(2000)
        .attr("x1", xScale(meanLineData[0]))
        .attr("y1", yScale(meanLineData[2]))
        .attr("x2", xScale(meanLineData[1]))
        .attr("y2", yScale(meanLineData[2]));

    chart.meanText.transition().duration(2000)
        .attr("y", yScale(meanLineData[2])-8);

    //var meanValTxtObjectParam = {};
    //meanValTxtObjectParam[expressed.data] = mean;

    chart.meanValueText.transition().duration(2000)
        .attr("y", yScale(meanLineData[2])+40)
        .text(Math.round(mean*100)/100);

    //style chart bars accordingly
    chart.bars.sort(function(a, b){
        //largest on the left...
        return b[expressed.data]-a[expressed.data];
    })
    .on("mouseover", function(d){
        highlight(d, expressed);
    })
    .on("mouseout", function(d){
        unhighlight(d);
    })
    .on("click", function(d) {
        permaHighlight(d, expressed);
    })
    .on("mousemove", moveLabel)
    .transition().delay(function(d, i) {
        return i*30;
    }).duration(2000)
    //use chart vars to determine bar sizing
    .attr("width", calcdVars.innerWidth / (csv.length+1) - 1)
    .attr("x", function(d, i){
        return (i+0.5) * (calcdVars.innerWidth / (csv.length+1)) + vars.leftPadding;
    })
    .attr("height", function(d){
        return calcdVars.innerHeight - yScale(parseFloat(d[expressed.data]));
    })
    .attr("y", function(d){
        return yScale(parseFloat(d[expressed.data])) + vars.topBottomPadding -1;
    })
    .style("fill", function(d){
        return choropleth(d, colorScale, expressed.data);
    });

    chart.xAxis.call(xAxis);
    chart.yAxis.call(yAxis);
    chart.title.text(expressed.title);
    chart.subtitle.text(expressed.subtitle);

}
function initializeScatterPlot(dots, margins, dimensions) {
    //calculate values from object arguments
    var innerWidth = dimensions.width - margins.left - margins.right,
        innerHeight = dimensions.height - margins.top - margins.bottom;

    var xScale = d3.scale.linear()
        .range([0, innerWidth]);

    var yScale = d3.scale.linear()
        .range([innerHeight, 0]);

    var xAxisGenerator = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxisGenerator = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var background = d3.select("body").append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .attr("class", "plotBackground");

    var inner = background.append("g")
        .attr("class", "innerBackground")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    var bivariates = [
        ["A1", "B1", "C1"],
        ["A2", "B2", "C2"],
        ["A3", "B3", "C3"],
    ];

    for (var i = 0; i < bivariates.length; i++) {
        for (var j = 0; j < bivariates[i].length; j++) {

            var block = inner.append("rect")
                .attr("id", bivariates[i][j])
                .attr("class", "bivariate")
                .attr("x", j * (innerWidth / 3))
                .attr("y", i * (innerHeight / 3))
                .attr("width", innerWidth / 3)
                .attr("height", innerHeight / 3);

            bivariates[i][j] = block;

        }
    }

//    var xScaleQuantile = d3.scale.quantile()
//        .range(bivariates[0]);

//    var yScaleQuantile = d3.scale.quantile()
//        .range(bivariates[0]);

    var xAxis = inner.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + innerHeight + ")");

    var yAxis = inner.append("g")
        .attr("class", "axis");

    var correlationLine = inner.append("line")
        .attr("class", "correlationLine")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 100)
        .attr("y2", 100)
        .attr("style", "stroke: red; stroke-width: 2;");

    var titleLabel = inner.append("text")
        .attr("class", "title")
        .attr("x", innerWidth / 2)
        .attr("y", -margins.top)
        .attr("dy", "1.6em")
        .style("text-anchor", "middle");

    var timeLabel = inner.append("text")
        .attr("class", "time")
        .attr("x", innerWidth)
        .attr("dy", "-0.4em")
        .style("text-anchor", "end");

    var correlationLabel = inner.append("text")
        .attr("class", "correlationLabel")
        .attr("x", innerWidth / 2)
        .attr("y", 44)
        .attr("style", "fill: white;")
        .style("text-anchor", "middle")
        .text("r = NULL");

    var quantileLabels = [];

    var xLabel = xAxis.append("text")
        .attr("class", "label")
        .attr("x", innerWidth - 6)
        .attr("y", -6)
        .style("text-anchor", "end");

    var yQuantileLabel_1 = xAxis.append("text")
        .attr("class", "numLabel")
        .attr("x", innerWidth - 3)
        .attr("y", -6)
        .attr("style", "fill: white;")
        .attr("dy", "0.15em")
        .style("text-anchor", "end");

    var yQuantileLabel_2 = xAxis.append("text")
        .attr("class", "numLabel")
        .attr("x", innerWidth - 3)
        .attr("y", -6)
        .attr("style", "fill: white;")
        .attr("dy", "0.15em")
        .style("text-anchor", "end");

    var yLabel = yAxis.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(90)")
        .attr("x", 6)
        .attr("y", 6)
        .attr("dy", "-0.87em") //takes place of x, since we rotated the label
        .style("text-anchor", "start");

    var xQuantileLabel_1 = yAxis.append("text")
        .attr("class", "numLabel")
        .attr("y", 14)
        .attr("style", "fill: white;")
        .style("text-anchor", "middle");

    var xQuantileLabel_2 = yAxis.append("text")
        .attr("class", "numLabel")
        .attr("y", -4)
        .style("text-anchor", "middle");

    var dots = inner.selectAll(".dot")
        .data(dots).enter().append("circle")
        .attr("class", function(d) {
            return "dot FIPS-" + d.FIPS;
        })
        .attr("r", 0.5)
        .attr("cx", function(d) {
            return innerWidth * Math.random();
        })
        .attr("cy", function(d) {
            return innerHeight * Math.random();
        });

    return {
        xScale: xScale,
        yScale: yScale,
        xAxisGenerator: xAxisGenerator,
        yAxisGenerator: yAxisGenerator,
        background: background,
        inner: inner,
        bivariates: bivariates,
//        xScaleQuantile: xScaleQuantile,
//        yScaleQuantile: yScaleQuantile,
        xAxis: xAxis,
        yAxis: yAxis,
        correlationLine: correlationLine,
        titleLabel: titleLabel,
        timeLabel: timeLabel,
        correlationLabel: correlationLabel,
        xLabel: xLabel,
        yLabel: yLabel,
        quantileLabels: {
            x1: xQuantileLabel_1,
            x2: xQuantileLabel_2,
            y1: yQuantileLabel_1,
            y2: yQuantileLabel_2,
        },
        dots: dots,
    };

}
function updateScatterPlot(scatterPlot, xTitle, yTitle, xData, yData, data, dataPoints, year, bivariate) {
	if (xTitle == null) {
			scatterPlot.xLabel.text("");
			scatterPlot.yLabel.text(yTitle);
			scatterPlot.titleLabel.text(yTitle);
	} else {
			scatterPlot.xLabel.text(xTitle);
			scatterPlot.yLabel.text(yTitle);
			scatterPlot.titleLabel.text(yTitle + " vs. " + xTitle);
	}

	scatterPlot.xScale.domain(d3.extent(data, function(d) {
			return d['x'];
	})).nice();
	scatterPlot.yScale.domain(d3.extent(data, function(d) {
			return d['y'];
	})).nice();

	if (bivariate) {

			scatterPlot.xAxisGenerator
					.innerTickSize([6])
					.outerTickSize([6])
					.tickFormat(function(d) {
							return formatTicks(d);
					});

	} else {

			scatterPlot.xAxisGenerator
					.innerTickSize([0])
					.outerTickSize([0])
					.tickFormat(function(d) {
							return '';
					});

	}

	scatterPlot.yAxisGenerator.tickFormat(function(d) {
			return formatTicks(d);
	});
	scatterPlot.xAxis.call(scatterPlot.xAxisGenerator);
	scatterPlot.yAxis.call(scatterPlot.yAxisGenerator);
	scatterPlot.timeLabel.text(year);

//	scatterPlot.xScaleQuantile.domain(xData);
//	scatterPlot.yScaleQuantile.domain(yData);


	scatterPlot.quantileLabels.x2.transition().duration(1500)
			.attr("x", scatterPlot.xScale(xQuantileBreaks[0]))
			.text(xQuantileBreaks[0]);
	scatterPlot.quantileLabels.x1.transition().duration(1500)
			.attr("x", scatterPlot.xScale(xQuantileBreaks[1]))
			.text(xQuantileBreaks[1]);
	scatterPlot.quantileLabels.y1.transition().duration(1500)
			.attr("y", scatterPlot.yScale(yQuantileBreaks[0]) - scatterPlot.yScale.range()[0])
			.text(yQuantileBreaks[0]);
	scatterPlot.quantileLabels.y2.transition().duration(1500)
			.attr("y", scatterPlot.yScale(yQuantileBreaks[1]) - scatterPlot.yScale.range()[0])
			.text(yQuantileBreaks[1]);

	xQuantileBreaks.splice(0, 0, d3.min(scatterPlot.xScale.domain()));
	xQuantileBreaks.splice(xQuantileBreaks.length, 0, d3.max(scatterPlot.xScale.domain()));
	yQuantileBreaks.reverse().splice(0, 0, d3.max(scatterPlot.yScale.domain()));
	yQuantileBreaks.splice(yQuantileBreaks.length, 0, d3.min(scatterPlot.yScale.domain()));

  updateScatterPlotRegression(scatterPlot, dataPoints, xData, yData)

	scatterPlot.dots.data(data, function(d) {
					return d.FIPS;
			}).sort(function(a, b) {
					return a['y'] - b['y'];
			})
			.transition().duration(1500)
			.attr("cx", function(d, i) {

					if (isNaN(scatterPlot.xScale(d['x']))) {
							$('.FIPS-' + d.FIPS).attr("r", 0);
					} else {
							$('.FIPS-' + d.FIPS).attr("r", 0.5);

							if (bivariate) {
									return scatterPlot.xScale(d['x']);
							} else {
									return scatterPlot.xScale(i);
							}
					}

			})
			.attr("cy", function(d) {

					if (isNaN(scatterPlot.yScale(d['y']))) {
							$('.FIPS-' + d.FIPS).attr("r", 0);
					} else {
							$('.FIPS-' + d.FIPS).attr("r", 0.5);
							return scatterPlot.yScale(d['y']);
					}

			});

	for (var i = 0; i < scatterPlot.bivariates.length; i++) {
			for (var j = 0; j < scatterPlot.bivariates[i].length; j++) {

					scatterPlot.bivariates[i][j].transition().duration(1500)
							.attr("x", scatterPlot.xScale(xQuantileBreaks[j]))
							.attr("y", scatterPlot.yScale(yQuantileBreaks[i]))
							.attr("width", scatterPlot.xScale(xQuantileBreaks[j + 1]) - scatterPlot.xScale(xQuantileBreaks[j]))
							.attr("height", scatterPlot.yScale(yQuantileBreaks[i + 1]) - scatterPlot.yScale(yQuantileBreaks[i]));

			}
	}
}

function updateScatterPlotRegression(scatterPlot, dataPoints, xData, yData) {
  var regressionLine = ss.linearRegressionLine(ss.linearRegression(dataPoints));
	scatterPlot.correlationLine.attr("x1", scatterPlot.xScale(scatterPlot.xScale.domain()[0]))
			.attr("y1", scatterPlot.yScale(regressionLine(scatterPlot.xScale.domain()[0])))
			.attr("x2", scatterPlot.xScale(scatterPlot.xScale.domain()[1]))
			.attr("y2", scatterPlot.yScale(regressionLine(scatterPlot.xScale.domain()[1])));
	scatterPlot.correlationLabel.text("r = " + ss.sampleCorrelation(xData, yData))
}

function filterDots(filteredFIPS){
	console.log(filteredFIPS);
	
	
    d3.selectAll(".dot").attr("r", 0);
    for (var i = 0; i < filteredFIPS.length; i++) {
        d3.select(".FIPS-"+filteredFIPS[i]).attr("r", 10);
    }
}

function formatTicks(d) {

    var tickValString = d.toFixed(1);
    var tickValStrings = tickValString.split('.');

    var suffix = "";
    var magnitude = Math.ceil(tickValStrings[0].length / 3);

    if (magnitude == 2) {
        suffix = "K";
    } else if (magnitude == 3) {
        suffix = "M";
    }

    return tickValStrings[0].substring(0, tickValStrings[0].length - 3 * (magnitude - 1)) + suffix;

}

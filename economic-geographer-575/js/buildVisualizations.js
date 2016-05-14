function initializeVisualizations(FIPS, geojson) {
  var scatterPlot = initializeScatterPlot(
      FIPS, {
          top: 90,
          right: 40,
          bottom: 75,
          left: 50
      }, {
          width: 500,
          height: 575
      }
  );
  var choropleth = initializeChoropleth(geojson)

  return {
    scatterPlot: scatterPlot,
    choropleth: choropleth,
  }

}
function updateVisualizations(xTitle, yTitle, xDataRaw, xCol, yDataRaw, yCol, bivariate, visualizations) {
    data = [];
    dataPoints = [];
    xData = [];
    yData = [];
    FIPSxData = {}
    FIPSyData = {}

    var year = Object.keys(yDataRaw[0])[yCol]

    for (var i = 0; i < yDataRaw.length; i++) {

        if (xDataRaw[i]['FIPS'] != yDataRaw[i]['FIPS']) {
            alert("FIPS order does not match between data sets");
            return;
        }

        if (bivariate) {
            var xVal = xDataRaw[i][Object.keys(xDataRaw[i])[xCol]];
        } else {
            var xVal = i;
        }

        var yVal = yDataRaw[i][Object.keys(yDataRaw[i])[yCol]];

        data.push({
            FIPS: xDataRaw[i]['FIPS'],
            x: xVal,
            y: yVal,
        });

        if (!isNaN(parseInt(xVal)) && !isNaN(parseInt(yVal))) {
            dataPoints.push([parseInt(xVal), parseInt(yVal)]);
            xData.push(parseInt(xVal));
            yData.push(parseInt(yVal));
            FIPSxData[xDataRaw[i]['FIPS']]=xDataRaw[i][year]
            FIPSyData[yDataRaw[i]['FIPS']]=yDataRaw[i][year]
        }
    }

    data.forEach(function(d) {
        d['x'] = +d['x'];
        d['y'] = +d['y'];
    });

    xQuantileBreaks = d3.scale.quantile()
      .range([1,2,3])
      .domain(xData).quantiles();
    yQuantileBreaks = d3.scale.quantile()
      .range([1,2,3])
      .domain(yData).quantiles();

    //Assign quantile breaks to global variables
    xQuantile01 = xQuantileBreaks[0];
    xQuantile02 = xQuantileBreaks[1];
    yQuantile01 = yQuantileBreaks[0];
    yQuantile02 = yQuantileBreaks[1];
    
    
    if (errorControl01 == false) {
    	errorControl01 = true;
    } else if (errorControl01 == true) {
    	choropleth(filterHolder);
    }
	
    updateScatterPlot(visualizations.scatterPlot, xTitle, yTitle, xData, yData, data, dataPoints, year, bivariate)
    updateChoropleth(visualizations.choropleth, xTitle, yTitle, FIPSxData, xCol, FIPSyData, yCol, year, bivariate)



}

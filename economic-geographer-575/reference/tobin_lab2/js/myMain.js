/* Scripts by Tobin McGilligan, 2016 */

window.onload = function() { //when the window has loaded...
    
    var expressed = 0; //index of the initial attribute to display
    var mapScaleFactor = 1;

    var colorScheme = [
        "#c6dbef",
        "#9ecae1",
        "#6baed6",
        "#3182bd",
        "#08519c",
    ];

    //this object contains variables that controls our minimap
    var mapVars = {
        //note: these dimensions only define the rectangle surrounding
        //the map. The actual map will be slightly smaller
        width: (window.innerWidth * 0.3333) * mapScaleFactor,
        height: (window.innerWidth * 0.23) * mapScaleFactor,
        x_adjust: -5, //these adjustment parameters fine tune the
        y_adjust: -5, //position of the map within its div
    };

    //these objects contain variables that control the chart
    var chartVars = {
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.82,
        leftPadding: 60,
        rightPadding: 2,
        topBottomPadding: 5,
        title_x: 0,
        title_y: 40,
        subTitle_x: 25,
        subTitle_y: 65,
    };
    var chartCalcdVars = {
        innerWidth: chartVars.width - chartVars.leftPadding - chartVars.rightPadding,
        innerHeight: chartVars.height - chartVars.topBottomPadding*2,
        translate: "translate(" + chartVars.leftPadding + "," + chartVars.topBottomPadding + ")",
    };

    //this array holds all our data variables and their associated info
    var attrs = [
        {
            data: "num_employees_per_tenThousand_pop",
            title: "Number of Employees",
            subtitle: "per 10,000 employed people",
            prefixUnits: "",
            suffixUnits: "",
            round: 1,
        },
        {
            data: "num_businesses_per_tenThousand_pop",
            title: "Number of Businesses",
            subtitle: "per 10,000 employed people",
            prefixUnits: "",
            suffixUnits: "",
            round: 1,
        },
        {
            data: "total_wages_dollars_per_100dollars_GDP",
            title: "Total Wages Payed Out",
            subtitle: "per $100 Gross Domestic Product",
            prefixUnits: "$",
            suffixUnits: "",
            round: 100,
        },
        {
            data: "avg_annual_pay_thousands",
            title: "Mean Annual Pay",
            subtitle: "for Salaried Workers",
            prefixUnits: "$",
            suffixUnits: "K",
            round: 10,
        },
        {
            data: "avg_weekly_wage",
            title: "Mean Weekly Pay",
            subtitle: "for Hourly Workers",
            prefixUnits: "$",
            suffixUnits: "",
            round: 1,
        },
        {
            data: "name",
            title: "State",
            subtitle: "",
            prefixUnits: "",
            suffixUnits: "",
            round: 1,
        },
    ];

    //use queue.js to parallelize asynchronous data loading
    d3_queue.queue()
        .defer(d3.csv, "data/SnapshotPrivateManufacturingStats2014.csv") //load attributes from csv
        .defer(d3.json, "data/contiguous48_multipart_singlepart_simp.topojson") //load choropleth spatial data
        .await(callback);

    function callback(error, manufacturingStats, unitedStates) {

        //translate TopoJSON
        var contiguous48 = topojson.feature(unitedStates, unitedStates.objects.contiguous48_multipart_singlepart).features;

        joinData(attrs, contiguous48, manufacturingStats);
        var colorScale = createColorScale(attrs, expressed, manufacturingStats, colorScheme);

        //initialize SVG elements
        var map = initializeMap(mapVars, contiguous48);
        var chart = initializeChart(chartVars, chartCalcdVars, manufacturingStats);
        var dropdown = initializeDropdown(map.states, chart, attrs, manufacturingStats, colorScheme, chartVars, chartCalcdVars);

        //apply initial styles
        styleStates(map.states, attrs[expressed], colorScale);
        styleChart(chart, attrs[expressed], colorScale, manufacturingStats, chartVars, chartCalcdVars);

        //handle window resizing
        window.onresize = function() {
            $('div#responsive').show();
        }

        //show interaction prompt
        showPermaLabel({
            "name": 'Click a State'
        },
        { //dummy expressed object
            data: "",
            title: "",
            subtitle: "",
            prefixUnits: "",
            suffixUnits: "",
            round: 1,
        });

    }

}

function joinData(attrs, json, csv) {

    //loop through csv to assign each set of csv attribute values to json region
    for (var i=0; i<csv.length; i++) {
        var csvRegion = csv[i]; //the current region
        var csvKey = csvRegion.adm1_code; //the CSV primary key

        //loop through json regions to find correct region
        for (var j=0; j<json.length; j++){

            var jsonProps = json[j].properties; //the current region json properties
            var jsonKey = jsonProps.adm1_code; //the json primary key

            //where primary keys match, transfer csv data to json properties object
            if (jsonKey == csvKey){
                //assign all attributes and values
                for (k=0; k<attrs.length; k++) {
                     //get csv attribute value
                    var val = parseFloat(csvRegion[attrs[k].data]);
                    //assign attribute and value to json properties
                    if (isNaN(val)) {
                        jsonProps[attrs[k].data] = csvRegion[attrs[k].data];
                    } else {
                        jsonProps[attrs[k].data] = val;
                    }
                }
            }
        }
    }

}

function createColorScale(attrs, expressed, csv, scheme) {

    // Natural Breaks Scale

    var domainArray = [];
    //build array of all values of the expressed attribute
    for (var i=0; i<csv.length; i++){
        var val = parseFloat(csv[i][attrs[expressed].data]);
        domainArray.push(val);
    };

    //create color scale generator
    var colorScale = d3.scale.threshold()
        .range(scheme);

    //assign array of expressed values as scale domain
    colorScale.domain(domainArray);

    //cluster data using ckmeans clustering algorithm to create natural breaks
    var clusters = ss.ckmeans(domainArray, scheme.length);

    //reset domain array to cluster minimums
    domainArray = clusters.map(function(d){
        return d3.min(d);
    });

    //remove first value from domain array to create class breakpoints
    domainArray.shift();

    //assign array of last 4 cluster minimums as domain
    colorScale.domain(domainArray);

    return colorScale;

}

function choropleth(d, colorScale, attr) {
    //make sure attribute value is a number
    var val = parseFloat(d[attr]);
    //if attribute value exists, assign a color; otherwise assign gray
    if (val && val != NaN) {
        return colorScale(val);
    } else { return "#CCC"; };
}
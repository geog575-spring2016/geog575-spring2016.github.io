(function() {
    d3_queue.queue()
        //always load FIPS codes...
        .defer(d3.csv, "data/FIPS.csv")
        .defer(d3.json, "data/counties.geojson") //load choropleth spatial data
        .await(function(error, FIPS, geojson) {

					var visualizations = initializeVisualizations(FIPS, geojson)

            //default datasets
            loadData(visualizations, "Median_Home_Value", "Median_Household_Income");

            setupDataDropdowns(visualizations);
        });

})();

function loadData(visualizations, xDataOption, yDataOption) {
    if (yDataOption == "Uploaded_User_Dataset") {
        loadXDataFromSite(visualizations, xDataOption)
    } else {
        loadDataFromSite(visualizations, xDataOption, yDataOption)
    }
};

function loadXDataFromSite(visualizations, xDataFilename) {
    var xFilename = xDataFilename.replace(/_/g, " ");
    var uploadedFile = document.getElementById("Uploaded_User_Dataset").files[0];
    //handleFile adapted from MounirMesselmeni on github
    function handleFile(file) {
            // Check for the various File API support.
        if (window.FileReader) {
            // FileReader are supported.
            var reader = new FileReader();
            reader.onload = loadHandler;
            reader.onerror = errorHandler;
            reader.readAsText(file)
        } else {
            alert('FileReader is not supported in this browser, so your uploaded user dataset cannot be read.');
        }
    }

    function loadHandler(event) {
        var raw = event.target.result;
        yData = d3.csv.parse(raw)
        d3_queue.queue()
            .defer(d3.csv, "data/" + xDataFilename + ".csv")
            .await(function(error, xData) {
                applyData(visualizations, xFilename, "Uploaded User Dataset", xData, yData)
            })
    }

    function errorHandler(evt) {
        if (evt.target.error.name == "NotReadableError") {
            alert("Cannot read file!");
        }
    }
    handleFile(uploadedFile);
}

function loadDataFromSite(visualizations, xDataFilename, yDataFilename) {
    var xFilename = xDataFilename.replace(/_/g, " ");
    var yFilename = yDataFilename.replace(/_/g, " ");
    d3_queue.queue()
        .defer(d3.csv, "data/" + xDataFilename + ".csv")
        .defer(d3.csv, "data/" + yDataFilename + ".csv")
        .await(function(error, xData, yData) {
            applyData(visualizations, xFilename, yFilename, xData, yData)
        })
};

function applyData(visualizations, xTitle, yTitle, xData, yData) {

    if (xData.length != yData.length) {
        //console.log("Datasets have different numbers of records,");
        alert("Datasets must have same number of records")
    } else if (Object.keys(xData[0]).length != Object.keys(yData[0]).length) {

        //console.log("Dataset features have different number of attributes,");
        console.log("Moving forward without timeseries...");

        updateVisualizations(null, yTitle, xData, 0, yData, 0, false, visualizations);

        $('#slider').slider({
            animate: 1500,
            max: Object.keys(yData[0]).length - 2,
            min: 0,
            value: 0,
            change: function(event, ui) {
                var sliderVal = ui.value;
                console.log(sliderVal);
                updateVisualizations(null, yTitle, xData, 0, yData, 0, sliderVal, visualizations);
            },
        });
        $('#slider').position({
            my: 'left center',
            at: 'left+50 center-100',
            of: window,
        });

        setupTimeseriesAnimation(visualizations);

    } else {

        //console.log("Moving forward with timeseries...");

        updateVisualizations(xTitle, yTitle, xData, 0, yData, 0, true, visualizations);

        $('#slider').slider({
            animate: 1500,
            max: Object.keys(yData[0]).length - 2,
            min: 0,
            value: 0,
            change: function(event, ui) {
                var sliderVal = ui.value;
                console.log(sliderVal);
                updateVisualizations(xTitle, yTitle, xData, sliderVal, yData, sliderVal, true, visualizations);
            },
        });
        $('#slider').position({
            my: 'left center',
            at: 'left+50 center-100',
            of: window,
        });

        setupTimeseriesAnimation(visualizations);

    }

};

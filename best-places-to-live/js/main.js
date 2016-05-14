window.onload = setPage();
//create empty arrays that are globally accessible
var citiesArray = [], rawData = [], rankData = [], attLabels = [], citySearch = [],
    attObjArray = [], checkedAtts = [];

//use different background images based on browser size
var bodywidth = +d3.select("body").attr('width')
    if (window.innerWidth > 1350){
      var background = 'url(../img/largecity.jpg)'
    } else {
      var background = 'url(../img/citymed.jpg)'
    };
//set background image
d3.select("body").style("background", background)

//counters for setting selected city colors
var numSelectedCities = 0;
var colorCounter = 0;
//arrays/default colors for selected cities
var defaultColor = "#aaa";
var colorArray = ['#185a89', '#c95e00', '#258525', '#b92223', '#72449c','#6b4239', '#ca2a99', '#5d5d5d' , '#9fa01d', '#1294a1'];
var colorMaster = [];
colorArray.forEach(function(d){
    var colorObj = new Object();
    colorObj.colorString = d;
    colorObj.inUse = false;
    colorMaster.push(colorObj);
})

function setPage() {
    //set variable to use queue.js to parallelize asynchronous data loading
    var q = d3_queue.queue();
    //use queue to retrieve data from all files
    q
        .defer(d3.json, "data/US.topojson")//load states
        .defer(d3.json, "data/Cities.topojson")
        .defer(d3.csv, "data/Master.csv")
        .defer(d3.csv, "data/Sources.csv")
        .await(callback);
};
//function called once data has been retrieved from all .defer lines
function callback(error, statesData, citiesData, attData, sources){
    //convert topojsons into geojson objects
    var states = topojson.feature(statesData, statesData.objects.US).features;
    var cities = topojson.feature(citiesData, citiesData.objects.collection).features;
    //create attpanel first
    createAttPanel(attData, cities, states, sources);
}

function createAttPanel(attData, cities, states, sources) {

    //set measurements for panel
    var attMargin = {top: 20, right: 10, bottom: 30, left: 10},
    attHeight = 800, //set height to entire window
    attHeight = attHeight - attMargin.top,
    attWidth = 300,//width of attSvg
    attWidth = attWidth - attMargin.left - attMargin.right, //width with margins for padding
    attSpacing = attHeight / 40; //vertical spacing for each attribute

    //array to hold all property names
    var allAttributes = [];

    //push property names from attData into allAttributes array
    for (var keys in attData[0]){
        allAttributes.push(keys);
    };

    //create an array with only properties with Raw values; for PCP display
    rawData = searchStringInArray("Raw", allAttributes);

    //create an array with only properties with Rank values; for calculation
    rankData = searchStringInArray("Rank", allAttributes);
    //create labels for attributes
    attLabels = removeStringFromEnd("_Rank", rankData)
    attLabels = removeUnderscores(attLabels);

    //create array containing only city names to use in search bar in citiesPanel
    citySearch = createSearchArray(attData, rankData);

    //creates array of city objects for now just for testing
    citiesArray = createCitiesArray(attData);

    //creates array of objects with an object for each attribute that also holds weight and checked properties
    attObjArray = createAttObjArray(rankData);

    //empty array to hold length of each label
    var labelLength = [];
    //for loop to push all label lengths into array
    for (i=0; i<rankData.length; i++) {
        var attLength = rankData[i].length;
        labelLength.push(attLength)
    }

    //identify which label is the longest so we can use that as the width in the transform for creating text elements
    var labelWidth = Math.max.apply(Math, labelLength);

    //div container that holds SVG
    var attContainer = d3.select("body").append("div")
        .attr("id", "attContainer")

    //create svg for attpanel
    var attSvg = d3.select("#attContainer").append("svg")
        .attr("class", "attSvg")
        .attr("width", "100%")
        .attr("height", attHeight)
      .append("g")
        .attr("transform", "translate(" + attMargin.left + "," + attMargin.top + ")");// adds padding to group element in SVG
    //sets att title rect
    var attTitleRect = attSvg.append("rect")
        .attr("id", "attTitleRect")
        .attr('x', -10)
        .attr("y", -11)
        .attr("width", '100%')
        .attr("height", 40)
        .text("Attributes")
    //sets att title
    var attTitle = attSvg.append("text")
        .attr("class", "attTitle")
        .attr("x",-3)
        .attr("y", attMargin.top - 5)
        .text("What Do You Care About?")
    //creates checkAll functionality
    var checkAll = attSvg.append("foreignObject")
        .attr('x', -9)
        .attr('y', 50)
        .attr('width', "120px")
        .attr('height', "20px")
      .append("xhtml:body")
        .html(function(d) {
            return "<form action='#'><p><label><input type=checkbox id='checkAll'>  Check All</label></input></form>"
        })
        .on("change", function(){
            //retrieve status of check all checkbox
            var status = $("#checkAll")[0].checked
            // set status of all checkboxes to match check all
            $(":checkbox").prop("checked", status)
            //sets checked property
            attObjArray = setCheckedProp(attObjArray);
            //creates array of only checked attributes
            checkedAtts = checkedAttributes(attData, attObjArray);
            //change label opacity based on what is checked
            changeLabelOpacity();
            //resets color of weight buttons
            resetButtonFill();
            //this is an array containing an object for every city with properties for city name and each selected attribute's rank
            addAttRanks(attData);
            citiesArray = calcScore(attObjArray, checkedAtts, citiesArray, cities, attData);
            // updates city panel
            populateCityPanel();
            //updates map
            updatePropSymbols (cities)
        });
    //creates rect for att header
    var attHeaderRect = attSvg.append("rect")
        .attr("id", "attHeaderRect")
        .attr("height", "1px")
        .attr("width", "100%")
        .attr("y", 73)
        .attr("x", -10)
    //text for att header
    var headerWeight = attSvg.append("text")
        .attr("class", "headerText")
        .attr("id", "headerWeight")
        .attr('x', 180)
        .attr('y', 48)
        .text("Rank its Importance")
    //text for att header
    var headerLeast = attSvg.append("text")
        .attr("class", "headerText")
        .attr("id", "headerLeast")
        .attr('x', 179)
        .attr('y', 68)
        .text("Least")
    //text for att header
    var headerMost = attSvg.append("text")
        .attr("class", "headerText")
        .attr("id", "headerMost")
        .attr('x', 299)
        .attr('y', 68)
        .text("Most")
    //creates a group for each rectangle and offsets each by same amount
    var variables = attSvg.selectAll('.variables')
        .data(attLabels)
        .enter()
      .append("g")
        .attr("class", "variables")
        .attr("transform", function(d, i) {
            var height = labelWidth + attSpacing/1.5;
            var offset =  height * attLabels.length;
            var horz = -labelWidth - 5; //x value for g translate
            var vert = i * height - offset; //y value for g translate
            return 'translate(' + horz + ',' + vert + ')';
      });
    //creates rectangle to hold attribute
    var variableRect = variables.append("rect")
        .attr("class", "variableRect")
        .attr('x', 0)
        .attr('y', 740)
        .attr('width', "450px")
        .attr('height', "28px")
        .attr("id", function(d) {
            //get unique attribute for every variable
            var attribute = createAttID(d, rankData)
            //create ID for checkboxes
            var attID = attribute + "_rect";
            return attID
        })

    //adds text to attribute g
    var attText = variables.append('text')
        .attr("class", "attText")
        .attr("x", attWidth / 5.8)
        .attr("y", attHeight - 20)
        .text(function(d ) { return d })
        .attr("id", function(d) {
            var attribute = createAttID(d, rankData);
            return attribute;
        })
        .on("mouseover", function(d){
            var attribute = createAttID(d, rankData);
            attPopup(attData, attribute);
        })
        .on("mouseout", removeAttPopup)
        .on("mousemove", moveAttLabel);

    //used to place checkbox relative to attText labels
    var textX = d3.select(".attText").attr("x")

    //checkboxes for each attribute
    var checkboxes = variables.append("foreignObject")
        .attr('x', textX - 30)
        .attr('y', attHeight - 36)
        .attr('width', "20px")
        .attr('height', "20px")
      .append("xhtml:body")
        .html(function(d) {
            //get unique attribute for every variable
            var attribute = createAttID(d, rankData)
            //create ID for checkboxes
            var attID = attribute + "_check";
            return "<form><input type=checkbox class='checkbox' id='" + attID + "'</input></form>"
        })
        .on("change", function(d){
            //function updates "checked" property for every attribute
            attObjArray = setCheckedProp(attObjArray);
            //creates array of only checked attributes
            checkedAtts = checkedAttributes(attData, attObjArray);
            //change label opacity based on what is checked
            changeLabelOpacity();

            resetButtonFill();

            addAttRanks(attData);

            citiesArray = calcScore(attObjArray, checkedAtts, citiesArray, cities, attData)
            populateCityPanel()
            updatePropSymbols (cities)

        });


    //define x,y property values for first rectangle
    var x1 = (textX + labelWidth)*3.9
    var y1 = attHeight - 15

    //used to place checkbox relative to attText labels
    var labelX = +d3.select(".attText").attr("x")
    var labelY = +d3.select(".attText").attr("y") - 11

    var infoBack = variables.append("rect")
        .attr("class", "infoBack")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_infoBack";
        })
        .attr("x", function(d){
            //get unique attribute for every variable
            var attribute = createAttID(d, rankData)
            var labelWidth = d3.select("#" + attribute).node().getBBox().width

            return labelX + labelWidth + 5
        })
        .attr('y', labelY)
    //add question mark to rect
    var infoText = variables.append("text")
        .attr("id", "infoText")
        .attr("x", function(d){
            var attribute = createAttID(d, rankData);

            var attID = "#" + attribute + "_infoBack";
            return +d3.select(attID).attr("x") + 3
        })
        .attr("y", labelY + 10)
        .text("?")
    //add clickable rectangle
    var infoClick = variables.append("rect")
        .attr("class", "infoClick")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_infoClick";
        })
        .attr("x", function(d){
            var attribute = createAttID(d, rankData);
            var attID = "#" + attribute + "_infoBack";
            //set x same as back rectangle
            return +d3.select(attID).attr("x")
        })
        .attr("y", labelY)
        .on("click", function(d){
            var attID = this.id;
            //changes click to back in ID string so we can change fill
            var dialogID = "#" + attID.replace("infoClick", "dialog")
            // sourcePopup(d, attID, attribute);
            $(dialogID).dialog( "open" );
        })
    //define x,y property values for first rectangle
    var x1 = (textX + labelWidth)*4.3, y1 = attHeight - 37,
    textX1 = x1 + 6, textY1 = y1 + 16;
    //rect to hold fill
    var backButton1 = variables.append("rect")
        .attr("class", "backButton1")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_backButton1";
        })
        .attr("x", x1)
        .attr("y", y1)
    //text for weight button
    var buttonText1 = variables.append("text")
        .attr("class", "buttonText1")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_buttonText1";
        })
        .attr("x", textX1)
        .attr("y", textY1)
        .text("1")
    //clickable rect
    var clickButton1 = variables.append("rect")
        .attr("class", "clickButton1")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_clickButton1";
        })
        .attr("x", x1)
        .attr("y", y1)
        .on("mouseover", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style({
                stroke: "#3399FF",
                "stroke-width": "2px"
            })
        })
        .on("mouseout", function(){
          //extract ID of whichever rectangle is clicked
          var attID = this.id;
          //changes click to back in ID string so we can change fill
          var rectID = attID.replace("click", "back")
          //change fill
          d3.select("#" + rectID).style("stroke", "none")
        })
        .on("click", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //trim "_rect1" from end of string
            var att = attID.slice(0, -13);

            //loops through all attribute objects and sets weight to 0.5 if appropriate
            for (i=0; i<attObjArray.length; i++){
                if (attObjArray[i].Attribute == att) {
                    attObjArray[i].Weight = 1;
                };
            };

            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style({
                fill: "#3399FF"
              })

            //change fill back to original in case it was colored differently
            var rect2 = rectID.replace("1", "2")
            d3.select("#" + rect2).style("fill", "#999")
            //change fill back to original in case it was colored differently
            var rect3 = rectID.replace("1", "3")
            d3.select("#" + rect3).style("fill", "#aaa")
            //change fill back to original in case it was colored differently
            var rect4 = rectID.replace("1", "4")
            d3.select("#" + rect4).style("fill", "#bbb")
            //change fill back to original in case it was colored differently
            var rect5 = rectID.replace("1", "5")
            d3.select("#" + rect5).style("fill", "#ccc")

            //create variable equal to ID of this attribute
            var checkID = "#" + att + "_check"
            //checks the checkbox for this attribute
            checkThisAtt(checkID);
            //creates array of only checked attributes
            checkedAtts = checkedAttributes(attData, attObjArray);
            //sets the checked property
            attObjArray = setCheckedProp(attObjArray);
            // changes label opacity
            changeLabelOpacity();
            //this is an array containing an object for every city with properties for city name and each selected attribute's rank
            addAttRanks(attData);
            citiesArray = calcScore(attObjArray, checkedAtts, citiesArray, cities, attData)
            populateCityPanel()
            updatePropSymbols (cities)
        });
    //used to place next rectangle relative to previous
    var x2 = +d3.select(".clickButton1").attr("x") + 30,
    textX2 = +d3.select(".buttonText1").attr("x") + 30

    //contains fill of rect
    var backButton2 = variables.append("rect")
        .attr("class", "backButton2")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_backButton2";
        })
        .attr("x", x2)
        .attr("y", y1)
    // contains text of weight rect
    var buttonText2 = variables.append("text")
        .attr("class", "buttonText2")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_buttonText2";
        })
        .attr("x", textX2)
        .attr("y", textY1)
        .text("2")
    //clickable rect
    var clickButton2 = variables.append("rect")
        .attr("class", "clickButton2")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_clickButton2";
        })
        .attr("x", x2)
        .attr("y", y1)
        .on("mouseover", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style({
                stroke: "#3399FF",
                "stroke-width": "2px"
            })
        })
        .on("mouseout", function(){
          //extract ID of whichever rectangle is clicked
          var attID = this.id;
          //changes click to back in ID string so we can change fill
          var rectID = attID.replace("click", "back")
          //change fill
          d3.select("#" + rectID).style("stroke", "none")
        })
        .on("click", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //trim "_rect1" from end of string
            var att = attID.slice(0, -13);

            //loops through all attribute objects and sets weight to 0.5 if appropriate
            for (i=0; i<attObjArray.length; i++){
                if (attObjArray[i].Attribute == att) {
                    attObjArray[i].Weight = 2;
                };
            };

            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style("fill", "#3399FF")

            //change fill back to original in case it was colored differently
            var rect1 = rectID.replace("2", "1")
            d3.select("#" + rect1).style("fill", "#888")
            //change fill back to original in case it was colored differently
            var rect3 = rectID.replace("2", "3")
            d3.select("#" + rect3).style("fill", "#aaa")
            //change fill back to original in case it was colored differently
            var rect4 = rectID.replace("2", "4")
            d3.select("#" + rect4).style("fill", "#bbb")
            //change fill back to original in case it was colored differently
            var rect5 = rectID.replace("2", "5")
            d3.select("#" + rect5).style("fill", "#ccc")

            //create variable equal to ID of this attribute
            var checkID = "#" + att + "_check"
            //checks the checkbox for this attribute
            checkThisAtt(checkID);
            //creates array of only checked attributes
            checkedAtts = checkedAttributes(attData, attObjArray);
            //sets the checked property
            attObjArray = setCheckedProp(attObjArray);
            // changes label opacity
            changeLabelOpacity();

            //this is an array containing an object for every city with properties for city name and each selected attribute's rank
            addAttRanks(attData);
            citiesArray = calcScore(attObjArray, checkedAtts, citiesArray, cities, attData)
            populateCityPanel()
            updatePropSymbols (cities)
        });

    //used to place next rectangle relative to previous
    var x3 = +d3.select(".clickButton2").attr("x") + 30,
    textX3 = +d3.select(".buttonText2").attr("x") + 30


    var backButton3 = variables.append("rect")
        .attr("class", "backButton3")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_backButton3";
        })
        .attr("x", x3)
        .attr("y", y1)

    var buttonText3 = variables.append("text")
        .attr("class", "buttonText3")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_buttonText3";
        })
        .attr("x", textX3)
        .attr("y", textY1)
        .text("3")

    var clickButton3 = variables.append("rect")
        .attr("class", "clickButton3")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_clickButton3";
        })
        .attr("x", x3)
        .attr("y", y1)
        .on("mouseover", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style({
                stroke: "#3399FF",
                "stroke-width": "2px"
            })
        })
        .on("mouseout", function(){
          //extract ID of whichever rectangle is clicked
          var attID = this.id;
          //changes click to back in ID string so we can change fill
          var rectID = attID.replace("click", "back")
          //change fill
          d3.select("#" + rectID).style("stroke", "none")
        })
        .on("click", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //trim "_rect1" from end of string
            var att = attID.slice(0, -13);

            //loops through all attribute objects and sets weight to 0.5 if appropriate
            for (i=0; i<attObjArray.length; i++){
                if (attObjArray[i].Attribute == att) {
                    attObjArray[i].Weight = 3;
                };
            };

            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style("fill", "#3399FF")

            //change fill back to original in case it was colored differently
            var rect1 = rectID.replace("3", "1")
            d3.select("#" + rect1).style("fill", "#888")
            //change fill back to original in case it was colored differently
            var rect2 = rectID.replace("3", "2")
            d3.select("#" + rect2).style("fill", "#999")
            //change fill back to original in case it was colored differently
            var rect4 = rectID.replace("3", "4")
            d3.select("#" + rect4).style("fill", "#bbb")
            //change fill back to original in case it was colored differently
            var rect5 = rectID.replace("3", "5")
            d3.select("#" + rect5).style("fill", "#ccc")

            //create variable equal to ID of this attribute
            var checkID = "#" + att + "_check"
            //checks the checkbox for this attribute
            checkThisAtt(checkID);
            //creates array of only checked attributes
            checkedAtts = checkedAttributes(attData, attObjArray);
            //sets the checked property
            attObjArray = setCheckedProp(attObjArray);
            // changes label opacity
            changeLabelOpacity();
            //this is an array containing an object for every city with properties for city name and each selected attribute's rank
            addAttRanks(attData);
            citiesArray = calcScore(attObjArray, checkedAtts, citiesArray, cities, attData)
            populateCityPanel()
            updatePropSymbols (cities)
        });

    //used to place next rectangle relative to previous
    var x4 = +d3.select(".clickButton3").attr("x") + 30,
    textX4 = +d3.select(".buttonText3").attr("x") + 30


    var backButton4 = variables.append("rect")
        .attr("class", "backButton4")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_backButton4";
        })
        .attr("x", x4)
        .attr("y", y1)

    var buttonText4 = variables.append("text")
        .attr("class", "buttonText4")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_buttonText4";
        })
        .attr("x", textX4)
        .attr("y", textY1)
        .text("4")

    var clickButton4 = variables.append("rect")
        .attr("class", "clickButton4")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_clickButton4";
        })
        .attr("x", x4)
        .attr("y", y1)
        .on("mouseover", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style({
                stroke: "#3399FF",
                "stroke-width": "2px"
            })
        })
        .on("mouseout", function(){
          //extract ID of whichever rectangle is clicked
          var attID = this.id;
          //changes click to back in ID string so we can change fill
          var rectID = attID.replace("click", "back")
          //change fill
          d3.select("#" + rectID).style("stroke", "none")
        })
        .on("click", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //trim "_rect1" from end of string
            var att = attID.slice(0, -13);

            //loops through all attribute objects and sets weight to 0.5 if appropriate
            for (i=0; i<attObjArray.length; i++){
                if (attObjArray[i].Attribute == att) {
                    attObjArray[i].Weight = 4;
                };
            };

            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style("fill", "#3399FF")

            //change fill back to original in case it was colored differently
            var rect1 = rectID.replace("4", "1")
            d3.select("#" + rect1).style("fill", "#888")
            //change fill back to original in case it was colored differently
            var rect2 = rectID.replace("4", "2")
            d3.select("#" + rect2).style("fill", "#999")
            //change fill back to original in case it was colored differently
            var rect3 = rectID.replace("4", "3")
            d3.select("#" + rect3).style("fill", "#aaa")
            //change fill back to original in case it was colored differently
            var rect5 = rectID.replace("4", "5")
            d3.select("#" + rect5).style("fill", "#ccc")

            //create variable equal to ID of this attribute
            var checkID = "#" + att + "_check"
            //checks the checkbox for this attribute
            checkThisAtt(checkID);
            //creates array of only checked attributes
            checkedAtts = checkedAttributes(attData, attObjArray);
            //sets the checked property
            attObjArray = setCheckedProp(attObjArray);
            // changes label opacity
            changeLabelOpacity();
            //this is an array containing an object for every city with properties for city name and each selected attribute's rank
            addAttRanks(attData);
            citiesArray = calcScore(attObjArray, checkedAtts, citiesArray, cities, attData)
            populateCityPanel()
            updatePropSymbols (cities)
        });

    //used to place next rectangle relative to previous
    var x5 = +d3.select(".clickButton4").attr("x") + 30,
    textX5 = +d3.select(".buttonText4").attr("x") + 30


    var backButton5 = variables.append("rect")
        .attr("class", "backButton5")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_backButton5";
        })
        .attr("x", x5)
        .attr("y", y1)

    var buttonText5 = variables.append("text")
        .attr("class", "buttonText5")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_buttonText5";
        })
        .attr("x", textX5)
        .attr("y", textY1)
        .text("5")

    var clickButton5 = variables.append("rect")
        .attr("class", "clickButton5")
        .attr("id", function(d){
            //call function that turns d from label into object property (e.g., "Pet Friendly" becomes "Pet_Friendly_Rank")
            var attribute = createAttID(d, rankData);

            return attribute + "_clickButton5";
        })
        .attr("x", x5)
        .attr("y", y1)
        .on("mouseover", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style({
                stroke: "#3399FF",
                "stroke-width": "2px"
            })
        })
        .on("mouseout", function(){
          //extract ID of whichever rectangle is clicked
          var attID = this.id;
          //changes click to back in ID string so we can change fill
          var rectID = attID.replace("click", "back")
          //change fill
          d3.select("#" + rectID).style("stroke", "none")
        })
        .on("click", function(){
            //extract ID of whichever rectangle is clicked
            var attID = this.id;
            //trim "_rect1" from end of string
            var att = attID.slice(0, -13);

            //loops through all attribute objects and sets weight to 0.5 if appropriate
            for (i=0; i<attObjArray.length; i++){
                if (attObjArray[i].Attribute == att) {
                    attObjArray[i].Weight = 5;
                };
            };
            //changes click to back in ID string so we can change fill
            var rectID = attID.replace("click", "back")
            //change fill
            d3.select("#" + rectID).style("fill", "#3399FF")

            //change fill back to original in case it was colored differently
            var rect1 = rectID.replace("5", "1")
            d3.select("#" + rect1).style("fill", "#888")
            //change fill back to original in case it was colored differently
            var rect2 = rectID.replace("5", "2")
            d3.select("#" + rect2).style("fill", "#999")
            //change fill back to original in case it was colored differently
            var rect3 = rectID.replace("5", "3")
            d3.select("#" + rect3).style("fill", "#aaa")
            //change fill back to original in case it was colored differently
            var rect4 = rectID.replace("5", "4")
            d3.select("#" + rect4).style("fill", "#bbb")


            //create variable equal to ID of this attribute
            var checkID = "#" + att + "_check"
            //checks the checkbox for this attribute
            checkThisAtt(checkID);
            //creates array of only checked attributes
            checkedAtts = checkedAttributes(attData, attObjArray);
            //sets the checked property
            attObjArray = setCheckedProp(attObjArray);
            // changes label opacity
            changeLabelOpacity();
            //this is an array containing an object for every city with properties for city name and each selected attribute's rank
            addAttRanks(attData);
            citiesArray = calcScore(attObjArray, checkedAtts, citiesArray, cities, attData)
            populateCityPanel()
            updatePropSymbols (cities)
       });


    //sets the default atts to be checked
    attObjArray = createDefaultAtts(attObjArray);

    changeLabelOpacity();

    checkedAtts = checkedAttributes(attData, attObjArray);
    //sets buttons as selected/colored correctly
    resetButtonFill();

    //this is an array containing an object for every city with properties for city name and each selected attribute's rank
    addAttRanks(attData);
    citiesArray = calcScore(attObjArray, checkedAtts, citiesArray, cities, attData);

    createCitiesPanel();
    createMap(states, cities);

    createSourceDivs(sources);
};

//creates divs for sources for each attribute
function createSourceDivs(sources){
    //create them in attContainer
    d3.select("#attContainer")
        .data(sources)
        .enter()
      .append("div")
        .attr("class", "dialog")
        .attr("id", function(d){
            //retrieve name of att
            var att = d.Name;
            return att + "_dialog"
        })
        .attr("title", function(d, i){
            // get attribute name
            var att = d.Name;
            // create empty array
            var titleArray = [];
            // push single element into array because removeUnderscores only accepts an array
            titleArray.push(att)
            var title = removeUnderscores(titleArray)
            //remove rank from title
            var newTitle = title[0].slice(0, -5)
            return newTitle
        })
        .html(function(d){
            //background info
            var info = "<p>" + d.Info + "<p>";
            var att = d.Name;
            // create empty array
            var titleArray = [];
            // push single element into array because removeUnderscores only accepts an array
            titleArray.push(att)
            var label = removeUnderscores(titleArray)
            var newLabel = label[0].slice(0, -5)
            //add source link
            var link = "<a href=" + d.Source + " target='_blank'>" + newLabel + "</a>"
            return info + link
        })
        .each(function(d){
            var attID = "#" + this.id;
            $(attID).dialog({//create divs but don't show them by default
                autoOpen: false
            })
        })
};

//changes opacity of attlabel whether it is checked or unchecked
function changeLabelOpacity(){
    attObjArray.map(function(d){
        if (d.Checked == 1){
            d3.select("#" + d.Attribute).style("opacity", "1")
        } else {
            d3.select("#" + d.Attribute).style("opacity", "0.25")
        }

    })
};
//function that returns array of objects containing city name and ID; mostly for testing reordering of cities panel until we implement calculation
function createCitiesArray(attData) {

    citiesArray = [];
    //creates object with city name and ID and pushes them into an array
    attData.map(function(d) { //d is each city object
        var cityObj = {
            City: d.Cities_Included,
            Selected: false
          };
          //push obj into city array
        citiesArray.push(cityObj)
    });
    return citiesArray;
};
//sets the default look of att panel
function createDefaultAtts(attObjArray) {
    //set these as checked by default
    $("#Rent_Income_Ratio_Rank_check")[0].checked = true
    $("#Transit_Rank_check")[0].checked = true

    //updates checked property appropriately
    attObjArray.map(function(d){
        if (d.Attribute == "Rent_Income_Ratio_Rank" || d.Attribute == "Transit_Rank"){
            d.Checked = 1;
        }
    });
    return attObjArray
};
//adds cities ranks for each selected attribute when that att is selected
function addAttRanks(attData) {
    //loop through cities array
    citiesArray.map(function(d){
        //loop through all checked attributes
        for (i=0; i<checkedAtts.length; i++) {
            var property = checkedAtts[i];
            //loop through each city to retrieve ranks
            for (j=0; j<attData.length; j++) {
                //name of city
                var cityIncl = attData[j].Cities_Included;
                //when city in cities array and attData match, extract the attribute in checkedAtts rank
                if (d.City == cityIncl) {
                    //add that property and its rank to citiesArray object for current city
                    d[property] = attData[j][property]
                };
            };
        };
    });
};
//creates array containing names of attributes currently checked
function checkedAttributes(attData, attObjArray){
    //create array to hold attributes that are checked
    checkedAtts = [];
    //loop through each attribute object and add all that are checked to checkedAtts array
    attObjArray.forEach(function(d){
        //if attribute is checked, push it's "Attribute" property to array
        if (d.Checked == 1){
            checkedAtts.push(d.Attribute);
        };
    });

    return checkedAtts;
};

//calculates the min and max rank for a given attribute so scores can be properly assigned
function calcMinMax(attData, attribute){
    //start with min at highest possible and max at lowest possible values
    var min = Infinity,
        max = -Infinity;
    //loops through each object(i.e., city) in array of object
    attData.forEach(function(city){

            //doesn't count 0 as min value
            if (city[attribute] != 0){
                var attValue = +city[attribute];

                //test for min
                if (attValue < min){
                    min = attValue;
                };

                //test for max
                if (attValue > max){
                    max = attValue;
                };
            };
    });

    //return values as an array
    return [min, max]
};
//calculates the min and max final scores so we can assign the correct range values
function calcMinMaxScore(citiesArray, property){
    //start with min at highest possible and max at lowest possible values
    var min = Infinity,
        max = -Infinity;
    //loops through each object(i.e., city) in array of object
    citiesArray.forEach(function(city){
       var attValue = +city[property];

        //doesn't count 0 as min value
        if (attValue != 0){
            //test for min
            if (attValue < min){
                min = attValue;
            };

            //test for max
            if (attValue > max){
                max = attValue;
            };
        };
    });
    // //return values as an array
    return [min, max]
};

//creates map
function createMap(states, cities) {
    //set initial measurements
    var mapWidth = 0.65;
    var width = window.innerWidth * mapWidth;
    var height = window.innerHeight *0.88;

    //div container that holds SVG
    var mapContainer = d3.select("body").append("div")
        .attr("id", "mapContainer")

    var map = d3.select("#mapContainer")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    var g = map.append("g");

    var projection = d3.geo.conicConformal()
      .rotate([98, 0])
      .center([0, 38])
      .parallels([29.5, 45.5])
      .scale(750)
      .translate([width / 1.8, height / 2.8])
      .precision(.1);


    // Create a path generator.
    var path = d3.geo.path()
        .projection(projection);


   // define what happens on zoom
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 2])
        .on("zoom", zoomed);

    //define the radius of the prop symbols.
    // the domain should be the max and min values of the data set
    var radius = d3.scale.sqrt()
            .domain([25, 100])
            .range([2, 30]);

    //add the states to the map
    g.selectAll(".states")
        .data(states)
        .enter()
      .append("path")
        .attr("class", "us_states")
        .attr("d", path);

    //create and place legend
    var legendHeight = height-180;
    var legendRect = map.append("rect")
        .attr("class", "legendRect")
        .attr("height", "85px")
        .attr("width", "80px")
        .attr("x", width - 230)
        .attr("y", legendHeight);

    var legendTitle = map.append("text")
        .attr("class", "legendText")
        .attr("x", width - 225)
        .attr("y", legendHeight + 16)
        .text("Overall Score");

    var legend = map.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 190) + "," + (height - 100) + ")")
      .selectAll("g")
        .data([100, 70, 50])
      .enter().append("g");

    legend.append("circle")
        .attr("cy", function(d) { return -radius(d); })
        .attr("r", radius);

    legend.append("text")
        .attr("y", function(d) { return -2 * radius(d); })
        .attr("dy", "1.3em")
        .text(d3.format(".1s"));

    //function to control when the user zooms
    function zoomed() {

        //restrict panning
        var t = d3.event.translate,
            s = d3.event.scale;
            t[0] = Math.min(width / 2 * (s - 1) + 230 * s, Math.max(width / 2 * (1 - s) - 230 * s, t[0]));
            t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
            zoom.translate(t);



          g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

          //redefine the radius' range to be scaled by the scale
          radius.range([2/d3.event.scale, 30/d3.event.scale]);

          //select all the circles and change the radius and stroke width as the scale changes
          g.selectAll("path")

                .attr('d', path.pointRadius(function(d) {  return radius(d.properties.Score); }))
                .attr("stroke-width", (1/d3.event.scale)*2+"px");

          // legend.attr("r", radius);

    }
    //joins cities topojson to citiesArray/ranks
    joinData(cities);
    //creates and scales circles
    g.selectAll("circles")
        //sort the data so that smaller values go on top (so the small circles appear on top of the big circles)
        .data(cities.sort(function(a, b) { return b.properties.Score - a.properties.Score; }))
        .enter()
      .append("path")
        //set the radius
        .attr('d', path.pointRadius(function(d) {  return radius(d.properties.Score)}))
        //assign the class
        .attr("class", function(d) {
            var city = d.properties.City;
            city = city.replace(/\./g, "");

            return city;
        })
        //assign the location of the city according to coordinates
        .attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
        .attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
        .style("fill", defaultColor)
        .attr("stroke", "white")
        .attr("stroke-width", "2px")
        .attr("opacity", "0.9")
        .on("mouseover", function(d){
            highlightCity(d.properties, true);
        })
        .on("mouseout", function(d){
            dehighlightCity(d.properties);
        })
        .on("mousemove", moveLabel)
        .on("click", function (d){
            selectCity(d.properties.City);
        });
};

//create cities panel for first time
function createCitiesPanel(){
      //sort array of objects in descencing order based on specified property
      citiesArray.sort(function(a, b) { return b.Score - a.Score })

      //set measurements for panel
      var cityMargin = 5,
      cityHeight = 1600,
      cityHeight = cityHeight - cityMargin * 2,
      cityWidth = 400,
      cityWidth = cityWidth - cityMargin * 2,
      citySpacing = cityHeight / 40;

      //conditional to prevent creation of multiple divs
      if(d3.select(".cityContainer").empty() == true){

          //div container that holds SVG
          var cityContainer = d3.select("body").append("div")
              .attr("class", "cityContainer")
              .attr("id", "draggable")
              .call(function(d){ //makes city div draggable
                  $("#draggable").draggable()
              })
          //creates search div
          var searchDiv = cityContainer.append("div")
              .attr("class", "ui-widget")
              .attr("id", "searchDiv")
              .attr("width", "100%")
              .attr("height", titleHeight)
              .html("<label for='tags'>City: </label><input id='tags'>")
          //populates search with array
          $("#tags").autocomplete({
              source: citySearch,
              messages: {
                  noResults: 'City not found',
                  results: function(){}
              },
              select: function(event, ui) {
                  var city = ui.item.value
                  var selection = "#" + city + "_rect"
                  selectCity(city);
              }
          });

      } else {
          //select city container
          var cityContainer = d3.select(".cityContainer");
      };

      //conditional to accont for no attributes being selected; display message
      if (checkedAtts.length == 0) {
          var helpText = cityContainer.append("text")
              .attr("id", "helpText")
              .text("   Select attributes to calculate a city score.")
      } else {
          //remove help text from svg
          d3.select("#helpText").remove()
          //create svg for attpanel
          var citySvg = d3.select(".cityContainer").append("svg")
              .attr("class", "citySvg")
              .attr("width", "100%")
              .attr("height", cityHeight)
            .append("g")
              .attr("transform", "translate(" + cityMargin + "," + cityMargin + ")")// adds padding to group element in SVG
          var rectHeight = 31;

          //sets att title
          var cityTitleRect = citySvg.append("rect")
              .attr("id", "cityTitleRect")
              .attr("y", cityMargin * 5 + 1.5)
              .attr("height", rectHeight)
              .attr("width", "100%")
              .attr("x", -5)

          //used to place checkbox relative to attText labels
          var titleHeight = +d3.select("#cityTitleRect").attr("height") / 2,
          titleWidth = (+d3.select(".citySvg").node().getBBox().width) / 9;
          //adds title
          var cityTitle = citySvg.append("text")
              .attr("id", "cityTitle")
              .attr("x", 0)
              .attr("y", titleHeight*3 + 3)
              .text("Top Ranked Cities")
          //adds rect for header
          var cityHeaderRect = citySvg.append("rect")
              .attr("id", "cityHeaderRect")
              .attr("y", 62)
              .attr("height", rectHeight * .66)
              .style("z-index", 10)
              .attr("x", -5)
              .attr("width", "100%")
          //retrieves height of header
          var headerHeight = +d3.select("#cityHeaderRect").attr("y") + 15;
          //rect to hold styling
          var backButton = citySvg.append("rect")
              .attr("id", "backButton")
              .attr("height", rectHeight * 0.66)
              .attr("width", "96%")
              .attr("y", cityMargin - 3)
          //text of button
          var buttonText = citySvg.append("text")
              .attr("id", "buttonText")
              .attr("y", cityMargin + 13)
              .attr("x", 30)
              .text("Show Selected Cities Only")
          //clickable rect
          var selectButton = citySvg.append("rect")
              .attr("id", "selectButton")
              .attr("height", rectHeight * 0.66)
              .attr("width", "96%")
              .attr("y", cityMargin - 3)
              .on("click", selectCities)
              .on("mouseover", function(){
                  //extract ID of whichever rectangle is clicked
                  var attID = this.id;
                  //changes click to back in ID string so we can change fill
                  var rectID = attID.replace("select", "back")
                  //change fill
                  d3.select("#" + rectID).style({
                      stroke: "#3399FF",
                      "stroke-width": "2px",
                      fill: "#999"
                  })
              })
              .on("mouseout", function(){
                  //extract ID of whichever rectangle is clicked
                  var attID = this.id;
                  //changes click to back in ID string so we can change fill
                  var rectID = attID.replace("select", "back")
                  //change fill
                  d3.select("#" + rectID).style({
                      stroke: "none",
                      fill: "#ccc"
                  })
              })
          //header text
          var headerRank = citySvg.append("text")
              .attr("class", "headerText")
              .attr("id", "headerRank")
              .attr("x", 1)
              .attr("y", headerHeight)
              .text("Rank")

          //header text
          var headerCity = citySvg.append("text")
              .attr("class", "headerText")
              .attr("id", "headerCity")
              .attr("x", 60)
              .attr("y", headerHeight)
              .text("City")

          //headerText
          var headerScore = citySvg.append("text")
              .attr("class", "headerText")
              .attr("id", "headerScore")
              .attr("x", 173)
              .attr("y", headerHeight)
              .text("Score")
    };
    //adds cities to panel
    populateCityPanel();
}


function populateCityPanel(data){
    //removes cities each time this is called
    d3.selectAll(".cities").remove();
    //select city container
    var cityContainer = d3.select(".cityContainer")
    //conditional to accont for no attributes being selected; display message
    if (checkedAtts.length == 0) {
        var helpText = cityContainer.append("text")
            .attr("id", "helpText")
            .text("Select attributes to calculate a city score.")
    } else {

        d3.select("#helpText").remove()
        //select city svg
        var citySvg = d3.select(".citySvg");
        var selectedCities = [];
        //retrieve button text to determine how to populate
        var buttonTextSelect = d3.select("#buttonText")[0][0].innerHTML

        if (buttonTextSelect == "Show All Cities"){ //show only selected cities
            var selectedCities = [];
            citiesArray.map(function(d){
                if (d.Selected == true)
                selectedCities.push(d)
            })
        } else { //show all cities

            selectedCities = citiesArray;
        };

        //sort array of objects in descencing order based on specified property
        selectedCities.sort(function(a, b) { return b.Score - a.Score })


        var rectHeight = 31;
        // creates a group for each rectangle and offsets each by same amount
        var cities = citySvg.selectAll('.cities')
            .data(selectedCities)
            .enter()
          .append("g")
            .attr("class", "cities")
            .attr("id", function(d){
                return d.City + "_group"
            })
            .attr("transform", function(d, i) {
                var horz = 10; //x value for g translate
                var vert = i * 28; //y value for g translate
                return 'translate(' + horz + ',' + vert + ')';
            });
        //holds fill for each city
        var cityRect = cities.append("rect")
            .attr("class", "cityRect")
            .attr("id", function(d){
                var cityID = d.City.replace(/ /g,"_");
                cityID = cityID.replace(/\./g,"");
                return cityID + "_rect";
            })
            .attr("width", "100%")
            .attr("height", (rectHeight / 3) * 2)
            .attr("y", 90)
            .attr("x", -10)
            .on("click", function(d){
              selectCity(d.City);
            })
            .style("fill", function(d){
                if (d.Selected == true){
                    var index = d["Color Index"]
                    return colorArray[index]
                }
            })
            .on("mouseover",function(d){
              highlightCity(d, false)
            })
            .on("mouseout", function(d){
              dehighlightCity(d)
            });

      //used to place checkbox relative to attText labels
      var rectY = +d3.select(".cityRect").attr("y") + 15

      //adds text to attribute g
      var cityRank = cities.append('text')
          .attr("class", "cityRank")
          // .attr("x", attWidth / 5.8)
          .attr("x", 3)
          .attr("y", rectY)
          .text(function(d, i) {return i + 1})
      //adds text to attribute g
      var cityText = cities.append('text')
          .attr("class", "cityText")
          // .attr("x", attWidth / 5.8)
          .attr("x", 40)
          .attr("y", rectY)
          .text(function(d ) { ;return d.City })
          .on("click", function(d){
            selectCity(d.City);
          })
          .on("mouseover",function(d){
            highlightCity(d, false)
          })
          .on("mouseout", function(d){
            dehighlightCity(d)
          });

        //adds text to attribute g
        var cityScore = cities.append('text')
            .attr("class", "cityScore")
            // .attr("x", attWidth / 5.8)
            .attr("x", 170)
            .attr("y", rectY)
            .text(function(d) {return String(d.Score)})
    }
};

//changes city panel after button is clicked for displaying selected cities
function selectCities(){
    //retrieves button text to determin action
    var buttonText = d3.select("#buttonText")[0][0].innerHTML
    if (buttonText == "Show Selected Cities Only"){//will only show selected cities
        var selectedCities = [];
        citiesArray.map(function(d){
            if (d.Selected == true)
            selectedCities.push(d)
        })
        //change button text and text position
        d3.select("#buttonText").text("Show All Cities")
            .attr("x", 70)
        //add proper cities to panel
        populateCityPanel(selectedCities)
    }
    if (buttonText == "Show All Cities") {//shows all cities
        //change button text
        d3.select("#buttonText").text("Show Selected Cities Only")
            .attr("x", 30)
        //add proper cities to panel
        populateCityPanel();
    };
};

//appends selected cities to cities panel appropriately based on text of button
function appendCity(){
    //retireives button text
    var buttonText = d3.select("#buttonText")[0][0].innerHTML
    if (buttonText == "Show All Cities"){ //adds new selected city
        var selectedCities = [];
        citiesArray.map(function(d){
            if (d.Selected == true)
            selectedCities.push(d)
        })
        d3.selectAll(".cities").remove()

        populateCityPanel(selectedCities)
    };
    if (buttonText == "Show Selected Cities Only") { //adds all cities
        populateCityPanel();
    };
};

//creates ID based on attribute
function createAttID(d, rankData) {
    //put d in array because addUnderscores only takes an array
    var arrayD = [d]
    //add underscores back to labels so they match with object properties
    d = addUnderscores(arrayD);
    //returns attribute label followed by _Rank; this way we can access each attribute by its object property
    var attribute = searchStringInArray(d, rankData);
    //return attribute to a string from an array
    attribute = attribute[0];

    return attribute
};

//function to parse properties based on a string
function searchStringInArray (str, strArray) {
    var newArray = [];
    for (var i=0; i<strArray.length; i++) {
        if (strArray[i].match(str)) {
            newArray.push(strArray[i]);
        };
    };
    return newArray;
};

//replaces underscores in property names with spaces
function removeUnderscores(array){
    var newArray = [];
    //remove underscores from strings in array
    for (i=0; i<array.length; i++) {
        var label = array[i]
        label = label.split("_").join(" ") //converts underscores in csv to spaces for display purposes
        newArray.push(label);
    };
    return newArray;
};
//replaces spaces in property names with underscores
function addUnderscores(array){
    var newArray = [];
    //remove underscores from strings in array
    for (i=0; i<array.length; i++) {
        var label = array[i]
        label = label.split(" ").join("_") //converts underscores in csv to spaces for display purposes
        newArray.push(label);
    };
    return newArray;
};
//removes string from end of each element
function removeStringFromEnd(searchStr, array){
    //new array to return
    var newArray = [];
    //length of input string
    var strLength =  searchStr.length;
    //loop through all array elements
    for (i=0; i<array.length; i++) {
            var string = array[i]

            var length = string.length;

            var end = length - strLength;

            var newString = string.slice(0, end);

            newArray.push(newString);
        };
    return newArray;
};

//creates default array for attributes and sets initial values
function createAttObjArray(rankData){
    attObjArray = [];
    for (i=0; i<rankData.length; i++){

        var attObj = {
            Attribute: rankData[i],
            Weight: 3,
            Checked: 0
        }
        attObjArray.push(attObj)
    };

    return attObjArray;
};


function createSearchArray(attData, rankData) {

    var cityArray = [];
    //creates object with city name and ID and pushes them into an array
    attData.map(function(d) { //d is each city object
        var city = d.Cities_Included

        cityArray.push(city)
    });

    return cityArray

}

//function to update the "checked" property on the attribute array every time one is checked
function setCheckedProp(attObjArray) {
    //select all of the checkboxes
    var checked = d3.selectAll(".checkbox");
    //loop through array of checkbox elements
    checked.forEach(function(d) { //d is array of all checkbox elements
        // loop through each checkbox element in array
        for (j=0; j<19; j++) {
            //if the checkbox is checked, do this
            if (d[j].checked == true) {
                //gets ID, which contains attribute name
                var getID = d[j].id;
                //trim "_check" from end of ID string
                var att = getID.slice(0, -6);
                // loop through array of att objects and sets checked property to 1
                for (i=0; i<attObjArray.length; i++){
                    if (attObjArray[i].Attribute == att) {
                        attObjArray[i].Checked = 1;
                    };
                };
            } else { //if the checkbox isn't checked, do this
                var getID = d[j].id;
                //trim "_check" from end of ID string
                var att = getID.slice(0, -6);
                // loop through array of att objects and sets checked property to 0
                for (i=0; i<attObjArray.length; i++){
                    if (attObjArray[i].Attribute == att) {
                        attObjArray[i].Checked = 0;
                    };
                };
            };
        };
    });
    return attObjArray;
}

function calcScore (attObjArray, checkedAtts, citiesArray, cities, attData){
    citiesArray.map(function(city){
        //array to hold individual scores calculated by multiplying the rank score by the weight
        var scoreArray = [];

        //loop through all attributes that are checked
        for (i=0; i<checkedAtts.length; i++){
            var att = checkedAtts[i];
            //finds min/max values for current attribute
            var minMax = calcMinMax(attData, att);
            var min = minMax[0]
            var max = minMax[1]
            //linear scale to reverse the order of ranking (e.g., if 50 cities are ranked, the number 1 ranked city gets a score of 50)
            var rankScale = d3.scale.linear()
                .domain(minMax)
                .range([max, min])

            //loops through array containing weight of all attributes
            attObjArray.map(function(d){
                // retrieves proper object in attObjArray based on the attribute in checkedAtts
                if (d.Attribute == att){
                    //sets attRank = to current city's rank for current attribute
                    var attRank = +city[att]

                    //scales the city's ranking
                    var rankScore = rankScale(attRank)
                    //the scale sets 0 = to 1 greater than the max, this ensures that 0 rank (i.e., NA) gets a 0 rankScore so that it doesn't inflate the actual score
                    if (rankScore > max){
                        rankScore = 0;
                    }
                    //calcs an attScore by multiplying the attribute weight by the rank of the city
                    var attScore = d.Weight * rankScore

                    //pushes the attScore into an array of numbers so an average can be calculated
                    scoreArray.push(attScore)
                }
            })
        }
        //sets score equal to the mean of the array
        var score = +(d3.sum(scoreArray) / scoreArray.length).toFixed(2)
        city["Score"] = score;

    })
    //returns min and max score values as two element array
    var minMax = calcMinMaxScore(citiesArray, "Score");

    // scale raw scores from 25 - 100
    var scoreScale = d3.scale.linear()
        .domain(minMax)
        .range([25, 100])

    //sets Score to scaled score for each city
    citiesArray.map(function(d){
        var score = d.Score

        d["Score"] = +scoreScale(score).toFixed(2)
    })

    return citiesArray
}

function updatePropSymbols (cities){
    joinData(cities);

    var mapWidth = 0.65;
    var width = window.innerWidth * mapWidth;
    var height = window.innerHeight *0.88;


    var radius = d3.scale.sqrt()
        .domain([25, 100])
        .range([2, 30]);

    var projection = d3.geo.conicConformal()
        .rotate([98, 0])
        .center([0, 38])
        .parallels([29.5, 45.5])
        .scale(750)
        .translate([width / 1.8, height / 2.8])
        .precision(.1);

    // Create a path generator.
    var path = d3.geo.path()
        .projection(projection);


     d3.selectAll("path.us_states")
        .transition()
        .delay(0)
        .duration(1000)
        .attr("d", path);

        cities.forEach(function(d){
          var city = d.properties.City;
          city = city.replace(/\./g, "");
          city = city.replace(/ /g, ".");
          d3.select("path." + city)
            .transition()
            .delay(0)
            .duration(1000)
            .attr('d', path.pointRadius(function(d) {
                if (d.properties.Score > 0){
                    return radius(d.properties.Score)
                } else { //sets all circles to radius of 5 when no atts selected
                    return 5
                }
            }))
              // .style("stroke-width", (1/d3.event.scale)*2+"px")
             .attr("display", function (){
               // var inArray =  $.inArray(d.properties.City, citiesArray);
                 var found = false;
                 for(i = 0; i < citiesArray.length; i++){
                  if(citiesArray[i].City == d.properties.City){
                    found = true;
                    break;
                  }
                 }
                 if(found){

                  return "inline";
                 }else{

                  return "none";
                 }

              });
        });

};

function highlightCity(props, showCityLabel){
  var city = props.City;
  city = city.replace(/\./g, "");
  var cityFixed = city.replace(/ /g, ".");
   var selected = d3.selectAll("." + cityFixed)
        .style({
            "stroke": "black",
            "stroke-width": (1/d3.event.scale)*2+"px"
        });
  var cityRect = d3.select("#" + cityFixed + "_rect")
      .style({
          "stroke": "black",
          "stroke-width": "2px"
      });

  if(showCityLabel){
    setCityLabel(props);
  }

}

function dehighlightCity(props){
  var city = props.City;
  city = city.replace(/\./g, "");
  var cityFixed = city.replace(/ /g, ".");

   var selected = d3.selectAll("." + cityFixed)
        .style({
            "stroke": "white",
            "stroke-width": (1/d3.event.scale)*2+"px"
        });
    var cityRect = d3.select("#" + cityFixed + "_rect")
        .style({
            "stroke": "none",
        });

    d3.select(".infolabel")
          .remove();

}

function removeAttPopup(){
  d3.select(".attLabel")
        .remove();
}


function attPopup(attData, attribute){

    var selectedCities = [];

    citiesArray.map(function(d){
        if (d.Selected == true){
            selectedCities.push(d.City)
        }
    })
    //holds cities that are ranked
    var attArray = [];
    //holds cities that are not ranked
    var nrArray = [];
    //loop through every city object
    attData.map(function(d){
        var newArray = [];
        //city in CitiesArray
        var city = d.Cities_Included
        for (i=0; i<selectedCities.length; i++){
            // city in selectedCities array
            var selectedCity = selectedCities[i]

            if (city == selectedCity){
                //creates two element array, with first being the rank and second being the city
                // if city is unranked use NR
                if (+d[attribute] == 0){
                    newArray.push("NR")
                    newArray.push(city)

                } else {
                    newArray.push(+d[attribute])
                    newArray.push(city)
                };
            };
        };
        if (newArray.length ==2){
            //if cit is not ranked, push into nrArray
            if (newArray[0] == "NR"){
                nrArray.push(newArray)
            } else{
              //if city is ranked push into attArray
              attArray.push(newArray);
            }
        }
    });


    //sort array of objects in ascending order based on specified property
    attArray.sort(function(a, b) { return a[0] - b[0] })
    var labelArray = [attribute]
    labelArray = removeStringFromEnd("_Rank", labelArray)
    labelArray = removeUnderscores(labelArray)
    attribute = labelArray[0]
    //label content
    var labelAttribute = "<h1><b>" + attribute + "</b></h1>";

    //create info label div
    var attLabel = d3.select("body")
        .append("div")
        .attr("class", "attLabel")
        .attr("id", attribute + "_label")
        .attr("height", 25 * (selectedCities.length + 1))
        .html(function(){
            var html = labelAttribute
            //conditioanl checks if any cities are selected
            if (selectedCities.length == 0){
                html += "<p class='cityP'>No cities selected</p>"
            } else {
                for(i=0; i<attArray.length; i++){
                    var cityRank = "<p class='cityP'>" + attArray[i][0] + ". " + attArray[i][1] + "</p>"
                    html += cityRank
                }
                for(i=0; i<nrArray.length; i++){
                    var cityRank = "<p class='cityP'>" + nrArray[i][0] + ". " + nrArray[i][1] + "</p>"
                    html += cityRank
                }
            }
          return html
        });
};


function setCityLabel(props){
    //label content
    var label = "";
    citiesArray.forEach(function(d){

      if(d.City == props.City){
        for (var key in d) {
          var keyLabel = key.replace(/_Rank/g, "");
          keyLabel = keyLabel.replace(/_/g, " ");

            if($.inArray(key, checkedAtts) >= 0){
              if (d[key] == 0) {
                  var rank = "NR"
              } else {
                  var rank = d[key]
              }
              label += "<h3><b>" + keyLabel + ": " + rank + "</h3></b><br>";
            }

        }
      }
    })

    var cityLabel = "<h1><b>" + props.name + "</b></h1>";

    var scoreLabel = "<h2>Overall Score: "+ props.Score + "</h2>";

    if(isNaN(props.Score)){
      scoreLabel = "<h2>Select Attributes to Calculate Score</h2>";
      label = "";
    }

    //create info label div
    var infolabel = d3.select("body")
        .append("div")
        .attr({
            "class": "infolabel",
            "id": props.City + "_label"
        })
        .html(cityLabel);

    var scoreDiv = infolabel.append("div")
        .attr("class", "labelname")
        .html(scoreLabel);

    var regionName = infolabel.append("div")
        .attr("class", "labelname")
        .html(label);
};

function moveAttLabel(){
    //get width of label
    var labelWidth = d3.select(".attLabel")
        .node()
        .getBoundingClientRect()
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10,
        y1 = d3.event.clientY - 75,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY - 275;


    //horizontal label coordinate, testing for overflow
    var y = d3.event.clientY > 390  ? y2 : y1;
    //vertical label coordinate, testing for overflow
    var x = d3.event.clientX < 10 ? x2 : x1;

    d3.select(".attLabel")
        .style({
            "left": x + "px",
            "top": y + "px"
        });
};


function moveLabel(){
    //get width of label
    var labelWidth = d3.select(".infolabel")
        .node()
        .getBoundingClientRect()
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10,
        y1 = d3.event.clientY - 75,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY - 250;

    //horizontal label coordinate, testing for overflow
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1;
    //vertical label coordinate, testing for overflow
    var y = d3.event.clientY > 245 ? y2 : y1;

    d3.select(".infolabel")
        .style({
            "left": x + "px",
            "top": y + "px"
        });
};

function joinData(cities){
  cities.forEach(function(d){

     var city = d.properties.City;

      if (city == "Washington"){
        d.properties.City = "Washington D.C.";
        city = "Washington D.C.";
      }
    for(i = 0; i< citiesArray.length; i++){
      var citiesArrayCity = citiesArray[i].City;
      var score = citiesArray[i].Score;


      if(city == citiesArrayCity){

        d.properties["Score"] = score;
      }
    }

  });

}

function selectCity (city){
  city = city.replace(/\./g, "");
  var cityReplaceWithPeriod = city.replace(/ /g, ".");
  var cityReplaceWithUnderscore = city.replace(/ /g, "_");

   d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

  for (i = 0; i < citiesArray.length; i++){

    var citiesArrayCity = citiesArray[i].City.replace(/\./g, "");
    if (city == citiesArrayCity){

      if(isNaN(citiesArray[i]["Score"])){
        return;
      }

      if(citiesArray[i]["Selected"] == true){

        citiesArray[i]["Selected"] = false;
        numSelectedCities--;

        var colorIndex = citiesArray[i]["Color Index"];
        colorMaster[colorIndex].inUse = false;


        var color = defaultColor;
        d3.select("#" + cityReplaceWithUnderscore + "_rect").style("fill", color);

        d3.select("path." + cityReplaceWithPeriod).style({
            "fill": color,
            "stroke": "white"
        });
        //update cities panel based on new selection
        appendCity();
      }else{

        if(numSelectedCities == colorArray.length){
          window.alert("You have selected too many cities.");
        }else{
          citiesArray[i]["Selected"] = true;
          numSelectedCities++;


          while(colorMaster[colorCounter].inUse){

            colorCounter ++;
            if(colorCounter >= colorArray.length){
              colorCounter = 0;
            }
          }
          colorMaster[colorCounter].inUse = true;
          citiesArray[i]["Color Index"] = colorCounter;
          var color = colorMaster[colorCounter].colorString;
          d3.select("#" + cityReplaceWithUnderscore + "_rect").style("fill", color);
          d3.select("path." + cityReplaceWithPeriod)
            .style("fill", color)
           .moveToFront();

          //update cities panel based on new selection
          appendCity();
        }

      }

    }
  }
}

//resets button fill to correct button based on stored weight when att is rechecked
function resetButtonFill(){
    var checked =  d3.selectAll(".checkbox")
    //loops through all checkboxes
    checked.each(function(){
        //if current checkbox is checked, push into checkedAtts array
        if (this.checked != false){
            var checkID = this.id;
            var attribute = checkID.slice(0, -6)
            for (i=0; i<attObjArray.length; i++){
                if (attObjArray[i].Attribute == attribute){
                    var weight = attObjArray[i].Weight;
                    setButtonColor(attribute, weight);
                };
            };
        } else { //if att isn't checked, set all buttons to original colors
            var checkID = this.id;
            var attribute = checkID.slice(0, -6)

            var rectID = attribute + "_backButton3"
            //change fill
            d3.select("#" + rectID).style("fill", "#aaa")

            //change fill back to original in case it was colored differently
            var rect5 = rectID.replace("3", "5")
            d3.select("#" + rect5).style("fill", "#ccc")
            //change fill back to original in case it was colored differently
            var rect4 = rectID.replace("3", "4")
            d3.select("#" + rect4).style("fill", "#bbb")
            //change fill back to original in case it was colored differently
            var rect2 = rectID.replace("3", "2")
            d3.select("#" + rect2).style("fill", "#999")
            //change fill back to original in case it was colored differently
            var rect1 = rectID.replace("3", "1")
            d3.select("#" + rect1).style("fill", "#888")
        }
    })
}

//sets button color based on weight when att is reselected
function setButtonColor(attribute, weight){
    if (weight == 5){
        var rectID = attribute + "_backButton5"
    } else if (weight == 4){
      var rectID = attribute + "_backButton4"
    } else if (weight == 3){
        var rectID = attribute + "_backButton3"
    } else if (weight == 2){
        var rectID = attribute + "_backButton2"
    } else if (weight == 1){
        var rectID = attribute + "_backButton1"
    }

    //change fill
    d3.select("#" + rectID).style("fill", "#3399FF")

};

//checks attribute whe ranking button is clicked
function checkThisAtt(checkID){
    d3.select(checkID).property("checked", true)

    var attribute = checkID.slice(0, -6)
    attribute = attribute.slice(1)

    attObjArray.forEach(function(d){
        //if attribute is checked, push it's "Attribute" property to array
        if (d.Attribute == attribute){
            d.Checked = 1
        };
    });


};

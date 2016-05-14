function initializeDropdown(states, chart, attrs, csv, colors, vars, calcdVars) {

    //add select element
    var dropdown = d3.select("div#content")
        .append("select")
        .attr("class", "dropdown")
        .on('change', function() {
            changeAttribute(states, chart, this.value, attrs, csv, colors, vars, calcdVars);
        });

    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select an attribute");

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attrs)
        .enter()
        .append("option")
        .attr("value", function(d, i){ return i })
        .text(function(d){ return d.title });

    $('.dropdown').position({
        my: 'left top',
        at: 'left+'+(vars.width-22)+' top+52',
        of: '.chart',
    });

    return {
        dropdown: dropdown,
        titleOption: titleOption,
        attrOptions: attrOptions,
    };

}

function changeAttribute(states, chart, attribute, attrs, csv, colors, vars, calcdVars) {

    //recreate color scale
    var colorScale = createColorScale(attrs, attribute, csv, colors);

    styleStates(states, attrs[attribute], colorScale);
    styleChart(chart, attrs[attribute], colorScale, csv, vars, calcdVars);
    permaHighlight(null, null); //call with null arguments to clear permaHighlight
    d3.select(".permaLabel").remove();
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

function showLabel(props, expressed){

    var labelAttribute = generateLabelAttribute(props, expressed);

    var label = d3.select("div#content")
        .append("div")
        .attr({
            "class": "label",
            "id": props.adm1_code + "_label"
        });

    var regionName = label.append("div")
        .attr("class", "labelName")
        .html(props.name);

    var labelInfo = label.append("div")
        .attr("class", "labelInfo")
        .html(labelAttribute);

};

function showPermaLabel(props, expressed){

    var labelAttribute = generateLabelAttribute(props, expressed);

    var label = d3.select("div#content")
        .append("div")
        .attr({
            "class": "permaLabel",
            "id": props.adm1_code + "_label"
        });

    var regionName = label.append("div")
        .attr("class", "labelName")
        .html(props.name);

    var labelInfo = label.append("div")
        .attr("class", "labelInfo")
        .html(labelAttribute);

};

function moveLabel(){

    //get width of label
    var labelWidth = d3.select(".label")
        .node()
        .getBoundingClientRect()
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX - 10,
        y1 = d3.event.clientY - 157,
        x2 = d3.event.clientX - labelWidth - 17,
        y2 = d3.event.clientY + 0;

    //horizontal label coordinate, testing for overflow
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1; 
    //vertical label coordinate, testing for overflow
    var y = d3.event.clientY < 75 ? y2 : y1; 

    d3.select(".label")
        .style({
            "left": x + "px",
            "top": y + "px"
        });

};

function generateLabelAttribute(props, expressed) {

    var value = Math.round(props[expressed.data]*expressed.round)/expressed.round;
    
    if (isNaN(value)) {
        value = '- - -';
    }

    var labelAttribute = "<h1>"
        + '<sup class="units">' + expressed.prefixUnits + "</sup>"
        + value
        + '<span class="units">' + expressed.suffixUnits + "</span>"
        + "</h1>";
        
    return labelAttribute;

}
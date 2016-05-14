/**
    Declare all svg elements in the map

    @return: object of map SVGs
**/
function initializeMap(vars, json) {

    var map = d3.select("div#content")
        .append("svg")
        .attr("class", "map")
        .attr("width", vars.width)
        .attr("height", vars.height);

    var path = defineMapProjection(vars);

    var states = map.selectAll(".states")
        .data(json)
        .enter()
        .append("path")
        .attr("class", function(d){
            return "states " + d.properties.adm1_code;
        })
        .attr("d", path);
        
    var desc = states.append("desc")
        .text('{"stroke": "#000", "stroke-width": "0.5px", "stroke-linecap": "round"}');

    return {
        map: map,
        states: states,
    };

}

function defineMapProjection(vars) {

    //parameters correspond with an appropriate
    //projection for the contiguous USA
    var projection = d3.geo.conicConformal()
        .rotate([98, 0])
        .center([0, 38])
        .parallels([29.5, 45.5])
        .scale(vars.width*1.3)
        .translate([
            (vars.width/2)+vars.x_adjust,
            (vars.height/2)+vars.y_adjust,
        ])
        .precision(0.1);

    var path = d3.geo.path()
        .projection(projection);

    return path;
}

function styleStates(states, expressed, colorScale) {
    states.on("mouseover", function(d){
        highlight(d.properties, expressed);
    })
    .on("mouseout", function(d){
        unhighlight(d.properties);
    })
    .on("click", function(d) {
        permaHighlight(d.properties, expressed);
    })
    .on("mousemove", moveLabel)
    .transition().duration(2000).style("fill", function(d){
        return "#000";
    }).transition().duration(2000).style("fill", function(d){
        return choropleth(d.properties, colorScale, expressed.data);
    });
}

function highlight(props, expressed) {

    //change stroke
    var selected = d3.selectAll("." + props.adm1_code)
        .style({
            "stroke": 'yellow',
            "stroke-width": 3,
        }).each(function() { //bring highlighted element to the front
            this.parentNode.appendChild(this); //by appending it to the end
        });

    resetLayering();
    showLabel(props, expressed);

}

function unhighlight(props) {

    d3.selectAll(".selected").each(function() { //bring highlighted element to the front
        this.parentNode.appendChild(this); //by appending it to the end
    });

     var selected = d3.selectAll("." + props.adm1_code)
        .style({
            "stroke": function(){
                return getStyle(this, "stroke")
            },
            "stroke-width": function(){
                return getStyle(this, "stroke-width")
            }
        });

    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };

    d3.select(".label").remove();
    resetLayering();

}

function permaHighlight(props, expressed) {

    //revert the currently selected bar/state
    //back to old styles
    d3.selectAll(".selected")
        .classed('selected', false)
        .style({
            "stroke": "black",
            "stroke-width": "0.5px",
        })
        //reassign event handlers
        .on("mouseout", function(d) {
            if (d.properties) {
                unhighlight(d.properties);
            } else {
                unhighlight(d);
            }
        });

    //set up new selected bar/state
    if (props != null && expressed != null) {
        var selected = d3.selectAll("." + props.adm1_code)
            .classed('selected', true)
            .style({
                "stroke": "orange",
                "stroke-width": "3px",
            })
            .on("mouseout", function(d) {
                d3.select(".label").remove();
                //retain styling on mouseout
                //even when hovered over again
                d3.selectAll("." + props.adm1_code)
                    .style({
                        "stroke": "orange",
                        "stroke-width": "3px",
                    });
            });

        d3.select(".permaLabel").remove();
        showPermaLabel(props, expressed);
    }
}

function resetLayering() {

    //ensures that the mean line is always on top of other elements
    d3.selectAll(".meanLine").each(function() {
        this.parentNode.appendChild(this);
    });
    d3.selectAll(".meanText").each(function() {
        this.parentNode.appendChild(this);
    });
    d3.selectAll(".meanValueText").each(function() {
        this.parentNode.appendChild(this);
    });

}
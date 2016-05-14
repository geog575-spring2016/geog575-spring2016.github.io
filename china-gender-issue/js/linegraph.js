var years,
	yearFormat = d3.time.format("%Y");

var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 600 - margin.left - margin.right,
	height = 550 - margin.top - margin.bottom;

var x = d3.time.scale()
	.range([0, width]);

var y = d3.scale.linear()
	.range([height, 0]);

var voronoi = d3.geom.voronoi()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.value); })
	.clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);
d3.csv("data/gender_ratio_chart.csv", type, function(error, provinces) {
	callback(error, provinces);
});

function callback(error, provinces) {
	x.domain(d3.extent(years));
	y.domain([90, 140]);

	linegraph.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.svg.axis()
			.scale(x)
			.orient("bottom"));

	linegraph.append("g")
		.attr("class", "axis axis--y")
		.call(d3.svg.axis()
			.scale(y)
			.orient("left"))
		.append("text")
		.attr("x", 4)
		.attr("dy", ".32em")
		.style("font-size", "1.4em")
		.text("Sex-ratio");

	linegraph.append("g")
		.attr("class", "provinces")
		.selectAll("path")
		.data(provinces)
		.enter().append("path")
		.attr("id", function(d) {return "line" + d["region_code"];})
		.attr("d", function(d) { d.line = this; return line(d.values); });

	var focus = linegraph.append("g")
		.attr("transform", "translate(-100,-100)")
		.attr("class", "focus");

	focus.append("circle")
		.attr("r", 3.5);

	focus.append("text")
		.attr("y", -10);

	var voronoiGroup = linegraph.append("g")
		.attr("class", "voronoi");

	voronoiGroup.selectAll("path")
		.data(voronoi(d3.nest()
		.key(function(d) { return x(d.date) + "," + y(d.value); })
		.rollup(function(v) { return v[0]; })
		.entries(d3.merge(provinces.map(function(d) { return d.values; })))
		.map(function(d) { return d.values; })))
		.enter().append("path")
		.attr("d", function(d) { return "M" + d.join("L") + "Z"; })
		.datum(function(d) { return d.point; })
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);

	d3.select("#show-voronoi")
		.property("disabled", false)
		.on("change", function() { voronoiGroup.classed("voronoi--show", this.checked); });

	function mouseover(d) {
		d3.select(d.province.line).classed("province--hover", true);
		d.province.line.parentNode.appendChild(d.province.line);
		focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
		focus.select("text").text(d.province.name);
		//TODO: style later
		d3.select("." + d.province.region_code)
			.style({
				"stroke": "blue",
				"stroke-width": "2"
			});
	}

	function mouseout(d) {
		d3.select(d.province.line).classed("province--hover", false);
		focus.attr("transform", "translate(-100,-100)");
		//TODO: style later
		d3.select("." + d.province.region_code)
			.style("stroke", "#000")
			.style("stroke-width", "0.5px");
	}
};

var line = d3.svg.line()
		.interpolate("monotone")//better curved shape
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.value); });

var linegraph = d3.select(".linegraph").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("class", "linegraph")
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function type(d, i) {
	//read first line, i != 0
	//Object.keys(d) return years of csv data
	if (!i) years = Object.keys(d).map(yearFormat.parse).filter(Number);
	var province = {
		name: d.name,
		region_code: null,
		values: null
	};
	//m is every key in current csv line
	province.region_code = d["region_code"];
	province.values = years.map(function(m) {
		return {
			province: province,
			date: m,
			value: d[yearFormat(m)]
		};
	});
	return province;
}
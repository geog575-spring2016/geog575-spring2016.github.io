
var myTimer;
var hoverAnimationControl = false;

// Declare variables for range slider
var rangeInput = document.getElementById("slider01");
var slider = document.getElementById("sliderInfo");
var sliderValues = [
	[1, 2009],
	[2, 2010],
	[3, 2011],
	[4, 2012],
	[5, 2013],
	[6, 2014]
];


// Event listener to call startUpdate function based on slider value
rangeInput.addEventListener('mouseup', function() {
	slider.innerHTML = sliderValues[rangeInput.value-1][1];
	$('#slider').slider("value", rangeInput.value-1);
});

// function for animation
function initiateAnimation() {
	if (hoverAnimationControl == false) {
		myTimer = setInterval(startAnimation, 1500);

		document.getElementById("playButton").style.background = "#E8E57D";
		hoverAnimationControl = true;
	} else {
		return;
	}
};

function startAnimation(x) {

	if (rangeInput.value == 1) {
		rangeInput.value = 2;
	} else if (rangeInput.value == 2) {
		rangeInput.value = 3;
	} else if (rangeInput.value == 3) {
		rangeInput.value = 4;
	} else if (rangeInput.value == 4) {
		rangeInput.value = 5;
	} else if (rangeInput.value == 5) {
		rangeInput.value = 6;
	} else if (rangeInput.value >= 6) {
		rangeInput.value = 1;
	}
	changeMapOnSlider();

};

function stopAnimation() {
	if (hoverAnimationControl == false) {
		alert("Animation is not running!");
	} else {
		window.clearInterval(myTimer);
		document.getElementById("playButton").style.background = "";
		document.getElementById("playButton").style.color = "";
		hoverAnimationControl = false;
	}
};


function changeMapOnSlider() {
	slider.innerHTML = sliderValues[rangeInput.value-1][1];
	$('#slider').slider("value", rangeInput.value-1);
};





function setupTimeseriesAnimation(visualizations) {
	$('#slider .ui-slider-handle').on('click', function() {

		$('#slider .ui-slider-handle').off('click');
		$('#slider .ui-slider-handle .fa').removeClass('fa-play');

		var intervalID = setInterval(oneAnimationStep, 1500);

		function oneAnimationStep() {

			var prevSliderVal = $('#slider').slider("value");
			$('#slider').slider("value", prevSliderVal+1);

			if (prevSliderVal == $('#slider').slider("option", "max")-1) {

				clearInterval(intervalID);
				setTimeout(function() {
					$('#slider .ui-slider-handle .fa').addClass('fa-fast-backward');
				}, 1500);

				$('#slider .ui-slider-handle').on('click', function() {

					$('#slider').slider("value", $('#slider').slider("option", "min"));
					$('#slider .ui-slider-handle .fa').removeClass('fa-fast-backward').addClass('fa-play');
					$('#slider .ui-slider-handle').off('click');
					setupTimeseriesAnimation(visualizations);

				});
			}

		}

	}).append("<i class='fa fa-play'></i>");

}

function setupDataDropdowns(visualizations) {

	$("#yAxisDropdown").selectmenu({
		width: 230,
		position: { my : "left bottom", at: "left top" },
		change: function(event, ui) {
			loadData(visualizations, $('#xAxisDropdown').val(), ui.item.value);
			$('#slider').slider("destroy");

			//store Y value in variable for map display
			yAxisValue = ui.item.value;
			alterHoveredValues();
			startLoading();
			loadingTimer = setTimeout(stopLoading, 5000); //barbaric I know
			//call choropleth function to update map
			//choropleth(filterHolder);
		},
	});

	$("#xAxisDropdown").selectmenu({
		width: 230,
		position: { my : "left bottom", at: "left top" },
		change: function(event, ui) {
			loadData(visualizations, ui.item.value, $('#yAxisDropdown').val());
			$('#slider').slider("destroy");

			//store X value in variable for map display
			xAxisValue = ui.item.value;
			alterHoveredValues();
			startLoading();
			loadingTimer = setTimeout(stopLoading, 5000); //barbaric I know
			//call choropleth function to update map
			//choropleth(filterHolder);
		},
	});

	$('#dropdownContainer').position({
		my: 'center bottom',
		at: 'left+250 bottom-25',
		of: window,
	});

}

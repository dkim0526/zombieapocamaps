$(document).ready(function() {
	$("#safety_zone_btn").click(openSafetyZones);
	$("#find_resources_btn").click(openFindResources);
	$("#see_analysis_btn").click(openSeeAnalysis);
	$("#survival_kit_btn").click(openSurvivalKit);
	$("#my_profile_btn").click(openProfile);
	$("#navbar_profile_btn").click(openProfile);
	$("#navbar_help_btn").click(openHelp);
	$("#seek_help_btn").click(openHelp);

	openSurvivalKit();

	$(".skill_input").change(updateSkillPercent);
})

function openSafetyZones() {
	openTab($("#safety_zone"), $("#safety_zone_btn"));
}

function openFindResources(){
	openTab($("#find_resources"), $("#find_resources_btn"));
	L.mapbox.accessToken = 'pk.eyJ1IjoiZGtpbTA1MjYiLCJhIjoiY2luczlhOWVmMTB1enVpa2pkc2l5YjR3NSJ9.abwiF1OwuKrew-Xev-y-aQ';
	setTimeout(function(){
	var map = L.mapbox.map('map', 'mapbox.streets')
	.setView([32.8849813, -117.2413856], 15)

	// Start with a fixed marker.
	var fixedMarker = L.marker(new L.LatLng(32.8849813, -117.2413856), {
	    icon: L.mapbox.marker.icon({
	        'marker-color': 'ff8888'
	    })
	}).bindPopup('Mapbox DC').addTo(map);

	// Store the fixedMarker coordinates in a variable.
	var fc = fixedMarker.getLatLng();

	// Create a featureLayer that will hold a marker and linestring.
	var featureLayer = L.mapbox.featureLayer().addTo(map);

	// When a user clicks on the map we want to
	// create a new L.featureGroup that will contain a
	// marker placed where the user selected the map and
	// a linestring that draws itself between the fixedMarkers
	// coordinates and the newly placed marker.
	map.on('click', function(ev) {
		
	    // ev.latlng gives us the coordinates of
	    // the spot clicked on the map.
	    var c = ev.latlng;

	    var geojson = [
	      {
	        "type": "Feature",
	        "geometry": {
	          "type": "Point",
	          "coordinates": [c.lng, c.lat]
	        },
	        "properties": {
	          "marker-color": "#ff8888"
	        }
	      }, {
	        "type": "Feature",
	        "geometry": {
	          "type": "LineString",
	          "coordinates": [
	            [fc.lng, fc.lat],
	            [c.lng, c.lat]
	          ]
	        },
	        "properties": {
	          "stroke": "#000",
	          "stroke-opacity": 0.5,
	          "stroke-width": 4
	        }
	      }
	    ];

	    featureLayer.setGeoJSON(geojson);

	    // Finally, print the distance between these two points
	    // on the screen using distanceTo().
	    var container = document.getElementById('distance');
	    container.innerHTML = (fc.distanceTo(c)).toFixed(0) + 'm';
	})}, 500);


}

function openSeeAnalysis(){
	openTab($("#see_analysis"), $("#see_analysis_btn"));
}

function openSurvivalKit(){
	openTab($("#survival_kit"), $("#survival_kit_btn"));
}

function openProfile(){
	openTab($("#my_profile"), $("#my_profile_btn"));
}

function openHelp(){
	openTab($("#seek_help"), $("#seek_help_btn"));
}

function openTab(panel, button){
	if(!button.hasClass("active-side-btn")){
		$(".btn-sidebar").removeClass("active-side-btn");
		$(".main-panel").css("display", "none");
		$(".side_description").slideUp();
		panel.show("slide", { direction: "left" }, 500);
		button.find(".side_description").slideDown();
		button.addClass("active-side-btn");
	}
}
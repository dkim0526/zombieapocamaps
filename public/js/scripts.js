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

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
directionsService.route({
  origin: document.getElementById('start').value,
  destination: document.getElementById('end').value,
  travelMode: google.maps.TravelMode.DRIVING
}, function(response, status) {
  if (status === google.maps.DirectionsStatus.OK) {
    directionsDisplay.setDirections(response);
  } else {
    window.alert('Directions request failed due to ' + status);
  }
});
}

function openFindResources(){
	openTab($("#find_resources"), $("#find_resources_btn"));
	
	setTimeout(function(){
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 41.85, lng: -87.65}
        });
        directionsDisplay.setMap(map);

        var onChangeHandler = function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
	}, 500);


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
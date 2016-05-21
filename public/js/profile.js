$(document).ready(function() {
	$('.skillbar').each(function(){
		$(this).find('.skillbar-bar').animate({
			width:$(this).attr('data-percent')
		},100)});

	$(".skill_input").change(updateSkillPercent);
	$("#profile_skill_btn").click(openSkills);
	$("#profile_inventory_btn").click(openInventory);
	$("#profile_group_btn").click(openGroups);
	$("#profile_locations_btn").click(openLocations);
})

function openSkills(){
	openPanel($("#profile_information"), $("#profile_skill_btn"));
}
function openInventory(){
	openPanel($("#profile_inventory"), $("#profile_inventory_btn"));
}
function openGroups(){
	openPanel($("#profile_groups"), $("#profile_group_btn"));
}
function openLocations(){
	openPanel($("#profile_locations"), $("#profile_locations_btn"));
	setTimeout(initMap, 200);
}

function openPanel(panel, button){
	if(!button.hasClass("active-profile-btn")){
		$("#profile_tabs button").removeClass("active-profile-btn");
		$(".profile_panel").css("display", "none");
		panel.slideDown();
		button.addClass("active-profile-btn");
	}
}

function getLocation(map){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(location);
			new google.maps.Marker({
	            position: location,
	            map: map
	    	}); 
		});
	}
}

function initMap() {
  // Create center marker at UCSD
  var ucsd_ltlng = {lat:32.8849813, lng:-117.2413856};

  // Create a map object and specify the DOM element for display.
  window.map = new google.maps.Map(document.getElementById('googleMaps'), {
    center: ucsd_ltlng,
    zoom: 15,
    styles: [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}]
  });

  getLocation(map);
   map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
  });
}


function placeMarkerAndPanTo(latLng, map) {
  $("#location_modal").modal("toggle");
   window.marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
  map.panTo(latLng);
}

function updateSkillPercent(event){
	var name = event.target.id.split("_")[0];
	var value = $("#" + event.target.id).val();
	$("#" + name + "_bar").attr('data-percent', value + "%");
	$("#" + name + "_percent").html(value + "%");
	$("#" + name + "_bar").find('.skillbar-bar').animate({
		width:$("#" + name + "_bar").attr('data-percent')// + value / 100
	},500);
}
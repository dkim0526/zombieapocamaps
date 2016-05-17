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
	setTimeout(initMap, 500);
}

function openPanel(panel, button){
	if(!button.hasClass("active-profile-btn")){
		$("#profile_tabs button").removeClass("active-profile-btn");
		$(".profile_panel").css("display", "none");
		panel.slideDown();
		button.addClass("active-profile-btn");
	}
}



function initMap() {
  // Create center marker at UCSD
  var ucsd_ltlng = {lat:32.8849813, lng:-117.2413856};

  // Create a map object and specify the DOM element for display.
  window.map = new google.maps.Map(document.getElementById('googleMaps'), {
    center: ucsd_ltlng,
    zoom: 15
  });

   map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
  });


  var marker = new google.maps.Marker({
      position: ucsd_ltlng,
      map:  window.map,
      title: 'UCSD'
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
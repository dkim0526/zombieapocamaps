$(document).ready(function() {
	$("#safety_zone_btn").click(openSafetyZones);
	$("#find_resources_btn").click(openFindResources);
	$("#see_analysis_btn").click(openSeeAnalysis);
	$("#survival_kit_btn").click(openSurvivalKit);
	$("#my_profile_btn").click(openProfile);
	$("#navbar_profile_btn").click(openProfile);
	$("#navbar_help_btn").click(openHelp);
	$("#seek_help_btn").click(openHelp);

	$(".skill_input").change(updateSkillPercent);
})

function openSafetyZones() {
	openTab($("#safety_zone"), $("#safety_zone_btn"));
}

function openFindResources(){
	openTab($("#find_resources"), $("#find_resources_btn"));
}

function openSeeAnalysis(){
	openTab($("#see_analysis"), $("#see_analysis_btn"));
}

function openSurvivalKit(){
	openTab($("#survival_kit"), $("#survival_kit_btn"));
}

function openProfile(){
	openTab($("#my_profile"), $("#my_profile_btn"));
	$('.skillbar').each(function(){
		$(this).find('.skillbar-bar').animate({
			width:$(this).attr('data-percent')
		},100)});


}


function initMap() {
  // Create center marker at UCSD
  var ucsd_ltlng = {lat:32.8849813, lng:-117.2413856};

  // Create a map object and specify the DOM element for display.
  window.map = new google.maps.Map(document.getElementById('profile_map'), {
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
  $("#photo_modal").modal("toggle");
   window.marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
  map.panTo(latLng);
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


function updateSkillPercent(event){
	var name = event.target.id.split("_")[0];
	var value = $("#" + event.target.id).val();
	console.log($("#" + name + "_bar").attr('data-percent'));
	$("#" + name + "_bar").attr('data-percent', value + "%");
	$("#" + name + "_percent").html(value + "%");
	$("#" + name + "_bar").find('.skillbar-bar').animate({
		width:$("#" + name + "_bar").attr('data-percent')// + value / 100
	},500);
}
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
	.setView([40, -74.50], 9)}, 500);
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
$(document).ready(function() {
	$("#safety_zone_btn").click(openSafetyZones);
	$("#find_resources_btn").click(openFindResources);
	$("#see_analysis_btn").click(openSeeAnalysis);
	$("#survival_kit_btn").click(openSurvivalKit);
	$("#my_profile_btn").click(openProfile);
	$("#navbar_profile_btn").click(openProfile);
	$("#navbar_help_btn").click(openHelp);
	$("#seek_help_btn").click(openHelp);
})

function openSafetyZones() {
	closeCurrent();
	$("#safety_zone").show("slide", { direction: "left" }, 500);
	$("#safety_zone_btn").find(".side_description").slideDown();
	$("#safety_zone_btn").addClass("active-side-btn");
}

function openFindResources(){
	closeCurrent();
	$("#find_resources").show("slide", { direction: "left" }, 500);
	$("#find_resources_btn").find(".side_description").slideDown();
	$("#find_resources_btn").addClass("active-side-btn");
}

function openSeeAnalysis(){
	closeCurrent();
	$("#see_analysis").show("slide", { direction: "left" }, 500);
	$("#see_analysis_btn").find(".side_description").slideDown();
	$("#see_analysis_btn").addClass("active-side-btn");
}

function openSurvivalKit(){
	closeCurrent();
	$("#survival_kit").show("slide", { direction: "left" }, 500);
	$("#survival_kit_btn").find(".side_description").slideDown();
	$("#survival_kit_btn").addClass("active-side-btn");
}

function openProfile(){
	closeCurrent();
	$("#my_profile").show("slide", { direction: "left" }, 500);
	$("#my_profile_btn").find(".side_description").slideDown();
	$("#my_profile_btn").addClass("active-side-btn");
}

function openHelp(){
	closeCurrent();
	$("#seek_help").show("slide", { direction: "left" }, 500);
	$("#seek_help_btn").find(".side_description").slideDown();
	$("#seek_help_btn").addClass("active-side-btn");
}

function closeCurrent(){
	$(".btn-sidebar").removeClass("active-side-btn");
	$(".main-panel").css("display", "none");
	$(".side_description").slideUp();
}
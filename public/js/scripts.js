$(document).ready(function() {
	$("#safety_zone_btn").click(openSafetyZones);
	$("#find_resources_btn").click(openFindResources);
	$("#see_analysis_btn").click(openSeeAnalysis);
	$("#survival_kit_btn").click(openSurvivalKit);
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

function closeCurrent(){
	$(".btn-sidebar").removeClass("active-side-btn");
	$(".main-panel").css("display", "none");
	$(".side_description").slideUp();
}
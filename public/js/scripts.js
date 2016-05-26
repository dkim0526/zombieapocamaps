$(document).ready(function() {
  var map;
  var origin_autocomplete;
  var destination_autocomplete;
	$("#safety_zone_btn").click(openSafetyZones);
	$("#find_resources_btn").click(openFindResources);
	$("#survival_kit_btn").click(openSurvivalKit);
	$("#my_profile_btn").click(openProfile);
	$("#navbar_profile_btn").click(openProfile);
	$("#navbar_help_btn").click(openHelp);
	$("#seek_help_btn").click(openHelp);

	openProfile();

})

function openSurvivalKit(){
	openTab($("#survival_kit"), $("#survival_kit_btn"), "Survival Guide");
}

function openProfile(){
	openTab($("#my_profile"), $("#my_profile_btn"), "My Profile");
  $(".skill_input").change(updateSkillPercent);
}

function openHelp(){
	openTab($("#seek_help"), $("#seek_help_btn"), "Need Help?");
}

function openTab(panel, button, title){
	if(!button.hasClass("active-side-btn")){
		$(".btn-sidebar").removeClass("active-side-btn");
		$(".main-panel").css("display", "none");
		$(".side_description").slideUp();
		panel.show("slide", { direction: "left" }, 500);
		button.find(".side_description").slideDown();
		button.addClass("active-side-btn");
		$("#current_tab_title").html(title);
	}
}
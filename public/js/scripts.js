$(document).ready(function() {
	$("#safety_zone_btn").click(openSafetyZones);
})

function openSafetyZones() {
	$("#safety_zone").css("display", "block");
	$("#safety_zone_btn").find(".side_description").slideDown();
	$("#safety_zone_btn").addClass("active-side-btn");
}

$(document).ready(function() {
	$('.skillbar').each(function(){
		$(this).find('.skillbar-bar').animate({
			width:$(this).attr('data-percent')
		},100)});

	$(".skill_input").change(updateSkillPercent);
	$("#connect_killing_btn").click(openKilling);
	$("#connect_resources_btn").click(openResources);
	$("#connect_health_btn").click(openHealth);
	$("#connect_building_btn").click(openBuilding);
	$("#connect_alliance_btn").click(openAlliances);
	$("#connect_other_btn").click(openOther);
	openKilling();
})

function openKilling(){
	openPanel($("#connect_killing_btn"), "#E6B35A", "#B19148", "#FEF7DD");
}
function openResources(){
	openPanel($("#connect_resources_btn"), "#67BA75", "#648C67", "#DDE7C5");
}
function openHealth(){
	openPanel($("#connect_health_btn"), "#D6A191", "#AD5152", "#FEE0D6");
}
function openBuilding(){
	openPanel($("#connect_building_btn"), "#A985B3", "#623C6D", "#F6E4F1");
}
function openAlliances(){
	openPanel($("#connect_alliance_btn"), "#6395EC", "#0E4D92", "#CCE2EC");
}
function openOther(){
	openPanel($("#connect_other_btn"), "#AD805F", "#7B4E2D", "#F5EBE1");
}
function openPanel(button, color, secondColor, thirdColor){
	if(!button.hasClass("active-profile-btn")){
		$("#profile_tabs button").removeClass("active-profile-btn");
		$("#profile_tabs button").css("background-color", "darkgray");
		button.addClass("active-profile-btn");
		button.css("background-color", color);
		$("#connect_content").css("border", "10px solid " + color);
		$("#question_textarea").css("border-bottom", "3px solid " + secondColor);
		$(".btn-custom").css("border", "4px solid " + secondColor);
		$(".btn-custom").css("color", secondColor);
		$(".btn-custom:hover, .divider").css("background-color",secondColor);
		$(".question").css("border", "2px solid " + color);
		$("#question_wrapper").css("background-color", thirdColor);
		var category = button.attr("id").split("_")[1];
		console.log(category);
		$(".category_field").val(category);
		$(".answer").css("display", "none");
		$(".question").css("display", "none");
		$("." + category).css("display", "block");
		$("#default_item_question").css("display", ($("." + category).length == 0) ? "block" : "none");
	}
}

function getLocation(map){

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
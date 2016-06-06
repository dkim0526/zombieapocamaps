$(document).ready(function() {
	$("#connect_killing_btn").click(openKilling);
	$("#connect_resources_btn").click(openResources);
	$("#connect_health_btn").click(openHealth);
	$("#connect_building_btn").click(openBuilding);
	$("#connect_alliance_btn").click(openAlliances);
	$("#connect_other_btn").click(openOther);
	$("#search_button").click(searchForum);
	$(".expand").click(expandAnswers);
	$(".btn-location").click(addLocation);
	$(".location_remove").click(removeLocation);

	$(".username_field").val($("#hidden_username_field").val());
	$(".photo_field").val($("#hidden_photo_field").val());
	openKilling();
})

var currentCategory="";

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
		$(".answer_textarea").css("border-bottom", "2px solid " + color);
		$(".btn-custom").css("border", "4px solid " + secondColor);
		$(".btn-custom").css("color", secondColor);
		$(".btn-custom:hover, .divider").css("background-color",secondColor);
		$(".question").css("border", "2px solid " + color);
		$("#question_wrapper").css("background-color", thirdColor);
		currentCategory = button.attr("id").split("_")[1];
		$(".category_field").val(currentCategory);
		$(".question").css("display", "none");
		$("." + currentCategory).css("display", "block");
		$("#default_item_question").css("display", ($("." + currentCategory).length == 0) ? "block" : "none");
		$(".answer_options .btn-custom").css("border", "4px solid " + color);
		$(".answer_options .btn-custom").css("color", color);
	}
}

function searchForum(){
	var keyword = $("#search_input_box").val().split(" ");
    $(".question").css("display", "none");
    for( var i = 0; i< keyword.length; i++){
    	var elements = $(".question:contains("+keyword[i]+")");
    	for(var e = 0;e < elements.length; e++){
    		if($(elements[e]).hasClass(currentCategory))
    			$(elements[e]).css("display", "block");
    	}
    }
}

function expandAnswers(event){
	var id = event.target.id.split("_")[1];
    if($("#" + event.target.id).text().trim() == "Show Responses"){
        $("#" + event.target.id).html("<span class='glyphicon glyphicon-chevron-down' id='togexpand_'" + id + "'></span>&nbsp;Hide Responses");
        $("#answers_" + id).slideDown();
    }
    else{
        $("#" + event.target.id).html("<span class='glyphicon glyphicon-chevron-up' id='togexpand_'" + id + "'></span>&nbsp;Show Responses");
        $("#answers_" + id).slideUp();
    }
}

function addLocation(event){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			 $.ajax({
		        type: 'GET',
		        dataType: "json",
		        url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&sensor=false",
		        data: {},
		        success: function(data) {
		        	var addressString = "Unknown Location";
		        	if(data['results'].length > 0){
		        		var address_data = data['results'][0]["address_components"];
		        		addressString = address_data[2].long_name + ", " + address_data[5].short_name;
		        	}
		        	var element = "#" + event.target.id.split("_")[0];
		        	$(element + "_location_wrapper").html("Location: " + addressString);
		        	$(element + "_location").val(addressString);
		        	$(element + "_location_button").css("display", "none");
		        	$(element + "_location_remove").css("display", "inline-block");
		        },
		        error: function (e) { alert(e); }
		    });
		});
	}
}

function removeLocation(event){
	var element = "#" + event.target.id.split("_")[0];
	$(element + "_location_remove").css("display", "none");
	$(element + "_location_button").css("display", "inline-block");
	$(element + "_location_wrapper").html("");
	$(element + "_location").val("");
}
$(document).ready(function() {
	$("#safety_zone_btn").click(openSafetyZones);
	$("#find_resources_btn").click(openFindResources);
	$("#survival_kit_btn").click(openSurvivalKit);
	$("#my_profile_btn").click(openProfile);
	$("#navbar_profile_btn").click(openProfile);
	$("#navbar_help_btn").click(openHelp);
	$("#seek_help_btn").click(openHelp);

	openSurvivalKit();

	
})

var markers = [];
function createMarker(latlng, map, self){
	var marker = new google.maps.Marker({
        position: latlng,
        map: map
    });
    if(!self){
    	google.maps.event.addListener(marker, 'click', function(){getRouteFromClick(map, marker);});
    	markers.push(marker);
    }
}

function geoCodeMarkers(addresses, map){
	for(var x = 0; x < addresses.length; x++) {
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+addresses[x]+'&sensor=false', null, function (data) {
            var p = data.results[0].geometry.location
            var latlng = new google.maps.LatLng(p.lat, p.lng);
	        createMarker(latlng, map, false);
        });
	}
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, start, end) {
directionsService.route({
  origin: start,
  destination: end,
  travelMode: google.maps.TravelMode.DRIVING
}, function(response, status) {
  if (status === google.maps.DirectionsStatus.OK) {
    directionsDisplay.setDirections(response);
  } else {
    window.alert('Directions request failed due to ' + status);
  }
});
}

function getLocation(map){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(location);
			createMarker(location, map, true);
		});
	}
}

function getRouteFromClick(map, marker){
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionsDisplay.setMap(map);
    if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			calculateAndDisplayRoute(directionsService, directionsDisplay, location, marker.position);
		});
	}
}

function clearMarkers() {
    setMapOnAll(null);
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function sortByResource(name, map){
	deleteMarkers();
	var resultArray = [];
	var test1 = ['San Diego, CA'];
	var test2 = ['Los Angeles, CA'];
	var test3 = ['Las Vegas, NV'];
	var test4 = ['Sacramento, CA'];
	switch(name){
		case 'Food': resultArray = test1; console.log("In 1");break;
		case 'Water': resultArray = test2; console.log("In 2");break;
		case 'Transportation': resultArray = test3; console.log("In 3");break;
		case 'Supplies': resultArray = test4; console.log("In 4");break;
	}

	geoCodeMarkers(resultArray, map);
}

function openFindResources(){
	openTab($("#find_resources"), $("#find_resources_btn"), "Find Resources");

	setTimeout(function(){
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 41.85, lng: -87.65},
          styles: [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}]
        });
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var icons = {
          food: {
            name: 'Food',
            icon: iconBase + 'parking_lot_maps.png'
          },
          water: {
            name: 'Water',
            icon: iconBase + 'library_maps.png'
          },
          transportation: {
            name: 'Transportation',
            icon: iconBase + 'info-i_maps.png'
          },
          supplies: {
            name: 'Supplies',
            icon: iconBase + 'info-i_maps.png'
          }
        };
        
        var divLegend = document.createElement('div');
		var legend = document.getElementById('find_resources').appendChild(divLegend);
		legend.setAttribute("id", "legend");

        for (var key in icons) {
          var type = icons[key];
          var name = type.name;
          var icon = type.icon;
          var div = document.createElement('div');
          div.name = name;
          console.log(legend);
          div.addEventListener("click", function(){sortByResource(this.name, map);});
          div.innerHTML = '<img src="' + icon + '"> ' + name;
          legend.appendChild(div);
        }
        var userLocation = getLocation(map);
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
        var addresses = ['2182 Avenida De La Playa La Jolla, CA 92037', '2236 Avenida De La Playa La Jolla, CA 92037', '4646 Convoy St San Diego, CA 92111'];
        geoCodeMarkers(addresses, map);
	}, 200);
}

function openSurvivalKit(){
	openTab($("#survival_kit"), $("#survival_kit_btn"), "Survival Guide");
}

function openProfile(){
	openTab($("#my_profile"), $("#my_profile_btn"), "My Profile");
  $(".skill_input").change(updateSkillPercent);
}

function openSafetyZones() {
	openTab($("#safety_zone"), $("#safety_zone_btn"), "Safe Zones");
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
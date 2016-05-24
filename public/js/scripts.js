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
  var nameStr = '';
  switch(name){
    case 'Food and Water': nameStr = "food_water"; break;
    case 'Health': nameStr = "health"; break;
    case 'Supplies': nameStr = "supplies"; break;
  }

  getDataFromDelphi(nameStr, map);
}

function getDataFromDelphi(typeOfQuery, map){
  var addresses = [];
  d3.json("/delphidata_" + typeOfQuery, function(err, data){
    addresses = makeAddressList(data);
        geoCodeMarkers(addresses, map);
    });
}

function makeAddressList(array){
  var addressString = "";
  var returnArray = [];
  for(var i = 0; i < array.length; i++){
    addressString = array[i]["address"] + ', ' + array[i]["city"] + ' CA';
    returnArray.push(addressString);
  }
  console.log(returnArray);
  return returnArray;
}

function openFindResources(){
	openTab($("#find_resources"), $("#find_resources_btn"), "Find Resources");

	setTimeout(function(){
        var origin_place_id = null;
        var destination_place_id = null;
        var travel_mode = google.maps.TravelMode.WALKING;
        map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          zoom: 13,
          center: {lat: 32.8849813, lng: -117.2413856},
          styles: [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}]
        });
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var icons = {
          foodAndWater: {
            name: 'Food and Water',
            icon: iconBase + 'info-i_maps.png'
          },
          health: {
            name: 'Health',
            icon: iconBase + 'info-i_maps.png'
          },
          supplies: {
            name: 'Supplies',
            icon: iconBase + 'info-i_maps.png'
          }
        };

      var transitLayer = new google.maps.TransitLayer();
      transitLayer.setMap(map);
      var bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(map);
      var trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);

      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(map);

      var origin_input = document.getElementById('origin-input');
      var destination_input = document.getElementById('destination-input');
      var modes = document.getElementById('mode-selector');
      if(origin_input)
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
      if(destination_input){
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
        destination_autocomplete =
         new google.maps.places.Autocomplete(destination_input);
        destination_autocomplete.bindTo('bounds', map);
      }
      if(origin_input){
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);
        origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
      }
      

      
      

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      function setupClickListener(id, mode) {
        var radioButton = document.getElementById(id);
        if(radioButton){
          radioButton.addEventListener('click', function() {
            travel_mode = mode;
          });
        }
      }
      setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
      setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
      setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

      function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
      }

      origin_autocomplete.addListener('place_changed', function() {
        var place = origin_autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }
        expandViewportToFitPlace(map, place);

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        origin_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode,
              directionsService, directionsDisplay);
      });

      destination_autocomplete.addListener('place_changed', function() {
        var place = destination_autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }
        expandViewportToFitPlace(map, place);

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        destination_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode,
              directionsService, directionsDisplay);

      });

      function route(origin_place_id, destination_place_id, travel_mode,
                     directionsService, directionsDisplay) {
        if (!origin_place_id || !destination_place_id) {
          return;
        }
        directionsService.route({
          origin: {'placeId': origin_place_id},
          destination: {'placeId': destination_place_id},
          travelMode: travel_mode
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

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
        
        getDataFromDelphi("health", map);
        
        google.maps.event.addDomListener(window,'resize',openFindResources);
        google.maps.event.addDomListener(window, 'load', openFindResources); 
	}, 200);
}

function openSurvivalKit(){
	openTab($("#survival_kit"), $("#survival_kit_btn"), "Survival Guide");
}

function openProfile(){
	openTab($("#my_profile"), $("#my_profile_btn"), "My Profile");
  $(".skill_input").change(updateSkillPercent);
}

var firstClick = true;
function openSafetyZones() {
  openTab($("#safety_zone"), $("#safety_zone_btn"), "Safe Zones");
  if(firstClick){
    displayChart();
    firstClick = false;
  }
}
function displayChart(){  
  var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 600,
    //viewBoxSize: => use @default
    innerRadius: 600 / 3.5,
    //outerRadius: => use @default
    radiusMin: 50,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default
    data: {
      items: [
        {text: "Chula Vista", count: "236"},
        {text: "Mira Mesa", count: "382"},
        {text: "La Jolla", count: "170"},
        {text: "Kearny Mesa", count: "123"},
        {text: "Oceanside", count: "12"},
        {text: "Carlsbad", count: "170"},
        {text: "Del Mar", count: "382"},
        {text: "Pacific Beach", count: "10"},
        {text: "Poway", count: "170"},
      ],
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: {
          text: "(See more detail)",
          style: {
            "font-size": "12px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            //"font-weight": "700",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
          centralClick: function() {
            alert("Here is more details!!");
          }
        }
      },
      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "count",
              classed: {count: true},
              style: {
                "font-size": "28px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "text",
              classed: {text: true},
              style: {
                "font-size": "14px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
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
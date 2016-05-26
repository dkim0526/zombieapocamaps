var markers = [];

// Creates marker and puts it on the map based on lat and long. If
// it is the user, do not add a click listener
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

// This function translates the addresses into geocodes so that they can be placed on the map
function geoCodeMarkers(addresses, map){
  console.log("Loading " + addresses.length + " addresses...");
  $.each(addresses, function(index, address){
        setTimeout(function(){
         $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+address.toString() + '&sensor=false', null, function (data) {
            }).done(function(data){
                 var p = data.results[0].geometry.location;
                var latlng = new google.maps.LatLng(p.lat, p.lng);
                createMarker(latlng, map, false);
            });
          if(index == this.length-1){
            console.log("DONE!");
          }
       }, 1000 * parseInt(index / 10));
  });
}

// Calculates the route between two points and displays it on the map.
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

// Gets user's current location and place marker on map
function getUserLocation(map){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(location);
			createMarker(location, map, true);
		});
	}
}

// Adds click listener to markers and calculates route between user and clicked marker.
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

// Get rid of markers on map. Used when filtering options on map
function clearMarkers() {
    setMapOnAll(null);
}

// Give all the markers on the map a certain attribute
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Delete all the markers on map
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

// Sort options based off of what was clicked on the legend.
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

// Gets information from Delphi and puts it onto map.
function getDataFromDelphi(typeOfQuery, map){
  var addresses = [];
  d3.json("/delphidata_" + typeOfQuery, function(err, data){
    addresses = makeAddressList(data);
        geoCodeMarkers(addresses, map);
    });
}

// Create a list of readable addresses based off of the unordered data obtained from delphi
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
        var userLocation = getUserLocation(map);
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

        getDataFromDelphi("health", map);

        google.maps.event.addDomListener(window,'resize',openFindResources);
        google.maps.event.addDomListener(window, 'load', openFindResources);
	}, 200);
}
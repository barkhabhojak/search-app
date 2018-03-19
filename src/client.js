var currLat = 0;
var currLong = 0;
var placeSearch;
var autocomplete;

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
	(document.getElementById('loc')),
      {types: ['geocode']});
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  var place = autocomplete.getPlace();

  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
  }
}

function geolocate() {
  var geolocation = {
    lat: currLat,
    lng: currLong
  };
  var circle = new google.maps.Circle({
    center: geolocation,
    radius: 2
  });
  autocomplete.setBounds(circle.getBounds());
}

function getIpAddress() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST","http://ip-api.com/json",false);
	xmlhttp.send();
	var ipr = xmlhttp.responseText;
	var ipJson = JSON.parse(ipr);
	if (ipJson.status === 'fail') {
		alert('Cannot find current location. Please refresh the page.');
	}
	else if (ipJson.status === 'suceess') {
		console.log("Found current IP");
	}
	currLat = ipJson.lat;
	currLong = ipJson.lon;
	document.getElementById('currLocation').value = "curr-loc-" + ipJson.lat + "," + ipJson.lon;
	//console.log("lat and long " + document.getElementById('other-loc').value);
	initAutocomplete();
}


function changeColor(truth) {
	//console.log('changeColor ' + truth);
	if (truth){
		document.getElementById('loc').disabled = false;
		document.getElementById('loc').style.backgroundColor = "white";
	}
	else {
		document.getElementById('loc').disabled = true;
		document.getElementById('loc').style.backgroundColor = "#e9ecef";
		document.getElementById('err-loc').style.display = "none";
		document.getElementById('loc').classList.remove("danger-error");
	}
}

function enableSearch(i) {
	var a = validateLoc();
	var b = validateKey();
	if (a && b) {
		document.getElementById('search').disabled = false;
	}
	else {
		document.getElementById('search').disabled = true;
	}
}

function validateLoc() {
	console.log('validateLoc');
	var key = document.getElementById('inputForm').elements['locOpt'].value;
	if (key === "other-loc") {
		key = document.getElementById('inputForm').elements['loc'].value;
		key = key.replace(/\s/g, '');
		var test = /^\w+$/i.test(key);
		if (!test) {
			document.getElementById('err-loc').style.display = "block";
			document.getElementById('loc').classList.add("danger-error");
			return false;
		}
		else if (test) {
			document.getElementById('err-loc').style.display = "none";
			document.getElementById('loc').classList.remove("danger-error");
			return true;
		}
	}
	else {
		if (key.indexOf('curr-loc') !== -1) {
			return true;
		}
		else {
			return false;
		}
	}

}

function validateKey() {
	var key = document.getElementById('inputForm').elements['keyword'].value;
	key = key.replace(/\s/g, '');
	var test = /^\w+$/i.test(key);
	if (!test) {
		document.getElementById('err-key').style.display = "block";
		document.getElementById('keyword').classList.add("danger-error");
		return false;
	}
	else if(test) {
		document.getElementById('err-key').style.display = "none";
		document.getElementById('keyword').classList.remove("danger-error");
		return true;
	}			
}


function formTable() {
	console.log('form table');
}


$(function(){
  $('form[name=inputForm]').submit(function(){
    $.post($(this).attr('action'), $(this).serialize(), function(json) {
    	console.log("check");
      console.log(json);
    }, 'json');
    return false;
  });
});

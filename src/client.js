var currLat = 0;
var currLong = 0;
var placeSearch;
var autocomplete;
var nextPageToken = [];
var keyword, category, distance, loc, radioBtnChecked;

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

function saveValues() {
	keyword = document.getElementById('keyword').value;
	category = document.getElementById('cat').value;
	distance =  document.getElementById('dist').value
	if (document.getElementById('currLocation').checked == true) {
		radioBtnChecked = "currLocation";
	}
	else {
		radioBtnChecked = "other-loc";
		loc = document.getElementById('loc').value;
	}
}

function getUrl() {
	var url = "";
	if (document.getElementById('currLocation').checked == true) {
		url = "/result?keyw=" + document.getElementById('keyword').value + "&category=" + document.getElementById('cat').value + "&distance=" + document.getElementById('dist').value + "&locOpt=" + document.getElementById('currLocation').value
	}
	else {
		url = "/result?keyw=" + document.getElementById('keyword').value + "&category=" + document.getElementById('cat').value + "&distance=" + document.getElementById('dist').value + "&locOpt=other-loc&loc=" + document.getElementById('loc').value;
	}
	url = url.replaceAll(' ','+');
	return url;
}

function progressBarSim() {
	var progress = document.getElementById('progress');
	var counter = 5;
	var pro = 25;

	var id = setInterval(frame, 50);

	function frame() {
		if(pro === 500 && counter == 100) {
			clearInterval(id);
		} else {
			pro += 5;
			counter += 1;
			var temp = pro/5;
			console.log("check " + temp + "%");
			progress.style.width = temp + "%";
		}
	}
}

function submitForm() {
	document.getElementById('res-area').innerHTML = "<div class='progress'><div id='progress' class='progress-bar' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div></div>";
	progressBarSim();
	saveValues();
	var url = getUrl();
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	var ipr = xmlhttp.responseText;
	var responseObj = JSON.parse(ipr);
	var a = setTimeout(function() {formTable(responseObj,0);},5000);
}

function formTable(obj,ind) {
	console.log("index = ", ind);
	console.log("obj = ", obj);
	if (obj.status === "OK" && obj.results.length > 0) {
		var tab = "<div class='wrapper-div'><table class='table'><thead><tr><th scope='col'>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorites</th><th>Details</th></tr></thead><tbody>";

		for (var i = 0; i < obj.results.length; i++) {
			var cnt = i+1+ind*20;
			tab += "<tr><td scope='row'>"+ cnt +"</td>";
			tab += "<td>" + "<img src='" + obj.results[i].icon + "' style='height:25px;width:25px'>" + "</td>";
			tab += "<td>" + obj.results[i].name + "</td>";
			tab += "<td>" + obj.results[i].vicinity + "</td>";
			tab += "<td>" + "<button class='btn'><i class='fa fa-star' style='font-size:20px'></i></button>" + "</td>";
			tab += "<td>" + "<button class='btn'><i class='fa fa-arrow-right' style='font-size:20px'></i></button>" + "</td>";
			tab += "</tr>";
		}

		if (obj.next_page_token !== undefined && ind === 0) {
			nextPageToken[ind] = obj.next_page_token;
			var temp = obj.next_page_token + "," + ind;
			tab += "</tbody></table>" + "<div class='btn-nxt'><button class='btn' onclick=\"(getNextPage('" + temp + " '))\">Next</button>" + "</div></div>"
		}
		else if (obj.next_page_token !== undefined && ind !== 0) {
			nextPageToken[ind] = obj.next_page_token;
			var temp = obj.next_page_token + "," + ind;
			tab += "</tbody></table>" + "<div class='btn-nxt'><button class='btn' onclick=\"(getPrevPage('" + temp + " '))\">Previous</button>" + "<button class='btn' onclick=\"(getNextPage('" + temp + " '))\">Next</button>" + "</div></div>"

		}
		else if (ind !== 0 && obj.next_page_token === undefined) {
			var temp = obj.next_page_token + "," + ind;
			tab += "</tbody></table>" + "<div class='btn-nxt'><button class='btn' onclick=\"(getPrevPage('" + temp + " '))\">Previous</button>" + "</div></div>"
		}
		else {
			tab += "</tbody></table></div>";
		}

		document.getElementById('res-area').innerHTML = tab;
	}

	else if (obj.results.length === 0 || obj.status === 'ZERO_RESULTS') {
		document.getElementById('res-area').innerHTML = "<div class='alert alert-warning wrapper-div'>No results found.</div>";
	}

	else if (obj.status !== "OK") {
		document.getElementById('res-area').innerHTML = "<div class='alert alert-danger wrapper-div'>Failed to get search results.</div>";
	}

}

function getNextPage(str) {
	console.log("next page");
	var token = str.split(',')[0];
	var ind = parseInt(str.split(',')[1]);
	var url = "/result?next_page_token=" + token;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	var ipr = xmlhttp.responseText;
	var responseObj = JSON.parse(ipr);
	ind = ind + 1;
	formTable(responseObj,ind);
}

function getPrevPage(str) {
	var token = str.split(',')[0];
	var ind = parseInt(str.split(',')[1]);
	if (ind - 2 >= 0) {
		token = nextPageToken[ind-2];
		var url = "/result?next_page_token=" + token;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		var ipr = xmlhttp.responseText;
		var responseObj = JSON.parse(ipr);
		responseObj.next_page_token = nextPageToken[ind-1];
		ind = ind - 1;
		formTable(responseObj,ind);
	}
	else {
		var url = getUrl();
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		var ipr = xmlhttp.responseText;
		var responseObj = JSON.parse(ipr);
		formTable(responseObj,0);
	}

}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var currLat = 0;
var currLong = 0;
var placeSearch;
var autocomplete;
var nextPageToken = [];
var keyword, category, distance, loc, radioBtnChecked;
var getI = false;
var detailsClickedAtLeastOnce = false;
var toggle = true;
var detailsHtml = [];
var favoriteList = [];
var prevClick = "";
var markers = [];
var debug = false;
var reviewsArrGoogle = [];
var reviewsArrYelp = [];

//Google autocomplete functions
function initAutocomplete(ind) {
	if (ind === 1) {
	  autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('loc')),
	      {types: ['geocode']});
	  autocomplete.addListener('place_changed', fillInAddress);
	}
	else {
	  autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('from-map')),
	      {types: ['geocode']});
	  autocomplete.addListener('place_changed', fillInAddress);		
	}
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

function clearVar() {
	nextPageToken = [];
	reviewsArrYelp = [];
	markers = [];
	keyword = "";
	category = "";
	distance = "";
	loc = "";
	radioBtnChecked = "";
	detailsClickedAtLeastOnce = false;
	toggle = true;
	detailsHtml = [];
	favorites = [];
	prevClick = "";
	reviewsArrGoogle = [];
}

// Form related functions and validation
function clearBelow() {
	clearVar();
	//saveValues(2);
	if (document.getElementById('loc').classList.contains("danger-error")) {
		document.getElementById('loc').classList.remove("danger-error");
	}
	if (document.getElementById('keyword').classList.contains("danger-error")) {
		document.getElementById('keyword').classList.remove("danger-error");
	}
	if (document.getElementById('err-key')) {
		document.getElementById('err-key').style.display = "none";
	}
	if (document.getElementById('err-loc')) {
		document.getElementById('err-loc').style.display = "none";
	}
	document.getElementById('search').disabled = true;
	document.getElementById('resArea').innerHTML = "";
	document.getElementById('placeDetails').innerHTML = "";
	document.getElementById('favoritesArea').innerHTML =  "<div class='alert alert-warning wrapper-div'>No records.</div>";
	document.getElementById('totalDetails').innerHTML = "";
}

function getIpAddress() {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://ip-api.com/json";
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	var ipr = xmlhttp.responseText;
	var ipJson = JSON.parse(ipr);
	if (ipJson.status === 'fail') {
		alert('Cannot find current location. Please refresh the page.');
	}
	else if (ipJson.status === 'suceess') {
		if (debug)
			console.log("Found current IP");
	}
	currLat = ipJson.lat;
	currLong = ipJson.lon;
	document.getElementById('currLocation').value = "curr-loc-" + ipJson.lat + "," + ipJson.lon;
	if (debug) {console.log("check value = ", document.getElementById('currLocation').value)};
	getI = true;
	initAutocomplete(1);
  	updateFavPage();
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
	if (debug) {console.log("validate location value = ", a);}
	var b = validateKey();
	if (debug) {console.log("validate key value = ", b);}
	if (a && b && getI) {
		document.getElementById('search').disabled = false;
	}
	else {
		document.getElementById('search').disabled = true;
	}
}

function checkOther() {
	var key = document.getElementById('inputForm').elements['loc'].value;
	key = key.replace(/\s/g, '');
	key = key.replaceAll(',','');
	key = key.replaceAll('\'','');
	var test = /^\w+$/i.test(key);
	if (!test) {
		document.getElementById('search').disabled = true;
	}
	else {
		document.getElementById('search').disabled = false;
	}
}

function validateLoc() {
	if (debug)
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

function saveValues(ind) {
	if (ind === 1) {
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
	else {
		document.getElementById('keyword').value = "";
		document.getElementById('cat').value = "Default";
		document.getElementById('dist').value = "";
		document.getElementById('currLocation').checked = true;
		document.getElementById('loc').value = "";
	}
}

//progress loading bar function
function progressBarSim() {
	var progress = document.getElementById('progress');
	var counter = 5;
	var pro = 25;

	var id = setInterval(frame, 50);

	function frame() {
		if(pro === 500 && counter == 100) {
			clearInterval(id);
		} else {
			pro += 10;
			counter += 2;
			var temp = pro/5;
			progress.style.width = temp + "%";
		}
	}
}


//post url according to form entries
function getUrl() {
	var url = "";
	if (document.getElementById('currLocation').checked == true) {
		url = "/result?keyw=" + document.getElementById('keyword').value + "&category=" + document.getElementById('cat').value + "&distance=" + document.getElementById('dist').value + "&locOpt=" + document.getElementById('currLocation').value
	}
	else {
		url = "/result?keyw=" + document.getElementById('keyword').value + "&category=" + document.getElementById('cat').value + "&distance=" + document.getElementById('dist').value + "&locOpt=other-loc&loc=" + document.getElementById('loc').value;
	}
	url = url.replace(/[^a-zA-Z0-9&?./,-= ]/g, '');
	url = url.replaceAll(' ','+');
	return url;
}

function submitForm() {
	document.getElementById('resArea').innerHTML = "<div class='progress'><div id='progress' class='progress-bar progress-bar-striped' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:50%'></div></div>";
	//progressBarSim();
	saveValues(1);
	var url = getUrl();
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	var ipr = xmlhttp.responseText;
	var responseObj = JSON.parse(ipr);
	document.getElementById('placeDetails').style.display = "none";
	document.getElementById('resArea').style.display = "block";
	markers = [];
	detailsHtml = [];
	nextPageToken = [];
	prevClick = "";
	reviewsArrGoogle = [];
	reviewsArrYelp = [];
	detailsClickedAtLeastOnce = false;
	toggle = true;
	var a = formTable(responseObj,0);
}


//forming table and handling response
function showTotalDetailsPage() {
	if (toggle) {
		document.getElementById('totalDetails').style.display = "block";
		document.getElementById('tableArea').style.display = "none";
	}
	else {
		// for (var i = 0; i < detailsHtml.length; i++) {
		// 	document.getElementById(detailsHtml[i]).classList.remove('table-warning');
		// }
		document.getElementById('totalDetails').style.display = "none";
		document.getElementById('tableArea').style.display = "block";		
	}
	document.getElementById('placeDetails').style.display = "none";
	toggle = !toggle;
}

function formTable(obj,ind) {
	if (debug) {
		console.log("index = ", ind);
		console.log("obj = ", obj);
	}
	if (obj.status === "OK" && obj.results.length > 0) {
		if (prevClick === "") {
			var tab = "<div class='wrapper-div'><div class='detailsBtnTab'><button disabled class='btn btn-outline-light-custom disabled' id='totalDetailsBtn' onclick='showTotalDetailsPage()'>Details ></button></div><div id='tableArea'><table class='table'><thead><tr><th scope='col'>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorites</th><th>Details</th></tr></thead><tbody>";
		}
		else {
			var tab = "<div class='wrapper-div'><div class='detailsBtnTab'><button class='btn btn-outline-light-custom' id='totalDetailsBtn' onclick='showTotalDetailsPage()'>Details ></button></div><div id='tableArea'><table class='table'><thead><tr><th scope='col'>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorites</th><th>Details</th></tr></thead><tbody>";			
		}

		for (var i = 0; i < obj.results.length; i++) {
			var cnt = i+1+ind*20;
			var idT = "row_" + obj.results[i].place_id;
			var btnID = "star_" + obj.results[i].place_id;
			if (prevClick === idT) {
				tab += "<tr class='table-warning' id='row_" + obj.results[i].place_id + "'><td scope='row'>"+ cnt +"</td>";
			}
			else {
				tab += "<tr id='row_" + obj.results[i].place_id + "'><td scope='row'>"+ cnt +"</td>";				
			}
			tab += "<td>" + "<img src='" + obj.results[i].icon + "' style='height:25px;width:25px'>" + "</td>";
			tab += "<td>" + obj.results[i].name + "</td>";
			tab += "<td>" + obj.results[i].vicinity + "</td>";
			var t = "" + obj.results[i].place_id;
			if (favoriteList.indexOf(idT) >= 0) {
				tab += "<td>" + "<button class='btn btn-outline-light-custom' onclick=\"(addRemoveFav('" + idT + "'))\"><i class='fa active-star fa-star' id='" + btnID + "' style='font-size:16px'></i></button>" + "</td>";
			}
			else {
				tab += "<td>" + "<button class='btn btn-outline-light-custom' onclick=\"(addRemoveFav('" + idT + "'))\"><i class='fa fa-star' id='" + btnID + "' style='font-size:16px'></i></button>" + "</td>";
			}
			tab += "<td>" + "<button ng-show='detailsShow' ng-show='detailsShow' class='btn btn-outline-light-custom' onclick=\"(getDetails('" + t + "','" + idT + "','fromTable',"+ obj.results[i].geometry.location.lat + "," + obj.results[i].geometry.location.lng +"));updateFavPage()\"> > </button>" + "</td>";
			tab += "</tr>";
		}

		if (obj.next_page_token !== undefined && ind === 0) {
			nextPageToken[ind] = obj.next_page_token;
			var temp = obj.next_page_token + "," + ind;
			tab += "</tbody></table>" + "<div class='btn-nxt'><button class='btn btn-outline-dark' onclick=\"(getNextPage('" + temp + " '))\">Next</button>" + "</div></div></div>"
		}
		else if (obj.next_page_token !== undefined && ind !== 0) {
			nextPageToken[ind] = obj.next_page_token;
			var temp = obj.next_page_token + "," + ind;
			tab += "</tbody></table>" + "<div class='btn-nxt'><button class='btn btn-outline-dark' onclick=\"(getPrevPage('" + temp + " '))\">Previous</button>" + "<button class='btn btn-outline-dark' onclick=\"(getNextPage('" + temp + " '))\">Next</button>" + "</div></div></div>"

		}
		else if (ind !== 0 && obj.next_page_token === undefined) {
			var temp = obj.next_page_token + "," + ind;
			tab += "</tbody></table>" + "<div class='btn-nxt'><button class='btn btn-outline-dark' onclick=\"(getPrevPage('" + temp + " '))\">Previous</button>" + "</div></div></div>"
		}
		else {
			tab += "</tbody></table></div></div>";
		}

		document.getElementById('resArea').innerHTML = tab;
	}

	else if (obj.status === 'ZERO_RESULTS') {
		document.getElementById('resArea').innerHTML = "<div class='alert alert-warning wrapper-div'>No records.</div>";
	}

	else if (obj.status !== "OK") {
		document.getElementById('resArea').innerHTML = "<div class='alert alert-danger wrapper-div'>Failed to get search results.</div>";
	}
}


//pagination functions
function getNextPage(str) {
	if (debug)
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

// Favorites

function toggleResFav(to) {
	if (to) {
		document.getElementById('favoritesArea').style.display = "none";
		document.getElementById('placeDetails').style.display = "none";
		document.getElementById('totalDetails').style.display = "none";
		document.getElementById('resArea').style.display = "block";
		if (document.getElementById('tableArea')) {
			document.getElementById('tableArea').style.display = "block";
		}
		document.getElementById('favoritesBtn').classList.remove("btn-primary");
		document.getElementById('resultsBtn').classList.add("btn-primary");
	}
	else {
		document.getElementById('favoritesArea').style.display = "block";
		document.getElementById('resArea').style.display = "none";
		if (document.getElementById('tableArea')) {
			document.getElementById('tableArea').style.display = "none";
		}
		document.getElementById('totalDetails').style.display = "none";
		document.getElementById('placeDetails').style.display = "none";
		document.getElementById('favoritesBtn').classList.add("btn-primary");
		document.getElementById('resultsBtn').classList.remove("btn-primary");
	}
}

function addRemoveFav(rowID) {
	var index = favoriteList.indexOf(rowID);
	var ind = rowID.split('_')[1];
	var btnID = "star_" + ind;
	var detailBtnID = "details_" + btnID;
	if (index > -1) {
		document.getElementById(btnID).classList.remove('active-star');
		if (document.getElementById(detailBtnID)) {
			document.getElementById(detailBtnID).classList.remove('active-star');
		}
	    favoriteList.splice(index, 1);
		updateFavPage();
		return false;
	}
	else {
		document.getElementById(btnID).classList.add('active-star');
		if (document.getElementById(detailBtnID)) {
			document.getElementById(detailBtnID).classList.add('active-star');
		}
		favoriteList.push(rowID);
		updateFavPage();
		return true;
	}
}


function updateFavPage() {
	if (favoriteList.length > 0) {
		var html = "<div class='wrapper-div'><table class='table'><thead><tr><th scope='col'>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorites</th><th>Details</th></tr></thead><tbody>";
		for (var i = 0; i < favoriteList.length; i++) {
			if(debug) {console.log("check favoriteList = ", favoriteList[i]);}
			if (prevClick === favoriteList[i]) {
				document.getElementById(favoriteList[i]).classList.add('table-warning');
			}
			else {
				document.getElementById(favoriteList[i]).classList.remove('table-warning');
			}
			//document.getElementById(favoriteList[i]).classList.remove('table-warning');
			var str = document.getElementById(favoriteList[i]).outerHTML;
			var starID = "star_" + favoriteList[i].split('_')[1];
			var nID = "fav_" + starID;
			var cnt = parseInt(i)+1;
			var a = str.split('<td scope="row">')[0] + '<td scope="row">' + cnt + str.split('<td scope="row">')[1].substr(1);
			a = a.replaceAll("fa fa-star","fa fa-trash");
			a = a.replaceAll(starID,nID);
			a = a.replaceAll('active-star','');
			a = a.replaceAll('fromTable','fromFavorites');
			html += a;
		}

		html += "</tbody></table></div>";
		document.getElementById('favoritesArea').innerHTML = html;		
	}

	else {
		var html = "<div class='alert alert-warning wrapper-div'>No records.</div>";
		document.getElementById('favoritesArea').innerHTML = html;
	}
}

//helper functions
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

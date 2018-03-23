var reviewsArrGoogle = [];
var reviewsArrYelp = [];

function checkDetailsBtn() {
	if (detailsClickedAtLeastOnce) {
		document.getElementById('totalDetailsBtn').classList.remove('disabled');
		document.getElementById('totalDetailsBtn').disabled = false;
	}
	else {
		document.getElementById('totalDetailsBtn').classList.add('disabled');
		document.getElementById('totalDetailsBtn').disabled = true;
	}
}

function updateTotalDetails() {
	var html = "<div class='wrapper-div'><table class='table'><thead><tr><th scope='col'>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorites</th><th>Details</th></tr></thead><tbody>";

	for (var i = 0; i < detailsHtml.length; i++) {
		document.getElementById(detailsHtml[i]).classList.remove('table-warning');
		var str = document.getElementById(detailsHtml[i]).outerHTML;
		var starID = "star_" + detailsHtml[i].split('_')[1];
		var nID = "details_" + starID;
		var cnt = parseInt(i)+1;
		var a = str.split('<td scope="row">')[0] + '<td scope="row">' + cnt + str.split('<td scope="row">')[1].substr(1);
		a = a.replaceAll(starID,nID);
		a = a.replaceAll('fromTable','fromDetails')
		html += a;
	}

	html += "</tbody></table></div>";
	document.getElementById('totalDetails').innerHTML = html;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function getDetails(pid,rowID,entryPoint) {
	detailsClickedAtLeastOnce = true;
	detailsHtml.push(rowID);
	detailsHtml = detailsHtml.filter(onlyUnique);
	updateTotalDetails();
	if (prevClick !== "") {
		updatePrevClick(rowID);
	}
	else {
		prevClick = rowID;
	}
	checkDetailsBtn();
	var str = "";
	pid = pid.replace(/\s/g,'');

    var service = new google.maps.places.PlacesService(document.createElement('div'));
    console.log("pid = ", pid);
    service.getDetails({
      placeId: pid
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
      	console.log("OK object");
      	document.getElementById('resArea').style.display = "none";
      	document.getElementById('totalDetails').style.display = "none";
      	document.getElementById('favoritesArea').style.display = "none";
      	var b = getNav(place,rowID,entryPoint);
      	str += b;
      	document.getElementById('placeDetails').innerHTML = str;
      	document.getElementById('placeDetails').style.display = "block";
      }
    });
}

function updatePrevClick(rowID) {
	console.log('updatePrevClick');
	document.getElementById(prevClick).classList.remove('table-warning');
	prevClick = rowID;
}

function goBackToTable(rowID,entryPoint) {
	if (entryPoint === "fromTable") {
		console.log("fromTable");
		document.getElementById('placeDetails').style.display = "none";
		document.getElementById('totalDetails').style.display = "none;"
		document.getElementById('resArea').style.display = "block";
		document.getElementById('tableArea').style.display = "block";
		document.getElementById('favoritesArea').style.display = "none";
		rowID = rowID.replace(/\s/g,'');
		document.getElementById(rowID).classList.add('table-warning');
	}
	else if(entryPoint === "fromFavorites") {
		console.log("fromFavorites");
		document.getElementById('placeDetails').style.display = "none";
		document.getElementById('totalDetails').style.display = "none;"
		document.getElementById('resArea').style.display = "none";
		document.getElementById('tableArea').style.display = "none";
		document.getElementById('favoritesArea').style.display = "block";
		rowID = rowID.replace(/\s/g,'');
		document.getElementById(rowID).classList.add('table-warning');
	}
	else if(entryPoint === "fromDetails") {
		console.log("fromDetails");
		document.getElementById('placeDetails').style.display = "none";
		document.getElementById('totalDetails').style.display = "block";
		document.getElementById('resArea').style.display = "block";
		document.getElementById('tableArea').style.display = "none";
		document.getElementById('favoritesArea').style.display = "none";
		rowID = rowID.replace(/\s/g,'');
		document.getElementById(rowID).classList.add('table-warning');
	}
}

function fav(rowID) {
	var a = addRemoveFav(rowID);
	if (a) {
		document.getElementById('nav-star').classList.add('active-star');
	}
	else {
		document.getElementById('nav-star').classList.remove('active-star');
	}
}

function getNav(place,rowID,entryPoint) {
	var str = "<h1>" + place.name + "</h1>";
	str += "<nav class='navbar navbar-light wrapper-nav navbar-expand-md bg-faded justify-content-center'>";
	// str += "<button class='btn d-flex w-50 mr-auto' onclick=\"(goBackToTable('" + rowID + " '))\">";
	str += "<button class='btn d-flex w-50 mr-auto' onclick=\"(goBackToTable('" + rowID + "','" + entryPoint +"'))\">";
	str += "<i class='fa fa-left-arrow' style='font-size:20px'></i>List</button><div> <ul class='nav navbar-nav ml-auto w-100 justify-content-end'> <li class='nav-item'>"
	if (favoriteList.indexOf(rowID) > -1) {
		str += "<a class='nav-link' href='#'><i id='nav-star' class='fa fa-star active-star' onclick=\"(fav('" + rowID + "'))\"></i></a> </li> <li class='nav-item'> <a class='nav-link' href='#'>Twitter</a> </li> </ul> </div> </nav> <nav class='wrapper-nav'> <div class='nav nav-tabs justify-content-end' id='nav-tab' role='tablist'> <a class='nav-item nav-link active' id='nav-info-tab' data-toggle='tab' href='#nav-info' role='tab' aria-controls='nav-home' aria-selected='true'>Info</a> <a class='nav-item nav-link' id='nav-photos-tab' data-toggle='tab' href='#nav-photos' role='tab' aria-controls='nav-profile' aria-selected='false'>Photos</a> <a class='nav-item nav-link' id='nav-maps-tab' data-toggle='tab' href='#nav-maps' role='tab' aria-controls='nav-contact' aria-selected='false'>Maps</a> <a class='nav-item nav-link' id='nav-reviews-tab' data-toggle='tab' href='#nav-reviews' role='tab' aria-controls='nav-contact' aria-selected='false'>Reviews</a> </div>";
	}
	else {
		str += "<a class='nav-link' href='#'><i id='nav-star' class='fa fa-star' onclick=\"(fav('" + rowID + "'))\"></i></a> </li> <li class='nav-item'> <a class='nav-link' href='#'>Twitter</a> </li> </ul> </div> </nav> <nav class='wrapper-nav'> <div class='nav nav-tabs justify-content-end' id='nav-tab' role='tablist'> <a class='nav-item nav-link active' id='nav-info-tab' data-toggle='tab' href='#nav-info' role='tab' aria-controls='nav-home' aria-selected='true'>Info</a> <a class='nav-item nav-link' id='nav-photos-tab' data-toggle='tab' href='#nav-photos' role='tab' aria-controls='nav-profile' aria-selected='false'>Photos</a> <a class='nav-item nav-link' id='nav-maps-tab' data-toggle='tab' href='#nav-maps' role='tab' aria-controls='nav-contact' aria-selected='false'>Maps</a> <a class='nav-item nav-link' id='nav-reviews-tab' data-toggle='tab' href='#nav-reviews' role='tab' aria-controls='nav-contact' aria-selected='false'>Reviews</a> </div>";
	}
	str += "<div class='tab-content' id='nav-tabContent'><div class='tab-pane fade show active' id='nav-info' role='tabpanel' aria-labelledby='nav-info-tab'>";
	var a = getInfo(place);
	str += a;
	str += "</div></div><div class='tab-pane fade' id='nav-photos' role='tabpanel' aria-labelledby='nav-photos-tab'>"
	var b = getPhotos(place);
	str += b;
	str += "</div><div class='tab-pane fade' id='nav-maps' role='tabpanel' aria-labelledby='nav-maps-tab'>";
	var c = getMap(place);
	str += "</div> <div class='tab-pane fade' id='nav-reviews' role='tabpanel' aria-labelledby='nav-reviews-tab'>";
	var d = getReviews(place);
	str += d;
	str += "</div></div></nav>";
	return str;
}

function sortByKey(array, key) {
	var narr = array.slice();
    return narr.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return x - y;
    });
}

function showReviewsListGoogle(arr) {
	var html = "";
	for (var i = 0; i < arr.length; i++) {
		html += "<div class='card-review row'>";
		html += "<div class='profile-pic-div'><a href='" + arr[i].author_url + "' target='_blank'><img class='profile-pic' src='" + arr[i].profile_photo_url + "'></a></div>";
		html += "<div class='col'>";
		html += "<div class='row'><a class='review-name' href='" + arr[i].author_url + "' target='_blank'>" + arr[i].author_name + "</a></div>";
		html += "<div class='row'>"
		for (var j = 0; j < parseInt(arr[i].rating); j++) {
			html += "<i class='fa fa-star rating-star-review'></i>";
		}

		var temp = "" + moment(parseInt(arr[i].time)*1000).format("YYYY-MM-DD H:mm:ss");
		html += "<p class='time-review'>" + temp + "</p>";
		html += "</div>";
		html += "<div class='row'><p class='reviews-text'>" + arr[i].text + "</p></div>";
		html += "</div>";
		html += "</div>";
	}
	return html;
}

function sortParam(type) {
	var elem = document.getElementById('dropdownSortType');
	var e = document.getElementById('dropdownReviewsSource').innerHTML;
	if (e.replaceAll(' ','') === 'GoogleReviews') {
		var a = reviewsArrGoogle;
		if (type === 'most-recent') {
			elem.innerHTML = "Most Recent";
			a = sortByKey(a,"time");
			document.getElementById('google-reviews').innerHTML = showReviewsListGoogle(a.slice().reverse());
		}
		if (type === 'least-recent') {
			elem.innerHTML = "Least Recent";
			a = sortByKey(a,"time");
			document.getElementById('google-reviews').innerHTML = showReviewsListGoogle(a);
		}
		if (type === 'most-rated') {
			elem.innerHTML = "Highest Rating";
			a = sortByKey(a,"rating");
			document.getElementById('google-reviews').innerHTML = showReviewsListGoogle(a.slice().reverse());
		}
		if (type === 'least-rated') {
			elem.innerHTML = "Least Rating";
			a = sortByKey(a,"rating");
			document.getElementById('google-reviews').innerHTML = showReviewsListGoogle(a);
		}
		if (type === 'default') {
			elem.innerHTML = "Default Order";
			document.getElementById('google-reviews').innerHTML = showReviewsListGoogle(reviewsArrGoogle);
		}	
	}
	else {
		console.log("yelp sort");
		var a = reviewsArrYelp;
		if (type === 'most-recent') {
			elem.innerHTML = "Most Recent";
			a = sortByKey(a,"time_created");
			document.getElementById('yelp-reviews').innerHTML = showReviewsListYelp(a.slice().reverse());
		}
		if (type === 'least-recent') {
			elem.innerHTML = "Least Recent";
			a = sortByKey(a,"time_created");
			document.getElementById('yelp-reviews').innerHTML = showReviewsListYelp(a);
		}
		if (type === 'most-rated') {
			elem.innerHTML = "Highest Rating";
			a = sortByKey(a,"rating");
			document.getElementById('yelp-reviews').innerHTML = showReviewsListYelp(a.slice().reverse());
		}
		if (type === 'least-rated') {
			elem.innerHTML = "Least Rating";
			a = sortByKey(a,"rating");
			document.getElementById('yelp-reviews').innerHTML = showReviewsListYelp(a);
		}
		if (type === 'default') {
			elem.innerHTML = "Default Order";
			document.getElementById('yelp-reviews').innerHTML = showReviewsListYelp(reviewsArrYelp);
		}
	}

}

function showReviewsListYelp(arr) {
	var html = "";
	for (var i = 0; i < arr.length; i++) {
		html += "<div class='card-review row'>";
		if (arr[i].user.image_url) {
			html += "<div class='profile-pic-div'><a href='" + arr[i].url + "' target='_blank'><img class='profile-pic' src='" + arr[i].user.image_url + "'></a></div>";
		}
		else {
			html += "<div class='profile-pic-div'><a href='" + arr[i].url + "' target='_blank'></a></div>";			
		}
		html += "<div class='col'>";
		html += "<div class='row'><a class='review-name' href='" + arr[i].url + "' target='_blank'>" + arr[i].user.name + "</a></div>";
		html += "<div class='row'>"
		for (var j = 0; j < parseInt(arr[i].rating); j++) {
			html += "<i class='fa fa-star rating-star-review'></i>";
		}
		html += "<p class='time-review'>" + arr[i].time_created + "</p>";
		html += "</div>";
		html += "<div class='row'><p class='reviews-text'>" + arr[i].text + "</p></div>";
		html += "</div>";
		html += "</div>";
	}
	return html;
}

function toggleGY(check) {
	if (check === 'google') {
		document.getElementById('dropdownReviewsSource').innerHTML = "Google Reviews";
		if(reviewsArrGoogle.length === 0) {
			document.getElementById('dropdownSortType').disabled = true;
			document.getElementById('dropdownSortType').classList.add('disabled');				
		}
		else {
			document.getElementById('dropdownSortType').disabled = false;
			document.getElementById('dropdownSortType').classList.remove('disabled');				
		}
		document.getElementById('google-reviews').style.display = "block";
		document.getElementById('yelp-reviews').style.display = "none";

	}
	if (check === 'yelp') {
		document.getElementById('dropdownReviewsSource').innerHTML = "Yelp Reviews";
		if(reviewsArrYelp.length === 0) {
			document.getElementById('dropdownSortType').disabled = true;
			document.getElementById('dropdownSortType').classList.add('disabled');				
		}
		else {
			document.getElementById('dropdownSortType').disabled = false;
			document.getElementById('dropdownSortType').classList.remove('disabled');				
		}
		document.getElementById('google-reviews').style.display = "none";
		document.getElementById('yelp-reviews').style.display = "block";
	}
}

function getReviews(place) {
	var html = "";
	console.log("reviews = ", place);
	html += "<div class='row'>";
	html += "<div class='dropdown show'><button class='btn btn-secondary dropdown-toggle' role='button' id='dropdownReviewsSource' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'> Google Reviews </button> <div class='dropdown-menu' aria-labelledby='dropdownReviewsSource'> <a class='dropdown-item' onclick=\"(toggleGY('google'))\">Google Reviews</a> <a class='dropdown-item' onclick=\"(toggleGY('yelp'))\">Yelp Reviews</a></div></div>";
	html += "<div class='dropdown show'><button class='btn btn-secondary dropdown-toggle' role='button' id='dropdownSortType' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'> Default Order </button> <div class='dropdown-menu' aria-labelledby='dropdownSortType'><a class='dropdown-item' onclick=\"(sortParam('default'))\">Default Order</a> <a class='dropdown-item' onclick=\"(sortParam('most-rated'))\">Highest Rating</a> <a class='dropdown-item' onclick=\"(sortParam('least-rated'))\">Lowest Rating</a> <a class='dropdown-item' onclick=\"(sortParam('most-recent'))\">Most Recent</a> <a class='dropdown-item' onclick=\"(sortParam('least-recent'))\">Least Recent</a></div></div>";
	html += "</div>";
	if (place.reviews && place.reviews.length > 0) {
		reviewsArrGoogle = place.reviews;
		html += "<div id='google-reviews'>";
		html += showReviewsListGoogle(place.reviews);
		html += "</div></div>"
	}
	else {
		html = "<div id='google-reviews' class='alert alert-warning'>No Google Reviews.</div>";
	}

	if (place.adr_address) {
		var str = place.adr_address;
		var temp = str.split(',');
		var name = place.name;
		var address, city, state, country, postalCode;
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].indexOf('street-address') > -1) {
				address = temp[i].split("street-address")[1].substr(2).split("</")[0];
			}
			if (temp[i].indexOf('locality') > -1) {
				city = temp[i].split("locality")[1].substr(2).split("</")[0];
			}
			if (temp[i].indexOf('region') > -1) {
				state = temp[i].split("region")[1].substr(2).split("</")[0];
			}
			if (temp[i].indexOf('country-name') > -1) {
				country = temp[i].split("country-name")[1].substr(2).split("</")[0];
			}
			if (temp[i].indexOf('postal-code') > -1) {
				postalCode = temp[i].split("postal-code")[1].substr(2).split("</")[0].split("-")[0];
			}
		}
		var url = "/yelp?name=" + name + "&address=" + address + "&city=" + city + "&state=" + state + "&postalCode=" + postalCode + "&country=" + country;
		url = url.replaceAll(' ','+');
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		var ipr = xmlhttp.responseText;
		var responseObj = JSON.parse(ipr);
		console.log("yelp response = ",responseObj.reviews);
		if (responseObj.status || responseObj.reviews.length === 0) {
			html += "<div id='yelp-reviews' class='alert alert-warning'>No Yelp Reviews.</div>";
		}
		else {
			reviewsArrYelp = responseObj.reviews;
			html += "<div id='yelp-reviews'>";
			html += showReviewsListYelp(responseObj.reviews);
			html += "</div>"
		}
	}

	else {
		html += "<div id='yelp-reviews' class='alert alert-danger wrapper-div'>Unable to get address from Google for Yelp API.</div>";
	}


	return html;
}

function getPhotos(place) {
	var html = "";
	if (place.photos && place.photos.length > 0) {
		html += "<div><div class='row'>";
		for (var i = 0; i < place.photos.length; i++) {
			html += "<div class='col-md-3 col-12'>";
			var str = place.photos[i].getUrl({'maxWidth': place.photos[i].width, 'maxHeight': place.photos[i].height});
			//console.log("url = ", str);
			html += "<a target='_blank' href='" + str + "'><img src='" + str + "' class='img-fluid'></a>";
			html += "</div>";
		}
		html += "</div></div>";
	}
	else {
		html = "<div class='alert alert-warning wrapper-div'>No place.photos.</div>";
	}
	return html;
}

function getStars(rating) {
	var percent = rating*100/5;
	var str = "<div class='ratings'><div class='empty-stars'></div><div class='full-stars' style='width:" + percent + "%''></div></div>";
	return str;
}

function getInfo(places) {
	var str = "<div class='wrapper-div'><table class='table table-striped'>";
	
	if (places.formatted_address !== undefined) {
		var address = places.formatted_address;
		str += "<tr><th>Address</th><td>" + address + "</td></tr>";
	}
	if (places.international_phone_number !== undefined) {
		var phoneNum = places.international_phone_number;
		str += "<tr><th>Phone Number</th><td>" + phoneNum + "</td></tr>";
	}

	if (places.price_level !== undefined) {
		var pLvl = places.price_level + "  ";
		var t = parseInt(pLvl);
		for (var i = 0; i < t; i++) {
			pLvl += "$";
		}
		str += "<tr><th>Price Level</th><td>" + pLvl + "</td></tr>";
	}

	if (places.rating !== undefined) {
		var rating = places.rating + " ";
		rating += getStars(parseFloat(rating));
		str += "<tr><th>Rating</th><td>" + rating + "</td></tr>";
	}

	if (places.url !== undefined) {
		var gPage = places.url;
		str += "<tr><th>Google Page</th><td><a target='_blank' href='" + gPage +"'>" + gPage + "</a></td></tr>";
	}

	if (places.website !== undefined) {
		var web = places.website;
		str += "<tr><th>Website</th><td><a target='_blank' href='" + web +"'>" + web + "</a></td></tr>";
	}
	var a = false;
	if (places.opening_hours !== undefined) {
		var hours = "";
		if (places.opening_hours.open_now) {
			hours += "<b>Open now</b>: ";
			var day = moment().day();
			var currDay = places.opening_hours.weekday_text[day];
			currDay = currDay.split('y:')[1];
			hours += currDay + "     ";
		}
		else {
			hours += "<b>Closed     </b>";
		}
    	hours += "<a class='dailyHoursLink' data-toggle='modal' data-target='#dailyHoursModal'>Daily Open Hours</a>"
		//hours += "  <a data-toggle='modal' data-target='#dailyHoursModal'> Daily open hours</a>";
		a = true;
		str += "<tr><th>Hours</th><td>" + hours + "</td></tr>";
	}

	str += "</div></table>";

	if (a) {
		str += "<div class='modal fade' tabindex='-1' role='dialog' id='dailyHoursModal'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Open Hours</h5><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'>";
		str += "<table class='table'>"
		var dayW = moment().day();
		for (var b = 0; b < 7; b++) {
			var dayList = places.opening_hours.weekday_text[b].split('y:')[0] + "y";
			var timings = places.opening_hours.weekday_text[b].split('y:')[1];
			if (b === dayW) {
				str += "<tr><th>" + dayList + "</th><td>" + timings + "</td></tr>";
			}
			else {
				str += "<tr><td>" + dayList + "</td><td>" + timings + "</td></tr>";
			}
		}

		str += "</table></div><div class='modal-footer'><button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button></div></div></div></div>";

	}

	return str;
}

function getMap(place) {
	var html = "";
	console.log("current lat = ", currLat);
	console.log("current long = ", currLong);
	return html;
}
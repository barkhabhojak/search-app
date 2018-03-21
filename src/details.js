function getDetails(pid) {
	console.log(pid);
	var str = "";
	pid = pid.replace(/\s/g,'');

    var service = new google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails({
      placeId: pid
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
      	document.getElementById('resArea').style.display = "none";
      	console.log(place);
      	var b = getNav(place);
      	str += b;
      	document.getElementById('placeDetails').innerHTML = str;
      	document.getElementById('placeDetails').style.display = "block";
      }
    });

}

function getNav(place) {
	//navbar-light bg-light
	var str = "<h1>" + place.name + "</h1>";
	str += "<nav class='navbar navbar-light wrapper-nav navbar-expand-md bg-faded justify-content-center'> <a href='/' class='navbar-brand d-flex w-50 mr-auto'><i class='fa fa-left-arrow' style='font-size:20px'></i>List</a> <div> <ul class='nav navbar-nav ml-auto w-100 justify-content-end'> <li class='nav-item'> <a class='nav-link' href='#'><i class='fa fa-star' style='font-size:20px'></i></a> </li> <li class='nav-item'> <a class='nav-link' href='#'>Twitter</a> </li> </ul> </div> </nav> <nav class='wrapper-nav'> <div class='nav nav-tabs justify-content-end' id='nav-tab' role='tablist'> <a class='nav-item nav-link active' id='nav-info-tab' data-toggle='tab' href='#nav-info' role='tab' aria-controls='nav-home' aria-selected='true'>Info</a> <a class='nav-item nav-link' id='nav-photos-tab' data-toggle='tab' href='#nav-photos' role='tab' aria-controls='nav-profile' aria-selected='false'>Photos</a> <a class='nav-item nav-link' id='nav-maps-tab' data-toggle='tab' href='#nav-maps' role='tab' aria-controls='nav-contact' aria-selected='false'>Maps</a> <a class='nav-item nav-link' id='nav-reviews-tab' data-toggle='tab' href='#nav-reviews' role='tab' aria-controls='nav-contact' aria-selected='false'>Reviews</a> </div>";
	str += "<div class='tab-content' id='nav-tabContent'><div class='tab-pane fade show active' id='nav-info' role='tabpanel' aria-labelledby='nav-info-tab'>";
	var a = getInfo(place);
	str += a;
	str += "</div></div><div class='tab-pane fade' id='nav-photos' role='tabpanel' aria-labelledby='nav-photos-tab'>Hello</div> <div class='tab-pane fade' id='nav-maps' role='tabpanel' aria-labelledby='nav-maps-tab'></div> <div class='tab-pane fade' id='nav-reviews' role='tabpanel' aria-labelledby='nav-reviews-tab'></div> </div></nav>";
	return str;
}

function getStars(rating) {
	var percent = rating*100/5;
	console.log("rating = ",rating);
	console.log("percent = ",percent);
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
			console.log("day = ", day);

			var currDay = places.opening_hours.weekday_text[day];
			currDay = currDay.split('y:')[1];
			hours += currDay;
		}
		else {
			hours += "<b>Closed</b>";
		}
    	hours += "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#dailyHoursModal'>  Daily Open Hours</button>"
		//hours += "  <a data-toggle='modal' data-target='#dailyHoursModal'> Daily open hours</a>";
		a = true;
		str += "<tr><th>Hours</th><td>" + hours + "</td></tr>";
	}

	str += "</div></table>";

	if (a) {
		console.log('hello true');
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

		str += "</table></div><div class='modal-footer'><button type='button' class='btn btn-secondary' data dismiss='modal'>Close</button></div></div></div></div>";

	}

	return str;
}
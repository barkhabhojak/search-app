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
      	var a = getInfo(place);
      	str += a;
      	document.getElementById('placeDetails').innerHTML = str;
      	document.getElementById('placeDetails').style.display = "block";
      }
    });

}

function getStars(rating) {
	var percent = rating*100/5;
	console.log("rating = ",rating);
	console.log("percent = ",percent);
	var str = "<div class='ratings'><div class='empty-stars'></div><div class='full-stars' style='width:" + percent + "%''></div></div>";
	return str;
}

function getInfo(places) {
	if (places.formatted_address !== undefined)
		var address = places.formatted_address;
	else 
		var address = "";
	if (places.international_phone_number !== undefined)
		var phoneNum = places.international_phone_number;
	else 
		var phoneNum = "";
	if (places.price_level !== undefined) {
		var pLvl = places.price_level + "  ";
		var t = parseInt(pLvl);
		for (var i = 0; i < t; i++) {
			pLvl += "$";
		}
	}
	else 
		var pLvl = "";
	if (places.rating !== undefined) {
		var rating = places.rating + " ";
		rating += getStars(parseFloat(rating));
	}
	else 
		var rating = "";
	if (places.url !== undefined)
		var gPage = places.url;
	else 
		var gPage = "";
	if (places.website !== undefined)
		var web = places.website;
	else 
		var web = "";
	if (places.opening_hours !== undefined) {
		var hours = "";
		if (places.opening_hours.open_now) {
			hours += "Open now: ";
			var day = moment().day();
			console.log("day = ", day);

			var currDay = places.opening_hours.weekday_text[day];
			currDay = currDay.split('y:')[1];
			hours += currDay;
		}
		else {
			hours += "Closed";
		}
	}
	else 
		var hours = "";

	var html = [
		"<div class='wrapper-div'><table class='table table-striped'>",
		"<tr><th>Address</th><td>" + address + "</td></tr>",
		"<tr><th>Phone Number</th><td>" + phoneNum + "</td></tr>",
		"<tr><th>Price Level</th><td>" + pLvl + "</td></tr>",
		"<tr><th>Rating</th><td>" + rating + "</td></tr>",
		"<tr><th>Google Page</th><td><a target='_blank' href='" + gPage +"'>" + gPage + "</a></td></tr>",
		"<tr><th>Website</th><td><a target='_blank' href='" + web +"'>" + web + "</a></td></tr>",
		"<tr><th>Hours</th><td>" + hours + "</td></tr>",
		"</div></table>"

	].join("\n");

	return html;
}
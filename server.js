const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const request = require('request');
var router = express.Router();

const placesKey = "AIzaSyAU5hyg6Ky-pOHejxe2u8trKteehGkSNrk";
const geoKey = "AIzaSyBi3mS77HSSIOTdlIgpnsjzdUVJIindH8w";
// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/ilike', function (req, res) {
	console.log(req);
	console.log("name = ",req.query.name);
	console.log("lname = ", req.query.lname);
	var responseObj = {message: 'OK'};
	res.send(responseObj);
})

app.get('/result', (req, res) => {
    //console.log(req.body);
    //console.log(req);

    // localhost:3000/result?keyw=pizza&category=Default&distance=&locOpt=curr-loc-34.0266%2C-118.2831
    // localhost:3000/result?keyw=pizza&category=Default&distance=&locOpt=other-loc&loc=North+Alameda+Street%2C+Los+Angeles%2C+CA%2C+USA
    // localhost:3000/result?next_page_token=CqQCHwEAADf3MDDr8WeJI3_4oj9m2t7f1FITaf_guEzSBmfzXl8X9G05XQwzY8QTxB_FOBqZVDhPh_4ytS9cHM0cZI34WcV4HRR7R6G7EtrQvcvJwJq-0xvq0RePWbU4j9RWdc-NG_-_Da2d_rRgypwIhpijN3emHe0q0a6zXenbKsjwZYrO_9GlJuXtRLFQ-Pda5FKLjouXyLFc2G36ShtCs4QcDkF6nJjaLjgDaJrk8vywfccQL4WXksg2RdYouINeqdp0rSKLCLbgxc9MBqtayeodeMJc6Hz8GMc2MtxycTmzz9Z7WA_3lqLxaXZN0My8Ktrkbv16vF3_Y_91TLGmCPucGvew_RnZY2H-GWIoAythCMCPOLFnDxkBnlGMjoYP22ky9RIQYrkQ317DDYAFDXtEL6bA6hoUHSw0L-qu7x8s3Fm3KCm4g1rJf_o&key=AIzaSyAU5hyg6Ky-pOHejxe2u8trKteehGkSNrk
    if (req.query.next_page_token !== undefined) {
    	console.log('next page token');
    	var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=" + req.query.next_page_token + "&key=" + placesKey;
			request.get(url,function(error, response, body) {
				if (error === null) {
					var ob = JSON.parse(body);
					res.send(ob);
				}
		});
    }

    else {
    	console.log(req.query.keyw);
	    console.log(req.query.category);
	    console.log(req.query.distance);
	    console.log(req.query.locOpt);
	    var keyword = req.query.keyw;
	    var category = req.query.category.toLowerCase();
	    if (category.indexOf(' ') >= 0) {
	    	category = category.replaceAll(' ','+');
	    }
	    if (keyword.indexOf(' ') >= 0) {
	    	keyword = keyword.replaceAll(' ','+');
	    }
	    var distance = 10;
	    lat = 0;
	    long = 0;
	    if (req.query.distance !== '') {
	    	distance = req.query.distance;
	    }
	    if (req.query.locOpt === 'other-loc') {
	    	var address = req.query.loc;
			if (address.indexOf(' ') >= 0 || address.indexOf(',') >= 0) {
				address = address.replaceAll(' ','+');
				address = address.replaceAll(',','');
			}
			var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+geoKey;
			console.log("url = ", url);
			request.get(url,function(error, response, body) {
				if (error === null) {
					var obj = JSON.parse(body);
					if (obj.status === 'OK') {
						var a = obj.results[0].geometry.location;
						lat = a.lat;
						long = a.lng;

						distance = distance*1609.34;
						url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+long+"&radius="+distance+"&type="+category+"&keyword="+keyword+"&key="+placesKey;	
						console.log("url list = ", url);
						if (url.indexOf(' ') >= 0) {
							url = url.replaceAll(' ','+');
						}
						request.get(url,function(error, response, body) {
							if (error === null) {
								var obj = JSON.parse(body);
								res.send(obj);
							}
						});
					}
					else {
						alert('error in getting location from google maps');
						return;
					}
				}
			});
	    }
	    else {
	    	var a = req.query.locOpt.split('curr-loc-')[1];
	    	lat = a.split(',')[0];
	    	long = a.split(',')[1];
			distance = distance*1609.34;
			var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+long+"&radius="+distance+"&type="+category+"&keyword="+keyword+"&key="+placesKey;	
			console.log("url list = ", url);
			if (url.indexOf(' ') >= 0) {
				url = url.replaceAll(' ','+');
			}
			request.get(url,function(error, response, body) {
				if (error === null) {
					var obj = JSON.parse(body);
					res.send(obj);
				}
			});
	    }
	}
});


//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

// server.listen(port, () => console.log(`Running on localhost:${port}`));
server.listen(port, function(request,response) {
	console.log('listen');
});



function getList(keyword,category,distance,lat,long) {
	distance = distance*1609.34;
	var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+long+"&radius="+distance+"&type="+category+"&keyword="+keyword+"&key="+placesKey;	
	console.log("url list = ", url);
	if (url.indexOf(' ') >= 0) {
		url = url.replaceAll(' ','+');
	}
	request.get(url,function(error, response, body) {
		if (error === null) {
			var obj = JSON.parse(body);
			if (obj.status === 'OK') {
				return obj;
			}
			else {
				alert('error in getting location from google maps');
				return null;
			}
		}
	});
}



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports = router;
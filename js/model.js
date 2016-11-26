// Here is my model
var map, createMarkers, myInfowindow, markers, markersFav, setBounds, defaultBounds, performAjax;
var highLightThisMarker, stopHighLighting, currentMarkerIcon, defaultIcon, geocoder; 
var isTouchDevice = 'ontouchstart' in document.documentElement;
var screenWidth = screen.width;
// items in menu 
var menuItems = ["My Favorites", "Show Search", "Acknowledgements", "Reset Favorites"];
// Store some markers into localStorage 
function initMyFavorites() {
	if(!localStorage.myMarkers){
		var myMarkers = [{"title":"University College London","location":{"lat":51.524561,"lng":-0.13534100000003946}},
			{"title":"Euston Square","location":{"lat":51.526867,"lng":-0.13279899999997724}},
			{"title":"University College London Hospital","location":{"lat":51.524684,"lng":-0.13623699999993732}},
			{"title":"UCL Ear Institute and Action on Hearing Loss Library","location":{"lat":51.52927210000001,"lng":-0.11956680000002962}},
			{"title":"The British Library","location":{"lat":51.52997169999999,"lng":-0.12767589999998563}},
			{"title":"UCL Main Library","location":{"lat":51.524697,"lng":-0.1335046000000375}},
			{"title":"Senate House Library","location":{"lat":51.5210743,"lng":-0.12873530000001665}},
			{"title":"UCL Shop","location":{"lat":51.5242693,"lng":-0.13335459999996147}},
			{"title":"Waterstones","location":{"lat":51.522448,"lng":-0.13218099999994593}},
			{"title":"Tavistock Square Gardens","location":{"lat":51.52495779999999,"lng":-0.12906610000004548}},
			{"title":"George Mews Car Park","location":{"lat":51.5267067,"lng":-0.1380340000000615}},
			{"title":"Bloomsbury Cafe","location":{"lat":51.52506849999999,"lng":-0.1325511000000006}},
			{"title":"UCLU Gordon's Cafe","location":{"lat":51.52564659999999,"lng":-0.13335129999995843}},
			{"title":"Print Room Café","location":{"lat":51.524095,"lng":-0.1333590000000413}}];
		localStorage.setItem("myMarkers", JSON.stringify(myMarkers));
	}
}

initMyFavorites();

var acknowledgement = [
	{item: "Menu icon was made by Eleonor Wang from www.flaticon.com"},
	{item: "Search icon made by Freepik from www.flaticon.com"},
	{item: "Backward arrow icon by Freepik from www.flaticon.com"},
	{item: "Close icon by Madebyoliver from www.flaticon.com"},
	{item: "OpenWeatherMap API from http://openweathermap.org/"},
	{item: "google maps API"},
	{item : "jQuery"},
	{item: "knockout.js"}
]; 
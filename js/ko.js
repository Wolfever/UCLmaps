// Here is my ViewModel for KO
function AppViewModel() {
	
	var self = this;
	// observables 
	this.menu = ko.observable(menuItems);
	this.acknowledgement = ko.observableArray(acknowledgement);
	this.showMenuVar = ko.observable(false);
	this.showSearchVar = ko.observable(false);
	this.showMyFavoritesVar = ko.observable(false);
	this.showAcknowledgementsVar = ko.observable(false);
	this.showDetailedInfoVar = ko.observable(false);
	this.mapWidth = ko.observable("100%");
	this.mapLeft = ko.observable("0");
	// Functions 
	this.reset = function() {
		self.showMenuVar(false);
		self.showSearchVar(false);
		self.showMyFavoritesVar(false);
		self.showAcknowledgementsVar(false);
		self.showDetailedInfoVar(false);
		self.resettingMap();
		myInfowindow.close();
	};
	// functions to resize maps when showing and hiding the left-side menu on larger
	// screens 
	//var $map = $("#map")
	this.mapFitting = function() {
		if(screenWidth > 500){
			//$map.css("width", "calc(100% - 250px)");
			//$map.css("left", "250px");
			self.mapWidth("calc(100% - 250px)");
			self.mapLeft("250px");
			setBounds(markers);
		}
	};
	this.resettingMap = function() {
		if(screenWidth > 500){
			//$map.css("width", "100%");
			//$map.css("left", "0");
			self.mapWidth("100%");
			self.mapLeft("0");
			setBounds(markers);
		}
	};
	
	// read from model for favourite markers and display them on the screen 
	var favouriteMarkers = JSON.parse(localStorage.myMarkers);
	this.favoriteMarkerList = ko.observableArray(favouriteMarkers); 
	this.showMyFavorites = function(){
		self.reset();
		self.showMyFavoritesVar(true);
		setBounds(markersFav);
	};

	// Set up for filtering function 
	this.initial = ko.observable("");
	this.favorites = ko.computed(function(){
		// NO Idea how this commented code doesn't work...
		/* 
		var arry = [];
		if(!markersFav){
			return arry;
		}else{
			self.favoriteMarkerList(markersFav);
			for (var x=0; x<self.favoriteMarkerList().length; x++){
				if(self.favoriteMarkerList()[x].title.indexOf(self.initial()) >= 0){
					arry.push(self.favoriteMarkerList()[x]);
					markersFav[x].setVisible(true);
				}else{
					markersFav[x].setVisible(false);
				}
			}
			return arry;
		}
		*/
		
		var arry = [];
		if(markersFav){ // markersFav only exists after map is loaded, so an if is added 
						// to prevent error
			self.favoriteMarkerList(markersFav);	// Store markers in an ko.observable array, 
													// there is little sense in it... 
		}
		for (var x=0; x<self.favoriteMarkerList().length; x++){
			if(self.favoriteMarkerList()[x].title.indexOf(self.initial()) >= 0){ 
												// filtering through checking if the typed in words 
												// are contained in the marker title. 
												// If so, push it in an arry, and display it  
				arry.push(self.favoriteMarkerList()[x]);
				if(markersFav){
					// markersFav[x].setMap(map);
					markersFav[x].setVisible(true);
				}
			}else if(markersFav){ 				// if not, hide it
				// markersFav[x].setMap(null);
				markersFav[x].setVisible(false);
			}
		}
		return arry;
		
	});

	// When the filter button is clicked 
	this.filterFunc = function(){
		if(screenWidth < 500){
			self.reset();
		}
		setBounds(self.favorites());
	};

	//Functions when menuItems are clicked
	this.respond = function(clickedItem) {
		switch (clickedItem){
			case 'My Favorites': 		// Show markers on the screen 
				self.reset();
				self.mapFitting();
				self.showMyFavorites();
				hideAllMarkers();
				markers = markersFav;
				showMarker(markersFav);
				setBounds(markersFav);
				self.favoriteMarkerList(markersFav);
				break;
			case 'Show Search': 		// Show a searchbox 
				self.reset();
				self.showSearch();
				break;
			case 'Acknowledgements': 	// Show references 
				self.reset();
				self.mapFitting();
				self.showAcknowledgements();
				break;
			case 'Reset Favorites': 
				localStorage.removeItem('myMarkers');
				initMyFavorites();
				initMap();

				break;
			default: 					// For fun... So I can add more useless menus in the menu  
				console.log("Hello");
		}
	};



	// Functions to show/hide the menu
	this.showMenu = function(){
		self.reset();
		self.showMenuVar(true);
		//$("#menumain").show();
		self.mapFitting();
	};
	this.closeMenu = function(){
		self.showMenuVar(false);
		self.resettingMap();
	};

	// functions to show/hide the search input 
	this.showSearch = function() {
		self.reset();
		self.showSearchVar(true);
	};
	this.hideSearch = function() {
		self.showSearchVar(false);
	};

	this.showMyFavorites = function() {
		self.showMyFavoritesVar(true);
	};

	this.showAcknowledgements = function() {
		self.showAcknowledgementsVar(true);
	};

	// Animation for a chosen marker 
	this.showThisMarker = function(clickedItem){
		// self.resetIcons();
		clickedItem.setIcon(currentMarkerIcon);
		// clickedItem.highLightThisMarker();
	};
	// change Center of the map 
	this.changeCenter = function(clickedItem) {
		self.reset();
		performAjax(clickedItem);
		map.panTo(clickedItem.position);
		map.setZoom(16);
		populateInfoWindow(clickedItem, myInfowindow);
		setBouncing(clickedItem);
	};

	self.resetIcons = function(){
		for(var i=0; i<self.favoriteMarkerList().length; i++){
			self.favoriteMarkerList()[i].setIcon(defaultIcon);
		}
	};

	this.showDetailedInfo = function(){
		self.showDetailedInfoVar(true);
	};

	// performAjax Func
	this.infoTitle = ko.observable("");
	this.infoURL = ko.observable("");
	this.inforAlt = ko.observable("");
	this.infoWTName = ko.observable("");
	this.weatherAlt = ko.observable("");
	this.weatherURL = ko.observable("");
	this.saveOption = ko.observable("Save to MyFavorite");
	this.currentMarker = ko.observable("");
	this.wtresponse = ko.observable(-1);
	this.fullAddress = ko.observable("");
	performAjax = function(marker){
		self.currentMarker(marker);
		self.wtresponse(-1);
		self.infoTitle(marker.title);
		//图片 the street view image 
		var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=500x300&location=' + marker.title + '&key=AIzaSyBxIepG4OU96IlfLMA_ddK_JHLqT6OgQyk';
		self.infoURL(streetviewUrl);
		// formatted address 
		self.fullAddress("");
		var currentLocation = {'location': {lat: marker.position.lat(), lng: marker.position.lng()}};
		geocoder.geocode(currentLocation, function(result,status){
			if (status === google.maps.GeocoderStatus.OK) {
				self.fullAddress(result[0].formatted_address);
			}else{
				console.log('Geocoder failed due to: ' + status);
				alert("Sorry, cannot get address now. :( " );
			}
		});
		// Weather condition
		var wturl = "http://api.openweathermap.org/data/2.5/weather?lat="+
					marker.position.lat()+"&lon="+
					marker.position.lng()+"&appid=457b6d0eb651722c34fa15758ad21a75";

		$.ajax({
			url: wturl,
			method: 'GET'
		}).done(function(result){
			self.wtresponse(1);
			self.infoWTName(result.name);
			self.weatherURL("http://openweathermap.org/img/w/" + result.weather[0].icon+ ".png");
			self.weatherAlt(result.weather[0].description);
		}).fail(function(error){
			console.log(error);
			alert("Unable to display weather condition");
		});
		// Function for saving and deleting markers 
		if(markersFav.indexOf(marker)<0){
			self.saveOption("Save to MyFavorite");  
		}else {
			self.saveOption("Delete from MyFavorite");
		}
		// ...and, display it on the screen 
		self.showDetailedInfo();
	};
	// if a marker is added or deleted from favorites, update the localstorage 
	this.updateLocalStorage = function(){ //对相应的model有修改，保存到localstrorage中
		var markerRef = {};
		var refList = [];
		for(var i = 0; i < markersFav.length; i++){
			markerRef = {"title": markersFav[i].title,
						"location": 
							{"lat": markersFav[i].position.lat(),
							"lng": markersFav[i].position.lng()}};
			refList.push(markerRef);
		}
		localStorage.setItem("myMarkers", JSON.stringify(refList));
	};
	// If a marker is saved or deleted as favorite, change the option to the other and
	// update the localStorage  
	this.switchSave = function(){
		// see if the currentmarker is in the favorite array
		if(markersFav.indexOf(self.currentMarker())<0){ // 如果没有被收藏
			markersFav.push(self.currentMarker());
			alert("Saved!");
			self.saveOption("Delete from MyFavorite"); //通知用户相应的变化
			self.updateLocalStorage();					
		}else {
			markersFav.splice(markersFav.indexOf(self.currentMarker()), 1);
			self.currentMarker().setVisible(false);
			myInfowindow.close();
			alert("Deleted");
			self.saveOption("Save to MyFavorite"); //通知用户相应的变化
			self.updateLocalStorage();
		}
	};	
}
// Activates knockout.js
ko.applyBindings(new AppViewModel());
//GENERAL UTILITY METHODS
function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}

function addSpanToFilterResult(filterResult, filter){
  var substr = filterResult.text().toLowerCase().split(filter);
  var fixedstr = '';
  for(var i=0; i<substr.length; i++){
    fixedstr += substr[i];
    if(i != substr.length-1){
      fixedstr += '<span>'+filter+'</span>';
    }
  }
  return fixedstr;
}

/**
 * Configuration variables for the different municipalities. This includes mapserver information,
 * information to initialise the map with, and function definitions to extract grave information.
 *
 * A municipality can be interpreted as a format definition in which information is requested and
 * extracted from the server. Each municipality uses the same format for all it's cemeteries.
 *
 * When there is a new format (eg.: when a new municipality will make use of this app
 *
 */

var municipVars = {
	'WAR': {
		'alias' : 'Waregem',
		'mapServerURL' : 'http://www.govmaps.eu/arcgis/rest/services/WAR/WAR_begraafplaats/MapServer',
		'graveLayerURL' : '/0',
		'wkid' : 31370,
		'extractGraveId' : function(json, callback) {
			var graveId;
			graveId = json.attributes.grafcode;
			callback(graveId);
		},
		'extractGraveLoc' : function(json, callback) {
			var graveLoc = {};
			graveLoc.x = json.geometry.x;
			graveLoc.y = json.geometry.y;
			callback(graveLoc);
		}
	},
	'DEE': {
		'alias' : 'Deerlijk',
		'mapServerURL' : 'http://www.govmaps.eu/arcgis/rest/services/DEE/DEE_begraafplaatstile/MapServer',
		'graveLayerURL' : '/2',
		'wkid' : 31370,
		'extractGraveId' : function(json, callback) {
			var graveId;
			graveId = json.attributes.PERCEEL;
			callback(graveId);
		},
		'extractGraveLoc' : function(json, callback) {
			var graveLoc = {};
			graveLoc.x = json.geometry.x;
			graveLoc.y = json.geometry.y;
			callback(graveLoc);
		}
	},
	'AVE': {
		'alias' : 'Avelgem',
		'mapServerURL' : 'http://www.govmaps.eu/arcgis/rest/services/AVE/AVE_GRAF/MapServer',
		'graveLayerURL' : '/0',
		'wkid' : 31370,
		'extractGraveId' : function(json, callback) {
			var graveId = json.attributes.GRAFXYZ;
			callback(graveId);
		},
		'extractGraveLoc' : function(json, callback) {
			var graveLoc = {};
			graveLoc.x = json.geometry.x;
			graveLoc.y = json.geometry.y;
			callback(graveLoc);
		}
	}
};

/**
 * Each individual location needs to be linked to a municipality and needs some information
 * about the initial location and zoom of the map.
 *
 */
var cemeteryVars = {
	'waregem de barakke' : {
		'municipality' : 'WAR',
		'startCoords' : { 'x':-5, 'y':70, 'zoom':3 },
	},
	'sint-eloois-vijve' : {
		'municipality' : 'WAR',
		'startCoords' : { 'x':2010, 'y':80, 'zoom':5 },
	},
	'waregem den olm' : {
		'municipality' : 'WAR',
		'startCoords' : { 'x':4010, 'y':80, 'zoom':6 },
	},
	'beveren-leie' : {
		'municipality' : 'WAR',
		'startCoords' : { 'x':5020, 'y':140, 'zoom':6 },
	},
	'desselgem schoendalestraat' : {
		'municipality' : 'WAR',
		'startCoords' : { 'x':1087, 'y':0, 'zoom':5 },
	},
	'ooigemstraat' : {
		'municipality' : 'WAR',
		'startCoords' : { 'x':2910, 'y':-93, 'zoom':6 },
	},
	'outrijve-bossuit' : {
		'municipality' : 'AVE',
		'startCoords' : { 'x':1540, 'y':121, 'zoom':7 },
	},
	'avelgem' : {
		'municipality' : 'AVE',
		'startCoords' : { 'x':55, 'y':115, 'zoom':3 },
	},
	'waarmaarde' : {
		'municipality' : 'AVE',
		'startCoords' : { 'x':2020, 'y':114, 'zoom':6 },
	},
	'kerkhove' : {
		'municipality' : 'AVE',
		'startCoords' : { 'x':2520, 'y':115, 'zoom':7 },
	},
	'bossuit' : {
		'municipality' : 'AVE',
		'startCoords' : { 'x':1028, 'y':112, 'zoom':7 },
	},
	'waarmaarde-kerkhove' : {
		'municipality' : 'AVE',
		'startCoords' : { 'x':3024, 'y':118, 'zoom':6 },
	},
	'outrijve' : {
		'municipality' : 'AVE',
		'startCoords' : { 'x':530, 'y':114, 'zoom':6 },
	},
	'deerlijk' : {
		'municipality' : 'DEE',
		'startCoords' : { 'x':2, 'y':59, 'zoom':3 },
	},
	'sint-lodewijk' : {
		'municipality' : 'DEE',
		'startCoords' : { 'x':508, 'y':62, 'zoom':4 }
	}
}

/**
 * Callback gets all information about a municipality, as it is defined in municipVars.
 *
 */
function getMunicipalityInfo(municip, callback) {
	var data = municipVars[municip];
	callback(data);
}

function getLocationInfo(location, callback) {
	var data = cemeteryVars[location.toLowerCase()];
	callback(data);
}

/**
 * Municipalities use different formats to return grave information in. The next two
 * functions extract this information from the JSON object and call the callbac function
 * with the requested data.
 *
 */
function getGraveId(municip, json, callback) {
	municipVars[municip].extractGraveId(json, callback);
}

function getGraveLocation(municip, json, callback) {
	municipVars[municip].extractGraveLoc(json, callback);
}

function makeScroll(selector){
  var scroller = new IScroll(selector);
  return scroller;
}

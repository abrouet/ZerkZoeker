//GENERAL UTILITY METHODS
function testFunction(){
  console.log('[function.js] testFunction');
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
			var graveId;
			graveId = json.attributes.GRAFXYZ;
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
	'Waregem De Barakke' : {
		'municipality' : 'WAR',
		'location' : [1, 1, 0]
	},
	'Sint-Eloois-Vijve' : {
		'municipality' : 'WAR',
		'location' : [1, 1, 0]
	},
	'Waregem Den Olm' : {
		'municipality' : 'WAR',
		'location' : [1, 1, 0]
	},
	'Beveren-Leie' : {
		'municipality' : 'WAR',
		'location' : [1, 1, 0]
	},
	'Desselgem Schoendalestraat' : {
		'municipality' : 'WAR',
		'location' : [1, 1, 0]
	},
	'Ooigemstraat' : {
		'municipality' : 'WAR',
		'location' : [1, 1, 0]
	},
	'Outrijve-Bossuit' : {
		'municipality' : 'AVE',
		'location' : [1, 1, 0]
	},
	'Avelgem' : {
		'municipality' : 'AVE',
		'location' : [1, 1, 0]
	},
	'Waarmaarde' : {
		'municipality' : 'AVE',
		'location' : [1, 1, 0]
	},
	'Kerkhove' : {
		'municipality' : 'AVE',
		'location' : [1, 1, 0]
	},
	'Bossuit' : {
		'municipality' : 'AVE',
		'location' : [1, 1, 0]
	},
	'Waarmaarde-Kerkhove' : {
		'municipality' : 'AVE',
		'location' : [1, 1, 0]
	},
	'Outrijve' : {
		'municipality' : 'AVE',
		'location' : [1, 1, 0]
	},
	'Deerlijk' : {
		'municipality' : 'DEE',
		'location' : [1, 1, 0]
	},
	'Sint-Lodewijk' : {
		'municipality' : 'DEE',
		'location' : [1, 1, 0]
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

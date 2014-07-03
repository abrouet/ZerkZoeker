/**
 * This file contains global variables. These are different for each municipality,
 * the information is stored in arrays and each town is assigned an index. The
 * information will be extracted by mapping the name to an index, with this all
 * required information can be extracted from the different arrays.
 *
 */

// The name to index mapping
var municipalities = { 'WAR' = 0, 'DEE' = 1, 'AVE' = 2};

// This contains the URL to place where the ArcGIS map layers are stored
var mapServerURLs = [
	"http://www.govmaps.eu/arcgis/rest/services/WAR/WAR_begraafplaats/MapServer",
	"http://www.govmaps.eu/arcgis/rest/services/DEE/DEE_begraafplaatstile/MapServer",
	"http://www.govmaps.eu/arcgis/rest/services/AVE/AVE_GRAF/MapServer"
];

// This is the relative path from the previous URL to the Feature Layer containing
// all grave information.
var graveLayerURLs = [
	"/0",
	"/2",
	"/1"
];

// The coordinates and zoomlevel to initialise each map with
var startCoords = [
	{x:0, y:0, zoom:1},
	{x:0, y:0, zoom:1},
	{x:0, y:0, zoom:1}
];

/**
 * Every function requires a municipality code as argument. The current setup is as follows:
 *	- WAR = Waregem
 *	- DEE = Deerlijk
 *  - AVE = Avelgem
 * This code is required because the Feature Layers (to where a query can be send to get
 * information about graves) don't have the same way of ordering the data. The ID, to address
 * graves with, has a different column name in each of the Feature Layer databases.
 *
 */

function getMapServerURL(municip) {

}

function getGraveLayerURL(municip) {

}

function getStartCoordinates(municip) {

}

/**
 * Because grave ID's are addressed by different names in different Feature Layers, these functions
 * are required to extract information from the returned JSON objects.
 *
 */
function extractGraveId(municip, json) {

}

function extractGraveCoordinates(municip, json) {

}
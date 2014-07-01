
// Parameters to quickly change maps
var mapDivId = "mapdiv"; // The id of the div in which to display the map
var mapServerURL = "http://www.govmaps.eu/arcgis/rest/services/WAR/WAR_begraafplaats/MapServer"; // The url of the server where the arcgis map is stored

var graveId;

require([
	// Required to build the map and fetch the layer with graves
	"esri/map",
	"esri/arcgis/utils",
	"esri/layers/FeatureLayer",
	"esri/geometry/Point",
	"esri/geometry/ScreenPoint",
	// Required to draw the circle when clicking
	"esri/tasks/query",
	"esri/geometry/Circle",
  "esri/graphic", "esri/InfoTemplate",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/config", "esri/Color",
  // Required to wait for the Document Object to be ready before executing
	"dojo/domReady!"
  ], function(Map,
					  	arcgisUtils,
					  	FeatureLayer,
					  	Point,
					  	ScreenPoint,
					  	Query,
					  	Circle,
					    Graphic,
					    InfoTemplate,
					    SimpleMarkerSymbol,
					    SimpleLineSymbol,
					    SimpleFillSymbol,
					    SimpleRenderer,
					    esriConfig,
					    Color) {

  	// Fetch the graphics layers and add them to the map
		map = new Map(mapDivId);
		var layer = new esri.layers.ArcGISTiledMapServiceLayer(mapServerURL);
		map.addLayer(layer);

		// Fetch the FeatureLayer which contains the gravepoints
		var tombLayerURL = mapServerURL + "/0";
		var featureLayer = new FeatureLayer(tombLayerURL);

		// Create the circle to display when clicking on the map
		var circleSymb = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_NULL,
          new SimpleLineSymbol(
            new Color([255, 0, 0]),
            2
          ), new Color([0, 0, 0, 0])
        );
		var circle;

		// The function to execute when clicking on the map
		map.on("click", function(evt){
			// Create the geometric circle in which to search for graves
      circle = new Circle({
        center: evt.mapPoint,			// Centered on the point of clicking
        radius: 0.35,							// Radius in which to look for graves
        radiusUnit: "esriMeters"	// The unit of the radius, in this case meters
      });
      // Clear the graphics on the map and add the new circle
      map.graphics.clear();
      map.infoWindow.hide();
      var graphic = new Graphic(circle, circleSymb);
      map.graphics.add(graphic);

      // Create a query for the FeatureLayer to search for graves within the perimeter
      var query = new Query();
      query.geometry = circle.getExtent();
      featureLayer.queryFeatures(query, selectInBuffer);
    });

		// The selection function which fetches the GraveID from the FeatureLayer
    function selectInBuffer(response){
      var features = response.features;
      if(features.length > 0) {
      	var objectId = features[0].attributes.OBJECTID;
				$.ajax({
					url: mapServerURL + "/0/query?where=OBJECTID=" + objectId + "&outFields=grafcode&f=json",
					async:false
				})
					.done(function(data) {
						var json = $.parseJSON(data);
						var code = json.features[0].attributes.grafcode;
						graveId = code;
					});

				console.log("GraveId: " + graveId);

    	}
    }
});

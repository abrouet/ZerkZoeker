var Map = (function()
{
    // The id of the div in which to display the map
    var mapDivId = "mapdiv";

    var cemetery; // the name of the location
    var location; // location info (as defined in functions.js)
    var municip; // Municipality info (as defined in functions.js)

    var defaultGraveDetailTop;
    var defaultWrapperHeight = '112px';

    function Map()
    {
      console.log('[Map.js] init');

      // Get all context info about cemetery and municipality
      cemetery = $.localStorage.get('zz_location');
      getLocationInfo(cemetery, function(response) {location = response;} );
      getMunicipalityInfo(location.municipality, function(response) {municip = response;} );

      console.log(municip.mapServerURL);

      //load template
      $("#view2").html('').css('left',0).load("templates/map.html", function(){
        //set default height (no interefering with events from map)
        defaultGraveDetailTop = $(window).height()*0.55;
        setWrapperHeight(defaultWrapperHeight);

        //set location
        storage = $.localStorage;
        $('#view_map header h1').text(storage.get('zz_location'));

        bindEvents();
        //clickedGravePoint();
        buildMap();
      });
    }

    function filterKeyUp(e)
    {
        setWrapperHeight($(window).height());
        if(parseFloat($('#grave_detail').css('top')) < $(window).height()){
          closeGraveDetail();
        }
        if($("#names_wrapper").hasClass('hide')){
          $("#names_wrapper").removeClass('hide');
        }

        // Retrieve the input field text and reset the count to zero
        var name = $(this).val();

        if(name.length == 0){
          setWrapperHeight(defaultWrapperHeight);
          $("#names_wrapper").addClass('hide');
        }

        // Loop through the comment list
        $(".names li").each(function(){
            if ($(this).text().search(new RegExp(name, "i")) < 0) {
                $(this).hide();
            } else {
                var html = addSpanToFilterResult($(this), name);
                $(".names .border_radius_bottom").removeClass('border_radius_bottom');
                $(this).html(html).show().addClass("border_radius_bottom");
            }
        });

        if(name == 0){
            $(".names li").each(function(){
                $(this).hide();
            });
        }
    }

    function buildMap(e) {
      console.log('[Map.js] buildMap');
      require([
        // Required to build the map and fetch the layer with graves
        "esri/map",
        "esri/arcgis/utils",
        "esri/layers/FeatureLayer",
        "esri/SpatialReference",
        "esri/geometry/Point",
        "esri/geometry/ScreenPoint",
        // Required to draw the circle when clicking
        "esri/tasks/query",
        "esri/geometry/Circle",
        "esri/graphic", "esri/InfoTemplate",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        //"esri/symbols/SimpleFillSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/PictureFillSymbol",
        "esri/renderers/SimpleRenderer",
        "esri/config",
        "esri/Color",
        // Required to wait for the Document Object to be ready before executing
        "dojo/domReady!"
        ], function(Map,
                    arcgisUtils,
                    FeatureLayer,
                    SpatialReference,
                    Point,
                    ScreenPoint,
                    Query,
                    Circle,
                    Graphic,
                    InfoTemplate,
                    SimpleMarkerSymbol,
                    SimpleLineSymbol,
                    //SimpleFillSymbol,
                    PictureMarkerSymbol,
                    PictureFillSymbol,
                    SimpleRenderer,
                    esriConfig,
                    Color) {

          // Fetch the graphics layers and add them to the map
          Map = new Map(mapDivId);
          //Map.removeAllLayers();
          var layer = new esri.layers.ArcGISTiledMapServiceLayer(municip.mapServerURL);
          Map.addLayer(layer);

          // Fetch the FeatureLayer which contains the gravepoints
          var tombLayerURL = municip.mapServerURL + municip.graveLayerURL;
          var featureLayer = new FeatureLayer(tombLayerURL);

          Map.centerAndZoom(new Point(location.startCoords.x, location.startCoords.y, new SpatialReference(municip.wkid)), location.startCoords.zoom);

          // Create the circle to display when clicking on the map
          /*var locationMarkerUrl = 'img/icon_map_marker.png';
          var sls = new SimpleLineSymbol(SimpleFillSymbol.STYLE_NULL, new Color([255, 0, 0]), 2);
          var circleSymb = new PictureFillSymbol(locationMarkerUrl,sls,35,35);*/

          var locationMarkerUrl = 'img/icon_map_marker.png';
          var circleSymb = new PictureMarkerSymbol(locationMarkerUrl,35,35);

          // The circle which represents the perimeter in which to look for graves
          // this is defined here because it's used in multiple functions.
          var circle;// Zooms and centers the map when clicking on it

          // The function to execute when clicking on the map
          Map.on("click", function(evt){
            Map.centerAndZoom(evt.mapPoint, 10);
            // Create the geometric circle in which to search for graves
            circle = new Circle({
              center: evt.mapPoint,			// Centered on the point of clicking
              radius: 0.85,							// Radius in which to look for graves
              radiusUnit: "esriMeters"	// The unit of the radius, in this case meters
            });
            // Clear the graphics on the map and add the new circle
            Map.graphics.clear();
            Map.infoWindow.hide();
            var graphic = new Graphic(evt.mapPoint, circleSymb);
            Map.graphics.add(graphic);

            // Create a query for the FeatureLayer to search for graves within the perimeter
            var query = new Query();
            query.geometry = circle.getExtent();
            featureLayer.queryFeatures(query, selectInBuffer);
          });

          /** The selection function which fetches the GraveID from the FeatureLayer,
          * this GraveID is needed to request the personal info about from the database.
          */
          function selectInBuffer(response){
            var feature = response.features[0];
            console.log(feature);
            // TODO: redirect dynamically to function.js; this did not work when tried earlier...
            if(location.municipality == 'AVE') {
              fetchGraveId(feature.attributes.OBJECTID_1);
            } else {
              fetchGraveId(feature.attributes.OBJECTID);
            }
          }
      });

      function fetchGraveId(objectId) {
        console.log(objectId);
         $.ajax({
          url: municip.mapServerURL + municip.graveLayerURL + "/query?where=OBJECTID=" + objectId + "&outFields=*&f=json",
          async:false
        })
          .done(function(data) {
            var json = $.parseJSON(data);
            if(json.features.length > 0) {
              getGraveId(location.municipality, json.features[0], function(response){ loadGraveData(response); });
            }
          });
      }

    }

    function loadGraveData(graveId){
      console.log('[Map.js] loadGraveData with id: '+graveId);
      ///getPersonByNameAtCemetery/
      storage = $.localStorage;
      var url = 'backend/index.php/getPersonByCodeAtCemetery/'+storage.get('zz_location')+'/'+graveId;
      $.ajax({
        dataType: "json",
        type:'GET',
        url:url,
        success: function(graveData){
          console.log('[Map.js] ajax success:');
          console.log(graveData[0]);
          clickedGravePoint();
          fillGraveInfo(graveData);
        },error: function (xhr, ajaxOptions, thrownError){}
      });
    }

    function fillGraveInfo(graveData){
      $("#dim1 h3").html('1');
      $("#dim1 h4").html('3');
      $('#dim2 h4').html("2");
      $('.death').html("1.1.1920");

    }
    function clickedGravePoint(e){
      setWrapperHeight($(window).height());
      if(e){e.preventDefault();}
      $('#close_map_detail_maplink').show();
      if($("#grave_detail").hasClass('hide')){
        $("#grave_detail").removeClass('hide');
      }
      //load persons
      //TODO:als er geen personen zijn verwijder $('#people')
      $('#grave_detail').css('top', '100%').animate({
          top: defaultGraveDetailTop
      }, 600);
    }

    function closeGraveDetail(e){
      if(e){e.preventDefault();}
      $('#close_map_detail_maplink').hide();
      $('#grave_detail').animate({
          top: $(window).height()+'px'
      }, 600, function(e){
        if(!$("#filter").is(":focus")){
          setWrapperHeight(defaultWrapperHeight);
        }
      });
    }

    function tappedBackButton(e){
      if(e){e.preventDefault();}
      $(window).trigger("BACK_TO_HOME");
    }

    function bindEvents(){;
      $('#close_detail').on('click touchend', closeGraveDetail);
      $('#back_button').on('click touchend', tappedBackButton);
      $('#close_map_detail_maplink').on('click touchend', closeGraveDetail);
      $("#view_map #filter").on('keyup', filterKeyUp);
    }

    //utilities
    function setWrapperHeight(height){
      $('#wrapper').css('height', height);
    }

    return Map;

})();

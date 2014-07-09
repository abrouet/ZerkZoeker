var Map = (function()
{
    var mapDivId = 'mapdiv'; // The id of the div in which to display the map
    
    var graveDetailTemplate, personTemplate;

    var cemetery; // the name of the location
    var location; // location info (as defined in functions.js)
    var municip; // Municipality info (as defined in functions.js)

    var defaultGraveDetailTop;
    var defaultWrapperHeight = '112px';

    function Map()
    {
      console.log('[Map.js] init');

      // Get all context info about cemetery and municipality
      cemetery = $.localStorage.get('zz_location'); // local storage contains which cemetery the user selected
      getLocationInfo(cemetery, function(response) {location = response;} ); // call to functions.js which returns a JSON object with all location info
      getMunicipalityInfo(location.municipality, function(response) {municip = response;} ); // call to functions.js which returns a JSON object with all municipality info

      //load templates
      $('#view2').html('').css('left',0).load('templates/map.html', function(){
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
      $.get("templates/grave_detail.html", function(html){
          graveDetailTemplate = html;
      });
      $.get("templates/person.html", function(html){
          personTemplate = html;
      });
    }

    function filterKeyUp(e)
    {
        setWrapperHeight($(window).height());
        if(parseFloat($('#grave_detail').css('top')) < $(window).height()){
          closeGraveDetail();
        }
        if($('#names_wrapper').hasClass('hide')){
          $('#names_wrapper').removeClass('hide');
        }

        // Retrieve the input field text and reset the count to zero
        var name = $(this).val();

        if(name.length == 0){
          setWrapperHeight(defaultWrapperHeight);
          $('#names_wrapper').addClass('hide');
        }

        // Loop through the comment list
        $('.names li').each(function(){
            if ($(this).text().search(new RegExp(name, 'i')) < 0) {
                $(this).hide();
            } else {
                var html = addSpanToFilterResult($(this), name);
                $('.names .border_radius_bottom').removeClass('border_radius_bottom');
                $(this).html(html).show().addClass('border_radius_bottom');
            }
        });

        if(name == 0){
            $('.names li').each(function(){
                $(this).hide();
            });
        }
    }

    function buildMap(e) {
      console.log('[Map.js] buildMap');
      // The next call is from the ArcGIS API and makes sure dependencies are loaded before building the map
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
        ], function(Map,            // The API specifies how this call looks, first a list of all imports (as seen above),
                    arcgisUtils,    // and now a 'callback' function with an argument for each import
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

          // Empty out the div to make sure the new map has a clean workspace to build in
          $('#' + mapDivId).empty();

          // Fetch the graphics layers and add them to the map
          Map = new Map(mapDivId);
          var layer = new esri.layers.ArcGISTiledMapServiceLayer(municip.mapServerURL);
          Map.addLayer(layer);

          // Fetch the FeatureLayer which contains the gravepoints
          var tombLayerURL = municip.mapServerURL + municip.graveLayerURL;
          var featureLayer = new FeatureLayer(tombLayerURL);

          // Center at the starting location specified for this location
          Map.centerAndZoom(new Point(location.startCoords.x, location.startCoords.y, new SpatialReference(municip.wkid)), location.startCoords.zoom);

          // Create the marker that appears upon clicking
          var locationMarkerUrl = 'img/icon_map_marker.png';
          var circleSymb = new PictureMarkerSymbol(locationMarkerUrl,35,35);

          // The circle which represents the perimeter in which to look for graves
          // this is defined here because it's used in multiple functions.
          var circle;

          // The function to execute when clicking on the map
          Map.on('click', function(evt){
            // Center the map on the clicking point and zoom in to the max level
            Map.centerAndZoom(evt.mapPoint, 10);
            // Create the geometric circle in which to search for graves around the clicking point
            circle = new Circle({
              center: evt.mapPoint,     // Centered on the point of clicking, the point where the click registered
              radius: 0.6,              // Radius in which to look for graves, not too big, not too small (keep smartphone users in mind)
              radiusUnit: 'esriMeters'  // The unit of the radius, in this case meters
            });
            // Clear the graphics on the map and add the new circle
            Map.graphics.clear();
            Map.infoWindow.hide();
            var graphic = new Graphic(evt.mapPoint, circleSymb);
            Map.graphics.add(graphic);

            // Create a query for the FeatureLayer to search for graves within the perimeter
            var query = new Query();
            // The query object can have a geometry object, in this case the circle
            query.geometry = circle.getExtent();
            // We query the FeatureLayer about it's features, arguments are the query and the callback function
            featureLayer.queryFeatures(query, selectInBuffer);
          });

          Map.on('pan', function(evt) {
            //TODO: implement to enforce the boundaries of a specific map
          });

          /** 
           * The selection function which fetches the GraveID from the FeatureLayer,
           * this GraveID is needed to request the personal info about from the database.
           */
          function selectInBuffer(response){
            // Make sure a feature is found (aka: the features array is longer than 0)
            if(response.features.length > 0) {
              var feature = response.features[0];
              // Next we fetch the object ID of the first feature
              // TODO: redirect dynamically to function.js; this did not work when tried earlier...
              if(location.municipality == 'AVE') {
                fetchGraveId(feature.attributes.OBJECTID_1); // On the Avelgem server, the object ID column has a different name; this has been tested
              } else {
                fetchGraveId(feature.attributes.OBJECTID);
              }
            }
          }

          /**
           * The map will query the FeatureLayer about the location of a certaing grave,
           * and then zoom in on it.
           *
           */
          function goToGrave(graveId) {
            // There is a slight delay specified here to allow the graphics layer to be constructed,
            // this is required when a person is selected when the map is not yet loaded. The loading
            // happens asynchronous from this function, the delay allows for the loading to be completed.
            // We can assume that a 200ms loading time is enough for the loading to fully complete.
            setTimeout(function(){
              console.log['[Map.js] goToGrave'];
              var dirty = (new Date()).getTime();
              var graveLoc;
              $.ajax({
                url:municip.mapServerURL+municip.graveLayerURL+"/query?where="+municip.tombcode+"='"+graveId+"' AND "+dirty+"="+dirty+"&f=json",
                async:true,
                type:'GET',
                dataType:'json',
                success:function(response) {
                  console.log(response);
                  if(response.features.length > 0) {
                    getGraveLocation(location.municipality, response.features[0], function(location) {graveLoc = location;});
                    var point = new Point(graveLoc.x, graveLoc.y, new SpatialReference(municip.wkid));
                    Map.centerAndZoom(point, 10);
                    loadGraveData(graveId);
                    // Clear the graphics on the map and add the marker
                    console.log(Map);
                    console.log(Map.graphics);
                    Map.graphics.clear();
                    Map.infoWindow.hide();
                    var graphic = new Graphic(point, circleSymb);
                    Map.graphics.add(graphic);
                  }
                }
              });
            }, 200);
          }

          // This will check if the local storage contains a target grave to go to,
          // if so, the map will go to the grave, and then delete the variable.
          if(!$.localStorage.isEmpty('zz_target')) {
            console.log('[Map.js] localStorage("zz_target") = ' + $.localStorage.get('zz_target'));
            goToGrave($.localStorage.get('zz_target'));
            $.localStorage.remove('zz_target');
          }

      }); // require() end

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

    } // BuildMap end

    function loadGraveData(graveId){
      ///getPersonByNameAtCemetery/
      storage = $.localStorage;
      var url = 'backend/index.php/getPersonByCodeAtCemetery/'+storage.get('zz_location')+'/'+graveId;
      $.ajax({
        dataType: 'json',
        type:'GET',
        url:url,
        success: function(graveData){
          console.log('[Map.js] ajax success: grave data received.');
          console.log(graveData);
          if(graveData.length > 0){
            clickedGravePoint();
            fillGraveInfo(graveData);
          }
        },error: function (xhr, ajaxOptions, thrownError){}
      });
    }

    function fillGraveInfo(graveData){
      //grave kind
      switch(graveData[0]['type'].toLowerCase()){
        case 'columbarium':
          $('#grave_kind img').attr('src','img/grave_types/columbarium.png');
          break;
        case 'strooiweide':
          $('#grave_kind img').attr('src','img/grave_types/strooiweide.png');
          break;
        case 'urnenveld':
          $('#grave_kind img').attr('src','img/grave_types/urn.png');
          break;
        case 'graf':
        case 'graf/urneveld':
        default:
          $('#grave_kind img').attr('src','img/grave_types/graf.png');
          break;
      }
      //row
      $("#row h4").text(graveData[0]['dim1']);
      //number
      $('#number h4').text(graveData[0]['dim2']);

      //number of people
      $('#numberOfPeople').text(graveData.length);
      if(graveData.length == 1){
        var correctedString = $('#people_count').html().replace('rusten', 'rust').replace('personen', 'persoon');
        $('#people_count').html(correctedString);
      }

      //people
      $.each(graveData, function(index, object) {
          $('#people').append(personTemplate);
          var lastAddedPerson = $('#people .person:last-child');

          //name
          var firstName = '';
          var lastName = '';
          if(object['firstName'].length > 0){firstName = object['firstName'].toLowerCase()};
          if(object['familyName'].length > 0){lastName = object['familyName'].toLowerCase()};
          lastAddedPerson.find('h5').text(firstName + ' ' + lastName);

          //birth & death date
          if(object['birthDate'] && object['birthDate'].length > 0){
            lastAddedPerson.find('div').find('p').first().text(object['birthDate']);
          }else{
            lastAddedPerson.find('div').find('p').first().remove();
            lastAddedPerson.find('div').find('p').last().css('width', '100%');
          }
          if(object['dateOfDeath'] && object['dateOfDeath'].length > 0){
            lastAddedPerson.find('div').find('p').last().text(object['dateOfDeath']);
          }else{
            lastAddedPerson.find('div').find('p').last().remove();
            lastAddedPerson.find('div').find('p').first().removeClass('border_right_green').css('width', '100%');
          }
      });
    }
    function clickedGravePoint(e){
      setWrapperHeight($(window).height());
      if(e){e.preventDefault();}
      $('#view_map').append(graveDetailTemplate);
      bindEvents();
      //load persons
      //TODO:als er geen personen zijn verwijder $('#people')
      $('#grave_detail_wrapper').css('height', $(window).height()-$('#grave_detail_wrapper').offset().top);
      $('#grave_detail').css('top', '100%').animate({
          top: defaultGraveDetailTop
      }, 600, function(){
        makeScroll('#grave_detail_wrapper');
      });
    }

    function closeGraveDetail(e){
      if(e){e.preventDefault();}
      $('#close_map_detail_maplink').hide();
      $('#grave_detail').animate({
          top: $(window).height()+'px'
      }, 600, function(e){
        if(!$('#filter').is(':focus')){
          setWrapperHeight(defaultWrapperHeight);
        }
        $(this).remove();
        $('#close_map_detail_maplink').remove();
      });
    }

    function tappedBackButton(e){
      if(e){e.preventDefault();}
      $(window).trigger('BACK_TO_HOME');
    }

    function bindEvents(){;
      $('#close_detail').unbind().on('click touchend', closeGraveDetail);
      $('#back_button').unbind().on('click touchend', tappedBackButton);
      $('#close_map_detail_maplink').unbind().on('click touchend', closeGraveDetail);
      $('#view_map #filter').unbind().on('keyup', filterKeyUp);
    }

    //utilities
    function setWrapperHeight(height){
      $('#wrapper').css('height', height);
    }

    return Map;

})();

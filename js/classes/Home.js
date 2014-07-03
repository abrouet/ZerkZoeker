var Home = (function()
{
    var resultsScroller, arrNames, personTemplate, numResultsToShow, moreResultsAvailable;

    function Home()
    {
      console.log('[Home.js] init');
      numResultsToShow = 30;
      moreResultsAvailable = false;

      //load template
      $("#view1").html('').css('left',0).load("templates/home.html", function(){
        $('#wrapper').css('height', $(window).height());
        var url = 'backend/index.php/getCemeteries';
        $.ajax({
          dataType: "json",
          type:'GET',
          url:url,
          success: function(cemeteries){
            var cemeteriesList = '<ul>';
            $('#scroller').append('<ul id="results"></ul>');
            $.get("templates/location.html", function(data){
              for(var i = 0; i < cemeteries.length; i++){
                  var html = data.replace('place', cemeteries[i]);
                  if(cemeteries[i].length > 0){
                    $('#results').append(html);
                    $('#results .location:last-child').on('click', tappedLocation).on('touchend', tappedLocation).css('opacity', 0).delay(i*25).animate({
                      opacity: 1
                    }, 350);
                  }
                  if(i == cemeteries.length-1){
                      $('#results .location:last-child').addClass('border_radius_bottom');
                  }
              }
              $('#view_home #wrapper').css('height', $(window).height()-$('#form').offset().top-$('form').height());
              makeScroll();
              bindEvents();
            });
          },error: function (xhr, ajaxOptions, thrownError){}
        });
      });

    }

    function tappedLocation(e){
      e.preventDefault();
      console.log('[Home.js] tappedLocation: '+$(this).text());

      //save chosen location in local storage
      ns = $.initNamespaceStorage('zz_location');
      ns.localStorage;
      storage = $.localStorage;
      storage.set('zz_location',$(this).text());
      $(window).trigger("GO_TO_MAP");
    }

    function filterKeyUp(e){
      var search = $(this).val();
      if(search.length == 1){
        updateCityList(search);
        //get all names starting with first letter entered
        var url = 'backend/index.php/getPersonByName/'+search;//by name or year
        $.ajax({
          dataType: "json",
          type:'GET',
          url:url,
          success: function(names){
            arrNames = names;
            $.get("templates/person_listitem.html", function(data){
              personTemplate = data;
              /*if(names.length < numResultsToShow){
                numResultsToShow = names.length;
              }*/
              updateNameList(search);
              makeScroll();
            });
          },error: function (xhr, ajaxOptions, thrownError){}
        });
      }else if(search.length > 0){
        //update cities
        updateCityList(search);
        updateNameList(search);
        makeScroll();
      }else{
        $("#view_home .location").each(function(index, value) {
          $(this).html($(this).html().replace('<span>','').replace('</span>','')).show();
        });
        $("#view_home .person").remove();
        makeScroll();
      }
    }

    function updateCityList(search){
      $("#view_home .location").each(function(index, value) {
          if ($(this).text().search(new RegExp(search, "i")) < 0) {
            $(this).hide();
          }else{
            var html = addSpanToFilterResult($(this), search);
            $("#view_home .location").removeClass('border_radius_bottom');
            $(this).html(html).show().addClass("border_radius_bottom");
          }
      });
    }

    function updateNameList(search){
      $("#view_home .person").remove();
      $("#view_home .show_more_results").remove();
      moreResultsAvailable = false;
      numResultsToShow = 0;
      for(var j = 0; j < arrNames.length; j++){
        var firstName = '';
        if(arrNames[j]['firstName']){
          firstName = arrNames[j]['firstName'].toLowerCase();
        }
        var lastName = '';
        if(arrNames[j]['familyName']){
          lastName = arrNames[j]['familyName'].toLowerCase();
        }
        var birthYear = '';
        if(arrNames[j]['birthDate']){
          birthYear = arrNames[j]['birthDate'].substring(0, 4);
        }
        var deathYear = '';
        if(arrNames[j]['dateOfDeath']){
          deathYear = arrNames[j]['dateOfDeath'].substring(0, 4);
        }
        var regExpCheckString = firstName + '' + '' + lastName + '' + birthYear + '' + deathYear;

        if(numResultsToShow < 30 && (regExpCheckString.indexOf(search.toLowerCase()) >= 0)){
          var name = '';
          if(arrNames[j]['firstName'] && arrNames[j]['familyName']){
            name = arrNames[j]['firstName'].toLowerCase()+' '+arrNames[j]['familyName'].toLowerCase();
          }else if(arrNames[j]['firstName']){
            name = arrNames[j]['firstName'].toLowerCase();
          }else if(arrNames[j]['familyName']){
            name = arrNames[j]['familyName'].toLowerCase();
          }
          if(name.length > 0){
            var html = personTemplate.replace('name', name);
            $('#results').prepend(html);
          }
          numResultsToShow++;
        }
        if(numResultsToShow == 30){
          moreResultsAvailable = true;
        }
      }
      $("#view_home .person").each(function(index, value) {
          if ($(this).text().search(new RegExp(search, "i")) >= 0) {
            var html = addSpanToFilterResult($(this), search);
            $("#view_home .person").removeClass('border_radius_bottom');
            $(this).html(html).addClass("border_radius_bottom");
          }
      });
      /*if(moreResultsAvailable){
        var html = personTemplate.replace('name', 'show more results').replace('person','show_more_results');
        $('#results').append(html);
      }*/
    }

    function makeScroll(){
      var visibleElements = 0;
      $('#results li').each(function(index, value) {
          if($(this).is(":visible")){
            visibleElements++;
          }
      });
      console.log('visible elements: '+visibleElements);
      $('#view_home #scroller, #view_home #results').css('height',
      ((parseFloat($('#results .location:last-child').css('height'))+parseFloat($('.location').css('margin-top')))
      *visibleElements+20)+'px');
      resultsScroller = new IScroll('#view_home #wrapper');
    }

    function bindEvents(){
      $("#view_home #filter").on('keyup', filterKeyUp);
    }

    return Home;

})();

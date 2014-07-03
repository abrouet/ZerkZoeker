var Home = (function()
{
    function Home()
    {
      console.log('[Home.js] init');

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
              $('#view_home #scroller, #view_home #results').css('height',
              ((parseFloat($('#results .location:last-child').css('height'))+parseFloat($('.location').css('margin-top')))
              *cemeteries.length)+'px');
              var resultsScroller = new IScroll('#view_home #wrapper');
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
      console.log(search.length);
      if(search.length == 1){
        console.log('test');
        updateCityList(search);
        //get all names starting with first letter entered
        var url = 'backend/index.php/getPersonByName/'+search;//by name or year
        $.ajax({
          dataType: "json",
          type:'GET',
          url:url,
          success: function(names){
            //var name = names[0]['firstName'].toLowerCase()+' '+names[0]['familyName'].toLowerCase();
            /*$.get("templates/location.html", function(data){
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
              $('#view_home #scroller, #view_home #results').css('height',
              ((parseFloat($('#results .location:last-child').css('height'))+parseFloat($('.location').css('margin-top')))
              *cemeteries.length)+'px');
              var resultsScroller = new IScroll('#view_home #wrapper');
              bindEvents();
            });*/

          },error: function (xhr, ajaxOptions, thrownError){}
        });
      }else if(search.length > 0){
        //update cities
        updateCityList(search);
      }else{
        $("#view_home .location").each(function(index, value) {
          $(this).html($(this).html().replace('<span>','').replace('</span>','')).show();
        });
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

    function bindEvents(){
      $("#view_home #filter").on('keyup', filterKeyUp);
    }

    return Home;

})();

var Home = (function()
{
    function Home()
    {
      console.log('[Home.js] init');

      //load template
      $("#view1").html('').css('left',0).load("templates/home.html", function(){
        $('#wrapper').css('height', $(window).height());
        var url = 'backend/index.php/getCemeteries'
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
                    $('#results .location:last-child').addClass('border_radius_bottom').on('click', tappedLocation).css('opacity', 0).delay(i*25).animate({
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
      console.log(storage.get('zz_location'));
    }

    return Home;

})();

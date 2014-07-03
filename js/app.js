/**
 * Created by ruben on 1-7-14.
 */

var home, map, transitionDuration;

(function()
{
    function init()
    {
      console.log('[main.js] init');
      document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
      transitionDuration = 500;

      //Create View
      //map = new Map();
      home = new Home();

      //set default position wrapper
      //$("#wrapper").css('left',-$(window).width());

      //dispatched events
      $(window).on("BACK_TO_HOME", backToHomeTransition);
      $(window).on("GO_TO_MAP", goToHomeTransition);
    }

    function backToHomeTransition(e){
      console.log('[app.js] backToHomeTransition');
      home = new Home();
      $('#mapdiv').animate({left:$(window).width()}, transitionDuration);
      $('#wrapper').animate({
        left: 0
      }, transitionDuration, function(e){
        $("#view2").html('');
      });
    }

    function goToHomeTransition(e){
      map = new Map();
      $('#mapdiv').animate({left:0}, transitionDuration);
      $('#wrapper').animate({
        left: -$(window).width()
      }, transitionDuration, function(e){
        $("#view1").html('');
      });
    }

    init();

})();

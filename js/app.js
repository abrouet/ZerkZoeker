/**
 * Created by ruben on 1-7-14.
 */

var home, map;

(function()
{
    function init()
    {
      console.log('[main.js] init');
      document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
      map = new Map();
      //home = new Home();

      //set default position wrapper
      $("#wrapper").css('left',-$(window).width());

      //dispatched events
      $(window).on("BACK_TO_HOME", backToHomeTransition);
    }

    function backToHomeTransition(e){
      console.log('[app.js] backToHomeTransition');
      home = new Home();
      var duration = 500;
      $('#mapdiv').animate({left:$(window).width()}, duration);
      $('#wrapper').animate({
        left: 0
      }, duration, function(e){
        $("#view2").html('');
      });
    }

    init();

})();

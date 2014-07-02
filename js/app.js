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
      $("#view1").load("templates/home.html");
      $('#wrapper, #mapdiv').animate({
        left: 0
      }, 500, function(e){
        $("#view2").html('');
      });
    }

    init();

})();

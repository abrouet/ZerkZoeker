var Home = (function()
{
    function Home()
    {
      console.log('[Home.js] init');

      //load template
      $("#wrapper").html('').css('left',0).load("templates/home.html", function(){
        //home loaded
      });
    }

    return Home;

})();

var Home = (function()
{
    function Home()
    {
      console.log('[Home.js] init');

      //load template
      $("#view1").html('').css('left',0).load("templates/home.html", function(){
        //home loaded
        var url = 'backend/index.php/getCemeteries'
        $.ajax({
          dataType: "json",
          type:'GET',
          url:url,
          success: function(cemeteries){
            console.log('[Home.js] ajax success:');
            console.log(cemeteries.toJSON());
          },error: function (xhr, ajaxOptions, thrownError){}
        });
      });
    }

    return Home;

})();

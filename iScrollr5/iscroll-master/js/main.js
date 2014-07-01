/**
 * Created by ruben on 1-7-14.
 */

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$("#filter").keyup(function(){

    // Retrieve the input field text and reset the count to zero
    var name = $(this).val();

    // Loop through the comment list
    $(".names li").each(function(){

        if ($(this).text().search(new RegExp(name, "i")) < 0) {
            $(this).hide();

        } else {
            $(this).show();
        }
    });

    if(name == 0){
        $(".names li").each(function(){
            $(this).hide();
        });
    }

});

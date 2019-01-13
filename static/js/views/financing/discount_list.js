$(function(){

    var container = $("#discount_list");

    container.on("click","table tbody tr",function(e){
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).attr("data-href");
        window.location = href;
    });

    container.on("click","a.view-update",function(e){
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).attr("data-href");
        window.location = href;
    });

    /* ======================================== init page view ======================================== */



    /* ======================================== bind page events ======================================== */


    /* ======================================== methods ======================================== */


});


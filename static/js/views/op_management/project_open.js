$(function(){
    var container = $("#project-open");
    $("#preloader").fadeOut("fast");
    /* ======================================== init the page view ======================================== */
    /* ======================================== bind the event ======================================== */

    container.on("click",".zl-clickable",function(e){
        e.stopPropagation();
        e.preventDefault();
        var dataHref = $(this).attr("data-href");
        if(dataHref==""||dataHref==null){
            return;
        }
        window.location = dataHref;
    });


    container.on("click",".go-to-arrears-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        var state = top.angular_state||{go:function(){}};
        top.angular_state.go("arrearage");
    });

    container.on("click","#js-avg-rent",function(e){
        e.preventDefault();
        location.href="average_rent_all.html"
    })

    /* ======================================== methods ======================================== */


});
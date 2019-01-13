(function(){
    $("#preloader").fadeOut("fast");


    var page = $("#activity-enrolment");
    var tempHtml = page.find("[name=template]").html();
    page.on("click","a.del-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest("tr").remove();
    });

    //page.on("click","a.add-btn",function(e){
    //    e.stopPropagation();
    //    e.preventDefault();
    //    location.href="activity_add"
    //});
})();

(function(){

    $("#preloader").fadeOut("fast");

    var page = $("#lessee-list");

    page.on("click",".zl-table-block table tbody tr",function(e){
        e.stopPropagation();
        e.preventDefault();
        window.location = "lessee_detail.html";
    });



})();

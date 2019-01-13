(function(){
    $("#preloader").fadeOut("fast");

    var page = $("#arrears-platform");

    page.on("click",".zl-checkbox",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).toggleClass("checked");
    });



    page.on("click",".zl-table tbody tr",function(e){
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).find("td:nth-child(1)").html();
        var name = $(this).find("td:nth-child(2)").html();
        window.location = "arrears_platform_detail.html";
    });

    page.find(".zl-datetimepicker input.form-control,.zl-date-select input.form-control").datetimepicker({
        language: "zh-CN",
        format:"yyyy-mm-dd",
        todayBtn:false,
        startView:2,
        minView:2,
        weekStart: 1,
        todayHighlight: true,
        autoclose: true,
        forceParse: false
    });



})();

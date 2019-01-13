var arrearsPlatformDetailView=(function($){
    var arrearsPlatformDetailView = {};

    var page = $("#arrears-platform-detail");

    function bindPageEvents(){
        page.on("click",".zl-checkbox",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass("checked");
        });



        page.on("click",".print-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            var screenWidth = (screen.availWidth - 10);
            var screenHeight = (screen.availHeight-50);
            var subWin = window.open("../../../pages/finance/arrears_details_print.html", "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
            subWin.onload=function(){
                setTimeout(function(){
                    subWin.print();
                },100);
            };
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

        page.on("click","a.leave-msg-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            var text = $(this).prev().val();
            var user = "admin";
            page.find(".zl-edit-panel-right .msg-item-list").append("<li><em>"+user+"</em><span>"+text+"</span></li>");
            $(this).prev().val("");

        });
    }

    arrearsPlatformDetailView.init = function(){
        $("#preloader").fadeOut("fast");

        bindPageEvents();
    };

    return arrearsPlatformDetailView;
})(jQuery);




$(document).ready(function(){
    arrearsPlatformDetailView.init();
});
var pageView=(function($){
    var pageView={};
    var container=$("#invoice-list");  
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var ys_main_swiper = new Swiper('.zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false,
            observer:true,
            observeParents:true
        });

        bindEvent();
    };
    function bindEvent(){
    	container.on("click",".zl-checkbox",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass("checked");
        });

        container.on("click","a.view-receipt-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            var width = $(window).width();
            var height = $(window).height();
            var features = "width='"+width+"',height='"+height+"'";
            window.open("./print_template/empty_receipt.html","_blank",features);
        });

        container.on("click",".print-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            var screenWidth = (screen.availWidth - 10);
            var screenHeight = (screen.availHeight-50);
            var subWin = window.open("./print_template/business_settlement_notice.html", "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
            subWin.onload=function(){
                setTimeout(function(){
                    subWin.print();
                },100);
            };
        });

        container.find(".zl-datetimepicker input.form-control,.zl-date-select input.form-control").datetimepicker({
            language: "zh-CN",
            format:"yyyy-mm",
            todayBtn:false,
            startView:4,
            minView:3,
            weekStart: 1,
            todayHighlight: true,
            autoclose: true,
            forceParse: false
        });

        $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
            var _index=$(this).index();

            $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

        });

        $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
            var _index=$(this).index();
            $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');
        })
    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
(function(){

    $("#preloader").fadeOut("fast");

    var page = $("#expense-verification-add");

    page.find(".zl-datetimepicker input").datetimepicker({
        language: "zh-CN",
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
        clearBtn:true
    });

    page.on("click",".zl-datetimepicker",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).find("input").datetimepicker("show");
    });

    var ys_main_swiper = new Swiper('#zl-floor-main-table', {
        scrollbar: '.swiper-scrollbar-a',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbarHide:false
    });

    page.on("click","a.view-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        var width = $(window).width();
        var height = $(window).height();
        var features = "width='"+width+"',height='"+height+"'";
        window.open("../../../pages/finance/scp/empty_receipt.html","_blank",features);
    });

    page.on("click",".zl-table-wrapper-swiper tbody tr",function() {
        //location.href="../../../pages/finance/scp/expense_verification_detail.html";

    });

    //page.on("click","a.view-receipt-btn",function(e){
    //    e.stopPropagation();
    //    e.preventDefault();
    //
    //    var width = $(window).width();
    //    var height = $(window).height();
    //    var features = "width='"+width+"',height='"+height+"'";
    //    window.open("../../../pages/finance/scp/empty_receipt.html","_blank",features);
    //
    //});

})();

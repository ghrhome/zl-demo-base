(function(){
    $("#preloader").fadeOut("fast");

    var page = $("#cost-account-receivable");

    page.on("click",".zl-checkbox",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).toggleClass("checked");
    });

    page.on("click","a.view-receipt-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        var width = $(window).width();
        var height = $(window).height();
        var features = "width='"+width+"',height='"+height+"'";
        window.open("./print_template/empty_receipt.html","_blank",features);
    });

    page.on("click",".print-btn",function(e){
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

    page.find(".zl-datetimepicker input.form-control,.zl-date-select input.form-control").datetimepicker({
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

    var ys_main_swiper = new Swiper('.zl-floor-main-table', {
        scrollbar: '.swiper-scrollbar-a',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbarHide:false,
        observer:true,
        observeParents:true
    });

    //update
    var printMod=false;
    page.on("click","#js-print-mod",function(e){
        var $checkbox=$(this).find(".zl-fake-checkbox");
        if($checkbox.hasClass("checked")){
            $checkbox.removeClass("checked");
            $("#js-toolbar-filters").show();
            $("#js-arrearage").hide();
            $(".js-print-mod").hide();
            printMod=false;
        }else{
            $checkbox.addClass("checked");
            $("#js-toolbar-filters").hide();
            $("#js-arrearage").show();
            $(".js-print-mod").show();
            printMod=true;
        }
    });

    var arrearageMod=false;
    page.on("click","#js-arrearage",function(e){
        var $checkbox=$(this).find(".zl-fake-checkbox");
        if($checkbox.hasClass("checked")){
            $checkbox.removeClass("checked");
            arrearageMod=false;
        }else{
            $checkbox.addClass("checked");
            arrearageMod=true;
        }
    })



})();

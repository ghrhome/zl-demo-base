(function(){

    $("#preloader").fadeOut("fast");

    var page = $("#bill-list");


    var ys_main_swiper = new Swiper('#zl-floor-main-table', {
        scrollbar: '.swiper-scrollbar-a',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbarHide:false
    });

    page.on("click","a.view-receipt-btn",function(e){
        e.stopPropagation();
        e.preventDefault();

        var width = $(window).width();
        var height = $(window).height();
        var features = "width='"+width+"',height='"+height+"'";
        window.open("../../../pages/finance/scp/empty_receipt.html","_blank",features);

    });

    page.on("click","tbody tr",function(){
        window.location="./bill_list_detail.html";
    })

})();

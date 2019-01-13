var pageView=(function($){
    var pageView={};
    // var container=$("#fin_payment_verification_detail");
    
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var ys_main_swiper_2 = new Swiper('#zl-floor-main-table-2', {
	        scrollbar: '.swiper-scrollbar-b',
	        slidesPerView: 'auto',
	        freeMode: true,
	        scrollbarHide:false
    	});
    	var ys_main_swiper = new Swiper('#zl-floor-main-table', {
	        scrollbar: '.swiper-scrollbar-a',
	        slidesPerView: 'auto',
	        freeMode: true,
	        scrollbarHide:false
    	});
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
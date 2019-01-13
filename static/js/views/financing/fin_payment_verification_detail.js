var baseView=(function($){
    var baseView={};
    var container=$("#fin_payment_verification_detail");
    
    baseView.init=function(){
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

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});
var pageView=(function($){
    var pageView={};
    var container=$("#expense_verification_add");
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
    	$(".zl-datetimepicker input").datetimepicker({
    		format:"yyyy-mm",
            todayBtn:"linked",
            startView:3,
            minView:3,
            autoclose: true,
            language:"zh-CN"
    	}).on("changeDate",function(){
    		console.log(123);
    	})
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
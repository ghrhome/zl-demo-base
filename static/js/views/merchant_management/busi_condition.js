var pageView=(function($){
    var pageView={};
    var container=$("#busi_condition");
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };
    function bindEvent(){
    	container.on("click",".btn-group button",function(){
    		$(".btn-group button").removeClass("active");
    		$(this).addClass("active");
    	});
    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
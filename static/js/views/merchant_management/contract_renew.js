var pageView=(function($){
    var pageView={};
    var container=$("#contract_renew");
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };
    function bindEvent(){
    	container.on("click",".btn-group button",function(){
    		$(".btn-group button").removeClass("active");
    		$(this).addClass("active");
    	});
        container.on("click",".zl-block tbody tr",function(){
            window.location="./contract_renew_add.html";
        })
    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
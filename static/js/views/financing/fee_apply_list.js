var pageView=(function($){
    var pageView={};
    var container=$("#fee_apply_list");  
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };
    function bindEvent(){
    	container.on("click","tbody tr",function(){
    		window.location="./fee_apply_detail.html";
    	})
    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
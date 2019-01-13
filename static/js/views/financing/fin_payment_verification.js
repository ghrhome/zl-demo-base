var baseView=(function($){
    var baseView={};
    var container=$("#fin_payment_verification");
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };
    function bindEvent(){
    	container.on("click","tbody tr",function(){
    		window.location="./fin_payment_verification_detail.html";
    	})
    }

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});
var baseView=(function($){
    var baseView={};
    var container=$("#contract_fee_list");
    function bindEvent(){
    	container.on("click","tbody tr",function(){
    		window.location="./contract_fee_detail.html";
    	})
    }
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});
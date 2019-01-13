var pageView=(function($){
    var pageView={};
    var container=$("#unknow_lessee_charge");  
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        container.on("click",".zl-block table tbody tr",function(){
        	window.location="./unknow_lessee_charge_detail.html";
        })
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
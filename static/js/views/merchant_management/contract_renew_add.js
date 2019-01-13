var pageView=(function($){
    var pageView={};
    var container=$("#contract_renew_add");
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };
    function bindEvent(){
    	container.on("click",".rent_way_radio_group .input-addon",function(){
    		var rentId=$(this).find("input[type=radio]").attr("id");
    		$("#rental-table-wrapper table").removeClass("show");
    		$("#rental-table-wrapper table[data-id="+rentId+"]").addClass("show");
    	})
    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
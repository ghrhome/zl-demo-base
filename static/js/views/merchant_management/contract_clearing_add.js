var pageView=(function($){
    var pageView={};
    var container=$("#contract_clearing_add");
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };
    function bindEvent(){
    	var externalTemplate = container.find("[name=template-for-external-operation]");
    	var confiscationTemplate = container.find("[name=template-for-confiscation-processing]");
    	container.on("click","a.deal-btn",function(e){
	        e.stopPropagation();
	        e.preventDefault();
	        var node = externalTemplate.tmpl();
	        $(this).closest("tr").after(node);
    	});
    	container.on("click","em.add-confiscation-processing",function(e){
        	e.stopPropagation();
        	e.preventDefault();
        	var node = confiscationTemplate.tmpl();
        	$(this).closest(".zl-block-section").find(".zl-section-content table tbody").append(node);
    	});
    	container.on("click",".delete-btn",function(e){
        	e.stopPropagation();
        	e.preventDefault();
        	$(this).closest("tr").remove();
    	});
    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
var pageView=(function($){
    var pageView={};
    var container=$("#data_vision");
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        // bindEvent();
        $("#zl-floor-item-4f").click(function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".zl-floor-dialog").modal();
        });
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
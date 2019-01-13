var pageView=(function($){
    var pageView={};
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
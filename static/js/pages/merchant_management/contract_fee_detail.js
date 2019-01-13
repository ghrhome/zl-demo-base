var baseView=(function($){
    var baseView={};
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
    };

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});
/**
 * Created by whobird on 2018/4/11.
 */

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
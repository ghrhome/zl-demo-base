/**
 * Created by whobird on 2018/4/11.
 */

var baseView=(function($){
    var baseView={};
    var container=$("#energy_consumption_enrolment_history");
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
    };

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});
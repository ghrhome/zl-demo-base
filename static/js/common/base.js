/**
 * Created by whobird on 2018/4/9.
 */

var pageView=(function($){
    var pageView={};
    pageView.eventInit=function(){

    }
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        confirmAlert.init();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
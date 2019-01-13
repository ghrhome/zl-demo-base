/**
 * Created by whobird on 2018/4/11.
 */

var baseView=(function($){
    var baseView={};
    var container=$("#energy_consumption_enrolment");
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };
    function bindEvent(){
    	container.on("click",".zl-block table a",function(e){
    		e.stopPropagation();
        	e.preventDefault();
        	window.location = "energy_consumption_enrolment_history.html";
    	})
    }
    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});
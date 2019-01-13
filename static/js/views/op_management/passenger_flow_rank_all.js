var pageView=(function($){
    var pageView={};
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        $(".zl-table-block tbody tr").on("click",function(){
        	window.location="./passenger_flow_project.html";
        })
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
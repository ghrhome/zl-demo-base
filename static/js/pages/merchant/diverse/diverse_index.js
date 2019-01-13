/**
 * Created by whobird on 2018/4/11.
 */

var baseView=(function($){
    var baseView={};


    baseView.dateRangeInit=function(){
        $(".zl-datetime-range").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
            clearBtn:true,
        }).on('changeDate', function(e){
            $("form").find("input[name=page]").val(1);
            $("form").find("input[name=startDate]").val($(".js-date-start").val());
            $("form").find("input[name=endDate]").val($(".js-date-end").val());
            // $("form").submit();
        });
    }

    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        baseView.dateRangeInit();

    };

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
    confirmAlert.init();
});
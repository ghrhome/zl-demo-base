var pageView = (function($){
    var pageView = {};
    pageView.init = function(){
        $("#preloader").fadeOut("fast");

        var ys_main_swiper = new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });

        var page = $("#certificate_detail");

        page.on("click", ".save-btn", function() {
            var arr = getSummaryBySelector("#zl-floor-main-table tr");
            var f = true;
            $.each(arr, function (i, obj) {
                if ($.trim(obj.summary) == '') {
                    alert('摘要不能为空');
                    f = false;
                    return false;
                }
            });
            var certId = $("input[name=certId]").val();
            var certDate = $("input[name=certDate]").val();
            if ($.trim(certDate) == '') {
                alert("凭证日期不能为空");
                return ;
            }
            if (!f) return;
            pageView.loadingShow();
            $.ajax({
                type: 'post',
                url : financeWeb_Path + "finance/certificates/updateCertificateItems.htm",
                data : {items : JSON.stringify(arr), certDate : certDate, certId : certId},
                dataType: 'json',
                error: function () {
                    pageView.loadingHide();
                    alert("系统异常");
                },
                success: function (res) {
                    pageView.loadingHide();
                    if (res.code == '0') {
                        alert(res.msg,"","",function(){
                            window.location = window.location;
                        });
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });

        page.on("click", ".cert-model-btn", function() {
            var dataId = $(this).attr("data-id");
            if (dataId) window.location = financeWeb_Path + 'finance/certificates/certificateModelView.htm?finCertificateModelId=' + dataId;
        });

        function getSummaryBySelector(selector) {
            var arr = [];
            $(selector).each(function () {
                var tmp = $(this).find("input").serializeArray();
                var obj = {};
                $.each(tmp, function (i, map) {
                    if(!(map.name in obj)){
                        obj[map.name] = map.value;
                    }
                });
                if(!$.isEmptyObject(obj)){
                    arr.push(obj);
                }
            });
            return arr;
        }
    };

    pageView.datepickerInit = function () {
        var datepicker = $(".zl-datetimepicker").find("input[name=certDate]").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate', function(e){
            // //$("form").find("input[name=effectiveDate]").val(e.timeStamp);
            // // $("form").find("input[name=effectiveDate]").val($(this).val());
            // $(this).parents('tr').find('input[name=businessPeriod]').val($(this).val().substr(0, 7));
        });
    };


    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
    pageView.datepickerInit();
});
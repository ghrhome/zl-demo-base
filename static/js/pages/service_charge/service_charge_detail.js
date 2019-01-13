
// 手续费
// liuqq at 2018-04-21

var pageView=(function($){
    var pageView={};
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var page = $("#service-charge-detail");

        //搜索
        page.on("click", ".search-btn", function() {
            $("form").submit();
        });
        //保存
        page.on("click", ".save-btn", function() {
            var mallId = $("form").find("input[name=mallId]").val();
            if (!mallId) {
                alert("请选择项目");
                return false;
            }
            if (checkForm()) {
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "serviceCharge/save.htm",
                    type: 'post',
                    data: $('form').serialize(),
                    error: function() {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (res) {
                        pageView.loadingHide();
                        res = JSON.parse(res);
                        if (res.code == "0") {
                            //window.location = "detail.htm?serviceChargeId=" + res.data;
                            alert("保存成功","","",function(){
                                window.location = "index.htm";
                            });
                        } else {
                            alert(res.msg);
                        }
                    }
                });
            }
        });

        //下拉
        $(".btn-group").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "projects"){
                    $("form").find("input[name=mallId]").val(val);
                    //$("form").find("input[name=mallName]").val();
                }
                if ($elem.data("id") == "paymentType") {
                    $elem.parents("tr").find("input[name$=paymentTermId]").val(val);
                }
            }
        });

        var trTemplate = $("#tr-template").html();
        page.on("click", ".tr-add", function () {
            var table = $(this).parents(".zl-section").find("table:first");
            var trs = table.find("tbody tr").length;
            var tr = $(trTemplate.replace(/(index)/g, trs).replace(/(left)/g, "[").replace(/(right)/g,"]."));
            table.append(tr);
            $(".btn-group").ysdropdown({
                callback:function(val, $elem){
                    if ($elem.data("id") == "paymentType") {
                        $elem.parents("tr").find("input[name$=paymentTermId]").val(val);
                    }
                }
            });
        });

        // 通用删除逻辑
        $(".zl-table").on("click", ".tr-subtract", function () {
            $(this).parents("tr").remove();
            var table = $("#zl-table-service-charge-detail");
            var trs = table.find("tbody tr");
            for (var i = 0; i < trs.length; i++) {
                $(trs[i]).find("input[name^=itemList]").each(function(index){
                    var name = $(this).attr('name');
                    name = name.replace(/\[*?\d\]/g, '[' + i + ']');
                    $(this).attr("name", name);
                });
            }
        });

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }
        function checkForm () {
            var flag = true;
            var paymentTermIds = new Array();
            $("#zl-table-service-charge-detail").find("input[name^=itemList][name$=paymentTermId]").each(function(i) {
                paymentTermIds.push($(this).val());
                if (!$(this).val()) {
                    flag = false;
                    alert("收款方式不能为空");
                    return false;
                }
            });
            if (!flag) return flag;
            var showTimes = 0;
            for (var i=0; i<paymentTermIds.length; i++) {
                for (var j=0; j<paymentTermIds.length; j++) {
                    if (paymentTermIds[i] == paymentTermIds[j]) showTimes++;
                }
                if (showTimes >= 2) {
                    flag = false;
                    alert("收款方式重复");
                    return false;
                    return false;
                }
                showTimes = 0;
            }
            if (!flag) return flag;
            $("#zl-table-service-charge-detail").find("input[name^=itemList][name$=taxRate]").each(function() {
                if (!$(this).val()) {
                    flag = false;
                    alert("费率不能为空");
                    return false;
                }
            });
            return flag;
        }
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
});
/*
   收款单位
 */

var pageView=(function($){
    var pageView={};
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var page = $("#late-fee-detail");

        //搜索
        page.on("click", ".search-btn", function() {
            $("form").find("input[name=page]").val(1);
            $("form").submit();
        });

        //到明细页
        page.on("click", ".zl-linkable", function () {
            var dataId = $(this).attr("data-id");
            if (dataId && parseInt(dataId)) window.location = financeWeb_Path + "lateFee/detail.htm?payeeUnitId=" + dataId;
        });
        page.on("input", "input[name^=itemList][name$=delayDays]", function () {
            var val = parseInt($(this).val());
            $(this).val(isNaN(val) ? '': val);
        });

        //下拉
        $(".btn-group").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "projects") {
                    $("form").find("input[name=mallId]").val(val);
                    $("form").find("input[name=mallName]").val($elem.find("button").html());
                }
                if ($elem.data("id") == "payee-unit") {
                    $elem.parents("tr").find("input[name^=itemList][name$=openBank]").val();//账户名
                    $elem.parents("tr").find("input[name^=itemList][name$=bankAccountId]").val();//账户号
                }
                if ($elem.data("id") == "fee-type") {
                    $elem.parents("tr").find("input[name$=itemType]").val(val);
                }
            }
        });

        //收费项目搜索初始化
        $(".zl-dropdown-search-select").ysSearchSelect({
            source:function( request, response ) {
                $.ajax({
                    url: financeWeb_Path + "bill/selectFeeTypeList.htm",
                    type:"POST",
                    dataType:"json",
                    data: {
                        searchWord: request.term,
                    },
                    success: function( data ) {
                        response( $.map( data.data, function( item ) {
                            return {
                                label: item.chargeItemName,
                                value: item.chargeItemCode
                            }
                        }));
                    }
                });
            },
            callback:function(value, ui){
            }
        });

        //保存
        page.on("click", ".save-btn", function() {
            // var mallId = $("form").find("input[name=mallId]").val();
            // if (!mallId) {
            //     alert("请选择项目");
            //     return false;
            // }
            if (pageView.checkForm()) {
                var lateFee = pageView.getFormDataBySelector($("#zl-section-collapse-table-1"));
                var feeItems = pageView.getFormDataBySelector($("#zl-section-collapse-table-2 tr"));
                var data = {
                    lateFee : JSON.stringify(lateFee[0]),
                    feeItems : JSON.stringify(feeItems)
                };
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "lateFee/save.htm",
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    error: function() {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (res) {
                        pageView.loadingHide();
                        if (res.code == "0") {
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
        //翻页
        page.on("click", ".zl-paginate", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var page = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页

            if (pageType == "last") {
                page -= 1;
            }
            else if (pageType == "next") {
                page += 1;
            }
            else {
                return;
            }
            if (page == 0 || page > pages) {
                return;
            }
            $("form").find("input[name=page]").val(page);
            $("form").trigger("submit");
        });

        //翻页
        page.on("click", "#gotoPage", function (e) {
            var page = $("#gotoPageNum").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                page = $("#pages").val();
            }
            $("form").find("input[name=page]").val(page);
            $("form").trigger("submit");
        });

        $('#gotoPageNum').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#gotoPage").click();
            }
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("form").find("input[name=page]").val(1);
                $("form").trigger("submit");
            }
        });
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

        //新增行
        var trTemplate = $("#tr-template").html();
        page.on("click", ".tr-add", function () {
            var table = $(this).parents(".zl-section").find("table:first");
            table.append(trTemplate);
            $(".btn-group").ysdropdown("init");
            pageView.ysdropdownInit();
        });

        // 通用删除逻辑
        $(".zl-table").on("click", ".tr-sub", function () {
            $(this).parents("tr").remove();
        });
    };

    pageView.ysdropdownInit = function () {
        //收费项目搜索初始化
        $(".zl-dropdown-search-select").ysSearchSelect({
            source:function( request, response ) {
                $.ajax({
                    url: financeWeb_Path + "bill/selectFeeTypeList.htm",
                    type:"POST",
                    dataType:"json",
                    data: {
                        searchWord: request.term,
                    },
                    success: function( data ) {
                        response( $.map( data.data, function( item ) {
                            return {
                                label: item.chargeItemName,
                                value: item.chargeItemCode
                            }
                        }));
                    }
                });
            },
            callback:function(value, ui){
            }
        });
    }

    pageView.ysDateInit=function(){
        $("#js-month-picker").ysDatepicker({
            dateType:"year",//year,day
            callback:function(value){
                //console.log("======================")
                //console.log(value);
            }
        })
    }

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    pageView.getFormDataBySelector = function (selector) {
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
    };
    pageView.checkForm = function () {
        var res = true;
        $("td.required").each(function() {
            var msg = ($(this).attr("title") || "必填项" ) + "不能为空";
            $(this).find("input").each(function () {
                if ( $.trim($(this).val()) == '' && $.trim($(this).attr('name')) != '') {
                    res = false;
                    alert(msg);
                    return res;
                }
                if ($(this).attr("name") == 'delayDays') {
                    var reg = /^[0-9]*\.?[0-9]+(eE?[0-9]+)?$/;
                    if (!reg.test($(this).val())) {
                        res = false;
                        alert("宽限天数输入不正确");
                        return res;
                    }
                }
                if ($(this).attr("name") == 'ratio') {
                    var reg = /^[0-9]*\.?[0-9]+(eE?[0-9]+)?$/;
                    if (!reg.test($(this).val())) {
                        res = false;
                        alert("比例输入不正确");
                        return res;
                    }
                }
            });
            if (!res) return res;
        });
        return res;
    }

    return pageView;

})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
    pageView.ysdropdownInit();
});
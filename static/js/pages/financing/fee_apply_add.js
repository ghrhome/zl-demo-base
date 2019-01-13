var pageView=(function($){
    var pageView={};
    var reg = /^-?\d+(\.\d+)?$/;
    var contList = [];
    var contBeginDate;
    var contEndDate;
    pageView.mallMap = {};
    pageView.init = function(){
        $("#preloader").fadeOut("fast");

        var page = $("#fee_apply_detail");

        $.post("getMallMap.htm", function (data) {
            var d = JSON.parse(data);
            for (var i=0; i< d.data.length; i++) {
                pageView.mallMap[d.data[i].id] = d.data[i].name;
            }
        });

        $(".js-info-text").tooltip({
            placement:"right",
            html:true,
            template:'<div class="tooltip tooltip-info" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });

        page.on("click", ".zl-glyphicon-blue", function() {
            var tr = $("#tr-hidden").clone().removeAttr("hidden").removeAttr("id");
            $("#zl-section-collapse-table-2").find("tbody tr:last").before(tr);
            page.on("click", ".zl-glyphicon-red", function() {
                $(this).parents("tr").remove();
            });
            pageView.ysdropdownInit();
            pageView.datepickerInit();
            if ($.trim(contBeginDate) != "" && $.trim(contEndDate) != "") {
                pageView.datepickerBusinessPeriodInit(contBeginDate, contEndDate);
            } else {
                var contBeginMonth = $("input[name=contBeginMonth]").val();
                var contEndMonth = $("input[name=contEndMonth]").val();
                pageView.datepickerBusinessPeriodInit(contBeginMonth, contEndMonth);
            }
        });
        page.on("click", ".zl-glyphicon-red", function() {
            $(this).parents("tr").remove();
            pageView.countTotal();
        });
        page.on("input", "input[name=receivableAmount]", function () {
            pageView.replaceValue(this);
            pageView.countTotal();
        });
        page.on("click", "a.save-btn", function () {
            pageView.save(false);
        });
        page.on("click", ".submit-btn", function() {
            pageView.save(true);
        });
    };

    pageView.datepickerInit = function () {
        $(".zl-datetimepicker").find("input[name=receivableDate]").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate', function(e){
            //$(this).parents('tr').find('input[name=businessPeriod]').val($(this).val().substr(0, 7));
        });
        $(".zl-datetimepicker").find("input[name=financeMonth]").datetimepicker({
            format: "yyyy-mm",
            todayBtn: "linked",
            startView: 3,
            minView: 4,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate', function(e){
        });
    };
    pageView.datepickerBusinessPeriodInit = function (contBeginDate, contEndDate) {
        $(".zl-datetimepicker").find("input[name=businessPeriod]").datetimepicker("remove");
        $(".zl-datetimepicker").find("input[name=businessPeriod]").datetimepicker({
            format: "yyyy-mm",
            todayBtn: "linked",
            startView: 3,
            minView: 4,
            autoclose: true,
            language: "zh-CN",
            startDate : contBeginDate,
            endDate : contEndDate
        }).on('changeDate', function(e){
        });
    }
    pageView.ysdropdownInit = function () {
        $(".btn-group").ysdropdown({
            callback: function (value, $elem) {
                if ($elem.data("id") == "js-dropdown-conts") {
                    $("input[name=businessPeriod]").val("");
                    pageView.clear();
                    $.each(contList, function (i, item) {
                        if (item.contNo == value) {
                            $("input[name=storeNames]").val(item.storeNos);
                            $("input[name=storeIds]").val(item.storeIds);
                            $("input[name=brandName]").val(item.brandName);
                            $("input[name=brandId]").val(item.brandId);
                            $("input[name=layoutName]").val(item.layoutName);
                            $("input[name=layoutId]").val(item.layout);
                            contBeginDate = pageView.dateFormat('yyyy-MM', new Date(item.contBeginDate));
                            contEndDate = pageView.dateFormat('yyyy-MM', new Date(item.contEndDate));
                            pageView.datepickerBusinessPeriodInit(contBeginDate, contEndDate);
                        }
                    });
                }
                if ($elem.data("id") == "js-dropdown-projects") {
                    $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('.dropdown-menu').children('li').remove();
                    $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('button').html('');
                    $('#js-dropdown-company').find('.dropdown-menu').children('li').remove();
                    $('#js-dropdown-company').find('button').html('搜索填写');
                    pageView.clear();
                    $("input[name=mallId]").val(value);
                    $("input[name=mallName]").val($elem.find("button").html());
                }
            }
        });
    };

    pageView.searchCompany = function () {
        $("#js-dropdown-company").ysSearchSelect({
            source:function( request, response ) {
                var mallId = $("input[name=mallId]").val();

                if ($.trim(mallId) == '') {
                    alert("请选择项目");
                    return;
                } else {
                    $.ajax( {
                        url: financeWeb_Path + 'apply2/getCompanyList.htm',
                        dataType: "json",
                        data: {
                            mallId : mallId,
                            companyName : request.term
                        },
                        success: function( data ) {
                            response( $.map( data.data, function( item ) {
                                return {
                                    label: item.companyName,
                                    value: item
                                }
                            }));
                        }
                    } );
                }
            },
            callback: function(value, ui){
                $("input[name=tenantName]").val(ui.item.value.companyName);
                $("input[name=tenantId]").val(ui.item.value.id);
                pageView.contDropdown(ui.item.value.id);
            }
        });
    }
    pageView.contDropdown = function (companyId) {
        $.getJSON(financeWeb_Path + "apply2/getContList.htm", {companyId: companyId}, function (res) {
            $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('.dropdown-menu').children('li').remove();
            contList = res.data;
            $.each(res.data, function(i, value){
                $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('.dropdown-menu').append("<li><a data-value='" + value.contNo + "'>" + value.contNo + "</a></li>");
            });
        });
    }
    pageView.clear = function () {
        $("input[name=storeNames]").val('');
        $("input[name=storeIds]").val('');
        $("input[name=brandName]").val('');
        $("input[name=brandId]").val('');
        $("input[name=layoutName]").val('');
        $("input[name=layoutId]").val('');
    }

    pageView.replaceValue = function (obj) {
        var amount = $(obj).val();
         if (null != amount && amount != "") {
            $(obj).val(amount.replace(",", "").replace(" ", "").replace("	", ""));
         }
    }

    pageView.countTotal = function () {
        var amount = 0;
        $("input[name=receivableAmount]").each(function(){
            if (reg.test($(this).val())) {
                console.log($(this).val());
                amount += parseFloat($(this).val());
            }
        });
        $("input[name=total]").val(amount.toFixed(2));
    }

    pageView.save = function (commit_k2) {
        if (pageView.checkForm()) {
            var data = pageView.generateFormData();
            pageView.loadingShow();
            $.post('save.htm', data, function (res) {
                pageView.loadingHide();
                res = JSON.parse(res);
                if (res.code == '0') {
                    $("input[name=id]").val(res.data.id);
                    $("input[name=areaCode]").val(res.data.areaCode);
                    if (commit_k2) {
                        pageView.commitK2();
                    } else {
                        alert(res.msg,"","", function () {
                            window.location = financeWeb_Path + 'apply2/index.htm';
                        });
                    }
                } else {
                    alert(res.msg);
                }
            });
        }
    }
    pageView.commitK2 = function () {
        var areaCode =$("input[name=areaCode]").val();
        var id =$("input[name=id]").val();
        $app.workflow.submit("inamp-feeapplication-"+areaCode, id).then(function ($response) {
            window.open($response.data.data);
            window.location = '../apply2/index.htm';
        });
    }
    pageView.checkForm = function () {
        var f = true;
        var trs = $("#zl-section-collapse-table-2 tbody tr:not('#tr-hidden')").length;
        if (trs < 2) {
            alert("请填写账务明细");
            return false;
        }
        $('td:visible.required').each(function () {
            var title = $(this).attr("title") || "必填项";
            var val = $(this).find("input").val();
            if ($.trim(val) == "") {
                f = false;
                alert(title + "不能为空");
                return f;
            }
            if ($(this).find("input").attr("name") == 'receivableAmount') {
                if (!reg.test(val)) {
                    f = false;
                    $(this).find("input[name=receivableAmount]").focus();
                    alert("应收金额格式错误");
                    return f;
                }
            }
        });
        return f;
    }
    pageView.generateFormData = function () {
        var feeApplyArray = $("#zl-section-collapse-table-1 input,textarea").serializeArray();
        var feeApply = {};
        $.each(feeApplyArray, function (i, map) {
            if(!(map.name in feeApply)){
                feeApply[map.name] = map.value;
            }
        });
        var detailArray = [];
        $("#zl-section-collapse-table-2 tbody tr:not('#tr-hidden')").each(function () {
            var tmp = $(this).find("input").serializeArray();
            if (tmp.length < 4) return false;
            var obj = {};
            $.each(tmp, function (i, map) {
                if(!(map.name in obj)){
                    obj[map.name] = map.value;
                }
            });
            if(!$.isEmptyObject(obj)){
                detailArray.push(obj);
            }
        });

        var data = {
            feeApplyDetail : JSON.stringify(detailArray),
            feeApply : JSON.stringify(feeApply)
        };
        return data;
    }
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }
    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }
    pageView.dateFormat = function (fmt, date) { //author: meizz
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    return pageView;

})(jQuery);

$(document).ready(function(){
    pageView.datepickerInit();
    pageView.ysdropdownInit();
    pageView.searchCompany();
    pageView.replaceValue();
    confirmAlert.init();
    pageView.init();
    pageView.countTotal();
});
/*
    收据新增
 */

var pageView=(function($){
    var pageView={};

    pageView.init=function() {

        $("#preloader").fadeOut("fast");
        var page = $("#receipt-add");

        //收款单位搜索
        $("#js-dropdown-orgUnit").ysSearchSelect({
            source:function( request, response ) {
                $.ajax({
                    url: financeWeb_Path + 'finance/certificates/getOrgUnitList.htm',
                    dataType: "json",
                    data: {
                        searchWord : request.term
                    },
                    success: function( data ) {
                        response( $.map( data.data, function( item ) {
                            return {
                                label: item.orgFName,
                                value: item.orgFNubmer,
                            }
                        }));
                    }
                });
            },
            callback:function(value, ui){
                $("input[name=receivableName]").val(ui.item.label);
            }
        });

        //租户搜索
        $("#js-dropdown-company").ysSearchSelect({
            source:function( request, response ) {
                var mallId = $("input[name=mallId]").val();
                if (!mallId) {
                    alert("请先选择项目");
                    return;
                }
                $.ajax({
                    url: "../selectCompanyList.htm",
                    type:"POST",
                    dataType:"json",
                    data: {
                        searchWord: request.term,
                        mallId : mallId
                    },
                    success: function( data ) {
                        response( $.map( data.data, function( item ) {
                            return {
                                label: item.businessLicens,
                                value: item.businessLicens,
                                id: item.id,
                            }
                        }));
                    }
                });
            },
            callback:function(value, ui){
                // 清空铺位
                cleanStoreNos();

                $("input[name=companyAccountName]").val(ui.item.label);
                $("input[name=companyId]").val(ui.item.id);

                var mallId = page.find("input[name=mallId]").val();
                $.ajax({
                    url: "../selectContList.htm",
                    type:"POST",
                    dataType:"json",
                    data: {
                        mallId : mallId,
                        companyId: ui.item.id
                    },
                    success: function(rdata) {
                        // console.log(rdata);
                        if(rdata && rdata.code=="0"){
                            var _target = page.find("div.zl-dropdown-inline[data-id=store] ul");
                            $("#contListTpl").tmpl(rdata.data).appendTo(_target);
                        }
                    }
                });
            }
        });

        //收费项目搜索初始化
        //商铺搜索
        $("#js-dropdown-feeType").ysSearchSelect({
            source:function( request, response ) {
                $.ajax({
                    url: "../selectFeeTypeList.htm",
                    type:"POST",
                    dataType:"json",
                    data: {
                        searchWord: request.term,
                    },
                    success: function( data ) {
                        response( $.map( data.data, function( item ) {
                            return {
                                label: item.chargeItemName,
                                value: item.chargeItemName
                            }
                        }));
                    }
                });
            },
            callback:function(value, ui){
                $("input[name=feeType]").val(ui.item.label);
            }
        });

        $(".btn-group").ysdropdown("init");

        page.on("click", "a.save-btn", function(){
            if (checkForm()) {
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "bill/receipt/save.htm",
                    type: 'post',
                    data: $("form").serialize(),
                    error: function() {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (res) {
                        res = JSON.parse(res);
                        pageView.loadingHide();
                        if (res.code == '0') {
                            alert("保存成功","","",function(){
                                window.location = financeWeb_Path + "bill/receipt/index.htm";
                            });
                        } else {
                            alert(res.msg);
                        }
                    }
                });
            }
        });

        page.on("click", "div.zl-dropdown-inline ul li a", function(){
            var _div = $(this).closest("div.zl-dropdown-inline");
            var text = $(this).text();
            _div.find("button").text(text);
            var val = $(this).data("value");
            _div.find("input[type=hidden]").val(val);

            var id = _div.data("id");
            if(id == "mall"){
                cleanCompany();
                cleanStoreNos();
                _div.find("input[name=mallName]").val(text);
            }
            if(id == "store"){
                _div.find("button").text(val);
            }
        });

        var datepicker=$("#js-date-picker").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            $("form").find("input[name=effectiveDate]").val(e.timeStamp);
        });

        function checkForm() {
            var flag = true;
            $("form").find("td.required").each(function() {
                var title = $(this).attr("title") || "必填项";
                // var inp = $(this).find("input:visible");
                var inp = $(this).find("input");
                var type = inp.attr("type");
                if (type == 'text' || type == 'hidden') {
                    var num = inp.attr("number");

                    if ($.trim(inp.val()) == '') {
                        flag = false;
                        alert(title + "不能为空");
                        return false
                    }
                    if (num != undefined) {
                        var reg = /^[0-9]*\.?[0-9]+(eE?[0-9]+)?$/;
                        if (!reg.test(inp.val())) {
                            flag = false;
                            alert(title + "请输入大于0的数字");
                            return false
                        }
                    }
                }
            });
            return flag;
        }
        pageView.loadingShow = function () {
            $(".zl-loading").fadeIn();
        };

        pageView.loadingHide = function () {
            $(".zl-loading").fadeOut();
        }
    }
    return pageView;
})(jQuery);

$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});

function cleanCompany(){
    var _div = $("#js-dropdown-company");
    _div.find("input").val("");
    _div.find("button").text("");
}
function cleanStoreNos(){
    var _div = $("div.zl-dropdown-inline[data-id=store]");
    _div.find("input").val("");
    _div.find("button").text("");
    _div.find("ul").empty();
}
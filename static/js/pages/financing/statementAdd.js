/**
 * Created by whobird on 2018/4/12.
 */
var _contNo='';
var dropDownList={};
var pageView=(function($){

    var container = $("#margin-settlement-add");

    var pageView={};

    pageView.search=function () {

        var _mallId = container.find("input[name=mallId]").val();

        $("#js-dropdown-companys").ysSearchSelect({
            source:function( request, response ) {
                $.ajax( {
                    url: financeWeb_Path + "feeReceivable/getAllCompanyByMallId.htm",
                    dataType: "json",
                    data: {
                        mallId: _mallId ,
                        companyName:request.term
                    },
                    success: function( data ) {
                        response( $.map( data, function( item ) {
                            return {
                                label: item.companyName,
                                value: item.companyName,
                                id:item.companyId
                            }
                        }));
                    }
                } );
            },
            callback:function(value,ui){
                $("#companyId").val(ui.item.id);
                $('#companyName').val(ui.item.label);
                _searchCb(ui.item.id);
            },
        });
    }

    pageView.dropdownInit = function(){
        // 初始化下拉
        container.find(".zl-dropdown-inline").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "js-dropdown-projects") {

                    var _a = $elem.find("li a[data-value="+val+"]");
                    container.find("input[name=mallCode]").val(_a.attr("data-code"));

                    pageView.search();
                }
                if ($elem.data("id") == "js-dropdown-conts") {
                    _contNo = dropDownList[val].contNo;
                    $("#brandName").val(dropDownList[val].brandName);
                    $("#brandId").val(dropDownList[val].brandId);
                    $("#storeIds").val(dropDownList[val].storeIds);
                    $("#storeNos").val(dropDownList[val].storeNos);
                    $("#layout").val(dropDownList[val].layoutCode);
                    $("#layoutName").val(JSON.parse(layoutMap)[dropDownList[val].layoutCode]);

                    $('#zl-section-collapse-table-2').find('tbody').html("");
                    // 获取保证金列表
                    getCashDepositList(_contNo);
                }
                if ($elem.data("id") == "js-rece-no") {
                    var receivableMap = $("body").data("receivableMap");
                    var obj = receivableMap[val];
                    if(obj){
                        $elem.find("button").text(obj.receNo || "");
                        var _tr = $elem.closest("tr");
                        _tr.find("input[name$=feeType]").val(obj.feeType || "");
                        _tr.find("input[name$=feeTypeName]").val(JSON.parse(feeTypeMap)[obj.feeType] || "");
                        _tr.find("input[name$=depositAmount]").val(obj.leftAmt);
                    }
                }
                if($elem.data("id") == "js-settlement-type"){
                    // test($elem);
                }
            }
        });
    };

    pageView.eventInit=function() {

        var contNo = container.find("input[name=contractNo]").val();
        if(contNo!= ""){
            getCashDepositList(contNo);
        }

        var settlementTemplate = container.find("[name=template-for-settlement-detail]");

        container.on("click",".zl-datetimepicker",function(e){
            e.stopPropagation();
            e.preventDefault();

            container.find(".zl-datetimepicker.finance input").datetimepicker({
                format:"yyyy-mm-dd",
                todayBtn:"linked",
                startView:2,
                minView:2,
                autoclose: true,
                language:"zh-CN",
                clearBtn:true,
            });

            container.find(".zl-datetimepicker.business input").datetimepicker({
                format:"yyyy-mm-dd",
                todayBtn:"linked",
                startView:2,
                minView:2,
                autoclose: true,
                language:"zh-CN",
                clearBtn:true,
            });
            $(this).find("input").datetimepicker("show");
        });

        container.on("click","em.add-settlement-detail",function(e){

            e.stopPropagation();
            e.preventDefault();

            var mall = $('#mallId').val();
            if(mall == ""){
                alert("请先选择项目");
                return;
            }
            var contNo = container.find("input[name=contractNo]");
            if(contNo == ""){
                alert("合同编号为空");
                return;
            }

            var index = 0;
            var _lastTr = container.find("#zl-section-collapse-table-2 tbody tr:last");
            if(_lastTr.length != 0){
                index = 1 + Number(_lastTr.attr("index"));
            }

            var _target = $("#zl-section-collapse-table-2 tbody");
            settlementTemplate.tmpl({detailIndex:index}).appendTo(_target);


            $('.js-feeType').find('.dropdown-menu').html("");
            var feeTypes = JSON.parse(feeTypeMap);
            var list = $("body").data("cashDepositList");
            // console.log(list);
            $("#receLiTpl").tmpl(list, {
                getFeeType : function(){
                    var key = this.data.feeType || "";
                    return feeTypes[key] || "";
                },
            }).appendTo($('.js-feeType').find('.dropdown-menu'));

            pageView.dropdownInit();
        });

        container.on("click",".delete-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).closest("tr").remove();
        });

        container.on("click", '.save-btn', function (e) {
            submitForm(false, function(){
                alert("保存成功");
                window.location = financeWeb_Path + "cashDeposit/settlement/list.htm";
            });
        });
        
        container.on("click", ".submit-btn", function() {
            submitForm(true, function (settlementId) {
                // 发起K2失败需要回滚,这个回头再加 I have no more time here...
                var mallCode = $("input[name=mallCode]").val();
                var areaCode = mallCode.substring(0, 8);
                $app.workflow.submit("inamp-feeliquidation-"+areaCode, settlementId).then(function ($response) {
                    window.open($response.data.data);
                    location.href = financeWeb_Path + "cashDeposit/settlement/list.htm" ;
                });
            });
        });

        container.on("input", "input[name$=amount]", function(){
            var val = $(this).val();
            // 非数字
            if(isNaN(val)){
                $(this).val("");
                return;
            }

            // 小于0
            if(Number(val) < 0){
                $(this).val("");
                return;
            }

            if(val.indexOf(".") > 0){
                var temp = val.substring(val.indexOf("."));
                if(temp.length > 3){
                    $(this).val(val.substring(0,val.indexOf(".")+3));
                }
                return;
            }

            if(!checkNum($(this).val())){
                $(this).val("");
            }
        });
    };

    pageView.compareValueInit = function(){

        $("#zl-section-collapse-table-2").on("change", "input[name$=settlementAmount]",function(e){
            $this=$(this);
            var _mod=$this.closest("tr").find(".js-settlement-type").val();
            if(_mod==1){
                var _curVal=parseFloat($this.val());
                var targetVal=parseFloat($this.closest("tr").find("input[name$=depositAmount]").val());
                if(_curVal>targetVal){
                    alert("退款金额不能大于保证金余额","","",function(){
                        $this.focus();
                        $this.val('0.00');
                    })
                }
            }

        })

        $("#zl-section-collapse-table-2").on("change","input[name$=offsetAmount]",function(e){
            $this=$(this);
            var _mod=$this.closest("tr").find(".js-settlement-type").val();
            if(_mod==2){
                var _curVal=parseFloat($this.val());
                var targetVal=parseFloat($this.closest("tr").find("input[name$=depositAmount]").val());
                if(_curVal>targetVal){
                    alert("申请冲抵金额不能大于保证金余额","","",function(){
                        $this.focus();
                        $this.val('0.00');
                    })
                }
            }

        })
    }

    pageView.loadingShow = function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function(){
        $(".zl-loading").fadeOut();
    }

    pageView.init = function(){
        $("#preloader").fadeOut("fast");
        pageView.dropdownInit();
        pageView.eventInit();
        pageView.compareValueInit();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
});


function checkForm(){
    var mallId = $("input[name=mallId]").val();
    if(mallId == ""){
        alert("请选择项目");
        return false;
    }

    var  settlementDate= $("input[name=settlementDate]").val();
    if (settlementDate== "") {
        alert("处理日期不能为空");
        return false;
    }

    var companyId = $("input[name=companyId]").val();
    if(companyId == ""){
        alert("请选择租户");
        return false;
    }

    var contNo = $("input[name=contractNo]").val();
    if(contNo == ""){
        alert("请选择合同");
        return false;
    }

    var flag = true;
    var _tr = $("#zl-section-collapse-table-2 tbody tr");
    if(_tr.length <= 0){
        alert("请录入处理明细");
        return false;
    }

    var receMap = $("body").data('receivableMap');
    var totMap = {};
    _tr.each(function () {
        var receNo = $(this).find("input[name$=receNo]").val();
        if(receNo == ""){
            alert("请选择费项");
            flag = false;
            return false;
        }
        var optType = $(this).find("input[name$=settlementType]").val();
        if(optType == ""){
            alert("应收单号"+receNo+"请选择处理类型");
            flag = false;
            return false;
        }

        var receObj = receMap[receNo] || {};
        var _input = $(this).find("input[name$=amount]");
        var amount = _input.val();
        if(optType == "1"){ // 1 - 退款
            var businessPeriod = $(this).find("input[name$=businessPeriod]").val();
            if(businessPeriod == ""){
                alert("应收单号"+receNo+"退款应付日期不能为空");
                flag = false;
                return false;
            }

            if(!checkNum(amount)){
                alert("应收单号"+receNo+"退款金额输入不正确");
                flag = false;
                _input.focus();
                return false;
            }

            var leftAmt = Number(receObj.leftAmt) || 0;
            if(Number(amount) > leftAmt){
                alert("应收单号"+receNo+"剩余可退款金额"+leftAmt+"元");
                flag = false;
                _input.focus();
                return false;
            }
        }
        if(optType == "2"){ // 2 - 申请冲抵

            if(!checkNum(amount)){
                alert("应收单号"+receNo+"申请冲抵金额输入不正确");
                flag = false;
                _input.focus();
                return false;
            }

            var canApplyAmt = Number(receObj.canApplyAmt) || 0;
            if(Number(amount) > canApplyAmt){
                alert("应收单号"+receNo+"剩余可申请金额"+canApplyAmt+"元");
                flag = false;
                _input.focus();
                return false;
            }
        }

        if(optType == "4"){ // 4- 罚没

            if(!checkNum(amount)){
                alert("应收单号"+receNo+"罚没金额输入不正确");
                flag = false;
                _input.focus();
                return false;
            }

            var leftAmt = Number(receObj.leftAmt) || 0;
            if(Number(amount) > leftAmt){
                alert("应收单号"+receNo+"剩余可罚没金额"+leftAmt+"元");
                flag = false;
                _input.focus();
                return false;
            }
        }

        totMap[receNo] = Number(totMap[receNo] || 0) + Number(amount);
    });

    for(var billNo in totMap){
        var map = receMap[billNo];
        if(totMap[billNo] > map["leftAmt"]){
            alert("应收单号"+billNo+"保证金可用余额不足");
            flag = false;
            break;
        }
    }

    return flag;
}

/**
 * 检查非负浮点数
 * @param num
 * @returns {boolean}
 */
function checkNum(num){
    var patt=/^\d+\.?\d{0,2}$/g;
    return patt.test(num);
}

function test(_this) {
    var _tr = $(_this).closest("tr");

    _tr.find("input[name$=settlementAmount]").attr("readonly",false);
    _tr.find("input[name$=offsetAmount]").attr("readonly",false);

    var type = _tr.find("input[name$=settlementType]").val();
    if(type == "1"){ // 1 - 退款
        _tr.find("input[name$=offsetAmount]").attr("readonly",true);
        _tr.find("input[name$=offsetAmount]").val('0.00');
        _tr.find("input[name$=businessPeriod]").val(fmtDate(new Date()));
    }
    if(type == "2"){ // 2 - 冲抵
        _tr.find("input[name$=settlementAmount]").attr("readonly",true)
        _tr.find("input[name$=settlementAmount]").val('0.00');
        _tr.find("input[name$=businessPeriod]").val('');
    }
}

function _searchCb(companyId) {
    $.getJSON(financeWeb_Path + "feeReceivable/selectDepositContByCompanyId.htm", {companyId: companyId}, function (res) {
        $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').children('button').html('');
        $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').children('input').val('');
        $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('li').remove();
        $("#brandName").val('');
        $("#storeNos").val('');
        $("#layoutName").val('');
        $('.table-rece-left').children('tbody').html("");
        _contNo='';
        dropDownList=res;
        $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('.dropdown-menu li').remove();
        $.each(res,function(i,value){
            $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('.dropdown-menu')
                .append("<li><a data-value='" + value.contNo + "' href='javascript:void(0)' >" + value.contNo + "</a></li>");
        })
    });
}

function clearMall() {
    $('#js-dropdown-companys').children('button').html('');
    $('#js-dropdown-companys').children('input').val('');
    $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').children('button').html('');
    $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').children('input').val('');
    $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('li').remove();
    $('.table-rece-left').children('tbody').html("");
    _contNo='';
    $("#brandName").val("");
    $("#storeNos").val("");
    $("#layoutName").val("");
}

function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function fmtDate(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}

function submitForm(netFlag, callback){
    if (!checkForm($('form'))) {
        return false;
    }

    if(netFlag){
        $("input[name=netFlag]").val("true");
    }

    pageView.loadingShow();
    $.ajax({
        type: "POST",
        url: "save.htm",
        data:$("form").serialize(),
        dataType:'json',
        error: function (request) {
            pageView.loadingHide();
            alert("系统繁忙");
        },
        success: function (response) {
            pageView.loadingHide();
            if(response && response.code == 0){
                $("input[name=id]").val(response.data);
                callback(response.data);
            }else{
                alert(response.msg);
            }
        }
    });
}

function getCashDepositList(contNo){
    $.ajax({
        url: financeWeb_Path + "cashDeposit/cashDepositListQuery.htm?contNo=" + contNo,
        type: "post",
        dataType: "json",
        success: function (response) {
            if(response && response.code=="0"){
                var receivableMap = {};
                $.each(response.data, function(i, obj){
                    receivableMap[obj.receNo] = obj;
                });
                $('body').data("receivableMap", receivableMap);
                $('body').data("cashDepositList", response.data);
            }
        }
    });
}

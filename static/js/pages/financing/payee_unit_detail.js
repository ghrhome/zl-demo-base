/*
   收款单位
 */

var pageView=(function($){
    var pageView={};
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var page = $("#payee-unit-detail");

        var mallPayeeUnitList = JSON.parse(mallContBankList);//当前项目的收款单位关系实体
        var acctBankList = JSON.parse(accountBankList);//银行账户信息集合
        var orgUnitList = JSON.parse(allOrgUnitList);//收款单位集合
        var acctBankMap = {};
        var acctBankMapList = {};
        var orgUnitMap = {};
        //var mallPayeeUnitMap = {};

        //将银行账户list转为map
        for (var i=0; i<acctBankList.length; i++) {
            acctBankMap[acctBankList[i].fid] = acctBankList[i];
        }

        for (var i=0; i<acctBankList.length; i++) {
            if (!acctBankMapList[acctBankList[i].orgFNumber]) {
                acctBankMapList[acctBankList[i].orgFNumber] = new Array();
            }
            acctBankMapList[acctBankList[i].orgFNumber].push(acctBankList[i]);
        }

        //将收款单位list转为map
        for (var i=0; i<orgUnitList.length; i++) {
            orgUnitMap[orgUnitList[i].orgFNubmer] = orgUnitList[i];
        }

        var mallId = $("input[name=mallId]").val();
        var currentMallPayeeUnitList = getPayUnitByMallId(mallId);//当前选择项目的收款单位list
        //搜索
        page.on("click", ".search-btn", function() {
            $("form").find("input[name=page]").val(1);
            $("form").submit();
        });

        //到明细页
        page.on("click", ".zl-linkable", function () {
            var dataId = $(this).attr("data-id");
            if (dataId && parseInt(dataId)) window.location = financeWeb_Path + "payeeUnit/detail.htm?payeeUnitId=" + dataId;
        });

        //下拉
        $(".btn-group").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "projects") {
                    $("#zl-table-payee-unit").find("tbody tr").remove();
                    $("form").find("input[name=mallId]").val(val);
                    currentMallPayeeUnitList = getPayUnitByMallId(val);
                }
                if ($elem.data("id") == "payee-unit") {
                    var payeeUnit = orgUnitMap[val];
                    $elem.parents("tr").find("input[name^=itemList][name$=payee]").val(payeeUnit.orgFNubmer);
                    $elem.parents("tr").find("input[name^=itemList][name$=payeeName]").val($elem.find("button").html());

                    //切换收款单位时 赋空开户行
                    $elem.parents("tr").find("div[data-id=bank] button").val('');
                    $elem.parents("tr").find("input[name^=itemList][name$=openBank]").val('');
                    $elem.parents("tr").find("input[name^=itemList][name$=bankAccountId]").val('');

                    setAcctBankDropDown(val, $elem);
                }
                if ($elem.data("id") == "fee-type") {
                    $elem.parents("tr").find("input[name$=itemType]").val(val);
                    $elem.parents("tr").find("input[name$=itemTypeName]").val($elem.find("button").html());
                }
                if ($elem.data("id") == "bank") {
                    $elem.parents("tr").find("input[name$=bankAccountId]").val(val);
                    $elem.parents("tr").find("input[name$=openBank]").val($elem.find("button").html());
                }
            }
        });

        //保存
        page.on("click", ".save-btn", function() {
            if (checkForm()) {
                var mallId = $("form").find("input[name=mallId]").val();
                if (!mallId) {
                    alert("请选择项目");
                    return false;
                }
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "payeeUnit/save.htm",
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

        //根据mallId获取项目收款单位
        function getPayUnitByMallId(mallId) {
            var unitIdList = new Array();
            var unitList = new Array();
            var unitMap = {};
            for (var i=0; i<mallPayeeUnitList.length; i++) {
                if (mallId == mallPayeeUnitList[i].mallId) {
                    unitIdList.push(mallPayeeUnitList[i]);
                }
            }
            for (var j=0; j<unitIdList.length; j++) {
                if (orgUnitMap[unitIdList[j].payee]) {
                    // orgUnitMap[unitIdList[j].payee].taxNo = unitIdList[j].creditCode;
                    // orgUnitMap[unitIdList[j].payee].mallContBankId = unitIdList[j].id;
                    unitMap[unitIdList[j].payee] = orgUnitMap[unitIdList[j].payee];
                }
            }
            for (var key in unitMap) {
                unitList.push(unitMap[key]);
            }
            return unitList;
        }
        function checkForm () {
            var flag = true;
            var itemTypeIds = new Array();
            $("#zl-table-payee-unit").find("input[name^=itemList][name$=itemType]").each(function(i) {
                if (!$(this).val() || $(this).val()=='') {
                    flag = false;
                    alert("费项类型不能为空");
                    return false;
                }
                itemTypeIds.push($(this).val());

            });
            if (!flag) return;
            var showTimes = 0;
            for (var i=0; i<itemTypeIds.length; i++) {
                for (var j=0; j<itemTypeIds.length; j++) {
                    if (itemTypeIds[i] == itemTypeIds[j]) showTimes++;
                }
                if (showTimes >= 2) {
                    //console.log("showTimes : " +showTimes);
                    flag = false;
                    alert("费项类型重复");
                    return false;
                }
                showTimes = 0;
            }
            if (!flag) return;
            $("#zl-table-payee-unit").find("input[name^=itemList][name$=payee]").each(function() {
                if (!$(this).val()) {
                    flag = false;
                    alert("收款单位不能为空");
                    return false;
                }
            });
            if (!flag) return;
            $("#zl-table-payee-unit").find("input[name^=itemList][name$=openBank]").each(function() {
                if (!$(this).val()) {
                    flag = false;
                    alert("开户银行不能为空");
                    return false;
                }
            });
            return flag;
        }

        //新增行
        var trTemplate = $("#tr-template").html();
        page.on("click", ".tr-add", function () {
            var mallId = $("input[name=mallId]").val();
            if (mallId == ""){
                alert("请先选择项目");return;
            }
            var table = $(this).parents(".zl-section").find("table:first");
            var trs = table.find("tbody tr").length;
            var tr = trTemplate.replace(/(index)/g, trs).replace(/(left)/g, "[").replace(/(right)/g,"].");
            //将该项目的收款单位赋值到下拉
            var unitHtml = '';
            for (var i=0; i<currentMallPayeeUnitList.length; i++) {
                if (currentMallPayeeUnitList[i]) {
                    unitHtml += "<li><a data-value='" + currentMallPayeeUnitList[i].orgFNubmer + "'>" + currentMallPayeeUnitList[i].orgFName + "</a></li>";
                }
            }
            tr = $(tr.replace(/(payee_unit_item)/g, unitHtml));

            table.append(tr);
            $(".btn-group").ysdropdown({
                callback:function(val, $elem){
                    if ($elem.data("id") == "payee-unit") {
                        var payeeUnit = orgUnitMap[val]; //当前选择的收款单位
                        if (payeeUnit) {
                            $elem.parents("tr").find("input[name^=itemList][name$=payee]").val(payeeUnit.orgFNubmer);
                            $elem.parents("tr").find("input[name^=itemList][name$=payeeName]").val($elem.find("button").html());

                            //切换收款单位时 赋空开户行
                            $elem.parents("tr").find("div[data-id=bank] button").html('请选择');
                            $elem.parents("tr").find("input[name^=itemList][name$=openBank]").val('');
                            $elem.parents("tr").find("input[name^=itemList][name$=bankAccountId]").val('');

                            setAcctBankDropDown(val, $elem);
                        }
                    }
                    if ($elem.data("id") == "fee-type") {
                        $elem.parents("tr").find("input[name^=itemList][name$=itemType]").val(val);
                        $elem.parents("tr").find("input[name^=itemList][name$=itemTypeName]").val($elem.find("button").html());
                    }
                }
            });
        });

        //选择收款单位后 设置该项目该收款单位下的银行账户
        function setAcctBankDropDown (val, $elem) {
            //将该收款单位的银行账户赋值到下拉
            var acctHtml = '';
            for (var i=0; i<acctBankMapList[val].length; i++) {
                acctHtml += "<li><a data-value='" + acctBankMapList[val][i].fBankAccountNumber + "'>" + acctBankMapList[val][i].fBankAccountName + "</a></li>";
            }
            $elem.parents('tr').find(".bank ul").html("");
            $elem.parents('tr').find(".bank ul").append(acctHtml);
            $(".bank").ysdropdown({
                callback: function (val, $elem) {
                    $elem.parents("tr").find("input[name^=itemList][name$=openBank]").val($elem.find("button").html());//账户名
                    $elem.parents("tr").find("input[name^=itemList][name$=bankAccountId]").val(val);//账户号
                }
            });
        }

        // 通用删除逻辑
        $(".zl-table").on("click", ".tr-sub", function () {
            $(this).parents("tr").remove();
            var table = $("#zl-table-payee-unit");
            var trs = table.find("tbody tr");
            for (var i = 0; i < trs.length; i++) {
                $(trs[i]).find("input[name^=itemList]").each(function(index){
                    var name = $(this).attr('name');
                    name = name.replace(/\[*?\d*\]/g, '[' + i + ']');
                    $(this).attr("name", name);
                });
            }
        });

    };
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

    return pageView;

})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});
var dubSumit = 0;

/*##################################字段校验###############################################*/

//特殊字符校验 存在特殊字符返回true
function regeMatch(strs){
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:]");
    if(strs != "" && strs != null){
        if(pattern.test(strs)){
            //alert("非法字符！");
            return true;
        }else{
            return false;
        }
    }
}

//数字校验
function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}

function tels(value){
    var integer1 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
    //var integer2 = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
    var integer2 =/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
    if(!integer1.test($.trim(value))&&!integer2.test($.trim(value))){
        return true;
    }else{
        return false;
    }
}

function isNumber(value) {
    return /^(\-?)[0-9]+.?[0-9]*$/.test($.trim(value))
}
function isInt(str) {
    var reg = /^(-|\+)?\d+$/;
    return reg.test(str);
}


function isNum(num, msg) {
    if (!isNaN(num)) {
        var dot = num.indexOf(".");
        if (dot != -1) {
            var dotCnt = num.substring(dot + 1, num.length);
            if (dotCnt.length > 2) {
                alert(msg + "小数位已超过2位！");
                return false;
            } else {
                if (parseInt(num) > 99999999) {
                    alert("输入" + msg + "值过大！");
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            var re = /^[0-9]*[1-9][0-9]*$/;
            if (re.test(num)) {
                if (parseInt(num) > 99999999) {
                    alert("输入" + msg + "值过大！");
                    return false;
                } else {
                    return true;
                }
            } else {
                alert("输入" + msg + "不合法！");
                return false;
            }
        }
    } else {
        alert("输入" + msg + "不合法！");
        return false;
    }
}


/*##################################字段校验###############################################*/


function valitateForm(obj) {
    var assetPool = $.trim($(obj).find("input[name=assetPool]").val());
    if (assetPool == "" || assetPool == null) {
        alert("所属资产包不能为空！");
        return false;
    }
    var area = $.trim($(obj).find("input[name=area]").val());
    if (area == "" || area == null) {
        alert("所属城市公司不能为空！");
        return false;
    }

    var mallName = $.trim($(obj).find("input[name=mallName]").val());
    if (mallName == "" || mallName == null) {
        alert("项目名称不能为空！");
        return false;
    }
    if (mallName.length > 50) {
        alert("项目名称超过50个文字！");
        return false;
    }
    if(regeMatch(mallName)){
        alert("项目名称请勿输入特殊字符！");
        return false;
    }
    var shortName = $.trim($(obj).find("input[name=shortName]").val());
    if (shortName == "" || shortName == null) {
        alert("项目简称不能为空！");
        return false;
    }
    if (shortName.length > 20) {
        alert("项目简称超过20个文字！");
        return false;
    }
    if(regeMatch(shortName)){
        alert("项目简称请勿输入特殊字符！");
        return false;
    }

    var mallCode = $.trim($(obj).find("input[name=mallCode]").val());
    if (mallCode == "" || mallCode == null) {
        // alert("项目编码不能为空！");
        // return false;
    }
    if(regeMatch(mallCode)){
        alert("项目编码请勿输入特殊字符！");
        return false;
    }
  /*  var mallType = $.trim($(obj).find("input[name=mallType]").val());
    if (mallType == "" || mallType == null) {
        alert("物业类型不能为空！");
        return false;
    }
    if(regeMatch(mallType)){
        alert("物业类型请勿输入特殊字符！");
        return false;
    }*/
    var square = $.trim($(obj).find("input[name=square]").val());
    // if (square == "" || square == null) {
    //     alert("建筑面积不能为空！");
    //     return false;
    // }
    // if(regeMatch(square)){
    //     alert("建筑面积请勿输入特殊字符！");
    //     return false;
    // }
    // if (!isNum(square, "建筑面积")) {
    //     return false;
    // }
    // if (parseInt(square) < 0) {
    //     alert("建筑面积应为正数！");
    //     return false;
    // }

    var serviceSquare = $.trim($(obj).find("input[name=serviceSquare]").val());
    // if (serviceSquare == "" || serviceSquare == null) {
    //     alert("实用面积不能为空！");
    //     return false;
    // }
    // if (!isNum(serviceSquare, "实用面积")) {
    //     return false;
    // }
    // if (parseInt(serviceSquare) < 0) {
    //     alert("实用面积应为正数！");
    //     return false;
    // }
    // if(regeMatch(serviceSquare)){
    //     alert("实用面积请勿输入特殊字符！");
    //     return false;
    // }
    var openDate = $.trim($(obj).find("input[name=openDate]").val());
    if (openDate == "" || openDate == null) {
        // alert("开业时间不能为空！");
        // return false;
    }

    var stat = $.trim($(obj).find("input[name=stat]").val());
    if (stat == "" || stat == null) {
        alert("营运状态不能为空！");
        return false;
    }
    var taxpayer = $.trim($(obj).find("input[name=taxpayer]").val());
    console.log("----"+taxpayer)
    if(taxpayer == "" || taxpayer == null){
        alert("纳税类型不能为空！");
        return false;
    }
    if(regeMatch(stat)){
        alert("营运状态请勿输入特殊字符！");
        return false;
    }

    var mallTel = $("#mallTel").val();
    if(regeMatch(mallTel)){
        alert("项目电话请勿输入特殊字符！");
        return false;
    }
    if(mallTel){
        if (!tels(mallTel)) {
            alert("请输入正确的项目电话！");
            return false;
        }
    }
   /* if (mallTel == "" || mallTel == null) {
        alert("项目电话不能为空！");
        return false;
    }*/
    var address = $.trim($(obj).find("input[name=address]").val());
    if (address == "" || address == null) {
        // alert("地址不能为空！");
        // return false;
    }
    if(regeMatch(address)){
        alert("地址请勿输入特殊字符！");
        return false;
    }
    if (address.length > 50) {
        alert("地址超过50个文字！");
        return false;
    }

   // var protocolType = $.trim($(obj).find("input[name=protocolType]").val());
  /*  if(regeMatch(protocolType)){
        alert("三方协议类型请勿输入特殊字符！");
        return false;
    }*/
  /*  if (protocolType == "" || protocolType == null) {
        alert("三方协议类型不能为空！");
        return false;
    }*/

    var payees=$(".payee");
    for(var i=0;i<payees.length;i++){
        var a = i+1;
        var value1 = $(payees[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行收款单位全称不能为空！");
            return false;
        }
    }

    var payeeShorts=$(".payeeShort");
    // for(var i=0;i<payeeShorts.length;i++){
    //     var a = i+1;
    //     var value2 = $(payeeShorts[i]).val();
    //     if($.trim(value2)=="" || $.trim(value2)==null){
    //         alert("第"+a+"行收款单位简称不能为空！");
    //         return false;
    //     }
    // }

    var creditCodes=$(".creditCode");
    for(var i=0;i<creditCodes.length;i++){
        var a = i+1;
        var value3 = $(creditCodes[i]).val();
        if($.trim(value3)=="" || $.trim(value3)==null){
            alert("第"+a+"行统一社会信用代码不能为空！");
            return false;
        }
    }

    var addresss=$(".address");
    for(var i=0;i<addresss.length;i++){
        var a = i+1;
        var value4 = $(addresss[i]).val();
        if($.trim(value4)=="" || $.trim(value4)==null){
            alert("第"+a+"行单位地址不能为空！");
            return false;
        }
    }

    var btels=$(".btel");
    for(var i=0;i<btels.length;i++){
        var a = i+1;
        var value5 = $(btels[i]).val();
        if($.trim(value5)=="" || $.trim(value5)==null){
            alert("第"+a+"行电话号码不能为空！");
            return false;
        }
    }

    var accountIncomeIds=$(".accountIncomeId");
    for(var i=0;i<accountIncomeIds.length;i++){
        var a = i+1;
        var value6 = $(accountIncomeIds[i]).val();
        if($.trim(value6)=="" || $.trim(value6)==null){
            alert("第"+a+"行收入户开户银行不能为空！");
            return false;
        }
    }

    var accountNo4s=$(".accountNo4");
    for(var i=0;i<accountNo4s.length;i++){
        var a = i+1;
        var value7 = $(accountNo4s[i]).val();
        if($.trim(value7)=="" || $.trim(value7)==null){
            alert("第"+a+"行收入户开户账号不能为空！");
            return false;
        }
    }

    var generOfChIns=$(".generOfChIn");
    // for(var i=0;i<generOfChIns.length;i++){
    //     var a = i+1;
    //     var value8 = $(generOfChIns[i]).val();
    //     if($.trim(value8)=="" || $.trim(value8)==null){
    //         alert("第"+a+"行收入户代收标记不能为空！");
    //         return false;
    //     }
    // }

  /*  var costAccounts=$(".costAccount");
    for(var i=0;i<costAccounts.length;i++){
        var a = i+1;
        var value9 = $(costAccounts[i]).val();
        if($.trim(value9)=="" || $.trim(value9)==null){
            alert("第"+a+"行费用科目不能为空！");
            return false;
        }
    }*/
/*

    var accountCentreIds=$(".accountCentreId");
    for(var i=0;i<accountCentreIds.length;i++){
        var a = i+1;
        var value10 = $(accountCentreIds[i]).val();
        if($.trim(value10)=="" || $.trim(value10)==null){
            alert("第"+a+"行中央收银户开户银行不能为空！");
            return false;
        }
    }

    var accountNo6s=$(".accountNo6");
    for(var i=0;i<accountNo6s.length;i++){
        var a = i+1;
        var value11 = $(accountNo6s[i]).val();
        if($.trim(value11)=="" || $.trim(value11)==null){
            alert("第"+a+"行中央收银户开户银行账号不能为空！");
            return false;
        }
    }

    var generOfChCentres=$(".generOfChCentre");
    for(var i=0;i<generOfChCentres.length;i++){
        var a = i+1;
        var value12 = $(generOfChCentres[i]).val();
        if($.trim(value12)=="" || $.trim(value12)==null){
            alert("第"+a+"行中央收银户代收标记不能为空！");
            return false;
        }
    }
*/

    return true;
}


/*##################################收款单位信息###############################################*/



var datepicker=$(".zl-datetimepicker").find("input").datetimepicker({
    format:"yyyy-mm-dd",
    todayBtn:"linked",
    startView:2,
    minView:2,
    autoclose: true,
    language:"zh-CN",
}).on('changeDate', function(e){
    console.log(e)

});

$("body").on('click','.but-val',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $(this).parent().parent().parent().parent().find(".input-val").val(val);
});



function loadSearch(indx){
    console.log("==============================================="+indx);
    $( ".js-search_"+indx).autocomplete({
        source: function(request,response){
            $.ajax({
                url: "getData.htm",
                type:"POST",
                dataType:"json",
                data:{
                    payeeName: request.term
                },
                success: function(data){
                    console.log(data)
                    response($.map( data["data"], function(item){
                        return {
                            label: item.orgFName,
                            value: item.orgFNubmer
                        }
                    }));
                }
            });
        },
        minLength: 1,
        select: function(event,ui) {
            this.value = ui.item.label;
            _this=$(this);
            //$(this).parent().find("#payee"+indx).val( ui.item.value);
            $("#payee"+indx).val( ui.item.value);
            console.log("设置",indx,ui.item.value);
            $.ajax({
                url: "queryBrankByOrgFNumber.htm",
                type:"POST",
                dataType:"json",
                data:{
                    orgFNumber: ui.item.value
                },
                success: function(data){
                    var objL = data["data"];
                    var len = objL.length;
                    /*if(len==2){
                        $.each(objL, function(i, item){
                            console.log("===============================================");
                            console.log(i+"fBankAccountNumber="+item.fBankAccountNumber+"#fBankAccountName="+item.fBankAccountName);
                            console.log("===============================================");
                            if(i==0){
                                $(_this).parent().parent().find("#accountIncomeIds_view"+indx).val(item.fBankAccountName);
                                $(_this).parent().parent().find("#accountIncomeId_"+indx).val(item.fid);
                                $(_this).parent().parent().parent().find("#accountNos4"+indx).val(item.fBankAccountNumber);
                            }else if(i==1){
                                $(_this).parent().parent().find("#accountCentreIds_view"+indx).val(item.fBankAccountName);
                                $(_this).parent().parent().find("#accountCentreId_"+indx).val(item.fid);
                                $(_this).parent().parent().parent().find("#accountNos6"+indx).val(item.fBankAccountNumber);
                            }
                        });
                    }*/
                    $(_this).parent().parent().find("#accountIncomeIds_view"+indx).html("");
                    console.log( $(_this).parent().parent().find("#accountIncomeIds_view"+indx).parent().html());
                    $(_this).parent().parent().find("#accountIncomeIds_view"+indx).parent().find("input.accountIncomeId").val("");
                    $(_this).parent().parent().find("#accountIncomeIds_view"+indx).parent().find("button.zl-dropdown-btn").text("");

                    $(_this).parent().parent().find("#accountCentreIds_view"+indx).html("");
                    $.each(objL, function(i, item){
                        //console.log("===============================================");
                        //console.log(i+"fBankAccountNumber="+item.fBankAccountNumber+"#fBankAccountName="+item.fBankAccountName);
                        var ht = "<li><a class=\"mall-stat-a but-val\" data-value="+item.fid+" href=\"javascript:brankNumber('"+item.fBankAccountNumber+"','"+indx+"')\"  key="+item.fid+">"+item.fBankAccountName+"</a></li>";
                        $(_this).parent().parent().find("#accountIncomeIds_view"+indx).append(ht);
                        var ht2 = "<li><a class=\"mall-stat-a but-val\" data-value="+item.fid+" href=\"javascript:brankNumber2('"+item.fBankAccountNumber+"','"+indx+"')\"  key="+item.fid+">"+item.fBankAccountName+"</a></li>";
                        $(_this).parent().parent().find("#accountCentreIds_view"+indx).append(ht2);
                        //console.log("===============================================");

                    });
                }
            });
            return false;
        }
    });
}

function brankNumber(fBankAccountNumber,indx){
    console.log("银行帐号1",indx);
    $("#accountNos4"+indx+"").val(fBankAccountNumber);
    $("#accountNo4"+indx+"").val(fBankAccountNumber);
}
function brankNumber2(fBankAccountNumber,indx){
    console.log("银行帐号2",indx);
    $("#accountNos6"+indx+"").val(fBankAccountNumber);
    $("#accountNo6"+indx+"").val(fBankAccountNumber);
}


function queryBrank(orgFNumber,indx){
    $.ajax({
        url: "queryBrankByOrgFNumber.htm",
        type:"POST",
        dataType:"json",
        data:{
            orgFNumber: orgFNumber
        },
        success: function(data){
            var objL = data["data"];
            var len = objL.length;
            $(_this).parent().parent().find("#accountIncomeIds_view"+indx).html("");
            $(_this).parent().parent().find("#accountCentreIds_view"+indx).html("");
            $.each(objL, function(i, item){
                console.log("===============================================");
                console.log(i+"fBankAccountNumber="+item.fBankAccountNumber+"#fBankAccountName="+item.fBankAccountName);
                var ht = "<li><a class=\"mall-stat-a but-val\" data-value="+item.fid+" href=\"javascript:brankNumber('"+item.fBankAccountNumber+"',"+indx+")\"  key="+item.fid+">"+item.fBankAccountName+"</a></li>";
                $(_this).parent().parent().find("#accountIncomeIds_view"+indx).append(ht);
                var ht2 = "<li><a class=\"mall-stat-a but-val\" data-value="+item.fid+" href=\"javascript:brankNumber2('"+item.fBankAccountNumber+"',"+indx+")\"  key="+item.fid+">"+item.fBankAccountName+"</a></li>";
                $(_this).parent().parent().find("#accountCentreIds_view"+indx).append(ht2);
                console.log("===============================================");
            });
        }
    });
}

var count =0;
var contInfoList;
var bool = true;
//新增收款单位 js  clone
function addContInfo(obj,indxId) {
    var listSize = $("#listSize").val();
    console.log("listSize",listSize);
    if(listSize>1 && bool){
        count = parseInt(listSize);
        bool = false;
    }else{
        count=parseInt(count+1);
    }
    console.log("count",count);
    contInfoList = $(obj).parents(".cont-info-container").find(".cont-info-list0").children().first().prop("outerHTML");
    //属性
    contInfoList=contInfoList.replace('continfo0','continfo'+count);
    contInfoList=contInfoList.replace('delContInfo(0)','delContInfo('+count+')');

    contInfoList=contInfoList.replace('loadSearch(0)','loadSearch('+count+')');
    contInfoList=contInfoList.replace('js-search_0','js-search_'+count+'');
    contInfoList=contInfoList.replace('payee0','payee'+count+'');


    contInfoList=contInfoList.replace('accountNos40','accountNos4'+count+'');
    contInfoList=contInfoList.replace('accountNos60','accountNos6'+count+'');

    contInfoList=contInfoList.replace('accountIncomeIds_view0','accountIncomeIds_view'+count+'');
    contInfoList=contInfoList.replace('accountIncomeId0','accountIncomeId'+count+'');
    contInfoList=contInfoList.replace('accountCentreIds_view0','accountCentreIds_view'+count+'');
    contInfoList=contInfoList.replace('accountCentreId0','accountCentreId'+count+'');

    //字段
    contInfoList=contInfoList.replace('bsMallContBankList[0].id','bsMallContBankList['+count+'].id');
    contInfoList=contInfoList.replace('bsMallContBankList[0].payee','bsMallContBankList['+count+'].payee');
    contInfoList=contInfoList.replace('bsMallContBankList[0].payeeShort','bsMallContBankList['+count+'].payeeShort');
    contInfoList=contInfoList.replace('bsMallContBankList[0].creditCode','bsMallContBankList['+count+'].creditCode');
    contInfoList=contInfoList.replace('bsMallContBankList[0].address','bsMallContBankList['+count+'].address');
    contInfoList=contInfoList.replace('bsMallContBankList[0].tel','bsMallContBankList['+count+'].tel');
    contInfoList=contInfoList.replace('bsMallContBankList[0].accountIncomeId','bsMallContBankList['+count+'].accountIncomeId');
    contInfoList=contInfoList.replace('bsMallContBankList[0].generOfChIn','bsMallContBankList['+count+'].generOfChIn');
    contInfoList=contInfoList.replace('bsMallContBankList[0].accountCentreId','bsMallContBankList['+count+'].accountCentreId');
    contInfoList=contInfoList.replace('bsMallContBankList[0].generOfChCentre','bsMallContBankList['+count+'].generOfChCentre');
    //contInfoList=contInfoList.replace('bsMallContBankList[0].costAccount','bsMallContBankList['+count+'].costAccount');

    var re = new RegExp("select_val4","g");
    contInfoList = contInfoList.replace(re, 'select_val4'+count);
    //var re2 = new RegExp("accountIncomeId_","g");
    //contInfoList = contInfoList.replace(re2, 'accountIncomeId_'+count);
    contInfoList = contInfoList.replace('accountIncomeId_0', 'accountIncomeId_'+count);

    var re5 = new RegExp("accountNo40","g");
    contInfoList = contInfoList.replace(re5, 'accountNo4'+count);

    var re3 = new RegExp("select_val6","g");
    contInfoList = contInfoList.replace(re3, 'select_val6'+count);
    var re4 = new RegExp("accountCentreId_","g");
    contInfoList = contInfoList.replace(re4, 'accountCentreId_'+count);

    var re6 = new RegExp("accountNo60","g");
    contInfoList = contInfoList.replace(re6, 'accountNo6'+count);

    var re7 = new RegExp("select_val5","g");
    contInfoList = contInfoList.replace(re7, 'select_val5'+count);

    var re8 = new RegExp("generOfChIn_","g");
    contInfoList = contInfoList.replace(re8, 'generOfChIn_'+count);

    var re9 = new RegExp("select_val7","g");
    contInfoList = contInfoList.replace(re9, 'select_val7'+count);

    var re10 = new RegExp("generOfChCentre_","g");
    contInfoList = contInfoList.replace(re10, 'generOfChCentre_'+count);

    /* var re11 = new RegExp("costAccount11_","g");
     contInfoList = contInfoList.replace(re11, 'costAccount11_'+count);

     var re12 = new RegExp("select_val11","g");
     contInfoList = contInfoList.replace(re12, 'select_val11'+count);*/

    $("#zl-section-collapse-table-1-0").append(contInfoList);
    //$(".zl-block").append(contInfoList);
    clearValue(count,indxId);
}

//清空值
function clearValue(counts,indxId){
    $("input[name='bsMallContBankList["+counts+"].id'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].payee'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].payeeShort'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].creditCode'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].address'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].tel'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].accountIncomeId'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].generOfChIn'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].accountCentreId'] ").val("");
    $("input[name='bsMallContBankList["+counts+"].generOfChCentre'] ").val("");

    $("#select_val4"+counts+""+indxId).html("");
    $("#accountNo4"+counts).val("");
    $("#select_val6"+counts+""+indxId).html("");
    $("#accountNo6"+counts).val("");
    $("#select_val5"+counts+""+indxId).html("");
    $("#select_val7"+counts+""+indxId).html("");
    $("#accountIncomeIds_view"+counts).html("");
    $("#accountCentreIds_view"+counts).html("");

}

function delContInfo(obj,_this){
   // console.log($(_this).parent().parent().parent().parent().html())
    //console.log($("#zl-section-collapse-table-1-0").find("table.zl-table-fixed").length);
    //console.log("-----------"+$(".updateBsMallForm_ #id").val());
    //console.log("-----------"+$(_this).parent().parent().parent().parent().find("#id").val());
    var queryBrankDeleteResult=$(_this).parent().parent().parent().parent().find("#id").val();
    var counts=0;
    //判断是否能被删除
    if($(".updateBsMallForm_ #id").val()&&queryBrankDeleteResult&&queryBrankDeleteResult!=""&&$(".updateBsMallForm_ #id").val()!=""){
        $.ajax({
            url: "queryBrankDeleteResult.htm",
            type:"POST",
            dataType:"json",
            data:{
                mallCountBankId: queryBrankDeleteResult
            },
            success: function(data){
                //console.log("------+++-----"+data.data.counts);
                counts=data.data.counts;
                //console.log("------====-----"+counts);
                if(counts>0){
                    alert("该收款单位信息已经被引用，无法被删除！");
                    return;
                }
                if($("#zl-section-collapse-table-1-0").find("table.zl-table-fixed").length==1){
                    alert("只有一个账套信息，只能修改账户信息，不能删除该账套！");
                }else{
                    $("#continfo"+obj).remove();
                }
            }
        });
    }else{
        //console.log("------====-----"+counts);
        if(counts>0){
            alert("该收款单位信息已经被引用，无法被删除！");
            return;
        }
        if($("#zl-section-collapse-table-1-0").find("table.zl-table-fixed").length==1){
            alert("只有一个账套信息，只能修改账户信息，不能删除该账套！");
        }else{
            $("#continfo"+obj).remove();
        }
    }

}


function selParents10(obj,text,val,sel) {
    $("#"+val).val($(obj).attr("key"));
    $("#"+sel).html(text);
}

function selParents9(obj,text,val,sel) {
    $("#"+val).val($(obj).attr("key"));
    $("#"+sel).html(text);
}

//select连动
function selParents1(obj,text,id) {
    $("#assetPool_"+id).val($(obj).attr("key"));
    $("#select_val"+id).html(text);
}

//select连动
function selParents2(obj,text,id) {
    $("#area_"+id).val($(obj).attr("key"));
    $("#select_val2"+id).html(text);
}

//select连动
function selParents3(obj,text,id) {
    $("#stat_"+id).val($(obj).attr("key"));
    $("#select_val3"+id).html(text);
}

//select连动
function selParents4(obj,text,buttId,accId,accNo) {
    $("#"+accId).val($(obj).attr("key"));
    $("#"+buttId).html(text);
    $("#"+accNo).val($(obj).attr("fBankAccountNumber"));
}

//select连动
function selParents5(obj,text,id,selVal) {
    $("#"+id).val($(obj).attr("key"));
    $("#"+selVal).html(text);
}

//select连动
function selParents6(obj,text,buttId,accId,accNo) {
    $("#"+accId).val($(obj).attr("key"));
    $("#"+buttId).html(text);
    $("#"+accNo).val($(obj).attr("fBankAccountNumber"));
}

//select连动
function selParents7(obj,text,id,selVal) {
    $("#"+id).val($(obj).attr("key"));
    $("#"+selVal).html(text);
}
//select连动
function selParents8(obj,text,id) {
    $("#mallType_"+id).val($(obj).attr("key"));
    $("#select_val8"+id).html(text);
}

$("#js-save-new").click(function(){
    if (dubSumit > 0) {
        alert("请勿重复提交表单！");
        return false;
    }
    if (!valitateForm($('#updateBsMallForm_'))) {
        return false;
    }
    var mallId = $("#id").val();
    if(mallId=="" || mallId==null){
        if (sPathUrl() <= 4) {
            /*confirm("确认修改提交？", "", "", function (type) {*/
                dubSumit++;
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: "add.htm",
                    data: $('#updateBsMallForm_').serialize(),
                    async: false,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        window.location = "index.htm";
                    }
                });
                dubSumit==0;
            /*});*/
        }else{
            alert("最多上传4张图片");
        }
    }else{
        if (sPathUrl() <= 4) {
            /*confirm("确认修改提交？", "", "", function (type) {*/
                dubSumit++;
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: "update.htm",
                    data: $('#updateBsMallForm_').serialize(),
                    async: false,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        window.location = "index.htm";
                    }
                });
                dubSumit==0;
           /* });*/
        }else{
            alert("最多上传4张图片");
        }
    }

})

function deleteInfo(bsMallId){
    confirm("确认要删除吗？","","",function(type){
        if (type == "dismiss") return;
        dubSumit++;
        $.ajax({
            cache: true,
            type: "POST",
            url: "delete.htm",
            data: {"bsMallId":bsMallId},
            async: false,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                var obj =JSON.parse(resultData);
                if (obj.code == "1") {
                    alert(obj.msg);
                    return;
                }else{
                    alert(obj.msg);
                }
                window.location = "index.htm";
            }
        });
        dubSumit==0;
    });
}

//保存图片的url地址
function sPathUrl(){
    var url ="";
    var cou = 0;
    $("[data-mfp-src]").each(function () {
        url = url+","+$(this).attr("data-mfp-src");
        cou = cou+1;
    });
    if(url!="" || url!=null){
        url = url.substring(1,url.length);
    }
    $("#path").val(url);
    return cou;
}



$(document).ready(function(){
    $('.zl-img-wrapper').magnificPopup({
        delegate: '.zl-thumbnail',
        type: 'image',
        gallery: {
            enabled: true
        },
    });

    $('.zl-img-wrapper').on("click",".zl-icon-btn-del",function(e){
        e.preventDefault();
        //ajax and warning callback
        $(this).closest("li").remove();
    })

    function _getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    $('#fileupload').fileupload({
        //url: url,
        dataType: 'json',
        add:function(e,data){
            console.log(data);
            console.log(e);
            $.each(data.files, function (index, file) {
                console.log(file)
                console.log(_getObjectURL(file))
                //_preview(file)
                uploadFiles(file);
            });
            data.submit();
        },
        done: function (e, data) {
            var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
            result = JSON.parse(result);
            /*$.each(data.result.files, function (index, file) {
                //$('<p/>').text(file.name).appendTo('#files');
            });*/
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css( 'width', progress + '%'
            );
        }
    })


    $(".dropdownSelect").ysdropdown({
        callback:function(val,$elem){
            console.log("===================")
            console.log(val);
            console.log($elem);
        }
    });
});



String.prototype.replaceAll  = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
}


function validContBank(input) {
    var fee=$(input).prev().val();
    if(fee==undefined||fee==null||fee==""){
        alert("请选择收款单位！");
        $(input).val("");
    }
}
/*##################################收款单位信息###############################################*/
//验证数字
function clearNoNum(obj,numberBit) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    //obj.value  =obj.value
    //判断是否带了小数点
    if(!obj.value.match(/\./)){
        //console.log(obj.value.length)
        //console.log(obj.value.indexOf("."))
        //console.log("==============="+obj.value.indexOf("."))
        if(obj.value.length>numberBit-3){
            console.log(obj.value.substring(0,numberBit-3));
            obj.value=obj.value.substring(0,numberBit-3);
        }
       /* if(obj.value.length-1==obj.value.indexOf(".")){
            obj.value=obj.value.substring(0,obj.value.indexOf("."));
        }*/
        /*if(obj.value.indexOf(".")>(numberBit-3)){
            var subStr=obj.value.substring(obj.value.indexOf("."),obj.value.length)
            console.log(subStr)
            obj.value="";
        }*/
    }else{
        //console.log(obj.value.length)
        //console.log(obj.value.indexOf("."))
        //console.log("==============="+obj.value.indexOf("."))
        //console.log("==============="+obj.value.substring(0,obj.value.indexOf(".")));
        //console.log("==============="+obj.value.substring(obj.value.indexOf("."),obj.value.length));
        if(obj.value.substring(0,obj.value.indexOf(".")).length>8){
            obj.value=obj.value.substring(0,8)+obj.value.substring(obj.value.indexOf("."),obj.value.length);
        }
        //obj.value="";
    }

};
/*------------------文件上传开始-----------------------------*/
var flagName="";
//(修改)验证图片格式和大小
function fileChangeUpdate(target) {
    flagName=$(target).attr("flagName");
    var fileSize = 0;
    var filetypes =[".jpg",".png",".bmp",".gif",".jpeg",".tiff",".psd",".swf",".svg",".pcx",".dxf",".wmf",".emf",".lic",".eps",".tga"];  //图片全部格式
    var filepath = target.value;
    var filemaxsize = 1024*20;  //20M
    if(filepath){
        var isnext = false;
        var fileend = filepath.substring(filepath.indexOf("."));
        if(filetypes && filetypes.length>0){
            for(var i =0; i<filetypes.length;i++){
                if(filetypes[i]==fileend){
                    isnext = true;
                    break;
                }
            }
        }
        if(!isnext){
            alert("不接受此文件类型！");
            target.value ="";
            return false;
        }
    }else{
        return false;
    }
    //alert("--------------"+flagName);
}

function phoneNum(_this){
    //var mobile =  /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    //var mobile = /^1[34578]\d{9}$/;
    //var tel = /^\d{3,4}-?\d{7,9}$/;
    var isMobile=/^(?:13\d|15\d)\d{5}(\d{3}|\*{3})$/;
    var isPhone=/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
    var phone=$(_this).val();
    console.log(isMobile.test(phone));
    console.log(isPhone.test(phone));
    if(isMobile.test(phone)||isPhone.test(phone)){
    }else{
        $(_this).val("");
        alert("请输入正确的电话号码格式!");
    }
}
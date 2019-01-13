var dubSumit = 0;
var isAddFile=false;
var ran1="";
var imgkkAll="";
var ids="";     //附件id
var urls="";     //附件路径(删除)
var addUrls="";    //附件路径(添加)
var targetIds="";     //业务编号
var isshanchu=false;
/*##################################分页###############################################*/

$("#data-project-list").on("click", ".zl-paginate", function (e) {
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
    $("#searchBsMallForm").find("input[name=page]").val(page);
    $("#searchBsMallForm").trigger("submit");
});


// $("#gotoPageNum").on("blur", function (e) {
//     if (!isNumberss($(this).val()) || parseInt($(this).val()) == 0) {
//         alert("请输入合法数字！");
//         return false;
//     }
//     if(regeMatch($(this).val())){
//         alert("请勿输入特殊字符！");
//         return false;
//     }
//     console.log("$(this).val()",$(this).val());
//     console.log("$('#pages').val()",$("#pages").val());
//     var currentPage=$(this).val();
//     var totalPage=$("#pages").val();
//     if (parseInt(currentPage) > parseInt(totalPage)) {
//         alert("超过总页数！");
//         $(this).val($("#pages").val());
//         return false;
//     }
// });

$("#gotoPage").on("click", function (e) {
    //console.log("==========================");
    if (!isNumberss($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
        alert("请输入合法数字！");
        return false;
    }
    if(regeMatch($("#gotoPageNum").val())){
        alert("请勿输入特殊字符！");
        return false;
    }

    if(verifyPagination(parseInt($("#gotoPageNum").val()), parseInt($("#pages").val()))){
        $("#searchBsMallForm").find("input[name=page]").val($("#gotoPageNum").val());
        $("#searchBsMallForm").trigger("submit");
    }else{
        $("#gotoPageNum").val($("#pages").val());
    }

});

$(".zl-page-num-input").bind("keypress",function(event){
    if(event.keyCode == "13")
    {
        $("#gotoPage").trigger("click");
    }
});

$("#searchBsFormBtn").on("click", function (e) {
    $("#searchBsMallForm").find("input[name=page]").val(1);
    $("#searchBsMallForm").trigger("submit");
});
$("#searchBsMallForm").submit(function () {
    var self = $(this);
    //var areaName = $.trim($(this).find("input[name=areaName]").val());
    //self.find("input[name=areaNameEncode]").val(encodeURI(areaName));
    self.attr("action", enrolmentWeb_Path + "mall/index.htm");
});
/*##################################分页###############################################*/

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
        alert("项目编码不能为空！");
        return false;
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
    if (square == "" || square == null) {
        alert("建筑面积不能为空！");
        return false;
    }
    if(regeMatch(square)){
        alert("建筑面积请勿输入特殊字符！");
        return false;
    }
    if (!isNum(square, "建筑面积")) {
        return false;
    }
    if (parseInt(square) < 0) {
        alert("建筑面积应为正数！");
        return false;
    }

    var serviceSquare = $.trim($(obj).find("input[name=serviceSquare]").val());
    if (serviceSquare == "" || serviceSquare == null) {
        alert("实用面积不能为空！");
        return false;
    }
    if (!isNum(serviceSquare, "实用面积")) {
        return false;
    }
    if (parseInt(serviceSquare) < 0) {
        alert("实用面积应为正数！");
        return false;
    }
    if(regeMatch(serviceSquare)){
        alert("实用面积请勿输入特殊字符！");
        return false;
    }
    var openDate = $.trim($(obj).find("input[name=openDate]").val());
    if (openDate == "" || openDate == null) {
        alert("开业时间不能为空！");
        return false;
    }

    var stat = $.trim($(obj).find("input[name=stat]").val());
    if (stat == "" || stat == null) {
        alert("营运状态不能为空！");
        return false;
    }
    var taxpayer = $.trim($(obj).find("input[name=taxpayer]").val());
    //console.log("----"+taxpayer)
    if(taxpayer == "" || taxpayer == null){
        alert("纳税属性不能为空！");
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
        alert("地址不能为空！");
        return false;
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
    for(var i=0;i<payeeShorts.length;i++){
        var a = i+1;
        var value2 = $(payeeShorts[i]).val();
        if($.trim(value2)=="" || $.trim(value2)==null){
            alert("第"+a+"行收款单位简称不能为空！");
            return false;
        }
    }

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
    for(var i=0;i<generOfChIns.length;i++){
        var a = i+1;
        var value8 = $(generOfChIns[i]).val();
        if($.trim(value8)=="" || $.trim(value8)==null){
            alert("第"+a+"行收入户代收标记不能为空！");
            return false;
        }
    }

  /*  var costAccounts=$(".costAccount");
    for(var i=0;i<costAccounts.length;i++){
        var a = i+1;
        var value9 = $(costAccounts[i]).val();
        if($.trim(value9)=="" || $.trim(value9)==null){
            alert("第"+a+"行费用科目不能为空！");
            return false;
        }
    }*/

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

    return true;
}

//选择框赋值
$(".dropdownSelect").ysdropdown({
    callback:function(val,$elem){
        query();
    }
});


function verifyPagination(value,total) {
    if(total===0) return true;
    if(!isNumber(value)){
        alert('请输入正确的页码');
        return  false;
    }
    if(value>total){
        alert('超过总页数,请重新输入 ');
        return false;
    }
    return true;
}
function query(){
    $("#searchBsMallForm").find("input[name=page]").val(1);
    $("#searchBsMallForm").trigger("submit");
}
/*##################################收款单位信息###############################################*/




/*##################################收款单位信息###############################################*/


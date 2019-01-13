var pageView=(function($){
    var pageView={};
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
    };


    return pageView;

})(jQuery);


$(document).ready(function(){
    console.log("................");
    pageView.init();

});

$("body").on('click','.but-val',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $(this).parent().parent().parent().parent().find(".input-val").val(val);
});



$('.zl-dropdown').on('click',function(){
    $(this).addClass("open");
});


//添加行
var bool = true;
var cou = 0;
function addTr(el,ind,trInd,upInd){
    if(""!= upInd && bool){
        cou = parseInt(upInd)+parseInt(1);
        bool = false;
    }else{
        cou = parseInt(cou)+parseInt(1);
    }
    var temp = $("#"+el+"0").html();
    temp = temp.replace("delTr('"+el+"','0')","delTr('"+el+"','"+cou+"')");

    if("1"==trInd){
        temp=temp.replace('ibCompanyPayeeList[0].payee','ibCompanyPayeeList['+cou+'].payee');
        temp=temp.replace('ibCompanyPayeeList[0].bankName','ibCompanyPayeeList['+cou+'].bankName');
        temp=temp.replace('ibCompanyPayeeList[0].accountNo','ibCompanyPayeeList['+cou+'].accountNo');
        temp=temp.replace('ibCompanyPayeeList[0].tax','ibCompanyPayeeList['+cou+'].tax');
    }else if("2"==trInd){
        temp=temp.replace('ibBrandCompanyRelList[0].brandId','ibBrandCompanyRelList['+cou+'].brandId');
        temp=temp.replace('ibBrandCompanyRelList[0].startDate','ibBrandCompanyRelList['+cou+'].startDate');
        temp=temp.replace('ibBrandCompanyRelList[0].endDate','ibBrandCompanyRelList['+cou+'].endDate');
        temp=temp.replace('ibBrandCompanyRelList[0].id','ibBrandCompanyRelList['+cou+'].id');
        temp=temp.replace('ibBrandCompanyRelList[0].authLevel','ibBrandCompanyRelList['+cou+'].authLevel');
        temp=temp.replace('ibBrandCompanyRelList[0].limitsOfAuth','ibBrandCompanyRelList['+cou+'].limitsOfAuth');
    }else if("3"==trInd){
        /*temp=temp.replace('ibCompanyLicenseList[0].id','ibCompanyLicenseList['+cou+'].id');*/
        temp=temp.replace('ibCompanyLicenseList[0].licenseType','ibCompanyLicenseList['+cou+'].licenseType');
        temp=temp.replace('ibCompanyLicenseList[0].startDate','ibCompanyLicenseList['+cou+'].startDate');
        temp=temp.replace('ibCompanyLicenseList[0].endDate','ibCompanyLicenseList['+cou+'].endDate');
        temp=temp.replace('fileupload-0','fileupload-'+cou+'');
        temp=temp.replace('zl-img-wrapper-0','zl-img-wrapper-'+cou+'');
        temp = temp.replace("addFile('0')","addFile('"+cou+"')");


    }
    $("#tbody"+trInd+"_tr"+ind).append("<tr id='tr"+trInd+"-index-"+cou+"'>"+temp+"</tr>");
    loadDate();
}


//删除行
function delTr(el,ind){
    if(ind!=0) {
        $("#"+el+ind).remove();
    }else{
        alert("不能删除！");
    }
}

function loadDate(){
    $(".zl-datetimepicker").find("input").datetimepicker({
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        autoclose: true,
        language:"zh-CN",
    }).on('changeDate', function(e){
        console.log(e)
    });
}


$("#saveBtn").on("click", function (e) {
    var companyId = $("#companyId").val();
    if(companyId){
        if(valitateForm()){
            $.ajax({
                cache: true,
                type: "POST",
                url: ibrandWeb_Path+"company/save.htm",
                data: $('#saveInfoForm').serialize(),
                async: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    //showMsg(resultData);
                    dubSumit = 0;
                    window.location = ibrandWeb_Path+"company/index.htm";
                }
            });
        }
    }else{
        if(valitateForm()){
            $.ajax({
                cache: true,
                type: "POST",
                url: ibrandWeb_Path+"company/add.htm",
                data: $('#saveInfoForm').serialize(),
                async: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    //showMsg(resultData);
                    dubSumit = 0;
                    window.location = ibrandWeb_Path+"company/index.htm";
                }
            });
        }
    }
});

function valitateForm(){
    var mallId = $.trim($("#mallId").val());
    if (mallId == "" || mallId == null) {
        alert("项目不能为空！");
        return false;
    }
    var companyName = $.trim($("#companyName").val());
    if (companyName == "" || companyName == null) {
        alert("租户名称不能为空！");
        return false;
    }
    var companyCode = $.trim($("#companyCode").val());
    if (companyCode == "" || companyCode == null) {
        alert("租户编码不能为空！");
        return false;
    }
    var type = $.trim($("#type").val());
    if (type == "" || type == null) {
        alert("租户类型不能为空！");
        return false;
    }
    var typeSub = $.trim($("#typeSub").val());
    if (typeSub == "" || typeSub == null) {
        alert("性质不能为空！");
        return false;
    }
    var openShopRange = $.trim($("#openShopRange").val());
    if (openShopRange == "" || openShopRange == null) {
        alert("开店范围不能为空！");
        return false;
    }
    var tel = $.trim($("#tel").val());
    if (tel == "" || tel == null) {
        alert("公司电话不能为空！");
        return false;
    }
    var companyFax = $.trim($("#companyFax").val());
    if (companyFax == "" || companyFax == null) {
        alert("公司传真不能为空！");
        return false;
    }
    var legalPerson = $.trim($("#legalPerson").val());
    if (legalPerson == "" || legalPerson == null) {
        alert("公司法人不能为空！");
        return false;
    }
    var address = $.trim($("#address").val());
    if (address == "" || address == null) {
        alert("公司地址不能为空！");
        return false;
    }
    var electronicInvoice = $.trim($("input[name='electronicInvoice']").val());
    if (electronicInvoice == "" || electronicInvoice == null) {
        alert("是否支持电子账单不能为空！");
        return false;
    }
    var remark = $.trim($("#remark").val());
    if (remark == "" || remark == null) {
        alert("备注不能为空！");
        return false;
    }

/*    accountNo//银行账号
    tax//	税务*/
    //选择品牌
  /*  var brandIds=$(".brandId");
    for(var i=0;i<brandIds.length;i++){
        var a = i+1;
        var value1 = $(brandIds[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行收品牌不能为空！");
            return false;
        }
    }
    //授权开始时间
    var startDate1s=$(".startDate1");
    for(var i=0;i<startDate1s.length;i++){
        var a = i+1;
        var value1 = $(startDate1s[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行授权开始时间不能为空！");
            return false;
        }
    }
    //授权截止时间
    var endDate1s=$(".endDate1");
    for(var i=0;i<endDate1s.length;i++){
        var a = i+1;
        var value1 = $(endDate1s[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行授权截止时间不能为空！");
            return false;
        }
    }
    //授权等级
    var authLevels=$(".authLevel");
    for(var i=0;i<authLevels.length;i++){
        var a = i+1;
        var value1 = $(authLevels[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行授权等级不能为空！");
            return false;
        }
    }
    //授权范围
    var limitsOfAuths=$(".limitsOfAuth");
    for(var i=0;i<limitsOfAuths.length;i++){
        var a = i+1;
        var value1 = $(limitsOfAuths[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行授权范围不能为空！");
            return false;
        }
    }
    //证照类型
    var licenseTypes=$(".licenseType");
    for(var i=0;i<licenseTypes.length;i++){
        var a = i+1;
        var value1 = $(licenseTypes[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行证照类型不能为空！");
            return false;
        }
    }
    //证照有效时间范围开始时间
    var startDate2s=$(".startDate2");
    for(var i=0;i<startDate2s.length;i++){
        var a = i+1;
        var value1 = $(startDate2s[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行证照有效时间开始时间不能为空！");
            return false;
        }
    }
    //证照有效时间范围结束时间
    var endDate2s=$(".endDate2");
    for(var i=0;i<endDate2s.length;i++){
        var a = i+1;
        var value1 = $(endDate2s[i]).val();
        if($.trim(value1)=="" || $.trim(value1)==null){
            alert("第"+a+"行证照有效时间结束时间不能为空！");
            return false;
        }
    }*/
    //纳税类别
    var taxCategorys=$.trim($("#taxCategory").val());
    if (taxCategorys == "" || taxCategorys == null) {
        alert("纳税类别不能为空！");
        return false;
    }
    //身份证号
    var idCards=$.trim($("#idCard").val());
    if (idCards == "" || idCards == null) {
        alert("身份证号不能为空！");
        return false;
    }
    //税号
    var dutyParagraphs=$.trim($("#dutyParagraph").val());
    if (dutyParagraphs == "" || dutyParagraphs == null) {
        alert("税号不能为空！");
        return false;
    }
    //电话
    var workTels=$.trim($("#workTel").val());
    if (workTels == "" || workTels == null) {
        alert("电话不能为空！");
        return false;
    }
    //单位地址
    var workAddresss=$.trim($("#workAddress").val());
    if (workAddresss == "" || workAddresss == null) {
        alert("单位地址不能为空！");
        return false;
    }
    return true;
}
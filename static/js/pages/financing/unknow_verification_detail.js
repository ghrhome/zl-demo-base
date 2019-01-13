var expenseVerificationAddOffsetView = (function($){
    var expenseVerificationAddOffsetView = {};
    var _renterData=[];

    $("#preloader").fadeOut("fast");

    checkVerification($("#dealStatus").val());

    var page = $("#expense-verification-add");

    $("#js-addnew-save").on("click", function (e) {
        var realOffsetAmountTotal = Number($(".realOffsetAmountTotal").find("input").val());
        if(0 == realOffsetAmountTotal){
            alert('转换金额为0，请重新填写')
            return;
        }
        var isChecked = checkZero();
        if (isChecked) {
            expenseVerificationAddOffsetView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinUnknowVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/unknowVerification/update.htm?oprType=save",
                success: function (resultData) {
                    expenseVerificationAddOffsetView.loadingHide();
                    if (resultData.success == true) {
                        alert("保存成功！");
                        //window.location.reload();
                        /*var url = financeWeb_Path + "/finance/expenseVerification/index.htm";
                        setSearchForm();
                        $("#searchPageForm").attr("action", url).submit();*/
                        window.location = financeWeb_Path + "finance/unknowVerification/index.htm";
                    } else {
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    $("#js-addnew-commit").on("click", function (e) {
        var realOffsetAmountTotal = Number($(".realOffsetAmountTotal").find("input").val());
        if(0 == realOffsetAmountTotal){
            alert('转换金额为0，请重新填写')
            return;
        }
        var isChecked = checkZero();
        if (isChecked) {
            expenseVerificationAddOffsetView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinUnknowVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/unknowVerification/update.htm?oprType=commit",
                success: function (resultData) {
                    expenseVerificationAddOffsetView.loadingHide();
                    if (resultData.success == true) {
                        alert("提交成功！");
                        //window.location.reload();
                        /*var url = financeWeb_Path + "/finance/expenseVerification/index.htm";
                        setSearchForm();
                        $("#searchPageForm").attr("action", url).submit();*/
                        window.location = financeWeb_Path + "finance/unknowVerification/index.htm" ;
                    }else{
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    $("#js-addnew-refuse").on("click", function (e) {
        var realOffsetAmountTotal = Number($(".realOffsetAmountTotal").find("input").val());
        if(0 == realOffsetAmountTotal){
            alert('转换金额为0，请重新填写')
            return;
        }
        var isChecked = checkZero();
        if (isChecked) {
            expenseVerificationAddOffsetView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinUnknowVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/unknowVerification/update.htm?oprType=refuse",
                success: function (resultData) {
                    expenseVerificationAddOffsetView.loadingHide();
                    if (resultData.success == true) {
                        alert("保存成功！");
                        //window.location.reload();
                        /*var url = financeWeb_Path + "/finance/expenseVerification/index.htm";
                        setSearchForm();
                        $("#searchPageForm").attr("action", url).submit();*/
                        window.location = financeWeb_Path + "finance/unknowVerification/index.htm";
                    } else {
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    $("#js-addnew-success").on("click", function (e) {
        var realOffsetAmountTotal = Number($(".realOffsetAmountTotal").find("input").val());
        if(0 == realOffsetAmountTotal){
            alert('转换金额为0，请重新填写')
            return;
        }
        var isChecked = checkZero();
        if (isChecked) {
            expenseVerificationAddOffsetView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinUnknowVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/unknowVerification/update.htm?oprType=success",
                success: function (resultData) {
                    expenseVerificationAddOffsetView.loadingHide();
                    if (resultData.success == true) {
                        alert("提交成功！");
                        //window.location.reload();
                        /*var url = financeWeb_Path + "/finance/expenseVerification/index.htm";
                        setSearchForm();
                        $("#searchPageForm").attr("action", url).submit();*/
                        window.location = financeWeb_Path + "finance/unknowVerification/index.htm" ;
                    }else{
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    function checkZero() {
        var isChecked = true;
        $(".realOffsetAmount").each(function(){
            var subOffsetAmount = $(this).find("input").val();
            if(''=== subOffsetAmount){
                alert('转换金额不能为空！');
                isChecked = false;
                return isChecked;
            }
        })
        return isChecked;
    }

    $(".realOffsetAmount").on("input",function(){
        var realOffsetAmount = Number($(this).find("input").val());
        var canOffsetAmount = Number($(this).parents("tr").find(".canOffsetAmount input").val());
        if(realOffsetAmount > canOffsetAmount || realOffsetAmount < 0){
            alert('金额填写超出可填范围！');
            $(this).find("input").val('');
            return ;
        }
        var realOffsetAmountTotal = Number(0).toFixed(2);
        $(".realOffsetAmount").each(function(){
            realOffsetAmountTotal = accAdd(realOffsetAmountTotal, Number($(this).find("input").val()));
        })
        $(".realOffsetAmountTotal").find("input").val(Number(realOffsetAmountTotal).toFixed(2));

    })

    expenseVerificationAddOffsetView.init = function(){
        $("#preloader").fadeOut("fast");
    };

    expenseVerificationAddOffsetView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    expenseVerificationAddOffsetView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    return expenseVerificationAddOffsetView;

})(jQuery);

$(document).ready(function(){
    expenseVerificationAddOffsetView.init();
    confirmAlert.init();
});

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1减去arg2的精确结果
 **/
function accSub(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果

function accAdd(arg1,arg2)
{
    return (Number(arg1) + Number(arg2)).toFixed(2);
}

function fmtDate(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}

function clearNoNum(obj){
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value= parseFloat(obj.value);
    }
}

function checkVerification(param){
    if(param == 0){
        $("#js-addnew-commit").show();
        $("#js-addnew-save").show();
    }
    if(param == 1){
        $(".realOffsetAmount input").attr("readonly","readonly");
    }
    if(param == 2){
        $("#js-addnew-refuse").show();
        $("#js-addnew-success").show();
        $(".realOffsetAmount input").attr("readonly","readonly");
    }
}
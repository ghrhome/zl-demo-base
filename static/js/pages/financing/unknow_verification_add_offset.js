var expenseVerificationAddOffsetView = (function($){
    var flag = false;
    var expenseVerificationAddOffsetView = {};
    var _renterData=[];
    expenseVerificationAddOffsetView.search=function () {
        $("#js-dropdown-out-companys").ysSearchSelect({
            source:function( request, response ) {
                $.ajax( {
                    url: financeWeb_Path + 'finance/receivepaper/ibCompanylist.htm',
                    dataType: "json",
                    data: {
                        mallId: $("#mallId").val(),
                        companyName:request.term
                    },
                    success: function( data ) {
                        // if (data.length === 0) {
                        //     alert('此项目下没租户,请先添加租户或者选择别的项目');
                        //     return;
                        // }
                        response( $.map( data, function( item ) {
                            return {
                                label: item.companyName,
                                value: item.id
                            }
                        }));
                    }
                } );
            },
            callback:function(value,ui){
                $("#outCompanyId").val(ui.item.value);
                $('#outCompanyName').val(ui.item.label);
                //expenseVerificationAddOffsetView.searchUpdate();
                _searchCb(ui.item.value,ui.item.label);
            },
        });


        $("#js-dropdown-in-companys").ysSearchSelect({
            source:function( request, response ) {
                $.ajax( {
                    url: financeWeb_Path + 'finance/receivepaper/ibCompanylist.htm',
                    dataType: "json",
                    data: {
                        mallId: $("#mallId").val(),
                        companyName:request.term
                    },
                    success: function( data ) {
                        // if (data.length === 0) {
                        //     alert('此项目下没租户,请先添加租户或者选择别的项目');
                        //     return;
                        // }
                        response( $.map( data, function( item ) {
                            return {
                                label: item.companyName,
                                value: item.id
                            }
                        }));
                    }
                } );
            },
            callback:function(value,ui){
                $("#inCompanyId").val(ui.item.value);
                $('#inCompanyName').val(ui.item.label);
                //expenseVerificationAddOffsetView.searchUpdate();
                _searchConts(ui.item.value);
            },
        });
    }

    function _searchConts(companyId) {
        $.getJSON(financeWeb_Path + 'finance/receivepaper/contlist.htm', {companyId: companyId}, function (res) {
            $('#js-dropdown-conts').children('button').html('');
            $('#js-dropdown-conts').children('input').val('');
            $('#js-dropdown-conts').find(' .dropdown-menu').children('li').remove();
            if (res.length === 0) {
                alert('此租户下没合同,请先添加合同或者选择别的租户');
                $('#contNo').val('');
                var btn1=$('#contNo').parents(".zl-dropdown-inline").children('button');
                btn1.html('');
                return;
            }
            $('#js-dropdown-conts').find(' .dropdown-menu').children('li').remove();
            for (var i = 0; i < res.length; i++) {
                var storeNos =  res[i].storeNos;
                var brandName =  res[i].brandName;
                if(storeNos != null && storeNos != "" && storeNos != undefined){
                    storeNos = "/"+storeNos;
                }else {
                    storeNos = "/";
                }
                if(brandName != null && brandName != "" && brandName != undefined){
                    brandName = "/"+brandName;
                }else{
                    brandName = "/";
                }

                $('#js-dropdown-conts').find(' .dropdown-menu').append("<li class='cont'><a title='" + res[i].contNo +storeNos+brandName+"' key='" + res[i].contNo + "' href='javascript:void(0)'>" + res[i].contNo +storeNos+brandName+"</a></li>");

            }
        });
    }

    function _searchCb(companyId,companyName){
        //$('#companyId').val(companyId);
        //$('#companyName').val(companyName);
        $.getJSON(financeWeb_Path + 'finance/unknowVerification/recelist.htm', {saveCompanyId: companyId,saveCompanyName: companyName}, function (res) {
            if (res.length === 0) {
                alert('此租户下没有预收款！');
                return;
            }
            var offsetList = res.finExpenseVerificationOffsetEntityList;

            $('.table-offset').children('tbody').find('.trData').remove();
            var canOffsetAmountTotal = Number(0).toFixed(2);
            for (var i = 0; i < offsetList.length; i++) {
                var canOffsetAmount = Number(offsetList[i].canOffsetAmount).toFixed(2);
                var realOffsetAmount = Number(offsetList[i].realOffsetAmount).toFixed(2);
                var advanceAmount = Number(offsetList[i].advanceAmount).toFixed(2);
                var offsetType = offsetList[i].offsetType;
                var receContNo = offsetList[i].receContNo;
                var accountNo = offsetList[i].accountNo;
                var accountName = offsetList[i].accountName;
                if(null == receContNo){
                    receContNo = '';
                }
                if(null == accountNo){
                    accountNo = '';
                }
                if(null == accountName){
                    accountName = '';
                }
                canOffsetAmountTotal = accAdd(canOffsetAmountTotal , canOffsetAmount);

                var offsetTr = "<tr class='keepTotalTr trData'>";
                if ('预收款'=== offsetType){
                    receContNo = '';
                    offsetTr = "<tr class='reTotalTr trData'>";
                }
                offsetTr = offsetTr
                    +"<td class='zl-edit offsetType' title='" + offsetType + "'>"
                    +"<input type='text' name='finExpenseVerificationOffsetEntityList[" + i + "].offsetType'  value='" + offsetType + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit receContNo' >"
                    +"<input type='text' name='finExpenseVerificationOffsetEntityList[" + i + "].receContNo'  value='" + receContNo + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit accountNo' >"
                    +"<input type='text' name='finExpenseVerificationOffsetEntityList[" + i + "].accountName'  value='" + accountName + "' readonly>"
                    +"<input type='hidden' name='finExpenseVerificationOffsetEntityList[" + i + "].accountNo'  value='" + accountNo + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit canOffsetAmount' title='" + canOffsetAmount + "'>"
                    +"<input type='text' name='finExpenseVerificationOffsetEntityList[" + i + "].canOffsetAmount' class='text-right' value='" + canOffsetAmount + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit realOffsetAmount' title='" + realOffsetAmount + "'>"
                    +"<input type='number' name='finExpenseVerificationOffsetEntityList[" + i + "].realOffsetAmount' min='0' onkeyup='clearNoNum(this)' class='text-right' value='" + realOffsetAmount + "' >"
                    +"</td>"
                    /*+"<td class='zl-edit advanceAmount' title='" + advanceAmount + "'>"
                    +"<input type='text' name='finExpenseVerificationOffsetEntityList[" + i + "].advanceAmount' class='text-right' value='" + advanceAmount + "' readonly>"
                    +"</td>"*/
                    +"</tr>";
                $('.table-offset').children('tbody').find('tr:last').before(offsetTr);
            }
            $(".canOffsetAmountTotal").find('input').val(Number(canOffsetAmountTotal).toFixed(2)) ;
            $(".realOffsetAmountTotal").find('input').val(Number(0).toFixed(2)) ;
            bindPageEvents();
        });
    }

    $("#preloader").fadeOut("fast");

    var page = $("#expense-verification-add");

    page.find(".zl-datetimepicker input").datetimepicker({
        language: "zh-CN",
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
        clearBtn:true
    });

    page.on("click",".zl-datetimepicker",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).find("input").datetimepicker("show");
    });

    var ys_main_swiper = new Swiper('#zl-floor-main-table', {
        scrollbar: '.swiper-scrollbar-a',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbarHide:false,
        grabCursor:true,
        scrollbarDraggable : true ,
        preventClicksPropagation:false
    });

    $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
        var _index=$(this).index();

        $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
        $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

    });

    $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
        var _index=$(this).index();

        $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
        $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');
    });

    page.on("click","a.view-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        var width = $(window).width();
        var height = $(window).height();
        var features = "width='"+width+"',height='"+height+"'";
        window.open("../../../pages/finance/scp/empty_receipt.html","_blank",features);
    });

    $("#js-addnew-save").on("click", function (e) {
        if(flag){
            return;
        }
        var realOffsetAmountTotal = Number($(".realOffsetAmountTotal").find("input").val());
        if(0 == realOffsetAmountTotal){
            alert('转换金额为0，请重新选择转换金额或选择租户')
            return;
        }
        var isChecked = checkZero();
        if (isChecked) {
            expenseVerificationAddOffsetView.loadingShow();
            flag = true;
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinUnknowVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/unknowVerification/add.htm?oprType=save",
                success: function (resultData) {
                    expenseVerificationAddOffsetView.loadingHide();
                    flag = false;
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
        if(flag){
            return;
        }
        var realOffsetAmountTotal = Number($(".realOffsetAmountTotal").find("input").val());
        if(0 == realOffsetAmountTotal){
            alert('转换金额为0，请重新选择转换金额或选择租户')
            return;
        }
        var isChecked = checkZero();
        if (isChecked) {
            expenseVerificationAddOffsetView.loadingShow();
            flag = true;
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinUnknowVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/unknowVerification/add.htm?oprType=commit",
                success: function (resultData) {
                    expenseVerificationAddOffsetView.loadingHide();
                    flag = false;
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

        var mallName = $("#mallName").val();
        if(mallName==null || mallName==""){
            alert("请选择项目");
            isChecked = false;
            return;
        }
        var outCompanyName = $("#outCompanyName").val();
        if(outCompanyName==null || outCompanyName==""){
            alert("请选择转出租户");
            isChecked = false;
            return;
        }
        var inCompanyName = $("#inCompanyName").val();
        if(inCompanyName==null || inCompanyName==""){
            alert("请选择转入租户");
            isChecked = false;
            return;
        }
        var contNo = $("#contNo").val();
        if(contNo==null || contNo==""){
            alert("请选择转入合同");
            isChecked = false;
            return;
        }
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

    function bindPageEvents(){
        page.on("click",".dropdown-menu .js-search",function (e) {
            expenseVerificationAddOffsetView.search();
        });

        page.on("click",'.dropdown-menu .mall',function (e) {
            var name=$(this).children('a').html();
            var id=$(this).children('a').attr('key');
            //todo:
           // $(".zl-table-wrapper-swiper").find("tbody").empty();")

            //todo:
            $('.table-offset').children('tbody').find('.trData').remove();
            $('.table-offset-sub').children('tbody').find('.trData').remove();
            $('#zl-section-collapse-table-4').find('tbody .trData').remove();
            $(".canOffsetAmountTotal").find('input').val(Number(0).toFixed(2)) ;
            $(".realOffsetAmountTotal").find('input').val(Number(0).toFixed(2)) ;
            $(".canSubAmountTotal").find('input').val(Number(0).toFixed(2)) ;
            $(".realSubAmountTotal").find('input').val(Number(0).toFixed(2)) ;
            $(".receAmountTotal").find('input').val(Number(0).toFixed(2)) ;
            $(".subAmountTotal").find('input').val(Number(0).toFixed(2)) ;
            $(".deAmountTotal").find('input').val(Number(0).toFixed(2)) ;
            $(".laterAmountTotal").find('input').val(Number(0).toFixed(2));
            $(".reOffsetAmountTotal").find('input').val(Number(0).toFixed(2));
            $(".keepOffsetAmountTotal").find('input').val(Number(0).toFixed(2));
            $(".subOffsetAmountTotal").find('input').val(Number(0).toFixed(2));
            //

            $('#mallId').val(id);
            $('#mallName').val(name);
            var btn=$(this).parents(".zl-dropdown").children('button');
            btn.html(name);
            var btn1=$(this).parents(".zl-dropdown-inline").children('button');
            btn1.html(name);

            var inputText = $(this).parents(".zl-dropdown").children('input');
            inputText.val(id);
            var inputText1 = $(this).parents(".zl-dropdown-inline").children('input');
            inputText1.val(id);
            var mallValue = inputText1.val();
            if ($(this).parents('#js-dropdown-projects-add')[0]) {
                $("#js-dropdown-out-companys").find("button").html("");
                $("#outCompanyId").val("");
                $("#outCompanyName").val("");
                $("#js-dropdown-in-companys").find("button").html("");
                $("#inCompanyId").val("");
                $("#inCompanyName").val("");
                $("#js-dropdown-conts").find("button").html("");
                $("#contNo").val("");
                expenseVerificationAddOffsetView.search();
            }
        });

        page.on("click",'.dropdown-menu .cont',function (e) {
            var name=$(this).children('a').html();
            var id=$(this).children('a').attr('key');
            $('#contNo').val(id);
            var btn1=$(this).parents(".zl-dropdown-inline").children('button');
            btn1.html(id);
        });

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
    }

    expenseVerificationAddOffsetView.init = function(){
        $("#preloader").fadeOut("fast");

        bindPageEvents();

        expenseVerificationAddOffsetView.search();
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

function  compareDate(myDate,receDate){
    var arrReceDate = receDate.split("-");
    var allReceDate = new Date(arrReceDate[0] , arrReceDate[1] , arrReceDate[2]);
    var myDateTime = new Date(myDate.getFullYear(),myDate.getMonth()+1,myDate.getDate());
    if (myDateTime.getTime() >= allReceDate.getTime()) {
        return true;
    }
    return false;
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

function searchIsCollection(_this) {
    $(_this).parents('td').find("input").val($(_this).attr("key"));
    $(_this).parents('td').find("button").html($(_this).html());
}
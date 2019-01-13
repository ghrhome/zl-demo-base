var expenseVerificationDetailView = (function($){
    var expenseVerificationDetailView = {};
    $("#preloader").fadeOut("fast");

    //console.log("-------------状态"+$("#verificationStatus").val())

    checkVerification($("#verificationStatus").val(),$("#expenseVerificationNo").val());

    var urlForIndex = getIndexUrl();

    var page = $("#expense-verification-detail");

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

    page.on("click", "a.invoice-btn", function(){
         var _modal = $("#invoice-dialog");
        _modal.find("em.zl-checkbox").removeClass("checked");
        _modal.find("em.zl-fake-radio").removeClass("checked");
        _modal.find("input").val("");
         _modal.modal("show");
    });
    $("#invoice-dialog").on("click", "em.zl-checkbox.all", function(){
        var _table = $(this).closest("table");
       if($(this).hasClass("checked")){
           $(this).removeClass("checked");
           _table.find("tbody em.zl-checkbox.single").removeClass("checked");
       }else{
           $(this).addClass("checked");
           _table.find("tbody em.zl-checkbox.single:not(.zl-btn-disable)").addClass("checked");
       }
    });
    $("#invoice-dialog").on("click", "em.zl-checkbox.single:not(.zl-btn-disable)", function(){
        $(this).toggleClass("checked");
    });
    $("#invoice-dialog").on("click", "li", function(e){
        e.stopPropagation();
        e.preventDefault();

        var _ul = $(this).closest("ul.receipt-item-list");
        var $elem = $(this).find(".zl-fake-radio");

        if($elem.hasClass("checked")){
            $elem.removeClass("checked");
        }else{
            _ul.find(".zl-fake-radio").removeClass("checked");
            if(!$elem.hasClass("zl-btn-disable")){
                $elem.addClass("checked");
            }
        }

        var _target = _ul.data("id");
        $(this).closest("div.modal-body").find("input[name="+_target+"]").val($elem.data("value"));
    });
    $("#invoice-dialog").on("click", "button.invoice-save-btn", function(){

        var _modal = $("#invoice-dialog");

        var invoiceType = _modal.find("input[name=invoiceType]").val();
        if(invoiceType==null || invoiceType==""){
            alert("请选择开票类型");
            return;
        }
        var remarkType = _modal.find("input[name=remarkType]").val();
        if(remarkType==null || remarkType==""){
            alert("请选择备注类型");
            return;
        }

        var receArr = [];
        _modal.find("em.zl-checkbox.single").each(function() {
            if($(this).hasClass("checked")){
                receArr.push($(this).data("id"));
            }
        });
        if(receArr.length == 0){
            alert("请选择应收");
            return;
        }

        var verificationNo = $("#expenseVerificationNo").val();

        expenseVerificationDetailView.loadingShow();
        var params = {
            verificationNo : verificationNo,
            invoiceType : invoiceType,
            remarkType : remarkType,
            receIds : receArr.join(",")
        };
        $.ajax({
            url: financeWeb_Path + "finance/expenseVerification/generateInvoiceSingle.htm",
            data: params,
            type: "post",
            dataType: "json",
            error: function (request) {
                expenseVerificationDetailView.loadingHide();
                alert("系统繁忙");
            },
            success: function (response) {
                expenseVerificationDetailView.loadingHide();
                alert(response.msg,"","",function(){
                    if(response.code == 0) {
                        // window.open(financeWeb_Path + "bill/invoice/index2.htm?isFirstSearch=0&queryDate=&settlementNo="+response.data[0]);
                    }
                });
            }
        });

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

    var ys_main_swiper1 = new Swiper('#zl-floor-main-table-2', {
        scrollbar: '.swiper-scrollbar-b',
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

    page.on("click",".zl-table-wrapper-swiper tbody tr",function() {
        //location.href="../../../pages/finance/scp/expense_verification_detail.html";

    });

    $("#print-btn").on("click", function (){
        var orderId = $("#id").val();
        // var screenWidth = (screen.availWidth - 10);
        // var screenHeight = (screen.availHeight-50);
        // var subWin = window.open(financeWeb_Path + "finance/expenseVerification/print.htm?orderId=" + orderId, "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        // subWin.onload=function(){
        //     setTimeout(function(){
        //         subWin.print();
        //     },100);
        // };

        expenseVerificationDetailView.loadingShow();
        $.ajax({
            url: financeWeb_Path + "finance/expenseVerification/print/pre.htm",
            data: {orderId : orderId},
            type: "post",
            dataType: "json",
            error: function () {
                expenseVerificationDetailView.loadingHide();
                alert("系统异常");
            },
            success: function (response) {
                expenseVerificationDetailView.loadingHide();
                if(response && response.success){
                    window.open(financeWeb_Path + "finance/expenseVerification/print.htm?id="+response.data.uuid+"&status=page");
                }else{
                    alert(response.message);
                }
            }
        });
    });

    $("#js-save").on("click", function (e) {
        var isChecked = checkFeeType();
        if (isChecked) {
            expenseVerificationDetailView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinExpenseVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/expenseVerification/update.htm?oprType=save",
                success: function (resultData) {
                    expenseVerificationDetailView.loadingHide();
                    if (resultData.success == true) {
                        alert("保存成功","","",function(){
                            window.location = financeWeb_Path + urlForIndex;
                        })
                    } else {
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    $("#js-commit").on("click", function (e) {
        var isChecked = checkFeeType();
        if (isChecked) {
            expenseVerificationDetailView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinExpenseVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/expenseVerification/update.htm?oprType=commit",
                success: function (resultData) {
                    expenseVerificationDetailView.loadingHide();
                    if (resultData.success == true) {
                        alert("提交成功","","",function(){
                            window.location = financeWeb_Path + urlForIndex;
                        })
                    }else{
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    $("#js-refuse").on("click", function (e) {
        var isChecked = checkFeeType();
        if (isChecked) {
            expenseVerificationDetailView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinExpenseVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/expenseVerification/update.htm?oprType=refuse",
                success: function (resultData) {
                    expenseVerificationDetailView.loadingHide();
                    if (resultData.success == true) {
                        alert("驳回成功","","",function(){
                            window.location = financeWeb_Path + urlForIndex;
                        })
                    }else{
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    $("#js-success").on("click", function (e) {
        /*var advanceMoney = Number($(".reTotalTr").find(".advanceAmount input").val());
        if(advanceMoney > 0){
            $("#advanceMoney").val(advanceMoney);
            $("#informDialog").modal("show");
            return;
        }*/
        var isChecked = checkFeeType();
        if (isChecked) {
            expenseVerificationDetailView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinExpenseVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/expenseVerification/update.htm?oprType=success",
                success: function (resultData) {
                    expenseVerificationDetailView.loadingHide();
                    if (resultData.success == true) {
                        alert("审核成功","","",function(){
                            window.location = financeWeb_Path + urlForIndex;
                        })
                    }else{
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    $("#js-old").on("click", function (e) {
        var isChecked = checkFeeType();
        if (isChecked) {
            expenseVerificationDetailView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinExpenseVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/expenseVerification/updateOld.htm?oprType=success",
                success: function (resultData) {
                    expenseVerificationDetailView.loadingHide();
                    if (resultData.success == true) {
                        alert("修正成功","","",function(){
                            window.location = financeWeb_Path + urlForIndex;
                        })
                    }else{
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    $("#confirmBtn").on("click", function (event) {
        $.ajax({
            type: "POST",
            dataType: "json",
            data: $("#addFinExpenseVerificationForm_").serialize(),
            url: financeWeb_Path + "/finance/expenseVerification/update.htm?oprType=success",
            success: function (resultData) {
                if (resultData.success == true) {
                    alert("保存成功","","",function(){
                        window.location = financeWeb_Path + urlForIndex;
                    })
                }else{
                    alert(resultData.msg);
                }
            }
        });
    });

    $("#js-reset").on("click", function (e) {
        var isChecked = checkFeeType();
        if (isChecked) {
            expenseVerificationDetailView.loadingShow();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinExpenseVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/expenseVerification/update.htm?oprType=reset",
                success: function (resultData) {
                    expenseVerificationDetailView.loadingHide();
                    if (resultData.success == true) {
                        alert("反核销成功","","",function(){
                            window.location = financeWeb_Path + urlForIndex;
                        })
                    }else{
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    function checkFeeType() {
        var isChecked = true;
        $(".feeType2001").val('');
        $(".feeType2002").val('');
        $(".feeType2003").val('');
        $(".feeType2004").val('');
        $(".feeType").each(function(){
            var feetype = $(this).val();
            if('2001' == feetype){
                if($(".feeType2001").val() != ''){
                    $(".feeTypeList").val('');
                    alert('收预收款费项重复！');
                    isChecked = false;
                    return isChecked;
                } else {
                    $(".feeType2001").val('2001')
                }
            }
            if('2002' == feetype){
                if($(".feeType2002").val() != ''){
                    $(".feeTypeList").val('');
                    alert('收预收款费项重复！');
                    isChecked = false;
                    return isChecked;
                } else {
                    $(".feeType2002").val('2002')
                }
            }
            if('2003' == feetype){
                if($(".feeType2003").val() != ''){
                    $(".feeTypeList").val('');
                    alert('收预收款费项重复！');
                    isChecked = false;
                    return isChecked;
                } else {
                    $(".feeType2003").val('2003')
                }
            }
            if('2004' == feetype){
                if($(".feeType2004").val() != ''){
                    $(".feeTypeList").val('');
                    alert('收预收款费项重复！');
                    isChecked = false;
                    return isChecked;
                } else {
                    $(".feeType2004").val('2004')
                }
            }
        })
        $(".realOffsetAmount").each(function(){
            var realOffserAmount = $(this).find("input").val();
            if(''=== realOffserAmount){
                alert('本次冲抵金额不能为空！');
                isChecked = false;
                return isChecked;
            }
        })
        $(".verAdvanceAmount").each(function(){
            var verAdvanceAmount = $(this).find("input").val();
            if(''=== verAdvanceAmount){
                alert('收预收金额不能为空！');
                isChecked = false;
                return isChecked;
            }
        })
        $(".newDeAmount").each(function(){
            var newDeAmount = $(this).find("input").val();
            if(''=== newDeAmount){
                alert('本次收款核销金额不能为空！');
                isChecked = false;
                return isChecked;
            }
        })
        $(".reOffsetAmount").each(function(){
            var reOffsetAmount = $(this).find("input").val();
            if(''=== reOffsetAmount){
                alert('预收款冲抵金额不能为空！');
                isChecked = false;
                return isChecked;
            }
        })

        $(".keepOffsetAmount").each(function(){
            var keepOffsetAmount = $(this).find("input").val();
            if(''=== keepOffsetAmount){
                alert('保证金冲抵金额不能为空！');
                isChecked = false;
                return isChecked;
            }
        })

        $(".subOffsetAmount").each(function(){
            var subOffsetAmount = $(this).find("input").val();
            if(''=== subOffsetAmount){
                alert('应收冲减金额不能为空！');
                isChecked = false;
                return isChecked;
            }
        })
        var realSubAmountTotal = Number($(".realSubAmountTotal").find("input").val());
        var subOffsetAmountTotal = Number($(".subOffsetAmountTotal").find("input").val());
        if(realSubAmountTotal != subOffsetAmountTotal){
            alert('应收冲减总金额不一致！');
            isChecked = false;
            return isChecked;
        }
        var reOffsetAmountTotal = Number($(".reOffsetAmountTotal").find("input").val());
        var keepOffsetAmountTotal = Number($(".keepOffsetAmountTotal").find("input").val());
        var realOffsetAmountTotal = Number($(".realOffsetAmountTotal").find("input").val());
        var realOffsetAmountTotal_re = Number(0).toFixed(2);
        $(".realOffsetAmount").each(function () {
            var offsetTypeRow = $(this).parents("tr").find(".offsetType input").val();
            if (('预收租金' ==  offsetTypeRow || '预收水费' == offsetTypeRow || '预收电费' == offsetTypeRow || '预收服务费' == offsetTypeRow)) {
                realOffsetAmountTotal_re = accAdd(realOffsetAmountTotal_re , Number($(this).parents("tr").find(".realOffsetAmount input").val()));
            }
        })
        if(realOffsetAmountTotal_re != reOffsetAmountTotal){
            alert('冲抵预收款总金额不一致！');
            isChecked = false;
            return isChecked;
        }
        if(realOffsetAmountTotal != accAdd(reOffsetAmountTotal,keepOffsetAmountTotal)){
            alert('冲抵保证金总金额不一致！');
            isChecked = false;
            return isChecked;
        }
        var total = Number(0).toFixed(2);
        total = accAdd(total,realOffsetAmountTotal);
        total = accAdd(total,realSubAmountTotal);
        var receiveMoney = $("#receiveMoney").val();
        console.log(receiveMoney)
        console.log(total)
        console.log(total == 0)
        console.log(receiveMoney==null || receiveMoney=="")
        if((receiveMoney==null || receiveMoney=="") && total == 0){
            alert('请填写核销或冲抵金额！');
            isChecked = false;
        }
        return isChecked;
    }

    function bindPageEvents(){

        $(".verAdvanceAmount").on("input",function(){
            var total = Number(0).toFixed(2);
            $(".verAdvanceAmount").each(function(){
                total = accAdd(total,Number($(this).find("input").val())) ;
            })
            $(".newDeAmount").each(function(){
                total = accAdd(total,Number($(this).find("input").val())) ;
            })
            var receAmount = Number($("#receiveMoney").val());
            if(total > receAmount || $(this).find("input").val() < 0){
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".verAdvanceAmount input").val('');
                return;
            } else {
                $(".reTotalTr").find(".advanceAmount input").val(accSub(Number(receAmount).toFixed(2),Number(total).toFixed(2)));
            }
        })
        /*$(".canOffsetAmount").on("input",function(){
        var total = 0;
        $(".canOffsetAmount").each(function(){
            total += Number($(this).find("input").val());
        })
        $(".canOffsetAmountTotal").find("input").val(total);
    })*/

        $(".realSubAmount").on("input",function(){
            var realSubAmount = Number($(this).find("input").val());
            var canSubAmount = Math.abs(Number($(this).parents("tr").find(".canSubAmount input").val()));
            if (realSubAmount > canSubAmount || realSubAmount < 0) {
                alert('金额填写超出可填范围！');
                $(this).find("input").val('');
                return;
            }
            ///var receContNo = $(this).parents("tr").find(".receContNo input").val();
            var taxRate = Number($(this).parents("tr").find(".taxRate input").val()).toFixed(2);
            var total = Number(0).toFixed(2);
            total = findSubOffsetAmounts(total, taxRate);
            var realOffsetAmountForRece_TaxRate = Number(0).toFixed(2);
            $(".realSubAmount").each(function () {
                if (taxRate == (Number($(this).parents("tr").find(".taxRate input").val()).toFixed(2))) {
                    realOffsetAmountForRece_TaxRate = accAdd(realOffsetAmountForRece_TaxRate , Number($(this).parents("tr").find(".realSubAmount input").val()));
                }
            })
            if (Number(realOffsetAmountForRece_TaxRate) > Number(total)) {
                alert('金额填写超出当前税率可核销金额！');
                $(this).find("input").val('');
                return;
            }
            //insertSubOffsetAmounts(realOffsetAmountForReceContNo, receContNo);
            var realSubAmountTotal = Number(0).toFixed(2);
            $(".realSubAmount").each(function () {
                realSubAmountTotal = accAdd(realSubAmountTotal, Number($(this).find("input").val()));
            })
            $(".realSubAmountTotal").find("input").val(Number(realSubAmountTotal).toFixed(2));
        })

        $(".realOffsetAmount").on("input",function(){
            var realOffsetAmount = Number($(this).find("input").val());
            var canOffsetAmount = Number($(this).parents("tr").find(".canOffsetAmount input").val());
            if(realOffsetAmount > canOffsetAmount || realOffsetAmount < 0){
                alert('金额填写超出可填范围！');
                $(this).find("input").val('');
                return ;
            }

            /*var receAmountTotal = Number(0).toFixed(2);
            $(".receAmount").each(function () {
                receAmountTotal = accAdd(receAmountTotal, Number($(this).find("input").val()));
            })
            var subAmountTotal = Number(0).toFixed(2);
            $(".subAmount").each(function () {
                subAmountTotal = accAdd(subAmountTotal, Number($(this).find("input").val()));
            })
            var deAmountTotal = Number(0).toFixed(2);
            $(".deAmount").each(function () {
                deAmountTotal = accAdd(deAmountTotal, Number($(this).find("input").val()));
            })
            var newDeAmountTotal = Number(0).toFixed(2);
            $(".newDeAmount").each(function () {
                newDeAmountTotal = accAdd(newDeAmountTotal, Number($(this).find("input").val()));
            })

            var offsetType = $(this).parents("tr").find(".offsetType input").val();
            var receContNo = $(this).parents("tr").find(".receContNo input").val();
            if ('预收租金' == offsetType || '预收水费' == offsetType || '预收电费' == offsetType || '预收服务费' == offsetType) {
                var total = Number(0).toFixed(2);
                total = findReOffsetAmounts(total, receContNo);
                var realOffsetAmountForReceContNo = Number(0).toFixed(2);
                $(".realOffsetAmount").each(function () {
                    var offsetTypeRow = $(this).parents("tr").find(".offsetType input").val();
                    if (receContNo == ($(this).parents("tr").find(".receContNo input").val())
                        && ('预收租金' ==  offsetTypeRow || '预收水费' == offsetTypeRow || '预收电费' == offsetTypeRow || '预收服务费' == offsetTypeRow)) {
                        realOffsetAmountForReceContNo = accAdd(realOffsetAmountForReceContNo , Number($(this).parents("tr").find(".realOffsetAmount input").val()));
                    }
                })
                if (Number(realOffsetAmountForReceContNo) > Number(total)) {
                    alert('金额填写超出合同可核销金额！');
                    $(this).find("input").val('');
                    return;
                }
                insertReOffsetAmounts(realOffsetAmountForReceContNo, receContNo);
            } else {
                //var receContNo = $(this).parents("tr").find(".receContNo input").val();
                var total = Number(0).toFixed(2);
                total = findKeepOffsetAmounts(total, receContNo);
                var realOffsetAmountForReceContNo = Number(0).toFixed(2);
                $(".realOffsetAmount").each(function () {
                    var offsetTypeRow = $(this).parents("tr").find(".offsetType input").val();
                    if (receContNo == ($(this).parents("tr").find(".receContNo input").val())
                        && '预收租金' != offsetTypeRow && '预收水费' != offsetTypeRow && '预收电费' != offsetTypeRow && '预收服务费' != offsetTypeRow) {
                        realOffsetAmountForReceContNo = accAdd(realOffsetAmountForReceContNo , Number($(this).parents("tr").find(".realOffsetAmount input").val()));
                    }
                })
                if (Number(realOffsetAmountForReceContNo) > Number(total)) {
                    alert('金额填写超出合同可核销金额！');
                    $(this).find("input").val('');
                    return ;
                }

                insertKeepOffsetAmounts(realOffsetAmountForReceContNo,receContNo);
            }*/

            var realOffsetAmountTotal = Number(0).toFixed(2);
            $(".realOffsetAmount").each(function(){
                realOffsetAmountTotal = accAdd(realOffsetAmountTotal, Number($(this).find("input").val()));
            })
            $(".realOffsetAmountTotal").find("input").val(Number(realOffsetAmountTotal).toFixed(2));

        })
        /*$(".advanceAmount").on("input",function(){
            var total = 0;
            $(".advanceAmount").each(function(){
                total += Number($(this).find("input").val());
            })
            $(".advanceAmountTotal").find("input").val(total);
        })*/

        $(".subOffsetAmount").on("input", function () {
            var taxRate = Number($(this).parents("tr").find(".taxRate input").val()).toFixed(2);
            var laterAmountTotal = Number(0).toFixed(2);
            var laterAmount = Number(0).toFixed(2);
            var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
            var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
            var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
            var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
            var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
            var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
            var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
            laterAmount = accSub(receAmount,subAmount );
            laterAmount = accSub(laterAmount,deAmount );
            laterAmount = accSub(laterAmount,newDeAmount );
            laterAmount = accSub(laterAmount,reOffsetAmount );
            laterAmount = accSub(laterAmount,keepOffsetAmount );
            laterAmount = accSub(laterAmount,subOffsetAmount );
            if (laterAmount < 0 || reOffsetAmount < 0 ) {
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".subOffsetAmount input").val('');
                return;
            }

            var myDate = new Date();//获取系统当前时间
            var receDate = $(this).parents("tr").find(".receDate input").val();
            if (compareDate(myDate, receDate)) {
                //设置应收明细欠款
                $(this).parents("tr").find(".laterAmount input").val(Number(laterAmount).toFixed(2));
                $(".laterAmount").each(function () {
                    laterAmountTotal = accAdd(laterAmountTotal, Number($(this).find("input").val()));
                })
                $(".laterAmountTotal").find("input").val(Number(laterAmountTotal).toFixed(2));
            }

            var taxRate_subOffsetAmountTotal = Number(0).toFixed(2);
            var subOffsetAmountTotal = Number(0).toFixed(2);
            $(".subOffsetAmount").each(function () {
                if(taxRate == Number($(this).parents("tr").find(".taxRate input").val()).toFixed(2)){
                    taxRate_subOffsetAmountTotal = accAdd(taxRate_subOffsetAmountTotal,Number($(this).find("input").val()));
                }
                subOffsetAmountTotal = accAdd(subOffsetAmountTotal,Number($(this).find("input").val()));
            })
            var taxRate_canSubAmountTotal = Number(0).toFixed(2);
            //var canOffsetAmountTotal = Number(0).toFixed(2);
            $(".canSubAmount").each(function () {
                if(taxRate == Number($(this).parents("tr").find(".taxRate input").val()).toFixed(2)) {
                    taxRate_canSubAmountTotal = accAdd(taxRate_canSubAmountTotal,Math.abs(Number($(this).find("input").val())));
                }
                //canOffsetAmountTotal = accAdd(canOffsetAmountTotal,Number($(this).find("input").val()));
            })

            if(Number(taxRate_subOffsetAmountTotal) > Number(taxRate_canSubAmountTotal)) {
                alert('金额填写超出当前税率可冲减金额！');
                $(this).parents("tr").find(".subOffsetAmount input").val('');
                return;
            }
            $(".subOffsetAmountTotal").find("input").val(Number(subOffsetAmountTotal).toFixed(2));
            /*var realSubAmountTotal = Number(0).toFixed(2);
            $(".realSubAmount").each(function () {
                if(taxRate == Number($(this).parents("tr").find(".taxRate input").val()).toFixed(2)) {
                    var canSubAmount = Math.abs(Number($(this).parents("tr").find(".canSubAmount input").val()));
                    if(Number(canSubAmount) > Number(taxRate_subOffsetAmountTotal)){
                        $(this).find("input").val(Number(taxRate_subOffsetAmountTotal).toFixed(2));
                        realSubAmountTotal = accAdd(realSubAmountTotal,Number(taxRate_subOffsetAmountTotal))
                        taxRate_subOffsetAmountTotal = Number(0).toFixed(2);
                    } else if(Number(taxRate_subOffsetAmountTotal) == 0){
                        $(this).find("input").val(Number(taxRate_subOffsetAmountTotal).toFixed(2));
                    } else {
                        $(this).find("input").val(Number(canSubAmount).toFixed(2));
                        taxRate_subOffsetAmountTotal = accSub(taxRate_subOffsetAmountTotal,canSubAmount);

                        realSubAmountTotal = accAdd(realSubAmountTotal,Number(canSubAmount))
                    }
                } else {
                    realSubAmountTotal = accAdd(realSubAmountTotal,Number($(this).find("input").val()))
                }
            })
            $(".realSubAmountTotal").find("input").val(Number(realSubAmountTotal).toFixed(2));*/
        })

        $(".keepOffsetAmount").on("input", function () {
            //var contNo = $(this).parents("tr").find(".receContNo input").val();
            var laterAmountTotal = Number(0).toFixed(2);
            var laterAmount = Number(0).toFixed(2);
            var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
            var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
            var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
            var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
            var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
            var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
            var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
            laterAmount = accSub(receAmount,subAmount );
            laterAmount = accSub(laterAmount,deAmount );
            laterAmount = accSub(laterAmount,newDeAmount );
            laterAmount = accSub(laterAmount,reOffsetAmount );
            laterAmount = accSub(laterAmount,keepOffsetAmount );
            laterAmount = accSub(laterAmount,subOffsetAmount );
            if (laterAmount < 0 || keepOffsetAmount < 0 ) {
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".keepOffsetAmount input").val('');
                return;
            }

            var myDate = new Date();//获取系统当前时间
            var receDate = $(this).parents("tr").find(".receDate input").val();
            if (compareDate(myDate, receDate)) {
                //设置应收明细欠款
                $(this).parents("tr").find(".laterAmount input").val(Number(laterAmount).toFixed(2));
                $(".laterAmount").each(function () {
                    laterAmountTotal = accAdd(laterAmountTotal, Number($(this).find("input").val()));
                })
                $(".laterAmountTotal").find("input").val(Number(laterAmountTotal).toFixed(2));
            }

            var keepOffsetAmountTotal = Number(0).toFixed(2);
            $(".keepOffsetAmount").each(function () {
                keepOffsetAmountTotal = accAdd(keepOffsetAmountTotal,Number($(this).find("input").val()));
            })
            var canOffsetAmountTotal = Number(0).toFixed(2);
            $(".canOffsetAmount").each(function () {
                var offsetType = $(this).parents("tr").find(".offsetType input").val();
                if(('预收租金' != offsetType && '预收水费' != offsetType && '预收电费' != offsetType && '预收服务费' != offsetType)) {
                    canOffsetAmountTotal = accAdd(canOffsetAmountTotal,Number($(this).find("input").val()));
                }
            })

            if(Number(keepOffsetAmountTotal) > Number(canOffsetAmountTotal)) {
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".keepOffsetAmount input").val('');
                return;
            }
            $(".keepOffsetAmountTotal").find("input").val(Number(keepOffsetAmountTotal).toFixed(2));
            var realOffsetAmountTotal = Number(0).toFixed(2);
            $(".realOffsetAmount").each(function () {
                var offsetType = $(this).parents("tr").find(".offsetType input").val();
                if(('预收租金' != offsetType && '预收水费' != offsetType && '预收电费' != offsetType && '预收服务费' != offsetType)) {
                    var canOffsetAmount = Number($(this).parents("tr").find(".canOffsetAmount input").val());
                    if(Number(canOffsetAmount) > Number(keepOffsetAmountTotal)){
                        $(this).find("input").val(Number(keepOffsetAmountTotal).toFixed(2));
                        realOffsetAmountTotal = accAdd(realOffsetAmountTotal,Number(keepOffsetAmountTotal))
                        keepOffsetAmountTotal = Number(0).toFixed(2);
                    } else if(Number(keepOffsetAmountTotal) == 0){
                        $(this).find("input").val(Number(keepOffsetAmountTotal).toFixed(2));
                    } else {
                        $(this).find("input").val(Number(canOffsetAmount).toFixed(2));
                        keepOffsetAmountTotal = accSub(keepOffsetAmountTotal,canOffsetAmount);

                        realOffsetAmountTotal = accAdd(realOffsetAmountTotal,Number(canOffsetAmount))
                    }
                } else {
                    realOffsetAmountTotal = accAdd(realOffsetAmountTotal,Number($(this).find("input").val()))
                }
            })
            $(".realOffsetAmountTotal").find("input").val(Number(realOffsetAmountTotal).toFixed(2));
        })

        $(".reOffsetAmount").on("input", function () {
            //var contNo = $(this).parents("tr").find(".receContNo input").val();
            var laterAmountTotal = Number(0).toFixed(2);
            var laterAmount = Number(0).toFixed(2);
            var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
            var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
            var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
            var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
            var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
            var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
            var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
            laterAmount = accSub(receAmount,subAmount );
            laterAmount = accSub(laterAmount,deAmount );
            laterAmount = accSub(laterAmount,newDeAmount );
            laterAmount = accSub(laterAmount,reOffsetAmount );
            laterAmount = accSub(laterAmount,keepOffsetAmount );
            laterAmount = accSub(laterAmount,subOffsetAmount );
            if (laterAmount < 0 || reOffsetAmount < 0 ) {
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".reOffsetAmount input").val('');
                return;
            }

            var myDate = new Date();//获取系统当前时间
            var receDate = $(this).parents("tr").find(".receDate input").val();
            if (compareDate(myDate, receDate)) {
                //设置应收明细欠款
                $(this).parents("tr").find(".laterAmount input").val(Number(laterAmount).toFixed(2));
                $(".laterAmount").each(function () {
                    laterAmountTotal = accAdd(laterAmountTotal, Number($(this).find("input").val()));
                })
                $(".laterAmountTotal").find("input").val(Number(laterAmountTotal).toFixed(2));
            }

            var reOffsetAmountTotal = Number(0).toFixed(2);
            $(".reOffsetAmount").each(function () {
                reOffsetAmountTotal = accAdd(reOffsetAmountTotal,Number($(this).find("input").val()));
            })
            var canOffsetAmountTotal = Number(0).toFixed(2);
            $(".canOffsetAmount").each(function () {
                var offsetType = $(this).parents("tr").find(".offsetType input").val();
                if(('预收租金' == offsetType || '预收水费' == offsetType || '预收电费' == offsetType || '预收服务费' == offsetType)) {
                    canOffsetAmountTotal = accAdd(canOffsetAmountTotal,Number($(this).find("input").val()));
                }
            })

            if(Number(reOffsetAmountTotal) > Number(canOffsetAmountTotal)) {
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".reOffsetAmount input").val('');
                return;
            }
            $(".reOffsetAmountTotal").find("input").val(Number(reOffsetAmountTotal).toFixed(2));
            var realOffsetAmountTotal = Number(0).toFixed(2);
            $(".realOffsetAmount").each(function () {
                var offsetType = $(this).parents("tr").find(".offsetType input").val();
                if(('预收租金' == offsetType || '预收水费' == offsetType || '预收电费' == offsetType || '预收服务费' == offsetType)) {
                    var canOffsetAmount = Number($(this).parents("tr").find(".canOffsetAmount input").val());
                    if(Number(canOffsetAmount) > Number(reOffsetAmountTotal)){
                        $(this).find("input").val(Number(reOffsetAmountTotal).toFixed(2));
                        realOffsetAmountTotal = accAdd(realOffsetAmountTotal,Number(reOffsetAmountTotal))
                        reOffsetAmountTotal = Number(0).toFixed(2);
                    } else if(Number(reOffsetAmountTotal) == 0){
                        $(this).find("input").val(Number(reOffsetAmountTotal).toFixed(2));
                    } else {
                        $(this).find("input").val(Number(canOffsetAmount).toFixed(2));
                        reOffsetAmountTotal = accSub(reOffsetAmountTotal,canOffsetAmount);

                        realOffsetAmountTotal = accAdd(realOffsetAmountTotal,Number(canOffsetAmount))
                    }
                } else {
                    realOffsetAmountTotal = accAdd(realOffsetAmountTotal,Number($(this).find("input").val()))
                }
            })
            $(".realOffsetAmountTotal").find("input").val(Number(realOffsetAmountTotal).toFixed(2));
        })

        $(".newDeAmount").on("input",function(){
            var laterAmountTotal = Number(0).toFixed(2);
            var laterAmount = Number(0).toFixed(2);
            var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
            var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
            var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
            var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
            var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
            var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
            var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
            //laterAmount = receAmount - subAmount - deAmount - newDeAmount - reOffsetAmount - keepOffsetAmount;
            laterAmount = accSub(receAmount,subAmount );
            laterAmount = accSub(laterAmount,deAmount );
            laterAmount = accSub(laterAmount,newDeAmount );
            laterAmount = accSub(laterAmount,reOffsetAmount );
            laterAmount = accSub(laterAmount,keepOffsetAmount );
            laterAmount = accSub(laterAmount,subOffsetAmount );
            if(laterAmount < 0 || newDeAmount < 0 ){
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".newDeAmount input").val('');
                return ;
            }
            var myDate = new Date();//获取系统当前时间
            var receDate = $(this).parents("tr").find(".receDate input").val();
            if(compareDate(myDate,receDate)){
                //设置应收明细欠款
                $(this).parents("tr").find(".laterAmount input").val(Number(laterAmount).toFixed(2));
                $(".laterAmount").each(function(){
                    laterAmountTotal = accAdd(laterAmountTotal, Number($(this).find("input").val()));
                })
                $(".laterAmountTotal").find("input").val(Number(laterAmountTotal).toFixed(2));
            }


            //设置本次收款核销金额
            var newDeAmountTotal = Number(0).toFixed(2);
            $(".newDeAmount").each(function(){
                newDeAmountTotal =accAdd(newDeAmountTotal, Number($(this).find("input").val()));
            })

            //设置收预收金额
            var verAdvanceAmountTotal = Number(0).toFixed(2);
            $(".verAdvanceAmount").each(function () {
                verAdvanceAmountTotal =accAdd(verAdvanceAmountTotal, Number($(this).find("input").val()));
            })
            var usedAmount = accAdd(newDeAmountTotal,verAdvanceAmountTotal);
            //判断收款金额是否需要转入预收
            var receAmount = Number($("#receiveMoney").val());
            var advanceAmountTotal = Number(0).toFixed(2);
            if (receAmount >= usedAmount) {
                $(".reTotalTr").find(".advanceAmount input").val(accSub(Number(receAmount).toFixed(2),Number(usedAmount).toFixed(2)));
                $(".advanceAmount").each(function () {
                    advanceAmountTotal =accAdd(advanceAmountTotal, Number($(this).find("input").val()));
                })
                $(".advanceAmountTotal").find("input").val(Number(advanceAmountTotal).toFixed(2));
            } else {
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".newDeAmount input").val('');
                return ;
            }
            $(".newDeAmountTotal").find("input").val(Number(newDeAmountTotal).toFixed(2));

        })

        $(".zl-glyphicon-red").on("click", function (){
            $(this).parents("tr").remove();
        })
    }

    $(".zl-glyphicon-blue").on("click", function (){
        // 将添加新的tr
        var inds = Number($(".indsAdvance").val());
        var advanceContNo = $("#advanceContNo").val();
        var advanceTr = "<tr class='trData'>"
            + "<td class='text-right zl-edit'>"
            + "<div class='btn-group  zl-dropdown-inline' data-id='fee'>"
            + "<input type='hidden' name='finExpenseVerificationAdvanceList[" + inds + "].feeType' class='feeType' value='2001'/>"
            + "<button type='button' class='btn btn-default dropdown-toggle zl-dropdown-btn' data-toggle='dropdown' aria-expanded='true'>预收租金</button>"
            + "<ul class='dropdown-menu'>"
            + "<li><a href='javascript:void(0)' key='2001' onclick='searchIsCollection(this);'>预收租金</a></li>"
            + "<li><a href='javascript:void(0)' key='2002' onclick='searchIsCollection(this);'>预收水费</a></li>"
            + "<li><a href='javascript:void(0)' key='2003' onclick='searchIsCollection(this);'>预收电费</a></li>"
            + "<li><a href='javascript:void(0)' key='2004' onclick='searchIsCollection(this);'>预收服务费</a></li>"
            + "</ul>"
            + "</div>"
            + "</td>"
            + "<td class='zl-edit contNo'>"
            + "<input type='text' name='finExpenseVerificationAdvanceList[" + inds + "].contNo' value='" + advanceContNo + "' >"
            + "</td>"
            + "<td class='text-right zl-edit verAdvanceAmount'>"
            + "<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationAdvanceList[" + inds + "].verAdvanceAmount' class='text-right' value='" + Number(0).toFixed(2) + "' >"
            + "</td>"
            + "<td class='text-right zl-edit'>"
            + "<input type='text' name='finExpenseVerificationAdvanceList[" + inds + "].advanceAmount' class='text-right' value='" + Number(0).toFixed(2) + "' readonly>"
            + "</td>"
            + "<td class='text-right'>"
            + "<span><em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em></span>"
            + "</td>"
            + "</tr>";
        $('.table-advance').children('tbody').find('tr:last').after(advanceTr);
        $(".indsAdvance").val(inds + 1);

        expenseVerificationDetailView.init();
    })

    function insertKeepOffsetAmounts(realOffsetAmount,receContNo){
        $(".keepOffsetAmount").each(function(){
            if(receContNo == ($(this).parents("tr").find(".receContNo input").val())){
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
                var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
                var laterAmountOld = Number($(this).parents("tr").find(".laterAmount input").val());
                //var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                //var keepAmount = Number($(this).parents("tr").find(".keepAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - newDeAmount - reOffsetAmount ;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,newDeAmount );
                laterAmount = accSub(laterAmount,reOffsetAmount );
                laterAmount = accSub(laterAmount,subOffsetAmount );
                /*if(laterAmount > keepAmount){
                    laterAmount = keepAmount;
                }*/
                if(Number(realOffsetAmount) > Number(laterAmount)){
                    $(this).find("input").val(Number(laterAmount).toFixed(2));
                    $(this).parents("tr").find(".laterAmount input").val(0);
                    realOffsetAmount = accSub(Number(realOffsetAmount),Number(laterAmount));
                } else {
                    $(this).find("input").val(Number(realOffsetAmount).toFixed(2));
                    var myDate = new Date();//获取系统当前时间
                    var receDate = $(this).parents("tr").find(".receDate input").val();
                    if(compareDate(myDate,receDate)){
                        //设置应收明细欠款
                        $(this).parents("tr").find(".laterAmount input").val(accSub(Number(laterAmount).toFixed(2),Number(realOffsetAmount).toFixed(2)));
                        var laterAmountTotal = Number(0).toFixed(2);
                        $(".laterAmount").each(function(){
                            laterAmountTotal =accAdd(laterAmountTotal, Number($(this).find("input").val()));
                        })
                        $(".laterAmountTotal").find("input").val(Number(laterAmountTotal).toFixed(2));
                    }
                    realOffsetAmount = Number(0).toFixed(2);
                }
            }
        })
        var keepOffsetAmountTotal = Number(0).toFixed(2);
        $(".keepOffsetAmount").each(function(){
            keepOffsetAmountTotal =accAdd(keepOffsetAmountTotal, Number($(this).find("input").val()));
        })
        $(".keepOffsetAmountTotal").find("input").val(Number(keepOffsetAmountTotal).toFixed(2));
    };

    function insertReOffsetAmounts(realOffsetAmount, receContNo){
        $(".reOffsetAmount").each(function() {
            if(receContNo == ($(this).parents("tr").find(".receContNo input").val())){
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
                // var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
                var laterAmountOld = Number($(this).parents("tr").find(".laterAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - newDeAmount - keepOffsetAmount;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,newDeAmount );
                laterAmount = accSub(laterAmount,keepOffsetAmount );
                laterAmount = accSub(laterAmount,subOffsetAmount );
                if (Number(realOffsetAmount) > Number(laterAmount)) {
                    $(this).find("input").val(Number(laterAmount).toFixed(2));
                    $(this).parents("tr").find(".laterAmount input").val(0);
                    realOffsetAmount = accSub(Number(realOffsetAmount), Number(laterAmount));
                } else {
                    $(this).find("input").val(Number(realOffsetAmount).toFixed(2));
                    var myDate = new Date();//获取系统当前时间
                    var receDate = $(this).parents("tr").find(".receDate input").val();
                    if (compareDate(myDate, receDate)) {
                        //设置应收明细欠款
                        $(this).parents("tr").find(".laterAmount input").val(accSub(Number(laterAmount).toFixed(2), Number(realOffsetAmount).toFixed(2)));
                        var laterAmountTotal = Number(0).toFixed(2);
                        $(".laterAmount").each(function () {
                            laterAmountTotal =accAdd(laterAmountTotal, Number($(this).find("input").val()));
                        })
                        $(".laterAmountTotal").find("input").val(Number(laterAmountTotal).toFixed(2));
                    }
                    realOffsetAmount = Number(0).toFixed(2);
                }
            }
        })
        var reOffsetAmountTotal = Number(0).toFixed(2);
        $(".reOffsetAmount").each(function(){
            reOffsetAmountTotal =accAdd(reOffsetAmountTotal, Number($(this).find("input").val()));
        })
        $(".reOffsetAmountTotal").find("input").val(Number(reOffsetAmountTotal).toFixed(2));
    };

    function insertSubOffsetAmounts(realOffsetAmount, receContNo){
        $(".subOffsetAmount").each(function() {
            if(receContNo == ($(this).parents("tr").find(".receContNo input").val())){
                debugger;
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
                var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                var laterAmountOld = Number($(this).parents("tr").find(".laterAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - newDeAmount - keepOffsetAmount;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,newDeAmount );
                laterAmount = accSub(laterAmount,reOffsetAmount );
                laterAmount = accSub(laterAmount,keepOffsetAmount );
                if (Number(realOffsetAmount) > Number(laterAmount)) {
                    $(this).find("input").val(Number(laterAmount).toFixed(2));
                    $(this).parents("tr").find(".laterAmount input").val(0);
                    realOffsetAmount = accSub(Number(realOffsetAmount), Number(laterAmount));
                } else {
                    $(this).find("input").val(Number(realOffsetAmount).toFixed(2));
                    var myDate = new Date();//获取系统当前时间
                    var receDate = $(this).parents("tr").find(".receDate input").val();
                    if (compareDate(myDate, receDate)) {
                        //设置应收明细欠款
                        $(this).parents("tr").find(".laterAmount input").val(accSub(Number(laterAmount).toFixed(2), Number(realOffsetAmount).toFixed(2)));
                        var laterAmountTotal = Number(0).toFixed(2);
                        $(".laterAmount").each(function () {
                            laterAmountTotal =accAdd(laterAmountTotal, Number($(this).find("input").val()));
                        })
                        $(".laterAmountTotal").find("input").val(Number(laterAmountTotal).toFixed(2));
                    }
                    realOffsetAmount = Number(0).toFixed(2);
                }
            }
        })
        var subOffsetAmountTotal = Number(0).toFixed(2);
        $(".subOffsetAmount").each(function(){
            subOffsetAmountTotal =accAdd(subOffsetAmountTotal, Number($(this).find("input").val()));
        })
        console.log('--------subOffsetAmountTotal---' + subOffsetAmountTotal);
        $(".subOffsetAmountTotal").find("input").val(Number(subOffsetAmountTotal).toFixed(2));
    };

    function findKeepOffsetAmounts(total,receContNo){
        $(".keepOffsetAmount").each(function(){
            if(receContNo == ($(this).parents("tr").find(".receContNo input").val())){
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
                var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
                //var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                //var keepAmount = Number($(this).parents("tr").find(".keepAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - newDeAmount - reOffsetAmount  ;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,newDeAmount );
                laterAmount = accSub(laterAmount,reOffsetAmount );
                laterAmount = accSub(laterAmount,subOffsetAmount );
                /*if(laterAmount > keepAmount){
                    laterAmount = keepAmount;
                }*/
                total = accAdd(total , laterAmount);
            }
        })
        return total;
    };

    function findReOffsetAmounts(total,receContNo){
        $(".reOffsetAmount").each(function(){
            if(receContNo == ($(this).parents("tr").find(".receContNo input").val())){
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
                //var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
                //var keepAmount = Number($(this).parents("tr").find(".keepAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - newDeAmount - keepOffsetAmount  ;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,newDeAmount );
                laterAmount = accSub(laterAmount,keepOffsetAmount );
                laterAmount = accSub(laterAmount,subOffsetAmount );
                /*if(laterAmount > keepAmount){
                    laterAmount = keepAmount;
                }*/
                total = accAdd(total , laterAmount);
            }
        })
        return total;
    };

    function findSubOffsetAmounts(total,taxRate){
        $(".subOffsetAmount").each(function(){
            if(taxRate == (Number($(this).parents("tr").find(".taxRate input").val()).toFixed(2))){
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
                var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                //var keepAmount = Number($(this).parents("tr").find(".keepAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - newDeAmount - keepOffsetAmount  ;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,newDeAmount );
                laterAmount = accSub(laterAmount,reOffsetAmount );
                laterAmount = accSub(laterAmount,keepOffsetAmount );
                /*if(laterAmount > keepAmount){
                    laterAmount = keepAmount;
                }*/
                total = accAdd(total , laterAmount);
            }
        })
        return total;
    };

    expenseVerificationDetailView.init = function(){
        $("#preloader").fadeOut("fast");

        bindPageEvents();
    };

    expenseVerificationDetailView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    expenseVerificationDetailView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    return expenseVerificationDetailView;
})(jQuery);

var selectModalView = (function ($) {
    var flag = false;
    var selectModalView = {};
    var _selectedAccounts = {}

    var _selectAccountList = {}

    /*var page = $("#expense-verification-add");
    // 载入模板内容
    page._renderList = function (list, id) {
        var _tmp = $("#" + id).html();
        var template = Handlebars.compile(_tmp);
        var context = {dataList: list}
        return template(context)
    }*/

    selectModalView.eventInit = function () {
        $("#add-rece").on("click", function (e) {
            if(flag){
                return;
            }
            var id = $('#companyId').val();
            var name = $('#companyName').val();
            var receiveAccount = $('#receiveAccount').val();
            var mallId = $('#mallId').val();
            var isSelect = 'select';
            flag = true;
            $.getJSON(financeWeb_Path + 'finance/expenseVerification/recelist.htm',
                {saveCompanyId: id,saveCompanyName: name,isSelect: isSelect,mallId: mallId,receiveAccount: receiveAccount}, function (res) {
                    var data = res.finExpenseVerificationReceEntityList;
                    selectAccountList.update({accountPeriodList: data}, "multi");

                    selectAccountList.modalShow(
                        function (selectedAccounts) {
                            //console.log('--------selectedAccounts');
                            //console.log(selectedAccounts);
                            _selectedAccounts = selectedAccounts;
                            // 将删除的tr移除
                            $("#zl-section-collapse-table-5").find("tr").each(function () {
                                var data_id = $(this).attr("data-fincontid");
                                if (data_id != undefined && selectedAccounts[data_id] == undefined) {
                                    $(this).remove();
                                }
                            });
                            // 将添加新的tr
                            var inds = Number($(".inds").val());
                            for (var key in _selectedAccounts) {
                                //console.log(key);
                                var tr = $("#zl-section-collapse-table-5").find("tr[data-fincontid=" + key + "]");
                                if (tr.length == 0) {
                                    var map = {
                                        key: _selectedAccounts[key]
                                    };
                                    /*var html = page._renderList(map, "template-select-Clause");
                                    $("#zl-section-collapse-table-4").find(".zl-table tbody").append(html);*/
                                    var isCollection = _selectedAccounts[key].isCollection;
                                    var isCollectionDesc;
                                    if('0' == isCollection){
                                        isCollectionDesc = '否';
                                    }else {
                                        isCollectionDesc = '是';
                                    }
                                    //console.log('---isCollection---' + isCollection);
                                    var receAmount = Number(_selectedAccounts[key].receAmount).toFixed(2);
                                    var subAmount = Number(_selectedAccounts[key].subAmount).toFixed(2);
                                    var deAmount = Number(_selectedAccounts[key].deAmount).toFixed(2);
                                    var laterAmount = Number(_selectedAccounts[key].laterAmount).toFixed(2);
                                    var reOffsetAmount = Number(_selectedAccounts[key].reOffsetAmount).toFixed(2);
                                    var keepOffsetAmount = Number(_selectedAccounts[key].keepOffsetAmount).toFixed(2);
                                    var newDeAmount = Number(0).toFixed(2);
                                    var subOffsetAmount = Number(0).toFixed(2);
                                    var taxRate = Number(_selectedAccounts[key].taxRate).toFixed(2);
                                    var receContNo = _selectedAccounts[key].receContNo;
                                    var note = _selectedAccounts[key].note;
                                    var receLeftTr = "<tr class='trData' data-fincontid='" + _selectedAccounts[key].id + "'>"
                                        +"<input type='hidden' name='finExpenseVerificationReceEntityList[" + inds + "].storeNos'   value='" + _selectedAccounts[key].storeNos + "' readonly>"
                                        + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + inds + "].companyId'   value='" + _selectedAccounts[key].companyId + "' readonly>"
                                        + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + inds + "].companyName'   value='" + _selectedAccounts[key].companyName + "' readonly>"
                                        + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + inds + "].receId'   value='" + _selectedAccounts[key].receId + "' readonly>"
                                        /*+ "<td>"
                                        + "<em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em>"
                                        + "</td>"*/
                                        + "<td class='zl-edit' title='" + _selectedAccounts[key].feeType + "'>"
                                        + "<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].feeType'   value='" + _selectedAccounts[key].feeType + "' readonly>"
                                        + "</td>"
                                        + "<td class='zl-edit' title='" + _selectedAccounts[key].payDate + "'>"
                                        + "<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].payDate'   value='" + _selectedAccounts[key].payDate + "' readonly>"
                                        + "</td>"
                                        + "<td class='zl-edit' title='" + _selectedAccounts[key].businessPeriod + "'>"
                                        + "<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].businessPeriod'   value='" + _selectedAccounts[key].businessPeriod + "' readonly>"
                                        + "</td>"
                                        +"<td class='text-right zl-edit receContNo' title='" + receContNo + "'>"
                                        +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].receContNo'  value='" + receContNo + "' readonly>"
                                        +"</td>"
                                        + "<td class='text-right zl-edit'>"
                                        + "<div class='btn-group  zl-dropdown-inline' data-id='fee'>"
                                        + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + inds + "].isCollection' id='isCollection' value='" + isCollection + "'/>"
                                        + "<button type='button' class='btn btn-default dropdown-toggle zl-dropdown-btn' data-toggle='dropdown' aria-expanded='true'>" + isCollectionDesc + "</button>"
                                        + "<ul class='dropdown-menu'>"
                                        + "<li><a href='javascript:void(0)' key='0' onclick='searchIsCollection(this);'>否</a></li>"
                                        + "<li><a href='javascript:void(0)' key='1' onclick='searchIsCollection(this);'>是</a></li>"
                                        + "</ul>"
                                        + "</div>"
                                        + "</td>"
                                        + "</tr>";

                                    $('.table-rece-left').children('tbody').find('tr:last').before(receLeftTr);

                                    var receRightTr = "<tr class='trData' data-fincontid='" + _selectedAccounts[key].id + "'>"
                                        +"<td class='text-right zl-edit receDate' title='" + fmtDate(Number(_selectedAccounts[key].receDate)) + "'>"
                                        +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].receDate'   value='" + fmtDate(Number(_selectedAccounts[key].receDate)) + "' readonly>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit receAmount' title='" + receAmount + "'>"
                                        +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].receAmount' class='text-right' value='" + receAmount + "' readonly>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit deAmount' title='" + deAmount + "'>"
                                        +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].deAmount' class='text-right' value='" + deAmount + "' readonly>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit laterAmount' title='" + laterAmount + "'>"
                                        +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].laterAmount' class='text-right' value='" + laterAmount + "' readonly>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit newDeAmount'>"
                                        +"<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationReceEntityList[" + inds + "].newDeAmount' class='text-right' value='" + newDeAmount + "' >"
                                        +"</td>"
                                        +"<td class='text-right zl-edit reOffsetAmount'>"
                                        +"<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationReceEntityList[" + inds + "].reOffsetAmount' class='text-right' value='" + reOffsetAmount + "'>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit keepOffsetAmount'>"
                                        +"<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationReceEntityList[" + inds + "].keepOffsetAmount' class='text-right' value='" + keepOffsetAmount + "'>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit subOffsetAmount'>"
                                        +"<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationReceEntityList[" + inds + "].subOffsetAmount' class='text-right' value='" + subOffsetAmount + "'>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit subAmount' title='" + subAmount + "'>"
                                        +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].subAmount' class='text-right' value='" + subAmount + "' readonly>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit taxRate'>"
                                        +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].taxRate' class='text-right' value='" + taxRate + "' readonly>"
                                        +"</td>"

                                        + "<td class='zl-edit' title='" + _selectedAccounts[key].receNo + "'>"
                                        + "<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].receNo'   value='" + _selectedAccounts[key].receNo + "' readonly>"
                                        + "</td>"
                                        +"<td class='text-right zl-edit receContNo' title='" + receContNo + "' hidden>"
                                        +"<input type='text' class='text-right' value='" + receContNo + "' readonly>"
                                        +"</td>"
                                        +"<td class='text-right zl-edit' >"
                                        +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].note' id='note' maxlength='255' class='text-right' value=''>"
                                        +"</td>"
                                        +"</tr>";
                                    $('.table-rece-right').children('tbody').find('tr:last').before(receRightTr);
                                }
                                inds = inds + 1;
                            }
                            $(".inds").val(inds);
                            var receAmountTotal = Number(0).toFixed(2);
                            $(".receAmount").each(function () {
                                receAmountTotal = accAdd(receAmountTotal,Number($(this).find("input").val()));
                            })
                            var subAmountTotal = Number(0).toFixed(2);
                            $(".subAmount").each(function () {
                                subAmountTotal = accAdd(subAmountTotal,Number($(this).find("input").val()));
                            })
                            var deAmountTotal = Number(0).toFixed(2);
                            $(".deAmount").each(function () {
                                deAmountTotal = accAdd(deAmountTotal,Number($(this).find("input").val()));
                            })
                            var laterAmountTotal = Number(0).toFixed(2);
                            $(".laterAmount").each(function () {
                                laterAmountTotal = accAdd(laterAmountTotal,Number($(this).find("input").val()));
                            })
                            $(".receAmountTotal").find('input').val(Number(receAmountTotal).toFixed(2)) ;
                            $(".subAmountTotal").find('input').val(Number(subAmountTotal).toFixed(2)) ;
                            $(".deAmountTotal").find('input').val(Number(deAmountTotal).toFixed(2)) ;
                            $(".laterAmountTotal").find('input').val(Number(laterAmountTotal).toFixed(2));
                            expenseVerificationDetailView.init();
                        }, _selectedAccounts)
                    flag = false;
            });
        });
    }

    selectModalView.init = function (contNo) {

        //var id = 50;
        //var name = '0825测试商家5';
        /*$.getJSON(financeWeb_Path + 'finance/expenseVerification/recelist.htm', {saveCompanyId: id,saveCompanyName: name}, function (res) {
            var data = res.finExpenseVerificationReceEntityList;
            console.log('init------------');
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                _selectedAccounts[data[i]["id"]] = data[i];
            }
            // 将添加新的tr
            for (var key in _selectedAccounts) {
                var tr = $("#zl-section-collapse-table-4").find("tr[data-fincontid=" + key + "]");
                if (tr.length == 0) {
                    var map = {
                        key: _selectedAccounts[key]
                    };
                    var html = page._renderList(map, "template-select-Clause");
                    $("#zl-section-collapse-table-4").find(".zl-table tbody").append(html);
                }
            }
        });*/
        /*var id = $('#companyId').val();
        var name = $('#companyName').val();
        var receiveAccount = $('#receiveAccount').val();
        var mallId = $('#mallId').val();
        var isSelect = 'select';
        $.getJSON(financeWeb_Path + 'finance/expenseVerification/recelist.htm',
            {saveCompanyId: id,saveCompanyName: name,isSelect: isSelect,mallId: mallId,receiveAccount: receiveAccount}, function (res) {
            var data = res.finExpenseVerificationReceEntityList;
            //console.log('all-----------');
            //console.log(data);
            selectAccountList.update({accountPeriodList: data}, "multi");
        });*/
        selectModalView.eventInit();
    };

    return selectModalView;
})(jQuery);

$(document).ready(function(){
    expenseVerificationDetailView.init();
    selectModalView.init();
    selectAccountList.init({accountPeriodList: [{}]}, "multi");
    confirmAlert.init();
});

function checkVerification(param,expenseVerificationNo){
    if(param == 0){
        $("#js-commit").show();
        $("#js-save").show();
    }
    if(param == 1){
        if(expenseVerificationNo.indexOf("R") == -1){
            $("#print-btn").show();
            $("#js-reset").show();
        } else {
            $(".invoice-btn").hide();
        }
        $(".realOffsetAmount input").attr("readonly","readonly");
        $(".realSubAmount input").attr("readonly","readonly");
        $(".subOffsetAmount input").attr("readonly","readonly");
        $(".keepOffsetAmount input").attr("readonly","readonly");
        $(".reOffsetAmount input").attr("readonly","readonly");
        $(".newDeAmount input").attr("readonly","readonly");
        $(".note input").attr("readonly","readonly");
        $(".verAdvanceAmount input").attr("readonly","readonly");
        $(".contNo input").attr("readonly","readonly");
        $("#add-rece").hide();
        $(".zl-glyphicon-blue").hide();
        $('.dropdown-menu').children('li').remove();
    }
    if(param == 2){
        $("#js-refuse").show();
        $("#js-success").show();
        $(".realOffsetAmount input").attr("readonly","readonly");
        $(".realSubAmount input").attr("readonly","readonly");
        $(".subOffsetAmount input").attr("readonly","readonly");
        $(".keepOffsetAmount input").attr("readonly","readonly");
        $(".reOffsetAmount input").attr("readonly","readonly");
        $(".newDeAmount input").attr("readonly","readonly");
        $(".note input").attr("readonly","readonly");
        $(".verAdvanceAmount input").attr("readonly","readonly");
        $(".contNo input").attr("readonly","readonly");
        $("#add-rece").hide();
        $(".zl-glyphicon-blue").hide();
        $('.dropdown-menu').children('li').remove();
    }
    if(param == 3){
        $(".realOffsetAmount input").attr("readonly","readonly");
        $(".realSubAmount input").attr("readonly","readonly");
        $(".subOffsetAmount input").attr("readonly","readonly");
        $(".keepOffsetAmount input").attr("readonly","readonly");
        $(".reOffsetAmount input").attr("readonly","readonly");
        $(".newDeAmount input").attr("readonly","readonly");
        $(".note input").attr("readonly","readonly");
        $(".verAdvanceAmount input").attr("readonly","readonly");
        $(".contNo input").attr("readonly","readonly");
        $("#add-rece").hide();
        $(".zl-glyphicon-blue").hide();
        $('.dropdown-menu').children('li').remove();
    }

}

function getIndexUrl(){
    var verificationStatus = $("#list_verificationStatus").val();
    var mallId = $("#list_mallId").val();
    var invoiceNos= $("#list_invoiceNos").val();
    var searchWord = $("#list_searchWordNoEncode").val();
    var receContNo = $("#list_receContNo").val();
    var verificationTimeStart= $("#list_verificationTimeStart").val();
    var verificationTimeEnd = $("#list_verificationTimeEnd").val();
    var searchWordNoEncode = '';
    if('' != searchWord){
        var searchWordNoEncode= encodeURI(searchWord);
    }
    var indexUrl = "finance/expenseVerification/index.htm?mallId=" + mallId+"&verificationStatus="+verificationStatus+"&invoiceNos="+invoiceNos
        +"&receContNo="+receContNo+"&verificationTimeStart="+verificationTimeStart+"&verificationTimeEnd="+verificationTimeEnd+"&searchWordNoEncode="+searchWordNoEncode;
    return indexUrl;
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1减去arg2的精确结果
 **/
function accSub(arg1, arg2) {
    /*var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);*/
    return (Number(arg1) - Number(arg2)).toFixed(2);
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果

function accAdd(arg1,arg2)
{
    /*var r1,r2,m;
    try
    {
        r1=arg1.toString().split(".")[1].length
    }
    catch(e)
    {
        r1=0
    }
    try
    {
        r2=arg2.toString().split(".")[1].length
    }
    catch(e)
    {
        r2=0
    }
    m=Math.pow(10,Math.max(r1,r2))
    return (arg1*m+arg2*m)/m;*/
    return (Number(arg1)+Number(arg2)).toFixed(2);
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
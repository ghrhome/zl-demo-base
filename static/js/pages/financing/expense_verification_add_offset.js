var expenseVerificationAddOffsetView = (function($){
    var expenseVerificationAddOffsetView = {};
    var _renterData=[];
    var flag = false;
    expenseVerificationAddOffsetView.search=function () {
        $("#js-dropdown-companys").ysSearchSelect({
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
                $("#companyId").val(ui.item.value);
                $('#companyName').val(ui.item.label);
                //expenseVerificationAddOffsetView.searchUpdate();
                _searchCb(ui.item.value,ui.item.label);
            },
        });
    }

    function _searchCb(companyId,companyName){
        $('#companyId').val(companyId);
        $('#companyName').val(companyName);
        $.getJSON(financeWeb_Path + 'finance/expenseVerification/recelist.htm', {saveCompanyId: companyId,saveCompanyName: companyName}, function (res) {
            if (res.length === 0) {
                alert('此租户下没有应收，该笔收款将转入租户预收款');
                return;
            }
            var offsetList = res.finExpenseVerificationOffsetEntityList;
            var receList = res.finExpenseVerificationReceEntityList;
            var receSubList = res.finExpenseVerificationReceSubList;
            // console.log("................")
            // console.log(receList)

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


            $('.table-offset-sub').children('tbody').find('.trData').remove();
            var canSubAmountTotal = Number(0).toFixed(2);
            for (var i = 0; i < receSubList.length; i++) {
                var receId = receSubList[i].receId;
                var feeType = receSubList[i].feeType
                var businessPeriod = receSubList[i].businessPeriod;
                var receContNo = receSubList[i].receContNo;
                var receNo = receSubList[i].receNo;
                var taxRate = Number(receSubList[i].taxRate).toFixed(2);
                var canSubAmount = Number(receSubList[i].receAmount).toFixed(2);
                var realSubAmount = Number(receSubList[i].subOffsetAmount).toFixed(2);
                if(null == receContNo){
                    receContNo = '';
                }
                canSubAmountTotal = accAdd(canSubAmountTotal , canSubAmount);

                var subTr = "<tr class='trData'>"
                    +"<input type='hidden' name='finExpenseVerificationReceSubList[" + i + "].receId'   value='" + receId + "'>"
                    +"<td class='zl-edit'>"
                    +"<input type='text' name='finExpenseVerificationReceSubList[" + i + "].feeType'  value='" + feeType + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit businessPeriod' >"
                    +"<input type='text' name='finExpenseVerificationReceSubList[" + i + "].businessPeriod'  value='" + businessPeriod + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit receContNo' >"
                    +"<input type='text' name='finExpenseVerificationReceSubList[" + i + "].receContNo'  value='" + receContNo + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit' >"
                    +"<input type='text' name='finExpenseVerificationReceSubList[" + i + "].receNo'  value='" + receNo + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit taxRate' title='" + taxRate + "'>"
                    +"<input type='text' name='finExpenseVerificationReceSubList[" + i + "].taxRate' class='text-right' value='" + taxRate + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit canSubAmount' title='" + canSubAmount + "'>"
                    +"<input type='text' name='finExpenseVerificationReceSubList[" + i + "].receAmount' class='text-right' value='" + canSubAmount + "' readonly>"
                    +"</td>"
                    +"<td class='zl-edit realSubAmount' title='" + realSubAmount + "'>"
                    +"<input type='number' name='finExpenseVerificationReceSubList[" + i + "].subOffsetAmount' min='0' onkeyup='clearNoNum(this)' class='text-right' value='" + realSubAmount + "' >"
                    +"</td>"
                    +"</tr>";
                $('.table-offset-sub').children('tbody').find('tr:last').before(subTr);
            }
            $(".canSubAmountTotal").find('input').val(Number(canSubAmountTotal).toFixed(2)) ;
            $(".realSubAmountTotal").find('input').val(Number(0).toFixed(2)) ;


            $('.table-rece-left').children('tbody').find('.trData').remove();
            $('.table-rece-right').children('tbody').find('.trData').remove();
            var receAmountTotal = Number(0).toFixed(2);
            var subAmountTotal = Number(0).toFixed(2);
            var deAmountTotal = Number(0).toFixed(2);
            var laterAmountTotal = Number(0).toFixed(2);
            for (var i = 0; i < receList.length; i++) {
                var receAmount = Number(receList[i].receAmount).toFixed(2);
                var subAmount = Number(receList[i].subAmount).toFixed(2);
                var deAmount = Number(receList[i].deAmount).toFixed(2);
                var laterAmount = Number(receList[i].laterAmount).toFixed(2);
                var reOffsetAmount = Number(receList[i].reOffsetAmount).toFixed(2);
                var keepOffsetAmount = Number(receList[i].keepOffsetAmount).toFixed(2);
                var subOffsetAmount = Number(0).toFixed(2);
                var taxRate = Number(receList[i].taxRate).toFixed(2);
                var receContNo = receList[i].receContNo;
                var note = receList[i].note;
                var payDate = receList[i].payDate;
                if(null == payDate){
                    payDate = '';
                }
                var businessPeriod = receList[i].businessPeriod;
                if(null == businessPeriod){
                    businessPeriod = '';
                }
                receAmountTotal = accAdd(receAmountTotal , receAmount);
                subAmountTotal = accAdd(subAmountTotal , subAmount);
                deAmountTotal = accAdd(deAmountTotal , deAmount);
                laterAmountTotal = accAdd(laterAmountTotal , laterAmount);
                var receLeftTr = "<tr class='trData'>"
                    +"<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].storeNos'   value='" + receList[i].storeNos + "' readonly>"
                    + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].companyId'   value='" + receList[i].companyId + "' readonly>"
                    + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].companyName'   value='" + receList[i].companyName + "' readonly>"
                    + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].receId'   value='" + receList[i].receId + "' readonly>"
                    /*+ "<td>"
                    + "<em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em>"
                    + "</td>"*/
                    + "<td class='zl-edit' title='" + receList[i].feeType + "'>"
                    + "<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].feeType'   value='" + receList[i].feeType + "' readonly>"
                    + "</td>"
                    + "<td class='zl-edit' title='" + receList[i].payDate + "'>"
                    + "<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].payDate'   value='" + payDate + "' readonly>"
                    + "</td>"
                    + "<td class='zl-edit' title='" + receList[i].businessPeriod + "'>"
                    + "<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].businessPeriod'   value='" + businessPeriod + "' readonly>"
                    + "</td>"
                    +"<td class='text-right zl-edit receContNo' title='" + receContNo + "'>"
                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].receContNo' class='text-right' value='" + receContNo + "' readonly>"
                    +"</td>"
                    + "<td class='text-right zl-edit'>"
                    + "<div class='btn-group  zl-dropdown-inline' data-id='fee'>"
                    + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].isCollection' id='isCollection' value='0'/>"
                    + "<button type='button' class='btn btn-default dropdown-toggle zl-dropdown-btn' data-toggle='dropdown' aria-expanded='true'>否</button>"
                    + "<ul class='dropdown-menu'>"
                    + "<li><a href='javascript:void(0)' key='0' onclick='searchIsCollection(this);'>否</a></li>"
                    + "<li><a href='javascript:void(0)' key='1' onclick='searchIsCollection(this);'>是</a></li>"
                    + "</ul>"
                    + "</div>"
                    + "</td>"
                    + "</tr>";

                $('.table-rece-left').children('tbody').find('tr:last').before(receLeftTr);

                var receRightTr = "<tr class='trData'>"
                    +"<td class='text-right zl-edit receDate' title='" + fmtDate(receList[i].receDate) + "'>"
                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].receDate'   value='" + fmtDate(receList[i].receDate) + "' readonly>"
                    +"</td>"
                    +"<td class='text-right zl-edit receAmount' title='" + receAmount + "'>"
                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].receAmount' class='text-right' value='" + receAmount + "' readonly>"
                    +"</td>"
                    +"<td class='text-right zl-edit deAmount' title='" + deAmount + "'>"
                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].deAmount' class='text-right' value='" + deAmount + "' readonly>"
                    +"</td>"
                    +"<td class='text-right zl-edit laterAmount' title='" + laterAmount + "'>"
                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].laterAmount' class='text-right' value='" + laterAmount + "' readonly>"
                    +"</td>"
                    +"<td class='text-right zl-edit reOffsetAmount'>"
                    +"<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationReceEntityList[" + i + "].reOffsetAmount' class='text-right' value='" + reOffsetAmount + "'>"
                    +"</td>"
                    +"<td class='text-right zl-edit keepOffsetAmount'>"
                    +"<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationReceEntityList[" + i + "].keepOffsetAmount' class='text-right' value='" + keepOffsetAmount + "'>"
                    +"</td>"
                    +"<td class='text-right zl-edit subOffsetAmount'>"
                    +"<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationReceEntityList[" + i + "].subOffsetAmount' class='text-right' value='" + subOffsetAmount + "'>"
                    +"</td>"
                    +"<td class='text-right zl-edit subAmount' title='" + subAmount + "'>"
                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].subAmount' class='text-right' value='" + subAmount + "' readonly>"
                    +"</td>"
                    +"<td class='text-right zl-edit taxRate'>"
                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].taxRate' class='text-right' value='" + taxRate + "' readonly>"
                    +"</td>"

                    + "<td class='zl-edit' title='" + receList[i].receNo + "'>"
                    + "<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].receNo'   value='" + receList[i].receNo + "' readonly>"
                    + "</td>"
                    +"<td class='text-right zl-edit receContNo' title='" + receContNo + "' hidden>"
                    +"<input type='text' class='text-right' value='" + receContNo + "' readonly>"
                    +"</td>"
                    +"<td class='text-right zl-edit' >"
                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].note' id='note' maxlength='255' class='text-right' value=''>"
                    +"</td>"
                    +"</tr>";
                $('.table-rece-right').children('tbody').find('tr:last').before(receRightTr);
            }
            $(".inds").val(receList.length);
            $(".receAmountTotal").find('input').val(Number(receAmountTotal).toFixed(2)) ;
            $(".subAmountTotal").find('input').val(Number(subAmountTotal).toFixed(2)) ;
            $(".deAmountTotal").find('input').val(Number(deAmountTotal).toFixed(2)) ;
            $(".laterAmountTotal").find('input').val(Number(laterAmountTotal).toFixed(2));
            $(".reOffsetAmountTotal").find('input').val(Number(0).toFixed(2));
            $(".keepOffsetAmountTotal").find('input').val(Number(0).toFixed(2));
            $(".subOffsetAmountTotal").find('input').val(Number(0).toFixed(2));

            bindPageEvents();
        });
    }

    expenseVerificationAddOffsetView.searchInit=function(){
        console.log(_renterData);
        $(".zl-dropdown-search-select").ysSearchSelect({

            source:_renterData,
            callback:function(value,ui){
                console.log("==========================")
                console.log(value);
                console.log(ui);
                console.log("==========================")
            },
        });
    }

    expenseVerificationAddOffsetView.searchUpdate=function(){
        console.log(_renterData)
        $(".zl-dropdown-search-select").ysSearchSelect("destroy");
        $(".zl-dropdown-search-select").ysSearchSelect({

            source:_renterData,
            callback:function(value,ui){

                var id = ui.item.value;
                var name = ui.item.label;
                $('#companyId').val(id);
                $('#companyName').val(name);
                $.getJSON(financeWeb_Path + 'finance/expenseVerification/recelist.htm', {saveCompanyId: id,saveCompanyName: name}, function (res) {
                    if (res.length === 0) {
                        alert('此租户下没有应收，该笔收款将转入租户预收款');
                        return;
                    }
                    var offsetList = res.finExpenseVerificationOffsetEntityList;
                    var receList = res.finExpenseVerificationReceEntityList;

                    // console.log("................")
                    // console.log(receList)

                    $('.table-offset').children('tbody').find('.trData').remove();
                    var canOffsetAmountTotal = Number(0).toFixed(2);
                    for (var i = 0; i < offsetList.length; i++) {
                        var canOffsetAmount = Number(offsetList[i].canOffsetAmount);
                        var realOffsetAmount = Number(offsetList[i].realOffsetAmount);
                        var advanceAmount = Number(offsetList[i].advanceAmount);
                        var offsetType = offsetList[i].offsetType;
                        var receContNo = offsetList[i].receContNo;
                        if(null == receContNo){
                            receContNo = '';
                        }
                        canOffsetAmountTotal = canOffsetAmountTotal + canOffsetAmount;

                        var offsetTr = "<tr class='keepTotalTr trData'>";
                        if ('预收款'=== offsetType){
                            receContNo = '';
                            offsetTr = "<tr class='reTotalTr trData'>";
                        }
                        offsetTr = offsetTr
                            +"<td class='zl-edit offsetType' title='" + offsetType + "'>"
                            +"<input type='text' name='finExpenseVerificationOffsetEntityList[" + i + "].offsetType' class='text-right' value='" + offsetType + "' readonly>"
                            +"</td>"
                            +"<td class='zl-edit receContNo' >"
                            +"<input type='text' name='finExpenseVerificationOffsetEntityList[" + i + "].receContNo' class='text-right' value='" + receContNo + "' readonly>"
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
                    $(".canOffsetAmountTotal").find('input').val(canOffsetAmountTotal) ;


                    $('.table-rece-left').children('tbody').find('.trData').remove();
                    $('.table-rece-right').children('tbody').find('.trData').remove();
                    var receAmountTotal = Number(0).toFixed(2);
                    var subAmountTotal = Number(0).toFixed(2);
                    var deAmountTotal = Number(0).toFixed(2);
                    var laterAmountTotal = Number(0).toFixed(2);
                    for (var i = 0; i < receList.length; i++) {
                        var receAmount = Number(receList[i].receAmount);
                        var subAmount = Number(receList[i].subAmount);
                        var deAmount = Number(receList[i].deAmount);
                        var laterAmount = Number(receList[i].laterAmount);
                        var reOffsetAmount = Number(receList[i].reOffsetAmount);
                        var keepOffsetAmount = Number(receList[i].keepOffsetAmount);
                        var receContNo = receList[i].receContNo;
                        var note = receList[i].note;
                        receAmountTotal = accAdd(receAmountTotal , receAmount);
                        subAmountTotal = accAdd(subAmountTotal , subAmount);
                        deAmountTotal = accAdd(deAmountTotal , deAmount);
                        laterAmountTotal = accAdd(laterAmountTotal , laterAmount);
                        var receLeftTr = "<tr class='trData'>"
                            +"<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].storeNos'   value='" + receList[i].storeNos + "' readonly>"
                            + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].companyId'   value='" + receList[i].companyId + "' readonly>"
                            + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].companyName'   value='" + receList[i].companyName + "' readonly>"
                            + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].taxRate'   value='" + receList[i].taxRate + "' readonly>"
                            + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].receId'   value='" + receList[i].receId + "' readonly>"
                            /*+ "<td>"
                            + "<em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em>"
                            + "</td>"*/
                            + "<td class='zl-edit' title='" + receList[i].feeType + "'>"
                            + "<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].feeType'   value='" + receList[i].feeType + "' readonly>"
                            + "</td>"
                            + "<td class='zl-edit' title='" + receList[i].payDate + "'>"
                            + "<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].payDate'   value='" + receList[i].payDate + "' readonly>"
                            + "</td>"
                            + "<td class='zl-edit' title='" + receList[i].businessPeriod + "'>"
                            + "<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].businessPeriod'   value='" + receList[i].businessPeriod + "' readonly>"
                            + "</td>"
                            + "<td class='zl-edit' title='" + receList[i].receNo + "'>"
                            + "<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].receNo'   value='" + receList[i].receNo + "' readonly>"
                            + "</td>"
                            + "<td class='text-right zl-edit'>"
                            + "<div class='btn-group  zl-dropdown-inline' data-id='fee'>"
                            + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + i + "].isCollection' id='isCollection' value='0'/>"
                            + "<button type='button' class='btn btn-default dropdown-toggle zl-dropdown-btn' data-toggle='dropdown' aria-expanded='true'>否</button>"
                            + "<ul class='dropdown-menu'>"
                            + "<li><a href='javascript:void(0)' key='0' onclick='searchIsCollection(this);'>否</a></li>"
                            + "<li><a href='javascript:void(0)' key='1' onclick='searchIsCollection(this);'>是</a></li>"
                            + "</ul>"
                            + "</div>"
                            + "</td>"
                            + "</tr>";

                        $('.table-rece-left').children('tbody').find('tr:last').before(receLeftTr);

                        var receRightTr = "<tr class='trData'>"
                            +"<td class='text-right zl-edit receDate' title='" + fmtDate(receList[i].receDate) + "'>"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].receDate'   value='" + fmtDate(receList[i].receDate) + "' readonly>"
                            +"</td>"
                            +"<td class='text-right zl-edit receAmount' title='" + receAmount + "'>"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].receAmount' class='text-right' value='" + receAmount + "' readonly>"
                            +"</td>"
                            +"<td class='text-right zl-edit reOffsetAmount'>"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].reOffsetAmount' class='text-right' value='" + reOffsetAmount + "' readonly>"
                            +"</td>"
                            +"<td class='text-right zl-edit keepOffsetAmount'>"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].keepOffsetAmount' class='text-right' value='" + keepOffsetAmount + "' readonly>"
                            +"</td>"
                            +"<td class='text-right zl-edit subAmount' title='" + subAmount + "'>"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].subAmount' class='text-right' value='" + subAmount + "' readonly>"
                            +"</td>"
                            +"<td class='text-right zl-edit deAmount' title='" + deAmount + "'>"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].deAmount' class='text-right' value='" + deAmount + "' readonly>"
                            +"</td>"
                            +"<td class='text-right zl-edit laterAmount' title='" + laterAmount + "'>"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].laterAmount' class='text-right' value='" + laterAmount + "' readonly>"
                            +"</td>"
                            +"<td class='text-right zl-edit receContNo' title='" + receContNo + "'>"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].receContNo' class='text-right' value='" + receContNo + "' readonly>"
                            +"</td>"
                            +"<td class='text-right zl-edit' >"
                            +"<input type='text' name='finExpenseVerificationReceEntityList[" + i + "].note' id='note' class='text-right' value=''>"
                            +"</td>"
                            +"</tr>";
                        $('.table-rece-right').children('tbody').find('tr:last').before(receRightTr);
                    }

                    $(".receAmountTotal").find('input').val(receAmountTotal) ;
                    $(".subAmountTotal").find('input').val(subAmountTotal) ;
                    $(".deAmountTotal").find('input').val(deAmountTotal) ;
                    $(".laterAmountTotal").find('input').val(laterAmountTotal);

                    bindPageEvents();
                });
            },
        });
    }

    function  _setSearchData(arr){
        var _arr=[]
        $.each(arr,function(i,item){
            _arr.push({
                label:item.companyName,
                value:item.id

            })
        });
        return _arr;
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

    page.on("click",".zl-table-wrapper-swiper tbody tr",function() {
        //location.href="../../../pages/finance/scp/expense_verification_detail.html";

    });

    $("#js-addnew-save").on("click", function (e) {
        if(flag){
            return;
        }
        var realOffsetAmountTotal = Number($(".realOffsetAmountTotal").find("input").val());
        var realSubAmountTotal = Number($(".realSubAmountTotal").find("input").val());
        if(0 == realOffsetAmountTotal && 0 == realSubAmountTotal){
            alert('冲抵金额为0，请重新分配冲抵金额或选择租户')
            return;
        }
        //var isChecked = checkForm($('#addFinanceReceiveForm'));
        var isChecked = checkZero();
        if (isChecked) {
            expenseVerificationAddOffsetView.loadingShow();
            flag = true;
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinExpenseVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/expenseVerification/add.htm?oprType=save",
                success: function (resultData) {
                    expenseVerificationAddOffsetView.loadingHide();
                    flag = false;
                    if (resultData.success == true) {
                        alert("保存成功！");
                        //window.location.reload();
                        /*var url = financeWeb_Path + "/finance/expenseVerification/index.htm";
                        setSearchForm();
                        $("#searchPageForm").attr("action", url).submit();*/
                        window.location = financeWeb_Path + "finance/expenseVerification/index.htm";
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
        var realSubAmountTotal = Number($(".realSubAmountTotal").find("input").val());
        if(0 == realOffsetAmountTotal && 0 == realSubAmountTotal){
            alert('冲抵金额为0，请重新分配冲抵金额或选择租户')
            return;
        }
        //var isChecked = checkForm($('#addFinanceReceiveForm'));
        var isChecked = checkZero();

        if (isChecked) {
            expenseVerificationAddOffsetView.loadingShow();
            flag = true;
            $.ajax({
                type: "POST",
                dataType: "json",
                data: $("#addFinExpenseVerificationForm_").serialize(),
                url: financeWeb_Path + "/finance/expenseVerification/add.htm?oprType=commit",
                success: function (resultData) {
                    expenseVerificationAddOffsetView.loadingHide();
                    flag = false;
                    if (resultData.success == true) {
                        alert("提交成功！");
                        //window.location.reload();
                        /*var url = financeWeb_Path + "/finance/expenseVerification/index.htm";
                        setSearchForm();
                        $("#searchPageForm").attr("action", url).submit();*/
                        window.location = financeWeb_Path + "finance/expenseVerification/index.htm" ;
                    }else{
                        alert(resultData.msg);
                    }
                }
            });
        }
    });

    function checkZero() {
        var isChecked = true;
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
        }
        return isChecked;
    }

    /*$(".canOffsetAmount").on("input",function(){
        var total = 0;
        $(".canOffsetAmount").each(function(){
            total += Number($(this).find("input").val());
        })
        $(".canOffsetAmountTotal").find("input").val(total);
    })*/
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
                $("#js-dropdown-companys").find("button").html("");
                $("#companyId").val("");
                $("#companyName").val("");
                expenseVerificationAddOffsetView.search();

                // $.getJSON(financeWeb_Path + 'finance/receivepaper/ibCompanylist.htm', {mallId: mallValue}, function (res) {
                //     if (res.length === 0) {
                //         alert('此项目下没租户,请先添加租户或者选择别的项目');
                //         return;
                //     }
                //
                //     console.log(res);
                //     _renterData=_setSearchData(res);
                //
                //     expenseVerificationAddOffsetView.searchUpdate();
                //    /* $('#js-dropdown-companys').find(' .dropdown-menu').children('li').remove();
                //     for (var i = 0; i < res.length; i++) {
                //         $('#js-dropdown-companys').find(' .dropdown-menu').append("<li><a key='" + res[i].id + "' href='javascript:void(0)' class='company'>" + res[i].companyName + "</a></li>");
                //     }*/
                // });
            }
        });

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
                total = findKeepOffsetAmounts(total,receContNo);
                var realOffsetAmountForReceContNo = Number(0).toFixed(2);
                $(".realOffsetAmount").each(function(){
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
            //var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
            var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
            var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
            var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
            laterAmount = accSub(receAmount,subAmount );
            laterAmount = accSub(laterAmount,deAmount );
            //laterAmount = accSub(laterAmount,newDeAmount );
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
            //var canOffsetAmountTotal = 0;
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
            // var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
            var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
            var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
            var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
            laterAmount = accSub(receAmount,subAmount );
            laterAmount = accSub(laterAmount,deAmount );
            // laterAmount = accSub(laterAmount,newDeAmount );
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
            // var newDeAmount = Number($(this).parents("tr").find(".newDeAmount input").val());
            var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
            var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
            var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
            laterAmount = accSub(receAmount,subAmount );
            laterAmount = accSub(laterAmount,deAmount );
            // laterAmount = accSub(laterAmount,newDeAmount );
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
            laterAmount = receAmount - subAmount - deAmount - newDeAmount - reOffsetAmount -keepOffsetAmount;
            if(laterAmount < 0 || newDeAmount < 0 ){
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".newDeAmount input").val('');
                return ;
            }

            var myDate = new Date();//获取系统当前时间
            var receDate = $(this).parents("tr").find(".receDate input").val();
            if(compareDate(myDate,receDate)){
                //设置应收明细欠款
                $(this).parents("tr").find(".laterAmount input").val(laterAmount);
                $(".laterAmount").each(function(){
                    laterAmountTotal += Number($(this).find("input").val());
                })
                $(".laterAmountTotal").find("input").val(laterAmountTotal);
            }

            //设置本次收款核销金额
            var newDeAmountTotal = Number(0).toFixed(2);
            $(".newDeAmount").each(function(){
                newDeAmountTotal += Number($(this).find("input").val());
            })

            //判断收款金额是否需要转入预收
            var receAmount = Number($("#receiveMoney").val());
            var advanceAmountTotal = Number(0).toFixed(2);
            if(receAmount >= newDeAmountTotal){
                $(".reTotalTr").find(".advanceAmount input").val(receAmount - newDeAmountTotal);
                $(".advanceAmount").each(function(){
                    advanceAmountTotal += Number($(this).find("input").val());
                })
                $(".advanceAmountTotal").find("input").val(advanceAmountTotal);
            } else {
                alert('金额填写超出可填范围！');
                $(this).parents("tr").find(".newDeAmount input").val('');
                return ;
            }
            $(".newDeAmountTotal").find("input").val(newDeAmountTotal);

        })

    }

    function insertKeepOffsetAmounts(realOffsetAmount,receContNo){
        $(".keepOffsetAmount").each(function(){
            if(receContNo == ($(this).parents("tr").find(".receContNo input").val())){
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
                var laterAmountOld = Number($(this).parents("tr").find(".laterAmount input").val());
                //var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                //var keepAmount = Number($(this).parents("tr").find(".keepAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount  - reOffsetAmount ;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,reOffsetAmount );
                laterAmount = accSub(laterAmount,subOffsetAmount );
                /*if(laterAmount > keepAmount){
                    laterAmount = keepAmount;
                }*/
                if(Number(realOffsetAmount) > Number(laterAmount)){
                    $(this).find("input").val(Number(laterAmount).toFixed(2));
                    $(this).parents("tr").find(".laterAmount input").val(Number(0).toFixed(2));
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
                            laterAmountTotal = accAdd(laterAmountTotal,Number($(this).find("input").val()));
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
            if(receContNo == ($(this).parents("tr").find(".receContNo input").val())) {
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                // var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
                var laterAmountOld = Number($(this).parents("tr").find(".laterAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - keepOffsetAmount;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,keepOffsetAmount );
                laterAmount = accSub(laterAmount,subOffsetAmount );
                if (Number(realOffsetAmount) > Number(laterAmount)) {
                    $(this).find("input").val(Number(laterAmount).toFixed(2));
                    $(this).parents("tr").find(".laterAmount input").val(Number(0).toFixed(2));
                    realOffsetAmount = accSub(Number(realOffsetAmount) , Number(laterAmount));
                } else {
                    $(this).find("input").val(Number(realOffsetAmount).toFixed(2));

                    var myDate = new Date();//获取系统当前时间
                    var receDate = $(this).parents("tr").find(".receDate input").val();
                    if (compareDate(myDate, receDate)) {
                        //设置应收明细欠款
                        $(this).parents("tr").find(".laterAmount input").val(accSub(Number(laterAmount).toFixed(2), Number(realOffsetAmount).toFixed(2)));
                        var laterAmountTotal = Number(0).toFixed(2);
                        $(".laterAmount").each(function () {
                            laterAmountTotal = accAdd(laterAmountTotal, Number($(this).find("input").val()));
                        })
                        $(".laterAmountTotal").find("input").val(Number(laterAmountTotal).toFixed(2));
                    }
                    realOffsetAmount = Number(0).toFixed(2);
                }
            }
        })
        var reOffsetAmountTotal = Number(0).toFixed(2);
        $(".reOffsetAmount").each(function(){
            reOffsetAmountTotal = accAdd(reOffsetAmountTotal,Number($(this).find("input").val()));
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
                var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                var laterAmountOld = Number($(this).parents("tr").find(".laterAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - newDeAmount - keepOffsetAmount;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
                laterAmount = accSub(laterAmount,reOffsetAmount );
                laterAmount = accSub(laterAmount,keepOffsetAmount );
                if (Number(realOffsetAmount) > Number(laterAmount)) {
                    $(this).find("input").val(Number(laterAmount).toFixed(2));
                    $(this).parents("tr").find(".laterAmount input").val(Number(0).toFixed(2));
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
        $(".subOffsetAmountTotal").find("input").val(Number(subOffsetAmountTotal).toFixed(2));
    };

    function findKeepOffsetAmounts(total,receContNo){
        $(".keepOffsetAmount").each(function(){
            if(receContNo == ($(this).parents("tr").find(".receContNo input").val())){
                var receAmount = Number($(this).parents("tr").find(".receAmount input").val());
                var subAmount = Number($(this).parents("tr").find(".subAmount input").val());
                var deAmount = Number($(this).parents("tr").find(".deAmount input").val());
                var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
                //var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                //var keepAmount = Number($(this).parents("tr").find(".keepAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount  - reOffsetAmount  ;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
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
                //var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                var subOffsetAmount = Number($(this).parents("tr").find(".subOffsetAmount input").val());
                //var keepAmount = Number($(this).parents("tr").find(".keepAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - keepOffsetAmount  ;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
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
                var reOffsetAmount = Number($(this).parents("tr").find(".reOffsetAmount input").val());
                var keepOffsetAmount = Number($(this).parents("tr").find(".keepOffsetAmount input").val());
                //var keepAmount = Number($(this).parents("tr").find(".keepAmount input").val());
                //var laterAmount = receAmount - subAmount - deAmount - newDeAmount - keepOffsetAmount  ;
                var laterAmount = accSub(receAmount,subAmount );
                laterAmount = accSub(laterAmount,deAmount );
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

    expenseVerificationAddOffsetView.init = function(){
        $("#preloader").fadeOut("fast");

        bindPageEvents();

        //expenseVerificationAddOffsetView.searchInit();
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
            if(id==""|| name==""){
                alert("请选择项目或者租户");
                return;
            }
            var isSelect = 'select';

            flag = true;
            $.getJSON(financeWeb_Path + 'finance/expenseVerification/recelist.htm', {saveCompanyId: id,saveCompanyName: name,isSelect: isSelect}, function (res) {
                var data = res.finExpenseVerificationReceEntityList;
                selectAccountList.update({accountPeriodList: data}, "multi");

                //todo:
                _selectedAccounts={};
                selectAccountList.modalShow(
                    function (selectedAccounts) {
                        console.log('--------selectedAccounts');
                        console.log(selectedAccounts);
                        _selectedAccounts = selectedAccounts;
                        // 将删除的tr移除
                        $("#zl-section-collapse-table-4").find("tr").each(function () {
                            var data_id = $(this).attr("data-fincontid");
                            if (data_id != undefined && selectedAccounts[data_id] == undefined) {
                                $(this).remove();
                            }
                        });
                        // 将添加新的tr
                        var inds = Number($(".inds").val());
                        for (var key in _selectedAccounts) {
                            console.log(key);
                            var tr = $("#zl-section-collapse-table-4").find("tr[data-fincontid=" + key + "]");
                            if (tr.length == 0) {
                                var map = {
                                    key: _selectedAccounts[key]
                                };
                                /*var html = page._renderList(map, "template-select-Clause");
                                $("#zl-section-collapse-table-4").find(".zl-table tbody").append(html);*/
                                var receAmount = Number(_selectedAccounts[key].receAmount).toFixed(2);
                                var subAmount = Number(_selectedAccounts[key].subAmount).toFixed(2);
                                var deAmount = Number(_selectedAccounts[key].deAmount).toFixed(2);
                                var laterAmount = Number(_selectedAccounts[key].laterAmount).toFixed(2);
                                var reOffsetAmount = Number(_selectedAccounts[key].reOffsetAmount).toFixed(2);
                                var keepOffsetAmount = Number(_selectedAccounts[key].keepOffsetAmount).toFixed(2);
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
                                    +"<input type='text' name='finExpenseVerificationReceEntityList[" + inds + "].receContNo' class='text-right' value='" + receContNo + "' readonly>"
                                    +"</td>"
                                    + "<td class='text-right zl-edit'>"
                                    + "<div class='btn-group  zl-dropdown-inline' data-id='fee'>"
                                    + "<input type='hidden' name='finExpenseVerificationReceEntityList[" + inds + "].isCollection' id='isCollection' value='0'/>"
                                    + "<button type='button' class='btn btn-default dropdown-toggle zl-dropdown-btn' data-toggle='dropdown' aria-expanded='true'>否</button>"
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
                                    +"<td class='text-right zl-edit reOffsetAmount'>"
                                    +"<input type='number' min='0' onkeyup='clearNoNum(this)' name='finExpenseVerificationReceEntityList[" + inds + "].reOffsetAmount' class='text-right' value='" + reOffsetAmount + "' >"
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

                        expenseVerificationAddOffsetView.init();
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
        var isSelect = 'select';
        $.getJSON(financeWeb_Path + 'finance/expenseVerification/recelist.htm', {saveCompanyId: id,saveCompanyName: name,isSelect: isSelect}, function (res) {
            var data = res.finExpenseVerificationReceEntityList;
            selectAccountList.update({accountPeriodList: data}, "multi");
        });*/
        selectModalView.eventInit();
    };

    return selectModalView;
})(jQuery);

$(document).ready(function(){
    expenseVerificationAddOffsetView.init();
    selectModalView.init();
    selectAccountList.init({accountPeriodList: [{}]}, "multi");
    confirmAlert.init();
});

/*$(document).ready(function(){
    expenseVerificationAddOffsetView.init();
});*/

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
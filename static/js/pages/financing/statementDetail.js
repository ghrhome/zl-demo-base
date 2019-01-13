/**
 * Created by whobird on 2018/4/16.
 */

var _contNo='';
var feeTypedropDownList={};
var pageView=(function($){
    var pageView={};


    pageView.eventInit=function(){
        _contNo = $('#contNo').val();
        getFeeTypeMapByContNo(_contNo);
        var container = $("#margin-settlement-detail");
        //初始化下拉
        container.find(".zl-dropdown-inline").ysdropdown({
            // callback:function(val, $elem){
            //
            // }
        });
        var settlementTemplate = container.find("[name=template-for-settlement-detail]");
        //暂存
        $(".js-temp-save").on("click",function(e){
            e.preventDefault();
        });

        container.on("click",".zl-datetimepicker",function(e){
            e.stopPropagation();
            e.preventDefault();

            container.find(".zl-datetimepicker.finance input").datetimepicker({
                language: "zh-CN",
                format:"yyyy-mm",
                todayBtn:"linked",
                startView:3,
                minView:3,
                weekStart: 1,
                autoclose: 1,
                todayHighlight: 1,
                forceParse: 0,
                clearBtn:true,
            });

            container.find(".zl-datetimepicker.business input").datetimepicker({
                language: "zh-CN",
                format:"yyyy-mm-dd",
                todayBtn:"linked",
                startView:2,
                minView:3,
                weekStart: 1,
                autoclose: 1,
                todayHighlight: 1,
                forceParse: 0,
                clearBtn:true,
            });
            $(this).find("input").datetimepicker("show");
        });

        var index={detailIndex:$("#indexs").val()-1};
        container.on("click","em.add-settlement-detail",function(e){
            e.stopPropagation();
            e.preventDefault();
            index.detailIndex++;
            var node = settlementTemplate.tmpl(index);

            $(this).closest(".zl-block-section").find(".zl-section-content table tbody").append(node);
            $('.js-feeType').find('.dropdown-menu').html("");
            $.each(feeTypedropDownList,function(i,value){
                var html="<li><a data-value='"+i+"'>"+value+"</a></li>";
                $('.js-feeType').find('.dropdown-menu').append(html);
            })

            // $(this).closest(".zl-block-section").find(".zl-section-content table tbody").append(node);
            $(this).closest(".zl-block-section").find(".zl-dropdown-inline").ysdropdown("init");

        });
        container.on("click",".delete-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).closest("tr").remove();
        });

        //暂存
        $(".save-btn").on("click",function(e){
            if (!checkForm($('form'))) {
                return false;
            }
            confirm("确认保存吗？","","",function(type){
                if(type=="dismiss"){
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: financeWeb_Path + "cashDeposit/settlement/save.htm",
                    data:$("form").serialize(),
                    dataType:'json',
                    error: function (request) {
                        alert("系统异常");
                    }, success: function (response) {
                        if(response.code == 0){
                            alert("保存成功","","",function(){
                                // loading();
                                window.location = financeWeb_Path + "cashDeposit/settlement/list.htm" ;
                            })
                        }else{
                            alert(response.msg);
                        }
                    }
                });

            });
        });

        //提交
        container.on("click", ".submit-btn", function() {

            var id = container.find("input[name=id]").val();

            pageView.loadingShow();
            $.ajax({
                cache: false,
                type: "POST",
                url: 'insertKeeps.htm',
                data: {id : id},
                dataType: "json",
                async: false,
                error: function (request) {
                    alert("系统繁忙");
                },
                success: function (rdata) {
                    if(rdata || rdata.code=="0"){
                        var areaCode =$("#areaCode").val();
                        var settlementId =$("#settlementId").val();
                        $app.workflow.submit("inamp-feeliquidation-"+areaCode, settlementId).then(function ($response) {
                            window.open($response.data.data);
                            // update(settlementId);
                            location.href = financeWeb_Path + "finance/reduce/index.htm" ;
                        });
                    }
                }
            });
        });

    };


    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    pageView.compareValueInit=function(){

        $("#zl-section-collapse-table-2").on("change",".settlementAmount input",function(e){

            $this=$(this);

            var _mod=$this.closest("tr").find(".js-settlement-type").val();
            if(_mod==1){
                var _curVal=parseFloat($this.val());
                var targetVal=parseFloat($this.closest("tr").find(".depositAmount input").val());
                if(_curVal>targetVal){
                    alert("退款金额不能大于保证金余额","","",function(){
                        $this.focus();
                        $this.val('0.00');
                    })
                }
            }
        });

        $("#zl-section-collapse-table-2").on("change",".offsetAmount input",function(e){
            $this=$(this);
            var _mod=$this.closest("tr").find(".js-settlement-type").val();
            if(_mod==2){
                var _curVal=parseFloat($this.val());
                var targetVal=parseFloat($this.closest("tr").find(".depositAmount input").val());
                if(_curVal>targetVal){
                    alert("申请冲抵金额不能大于保证金余额","","",function(){
                        $this.focus();
                        $this.val('0.00');
                    })
                }
            }
        });
    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");

        pageView.eventInit();
        pageView.compareValueInit();

    };
    return pageView;

})(jQuery);

var selectModalView = (function ($) {
    var selectModalView = {};
    var _selectedAccounts = {}

    var _selectAccountList = {}
    var inds = -1;

    /*var page = $("#expense-verification-add");
    // 载入模板内容
    page._renderList = function (list, id) {
        var _tmp = $("#" + id).html();
        var template = Handlebars.compile(_tmp);
        var context = {dataList: list}
        return template(context)
    }*/

    selectModalView.eventInit = function (inds) {
        $("#add-rece").on("click", function (e) {
            var contNo = $('#contNo').val();
            if(contNo == ""){
                alert("合同编号为空")
                return;
            }
            var isSelect = 'selected';
            pageView.loadingShow();
            $.getJSON(financeWeb_Path + '/cashDeposit/recelist.htm', {contNo: contNo,isSelect: isSelect}, function (res) {
                var data = res.detailList;
                if(data.length ==0){
                    alert("保证金余额为0")
                    pageView.loadingHide();
                    return
                }
                selectAccountList.update({accountPeriodList: data}, "multi");
                pageView.loadingHide();

                //todo:
                _selectedAccounts={};
                selectAccountList.modalShow(
                    function (selectedAccounts) {
                        _selectedAccounts = selectedAccounts;
                        // 将删除的tr移除
                        $("#zl-section-collapse-table-2").find("tr").each(function () {
                            var data_id = $(this).attr("data-fincontid");
                            if (data_id != undefined && selectedAccounts[data_id] == undefined) {
                                $(this).remove();
                            }
                        });
                        // 将添加新的tr
                        // var inds = Number($(".inds").val());

                        $('.table-rece-left').children('tbody').html("");
                        for (var key in _selectedAccounts) {
                            inds = inds + 1;
                            var tr = $("#zl-section-collapse-table-2").find("tr[data-fincontid=" + key + "]");
                            if (tr.length == 0) {
                                var map = {
                                    key: _selectedAccounts[key]
                                };
                                /*var html = page._renderList(map, "template-select-Clause");
                                $("#zl-section-collapse-table-4").find(".zl-table tbody").append(html);*/
                                var depositAmount = Number(_selectedAccounts[key].depositAmount);
                                var receNo = _selectedAccounts[key].receNo;
                                var receLeftTr = "<tr class='trData' data-fincontid='" + _selectedAccounts[key].receId + "'>"
                                    + "<td class='zl-edit' title='" + receNo + "'>"
                                    + "<input type='hidden' name='detailList[" + inds + "].receId'   value='"+ _selectedAccounts[key].receId + "'>"
                                    + "<input type='text' name='detailList[" + inds + "].receNo'   value='" + _selectedAccounts[key].receNo + "' readonly>"
                                    + "</td>"
                                    + "<td class='zl-edit' title='" + _selectedAccounts[key].feeType + "'>"
                                    + "<input type='hidden' name='detailList[" + inds + "].feeType'   value='"+ _selectedAccounts[key].feeType +"'>"
                                    + "<input type='text'  value='"+ _selectedAccounts[key].feeTypeName +"' readonly>"
                                    + "</td>"
                                    + "<td class='text-right zl-edit'>"
                                    + "<div class='btn-group zl-dropdown-inline'>"
                                    + "<input name='detailList[" + inds + "].settlementType' type='hidden' class='js-settlement-type'>"
                                    + "<button type='button' class='btn btn-default dropdown-toggle zl-btn zl-dropdown-btn' data-toggle='dropdown' aria-expanded='false'>"
                                    + "选择类型"
                                    + "</button>"
                                    + "<ul class='dropdown-menu'>"
                                    + "<li><a data-value='' style='display:none'></a></li>"
                                    + "<li><a data-value='1' onclick='test(this)'>退款</a></li>"
                                    + "<li><a data-value='2' onclick='test(this)'>申请冲抵</a></li>"
                                    + "</ul>"
                                    + "</div>"
                                    + "</td>"
                                    +"<td class='zl-edit'>"
                                    +"<div class='zl-datetimepicker business'>"
                                    +"<input  name='detailList[" + inds + "].businessPeriod' class='form-control' value='" + fmtDate(new Date()) + "' readonly>"
                                    +"</div>"
                                    +"</td>"
                                    // + "<td style='display: none' class='zl-edit' title='" + _selectedAccounts[key].financePeriod + "'>"
                                    // + "<input type='hidden' name='detailList[" + inds + "].financePeriod'   value='" + _selectedAccounts[key].financePeriod + "' readonly>"
                                    // + "</td>"
                                    +"<td class='text-right zl-edit depositAmount' title='" + depositAmount+ "'>"
                                    +"<input type='text' name='detailList[" + inds + "].depositAmount' class='text-right' value='" + depositAmount + "' readonly>"
                                    +"</td>"
                                    +"<td class='text-right zl-edit settlementAmount'>"
                                    +"<input type='text' name='detailList[" + inds + "].settlementAmount' class='text-right' value='0.00' readonly>"
                                    +"</td>"
                                    +"<td class='text-right zl-edit offsetAmount'>"
                                    +"<input type='text' name='detailList[" + inds + "].offsetAmount' class='text-right' value='0.00' readonly>"
                                    +"</td>"
                                    +"<td class='text-right zl-edit'>"
                                    +"<input type='text'  maxlength='20'name='detailList[" + inds + "].refundReason'  class='text-right' value=''>"
                                    +"</td>"
                                    +"</tr>";
                                $('.table-rece-left').children('tbody').append(receLeftTr);
                                $("#margin-settlement-detail").find(".zl-dropdown-inline").ysdropdown("init");
                            }
                        }
                        // $(".inds").val(inds);
                        inds = -1 ;
                        // pageView.init();
                    }, _selectedAccounts)
            });
        });

    }

    selectModalView.compareValueInit=function(){

        $("#zl-section-collapse-table-2").on("change",".settlementAmount input",function(e){

            $this=$(this);

            var _mod=$this.closest("tr").find(".js-settlement-type").val();
            if(_mod==1){
                var _curVal=parseFloat($this.val());
                var targetVal=parseFloat($this.closest("tr").find(".depositAmount input").val());
                if(_curVal>targetVal){
                    alert("退款金额不能大于保证金余额","","",function(){
                        $this.focus();
                        $this.val('0.00');
                    })
                }
            }

        })

        $("#zl-section-collapse-table-2").on("change",".offsetAmount input",function(e){
            $this=$(this);
            var _mod=$this.closest("tr").find(".js-settlement-type").val();
            if(_mod==2){
                var _curVal=parseFloat($this.val());
                var targetVal=parseFloat($this.closest("tr").find(".depositAmount input").val());
                if(_curVal>targetVal){
                    alert("申请冲抵金额不能大于保证金余额","","",function(){
                        $this.focus();
                        $this.val('0.00');
                    })
                }
            }

        })
    }

    selectModalView.init = function () {

        selectModalView.eventInit(inds);
        // selectModalView.compareValueInit();
    };

    return selectModalView;
})(jQuery);

$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
    selectModalView.init();
    selectAccountList.init({accountPeriodList: [{}]}, "multi");
});

function update(settlementId){
    $.ajax({
        type: "POST",
        url: financeWeb_Path + "cashDeposit/settlement/submit.htm?settlementId=" + settlementId ,
        error: function (request) {
            alert("系统异常");
        }, success: function (response) {
            response = JSON.parse(response)
            if(response.code == 0){
                alert("保存成功","","",function(){
                    // loading();
                    location.href = financeWeb_Path + "cashDeposit/settlement/list.htm" ;
                })
            }else{
                alert(response.msg);
            }
        }
    });
}


function submit(settlementId){
    $.ajax({
        type: "POST",
        url: financeWeb_Path + "cashDeposit/settlement/modify.htm?masterId=" + settlementId +"&billStatus=1001" ,
        error: function (request) {
            alert("系统异常");
        }, success: function (response) {
            response = JSON.parse(response)
            if(response.code == 0){
                alert("提交成功","","",function(){
                    // loading();
                    location.href = financeWeb_Path + "cashDeposit/settlement/list.htm" ;
                })
            }else{
                alert(response.msg);
            }
        }
    });

}

function checkForm () {
    var flag = true;

    $("#zl-section-collapse-table-2").find("input[name^=detailList][name$=settlementType]").each(function(i) {
        if (!$(this).val() || $(this).val()=='') {
            flag = false;
            alert("类型不能为空");
            return false;
        }
        if($(this).val()== 1 ){
            if($(this).closest("td").next("td").find(".business input").val()==''){
                flag = false;
                alert("退款类型时,应付日期不能为空");
                return false;
            }
        }

    });
    if (!flag) return;
    // $("#zl-section-collapse-table-2").find("input[name^=detailList][name$=businessPeriod]").each(function(i) {
    //     if (!$(this).val() || $(this).val()=='') {
    //         flag = false;
    //         alert("应付日期不能为空");
    //         return false;
    //     }
    //
    // });
    // if (!flag) return;
    $("#zl-section-collapse-table-2").find("input[name^=detailList][name$=settlementAmount]").each(function() {
        var _val=$(this).val();
        if(isNaN(parseFloat(_val)) || typeof _val=="undefined"){
            flag = false;
            $(this).val('0.00');
            alert("退款金额必须是有效数字");
            return false;
        }
        else if(!checkNum(_val)){
            flag = false;
            $(this).val('0.00');
            alert("退款金额不能是负数");
            return false;
        }
    });
    if (!flag) return;
    $("#zl-section-collapse-table-2").find("input[name^=detailList][name$=offsetAmount]").each(function() {
        var _val=$(this).val();
        if(isNaN(parseFloat(_val)) || typeof _val=="undefined"){
            flag = false;
            $(this).val('0.00');
            alert("申请冲抵金额必须是有效数字");
            return false;
        }
        else if(!checkNum(_val)){
            flag = false;
            $(this).val('0.00');
            alert("申请冲抵金额不能是负数");
            return false;
        }
    });
    return flag;
}

//检查非负浮点数
function checkNum(num){
    var patt=/^\d+(\.\d+)?$/g;
    return patt.test(num);
}

function test(_this) {
    $(_this).closest("td").nextAll(".settlementAmount").find("input").attr("readonly",false);
    $(_this).closest("td").nextAll(".offsetAmount").find("input").attr("readonly",false)
    if($(_this).data("value")==1){
        $(_this).closest("td").nextAll(".offsetAmount").find("input").attr("readonly",true);
        $(_this).closest("td").nextAll(".offsetAmount").find("input").val('0.00');
        $(_this).closest("td").next("td").find(".business input").val(fmtDate(new Date()));
        var _feeType = $(_this).closest("td").prev(".feeType").find("input").val();
        var _deposit='';
        $.ajax({
            url: financeWeb_Path + "cashDeposit/getDepositAmountByContNo.htm?contNo=" + _contNo+"&feeType="+_feeType,
            type: "post",
            dataType: "json",
            success: function (response) {
                _deposit = toDecimal2(parseFloat(response[_feeType].leftAmount) - parseFloat(response[_feeType].subedAmount));
                $(_this).closest("td").nextAll(".depositAmount").find("input").val(_deposit);
            }
        })
    }
    if($(_this).data("value")==2){
        $(_this).closest("td").nextAll(".settlementAmount").find("input").attr("readonly",true)
        $(_this).closest("td").nextAll(".settlementAmount").find("input").val('0.00');
        $(_this).closest("td").next("td").find(".business input").val('');
        var _feeType = $(_this).closest("td").prev(".feeType").find("input").val();
        var _deposit='';
        $.ajax({
            url: financeWeb_Path + "cashDeposit/getDepositAmountByContNo.htm?contNo=" + _contNo+"&feeType="+_feeType,
            type: "post",
            dataType: "json",
            success: function (response) {
                _deposit = toDecimal2(parseFloat(response[_feeType].leftAmount) - parseFloat(response[_feeType].subableAmount) -parseFloat(response[_feeType].subedAmount));
                $(_this).closest("td").nextAll(".depositAmount").find("input").val(_deposit);
            }
        })
    }
}

function fmtDate(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}

function getFeeTypeMapByContNo(contractNo) {
    $.ajax({
        url: financeWeb_Path + "cashDeposit/getFeeTypeMapByContNo.htm?contNo=" + contractNo,
        type: "post",
        dataType: "json",
        success: function (response) {
            feeTypedropDownList=response;
        }
    })
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

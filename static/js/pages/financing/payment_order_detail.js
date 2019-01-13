/**
 * Created by whobird on 2018/4/12.
 */
var dataList={};
var pageView=(function($){
    var pageView={};
    var ys_main_swiper;
    var flag=false;
    var _html="";

    pageView.search=function () {
        $("#js-dropdown-receBank").ysSearchSelect({
            source:function( request, response ) {
                $.ajax( {
                    url: financeWeb_Path + "finance/paymentOrder/getReceiveBankName.htm",
                    dataType: "json",
                    data: {
                        fname:request.term
                    },
                    success: function( data ) {
                        response( $.map( data, function( item ) {
                            return {
                                label: item.fname,
                                value: item.fname,
                                id:item.fnumber,
                            }
                        }));
                    }
                } );
            },
            callback:function(value,ui){
                $("#receiveBankId").val(ui.item.id);
                $("#receiveBank").val(ui.item.label);
                //$('#companyName').val(ui.item.label);
                //pageView.searchUpdate();
                // _searchCb(ui.item.value);
            },
        });
    }
    pageView.eventInit=function(){
        var page = $("#payment-order-detail");

        $(".cancel-btn").on("click", function (e) {
            window.history.back();
        });

        checkStatus($("#paymentOrderStatus").val());


        $(".zl-dropdown-inline").ysdropdown({
            callback:function(val, $elem) {
                if ($elem.data("id") == "js-transferCode") {
                    if(val !=$("#transferCode").val()){
                        flag=true;
                    }
                    $("form").find("input[name=transferCode]").val(val);
                }

                if ($elem.data("id") == "payName") {
                    // $elem.find("input[name^=detailList][name$=payee]").val(payeeUnit.orgFNubmer);
                    $elem.closest("td").find("input[name=payName]").val($elem.find("button").html());
                    $elem.closest('td').next("td").find("button").html("");
                    $elem.closest('td').next("td").find(".dropdown-menu").html("");
                    $elem.closest('td').next("td").next("td").find("input").val("");
                    $.each(dataList[val].details,function(i,value){
                        var bankList = "<li><a title='" + value.bankName+ value.bankAccount + "' data-value='" + value.bankCode + "' data-bank='" + value.bankAccount + "' " +
                            "data-bankName='" + value.bankName + "' onclick='getBank(this)'>" + value.bankName + "</a></li>";
                        $elem.closest('td').next("td").find(".dropdown-menu").append(bankList);
                    })

                }
            }

        });

        $(".submit-btn").on("click", function (e) {
            if (!validateForm($('#saveForm'))) {
                return false;
            }
            /*if(flag){
                isChanged(flag);
                return;
            }*/
            confirm("确认提交吗？","","",function(type){
                if(type=="dismiss"){
                    return;
                }
                var ids = $("#paymentOrderId").val();
                if (ids == "") {
                    alert("请选择后再执行该操作", "", "");
                }else{
                    $.ajax({
                        cache: true,
                        type: "POST",
                        url: financeWeb_Path + "finance/paymentOrder/submit.htm",
                        data: {ids :ids},
                        async: false,
                        error: function (request) {
                            alert("系统异常");
                        }, success: function (response) {
                            // alert("保存成功","","");
                            var obj =JSON.parse(response);
                            if(obj.code == 0){
                                alert("保存成功","","",function(){
                                    // loading();
                                    window.location = financeWeb_Path + "finance/paymentOrder/index.htm" ;
                                    // window.history.back();
                                })
                            }else{

                                alert(obj.msg);
                            }
                        }
                    });
                }
            });

        });

        $(".save-btn").on("click", function (e) {
            if (!validateForm($('#saveForm'))) {
                return false;
            }
            confirm("确认保存吗？","","",function(type){
                if(type=="dismiss"){
                    return;
                }
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: financeWeb_Path + "finance/paymentOrder/savePaymentOrderDetail.htm",
                    data: $('#saveForm').serialize(),
                    async: false,
                    error: function (request) {
                        alert("系统异常");
                    }, success: function (response) {
                        // alert("保存成功","","");

                        var obj =JSON.parse(response);
                        if(obj.code == 0){
                            alert("保存成功","","",function(){
                                // loading();
                                window.location = financeWeb_Path + "finance/paymentOrder/index.htm" ;
                                flag=false;
                                // window.history.back();
                            })
                        }else{
                            alert(obj.msg);
                        }
                    }
                });
            });
        });
        pageView.loadingShow=function(){
            $(".zl-loading").fadeIn();
        };

        pageView.loadingHide=function(){
            $(".zl-loading").fadeOut();
        }

        function loading(){
            pageView.loadingShow();

            setTimeout(function(){
                pageView.loadingHide();
            },1000);
        }

        // $(".save-btn").on("click",function(e){
        //     e.preventDefault();
        //     pageView.loadingShow();
        //
        //     setTimeout(function(){
        //         pageView.loadingHide();
        //     },1000);
        // });
        $("input").on("change",function(){
            flag=true;
        })

        $(".zl-dropdown-inline").bind("change",function(){
            flag=true;
        });



    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        confirmAlert.init();
        pageView.eventInit();
        pageView.search();

        // ?fbeProvince=广东省
        // $.ajax({
        //     url: financeWeb_Path + "finance/paymentOrder/getReceiveBankName.htm",
        //     type: "post",
        //     data:{searchWold:""},
        //     dataType: "json",
        //     success: function (data) {
        //         // console.log(data);
        //         // var dataSource = data;
        //
        //         var _source = $.map(data, function (item) {
        //             return {
        //                 label: item.fname,
        //                 value: item.fname,
        //                 fnumber: item.fnumber
        //             }
        //         });
        //         $("#js-receive-bank").autocomplete({
        //             // source: _source,
        //             source: function (request, response) {
        //                     response($.map(dataSource, function (item) {
        //                         return {
        //                             label: item.mallName,
        //                             value: item.id
        //                         }
        //                     }));
        //                 },
        //             minLength: 2,
        //             select: function( event, ui ) {
        //                 var reveiveBankId = ui.item.fnumber;
        //                 $("#receiveBankId").val(reveiveBankId);
        //                 this.value = ui.item.label;
        //                 return false;
        //             }
        //         });
        //     }
        // });

        $.ajax({
            url: financeWeb_Path + 'cashDeposit/getPayeeByPayId.htm',
            type: "post",
            data:{mallId:$("#_mallId").val(),payId:$("#paymentOrderId").val()},
            dataType: "json",
            success: function (data) {
                if (data.code == -1) {
                    alert(data.message)
                }else{
                    dataList = data ;
                    console.log(data);
                    $('.payName').find('.dropdown-menu').html("");
                    $.each(data, function (i, value) {
                        _html =_html +
                            "<li><a data-value='" + value.main.payNameCode + "'>" + value.main.payName + "</a></li>";

                    })
                    $('.payName').find('.dropdown-menu').append(_html);
                }
            }
        });
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});

function validateForm(obj) {
    var flag = true;
    var receiveName = $.trim($(obj).find("input[name=receiveName]").val());
    var receiveBank = $.trim($(obj).find("input[name=receiveBankId]").val());
    var receiveAccount = $.trim($(obj).find("input[name=receiveAccount]").val());
    var payName = $.trim($(obj).find("input[name=payName]").val());
    var payBank = $.trim($(obj).find("input[name=payBank]").val());
    var payAccount = $.trim($(obj).find("input[name=payAccount]").val());

    var  transferCode= $("#transferCode").val();
    if (transferCode== "" || transferCode == null) {
        flag = false;
        alert("结算方式不能为空");
        return false;
    }
    if (!flag) return;
    if (receiveName == "" || receiveName == null) {
        alert("收款单位不能为空！","","",function (){
            $(obj).find("input[name=receiveName]").focus();
        })
        return false;
    }
    if (!flag) return;
    if(regeMatch(receiveName)){
        alert("请勿输入特殊字符！","","",function (){
            $(obj).find("input[name=receiveName]").focus();
        })
        return false;
    }
    if (!flag) return;
    if (receiveBank == "" || receiveBank == null) {
        alert("收款银行不能为空！","","",function (){
            $(obj).find("input[name=receiveBank]").focus();
        })
        return false;
    }
    if (!flag) return;
    if(regeMatch(receiveBank)){
        alert("请勿输入特殊字符！","","",function (){
            $(obj).find("input[name=receiveBank]").focus();
        })
        return false;
    }
    if (!flag) return;
    if (receiveAccount == "" || receiveAccount == null) {
        alert("银行账号不能为空！","","",function (){
            $(obj).find("input[name=receiveAccount]").focus();
        })
        return false;
    }else if(!isNumberss(receiveAccount)){
        alert("银行账号只能填写数字！","","",function (){
            $(obj).find("input[name=receiveAccount]").focus();
        })
        return false;
    }
    if (!flag) return;
    if(regeMatch(receiveAccount)){
        alert("请勿输入特殊字符！","","",function (){
            $(obj).find("input[name=receiveAccount]").focus();
        })
        return false;
    }
    if (!flag) return;
    if (payName == "" || payName == null) {
        alert("付款单位不能为空！","","",function () {
            $(obj).find("input[name=payName]").focus();
        });
        return false;
    }
    if(regeMatch(payName)){
        alert("请勿输入特殊字符！");
        $(obj).find("input[name=payName]").focus();
        return false;
    }
    if (!flag) return;
    if (payBank == "" || payBank == null) {
        alert("付款银行不能为空！","","",function (){
            $(obj).find("input[name=payBank]").focus();
        })
        return false;
    }
    if (!flag) return;
    if(regeMatch(payBank)){
        alert("请勿输入特殊字符！","","",function (){
            $(obj).find("input[name=receiveBank]").focus();
        })
        return false;
    }

    return true;
}

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

function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}

function checkStatus(param) {
    if (param == 0 || param == 1 || param == 2 || param == 5) {
        $(".transfer-btn").attr("disabled", true);
        $("form input").attr("disabled", true);
        $(".zl-dropdown-inline").attr("disabled".true);
        // $(".uncheck-btn").show();
    }
    if(param == 3 || param == 4){
        $(".save-btn").show();
        $(".submit-btn").show();
    }
    if(param == 6){
        $(".save-btn").show();
    }
}

function isChanged(flag){
    alert("页面有修改未保存，请先执行保存");
}

function getBank(el){
    $(el).closest("td").next("td").find("input").val($(el).data("bank"));
    $(el).closest("td").find("input[name=payBank]").val($(el).data("bankname"));
    // $(el).closest("td").find("input[name^=detailList][name$=openBank]").val($(el).data("openbank"));
}


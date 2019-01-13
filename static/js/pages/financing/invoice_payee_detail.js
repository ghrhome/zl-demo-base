/*
   收款单位
 */
var dataList={};
var pageView=(function($){
    var _html="";

    var bankList={};


    var pageView={};
        pageView.init=function() {
        $("#preloader").fadeOut("fast");
        var page = $("#payee-unit-detail");
        var settlementTemplate = page.find("[name=template-for-detail]");

        if($("#_mallId").val() !=""){
            getPayee($("#_mallId").val());
        }

        //下拉
        $(".zl-dropdown-inline").ysdropdown({
            callback: function (val, $elem) {
                if ($elem.data("id") == "projects") {
                    $("#zl-table-payee-unit").find("tbody tr").remove();
                    $("form").find("input[name=mallId]").val(val);
                    getPayee(val);
                }
                if ($elem.data("id") == "payee-unit") {
                    // $elem.find("input[name^=detailList][name$=payee]").val(payeeUnit.orgFNubmer);
                    $elem.closest("td").find("input[name^=detailList][name$=payeeName]").val($elem.find("button").html());
                    $elem.closest("td").find("input[name^=detailList][name$=taxNo]").val(dataList[val].payeeInfo.taxNo);
                    $elem.closest("td").find("input[name^=detailList][name$=address]").val(dataList[val].payeeInfo.address);
                    $elem.closest("td").find("input[name^=detailList][name$=tel]").val(dataList[val].payeeInfo.tel);
                    // $elem.find("input[name^=detailList][name$=mallContBankId]").val();
                    // setAcctBankDropDown(val, $elem);
                    $elem.closest('td').next("td").find("button").html("");
                    $elem.closest('td').next("td").find(".dropdown-menu").html("");
                    $elem.closest('td').next("td").next("td").find("input").val("");
                    $.each(dataList[val].bankInfo,function(i,value){
                        var bankList = "<li><a data-value='" + value.bankAccountId + "' data-bank='" + value.bankAccount + "' data-mallContBank='" + value.mallContBankId + "'" +
                        "data-openbank='" + value.openBank + "' onclick='getBank(this)'>" + value.openBank + "</a></li>";
                        $elem.closest('td').next("td").find(".dropdown-menu").append(bankList);
                    })

                }
                    if ($elem.data("id") == "fee-type") {
                        // $elem.parents("tr").find("input[name$=itemTypeName]").val($elem.find("button").html());
                        $elem.closest("td").find("input[name^=detailList][name$=itemTypeName]").val($elem.find("button").html());
                    }
                // $().onchange()
                    if ($elem.data("id") == "bank") {
                        // $elem.closest('td').next("td").find("input[name$=bankAccount]").val("");
                        // $elem.closest('td').next("td").find("input[name$=bankAccount]").val(_bankAccount);
                        // $elem.parents("tr").find("input[name$=bankAccount]").val(_bankAccount);
                    }
            }
        });

        //保存
        page.on("click", ".save-btn", function () {
            if (checkForm()) {
                var mallId = $("form").find("input[name=mallId]").val();
                if (!mallId) {
                    alert("请选择项目");
                    return false;
                }
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "invoicePayee/save.htm",
                    type: 'post',
                    data: $('form').serialize(),
                    dataType: 'json',
                    error: function () {
                        alert("系统异常");
                    },
                    success: function (res) {
                        // res = JSON.parse(res);
                        if (res.code == "0") {
                            //window.location = "detail.htm?serviceChargeId=" + res.data;
                            alert("保存成功", "", "", function () {
                                window.location = "index.htm";
                            });
                        } else {
                            alert(res.msg);
                        }
                    }
                });
                pageView.loadingHide();
            }
        });

        var index = {detailIndex: $("#indexs").val() - 1};
        page.on("click", ".tr-add", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var mallId = $("input[name=mallId]").val();
            if (mallId == "") {
                alert("请先选择项目");
                return;
            }
            index.detailIndex++;
            var node = settlementTemplate.tmpl(index);

            $(this).closest(".zl-block-section").find(".zl-section-content table tbody").append(node);
            // $(this).closest(".zl-block-section").find(".zl-dropdown-inline").ysdropdown("init");
            initDropdown();
            $("#zl-table-payee-unit").find("tbody tr:last-of-type").find(".payNameAdd .dropdown-menu").append(_html);
            // $('.payNameAdd').find('.dropdown-menu').append(_html);
        });
        page.on("click", ".delete-btn", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).closest("tr").remove();
        });

        function checkForm() {
            var flag = true;
            var itemTypeIds = new Array();
            $("#zl-table-payee-unit").find("input[name^=detailList][name$=itemType]").each(function (i) {
                if (!$(this).val() || $(this).val() == '') {
                    flag = false;
                    alert("费项类型不能为空");
                    return false;
                }
                itemTypeIds.push($(this).val());

            });
            if (!flag) return;
            var showTimes = 0;
            for (var i = 0; i < itemTypeIds.length; i++) {
                for (var j = 0; j < itemTypeIds.length; j++) {
                    if (itemTypeIds[i] == itemTypeIds[j]) showTimes++;
                }
                if (showTimes >= 2) {
                    console.log("showTimes : " + showTimes);
                    flag = false;
                    alert("费项类型重复");
                    return false;
                }
                showTimes = 0;
            }
            if (!flag) return;
            $("#zl-table-payee-unit").find("input[name^=detailList][name$=payee]").each(function () {
                if (!$(this).val()) {
                    flag = false;
                    alert("收款单位不能为空");
                    return false;
                }
            });
            if (!flag) return;
            $("#zl-table-payee-unit").find("input[name^=detailList][name$=openBank]").each(function () {
                if (!$(this).val()) {
                    flag = false;
                    alert("开户银行不能为空");
                    return false;
                }
            });
            return flag;
        }

        function getPayee(_mallId){
            if (_mallId != "") {
                $.ajax({
                    url: financeWeb_Path + 'invoicePayee/getPayeeByMallId.htm',
                    type: "post",
                    data: {mallId: _mallId},
                    dataType: "json",
                    success: function (data) {
                        if (data.code == 0) {
                            alert(data.message)
                        } else {
                            console.log(data);
                            dataList = data ;
                            $('.payName').find('.dropdown-menu').html("");
                            // $('.bank').find('.dropdown-menu').html("");
                            // // $('#payAccount').val("");
                            $.each(data, function (i, value) {
                                // console.log(value.main);
                                _html =_html+
                                    "<li><a data-value='" + value.payeeInfo.payee + "'>" + value.payeeInfo.payeeName + "</a></li>";

                            //     $.each(value.invoicePayee, function (i, value) {
                            // //         console.log(value);
                            // //         // $('#payAccount').val("");
                            //          var _htmlChildren =
                            //             "<li><a data-value='" + value.bankAccountId + "' onclick='$(\"#bankAccount\").val(" + value.bankAccount + ")'>" + value.openBank + "</a></li>";
                            //         $('.bank').find('.dropdown-menu').append(_htmlChildren);
                            //     })
                            });

                            $('.payName').find('.dropdown-menu').append(_html);
                        }
                    }
                });
            }
        }



    pageView.ysDateInit=function(){
        $("#js-month-picker").ysDatepicker({
            dateType:"year",//year,day
            callback:function(value){
                console.log("======================")
                console.log(value);
            }
        })
    }

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }
    }

    return pageView;

})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});

function getBank(el){
    $(el).closest("td").next("td").find("input").val($(el).data("bank"));
    $(el).closest("td").find("input[name^=detailList][name$=mallContBankId]").val($(el).data("mallcontbank"));
    $(el).closest("td").find("input[name^=detailList][name$=openBank]").val($(el).data("openbank"));
}

function initDropdown() {
    $(".zl-dropdown-inline").ysdropdown({
        callback: function (val, $elem) {
            if ($elem.data("id") == "projects") {
                $("#zl-table-payee-unit").find("tbody tr").remove();
                $("form").find("input[name=mallId]").val(val);
                getPayee(val);
            }
            if ($elem.data("id") == "payee-unit") {
                // $elem.find("input[name^=detailList][name$=payee]").val(payeeUnit.orgFNubmer);
                $elem.closest("td").find("input[name^=detailList][name$=payeeName]").val($elem.find("button").html());
                $elem.closest("td").find("input[name^=detailList][name$=taxNo]").val(dataList[val].payeeInfo.taxNo);
                $elem.closest("td").find("input[name^=detailList][name$=address]").val(dataList[val].payeeInfo.address);
                $elem.closest("td").find("input[name^=detailList][name$=tel]").val(dataList[val].payeeInfo.tel);

                $elem.closest('td').next("td").find("button").html("");
                $elem.closest('td').next("td").find(".dropdown-menu").html("");
                $elem.closest('td').next("td").next("td").find("input").val("");
                $.each(dataList[val].bankInfo,function(i,value){
                    var bankList = "<li><a data-value='" + value.bankAccountId + "' data-bank='" + value.bankAccount + "' data-mallContBank='" + value.mallContBankId + "'" +
                        "data-openbank='" + value.openBank + "' onclick='getBank(this)'>" + value.openBank + "</a></li>";
                    $elem.closest('td').next("td").find(".dropdown-menu").append(bankList);
                })

            }
            if ($elem.data("id") == "fee-type") {
                $elem.closest("td").find("input[name^=detailList][name$=itemTypeName]").val($elem.find("button").html());
            }
            // $().onchange()
            if ($elem.data("id") == "bank") {

            }
        }
    });
}
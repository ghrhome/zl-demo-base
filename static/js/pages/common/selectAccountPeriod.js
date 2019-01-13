/**
 * Created by whobird on 2018/4/13.
 */
var selectAccountList = (function ($, selectAccountList) {
    var su = selectAccountList;
    var selectCallback = undefined;
    var itemTemp;
    var dataOri = {};
    var accountSelectMod;
    var selectedAccounts = {};

    function _insertTemp() {
        $.get(base_Path + "scpStatic/static/js/pages/common/accountPeriodSelectModal.html", function (tmpl) {
            $("body").append(tmpl);
            var _itemTempHtml = $("#account-item-template").html();
            itemTemp = Handlebars.compile(_itemTempHtml);
            _render();
            su.eventInit();
        });
    }

    function _render() {
        var source = $("#account-period-template").html();
        var template = Handlebars.compile(source)
        var context = {
            accountList: dataOri.accountPeriodList
        };
        var html = template(context);
        $(".zl-page").append(html);
    }


    function _setAccountsChecked() {
        var _accountsList = dataOri.accountPeriodList;
        //当渲染完accountlist后，根据selectedAccounts渲染当前item的selected状态
        $.each(_accountsList, function (i, account) {
            if (account.finContId  && typeof selectedAccounts[account.finContId] !== "undefined") {
                var _index = i;
                $(".js-account-list").find("li").eq(_index).addClass("selected");
            }
        })
    };

    function _setSelectedAccounts(selectedAccounts) {
        var _accountList = [];

        $.each(selectedAccounts, function (accountId, account) {
            _accountList.push(account);
        });

        var _html = itemTemp({
            accountList: _accountList
        });

        $(".js-account-selected").empty().append(_html);
    };

    su.eventInit = function () {
        //选取账期，单选/多选形式
        $("body").on("click", ".js-account-list>li", function (e) {
            e.preventDefault();
            if ($(this).hasClass("selected")) {
                var _finContId = $(this).attr("data-finContId");
                delete selectedAccounts[_finContId];
                if (accountSelectMod == "single") {
                    $(".js-account-list>li").removeClass("selected");
                } else {
                    $(this).removeClass("selected");
                }
            } else {
                var _finContId = $(this).attr("data-finContId");
                var feeType = $(this).attr("data-feeType");
                var _index = $(this).data("index");
                var _chargeItemName = $(this).attr("data-chargeItemName");
                var _startDate = $(this).attr("data-startDate");
                var _endDate = $(this).attr("data-endDate");
                var _financePeriod = $(this).attr("data-financePeriod");
                var _leftAmount = $(this).attr("data-leftAmount");
                var _receAmount = $(this).attr("data-receAmount");
                var _deAmount = $(this).attr("data-deAmount");
                var _value = $(this).find("span").text();
                if (accountSelectMod == "single") {
                    selectedAccounts = {};
                    $(".js-shop-list>li").removeClass("selected");
                }
                selectedAccounts[_finContId] = {
                    finContId: _finContId,
                    feeType:feeType,
                    index: _index,
                    chargeItemName: _chargeItemName,
                    startDate: _startDate,
                    endDate: _endDate,
                    financePeriod: _financePeriod,
                    leftAmount: _leftAmount,
                    receAmount: _receAmount,
                    deAmount: _deAmount,
                    value: _value
                }
                $(this).addClass("selected");
            }
            _setSelectedAccounts(selectedAccounts);
        });

        //删除账期
        $("body").on("click", ".js-account-selected>li", function (e) {
            e.preventDefault();
            var $item = $(this);
            var _finContId = $item.attr("data-finContId");
            var item = selectedAccounts[_finContId];
            delete selectedAccounts[_finContId];
            $item.remove();
            $(".js-account-list").find("li").each(function (i, item) {
                if ($(this).attr("data-finContId") == _finContId) {
                    $(this).removeClass("selected");
                }
            })
        });
        //确定
        $("body").on("click", "#accountPeriodSelectModal .js-submit", function (e) {
            e.preventDefault();
            var _selectedAccounts = $.extend(true, {}, selectedAccounts);
            selectCallback(_selectedAccounts);
            su.modalHide();
        })
        //取消
        $("body").on("click", "#accountPeriodSelectModal .js-cancel", function (e) {
            e.preventDefault();
            su.modalHide();
        })
        //重置
        $("body").on("click", "#accountPeriodSelectModal .js-reset", function (e) {
            e.preventDefault();
            su.reset();
        })

    }

    su.modalShow = function (callback, data) {
        $("#accountPeriodSelectModal").modal("show");

        if (typeof callback !== "undefined") {
            selectCallback = callback;
        }
        if (typeof data !== 'undefined') {
            selectedAccounts = $.extend(selectedAccounts, data);
            _setSelectedAccounts(selectedAccounts);
            _setAccountsChecked();
        }

    }


    su.reset = function () {
        selectedAccounts = {};
        //$(".js-account-list").empty();
        $(".js-account-selected").empty();
    }
    su.modalHide = function () {
        $("#accountPeriodSelectModal").modal("hide");
        su.reset();
        selectCallback = undefined;
    }


    su.init = function (data, mod) {
        dataOri = $.extend(true, {}, data);
        if (typeof mod !== 'undefined' && (mod == 'single' || mod == 'multi')) {
            accountSelectMod = mod
        } else {
            accountSelectMod = "single";
        }
        _insertTemp();
    };

    su.update=function(data,mod){
        dataOri=$.extend(true,{},data);
        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            accountSelectMod=mod
        }else{
            accountSelectMod="single";
        }
        $("#accountPeriodSelectModal").remove();
        var _itemTempHtml=$("#account-item-template").html();
        itemTemp=Handlebars.compile(_itemTempHtml);
        _render();
    }

    return su;
})(jQuery, selectAccountList || {});


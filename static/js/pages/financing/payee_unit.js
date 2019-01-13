/**
 * Created by whobird on 2018/4/11.
 */
var invoiceList = [];
var receiptList = [];
var pageView=(function($){

    var container = $("#payee-unit");
    var pageView={};

    pageView.eventInit=function() {

        container.on("click", ".zl-dropdown-inline ul.dropdown-menu li a", function(){
            var _div = $(this).closest("div.zl-dropdown-inline");

            var text = $(this).text();
            _div.find("button").text(text);
            var val = $(this).data("value");
            _div.find("input[type=hidden]").val(val);

            var type = _div.data("id");
            if(type == "invoice-bank"){
                // 开票信息开户银行选择
                var _table = _div.closest("table");
                _table.find("input[name$=bankName]").val(text);
                _table.find("input[name$=accountNo]").val($(this).data("no"));
            }
            if(type == "receipt-bank-in"){
                // 开票信息开户银行选择
                var _table = _div.closest("table");
                _table.find("input[name$=incomeBankName]").val(text);
                _table.find("input[name$=incomeAccountNo]").val($(this).data("no"));
            }
            if(type == "receipt-bank-center"){
                // 开票信息开户银行选择
                var _table = _div.closest("table");
                _table.find("input[name$=centreBankName]").val(text);
                _table.find("input[name$=centreAccountNo]").val($(this).data("no"));
            }
            if(type == "fee-type"){
                var _tr = _div.closest("tr");
                _tr.find("input[name$=itemTypeName]").val(text);
            }
            if(type=="invoice-code" || type=="receipt-code"){
                _div.find("button").text(val);
            }
        });

        container.on("click", "em.invoice-add-btn", function(){
            var _target = $("#zl-section-collapse-table-2");
            var index = -1;
            var _last = _target.find("table:last");
            if(_last.length>0){
                index = _last.data("index");
            }
            var tpl = $("#invoiceTableTpl").tmpl({},{
                index : function(){
                    return ""+index;
                },
                indexAdd : function(){
                  index++;
                  return "";
                }
            });

            pageView.autoComplete(tpl.find("input.payee-search"));
            _target.append(tpl);
        });

        container.on("click", "a.save-btn", function(){
            var url = "";
            var type = $(this).data("type");
            if(type == "invoice"){
                url = 'invoiceSave.htm';
            }
            if(type == "receipt"){
                url = 'receiptSave.htm';
            }

            if(url == ""){
                return;
            }

            var _table = $(this).closest('table');
            if(!tableFormCheck(_table)){
                return;
            }

            pageView.loadingShow();
            var params = {
                mallId : container.find("input[name=mallId]").val(),
                mainUnitId : container.find("input[name=id]").val(),
            };
            _table.find("input").each(function(){
                var _input = $(this);
                var name = _input.attr("name");
                name = name.substring(name.lastIndexOf(".")+1);
                params[name] = _input.val();
            });
            $.ajax( {
                url: url,
                type : "post",
                dataType : "json",
                data : params,
                error : function (res) {
                    pageView.loadingHide();
                    alert("系统繁忙");
                },
                success : function(rdata) {
                    pageView.loadingHide();
                    alert(rdata.msg, "", "", function(){
                        if (rdata && rdata.code=="0") {
                            var obj = rdata.data;
                            _table.find("input[name$=id]").val(obj.id);
                            var code = type + "No";
                            _table.find("input[name$="+type+"No]").val(obj[code]);

                            // 刷新下拉列表
                            pageView.codeListGet(params["mallId"]);

                            return;
                        }
                    });
                }
            });
        });

        container.on("click", "em.receipt-add-btn", function(){
            var _target = $("#zl-section-collapse-table-3");
            var index = -1;
            var _last = _target.find("table:last");
            if(_last.length>0){
                index = _last.data("index");
            }
            var tpl = $("#receiptTableTpl").tmpl({},{
                index : function(){
                    return ""+index;
                },
                indexAdd : function(){
                    index++;
                    return "";
                }
            });

            pageView.autoComplete(tpl.find("input.payee-search"));
            _target.append(tpl);
        });

        container.on("click", "em.invoice-del-btn,em.receipt-del-btn", function(){
            $(this).closest("table").remove();
        });

        container.on("click", "button.protocol-add-btn", function(e){
            e.preventDefault();

            var _modal = $("#modal-protocol-add");
            _modal.find("input").val("");
            // 协议类型
            var protocolType = $(this).data("type");
            _modal.find("input[name=protocolType]").val(protocolType);
            _modal.modal("show");
        });

        container.on("click", "em.fee-add-btn", function(){
            var _table = $(this).closest("table").find("tbody");
            var protocolIndex = _table.closest("div.zl-section").data("index");

            var index = 0;
            var _tr = _table.find("tr:last");
            if(_tr.length > 0){
                index = _tr.data("index") + 1;
            }

            var tpl =
                $("#feeTrTpl").tmpl({
                    protocolIndex : protocolIndex,
                    index : index,
                });

            codeTplFilled(tpl.find("ul.invoice-ul"), tpl.find("ul.receipt-ul"));

            tpl.appendTo(_table);
        });

        container.on("click", "em.fee-del-btn", function(){
            $(this).closest("tr").remove();
        });

        container.on("click", "a.protocol-save-btn", function(){
            var _table = $(this).closest('div.zl-section').find("tbody");
            if(!tableFormCheck(_table)){
                return;
            }

            pageView.loadingShow();
            var params = {
                mallId : container.find("input[name=mallId]").val(),
                mainUnitId : container.find("input[name=id]").val(),
                id : _table.find("input[name$=id]").val(),
                protocolName : _table.find("input[name$=protocolName]").val(),
                protocolType : _table.find("input[name$=protocolType]").val(),
            };
            var detailList = [];
            _table.find("tr").each(function(){
                var detail = {};
                $(this).find("input").each(function(){
                    var _input = $(this);
                    var name = _input.attr("name");
                    name = name.substring(name.lastIndexOf(".")+1);
                    detail[name] = _input.val();
                });
                detailList.push(detail);
            });
            params["protocolDetailList"] = JSON.stringify(detailList);

            console.log(params);

            $.ajax( {
                url: "protocolSave.htm",
                type : "post",
                dataType : "json",
                data : params,
                error : function (res) {
                    pageView.loadingHide();
                    alert("系统繁忙");
                },
                success : function(rdata) {
                    pageView.loadingHide();
                    alert(rdata.msg, "", "", function(){
                        if (rdata && rdata.code=="0") {
                            var obj = rdata.data;
                            var _input = _table.find("input[name$=id]");
                            if(_input.val() == ""){
                                $("#checkGroupTpl").tmpl(obj).appendTo(container.find("div.zl-block div.zl-check-btn-group"));
                                _input.val(obj.id);
                            }
                            return;
                        }
                    });
                }
            });
        });

        container.on("click", "em.protocol-del-btn", function(){
            $(this).closest("div.zl-section").remove();
        });

        container.on("click", "div.zl-block a.zl-check-btn", function(){

            if($(this).hasClass("active")){
                return;
            }

            var _group = container.find("div.zl-block div.zl-check-btn-group");
            _group.find("a.zl-check-btn").removeClass("active");
            $(this).addClass("active");

            var _div = container.find("div.zl-block div.zl-block-content");
            var protocol = $(this).data("protocol");
            if(!protocol || protocol == ""){
                _div.find("div.zl-section").show();
                return;
            }

            _div.find("div.zl-section").hide();
            _div.find("div.zl-section").each(function(){
                if($(this).find("input[name$=id]").val() == protocol){
                    $(this).show();
                    return true;
                }
            });
        });

        $("#modal-protocol-add").on("click", "button.protocol-confirm-btn", function(){
            var _modal = $("#modal-protocol-add");
            var protocolType = _modal.find("input[name=protocolType]").val();
            var protocolName = _modal.find("input[name=protocolName]").val().trim();

            if(protocolName==""){
                alert("请输入合同类型名称");
                return;
            }
            var flag = true;
            container.find("div.zl-block div.zl-check-btn-group a.zl-check-btn").each(function () {
                if($(this).text() == protocolName){
                    alert("已存在相同的合同类型名称["+protocolName+"]");
                    flag = false;
                    return true;
                }
            });
            if(!flag){
                return;
            }

            _modal.modal("hide");

            var _target = $("div.zl-block div.zl-block-content");

            var protocolIndex = 0;
            var lastDiv = _target.find("div.zl-section:last");
            if(lastDiv.length > 0){
                protocolIndex = lastDiv.data("index") + 1;
            }

            $("#protocolTpl").tmpl({
                protocolIndex : protocolIndex,
                protocolType : protocolType,
                protocolName : protocolName
            }).appendTo(_target);
        });

        container.on("click", "a.save-all-btn", function(){
            var flag = true;
            // 开票单位
            container.find("#zl-section-collapse-table-2 table").each(function(){
                if(!tableFormCheck($(this))){
                    flag = false;
                    return true;
                }
            });
            if(!flag){
                return;
            }
            // 收款单位
            container.find("#zl-section-collapse-table-3 table").each(function(){
                if(!tableFormCheck($(this))){
                    flag = false;
                    return true;
                }
            });
            if(!flag){
                return;
            }
            // 合同类型
            container.find("div.zl-block div.zl-block-content div.zl-section").each(function(){
                if(!tableFormCheck($(this))){
                    flag = false;
                    return true;
                }
            });
            if(!flag){
                return;
            }

            pageView.loadingShow();
            $.ajax( {
                url: "save.htm",
                type : "post",
                dataType : "json",
                data : container.find("form").serialize(),
                error : function (res) {
                    pageView.loadingHide();
                    alert("系统繁忙");
                },
                success : function(rdata) {
                    pageView.loadingHide();
                    alert(rdata.msg, "", "", function(){
                        if (rdata && rdata.code=="0") {
                            window.location = "toDetail.htm?mallId="+container.find("input[name=mallId]").val();
                        }
                    });
                }
            });
        });
    };

    pageView.autoComplete = function(_target){
        _target.autocomplete({
            source: function( request, response ) {
                $.ajax( {
                    url: "payeeNameGet.htm",
                    type:"POST",
                    dataType:"json",
                    data: {payeeName: request.term},
                    success: function(rdata) {
                        if(rdata && rdata.code=="0"){
                            response(
                                $.map(rdata.data, function(item) {
                                    return { label: item.orgFName, value: item.orgFNubmer}
                                })
                            );
                        }
                    }
                } );
            },
            minLength: 1,
            select: function(event, ui) {

                var _input = $(this);
                _input.val(ui.item.label);
                _input.closest("td").find("input[type=hidden]").val(ui.item.value);

                $.ajax({
                    url: "bankListQuery.htm",
                    type: "POST",
                    dataType: "json",
                    data: {
                        orgFNumber: ui.item.value
                    },
                    success: function (rdata) {
                        if(rdata && rdata.code=="0"){
                            // console.log(rdata.data);
                            var _target = _input.closest("table").find("ul.bank-list-ul");
                            _target.empty();
                            $("#bankSelectedTpl").tmpl(rdata.data).appendTo(_target);
                        }
                    }
                });
                return false;
            }
        });
    }

    /**
     * 刷新编码列表
     * @type {Array}
     */
     pageView.codeListGet = function(mallId){
        $.ajax( {
            url: "codeListGet.htm",
            type : "post",
            dataType : "json",
            data : {mallId : mallId},
            error : function (res) {
                pageView.loadingHide();
                alert("系统繁忙");
            },
            success : function(rdata) {
                pageView.loadingHide();

                $("ul.invoice-ul").empty();
                $("ul.receipt-ul").empty();

                if (rdata && rdata.code=="0") {
                    var obj = rdata.data;
                    invoiceList = obj.invoiceList || [];
                    receiptList = obj.receiptList || [];
                    codeTplFilled($("ul.invoice-ul"), $("ul.receipt-ul"));
                }
            }
        });
    };

    pageView.loadingShow = function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function(){
        $(".zl-loading").fadeOut();
    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.eventInit();
        pageView.autoComplete(container.find("input.payee-search"));

        var mallId = container.find("input[name=mallId]").val();
        if(mallId != ""){
            pageView.codeListGet(mallId);
        }

    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});

function tableFormCheck(_table){

    var isChecked = true;
    _table.find(".required:visible").each(function () {
        var title = $(this).attr("title") || "必填项";
        var _this;
        if ($(this).find("select").length > 0) {
            _this = $(this).find("select");
        } else if ($(this).find("input[type!='hidden'][type='ibhradio']").length > 0) {
            _this = $($(this).find("input[type='radio']:checked"));
        } else if ($(this).find("input[type!='hidden']").length > 0) {
            _this = $(this).find("input[type!='hidden']");
        } else if ($(this).find("textarea").length > 0) {
            _this = $($(this).find("textarea"));
        } else {
            _this = $(this).find("input[type!='hidden']");
        }

        if ((_this.val() == "" || _this.val() == undefined) && (_this.attr("name") != undefined && _this.attr("name").indexOf("bootstrapDropdown") == -1)) {
            var msg = title + "不能为空!";
            alert(msg);
            isChecked = false;
            _this.focus();
            return false;
        }

        //画面中的 下拉选择 必填项判断
        if ($(this).find(".zl-dropdown-btn").length > 0) {
            _this = $(this).find(".zl-dropdown-btn");
            if (_this.html() == "" || _this.html() == undefined || _this.html().indexOf("请选择") > 0) {
                var msg = title + "不能为空!";
                alert(msg);
                isChecked = false;
                _this.focus();
                return false;
            }
        }
    });

    return isChecked;
}

function codeTplFilled(_invoiceUl, _receiptUl){
    $("#invoiceUlTpl").tmpl(invoiceList).appendTo(_invoiceUl.empty());
    $("#receiptUlTpl").tmpl(receiptList).appendTo(_receiptUl.empty());
}
var pageView=(function($){
    var pageView={};

    // pageView.showKeyPress=function(evt,callback) {
    //     evt = (evt) ? evt : window.event
    //     // return pageView.checkSpecificKey(evt.keyCode);
    //     var item=pageView.checkSpecificKey(evt.keyCode);
    //     if (typeof callback === "function"){
    //         callback(item);
    //     }
    // }

    pageView.inputNumberCheck = function() {
        $("form input").on("input", function (event) {
            var _that = $(this);
            var number = _that.attr("number");
            var decimal = _that.attr("decimal");
            if (number == "true" && decimal == "false") {
                var ck = isNaN(parseInt(_that.val()));
                _that.val(ck ? "0" : parseInt(_that.val()));
            }
        });
    }

    pageView.checkSpecificKey=function(keyCode) {
        var specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘’";//Specific Key list
        var realkey = String.fromCharCode(keyCode);
        var flg = false;
        flg = (specialKey.indexOf(realkey) >= 0);
        if (flg) {
            alert('请勿输入特殊字符: ' + realkey,"","");
            return false;
        }
        return true;
    }
    
    pageView.autocomplete=function () {
        $( ".js-search_1" ).autocomplete({
            source: function( request, response ) {
                $.ajax( {
                    url: "getData.htm",
                    type:"POST",
                    dataType:"json",
                    data: {
                        accFNumber: request.term
                    },
                    success: function( data ) {
                        response( $.map( data["data"], function( item ) {
                            return {
                                label: item.accFNumber ,
                                value: item.accFName,
                                assCode: item.assFNumber
                            }
                        }));
                    }
                } );
            },
            minLength: 1,
            select: function( event, ui ) {
                this.value = ui.item.label;
                var ass = certAsstNumMap[ui.item.assCode] || {};
                $(this).parents("tr").find("input[name=accountName]").val(ui.item.value);
                $(this).parents("tr").find("input[name=auxiliaryAccount]").val(ass.assName1);
                $(this).parents("tr").find("input[name=auxiliaryAccount2]").val(ass.assName2);
                return false;
            }
        });
    }

    pageView.formPost=function(url, params, target){
        var temp = document.createElement("form");
        temp.enctype = "multipart/form-data";
        temp.action = url;
        temp.method = "post";
        temp.style.display = "none";

        if(target){
            temp.target = target;
        }else{
            // showLoading();
        }

        for (var x in params) {
            var opt = document.createElement("input");
            opt.name = x;
            opt.value = params[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);

        temp.submit();
    }

    pageView.pageInit=function(){
        pageView.inputNumberCheck();

        $(".save-btn").on("click", function () {
            if (!requiredTextInputCheck()) return;
            var url="certificateModelSave.htm";
            var arr1 = getEntriesBySelector("#entriesContentBody1 tr:visible", '0'); //默认分录
            var arr2 = getEntriesBySelector("#entriesContentBody2 tr:visible", '1'); //代收分录
            var arr3 = getEntriesBySelector("#entriesContentBody3 tr:visible", '2'); //代付分录

            var finCertificateModel = $("#zl-section-collapse-table-1 input").serializeArray();
            var finCertificateModelObj = {};
            $.each(finCertificateModel, function (i, map) {
                if(!(map.name in finCertificateModelObj)){
                    finCertificateModelObj[map.name] = map.value;
                }
            });
            var data = {
                finCertificateEntries : JSON.stringify(arr1.concat(arr2).concat(arr3)),
                finCertificateModel : JSON.stringify(finCertificateModelObj)
            };
            pageView.loadingShow();
            $.post(url,data,function (result) {
                pageView.loadingHide();
                var json=eval("("+result+")");
                if(json["code"] == 0){
                    alert(json["msg"],"","", function () {
                        window.location = './certificateModelList.htm'
                    });
                }else {
                    alert(json["msg"]);
                }
            });
        });

        //添加行
        $(".zl-glyphicon-blue.add1").on("click", function () {
            var index = new Date().getTime();
            var _tr =  $("#tr-hidden").clone().removeAttr("id").removeAttr("hidden").attr("index", index);
            var _btn =  $("#del-button-hidden").clone().removeAttr("id").removeAttr("hidden").attr("index", index);
            $("#entriesContentBody1").append(_tr);
            $("#entriesDelBody1").append(_btn);
            pageView.dropdownInit();
            pageView.autocomplete();
        });
        //添加行
        $(".zl-glyphicon-blue.add2").on("click", function () {
            var index = new Date().getTime();
            var _tr =  $("#tr-hidden").clone().removeAttr("id").removeAttr("hidden").attr("index", index);
            var _btn =  $("#del-button-hidden").clone().removeAttr("id").removeAttr("hidden").attr("index", index);
            $("#entriesContentBody2").append(_tr);
            $("#entriesDelBody2").append(_btn);
            pageView.dropdownInit();
            pageView.autocomplete();
        });
        //添加行
        $(".zl-glyphicon-blue.add3").on("click", function () {
            var index = new Date().getTime();
            var _tr =  $("#tr-hidden").clone().removeAttr("id").removeAttr("hidden").attr("index", index);
            var _btn =  $("#del-button-hidden").clone().removeAttr("id").removeAttr("hidden").attr("index", index);
            $("#entriesContentBody3").append(_tr);
            $("#entriesDelBody3").append(_btn);
            pageView.dropdownInit();
            pageView.autocomplete();
        });
        //删除行
        $("body").on("click", ".entriesDelIndex", function(){
            var _this = $(this);
            var entriesDelIndex = $(this).attr("index");
            $(".entriesContentIndex").each(function () {
                var entriesContentenIndex = $(this).attr("index");
                if(entriesDelIndex == entriesContentenIndex){
                    $(this).remove();
                    _this.remove();
                }
            })
        });
        var ys_main_swiper = new Swiper('#zl-floor-main-table1', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });
        var ys_main_swiper2 = new Swiper('#zl-floor-main-table2', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });
        var ys_main_swiper3 = new Swiper('#zl-floor-main-table3', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });

        $("input[name=isCollect]").on("change", function(){
            $(".item2").toggle();
        });
        $("input[name=isPay]").on("change", function(){
            $(".item3").toggle();
        });
        function requiredTextInputCheck() {
            var res = true;
            $("tr:not(#tr-hidden) td.required").each(function() {
                var msg = ($(this).attr("title") || "必填项" ) + "不能为空";
                $(this).find("input").each(function () {
                    if ( $.trim($(this).val()) == '' ) {
                        res = false;
                        alert(msg);
                        return res;
                    }
                });
                if (!res) return res;
            });
            return res;
        }

        function getEntriesBySelector(selector, type) {
            var arr = [];
            $(selector).each(function () {
                var tmp = $(this).find("input").serializeArray();
                var obj = {"ftype" : type};
                $.each(tmp, function (i, map) {
                    if(!(map.name in obj)){
                        obj[map.name] = map.value;
                    }
                });
                if(!$.isEmptyObject(obj)){
                    arr.push(obj);
                }
            });
            return arr;
        }
    }

    pageView.searchOrgUnit = function () {
        $("#js-dropdown-orgUnit").ysSearchSelect({
            source:function( request, response ) {
                $.ajax({
                    url: financeWeb_Path + 'finance/certificates/getOrgUnitList.htm',
                    dataType: "json",
                    data: {
                        searchWord : request.term
                    },
                    success: function( data ) {
                        response( $.map( data.data, function( item ) {
                            return {
                                label: item.orgFNubmer + '/' + item.orgFName,
                                value: item.orgFNubmer,
                                name: item.orgFName,
                            }
                        }));
                    }
                });
            },
            callback:function(value, ui){
                $("input[name=orgUnitCode]").val(ui.item.value);
                $("input[name=orgUnitName]").val(ui.item.name);
            }
        });
    }

    pageView.dropdownInit = function(){
        $(".zl-dropdown-inline").ysdropdown({
            callback : function (val, $elem) {
                if ($elem.data('id') == "summary") {
                    $elem.find('input').attr('data-value', $elem.find('button').text());
                }
            }
        });
    }
    
    //现金流量选择
    pageView.cashflowModelInit = function() {
        var _that;
        $("body").on("click", ".modal-cash-flow", function(){
            $("#modal-cash-flow").modal("show");
            _that = $(this);
        });
        $("#modal-cash-flow .confirm-btn").on("click", function() {
            var code = $("#modal-cash-flow input[name=current_cash_flow]").val();
            var name = $("#modal-cash-flow button.zl-dropdown-btn").text().split("-")[1];
            if ($.trim(code) != '') {
                _that.parent("tr").find("input[name=cashFlowName]").val(name);
                _that.parent("tr").find("input[name=cashFlow]").val(code);
                _that.parent("tr").find("input[name=cashFlowShow]").val(code+ "-" +name);
                _that.parent("tr").find("input[name=cashFlowShow]").attr("title", code+ "-" +name);
            } else {
                _that.parent("tr").find("input[name=cashFlowName]").val('');
                _that.parent("tr").find("input[name=cashFlow]").val('');
                _that.parent("tr").find("input[name=cashFlowShow]").val('');
                _that.parent("tr").find("input[name=cashFlowShow]").attr("title", '');
            }
        });
    };

    //金额公式选择
    pageView.amountFormulaModelInit = function() {
        var _that;
        $("body").on("click", ".modal-amount-formula", function(){
            $("#modal-amount-formula").modal("show");
            _that = $(this);
        });
        $("#modal-amount-formula .confirm-btn").on("click", function() {
            var name = $("#modal-amount-formula button.zl-dropdown-btn").text();
            var code = $("#modal-amount-formula input[name=current_amount_formula]").val();
            _that.parent("tr").find("input[name=amountFormulaName]").val(name);
            _that.parent("tr").find("input[name=amountFormula]").val(code);
        });
    };

    //借贷方向选择
    pageView.directionModelInit = function() {
        var _that;
        $("body").on("click", ".modal-direction", function(){
            $("#modal-direction").modal("show");
            _that = $(this);
        });
        $("#modal-direction .confirm-btn").on("click", function() {
            var name = $("#modal-direction button.zl-dropdown-btn").text();
            var code = $("#modal-direction input[name=current_direction]").val();
            _that.parent("tr").find("input[name=directionName]").val(name);
            _that.parent("tr").find("input[name=direction]").val(code);
        });
    };

    //摘要modal
    pageView.summaryModelInit = function() {
        var _that;
        $("body").on("click", ".modal-summary", function(){
            _that = $(this);
            pageView.setInputToSummary(_that);
            $("#modal-summary").modal("show");
        });
        $("#modal-summary .confirm-btn").on("click", function() {
            pageView.setSummaryToInput(_that);
            $("#modal-summary").modal("hide");
        });
    };

    pageView.setSummaryToInput = function (obj) {
        var summary = "";
        var inpArr = $("#modal-summary").find("input").serializeArray();
        var exp2 = $("#modal-summary").find("input[name=exp2]").val();
        var btnArr = $("#modal-summary").find("button.zl-dropdown-btn");
        for (var i=0; i< btnArr.length; i++) {
            if ($.trim($(btnArr[i]).text()) != "请选择" && $.trim($(btnArr[i]).text()) != "") {
                summary += $.trim($(btnArr[i]).text()) + "+";
            }
            if ($.trim(exp2) != '' && i == 0) {
                summary += exp2 + "+";
            }
        };
        summary = summary.substring(0, summary.length-1);
        $(obj).parents('tr').find("input[name=summary]").val(summary);
        $(obj).parents('tr').find("input[name=summary]").attr('title', summary);
        $.each(inpArr, function (i, inp) {
            $(obj).parents('tr').find("input[name="+ inp.name +"]").val(inp.value);
            $(obj).parents('tr').find("input[name="+ inp.name +"]").attr('data-value', inp.dataValue);
        })
    };
    pageView.setInputToSummary = function (obj) {
        var trInpArr = $(obj).parents('tr').find("input").serializeArray();
        if ($.trim($(obj).find('input').val()) == '') return;
        $.each(trInpArr, function (i, inp) {
            $("#modal-summary").find("input[name="+ inp.name +"]").val(inp.value);
            $("#modal-summary").find("input[name="+ inp.name +"]").parent().find('button').text(inp.dataValue);
        })
    }

    pageView.loadingShow = function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function(){
        $(".zl-loading").fadeOut();
    }

    pageView.init = function(){
        $("#preloader").fadeOut("fast");
        confirmAlert.init();
        pageView.pageInit();
        pageView.dropdownInit();
        pageView.autocomplete();
        pageView.directionModelInit();
        pageView.cashflowModelInit();
        pageView.amountFormulaModelInit();
        pageView.summaryModelInit();
        pageView.searchOrgUnit();
    };
    return pageView;

})(jQuery);

$(document).ready(function(){
    var rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i;
    var rsubmittable = /^(?:input|select|textarea|keygen)/i;
    var rcheckableType = (/^(?:checkbox|radio)$/i);
    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param( this.serializeArray() );
        },
        serializeArray: function() {
            return this.map(function() {
                var elements = jQuery.prop( this, "elements" );
                return elements ? jQuery.makeArray( elements ) : this;
            })
            .filter(function() {
                var type = this.type;
                return this.name && !jQuery( this ).is( ":disabled" ) &&
                    rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
                    ( this.checked || !rcheckableType.test( type ) );
            })
            .map(function( i, elem ) {
                var val = jQuery( this ).val();
                var obj = jQuery( this );
                return val == null ?
                    null :
                    jQuery.isArray( val ) ?
                        jQuery.map( val, function( val ) {
                            return { name: elem.name, value: val.replace( /\r?\n/g, "\r\n" ), dataValue: obj.attr('data-value') };
                        }) :
                        { name: elem.name, value: val.replace( /\r?\n/g, "\r\n" ), dataValue: obj.attr('data-value') };
            }).get();
        }
    });
    confirmAlert.init;
    pageView.init();
});
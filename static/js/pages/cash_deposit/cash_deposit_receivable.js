/*
    保证金应收
    liuqq at 2018-04-16
 */

var pageView=(function($){
    var pageView={};

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var ys_main_swiper = new Swiper('.zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false,
            observer:true,
            observeParents:true
        });
        var layoutList = [];
        try {
            layoutMap = JSON.parse(layoutMapJson)
            for (var key in layoutMap)  layoutList.push({"code" : key , "label" : layoutMap[key]});
        } catch (e) { }

        $( "#js-layout" ).autocomplete({
            source: layoutList,
            minLength: 1,
            select: function( event, ui ) {
                this.value = ui.item.label;
                $("form").find("input[name=layoutCode]").val(ui.item.code);
                return false;
            }
        });

        $( "#js-layout" ).on("input", function() {
            $("form").find("input[name=layout]").val('');
        });

        //初始化下拉
        $(".zl-dropdown").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "projects"){
                    $("form").find("input[name=mallId]").val(val);
                }
                if ($elem.data("id") == "feeType"){
                    $("form").find("input[name=feeType]").val(val);
                }
                $("form").submit();
            }
        });

        $("#js-month-picker").find("input.form-control").datetimepicker({
            language: "zh-CN",
            format: "yyyy-mm",
            clearBtn: "清除",
            startView: 3,
            minView: 3,
            weekStart: 1,
            autoclose: true,
            todayHighlight: true,
            forceParse: false
        });
        $("#js-date-picker").find("input.form-control").datetimepicker({
            language: 'zh-CN',
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            forceParse: 0,
            clearBtn: "清除",
        });

        $("#js-month-picker").ysDatepicker({
            dateType:"month",//year,day
            callback:function(value){
                $("form").find("input[name=page]").val(1);
                $("form").find("input[name=queryDate]").val(value);
                // $("form").submit();
            }
        })
        $(".zl-search input").on("input", function () {
            $("form").find("input[name=searchWord]").val($(this).val());
        })

        //翻页
        $(".zl-paginate").on("click", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var page = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页

            if (pageType == "last") {
                page -= 1;
            }
            else if (pageType == "next") {
                page += 1;
            }
            else {
                return;
            }
            if (page == 0 || page > pages) {
                return;
            }
            $("#searchFrom").find("input[id=page]").val(page);
            $("#_page").val(page);
            $("#searchFrom").submit();
        });
        //翻页
        $("#gotoPage").on("click", function (e) {
            var page = $("#gotoPageNum").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                page = $("#pages").val();
            }
            $("form").find("input[name=page]").val(page);
            $("form").submit();
        });
        //查询
        $(".btn-search").on("click", function() {
            $("#searchFrom").submit();
        });
        $(".zl-search-clear").on("click", function(){
            $("#search-collapse-section").find("input").val("");
        });
        $(".zl-senior-search").on("click", function() {
            $("#searchFrom").submit();
        });
        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("form").submit();
            }
        })
        $('#js-layout').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("form").submit();
            }
        })

        //单个checkbox选择
        $(document).on("click", ".zl-fake-checkbox:not(.all):not(.zl-btn-disable)", function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass("checked");
        });

        //全部选择 全部不选择
        $(".zl-fake-checkbox.all").on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass("checked")
            if ($(this).hasClass("checked")) {
                $(".zl-fake-checkbox").each(function(){$(this).addClass("checked");});
            } else {
                $(".zl-fake-checkbox").each(function(){$(this).removeClass("checked");});
            }
        });
        //全选合同应收
        $(".zl-fake-checkbox.cont").on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();

            $(".zl-fake-checkbox.cont").removeClass("checked");
            $(this).addClass("checked");

            var toggleDiv = $(this).parents("div[data-toggle=collapse]").attr("href");
            if ($(this).hasClass("checked")) {
                $(toggleDiv).find(".zl-fake-checkbox").each(function(){$(this).addClass("checked");});
            } else {
                $(toggleDiv).find(".zl-fake-checkbox").each(function(){$(this).removeClass("checked");});
            }
        });
        //全选合同应收
        $(".zl-fake-checkbox.head").on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass("checked")

            if ($(this).hasClass("checked")) {
                $(this).parents("div.zl-table-static").find(".zl-fake-checkbox").each(function(){
                    if($(this).hasClass("zl-btn-disable")){
                        return true;
                    }
                    $(this).addClass("checked");
                });
            } else {
                $(this).parents("div.zl-table-static").find(".zl-fake-checkbox").each(function(){$(this).removeClass("checked");});
            }
        });

        //开收据
        $(".make-receipt-btn").on("click", function(e) {
            if ($(this).hasClass("zl-btn-disable")) return;
            var ids = "";
            $("em[id^=cont-rece-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                }
            });
            if (ids == "") {
                alert("请选择后再执行该操作","","alert_fail");
            } else {
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "/cashDeposit/receivable/makeReceipt.htm",
                    data: {ids : ids},
                    type: "post",
                    dataType: "json",
                    success: function (res) {
                        if (res.code == "0") {
                            $("form").submit();
                        } else {
                            alert(res.msg);
                        }
                        pageView.loadingHide();
                    },
                    error: function (res) {
                        pageView.loadingHide();
                        alert(res.msg);
                    }
                });
            }
        });
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

        var container = $("#cash_deposit_receivable");

        //打印
        container.on("click","a.print-btn",function(e){
            // e.stopPropagation();
            // e.preventDefault();
            // var screenWidth = (screen.availWidth - 10);
            // var screenHeight = (screen.availHeight-50);
            // window.open(financeWeb_Path + "cashDeposit/receivable/receiptPrint.htm", "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");

            var _this = $(this).closest("div.panel-collapse");

            var flag = true;

            var ids = "";
            e.stopPropagation();
            e.preventDefault();
            if ($(this).hasClass("zl-btn-disable")) return;
            // _this.find("em[id^=cont-rece-]").each(function () {
            //     var that = this;
            //     if ($(that).hasClass("checked")) {
            //         var p_status = $(that).attr("printStatus");
            //         var d_status = $(that).attr("deStatus");
            //         if (p_status == 1 || d_status == 1) {
            //             $(that).removeClass("checked");
            //             flag = false;
            //         }
            //     }
            // });

            _this.find("em[id^=cont-rece-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                }
            });
            if (ids == "") {
                alert("请选择后执行此操作");
                return;
            }
            // pageView.loadingShow();
            $.ajax({
                url: financeWeb_Path + "feeReceivable/print/pre.htm",
                data: {id: ids},
                type: "post",
                dataType: "json",
                error: function (request) {
                    alert("系统异常");
                }, success: function (response) {
                    if (response && response.success) {
                        window.open(financeWeb_Path + "feeReceivable/print.htm?id=" + response.data.uuid + "&status=page&feeIds=" + response.data.ids);
                    } else {
                        alert(response.message);
                    }
                }
            });
        });

        container.on('click', "div[data-toggle=collapse]", function(){
            var href = $(this).attr("href");
            var _div = $(href);

            var _leftTarget = _div.find("div.zl-table-static-left tbody");
            var _rightTarget = _div.find("div.zl-floor-main-table tbody");
            if(_leftTarget.text().trim() != "" &&
                _rightTarget.text().trim() != ""){
                return;
            }
            _leftTarget.empty();
            _rightTarget.empty();

            var contNo = _div.find("input[name=contNo]").val();
            var feeType = container.find("input[name=feeType]").val();
            var queryDate = container.find("input[name=queryDate]").val();
            var receNo = container.find("input[name=receNo]").val();
            var brandName = container.find("input[name=brandName]").val();
            var companyName = container.find("input[name=companyName]").val();
            var storeNos = container.find("input[name=storeNos]").val();
            var receMinAmount = container.find("input[name=receMinAmount]").val();
            var receMaxAmount = container.find("input[name=receMaxAmount]").val();
            var receStartDate = container.find("input[name=receStartDate]").val();
            var receEndDate = container.find("input[name=receEndDate]").val();

            pageView.loadingShow();
            $.ajax({
                url: 'getReceivableDetail.htm',
                data: {
                    contNo : contNo,
                    feeType : feeType,
                    queryDate : queryDate,
                    receNo : receNo,
                    brandName : brandName,
                    companyName : companyName,
                    storeNos : storeNos,
                    receMinAmount : receMinAmount,
                    receMaxAmount : receMaxAmount,
                    receStartDate : receStartDate,
                    receEndDate : receEndDate
                },
                type: "post",
                dataType: "json",
                success: function (res) {

                    pageView.loadingHide();

                    if(res && res.code=="0"){

                        var paperStatusMap = res.data.receivePaperStatusMap || {};
                        var feeTypeMap = res.data.feeTypeMap || {};
                        var list = res.data.list || [];

                        $("#leftDetailTpl").tmpl(list, {
                            getMainId : function () {
                                return "";
                            },
                            fmtFeeType : function(){
                                return feeTypeMap[this.data.feeType] || "";
                            },
                        }).appendTo(_leftTarget);
                        $("#rightDetailTpl").tmpl(list, {
                            fmtDate : function(key){
                                return timeStampConvert(this.data[key], "yyyy-MM-dd");
                            },
                            fmtAmt : function(key){
                                return fmtAmt(this.data[key]);
                            },
                            fmtPaperStatus : function(){
                                return paperStatusMap[this.data.deStatus] || "";
                            },
                        }).appendTo(_rightTarget);
                    }
                },
                error: function (res) {
                    pageView.loadingHide();
                    alert("系统繁忙");
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

    return pageView;

})(jQuery);

$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});
/*
    保证金应收
    liuqq at 2018-04-16
 */

var pageView=(function($){

    var pageView={};
    var page = $("#invoice-index");

    pageView.swiperInit = function () {
        var ys_main_swiper = new Swiper('.zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            scrollbarDraggable:true,
            grabCursor:true,
            preventClicksPropagation:false,
            observer:true,
            observeParents:true
        });
    };

    pageView.init=function(){
        //搜索
        page.on("click", ".search-btn,.zl-senior-search", function() {
            $("#searchForm").find("input[name=page]").val("1");
            var itemsPerPage = $("#itemsPerPage").val();
            $("#searchForm").find("input[name=itemsPerPage]").val(itemsPerPage);
            $("#searchForm").submit();
        });
        page.on('click', ".zl-search-clear", function(){
            page.find("#search-collapse-section input").val("");
            page.find("#search-collapse-section div.btn-group button").text("请选择");
        });
        // 打开票易通
        page.on("click", "a.openPyt-btn", function() {
            $.ajax({
                url: financeWeb_Path + "/bill/invoice/toInvalidPage.htm",
                data: {},
                type: "post",
                dataType: "json",
                success: function (res) {
                    if (res.code == "0") {
                        window.open(res.data);
                    } else {
                        alert(res.msg);
                    }
                },
                error: function (res) {
                    alert(res.msg);
                }
            });

        });
        // 作废
        page.on("click", ".invalid-btn", function(e) {
            e.stopPropagation();
            e.preventDefault();

            var settlementNo = $(this).attr("data-id");
            var invoiceId = $(this).attr("invoice-id");
            confirm("结算单号["+settlementNo+"]相关发票都会作废,请确认作是否继续？","","", function (type) {

                if (type == 'dismiss') return;

                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "bill/invoice/invalid.htm",
                    data: {invoiceId : invoiceId},
                    type: "post",
                    dataType: "json",
                    error: function (request) {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (response) {
                        pageView.loadingHide();
                        alert(response.msg, "", "", function(){
                            if(response && response.code == 0){
                                page.find(".search-btn").click();
                            }
                        });
                    }
                });
            });
        });

        page.on("mouseenter",".zl-table-wrapper-swiper tbody tr",function(e){
            var _index=$(this).index();
            $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');
        });
        page.on("mouseleave",".zl-table-wrapper-swiper tbody tr",function(e){
            var _index=$(this).index();
            $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');
        });

        //上一月点击事件
        page.on("click", "#zl-date-pre", function (e) {
            e.preventDefault();
            skip(-1);
        });
        //下一月点击事件
        page.on("click", "#zl-date-next", function (e) {
            e.preventDefault();
            skip(1);
        });

        //下拉
        page.on("click",".zl-dropdown .dropdown-menu li a",function(e){

            var _div = $(this).closest(".zl-dropdown");
            var val = $(this).data("value");
            _div.find("input[type=hidden]").val(val);

            var text = $(this).text();
            _div.find("button").html(text);

            page.find(".search-btn").click();
        });
        //下拉
        page.on("click","div.input-group .dropdown-menu li a",function(e){

            var _div = $(this).closest("div.input-group");
            var val = $(this).data("value");
            _div.find("input[type=hidden]").val(val);

            var text = $(this).text();
            _div.find("button").html(text);
        });

        //到明细页
        page.on("click", "a.invoice-detail",function(e){
            var settlementNo = $(this).attr("data-id");
            window.location = financeWeb_Path + "bill/invoice/detail2.htm?settlementNo=" + settlementNo;
        });

        //发票上传失败原因
        page.on("click", "a.invoice-reason",function(e){
            e.stopPropagation();
            e.preventDefault();

            var failReason = $(this).attr("data-id");
            var _modal = page.find("#invoice-fail-reason");
            _modal.find("#fail-reason").html(failReason);
            _modal.modal("show");
        });

        //翻页
        $(".zl-paginate").on("click", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var page = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页
            var itemsPerPage = parseInt($("#itemsPerPage").val()); // 总页

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
            $("form").find("input[name=page]").val(page);
            $("#searchForm").find("input[name=itemsPerPage]").val(itemsPerPage);
            $("form").submit();
        });
        //翻页
        $("#gotoPage").on("click", function (e) {
            var page = $("#gotoPageNum").val();
            var itemsPerPage = $("#itemsPerPage").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                page = $("#pages").val();
            }
            $("form").find("input[name=page]").val(page);
            $("#searchForm").find("input[name=itemsPerPage]").val(itemsPerPage);
            $("form").submit();
        });

        // 回车搜索
        page.on('keypress', '.zl-search input', function (event) {
            if (event.keyCode == "13") {
                $("#searchForm").find("input[name=page]").val(1);
                var itemsPerPage = $("#itemsPerPage").val();
                $("#searchForm").find("input[name=itemsPerPage]").val(itemsPerPage);
                $(".search-btn").click();
            }
        });

        page.on("click",".zl-table-block  .zl-checkbox.single:not(.zl-btn-disable)",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass("checked");
        });

        page.on("click","em.zl-checkbox.all",function(e){
            $(this).toggleClass("checked")
            if($(this).hasClass("checked")){
                $("em.zl-checkbox.single:not(.zl-btn-disable)").addClass("checked");
            }else{
                $("em.zl-checkbox.single").removeClass("checked");
            }
        });

        page.on("click", "#receipt-dialog li,#receipt-dialog-detail li", function(e){
            e.stopPropagation();
            e.preventDefault();

            var _ul = $(this).closest("ul.receipt-item-list");
            var $elem = $(this).find(".zl-fake-radio");

            if($elem.hasClass("checked")){
                $elem.removeClass("checked");
            }else{
                _ul.find(".zl-fake-radio").removeClass("checked");
                if(!$elem.hasClass("disabled")){
                    $elem.addClass("checked");
                }

            }

            var _target = _ul.data("id");
            $(this).closest("div.modal-body").find("input[name="+_target+"]").val($elem.data("value"));
        });

        // 开发票
        page.on("click", ".invoicing", function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).hasClass("zl-btn-disable")) return;

            var ids = [];
            page.find("em.zl-checkbox.single.checked").each(function () {
                ids.push($(this).data("id"));
            });

            if(ids.length == 0){
                alert("请选择要开票的记录");
                return;
            }

            var _modal = page.find("#receipt-dialog");
            _modal.find("em.zl-fake-radio").removeClass("checked");
            _modal.find("input").val("");
            _modal.find("input[name=ids]").val(ids.join(","));
            _modal.modal("show");
        });
        // 保存
        page.on("click", '#receipt-dialog button.save-btn', function (e) {

            var _model = $("#receipt-dialog");

            var ids = _model.find("input[name=ids]").val();
            if(ids==null || ids==""){
                alert("数据传输异常...");
                return;
            }
            var invoiceType = _model.find("input[name=invoiceType]").val();
            if(invoiceType==null || invoiceType==""){
                alert("请选择开票类型");
                return;
            }
            var remarkType = _model.find("input[name=remarkType]").val();
            if(remarkType==null || remarkType==""){
                alert("请选择备注类型");
                return;
            }


            var params = {ids:ids, invoiceType:invoiceType, remarkType:remarkType};

            pageView.loadingShow();
            $.ajax({
                cache: true,
                type: "POST",
                url: financeWeb_Path + "bill/invoice/invoicing2.htm",
                data: params,
                dataType:'json',
                error: function (request) {
                    pageView.loadingHide();
                    alert("系统繁忙");
                },
                success: function (response) {
                    pageView.loadingHide();
                    alert(response.msg,"","",function(){
                        if(response.code == 0) {
                            // window.location = financeWeb_Path + "bill/invoice/index2.htm";
                            // page.find("a.search-btn").click();
                        }
                    });
                }
            });
        });

        // 明细开发票
        page.on("click", ".invoicing-detail", function(e) {

            e.stopPropagation();
            e.preventDefault();

            var _modal = page.find("#receipt-dialog-detail");
            _modal.find("em.zl-fake-radio").removeClass("checked");
            _modal.find("input").val("");
            _modal.find("input[name=ids]").val($(this).data("id"));
            _modal.find("input[name=surplusAmount]").val($(this).closest("div.panel").find("input[name=surplusAmount]").val());

            var _div = $(this).closest("div.panel-collapse");
            var invoiceType = _div.find("input[name=invoiceType]").val();
            if(invoiceType && invoiceType != ""){
                // var _ul = _modal.find("ul.receipt-item-list[data-id=invoiceType]");
                // _ul.find("em.zl-fake-radio").addClass("disabled");
                // _ul.find("em.zl-fake-radio[data-value="+invoiceType+"]").removeClass("disabled");
            }

            _modal.modal("show");
        });
        // 明细保存
        page.on("click", '#receipt-dialog-detail button.save-btn', function (e) {

            var _model = $("#receipt-dialog-detail");

            var ids = _model.find("input[name=ids]").val();
            if(ids==null || ids==""){
                alert("数据传输异常...");
                return;
            }

            var invoiceAmount = _model.find("input[name=invoiceAmount]").val();
            if(invoiceAmount == "" || !/^(\d{1,8})(\.\d{1,2})?$/.test(invoiceAmount) || Number(invoiceAmount)==0){
                _model.find("input[name=invoiceAmount]").val(0);
                alert("请输入开票金额");
                return;
            }
            var surplusAmount = _model.find("input[name=surplusAmount]").val();
            if(Number(invoiceAmount) > Number(surplusAmount)){
                alert("剩余可开票金额"+surplusAmount+"元");
                _model.find("input[name=invoiceAmount]").val("0");
                return;
            }

            var invoiceType = _model.find("input[name=invoiceType]").val();
            if(invoiceType==null || invoiceType==""){
                alert("请选择开票类型");
                return;
            }
            var remarkType = _model.find("input[name=remarkType]").val();
            if(remarkType==null || remarkType==""){
                alert("请选择备注类型");
                return;
            }


            _model.modal("hide");

            var params = {
                id:ids,
                invoiceAmount:invoiceAmount,
                invoiceType:invoiceType,
                remarkType:remarkType
            };

            pageView.loadingShow();
            $.ajax({
                cache: true,
                type: "POST",
                url: financeWeb_Path + "bill/invoice/invoicingDetail2.htm",
                data: params,
                dataType:'json',
                error: function (request) {
                    pageView.loadingHide();
                    alert("系统繁忙");
                },
                success: function (response) {
                    pageView.loadingHide();
                    alert(response.msg,"","",function(){
                        if(response.code == 0) {
                            // window.location = financeWeb_Path + "bill/invoice/index2.htm";
                            // page.find("a.search-btn").click();
                        }
                    });
                }
            });
        });


        page.on('click', "div.div-collapse", function(e){

            var _target = $($(this).data("target"));
            var _targetLeft = _target.find("tbody.invoice-left-detail");
            var _targetRight = _target.find("tbody.invoice-right-detail");
            if(_targetLeft.text().trim() != "" && _targetRight.text().trim() != ""){
                return;
            }
            _targetLeft.empty();
            _targetRight.empty();

            pageView.loadingShow();

            var params = {
                receNo :  _target.find("input[name=receNo]").val(),
                settlementNo : page.find("input[name=settlementNo]").val(),
                invoiceStatus : page.find("input[name=invoiceStatus]").val(),
                invoiceType : page.find("input[name=invoiceType]").val(),
                invoiceNo : page.find("input[name=invoiceNo]").val(),
                invoiceType : page.find("input[name=invoiceType]").val(),
                invoiceAmountStart : page.find("input[name=invoiceAmountStart]").val(),
                invoiceAmountEnd : page.find("input[name=invoiceAmountEnd]").val(),
                invoiceDateStart : page.find("input[name=invoiceDateStart]").val(),
                invoiceDateEnd : page.find("input[name=invoiceDateEnd]").val(),
            };
            $.ajax({
                url: financeWeb_Path + "bill/invoice/getInvoiceList.htm",
                data: params,
                type: "post",
                dataType: "json",
                error: function (request) {
                    pageView.loadingHide();
                    alert("系统繁忙");
                },
                success: function (response) {
                    pageView.loadingHide();
                    if(response && response.code == 0){

                        var invoiceType = response.data.invoiceType;
                        _target.find("input[name=invoiceType]").val(invoiceType);

                        var list = response.data.dataList || [];
                        var invoiceTypeMap = response.data.invoiceTypeMap || {};
                        var invoiceStatusMap = response.data.invoiceStatusMap || {};
                        $("#invoiceLeftDetailTpl").tmpl(list,{
                            getInvoiceType : function(){
                                return invoiceTypeMap[this.data.invoiceType] || "";
                            }
                        }).appendTo(_targetLeft);
                        $("#invoiceRightDetailTpl").tmpl(list,{

                            getInvoiceStatus : function(){
                                return invoiceStatusMap[this.data.status] || "";
                            },
                            formatAmt : function(key){
                                return fmtAmt(this.data[key]);
                            },
                            formatDate : function(key){
                                return timeStampConvert(this.data[key], "yyyy-MM-dd");
                            },
                        }).appendTo(_targetRight);

                        // pageView.swiperInit();
                    }
                }
            });
        });
    };

    pageView.dateRangeInit=function(){
        page.find(".year-month input.form-control").datetimepicker({
            language: "zh-CN",
            format:"yyyy-mm",
            todayBtn:false,
            startView:4,
            minView:3,
            weekStart: 1,
            todayHighlight: true,
            autoclose: true,
            forceParse: false,
            clearBtn: "清除",
        });
        page.find(".year-month-day input.form-control").datetimepicker({
            language: "zh-CN",
            format:"yyyymmdd",
            todayBtn:false,
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            forceParse: 0,
            clearBtn: "清除",
        });
    }

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    $("#preloader").fadeOut("fast");
    confirmAlert.init();
    pageView.init();
    pageView.dateRangeInit();
    pageView.swiperInit();
});


function skip(step) {
    var value = $('input[name=queryDate]').val();
    if (!/^\d{4}-\d{1,2}$/.test(value)) {
        alert('非法日期格式');
        return false;
    }

    var saleYm = addMonth(value, step);

    // ---------- max time control
    // var addValue = new Date(saleYm.replace(/-/g, "\/"));
    // var currentDate = new Date();
    // if (addValue.getTime() > currentDate.getTime()) {
    //     alert('不能选择未来时间');
    //     return false;
    // }
    // ---------- max time control

    $("input[name=queryDate]").val(saleYm);
    $(".search-btn").click();
}

function addMonth(value, month) {
    var date = new Date(value);
    date.setMonth(date.getMonth() + month);
    var num = date.getMonth() + 1;
    if (num < 10) num = 0 + "" + num;
    return date.getFullYear() + '-' + num;
}

function isPositiveNum(s) {//是否为正整数
    var re = /^[0-9]*[0-9][0-9]*$/;
    return re.test(s);
}
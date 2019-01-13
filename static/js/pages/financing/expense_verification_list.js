/**
 * Created by whobird on 2018/4/9.
 */

var pageView=(function($){
    var pageView={};

    pageView.eventInit=function(){

        var page = $("#expense-verification-list");

        $(document).keydown(function (e) {
            if(e.keyCode===13){
                $('#searchFinanceReceiveFormBtn').trigger('click');
            }
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

        page.on("click",'.dropdown-menu li',function (e) {
            var name=$(this).children('a').html();
            var id=$(this).children('a').attr('key');
            var btn=$(this).parents(".zl-dropdown").children('button');
            btn.html(name);
            var inputText = $(this).parents(".zl-dropdown").children('input');
            inputText.val(id);
            $("#searchPageForm").find("input[name=page]").val(1);
            if(isPositiveNum(name)){
                $("#searchPageForm").find("input[name=itemsPerPage]").val(name);
            }
            setSearchForm()
            $("#searchPageForm").trigger("submit");
        });

        page.find(".zl-datetimepicker input").datetimepicker({
            endDate:new Date(),
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

        $(".zl-dist-add").on("click", function () {
            $(".zl-add-collapse").slideToggle("normal");
        });

        $(".search-btn").on("click", function (e) {
            $("#searchPageForm").find("input[name=page]").val(1);
            $("#searchPageForm").trigger("submit");
        });

        /*$("#print-btn").on("click", function () {
            window.print();
        });*/

        $("#print-btn").on("click", function (){
            //var id = $(".tabList").attr("bscontchargedetailid");
            debugger;
            /*var verificationStatus = $("#verificationStatus").val();
            var mallId = $("#mallId").val();
            var dealStatus= $("#dealStatus").val();
            var searchWord = $("#searchPageForm").find("input[name=searchWord]").val();*/
            var verificationStatus = '';
            var mallId = '';
            var dealStatus= '';
            var searchWord = '';
            var searchWordNoEncode= encodeURI(searchWord);
            //e.stopPropagation();
            //e.preventDefault();
            var screenWidth = (screen.availWidth - 10);
            var screenHeight = (screen.availHeight-50);
            var subWin = window.open(financeWeb_Path + "finance/expenseVerification/printNew.htm?mallId=" + mallId+"&dealStatus="+dealStatus+"&searchWordNoEncode="+searchWordNoEncode+"&verificationStatus="+verificationStatus, "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
            //window.location = financeWeb_Path + "finance/expenseVerification/detail
            //scpStatic/static/js/pages/financing/arrears_platform_detail.js
            // /scpStatic/views/financing/call_letter.html
            subWin.onload=function(){
                setTimeout(function(){
                    subWin.print();
                },100);
            };
        });

        $(".clean-btn").on("click", function (e) {
            $("#searchPageForm").find("input[name=verificationTimeStart]").val('');
            $("#searchPageForm").find("input[name=verificationTimeEnd]").val('');
            $("#searchPageForm").find("input[name=receiveTimeStart]").val('');
            $("#searchPageForm").find("input[name=receiveTimeEnd]").val('');
            $("#searchPageForm").find("input[name=receContNo]").val('');
        });

        $("#searchPageForm").submit(function () {
            setSearchForm();
            var self = $(this);
            self.attr("action", financeWeb_Path + "finance/expenseVerification/index.htm");
        });

        page.on("click",'.detail',function (e) {
            var orderId = $(this).attr("orderId");
            var verificationStatus = $("#searchPageForm").find("input[name=verificationStatus]").val();
            var mallId = $("#searchPageForm").find("input[name=mallId]").val();
            var invoiceNos= $("#searchPageForm").find("input[name=invoiceNos]").val();
            var searchWord = $("#searchPageForm").find("input[name=searchWord]").val();
            var receContNo = $("#searchPageForm").find("input[name=receContNo]").val();
            var verificationTimeStart= $("#searchPageForm").find("input[name=verificationTimeStart]").val();
            var verificationTimeEnd = $("#searchPageForm").find("input[name=verificationTimeEnd]").val();
            var searchWordNoEncode = '';
            if('' != searchWord){
                var searchWordNoEncode= encodeURI(searchWord);
            }
            window.location = financeWeb_Path + "finance/expenseVerification/detail.htm?orderId=" + orderId+"&verificationStatus="+verificationStatus+"&mallId="+mallId+"&invoiceNos="+invoiceNos
                +"&receContNo="+receContNo+"&verificationTimeStart="+verificationTimeStart+"&verificationTimeEnd="+verificationTimeEnd+"&searchWordNoEncode="+searchWordNoEncode ;
        });

        page.on("click",'.delete',function (e) {
            var orderId = $(this).attr("orderId");
            confirm("确认是否删除？", "", "", function (type) {
                if (type == "dismiss") return;
                showLoading();
                $.ajax({
                    type: "POST",
                    url: financeWeb_Path + "finance/expenseVerification/delete.htm",
                    data: {orderId: orderId},
                    success: function (resultData) {
                        debugger;
                        if (JSON.parse(resultData).success) {
                            var url = financeWeb_Path + "/finance/expenseVerification/index.htm";
                            $("#searchPageForm").attr("action", url).submit();
                        } else {
                            alert(JSON.parse(resultData).msg);
                        }
                    }
                });
            });
        });



        $("#expense-verification-list").on("click", ".zl-paginate", function (e) {
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

            $("#searchPageForm").find("input[name=page]").val(page);
            $("#searchPageForm").find("input[name=itemsPerPage]").val(itemsPerPage);
            $("#searchPageForm").trigger("submit");
        });

        $("#gotoPageNum").on("blur", function (e) {
            if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt($(this).val()) > parseInt($("#pages").val())) {
                alert("超过总页数！");
                $(this).val($("#pages").val());
                return false;
            }
        });

        $("#gotoPage").on("click", function (e) {
            var itemsPerPage = $("#itemsPerPage").val();
            if (!isPositiveNum($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#searchPageForm").find("input[name=itemsPerPage]").val(itemsPerPage);
            $("#searchPageForm").trigger("submit");
        });

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }


        page.on("click",".zl-table-block tbody tr",function(e){
            if($(e.target).hasClass("zl-checkbox") && $(e.target).hasClass("zl-btn-disable")){
                $(e.target).toggleClass("checked");
                return;
            }
            $(this).find("em.zl-checkbox").toggleClass("checked");
        });

        page.on("click","em.zl-checkbox.all",function(e){
            $(this).toggleClass("checked")
            var $_tbody=$(this).closest("thead").next("tbody");
            if($(this).hasClass("checked")){
                $_tbody.find("em.zl-checkbox:not(.zl-btn-disable)").addClass("checked");
            }else{
                $_tbody.find("em.zl-checkbox").removeClass("checked");
            }
        });


        //开票
        page.on("click", "a.invoicing", function(e) {

            e.stopPropagation();
            e.preventDefault();

            if ($(this).hasClass("zl-btn-disable")) return;

            var ids = "";
            var reAduit = false;
            $("em[id^=data-item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                    var dateExpenseVerificationNo = $(this).attr("data-expenseVerificationNo");
                    if(dateExpenseVerificationNo.indexOf("R") != -1){
                        reAduit = true;
                    }
                }
            });
            if(reAduit){
                alert("请勿选择反核销单据")
                return;
            }
            if (ids == "") {
                alert("请选择后再执行该操作");
                return;
            }


            var _modal = $("#receipt-dialog");
            _modal.find("em.zl-fake-radio").removeClass("checked");
            _modal.find("input").val("");
            _modal.find("input[name=ids]").val(ids);
            _modal.modal("show");
        });

        $("#receipt-dialog li").on("click",function(e){
            e.stopPropagation();
            e.preventDefault();

            var _ul = $(this).closest("ul.receipt-item-list");
            var $elem = $(this).find(".zl-fake-radio");

            if($elem.hasClass("checked")){
                $elem.removeClass("checked");
            }else{
                _ul.find(".zl-fake-radio").removeClass("checked");
                $elem.addClass("checked");
            }

            var _target = _ul.data("id");
            $("#receipt-dialog").find("input[name="+_target+"]").val($elem.data("value"));
        });

        $("#receipt-dialog button.save-btn").on('click', function () {
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

            _model.modal("hide");

            var params = {ids : ids, invoiceType : invoiceType, remarkType:remarkType};

            pageView.loadingShow();
            $.ajax({
                url: financeWeb_Path + "finance/expenseVerification/generateInvoice2.htm",
                data: params,
                type: "post",
                dataType: "json",
                error: function (request) {
                    pageView.loadingHide();
                    alert("系统繁忙");
                }, success: function (response) {
                    pageView.loadingHide();
                    alert(response.msg,"","",function(){
                        if(response.code == 0) {
                            var _href = "#/fin_invoice";
                            window.parent.postMessage(_href, "*");
                        }
                    });
                }
            });
        });

        //开收据
        $(".receipting").on("click", function(e) {
            var ids = "";
            var reAduit = false;
            e.stopPropagation();
            e.preventDefault();
            if ($(this).hasClass("zl-btn-disable")) return;

            $("em[id^=data-item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                    var dateExpenseVerificationNo = $(this).attr("data-expenseVerificationNo");
                    if(dateExpenseVerificationNo.indexOf("R") != -1){
                        reAduit = true;
                    }
                }
            });
            if(reAduit){
                alert("请勿选择反核销单据")
                return;
            }
            if (ids == "") {
                alert("请选择后再执行该操作")
            }
            else{
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "finance/expenseVerification/generateReceipt.htm",
                    data: {ids : ids },
                    type: "post",
                    dataType: "json",
                    error: function (request) {
                        pageView.loadingHide();
                        alert("系统繁忙");
                    }, success: function (response) {
                        pageView.loadingHide();
                        alert(response.msg,"","",function(){
                            if(response.code == 0) {
                                var _href = "#/fin_receipt";
                                window.parent.postMessage(_href, "*");
                            }
                        });

                        /*if(response.code == 0){
                            alert("收据信息已生成","","",function(){
                                var _href="#/fin_receipt";
                                window.parent.postMessage(_href,"*")
                                // loading();
                                //window.location = financeWeb_Path + "bill/invoice/index.htm" ;
                            })
                        }else{
                            alert(response.msg);
                        }
                        // pageView.loadingHide();*/
                    }
                });
            }
        });

        page.on("click",'.detail_invoice',function (e) {
            var searchWord = $("#searchPageForm").find("input[name=searchWord]").val();
            var searchWordNoEncode = '';
            if('' != searchWord){
                var searchWordNoEncode= encodeURI(searchWord);
            }
            var _href = "#/fin_invoice";
            window.parent.postMessage(_href, "*");
        });

        page.on("click",'.detail_receipt',function (e) {
            var searchWord = $("#searchPageForm").find("input[name=searchWord]").val();
            var searchWordNoEncode = '';
            if('' != searchWord){
                var searchWordNoEncode= encodeURI(searchWord);
            }
            var _href = "#/fin_receipt";
            window.parent.postMessage(_href, "*");
        });


    };
    pageView.swiperInit=function(){
        var ys_main_swiper = new Swiper('#zl-swiper-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            preventClicksPropagation:false
        });
    }

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    };

    pageView.dateRangeInit=function(){
        var _startTimestamp=0,_endTimestamp=0;
        var dateStart=$("#js-date-range").find("input.js-date-start").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){

            var _startDate=$(this).val();
            _startTimestamp=e.timeStamp;
            if(_startDate){
                dateEnd.datetimepicker("setStartDate",_startDate);
            }else{
                dateEnd.datetimepicker("setStartDate",null);
            }
            if(_endTimestamp<_startTimestamp){
                dateEnd.val("");
            }
            dateEnd.datetimepicker("update");
        });

        var dateEnd=$("#js-date-range").find("input.js-date-end").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            _endTimestamp=e.timeStamp;
        });

    };

    pageView.dateReceiveRangeInit=function(){
        var _startTimestamp=0,_endTimestamp=0;
        var dateStart=$("#js-receivedate-range").find("input.js-receivedate-start").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){

            var _startDate=$(this).val();
            _startTimestamp=e.timeStamp;
            if(_startDate){
                dateEnd.datetimepicker("setStartDate",_startDate);
            }else{
                dateEnd.datetimepicker("setStartDate",null);
            }
            if(_endTimestamp<_startTimestamp){
                dateEnd.val("");
            }
            dateEnd.datetimepicker("update");
        });

        var dateEnd=$("#js-receivedate-range").find("input.js-receivedate-end").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            _endTimestamp=e.timeStamp;
        });

    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.dateRangeInit();
        pageView.dateReceiveRangeInit();
        pageView.eventInit();
        pageView.swiperInit();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
});

function showLoading(){
    if($(".zl-loader").length==0){
        $("body").append("<div class='zl-loader'></div>");
    }
    $(".zl-loader").show();
}

/*function searchMall(_this) {
    $("#searchPageForm").find("input[name=mallId]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    setSearchForm()
    $("#searchPageForm").trigger("submit");
}

function searchverificationSatus(_this) {
    $("#searchPageForm").find("input[name=verificationStatus]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    setSearchForm()
    $("#searchPageForm").trigger("submit");
}

function searchDealSatus(_this) {
    $("#searchPageForm").find("input[name=dealStatus]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    setSearchForm()
    $("#searchPageForm").trigger("submit");
}*/

function setSearchForm(){
    var searchWord = $("#searchPageForm").find("input[name=searchWord]").val();
    // var mallId = $("#mallId").val();
    //var receiveSatus = $("#receiveSatus").val();
    //var rightTime = $("#rightTime").val();
    //var receiveMoneyStart = $("#receiveMoneyStart").val();
    //var receiveMoneyEnd = $("#receiveMoneyEnd").val();

    $("#searchPageForm").find("input[name=searchWordNoEncode]").val(encodeURI(searchWord));
    //$("#searchPageForm").find("input[name=mallIdEncode]").val(encodeURI(mallId));
    //$("#searchPageForm").find("input[name=receiveSatusEncode]").val(encodeURI(receiveSatus));
    //$("#searchPageForm").find("input[name=rightTimeEncode]").val(rightTime);
    //$("#searchPageForm").find("input[name=receiveMoneyStartEncode]").val(receiveMoneyStart);
    //$("#searchPageForm").find("input[name=receiveMoneyEndEncode]").val(receiveMoneyEnd);
}


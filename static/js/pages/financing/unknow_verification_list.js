/**
 * Created by chenm on 2018/8/6.
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

        $("#searchPageForm").submit(function () {
            setSearchForm();
            var self = $(this);
            self.attr("action", financeWeb_Path + "finance/unknowVerification/index.htm");
        });

        page.on("click",'.detail',function (e) {
            var orderId = $(this).attr("orderId");
            window.location = financeWeb_Path + "finance/unknowVerification/detail.htm?orderId=" + orderId ;
        });

        page.on("click",'.delete',function (e) {
            var orderId = $(this).attr("orderId");
            confirm("确认是否删除？", "", "", function (type) {
                if (type == "dismiss") return;
                showLoading();
                $.ajax({
                    type: "POST",
                    url: financeWeb_Path + "finance/unknowVerification/delete.htm",
                    data: {orderId: orderId},
                    success: function (resultData) {
                        debugger;
                        if (JSON.parse(resultData).success) {
                            var url = financeWeb_Path + "/finance/unknowVerification/index.htm";
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


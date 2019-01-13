
var baseView=(function($){
    var baseView={};
    var ys_main_swiper;
    var flag = false;


    baseView.swiperInit=function(){
        ys_main_swiper= new Swiper('#zl-pol-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });
    };

    baseView.eventInit=function(){
        var container = $("#payment-order-list");

        container.on("click",'.dropdown-menu li',function (e) {
            debugger;
            var name=$(this).children('a').html();
            var id=$(this).children('a').attr('key');
            var btn=$(this).parents(".zl-dropdown").children('button');
            btn.html(name);
            var inputText = $(this).parents(".zl-dropdown").children('input');
            inputText.val(id);
        });

        container.on("click",".zl-table-block .zl-content tbody tr",function(){
            var orderId = $(this).attr("orderId");
            var remark = $(this).attr("remark");
            var status = $(this).attr("status");
            if(flag){
                flag = false;
                alert(remark)
                return ;
            }
            window.location = financeWeb_Path + "finance/paymentOrder/detail.htm?orderId=" + orderId +"&status="+ status;
        });

        container.find(".zl-datetimepicker input").datetimepicker({
            language: "zh-CN",
            format:"yyyy-mm",
            todayBtn:"linked",
            startView:3,
            minView:3,
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            forceParse: 0,
            clearBtn:true
        });


        container.on("click",".zl-datetimepicker",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).find("input").datetimepicker("show");
        });

        container.on("click", ".zl-paginate", function (e) {
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

            $("#searchPageForm").find("input[name=page]").val(page);
            $("#searchPageForm").trigger("submit");
        });

        $("#gotoPageNum").on("blur", function (e) {
            if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
                alert("请输入合法数字！");
                $(this).val($("#pages").val());
                return false;
            }
            if (parseInt($(this).val()) > parseInt($("#pages").val())) {
                alert("超过总页数！");
                $(this).val($("#pages").val());
                return false;
            }
        });

        $("#gotoPage").on("click", function (e) {
            $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#searchPageForm").trigger("submit");
        });

        $(".search-btn").on("click", function (e) {
            $("#searchPageForm").find("input[name=page]").val(1);
            $("#searchPageForm").trigger("submit");
        });

        $(".submit-btn").on("click", function (e) {

            confirm("确认提交吗？","","",function(type){
                if(type=="dismiss"){
                    return;
                }
            $("em[id^=data-item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var _this = this;
                    var status = $(this).attr("data-status");
                    if (status !=4 ) {
                        $(_this).removeClass("checked");
                        // alert("已提交或付款成功状态不能执行该操作", "", "",function () {
                        //     return;
                        // })
                    }

                }
            });

            var ids = "";
            $("em[id^=data-item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                }
            });
            if (ids == "") {
                alert("请选择后再执行该操作", "", "");
            }else{
                     $.ajax({
                        // cache: true,
                        type: "POST",
                        url: financeWeb_Path + "finance/paymentOrder/submit.htm",
                        data: {ids :ids},
                        dataType:'json',
                        error: function (request) {
                            alert("系统异常");
                        }, success: function (response) {
                            // alert("保存成功","","");
                            // var obj =JSON.parse(response);
                            if(response.code == 0){
                                alert("提交成功","","",function(){
                                    // loading();
                                    window.location = financeWeb_Path + "finance/paymentOrder/index.htm" ;
                                })
                            }else{
                                alert(response.msg);
                            }
                        }
                    });
                }
            });

        });

        $(".repeat-btn").on("click", function (e) {
            confirm("确认重传吗？","","",function(type){
                if(type=="dismiss"){
                    return;
                }
                $("em[id^=data-item-]").each(function () {
                    if ($(this).hasClass("checked")) {
                        var _this = this;
                        var status = $(this).attr("data-status");
                        if(status == 0 || status == 4 || status == 5){
                            $(_this).removeClass("checked");
                        }
                    }
                });
                var ids = "";
                $("em[id^=data-item-]").each(function () {
                    if ($(this).hasClass("checked")) {
                        var dataId = $(this).attr("data-id");
                        ids += dataId + ",";
                    }
                });

                if (ids == "") {
                    alert("请选择后再执行该操作", "", "");
                }else{
                    $.ajax({
                        // cache: true,
                        type: "POST",
                        url: financeWeb_Path + "finance/paymentOrder/submit.htm",
                        data: {ids :ids},
                        dataType:'json',
                        // async: false,
                        error: function (request) {
                            alert("系统异常");
                        }, success: function (response) {
                            // alert("保存成功","","");
                            if(response.code == 0){
                                alert("已经重传,请稍后查看结果","","",function(){
                                    // loading();
                                    window.location = financeWeb_Path + "finance/paymentOrder/index.htm" ;
                                })
                            }else{
                                alert(response.msg);
                            }
                        }
                    });
                }
            });
        });

        $(".reason-btn").on("click", function (e) {
            flag = true;
        });

        $("#searchPageForm").submit(function () {
            var self = $(this);
            var searchWord = $("#searchPageForm").find("input[name=searchWord]").val();
            $("#searchPageForm").find("input[name=searchWordNoEncode]").val(encodeURI(searchWord));
            self.attr("action", financeWeb_Path + "finance/paymentOrder/index.htm");
        });


        /*$(".zl-search input").on("input", function () {
            $("form").find("input[name=contNo]").val($(this).val());
        })*/
        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#searchPageForm").submit();
            }
        })

        container.on("click",".zl-table-block tbody tr",function(e){
            if($(e.target).hasClass("zl-checkbox")){
                $(e.target).toggleClass("checked");
                return;
            }
            $(this).find("em.zl-checkbox").toggleClass("checked");
        });

        container.on("click","em.zl-checkbox.all",function(e){
            $(this).toggleClass("checked")
            var $_tbody=$(this).closest("thead").next("tbody");
            console.log($_tbody)
            if($(this).hasClass("checked")){
                $_tbody.find("em.zl-checkbox").addClass("checked");
            }else{
                $_tbody.find("em.zl-checkbox").removeClass("checked");
            }

        });

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }


        // function searchReason(_this) {
        //     var remark = $(_this).attr("key");
        //     flag =false;
        //     alert(remark);
        // }
    };

    baseView.dateRangeInit=function(){
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

    baseView.init=function(){
        confirmAlert.init();
        $("#preloader").fadeOut("fast");
        baseView.swiperInit();
        baseView.eventInit();
        baseView.dateRangeInit();
    };

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});


function searchMall(_this) {
    $("#searchPageForm").find("input[name=mallId]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    $("#searchPageForm").trigger("submit");
}
function searchType(_this) {
    $("#searchPageForm").find("input[name=type]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    $("#searchPageForm").trigger("submit");
}
function searchStatus(_this) {
    $("#searchPageForm").find("input[name=status]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    $("#searchPageForm").trigger("submit");
}
// function searchReason(_this){
//     return $(_this).attr("key");
// }

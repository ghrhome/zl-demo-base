var arrearsPlatformDetailView=(function($){
    var arrearsPlatformDetailView = {};

    var page = $("#arrears-platform-detail");

    function bindPageEvents(){
        page.on("click",".zl-checkbox",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass("checked");
            if ($(this).find("input").attr("disabled")){
                $(this).find("input").attr("disabled",false);
            } else {
                $(this).find("input").attr("disabled",true);
            }
        });

        $(document).keydown(function (e) {
            if(e.keyCode===13){
                $('#searchArrearsPlatformDetailBtn').trigger('click');
            }
        });

        page.on("click",'.dropdown-menu li a',function (e) {
            var _div = $(this).closest("div.btn-group");

            var text = $(this).text();
            _div.find("button").text(text);
            var val = $(this).data("value");
            _div.find("input[type=hidden]").val(val);

            var id = _div.data("id");
            if(id == "page-limit"){
                page.find("input[name=itemsPerPage]").val(val);
            }

            $(".search-btn").click();
        });

        $(".search-btn").on("click", function (e) {
            $("#searchPageForm").find("input[name=page]").val(1);
            $("#searchPageForm").trigger("submit");
        });

        $("#searchPageForm").submit(function () {
            setSearchForm();
            var self = $(this);
            self.attr("action", financeWeb_Path + "finance/arrearage/getArrearageDetailNew.htm");
        });

        page.on("click","a.leave-msg-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            var text = $(this).prev().val();
            var user = "admin";
            page.find(".zl-edit-panel-right .msg-item-list").append("<li><em>"+user+"</em><span>"+text+"</span></li>");
            $(this).prev().val("");

        });

        //欠费明细-留言按钮
        $("button.comments-panel-btn").on("click", function(){

            var panel = $(this).closest(".comments-panel");
            var comments = $(panel).find("div.zl-panel-detail-comments");
            var textInput = $(panel).find("input");
            var text = textInput.val();
            console.log(text)
            if(text.length > 0){
                $.ajax({
                    url: financeWeb_Path + "finance/arrearage/addMessage.htm",
                    data: {content:text, messageType:1, bsContChargeDetailId:$(this).attr("bsContChargeDetailId")},
                    success: function(result){
                        if(result.length > 0){
                            $(comments).find("ul").append("<li><span>" + result + ":</span><em>" + text + "</em></li>");
                            $(comments).scrollTop($(comments)[0].scrollHeight);
                            $(textInput).val("");
                        }
                    },
                    error: function(){}
                })
            }
        });

        //欠费明细-展开明细
        $("div.tabList").on("click", function(){

            var id = $(this).attr("bscontchargedetailid");
            var _that = $(this);
            if(!$(this).hasClass("hasLoad") && id!=""){
                $.ajax({
                    url: financeWeb_Path + "finance/arrearage/getMessage.htm",
                    data: {id: id},
                    success: function(result){

                        console.log(result);
                        console.log(result instanceof Array);
                        result=JSON.parse(result);
                        var htmlText = "";
                        if( result.length == 0){
                            return
                        }else{
                            for (var i = 0; i < result.length; i++) {
                                htmlText = htmlText + "<li><span>" + result[i].creator + "（" + unix_to_date(result[i].createdDate) + "）:</span><em>" + result[i].content + "</em></li>"
                            }
                            /*$(result).each(function(idx, temp){
                                htmlText = htmlText + "<li><span>" + temp.creator + "（" + unix_to_date(temp.createdDate) + "）:</span><em>" + temp.content + "</em></li>"
                            });*/
                            $(_that).parent().find("ul.messageUl").append(htmlText);
                            $(_that).addClass("hasLoad");
                        }

                    },
                    error: function(){

                    }
                })
            }
        });

        $("ul.daysUl li").on("click", function(){
            var key = $(this).attr("key");
            var name = $(this).find("a").html();
        });

        page.on("click",".print-btn",function(e){
            var id = $(".tabList").attr("bscontchargedetailid");
            e.stopPropagation();
            e.preventDefault();
            var screenWidth = (screen.availWidth - 10);
            var screenHeight = (screen.availHeight-50);
            var subWin = window.open("printNew.htm?id=" + id, "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
            //scpStatic/static/js/pages/financing/arrears_platform_detail.js
            // /scpStatic/views/financing/call_letter.html

            subWin.onload=function(){
                setTimeout(function(){
                    subWin.print();
                },100);
            };
        });

        $("#arrears-platform-detail").on("click", ".zl-paginate", function (e) {

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
                return false;
            }
            if (parseInt($(this).val()) > parseInt($("#pages").val())) {
                alert("超过总页数！");
                $(this).val($("#pages").val());
                return false;
            }
        });

        $("#gotoPage").on("click", function (e) {
            if (!isPositiveNum($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#searchPageForm").trigger("submit");
        });

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

        page.find(".zl-datetimepicker input.form-control,.zl-date-select input.form-control").datetimepicker({
            language: "zh-CN",
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            weekStart: 1,
            todayHighlight: true,
            autoclose: true,
            forceParse: false,
            clearBtn:true
        });


    }

    /**
     * 导出
     */
    $("#reportBtn").on("click", function () {
        var mallId = $("#mallId").val();
        var startTime = $("#startTime").val();
        var qryDays = $("#qryDays").val();
        var seachKey = $("#searchPageForm").find("input[name=seachKey]").val();
        window.location = financeWeb_Path + "finance/arrearage/indexNew_reportExcelDetail.htm?mallId=" + mallId + "&qryDays=" + qryDays + "&startTime=" + startTime + "&seachKeyNoEncode=" + encodeURI(seachKey);
    });

    arrearsPlatformDetailView.init = function(){
        $("#preloader").fadeOut("fast");

        bindPageEvents();
    };

    return arrearsPlatformDetailView;
})(jQuery);




$(document).ready(function(){
    arrearsPlatformDetailView.init();
});

function showLoading(){
    if($(".zl-loader").length==0){
        $("body").append("<div class='zl-loader'></div>");
    }
    $(".zl-loader").show();
}

function unix_to_date(datetime_result) {
    var day2 = new Date(parseInt(datetime_result));
    return day2.getFullYear()
        + "-" + ((day2.getMonth() > 8) ? (day2.getMonth() + 1) : "0" + (day2.getMonth() + 1))
        + "-" + ((day2.getDate() > 9) ? day2.getDate() : "0" + day2.getDate())
        + " " + ((day2.getHours() > 9) ? day2.getHours() : "0" + day2.getHours())
        + ":" + ((day2.getMinutes() > 9) ? day2.getMinutes() : "0" + day2.getMinutes());
}

function setSearchForm(){

    var seachKey = $("#searchPageForm").find("input[name=seachKey]").val();
    // var mallId = $("#mallId").val();
    //var receiveSatus = $("#receiveSatus").val();
    //var rightTime = $("#rightTime").val();
    //var receiveMoneyStart = $("#receiveMoneyStart").val();
    //var receiveMoneyEnd = $("#receiveMoneyEnd").val();

    $("#searchPageForm").find("input[name=seachKeyNoEncode]").val(encodeURI(seachKey));
    //$("#searchPageForm").find("input[name=mallIdEncode]").val(encodeURI(mallId));
    //$("#searchPageForm").find("input[name=receiveSatusEncode]").val(encodeURI(receiveSatus));
    //$("#searchPageForm").find("input[name=rightTimeEncode]").val(rightTime);
    //$("#searchPageForm").find("input[name=receiveMoneyStartEncode]").val(receiveMoneyStart);
    //$("#searchPageForm").find("input[name=receiveMoneyEndEncode]").val(receiveMoneyEnd);
}
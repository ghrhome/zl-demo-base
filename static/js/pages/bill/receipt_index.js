/**
 * 收据
 */
var pageView=(function($){
    var pageView={};

    pageView.init=function(){

        $("#preloader").fadeOut("fast");
        var container = $("#receipt-index");

        //搜索
        container.on("click", ".search-btn", function() {
            $("#searchForm").attr("action", "index.htm");
            $("#searchForm").find("input[name=page]").val(1);
            $("#searchForm").submit();
        });

        container.on("click", ".clean-btn", function(){
            var _searchForm = $("#search_collapse");
            _searchForm.find("input").val("");
        });
        //新增
        container.on("click", "a.add-btn", function() {
            window.location = financeWeb_Path + "bill/receipt/toAdd.htm";
        });
        //明细页
        container.on("click", "a.zl-linkable", function() {
            var id = $(this).attr("data-id");
            if (id)
                window.location = financeWeb_Path + "bill/receipt/detail.htm?receiptId=" + id;
        });

        //下拉
        $(".btn-group").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "reeipt-title") {
                    $("input[name=reeiptTitle]").val(val);
                }
            }
        });
        //作废
        container.on("click", "a.invaild-btn", function() {
            if ($(this).hasClass("zl-btn-disable")) return;
            var ids = "";
            $("em[id^=item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                }
            });
            if (ids == "") {
                alert("请选择后再执行该操作");
            } else {
                confirm("确认作废选中项？","","",function(type){
                    if (type == "dismiss") return false;
                    pageView.loadingShow();
                    $.ajax({
                        url: financeWeb_Path + "/bill/receipt/toInvalid.htm",
                        data: {ids : ids},
                        type: "post",
                        dataType: "json",
                        success: function (res) {
                            if (res.code == "0") {
                                container.find(".search-btn").click();
                            } else {
                                alert(res.msg);
                            }
                            pageView.loadingHide();
                        },
                        error: function (res) {
                            alert(res.msg);
                            pageView.loadingHide();
                        }
                    });
                });
            }
        });
        //回收
        container.on("click", "a.recycle-btn", function() {
            if ($(this).hasClass("zl-btn-disable")) return;
            var ids = "";
            $("em[id^=item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                }
            });
            if (ids == "") {
                alert("请选择后再执行该操作");
            } else {
                confirm("确认回收选中项？","","",function(type){
                    if (type == "dismiss") return false;
                    pageView.loadingShow();
                    $.ajax({
                        url: financeWeb_Path + "/bill/receipt/toRecycle.htm",
                        data: {ids : ids},
                        type: "post",
                        dataType: "json",
                        success: function (res) {
                            if (res.code == "0") {
                                container.find(".search-btn").click();
                            } else {
                                alert(res.msg);
                            }
                            pageView.loadingHide();
                        },
                        error: function (res) {
                            alert(res.msg);
                            pageView.loadingHide();
                        }
                    });
                });
            }
        });

        /**
         * 导出
         */
        container.on("click", "a.export-btn", function(e){
            $("#searchForm").attr("action", "export.htm");
            $("#searchForm").submit();
            $(".zl-loading").fadeOut("fast");
        });

        //收据打印
        container.on("click","a.print-btn",function(e){
            // e.stopPropagation();
            // e.preventDefault();
            // var screenWidth = (screen.availWidth - 10);
            // var screenHeight = (screen.availHeight-50);
            // window.open(financeWeb_Path + "bill/receipt/print.htm", "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");

            var ids = "";
            var fn = false;
            $("em[id^=item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    if ($(this).attr("data-status") == '03') {
                        fn = true;
                        alert("收据已作废，不能打印");
                        return false;
                    }
                    if ($(this).attr("data-status") == '02') {
                        fn = true;
                        alert("收据已回收，不能打印");
                        return false;
                    }
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                }
            });
            if (fn) return;
            if (ids == "") {
                alert("请选择后再执行该操作");
            } else {
                $(".receipt-title-dialog").modal("show");
            }

            $(".receipt-title-dialog button.btn-primary").on("click",function(){
                var title = $("input[name=receiptTitle]").val();
                openPostWindow(financeWeb_Path + "bill/receipt/print.htm", ids , title);
                $(".receipt-title-dialog").modal("hide");
            });

        });

        //下拉
        $(".zl-dropdown").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "status") $("form").find("input[name=status]").val(val);
                container.find("a.search-btn").click();
            }
        });

        //列表左右滚动
        var ys_main_swiper = new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });

        //到明细页
        container.on("click", ".zl-table tbody tr",function(e){
            var id = $(this).attr("data-id");
            if (id)
                window.location = financeWeb_Path + "/bill/invoice/detail.htm?id=" + id;
        });

        container.on("click","a.view-receipt-btn",function(e){
            e.stopPropagation();
            e.preventDefault();

            var width = $(window).width();
            var height = $(window).height();
            var features = "width='"+width+"',height='"+height+"'";
            window.open("../../../pages/finance/scp/empty_receipt.html","_blank",features);

        });


        //翻页
        $(".zl-paginate").on("click", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var p = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页

            if (pageType == "last") {
                p -= 1;
            }
            else if (pageType == "next") {
                p += 1;
            }
            else {
                return;
            }
            if (p == 0 || p > pages) {
                return;
            }
            $("#searchForm").find("input[name=page]").val(p);
            $("#searchForm").attr("action", "index.htm");
            $("#searchForm").submit();
        });

        //翻页
        $("#gotoPage").on("click", function (e) {
            var p = $("#gotoPageNum").val();
            if (!isPositiveNum(p) || parseInt(p) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(p) > parseInt($("#pages").val())) {
                p = $("#pages").val();
            }
            $("#searchForm").find("input[name=page]").val(p);
            $("#searchForm").attr("action", "index.htm");
            $("#searchForm").submit();
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                container.find(".search-btn").click();
            }
        })

        //单选
        $(".zl-fake-checkbox").on("click", function() {
            $(this).toggleClass("checked");
        });
        //全选
        $(".zl-fake-checkbox.all").on("click", function() {
            if ($(this).hasClass("checked")) {
                $("em[id^=item-]").addClass("checked");
            } else {
                $("em[id^=item-]").removeClass("checked");
            }
        });
        $(".zl-fake-radio").on("click", function() {
            $(".zl-fake-radio").toggleClass("checked");
        });

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }
        function openPostWindow(url, ids, title){
            var tempForm = document.createElement("form");
            tempForm.id="tempForm";
            tempForm.method="post";
            tempForm.action=url;
            tempForm.target="blank";
            var hideInput = document.createElement("input");
            hideInput.type="hidden";
            hideInput.name="ids";
            hideInput.value= ids;
            tempForm.appendChild(hideInput);
            var hideInput2 = document.createElement("input");
            hideInput2.type="hidden";
            hideInput2.name="title";
            hideInput2.value= title;
            tempForm.appendChild(hideInput2);
            if (tempForm.attachEvent) {  // IE
                tempForm.attachEvent("onsubmit",function(){ window.open('about:blank','blank'); });
            } else if (tempForm.addEventListener) {  // DOM Level 2 standard
                tempForm.addEventListener("onsubmit",function(){ window.open('about:blank','blank'); });
            }
            document.body.appendChild(tempForm);
            if (document.createEvent) { // DOM Level 2 standard
                evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("submit", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                tempForm.dispatchEvent(evt);
            } else if (tempForm.fireEvent) { // IE
                tempForm.fireEvent('onsubmit');
            }
            tempForm.submit();
            document.body.removeChild(tempForm);
        }

        function openWindow(name){
            //window.open('about:blank',name,'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');
            var screenWidth = (screen.availWidth - 10);
            var screenHeight = (screen.availHeight-50);
            var title = $(".receipt-title-dialog em.checked").attr("data-id");
            window.open(financeWeb_Path + "bill/receipt/print.htm", "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");

        }
    };

    pageView.dateRangeInit=function(){
        $(".zl-datetime-range").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            clearBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            //container.find(".search-btn").click();
        });
    }
    pageView.ysDateInit=function(){
        $("#js-month-picker").ysDatepicker({
            dateType:"year",//year,day
            callback:function(value){
                //console.log("======================")
                //console.log(value);
            }
        })
    }

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
    pageView.dateRangeInit();
});
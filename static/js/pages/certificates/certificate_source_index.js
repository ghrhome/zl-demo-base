

var pageView = (function($){
    var pageView = {};
    pageView.init = function(){
        $("#preloader").fadeOut("fast");

        var ys_main_swiper = new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });

        var page = $("#certificate-source-index");

        //列表搜索
        page.on("click", ".search-btn", function() {
            search();
        });

        //输入框搜索
        $( "input[name=orgFName]").autocomplete({
            source: JSON.parse(orgUnitJsonStr.replace(/(orgFName)/g, 'label')),
            minLength: 1,
            select: function( event, ui ) {
                this.value = ui.item.label;
                $("input[name=fid]").val(ui.item.fid);
                $("input[name=orgFNubmer]").val(ui.item.orgFNubmer);
                return false;
            }
        });

        //下拉
        $(".zl-dropdown").ysdropdown({
            callback:function(val, $elem){
                // if ($elem.data("id") == "inpay-type") {
                //     $("form").find("input[name=inpayType]").val(val);
                // }
                if ($elem.data("id") == "page-limit") {
                    $("form").find("input[name=itemsPerPage]").val(val);
                }
                search();
            }
        });
        $(".btn-group").ysdropdown("init");

        //单选
        page.on("click", ".zl-fake-checkbox:not(.all)", function () {
            $(this).toggleClass("checked");
        });
        //全选
        page.on("click", ".zl-fake-checkbox.all", function () {
            if ($(this).hasClass("checked")) {
                $(".zl-fake-checkbox").removeClass("checked");
            } else {
                $(".zl-fake-checkbox").addClass("checked");
            }
        });
        page.on("click", ".generate-btn", function() {
            if ($(".zl-fake-checkbox.checked").length == 0) {
                alert("请选择后再操作");return;
            }
            var ids = "";
            $(".zl-fake-checkbox.checked:not(.all)").each(function() {
                ids += $(this).attr("data-id") + ',';
            });
            pageView.loadingShow();
            $.ajax({
                type: 'post',
                url : financeWeb_Path + "finance/certificates/certificationGenerate.htm",
                data : {ids : ids},
                dataType: 'json',
                error: function () {
                    pageView.loadingHide();
                    alert("系统异常");
                },
                success: function (res) {
                    pageView.loadingHide();
                    if (res.code == '0') {
                        alert(res.msg,"","",function(){
                            window.location = window.location;
                        });
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });

        //翻页
        page.on("click", ".zl-paginate", function (e) {
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
            search(page);
        });

        //翻页
        page.on("click", "#gotoPage", function (e) {
            var page = $("#gotoPageNum").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                page = $("#pages").val();
            }
            search(page);
        });

        $('#gotoPageNum').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                pageView.loadingShow();
                $("#gotoPage").click();
            }
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                search();
            }
        });
        //清空
        $('.clear-btn').on('click', function (event) {
            $("#highSearchForm").find("input").val("");
            $("#highSearchForm").find("button").html("");
        });
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }
        function search(page) {
            pageView.loadingShow();
            if (!page) page = 1;
            $("form").find("input[name=page]").val(page);
            //$("form").find("input[name^=bootstrapDropdown]").remove();
            $("form").trigger("submit");
        }
    };
    pageView.datepickerInit = function () {
        var datepicker = $(".zl-datetimepicker").find("input[name=financeMonth]").datetimepicker({
            format: "yyyy-mm",
            todayBtn: "linked",
            clearBtn:"linked",
            startView: 3,
            minView: 4,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate', function(e){
        });
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
        }).on('changeDate', function(){
            //pageView.search();
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
    confirmAlert.init();
    pageView.init();
    pageView.datepickerInit();
    pageView.dateRangeInit();
});
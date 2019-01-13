var pageView = (function ($) {
    var pageView = {};

    pageView.pageInit = function () {
        var page = $("#certificateModelList");
        // 关键词搜索框添加绑定回车函数
        $('.js-search').bind('keypress', function(event) {
            if (event.keyCode == "13") {
                search();
            }
        });

        $(".zl-query-info").click(function () {
            var url = "certificateModelSave.htm";
            var inputVal = $(".submit").serializeArray();
            $.post(url, inputVal, function (result) {
                alert(result);
            });
        });

        //搜索
        page.on("click", ".search-btn", function() {
            search();
        });
        page.on("click", "#copyBtn", function() {
            var dataId = $(this).attr("dataId");
            confirm("确认复制该模板？", "", "", function (type) {
                if (type == "confirm") {
                    $.ajax({
                        url: financeWeb_Path + '/finance/certificates/certificateModelCopy.htm',
                        type: 'post',
                        data:{finCertificateModelId: dataId},
                        dataType: 'json',
                        error: function () {
                            alert("系统异常");
                        },
                        success: function (res) {
                            if (res.code == '0') {
                                alert(res.msg, "", "", function () {
                                    window.location = window.location;
                                });
                            } else {
                                alert(res.msg);
                            }
                        }
                    });
                }
            })
        });
        page.on("click", "#deleteBtn", function() {
            var dataId = $(this).attr("dataId");
            confirm("确认删除该模板？", "", "", function (type) {
                if (type == "confirm") {
                    $.ajax({
                        url: financeWeb_Path + '/finance/certificates/certificateModelDelete.htm',
                        type: 'post',
                        data:{finCertificateModelId: dataId},
                        dataType: 'json',
                        error: function () {
                            alert("系统异常");
                        },
                        success: function (res) {
                            if (res.code == '0') {
                                alert(res.msg, "", "", function () {
                                    window.location = window.location;
                                });
                            } else {
                                alert(res.msg);
                            }
                        }
                    });
                }
            })
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
        $(".zl-dropdown").ysdropdown({
            callback: function (val, $elem) {
                search();
            }
        });
        $(".btn-group").ysdropdown("init");

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }
        function search(page) {
            if (!page) page = 1;
            $("form").find("input[name=page]").val(page);
            //$("form").find("input[name^=bootstrapDropdown]").remove();
            pageView.loadingShow();
            $("form").trigger("submit");
        }

        var ys_main_swiper = new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false,
            grabCursor:true,
            scrollbarDraggable : true ,
            preventClicksPropagation:true
        });

        $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
            var _index=$(this).index();

            $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

        });

        $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
            var _index=$(this).index();

            $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');

        });
    }

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }


    // 模糊查询自动填入
    pageView.autocomplete = function () {
        $(".js-search").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "certificateList.htm",
                    type: "POST",
                    dataType: "json",
                    data: {
                        modelNo: request.term,
                        page: 1,
                        pages: 1
                    },
                    success: function (data) {
                        response($.map(data["data"], function (item) {
                            return {
                                label: item.modelNo
                            }
                        }));
                    }
                });
            },
            minLength: 2,
            select: function (event, ui) {
                this.value = ui.item.label;
                loadPage();
                return false;
            }
        });
    }

    pageView.init = function () {
        $("#preloader").fadeOut("fast");
        // confirmAlert.init();
        pageView.pageInit();
        pageView.autocomplete();
    };


    return pageView;

})(jQuery);

$(document).ready(function () {
    confirmAlert.init();
    pageView.init();
});
var pageView = (function($){

    var pageView = {};

    pageView.init = function () {

        $("#preloader").fadeOut("fast");

        var page =  $("#certificate_upload_index");

        new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide: false
        });

        $(".btn-group").ysdropdown({
            callback:function(val, $elem){
                $("form").find("input[name=page]").val(1);
                $("form").trigger("submit");
            }
        });

        //单选
        page.on("click", ".zl-fake-checkbox:not(.all)", function() {
            $(this).toggleClass("checked");
        });
        //全选
        page.on("click", ".zl-fake-checkbox.all", function() {
            if ($(this).hasClass("checked")) $('.zl-fake-checkbox:not(.all)').removeClass("checked");
            if (!$(this).hasClass("checked")) $('.zl-fake-checkbox:not(.all)').addClass("checked");
            $(this).toggleClass("checked");
        });
        //搜索
        page.on("click", "a.zl-search", function() {
            $("from").find("input[name=page]").val(1);
            $("form").trigger("submit");
        });

        page.on("click", ".detail-btn", function () {
            var id = $(this).parents("td").attr("data-id");
            if (id)  window.location = financeWeb_Path + 'finance/certificates/detail.htm?id=' + id;
        });

        page.on("click", ".source-btn", function () {
            var id = $(this).parents("td").attr("data-id");
            if (id)  window.location = financeWeb_Path + 'finance/certificates/source.htm?certId=' + id;
            //if (id)  window.location = financeWeb_Path + 'finance/certification/certificateSource.htm?certId=' + id;
        });

        page.on("click", ".upload-btn", function () {
            var ids = '';
            $(".zl-fake-checkbox.checked:not(.all)").each(function() {
                ids += $(this).attr('data-id') + ",";
            });
            if ($.trim(ids) == '' || ids == undefined || ids == "undefined") {
                alert("请选择后操作");
            } else {
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + 'finance/certificates/upload.htm',
                    type: 'post',
                    data:{ids: ids},
                    dataType: 'json',
                    error: function () {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (res) {
                        pageView.loadingHide();
                        if (res.code == "0") {
                            alert(res.msg, "", "", function(){
                                window.location = window.location;
                            });
                        } else {
                            alert(res.msg);
                        }
                    }
                });
            }
        });

        page.on("click", ".reupload-btn", function () {
            var ids = '';
            $(".zl-fake-checkbox.checked:not(.all)").each(function() {
                ids += $(this).attr('data-id') + ",";
            });
            if ($.trim(ids) == '' || ids == undefined || ids == "undefined") {
                alert("请选择后操作");
            } else {
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + 'finance/certificates/reupload.htm',
                    type: 'post',
                    data:{ids: ids},
                    dataType: 'json',
                    error: function () {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (res) {
                        pageView.loadingHide();
                        if (res.code == "0") {
                            alert(res.msg, "", "", function(){
                                window.location = window.location;
                            });
                        } else {
                            alert(res.msg);
                        }
                    }
                });
            }
        });

        page.on("click", ".msg-btn", function () {
            alert($(this).attr("data-value"));
        });
        page.on("click", "a.delete-btn", function () {
            var id = $(this).parents("td").attr("data-id");
            confirm("确认删除该凭证？", "", "", function(type) {
                if (type == 'dismiss') return;
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + 'finance/certificates/deleteCertificate.htm',
                    type: 'post',
                    data:{id: id},
                    dataType: 'json',
                    error: function () {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (res) {
                        pageView.loadingHide();
                        if (res.code == "0") {
                            alert(res.msg, "", "", function(){
                                window.location = window.location;
                            });
                        } else {
                            alert(res.msg);
                        }
                    }
                });
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
            $("form").find("input[name=page]").val(page);
            $("form").trigger("submit");
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
            $("form").find("input[name=page]").val(page);
            $("form").trigger("submit");
        });

        $('#gotoPageNum').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#gotoPage").click();
            }
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("form").find("input[name=page]").val(1);
                $("form").trigger("submit");
            }
        });
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

    }
    pageView.dateRangeInit=function() {
        // var _startTimestamp = 0, _endTimestamp = 0;
        var dateStart = $(".zl-datetime-range").find("input.js-date-start").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            clearBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate', function (e) {
            // var _startDate = $(this).val();
            // _startTimestamp = e.timeStamp;
            // if (_startDate) {
            //     dateEnd.datetimepicker("setStartDate", _startDate);
            // } else {
            //     dateEnd.datetimepicker("setStartDate", null);
            // }
            // if (_endTimestamp < _startTimestamp) {
            //     dateEnd.val("");
            // }
            // dateEnd.datetimepicker("update");
        });

        var dateEnd = $(".zl-datetime-range").find("input.js-date-end").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            clearBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate', function (e) {
            // _endTimestamp = e.timeStamp;
        });
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
    pageView.dateRangeInit();
    confirmAlert.init();
    pageView.init();
});

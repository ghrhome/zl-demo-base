/*
    保证金应收
    liuqq at 2018-04-16
 */

var pageView=(function($){
    var pageView={};
    var flag = false;

    pageView.init=function(){

        $("#preloader").fadeOut("fast");
        var page = $("#invoice-index");

        //搜索
        page.on("click", ".search-btn", function() { $("form").submit(); });
        //作废
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

            // if ($(this).hasClass("zl-btn-disable")) return;
            // var ids = "";
            // $("em[id^=data-item-]").each(function () {
            //     if ($(this).hasClass("checked")) {
            //         var dataId = $(this).attr("data-id");
            //         ids += dataId + ",";
            //     }
            // });
            // if (ids == "") {
            //     alert("请选择后再执行该操作");
            // } else {
            //     confirm("确认作废选中项？","","",function(type){
            //         if (type == "dismiss") return;
            //         pageView.loadingShow();
            //         $.ajax({
            //             url: financeWeb_Path + "/bill/invoice/toInvalid.htm",
            //             data: {ids : ids},
            //             type: "post",
            //             dataType: "json",
            //             success: function (res) {
            //                 if (res.code == "0") {
            //                     $("form").submit();
            //                 } else {
            //                     alert(res.msg);
            //                 }
            //                 pageView.loadingHide();
            //             },
            //             error: function (res) {
            //                 alert(res.msg);
            //                 pageView.loadingHide();
            //             }
            //         });
            //     });
            // }
        });

        page.on("click", "a.view-reason-btn", function(e) {
            e.stopPropagation();
            e.preventDefault();
            alert($(this).attr("data-msg"));
        });

        //下拉
        $(".zl-dropdown").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "invoice-type") $("form").find("input[name=invoiceType]").val(val);
                if ($elem.data("id") == "invoice-status") $("form").find("input[name=status]").val(val);
                $("form").find("input[name=page]").val(1);
                $("form").trigger("submit");
            }
        });

        //列表左右滚动
        var ys_main_swiper = new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false,
            scrollbarDraggable:true,
            grabCursor:true,
            preventClicksPropagation:false
        });

        $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
            var _index=$(this).index();
            $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');
            console.log(_index)
        });

        $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
            var _index=$(this).index();
            $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');
            console.log(_index)
        });

        //到明细页
        page.on("click", ".zl-table tbody tr",function(e){
            var id = $(this).attr("data-id");
            // var status = $(this).attr("data-status");
            if(flag){
                flag = false;
                window.location = financeWeb_Path + "/bill/invoice/detail.htm?id=" + id;
            }
        });

        $(".view-receipt-btn").on("click", function (e) {
            flag = true;
        });

        // page.on("click","a.view-receipt-btn", function(e){
        //     e.stopPropagation();
        //     e.preventDefault();
        //     var width = $(window).width();
        //     var height = $(window).height();
        //     var features = "width='"+width+"',height='"+height+"'";
        //     window.open("../../../pages/finance/scp/empty_receipt.html","_blank",features);
        // });


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
            $("form").find("input[name=page]").val(page);
            $("form").submit();
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

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("form").find("input[name=page]").val(1);
                $("form").submit();
            }
        })

        page.on("click",".zl-table-block tbody tr",function(e){
            if($(e.target).hasClass("zl-checkbox:not(.disabled)")){
                $(e.target).toggleClass("checked");
                return;
            }
            $(this).find("em.zl-checkbox:not(.disabled)").toggleClass("checked");
        });

        page.on("click","em.zl-checkbox.all",function(e){
            $(this).toggleClass("checked")
            var $_tbody=$(this).closest("thead").next("tbody");
            console.log($_tbody)
            if($(this).hasClass("checked")){
                $_tbody.find("em.zl-checkbox:not(.disabled)").addClass("checked");
            }else{
                $_tbody.find("em.zl-checkbox").removeClass("checked");
            }

        });

        // //单选
        // $(".zl-checkbox").on("click", function() {
        //     if ($(this).hasClass("checked")) {
        //         $(this).removeClass("checked");
        //     } else {
        //         $(this).addClass("checked")
        //     }
        // });
        // //全选
        // $(".zl-checkbox.all").on("click", function() {
        //     if ($(this).hasClass("checked")) {
        //         $("em[id^=data-item-]").addClass("checked");
        //     } else {
        //         $("em[id^=data-item-]").removeClass("checked");
        //     }
        // });

        var invoiceType="";
        $("#receipt-dialog li").on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            var $elem=$(this).find(".zl-fake-radio")
            if($elem.hasClass("checked")){
                $elem.removeClass("checked")
            }else{
                $elem.closest("ul").find(".zl-fake-radio").removeClass("checked");
                $elem.addClass("checked");
            }

            invoiceType=$elem.data("value");

        });

        var ids = "";
        //开收据
        $(".invoicing").on("click", function(e) {
            // var ids = "";
            e.stopPropagation();
            e.preventDefault();
            // $("#receipt-dialog").modal("hide");
            if ($(this).hasClass("zl-btn-disable")) return;
            $("em[id^=data-item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var _this = this;
                    var status = $(this).attr("data-status");
                    if (status == 01 || status == 02 || status == 03 || status == 05 || status == 06) {
                        //$(_this).removeClass("checked");
                        // alert("已开票，不能重复开票")
                    }
                }
            });

            $("em[id^=data-item-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var dataId = $(this).attr("data-id");
                    ids += dataId + ",";
                }
            });
            if (ids != "") {
                // alert("请选择后再执行该操作")
                $("#receipt-dialog").modal("show")
            }
            else{
                alert("请选择后再执行该操作")
                // pageView.loadingShow();
            }
        });

        $(".cancel-btn").on("click",function () {
            ids="";
        });
        $("#receipt-dialog").on('show.bs.modal',function(){
            $(".input-remark").val("");
        })
        $("#receipt-dialog").on('hide.bs.modal',function(){
            ids="";
        })

        $(".save-btn").on("click", function (e) {
            if ($.trim(invoiceType) == '') {
                alert("请选择开票类型");
                return;
            }
            var billIds = '';
            $(".zl-checkbox.checked:not(.all)").each(function () {
                billIds += $(this).attr('data-id') + ',';
            });

            $("#receipt-dialog").modal("hide");
            pageView.loadingShow();
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: financeWeb_Path + "bill/invoice/invoicing.htm",
                    data: {id :billIds,invoiceType:invoiceType,remark: $(".input-remark").val()},
                    dataType:'json',
                    error: function (request) {
                        ids=""
                        alert("系统异常");
                    }, success: function (response) {
                        if(response.code == 0){
                            alert("已上传,上传结果请稍后查看","","",function(){
                                // loading();
                                ids=""
                                window.location = financeWeb_Path + "bill/invoice/index.htm" ;
                            })
                        }else{
                            ids=""
                            alert(response.msg);
                        }
                        pageView.loadingHide();
                    }

                });
        });

        //单据作废
        $(".invalid-btn").on("click", function(e) {
            var invoiceId = $(this).parent("td").parent("tr").attr("data-id");
            e.stopPropagation();
            e.preventDefault();
            // if ($(this).hasClass("zl-btn-disable")) return;
            // $("em[id^=cont-rece-]").each(function () {
            //     if ($(this).hasClass("checked")) {
            //         var _this = this;
            //         var status = $(this).attr("data-status");
            //         if (status != 02) {
            //             $(_this).removeClass("checked");
            //             // alert("已开票，不能重复开票")
            //         }
            //     }
            // });

            // $("em[id^=cont-rece-]").each(function () {
            //     if ($(this).hasClass("checked")) {
            //         var dataId = $(this).attr("data-id");
            //         ids += dataId + ",";
            //     }
            // });
            // if (ids == "") {
            //     alert("该单据不能执行此操作")
            // }else{
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "bill/invoice/invalid.htm",
                    data: {invoiceId : invoiceId},
                    type: "post",
                    dataType: "json",
                    error: function (request) {
                        alert("系统异常");
                    }, success: function (response) {
                        // alert("保存成功","","");
                        // var obj =JSON.parse(response);
                        if(response.code == 0){
                            alert("操作成功","","",function(){
                                // loading();
                                window.location = financeWeb_Path + "bill/invoice/index.htm" ;
                            })
                        }else{
                            alert(response.msg);
                        }
                        pageView.loadingHide();
                    }
                });
            // }
        });


        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }
    };

    pageView.dateRangeInit=function(){
        $(".zl-datetime-range").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            $("form").find("input[name=page]").val(1);
            $("form").submit();
        });
    }
    pageView.ysDateInit=function(){
        $("#js-month-picker").ysDatepicker({
            dateType:"year",//year,day
            callback:function(value){
                console.log("======================")
                console.log(value);
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
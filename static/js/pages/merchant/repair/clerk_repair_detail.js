var pageView = (function ($) {
    var pageView = {};

    pageView.init = function () {
        // 动态效果
        pageView.loadingHide();
        pageView.initStars();

        $('.zl-thumbnail').magnificPopup({
            type: 'image',
        });
    }

    // pageView.functionButton = function () {
    //     $(".zl-content").on("click", function (e) {
    //             var target = $(e.target);
    //             var dataQuery = {};
    //             dataQuery.serviceId = target.parents('tr').find('input').eq(0).val();
    //             dataQuery.mallId = target.parents('tr').find('input').eq(1).val();
    //
    //             if (target.is('a') && target.hasClass('repair_distribution')) {
    //                 e.stopPropagation();
    //                 pageView.loaunitOut(dataQuery);
    //                 $(".js-submit").on("click", function () {
    //                     dataQuery.repairerId = $('.modal-body').find(".checked").attr("data-userId");
    //                     dataQuery.repairName = $('.modal-body').find(".checked").attr("data-userName");
    //                     pageView.commonAjax("distribution", dataQuery);
    //                 })
    //             } else if (target.is('a') && target.hasClass('repair_revoke')) {
    //                 e.stopPropagation();
    //                 confirm("是否确认撤销", "", "alert_warn", function (type) {
    //                     if (type == "dismiss") {
    //                         console.log("取消成功！");
    //                     } else if (type == "confirm") {
    //                         pageView.revoke(dataQuery);
    //                     }
    //                 });
    //             } else if (target.is('a') && target.hasClass('repair_feedback')) {
    //                 e.stopPropagation();
    //                 formPost(merchantWeb_Path + "repair/feedback", dataQuery);
    //                 pageView.loadingHide();
    //             } else if (target.is('a') && target.hasClass('repair_confirm')) {
    //                 e.stopPropagation();
    //                 $("#confirmModal").modal("show");
    //                 $(".confirm_submit").onclick = "";
    //                 $(".confirm_submit").on("click", function (e) {
    //                     var confirmationResult =  $("#confirmModal").find(".checked").attr("data-value");
    //                     var confirmationRemark =  $("#confirmation_remark").val();
    //                     dataQuery.confirmationResult = confirmationResult;
    //                     dataQuery.confirmationRemark = confirmationRemark;
    //                     pageView.commonAjax("confirm", dataQuery);
    //                     $('#confirmModal').find('.meetBtn button').eq(0).addClass('checked').siblings().removeClass('checked')
    //                     $('#confirmation_remark').val('');
    //                 });
    //
    //             } else if (target.is('a') && target.hasClass('repair_evaluate')) {
    //                 e.stopPropagation();
    //                 $("#evaluateModal").modal("show");
    //                 $(".confirm_submit").onclick = "";
    //                 $(".evaluate_submit").on("click", function (e) {
    //                     var respond = $("#evaluateModal ul #respond").find(".checked").length;
    //                     var quality = $("#evaluateModal ul #quality").find(".checked").length;
    //                     var attitude = $("#evaluateModal ul #attitude").find(".checked").length;
    //                     var evaluateRemark = $("#evaluate_remark").val();
    //                     dataQuery.respond = respond;
    //                     dataQuery.quality = quality;
    //                     dataQuery.attitude = attitude;
    //                     dataQuery.remark = evaluateRemark;
    //                     pageView.commonAjax("evaluate", dataQuery);
    //                 });
    //             }
    //         }
    //     )
    //     $("#confirmModal .meetBtn button").on("click", function (e) {
    //         e.stopPropagation();
    //         e.preventDefault();
    //         $("#confirmModal .meetBtn button").removeClass("checked");
    //         $(this).addClass("checked");
    //     });
    //
    //     $("#evaluateModal .rateStar .star").on("click", function () {
    //         $(this).addClass("checked");
    //         $(this).prevAll(".star").addClass("checked");
    //         $(this).nextAll(".star").removeClass("checked");
    //     });
    //
    // }

    //初始化星星
    pageView.initStars = function () {
        $(".attitude").find("span").removeClass("checked");
        $(".quality").find("span").removeClass("checked");
        $(".respond").find("span").removeClass("checked");
        for(var i = 0; i < $(".quality").attr("data-value") ; i++ ){
            $(".quality").find("span")[i].className += " checked";
        }
        for(var i = 0; i < $(".attitude").attr("data-value") ; i++ ){
            $(".attitude").find("span")[i].className += " checked";
        }
        for(var i = 0; i < $(".respond").attr("data-value") ; i++ ){
            $(".respond").find("span")[i].className += " checked";
        }
    }

    //加载开始
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    //加载完成
    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    return pageView;
})(jQuery);

//页面初始化加载
$(document).ready(function () {
    pageView.loadingHide();
    pageView.init();
});
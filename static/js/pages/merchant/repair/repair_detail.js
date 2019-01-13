var pageView = (function ($) {
    var pageView = {};

    pageView.init = function () {
        // 动态效果
        pageView.loadingHide()

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

    pageView.functionButton = function () {
        //选中list条目
        $("#repair-charge-creation").unbind("click", ".zl-toolbar div div a").on("click", ".zl-toolbar div div a", function (e) {
            e.preventDefault();
            var dataQuery = {serviceId: $(this).find('input').eq(0).val()};
            if ($(this).hasClass('repair_distribution')) {
                formPost(merchantWeb_Path + "repair/distribution", dataQuery);
                console.log("分配");
            }else if($(this).hasClass('repair_revoke')){
                formPost(merchantWeb_Path + "repair/revoke", dataQuery);
                console.log("撤销");
            }else if($(this).hasClass('repair_feedback')){
                formPost(merchantWeb_Path + "repair/feedback", dataQuery);
                console.log("反馈");
            }else if($(this).hasClass('repair_confirm')){
                formPost(merchantWeb_Path + "repair/confirm", dataQuery);
                console.log("确认");
            }else if($(this).hasClass('repair_evaluate')){
                formPost(merchantWeb_Path + "repair/evaluate", dataQuery);
                console.log("评价");
            }

            pageView.loadingHide();
        });
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
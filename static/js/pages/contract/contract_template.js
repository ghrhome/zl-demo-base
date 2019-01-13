/**
 * Created by whobird on 2018/4/24.
 */

/**
 * Created by whobird on 2018/4/9.
 */

var contractView = (function ($) {
    var contractView = {};

    contractView.eventInit = function () {

    };

    contractView.listTreeInit = function () {
        console.log('====>>>');
        var clientHeight = $(window).height();
        $(".template-container").css("height", clientHeight - 60 + "px");
        $("iframe").css("height", clientHeight - 120 + "px");

        $.getJSON(contractWeb_Path + "contractTemplate/getTree.htm", {}, function (res) {
            $(".contract-list-tree").ysListTree({
                callback: _cb,
                nodeNameSpace: "nodeId",
                data: res,
                wrapperClass: "zl-contract-list-tree"
            });
        });

        var _cb = function (data) {
            $(".template-container-right>div.template-bar span.selected-tempate-name").html(data.name);
            $("[name=empty-text]").hide();
            var _iframe = $('iframe');

            if (isNaN(parseInt(data.id))) {
                _iframe.attr('src', base_Path + data.id);
                _iframe.show();
            } else {
                console.log(11)
                _iframe.hide();
                $("[name=empty-text]").show();
            }
        };


    };
    contractView.init = function () {
        $("#preloader").fadeOut("fast");
        contractView.listTreeInit();
    };

    return contractView;

})(jQuery);


$(document).ready(function () {
    contractView.init();
});
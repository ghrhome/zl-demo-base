
var baseView=(function($){
    var baseView={};

    var container=$("#brand_dist");
    baseView.init=function(){
        brandTree();
        bindEvent();
    };
    function showLoding() {
        var str="<div id='preloader'>" +
            "<div id='status'><i class='fa fa-spinner fa-spin'></i></div>" +
            "</div>";
        $(document.body).prepend(str);
    }
    function hideLoding() {
        $("#preloader").fadeOut("fast");
    }

    function brandTree(){
        showLoding();
        var treeHeight = parseInt($(".merchant-main-panel-right").css("height"))-20;
        var clientHeight = $(window).height();

        $("#brand-tree").css({
            "height":treeHeight+"px",
            "min-height":clientHeight-80-20+"px"
        });
        $(".merchant-main-panel-right").css({
            // "height":treeHeight+"px",
            "min-height":clientHeight-80-20+"px"
        });

        $.getJSON(ibrandWeb_Path+'/layout/tree.htm',{},function (res) {
            hideLoding();
            /*var data = {
                nodeId: "0",
                nodeName: "业态列表",
                expanded:true,
                hasChildren:true,
                children: res
            };*/

            var opts = {
                data:res,
                multiple:true,
                hasCheck:false,
                callback: {
                    onClick: function (nodeId, nodeName,nodePath,deep,_this) {
                        $('.zl-tree span').css('color','#333');
                        _this.children('span').css('color','#32aaff');
                        $('#frame-container').empty();
                        var frameContainer=$('#frame-container');
                        // var iframes = frameContainer.find('iframe');
                        // $.each(iframes,function (index,element) {
                        //     $(element).hide();
                        // });
                        var iframe=$("<iframe frameborder='0' scrolling='no'></iframe>");
                        iframe.width('100%');
                        iframe.height('100%');
                        iframe.attr('src',encodeURI(encodeURI(ibrandWeb_Path+'layout/frame.htm?parentId='+nodeId+'&level='+deep+'&nodePath='+nodePath)));
                        iframe.attr('frame',  'frame'+nodeId);
                        frameContainer.append(iframe);

                        //$("#frame-container").children("iframe:first-child").remove();
                        //console.log("xxxxxxxxxxxxx");
                    }
                }
            };

            $("#brand-tree").ysTree(opts);

        });
    }

    function bindEvent(){

    }

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});
var treeHeight = document.body.clientHeight - 160 - 41 - 20;

//加载合同类型树形结构
$(".zl-contract-trees").css({
    "min-height": treeHeight + "px"
});
//
var url = contractWeb_Path + "contractTemplate/getTree.htm";
$.ajax({
        url: url,
        type: "POST",
        dataType: 'json',
        success: function (data) {
            var opts = {
                data: data,
                hasCheck: false,
                callback: {
                    onClick: function (nodeId, nodeName, nodePath, a, _this) {
                        var nodeValue = $(_this).attr("nodevalue");
                        console.log(nodeValue)
                        if (nodeValue != 'undefined') {//第二层
                            var title = $(_this).find("span").html();
                            $(".selected-tempate-name").html(title);
                            $(".zl-contract-template-dialog iframe").show();
                            $(".zl-contract-template-dialog [name=empty-text]").hide();
                            $("[name=empty-text]").hide();
                            $("#iframe").show();
                            $("#iframe").attr("src", base_Path + nodeValue);
                        }
                    }
                }
            }
            $("#tree").ysTree(opts);
        }
    }
)


var clientHeight = $(window).height();
$(".template-container").css("height", clientHeight + "px");
$("iframe").css("height", clientHeight - 70 + "px");

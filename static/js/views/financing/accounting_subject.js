/**
 * Created by whobird on 2018/4/9.
 */

var pageView=(function($){
    var pageView={};

    var itemTemp=undefined;
    var _itemTempHtml=$("#table-row-template").html();
    itemTemp=Handlebars.compile(_itemTempHtml);

    pageView.render=function(url){
        $.get(url,function(data,status){
            console.log(data);
            var treeData=data.list_tree;

            var _cb=function(data){
                console.log(data);
            };

            $(".js-list-tree").ysListTreeTable({
                callback:_cb,
                nodeNameSpace:"nodeId",
                data:treeData,
                multiple:false,
                tableRowTemplate:itemTemp

            })
        })
    }

    pageView.init=function(){
        $("#preloader").fadeOut("fast");

        pageView.render("list_tree_table.json");


    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});

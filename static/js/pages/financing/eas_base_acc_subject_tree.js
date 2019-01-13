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
                //console.log(data);
            };

            $(".js-list-tree").ysListTreeTable({
                callback:_cb,
                nodeNameSpace:"nodeId",
                data:treeData,
                multiple:false,
                tableRowTemplate:itemTemp

            })
        })
    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        search();

        //同步按钮
        $("#synchroData").on("click", function () {
            pageView.loadingShow();
            $.ajax({
                url: financeWeb_Path + "financeBasis/loadeasBaseAccSubject.htm",  //请求地址
                type: "post",   //请求方式
                dataType: "json",  //数据类型
                contentType: 'application/json',
                timeout: 600000,
                success: function (res) {
                    pageView.loadingHide();
                    if (res.code == '0') {
                        alert("同步成功","","",function () {
                            window.location = window.location;
                        });
                    } else {
                        alert(res.msg);
                    }
                },
                //请求失败
                error: function () {
                    pageView.loadingHide();
                    alert("同步失败");
                }
            });
        });

        //搜索
        $(".search-btn").on("click", function() {
            search();
        })
        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                search();
            }
        });
        
        function search() {
            var url = financeWeb_Path + "easBaseAccSubject/getJsonData.htm";
            pageView.loadingShow();
            var searchWorld = $("input[name=searchWorld]").val();
            $.ajax({
                url : url,  //请求地址
                type : "post",   //请求方式
                data : {"searchWorld" : $.trim(searchWorld)},
                dataType : "json",
                success : function(res){
                    pageView.loadingHide();
                    var _cb=function(data){
                    };
                    $("#subject-size").html("共 "+(res.size || "")+" 个科目");
                    $(".js-list-tree").ysListTreeTable({
                        callback:_cb,
                        nodeNameSpace:"nodeId",
                        data: res.data,
                        multiple:false,
                        tableRowTemplate:itemTemp
                    });
                },
                //请求失败
                error: function(json){
                    alert("系统异常");
                    pageView.loadingHide();
                }
            });
        }

    };

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
});

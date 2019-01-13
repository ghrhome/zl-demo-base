/**
 * Created by whobird on 2018/4/24.
 */

/**
 * Created by whobird on 2018/4/9.
 */

var pageView=(function($){
    var pageView={};

    pageView.eventInit=function(){

    }

    pageView.listTreeInit=function(){
        var treeList={
                "preload":"preload data",
                "list_tree":[
                  {
                    "nodeId":0,
                    "nodeName":"租赁合同",
                    "expanded":true,
                
                    "children":[
                      {
                        "nodeId":1,
                        "nodeName":"租赁合同"
                      },
                      {
                        "nodeId":2,
                        "nodeName":"租赁合同(三方)"
                      }
                    ]
                  },
                  {
                    "nodeId":1,
                    "nodeName":"变更合同",
                    "children":[
                      {
                        "nodeId":11,
                        "nodeName":"主体变更"
                      },{
                        "nodeId":12,
                        "nodeName":"品牌变更"
                      },{
                        "nodeId":13,
                        "nodeName":"租户更名变更"
                      }
                    ]
                  }
                ]
        };
        var treeData=treeList.list_tree;
         var _cb=function(data){
                if("del"!=data.opt){
                    //alert(123);
                }
            };

        $(".contract-list-tree").ysListTree({
                callback:_cb,
                nodeNameSpace:"nodeId",
                data:treeData,
                wrapperClass:"zl-contract-list-tree"
            });


    }

    // pageView.listTreeInit=function(){
    //     var url="../../../../views/investment/contract_list_tree.json";
    //     $.get(url,"",function(data,status){
    //         data=eval("("+data+")");
    //         var treeData=data.list_tree;

    //         var _cb=function(data){
    //             if("del"!=data.opt){
    //                 alert(123);
    //             }
    //         }

    //         $(".contract-list-tree").ysListTree({
    //             callback:_cb,
    //             nodeNameSpace:"nodeId",
    //             data:treeData,
    //             wrapperClass:"zl-contract-list-tree"
    //         })
    //     })
    // }
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.listTreeInit();

    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
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
        var clientHeight = $(window).height();
        $(".template-container").css("height",clientHeight-60+"px");
        $("iframe").css("height",clientHeight-120+"px");
        var treeList={
                "preload":"preload data",
                "list_tree":[
                  {
                    "nodeId":0,
                    "nodeName":"城市商业公司",
                    "expanded":true,                
                    "children":[
                      {
                        "nodeId":1,
                        "nodeName":"广深城市商业公司",
                        "children":[
                            {
                                "nodeId":10,
                                "nodeName":"租赁合同",
                                "children":[
                                    {
                                        "nodeId":100,
                                        "nodeName":"广场商铺租赁合同(已统一开业广场适用)"
                                    },
                                    {
                                        "nodeId":101,
                                        "nodeName":"广场商铺日百统收类租赁合同(已统一开业广场日适用)"
                                    },
                                    {
                                        "nodeId":102,
                                        "nodeName":"广场商铺合作合同(已统一开业广场适用)"
                                    },
                                    {
                                        "nodeId":103,
                                        "nodeName":"广场商铺租赁合同(未统一开业广场适用)"
                                    },
                                    {
                                        "nodeId":104,
                                        "nodeName":"广场商铺日百统收类租赁合同(未统一开业广场日适用)"
                                    },
                                    {
                                        "nodeId":105,
                                        "nodeName":"广场商铺合作合同(未统一开业广场适用)"
                                    },
                                    {
                                        "nodeId":106,
                                        "nodeName":"多经合同(广告)"
                                    },
                                    {
                                        "nodeId":107,
                                        "nodeName":"多经合同(场地)"
                                    },
                                    {
                                        "nodeId":108,
                                        "nodeName":"租赁合同解约协议"
                                    }
                                ]
                            },
                            {
                                "nodeId":11,
                                "nodeName":"物业类"
                            },
                            {
                                "nodeId":12,
                                "nodeName":"营运类"
                            },
                            {
                                "nodeId":13,
                                "nodeName":"工程类"
                            },
                            {
                                "nodeId":14,
                                "nodeName":"战略类"
                            },
                            {
                                "nodeId":15,
                                "nodeName":"相关协议"
                            },
                            {
                                "nodeId":16,
                                "nodeName":"品牌商户合同模板"
                            }
                        ]
                      },
                      {
                        "nodeId":2,
                        "nodeName":"上海城市商业公司"
                      },
                      {
                        "nodeId":3,
                        "nodeName":"武汉城市商业公司"
                      },
                      {
                        "nodeId":4,
                        "nodeName":"西安城市商业公司"
                      },
                      {
                        "nodeId":5,
                        "nodeName":"杭州城市商业公司"
                      },
                      {
                        "nodeId":6,
                        "nodeName":"北京城市商业公司"
                      }
                    ]
                  }
                ]
        };
        var treeData=treeList.list_tree;
         var _cb=function(data){
                $(".template-container-right>div.template-bar span.selected-tempate-name").html(data.name);
                $("[name=empty-text]").hide();
                $("iframe").show();
                console.log(data);
            };

        $(".contract-list-tree").ysListTree({
                callback:_cb,
                nodeNameSpace:"nodeId",
                data:treeData,
                wrapperClass:"zl-contract-list-tree"
            });


    }
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.listTreeInit();

    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
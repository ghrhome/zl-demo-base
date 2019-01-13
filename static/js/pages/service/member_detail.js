(function(){
    $("#preloader").fadeOut("fast");

    var page = $("#member-detail");

    var data = {
        nodeName: "全部权限",
        children: [
            {
                nodeName: "服务",
                children:[
                    {nodeName:"发起服务"}
                ]
            },
            {
                nodeName: "经营",
                children:[
                    {nodeName:"查看经营数据"},
                    {nodeName:"录入销售额"}
                ]
            },
            {
                nodeName: "账单",
                children:[
                    {nodeName:"查看账单详情"},
                    {nodeName:"查看历史账单"}
                ]
            },
            {
                nodeName: "账号权限",
                children:[
                    {nodeName:"增加员工"},
                    {nodeName:"增加账号"}
                ]
            }
        ]
    };



    page.find(".authorization-tree").ysTree({
        hasCheck:true,
        expanded:true,
        readonly:true,
        startOffset:15,
        data:data
    });

    page.on("click",".my-authorization-title>a",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).toggleClass("collapsed");
        $(this).parent().next().slideToggle("fast");
    });

    //page.on("click","a.view-authorization-btn",function(e){
    //    e.stopPropagation();
    //    e.preventDefault();
    //
    //    var data = {
    //        nodeName: "全部权限",
    //        children: [
    //            {
    //                nodeName: "服务",
    //                children:[
    //                    {nodeName:"发起服务",checked:true}
    //                ]
    //            },
    //            {
    //                nodeName: "经营",
    //                children:[
    //                    {nodeName:"查看经营数据",checked:true},
    //                    {nodeName:"录入销售额"}
    //                ]
    //            },
    //            {
    //                nodeName: "账单",
    //                children:[
    //                    {nodeName:"查看账单详情",checked:true},
    //                    {nodeName:"查看历史账单"}
    //                ]
    //            }
    //        ]
    //    };
    //
    //
    //
    //    page.find(".authorization-tree").ysTree({
    //        multiple:true,
    //        hasCheck:true,
    //        expanded:true,
    //        readonly:true,
    //        data:data
    //    });
    //
    //    page.find(".zl-authorization-dialog").modal("show");
    //
    //});


})();

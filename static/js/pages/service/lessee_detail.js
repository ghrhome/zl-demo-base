(function(){
    $("#preloader").fadeOut("fast");

    var page = $("#lessee-detail");


    page.on("click",".zl-table-block tbody tr",function(e){
        e.stopPropagation();
        e.preventDefault();
        window.location = "member_detail.html";
    });

    page.on("click",".zl-table-block tbody tr",function(e){
        e.stopPropagation();
        e.preventDefault();
        window.location = "member_detail.html";
    });

    page.on("click","a.logout",function(e){
        e.stopPropagation();
        e.preventDefault();
    });

    page.on("click","a.enable-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        window.location = "member_detail.html";
    });

    page.on("click","a.view-authorization-btn",function(e){
        e.stopPropagation();
        e.preventDefault();

        var data = {
            nodeName: "全部权限",
            children: [
                {
                    nodeName: "服务",
                    children:[
                        {nodeName:"发起服务",checked:true}
                    ]
                },
                {
                    nodeName: "经营",
                    children:[
                        {nodeName:"查看经营数据",checked:true},
                        {nodeName:"录入销售额"}
                    ]
                },
                {
                    nodeName: "账单",
                    children:[
                        {nodeName:"查看账单详情",checked:true},
                        {nodeName:"查看历史账单"}
                    ]
                }
            ]
        };

        page.find(".authorization-tree").ysTree({
            multiple:true,
            hasCheck:true,
            expanded:true,
            readonly:true,
            data:data
        });
        page.find(".zl-authorization-dialog").modal("show");
    });


})();

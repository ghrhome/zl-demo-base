var baseView=(function($){
    var baseView={};
    var container=$("#brand_dist");
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        brandTree();
        //bindEvent();
    };

    $('.zl-dropdown-inline').on('click',function(){
        $(this).addClass("open");
    });

    $('.zl-dropdown').on('click',function(){
        $(this).addClass("open");
    });

    function brandTree(){
    	var treeHeight = parseInt($(".merchant-main-panel-right").css("height"))-20;
		var clientHeight = $(window).height();

		$("#brand-tree").css({
		   "height":treeHeight+"px",
		    "min-height":clientHeight-80-20+"px"
		});


		//---------------------------------------------------------------------
		var mallId = $("#mallId").val();
        var url = ibrandWeb_Path + "common/getLayoutTree.htm";
        $.ajax({
            url: url,
            type: "POST",
            data: {mallId:mallId},
            success: function (data) {
                var datas =$.parseJSON(data);
                console.log("onclick ...datas=="+datas);
                var opts = {
                    data:datas,
                    multiple:true,
                    hasCheck:true,
                    callback: {
                        onClick: function (nodeId, nodeName,nodePath) {
                            console.log("onclick ..."+nodeId+nodeName+nodePath);

                            var url = ibrandWeb_Path + "/brand/index.htm";
                            $("#searchPageForm").find("input[name=layout]").val(nodeId);
                            $("#searchPageForm").attr("action", url).submit();
                        },
                        checkboxChecked:function(nodeId,nodeName,nodePath){
                            console.log("checked ..."+nodeId+nodeName+nodePath);
                        },
                        checkboxUnchecked:function(nodeId,nodeName,nodePath){
                            console.log("unchecked ..."+nodeId+nodeName+nodePath);
                        }
                    }
                };

                $("#brand-tree").ysTree(opts);

            }
        });

		//---------------------------------------------------------------------






    };

/*    function bindEvent(){
    	container.on("click","tbody tr",function(){
    		//window.location="./brand_detail.html";
            formPost(ibrandWeb_Path + "brand/detail.htm", {id: id,page:$("#page").val()});
            hideLoading();
    	})
    }*/

    return baseView;

})(jQuery);

$('.but-val').on('click',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $(this).parent().parent().parent().find(".btn-default").attr("select-val",val);
});


$('.but-val-checkStatus').on('click',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $("#checkStatus").val(val);
});

$('.but-val-checkStatus2').on('click',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $("#checkStatus2").val(val);
});

$('.but-val-layout').on('click',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $("#layout2").val(val);
});





function viewDetail(id) {
    formPost(ibrandWeb_Path + "brand/detail.htm", {id: id,page:$("#page").val()});
    hideLoading();
}

$(".zl-seach-clear").click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#seachFromDetail :input')
        .not(' :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $("#seachFromDetail .dropdown-menu").each(function () {
        $(this).find("li:first a").click();
    })
});

$(".zl-seach-up").click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(".zl-add-collapse").slideToggle("fast");
});
$(document).ready(function(){
    baseView.init();
});
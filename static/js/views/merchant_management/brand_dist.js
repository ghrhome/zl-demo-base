var baseView=(function($){
    var baseView={};
    var container=$("#brand_dist");

    baseView.eventInit=function(){
        $("#js-brand-list").on("click","tbody tr",function(e){
            e.preventDefault();
            location.href="brand_detail.html";
        })
    }

    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        brandTree();

        baseView.eventInit();
        //bindEvent();
    };




    function brandTree(){
    	var treeHeight = parseInt($(".merchant-main-panel-right").css("height"))-20;
		var clientHeight = $(window).height();

		$("#brand-tree").css({
		   "height":treeHeight+"px",
		    "min-height":clientHeight-80-20+"px"
		});


		//---------------------------------------------------------------------
		var mallId = $("#mallId").val();
        var url = "./form_list.json";
        $.ajax({
            url: url,
            type: "POST",
            data: {mallId:mallId},
            success: function (data) {
                var datas =data;
                //console.log("onclick ...datas=="+datas);
                var opts = {
                    data:datas,
                    multiple:false,
                    hasCheck:false,
                    callback: {
                        onClick: function (nodeId, nodeName,nodePath) {
                            //console.log("onclick ..."+nodeId+nodeName+nodePath);

                          /*  var url = ibrandWeb_Path + "/brand/index.htm";
                            $("#searchPageForm").find("input[name=layout]").val(nodeId);
                            $("#searchPageForm").attr("action", url).submit();*/
                        },
                        checkboxChecked:function(nodeId,nodeName,nodePath){
                            //console.log("checked ..."+nodeId+nodeName+nodePath);
                        },
                        checkboxUnchecked:function(nodeId,nodeName,nodePath){
                            //console.log("unchecked ..."+nodeId+nodeName+nodePath);
                        }
                    }
                };

                $("#brand-tree").ysTree(opts);

            }
        });

		//---------------------------------------------------------------------






    };



    return baseView;

})(jQuery);

$(".zl-pagination").on("click",".zl-paginate",function(e){
    var pageType = $(this).attr("pageType"); // last、next
    var page = parseInt($("#page").val()); // 当前页
    var pages = parseInt($("#pages").val()); // 总页

    if(pageType == "last"){
        page -= 1;
    }
    else if(pageType == "next"){
        page += 1;
    }
    else{
        return;
    }

    if(page < 1){
        page = 1;
    }

    if(page > pages){
        page = pages;
    }

    $("#page").val(page);
    var isSenior = $("#isSenior").val();
    if (isSenior == 0) {
        $("#searchPageForm input[name=page]").remove();
        $("#searchPageForm").append("<input type='hidden' name='page' value='"+page+"'>");
        $("#searchPageForm").submit();
    } else {
        // 高级查询
        $("#seachFromDetail input[name=page]").remove();
        $("#seachFromDetail").append("<input type='hidden' name='page' value='"+page+"'>");
        $("#seachFromDetail").submit();
    }
});


$("#gotoPageNum").on("blur", function(e){
    if(!isPositiveNum($(this).val())||parseInt($(this).val())==0){
        alert("请输入合法数字！");
        $(this).val(1);
        return false;
    }
    if(parseInt($(this).val())>parseInt($("#pages").val())){
        //alert("超过总页数！");
        $(this).val($("#pages").val());
        return false;
    }
});


$("#gotoPage").on("click", function(e){
    $("#page").val($("#gotoPageNum").val());

    var isSenior = $("#isSenior").val();
    if (isSenior == 0) {
        $("#searchPageForm input[name=page]").remove();
        $("#searchPageForm").append("<input type='hidden' name='page' value='"+$("#gotoPageNum").val()+"'>");
        $("#searchPageForm").submit();
    } else {
        // 高级查询
        $("#seachFromDetail input[name=page]").remove();
        $("#seachFromDetail").append("<input type='hidden' name='page' value='"+$("#gotoPageNum").val()+"'>");
        $("#seachFromDetail").submit();
    }
});



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
    //$("#checkStatus").val("");
    $("#checkStatus2").val("");
    $("#layout2").val("");
    $(".zl-dropdown-btn").html("");
    /*$("#seachFromDetail .dropdown-menu").each(function () {
        $(this).find("li:first a").click();
    })*/
});

$(".zl-seach-up").click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(".zl-add-collapse").slideToggle("fast");
});
$(document).ready(function(){
    baseView.init();
});
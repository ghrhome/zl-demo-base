
var baseView=(function($){
    var baseView={};
    var container=$("#brand_dist");
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        loadingshow();
        generateTable();
        brandTree();
    };

    container.on("click",".zl-paginate",function(e){
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

        $("#gotoPageNum").val(page);
        $("#paginateForm").find("input[name=page]").val(page);
        loadingShow();
    });



    container.on("blur",".zl-page-num-input", function(e){
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

    function isPositiveNum(s) {//是否为正整数
        var re = /^[0-9]*[0-9][0-9]*$/;
        return re.test(s)
    }

    function loadingShow(){
        $(".zl-loading").fadeIn();
    };

    container.on("click",".zl-gotoPage", function(e){
        var page = $("#gotoPageNum").val();
        $("#paginateForm").find("input[name=page]").val(page);
        loadingShow();
    });

    container.on("click",".zl-seach-clear",function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("#brandNames").val("");
        $("#checkStatus2").val("");
        $("#layout2").val("");
        $("#checkStatus_but1").html("");
        $("#checkStatus_but2").html("");
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
        var url = ibrandWeb_Path + "layout/tree.htm";
        $.ajax({
            url: url,
            type: "POST",
            data: {mallId:mallId},
            success: function (data) {
                var datas =$.parseJSON(data);
                var opts = {
                    data:datas,
                    multiple:false,
                    hasCheck:false,
                    callback: {
                        onClick: function (nodeId, nodeName,nodePath) {
                            var url = ibrandWeb_Path + "/brand/query.htm";
                            if("all"!=nodeId){
                                $("#searchPageForm").find("input[name=layout]").val(nodeId);
                            }
                            generalQueryBtn();
                        }
                    }
                };

                $("#brand-tree").ysTree(opts);

            }
        });

    };

    function loading(page){
        console.log("page"+page);
        var url = ibrandWeb_Path + "brand/query.htm?page="+page;
        var fm = document.getElementById("searchPageForm");
        var formData = new FormData(fm);

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                loadingHide();
                $(".zl-content").empty();
                $(".zl-content").append(data);
                $(".zl-dropdown-inline").ysdropdown({
                    callback:function(val,$elem){
                    }
                });
            }
        });
    }

    function generateTable(){
        var url = ibrandWeb_Path + "brand/query.htm";
        $.ajax({
            url: url,
            type: "POST",
            success: function (data) {
                loadingHide();
                $(".zl-content").empty();
                $(".zl-content").append(data);
                $(".zl-dropdown-inline").ysdropdown({
                    callback:function(val,$elem){
                    }
                });
                //分页=====================================>>>>>
                container.on('click','.btn-pre-bottom',function () {
                    if(!$(this).hasClass('zl-btn-disable')){
                        loading((parseInt($('.page-index').html())-1));
                    }
                });
                container.on('click','.btn-next-bottom',function () {
                    if(!$(this).hasClass('zl-btn-disable')){
                        loading((parseInt($('.page-index').html())+1));
                    }
                });
                container.on('click','.zl-gotoPage',function () {
                    var value= parseInt($(this).parent().find("input[name=gotoPageNum]").val());
                    loading(parseInt(value));
                });
                //分页<<<<<<=====================================
            }
        });
    }

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
$('.but-val-brandGrades').on('click',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    if(val=='S'){
        val='1'
    }else if(val=='A'){
        val='2'
    }else if(val=='B'){
        val='3'
    }else if(val=='C'){
        val='4'
    }else{
        val=''
    }
    $("#brandGrades").val(val);
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

// 跳转到新增
function viewDetail(id) {
    formPost(ibrandWeb_Path + "brand/toEditView.htm", {id:id, page:$("#page").val()});
}

// 收起高级查询
$(".zl-seach-up").click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(".zl-add-collapse").slideToggle("fast");
});

// 普通查询
function generalQueryBtn(){
    loadingshow();
    //获取查询条件  品牌 入库状态 业态 应为条件都存在searchPageForm 中，一次提交searchPageForm即可
    var fm = document.getElementById("searchPageForm");
    var formData = new FormData(fm);
    var url = ibrandWeb_Path + "brand/query.htm";
    $.ajax({
        type: "POST",
        url:url,
        contentType: false,
        processData: false,
        data:formData,
        async: false,
        success:function(data) {
            $(".zl-content").empty();
            $(".zl-content").append(data);
            $(".zl-dropdown-inline").ysdropdown({
                callback:function(val,$elem){
                }
            });
            loadingHide();
        }
    });
}

// 高级查询
function advancedQuery() {
    loadingshow();
    //获取查询条件  品牌 入库状态 业态 应为条件都存在searchPageForm 中，一次提交searchPageForm即可
    var fm = document.getElementById("seachFromDetail");
    var formData = new FormData(fm);
    var url = ibrandWeb_Path + "brand/query.htm";
    $.ajax({
        type: "POST",
        url:url,
        contentType: false,
        processData: false,
        data:formData,
        async: false,
        success:function(data) {
            $(".zl-content").empty();
            $(".zl-content").append(data);
            $(".zl-dropdown-inline").ysdropdown({
                callback:function(val,$elem){
                }
            });
            loadingHide();
        }
    });
}

// 导入赢商网品牌对应信息
$("#importBrandYsMappingBtn").unbind('click').click(function () {
    $("<input type='file' name='file' style='display: none'/>").appendTo("body").change(function () {
        loadingshow();
        var formData = new FormData();
        formData.append('file', $(this).get(0).files[0]);
        $.ajax({
            url: ibrandWeb_Path+'brand/upload-excel.htm',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            loadingHide();
            alert(response.message);
        });
    }).trigger("click");
})

// 全量同步
function synchronizeAllBtn() {
    loadingshow();
    var url = ibrandWeb_Path + "brand/synchronizeAll.htm";
    $.ajax({
        type: "GET",
        url:url,
        success:function(data) {
            alert("同步成功")
            loadingHide();
        }
    });
}

function loadingshow(){
    $(".zl-loading").fadeIn();
};

function loadingHide(){
    $(".zl-loading").fadeOut();
}

// 13
$(document).keydown(function (e) {
    if(e.keyCode===13){
        $('#querySearch').trigger('click');
    }
});

$(document).ready(function(){
    baseView.init();
});


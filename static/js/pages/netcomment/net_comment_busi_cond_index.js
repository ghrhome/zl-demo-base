$(function () {
    loadData();
});

function renderData(data,items,page,pages) {
    var dataHtml = '';
    if (data.length) {
        var num = 1;var opt = '';
        for (var i = 0; i < data.length; i++) {
            dataHtml+= '<tr onclick=openDetail('+ data[i].id +')><td>租赁条件/' + setStr(data[i].fileTitle) + '</td>'
                + '<td>' + setStr(data[i].id) + '</td>'
                + '<td>' + setStr(data[i].billStatusShow) +'</td>'
                + '<td>' + setStr(data[i].mallName) +'</td>'
                + '<td>' + setStr(data[i].originalName) +'</td>'
                + '<td>' + setStr(data[i].approveName) +'</td>'
                + '<td>' + timeStampConvert(data[i].approveStartDate,"yyyy-MM-dd") + '</td></tr>';
            setPageBtn(items,page,pages);
        }
    } else {
        dataHtml='<tr><td colspan="6">'
            +'<p>暂无数据~</p>'
            +'</td></tr>';
        setPageBtn(0,0,0);
    }
    return dataHtml;
}

function loadData() {
    var page = $("#gotoPageNum").val();
    var searchType = $("#searchType").val();
    var url = netcommentWeb_Path + "netcomment/busicond/getData.htm?page="+((null==page||''==page)?0:page)+"&searchType="+searchType;
    $.ajax({
        url : url,  //请求地址
        type : "post",   //请求方式
        dataType : "json",  //数据类型
        contentType: 'application/json',
        data : JSON.stringify(getParam("searchForm")),
        success : function(res){
            if (res.code === '100') {
                $(".table_context").html(renderData(res.data.results,res.data.items,res.data.page,res.data.pages));
            } else {
                alert(res.msg);
            }
        },
        //请求失败
        error: function(json){
        }
    })
}

//编辑按钮
$("body").on("click",".zl-text-btn",function(){
    var _this = $(this);
    var fid = _this.attr("data-id");
    $("#fid").val(fid);
    $('#ac-modal').modal('show');
})

//下拉框
var page = $("#net_comment_busi_cond_index");
page.on("click",'.zl-dropdown .dropdown-menu li',function (e) {
    var name=$(this).children('a').html();
    var id=$(this).children('a').data('value');
    var btn=$(this).parents('.zl-dropdown').children('button');
    $("#formType").val(name);
    btn.html(name);
    btn.attr('data-id',id);
});

$("#searchForm a").on("click", function () {
    if ($(this).attr("searchType") != undefined) {
        $("div.zl-check-btn-group .active").removeClass("active");
        $(this).addClass("active");
        $("#searchType").val($(this).attr("searchType"));
    }
    $("#gotoPageNum").val(0);
    loadData();
});



function openDetail(masterId) {
    formPost(netcommentWeb_Path + "netcomment/openBillDetailByMasterId.htm", {masterId: masterId,isIndex:true});
}

function showLoading(){
    if($(".zl-loader").length==0){
        $("body").append("<div class='zl-loader'></div>");
    }
    $(".zl-loader").show();
}

$("#newAdd").click(function () {
    var billType = $("#billType").val();
    if (billType == null || billType == "") {
        billType = "01";
    }
    formPost(netcommentWeb_Path + "netcomment/toNewAdd.htm", {billType: billType});
});


$("#preloader").fadeOut("fast");

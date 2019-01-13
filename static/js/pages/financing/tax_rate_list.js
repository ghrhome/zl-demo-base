(function () {
    //新增按钮
    $("#addDetail").on("click",function(e){
        toDetail("add",null);
    });

    //新增按钮
    $("#searchFormBtn").on("click",function(e){
        loadData();
    });

    //设置按钮
    $("body").on("click",".zl-linkable",function(){
        var _this = $(this);
        var id = _this.attr("data-id");
        toDetail("detail",id);
    })
}());

$(function () {
    loadData();
});
pageView = {};
pageView.loadData = function(){loadData()};
function renderData(data,items,page,pages) {
    var dataHtml = '';
    if (data.length) {
        var num = 1;var opt = '';
        for (var i = 0; i < data.length; i++) {
            dataHtml+= '<tr><td title="'+ setStr(data[i].mallName) +'">' + setStr(data[i].mallName) + '</td>'
                + '<td title="'+ setStr(data[i].blockName) +'">' + setStr(data[i].blockName) + '</td>'
                + '<td title="'+ setStr(data[i].rateType) +'">' + setStr(data[i].rateType) + '</td>'
                + '<td>' + setStr(timeStampConvert(data[i].effectiveDate, 'yyyy-MM-dd')) + '</td>';
                if (hasUpdateAuth == 'true') {
                    dataHtml += '<td><a class="zl-linkable" >' + setSetting(data[i].id) + '</a></td></tr>';
                } else {
                    dataHtml += '</tr>';
                }
        }
        setPageBtn(items,page,pages);
    } else {
        dataHtml='<tr><td colspan="3">'
            +'<p>暂无数据~</p>'
            +'</td></tr>';
        setPageBtn(0,0,0);
    }
    return dataHtml;
}

function setSetting(id) {
    var setting = '<a class="zl-linkable" data-id="'+id+'">设置</a>';
    return setting;
}

function loadData() {
    var page = $("#gotoPageNum").val();
    var url = financeWeb_Path + "taxRate/getData.htm?page="+((null==page||''==page)?0:page);
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

function toDetail(flag,id){
    var url = "";
    if("add"==flag)
        url = financeWeb_Path + "taxRateEdit/toDetail.htm?flag="+flag;
    else if ("detail"==flag)
        url = financeWeb_Path + "taxRateEdit/toDetail.htm?flag="+flag+"&id="+id;
    window.location.href=url;
}

$("#preloader").fadeOut("fast");
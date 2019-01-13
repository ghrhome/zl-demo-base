(function(){
    //新增按钮
    $(".zl-btn-add").on("click",function(e){
        var addParm = getParam("subForm");
        if(!addParm.paymentTermNumber){
            alert("收款方式编码不能为空");
            return false;
        }else if(!addParm.paymentTermName){
            alert("收款方式名称不能为空");
            return false;
        }
        addData(addParm);
    });
})();

$(function () {
    loadData();
});
function renderData(data,items,page,pages) {
    var divbegin= $("#dataDivBegin").html();
    var divEnd= $("#dataDivEnd").html();
    var dataHtml = '';
    if (data.length) {
        for (var i = 0; i < data.length; i++) {
            dataHtml+=divbegin+ '<li class="zl-table-cell"><span class="zl-cell text-left">' + setStr(data[i].paymentTermNumber) + '</span></li>'
                + '<li class="zl-table-cell"><span class="zl-cell text-left">' + setStr(data[i].paymentTermName) + '</span></li>'
                + '<li class="zl-table-cell"><span class="zl-cell text-left">' + setFiscfReeze(data[i].fiscfReeze) + '</span></li>'
                + '<li class="zl-table-cell"><span class="zl-cell text-left"><a onclick="updateDataBefor(this)" class="zl-linkable" data-value="'+data[i].id +'">' + setOperationByReeze(data[i].fiscfReeze) + '</a></span></li>'
                +divEnd;
        }
        setPageBtn(items,page,pages);
    } else {
        dataHtml='';
        setPageBtn(0,0,0);
    }
    return dataHtml;
}

function loadData() {
    var page = $("#gotoPageNum").val();
    var url = financeWeb_Path + "paymentTerm/getData.htm?page="+((null==page||''==page)?0:page);
    $.ajax({
        url : url,  //请求地址
        type : "post",   //请求方式
        dataType : "json",  //数据类型
        contentType: 'application/json',
        data : JSON.stringify(getParam("searchForm")),
        success : function(res){
            if (res.code === '100') {
                $(".table-row-data").html(renderData(res.data.results,res.data.items,res.data.page,res.data.pages));
            } else {
                alert(res.msg);
            }
        },
        //请求失败
        error: function(json){
        }
    })
}

function addData(addParm) {
    var url = financeWeb_Path + "paymentTerm/addData.htm";
    $.ajax({
        url : url,  //请求地址
        type : "post",   //请求方式
        dataType : "json",  //数据类型
        contentType: 'application/json',
        data : JSON.stringify(addParm),
        success : function(res){
            if (res.code === '100') {
                alert(res.data);
                var toUrl = financeWeb_Path + "paymentTerm/index.htm";
                window.location.href=toUrl;
            } else {
                alert(res.msg);
            }
        },
        //请求失败
        error: function(json){
        }
    })
}
//冻结解冻
function updateDataBefor(obj) {
    var updateParm ={};
    var id = obj.getAttribute("data-value");
    updateParm.id=id;
    var str = obj.innerText;
    if("冻结"==str)
        updateParm.fiscfReeze=1;
    else
        updateParm.fiscfReeze=0;
    updateData(updateParm);
};

function updateData(updateParm) {
    var url = financeWeb_Path + "paymentTerm/updateData.htm";
    $.ajax({
        url : url,  //请求地址
        type : "post",   //请求方式
        dataType : "json",  //数据类型
        contentType: 'application/json',
        data : JSON.stringify(updateParm),
        success : function(res){
            if (res.code === '100') {
                alert("操作成功");
                var toUrl = financeWeb_Path + "paymentTerm/index.htm";
                window.location.href=toUrl;
            } else {
                alert(res.msg);
            }
        },
        //请求失败
        error: function(json){
        }
    })
}
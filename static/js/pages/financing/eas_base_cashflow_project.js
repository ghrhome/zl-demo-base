//==========================================
var pageView=(function($){
    var pageView={};
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var page = $("#account-set");
        pageView.loadData();
        //同步按钮
        $("#synchroData").on("click", function () {
            pageView.loadingShow();
            $.ajax({
                url: financeWeb_Path + "financeBasis/loadEasBaseCashflowItem.htm",  //请求地址
                type: "post",   //请求方式
                dataType: "json",  //数据类型
                contentType: 'application/json',
                success: function (res) {
                    pageView.loadingHide();
                    if (res.code == '0') {
                        alert("同步成功","","",function () {
                            window.location = window.location;
                        });
                    } else {
                        alert(res.msg);
                    }
                },
                //请求失败
                error: function () {
                    pageView.loadingHide();
                    alert("同步失败");
                }
            });
        });
    }
    pageView.renderData =  function (data,items,page,pages) {
        var dataHtml = '';
        if (data.length) {
            var num = 1;var opt = '';
            for (var i = 0; i < data.length; i++) {
                var status = data[i].fiscfReeze;
                if (status == 0) status = '冻结';
                if (status == 1) status = '正常';
                dataHtml+= //'<tr><td>' + setStr(data[i].orgFNumber) + '</td>'
                     '<tr><td>' + setStr(data[i].fNumber) + '</td>'
                    + '<td title="'+ setStr(data[i].cashflowName) +'">' + setStr(data[i].cashflowName) + '</td>'
                    + '<td>' + setStr(data[i].updaterName) + '</td>'
                    + '<td>' + timeStampConvert(data[i].updatedDate,"yyyy-MM-dd hh:mm:ss") + '</td>'
                    + '<td>' + status + '</td></tr>';
            }
            setPageBtn(items,page,pages);
        } else {
            dataHtml='<tr><td colspan="7">'
                +'<p>暂无数据~</p>'
                +'</td></tr>';
            setPageBtn(0,0,0);
        }
        return dataHtml;
    }

    pageView.loadData = function () {
        var page = $("#gotoPageNum").val();
        var url = financeWeb_Path + "easBaseCashflowItem/getData.htm?page=" + ((null == page || '' == page) ? 0 : page);
        $.ajax({
            url: url,  //请求地址
            type: "post",   //请求方式
            dataType: "json",  //数据类型
            contentType: 'application/json',
            data: JSON.stringify(getParam("searchForm")),
            success: function (res) {
                if (res.code === '100') {
                    $(".table_context").html(pageView.renderData(res.data.results, res.data.items, res.data.page, res.data.pages));
                } else {
                    alert(res.msg);
                }
            },
            //请求失败
            error: function (json) {
            }
        })
    }
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    return pageView;
})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});







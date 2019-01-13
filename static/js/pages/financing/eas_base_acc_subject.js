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
                url: financeWeb_Path + "financeBasis/loadeasBaseAccSubject.htm",  //请求地址
                type: "post",   //请求方式
                dataType: "json",  //数据类型
                contentType: 'application/json',
                timeout: 600000,
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

    pageView.loadData = function () {
        var page = $("#gotoPageNum").val();
        var url = financeWeb_Path + "easBaseAccSubject/getData.htm?page="+((null==page||''==page)?0:page);
        $.ajax({
            url : url,  //请求地址
            type : "post",   //请求方式
            dataType : "json",  //数据类型
            contentType: 'application/json',
            data : JSON.stringify(getParam("searchForm")),
            success : function(res){
                if (res.code === '100') {
                    $(".table_context").html(pageView.renderData(res.data.results,res.data.items,res.data.page,res.data.pages));
                } else {
                    alert(res.msg);
                }
            },
            //请求失败
            error: function(json){
            }
        })
    }
    pageView.renderData = function (data,items,page,pages) {
        var dataHtml = '';
        if (data.length) {
            var num = 1;var opt = '';
            for (var i = 0; i < data.length; i++) {
                dataHtml+= '<tr><td>' + setStr(data[i].orgFNubmer) + '</td>'
                    + '<td>' + setStr(data[i].accFNumber) + '</td>'
                    + '<td>' + setStr(data[i].accFName) + '</td>'
                    + '<td class="text-center">' + setStr(data[i].assFNumber) + '</td>'
                    + '<td class="text-center">' + timeStampConvert(data[i].updatedDate,"yyyy-MM-dd hh:mm:ss") + '</td>'
                    + '<td class="text-center">' + setFiscfReeze(data[i].fiscFreeze) + '</td></tr>';
            }
            setPageBtn(items,page,pages);
        } else {
            dataHtml='<tr><td colspan="5">'
                +'<p>暂无数据~</p>'
                +'</td></tr>';
            setPageBtn(0,0,0);
        }
        return dataHtml;
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
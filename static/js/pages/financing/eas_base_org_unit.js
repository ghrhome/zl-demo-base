
//=============================
var pageView=(function($){
    var pageView={};
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var page = $("#account-set");
        pageView.loadData();

        //编辑按钮
        $("body").on("click",".zl-text-btn",function(){
            var _this = $(this);
            var fid = _this.attr("data-id");
            $("#fid").val(fid);
            $('#ac-modal').modal('show');
        });

//下拉框
        var page = $("#account-set");
        page.on("click",'.zl-dropdown .dropdown-menu li',function (e) {
            var name=$(this).children('a').html();
            var id=$(this).children('a').data('value');
            var btn=$(this).parents('.zl-dropdown').children('button');
            $("#formType").val(name);
            btn.html(name);
            btn.attr('data-id',id);
        });

        //修改按钮
        $("#subUpdate").on("click",function(){
            updateData();
        })

        //修改方法
        function updateData() {
            $.ajax({
                url : financeWeb_Path + "easBaseOrgUnit/updateData.htm",  //请求地址
                type : "post",   //请求方式
                dataType : "json",  //数据类型
                contentType: 'application/json',
                data : JSON.stringify(getParam("formTypeFrom")),
                success : function(res){
                    if (res.code === '100') {
                        $('#ac-modal').modal('hide');
                        alert("修改成功","","",function(){
                            pageView.loadData();
                        });
                    } else {
                        alert(res.msg);
                    }
                },
                //请求失败
                error: function(json){
                }
            });
        }

        //同步按钮
        $("#synchroData").on("click", function () {
            pageView.loadingShow();
            $.ajax({
                url: financeWeb_Path + "financeBasis/loadEasBaseOrgUnit.htm.htm",  //请求地址
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
                dataHtml+= '<tr><td>' + setStr(data[i].orgFNubmer) + '</td>'
                    + '<td title="'+ setStr(data[i].orgFName) +'" >' + setStr(data[i].orgFName) + '</td>'
                    // + '<td>' + setStr(data[i].formType) + '</td>'
                    // + '<td><a class="zl-text-btn" style="margin-left: 0px"  data-id="'+data[i].fid+'" >编辑</a></td>'
                    + '<td>' + timeStampConvert(data[i].updatedDate,"yyyy-MM-dd hh:mm:ss") + '</td>'
                    + '<td>' + setFiscfReeze(data[i].fiscfReeze) + '</td></tr>';
                setPageBtn(items,page,pages);
            }
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
        var url = financeWeb_Path + "easBaseOrgUnit/getData.htm?page="+((null==page||''==page)?0:page);
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




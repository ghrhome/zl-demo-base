var pageView=(function($){
    var pageView={};
    pageView.init=function() {

        $("#preloader").fadeOut("fast");
        loadData();

        $(".zl-btn-add").on("click", function (e) {
            var addParm = getParam("subIncomeTypeForm");
            if (!addParm.incomeNumber) {
                alert("收入编码不能为空");
                return false;
            } else if (!addParm.incomeName) {
                alert("收入类型不能为空");
                return false;
            } else if (!addParm.storeType) {
                alert("商铺类型不能为空");
                return false;
            }
            addData(addParm);
        });
        $(".btn-group").ysdropdown({
            callback: function (val, $elem) {
                if ($elem.data("id") == "store-type") {
                    $("#subIncomeTypeForm").find("input[name$=storeType]").val(val);
                }
            }
        });

        function renderData(data,items,page,pages) {
            var divbegin= $("#dataDivBegin").html();
            var divEnd= $("#dataDivEnd").html();
            var dataHtml = '';
            if (data.length) {
                for (var i = 0; i < data.length; i++) {
                    var storeTypeName = "";
                    if (storeTypeMap[data[i].storeType]) storeTypeName = storeTypeMap[data[i].storeType].name;
                    dataHtml+=divbegin+ '<li class="zl-table-cell"><span class="zl-cell text-left">' + setStr(data[i].incomeNumber) + '</span></li>'
                        + '<li class="zl-table-cell"><span class="zl-cell text-left">' + setStr(data[i].incomeName) + '</span></li>'
                        + '<li class="zl-table-cell"><span class="zl-cell text-left">' + setStr(storeTypeName) + '</span></li>'
                        + '<li class="zl-table-cell"><span class="zl-cell text-left">' + setFiscfReeze(data[i].fiscfReeze) + '</span></li>'
                        + '<li class="zl-table-cell"><span class="zl-cell text-left"><a class="zl-linkable freeze" data-value="'+data[i].id +'">' + setOperationByReeze(data[i].fiscfReeze) + '</a></span></li>'
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
            var url = financeWeb_Path + "incomeType/getData.htm?page="+((null==page||''==page)?0:page);
            $.ajax({
                url : url,  //请求地址
                type : "post",   //请求方式
                dataType : "json",  //数据类型
                contentType: 'application/json',
                data : JSON.stringify(getParam("searchForm")),
                success : function(res){
                    if (res.code === '100') {
                        $(".table-row-data").html(renderData(res.data.results,res.data.items,res.data.page,res.data.pages));
                        //冻结解冻
                        $("a.freeze").on("click", function() {
                            var text = $(this).text();
                            var id = $(this).attr("data-value");
                            confirm("确认操作？","","",function (type){
                                if (type == "dismiss") return;
                                var updateParm ={};
                                updateParm.id = id;
                                if("冻结"== text)
                                    updateParm.fiscfReeze=1;
                                else
                                    updateParm.fiscfReeze=0;
                                updateData(updateParm);
                            });
                        });
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
            var url = financeWeb_Path + "incomeType/addData.htm";
            $.ajax({
                url : url,  //请求地址
                type : "post",   //请求方式
                dataType : "json",  //数据类型
                contentType: 'application/json',
                data : JSON.stringify(addParm),
                success : function(res){
                    if (res.code === '100') {
                        alert(res.data);
                        var toUrl = financeWeb_Path + "incomeType/index.htm";
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


        function updateData(updateParm) {
            var url = financeWeb_Path + "incomeType/updateData.htm";
            pageView.loadingShow();
            $.ajax({
                url : url,  //请求地址
                type : "post",   //请求方式
                dataType : "json",  //数据类型
                contentType: 'application/json',
                data : JSON.stringify(updateParm),
                success : function(res){
                    pageView.loadingHide();
                    if (res.code === '100') {
                        alert("操作成功","","",function(){
                            var toUrl = financeWeb_Path + "incomeType/index.htm";
                            window.location.href=toUrl;
                        });
                    } else {
                        alert(res.msg);
                    }
                },
                //请求失败
                error: function(json){
                    pageView.loadingHide();
                }
            })
        }
    }

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    return pageView;

})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});

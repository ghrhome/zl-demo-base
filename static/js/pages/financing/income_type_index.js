var pageView=(function($){
    var pageView={};
    pageView.init=function() {

        $("#preloader").fadeOut("fast");
        var page = $("#income-type-index");

        page.on("click",".save-btn", function () {
            var dataId = $(this).attr("data-id");
            if (dataId) {
                var updateParm = getParam("updateForm" + dataId);
                if (paramCheck(updateParm)) updateData(updateParm);
            } else {
                var addParm = getParam("addForm");
                if (paramCheck(addParm)) addData(addParm);
            }
        });

        //搜索
        page.on("click", ".search-btn", function() {
            $("#searchForm").find("input[name=page]").val(1);
            $("#searchForm").submit();
        });

        page.on("click", ".enable", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var dataId = $(this).attr("data-id");
            confirm("确认操作？","","",function (type){
                if (type == "dismiss") return;
                var updateParm ={};
                updateParm.id = dataId;
                updateParm.fiscfReeze = '0';
                freeze(updateParm);
            });
        });

        page.on("click", ".disable", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var dataId = $(this).attr("data-id");
            confirm("确认操作？","","",function (type){
                if (type == "dismiss") return;
                var updateParm ={};
                updateParm.id = dataId;
                updateParm.fiscfReeze = '1';
                freeze(updateParm);
            });
        });

        //翻页
        page.on("click", ".zl-paginate", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var page = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页

            if (pageType == "last") {
                page -= 1;
            }
            else if (pageType == "next") {
                page += 1;
            }
            else {
                return;
            }
            if (page == 0 || page > pages) {
                return;
            }
            $("#searchForm").find("input[name=page]").val(page);
            $("#searchForm").trigger("submit");
        });

        //翻页
        page.on("click", "#gotoPage", function (e) {
            var page = $("#gotoPageNum").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                page = $("#pages").val();
            }
            $("#searchForm").find("input[name=page]").val(page);
            $("#searchForm").trigger("submit");
        });

        $('#gotoPageNum').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#gotoPage").click();
            }
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#searchForm").find("input[name=page]").val(1);
                $("#searchForm").submit();
            }
        });
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

        function paramCheck (param) {
            if (!param.incomeNumber) {
                alert("收入编码不能为空");
                return false;
            } else if (!param.incomeName) {
                alert("收入类型不能为空");
                return false;
            } else if (!param.storeType) {
                alert("商铺类型不能为空");
                return false;
            }
            var regx = /^[0-9a-zA-Z]+$/;
            if (!regx.test(param.incomeNumber)) {
                alert("收入编码只能输入数字和字母");
                return false;
            }
            return true;
        }

        $(".btn-group").ysdropdown("init");

        function addData(addParm) {
            pageView.loadingShow();
            $.ajax({
                url : financeWeb_Path + "incomeType/addData.htm",  //请求地址
                type : "post",   //请求方式
                dataType : "json",  //数据类型
                contentType: 'application/json',
                data : JSON.stringify(addParm),
                success : function(res){
                    pageView.loadingHide();
                    if (res.code === '100') {
                        alert(res.data,"","",function(){
                            window.location = financeWeb_Path + "incomeType/index.htm";
                        });
                    } else {
                        alert(res.tip);
                    }
                },
                //请求失败
                error: function(json){
                    pageView.loadingHide();
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
                        alert(res.tip);
                    }
                },
                //请求失败
                error: function(json){
                    pageView.loadingHide();
                }
            })
        }
        function getParam(formId){
            var entity = $("#"+formId).toJson(true);
            return $.isEmptyObject(entity)?null:entity;
        }
        function freeze(updateParm) {
            var url = financeWeb_Path + "incomeType/freeze.htm";
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
                        alert(res.tip);
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

//====================================================
var pageView=(function($){
    var pageView={};
    pageView.init=function() {
        $("#preloader").fadeOut("fast");
        var page = $("#payment-term-index");
        //搜索
        page.on("click", ".search-btn", function() {
            $("#searchForm").find("input[name=page]").val(1);
            $("#searchForm").trigger("submit");
        });
        //新增按钮
        page.on("click", ".save-btn", function(e){
            var dataId = $(this).attr("data-id");
            if (dataId) {
                var updateParm = getParam("updateForm" + dataId);
                if (paramCheck(updateParm)) updateData(updateParm);
            } else {
                var addParm = getParam("addForm");
                if (paramCheck(addParm)) addData(addParm);
            }
        });
        //同步按钮
        $("#synchroData").on("click", function () {
            pageView.loadingShow();
            $.ajax({
                url: financeWeb_Path + "financeBasis/loadEasBaseAccountBank.htm",  //请求地址
                type: "post",   //请求方式
                dataType: "json",  //数据类型
                contentType: 'application/json',
                success: function (res) {
                    pageView.loadingHide();
                    if (res.code === '100') {
                        alert("同步成功", "", "", function () {
                            window.location = window.location;
                        });
                    } else {
                        alert("同步失败");
                    }
                },
                //请求失败
                error: function () {
                    pageView.loadingHide();
                    alert("同步失败");
                }
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
                        alert(res.data, "", "", function() {
                            window.location.href = financeWeb_Path + "paymentTerm/index.htm";;
                        });
                    } else {
                        alert(res.tip);
                    }
                },
                //请求失败
                error: function(json){
                    alert("系统异常");
                }
            })
        }
        function updateData(updateParm) {
            var url = financeWeb_Path + "paymentTerm/update.htm";
            $.ajax({
                url : url,  //请求地址
                type : "post",   //请求方式
                dataType : "json",  //数据类型
                contentType: 'application/json',
                data : JSON.stringify(updateParm),
                success : function(res){
                    if (res.code === '100') {
                        alert("操作成功","","",function(){
                            window.location.href= financeWeb_Path + "paymentTerm/index.htm";
                        });
                    } else {
                        alert(res.tip);
                    }
                },
                //请求失败
                error: function(json){
                }
            })
        }
        function getParam(formId){
            var entity = $("#"+formId).toJson(true);
            return $.isEmptyObject(entity)?null:entity;
        }
        function freeze(updateParm) {
            var url = financeWeb_Path + "paymentTerm/freeze.htm";
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
                            var toUrl = financeWeb_Path + "paymentTerm/index.htm";
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
        function paramCheck (param) {
            if (!param.paymentTermNumber) {
                alert("收款方式编码不能为空");
                return false;
            } else if (!param.paymentTermName) {
                alert("收款方式名称不能为空");
                return false;
            }
            var regx = /^[0-9a-zA-Z]+$/;
            if (!regx.test(param.paymentTermNumber)) {
                alert("收款方式编码只能输入数字和字母");
                return false;
            }
            return true;
        }

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
                $("#searchForm").trigger("submit");
            }
        });
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

    }
    pageView.renderData = function (data, items, page, pages) {
        var dataHtml = '';
        if (data.length) {
            var num = 1;
            var opt = '';
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr><td>' + setStr(data[i].orgFName) + '</td>'
                    + '<td>' + setStr(data[i].fBankAccountNumber) + '</td>'
                    + '<td>' + setStr(data[i].fBankAccountName) + '</td>'
                    + '<td>' + setStr(data[i].bankType) + '</td>'
                    + '<td>' + setStr(data[i].currency) + '</td>'
                    + '<td>' + timeStampConvert(data[i].createDate, "yyyy-MM-dd hh:mm:ss") + '</td>'
                    + '<td>' + setFiscfReeze(data[i].fiscfReeze) + '</td></tr>';
            }
            setPageBtn(items, page, pages);
        } else {
            dataHtml = '<tr><td colspan="7">'
                + '<p>暂无数据~</p>'
                + '</td></tr>';
            setPageBtn(0, 0, 0);
        }
        return dataHtml;
    }

    // pageView.loadData = function () {
    //     var page = $("#gotoPageNum").val();
    //     var url = financeWeb_Path + "easBaseAccountBank/getData.htm?page=" + ((null == page || '' == page) ? 0 : page);
    //     $.ajax({
    //         url: url,  //请求地址
    //         type: "post",   //请求方式
    //         dataType: "json",  //数据类型
    //         contentType: 'application/json',
    //         data: JSON.stringify(getParam("searchForm")),
    //         success: function (res) {
    //             if (res.code === '100') {
    //                 $(".table_context").html(pageView.renderData(res.data.results, res.data.items, res.data.page, res.data.pages));
    //             } else {
    //                 alert(res.msg);
    //             }
    //         },
    //         //请求失败
    //         error: function (json) {
    //         }
    //     })
    // }
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


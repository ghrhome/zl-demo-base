/**
 * Created by whobird on 2018/4/24.
 */

/**
 * Created by whobird on 2018/4/9.
 */

var pageView=(function($){
    var pageView={};

    pageView.eventInit=function(){

    }

    pageView.toolBar=function () {
        $("#bs_cont_list_detail").on("click",".zl-check-btn",function () {
            var _this=$(this);
            $(".zl-check-btn").each(function () {
                $(this).removeClass("active");
            });
            _this.addClass("active");
            $("#status").val(_this.attr("data-status"));
            pageView.getList();
        });
    }

    //查看合同文本详情
    pageView.contractDetail=function () {
        $("#bs_cont_list_detail").on("click","tr",function (e) {
            var contractNo = $(this).attr("contractNo");
            e.stopPropagation();
            e.preventDefault();
            pageView.formPost("detail.htm", {contractNo:contractNo});
        });
    }

    pageView.formPost=function (url, params, target){
        var temp = document.createElement("form");
        temp.enctype = "multipart/form-data";
        temp.action = url;
        temp.method = "post";
        temp.style.display = "none";

        if(target){
            temp.target = target;
        }else{
            pageView.loadingShow();
        }

        for (var x in params) {
            var opt = document.createElement("input");
            opt.name = x;
            opt.value = params[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);

        temp.submit();
    }

    //分页
    pageView.paginate=function () {
        $("#bs_cont_list_detail").on("click",".zl-paginate",function () {
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
            $("#page").val(page);
            pageView.getList();
        });

        $("#bs_cont_list_detail").on("blur","#gotoPageNum",function () {
            if (!pageView.isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
                $(this).val(1);
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt($(this).val()) > parseInt($("#pages").val())) {
                alert("超过总页数！");
                $(this).val($("#pages").val());
                return false;
            }
        });

        $("#bs_cont_list_detail").on("click","#gotoPage",function () {
            $("#page").val($("#gotoPageNum").val());
            pageView.getList();
        });

        $("#bs_cont_list_detail").on("click","#querySearch",function () {
            $("#page").val(1);
            pageView.getList();
        });
    }

    //是否为正整数
    pageView.isPositiveNum=function (s) {
        var re = /^[0-9]*[1-9][0-9]*$/;
        return re.test(s)
    }



    pageView.getList=function() {
        pageView.loadingShow();
        var params = {};
        var status = $("#status1").val();
        var searchWord = $("#searchWord").val();
        var contractType = $("#contractType").val();
        var category=$("#category").val();
        var mallId=$("#mallId").val();
        var netcommentId=$("#netcommentId").val();
        if($("#netcommentRef").val()){
            netcommentId = $("#netcommentRef").val();
            $("#netcommentRef").val("");
        }
        //var net_status=$("#net_status  option:selected").val();
        if (mallId) {
            params.mallId = mallId;
        }
        // if (status && status != "07") {
        if (status) {
            params.status = status;
        }
        if (searchWord) {
            params.searchWord = searchWord;
        }
        params.page =  $("#page").val();
        if (contractType) {
            params.contractType = $("#contractType").val();
        }
        if (category) {
            params.category = category;
        }
        if (netcommentId) {
            params.netcommentId = netcommentId;
        }

        $.ajax({
            cache: true,
            type: "post",
            url: "getContractList.htm",
            data: params,
            dataType: "html",
            //async: false,
            error: function (request) {
                // alert("系统异常");
                pageView.loadingHide();
            },
            success: function (data) {
                $("#bs_cont_list_detail").html(data);
                $("#contractType").val(contractType);
                pageView.setDropdown();
                // if (params.status) {
                //     $(".zl-contract-enrolment-type-btn-group ul li").each(function () {
                //         $(this).removeClass("active");
                //     });
                //     $("#status_" + params.status).addClass("active");
                //     $("#status").val(params.status);
                // }
                // if (params.searchWord) {
                //     $("#keywords").val(params.searchWord);
                //     $("#searchWord").val(params.searchWord);
                //     $("#senior_keywords").val(params.searchWord);
                // }
                pageView.loadingHide();
            }
        });
    }

    pageView.listTreeInit=function(){
        var url="getTrees.htm";
        $.get(url,"",function(data,status){
            data=eval("("+data+")");
            var treeData=data.list_tree;
            pageView.getList();

            var _cb=function(data){

                if("del"!=data.opt){
                    $("#contractType").val(data.id);
                    pageView.getList();
                    $("#contractType").val(data.id);
                }
            }

            $(".contract-list-tree").ysListTree({
                callback:_cb,
                nodeNameSpace:"nodeId",
                data:treeData,
                wrapperClass:"zl-contract-list-tree"
            })
        })
    }

    //摘挡
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    pageView.setDropdown=function () {
        $(".zl-dropdown").ysdropdown({
            callback:function (data) {
                // $("#status").val(data);
                pageView.getList();
            }
        });
    }


    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.listTreeInit();
        pageView.paginate();
        pageView.toolBar();
        pageView.contractDetail();
        pageView.setDropdown();

    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.loadingShow();
    pageView.init();
});
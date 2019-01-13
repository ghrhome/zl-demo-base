(function(){
    $("#preloader").fadeOut("fast");

    var page = $("#arrears-platform");

    $(document).keydown(function (e) {
        if(e.keyCode===13){
            $('#searchArrearsPlatformFormBtn').trigger('click');
        }
    });

    page.on("click",'.dropdown-menu li a',function (e) {
        var _div = $(this).closest("div.btn-group");
        var val = $(this).data("value");
        _div.find("input[type=hidden]").val(val);
        var text = $(this).text();
        _div.find("button").text(text);

        if(_div.data("id") == "page-limit"){
            page.find("input[name=itemsPerPage]").val(val);
        }

        $("#searchPageForm").find("input[name=page]").val(1);
        $("#searchPageForm").trigger("submit");
    });

    $(".search-btn").on("click", function (e) {
        $("#searchPageForm").find("input[name=page]").val(1);
        $("#searchPageForm").attr("action", financeWeb_Path + "finance/arrearage/indexNew.htm");
        $("#searchPageForm").trigger("submit");
    });

/*    $("#searchPageForm").submit(function (url) {
        setSearchForm();
        var self = $(this);
        if (null != url || url == "") {
            url = financeWeb_Path + "finance/arrearage/indexNew.htm";
        }

        alert("url=" + url);
        self.attr("action", url);
    });*/

    //复选框
    /*$(".zl-range-select input").on("ifChanged", function(e){
        e.preventDefault();
        showLoading();
        $("#searchPageForm").submit();
    });*/

    page.on("click",".zl-checkbox",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).toggleClass("checked");
        if ($(this).find("input").attr("disabled")){
            $(this).find("input").attr("disabled",false);
        } else {
            $(this).find("input").attr("disabled",true);
        }
    });

    /*page.on("click",".zl-table tbody tr",function(e){
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).find("td:nth-child(1)").html();
        var name = $(this).find("td:nth-child(2)").html();
        //window.location = "../../../pages/finance/arrears_details.html?id="+id+"&name="+name;
        window.location = financeWeb_Path + "finance/arrearage/getArrearageDetailNew.htm?id="+id+"&name="+name;
    });*/

    //跳转明细界面
    page.on("click",".zl-table tbody tr",function(e){
        e.stopPropagation();
        e.preventDefault();
        var mallId = $("#searchPageForm input[name=mallId]").val();
        var qryType = ''/*$("#searchPageForm input[name=qryType]").val()*/;
        $(".qryType").each(function(){
            if (!$(this).attr("disabled")) {
                if(''=== qryType){
                    qryType = $(this).val();
                } else {
                    qryType += ',' + $(this).val();
                }
            }
        })
        // var contNo = $(this).find("td:nth-child(1)").html();
        var contNo = $(this).attr("data-contNo");
        window.location = financeWeb_Path + "finance/arrearage/getArrearageDetailNew.htm?contNo="+contNo+"&mallId="+mallId+"&qryType="+qryType;
    })

    $("#arrears-platform").on("click", ".zl-paginate", function (e) {
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

        $("#searchPageForm").find("input[name=page]").val(page);
        $("#searchPageForm").trigger("submit");
    });

    $("#gotoPageNum").on("blur", function (e) {
        if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
            alert("请输入合法数字！");
            return false;
        }
        if (parseInt($(this).val()) > parseInt($("#pages").val())) {
            alert("超过总页数！");
            $(this).val($("#pages").val());
            return false;
        }
    });

    $("#gotoPage").on("click", function (e) {
        if (!isPositiveNum($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
            alert("请输入合法数字！");
            return false;
        }
        $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
        $("#searchPageForm").trigger("submit");
    });

    function isPositiveNum(s) {//是否为正整数
        var re = /^[0-9]*[0-9][0-9]*$/;
        return re.test(s)
    }

    page.find(".zl-datetimepicker input.form-control,.zl-date-select input.form-control").datetimepicker({
        language: "zh-CN",
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        weekStart: 1,
        todayHighlight: true,
        autoclose: true,
        forceParse: false,
        clearBtn:true
    });
    /*page.find(".zl-datetimepicker input").datetimepicker({
        language: "zh-CN",
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
        clearBtn:true
    });*/

    var ys_main_swiper;
    ys_main_swiper = new Swiper('#js-swiper-main-table', {
        scrollbar: '.swiper-scrollbar-a',
        direction: 'horizontal',
        slidesPerView: 'auto',
        //mousewheelControl: true,
        freeMode: true,
        scrollbarHide:false,
        grabCursor:true,
        scrollbarDraggable : true ,
        preventClicksPropagation:false
    });


    $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
        var _index=$(this).index();

        $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
        $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

    });

    $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
        var _index=$(this).index();

        $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
        $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');
    });

    //导出
    $("#reportBtn").on("click", function () {
        var mallId = $("#mallId").val();
        var startTime = $("#startTime").val();
        // var seachKey = $("#seachKey").val()
        var seachKey = $("#searchPageForm").find("input[name=seachKey]").val();
        // $("#searchPageForm").find("input[name=seachKeyNoEncode]").val(encodeURI(seachKey));
        window.location = financeWeb_Path + "finance/arrearage/indexNew_reportExcel.htm?mallId=" + mallId + "&startTime=" + startTime + "&seachKeyNoEncode=" + encodeURI(seachKey);
    });

})();

function showLoading(){
    if($(".zl-loader").length==0){
        $("body").append("<div class='zl-loader'></div>");
    }
    $(".zl-loader").show();
}

// function searchMall(_this) {
//     $("#searchPageForm").find("input[name=mallId]").val($(_this).attr("key"));
//     $("#searchPageForm").find("input[name=page]").val(1);
//     $("#searchPageForm").trigger("submit");
// }

function setSearchForm(){
    var seachKey = $("#searchPageForm").find("input[name=seachKey]").val();
    // var mallId = $("#mallId").val();
    //var receiveSatus = $("#receiveSatus").val();
    //var rightTime = $("#rightTime").val();
    //var receiveMoneyStart = $("#receiveMoneyStart").val();
    //var receiveMoneyEnd = $("#receiveMoneyEnd").val();

    $("#searchPageForm").find("input[name=seachKeyNoEncode]").val(encodeURI(seachKey));
    //$("#searchPageForm").find("input[name=mallIdEncode]").val(encodeURI(mallId));
    //$("#searchPageForm").find("input[name=receiveSatusEncode]").val(encodeURI(receiveSatus));
    //$("#searchPageForm").find("input[name=rightTimeEncode]").val(rightTime);
    //$("#searchPageForm").find("input[name=receiveMoneyStartEncode]").val(receiveMoneyStart);
    //$("#searchPageForm").find("input[name=receiveMoneyEndEncode]").val(receiveMoneyEnd);
}

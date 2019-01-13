var dubSumit = 0;
(function ($) {
    loadingshow();
    $("#preloader").fadeOut("fast");
    var container = $("#energy_consumption_enrolment_history");
    container.find(".date-month input").datetimepicker({
        endDate:new Date(),
        language: "zh-CN",
        format:"yyyy-mm",
        todayBtn:"linked",
        startView:3,
        minView:3,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
        clearBtn:true
    });
    var ys_main_swiper = new Swiper('#zl-floor-main-table', {
        scrollbar: '.swiper-scrollbar-a',
        direction: 'horizontal',
        slidesPerView: 'auto',
        //mousewheelControl: true,
        freeMode: true,
        scrollbarHide:false,
        grabCursor:true,
        scrollbarDraggable : true ,
        preventClicksPropagation:true
    });
    /*$(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
        var _index=$(this).index();

        $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
        $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

    });

    $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
        var _index=$(this).index();

        $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
        $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');

    })*/
    //=============================添加=======================================================

    $("[name=updateBsFloorBtn]").on("click", function () {
        var mngHydroelectricId = $(this).attr("mngHydroelectricId");

        // if (!valitateForm($('#updateBsFloorForm_' + reHyId))) {
        //     return false;
        // }

        $(".upload-pic-item-list li a em").click(function(){
            //console.log("添加");
        })
        confirm("确认要提交吗？","","",function (type) {
            if(type=="dismiss"){
                return;
            }
            $.ajax({
                cache: true,
                type: "POST",
                url: managementWeb_Path + "electricrate/add.htm",
                data: $('#updateBsFloorForm_' + mngHydroelectricId).serialize(),
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    //showMsg(resultData);
                    //  searchBsFormBtn.click();
                    $("#searchBsFloorForm").trigger("submit");
                    alert("添加成功！");
                }
            });
        });
    });

    //====================================
    $("#energy_consumption_enrolment_history").on("click", ".zl-paginate", function (e) {
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

        $("#searchBsFloorForm").find("input[name=page]").val(page);
        $("#searchBsFloorForm").trigger("submit");
    });
//00
    $("[name=blockName]").on("keypress", function (e) {
        e.stopPropagation();
        if (e.keyCode == 13) {
            var floorName = $(this).val();
            $("#searchBsFloorForm").find("input[name=floorNameEncode]").val(encodeURI(floorName));
        }
    });
//00
    function isNumberss(num) {
        var pat = new RegExp('^[0-9]+$');
        return pat.test(num)
    }

    $("#gotoPageNum").on("blur", function (e) {
        if (!isNumberss($(this).val()) || parseInt($(this).val()) == 0) {
            alert("请输入合法数字！");
            $("#gotoPageNum").val($("#page").val());
            return false;
        }
        if (parseInt($(this).val()) > parseInt($("#pages").val())) {
            alert("超过总页数！");
            $(this).val($("#page").val());
            return false;
        }
    });

    $("#gotoPage").on("click", function (e) {
        $("#searchBsFloorForm").find("input[name=page]").val($("#gotoPageNum").val());
        $("#searchBsFloorForm").trigger("submit");
    });
//00
    $("#searchBsFormBtn").on("click", function (e) {
        var pp=$("#page").val();
        $("#searchBsFloorForm").find("input[name=page]").val(pp);
        $("#searchBsFloorForm").trigger("submit");
    });
    // 00
    $("#searchBsFloorForm").submit(function () {
        var self = $(this);
        var mngHydroelectricId=$("#mngHydroelectricId").val();
        var hydroelectricCode = $.trim($(this).find("input[name=hydroelectricCode]").val());
        // self.find("input[name=floorNameEncode]").val(encodeURI(hydroelectricCode));
        self.find("input[name=hydroelectricCode]").val(encodeURI(hydroelectricCode));
        self.attr("action", managementWeb_Path + "energyConsumptionRecord/water/rates.htm?mngHydroelectricId="+ mngHydroelectricId);
    });
    /**
     * 查询
     */
    $("#inquiry").on("click", function () {
        var mngHydroelectricId = $("#mngHydroelectricId").val();
        var chargeYM =$("#chargeYM").val();
        window.location.href=managementWeb_Path +"energyConsumptionRecord/water/rates.htm?mngHydroelectricId=" + mngHydroelectricId+"&chargeYM="+chargeYM;
    });
    /**
     * 返回首页
     */
    $("#returnIndex").on("click",function () {
        window.location.href=managementWeb_Path +"energyConsumptionRecord/water/index.htm";
    });

})(window.jQuery);


function isNum(num, msg) {
    if (!isNaN(num)) {
        var dot = num.indexOf(".");
        if (dot != -1) {
            var dotCnt = num.substring(dot + 1, num.length);
            if (dotCnt.length > 2) {
                alert(msg + "小数位已超过2位！");
                return false;
            } else {
                if (parseInt(num) > 99999999) {
                    alert( msg + "值过大！");
                    return false;
                } else if (parseInt(num) < 0) {
                    alert(msg + "应大于0！");
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            var re = /^(\-?)[0-9]*[0-9][0-9]*$/;
            if (re.test(num)) {
                if (parseInt(num) > 99999999) {
                    alert( msg + "值过大！");
                    return false;
                } else if (parseInt(num) <= 0) {
                    alert(msg + "应大于0！");
                    return false;
                }else {
                    return true;
                }
            } else {
                alert( msg + "格式错误！");
                return false;
            }
        }
    } else {
        alert( msg + "格式错误！");
        return false;
    }
}

function isNumber(value) {
    return /^(\-?)[0-9]+.?[0-9]*$/.test($.trim(value))
}
function isInt(str) {
    var reg = /^(-|\+)?\d+$/;
    return reg.test(str);
}
function loadingshow(){
    $(".zl-loading").fadeIn();
};

function loadingHide(){
    $(".zl-loading").fadeOut();
}
window.onload=function(){
    loadingHide();
}


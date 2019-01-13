(function ($) {
    var ys_swiper = new Swiper('#zl-floor-table', {
        scrollbar: '.swiper-scrollbar-a',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbarHide: false,
        observer:true,
        observeParents:true
    });
    //=================
    // $("#preloader").fadeOut("fast");
    /**
     * 日期插件初始化
     * @type {*|HTMLElement}
     */
    var container = $("#floor-info");
    container.find(".zl-datetimepicker input").datetimepicker({
        endDate:new Date(),
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
    });
        $("#js-month-picker-chargeym").find("input.form-control").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm",
        clearBtn: "清除",
        startView: 3,
        minView: 3,
        weekStart: 1,
        autoclose: true,
        todayHighlight: true,
        forceParse: false
        });
        $("#js-month-picker-finym").find("input.form-control").datetimepicker({
            language: "zh-CN",
            format: "yyyy-mm",
            clearBtn: "清除",
            startView: 3,
            minView: 3,
            weekStart: 1,
            autoclose: true,
            todayHighlight: true,
            forceParse: false
        });
        $("#js-month-picker-chargeym").ysDatepicker({
            dateType:"month",//year,day
            callback:function(value){
                $("form").find("input[name=chargeYM]").val(value);
            }
        });
        $("#js-month-picker-finym").ysDatepicker({
            dateType:"month",//year,day
            callback:function(value){
                $("form").find("input[name=finYm]").val(value);
        }
    });
    container.on("click",".zl-datetimepicker",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).find("input").datetimepicker("show");
    });
    //日期插件初始化
    $('#datetimeStart').datetimepicker({
        language:  'zh-CN',
        format:"yyyy-mm-dd hh:ii",
        startView: 0,
        weekStart: 1, /*以星期一为一星期开始*/
        todayBtn:  1,
        autoclose: 1,
        forceParse:true,
        pickerPosition: "bottom-left",
        clearBtn: true
    }).on("changeDate",function(ev){  //值改变事件
        //选择的日期不能大于第二个日期S控件的日期
        if(ev.date){
            $("#datetimeEnd").datetimepicker('setStartDate', new Date(ev.date.valueOf()));
        }
    });
    $('#datetimeEnd').datetimepicker({
        language:  'zh-CN',
        format:'yyyy-mm-dd hh:ii',
        startView:0,
        weekStart: 1, /*以星期一为一星期开始*/
        todayBtn:  1,
        autoclose: 1,
        forceParse:true,
        pickerPosition: "bottom-left",
        clearBtn: true
    }).on("changeDate",function(ev){
        //选择的日期不能小于第一个日期控件的日期
        if(ev.date){
            $("#datetimeStart").datetimepicker('setEndDate', new Date(ev.date.valueOf()));
        }
    });
    //单选
    container.on("click", ".zl-fake-checkbox:not(.all)", function () {
        $(this).toggleClass("checked");
    });
    //全选
    container.on("click", ".zl-fake-checkbox.all", function () {
        if ($(this).hasClass("checked")) {
            $(".zl-fake-checkbox").removeClass("checked");
        } else {
            $(".zl-fake-checkbox").addClass("checked");
        }
    });
    /**
     * 水电表切换
     */
    $("#searchType").on("click", function (e) {
        $("#searchReForm").attr("action", managementWeb_Path + "financialManagerAudit/water/index.htm").submit();
    });
    /**
     * 下拉初始化
     */
    $(".zl-dropdown").ysdropdown({
        callback:function(val, $elem){
            if ($elem.data("id") == "isFinancialAudit"){
                $("#searchForm").find("input[name=isFinancialAudit]").val(val);
            }
        }
    });
    /**
     * 下拉框事件
     */
    $("#floor-info").on("click", ".zl-select ul.dropdown-menu>li>a", function (e) {
        //e.stopPropagation();
        //e.preventDefault();

        var key = $(this).attr("key");
        var value = $(this).html();

        $(this).parent().parent().prev().children("span").html(value);
        $(this).parent().parent().parent().children("input").val(key);
        $(this).parent().parent().parent().removeClass("open");
    });
    /**
     * 查询按钮
     */
    $("#searchBsFormBtn").on("click", function (e) {
        $("#searchBsFloorForm").trigger("submit");
    });
    /**
     * 查询条件提交
     */
    $("[name=electric]").on("keypress", function (e) {
        e.stopPropagation();
        if (e.keyCode == 13) {
            searchBsFormBtn.click();
        }
    });
    $("#searchBsFloorForm").submit(function () {
        var self = $(this);
        var electric = $.trim($(this).find("input[name=electric]").val());
        self.find("input[name=electric]").val(encodeURI(electric));
        self.attr("action", managementWeb_Path + "financialManagerAudit/electric/index.htm");
    });
    /**
     * 审核
     */
    $("#examineButton").on("click",function (e) {
        console.log($('#dataList').attr("data-list"))
        console.log($('#searchBsFloorForm').serialize())
        confirm("确认要审核吗？","","",function (type) {
            if(type=="dismiss"){
                return;
            }
            loadingshow();
            $.ajax({
                cache: true,
                type: "POST",
                dataType: "json",
                url: managementWeb_Path + "financialManagerAudit/electric/audit.htm",
                data: $('#searchBsFloorForm').serialize(),
                //async: false,
                error: function (request) {
                    loadingHide();
                    alert("系统异常");
                },
                success: function (resultData) {
                    loadingHide();
                    searchBsFormBtn.click();
                    alert(resultData.msg);
                }
            });
        });
    })
})(window.jQuery);

/**
 * 校验
 * @param num
 * @param msg
 * @returns {boolean}
 */
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
function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}
/**
 * 选择项目
 * @param _this
 */
function searchMall(_this) {
    var mallId = $(_this).attr("key");
    $("#projectViewName").text($(_this).text());
    $("#projectId").val($(_this).attr("key"));
    $("#mallId").val(mallId);
    $("#searchBsFormBtn").click();
}
/**
 * 输入框保留两位小数
 * @param obj
 */
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数

}
function clearNoNumContractPrice(obj) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/,'$1$2.$3'); //只能输入四位个小数

}
/**
 * 预加载show
 */
function loadingshow(){
    $(".zl-loading").fadeIn();
};
/**
 * 预加载hide
 */
function loadingHide(){
    $(".zl-loading").fadeOut();
}
window.onload=function(){
    loadingHide();
}

var dubSumit = 0;
var isAddFile=false;
(function ($) {

    $("#preloader").fadeOut("fast");
    var container = $("#energy_consumption_enrolment");

    container.find(".js-date-picker input").datetimepicker({
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        autoclose: true,
        language:"zh-CN",
    }).on('changeDate', function(e){
        console.log(e)
    });

    container.on("click", ".zl-linkable", function (e) {
        $('.import-dialog').modal("hide");
    });

    $("#searchType").on("click", function (e) {
        $("#searchReForm").attr("action", managementWeb_Path + "electricrate/index.htm").submit();
    });

    //==============================
    $("#dist-add").on("click", function () {

        $(".zl-add-collapse").slideToggle("normal");
    });


    //=================
        //导入招商计划
        $("#daoru").click(function () {
            $("<input type='file' name='file' style='display: none'/>").appendTo("body").change(function () {
                $('.import-dialog').modal("hide");
                var formData = new FormData();
                formData.append('file', $(this).get(0).files[0]);
                $.ajax({
                    url: managementWeb_Path+'waterrate/upload-excel.htm',
                    type: 'POST',
                    dataType: "json",
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function (response) {
                    if (response.success) {
                        alert("导入成功！");
                        searchBsFormBtn.click();
                        // var url = "/" + response.data.path;
                        // $("p#files").append("<a href='" + url + "' target='_blank'>" + url + "</a><br/>");
                    } else {
                        alert(response.message);
                    }
                });
            }).trigger("click");
        })
        //=======================

        //=================================================

        $("#energy_consumption_enrolment").on("click", ".zl-select ul.dropdown-menu>li>a", function (e) {
            //e.stopPropagation();
            //e.preventDefault();

            var key = $(this).attr("key");
            var value = $(this).html();

            $(this).parent().parent().prev().children("span").html(value);
            $(this).parent().parent().parent().children("input").val(key);
            $(this).parent().parent().parent().removeClass("open");

            // 项目带出 物业类型

            // if (typeof($(this).attr("data-buildingType")) != "undefined") {
            //     var buildingType = $(this).attr("data-buildingType");
            //     var buildingTypeShow = $(this).attr("data-buildingTypeShow");
            //     $(this).parents("form").find("input[name='buildingType']").val(buildingType);
            //     $(this).parents("form").find("input[name='buildingTypeShow']").val(buildingTypeShow);
            // }

        });
        //=============================修改=======================================================

        $("[name=updateBsFloorBtn]").on("click", function () {
            var reWaterId = $(this).attr("reElectricId");
            // if (!valitateForm($('#updateBsFloorForm_' + reHyId))) {
            //     return false;
            // }
            var readingDate=$("#readingDate_"+reWaterId).val();
            var readnum=$("#readnum_"+reWaterId).val();
            var moneyRate=$("#moneyRate_"+reWaterId).val();
            if (readingDate == "" || readingDate == null) {
                alert("抄表日期不能为空！");
                return false;
            }

            if (readnum == "" || readnum == null) {
                alert("读数不能为空！");
                return false;
            }

            if (moneyRate == "" || moneyRate == null) {
                alert("金额不能为空！");
                return false;
            }

            $(".upload-pic-item-list li a em").click(function(){
                console.log("添加");
            })

            if (confirm("确认要提交吗？")) {
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: managementWeb_Path + "waterrate/add.htm",
                    data: $('#updateBsFloorForm_' + reWaterId).serialize(),
                    async: false,
                    error: function (request) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        //showMsg(resultData);
                        //  searchBsFormBtn.click();
                        window.location.href=managementWeb_Path +"waterrate/rates.htm?reWaterId=" + reWaterId;
                        alert("添加成功！");
                    }
                });
            }
        });
        //============================================历史详情====================
        $(".lookLis").on("click", function () {
            var reWaterId = $(this).attr("reWaterId");
            window.location.href=managementWeb_Path +"waterrate/rates.htm?reWaterId=" + reWaterId;
        });
        //====================================
        $("#energy_consumption_enrolment").on("click", ".zl-paginate", function (e) {
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
            var electricCode = $.trim($(this).find("input[name=electricCode]").val());
            self.find("input[name=electric]").val(encodeURI(electricCode));
            self.attr("action", managementWeb_Path + "waterrate/index.htm");
        });


        var isUp=false;


})(window.jQuery);


function valitateForm(obj) {
    var mallId = $(obj).find("input[name=mallId]").val();
    var blockName = $.trim($(obj).find("input[name=blockName]").val());
    var status = $(obj).find("input[name=status]").val();
    var remark = $.trim($(obj).find("textarea[name=remark]").val());
    var openDate = $.trim($(obj).find("input[name=openDate]").val());

    if (mallId == "" || mallId == null) {
        alert("项目名称不能为空！");
        return false;
    }

    if (blockName == "" || blockName == null) {
        alert("楼栋名称不能为空！");
        return false;
    }

    if (openDate == "" || openDate == null) {
        alert("开业日期不能为空！");
        return false;
    }

    if (status == "" || status == null) {
        alert("状态不能为空！");
        return false;
    }

    if (remark == "" || remark == null) {
        alert("备注不能为空！");
        return false;
    }

    return true;
}

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

function searchMall(_this) {
    var mallId = $(_this).attr("key");
    $("#mallId").val(mallId);
    $("#searchBsFormBtn").click();
}

function searchBuild(_this) {
    var hydroelectricType = $(_this).attr("key");
    $("#hydroelectricType").val(hydroelectricType);
    $("#searchBsFormBtn").click();
}

var dubSumit = 0;
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
        //console.log(e)
    });

    $("#searchType").on("click", function (e) {
        $("#searchReForm").attr("action", managementWeb_Path + "waterrate/index.htm").submit();
    });

    container.on("click", ".zl-linkable", function (e) {
        $('.import-dialog').modal("hide");
    });
        //==============================
        //导入
        $("#dist-add").on("click", function () {
            $(".zl-add-collapse").slideToggle("normal");
        });

        $("#daoru").click(function () {
            $("<input type='file' name='file' style='display: none'/>").appendTo("body").change(function () {
                $('.import-dialog').modal("hide");
                var formData = new FormData();
                formData.append('file', $(this).get(0).files[0]);
                $.ajax({
                    url: managementWeb_Path+'electricrate/upload-excel.htm',
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
                        $('#importrActivePro_list').modal("hide");
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

        $("#zl-enrolment-floor").on("click", ".zl-select ul.dropdown-menu>li>a", function (e) {
            //e.stopPropagation();
            //e.preventDefault();

            var key = $(this).attr("key");
            var value = $(this).html();

            $(this).parent().parent().prev().children("span").html(value);
            $(this).parent().parent().parent().children("input").val(key);
            $(this).parent().parent().parent().removeClass("open");


        });
        //=============================添加=======================================================

        $("[name=updateBsFloorBtn]").on("click", function () {
            var reWaterId = $(this).attr("reElectricId");
            // if (!valitateForm($('#updateBsFloorForm_' + reWaterId))) {
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
                //console.log("添加");
            })

            if (confirm("确认要提交吗？")) {
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: managementWeb_Path + "electricrate/add.htm",
                    data: $('#updateBsFloorForm_' + reWaterId).serialize(),
                    async: false,
                    error: function (request) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        //showMsg(resultData);
                        //  searchBsFormBtn.click();
                        window.location.href=managementWeb_Path +"electricrate/rates.htm?reWaterId=" + reWaterId;
                        alert("添加成功！");
                    }
                });
            }
        });
        //============================================查看历史====================
        $(".lookLis").on("click", function () {
            var reWaterId = $(this).attr("reWaterId");
            window.location.href=managementWeb_Path +"electricrate/rates.htm?reWaterId=" + reWaterId;
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

            var InitDate = $.trim($(this).find("input[name=InitDate]").val());
            self.find("input[name=InitReadingDate]").val(InitDate);
            self.attr("action", managementWeb_Path + "electricrate/index.htm");
        });



        var isUp=false;


})(window.jQuery);


function valitateForm(obj) {
    var readingDate = $(obj).find("input[name=readingDate]").val();
    var readnum = $.trim($(obj).find("input[name=readnum]").val());
    var moneyRate = $(obj).find("input[name=moneyRate]").val();
    var reWaterId = $(obj).find("input[name=reWaterId]").val();
    alert("表单"+obj);
    alert("抄表日期"+reWaterId);
    // if (readingDate == "" || readingDate == null) {
    //     alert("抄表日期不能为空！");
    //     return false;
    // }

    // if (readnum == "" || readnum == null) {
    //     alert("读数不能为空！");
    //     return false;
    // }

    // if (moneyRate == "" || moneyRate == null) {
    //     alert("金额不能为空！");
    //     return false;
    // }

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



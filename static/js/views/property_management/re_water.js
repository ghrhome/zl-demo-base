var dubSumit = 0;
(function ($) {


        //=================
        //导入
        $("#daoru").click(function () {
            $("<input type='file' name='file' style='display: none'/>").appendTo("body").change(function () {
                $('.import-dialog').modal("hide");
                var formData = new FormData();
                formData.append('file', $(this).get(0).files[0]);
                $.ajax({
                    url: managementWeb_Path+'water/upload-excel.htm',
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
    $("#preloader").fadeOut("fast");
    var container = $("#floor-info");

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

    container.on("click", ".zl-linkable", function (e) {
        $('.import-dialog').modal("hide");
    });

    $("#searchType").on("click", function (e) {
        $("#searchReForm").attr("action", managementWeb_Path + "electric/index.htm").submit();

    });

        //=================================================

        $("#floor-info").on("click", ".zl-select ul.dropdown-menu>li>a", function (e) {
            //e.stopPropagation();
            //e.preventDefault();

            var key = $(this).attr("key");
            var value = $(this).html();

            $(this).parent().parent().prev().children("span").html(value);
            $(this).parent().parent().parent().children("input").val(key);
            $(this).parent().parent().parent().removeClass("open");


        });
        //======================================================增加===
        $("#addBsFloorBtn").on("click", function () {
            if (dubSumit > 0) {
                alert("请勿重复提交表单！");
                return false;
            }

            if (!valitateForm($('#addBsFloorForm'))) {
                return false;
            }

            var isRe = false;

            var formData=new FormData($("#addBsFloorForm")[0]);
            //console.log(formData);
            //console.log(managementWeb_Path);

            $.ajax({
                cache: true,
                type: "POST",
                url: managementWeb_Path + "water/velicateName.htm",
                data: $('#addBsFloorForm').serialize(),
                // contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                // contentType:false,
                // processData: false,
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (typeof resultData != 'undefined' && resultData != null) {
                        if (typeof resultData.msg != "undefined") {
                            showMsg(resultData);
                        } else {
                            isRe = true;
                        }
                    }
                }
            });
            if (isRe == false) {
                return false;
            }

            dubSumit++;
            $.ajax({
                cache: true,
                type: "POST",
                url: managementWeb_Path + "water/add.htm",
                data: $('#addBsFloorForm').serialize(),
                async: false,
                error: function (request) {
                    alert("系统异常");
                    dubSumit = 0;
                },
                success: function (resultData) {
                    //showMsg(resultData);
                    searchBsFormBtn.click();
                    alert("添加成功！");
                }
            });
        });
        //=============================修改=======================================================

        $("[name=updateBsFloorBtn]").on("click", function () {
            var waterId = $(this).attr("waterId");
            if (!valitateForm($('#updateBsFloorForm_' + waterId))) {
                return false;
            }

            var isRe = false;
            $.ajax({
                cache: true,
                type: "POST",
                url: managementWeb_Path + "water/velicateName.htm",
                data: $('#updateBsFloorForm_' + waterId).serialize(),
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (typeof resultData != 'undefined' && resultData != null) {
                        if (typeof resultData.msg != "undefined") {
                            showMsg(resultData);
                        } else {
                            isRe = true;
                        }
                    }
                }
            });
            if (isRe == false) {
                return false;
            }
            $(".upload-pic-item-list li a em").click(function(){
                //console.log("删除");
            })


            if (confirm("确认要提交吗？")) {
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: managementWeb_Path + "water/update.htm",
                    data: $('#updateBsFloorForm_' + waterId).serialize(),
                    async: false,
                    error: function (request) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        //showMsg(resultData);
                        //  searchBsFormBtn.click();
                        $("#searchBsFloorForm").trigger("submit");
                        alert("修改成功！");
                    }
                });
            }
        });
        //============================================删除====================
        $("[name=deleteBsFloorBtn]").on("click", function () {
            if (confirm("确认要删除吗？")) {
                var waterId = $(this).attr("waterId");

                //=======================
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: managementWeb_Path + "water/delete.htm?waterId=" + waterId,
                    async: false,
                    error: function (request) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        if (resultData.code == "1") {
                            showMsg(resultData);
                            return;
                        }
                        searchBsFormBtn.click();
                        alert("删除成功！");
                    }
                });
            }
        });
        //====================================
        $("#floor-info").on("click", ".zl-paginate", function (e) {
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
            self.attr("action", managementWeb_Path + "water/index.htm");
        });





})(window.jQuery);


function valitateForm(obj) {
    var hydroelectricCode = $(obj).find("input[name=hydroelectricCode]").val();
    var shopNum = $(obj).find("input[name=shopNum]").val();
    var newTableBase = $(obj).find("input[name=newTableBase]").val();
    var paymentMethod = $.trim($(obj).find("input[name=paymentMethod]").val());

    if (hydroelectricCode == "" || hydroelectricCode == null) {
        alert("水表编号不能为空！");
        return false;
    }

    if (shopNum == "" || shopNum == null) {
        alert("商铺号不能为空！");
        return false;
    }

    if (newTableBase == "" || newTableBase == null) {
        alert("新表底数不能为空！");
        return false;
    }

    if (paymentMethod == "" || paymentMethod == null) {
        alert("付费方式不能为空！");
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

//添加
function shopSelect(_this){
    var mallId=$(_this).attr("key");

    $("#brands").val("");
    $("#brandsId").val("");
    //清空项目名称
    $("#shop-grop").empty();
    $(".shop-span").html("请选择");
    //清空品牌名称
    $("#ibrand-grop").empty();
    $(".ibrand-span").html("请选择");
    $.ajax({
        cache: true,
        type: "POST",
        //managementWeb_Path + "electric/delete.htm?reHyId=" + reHyId,
        url: managementWeb_Path + "water/shopList.htm?mallId=" + mallId,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            console.log(resultData);
            var json=eval(resultData);
            var isMallId=true;
            $.each(json,function(index,item){
                $("#shop-grop").append("<li><a key='"+item.id+"' ibrand='"+item.ibrand+"' onclick='ibrandSelect(this)'   href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
            if(isMallId){
                alert("该项目下没有商铺号！");
            }
        }
    });
}

function ibrandSelect(_this){
    // debugger;
    var ibrand=$(_this).attr("key");

    $.ajax({
        cache: true,
        type: "POST",
        //managementWeb_Path + "electric/delete.htm?reHyId=" + reHyId,
        url: managementWeb_Path + "electric/ibrandList.htm?ibrand=" + ibrand,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            console.log(resultData);
            var json=eval(resultData);
            var isbrand=true;
            $.each(json,function(index,item){
                    //$("#ibrand-grop").append("<li><a key='"+item.id+"'    href='javascript:void(0)'>"+item.name+"</a></li>");
                    $("#brands").val(item.name);
                    $("#brandsId").val(item.id)
                isbrand=false;
            });
            if(isbrand){
                alert("该铺位下没有品牌！");
            }
        }
    });

}

//修改
function shopSelectUpdate(_this,reId){
    var mallId=$(_this).attr("key");

    $("#brands_"+reId).val("");
    $("#brandsId_"+reId).val("");
    //清空项目名称
    $("#shop-grop-update").empty();
    $(".shop-span-update").html("请选择");
    //清空品牌名称
    $("#ibrand-grop-update").empty();
    $(".ibrand-span-update").html("请选择");

    $("#shopId_"+reId).val("");
    $("#ibrandId_"+reId).val("");
    $.ajax({
        cache: true,
        type: "POST",
        //managementWeb_Path + "electric/delete.htm?reHyId=" + reHyId,
        url: managementWeb_Path + "water/shopList.htm?mallId=" + mallId,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            //console.log(resultData);
            var json=eval(resultData);
            var isMallId=true;
            $.each(json,function(index,item){
                $("#shop-grop-update").append("<li><a key='"+item.id+"' ibrand='"+item.ibrand+"' onclick='ibrandSelectUpdate(this,reId)'   href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
            if(isMallId){
                alert("该项目下没有商铺号！");
            }
        }
    });

}

function ibrandSelectUpdate(_this,reId){

    var ibrand=$(_this).attr("key");

    $.ajax({
        cache: true,
        type: "POST",
        //managementWeb_Path + "electric/delete.htm?reHyId=" + reHyId,
        url: managementWeb_Path + "electric/ibrandList.htm?ibrand=" + ibrand,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            console.log(resultData);
            var json=eval(resultData);
            var isbrand=true;
            $.each(json,function(index,item){
                // $("#ibrand-grop-update").append("<li><a key='"+item.id+"'    href='javascript:void(0)'>"+item.name+"</a></li>");
                $("#brands_"+reId).val(item.name);
                $("#brandsId_"+reId).val(item.id);
                isbrand=false;
            });
            if(isbrand){
                alert("该铺位下没有品牌！");
            }
        }
    });
}
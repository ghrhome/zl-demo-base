var dubSumit = 0;
var json=[];
var contJson=[];
var jsonUpdate=[];
var contJsonUpdate=[];
(function ($) {
    loadingshow();
    //=================
    var ys_swiper = new Swiper('#zl-floor-table', {
        scrollbar: '.swiper-scrollbar-a',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbarHide: false,
        observer:true,
        observeParents:true
    });
        //导入
    $("#daoru").click(function () {
            $("<input type='file' name='file' style='display: none'/>").appendTo("body").change(function () {
                $('.import-dialog').modal("hide");
                var formData = new FormData();
                formData.append('file', $(this).get(0).files[0]);
                $.ajax({
                    url: managementWeb_Path+'hydroelectric/water/upload-excel.htm',
                    type: 'POST',
                    dataType: "json",
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function (response) {
                    if (response.success) {
                        alert("导入成功！");
                        $("#searchBsFloorForm").find("input[name=page]").val(1);
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
    //日期插件初始化
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

    container.on("click",".zl-datetimepicker",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).find("input").datetimepicker("show");
    });

    $("#searchType").on("click", function (e) {
        $("#searchReForm").attr("action", managementWeb_Path + "hydroelectric/electric/index.htm").submit();

    });

    //===================================================

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
            url: managementWeb_Path + "hydroelectric/water/velicateName.htm",
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
            url: managementWeb_Path + "hydroelectric/water/add.htm",
            data: $('#addBsFloorForm').serialize(),
            async: false,
            error: function (request) {
                alert("系统异常");
                dubSumit = 0;
            },
            success: function (resultData) {
                //showMsg(resultData);
                $("#searchBsFloorForm").find("input[name=page]").val(1);
                searchBsFormBtn.click();
                alert("添加成功！");
            }
        });
    });
    //=============================修改=======================================================

    $("[name=updateBsFloorBtn]").on("click", function () {
        var mngHydroelectricId = $(this).attr("mngHydroelectricId");
        if (!valitateForm($('#updateBsFloorForm_' + mngHydroelectricId))) {
            return false;
        }

        var isRe = false;
        $.ajax({
            cache: true,
            type: "POST",
            url: managementWeb_Path + "hydroelectric/water/velicateName.htm",
            data: $('#updateBsFloorForm_' + mngHydroelectricId).serialize(),
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

        confirm("确认要提交吗？","","",function (type) {
            if(type=="dismiss"){
                return;
            }
            $.ajax({
                cache: true,
                type: "POST",
                url: managementWeb_Path + "hydroelectric/water/update.htm",
                data: $('#updateBsFloorForm_' + mngHydroelectricId).serialize(),
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
        });
    });
    //============================================删除====================
    $("[name=deleteBsFloorBtn]").on("click", function () {
        //console.log("mngHydroelectricId:"+mngHydroelectricId);
        confirm("确认要删除吗？","","",function (type) {
            if(type=="dismiss"){
                return;
            }
            var mngHydroelectricId = $(this).attr("mngHydroelectricId");
            //=======================
            $.ajax({
                cache: true,
                type: "POST",
                url: managementWeb_Path + "hydroelectric/water/delete.htm?mngHydroelectricId=" + mngHydroelectricId,
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (resultData.code == "1") {
                        showMsg(resultData);
                        return;
                    }
                    $("#searchBsFloorForm").find("input[name=page]").val(1);
                    searchBsFormBtn.click();
                    alert("删除成功！");
                }
            });
        });
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

    $("#searchBsFormBtn").on("click", function (e) {
        var pp=$("#page").val();
        $("#searchBsFloorForm").find("input[name=page]").val(1);
        $("#searchBsFloorForm").trigger("submit");
    });
    // 00
    $("#searchBsFloorForm").submit(function () {
        var self = $(this);
        var electricCode = $.trim($(this).find("input[name=electricCode]").val());
       // self.find("input[name=electric]").val(encodeURI(electricCode));
        self.attr("action", managementWeb_Path + "hydroelectric/water/index.htm");
    });
//-------------------------------------------------------------------------添加
    /**
     * 商铺号输入框--监听点击事件
     */
    $('#shop').on('click', function (event) {
        event.stopPropagation();
        if(json.length>0){
            $(".shop-grop").empty();
            $.each(json,function(index,item){
                $(".shop-grop").append("<li><a key='"+item.id+"' ibrand='"+item.name+"' onclick='ibrandSelect(this)'   href='javascript:void(0)'>"+item.name+"</a></li>");
            });
        }
        shopShow();
    });
    /**
     * 商铺号输入框--监听输入事件
     */
    $('#shop').on('keyup', function () {
        var val = $(this).val();
        $(".shop-grop").empty();
        if(val!=""){
            shopShow();
        }
        $.each(json,function(index,item){
            if (item.name.indexOf(val) != -1) {
                $(".shop-grop").append("<li><a key='"+item.id+"' ibrand='"+item.name+"' onclick='ibrandSelect(this)'   href='javascript:void(0)'>"+item.name+"</a></li>");
            }
        });
    });
    /**
     * 商铺号输入框--监听鼠标移除事件
     */
    $('#shop').mouseleave(function (event) {
        checkShopSelect();
    });
    /**
     * 商铺号下拉框--监听鼠标移除事件
     */
    $('.shop-grop').mouseleave(function (event) {
        shopHide();
        checkShopSelect();
    });
//-------------------------------------------------------------------------更新
    /**
     * 商铺号输入框--监听点击事件
     */
    $('.shop-update').on('click', function (event) {
        event.stopPropagation();
        console.log(event);
        var reId = event.target.id.split("_")[1];
        if(jsonUpdate.length>0){
            $(".shop-grop-update").empty();
            $.each(jsonUpdate,function(index,item){
                $(".shop-grop-update").append("<li><a key='"+item.id+"' ibrand='"+item.name+"' onclick='ibrandSelectUpdate(this,"+reId+")'   href='javascript:void(0)'>"+item.name+"</a></li>");
            });
        }
        shopUpdateShow();
    });
    /**
     * 商铺号输入框--监听输入事件
     */
    $('.shop-update').on('keyup', function () {
        var reId = event.target.id.split("_")[1];
        var val = $(this).val();
        $(".shop-grop-update").empty();
        if(val!=""){
            shopUpdateShow();
        }
        $.each(jsonUpdate,function(index,item){
            if (item.name.indexOf(val) != -1) {
                $(".shop-grop-update").append("<li><a key='"+item.id+"' ibrand='"+item.name+"' onclick='ibrandSelectUpdate(this,"+reId+")'   href='javascript:void(0)'>"+item.name+"</a></li>");
            }
        });
    });
    /**
     * 商铺号输入框--监听鼠标移除事件
     */
    $('.shop-update').mouseleave(function (event) {
        var reId = event.target.id.split("_")[1];
        checkShopSelectUpdate(reId);
    });
    /**
     * 商铺号下拉框--监听鼠标移除事件
     */
    $('.shop-grop-update').mouseleave(function (event) {
        var reId = event.target.id.split("_")[1];
        shopUpdateHide();
        checkShopSelectUpdate(reId);
    });

    $(document).on('click', function (param) {
        shopHide();
        shopUpdateHide();
    })
})(window.jQuery);


function valitateForm(obj) {
    //var hydroelectricCode = $.trim($(obj).find("input[name=hydroelectricCode]").val());
    var shopNum = $.trim($(obj).find("input[name=shopNum]").val());
    var contId = $.trim($(obj).find("input[name=contId]").val());
    var lastCount = $.trim($(obj).find("input[name=lastCount]").val());
    var paymentMethod = $.trim($(obj).find("input[name=paymentMethod]").val());
    var initReadingDate = $.trim($(obj).find("input[name=InitReadingDate]").val());
    var contractPrice =$.trim($(obj).find("input[name=contractPrice]").val());
    /*if (hydroelectricCode == "" || hydroelectricCode == null) {
        alert("水表编号不能为空！");
        return false;
    }*/

    if (shopNum == "" || shopNum == null) {
        alert("商铺号不能为空！");
        return false;
    }
    if (contId == "" || contId == null) {
        alert("合同号不能为空！");
        return false;
    }
    if (lastCount == "" || lastCount == null) {
        alert("最后读数不能为空！");
        return false;
    }
    if (initReadingDate == "" || initReadingDate == null) {
        alert("初始抄表不能为空！");
        return false;
    }
    if (paymentMethod == "" || paymentMethod == null) {
        alert("付费方式不能为空！");
        return false;
    }
    if (contractPrice == "" || contractPrice == null) {
        alert("单价不能为空！");
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
    $("#projectViewName").text($(_this).text());
    $("#projectId").val($(_this).attr("key"));
    $("#mallId").val(mallId);
    $("#searchBsFormBtn").click();
}
//------------------------------------------------------------------------------------------------------------------添加
/**
 *选择铺位类型后的事件
 * @param _this
 */
function shopTypeSelect(_this){
    var mallId = $('#addBsFloorForm').find("input[name=mallId]").val();
    var storeType = _this.value;
    //清空铺位
    $("#shop").val("");
    $("#shopId").val("");
    $(".shop-grop").empty();
    //清空合同
    $("#contId").val("");
    $("#contHtml").children("span").html("请选择");
    $(".cont-grop").empty();
    //清空品牌名称
    $("#brands").val("");
    $("#brandsId").val("");
    $.ajax({
        cache: true,
        type: "POST",
        url: managementWeb_Path + "hydroelectric/water/shopList.htm?mallId=" + mallId+"&&storeType="+storeType,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            //console.log(resultData);
            json=eval(resultData);
            var isMallId=true;
            $.each(json,function(index,item){
                $(".shop-grop").append("<li><a key='"+item.id+"' ibrand='"+item.name+"' onclick='ibrandSelect(this)'   href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
            if(isMallId){
                alert("该项目下没有商铺号！");
            }
        }
    });
}
/**
 *选择项目后的事件
 * @param _this
 */
function shopSelect(_this){
    var mallId=$(_this).attr("key");
    $('#addBsFloorForm').find("input[name=storeType]").get(0).checked=true;
    var storeType = 0;
    //清空铺位
    $("#shop").val("");
    $("#shopId").val("");
    $(".shop-grop").empty();
    //清空合同
    $("#contId").val("");
    $("#contHtml").children("span").html("请选择");
    $(".cont-grop").empty();
    //清空品牌名称
    $("#brands").val("");
    $("#brandsId").val("");
    $.ajax({
        cache: true,
        type: "POST",
        url: managementWeb_Path + "hydroelectric/water/shopList.htm?mallId=" + mallId+"&&storeType="+storeType,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            json=eval(resultData);
            var isMallId=true;
            $.each(json,function(index,item){
                $(".shop-grop").append("<li><a key='"+item.id+"' ibrand='"+item.name+"' onclick='ibrandSelect(this)'   href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
            if(isMallId){
                alert("该项目下没有商铺号！");
            }
        }
    });
}
/**
 *选择商铺号后的事件
 * @param _this
 */
function ibrandSelect(_this){
    //商铺号赋值
    shopHide();
    $("#shop").val($(_this).attr("ibrand"));
    $("#shopId").val($(_this).attr("key"));
    //绑定品牌
    var shopNum=$(_this).attr("key");
    var storeType = $('#addBsFloorForm').find("input[name=storeType]").val();
    //清空合同
    $("#contId").val("");
    $("#contHtml").children("span").html("请选择");
    $(".cont-grop").empty();
    //清空品牌名称
    $("#brands").val("");
    $("#brandsId").val("");
    $.ajax({
        cache: true,
        type: "POST",
        url: managementWeb_Path + "hydroelectric/water/ibrandList.htm?shopNum=" + shopNum+"&&storeType="+storeType,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            contJson=eval(resultData);
            console.log(contJson);
            var isContId=true;
            $.each(contJson,function(index,item){
                $(".cont-grop").append("<li><a key='"+item.id+"' contNo='"+item.contNo+"' onclick='contSelect(this)'   href='javascript:void(0)'>"+item.contNo+"</a></li>");
                isContId=false;
            });
           if(isContId){
                alert("该项目下没有合同号！");
            }
        }
    });
}
/**
 * 选择合同号后的事件
 * @param {*} _this 
 */
function contSelect(_this){
    //合同号赋值
    $("#contNo").val($(_this).attr("contNo"));
    //品牌赋值
    var isbrand=true;
    $.each(contJson,function(index,item){
        if(item.id == $(_this).attr("key")){
            $("#brands").val(item.brandName);
            $("#brandsId").val(item.brandId);
            isbrand = false;
        }
    });
    if(isbrand){
        $("#brands").val("");
        $("#brandsId").val("");
    }
}
/**
 * 校验商铺号输入
 */
function checkShopSelect(){
    console.log($('.shop-grop').is(':hidden'));
    if(json!=[]){
        var val = $("#shop").val();
        var flag = true;
        if($('.shop-grop').is(':hidden')){
            $.each(json,function(index,item){
                if (item.name == val) {
                    flag = false;
                    return false;
                }
            });
        }else{
            $.each(json,function(index,item){
                if (item.name.indexOf(val) != -1) {
                    flag = false;
                    return false;
                }
            });
        }
        if(flag){
            $("#shop").val("");
            $("#shopId").val("");
            //清空合同
            $("#contId").val("");
            $("#contHtml").children("span").html("请选择");
            $(".cont-grop").empty();
            //清空品牌
            $("#brands").val("");
            $("#brandsId").val("");
        }
    }
}
function shopShow(){
    $('.shop-grop').show();
}
function shopHide(){
    $('.shop-grop').hide();
}
//------------------------------------------------------------------------------------------------------------------修改
function shopTypeUpdateSelect(_this,reId){
    var mallId = $('#updateBsFloorForm_'+reId).find("input[name=mallId]").val();
    var storeType = _this.value;
    //清空铺位
    $("#shop_"+reId).val("");
    $("#shopId_"+reId).val("");
    $(".shop-grop-update").empty();
    //清空合同
    $("#contId_"+reId).val("");
    $("#contHtml_"+reId).children("span").html("请选择");
    $("#cont-grop-update-"+reId).empty();
    //清空品牌名称
    $("#brands_"+reId).val("");
    $("#brandsId_"+reId).val("");
    $.ajax({
        cache: true,
        type: "POST",
        url: managementWeb_Path + "hydroelectric/water/shopList.htm?mallId=" + mallId+"&&storeType="+storeType,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            jsonUpdate=eval(resultData);
            var isMallId=true;
            $.each(jsonUpdate,function(index,item){
                $(".shop-grop-update").append("<li><a key='"+item.id+"' ibrand='"+item.name+"' onclick='ibrandSelectUpdate(this,"+reId+")'   href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
            if(isMallId){
                alert("该项目下没有商铺号！");
            }
        }
    });

}
/**
 *选择项目后的事件
 * @param _this
 * @param reId
 */
function shopSelectUpdate(_this,reId){
    $('#storeType_'+reId).find("input[name=storeType]").get(0).checked=true;
    var storeType = 0;
    var mallId=$(_this).attr("key");
    console.log(reId);
    //清空铺位
    $("#shop_"+reId).val("");
    $("#shopId_"+reId).val("");
    $(".shop-grop-update").empty();
    //清空合同
    $("#contId_"+reId).val("");
    $("#contHtml_"+reId).children("span").html("请选择");
    $("#cont-grop-update-"+reId).empty();
    //清空品牌名称
    $("#brands_"+reId).val("");
    $("#brandsId_"+reId).val("");
    $.ajax({
        cache: true,
        type: "POST",
        url: managementWeb_Path + "hydroelectric/water/shopList.htm?mallId=" + mallId+"&&storeType="+storeType,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            jsonUpdate=eval(resultData);
            var isMallId=true;
            $.each(jsonUpdate,function(index,item){
                $(".shop-grop-update").append("<li><a key='"+item.id+"' ibrand='"+item.name+"' onclick='ibrandSelectUpdate(this,"+reId+")'   href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
           if(isMallId){
                alert("该项目下没有商铺号！");
            }
        }
    });

}
/**
 *选择商铺号后的事件
 * @param _this
 * @param reId
 */
function ibrandSelectUpdate(_this,reId){
    //商铺号赋值
    shopUpdateHide();
    $("#shop_"+reId).val($(_this).attr("ibrand"));
    $("#shopId_"+reId).val($(_this).attr("key"));
    //绑定品牌
    var shopNum=$(_this).attr("key");
    var storeType = $('#updateBsFloorForm_'+reId).find("input[name=storeType]").val();
    //清空合同
    $("#contId_"+reId).val("");
    $("#contHtml_"+reId).children("span").html("请选择");
    $("#cont-grop-update-"+reId).empty();
    //清空品牌
    $("#brands_"+reId).val("");
    $("#brandsId_"+reId).val("");
    $.ajax({
        cache: true,
        type: "POST",
        url: managementWeb_Path + "hydroelectric/water/ibrandList.htm?shopNum=" + shopNum+"&&storeType="+storeType,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            contJsonUpdate=eval(resultData);
            var isContId=true;
            $.each(contJsonUpdate,function(index,item){
                $('#cont-grop-update-'+reId).append("<li><a key='"+item.id+"' contNo='"+item.contNo+"' onclick='contSelectUpdate(this,"+reId+")' href='javascript:void(0)'>"+item.contNo+"</a></li>");
                isContId=false;
            });
           if(isContId){
                alert("该项目下没有合同号！");
            }
        }
    });
}
/**
 * 选择合同号后的事件
 * @param {*} _this 
 */
function contSelectUpdate(_this,reId){
    //合同号赋值
    $("#contNo_"+reId).val($(_this).attr("contNo"));
    //品牌赋值
    var isbrand=true;
    $.each(contJsonUpdate,function(index,item){
        if(item.id == $(_this).attr("key")){
            $("#brands_"+reId).val(item.brandName);
            $("#brandsId_"+reId).val(item.brandId);
            isbrand = false;
        }
    });
    if(isbrand){
        $("#brands_"+reId).val("");
        $("#brandsId_"+reId).val("");
    }
}
/**
 * 校验商铺号输入
 */
function checkShopSelectUpdate(reId){
    if(jsonUpdate.length>0){
        var val = $("#shop_"+reId).val();
        var flag = true;
        if($('#menu_'+reId).is(':hidden')){//不可见
            $.each(jsonUpdate,function(index,item){
                if (item.name == val) {
                    flag = false;
                    return false;
                }
            });
        }else{
            $.each(jsonUpdate,function(index,item){
                if (item.name.indexOf(val) != -1) {
                    flag = false;
                    return false;
                }
            });
        }
        if(flag){
            $("#shop_"+reId).val("");
            $("#shopId_"+reId).val("");
            //清空合同
            $("#contId_"+reId).val("");
            $("#contHtml_"+reId).children("span").html("请选择");
            $("#cont-grop-update-"+reId).empty();
            //清空品牌
            $("#brands_"+reId).val("");
            $("#brandsId_"+reId).val("");
        }
    }
}
function shopUpdateShow(){
    $('.shop-grop-update').show();
}
function shopUpdateHide(){
    $('.shop-grop-update').hide();
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

function loadingshow(){
    $(".zl-loading").fadeIn();
};

function loadingHide(){
    $(".zl-loading").fadeOut();
}
window.onload=function(){
    loadingHide();
}

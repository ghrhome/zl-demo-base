var dubSumit = 0;
// var fileWeb_Path = "http:////localhost:8089/static/";
(function ($) {
    $(function () {
        $("addDiverseBu").on("click", function () {
            ran1 = "LD" + show() + randomNum();    //“LD”+“当前时间”+"三位随机数"
            // $(".zl-add-collapse").slideToggle("normal");
        });

        $("#btn-next-bottom").on("click", function () {//下一页
            var page = $("#searchBsDiverseForm").find($("[name='page']")).attr("value");
            var pages = $("#searchBsDiverseForm").find($("[name='pages']")).attr("value");
            page = parseInt(page);
            pages = parseInt(pages);
            if (page < pages) {
                $("#searchBsDiverseForm").find($("[name='page']")).attr("value", parseInt(page) + 1);
                $("#searchBsDiverseForm").trigger("submit");
            }
        });
        $("#btn-pre-bottom").on("click", function () {//上一页
            var page = $("#searchBsDiverseForm").find($("[name='page']")).attr("value");
            var pages = $("#searchBsDiverseForm").find($("[name='pages']")).attr("value");
            page = parseInt(page);
            pages = parseInt(pages);
            if (page > 1) {
                $("#searchBsDiverseForm").find($("[name='page']")).attr("value", page - 1);
                // $("[name=diverseNo]").val($("[name=diverseEnNo]").val())
                $("#searchBsDiverseForm").submit();
            }

        });

        $(".dropdown-menu>li>a").on("click", function (e) {//下拉选项
            onSelect(this);

        });

        /**
         *项目类型选择时，如果没有项目选择，则除了全部类型之外的所有选项都不可用
         *xiaozunh
         * 2018 04 12
         * */
        $("#dSelect").on("click", function (e) {
            //項目ID不为空时
            var mallvalue = $("#mallId").val();
            var arry = $("[name='dType']") //所有下拉选项
            if (mallvalue == "" || mallvalue == undefined) {
                for (var i = 0; i < arry.length; i++) {
                    arry[i].style.opacity = "0.2";
                    arry[i].href = 'javascript:return false;';
                }
            } else {
                for (var i = 0; i < arry.length; i++) {
                    arry[i].style.opacity = "1";
                    arry[i].href = 'javascript:void(0);';
                }


            }
        });

        $("#addBsDiverseBtn").on("click", function () {
            if (dubSumit > 0) {
                alert("请勿重复提交表单！");
                return false;
            }
            if (!valitateForm($('#addBsDiverseForm'))) {
                return false;
            }
            var isRe = false;
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "diverse/velicateName.htm",
                data: $('#addBsDiverseForm').serialize(),
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (typeof resultData != 'undefined' && typeof resultData.msg != "undefined") {
                        showMsg(resultData);
                        isRe = true;
                        return false;
                    }
                }
            });
            if (isRe) {
                return false;
            }


            dubSumit++;
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "diverse/add.htm",
                data: $('#addBsDiverseForm').serialize(),
                async: false,
                error: function (request) {
                    alert("系统异常");
                    dubSumit = 0;
                },
                success: function (resultData) {
                    // showMsg(resultData);
                    $("#searchBsFormBtn").click();
                }
            });
        });

        $("[name=updateBsDiverseBtn]").on("click", function () {
            var bsDiverseId = $(this).attr("bsDiverseId");
            if (!valitateForm($('#updateBsDiverseForm_' + bsDiverseId))) {
                return false;
            }

            var isRe = false;
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "diverse/velicateName.htm",
                data: $('#updateBsDiverseForm_' + bsDiverseId).serialize(),
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (typeof resultData != 'undefined' && typeof resultData.msg != "undefined") {
                        showMsg(resultData);
                        isRe = true;
                        return false;
                    }
                }
            });
            $(".upload-pic-item-list li a em").click(function () {
                console.log("删除");
            })
            var imgs = "";
            $('#updateBsDiverseForm_' + bsDiverseId).find(".zl-img-wrapper").find("a").each(function () {
                imgs = imgs + "," + $(this).attr("data-image")
                // imgs = ids + "," + targetIds + urls;
            });
            // imgs = ids + "," + imgs;

            if (isRe) {
                return false;
            }
            confirm("确认要提交吗？", "", "", function (type) {
                if (type == "dismiss") {
                    return;
                }
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: enrolmentWeb_Path + "diverse/update.htm?imgs=" + imgs,
                    data: $('#updateBsDiverseForm_' + bsDiverseId).serialize(),
                    async: false,
                    error: function (request) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        $("#searchBsDiverseForm").trigger("submit");
                    }
                });
            })
        });

        $(document).ready(function () {
            $('.zl-thumbnail').magnificPopup({
                type: 'image',
            });

        });

        $("[name=deleteBsDiverseBtn]").on("click", function () {
            var bsDiverseId = $(this).attr("bsDiverseId");
            confirm("确认要删除吗？", "", "", function (type) {
                if (type == "dismiss") {
                    return;
                }

                console.log("bsDiverseId:" + bsDiverseId);
                console.log(this.html);
                console.log("----------------------");
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: enrolmentWeb_Path + "diverse/delete.htm?bsDiverseId=" + bsDiverseId,
                    async: false,
                    error: function (request) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        alert("删除成功", "", "", function (e) {
                            $("#searchBsDiverseForm").submit();
                        });
                    }
                });
            });
        });
        $("[name=diverseEnNo]").on("keypress", function (e) {
            e.stopPropagation();
            if (e.keyCode == 13) {
                $("#searchBsFormBtn").click();
            }
        });


        $("#gotoPage").on("click", function (e) {
            if (!isNumberss($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (regeMatch($("#gotoPageNum").val())) {
                alert("请勿输入特殊字符！");
                return false;
            }
            if (regeMatch($("#gotoPageNum").val())) {
                alert("请勿输入特殊字符！");
                return false;
            }
            if (verifyPagination(parseInt($("#gotoPageNum").val()), parseInt($("#pages").val()))) {
                $("#searchBsDiverseForm").find("input[name=page]").val($("#gotoPageNum").val());
                $("#searchBsDiverseForm").trigger("submit");
            } else {
                $("#gotoPageNum").val($("#pages").val());
            }
        });

        $(".zl-page-num-input").bind("keypress", function (event) {
            if (event.keyCode == "13") {
                $("#gotoPage").trigger("click");
            }
        });

        $("#searchBsFormBtn").on("click", function (e) {
            $("#searchBsDiverseForm").find("input[name=page]").val(1);
            $("[name=diverseNo]").val($("[name=diverseEnNo]").val())
            $("#searchBsDiverseForm").submit();

        });


        var iszj = false;
        $(".fileinput-button").each(function () {
            $(this).ysSimpleUploadFile({
                changeCallback: function (file) {
                    // showLoading(); // 显示loading
                    var fileReader = new FileReader();
                    $(this).parent().height(136);
                    var that = this;
                    fileReader.onload = function () {
                        //console.log($(that).parent().html());
                        //console.log($(that).parent().find(".zl-thumbnail-wrapper a").size());
                        if ($(that).parent().find(".zl-thumbnail-wrapper a").length >= 5) {
                            alert("最多上传5张图片");
                            return;
                        }
                        $(that).next().css("display", "block");
                        imgkkAll = $(that).attr("al");
                        compressImage(1000, 1000, this.result, null, function (dataUrl) {

                            var html = "<li><div class=\"zl-thumbnail-wrapper\"><em class='zl-icon-btn zl-icon-btn-del'></></em> <a  class='zl-thumbnail' style='background-image:url(" + dataUrl + ")'><em></em></a></div></li>";
                            $(that).next().children().append(html);
                            // alert($(that).next().children().html())
                            var formData = new FormData();
                            formData.append("action", "1002");
                            formData.append("single", 1);
                            formData.append("category", "FILE_ENROLMENT_DIVERSE");
                            formData.append("targetId", ran1);
                            formData.append('file', file);

                            jQuery.ajax({
                                url: fileWeb_Path + 'sdk/platform/file',
                                type: 'POST',
                                data: formData,
                                dataType: 'json',
                                async: true,
                                cache: false,
                                contentType: false,
                                processData: false,
                                success: function (response) {
                                    if (response.success) {
                                        targetIds = response.data.targetId;
                                        ids = response.data.id;
                                        var myurls = "https:" + accessUrl + response.data.path;
                                        if (isshanchu == false && iszj == false) {
                                            urls = "," + imgkkAll;
                                            iszj = true;
                                        }
                                        if (isAdd) {
                                            addUrls += "," + myurls;
                                        } else if (isAdd == false) {
                                            urls += "," + myurls;
                                        }
                                        $(that).next().find("li:last-child a").attr("data-image", myurls);
                                        $(that).next().find("li:last-child a").attr("href", myurls);
                                        $('.zl-thumbnail').magnificPopup({
                                            type: 'image',
                                        });

                                    } else {
                                        // alert(response.message);
                                        hideLoading(); // 隐藏 loading
                                    }
                                },
                                error: function (data) {
                                    alert("操作失败，请重试！");
                                    // hideLoading(); // 隐藏 loading
                                }
                            })
                        });
                    };
                    fileReader.readAsDataURL(file);
                }
            });
        });
        var isUp = false;
        var container = $("#multi_ledger");
        container.on("click", ".zl-thumbnail-wrapper em", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var imgkk = "," + $(this).parents().closest("li").find("a").attr("data-image");
            $(this).closest("li").remove();
            // var imgkk = "," + $(this).closest("a").attr("data-image");
            if (isAdd) {
                addUrls = addUrls.replace(imgkk, "");
                var last = addUrls.charAt(addUrls.length - 1);
                // var fiest=addUrls.charAt(0);
                if (last == ",") {
                    addUrls = addUrls + ",";
                    addUrls = addUrls.replace(",,", "");
                }
                // if(fiest==","){
                //     addUrls=","+addUrls;
                //     addUrls=addUrls.replace(",,","");
                // }
            } else {
                if (isUp) {
                    imgkkAll = urls;
                } else {
                    imgkkAll = "," + $(this).parents().closest("li").find("a").attr("al");
                }
                imgkkAll = imgkkAll.replace(imgkk, "");
                var last = imgkkAll.charAt(imgkkAll.length - 1);
                if (last == ",") {
                    imgkkAll = imgkkAll + ",";
                    imgkkAll = imgkkAll.replace(",,", "");
                }
                var fiest = imgkkAll.charAt(0);
                var er = imgkkAll.charAt(1);
                if (fiest == "," && er != ",") {
                    imgkkAll = "," + imgkkAll;
                    imgkkAll = imgkkAll.replace(",,", "");
                } else {
                    imgkkAll = imgkkAll.replace(",,", "");
                }
                if (imgkkAll != "") {
                    urls = "," + imgkkAll;
                } else {
                    urls = "";
                }
                isshanchu = true;
                isUp = true;
            }

        });

        //==========================增加附件===========================
        var ran1 = "";
        var imgkkAll = "";
        var ids = "";     //附件id
        var urls = "";     //附件路径(删除)
        var addUrls = "";    //附件路径(添加)
        var targetIds = "";     //业务编号
        var isshanchu = false;
        var isAdd = false;
        $("#mya").click(function () {
            imgkkAll = "";
            isshanchu = true;
            isAdd = true;
        })


    });

    //==========自动获取当前时间=====
    function show() {
        var nowDate = new Date();
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
        var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        return year + month + date;
    }

    //======生成不重复的三位随机数===
    function randomNum() {
        var arr = [];
        for (var i = 100; i <= 999; i++)
            arr.push(i);
        arr.sort(function () {
            return 0.5 - Math.random();
        });
        arr.length = 1;
        return arr;
    }
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
                    alert("输入" + msg + "值过大！");
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            var re = /^[0-9]|^[0-9]*[1-9][0-9]*$/;
            if (re.test(num)) {
                if (parseInt(num) > 99999999) {
                    alert("输入" + msg + "值过大！");
                    return false;
                } else {
                    return true;
                }
            } else {
                alert("输入" + msg + "不合法！");
                return false;
            }
        }
    } else {
        alert("输入" + msg + "不合法！");
        return false;
    }
}


function valitateForm(obj) {
    var mallId = $(obj).find("input[name=mallId]").val();
    var diverseNo = $(obj).find("input[name=diverseNo]").val();
    var diverseType = $(obj).find("input[name=diverseType]").val();
    var diverseArea = $(obj).find("input[name=diverseArea]").val();
    //var inOrOut = $(obj).find("input[name=inOrOut]").val();
    var square = $(obj).find("input[name=square]").val();
    var rent = $(obj).find("input[name=rent]").val();
    var isOpenAir = $(obj).find("input[name=isOpenAir]").val();
    var margin = $(obj).find("input[name=margin]").val();
    var leasePublic = $(obj).find("input[name=leasePublic]").val();
    var incomeType = $(obj).find("input[name=incomeType]").val();
    var areaID = $(obj).find("input[name=areaID]").val();
    var blockID = $(obj).find("input[name=blockID]").val();
    var floorId = $(obj).find("input[name=floorId]").val();
    var shortName = $(obj).find("input[name=shortName]").val();
    var diverseCode = $(obj).find("input[name=diverseCode]").val();


    if (areaID == "" || areaID == null) {
        alert("所属城市公司不能为空！");
        return false;
    }
    if (mallId == "" || mallId == null) {
        alert("所属项目不能为空！");
        return false;
    }
    if (blockID == "" || blockID == null) {
        alert("所属楼栋不能为空！");
        return false;
    }
    if (floorId == "" || floorId == null) {
        alert("所属楼层不能为空！");
        return false;
    }
    if (diverseNo == "" || diverseNo == null || diverseNo.replace(/\s+/g, "") == "") {
        alert("推广点位编号不能为空！");
        return false;
    }
    if (shortName == "" || shortName == null || diverseNo.replace(/\s+/g, "") == "") {
        alert("推广点位位置不能为空！");
        return false;
    }
    /* if (diverseCode == "" || diverseCode == null || diverseNo.replace(/\s+/g, "") == "") {
         alert("推广点位编码不能为空！");
         return false;
     }*/

    if (diverseType == "" || diverseType == null || diverseNo.replace(/\s+/g, "") == "") {
        alert("推广点位类型不能为空！");
        return false;
    }
    if (diverseNo == "" || diverseNo == null || diverseNo.replace(/\s+/g, "") == "") {
        alert("推广点位编号不能为空！");
        return false;
    }
    if (diverseNo.length > 50) {
        alert("推广点位编号称超过50个文字！");
        return false;
    }

    // if (incomeType == "" || incomeType == null) {
    //     alert("收入类型不能为空！");
    //     return false;
    // }
    if (square == "" || square == null) {
        alert("实用面积不能为空！");
        return false;
    }
    if (!isNum(square, "实用面积")) {
        alert("实用面积有误，请重新输入！");
        return false;
    }
    if (parseInt(square) < 0) {
        alert("租赁面积应为正数！");
        return false;
    }
    // if ($(obj).find("input[name=siteType]").length == 1) {
    //     var siteType = $(obj).find("input[name=siteType]").val()
    //
    //     if (siteType == "" || siteType == null) {
    //         alert("位置类型不能为空！");
    //         return false;
    //     }
    // }
    return true;
}

function isPositiveNum(s) {//是否为正整数
    var re = /^[0-9]*[1-9][0-9]*$/;
    return re.test(s)
}

function searchMall(_this) {
    var mallId = $(_this).attr("key");
    $("#mallId").val(mallId);
    $("#searchBsFormBtn").click();
}

/*----------------------------下拉框赋值--------------------------------------*/
$(".areaSelect").ysdropdown({
    callback: function (val, $elem) {
        console.log("===================")
        console.log(val);
        console.log($elem);
        // $("#searchBsFormBtn").click();
    }
});
$(".zl-dropdown-inline").ysdropdown({
    callback: function (val, $elem) {
        console.log("===================")
        console.log(val);
        console.log($elem);
    }
});

//导出
$("#js-export-new").on("click", function (e) {
    e.preventDefault();
    //获取查询条件 一次提交表单
    var formData = {};
    var formTable1 = $("#searchBsDiverseForm input").serializeArray();
    $.each(formTable1, function (i, map) {
        if (!(map.name in formTable1)) {
            formData[map.name] = map.value;
        }
    });
    formPost(enrolmentWeb_Path + "diverse/export.htm", formData);
});


function formPost(url, params, target){
    var temp = document.createElement("form");
    temp.enctype = "multipart/form-data";
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";

    if(target){
        temp.target = target;
    }else{
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



function onSelect(that) {
    var key = $(that).attr("key");
    var that = that;
    var name = $(that).attr("name");

    if (name == "select") {
        var selectName = $(that).parent().parent().parent().children("input").prop("name")

        $.getJSON(enrolmentWeb_Path + "diverse/getSelected.htm", {
            "selectName": selectName,
            "selectID": key
        }, function (res) {
            if (res && res.length === 0) {
                if (selectName === "areaID") {
                    alert("未找到项目！");
                } else if (selectName === 'mallId') {
                    alert("未找到楼栋！");
                } else if (selectName === 'blockId') {
                    alert("未找到楼层！");
                }
            }

            var html = "";
            // $(that).closest(".zl-input-required").next().find(".dropdown-menu").append("")
            $.each(res, function (index, element) {
                if (selectName == "areaID") {
                    html = html + "<li><a  name=\"select\" data-value=" + element.id + " key=" + element.id + " onclick='onSelect(this)' href=javascript:void(0)>" + element.shortName + "</a></li>";
                } else if (selectName == "mallId") {
                    html = html + "<li><a  name=\"select\" data-value=" + element.id + " key=" + element.id + " onclick='onSelect(this)' href=javascript:void(0)>" + element.blockName + "</a></li>";
                } else if (selectName == "blockID") {
                    html = html + "<li><a data-value=" + element.id + "  key=" + element.id + " onclick='onSelect(this)' href=javascript:void(0)>" + element.floorName + "</a></li>";
                }
            });
            if (selectName == "areaID") {
                $(that).closest(".zl-input-required").next().next().find(".dropdown-menu").html("")
                $(that).closest(".zl-input-required").next().next().next().find(".dropdown-menu").html("")
                $(that).closest(".zl-input-required").next().find("button").html("")
                $(that).closest(".zl-input-required").next().next().find("button").html("")
                $(that).closest(".zl-input-required").next().next().next().find("button").html("")
                $(that).closest(".zl-input-required").next().find("button").html("")
                $(that).closest(".zl-input-required").next().next().find("button").html("")
                $(that).closest(".zl-input-required").next().next().next().find("button").html("")
                $(that).closest(".zl-input-required").next().find("input").attr("value", "");
                $(that).closest(".zl-input-required").next().next().find("input").attr("value", "");
                $(that).closest(".zl-input-required").next().next().next().find("input").attr("value", "");

            } else if (selectName == "mallId") {
                $(that).closest(".zl-input-required").next().next().find(".dropdown-menu").html("")
                $(that).closest(".zl-input-required").next().find("button").html("")
                $(that).closest(".zl-input-required").next().next().find("button").html("")
                $(that).closest(".zl-input-required").next().find("input").attr("value", "");
                $(that).closest(".zl-input-required").next().next().find("input").attr("value", "");
            } else if (selectName == "blockID") {
                $(that).closest(".zl-input-required").next().find("button").html("")
                $(that).closest(".zl-input-required").next().find("input").attr("value", "");
            }
            $(that).closest(".zl-input-required").next().find(".dropdown-menu").html(html)
        });


    }
    if ($(that).closest("ul").attr("name") == "doSelect") {
        var selectName = $(that).parent().parent().parent().children("input").prop("name")
        if (selectName == 'area') {
            $("#searchBsDiverseForm").find("[name=mallId]").val("")
            $("#searchBsDiverseForm").find("[name=blockID]").val("")
            $("#searchBsDiverseForm").find("[name=floorId]").val("")
        } else if (selectName == 'mallId') {
            $("#searchBsDiverseForm").find("[name=blockID]").val("")
            $("#searchBsDiverseForm").find("[name=floorId]").val("")
        }
        else if (selectName == 'blockID') {
            $("#searchBsDiverseForm").find("[name=floorId]").val("")
        }
        $("#searchBsFormBtn").click();
    }
    if ($(that).closest("ul").attr("name") == "doSelectDiverseType") { //点位类型选择为广告位或临时场地时带出 位置类型
        if (key == 2002 || key == 2006) {
            var hideKey = key == 2002 ? 2006 : 2002
            $(that).closest(".row").find("ul[name='ul-sitetype-" + key + "']").attr("style", "")
            $(that).closest(".row").find("ul[name='ul-sitetype-" + hideKey + "']").hide();
            $(that).closest(".row").find("li[name='site-type-li']").show();
            $("li[name='site-type-li").find("input:hidden").attr("name", "siteType")
            $("li[name='site-type-li").find("input:hidden").val("")
            $("li[name='site-type-li").find("button").html("")
        } else {
            $(that).closest(".row").find("li[name='site-type-li']").hide();
            $("li[name='site-type-li").find("input:hidden").attr("name", "")
        }

    }
}

function getPath(obj) {
    if (obj) {

        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            obj.select();

            return document.selection.createRange().text;
        }

        else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
            if (obj.files) {

                return obj.files.item(0).getAsDataURL();
            }
            return obj.value;
        }
        return obj.value;
    }
}

function verifyPagination(value, total) {
    if (total === 0) return true;
    if (!isNumber(value)) {
        alert('请输入正确的页码');
        return false;
    }
    if (value > total) {
        alert('超过总页数,请重新输入 ');
        return false;
    }
    return true;
}

//数字校验
function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}

//特殊字符校验 存在特殊字符返回true
function regeMatch(strs) {
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:]");
    if (strs != "" && strs != null) {
        if (pattern.test(strs)) {
            //alert("非法字符！");
            return true;
        } else {
            return false;
        }
    }
}

function isNumber(value) {
    return /^(\-?)[0-9]+.?[0-9]*$/.test($.trim(value))
}
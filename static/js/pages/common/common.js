var pageCommon = (function ($) {
    var pageCommon = {};

    pageCommon.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageCommon.loadingHide = function () {
        $(".zl-loading").fadeOut();
    };

    pageCommon.handle = function (data) {
        alert(data.message);
    }

    pageCommon.decimal = function () {
        $("input[data-type=number]").each(function () {
            var _this = $(this);
            var number = _this.val();
            number = parseFloat(number).toFixed(2);
            _this.val(isNaN(number) ? "0.00" : number);
        });
    }

    pageCommon.ajaxSelect = function (url, data, callback, async) {
        pageCommon.loadingShow();
        if(async == undefined){
            async = true;
        }
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: data,
            async: async,
            success: function (data) {
                pageCommon.loadingHide();
                callback(data);
            }
        })
    }

    // 载入模板内容
    pageCommon._renderList = function (list, id) {
        var _tmp = $("#" + id).html();
        var template = Handlebars.compile(_tmp);
        var context = {dataList: list}
        return template(context)
    }

    // 发起K2调用
    pageCommon.submitNetComment = function (code, netCommonId, rebake) {
        $app.workflow.submit(code, netCommonId).then(function ($response) {
            window.open($response.data.data);
            if (rebake != '') {
                location.href = rebake;
            }
        })
    }

    // 初始化Code值(网批使用)
    pageCommon.initMallCode = function () {
        var mallId = $("#mallId").val();
        if (mallId == undefined) {
            return;
        }
        pageCommon.ajaxSelect(netcommentWeb_Path + "/netcomment/busicond/selectBsMallEntity.htm?" + document.cookie, {mallId: mallId}, function (data) {
            if (data.data == undefined) {
                return;
            }
            if (data.data.mallCode != undefined) {
                var mallCode = data.data.mallCode;
                $("#areaCode").val(mallCode.substr(0, 8))
            }
        }, false);
    }

    pageCommon.init = function () {
        $(document).keydown(function (e) {
            if (e.keyCode === 13) {
                $('#querySearch').trigger('click');
            }
        });
    }

    pageCommon.deleteWorkFlow = function (masterId) {
        confirm("确认删除？", "", "", function (type) {
            if (type == "dismiss") {
                return;
            }
            pageCommon.ajaxSelect(netcommentWeb_Path + "/netcomment/deleteWorkFlow.htm", {masterId: masterId}, function (data) {
                // alert(data.message);
                if (data.code == 200) {
                    self.location=document.referrer
                }
            });
        });
    }

    pageCommon.validateForm = function () {
        var boo = true;
        $(".required").find(".zl-dropdown-btn").each(function () {
            var _this = $(this)
            if (_this.html() == "" || _this.html() == undefined || _this.html().indexOf("请选择") > 0) {
                boo = false;
                var label = _this.parents("td").prev();
                if (label[0].localName != "th") {
                    alert("必填项不能为空");
                } else {
                    alert(label.html() + "不能为空", "", "", function () {
                        _this.focus();
                        return false;
                    });
                }
                return false;
            }
        });
        if (!boo) {
            return boo;
        }

        $(".required input:not(:hidden)").each(function () {
            var el = $(this);
            if (!el.val()) {
                boo = false;
                var label = el.parents("td").prev();
                if (label[0].localName != "th") {
                    alert("必填项不能为空");
                } else {
                    alert(label.html() + "不能为空", "", "", function () {
                        _this.focus();
                        return false;
                    });
                }
                return false;
            }
        });
        return boo;
    }

    pageCommon.dateFormat = function (date,flag) {
        if(!date){
            return "";
        }
        var date = new Date(date);
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) < 10  ? '0' + (date.getMonth() + 1) :(date.getMonth() + 1);
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        if(flag){
            return month + "-" + day ;
        }
        return year + "-" + month + "-" + day ;
    }

    return pageCommon;

})(jQuery);


$(document).ready(function () {
    // console.log("................");
    pageCommon.init();
});
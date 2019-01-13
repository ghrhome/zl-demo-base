/*
    保证金应收
    liuqq at 2018-04-16
 */

var pageView=(function($){
    var pageView={};

    pageView.init=function() {

        $("#preloader").fadeOut("fast");
        var page = $("#receipt-detail");

        $(".btn-group").ysdropdown("init");

        page.on("click", "a.save-btn", function(){
            if (checkForm()) {
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "bill/receipt/save.htm",
                    type: 'post',
                    data: $("form").serialize(),
                    error: function() {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (res) {
                        res = JSON.parse(res);
                        pageView.loadingHide();
                        if (res.code == '0') {
                            alert("保存成功","","",function(){
                                window.location = financeWeb_Path + "bill/receipt/index.htm";eceipt_add
                            });
                        } else {
                            alert(res.msg);
                        }
                    }
                });
            }
        });
        page.on("click", "a.invaild-btn", function() {
            confirm("确认作废？","","",function(type){
                if (type == "dismiss") return false;
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "/bill/receipt/toInvalid.htm",
                    data: {ids : $("input[name=id]").val()},
                    type: "post",
                    dataType: "json",
                    success: function (res) {
                        if (res.code == "0") {
                            alert("作废成功","","",function(){
                                window.location = financeWeb_Path + "/bill/receipt/index.htm";
                            });
                        } else {
                            alert(res.msg);
                        }
                        pageView.loadingHide();
                    },
                    error: function (res) {
                        alert(res.msg);
                        pageView.loadingHide();
                    }
                });
            });
        });
        //回收
        page.on("click", "a.recycle-btn", function() {
            confirm("确认回收？","","",function(type){
                if (type == "dismiss") return false;
                pageView.loadingShow();
                $.ajax({
                    url: financeWeb_Path + "/bill/receipt/toRecycle.htm",
                    data: {ids : $("input[name=id]").val()},
                    type: "post",
                    dataType: "json",
                    success: function (res) {
                        if (res.code == "0") {
                            alert("回收成功","","",function(){
                                window.location = financeWeb_Path + "/bill/receipt/index.htm";
                            });
                        } else {
                            alert(res.msg);
                        }
                        pageView.loadingHide();
                    },
                    error: function (res) {
                        alert(res.msg);
                        pageView.loadingHide();
                    }
                });
            });

        });

        //收据打印
        page.on("click","a.print-btn",function(e){

            $(".receipt-title-dialog").modal("show");
            var id = $(this).attr('data-id');
            $(".receipt-title-dialog button.btn-primary").on("click",function(){
                var title = $("input[name=receiptTitle]").val();
                openPostWindow(financeWeb_Path + "bill/receipt/print.htm", id , title);
                $(".receipt-title-dialog").modal("hide");
            });

        });

        function openPostWindow(url, ids, title){
            var tempForm = document.createElement("form");
            tempForm.id="tempForm";
            tempForm.method="post";
            tempForm.action=url;
            tempForm.target="blank";
            var hideInput = document.createElement("input");
            hideInput.type="hidden";
            hideInput.name="ids";
            hideInput.value= ids;
            tempForm.appendChild(hideInput);
            var hideInput2 = document.createElement("input");
            hideInput2.type="hidden";
            hideInput2.name="title";
            hideInput2.value= title;
            tempForm.appendChild(hideInput2);
            if (tempForm.attachEvent) {  // IE
                tempForm.attachEvent("onsubmit",function(){ window.open('about:blank','blank'); });
            } else if (tempForm.addEventListener) {  // DOM Level 2 standard
                tempForm.addEventListener("onsubmit",function(){ window.open('about:blank','blank'); });
            }
            document.body.appendChild(tempForm);
            if (document.createEvent) { // DOM Level 2 standard
                evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("submit", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                tempForm.dispatchEvent(evt);
            } else if (tempForm.fireEvent) { // IE
                tempForm.fireEvent('onsubmit');
            }
            tempForm.submit();
            document.body.removeChild(tempForm);
        }

        function checkForm() {
            var flag = true;
            $("form").find("td.required").each(function() {
                var title = $(this).attr("title") || "必填项";
                var inp = $(this).find("input:visible");
                var type = inp.attr("type") || "text";
                if (type == 'text') {
                    var num = inp.attr("number");

                    if ($.trim(inp.val()) == '') {
                        flag = false;
                        alert(title + "不能为空");
                        return false
                    }
                    if (num != undefined) {
                        var reg = /^[0-9]*\.?[0-9]+(eE?[0-9]+)?$/;
                        if (!reg.test(inp.val())) {
                            flag = false;
                            alert(title + "请输入大于0的数字");
                            return false
                        }
                    }
                }
            });
            return flag;
        }
        pageView.loadingShow = function () {
            $(".zl-loading").fadeIn();
        };

        pageView.loadingHide = function () {
            $(".zl-loading").fadeOut();
        }
    }
    return pageView;
})(jQuery);

$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});
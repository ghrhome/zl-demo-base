var pageView = (function ($) {
    var pageView = {};
    var container = $("#repair-apply-acceptance");

    pageView.init = function () {
        // 动态效果
        pageView.loadingHide();
        pageView.functionButton();
        pageView.bindingSubmit();
        pageView.loaunitIn();
        //初始化日期控件
        $(".zl-datetimepicker-query").find("input").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            clearBtn: true
        });

        //查询按钮查询
        $(".zl-query-btn").on("click", function () {
            var startT = $("#startDate").val();
            var endT = $("#endDate").val();
            if (pageView.verifyQueryDate(startT, endT)) {
                pageView.generalQueryBtn(true, 1);
            }
            return false;
        });

        //下拉框自动查询
        $(".btn-group").ysdropdown({
            callback: function () {
                var startT = $("#startDate").val();
                var endT = $("#endDate").val();
                if (pageView.verifyQueryDate(startT, endT)) {
                    pageView.generalQueryBtn(true, 1);
                }
            }
        });
        $("#js-export-new").on("click", function () {
            pageView.exportBtn();
        });
        $("#js-add-new").on("click", function () {
            formPost(merchantWeb_Path + "repair/add", "");
        });
    }


    pageView.initTable = function () {
        $('.modal-backdrop').on('click', function () {
            pageView.loadingHide();
        })
        // 选中list条目
        $(".zl-section").on("click", function (e) {
            console.log("详情");
            e.preventDefault();
            var target = $(e.target);
            console.log(target);
            if (target.is('td')) {
                console.log("tr详情");
                var dataQuery = {serviceId:target.parent().find('input').eq(0).val()};
                console.log(dataQuery);
                formPost(merchantWeb_Path + "repair/queryRepariDetail", dataQuery);
                pageView.loadingHide();
            }

        });
    }

    pageView.functionButton = function () {

        $(".zl-content").on("click", function (e) {
                var target = $(e.target);
                var dataQuery = {};
                dataQuery.serviceId = target.parents('tr').find('input').eq(0).val();
                dataQuery.mallId = target.parents('tr').find('input').eq(1).val();

                if (target.is('a') && target.hasClass('repair_distribution')) {
                    e.stopPropagation();
                    pageView.loaunitOut(dataQuery);
                    $(".js-submit").on("click", function () {
                        dataQuery.repairerId = $('.modal-body').find(".checked").attr("data-userId");
                        dataQuery.repairName = $('.modal-body').find(".checked").attr("data-userName");
                        pageView.commonAjax("distribution", dataQuery);
                    })
                } else if (target.is('a') && target.hasClass('repair_revoke')) {
                    e.stopPropagation();
                    confirm("是否确认撤销", "", "alert_warn", function (type) {
                        if (type == "dismiss") {
                            console.log("取消成功！");
                        } else if (type == "confirm") {
                            pageView.revoke(dataQuery);
                        }
                    });
                } else if (target.is('a') && target.hasClass('repair_feedback')) {
                    e.stopPropagation();
                    formPost(merchantWeb_Path + "repair/feedback", dataQuery);
                    pageView.loadingHide();
                } else if (target.is('a') && target.hasClass('repair_confirm')) {
                    e.stopPropagation();
                    $("#confirmModal").modal("show");
                    $(".confirm_submit").onclick = "";
                    $(".confirm_submit").on("click", function (e) {
                        var confirmationResult =  $("#confirmModal").find(".checked").attr("data-value");
                        var confirmationRemark =  $("#confirmation_remark").val();
                        dataQuery.confirmationResult = confirmationResult;
                        dataQuery.confirmationRemark = confirmationRemark;
                        pageView.commonAjax("confirm", dataQuery);
                        $('#confirmModal').find('.meetBtn button').eq(0).addClass('checked').siblings().removeClass('checked')
                        $('#confirmation_remark').val('');
                    });

                } else if (target.is('a') && target.hasClass('repair_evaluate')) {
                    e.stopPropagation();
                    $("#evaluateModal").modal("show");
                    $(".confirm_submit").onclick = "";
                    $(".evaluate_submit").on("click", function (e) {
                        var respond = $("#evaluateModal ul #respond").find(".checked").length;
                        var quality = $("#evaluateModal ul #quality").find(".checked").length;
                        var attitude = $("#evaluateModal ul #attitude").find(".checked").length;
                        var evaluateRemark = $("#evaluate_remark").val();
                        dataQuery.respond = respond;
                        dataQuery.quality = quality;
                        dataQuery.attitude = attitude;
                        dataQuery.remark = evaluateRemark;
                        pageView.commonAjax("evaluate", dataQuery);
                    });
                }
            }
        )

        $("#confirmModal .meetBtn button").on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#confirmModal .meetBtn button").removeClass("checked");
            $(this).addClass("checked");
        });

        $("#evaluateModal .rateStar .star").on("click", function () {
            $(this).addClass("checked");
            $(this).prevAll(".star").addClass("checked");
            $(this).nextAll(".star").removeClass("checked");
        });

    }
//加载开始
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

//ajax
    pageView.commonAjax = function (url, dataQuery) {
        $.ajax({
            cache: false,
            type: "post",
            url: merchantWeb_Path+"repair/" + url,
            data: dataQuery,
            dataType: "JSON",
            async: false,
            error: function (request) {
                alert("系统异常");
                pageView.loadingHide();
            },
            success: function (data) {
                if (data == 0) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                } else if (data == 1) {
                    alert("参数异常");
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                } else if (data == 2) {
                    alert("后台异常");
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                }
            }
        });

    }


//加载完成
    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

//获取申请列表数据
    pageView.getList = function () {
        pageView.generalQueryBtn(true, 1);
    }

//分页查询
    pageView.generalQueryBtn = function generalQueryBtn(flag, page) {
        if (flag) {
            pageView.loadingShow();
        }
        //获取查询条件 一次提交表单
        var fm = document.getElementById("repair-apply-condition");
        var formData = new FormData(fm);
        var url = "queryRepairList";
        if (page != undefined && page != null && page != "") {
            formData.append("page", page);
        }
        $.ajax({
            cache: false,
            type: "post",
            url: url,
            contentType: false,
            processData: false,
            data: formData,
            dataType: "html",
            async: false,
            error: function (request) {
                alert("系统异常");
                pageView.loadingHide();
            },
            success: function (data) {
                $(".zl-body-list").html("");
                $(".zl-body-list").append(data);
                //分页=====================================>>>>
                $('#btn-pre-bottom').on('click', function () {
                    if (!$(this).hasClass('zl-btn-disable')) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) - 1);
                        pageView.generalQueryBtn(true, (parseInt($('.page-index').html()) - 1));
                    }
                });
                $('#btn-next-bottom').on('click', function () {
                    if (!$(this).hasClass('zl-btn-disable')) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) + 1);
                        pageView.generalQueryBtn(true, (parseInt($('.page-index').html()) + 1));
                    }
                });
                $('#gotoPage').on('click', function () {
                    var value = parseInt($(this).parent().find('.zl-page-num-input').val());
                    if (pageView.verifyPagination(value, parseInt($('.page-all').html()))) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + value;
                        pageView.generalQueryBtn(true, value);
                    } else {
                        $(".zl-page-num-input").val($('.page-all').html());
                    }
                });
                $(".zl-page-num-input").bind("keypress", function (event) {
                    if (event.keyCode == "13") {
                        $('#gotoPage').click();
                    }
                });
                //分页<<<<=====================================
                if (flag) {
                    pageView.loadingHide();
                }
                pageView.initTable();
            }
        });
    }

//提交表单
    pageView.exportBtn = function exportBtn() {
        var startT = $("#startDate").val();
        var endT = $("#endDate").val();
        if (pageView.verifyQueryDate(startT, endT)) {
            //获取查询条件 一次提交表单
            $("#repair-apply-condition").submit();

        }
    }

//验证页数
    pageView.verifyPagination = function verifyPagination(value, total) {
        if (total === 0) return true;
        if (!pageView.isNumberss(value)) {
            alert('请输入正确的页码');
            return false;
        }
        if (value > total) {
            alert('超过总页数,请重新输入 ');
            return false;
        }
        return true;
    }

//绑定提交按钮
    pageView.bindingSubmit = function () {
        $("#submit").on("click", pageView.eventInit);
    }

//分配提交
    pageView.distribution = function (dataQuery) {

        var userSel = $('#userSelectModal').find('.checked');
        dataQuery.repairerId = userSel.attr('data-userid');
        dataQuery.repairName = userSel.find('.checked').next().text();
        console.log(dataQuery);
        $.ajax({
            cache: false,
            type: "post",
            url: merchantWeb_Path+"repair/distribution",
            data: dataQuery,
            dataType: "JSON",
            async: false,
            error: function (request) {
                alert("系统异常");
                pageView.loadingHide();
            },
            success: function (data) {
                console.log(data);
                history.go(0);
            }
        });

    }

//数字校验
    pageView.isNumberss = function isNumberss(num) {
        var pat = new RegExp('^[0-9]+$');
        return pat.test(num)
    }

//验证查询时间
    pageView.verifyQueryDate = function verifyQueryDate(start, end) {
        if (start == '' || end == '') {
            return true;
        }
        var startTime = new Date(start);
        var endTime = new Date(end);
        if (startTime.getTime() > endTime.getTime()) {
            alert("查询开始日期不能小于结束日期");
            return false;
        }
        return true;
    }

//弹出层
    pageView.loaunitOut = function (dataQuery) {
        $('#userSelectModal').modal('show');
        $.ajax({
            cache: false,
            type: "post",
            url: merchantWeb_Path+"repair/mechanic",
            data: dataQuery,
            dataType: "JSON",
            async: false,
            error: function (request) {
                alert("系统异常");
                pageView.loadingHide();
            },
            success: function (data) {
                $('#userSelectModal').find('ul li').remove();
                data.map((item, index) => {
                    let li = `<li style="margin-bottom:5px;"><em class="zl-checkbox" style="vertical-align:-2px;" data-userId=${item['userId']} data-userName=${item['userName']}></em><span style="margin-left:15px;">${item['userName']}</span></li>`;
                    $('#userSelectModal').find('ul').append(li);
                });
                pageView.check();
            }
        });

    }

    pageView.check = function () {
        $('#userSelectModal').on('click', function (event) {
            var target = $(event.target);
            if (target.is('em') && target.hasClass('zl-checkbox')) {
                if (target.hasClass('checked')) {
                    target.removeClass('checked');
                } else {
                    target.addClass('checked').parent().siblings().find('em').removeClass('checked');
                }
            }
        })

    }

//隐蔽
    pageView.loaunitIn = function () {
        $('#userSelectModal').modal('hide');
        $('#evaluateModal').modal('hide');
        $('#confirmModal').modal('hide');

    }

//TODO 撤销
    pageView.revoke = function approveBtn(dataQuery) {
        $.ajax({
            cache: false,
            type: "POST",
            url: merchantWeb_Path + "repair/revoke",
            data: dataQuery,
            async: false,
            beforeSend: function () {
                //让提交按钮失效，以实现防止按钮重复点击
                $(this).attr('disabled', 'disabled');
            },
            complete: function () {
                //让提交按钮重新有效
                $(this).removeAttr('disabled');
            },
            error: function () {
                alert("系统异常");
            },
            success: function (msg) {
                if (msg == "0") {
                    alert("参数异常");
                } else if (msg == "1") {
                    var dataQuery = {serviceId: $("#serviceId").val(), mallId: $("#mallId").val()};
                    formPost(merchantWeb_Path + "repair/init", dataQuery);
                } else if (msg == "2") {
                    alert("后台异常");
                } else {
                    alert("流程已被处理，请刷新页面!");
                }
            }
        });
    }

    return pageView;
})
(jQuery);

//页面初始化加载
$(document).ready(function () {
    pageView.getList();
    pageView.loadingHide();
    pageView.init();

});
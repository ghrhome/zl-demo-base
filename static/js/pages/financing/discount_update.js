/**
 * Created by whobird on 2018/4/16.
 */

var pageView=(function($){
    var pageView={};

    pageView.eventInit=function(){
        var container = $("#discount-update");

        //初始化下拉
        container.find(".zl-dropdown-inline").ysdropdown({

        });

        //提交
        container.on("click", ".submit-btn", function() {
            pageView.save(true);
        });

        $(".save-btn").on("click",function(e){
            pageView.save(false);
        });
        pageView.save = function (commit_k2) {
            if (!checkForm($('form'))) {
                return false;
            }
            pageView.loadingShow();
            $.ajax({
                type: "POST",
                url: financeWeb_Path + "finance/reduce/save.htm",
                data:$("form").serialize(),
                dataType: 'json',
                error: function () {
                    pageView.loadingHide();
                    alert("系统异常");
                }, success: function (response) {
                    pageView.loadingHide();
                    if(response.code == 0){
                        if (commit_k2) {
                            pageView.commitK2();
                        } else {
                            alert("保存成功","","",function(){
                                window.location = financeWeb_Path + "finance/reduce/index.htm" ;
                            })
                        }
                    }else{
                        alert(response.msg);
                    }
                }
            });
        }

        pageView.commitK2 = function () {
            var areaCode =$("#areaCode").val();
            var reductionId =$("#reductionId").val()
            $app.workflow.submit("inamp-feewaiver-"+areaCode, reductionId).then(function ($response) {
                window.open($response.data.data);
                //update(reductionId);
                window.location = financeWeb_Path + "finance/reduce/index.htm" ;
            })
        }

        pageView.loadingShow=function(){
            $(".zl-loading").fadeIn();
        };

        pageView.loadingHide=function(){
            $(".zl-loading").fadeOut();
        }
    }

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.eventInit();

    };
    return pageView;

})(jQuery);

var selectModalView = (function ($) {
    var selectModalView = {};
    var _selectedAccounts = {}
    var _selectAccountList = {}

    // 将添加新的tr
    var inds = -1;

    /*var page = $("#expense-verification-add");
    // 载入模板内容
    page._renderList = function (list, id) {
        var _tmp = $("#" + id).html();
        var template = Handlebars.compile(_tmp);
        var context = {dataList: list}
        return template(context)
    }*/

    selectModalView.eventInit = function (inds) {

        $("#add-rece").on("click", function (e) {
            var contNo = $('#contractNo').val();
            if(contNo == ""){
                alert("合同编号为空")
                return;
            }
            var isSelect = 'selected';
            pageView.loadingShow();
            $.getJSON(financeWeb_Path + 'finance/reduce/recelist.htm', {contNo: contNo,isSelect: isSelect}, function (res) {
                var data = res.detailList;
                console.log('all-----------');
                console.log(data);
                selectAccountList.update({accountPeriodList: data}, "multi");
                pageView.loadingHide();
                //todo:
                _selectedAccounts={};
                selectAccountList.modalShow(
                    function (selectedAccounts) {
                        console.log('--------selectedAccounts');
                        console.log(selectedAccounts);
                        _selectedAccounts = selectedAccounts;
                        // 将删除的tr移除
                        $("#zl-section-collapse-table-2").find("tr").each(function () {
                            var data_id = $(this).attr("data-fincontid");
                            if (data_id != undefined && _selectedAccounts[data_id] == undefined) {
                                $(this).remove();
                                // $('.table-rece-left').children('tbody').find('.trData').remove();
                                // inds --;
                            }
                        });
                        $('.table-rece-left').children('tbody').html("");
                        for (var key in _selectedAccounts) {
                            // console.log(key);
                            var tr = $("#zl-section-collapse-table-2").find("tr[data-fincontid=" + key + "]");
                            if (tr.length == 0) {
                                inds = inds + 1;
                                var map = {
                                    key: _selectedAccounts[key]
                                };
                                /*var html = page._renderList(map, "template-select-Clause");
                                $("#zl-section-collapse-table-4").find(".zl-table tbody").append(html);*/
                                var receAmount = Number(_selectedAccounts[key].receAmount);
                                var canReductionAmount = Number(_selectedAccounts[key].canReductionAmount);
                                var receNo = _selectedAccounts[key].receNo;
                                var receLeftTr = "<tr class='trData' data-fincontid='" + _selectedAccounts[key].receId + "'>"
                                    + "<td class='zl-edit' title='" + receNo + "'>"
                                    + "<input type='hidden' name='detailList[" + inds + "].receId'   value='"+ _selectedAccounts[key].receId + "'>"
                                    + "<input type='text' name='detailList[" + inds + "].receNo'   value='" + _selectedAccounts[key].receNo + "' readonly>"
                                    + "</td>"
                                    + "<td class='zl-edit' title='" + _selectedAccounts[key].feeType + "'>"
                                    + "<input type='hidden' name='detailList[" + inds + "].feeType'   value='"+ _selectedAccounts[key].feeType +"'>"
                                    + "<input type='text'  value='"+ _selectedAccounts[key].feeTypeName +"' readonly>"
                                    + "</td>"
                                    +"<td class='zl-edit' title='" + fmtDate(Number(_selectedAccounts[key].receDate)) + "'>"
                                    +"<input type='text' name='detailList[" + inds + "].receDate'   value='" + fmtDate(Number(_selectedAccounts[key].receDate)) + "' readonly>"
                                    +"</td>"
                                    + "<td class='zl-edit' title='" + _selectedAccounts[key].financePeriod + "'>"
                                    + "<input type='text' name='detailList[" + inds + "].financePeriod'   value='" + _selectedAccounts[key].financePeriod + "' readonly>"
                                    + "</td>"
                                    + "<td class='text-right zl-edit required'>"
                                    + "<div class='btn-group zl-dropdown-inline'>"
                                    + "<input name='detailList[" + inds + "].reductionType' type='hidden'>"
                                    + "<button type='button' class='btn btn-default dropdown-toggle zl-btn zl-dropdown-btn' data-toggle='dropdown' aria-expanded='false'>"
                                    + "选择类型"
                                    + "</button>"
                                    + "<ul class='dropdown-menu'>"
                                    + "<li><a data-value='' style='display:none'></a></li>"
                                    + "<li><a data-value='1002' onclick='test(this)'>减免</a></li>"
                                    + "<li><a data-value='1001' onclick='test(this)'>坏账</a></li>"
                                    + "</ul>"
                                    + "</div>"
                                    + "</td>"
                                    +"<td class='zl-edit receAmount' title='" + receAmount + "'>"
                                    +"<input class='text-right' type='text' name='detailList[" + inds + "].receAmount' value='" + receAmount + "' readonly>"
                                    +"</td>"
                                    +"<td class='zl-edit canReductionAmount'>"
                                    +"<input class='text-right' type='text' maxlength='20'name='detailList[" + inds + "].canReductionAmount' class='text-right' value='"+ canReductionAmount +"' readonly>"
                                    +"</td>"
                                    +"<td class='zl-edit reductionAmount required'>"
                                    +"<input class='text-right' type='text' maxlength='20'name='detailList[" + inds + "].reductionAmount' class='text-right' value='' readonly>"
                                    +"</td>"
                                    +"<td class='text-right zl-edit'>"
                                    +"<input type='text' maxlength='20'name='detailList[" + inds + "].reductionReason' id='reductionReason' class='text-right' value=''>"
                                    +"</td>"
                                    +"</tr>";
                                $('.table-rece-left').children('tbody').append(receLeftTr);
                                $("#discount-update").find(".zl-dropdown-inline").ysdropdown("init");
                            }
                        }
                        inds = -1 ;
                    }, _selectedAccounts)
            });
        });

    }

    selectModalView.compareValueInit=function() {

        $("#zl-section-collapse-table-2").on("change", ".reductionAmount input", function (e) {
            $this = $(this);
            // var _mod = $this.closest("tr").find(".js-settlement-type").val();
            // if (_mod == 1) {
            var _curVal = parseFloat($this.val());
            var targetVal = parseFloat($this.closest("tr").find(".canReductionAmount input").val());
            console.log(targetVal);
            console.log(_curVal);
            if (_curVal > targetVal) {
                alert("减免金额不能大于可减免金额", "", "", function () {
                    $this.focus();
                    $this.val('0.00');
                })
            }
            // }

        })
    }
    selectModalView.init = function () {
        selectModalView.eventInit(inds);
        selectModalView.compareValueInit();
    };

    return selectModalView;
})(jQuery);


$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
    selectModalView.init();
    selectAccountList.init({accountPeriodList: [{}]}, "multi");
});

function fmtDate(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}

function checkForm (form) {
    var f = true;
    form.find('td:visible.required').each(function () {
        var title = $(this).attr("title") || "必填项";
        var val = $(this).find("input:eq(0)").val();
        var reg = /^\d+(\.\d+)?$/;
        if ($.trim(val) == "") {
            f = false;
            alert(title + "不能为空");
            return f;
        }
        if ($(this).find("input[name$=reductionAmount]").length > 0) {
            if (!reg.test(val)) {
                f = false;
                $(this).find("input[name$=reductionAmount]").focus();
                alert("减免金额格式错误");
                return f;
            }
        }
    });
    if (!f) return;
    var trs = $("#zl-section-collapse-table-2 tbody tr").length;
    if (trs < 1) {
        alert("请填写减免单明细");
        return false;
    }
    return f;
}

//检查非负浮点数
function checkNum(num){
    var patt=/^\d+(\.\d+)?$/g;
    return patt.test(num);
}

function update(reductionId){
    $.ajax({
        type: "POST",
        url: financeWeb_Path + "finance/reduce/submit.htm?reductionId=" + reductionId ,
        dataType: 'json',
        error: function (request) {
            alert("系统异常");
        }, success: function (response) {
            if(response.code == 0){
                //alert("保存成功","","",function(){
                    // loading();
                    location.href = financeWeb_Path + "finance/reduce/index.htm" ;
                //})
            }else{
                alert(response.msg);
            }
        }
    });
}

function submit(reductionId){
    $.ajax({
        type: "POST",
        url: financeWeb_Path + "finance/reduce/modify.htm?masterId=" + reductionId +"&billStatus=1001" ,
        dataType: 'json',
        error: function (request) {
            alert("系统异常");
        }, success: function (response) {
            alert(response.msg);
            // if(response.code == 0){
            //     alert("提交成功","","",function(){
            //         // loading();
            //         location.href = financeWeb_Path + "finance/reduce/index.htm" ;
            //     })
            // }else{
            //     alert(response.msg);
            // }
        }
    });
}

function test(_this) {
    $(_this).closest("td").nextAll(".reductionAmount").find("input").attr("readonly",false);
    var receAmount = $(_this).closest("td").nextAll(".receAmount").find("input").val();
    if($(_this).data("value")==1001){
        $(_this).closest("td").nextAll(".reductionAmount").find("input").attr("readonly",true);
        $(_this).closest("td").nextAll(".reductionAmount").find("input").val(receAmount);
    }
    if($(_this).data("value")==1002){
        // $(_this).closest("td").nextAll(".reductionAmount").find("input").attr("readonly",true);
        $(_this).closest("td").nextAll(".reductionAmount").find("input").val('0.00');
    }

}
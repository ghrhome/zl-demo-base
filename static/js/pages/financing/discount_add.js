/**
 * Created by whobird on 2018/4/16.
 */
var _contNo='';
var reg = /^\d+(\.\d+)?$/;
var pageView=(function($){
    var pageView={};
    var _mallId = '';
    var dropDownList={};

    pageView.search=function () {
        $("#js-dropdown-companys").ysSearchSelect({
            source:function( request, response ) {
                $.ajax( {
                    url: financeWeb_Path + "feeReceivable/getAllCompanyByMallId.htm",
                    dataType: "json",
                    data: {
                        mallId: _mallId ,
                        companyName:request.term
                    },
                    success: function( data ) {
                        // if (data.length === 0) {
                        //     alert('此项目下无合同租户,请先添加合同或者选择别的项目');
                        //     return;
                        // }
                        response( $.map( data, function( item ) {
                            return {
                                label: item.companyName,
                                value: item.companyName,
                                id:item.companyId
                            }
                        }));
                    }
                } );
            },
            callback:function(value,ui){
                $("#companyId").val(ui.item.id);
                $('#companyName').val(ui.item.label);
                //pageView.searchUpdate();
                _searchCb(ui.item.id);
            },
        });
    }

    function _searchCb(companyId) {
        $.getJSON(financeWeb_Path + "finance/reduce/selectContByCompanyId.htm", {companyId: companyId}, function (res) {
            $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').children('button').html('');
            $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').children('input').val('');
            $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('li').remove();
            $("#brandName").val('');
            $("#storeNos").val('');
            // $("#layoutName").val('');
            $('.table-rece-left').children('tbody').html("");
            _contNo='';
            // debugger;
            console.log(res)
            // if (res.length == 0) {
            //     alert('此租户下没合同,请先添加合同或者选择别的租户');
            //     return;
            // }
            dropDownList=res.data;
            $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find(' .dropdown-menu').children('li').remove();
            $.each(res.data,function(i,value){
                $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find(' .dropdown-menu').append("<li><a data-value='" + value.contNo + "' href='javascript:void(0)' >" + value.contNo + "</a></li>");
            })
        });
    }
    pageView.eventInit=function(){
        var container = $("#discount-add");

        container.find(".zl-datetimepicker input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
            clearBtn:true,
        });

        container.on("click",".zl-datetimepicker",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).find("input").datetimepicker("show");
        });
        //初始化下拉
        container.find(".zl-dropdown-inline").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "js-dropdown-projects") {
                    _mallId = val;
                    // $('#js-dropdown-companys').children('input').attr("readonly",false);
                    pageView.search();
                }
                if ($elem.data("id") == "js-dropdown-conts") {
                    var cont = {};
                    $.each(dropDownList, function(i, obj){
                        if (obj.contNo == val) {
                            cont = obj;
                        }
                    });
                    _contNo = cont.contNo;
                    $("#brandName").val(cont.brandName);
                    $("#brandName").attr('title', cont.brandName);
                    $("#brandId").val(cont.brandId);
                    $("#storeIds").val(cont.storeIds);
                    $("#storeNos").val(cont.storeNos);
                    // $("#layout").val(dropDownList[val].layoutCode);
                    // alert([dropDownList[val].layout]);
                    // $("#layoutName").val(JSON.parse(layoutMap)[dropDownList[val].layoutCode]);
                    // $elem.closest('td').next("td").find("button").html("");
                    // $elem.closest('td').next("td").find(".dropdown-menu").html("");
                    // $elem.closest('td').next("td").next("td").find("input").val("");
                    $("#zl-section-collapse-table-2 tbody").html("");
                }
            }
        });
        container.on("click", ".submit-btn", function() {
            pageView.save(true);
        });
        $(".reduce-save-btn").on("click",function(e){
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
                        $("input[name=id]").val(response.data.id);
                        $("input[name=areaCode]").val(response.data.areaCode);
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
            var areaCode = $("input[name=areaCode]").val();
            var reductionId = $("input[name=id]").val();
            $app.workflow.submit("inamp-feewaiver-"+areaCode, reductionId).then(function ($response) {
                window.open($response.data.data);
                window.location = financeWeb_Path + "finance/reduce/index.htm" ;
                //pageView.update(reductionId);
            })
        }
        pageView.loadingShow=function(){
            $(".zl-loading").fadeIn();
        };

        pageView.loadingHide=function(){
            $(".zl-loading").fadeOut();
        }
        pageView.update = function (reductionId) {
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
    var inds = -1;

    /*var page = $("#expense-verification-add");
    // 载入模板内容
    page._renderList = function (list, id) {
        var _tmp = $("#" + id).html();
        var template = Handlebars.compile(_tmp);
        var context = {dataList: list}
        return template(context)
    }*/

    selectModalView.eventInit = function () {
        $("#add-rece").on("click", function (e) {
            var contNo =  _contNo;
            if(contNo == ""){
                alert("合同编号为空")
                return;
            }
            var isSelect = 'selected';
            pageView.loadingShow();
            $.getJSON(financeWeb_Path + 'finance/reduce/recelist.htm', {contNo: contNo,isSelect: isSelect}, function (res) {
                var data = res.detailList;
                console.log('all-----------');
                if(data.length ==0){
                    alert("无应收数据")
                    pageView.loadingHide();
                    return
                }
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
                            if (data_id != undefined && selectedAccounts[data_id] == undefined) {
                                $(this).remove();
                            }
                        });
                        // 将添加新的tr
                        // var inds = Number($(".inds").val());

                        $('.table-rece-left').children('tbody').html("");
                        for (var key in _selectedAccounts) {
                            inds = inds + 1;
                            console.log(key);
                            var tr = $("#zl-section-collapse-table-2").find("tr[data-fincontid=" + key + "]");
                            if (tr.length == 0) {
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
                                    +"<td class='text-right zl-edit' title='" + fmtDate(Number(_selectedAccounts[key].receDate)) + "'>"
                                    +"<input type='text' name='detailList[" + inds + "].receDate'   value='" + fmtDate(Number(_selectedAccounts[key].receDate)) + "' readonly>"
                                    +"</td>"
                                    + "<td class='zl-edit' title='" + _selectedAccounts[key].financePeriod + "'>"
                                    + "<input type='text' name='detailList[" + inds + "].financePeriod'   value='" + _selectedAccounts[key].financePeriod + "' readonly>"
                                    + "</td>"
                                    + "<td class='text-right zl-edit required' title='减免类型'>"
                                    + "<div class='btn-group zl-dropdown-inline'>"
                                    + "<input name='detailList[" + inds + "].reductionType' type='hidden'>"
                                    + "<button type='button' class='btn btn-default dropdown-toggle zl-btn zl-dropdown-btn' data-toggle='dropdown' aria-expanded='false'>"
                                    + "选择类型"
                                    + "</button>"
                                    + "<ul class='dropdown-menu'>"
                                    + "<li><a data-value='' style='display:none'></a></li>"
                                    + "<li><a data-value='1002'onclick='test(this)'>减免</a></li>"
                                    + "<li><a data-value='1001'onclick='test(this)'>坏账</a></li>"
                                    + "</ul>"
                                    + "</div>"
                                    + "</td>"
                                    +"<td class='text-right zl-edit receAmount' title='" + receAmount + "'>"
                                    +"<input type='text' name='detailList[" + inds + "].receAmount' class='text-right' value='" + receAmount + "' readonly>"
                                    +"</td>"
                                    +"<td class='text-right zl-edit canReductionAmount' title='" + canReductionAmount + "'>"
                                    +"<input type='text' name='detailList[" + inds + "].canReductionAmount' class='text-right' value='" + canReductionAmount + "' readonly>"
                                    +"</td>"
                                    +"<td class='text-right zl-edit reductionAmount required' title='减免金额'>"
                                    +"<input type='text' maxlength='20' name='detailList[" + inds + "].reductionAmount' class='text-right' value='' readonly>"
                                    +"</td>"
                                    // +"<td class='text-right zl-edit receContNo' title='" + receContNo + "'>"
                                    // +"<input type='text' name='detailList[" + inds + "].receContNo'  value='" + receContNo + "' readonly>"
                                    // +"</td>"
                                    +"<td class='text-right zl-edit'>"
                                    +"<input type='text' maxlength='20' name='detailList[" + inds + "].reductionReason' id='reductionReason' class='text-right' value=''>"
                                    +"</td>"
                                    +"</tr>";
                                $('.table-rece-left').children('tbody').append(receLeftTr);
                                $("#discount-add").find(".zl-dropdown-inline").ysdropdown("init");
                            }
                        }
                        // $(".inds").val(inds);
                        inds = -1 ;
                        // pageView.init();
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

function checkForm (from) {
    var f = true;

    from.find('td:visible.required').each(function () {
        var title = $(this).attr("title") || "必填项";
        var val = $(this).find("input:eq(0)").val();
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

//特殊字符校验 存在特殊字符返回true
function regeMatch(strs){
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:]");
    if(strs != "" && strs != null){
        if(pattern.test(strs)){
            //alert("非法字符！");
            return true;
        }else{
            return false;
        }
    }
}

function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}

function isPositiveNum(s) {//是否为正整数
    var re = /^[0-9]*[0-9][0-9]*$/;
    return re.test(s)
}

//检查非负浮点数
function checkNum(num){
    var patt=/^\d+(\.\d+)?$/g;
    return patt.test(num);
}

function clearMall() {
    $('#js-dropdown-companys').children('button').html('');
    $('#js-dropdown-companys').children('input').val('');
    $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').children('button').html('');
    $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').children('input').val('');
    $('div.zl-dropdown-inline[data-id=js-dropdown-conts]').find('li').remove();
    $('.table-rece-left').children('tbody').html("");
    _contNo='';
    $("#brandName").val("");
    $("#storeNos").val("");
    // }
}



function test(_this) {
    $(_this).closest("td").nextAll(".reductionAmount").find("input").attr("readonly",false);
    var canReductionAmount = $(_this).closest("td").nextAll(".canReductionAmount").find("input").val();
    if($(_this).data("value")==1001){
        $(_this).closest("td").nextAll(".reductionAmount").find("input").attr("readonly",true);
        $(_this).closest("td").nextAll(".reductionAmount").find("input").val(canReductionAmount);
    }
    if($(_this).data("value")==1002){
        // $(_this).closest("td").nextAll(".reductionAmount").find("input").attr("readonly",true);
        $(_this).closest("td").nextAll(".reductionAmount").find("input").val('0.00');
    }

}
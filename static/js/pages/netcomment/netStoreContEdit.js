/*----------------业态模态框----------------------*/
var selectModalView = (function ($) {

    var selectModalView = {};

    var _selectedForms = {};

    selectModalView.eventInit = function () {
        $("input[name=layoutName]").on("click", function (e) {
            var _self=this;
            e.stopPropagation();
            e.preventDefault();
            selectForm.modalShow(function (selectedForms) {
                if(selectedForms){
                    $(_self).val(selectedForms.nodeName);
                    $('input[name=issuingLayout]').val(selectedForms.nodeId);
                    $('input[name=layoutCode]').val(selectedForms.nodeValue);
                }
            }, _selectedForms);
        });
    };

    selectModalView.init = function () {
        $.getJSON(netcommentWeb_Path + 'netcomment/netStoreCont/layout.htm', function (data) {
            data={'formList':data};
            selectForm.init(data, "single");
        });
        selectModalView.eventInit();
    };

    return selectModalView;
})(jQuery);
/*----------------业态模态框----------------------*/

function isNumber(n) {
    return !isNaN(n) && isFinite(n);
}

(function ($) {
    selectModalView.init();
    confirmAlert.init();
    $(".zl-dropdown-inline").ysdropdown({
        callback:function(val,$elem){
            //console.log("===================");
            console.log(val);
            console.log($elem);
        }
    });

    $("input[name=propertySquare]").change("input", function (e) {
        $("input[name=obtainAreaRatio]").trigger('change');
    });

    $("input[name=obtainAreaRatio]").change("input", function (e) {
        var obtainAreaRatio =parseFloat($("input[name=obtainAreaRatio]").val());
        var propertySquare=$("input[name=propertySquare]").val();
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test($(this).val())){
            return false;
        }
        if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
            return false;
        }
        var structureSquare = $('input[name=structureSquare]');
        structureSquare.val((parseFloat(propertySquare)/(parseFloat(obtainAreaRatio)/100.00)).toFixed(2));
    });
    $("#preloader").fadeOut("fast");
    var page = $("#store-detail");
    $(document).keydown(function (e) {
        if(e.keyCode===13) $('#addStoreBtn').trigger('click');
    });

    $('#addStoreBtn').on('click', function (e) {
        var $form = $('#addForm');
        pageCommon.ajaxSelect("saveBill.htm", $form.serialize(), function (data) {
            // alert(data.message, "", "", function (e) {
            //     self.location.href = "index.htm"
            // })
            if (data.code == 200) {
                $("#netcommentId").val(data.data.netcommentId);
                location.href = netcommentWeb_Path + "/netcomment/netStoreCont/index.htm";
            } else {
                alert(data.message);
            }
        });
    });

    $("#submitNetComment").on("click", function (e) {
        var $form = $('#addForm');

        if(!pageCommon.validateForm()){
            return;
        }
        if(!verify($form)){
            return;
        }
        pageCommon.ajaxSelect("saveBill.htm", $form.serialize(), function (data) {
            if (data.code == 200) {
                $("#netcommentId").val(data.data.netcommentId);
            }
            pageCommon.initMallCode();
            var areaCode = $("#areaCode").val();
            pageCommon.submitNetComment("inamp-storemodification-" + areaCode, data.data.netcommentId, "index.htm");
        });
    })

    var tips={
        areaId:'请选择所属城市公司',
        mallId:'请选择所属项目',
        blockId:'请选择所属楼栋',
        floorId:'请选择所属楼层',
        storeNo:'请输入铺位号',
        originalStoreNo:'请输入铺位名称',
        storeType:'请选择商铺类型',
        earningType:'请选择收入类型',
        issuingLayout:'请选择规划业态',
        propertySquare:'请输入实用面积',
        obtainAreaRatio:'请输入得房率',
        storeCode:'请输入商铺编码'
    };

    function verify($form) {
        var allInput = $form.find('input').not('input[name=structureSquare],input[name=storeCode],input[name=layoutName],' +
            'input[name=storePosition]');
        // for (var i = 0; i < allInput.length; i++) {
        //     var item = $(allInput[i]);
        //     if (!item.val().trim()) {
        //         alert(tips[item.attr('name')]);
        //         item.focus();
        //         return false;
        //     }
        // }
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test($form.find('input[name=propertySquare]').val())){
            alert('请输入正确的实用面积');
            return false;
        }
        var obtainAreaRatio=parseInt($form.find('input[name=obtainAreaRatio]').val());
        if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
            alert('得房率请输入1-100的整数');
            return false;
        }
        return true;
    }
    selectAutoComplete();

    function selectAutoComplete() {
        $(".zl-dropdown-search-select").ysSearchSelect({
            source: function (request, response) {
                $.ajax({
                    url: netcommentWeb_Path + "/netcomment/netStoreCont/getApproved.htm",
                    type: "POST",
                    dataType: "json",
                    data: {
                        storeCode: request.term,
                    },
                    success: function (data) {
                        response($.map(data.data, function (item) {
                            return {
                                label: item.storeCode,
                                value: item.storeCode,
                                data: item
                            }
                        }));
                    }
                });
            },
            callback: function (value, ui) {
                this.value = ui.item.label;
                // ui.item.data['contFailDesc'] = cancelReason[ui.item.data.equityType];
                for (var key in ui.item.data) {
                    $("#" + key).val(ui.item.data[key]);
                }
            },
        });
    }

})(jQuery);

function queryMall(_this) {
    //console.log("城市公司选框");
    var areaId = $(_this).attr("data-value");
    //清空项目名称 $(_this).closest("div.zl-collapse-content").find("ul.mall-grop")
    $(_this).closest("table.zl-table").find("div.mall-dropdown").find("ul").empty();
    $(_this).closest("table.zl-table").find("div.mall-dropdown").find("button").html("请选择");
    $.getJSON(netcommentWeb_Path + "netcomment/netStoreCont/getMallListByAreaId.htm", {"areaId": areaId}, function (res) {
        var isMallId=true;
        //console.log(res);
        $.each(res, function (key,value) {
            isMallId=false;
            $(_this).closest("table.zl-table").find("div.mall-dropdown").find("ul").append("<li><a key='"+key+"' data-value='"+key+"' class='but-val' onclick='queryBlock(this)'  href='javascript:void(0)' >"+value+"</a></li>");
        });
        if(isMallId){
            alert("未找到项目！");
        }
    });
}

function queryBlock(_this) {
    var mallId = $(_this).attr("data-value");
    //清空楼栋
    $(_this).closest("table.zl-table").find("div.block-dropdown").find("ul").empty();
    $(_this).closest("table.zl-table").find("div.block-dropdown").find("button").html("请选择");
    $.getJSON(netcommentWeb_Path + "netcomment/netStoreCont/blockList.htm", {"mallId": mallId}, function (res) {
        var isBlockId=true;
        //console.log(res);
        $.each(res, function (index,element) {
            isBlockId=false;
            $(_this).closest("table.zl-table").find("div.block-dropdown").find("ul").append("<li><a data-value='"+element.id+"' class='but-val' onclick='queryFloor(this)' href='javascript:void(0)' >"+element.blockName+"</a></li>");
        });
        if(isBlockId){
            alert("未找到楼栋！");
        }
    });
}

function queryFloor(_this) {
    var blockId = $(_this).attr("data-value");
    //清空楼层
    $(_this).closest("table.zl-table").find("div.floor-dropdown").find("ul").empty();
    $(_this).closest("table.zl-table").find("div.floor-dropdown").find("button").html("请选择");
    $.getJSON(netcommentWeb_Path + "/netcomment/netStoreCont/floorList.htm", {"blockId": blockId}, function (res) {
        var isFloorId=true;
        //console.log(res);
        $.each(res, function (index,element) {
            isFloorId=false;
            $(_this).closest("table.zl-table").find("div.floor-dropdown").find("ul").append("<li><a data-value='"+element.id+"' class='but-val'  href='javascript:void(0)' >"+element.floorName+"</a></li>");
        });
        if(isFloorId){
            alert("未找到楼层！");
        }
    });
}

//数字验证
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}

//得房率判断
function clearNoNumObtainAreaRatio(obj) {
    /*obj.value = obj.value.replace(/[^\d]/g,""); //清除"数字"以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是*/
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    if(0==obj.value||obj.value>100)obj.value="";
};
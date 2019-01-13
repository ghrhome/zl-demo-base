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
        $.getJSON(enrolmentWeb_Path + '/store/layout.htm', function (data) {
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

// function queryMall(_this) {
//     var $mall = $('#mall-container');
//     $mall.find('.dropdown-menu').empty();
//     $mall.find('button').html('请选择');
//     $mall.find('input').val('');
//
//     var $block = $('#block-container');
//     $block.find('.dropdown-menu').empty();
//     $block.find('button').html('请选择');
//     $block.find('input').val('');
//
//     var $floor = $('#floor-container');
//     $floor.find('.dropdown-menu').empty();
//     $floor.find('button').html('请选择');
//     $floor.find('input').val('');
//
//
//     $.getJSON(enrolmentWeb_Path+'/mall/list.htm',{areaId:$(_this).children('a').data('id')},function (res) {
//         if (res.length === 0) {
//             alert('此所属城市公司下没项目,请先添加或者重新选择');
//             return;
//         }
//         $.each(res,function (index,element) {
//             $('#mall-container').find(' .dropdown-menu').append("<li onclick='queryBlock(this)'>" +
//                 "<a data-id='" +element.id + "' href='javascript:void(0)'>" + element.shortName + "</a></li>");
//         });
//     });
// }
// function queryBlock(_this) {
//     var $block = $('#block-container');
//     $block.find('.dropdown-menu').empty();
//     $block.find('button').html('请选择');
//     $block.find('input').val('');
//
//     var $floor = $('#floor-container');
//     $floor.find('.dropdown-menu').empty();
//     $floor.find('button').html('请选择');
//     $floor.find('input').val('');
//
//     $.getJSON(enrolmentWeb_Path + '/block/list.htm', {mallId: $(_this).children('a').data('id')}, function (res) {
//         if (res.length === 0) {
//             alert('此项目下没楼栋,请先添加楼栋或者选择别的项目');
//             return;
//         }
//         $.each(res,function (index,element) {
//             $('#block-container').find(' .dropdown-menu').append("<li onclick='queryFloor(this)'>" +
//                 "<a data-id='" +element.id + "' href='javascript:void(0)'>" + element.blockName + "</a></li>");
//         });
//     });
// }
// function queryFloor(_this) {
//     var $floor = $('#floor-container');
//     $floor.find('.dropdown-menu').empty();
//     $floor.find('button').html('请选择');
//     $.getJSON(enrolmentWeb_Path + '/floor/list.htm', {blockId: $(_this).children('a').data('id')}, function (res) {
//         if (res.length === 0) {
//             alert('此楼栋下没楼层,请先添加楼层或者选择别的项目');
//             return;
//         }
//         $.each(res,function (index,element) {
//             $('#floor-container').find(' .dropdown-menu').append("<li><a data-id='" + element.id + "' href='javascript:void(0)'>" + element.floorName + "</a></li>");
//         });
//
//     });
// }
(function ($) {
    selectModalView.init();

    $(".zl-dropdown-inline").ysdropdown({
        callback:function(val,$elem){
            //console.log("===================");
            //console.log(val);
            //console.log($elem);
        }
    });

    $("#preloader").fadeOut("fast");
    var page = $("#store-detail");

    $(document).keydown(function (e) {
        if(e.keyCode===13) $('#addStoreBtn').trigger('click');
    });

    //城市公司下拉
    // $.getJSON(enrolmentWeb_Path+'area/all.htm',function (res) {
    //     $.each(res,function (index, element) {
    //         $('#area-container').find(' .dropdown-menu')
    //             .append("<li onclick='queryMall(this)'>" +
    //                 "<a data-id='" + element.id + "' href='javascript:void(0)'>" + element.areaName + "</a></li>");
    //     });
    // });

    // page.on("click", ".btn-group li", function () {
    //     var child = $(this).children('a'),
    //         btn = $(this).parent('ul').prev('button'),
    //         input = $(this).parent('ul').prevAll('input[type=hidden]');
    //     btn.html(child.html());
    //     input.val(child.data('id'));
    // });

    page.on('blur',"input[name=propertySquare]",function () {
        var obtainAreaRatio =parseFloat(page.find('input[name=obtainAreaRatio]').val());
        var propertySquare=$(this).val();
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test($(this).val())){
            return false;
        }
        if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
            return false;
        }
        var structureSquare = page.find('input[name=structureSquare]');
        structureSquare.val((parseFloat(propertySquare)/(parseFloat(obtainAreaRatio)/100.00)).toFixed(2));
    });

    page.on('blur',"input[name=obtainAreaRatio]",function () {

        var propertySquare = page.find('input[name=propertySquare]').val();
        //var obtainAreaRatio=parseInt($(this).val());
        var obtainAreaRatio=$(this).val();
        //console.log("得房率:"+obtainAreaRatio)
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test(propertySquare)){
            return false;
        }
        if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
            return false;
        }
        var structureSquare = page.find('input[name=structureSquare]');
        structureSquare.val((parseFloat(propertySquare)/(parseFloat(obtainAreaRatio)/100.00)).toFixed(2));
    });


    $('#addStoreBtn').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $form = $('#addForm');
        if (!verify($form)) {
            return false;
        }
        $.post(enrolmentWeb_Path + '/store/add.htm', $form.serialize(), function (res) {
            if (res.code === '0') {
                alert(res.data,'','',function () {
                    location.href = enrolmentWeb_Path + '/store/index.htm';
                });
            } else if (res.code === '1') {
                alert(res.msg);
            } else {
                alert(res.message)
            }
        }, 'json');
    });

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
        for (var i = 0; i < allInput.length; i++) {
            //console.log(allInput[i]);
            var item = $(allInput[i]);
            if (!item.val().trim()) {
                alert(tips[item.attr('name')]);
                item.focus();
                return false;
            }
        }
        /*if(!/^[a-zA-Z_0-9\-]{1,20}$/.test($form.find('input[name=storeNo]').val())){
            alert('请输入正确的铺位号');
            return false;
        }*/
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

})(jQuery);

function queryMall(_this) {
    //console.log("城市公司选框");
    var areaId = $(_this).attr("data-value");


    //清空项目名称 $(_this).closest("div.zl-collapse-content").find("ul.mall-grop")
    $(_this).closest("table.zl-table").find("div.mall-dropdown").find("ul").empty();
    $(_this).closest("table.zl-table").find("div.mall-dropdown").find("button").html("请选择");


    $.getJSON(enrolmentWeb_Path + "common/getMallListByAreaId.htm", {"areaId": areaId}, function (res) {
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

    $.getJSON(enrolmentWeb_Path + "block/list.htm", {"mallId": mallId}, function (res) {
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


    $.getJSON(enrolmentWeb_Path + "floor/list.htm", {"blockId": blockId}, function (res) {
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
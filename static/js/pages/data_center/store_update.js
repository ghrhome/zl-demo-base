/*----------------模态框----------------------*/
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
/*----------------模态框----------------------*/

/*--------------------------------数字验证------------------------------------*/
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数

};
//得房率判断
function clearNoNumObtainAreaRatio(obj) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    if(!obj.value||0==Number(obj.value)||Number(obj.value)>100)obj.value="";
};
/*--------------------------------数字验证------------------------------------*/

/*-------------------------------------下拉框赋值------------------------------------------*/
/*
function queryMall(_this) {
    var $mall = $('#mall-container');
    $mall.find('.dropdown-menu').empty();
    $mall.find('button').html('请选择');
    $mall.find('input').val('');

    var $block = $('#block-container');
    $block.find('.dropdown-menu').empty();
    $block.find('button').html('请选择');
    $block.find('input').val('');

    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
    $floor.find('button').html('请选择');
    $floor.find('input').val('');


    $.getJSON(enrolmentWeb_Path+'/mall/list.htm',{areaId:$(_this).children('a').data('id')},function (res) {
        if (res.length === 0) {
            alert('此所属城市公司下没项目,请先添加或者重新选择');
            return;
        }
        $.each(res,function (index,element) {
            $('#mall-container').find(' .dropdown-menu').append("<li onclick='queryBlock(this)'>" +
                "<a data-id='" +element.id + "' href='javascript:void(0)'>" + element.shortName + "</a></li>");
        });
    });
}
*/

/*function queryBlock(_this) {
    var $block = $('#block-container');
    $block.find('.dropdown-menu').empty();
    $block.find('button').html('请选择');
    $block.find('input').val('');

    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
    $floor.find('button').html('请选择');
    $floor.find('input').val('');

    $.getJSON(enrolmentWeb_Path + '/block/list.htm', {mallId: $(_this).children('a').data('id')}, function (res) {
        if (res.length === 0) {
            alert('此项目下没楼栋,请先添加楼栋或者选择别的项目');
            return;
        }
        $.each(res,function (index,element) {
            $('#block-container').find(' .dropdown-menu').append("<li onclick='queryFloor(this)'>" +
                "<a data-id='" +element.id + "' href='javascript:void(0)'>" + element.blockName + "</a></li>");
        });
    });
}*/
/*function queryFloor(_this) {
    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
    $floor.find('button').html('请选择');
    $.getJSON(enrolmentWeb_Path + '/floor/list.htm', {blockId: $(_this).children('a').data('id')}, function (res) {
        if (res.length === 0) {
            alert('此楼栋下没楼层,请先添加楼层或者选择别的项目');
            return;
        }
        $.each(res,function (index,element) {
            $('#floor-container').find(' .dropdown-menu').append("<li><a data-id='" + element.id + "' href='javascript:void(0)'>" + element.floorName + "</a></li>");
        });

    });
}*/
/*var storeUpdate={
    url:{
        getMallByAreaId:enrolmentWeb_Path+'/mall/list.htm',
        getBlockByMallId:enrolmentWeb_Path + '/block/list.htm',
        getFloorByBlockId:enrolmentWeb_Path + '/floor/list.htm'
    },
    init:function () {
        this.renderSelect(this.url);
    },
    renderSelect:function (url) {
        var $form = $('#updateForm');
        $.getJSON(enrolmentWeb_Path+'area/all.htm',function (res) {
            $.each(res,function (index, element) {
                $('#area-container').find(' .dropdown-menu')
                    .append("<li onclick='queryMall(this)'>" +
                        "<a data-id='" + element.id + "' href='javascript:void(0)'>" + element.areaName + "</a></li>");
            });
        });

        var areaId = $form.find('input[name=areaId]').val();
        if(areaId){
            $.getJSON(url.getMallByAreaId,{areaId:areaId},function (res) {
                $.each(res,function (index,element) {
                    $('#mall-container').find(' .dropdown-menu')
                        .append("<li onclick='queryBlock(this)'>" +
                            "<a data-id='" + element.id + "' href='javascript:void(0)'>" + element.shortName + "</a></li>");
                });
            });
        }

        var mallId = $form.find('input[name=mallId]').val();
        if(mallId){
            $.getJSON(url.getBlockByMallId,{areaId:areaId},function (res) {
                $.each(res,function (index,element) {
                    $('#block-container').find(' .dropdown-menu')
                        .append("<li onclick='queryBlock(this)'>" +
                            "<a data-id='" + element.id + "' href='javascript:void(0)'>" + element.blockName + "</a></li>");
                });
            });
        }


        var blockId = $form.find('input[name=blockId]').val();
        if(blockId){
            $.getJSON(url.getFloorByBlockId,{blockId:blockId},function (res) {
                $.each(res,function (index,element) {
                    $('#floor-container').find(' .dropdown-menu')
                        .append("<li onclick='queryBlock(this)'>" +
                            "<a data-id='" + element.id + "' href='javascript:void(0)'>" + element.floorName + "</a></li>");
                });
            });
        }

    }
};*/

$(function () {
   $("#preloader").fadeOut("fast");
   //storeUpdate.init();
});

(function ($) {

    selectModalView.init();

    /*下拉框自动赋值*/
    $(".zl-dropdown-inline").ysdropdown({
        callback:function(val,$elem){
            //console.log("===================")
            //console.log(val);
            //console.log($elem);
        }
    });

    var page = $("#store-detail");

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
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test(propertySquare)){
            return false;
        }
        if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
            return false;
        }
        var structureSquare = page.find('input[name=structureSquare]');
        structureSquare.val((parseFloat(propertySquare)/(parseFloat(obtainAreaRatio)/100.00)).toFixed(2));
    });

    /*=============非空提示===========*/
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
    /*=============非空提示===========*/

    /*===================下拉=====================*/
    page.on("click", ".btn-group li", function () {
        var child = $(this).children('a'),
            btn = $(this).parent('ul').prev('button'),
            input = $(this).parent('ul').prevAll('input[type=hidden]');
        btn.html(child.html());
        input.val(child.data('id'));
    });
    /*===================下拉=====================*/

    /*================update event===============>>>>>>>*/
    $('#updateStoreBtn').on('click',function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $form = $('#updateForm');
        if(!verify($form)){
            return false;
        }
        $.post(enrolmentWeb_Path+'/store/update.htm',$form.serialize(),function (res) {
            if(res.code==='0'){
                alert('操作成功！','','',function () {
                    location.href=enrolmentWeb_Path+'/store/index.htm';
                });
            }else if(res.code==='1'){
                alert(res.msg);
            }else{
                alert(res.message)
            }
        },'json');
    });
    /*================update event===============>>>>>>>*/

    /*================delete event===============>>>>>>>*/
    $('#deleteStoreBtn').on('click',function (e) {
        e.stopPropagation();
        e.preventDefault();
        var id=$(this).attr("data-value");
        confirm("确认要删除吗？","","",function(type){
            if (type === "dismiss") return;
            $.getJSON(enrolmentWeb_Path+'/store/delete.htm',{id:id},function (res) {
                if(res.code==='0'){
                    alert(res.msg,'','',function () {
                        location.href=enrolmentWeb_Path+'/store/index.htm';
                    });
                }else if(res.code==='1'){
                    alert(res.msg);
                }else{
                    alert(res.message)
                }
            })
        });
    });
    /*================delete event===============>>>>>>>*/

    /*================验证======================*/
    function verify($form) {
        var allInput = $form.find('input').not('input[name=structureSquare],input[name=storeCode],input[name=layoutName],' +
            'input[name=storePosition],input[name=status],input[name=propertyType]');
        for (var i = 0; i < allInput.length; i++) {
            var item = $(allInput[i]);
            if (!item.val().trim()) {
                alert(tips[item.attr('name')]);
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
        if(!$form.find('input[name="status"]').val()){
            alert("铺位状态不能为空");
            return false;
        }
        if(!$form.find('input[name="propertyType"]').val()){
            alert("资产类型不能为空");
            return false;
        }
        return true;
    }
    /*================验证======================*/


})(jQuery);
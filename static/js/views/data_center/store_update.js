function queryMall(_this) {
    var $mall = $('#mall-container');
    $mall.find('.dropdown-menu').empty();
    $mall.find('button').html('请选择');

    var $block = $('#block-container');
    $block.find('.dropdown-menu').empty();
    $block.find('button').html('请选择');

    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
    $floor.find('button').html('请选择');


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

function queryBlock(_this) {
    var $block = $('#block-container');
    $block.find('.dropdown-menu').empty();
    $block.find('button').html('请选择');

    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
    $floor.find('button').html('请选择');

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
}
function queryFloor(_this) {
    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
    $floor.find('button').html('请选择');
    $.getJSON(enrolmentWeb_Path + '/floor/list.htm', {blockId: $(_this).children('a').data('id')}, function (res) {
        if (res.length === 0) {
            alert('此楼栋下没楼层,请先添加楼层或者选择别的项目');
            return;
        }
        $.each(res,function (index,element) {
            $('#floor-container').find(' .dropdown-menu').append("<li><a data-id='" + element.id + "' href='javascript:void(0)'>" + element.floorNo + "</a></li>");
        });

    });
}
var storeUpdate={
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
};

$(function () {
   $("#preloader").fadeOut("fast");
   storeUpdate.init();
});

(function ($) {


    var page = $("#store-detail");

    page.on('blur',"input[name=propertySquare]",function () {
        var obtainAreaRatio =parseInt(page.find('input[name=obtainAreaRatio]').val());
        var propertySquare=$(this).val();
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test($(this).val())){
            return false;
        }
        if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
            return false;
        }
        var structureSquare = page.find('input[name=structureSquare]');
        structureSquare.val(parseFloat(propertySquare)*(obtainAreaRatio/100));
    });

    page.on('blur',"input[name=obtainAreaRatio]",function () {
        var propertySquare = page.find('input[name=propertySquare]').val();
        var obtainAreaRatio=parseInt($(this).val());
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test(propertySquare)){
            return false;
        }
        if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
            return false;
        }
        var structureSquare = page.find('input[name=structureSquare]');
        structureSquare.val(parseFloat(propertySquare)*(obtainAreaRatio/100));
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
        propertySquare:'请输入使用面积',
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
        var _self=$(this);
        _self.attr('disabled',true);
        if(!verify($form)){
            _self.attr('disabled',false);
            return false;
        }
        $.post(enrolmentWeb_Path+'/store/update.htm',$form.serialize(),function (res) {
            if(res.code==='0'){
                alert(res.msg);
                location.href=enrolmentWeb_Path+'/store/index.htm';
            }else if(res.code==='1'){
                alert(res.msg);
            }else{
                alert(res.message)
            }
            _self.attr('disabled',false);
        },'json');
    });
    /*================update event===============>>>>>>>*/

    /*================delete event===============>>>>>>>*/
    $('#deleteStoreBtn').on('click',function (e) {
        e.stopPropagation();
        e.preventDefault();
        var _self=$(this);
        _self.attr('disabled',true);
        $.getJSON(enrolmentWeb_Path+'/store/delete.htm',{id:$('#updateForm').find('input[name=id]').val()},function (res) {
            if(res.code==='0'){
                alert(res.msg);
                location.href=enrolmentWeb_Path+'/store/index.htm';
            }else if(res.code==='1'){
                alert(res.msg);
            }else{
                alert(res.message)
            }
            _self.attr('disabled',false);
        })
    });
    /*================delete event===============>>>>>>>*/

    /*================验证======================*/
    function verify($form) {
        var allInput = $form.find('input');
        for (var i = 0; i < allInput.length; i++) {
            var item = $(allInput[i]);
            if (!item.val().trim()) {
                if(item.attr('name')==='structureSquare') continue;
                alert(tips[item.attr('name')]);
                return false;
            }
        }
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test($form.find('input[name=propertySquare]').val())){
            alert('请输入正确的使用面积(最大99999999,只能输入2位小数)');
            return false;
        }
        var obtainAreaRatio=parseInt($form.find('input[name=obtainAreaRatio]').val());
        if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
            alert('得房率请输入1-100的整数');
            return false;
        }
        return true;
    }
    /*================验证======================*/



})(jQuery);
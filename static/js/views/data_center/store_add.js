function isNumber(n) {
    return !isNaN(n) && isFinite(n);
}

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
(function ($) {

    $("#preloader").fadeOut("fast");
    var page = $("#store-detail");

    $(document).keydown(function (e) {
        if(e.keyCode===13) $('#addStoreBtn').trigger('click');
    });

    $.getJSON(enrolmentWeb_Path+'area/all.htm',function (res) {
        $.each(res,function (index, element) {
            $('#area-container').find(' .dropdown-menu')
                .append("<li onclick='queryMall(this)'>" +
                    "<a data-id='" + element.id + "' href='javascript:void(0)'>" + element.areaName + "</a></li>");
        });
    });

    page.on("click", ".btn-group li", function () {
        var child = $(this).children('a'),
            btn = $(this).parent('ul').prev('button'),
            input = $(this).parent('ul').prevAll('input[type=hidden]');
        btn.html(child.html());
        input.val(child.data('id'));
    });

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


    $('#addStoreBtn').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var _self=$(this);
        _self.attr('disabled',true);
        var $form = $('#addForm');
        console.log($form.serialize());  //TODO
        if (!verify($form)) {
            _self.attr('disabled',false);
            return false;
        }
        $.post(enrolmentWeb_Path + '/store/add.htm', $form.serialize(), function (res) {
            if (res.code === '0') {
                alert(res.data);
                location.href = enrolmentWeb_Path + '/store/index.htm';
            } else if (res.code === '1') {
                alert(res.msg);
            } else {
                alert(res.message)
            }
            _self.attr('disabled',false);
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
        propertySquare:'请输入使用面积',
        obtainAreaRatio:'请输入得房率',
        storeCode:'请输入商铺编码'
    };

    function verify($form) {
        var allInput = $form.find('input').not('input[name=structureSquare]');
        for (var i = 0; i < allInput.length; i++) {
            console.log(allInput[i]);
            var item = $(allInput[i]);
            if (!item.val().trim()) {
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

})(jQuery);
function isNumber(n) {
    return !isNaN(n) && isFinite(n);
}

var buildingType = [{id: 2, name: "商业街"}, {id: 3, name: "购物中心"}, {id: 4, name: "写字楼"}, {id: 5, name: "住宅底商"},
    {id: 6, name: "专业卖场"}, {id: 7, name: "酒店"}];

var ids=['#js-area-group','#js-mall-group','#js-block-group'];
function queryMall(_this){
    //console.log('=======>>>>>>>>>>>>>>查询项目信息');
    var count=$(_this).parent().attr('id').split('_')[1];
    var level2=$(ids[1]+'_'+count),
        level3=$(ids[2]+'_'+count);

    $(ids[0]+'_'+count).prev().attr('title',$(_this).data('title'));

    level2.empty();
    level2.prev().html('请选择');
    level3.empty();
    level3.prev().html('请选择');

    level2.prevAll('input').val('');
    level3.prevAll('input').val('');

    $.getJSON(enrolmentWeb_Path+'/mall/list.htm',{'areaId':$(_this).data('id')},function (res) {
        if(res.length===0) alert('所属城市公司下没有项目,请重新选择或者添加项目');
        $.each(res,function (index, element) {
            var fullName=element.shortName;
            var $li=$("<li data-id='"+element.id+"' data-type='"+element.mallType+"' onclick='queryBlock(this)' ></li>");
            var $a=$("<a data-id='"+element.id+"' href='javascript:void(0)'>"+fullName+"</a>");
            if(fullName.length>15){
                element.shortName=fullName.substring(0,15)+'...';
                $li.attr('data-title',fullName);
                $a.html(element.shortName);
            }
            $li.append($a);
            level2.append($li);
        });
    });
}

function queryBlock(_this) {
    //console.log('===========>>>>查询楼栋信息');
    var count=$(_this).parent().attr('id').split('_')[1];
    var level3=$(ids[2]+'_'+count);
    level3.empty();
    level3.prev().html('请选择');
    level3.prevAll('input').val('');

    $(ids[1]+'_'+count).prev().attr('title',$(_this).data('title'));

    $.getJSON(enrolmentWeb_Path+'/block/list.htm',{"mallId":$(_this).data('id')},function (res) {
        if(res.length===0) alert('所属项目下没有楼栋,请重新选择或者添加楼栋');
        $.each(res,function (index,element) {
            level3.append("<li data-type='"+element.buildingType+"' onclick='queryBuildType(this)'  data-id='"+element.id+"'>" +
                "<a data-id='"+element.id+"' href='javascript:void(0)'>"+element.blockName+"</a></li>");
        });
    });
}
function queryBuildType(_this) {
    var $buildType=$('#js-buildType-group');
    /*if(!$buildType.prevAll('input').val()){

    }*/
    var str='';
    switch(parseInt($(_this).data('type'))) {
        case 2:
            str='商业街';
            break;
        case 3:
            str='购物中心';
            break;
        case 4:
            str='写字楼';
            break;
        case 5:
            str='住宅底商';
            break;
        case 6:
            str='专业卖场';
            break;
        case 7:
            str='酒店';
            break;
        default:
            str='未知';
            break;
    }
    $buildType.prevAll('button').html(str);
    $buildType.prevAll('input').val($(_this).data('type'));
}


var floor = {
    url: {
        add: '/floor/add',
        delete: '/floor/delete',
        update: '/floor/update',
        list: '/floor/index',
        getMallList: enrolmentWeb_Path+'/mall/all.htm',
        getBlockByMallId:enrolmentWeb_Path+'/block/list.htm',
        getAreaList:enrolmentWeb_Path+'area/all.htm'
    },
    query:function (path) {
        return path.enrolmentWebPath+this.url.list+'?'+$('#js-floor-form').serialize();
    },
    queryArea:function (url) {
        $.getJSON(url,function (res) {
            $.each(res,function (index,element) {
                var $li=$("<li data-id='"+element.id+"' onclick='queryMall(this)'></li>");
                var $a=$("<a data-id='"+element.id+"' href='javascript:void(0)'>"+element.areaName+"</a>");
                var fullName=element.areaName;
                if(fullName.length>15){
                   // console.log('=============>超长字符'+fullName);
                    element.shortName=fullName.substring(0,15)+'...';
                    $li.attr('data-title',fullName);
                    $a.html(element.shortName);
                }
                $li.append($a);
                $('[id^=js-area-group_]').append($li);
            });
        });
    },
    render:function () {
        $.getJSON(this.url.getMallList, function (res) {
            $.each(res,function (index, element) {
                $('#js-query-mall-menu').append("<li><a data-id='"+element.id+"' href='javascript:void(0)'>"+element.shortName+"</a></li>");
            });
        });

    },
    init: function (path) {
        var _that = this;

        _that.queryArea(_that.url.getAreaList);

        var page = $("#data_floors");

        _that.render();

        //分页=====================================>>>>>
        $('#btn-pre-bottom').on('click',function () {
            if(!$(this).hasClass('zl-btn-disable')){
               location.href=_that.query(path)+'&page='+ (parseInt($('.page-index').html())-1);
            }
        });
        $('#btn-next-bottom').on('click',function () {
            if(!$(this).hasClass('zl-btn-disable')){
                location.href=_that.query(path)+'&page='+ (parseInt($('.page-index').html())+1);
            }
        });
        $('#btn-save').on('click',function () {
            var value= parseInt($(this).parent().find('.zl-page-num-input').val());
            if(_that.verifyPagination(value, parseInt($('.page-all').html()))){
                location.href=_that.query(path)+'&page='+ value;
            }
        });
        //分页<<<<<<=====================================

        var queryMallId=$('#js-dropdown-projects').find('input[type=hidden]').val();
        if(queryMallId){
            $.getJSON(_that.url.getBlockByMallId,{mallId:queryMallId},function (res) {
                console.log(res); //TODO
                $.each(res,function (index,element) {
                    $('#js-query-block-menu').append("<li><a data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                });
            });
        }

        page.on("click", ".btn-group li", function () {
            var child = $(this).children('a'),
                btn = $(this).parent('ul').prev('button'),
                input = $(this).parent('ul').prevAll('input[type=hidden]');
            var text=child.html();
            if(text.length>10){
                text=text.substring(0,10)+'...';
            }
            btn.html(text);
            input.val(child.data('id'));

            if($(this).parents('#js-dropdown-projects')[0]){
                $('#js-dropdown-block').find('input[name=blockId]').val('');
               window.location.href=_that.query(path);
            }
            if($(this).parents('#js-dropdown-block')[0]){
               window.location.href=_that.query(path);
            }

            if($(this).parents('#js-dropdown-managementType')[0]){
               window.location.href=_that.query(path);
            }
        });

        page.on("click", "#js-floor-query", function () {
            window.location.href=_that.query(path);
        });

        page.on("click","[id^=updateBtn_]",function () {
            var count = this.id.split('_')[1];
            var $form = $('#updateForm_'+count);
            //console.log($form.serialize());
            if(_that.verify($form)){
                $.post(path.enrolmentWebPath+_that.url.update,$form.serialize(),function (res) {
                    console.log(res);  //TODO
                    if(res.code==='0'){
                        alert(res.data);
                        $('#btn-save').trigger('click');
                    }else if(res.code==='1'){
                        alert(res.msg);
                    }else{
                        alert(res.message)
                    }
                },"json").error(function (xhr, errorText, errorType) {
                    alert('系统出错');
                });
            }
        });
        //===========================>>>添加 event
        page.on("click", "#js-add-btn", function () {
            var _self=$(this);
            _self.attr('disabled',true);

            var $form = $('#js-add-form');
            if( _that.verify($form)){
                $.post(path.enrolmentWebPath+_that.url.add,$form.serialize(),function (res) {
                    console.log(res);
                    if(res.code==='0'){
                        alert(res.data);
                        $('#btn-save').trigger('click');
                    }else if(res.code==='1'){
                        alert(res.msg);
                    }else{
                        alert(res.message)
                    }
                    _self.attr('disabled',false);
                },'json').error(function (xhr, errorText, errorType) {
                    alert('系统出错');
                    _self.attr('disabled',false);
                });
            }else{
                _self.attr('disabled',false);
            }
        });
        // <<<==========================

        //============================>>>delete event
        page.on("click",".js-floor-delete",function () {
            var $self = $(this);
            $self.attr('disabled',true);
            var count = $self.data('count');
            var form = $('#updateForm_'+count);
            $.getJSON(path.enrolmentWebPath+_that.url.delete,{id: form.find('input[name=id]').val()},function (res) {
               // console.log(res);  //TODO
                if(res.code==='0'){
                    alert(res.data);
                    $('#btn-save').trigger('click');
                }else if(res.code==='1'){
                    alert(res.msg);
                }else{
                    alert(res.message)
                }
                $self.attr('disabled',false);
            }).error(function (xhr, errorText, errorType) {
                alert('系统出错');
                $self.attr('disabled',false);
            });
        });
        // <<<===========================
    },verifyPagination:function (value,total) {
        if(total===0) return true;
        if(!isNumber(value)){
            alert('请输入正确的页码');
            return  false;
        }
        if(value>total){
            alert('超过总页数,请重新输入 ');
            return false;
        }
        return true;
    },
    verify: function ($form) {
        var allInput = $form.find('input');
        for (var i = 0; i < allInput.length; i++) {
            var item = $(allInput[i]);
            if (!item.val().trim()) {
                alert(floor.tips[item.attr('name')]);
                return false;
            }
        }
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test($form.find('input[name=fixedSquare]').val())){
            alert('请输入正确的建筑面积(最大99999999,只能输入2位小数)');
            return false;
        }

        return true;
    },
    tips: {
        "companyId":"请选择城市公司",
        "mallId": "请选择项目名称",
        "blockId": "请选择楼栋名称",
        "floorName": "请输入楼层名称",
        "fixedSquare": "请输入建筑面积",
        "floorNo": "请选择楼层编码",
        "buildingType":"请选择物业类型"
    }
};
(function () {
    $("#preloader").fadeOut("fast");

    floor.init({staticPath: base_Path, enrolmentWebPath: enrolmentWeb_Path});

})();

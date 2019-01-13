function searchAll(_this) {
     var saleYm = $('#currentDate').val().replace('-', '');
     var curInput = $(_this).closest('.btn-group').find('input');
     var child = $(_this).find('a');
     $(curInput.get(0)).val(child.data('value'));
     $(curInput.get(1)).val(child.html());
     var $floor = $('#js-dropdown-floor'), $block = $('#js-dropdown-block');
     if ($(_this).closest('#js-dropdown-mall')[0]) {
         $block.find('input[name=blockId]').val('');
         $block.find('input[name=blockName]').val('');
         $floor.find('input[name=floorId]').val('');
         $floor.find('input[name=floorName]').val('');
     }
     if ($(_this).closest('#js-dropdown-block')[0]) {
         $floor.find('input[name=floorId]').val('');
         $floor.find('input[name=floorName]').val('');
     }
     var $form = $('#js-query-form');
      window.location= managementWeb_Path + 'sale/compare/index.htm?saleYm=' + saleYm+'&'+$form.serialize();
}

var saleCompareView = (function ($) {

    var saleCompareView = {};

    $("#preloader").fadeOut("fast");

    var container = $("#sale-compare");

    var $loading = $('.zl-loading');

    var saleYm = $('#currentDate').val().replace('-', '');

    var url = {
        index:managementWeb_Path + 'sale/compare/index.htm',
        getMallList:managementWeb_Path + 'sale/month/mall/list.htm',
        getBlockListByMallId:managementWeb_Path + 'sale/month/block/list.htm',
        getFloorListByBlockId:managementWeb_Path + 'sale/month/floor/list.htm',
        sale_compare_detail:managementWeb_Path+'sale/compare/day/index.htm'
    };

    saleCompareView.init = function () {

        //all event
        this.bindEvent();

        this.getMallList();

        this.getBlockListByMallId();

        this.getFloorListByBlockId();

    };
    function generatorTpl($tpl,$id,json) {
        var source=$tpl.html();
        var template = Handlebars.compile(source);
        var html=template(json);
        $id.append(html);
    }

    function addMonth(skip) {
        var currentDate = $('#currentDate').val();
        var add=new Date(currentDate.replace(/-/g,"\/"));
        var date=new Date();
        add.setMonth(add.getMonth()+skip);
        if(add.getTime()>date.getTime()){
            alert('不能选择未来的时间');
            return false;
        }
        var year=add.getFullYear();
        var month=add.getMonth()+1;
        month=month>9?month.toString():'0'+month;
        currentDate=year+month;
        var $form = $('#js-query-form');
        window.location=url.index+'?saleYm='+currentDate+'&'+$form.serialize();
    }

    saleCompareView.getMallList=function() {
        $.getJSON(url.getMallList, {}, function (res) {
            generatorTpl($('#mall-select-template'),$('#js-dropdown-mall').find('ul'),res);
        });
    };

    saleCompareView.getBlockListByMallId=function() {
        var mallId=$('#js-query-form').find('input[name=mallId]').val();
        if(mallId){
            $.getJSON(url.getBlockListByMallId, {mallId:mallId}, function (res) {
                generatorTpl($('#block-select-template'),$('#js-dropdown-block').find('ul'),res)
            });
        }
    };

    saleCompareView.getFloorListByBlockId=function () {
        var blockId=$('#js-query-form').find('input[name=blockId]').val();
        if(blockId){
            $.getJSON(url.getFloorListByBlockId, {blockId:blockId}, function (res) {
                generatorTpl($('#floor-select-template'),$('#js-dropdown-floor').find('ul'),res)
            });
        }
    };

    saleCompareView.bindEvent = function () {
        //详情页面按钮事件
        $('.js-detail-item').on('click',function () {
            var str=$(this).find('input[name=id]').val();
            window.location=url.sale_compare_detail+'?saleYm='+saleYm+'&id='+str;
        });


        $('#currentDate').datetimepicker({
            language:'zh-CN',
            endDate:new Date(),
            format: 'yyyy-mm',
            startView: 3,
            minView: 3
        }).on('changeDate',function () {
            var currentDate=$(this).val().replace('-','');
            window.location =url.index+'?saleYm=' + currentDate+'&'+$('#js-query-form').serialize();
        });

        container.on('click','#js-query-btn',function () {
            var $form = $('#js-query-form');
            window.location= url.index+'?saleYm=' + saleYm+'&'+$form.serialize();
        });

        //月历翻月=================>>>>>>>>>>
        container.on('click','#js-date-pre',function () {
            addMonth(-1);
        });
        container.on('click','#js-date-next',function () {
            addMonth(1);
        });
        //月历翻月<<<<<<<<<<<=================

        //分页=====================================>>>>>
        $('#btn-pre-bottom').on('click', function () {
            if (!$(this).hasClass('zl-btn-disable')) {
                location.href =paginationUrl(parseInt($('.page-index').html()) - 1);
            }
        });
        $('#btn-next-bottom').on('click', function () {
            if (!$(this).hasClass('zl-btn-disable')) {
                location.href = paginationUrl(parseInt($('.page-index').html()) + 1);
            }
        });
        $('#btn-save').on('click', function () {
            var value = parseInt($(this).parent().find('.zl-page-num-input').val());
            if (verifyPagination(value, parseInt($('.page-all').html()))) {
                location.href = paginationUrl(value);
            }
        });
        //分页<<<<<<=====================================


    };

    function paginationUrl(page) {
        var $form=$('#js-query-form');
        return location.href = url.index+'?page='+ page+'&saleYm='+saleYm+'&'+$form.serialize();
    }

    function verifyPagination(value, total) {
        if (total === 0) return true;
        if (!isNumber(value)) {
            alert('请输入正确的页码', "", "", function () {
                $('.zl-page-num-input').val($('.page-index').html());
            });
            return false;
        }
        if (value > total) {
            alert('超过总页数', "默认跳转到最后一页", "", function () {
                location.href = paginationUrl(total);
            });
            return false;
        }
        return true;
    }

    function isNumber(n) {
        return !isNaN(n) && isFinite(n);
    }

    return saleCompareView;

})(jQuery);

$(function () {
    saleCompareView.init();
});
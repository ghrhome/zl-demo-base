Handlebars.registerHelper('format_date', function (date) {
    if(date){
        var d=new Date(date);
        var month=d.getMonth()+1;
        month=month>9?month:'0'+month;
        var day=d.getDate();
        day=day>9?day:'0'+day;
        return d.getFullYear()+'/'+month+'/'+day;
    }else {
        return '';
    }
});

Handlebars.registerHelper('format_status', function (data) {
    var res;
    if(data==='1'){
        res='已审核'
    }else if(data==='2'){
        res='已解约';
    }else{
        res='未知';
    }
    return res;
});

function searchAll(_this) {
    var saleYm = $('#currentDate').val().replace('-', '');
    var curInput=$(_this).closest('.btn-group').find('input');
    var child = $(_this).find('a');
    $(curInput.get(0)).val(child.data('value'));
    $(curInput.get(1)).val(child.html());
    var $floor=$('#js-floor'),$block=$('#js-block');
    if($(_this).closest('#js-mall')[0]){
        $block.find('input[name=blockId]').val('');
        $block.find('input[name=blockName]').val('');
        $floor.find('input[name=floorId]').val('');
        $floor.find('input[name=floorName]').val('');
    }
    if($(_this).closest('#js-block')[0]){
        $floor.find('input[name=floorId]').val('');
        $floor.find('input[name=floorName]').val('');
    }
    var $form=$('#js-query-form');
    window.location = managementWeb_Path + 'sale/month/index.htm?saleYm=' + saleYm+'&'+$form.serialize();
}


function convertQuery(_this) {
    var currentDate=$('#currentDate');
    var currentYmd=$('#currentYmd');
    if($(_this).data("value")===0){
        currentDate.closest('.input-group').show();
        currentYmd.closest('.input-group').hide();
    }else {
        currentDate.closest('.input-group').hide();
        currentYmd.closest('.input-group').show();
    }
}

var saleMonthView = (function ($) {
    var saleMonthView = {};

    $("#preloader").fadeOut("fast");

    var container = $("#sale-mgt");

    var $currentDate = $('#currentDate').val().replace('-', '');

    var url={
        getMallList:managementWeb_Path+'common/mall/list.htm',
        getBlockListByMallId:managementWeb_Path+'common/block/list.htm',
        getFloorListByBlockId:managementWeb_Path+'common/floor/list.htm',
        dayIndex:managementWeb_Path + 'sale/day/index.htm'
    };

    saleMonthView.init = function () {
        this.renderCurrentMonthOfDay();

        this.bindEvent();

        this.getMallList();

        this.getBlockListByMallId();

        this.getFloorListByBlockId();

    };

    saleMonthView.getFloorListByBlockId=function() {
        var blockId=$('#js-query-form').find('input[name=blockId]').val();
        if(blockId){
            $.getJSON(url.getFloorListByBlockId, {blockId:blockId}, function (res) {
                $.each(res, function (index, element) {
                    var str = "<li onclick='searchAll(this)'>" +
                        "<a href='javascript:void(0)' data-value='" + element.id + "'>" + element.floorName + "</a></li>";
                    $('#js-floor').find('ul').append(str);
                });
            });
        }
    };

    saleMonthView.getBlockListByMallId=function() {
        var mallId=$('#js-query-form').find('input[name=mallId]').val();
        if(mallId){
            $.getJSON(url.getBlockListByMallId, {mallId:mallId}, function (res) {
                $.each(res, function (index, element) {
                    var str = "<li onclick='searchAll(this)'>" +
                        "<a href='javascript:void(0)' data-value='" + element.id + "'>" + element.blockName + "</a></li>";
                    $('#js-block').find('ul').append(str);
                });
            });
        }
    };

    saleMonthView.getMallList=function() {
        $.getJSON(url.getMallList, {}, function (res) {
            $.each(res, function (index, element) {
                var str = "<li onclick='searchAll(this)'>" +
                    "<a href='javascript:void(0)' data-value='" + element.id + "'>" + element.mallName + "</a></li>";
                $('#js-mall').find('ul').append(str);
            });
        });
    };

    function getDiverse(obj) {
        var ysLoading = $(".zl-loading");
        ysLoading.fadeIn();
        $.getJSON(managementWeb_Path + 'sale/month/diverse.htm',obj, function (res) {
            $('.checkbox-all').removeClass('checked');
            var source=$('#diverse-template').html();
            var template = Handlebars.compile(source);
            var html=template(res.data);
            if(res.data){
                $('#js-diverse-total').empty().append("共有"+res.data.length+"条记录");
            }else{
                $('#js-diverse-total').empty().append("共有0条记录");
            }

            $('#js-diverse-tpl').find('tbody').empty().append(html);
            $('.checkbox-item').off().on('click',function () {
                if($(this).hasClass('checked')){
                    $(this).removeClass('checked');
                    $('.checkbox-all').removeClass('checked');
                }else{
                    $(this).addClass('checked');
                    if($('.checkbox-item').length===$('.checked').length){
                        $('.checkbox-all').addClass('checked');
                    }
                }
            });

            ysLoading.fadeOut();

        });
    }

    saleMonthView.renderCurrentMonthOfDay=function() {
        var currentDate = $('#currentDate').val().replace(/-/g, "\/");
        var date = new Date(currentDate);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = new Date(year, month, 0);
        $('#currentDay').html(d.getDate());
    };

    function skipDay(date) {
        var saleYm=date.getFullYear();
        var saleYmd;
        if((date.getMonth()+1)<10){
            saleYm=saleYm+'0'+(date.getMonth()+1);
        }else{
            saleYm=saleYm+''+(date.getMonth()+1);
        }
        if(date.getDate()<10){
            saleYmd=saleYm+'0'+date.getDate();
        }else{
            saleYmd=saleYm+date.getDate();
        }
        window.location = managementWeb_Path + 'sale/month/index.htm?saleYm=' + saleYm+'&'+
            $('#js-query-form').serialize()+'&saleYmd='+saleYmd;
    }

    saleMonthView.bindEvent=function () {
        //excel导入事件
        importExcel();
        $('#js-diverse-tpl').find('.zl-dialog-btn-ok').off().on('click',function () {
            var size=$('#js-diverse-tpl').find('.checkbox-item').length;
            var i;
            var arr=[];
            for(i=0;i<size;i++){
                var item=$('#js-diverse-tpl').find('.checkbox-item')[i];
                if($(item).hasClass('checked')){
                    arr.push($(item).closest('td').data('val'));
                }
            }
            if(arr.length===0){
                $('#js-diverse-tip').empty().append('请选择复选框');
            }else{
                $('#js-diverse-tip').empty();
                $.post(managementWeb_Path + 'sale/month/generator/diverse.htm',{ids:arr},function (res) {
                    if(res.status===1){
                        $("#js-diverse-tpl").modal("hide");
                        alert('添加成功','','',function () {
                            location.reload(true);
                        });
                    }else {
                        alert(res.msg);
                    }
                },'json');
            }
        });

        $('#js-diverse-query').on('click',function () {
            var val=$('input[name=keyword]').val();
            if(val){
                val=val.trim();
            }
            getDiverse({keyword:val,saleYm:$currentDate});
        });

        $('.checkbox-all').on('click',function () {
            if($(this).hasClass('checked')){
                $(this).removeClass('checked');
                $('.checkbox-item').removeClass('checked');
            }else{
                $(this).addClass('checked');
                $('.checkbox-item').addClass('checked');
            }
        });




        container.on('click','#js-diverse',function () {
            $("#js-diverse-tpl").modal("show");
            getDiverse({saleYm:$currentDate});
        });

        //下拉============>>>>>>>>>>
        container.on("click", ".btn-group li", function () {
            var child = $(this).children('a'),
                btn = $(this).parent('ul').prev('button'),
                input = $(this).parent('ul').prevAll('input[type=hidden]');
            btn.html(child.html());
            input.val(child.data('value'));

        });
        //<<<<<<<<<===================

        //excel导出事件
        container.on("click", "#js-month-export", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $form = $('#js-query-form');
            var str=managementWeb_Path + 'sale/month/export/excel.htm?saleYm=' + $currentDate+'&'+$form.serialize();
            if($('#js-toggle-unRecord').hasClass('checked')){
                str+='&notInputDay='+0;
            }
            location.href= str;
        });

        //点击查询按钮事件
        container.on("click", "#js-query-btn", function () {
            var $form = $('#js-query-form');
            location.href = currentUrl($('#currentDate').val().replace('-', ''), $('#btn-next-bottom').next().val(), $form);
        });
        //上一月点击事件
        container.on("click", "#js-date-pre", function (e) {
            e.preventDefault();
            skip(-1);
        });
        //下一月点击事件
        container.on("click", "#zl-date-next", function (e) {
            e.preventDefault();
            skip(1);
        });
        container.on("click","#js-ymd-pre",function (e) {
            e.preventDefault();
            var currentYmd = $('#currentYmd').val();
            var date=new Date(currentYmd);
            date.setDate(date.getDate()-1);
            skipDay(date);
        });
        container.on("click","#zl-ymd-next",function (e) {
            e.preventDefault();
            var currentYmd = $('#currentYmd').val();
            currentYmd=new Date(currentYmd.replace(/-/g,"\/").replace(/-/g,"\/"));
            currentYmd.setDate(currentYmd.getDate()+1);
            var date=new Date();
            if(currentYmd.getTime()>date.getTime()){
                alert('不能选择未来的时间');
                return false;
            }
            skipDay(currentYmd);
        });

        //只显示未录入复选框点击事件
        $("#js-toggle-unRecord").on("click", function () {
            $(this).toggleClass("checked");
            var $form=$('#js-query-form');
            var str=managementWeb_Path+'sale/month/index.htm?saleYm=' +$currentDate+'&'+ $form.serialize();
            if($(this).hasClass('checked')){
                str+='&notInputDay='+0;
                location.href= str;
            }else {
                location.href= str;
            }

        });
        //鼠标滑动到小图标提示
        $(".js-info-text").tooltip({
            placement: "right",
            html: true,
            template: '<div class="tooltip tooltip-info" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });

        container.on("click", ".zl-table-block .zl-table-static-left tbody tr", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var id = $(this).find('input[name=id]').val();
            var categoryCode=$(this).find('input[name=categoryCode]').val();
            var categoryName=$(this).find('input[name=categoryName]').val();
            var contNo=$(this).find('input[name=contNo]').val();
            window.location = url.dayIndex+'?saleYmd=' +$currentDate +'&monthId=' + id+
                '&categoryCode='+categoryCode+'&contNo='+contNo+'&categoryName='+categoryName
                +'&'+$('#js-query-form').serialize();
        });


        $('#currentDate').datetimepicker({
            language:'zh-CN',
            format:'yyyy-mm',
            minView:3,
            startView:3,
            endDate:new Date()
        }).on('changeDate',function () {
            var saleYm=$(this).val().replace('-','');
            window.location = managementWeb_Path + 'sale/month/index.htm?saleYm=' + saleYm+'&'+$('#js-query-form').serialize();
        });

        $('#currentYmd').datetimepicker({
            language:'zh-CN',
            format:'yyyy-mm-dd',
            endDate:new Date(),
            startView: 2,
            minView: 2,
            autoclose:true
        }).on('changeDate',function () {
            var saleYmd=$(this).val();
            saleYmd=saleYmd.replace('-','').replace('-','');
            var saleYm=saleYmd.substring(0,6);
            window.location = managementWeb_Path + 'sale/month/index.htm?saleYm=' + saleYm+'&'+
                $('#js-query-form').serialize()+'&saleYmd='+saleYmd;
        });

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

    function isNumber(n) {
        return !isNaN(n) && isFinite(n);
    }

    function addMonth(value, month) {
        var date = new Date(value);
        date.setMonth(date.getMonth() + month);
        var num = date.getMonth() + 1;
        if (num < 10) num = 0 + "" + num;
        return date.getFullYear() + '-' + num;
    }

    function skip(step) {
        var value = $('#currentDate').val();
        if (!/^\d{4}-\d{1,2}$/.test(value)) {
            alert('非法日期格式');
            return false;
        }
        var saleYm = addMonth(value, step);
        var addValue = new Date(saleYm.replace(/-/g, "\/"));
        var currentDate = new Date();
        if (addValue.getTime() > currentDate.getTime()) {
            alert('不能选择未来时间');
            return false;
        }

        saleYm = saleYm.replace('-', '');

        window.location = managementWeb_Path + 'sale/month/index.htm?saleYm=' + saleYm+'&'+$('#js-query-form').serialize();
    }

    function currentUrl(saleYm, page, $form) {
        return managementWeb_Path + 'sale/month/index.htm?saleYm=' + saleYm + '&page=' + '&' + page + '&' + $form.serialize();
    }

    function importExcel() {
        var formData = new FormData();
        $("#js-month-import").ysSimpleUploadFile({ // Excel导入上传
            acceptTypes: ["xls", "xlsx"],
            changeCallback: function (file) {
                formData.append("file", file);
                $(".zl-loading").fadeIn();
                jQuery.ajax({
                    url: managementWeb_Path + 'sale/month/import/excel.htm',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        $.post(managementWeb_Path+'sale/day/chang/status.htm',{"saleYm":res.data},function () {

                        });
                        if(res.msg==='success'){
                            alert('导入成功', "请稍候查看提成租金", "", function () {
                                location.reload(true);
                            });
                        }else{
                            var msgArray=res.msg.split('.');
                            $.each(msgArray,function (index, element) {
                                $("#modal-month").find('.modal-body').remove('p').append("<p>"+element+"</p>");
                            });
                            $("#modal-month").modal("show");
                        }
                        // baseView.loadingHide();
                        $(".zl-loading").fadeOut();
                    },
                    error: function () {
                        alert("操作失败，请重试！");
                    }
                })
            }
        });
    }

    function paginationUrl(page) {
        var $form=$('#js-query-form');
        var saleYm = $('#currentDate').val().replace('-', '');
        return location.href = managementWeb_Path + 'sale/month/index.htm?page='+ page+'&saleYm='+saleYm+'&'+$form.serialize();
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
            alert('超过总页数,默认跳转到最后一页', "", "", function () {
                location.href = paginationUrl(total);
            });
            return false;
        }
        return true;
    }

    return saleMonthView;

})(jQuery);

$(function () {
    saleMonthView.init();

    new Swiper('#zl-floor-main-table', {
        scrollbar: '.swiper-scrollbar-a',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbarHide:false,
        observer:true,
        observeParents:true,
        grabCursor:true,
        scrollbarDraggable : true ,
        preventClicksPropagation:true
    });
    var wrapSwiper=$(".zl-table-wrapper-swiper");
    wrapSwiper.on("mouseenter","tbody tr",function(){
        var _index=$(this).index();
        $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
        $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

    });

    wrapSwiper.on("mouseleave","tbody tr",function(){
        var _index=$(this).index();
        $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
        $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');
    });
});
function searchAll(_this) {
    var saleYm = $('#currentDate').val().replace('-', '');
    var curInput=$(_this).closest('.btn-group').find('input');
    var child = $(_this).find('a');
    $(curInput.get(0)).val(child.data('value'));
    $(curInput.get(1)).val(child.html());
    var $form=$('#js-query-form');
    window.location = reportWeb_Path + 'sale/rank/index.htm?saleYm=' + saleYm+'&'+$form.serialize();
}

function searchAnchorStore(_this) {
    var saleYm = $('#currentDate').val().replace('-', '');
    var value=$(_this).find('a').data('value');
    $(_this).closest('.zl-dropdown').find('input[name=anchorStore]').val(value);
    var $form=$('#js-query-form');
    window.location = reportWeb_Path + 'sale/rank/index.htm?saleYm=' + saleYm+'&'+$form.serialize();
}
var rankView=(function ($) {
    var rankView={};

    $("#preloader").fadeOut("fast");

    var page=$('#sale_rank_all');

    var _saleYm=$('#currentDate').val().replace('-','');

    var _anchorStore=$('#js-query-form').find('input[name=anchorStore]').val();

    rankView.init=function () {
        this.bindEvent();
    };

    var url={
        index:reportWeb_Path + 'sale/rank/index.htm',
        mall_detail:reportWeb_Path+'sale/rank/mall_detail.htm'
    };

    function addMonth(skip) {
        var currentDate = $('#currentDate').val();
        var date=new Date();
        var month;
        if(!currentDate){
            month=(date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1);
            window.location=url.index+'?saleYm='+date.getFullYear()+month.toString();
            return false;
        }

        var add=new Date(currentDate.replace(/-/g,"\/"));

        add.setMonth(add.getMonth()+skip);
        if(add.getTime()>date.getTime()){
            alert('不能选择未来的时间');
            return false;
        }
        var year=add.getFullYear();
        month=add.getMonth()+1;
        month=month>9?month.toString():'0'+month;
        currentDate=year+month;
        window.location=url.index+'?saleYm='+currentDate+'&'+$('#js-query-form').serialize();
    }

    rankView.bindEvent=function () {

        $(".zl-table-block tbody tr").on("click",function(){
            var mallId=$(this).find('input[name=mallId]').val();
            var mallName=$(this).find('td:eq(1)').html();
            window.location=url.mall_detail+'?mallId='+mallId+'&mallName='+mallName+
                '&saleYm='+_saleYm+'&anchorStore='+_anchorStore;
        });

        $('#currentDate').datetimepicker({
            language:'zh-CN',
            format:'yyyy-mm',
            minView:3,
            startView:3,
            initialDate:new Date(),
            endDate:new Date()
        }).on('changeDate',function () {
            var saleYm=$(this).val();
            if(saleYm){
                saleYm=saleYm.replace('-','');
            }
            window.location =url.index+'?saleYm='+saleYm+'&'+$('#js-query-form').serialize();
        });
        page.on('click','#zl-date-pre',function () {
            addMonth(-1);
        });

        page.on('click','#zl-date-next',function () {
            addMonth(1);
        });


    };

    return rankView;
})(jQuery);

$(function () {
    rankView.init();
});
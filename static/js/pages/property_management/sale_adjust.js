var saleAdjust = (function ($) {

    var saleAdjust = {};

    $("#preloader").fadeOut("fast");

    var page = $("#sale-adjust");

    var url={
        index:managementWeb_Path + 'sale/adjust/index.htm',
        reject:managementWeb_Path+'sale/adjust/reject.htm',
        approved:managementWeb_Path+'sale/adjust/approved.htm'
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
        window.location=url.index+'?saleYm='+currentDate;
    }

    saleAdjust.init=function () {
       this.bindEvent();
    };

    saleAdjust.bindEvent = function () {
        page.on('click','#js-reject',function (e) {
            e.preventDefault();
            e.stopPropagation();
            var monthId=$(this).closest('tr').find('input[name=monthId]').val();
            var id=$(this).closest('tr').find('input[name=id]').val();
            var saleYm=$(this).closest('tr').find('.item-saleYm').html().trim().replace('-','');
            var params={monthId:monthId,id:id,saleYm:saleYm};
            confirm("确认驳回？","驳回将会还原销售额","", function (type) {
                if (type === 'dismiss') {
                    return;
                }
                $.post(url.reject,params,function (res) {
                    if(res.status===1){
                        alert(res.msg,'','',function () {
                            location.reload(true);
                        });
                    } else{
                        alert(res.msg);
                    }
                },'json');
            });
        });

        page.on('click','#js-approved',function (e) {
            e.preventDefault();
            e.stopPropagation();
            var monthId=$(this).closest('tr').find('input[name=monthId]').val();
            var id=$(this).closest('tr').find('input[name=id]').val();
            var saleYm=$(this).closest('tr').find('.item-saleYm').html().trim().replace('-','');
            var params={monthId:monthId,id:id,saleYm:saleYm};
            $.post(url.approved,params,function (res) {
                if(res.status===1){
                    alert('操作成功',res.msg,'',function () {
                        location.reload(true);
                    });
                }else if(res.status===2){
                    alert('',res.msg,'',function () {
                        location.reload(true);
                    });
                }else{
                    alert(res.msg);
                }
            },'json');
        });


        page.on('click','#js-date-pre',function () {
            addMonth(-1);
        });
        page.on('click','#js-date-next',function () {
            addMonth(1);
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

        $('#currentDate').datetimepicker({
            language:'zh-CN',
            format:'yyyy-mm',
            minView:3,
            startView:3,
            initialDate:new Date(),
            endDate:new Date(),
            clearBtn:true
        }).on('changeDate',function () {
            var saleYm=$(this).val();
            if(saleYm){
                saleYm=saleYm.replace('-','');
            }
            window.location =url.index+'?saleYm='+saleYm;
        });
    };

    function paginationUrl(page) {
        var saleYm = $('#currentDate').val().replace('-','');
        return location.href = url.index+'?page='+ page+'&saleYm='+saleYm;
    }

    function verifyPagination(value, total) {
        if (total === 0) {
            alert('没有数据','','',function () {
                $('.zl-page-num-input').val(1);
            });
            return false;
        }
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

    return saleAdjust;

})(jQuery);

$(function () {
    saleAdjust.init();
});
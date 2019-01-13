var saleChange = (function ($) {

    var saleChange = {};

    $("#preloader").fadeOut("fast");

    var page = $("#sale-change");

    var url={
        save:managementWeb_Path + 'sale/improve/save/detail.htm',
        index:managementWeb_Path+'sale/improve/index.htm',
        detail:managementWeb_Path+'sale/improve/toBillDetail.htm'
    };



    saleChange.init=function () {
       this.bindEvent();
    };

    saleChange.bindEvent = function () {
        page.on('click','#js-change-save',function () {
           window.location=url.save;
        });

        page.on('click','.detail-btn',function () {
           var id=$(this).data('id');
           window.location=url.detail+'?id='+id;
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

    function paginationUrl(page) {
        return location.href = url.index+'?page='+ page;
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

    return saleChange;

})(jQuery);

$(function () {
    saleChange.init();
});
function isNumber(n) {
    return !isNaN(n) && isFinite(n);
}
var store = {
    url: {
        getMallAll: enrolmentWeb_Path + 'mall/all.htm',
        list: enrolmentWeb_Path + 'store/index.htm',
        getBlockByMallId:enrolmentWeb_Path+'block/list.htm',
        getFloorByBlockId:enrolmentWeb_Path+'floor/list.htm',
        addPage:enrolmentWeb_Path + 'store/add/info.htm',
        updatePage:enrolmentWeb_Path+'store/update/info.htm',
        svgPage:enrolmentWeb_Path + "svg/index.htm"
    },
    query: function (path, $form) {
        return path + '?' + $form.serialize();
    },
    init: function () {
        var _that = this, page = $("#data-shops-list");
        $.getJSON(this.url.getMallAll, function (res) {
            for (var i = 0; i < res.length; i++) {
                $('#js-dropdown-projects').find(' .dropdown-menu')
                    .append("<li><a data-id='" + res[i].id + "' href='javascript:void(0)'>" + res[i].shortName + "</a></li>");
            }
        });

        var mallValue = $('#js-dropdown-projects').find('input[type=hidden]').val();
        if(mallValue){
            $.getJSON(this.url.getBlockByMallId,{mallId:mallValue},function (res) {
                for (var i = 0; i < res.length; i++) {
                $('#js-dropdown-block').find(' .dropdown-menu')
                    .append("<li><a data-id='" + res[i].id + "' href='javascript:void(0)'>" + res[i].blockName + "</a></li>");
                }
            });
        }

        var blockValue = $('#js-dropdown-block').find('input[type=hidden]').val();
        if(blockValue){
            $.getJSON(this.url.getFloorByBlockId,{blockId:blockValue},function (res) {
                console.log(res); //TODO
                for (var i = 0; i < res.length; i++) {
                    $('#js-dropdown-floor').find(' .dropdown-menu')
                        .append("<li><a data-id='" + res[i].id + "' href='javascript:void(0)'>" + res[i].floorNo + "</a></li>");
                }
            });
        }


        $(document).keydown(function (e) {
            if(e.keyCode===13){
                $('#btn-save').trigger('click');
            }
        });


        //选择框==========================================>>>>>
        page.on("click", ".btn-group li", function () {
            var child = $(this).children('a'),
                btn = $(this).parent('ul').prev('button'),
                input = $(this).parent('ul').prevAll('input[type=hidden]'),value=input.val();
            btn.html(child.html());
            input.val(child.data('id'));

            if ($(this).parents('#js-dropdown-projects')[0]) {
                if(parseInt(value)!==parseInt(child.data('id'))){
                    $('#js-dropdown-block').find('input[name=blockId]').val('');
                    $('#js-dropdown-floor').find('input[name=floorId]').val('');
                }
                window.location.href = _that.query(_that.url.list, $('#js-store-form'));
            }
            if ($(this).parents('#js-dropdown-block')[0]) {
                if(parseInt(value)!==parseInt(child.data('id'))){
                    $('#js-dropdown-floor').find('input[name=floorId]').val('');
                }
                window.location.href = _that.query(_that.url.list, $('#js-store-form'));
            }
            if ($(this).parents('#js-dropdown-floor')[0]) {
                window.location.href = _that.query(_that.url.list, $('#js-store-form'));
            }

        });
        //<<<<<==============================================
        //分页=====================================>>>>
        $('#btn-pre-bottom').on('click', function () {
            if (!$(this).hasClass('zl-btn-disable')) {
                location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) - 1);
            }
        });
        $('#btn-next-bottom').on('click', function () {
            if (!$(this).hasClass('zl-btn-disable')) {
                location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) + 1);
            }
        });
        $('#btn-save').on('click', function () {
            var value = parseInt($(this).parent().find('.zl-page-num-input').val());
            if (_that.verifyPagination(value, parseInt($('.page-all').html()))) {
                location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + value;
            }
        });
        //分页<<<<=====================================

        $("#js-add-new").on("click", function (e) {
            e.preventDefault();
            location.href = _that.url.addPage;
        });

        $('#js-store-query').on('click',function () {
            window.location.href = _that.query(_that.url.list, $('#js-store-form'));
        });

       page.on("click", ".table tbody tr", function (e) {
            e.preventDefault();
            location.href = _that.url.updatePage+'?id='+$(this).find('input').val();
        });
        //SVG落位图
        $(".zl-dist-svg").on("click", function (e) {
            e.preventDefault();
            location.href = _that.url.svgPage;
        });

    }, verifyPagination: function (value, total) {
        if(total===0) return true;
        if (!isNumber(value)) {
            alert('请输入正确的页码');
            return false;
        }
        if (value > total) {
            alert('超过总页数,请重新输入 ');
            return false;
        }
        return true;
    }
};

$(document).ready(function () {
    $("#preloader").fadeOut("fast");
    store.init();
});
var baseView = (function ($) {
    var baseView = {};

    var tips = {
        dictName: '请输入业态名',
        mallType: '请选择物业类型'
    };

    $("#preloader").fadeOut("fast");

    var container = $("#brand_frame");

    baseView.init = function () {
        bindEvent();
    };

    function isNumber(n) {
        return !isNaN(n) && isFinite(n);
    }

    function verify($form) {
        var allInput = $form.find('input');
        for (var i = 0; i < allInput.length; i++) {
            var item = $(allInput[i]);
            if (!item.val().trim()) {
                alert(tips[item.attr('name')]);
                return false;
            }
        }
        return true;
    }

    function bindEvent() {
        //下拉============>>>>>>>>>>
        container.on("click", ".btn-group li", function () {
            var child = $(this).children('a'),
                btn = $(this).parent('ul').prev('button'),
                input = $(this).parent('ul').prevAll('input[type=hidden]');
            btn.html(child.html());
            input.val(child.data('id'));
        });
        //<<<<<<<<<===================

        container.on("click","[id^=updateBtn_]",function () {
            var count=$(this).attr('id').split('_')[1];
            var $form=$('#updateFormBtn_'+count);
            var  _this = $(this);
            _this.attr('disabled', true);

            if (!verify($form)) {
                _this.attr('disabled', false);
                return false;
            }
            $.post(ibrandWeb_Path+'layout/update.htm',$form.serialize(),function (res) {
                //console.log(res);
                if (res.code === '0') {
                    alert(res.msg);
                    parent.location.href=ibrandWeb_Path+'layout/page.htm';
                } else if (res.code === '1') {
                    alert(res.msg);
                }
                _this.attr('disabled', false);
            },'json');

        });

        container.on("click","[id^=deleteBtn_]",function () {
            var count=$(this).attr('id').split('_')[1];
            var $form=$('#updateFormBtn_'+count);
            //console.log($form);
            var  _this = $(this);
            _this.attr('disabled', true);
            if (!verify($form)) {
                _this.attr('disabled', false);
                return false;
            }

            $.getJSON(ibrandWeb_Path+'layout/delete.htm',{id:$form.find('input[name=id]').val()},function (res) {
                if (res.code === '0') {
                    alert(res.msg);
                    parent.location.href=ibrandWeb_Path+'layout/page.htm';
                } else if (res.code === '1') {
                    alert(res.msg);
                }
                _this.attr('disabled', false);
            });
        });

        $("#addBtn").on("click",function (e) {
            if(parseInt($('#addFormBtn').find('input[name=level]').val())===4){
                alert('末级节点不能新增下级');
                e.stopPropagation();
                e.preventDefault();
                return false
            }
        });

        container.on("click", "#addLayoutBtn", function () {
            var $form = $('#addFormBtn'), _this = $(this);
            _this.attr('disabled', true);


            if (!verify($form)) {
                _this.attr('disabled', false);
                return false;
            }
            $.post(ibrandWeb_Path + 'layout/add.htm', $form.serialize(), function (res) {
                if (res.code === '0') {
                    alert(res.msg);
                    parent.location.href=ibrandWeb_Path+'layout/page.htm';
                } else if (res.code === '1') {
                    alert(res.msg);
                }
                _this.attr('disabled', false);
            },'json');
        });



        //分页=====================================>>>>>
        $('#btn-pre-bottom').on('click',function () {
            if(!$(this).hasClass('zl-btn-disable')){
                location.href=getPaginationUrl($('#addFormBtn'))+'&page='+ (parseInt($('.page-index').html())-1);
            }
        });
        $('#btn-next-bottom').on('click',function () {
            if(!$(this).hasClass('zl-btn-disable')){
                location.href=getPaginationUrl($('#addFormBtn'))+'&page='+ (parseInt($('.page-index').html())+1);
            }
        });
        $('#btn-save').on('click',function () {
            var value= parseInt($(this).parent().find('.zl-page-num-input').val());
            if(verifyPagination(value, parseInt($('.page-all').html()))){
                location.href=getPaginationUrl($('#addFormBtn'))+'&page='+ value;
            }
        });
        //分页<<<<<<=====================================
    }

    function getPaginationUrl($form) {
        var parentId=$form.find('input[name=parentId]').val();
        var level=parseInt($form.find('input[name=level]').val());
        if(isNumber(level)){
            level-=1;
        }else{
            level=0;
        }
        return ibrandWeb_Path+'layout/frame.htm?parentId='+parentId+'&level='+level;
    }

    function verifyPagination(value,total) {
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
    }

    return baseView;

})(jQuery);


$(document).ready(function () {
    baseView.init();
});
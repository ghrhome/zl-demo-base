(function ($) {
    $.fn.select = function (options) {
        var defaults = {
            data: [{id: 1, name: ''}, {id: 2, name: ''}],
            attrs: ['id', 'name'],
            label: 'xx管理',
            name: 'xx-input',
            value:'',
            style: 0
        };

        var opt = $.extend({}, defaults, options);

        return this.each(function () {
            if (opt.style === 0) {
                renderFirst(this, opt);
            } else {
                renderSecond(this, opt);
            }
            event(this);

        });

        function event(_this) {
            $(_this).find('ul li').on('click', function () {
                var child = $(this).children('a');
                var parent = $(this).parent('ul');
                parent.prevAll('input[type=hidden]').val(child.data('id'));
                parent.prevAll('button').html(child.html());
            })
        }


        function renderSecond(_this, obj) {
            var str, i, menu;

            str = "<input value='"+obj.value+"' type='hidden' name='" + obj.name + "'>" +
                "<button type='button' class='btn btn-default dropdown-toggle zl-dropdown-btn' " +
                "data-toggle='dropdown'>" + obj.label + "</button>";
            menu = '所有' + obj.label;
            str += "<ul class='dropdown-menu' style='overflow-y:auto;height:200px;' ><li>" +
                "<a  href='javascript:void(0)' data-id=''>" + menu + "</a></li>";

            for (i = 0; i < obj.data.length; i++) {
                str += "<li><a href='javascript:void(0)' " +
                    "data-id='" + (obj.data[i][obj.attrs[0]]) + "'>" + (obj.data[i][obj.attrs[1]]) + "</a></li>";
            }
            str += "</ul>";
            $(_this).html(str);
        }

        function renderFirst(_this, obj) {
            var str = "<label class='col-xs-4 control-label'>" + obj.label + "</label>" +
                "<div class='col-xs-8 input-group zl-input-required'>" +
                "<div class='btn-group zl-dropdown-inline'>" +
                "<input type='hidden' name='" + obj.name + "'>" +
                "<button type='button' class='btn btn-default dropdown-toggle zl-btn zl-dropdown-btn' data-toggle='dropdown'>请选择</button>" +
                "<ul class='dropdown-menu' style='overflow-y:auto;max-height: 200px;'>";

            for (var i = 0; i < obj.data.length; i++) {
                str += "<li><a href='javascript:void(0)' " +
                    "data-id='" + (obj.data[i][obj.attrs[0]]) + "'>" + (obj.data[i][obj.attrs[1]]) + "</a></li>";
            }

            str += "</ul>";

            $(_this).html(str);
        }
    };
})(jQuery);
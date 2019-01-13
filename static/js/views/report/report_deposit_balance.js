$(function (param) {
    let pageView = (function (param) {
        let pages = 1;
        let pageb = 1;
        let itemsPerPage=10;//增加
        let pageView = {};
        let dataView = ["rowNum", "INDEX_ID", "ITEM_NAME", "CONT_NO", "COMPANY_NAME", "ACCOUNT_NAME", "ADVANCE_RENT", "ADVANCE_ELECTRICITY", "ADVANCE_SERVICE"];
        // 判断元素类型
        // 获取数据
        // 传入jq元素
        function getType(elm) {
            let str = '';
            if (elm[0].tagName == 'INPUT') {

                if (elm.attr('data-Eliminate') == elm.val()) {
                    return str;
                } else {
                    str = elm.val();
                }
            }
            if (elm[0].tagName == 'BUTTON') {
                let text = elm.text().replace(/\n/g, "").replace(/\s/g, "")
                if (elm.attr('data-Eliminate') == text) {
                    return str;
                } else {
                    str = text;
                }
            }
            return str;
        }

        // 把对象里面的数据渲染到元素上
        // 传入数据对象和元素父级
        function getStr(obj, elm, disNone) {
            let date = elm.children();
            date.each((index, itm) => {
                for (let item in obj) {
                    if (item == $(itm).attr('data-data')) {
                        $(itm).attr('title', obj[item]);
                        $(itm).text(obj[item]);
                    }
                    ;
                    if (disNone!=undefined&&disNone == $(itm).attr('data-data')) {
                        $(itm).css('display', 'none')
                    }
                }
            })
            return elm;
        }

        // 千位分隔符
        function separation(num) {//自定义分隔函数方法
            var numpart = String(num).split(".");//将数字通过jq split用小数点分隔为数组对象
            numpart[0] = numpart[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
            //将数组对象第一个数据(整数部分)通过正则表达式每三位用逗号分隔
            return numpart.join(".");//把数组通过join方法用.进行拼接
        };

        // 禁止点击操作
        function prohibit(elm, num) {
            if (num == 1) {
                elm.addClass('zl-btn-disable');
            }
            if (num == 0) {
                elm.removeClass('zl-btn-disable');
            }
        }

        //初始选项checked
        function getSess() {
            let num=0;
            let emk=$('.checkOne').find('em');
            /*let sassCokie=JSON.parse(sessionStorage.getItem('checkAll')||'{}');
            emk.each((index,item)=>{
                for(let i in sassCokie){
                    if($(item).parents('tr').attr('data-data')==i&&sassCokie[i]=='true'){

                        $(item).addClass('checked');
                        $(item).parents('tr').attr('data-chk',sassCokie[i])
                    }
                }
            });*/
            $('.checkOne').find('tr').each((index,item)=>{

                if($(item).attr('data-chk')=='false'){
                    return
                }else if($(item).attr('data-chk')=='true'){
                    num++;
                }

            })
            if(num== $('.checkOne').find('tr').length&&num!=0){
                $('.all').addClass('checked');
            }

        }
        // 获取查询数据
        pageView.reportData = function (param) {
            let reportObj = {};
            // 默认第一页
            reportObj.page = 1;
            reportObj.itemsPerPage=itemsPerPage;//增加
            let elmName = $('#report_query').find('[name]');
            // 新增

            // bug getType($(elm))输出undefined
            elmName.each((index, elm) => {
                if (getType($(elm)) == '') {
                    return;
                } else {
                    reportObj[$(elm).attr('name')] = getType($(elm));
                }
            })
            return reportObj;
        }
        // 获取数据
        pageView.ajax = function (param) {
            // pageView.locaShow();
            $('#aa').html('');
            $('.checkOne').html('');
            $('.all').removeClass('checked');
            $.ajax({
                url: '/report_web/depositBalanceReport/getReportDate.htm',
                type: 'POST',
                data: pageView.reportData(),
                dataType: 'json',
                success: function (res) {
                    let reportData = res.data.reportData;
                    itemsPerPage=res.data.itemsPerPage;
                    if (reportData.length < 1) {
                        let str = `<tr><td>没有找到数据</td></tr>`;
                        $('.dataCont').css('height',400+'px');//增加
                        $('#aa').html(str);
                        $('#largeNumBtn').text(res.data.itemsPerPage);//增加
                        $('#rows').html(res.data.rows);
                        $('#page').html(res.data.page);
                        $('#pages').html(res.data.pages);
                        $('#indexPage').val(res.data.page);
                    }else if(reportData.length < 1){//增加
                        $('.dataCont').css('height',400+'px');
                        $('#aa').html(str);
                        $('#largeNumBtn').text(res.data.itemsPerPage);
                        $('#rows').html(res.data.rows);
                        $('#page').html(res.data.page);
                        $('#pages').html(res.data.pages);
                        $('#indexPage').val(res.data.page);
                    } else {
                        $('#largeNumBtn').text(res.data.itemsPerPage);
                        $('#rows').html(res.data.rows);
                        $('#page').html(res.data.page);
                        $('#pages').html(res.data.pages);
                        $('#indexPage').val(res.data.page);
                        pages = res.data.pages;
                        reportData.map((item, index) => {
                            let tr = $('<tr></tr>');
                            let fistTd = $('<tr data-chk="false" data-data="' + item.INDEX_ID + '"></tr>');
                            fistTd.html('<td><em class="zl-checkbox check"></em></td>');
                            $('.checkOne').append(fistTd);
                            for (let el in item) {
                                let td = $("<td></td>");
                                dataView.map((a, b) => {
                                    if (a == el) {
                                        td.attr({'data-data': el, title: ''});
                                        td.addClass('text-center');
                                        tr.append(td);
                                    } else {
                                        return;
                                    }
                                })
                            }
                            $('#aa').append(getStr(item, tr, 'INDEX_ID'));
                        })
                    }
                    getSess();
                    pageView.locaHide();
                }
            })
        }
        // 搜索
        pageView.reportAjax = function (param) {
            $('.lookup').on('click', function (param) {
                pageView.locaShow();
                pageb = 1;
                $('.zl-page-num-input').val(1);
                pageView.ajax();
                $('#page').text(1);
                $('#indexPage').val(1);
            })
        };
        // 下拉选项
        pageView.dropDown = function () {
            // 基础选项
            $('.zl-date-select').on('click', function (event) {
                let target = $(event.target);
                if (target.is('a') && target.parent().parent().prev().is('button')) {
                    pageView.locaShow();
                    pageView.reportData().page = 1;
                    $('.zl-page-num-input').val(1);
                    pageb = 1;
                    pageView.ajax();
                    $('.page-index').text(pageView.reportData().page);
                    $('input[name=page]').val(pageView.reportData().page);
                }
            })
            // 高级选项
            $('.senior').on('click', function (event) {
                let target = $(event.target);
                if (target.is('a') && target.parent().parent().prev().is('button')) {
                    pageView.locaShow();
                    pageView.reportData().page = 1;
                    $('.zl-page-num-input').val(1);
                    pageb = 1;
                    pageView.ajax();
                    $('.page-index').text(pageView.reportData().page);
                    $('input[name=page]').val(pageView.reportData().page);
                }
            })
            //显示条数
            $('#largeNumBtn').next('ul').on('click',function (event) {//增加
                let target=$(event.target);
                if(target.is('a')){
                    pageView.locaShow();
                    pageView.ajax();
                }
            })
        }

        // 分页操作
        // 上页
        pageView.paging = function (param) {
            $('#btn-pre-bottom').on('click', function (param) {

                // let pagpre = $('input[name=page]').val();
                if (Number(pageb) <= 1) {
                    return;
                } else if (pageb <= 2) {
                    pageb--;
                    $('input[name=page]').val(Number(pageb));
                    $('.page-index').text(Number(pageb));
                    prohibit($('#btn-pre-bottom'), 1);
                } else {
                    pageb--;
                    $('input[name=page]').val(Number(pageb));
                    $('.page-index').text(Number(pageb));
                }
                if (Number(pageb) - 1 < pages) {
                    prohibit($('#btn-next-bottom'), 0);
                }
                pageView.locaShow();
                pageView.reportData().page = Number(pageb);
                pageView.ajax();
            })
            // 下页
            $('#btn-next-bottom').on('click', function (param) {
                // let pagnext = $('input[name=page]').val();
                // let pagnext = pageb;

                // zl-btn-disable
                if (Number(pageb) >= pages) {

                    return;
                } else if (pageb >= pages - 1) {
                    pageb++;
                    prohibit($('#btn-next-bottom'), 1);
                    $('input[name=page]').val(Number(pageb));
                    $('.page-index').text(Number(pageb));

                } else {
                    pageb++;
                    $('input[name=page]').val(Number(pageb));
                    $('.page-index').text(Number(pageb));
                }
                if (Number(pageb) > 1) {
                    prohibit($('#btn-pre-bottom'), 0);
                }
                pageView.locaShow();
                pageView.reportData().page = Number(pageb);
                pageView.ajax();

            })
            // 跳页
            $('#btn-save').on('click', function (param) {
                let pagsave = $('input[name=page]').val();
                if (Number(pagsave) > pages || Number(pagsave) < 1) {
                    alert('请输入正确的页数', '', 'alert_fail');
                    $('input[name=page]').val(pageb);
                    return;
                }
                pageb = pagsave;
                // let indexPag = $('.page-index').text();
                if (Number(pageb) == 1 && Number(pagsave) > 1 && Number(pagsave) < pages) {
                    prohibit($('#btn-pre-bottom'), 0);
                } else if (Number(pageb) == pages && Number(pagsave) < pages && Number(pagsave) > 1) {
                    prohibit($('#btn-next-bottom'), 0);
                }
                if (Number(pageb) == pages) {
                    prohibit($('#btn-next-bottom'), 1);
                    prohibit($('#btn-pre-bottom'), 0);
                } else if (Number(pageb) == 1) {
                    prohibit($('#btn-pre-bottom'), 1);
                    prohibit($('#btn-next-bottom'), 0);
                }
                pageView.locaShow();
                $('.page-index').text(Number(pagsave));
                pageView.reportData().page = Number(pagsave);
                pageView.ajax();

            })
        }
        //
        pageView.mhss = function (elmId, url, elmVu, dataName, elmIn) {
            // let _mallId = $('#aa').val();
            elmId.ysSearchSelect({
                source: function (request, response) {
                    $.ajax({
                        url: url,
                        dataType: "json",
                        type: 'POST',
                        data: {
                            id: elmVu,
                            // 传入的数据
                            name: request.term
                        },
                        success: function (data) {
                            response($.map(data.data, function (item) {
                                return {
                                    label: item[dataName],
                                    value: item[dataName],
                                }
                            }));
                        }
                    });
                },
                callback: function (value, ui) {
                    elmIn.val(ui.item.label);
                    // _searchCb(ui.item.id);
                },
            });
        }

        // 加载页面
        // 隐藏
        pageView.locaHide = function () {
            $('#preloader').fadeOut('slow');
        };
        // 显示
        pageView.locaShow = function () {
            $('#preloader').fadeIn('slow');
        };
        pageView.init = function (param) {
            pageView.mhss($('#brandNameDiv'), '/report_web/baseInfo/getBrandName.htm', $('#brandName').val(), 'BRAND_NAME', $('#brandNameInput'))
            pageView.mhss($('#companyNameDiv'), '/report_web/baseInfo/getCompanyName.htm', $('#conpanyName').val(), 'COMPANY_NAME', $('#companyNameInput'))
            pageView.ajax();
            pageView.dropDown();
            pageView.reportAjax();
            pageView.paging();
        };
        return pageView;
    })(jQuery);

    $(document).ready(function (param) {
        pageView.init();

        $('#exportAll').click(function () {
            formPost("/report_web/depositBalanceReport/exportAll.htm", pageView.reportData());
        });

        $('#export').click(function () {
            var str = '';
            var data = $('.checkOne tr[data-chk="true"]');
            for (var i = 0; i < data.length; i++) {
                str += '"' + $(data[i]).attr('data-data') + '"';
                if (i != data.length - 1) {
                    str += ", ";
                }
            }
            if ('' == str) {
                alert('请选择数据导出');
                return;
            }
            var josn = {"indexIds": str};
            formPost("/report_web/depositBalanceReport/export.htm", josn);
        });

        function formPost(url, params, target) {
            var temp = document.createElement("form");
            // temp.enctype = "multipart/form-data";
            temp.action = url;
            temp.method = "post";
            temp.style.display = "none";

            if (target) {
                temp.target = target;
            } else {
                // showLoading();
            }

            for (var x in params) {
                var opt = document.createElement("input");
                opt.name = x;
                opt.value = params[x];
                temp.appendChild(opt);
            }
            document.body.appendChild(temp);

            temp.submit();
        }
    })

})
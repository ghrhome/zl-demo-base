$(function (param) {
    let pageView = (function (param) {
        let pageb = 1;
        let itemsPerPage=10;
        let pageView = {};
        // let Arr = ["REST_KEEP"];
        let heaArr=[  "MALL_NAME", "BRAND_NAME", "COMPANY_NAME", "CONT_NO", "CHARGE_ITEM_NAME", "REST_KEEP"];
        let Api=new ReportApi($('#hot')[0],heaArr,3);
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

        // 获取查询数据
        pageView.reportData = function (param) {
            let reportObj = {};
            // 默认第一页
            reportObj.page = 1;
            reportObj.itemsPerPage=itemsPerPage;
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


        // 搜索
        pageView.reportAjax = function (param) {
            $('.lookup').on('click', function (param) {
                Api.locaShow();
                pageb = 1;
                $('.zl-page-num-input').val(1);
                Api.again(pageView.reportData());
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
                    Api.locaShow();
                    pageView.reportData().page = 1;
                    $('.zl-page-num-input').val(1);
                    pageb = 1;
                    Api.again(pageView.reportData());
                    $('.page-index').text(pageView.reportData().page);
                    $('input[name=page]').val(pageView.reportData().page);
                }
            })
            // 高级选项
            $('.senior').on('click', function (event) {
                let target = $(event.target);
                if (target.is('a') && target.parent().parent().prev().is('button')) {
                    Api.locaShow();
                    pageView.reportData().page = 1;
                    $('.zl-page-num-input').val(1);
                    pageb = 1;
                    Api.again(pageView.reportData());
                    $('.page-index').text(pageView.reportData().page);
                    $('input[name=page]').val(pageView.reportData().page);
                }
            })
            //显示条数
            $('#largeNumBtn').next('ul').on('click',function (event) {
                let target=$(event.target);
                if(target.is('a')){
                    Api.locaShow();
                    pageb = 1;
                    $('.zl-page-num-input').val(1);
                    Api.again(pageView.reportData());
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
                if (Number(pageb) - 1 < Api.pages) {
                    prohibit($('#btn-next-bottom'), 0);
                }
                Api.locaShow();
                pageView.reportData().page = Number(pageb);
                Api.again(pageView.reportData());
            })
            // 下页
            $('#btn-next-bottom').on('click', function (param) {
                // let pagnext = $('input[name=page]').val();
                // let pagnext = pageb;

                // zl-btn-disable
                if (Number(pageb) >= Api.pages) {

                    return;
                } else if (pageb >= Api.pages - 1) {
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
                Api.locaShow();
                pageView.reportData().page = Number(pageb);
                Api.again(pageView.reportData());

            })
            pageView.swiper=function(){
                var ys_main_swiper = new Swiper('#zl-floor-main-table', {
                    scrollbar: '.swiper-scrollbar-a',
                    direction: 'horizontal',
                    slidesPerView: 'auto',
                    mousewheelControl: true,
                    freeModeMomentum:false,
                    freeMode: true,
                    scrollbarHide: false,
                    scrollbarDraggable: true,
                    preventClicksPropagation: false,

                });
                ys_main_swiper.on('setTranslate',function (translate) {
                    let le=ys_main_swiper.getWrapperTranslate()>=0?0:ys_main_swiper.getWrapperTranslate();
                    $('.swiper-wrapper').css('transform', "translate3d(" + le + "px, 0px, 0px)")
                })
            }
            // 跳页
            $('#btn-save').on('click', function (param) {
                let pagsave = $('input[name=page]').val();
                if (Number(pagsave) > Api.pages || Number(pagsave) < 1) {
                    alert('请输入正确的页数', '', 'alert_fail');
                    $('input[name=page]').val(pageb);
                    return;
                }
                pageb = pagsave;
                // let indexPag = $('.page-index').text();
                if (Number(pageb) == 1 && Number(pagsave) > 1 && Number(pagsave) < Api.pages) {
                    prohibit($('#btn-pre-bottom'), 0);
                } else if (Number(pageb) == Api.pages && Number(pagsave) < Api.pages && Number(pagsave) > 1) {
                    prohibit($('#btn-next-bottom'), 0);
                }
                if (Number(pageb) == Api.pages) {
                    prohibit($('#btn-next-bottom'), 1);
                    prohibit($('#btn-pre-bottom'), 0);
                } else if (Number(pageb) == 1) {
                    prohibit($('#btn-pre-bottom'), 1);
                    prohibit($('#btn-next-bottom'), 0);
                }
                Api.locaShow();
                $('.page-index').text(Number(pagsave));
                pageView.reportData().page = Number(pagsave);
                Api.again(pageView.reportData());

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

        pageView.init = function (param) {
            //    财务月
            $('input[name=businessPeriod]').val(pageView.lastMonth())
            //    业务月
            $('input[name=caiwuMonth]').val(pageView.lastMonth())
            Api.locaShow();
            Api.init('/report_web/margin_balance_report/getReportData.htm',pageView.reportData(),'reportData','newTitles');
            pageView.mhss($('#brandNameDiv'), '/report_web/baseInfo/getBrandName.htm', $('#brandName').val(), 'BRAND_NAME', $('#brandNameInput'))
            pageView.mhss($('#companyNameDiv'), '/report_web/baseInfo/getCompanyName.htm', $('#conpanyName').val(), 'COMPANY_NAME', $('#companyNameInput'))
            pageView.dropDown();
            pageView.reportAjax();
            pageView.paging();
        };

        // 获取上一个月
        pageView.lastMonth = function() {
            let date = new Date();
            let yy = date.getFullYear();
            let mm = date.getMonth();
            // 当月数为一月，减一年，月数为年最后一月
            if (0 == mm) {
                yy--;
                mm = 12;
            }
            let result = yy + '-' + (mm < 10 ? '0' + mm : mm);
            return result;
        };
        // 获取当前月
        pageView.theMonth = function() {
            let date = new Date();
            let mm = date.getMonth() + 1;
            let month = mm < 10 ? '0' + mm : mm;
            let result = date.getFullYear() + '-' + month;
            return result;
        };
        // 获取下个月
        pageView.nextMonth = function() {
            let date = new Date();
            let yy = date.getFullYear();
            let mm = date.getMonth();
            // 当月数为十二月，加一年，月数为第一月
            if (11 == mm) {
                yy++;
                mm = 1;
            }
            else {
                mm += 2;
            }
            let result = yy + '-' + (mm < 10 ? '0' + mm : mm);
            return result;
        };

        return pageView;
    })(jQuery);

    $(document).ready(function (param) {
        pageView.init();

        $('#exportAll').click(function () {
            let num = ~~$('#rows').html();
            if (num <= 0) {
                alert('没有数据可以导出');
                return;
            }
            if (num > 2000) {
                alert("数据条数超过两千，请选择合适的筛选条件后导出");
                return;
            }
            formPost("/report_web/margin_balance_report/exportAll.htm", pageView.reportData());
        });

        $('#export').click(function () {
            let num = ~~$('#rows').html();
            if (num <= 0) {
                alert('没有数据可以导出');
                return;
            }
            formPost("/report_web/margin_balance_report/export.htm", pageView.reportData());
        });

        function formPost(url, params, target) {
            var temp = document.createElement("form");
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
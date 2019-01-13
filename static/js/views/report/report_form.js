$(function (param) {
    // 日期
    let pageView = (function ($) {
        let pageView = {};
        let sassCokie=JSON.parse(sessionStorage.getItem('checkAll')||'{}');
        // 插件部分
        // 初始时间
        pageView.initialTime = function (date) {
            let Year = date.getFullYear();
            let Month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
            let data = Year + '-' + Month + '-' + Day;
            return data;
        };
        // 清除文字两边的空格
        pageView.trim = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        // 2级菜单
        pageView.towmenu = function (param) {

        }
        /*//隐藏折叠面板
        // data-toggle="collapse" data-target="#report_senior_condition" aria-expanded="true"
        pageView.toggle=function(){
            $('.closeX').on('click',function () {
                $('.lookup').attr({
                    'data-toggle':'collapse',
                    'data-target':'#report_senior_condition',
                    'aria-expanded':true
                })
            })
            $('.lookup').on('click',function () {
                    $(this).attr({
                        'data-toggle':'',
                        'data-target':'',
                        'aria-expanded':''
                    })
            })
        }*/
        // 页面操作部分
        // 设置时间
        pageView.dateMonth = function () {
            let datepickerMonth = $(".dateMonth").find("input").datetimepicker({
                format: "yyyy-mm",
                todayBtn: "linked",
                clearBtn:"linked",
                startView: 3,
                minView: 3,
                autoclose: true,
                language: "zh-CN",
            }).on('changeDate', function (e) {
            });
        };
        pageView.dateDay = function () {
            let datepickerDay = $(".dateDay").find("input").datetimepicker({
                format: "yyyy-mm-dd",
                todayBtn: "linked",
                clearBtn:"linked",
                startView: 2,
                minView: 2,
                autoclose: true,
                language: "zh-CN",
            }).on('changeDate', function (e) {
            });

        };
        //储存当前选着的数据
        pageView.sessIon=function (bool,id) {
            sassCokie[id]=bool;
            sessionStorage.setItem('checkAll',JSON.stringify(sassCokie));

        };
        //单选全选
        pageView.checAll=function () {
            $('.all').on('click',function () {
                if($(this).hasClass('checked')){
                    $('.all').removeClass('checked');
                    $("em[class='zl-checkbox check checked']").parents('tr').attr('data-chk',false)
                    $("em[class='zl-checkbox check checked']").removeClass('checked');
                    $('.checkOne').find('tr').each((index,item)=>{
                        pageView.sessIon('false',$(item).attr('data-data'));
                    })
                }else{
                    $('.all').addClass('checked');
                    $("em[class='zl-checkbox check']").parents('tr').attr('data-chk',true)
                    $("em[class='zl-checkbox check']").addClass('checked');
                    $('.checkOne').find('tr').each((index,item)=>{
                        pageView.sessIon('true',$(item).attr('data-data'));
                    })
                }
            })
//
            $('.checkOne').on('click',function (event) {
                let target=$(event.target);
                if(target.is('em')){
                    let num=0;
                    let emk= $('.checkOne').find('em')
                    if(target.hasClass('checked')){
                        target.parents('tr').attr('data-chk',false);
                        target.removeClass('checked');
                    }else{
                        target.parents('tr').attr('data-chk',true);
                        target.addClass('checked');
                    }
                    emk.each((index,elm)=>{
                        if($(elm).hasClass('checked')==false){
                            $('.all').removeClass('checked');
                            return false;
                        }
                        num++;
                    })
                    if(num==$('.checkOne').find('tr').length){
                        $('.all').addClass('checked');
                    }
                    let bool=target.parents('tr').attr('data-chk');
                    let id=target.parents('tr').attr('data-data');
                    pageView.sessIon(bool,id)
                }
            })



        }
        // 时间
        pageView.iniTime = function () {
            let date = new Date();
            let time = this.initialTime(date);
            $('.start-time').find('input').val(this.initialTime(new Date(date.getTime() - 2592000000)));
            $('.end-time').find('input').val(time);
        }
        // 清空
        // 给你需要清空的选项添加data-Eliminate并填写好你要替换的值如（data-Eliminate=''）
        pageView.eliminate = function (param) {
            $('.report-eliminate').on('click', function (param) {
                let att = $('#report_senior_condition').find('[data-Eliminate]');
                att.each((index, elm) => {
                    let item = $(elm);
                    let elim = item.attr('data-Eliminate');
                    if (item[0].tagName == 'INPUT') {
                        item.val(elim);
                    }
                    if (item[0].tagName == 'BUTTON') {
                        item.text(elim);
                    }
                })
            })
        }
        // 下拉选项
        pageView.dropDown = function () {
            // 基础查询
            $('.zl-date-select').on('click', function (event) {
                let target = $(event.target);
                // 选取下拉 (小bug第二次点击时会执行两次)
                if (target.is('button')) {
                    let buTex = target.text();
                    target.next('ul').find('li').each((index, elm) => {
                        let item = $(elm);
                        let elmTex = item.find('a');
                        elmTex.on('click', function () {
                            target.prev().val(elmTex.attr('data-value'))
                            target.html($(this).text());

                        })
                    })
                }
            });
            // 高级查询
            $('.senior').on('click', function (event) {
                let target = $(event.target);
                // 选取下拉 (小bug第二次点击时会执行两次)
                if (target.is('button')) {
                    let buTex = target.text();
                    target.next('ul').find('li').each((index, elm) => {
                        let item = $(elm);
                        let elmTex = item.find('a');
                        elmTex.on('click', function () {
                            target.prev().val(elmTex.attr('data-value'))
                            target.html($(this).text());
                        })
                    })
                }
            })
            //选着显示的页数
            $('#largeNumBtn').on('click',function () {
                let _this=$(this);
                let buTex = _this.text();
                _this.next('ul').find('li').each((index, elm) => {
                    let item = $(elm);
                    let elmTex = item.find('a');
                    elmTex.on('click', function () {
                        _this.prev().val(elmTex.attr('data-value'))
                        _this.html(elmTex.text());
                    })
                })

            })
        }

        // 查询
        $('.lookup').on('click', function () {
            $('#report_senior_condition').collapse('hide');
        })
        pageView.init = function () {
            var ys_main_swiper = new Swiper('#zl-floor-main-table', {
                scrollbar: '.swiper-scrollbar-a',
                direction: 'horizontal',
                slidesPerView: 'auto',
                mousewheelControl: true,
                freeMode: true,
                scrollbarHide: false,
                scrollbarDraggable: true,
                preventClicksPropagation: false,

            });
            pageView.checAll();
            pageView.iniTime();
            pageView.dateDay();
            pageView.dateMonth();
            pageView.dropDown();
            pageView.eliminate();

        };
        return pageView;

    })(jQuery);

    $(document).ready(function () {
        pageView.init();
    });

})
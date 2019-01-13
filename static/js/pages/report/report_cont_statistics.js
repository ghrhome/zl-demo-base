$(function (param) {
    let pageView = (function (param) {
        /*let pages = 1;
        let pageb = 1;
        let itemsPerPage=10;*/
        let check=['1'];
        let pageView = {};
        let Arr = [];
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
            // reportObj.page = 1;
            // reportObj.itemsPerPage=itemsPerPage;
            reportObj.status=JSON.stringify(check);
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
        //被冻结的列
        pageView.getDev = function () {
            let divLeft = '';
            let divH = 0;
            let divW = 0;
            if ($('.cloneDir')) {
                $('.cloneDir').remove();
            }
            $('#hot').find('div').each((index, elm) => {
                if ($(elm).hasClass('ht_clone_left')) {
                    divLeft = elm;
                    divH = $(elm).height();
                    divW = $(elm).width();
                    $(elm).remove()
                }
            })
            let num = $(divLeft).find('th').length;
            let div = $('<div class="cloneDir"></div>');
            div.css({'height': divH + 'px', 'width': divW + 'px'})
            div.html(divLeft);
            $('#hot').parents('.zl-table-main').prepend(div);
        }
        pageView.ajax=function() {
            new Promise((resolve, reject) => {
                $.ajax({
                    url: '/report_web/contStatisticsReport/getReportData.htm',
                    type: 'POST',
                    data: pageView.reportData(),
                    dataType: 'json',
                    success: function (res) {
                        if(res.code==0||res.code==500){
                            reject({data: res.data.reportData});
                            return
                        }
                        if (res.data.reportData.length < 1) {
                            /*$('#largeNumBtn').text(res.data.itemsPerPage);
                            $('#rows').html(res.data.rows);
                            $('#page').html(res.data.page);
                            $('#pages').html(res.data.pages);
                            $('#indexPage').val(res.data.page);*/
                            reject({data: res.data.reportData});
                        }else {
                            /*$('#largeNumBtn').text(res.data.itemsPerPage);
                            $('#rows').html(res.data.rows);
                            $('#page').html(res.data.page);
                            $('#pages').html(res.data.pages);
                            $('#indexPage').val(res.data.page);
                            pages = res.data.pages;*/
                        }
                        //        数据                        表头数据
                        resolve({data: res.data.reportData}) // , title: res.data.newTitles
                    },
                    ERROR: function (error) {

                    }
                })
            }).then((resoult) => {
                pageView.handsontable(resoult);
            }).catch((resoult) => {
                // 返回错误信息
                if(resoult.code==0||resoult.code==500){
                    $(window).find('body').html('404');
                    pageView.locaHide();
                    return
                }
                resoult.data= [{
                    "itemName":"查无数据",
                    "status":null,
                    "contType":null,
                    "incomeName":null,
                    "storeTypeName":null,
                    "totalCont":null,
                    "sumPracticalSquare":null
                }];
                pageView.handsontable(resoult);
                $('#hot').find('.ht_master table tbody').addClass('nobod');
                $('.cloneDir').find('.ht_master table tbody').addClass('nobod');
                pageView.locaHide();
            });
        }
        //初始化表格
        pageView.handsontable=function(resoult){
            var hotElement = document.querySelector('#hot');
            $(hotElement).html('');
            // var hotElementContainer = hotElement.parentNode;
            var hotSettings = {
                data: resoult.data,
                language: 'zh-CN',//语言
                contextMenu: ['alignment','copy'],//启用右键菜单
                columns: [
                    {data: "itemName", type: 'text',readOnly: true},
                    {data: "status", type: 'text',readOnly: true},
                    {data: "contType", type: 'text',readOnly: true},
                    {data: "incomeName", type: 'text',readOnly: true},
                    {data: "storeTypeName", type: 'text',readOnly: true},
                    {data: "totalCont", type: 'text',readOnly: true},
                    {data: "sumPracticalSquare", type: 'text',readOnly: true}
                ],
                // fixedRowsTop:false,//定影第一行
                // fixedColumnsLeft:4,//开启列的定影但必须先冻结该列
                columnSorting: true,
                sortIndicator: true,//开启排序
                UndoRedo: true,//撤销操作
                // manualColumnFreeze: true,//开启冻结
                // dropdownMenu: true,//下拉菜单
                // stretchH: 'all',//延伸所有列
                // width: 2000,
                // hiddenColumns:[0,1],
                // autoWrapRow: true,
                // height: 1000,
                rowHeaders: true,//当值为true时显示行头，当值为数组时，行头为数组的值 显示序号
                colHeaders: ["商场名称","合同状态","合同类型","收入类型","商铺类型","合同数量","计租面积"],// resoult.title
                maxRows: 2000,//最大行数
                // maxCols:20,//最大列数
                // filters: true,//过滤器
                // observeChanges:true,
                // manualRowResize: true,//允许拖动行
                // manualColumnResize: true,//允许拖动列
                // manualRowMove: true,//行可拖拽至指定行
                // manualColumnMove: true,//列可拖拽至指定行
                // trimRows: [1, 2, 5],//修剪行
                // exportFile: true,//是否导出
            };
            var hot = new Handsontable(hotElement, hotSettings);
            // $('#hot').css({'height':$('#hot').height()+'px','width':$('#hot').width()})
            pageView.getDev(hot);
            setTimeout(()=>{
                pageView.swiper();
            },1000)
            pageView.locaHide();
        }
        //..
        pageView.swiper=function () {
            var ys_main_swiper = new Swiper('#zl-floor-main-table', {
                scrollbar: '.swiper-scrollbar-a',
                direction: 'horizontal',
                slidesPerView: 'auto',
                observer: true,
                observeParents: false,
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
        //
        pageView.checkAll=function () {
            $('.selectpicker').on('changed.bs.select', function (e) {
                check=$(this).val();
                pageView.reportData().status=JSON.stringify(check);
                // $('.selectpicker').selectpicker('toggle')

            });
        }
        // 搜索
        pageView.reportAjax = function (param) {
            $('.lookup').on('click', function (param) {
                pageView.locaShow();
                /*pageb = 1;
                $('.zl-page-num-input').val(1);*/
                pageView.ajax();
                /*$('#page').text(1);
                $('#indexPage').val(1);*/
            })
        };
        // 下拉选项
        pageView.dropDown = function () {
            // 基础选项
            $('.zl-date-select').on('click', function (event) {
                let target = $(event.target);
                if (target.is('a') && target.parent().parent().prev().is('button')) {
                    pageView.locaShow();
                    /*pageView.reportData().page = 1;
                    $('.zl-page-num-input').val(1);
                    pageb = 1;*/
                    pageView.ajax();
                    /*$('.page-index').text(pageView.reportData().page);
                    $('input[name=page]').val(pageView.reportData().page);*/
                }
            })
            // 高级选项
            $('.senior').on('click', function (event) {
                let target = $(event.target);
                if (target.is('a') && target.parent().parent().prev().is('button')) {
                    pageView.locaShow();
                    /*pageView.reportData().page = 1;
                    $('.zl-page-num-input').val(1);
                    pageb = 1;*/
                    pageView.ajax();
                    /*$('.page-index').text(pageView.reportData().page);
                    $('input[name=page]').val(pageView.reportData().page);*/
                }
            })
            //显示条数
            /*$('#largeNumBtn').next('ul').on('click',function (event) {
                let target=$(event.target);
                if(target.is('a')){
                    pageView.locaShow();
                    pageb = 1;
                    $('.zl-page-num-input').val(1);
                    pageView.ajax();
                }
            })*/
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
            $('.selectpicker').selectpicker('val', check);
            pageView.mhss($('#brandNameDiv'), '/report_web/baseInfo/getBrandName.htm', $('#brandName').val(), 'BRAND_NAME', $('#brandNameInput'))
            pageView.mhss($('#companyNameDiv'), '/report_web/baseInfo/getCompanyName.htm', $('#conpanyName').val(), 'COMPANY_NAME', $('#companyNameInput'))
            // pageView.locaShow();
            pageView.ajax()
            pageView.dropDown();
            pageView.reportAjax();
            pageView.checkAll();
            // pageView.paging();
            // pageView.locaHide();
        };
        return pageView;
    })(jQuery);

    $(document).ready(function (param) {
        pageView.init();

        $('#export').click(function () {
            /*let num = ~~$('#rows').html();
            if (num <= 0) {
                alert('没有数据可以导出');
                return;
            }
            if (num > 2000) {
                alert("数据条数超过两千，请选择合适的筛选条件后导出");
                return;
            }*/
            formPost("/report_web/contStatisticsReport/export.htm", pageView.reportData());
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
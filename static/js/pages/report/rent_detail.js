$(function (param) {
    let pageView = (function (param) {
        let pages = 1;
        let pageb = 1;
        let check=['已审核'];
        let bool=false;
        let itemsPerPage=10;//增加
        let pageView = {};
        let wh=$('.zl-section').width();

        // 判断元素类型
        // 获取数据
        // 传入jq元素
        function getType(elm) {
            let str = '';
            if (elm[0].tagName == 'INPUT') {
                if (elm.attr('data-eliminate') == elm.val()) {
                    return str;
                } else {
                    str = elm.val();
                }
            }
            if (elm[0].tagName == 'BUTTON') {
                let text = elm.text().replace(/\n/g, "").replace(/\s/g, "")
                if (elm.attr('data-eliminate') == text) {
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
            reportObj.status=JSON.stringify(check);
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
            $('#accordion').html($('#accordion').find('div').eq(0));
            $('.checkOne').html('');
            $('.all').removeClass('checked');
            $.ajax({
                url: '/report_web/rentDetailReport/getReportDate.htm',
                type: 'POST',
                data: pageView.reportData(),
                dataType: 'json',
                success: function (res) {
                    let reportData = res.data.reportData;
                    let str = `<tr><td>没有找到数据</td></tr>`;
                    pages=res.data.pages;
                    itemsPerPage=res.data.itemsPerPage;
                    if (reportData.length < 1) {
                        // $('.dataCont').css('height',400+'px');//增加
                        $('#largeNumBtn').text(res.data.itemsPerPage);//增加
                        $('#rows').html(res.data.rows);
                        $('#page').html(res.data.page);
                        $('#pages').html(res.data.pages);
                        $('#indexPage').val(res.data.page);
                    }else {
                        $('#largeNumBtn').text(res.data.itemsPerPage);//增加
                        $('#rows').html(res.data.rows);
                        $('#page').html(res.data.page);
                        $('#pages').html(res.data.pages);
                        $('#indexPage').val(res.data.page);
                        // $('.dataCont').css('height',reportData.length < 10?400+'px':'');
                        reportData.map((item, index) => {
                        // let fistTd = $('<tr data-chk="false" data-data="' + item.CONT_NO + '"></tr>');
                        // fistTd.html('<td><em class="zl-checkbox check"></em></td>');
                        // $('.checkOne').append(fistTd);
                        let str = ` <div class="panel panel-default">
                                           <div data-toggle="collapse" data-bool=false data-ajax=false id='tableView' data-num=${index} data-id='${item.contNo}'  data-parent="#accordion" data-target="#collapse${index}"
                                                     class="collapsed" aria-expanded="false">
                                                    <ul class="zl-table-row hasTab" >
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.snapdate}">${item.snapdate}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.itemName}">${item.itemName}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.contNo}">${item.contNo}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.contType}">${item.contType}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.brandName}">${item.brandName}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.companyName}">${item.companyName}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.storeTypesName}">${item.storeTypesName}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.level1Name}">${item.level1Name}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.level2Name}">${item.level2Name}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.storeType}">${item.storeType}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.rentSquareType}">${item.rentSquareType}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.rentSquare}">${item.rentSquare}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.taxType}">${item.taxType}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.status}">${item.status}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.contBeginDate}">${item.contBeginDate}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.contEndDate}">${item.contEndDate}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.decorateStage}">${item.decorateStage}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.decorateIsFree}">${item.decorateIsFree}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.freeStage}">${item.freeStage}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.sponsor}">${item.sponsor}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.finishDate}">${item.finishDate}</span>
                                                        </li>
                                                        <li class="zl-table-cell">
                                                            <span class="text-left" title="${item.rentYear}">${item.rentYear}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                 <div id="collapse${index}" class="panel-collapse zl-collapse-wrapper collapse transi" aria-expanded="false" style="width:${wh+'px'};transition-duration: 0ms; transform: translate3d(0px, 0px, 0px)">
                                                    
                                                    
                                                <div class="zl-content dearn" style='padding:0'>
                                                <div style='width:100%'>
                                                    <span class='table-span'>租赁周期</span>
                                                    <table class="table zl-table table-hover zl-table-no-border  zl-small-size dearTw" style='border-right:0'>
                                                            <thead>
                                                            <tr>
                                                                <th class="text-left">租赁周期</th>
                                                                <th class="text-left">开始日期</th>
                                                                <th class="text-left">结束日期</th>
                                                                <th class="text-left">租金规则</th>
                                                                <th class="text-left">品类名</th>
                                                                <th class="text-left">固定租金(不含税)</th>
                                                                <th class="text-left">扣率</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody id="dataRent">
                                                            
                                                            </tbody>
                                                        </table>
                                                    
                                        
                                                </div>
                                                <div class="zl-table-main" style="padding-left:50%;">
                                                    <div class="zl-table-static zl-table-static-left" style="width:50%;">
                                                        <span class='table-span'>物管费周期</span>
                                                        <table class="table table-hover zl-table zl-table-no-border zl-small-size dearTw" style="width:100%;border-left: solid 1px #dae1e7;">
                                                            <colgroup>
                                                            <col width='22%'> 
                                                            <col width='26%'> 
                                                            <col width='26%'> 
                                                            <col width='26%'> 
                                                            </colgroup>
                                                            <thead>
                                                            <tr>
                                                                <th>物管费周期</th>
                                                                <th>开始时间</th>
                                                                <th>结束时间</th>
                                                                <th>物业费(不含税)</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody id="dataWy">
                                                            </tbody>
                                                            
                                                        </table>
                                                    </div>
                                                    <div style="width:100%; cursor: -webkit-grab;" id="js-swiper-main-table">
                                                        <span class='table-span'>推广周期</span>
                                                        <table class="table table-hover zl-table zl-table-no-border zl-small-size dearTw" style="width:100%;border-left: solid 1px #dae1e7;">
                                                            <colgroup>
                                                            <col width='22%'> 
                                                            <col width='26%'> 
                                                            <col width='26%'> 
                                                            <col width='26%'> 
                                                            </colgroup>
                                                            <thead>
                                                            <tr>
                                                                <th>推广周期</th>
                                                                <th>开始时间</th>
                                                                <th>结束时间</th>
                                                                <th>推广费(不含税)</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody id="dataTg">
                                                            </tbody>
                                                            
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>`;
                        $('#accordion').append(str);
                    })
                    }
                    getSess();
                    pageView.locaHide();
                }
            })
        }
        //2次查询
        pageView.ajaxTwo = function () {
            $('#accordion').on('click',function (event) {
                let target=$(event.target);
                if(target.parents('div')&&target.parents('div').eq(0)[0].id=='tableView'){

                    // $('.checkOne').find('tr>td').css({'vertical-align':''})
                    // $('.checkOne').find('tr').css('height',39+'px');
                    let tableView=target.parents('#tableView');
                    let ind=Number(tableView.attr('data-num'));
                    let id=tableView.attr('data-id');

                    if(tableView.attr('data-ajax')=='false'){
                        // pageView.locaShow();
                        tableView.attr('data-bool',!bool)
                        tableView.next().find('#dataRent').html('');
                        tableView.next().find('#dataWy').html('');
                        $.ajax({
                            url: '/report_web/rentDetailReport/getRentDetailByContNo.htm',
                            type: 'POST',
                            data:{"contNo":id},
                            cache: false,
                            dataType: 'json',
                            // processData: false,
                            // contentType: false,
                            success: function (res) {
                                let reportDate=res.data.reportData[0];
                                let num1 = 0;
                                reportDate.map((item1,index1)=>{
                                    if(index1 >= 1){
                                        if(reportDate[index1-1].startDate == reportDate[index1].startDate){
                                            num1++;
                                        }
                                    }
                                    let Rent=`
                                        <tr>
                                            <td class="text-conter" title="第${index1+1-num1}期">第${index1+1-num1}期</td>
                                            <td class="text-conter" title="${item1.startDate}">${item1.startDate}</td>
                                            <td class="text-conter" title="${item1.endDate}">${item1.endDate}</td>
                                            <td class="text-conter" title="${item1.rentTypeName}">${item1.rentTypeName}</td>
                                            <td class="text-conter" title="${item1.categoryName}">${item1.categoryName}</td>
                                            <td class="text-conter" title="${item1.applyFee}">${item1.applyFee}</td>
                                            <td class="text-conter" title="${item1.points}">${item1.points}</td>
                                        </tr>`;
                                    tableView.next().find('#dataRent').append(Rent);
                                })
                                let propertyDate=res.data.reportData[1];
                                let num2 = 0;
                                propertyDate.map((item2,index2)=>{
                                    if(index2 >= 1){
                                        if(propertyDate[index2-1].startDate == propertyDate[index2].startDate){
                                            num2++;
                                        }
                                    }
                                    let Wy=`<tr>
                                            <td class="text-conter" title="第${index2+1-num2}期">第${index2+1-num2}期</td>
                                            <td class="text-conter" title="${item2.startDate}">${item2.startDate}</td>
                                            <td class="text-conter" title="${item2.endDate}">${item2.endDate}</td>
                                            <td class="text-conter" title="${item2.applyFee}">${item2.applyFee}</td>
                                        </tr>`;
                                    tableView.next().find('#dataWy').append(Wy);
                                })
                                let promotionDate=res.data.reportData[2];
                                let num3 = 0;
                                promotionDate.map((item3,index3)=>{
                                    if(index3 >= 1){
                                        if(promotionDate[index3-1].startDate == promotionDate[index3].startDate){
                                            num2++;
                                        }
                                    }
                                    let Tg=`<tr>
                                            <td class="text-conter" title="第${index3+1-num3}期">第${index3+1-num3}期</td>
                                            <td class="text-conter" title="${item3.startDate}">${item3.startDate}</td>
                                            <td class="text-conter" title="${item3.endDate}">${item3.endDate}</td>
                                            <td class="text-conter" title="${item3.applyFee}">${item3.applyFee}</td>
                                        </tr>`;
                                    tableView.next().find('#dataTg').append(Tg);
                                })
                                let h1=tableView.next().find('.zl-content div').eq(0).height();
                                let h2=tableView.next().find('.zl-table-main div').eq(0).height();
                                let h3=tableView.next().find('.zl-table-main div').eq(1).height();

                                if(h2>h3){
                                    tableView.next().find('div').eq(0).css('height',(h2+h1)+'px');
                                }else{
                                    tableView.next().find('div').eq(0).css('height',(h3+h1)+'px');
                                }
                                // $('.checkOne>tr').eq(ind).attr('data-hg',tableView.next().find('.zl-table-main').height())


                                // $('.checkOne').find('tr').eq(ind).css('height',Number($('.checkOne>tr').eq(ind).attr('data-hg'))+8+36+'px').siblings().css('height',36+'px');
                                // $('.checkOne').find('tr>td').eq(ind).css('vertical-align','top').siblings().css('vertical-align','');
                                tableView.attr('data-ajax',true);
                                // pageView.locaHide();
                            },
                            error: function (error) {
                                tableView.attr('data-ajax',true);
                                // $('.checkOne').find('tr').eq(ind).css('height',tableView.next().find('.zl-table-main').height()+39+'px');
                                // $('.checkOne').find('tr>td').eq(ind).css('vertical-align','top');
                                // pageView.locaHide();
                            }
                        })
                    }
                    // else if(tableView.attr('data-ajax')=='true'){
                    //     if(tableView.next().hasClass('in')){
                    //         $('.checkOne').find('tr>td').eq(ind).css('vertical-align','middle');
                    //         $('.checkOne').find('tr').eq(ind).css('height',36+'px');
                    //         return
                    //     }
                    //     $('.checkOne').find('tr>td').eq(ind).css({'vertical-align':'top'}).siblings().css('vertical-align','');
                    //     $('.checkOne').find('tr').eq(ind).css('height',Number($('.checkOne>tr').eq(ind).attr('data-hg'))+8+36+'px').siblings().css('height',36+'px');
                    //     return
                    // }
                }

            })

        };

        //...
        pageView.dblclick=function () {
            $('#aa').on('dblclick',function (event) {
                event.stopPropagation();
                let target=$(event.target);
                if(target.is('td')){
                    $('input[name=searchWord]').val(target.text())
                }
            })
        }
        // 搜索
        pageView.reportAjax = function (param) {
            $('.lookup').on('click', function (param) {
                // if($('.selectpicker').val().length<1){
                //     alert('请选择合同状态');
                //     return;
                // }
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
                    pageView.reportData().itemsPerPage=target.parents('ul').prev().text();
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
        //...
        pageView.checkAll=function () {
            $('.selectpicker').on('changed.bs.select', function (e) {
                check=$(this).val();
                pageView.reportData().status=JSON.stringify(check);
                // $('.selectpicker').selectpicker('toggle')

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
            let date = new Date();
            let mm = date.getMonth() + 1;
            if (0 == mm) {
                date.setFullYear(date.getFullYear() - 1);
                mm = 12;
            }
            let month = ~~(mm) < 10 ? '0' + mm : mm;
            let result = date.getFullYear() + '-' + month;
            // 初始化ym
            $('input[name=ym]').val(result);
            pageView.mhss($('#brandNameDiv'), '/report_web/baseInfo/getBrandName.htm', $('#brandName').val(), 'BRAND_NAME', $('#brandNameInput'))
            pageView.mhss($('#companyNameDiv'), '/report_web/baseInfo/getCompanyName.htm', $('#conpanyName').val(), 'COMPANY_NAME', $('#companyNameInput'))
            pageView.locaShow();
            pageView.checkAll();
            pageView.ajax();
            pageView.dropDown();
            pageView.reportAjax();
            pageView.paging();
            pageView.ajaxTwo();
            pageView.dblclick();
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
            formPost("/report_web/rentDetailReport/exportAll.htm", pageView.reportData());
        });

        $('#export').click(function () {
            // var str = '';
            // var data = $('.checkOne tr[data-chk="true"]');
            // for (var i = 0; i < data.length; i++) {
            //     str += '"' + $(data[i]).attr('data-data') + '"';
            //     if (i != data.length - 1) {
            //         str += ", ";
            //     }
            // }
            // if ('' == str) {
            //     alert('请选择数据导出');
            //     return;
            // }
            // var josn = {"indexIds": str};
            formPost("/report_web/rentDetailReport/export.htm", pageView.reportData());
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
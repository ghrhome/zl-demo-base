$(function (param) {
    let pageView = (function (param) {
        let pages = 1;
        let pageb = 1;
        let itemsPerPage=10;
        let pageView = {};
        let dataView = ["contNo", "companyName", "brandName", "itemName", "blockName", "floorName", "storeNos", "companyCode", "contTypeName",
            "centReceName", "saleCode", "categoryName", "layoutNameL1", "layoutNameL2", "layoutName", "rentSquare", "saleYM","confirmAmountSum",
            "confirmAmount01", "confirmAmount02", "confirmAmount03", "confirmAmount04", "confirmAmount05",
            "confirmAmount06", "confirmAmount07", "confirmAmount08", "confirmAmount09", "confirmAmount10",
            "confirmAmount11", "confirmAmount12", "confirmAmount13", "confirmAmount14", "confirmAmount15",
            "confirmAmount16", "confirmAmount17", "confirmAmount18", "confirmAmount19", "confirmAmount20",
            "confirmAmount21", "confirmAmount22", "confirmAmount23", "confirmAmount24", "confirmAmount25",
            "confirmAmount26", "confirmAmount27", "confirmAmount28", "confirmAmount29", "confirmAmount30", "confirmAmount31"];
        let Arr=["confirmAmountSum", "confirmAmount01", "confirmAmount02", "confirmAmount03", "confirmAmount04", "confirmAmount05",
            "confirmAmount06", "confirmAmount07", "confirmAmount08", "confirmAmount09", "confirmAmount10",
            "confirmAmount11", "confirmAmount12", "confirmAmount13", "confirmAmount14", "confirmAmount15",
            "confirmAmount16", "confirmAmount17", "confirmAmount18", "confirmAmount19", "confirmAmount20",
            "confirmAmount21", "confirmAmount22", "confirmAmount23", "confirmAmount24", "confirmAmount25",
            "confirmAmount26", "confirmAmount27", "confirmAmount28", "confirmAmount29", "confirmAmount30", "confirmAmount31"];
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
        // 获取数据
        pageView.ajax = function (param) {
            // pageView.locaShow();
            $('#aa').html('');
            $('.checkOne').html('');
            $('.all').removeClass('checked');
            $.ajax({
                url: '/report_web/saleMonthDetail/getReportDate.htm',
                type: 'POST',
                data: pageView.reportData(),
                dataType: 'json',
                success: function (res) {
                    let reportData = res.data.reportData;
                    let str = `<tr><td>没有找到数据</td></tr>`;
                    if (reportData.length < 1) {
                        $('.dataCont').css('height',400+'px');
                        $('#aa').html(str);
                        $('#largeNumBtn').text(res.data.itemsPerPage);
                        $('#rows').html(res.data.rows);
                        $('#page').html(res.data.page);
                        $('#pages').html(res.data.pages);
                        $('#indexPage').val(res.data.page);
                    }else {
                        $('.dataCont').css('height',reportData.length < 10?400+'px':'');
                        $('#largeNumBtn').text(res.data.itemsPerPage);
                        $('#rows').html(res.data.rows);
                        $('#page').html(res.data.page);
                        $('#pages').html(res.data.pages);
                        $('#indexPage').val(res.data.page);
                        pages = res.data.pages;
                        reportData.map((item, index) => {
                            let tr = $('<tr></tr>');
                            // let fistTd = $('<tr data-chk="false" data-data="' + item.CONT_NO + ',' + item.SALE_YM + '"></tr>');
                            // fistTd.html('<td><em class="zl-checkbox check"></em></td>');
                            // $('.checkOne').append(fistTd);
                            for (let el in item) {
                                let td = $("<td></td>");
                                dataView.map((a, b) => {
                                    if (a == el) {
                                        let adc=Arr.indexOf(el)!=-1?'text-right':'text-center';
                                        td=Arr.indexOf(el)!=-1?td.css('padding-right',30+'px'):td;
                                        td.attr({'data-data': el, title: ''});
                                        td.addClass(adc);
                                        tr.append(td);
                                    } else {
                                        return;
                                    }
                                })
                            }
                            $('#aa').append(getStr(item, tr, 'INDEX_ID'));
                        })
                        let tr=`<tr id="total"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>本页合计</td>
                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`
                        $('#aa').append(tr);
                    }
                    // 楼栋信息
                    let blockData = res.data.blockData;
                    $('input[name=blockId]').parent().find('ul').eq(0).html('<li><a data-value="">所有楼栋</a></li>');
                    if(blockData.length > 0){
                        blockData.map((item, index) => {
                            let li=`<li><a data-value="${item.blockId}">${item.blockName}</a></li>`
                            $('input[name=blockId]').parent().find('ul').append(li);
                        })
                    }
                    // 楼层信息
                    let floorData = res.data.floorData;
                    $('input[name=floorId]').parent().find('ul').eq(0).html('<li><a data-value="">所有楼层</a></li>');
                    if(floorData.length > 0){
                        floorData.map((item, index) => {
                            let li=`<li><a data-value="${item.floorId}">${item.floorName}</a></li>`
                            $('input[name=floorId]').parent().find('ul').append(li);
                        })
                    }
                    // 二级业态信息
                    let layoutLevelTwoData = res.data.layoutLevelTwoData;
                    $('input[name=layoutIdTwo]').parent().find('ul').eq(0).html('<li><a data-value="">所有二级业态</a></li>');
                    if(layoutLevelTwoData.length > 0){
                        layoutLevelTwoData.map((item, index) => {
                            let li=`<li><a data-value="${item.layoutId}">${item.layoutName}</a></li>`
                            $('input[name=layoutIdTwo]').parent().find('ul').append(li);
                        })
                    }
                    // 三级业态信息
                    let layoutLevelThreeData = res.data.layoutLevelThreeData;
                    $('input[name=layoutIdThree]').parent().find('ul').eq(0).html('<li><a data-value="">所有三级业态</a></li>');
                    if(layoutLevelThreeData.length > 0){
                        layoutLevelThreeData.map((item, index) => {
                            let li=`<li><a data-value="${item.layoutId}">${item.layoutName}</a></li>`
                            $('input[name=layoutIdThree]').parent().find('ul').append(li);
                        })
                    }
                    getSess();
                    pageView.total();
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
        pageView.clearBtn=function () {
            if($('#mallButton')&&$('#blockButton')&&$('#floorButton')){
                $('#mallButton').next().on('click',function (event) {
                    let target=$(event.target);
                    if(target.is('a')){
                        $('#blockButton').text('所有楼栋').prev().val('');
                        $('#floorButton').text('所有楼层').prev().val('');
                    }
                });
                $('#blockButton').next().on('click',function (event) {
                    let target=$(event.target);
                    if(target.is('a')){
                        $('#floorButton').text('所有楼层').prev().val('');
                    }
                });
            }
            if($('#layoutButton1')&&$('#layoutButton2')&&$('#layoutButton3')){
                $('#layoutButton1').next().on('click',function (event) {
                    let target=$(event.target);
                    if(target.is('a')){
                        $('#layoutButton2').text('所有二级业态').prev().val('');
                        $('#layoutButton3').text('所有三级业态').prev().val('');
                    }
                });
                $('#layoutButton2').next().on('click',function (event) {
                    let target=$(event.target);
                    if(target.is('a')){
                        $('#layoutButton3').text('所有三级业态').prev().val('');
                    }
                });
            }
        }
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
            $('#largeNumBtn').next('ul').on('click',function (event) {
                let target=$(event.target);
                if(target.is('a')){
                    pageView.locaShow();
                    $('.zl-page-num-input').val(1);
                    pageb = 1;
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
        //合计
        pageView.total=function () {
            let i;
            $('.table').find('th').each((index,item)=>{
                if($(item).attr('data-all')=='true'&&$(item).attr('data-all')!=undefined){
                    let num=0;
                    let flag=false;
                    i=index;
                    $('#aa').find('tr').each((ind,elm)=>{
                        if($(elm).find('td').eq(i).text()!=''){
                            flag=true;
                            num+=(Number($(elm).find('td').eq(i).text())*100);
                        }
                    })
                    $('#total').find('td').eq(i).attr('title',num/100)
                    $('#total').find('td').eq(i).addClass('text-right');
                    // $('#total').css('background','#f3f6f9');
                    $('#total').find('td').eq(i).css({'padding-right':30+'px','height':60+'px','font-weight':600,'color':'red'});
                    if(flag==false){
                        $('#total').find('td').eq(i).text('');
                    }else {
                        $('#total').find('td').eq(i).text(num/100);
                    }
                }
            })
            $('#total').find('td').eq(16).addClass('text-center');
            $('#total').find('td').eq(16).css({'height':60+'px','font-weight':600,'color':'red'});
        }
        // 模糊搜索
        pageView.mhss = function (elmId, url, elmVu, dataName, elmIn) {
            // let _mallId = $('#aa').val();
            elmId.ysSearchSelect({
                source: function (request, response) {
                    $.ajax({
                        url: url,
                        dataType: "json",
                        type: 'POST',
                        data: {
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
            let date = new Date();
            let mm = date.getMonth();
            if (0 == mm) {
                date.setFullYear(date.getFullYear() - 1);
                mm = 12;
            }
            let month = ~~(mm) < 10 ? '0' + mm : mm;
            let result = date.getFullYear() + '-' + month;
            // 初始化saleYM
            $('input[name=saleYM]').val(result);
            pageView.clearBtn();
            pageView.mhss($('#brandNameDiv'), '/report_web/baseInfo/getBrandName.htm', $('#brandName').val(), 'BRAND_NAME', $('#brandNameInput'))
            pageView.mhss($('#companyNameDiv'), '/report_web/baseInfo/getCompanyName.htm', $('#conpanyName').val(), 'COMPANY_NAME', $('#companyNameInput'))
            pageView.locaShow();
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
            let num = ~~$('#rows').html();
            if (num <= 0) {
                alert('没有数据可以导出');
                return;
            }
            if (num > 2000) {
                alert("数据条数超过两千，请选择合适的筛选条件后导出");
                return;
            }
            formPost("/report_web/saleMonthDetail/exportAll.htm", pageView.reportData());
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
            formPost("/report_web/saleMonthDetail/export.htm", pageView.reportData());
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
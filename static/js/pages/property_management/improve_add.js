var improveView = (function ($) {
    var improveView = {};

    $("#preloader").fadeOut("fast");

    var page = $("#improve-warp");

    var dayList = {};

    var $currentTr = undefined;

    var url = {
        searchContList: managementWeb_Path + '/sale/improve/cont/list.htm',
        getDayList: managementWeb_Path + '/sale/improve/day/list.htm',
        getCategoryList: managementWeb_Path + '/sale/improve/category/list.htm',
        index: managementWeb_Path + '/sale/improve/index.htm'
    };

    improveView.init = function () {
        this.ysdropdownInit();
        this.bindEvent();
        this.searchCompany();
    };

    improveView.ysdropdownInit = function () {
        var _this = this;
        $(".zl-dropdown-inline").ysdropdown({
            callback: function (val, $elem) {
                if ($elem.data("id") === 'js-dropdown-projects') {
                    var input = $elem.children('input[type=hidden]').eq(1);
                    if (input.length > 0) {
                        input.val($elem.find('button').html());
                    }
                    _this.clear();
                }
            }
        });
    };

    function isEmpty(){
        var res=false;
        for(var key in dayList){
            if(dayList.hasOwnProperty(key)){
                var arr=dayList[key];
                for(var i=0;i<arr.length;i++){
                    var item=arr[i];
                    if(item.saleAmount&&item.saleCount){
                        res=true;
                        break;
                    }
                }
            }
        }
        return res;
    }

    improveView.save=function(callback){
        var flag=isEmpty();
        if(!flag){
            alert('请填写销售调整单');
            return false;
        }
        var list=[];
        var i;var item;


        for(var key in dayList){
            if(dayList.hasOwnProperty(key)){
                var arr=dayList[key];
                for(i=0;i<arr.length;i++){
                    item=arr[i];
                    list.push({
                        monthId:item.monthId,
                        newSale:item.saleAmount,
                        newCount:item.saleCount,
                        oldSale:item.sale,
                        oldCount:item.count,
                        saleYmd:item.saleYmd.replaceAll('-',''),
                        dayId:item.dayId
                    });
                }
            }
        }
        var contNo=$('#js-dropdown-cont').find('button').html();
        var saleYm=$('#saleYm').val().replace('-','');
        var mallId=$('input[name=mallId]').val();
        var mallName=$('input[name=mallName]').val();
        var brandName=$('input[name=brandName]').val();
        var storeNos=$('input[name=storeNos]').val();
        var companyName=$('input[name=companyName]').val();
        var data={
            list:list,
            contNo:contNo,
            saleYm:saleYm,
            mallId:mallId,
            mallName:mallName,
            brandName:brandName,
            storeNos:storeNos,
            companyName:companyName
        };
        var _tr=$('#js-category-list').find('tbody tr');
        var newSale=0;
        for(i=0;i<_tr.length;i++){
            item=$(_tr[i]).find('td').eq(1);
            newSale+=parseFloat(item.html());
        }
        data['newSale']=newSale;
        $.ajax({
            type: "post",
            url: managementWeb_Path+'sale/improve/save.htm',
            data: JSON.stringify(data),//将对象序列化成JSON字符串
            dataType:"json",
            contentType : 'application/json;charset=utf-8', //设置请求头信息
            success: function(res){
                callback(res);
            },
            error: function(){
                alert('调整失败,请重试');
            }
        });
    };

    improveView.bindEvent = function () {
        var _this = this;
        page.on('click','#k2-review',function () {
            _this.save(function (res) {
                if(res&&res.status===1){
                    var areaCode=$('#areaCode').val();
                    pageCommon.submitNetComment("inamp-salesadjustment-"+areaCode, res.data, url.index);
                }else{
                    alert('调整失败,请重试');
                }
            });
        });

        $(document).on('click', '#js-adjust', function () {
            var categoryCode = $('#sales-day-category').val();
            var $tpl = $("#sales-day-tpl");
            var trList = $tpl.find('tbody').children('tr');
            var list = [];
            var totalAmount = 0;
            var totalCount = 0;
            for (var i = 0; i < trList.length; i++) {
                var $tr = $(trList[i]);
                var saleAmount = $tr.find('input[name=saleAmount]').val();
                var saleCount = $tr.find('input[name=saleCount]').val();
                var sale = $tr.find('td').eq(1).html();
                var count = $tr.find('td').eq(2).html();
                var saleYmd = $tr.find('td').eq(0).html();

                if (saleAmount && saleCount) {
                    totalAmount += parseFloat(saleAmount);
                    totalCount += parseFloat(saleCount);
                } else if ((!saleAmount && saleCount) || (saleAmount && !saleCount)) {
                    $tpl.find('.modal-footer').children('p').empty()
                        .html(saleYmd + '请填写正确的调整销售额或调整销售笔数');
                    return false;
                } else {
                    totalAmount += parseFloat(sale);
                    totalCount += parseFloat(count);
                }
                var item = {
                    dayId: $tr.data('id'),
                    saleYmd: saleYmd,
                    sale: sale,
                    count: count,
                    saleAmount: saleAmount,
                    saleCount: saleCount,
                    monthId:$currentTr.data('id')
                };
                list.push(item);
            }
            dayList[categoryCode] = list;
            console.log(totalAmount);
            $currentTr.children('td').eq(1).html(totalAmount.toFixed(2));
            $currentTr.children('td').eq(2).html(totalCount);

            $tpl.modal('hide');
        });


        page.on('click', '#js-adjust-save', function () {
            _this.save(function (res) {
                if(res&&res.status===1){
                    alert(res.msg,'请发起k2审批','',function () {
                        window.location=url.index;
                    });
                }else{
                    alert('调整失败,请重试');
                }
            });
        });


        $('#saleYm').datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm',
            minView: 3,
            startView: 3,
            autoclose: true,
            endDate: new Date()
        }).on('changeDate', function () {
            _this.clear();
        });


        page.on('click', '.update-btn', function () {
            $currentTr = $(this).closest('tr');
            _this.loadingShow();
            var $tpl = $("#sales-day-tpl");
            $tpl.find('.modal-footer').children('p').empty();
            var contNo = $('#js-dropdown-cont').find('button').html();
            $tpl.modal("show");
            var saleYm = $('#saleYm').val();
            var date = monthOfDay(saleYm);
            var list = [];
            var categoryCode = $(this).data('id');
            for (var i = 1; i <= date; i++) {
                var saleYmd = formatSaleYmd(saleYm, i);
                var item = {};
                item.saleYmd = saleYmd;
                item.sale = 0;
                item.count = 0;
                list.push(item);
            }

            if (dayList[categoryCode]) {
                var data = $.extend(true, list, dayList[categoryCode]);
                echoSaleDay(data, $tpl, categoryCode, _this);
            } else {
                var params = {
                    contNo: contNo,
                    saleYm: saleYm.replace('-', ''),
                    categoryCode: categoryCode
                };
                $.getJSON(url.getDayList, params, function (res) {
                    var data = $.extend(true, list, res.data);
                    echoSaleDay(data, $tpl, categoryCode, _this);
                });
            }
        });
    };

    function echoSaleDay(data, $tpl, categoryCode, _this) {
        var source = $('#sales-day-temp').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $tpl.find('tbody').empty().append(html);
        $('#sales-day-category').val(categoryCode);
        _this.loadingHide();
    }

    function formatSaleYmd(saleYm, i) {
        return saleYm + '-' + (i > 9 ? i : '0' + i);
    }

    function monthOfDay(saleYm) {
        var arr = saleYm.split('-');
        return new Date(arr[0], arr[1], 0).getDate();
    }

    improveView.searchCompany = function () {
        $("#js-dropdown-cont").ysSearchSelect({
            source: function (request, response) {
                var mallId = $("input[name=mallId]").val();
                var saleYm = $('#saleYm').val();
                if (!$.trim(saleYm)) {
                    alert("请选择月份");
                    return false;
                }
                if (!$.trim(mallId)) {
                    alert("请选择项目");
                    return false;
                }
                saleYm = saleYm.replace('-', '');
                $.ajax({
                    url: url.searchContList,
                    dataType: "json",
                    data: {
                        mallId: mallId,
                        saleYm: saleYm,
                        contNo: request.term
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            item.saleYm = saleYm;
                            item.mallId = mallId;
                            return {
                                label: item.contNo,
                                value: item
                            }
                        }));
                    }
                });

            },
            callback: function (label, obj) {
                var item = obj.item.value;
                $('input[name=companyName]').val(item.companyName);
                $('input[name=brandName]').val(item.brandName);
                $('input[name=storeNos]').val(item.storeNos);
                var params = {contNo: item.contNo, mallId: item.mallId, saleYm: item.saleYm};
                $.getJSON(url.getCategoryList, params, function (res) {
                    if (res) {
                        var source = $('#category-temp').html();
                        var template = Handlebars.compile(source);
                        var html = template(res['list']);
                        $('#areaCode').val(res['areaCode']);
                        $('#js-category-list').find('tbody').empty().append(html);
                    }
                });
            }
        });
    };

    improveView.clear = function () {
        $('input[name=brandName]').val('');
        $('input[name=companyName]').val('');
        $('input[name=storeNos]').val('');
        $('#js-dropdown-cont').find('button').html('搜索填写');
        $('#js-category-list').find('tbody').empty();
        dayList={};
    };

    improveView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };
    improveView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    };

    return improveView;
})(jQuery);


$(document).ready(function () {
    improveView.init();
});



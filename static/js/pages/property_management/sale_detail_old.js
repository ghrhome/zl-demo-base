var baseView = (function ($) {
    var baseView = {};

    $("#preloader").fadeOut("fast");

    var page = $("#sale-detail");

    var $curOptElem = undefined;
    //品类列表
    var $categoryList = undefined;

    baseView.url={
        'index':managementWeb_Path,
        'getCategoryList':managementWeb_Path + '/sale/day/category/list.htm'
    };

    baseView.init = function () {
        getCategoryList(this.url.getCategoryList);
        bindEvent();
        notInput();
        renderFooter();
    };


    //缓存品类
    function getCategoryList(url) {
        var contNo=$('#contNo').val();
        var saleYmd=$('#currentDate').val().replace('-','')+'01';
        $.getJSON(url, {contNo:contNo,saleYmd:saleYmd}, function (res) {
            //console.log(res);
            $categoryList=res;
            if($categoryList.data&&$categoryList.data.length>1){
                $('.zl-save-btn').hide();
                $('.zl-cancel-btn').hide();
            }
        });
    }
    //重新渲染当前月份有几天，录入了几天
    function renderFooter() {
        var currentDate = $('#currentDate').val().replace(/-/g, "\/");
        var date = new Date(currentDate);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = new Date(year, month, 0);
        $('#js-footer-day').html(d.getDate());
    }

    function skip(step) {
        var value = $('#currentDate').val();
        if (!/^\d{4}-\d{1,2}$/.test(value)) {
            alert('非法日期格式');
            return false;
        }
        var saleYmd = addMonth(value, step);

        var addValue = new Date(saleYmd.replace(/-/g, "\/"));
        var currentDate = new Date();
        if (addValue.getTime() > currentDate.getTime()) {
            alert('不能选择未来时间');
            return false;
        }
        saleYmd = saleYmd.replace('-', '');

        var contNo = $('#contNo').val();

        var str=managementWeb_Path + 'sale/day/index.htm?saleYmd=' + saleYmd + '&contNo=' + contNo;
        if(step===-1){
            $.getJSON(managementWeb_Path+'sale/day/query/list.htm',{saleYmd:saleYmd,contNo:contNo},function (res) {
                if(!res||res.length===0){
                    alert(addValue.getFullYear()+'年'+(addValue.getMonth()+1)+'月'+'没有数据...');
                }else{
                    location.href =str;
                }
            });
        }else{
            location.href =str;
        }

    }

    function addMonth(value, month) {
        var date = new Date(value);
        date.setMonth(date.getMonth() + month);
        var num = date.getMonth() + 1;
        if (num < 10) num = 0 + "" + num;
        return date.getFullYear() + '-' + num;
    }

    //下个月8号不允许录入
    function notInput() {
        var currentDate = $('#currentDate').val();
        var newDate = new Date(currentDate.replace(/-/g, "\/"));
        newDate.setMonth(newDate.getMonth() + 1);
        newDate.setDate(8);
        currentDate = new Date();
        var  jsReviewed=$('#js-reviewed-confirm');
       if(currentDate.getTime()>newDate.getTime()){
           /* var allInput = $(document).find('input');
            $.each(allInput,function (index,element) {
                $(element).attr('disabled','disabled');
            });*/
           jsReviewed.show();
        }else{
           jsReviewed.hide();
        }
    }
    //z
    function renderCategoryList(data) {
        page.find(".zl-contract-category-dialog").modal("show");
        var dialog = $('#js-contract-category-dialog').find('table tbody');
        dialog.find('tr').not(':first').remove();
        var source=$('#category-select-template').html();
        var template = Handlebars.compile(source);
        var html=template({'categoryList':data});
        dialog.append(html);
    }

    function bindEvent() {
        page.on("click","#js-net-sales-save",function (e) {
            e.stopPropagation();
            e.preventDefault();
           var netSaleAmount=$('#js-net-sales').val();
           var monthId=$('#monthId').val();
            if(!/^(\d{1,20})(\.\d{1,2})?$/.test(netSaleAmount.trim())){
                alert('请输入正确的月净销售总额');
                return false;
            }
            $.post(managementWeb_Path+'sale/day/save/netSale.htm',{netSale:netSaleAmount,id:monthId},
                function (res) {
                if(res.status===1){
                    alert(res.msg);
                }else{
                    alert('保存失败');
                }
            },'json');

        });
        //模态框显示事件
        page.on("focus", "input#js-contract-modal", function () {
            if ($(this).attr("readonly")) {
                return
            }
            $("#js-contract-category-dialog").modal("show");
        });
        //一个以上的品类触发该事件
        page.on("focus", ".js-edit-turnover input", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $curOptElem = $(e.target);
            var contNo=$('#contNo').val();
            var $this = $(this);
            var saleDayId=$this.closest('tr').find('input[name=saleDayId]').val();
            var saleYmd=$this.closest('tr').find('input[name=saleYmd]').val();
            $(this).closest("tr").find(".js-edit-turnover").addClass("editing");
            $(this).data("tmpValue", $(this).val()).removeAttr("readonly");

            //一个品类和N个品类
            var data={saleYmd:saleYmd,contNo:contNo,saleDayId:saleDayId,saleAmountType:'2'};
            $.getJSON(managementWeb_Path+'sale/day/detail/list.htm',data,function (res) {
                if(!res.data&&!$categoryList.data){
                    return false;
                }

                if (res.data && res.data.length === 1||$categoryList.data && $categoryList.data.length === 1) {
                    if ($this.closest('tr').find('input[name=categoryCode]').length === 1) {
                        return;
                    }
                    var str=null;
                    if(res.data){
                         str = "<input type='hidden' name='categoryCode' value='" + res.data[0].categoryCode + "'>" +
                               "<input type='hidden' name='categoryName' value='" + res.data[0].categoryName + "'>";
                    }else{
                        if($categoryList.data){
                            str = "<input type='hidden' name='categoryCode' value='" + $categoryList.data[0].categoryCode + "'>" +
                                "<input type='hidden' name='categoryName' value='" + $categoryList.data[0].categoryName + "'>";
                        }
                    }
                    $this.closest('tr').append(str);
                }else if(res.data && res.data.length > 1){
                    renderCategoryList(res.data);
                }else{
                    renderCategoryList($categoryList.data);
                }
            });
        });
        //模态框点击事件
        $('.zl-dialog-btn-ok').on('click', function () {
            var dialog = $('#js-contract-category-dialog');
            var saleAmountArray = dialog.find('input[name=saleAmount]');
            var saleDayCountArray = dialog.find('input[name=saleDayCount]');
            var categoryNameArray = dialog.find('input[name=categoryName]');
            var categoryCodeArray = dialog.find('input[name=categoryCode]');
            var contNo = $('#contNo').val();
            var saleYmd = $curOptElem.closest('tr').find('input[name=saleYmd]').val();
            var saleDayId = $curOptElem.closest('tr').find('input[name=saleDayId]').val();

            var data = {
                saleAmount: [],
                saleDayCount: [],
                categoryCode: [],
                categoryName: [],
                'contNo': contNo,
                'saleYmd': saleYmd,
                'saleDayId': saleDayId,
                'saleAmountType': '2'
            };

            var totalSaleAmount = 0;
            var i;
            for(i=0;i<saleAmountArray.length;i++){
                if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmountArray[i].value.trim())) {
                    (function(index){
                        alert('请输入正确的营业额','','',function () {
                            saleAmountArray[index].focus();
                        });
                    })(i);
                    return false;
                }
                data.saleAmount.push(saleAmountArray[i].value);
                totalSaleAmount += parseInt(saleAmountArray[i].value);
            }
            var totalSaleDayCount = 0;
            for(i=0;i<saleDayCountArray.length;i++){
                if (!/^(\d{1,8})$/.test(saleDayCountArray[i].value.trim())) {
                    (function(index){
                        alert('请输入正确的销售笔数','','',function () {
                            saleDayCountArray[index].focus();
                        });
                    })(i);
                    return false;
                }
                data.saleDayCount.push(saleDayCountArray[i].value);
                totalSaleDayCount += parseInt(saleDayCountArray[i].value);
            }
            $.each(categoryNameArray, function (index, element) {
                data.categoryName.push(element.value);
            });
            $.each(categoryCodeArray, function (index, element) {
                data.categoryCode.push(element.value);
            });
            $.ajax({
                type: 'post',
                traditional: true,
                url: managementWeb_Path + 'sale/day/add/detail.htm',
                data: data,
                dataType: 'json',
                success: function (res) {
                    if (res.status === 1) {
                        page.find(".zl-contract-category-dialog").modal("hide");
                        $curOptElem = undefined;
                        location.reload(true);
                        //$curOptElem.closest('tr').find('input[name=saleAmount]').val(totalSaleAmount);
                        //$curOptElem.closest('tr').find('input[name=saleDayCount]').val(totalSaleDayCount);
                        //
                    }
                },
                error: function (XMLHttpRequest) {
                    console.log(XMLHttpRequest.status);
                    if (XMLHttpRequest.status === 200) alert('获取品类数据服务器发生错误');
                }
            });

        });
        //营运录入点击保存事件
        page.on("click", ".js-edit-turnover .zl-save-btn", function (e) {
            e.stopPropagation();
            e.preventDefault();
            //var ysLoading = $(".zl-loading");
           // ysLoading.fadeIn();
           // ysLoading.fadeOut();
            var $elem = $(this);
            var saleAmount = $elem.closest('tr').find('input[name=saleAmount]');
            var saleDayCount = $elem.closest('tr').find('input[name=saleDayCount]');
            console.log(saleAmount);
            console.log(saleDayCount);
            if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount.val().trim())) {
                alert('请输入正确的销售额');
                saleAmount.focus();
                return false;
            }

            if (!/^(\d{1,8})$/.test(saleDayCount.val().trim())) {
                alert('请输入正确销售笔数');
                saleDayCount.focus();
                return false;
            }
            var contNo = $('#contNo').val();
            var saleYmd = $elem.closest('tr').find('input[name=saleYmd]').val();
            var categoryCode = $elem.closest('tr').find('input[name=categoryCode]').val();
            var categoryName = $elem.closest('tr').find('input[name=categoryName]').val();
            var saleDayId = $elem.closest('tr').find('input[name=saleDayId]').val();
            var data = {
                'saleDayId': saleDayId,
                'saleYmd': saleYmd,
                'saleAmount': saleAmount.val(),
                'saleDayCount': saleDayCount.val(),
                'contNo': contNo,
                'saleAmountType': '2',
                'categoryCode': categoryCode,
                'categoryName': categoryName
            };

            $.post(managementWeb_Path + 'sale/day/insert.htm', data, function (res) {
                console.log(res);
                if (res.status === 1) {
                    alert('录入成功','','',function () {
                        location.reload(true);
                    });
                } else {
                    alert('录入失败');
                    setTimeout(function () {
                        console.log($elem.closest("td"));
                        $elem.closest("td").removeClass("editing");
                        $elem.closest("tr").find(".js-edit-turnover input").attr("readonly", "readonly").data("tmpValue", null);
                        $(".zl-loading").fadeOut();
                    }, 600);
                }
            }, 'json');
        });
        //营运录入按钮取消事件
        page.on("click", ".js-edit-turnover .zl-cancel-btn", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var $elem = $(this);
            $elem.closest("td").removeClass("editing");
        });
        //营运预估Input focus的事件
        page.on("focus", ".js-edit-forecast input", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).closest("tr").find(".js-edit-forecast").addClass("editing");
            $(this).data("tmpValue", $(this).val()).removeAttr("readonly");
        });
        //营运预估点击保存事件
        page.on('click', '.js-edit-forecast .zl-save-btn', function (e) {
            e.stopPropagation();
            e.preventDefault();
           // $(".zl-loading").fadeIn();
            var $elem = $(this);
            var saleAmount = $elem.closest('td').prev().find('input[name=OpEstimateSale]').val();
            if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                alert('请输入正确的预估销售额');
                return false;
            }

            var contNo = $('#contNo').val();
            var saleYmd = $elem.closest('tr').find('input[name=saleYmd]').val();
            var saleDayId = $elem.closest('tr').find('input[name=saleDayId]').val();
            var data = {
                'saleDayId': saleDayId,
                'contNo': contNo,
                'saleYmd': saleYmd,
                'saleAmount': saleAmount,
                'saleAmountType': '3'
            };
            $.post(managementWeb_Path + 'sale/day/insert.htm', data, function (res) {
                if (res.status === 1) {
                    location.reload(true);
                } else {
                    alert('录入失败');
                    setTimeout(function () {
                        console.log($elem.closest("td"));
                        $elem.closest("td").removeClass("editing");
                        $elem.closest("tr").find(".js-edit-turnover input").attr("readonly", "readonly").data("tmpValue", null);
                        //$(".zl-loading").fadeOut();
                    }, 600);
                }
            }, 'json');

        });
        //营运预估取消事件
        page.on('click', '.js-edit-forecast .zl-cancel-btn', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var $elem = $(this);
            $elem.closest("td").removeClass("editing");
        });
        //月历下一页
        page.on("click", "#zl-date-next", function (e) {
            e.stopPropagation();
            e.preventDefault();
            skip(1);
        });
        //月历上一页
        page.on("click", "#js-date-pre", function (e) {
            e.stopPropagation();
            e.preventDefault();
            skip(-1);
        });
        //审核按钮
        page.on("click", "#js-reviewed-confirm", function () {
            var contNo = $('#contNo').val();
            var monthId = $('#monthId').val();
            var saleYmd = $('#currentDate').val().replace('-', '');
            var data = {status: '0', contNo: contNo, saleMonthId: monthId, saleYmd: saleYmd};
            $.post(managementWeb_Path + 'sale/day/review.htm', data, function (res) {
                if (res.status === 1) {
                    alert(res.msg,'','',function () {location.reload(true);});
                } else {
                    alert('审核失败');
                }
            }, 'json');
        });
        //月表返回事件
        page.on("click","#js-month-sale",function (e) {
            e.preventDefault();
            e.stopPropagation();
            var saleYm=$('#currentDate').val().replace('-','');
            var random=new Date().getTime();
            window.location.href=managementWeb_Path+'sale/month/index.htm?saleYm='+saleYm+'&random='+random;
        });

        $('#currentDate').datetimepicker({
            language:'zh-CN',
            format:'yyyy-mm',
            startView:3,
            minView : 3,
            endDate : new Date()
        }).on('changeDate',function () {
            var saleYm=$(this).val().replace('-', '');
            var contNo = $('#contNo').val();
            $.getJSON(managementWeb_Path+'sale/day/query/list.htm',{saleYmd:saleYm,contNo:contNo},function (res) {
                if(!res||res.length===0){
                    alert(saleYm.substring(0,4)+'年'+saleYm.substring(4,6)+'月没有数据...','','',function () {
                        location.reload();
                    });
                }else{
                    location.href =managementWeb_Path + 'sale/day/index.htm?saleYmd=' + saleYm + '&contNo=' + contNo;
                }
            });
        });

    }


    return baseView;

})(jQuery);


$(document).ready(function () {
    baseView.init();
});


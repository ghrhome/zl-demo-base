var saleDayView = (function ($) {
    var saleDayView = {};

    $("#preloader").fadeOut("fast");

    var page = $("#sale-detail");

    var url={
        checkAdjust:managementWeb_Path + 'sale/day/check/adjust.htm'
    };
    //品类编码
    var categoryCode = $('#categoryCode').val();
    //品类名称
    var categoryName = $('#categoryName').val();
    //合同编号
    var contNoValue = $('#contNo').val();
    //月表ID
    var monthIdValue = $('#monthId').val();
    //项目ID
    var mallIdValue=$('#mallId').val();
    //当前input年月
    var currentDateValue = $('#currentDate').val().replace('-', '');

    saleDayView.init = function () {
        bindEvent();
        renderFooter();
    };

    //渲染当前月份有几天
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
        console.log(saleYmd);
        console.log(categoryCode);
        $.getJSON(managementWeb_Path + 'sale/day/query/month.htm', {
            saleYm: saleYmd,
            categoryCode: categoryCode
        }, function (res) {
            if (res && res.status === 1) {
                location.href = dayUrl(saleYmd, res.data);
            } else {
                alert("上个月没有数据");
            }
        });
    }

    function dayUrl(saleYm, monthId) {
        var str = managementWeb_Path + 'sale/day/index.htm?saleYmd=' + saleYm;
        str += '&categoryCode=' + categoryCode + '&monthId=' + monthId;
        str += '&contNo=' + contNoValue + '&categoryName=' + categoryName+'&mallId='+mallIdValue;
        return str;
    }

    function addMonth(value, month) {
        var date = new Date(value);
        date.setMonth(date.getMonth() + month);
        var num = date.getMonth() + 1;
        if (num < 10) num = 0 + "" + num;
        return date.getFullYear() + '-' + num;
    }

    function review(data) {
        $.post(managementWeb_Path + 'sale/day/review.htm', data, function (res) {
            console.log(res);
            if (res.status === 1) {
                $("#js-contract-category-dialog").modal("hide");
                alert('审核成功', '', '', function () {
                    location.reload(true);
                });
            } else {
                alert('审核失败,请稍候重试');
            }
        }, 'json');
    }

    function verify() {
        var saleList=[];
        var trAll=$('#js-table-edit').find('tr:gt(1)');
        for(var i=0;i<trAll.length;i++){
            var $tr=$(trAll[i]);
            var $saleAmount=$tr.closest('tr').find('input[name=saleAmount]');
            var $saleCount=$tr.closest('tr').find('input[name=saleDayCount]');
            var $opsEstAmount=$tr.closest('tr').find('input[name=opsEstAmount]');

            var saleAmount=$saleAmount.val();
            var saleCount=$saleCount.val();
            var opsEstAmount=$opsEstAmount.val();

            if(saleAmount) saleAmount=saleAmount.trim();
            if(saleCount) saleCount.trim();
            if(opsEstAmount) opsEstAmount=opsEstAmount.trim();


            var excelAmount = $tr.closest('tr').find('.excel-amount').text().trim();
            if(excelAmount==='-')excelAmount=null;
            var tenantAmount=$tr.closest('tr').find('.tenant-amount').text().trim();
            if(tenantAmount==='-')tenantAmount=null;


            var saleYmd = $tr.closest('tr').find('input[name=saleYmd]').val();
            var saleDayId = $tr.closest('tr').find('input[name=saleDayId]').val();


            if(!saleAmount&&!saleCount&&!opsEstAmount&&!saleDayId){
                //ignore      //没有填写的忽略
            }else{
                if(opsEstAmount){ //营运预估
                    if (!/^(\d{1,8})(\.\d{1,2})?$/.test(opsEstAmount)) {
                        $("#modal-sale-adjust").modal("hide");
                        alert('请输入正确的预估的销售额','','',function () {
                            $opsEstAmount.focus();
                        });
                        return false;
                    }
                    if(saleAmount||saleCount){
                        if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                            $("#modal-sale-adjust").modal("hide");
                            alert('请输入正确的销售额','','',function () {
                                $saleAmount.focus();
                            });

                            return false;
                        }
                        if (!/^(\d{1,8})$/.test(saleCount)) {
                            $("#modal-sale-adjust").modal("hide");
                            alert('请输入正确的销售笔数','','',function () {
                                $saleCount.focus();
                            });
                            return false;
                        }
                    }
                }else if(tenantAmount){ //租户上报
                    if(saleAmount||saleCount){
                        if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                            $("#modal-sale-adjust").modal("hide");
                            alert('请输入正确的销售额','','',function () {
                                $saleAmount.focus();
                            });
                            return false;
                        }
                        if (!/^(\d{1,8})$/.test(saleCount)) {
                            $("#modal-sale-adjust").modal("hide");
                            alert('请输入正确的销售笔数','','',function () {
                                $saleCount.focus();
                            });
                            return false;
                        }
                    }
                }else if(excelAmount){ //excel导入
                    if(saleAmount||saleCount){
                        $("#modal-sale-adjust").modal("hide");
                        if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                            alert('请输入正确的销售额','','',function () {
                                $saleAmount.focus();
                            });
                            return false;
                        }
                        if (!/^(\d{1,8})$/.test(saleCount)) {
                            $("#modal-sale-adjust").modal("hide");
                            alert('请输入正确的销售笔数','','',function () {
                                $saleCount.focus();
                            });
                            return false;
                        }
                    }
                }else{ //营运录入
                    if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                        $("#modal-sale-adjust").modal("hide");
                        alert('请输入正确的销售额','','',function () {
                            $saleAmount.focus();
                        });
                        return false;
                    }
                    if (!/^(\d{1,8})$/.test(saleCount)) {
                        $("#modal-sale-adjust").modal("hide");
                        alert('请输入正确的销售笔数','','',function () {
                            $saleCount.focus();
                        });
                        return false;
                    }
                }
                var data = {
                    'id': saleDayId,
                    'monthId': monthIdValue,
                    'saleYmd': saleYmd,
                    'opsAmount': saleAmount,
                    'opsCount': saleCount,
                    'opsEstAmount':opsEstAmount
                };
                saleList.push(data);
            }
        }

        return saleList;
    }


    function bindEvent() {
        //销售调整按钮点击事件
        $('#js-sale-adjust-btn').on('click',function () {
            var reason=$('#js-sale-adjust-reason').val();
            var $saleAdjust=$('#js-sale-adjust-info').empty();
            if(!reason){
                $saleAdjust.append('请输入销售调整原因');
                return false;
            }
            if(reason.length>255){
                $saleAdjust.append('最大输入255字符');
                return false;
            }
            var saleArray=verify();
            if(saleArray){
                var params={
                    saleList:saleArray,
                    reason:reason,
                    monthId:monthIdValue,
                    saleYm:currentDateValue
                };
                $.ajax({
                    type: "post",
                    url: managementWeb_Path+'sale/day/adjust.htm',
                    data: JSON.stringify(params),//将对象序列化成JSON字符串
                    dataType:"json",
                    contentType : 'application/json;charset=utf-8', //设置请求头信息
                    success: function(res){
                        $("#modal-sale-adjust").modal("hide");
                        if(res.status===1){
                            alert('调整成功','','',function () {
                                location.reload(true);
                            });
                        }else{
                            alert('调整失败');
                        }
                    },
                    error: function(){
                        alert('调整失败,请重试');
                    }
                });
            }
        });
        //审核按钮
        page.on("click", "#js-reviewed-confirm", function () {
            var trAll=$('#js-table-edit').find('tr:gt(1)');
            var flag=false;
            for(var i=0;i<trAll.length;i++){
                var $tr=$(trAll[i]);
                var saleDayId = $tr.closest('tr').find('input[name=saleDayId]').val();
                if(saleDayId) flag=true;
            }
            if(!flag){
                alert('请先输入营业额数据');
                return false;
            }

            //净销售额
            var $netSales=$('#js-net-sales');
            if($netSales[0]&&!$netSales.val().trim()){
                alert('请先输入月净销售总额');
                return false;
            }

            $.getJSON(managementWeb_Path + 'sale/day/check/category.htm',{saleYm:currentDateValue,contNo:contNoValue},function (res) {
                var data = {saleYm: currentDateValue, contNo: contNoValue, id: monthIdValue,netSale:$netSales.val()};
                //当多品类的时候
                if(res&&res.data.length>1){
                    var dialog= $("#js-contract-category-dialog");
                    dialog.modal("show");
                    var source=$('#category-tpl').html();
                    var template = Handlebars.compile(source);
                    var html=template({'categoryList':res.data});
                    dialog.find('tbody').empty().append(html);
                    dialog.find('tbody tr').off().on('click',function () {
                        var categoryCode=$(this).find('td').get(1).innerHTML;
                        $.getJSON(managementWeb_Path + 'sale/day/query/month.htm', {
                            saleYm: currentDateValue,
                            categoryCode: categoryCode
                        }, function (res) {
                            if (res && res.status === 1) {
                                location.href = dayUrl(currentDateValue, res.data);
                            }
                        });
                    });
                    dialog.find('.zl-dialog-btn-ok').off().on('click',function () {
                        review(data);
                    });
                }else{
                    review(data);
                }
            });

        });


        //批量保存事件
        page.on('click',"#js-batch-save",function () {
            var saleList=[];
            var trAll=$('#js-table-edit').find('tr:gt(1)');
            for(var i=0;i<trAll.length;i++){
                var $tr=$(trAll[i]);
                var $saleAmount=$tr.closest('tr').find('input[name=saleAmount]');
                var $saleCount=$tr.closest('tr').find('input[name=saleDayCount]');
                var $opsEstAmount=$tr.closest('tr').find('input[name=opsEstAmount]');

                var saleAmount=$saleAmount.val();
                var saleCount=$saleCount.val();
                var opsEstAmount=$opsEstAmount.val();

                if(saleAmount) saleAmount=saleAmount.trim();
                if(saleCount) saleCount.trim();
                if(opsEstAmount) opsEstAmount=opsEstAmount.trim();


                var excelAmount = $tr.closest('tr').find('.excel-amount').text().trim();
                if(excelAmount==='-')excelAmount=null;
                var tenantAmount=$tr.closest('tr').find('.tenant-amount').text().trim();
                if(tenantAmount==='-')tenantAmount=null;


                var saleYmd = $tr.closest('tr').find('input[name=saleYmd]').val();
                var saleDayId = $tr.closest('tr').find('input[name=saleDayId]').val();


                if(!saleAmount&&!saleCount&&!opsEstAmount&&!saleDayId){
                    //ignore      //没有填写的忽略
                }else{
                    if(opsEstAmount){
                        if (!/^(\d{1,8})(\.\d{1,2})?$/.test(opsEstAmount)) {
                            alert('请输入正确的预估的销售额','','',function () {
                                $opsEstAmount.focus();
                            });
                            return false;
                        }
                        if(saleAmount||saleCount){
                            if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                                alert('请输入正确的销售额','','',function () {
                                    $saleAmount.focus();
                                });
                                return false;
                            }
                            if (!/^(\d{1,8})$/.test(saleCount)) {
                                alert('请输入正确的销售笔数','','',function () {
                                    $saleCount.focus();
                                });
                                return false;
                            }
                        }
                    }else if(tenantAmount){
                        if(saleAmount||saleCount){
                            if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                                alert('请输入正确的销售额','','',function () {
                                    $saleAmount.focus();
                                });
                                return false;
                            }
                            if (!/^(\d{1,8})$/.test(saleCount)) {
                                alert('请输入正确的销售笔数','','',function () {
                                    $saleCount.focus();
                                });
                                return false;
                            }
                        }
                    }else if(excelAmount){
                        if(saleAmount||saleCount){
                            if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                                alert('请输入正确的销售额','','',function () {
                                    $saleAmount.focus();
                                });
                                return false;
                            }
                            if (!/^(\d{1,8})$/.test(saleCount)) {
                                alert('请输入正确的销售笔数','','',function () {
                                    $saleCount.focus();
                                });
                                return false;
                            }
                        }
                    }else{
                        if (!/^(\d{1,8})(\.\d{1,2})?$/.test(saleAmount)) {
                            alert('请输入正确的销售额','','',function () {
                                $saleAmount.focus();
                            });
                            return false;
                        }
                        if (!/^(\d{1,8})$/.test(saleCount)) {
                            alert('请输入正确的销售笔数','','',function () {
                                $saleCount.focus();
                            });
                            return false;
                        }
                    }
                    var data = {
                        'id': saleDayId,
                        'monthId': monthIdValue,
                        'saleYmd': saleYmd,
                        'opsAmount': saleAmount,
                        'opsCount': saleCount,
                        'opsEstAmount':opsEstAmount
                    };
                    saleList.push(data);
                }
            }
            if(saleList.length===0){
               alert('没有输入数据,无需保存');
            }else{
                var params={
                  monthId:monthIdValue,
                  saleList:saleList,
                    saleYm:currentDateValue
                };

                $.ajax({
                    type: "POST",
                    url: managementWeb_Path+'sale/day/batch/save.htm',
                    data:   JSON.stringify(params)  ,//将对象序列化成JSON字符串
                    dataType:"json",
                    contentType : 'application/json;charset=utf-8', //设置请求头信息
                    success: function(res){
                        if(res.status===1){
                            alert('保存成功','','',function () {
                                location.reload(true);
                            });
                        }else{
                            alert('保存失败');
                        }
                    },
                    error: function(){
                        alert('保存失败,未知原因');
                    }
                });
            }

        });

        //净销售额事件
        page.on("click", "#js-net-sales-save", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var netSaleAmount = $('#js-net-sales').val();
            if (!/^(\d{1,18})(\.\d{1,2})?$/.test(netSaleAmount.trim())) {
                alert('请输入正确的月净销售总额');
                return false;
            }
            var confirmAmountTotal=$('#confirmAmountTotal').html();
            if(netSaleAmount&&confirmAmountTotal){
                var diff=parseInt(confirmAmountTotal.replaceAll(',',''))-parseInt(netSaleAmount);
                if(diff<0){
                    alert('净销售额不能大于确认销售额');
                    return false;
                }
            }
            $.post(managementWeb_Path + 'sale/day/save/netSale.htm', {netSale: netSaleAmount, id: monthIdValue},
                function (res) {
                    if (res.status === 1) {
                        alert('保存成功');
                    } else {
                        alert('保存失败');
                    }
                }, 'json');

        });

        //销售调整modal
        page.on('click','#js-sale-adjust',function () {
            //$("#modal-sale-adjust").modal("show");
            $.getJSON(url.checkAdjust, {contNo:contNoValue,saleYm:currentDateValue},function (res) {
                if(res&&res.data){
                    $("#modal-sale-adjust").modal("show")
                }else {
                    alert('不能修改,请走销售修订k2审批');
                }
            });
        });

        //月历翻月 event ===============>>>>>>>>>>>>>>
        page.on("click", "#zl-date-next", function (e) {
            e.stopPropagation();
            e.preventDefault();
            skip(1);
        });
        page.on("click", "#js-date-pre", function (e) {
            e.stopPropagation();
            e.preventDefault();
            skip(-1);
        });
        //月历翻月 event <<<<<<<<<<<<<<<===============

        //返回月表 event
        page.on("click", "#js-month-sale", function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(currentDateValue);
            window.location.href = managementWeb_Path + 'sale/month/index.htm?saleYm=' + currentDateValue +'&mallId='+mallIdValue ;
        });

        //选择月历
        $('#currentDate').datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm',
            startView: 3,
            minView: 3,
            endDate: new Date()
        }).on('changeDate', function () {
            var saleYm = $(this).val().replace('-', '');
            $.getJSON(managementWeb_Path + 'sale/day/query/month.htm', {
                saleYm: saleYm,
                categoryCode: categoryCode
            }, function (res) {
                if (res && res.status === 1) {
                    location.href = dayUrl(saleYm, res.data);
                } else {
                    alert('选择的月份没有数据', '', '', function () {
                        $('#currentDate').val(currentDateValue.substring(0, 4) + '-' + currentDateValue.substring(4, 6));
                    });
                }
            });
        });
    }

    return saleDayView;
})(jQuery);


$(document).ready(function () {
    saleDayView.init();
});


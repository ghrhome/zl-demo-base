$(document).ready(function() {
    var _mallId = '';
    var _companyId='';
    var _companyDataSource = '' ;
    var _contractDataSource = '' ;
    // var _contNo='';
    $.ajax({
        url: financeWeb_Path + "feeReceivable/getAllMallName.htm",
        type: "post",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            // var dataSource = data;

            var _source=$.map(data, function (item) {
                return {
                    label: item.mallName,
                    value: item.mallName,
                    id:item.id
                }
            });
            $("#js-mall").autocomplete({
                minLength: 2,
                source:_source,
                // source: function (request, response) {
                //         response($.map(dataSource, function (item) {
                //             return {
                //                 label: item.mallName,
                //                 value: item.id
                //             }
                //         }));
                //     },
                select: function (event, ui) {
                    // console.log(ui)
                    this.value = ui.item.label;
                    $("#mallId").val(ui.item.id);
                    _mallId = ui.item.id;

                    $.ajax({
                        url: financeWeb_Path + "feeReceivable/getAllCompanyByMallId.htm?mallId=" + _mallId,
                        type: "post",
                        dataType: "json",
                        success: function (response) {
                            console.log(response);
                            if(response.length>0) {
                                $("#js-company").attr("readonly",false);
                                _companyDataSource = $.map(response, function (item) {
                                    return {
                                        label: item.companyName,
                                        value: item.companyName,
                                        id: item.companyId,
                                    }
                                });
                                $("#js-company").autocomplete({
                                    source: _companyDataSource,
                                    minLength: 2,
                                    select: function (event, ui) {
                                        console.log(ui)
                                        this.value = ui.item.label;
                                        $("#companyId").val(ui.item.id);
                                        _companyId = ui.item.id;

                                        $.ajax({
                                            url: financeWeb_Path + "feeReceivable/selectContByCompanyId.htm?companyId=" + _companyId,
                                            type: "post",
                                            dataType: "json",
                                            success: function (response) {
                                                console.log(response);
                                                if(response.length>0) {
                                                    $("#js-contract").attr("readonly", false);
                                                    _contractDataSource = $.map(response, function (item) {
                                                        return {
                                                            label: item.contNo,
                                                            value: item.contNo,
                                                            storeNos: item.storeNos,
                                                            storeIds: item.storeIds,
                                                            layout: item.layoutCode,
                                                            brandId: item.brandId,
                                                            brandName: item.brandName
                                                        }
                                                    });

                                                    $("#js-contract").autocomplete({
                                                        source: _contractDataSource,
                                                        minLength: 1,
                                                        select: function (event, ui) {
                                                            console.log(ui)
                                                            this.value = ui.item.label;
                                                            $("#brandId").val(ui.item.brandId);
                                                            $("#brandName").val(ui.item.brandName);
                                                            $("#storeIds").val(ui.item.storeIds);
                                                            $("#storeNos").val(ui.item.storeNos);
                                                            $("#layout").val(ui.item.layout);
                                                            $("#layoutName").val(JSON.parse(layoutMap)[(ui.item.layout)]);
                                                            // _contNo = ui.item.label;
                                                            return false;
                                                        }
                                                    })
                                                }else {
                                                        alert("该租户无合同信息")
                                                    $("#js-contract").attr("readonly",true);
                                                    }
                                            }
                                        })
                                        return false;
                                    }
                                })
                            }else {
                                alert("该项目无租户信息")
                                $("#js-company").attr("readonly",true);
                                $("#js-contract").attr("readonly",true);
                            }

                        }
                    })
                    return false;
                },
            });
           $("#js-only-mall").autocomplete({
                source: _source,
                minLength: 2,
                select: function( event, ui ) {
                    var mallId = ui.item.id;
                    $("#mallId").val(mallId);
                    this.value = ui.item.label;
                    return false;
                }
            });
        }
    });


})
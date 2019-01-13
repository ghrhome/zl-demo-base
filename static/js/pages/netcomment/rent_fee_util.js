function calcFixedTable(_obj,feeType) {
    _obj = $(_obj);
    //获取所在行
    var _tr = $(_obj).parents("tr")[0];
    var apply = parseFloat(_obj.val()) || 0;
    //根据计租面积选择类型 获取面积
    var squareType = $("input[name=squareType]").val() == null ? 0 : $("input[name=squareType]").val();
    var square = parseFloat($("#structureSquare").val());
    if (squareType == '1') {
        square = parseFloat($("#innerSquare").val());
    }
    if (isNaN(square)) {
        alert("面积数值不符合规范！");
    }
    var taxRate = parseFloat($(_tr).find("input[name$=taxRate]").val());
    var unitType = "";
    if (isNaN(taxRate)) {
        //默认税率为6%
        if ("01" == feeType) {
            //租金
            taxRate = parseFloat($("#rentTaxRate").val()) || 0;
            unitType = $("#rent-table :radio[name$=unitType]:checked:enabled").val();
        } else if ("02" == feeType) {
            taxRate = parseFloat($("#managementTaxRate").val()) || 0;
            unitType = $("#management-div :radio[name$=unitType]:checked:enabled").val();
        } else if ("07" == feeType) {
            //空调服务费
            taxRate = parseFloat($("#condTaxRate").val()) || 0;
            unitType = $("#cond-div :radio[name$=unitType]:checked:enabled").val();
        } else if ("05" == feeType) {
            //写字楼
            taxRate = parseFloat($("#proTaxRate").val()) || 0;
            unitType = 'm';//月付
        } else {
            taxRate = 17;
        }

        //taxRate = 6;
    }
    var standard = parseFloat($(_tr).find("input[name$=standard]").val() || 0);
    if (standard == 0) {
        standard = parseFloat($(_tr).find("input[name$=budget]").val() || 0);
    }


    // 0 含税 1不含税
    var taxType = $(":radio[name$=taxType]:checked:enabled").val();

    var monthApply = 0;
    if (unitType == 'd') {
        //选择为日单价
        monthApply = apply * 365 / 12;
    } else if (unitType == 'm') {
        monthApply = apply;
    }

    var totalMonth = monthApply * square;

    if ("01" == feeType && unitType == 'a') {
        //租金选择 月总额的选项
        totalMonth = apply;
        // 月总额 复制给变量 作为月单价显示在页面
        apply = (apply / square).toFixed(2);
        $(_tr).find("input[name$=apply]").val(apply);
    } else {
        $(_tr).find("input[name$=totalMonth]").val(totalMonth.toFixed(2));
    }


    var noTaxTotalMonth = taxRate > 0 ? totalMonth / (1 + taxRate / 100) : totalMonth;
    //var taxMonth = totalMonth * taxRate / 100;
    var taxMonth = totalMonth - noTaxTotalMonth;
    var discountRate = standard != 0 ? (apply / standard * 100).toFixed(2) : "";
    //使用面积租金单价（元/㎡/月）值=月租金总额/使用面积
    var rentUnitPrice;
    var innerSquare=$("#innerSquare").val();
    if(isNaN(totalMonth)||isNaN(innerSquare)){
        rentUnitPrice=0;
    }else {
        rentUnitPrice=Number(totalMonth/innerSquare).toFixed(2);
    }
    $(_tr).find("input[name$=rentUnitPrice]").val(rentUnitPrice);

    $(_tr).find("input[name$=discountRate]").val(discountRate);
    if (taxType == 0) {
        $(_tr).find("input[name$=noTaxTotalMonth]").val(noTaxTotalMonth.toFixed(2));
        $(_tr).find("input[name$=taxMonth]").val(taxMonth.toFixed(2));
        $(_tr).find("input[name$=taxTotalMonth]").val(taxMonth.toFixed(2));
    } else {
        $(_tr).find("input[name$=noTaxTotalMonth]").val(totalMonth.toFixed(2));
        taxMonth = totalMonth * (taxRate/100);
        $(_tr).find("input[name$=taxMonth]").val(taxMonth.toFixed(2));
        $(_tr).find("input[name$=taxTotalMonth]").val(taxMonth.toFixed(2));
        totalMonth = totalMonth + taxMonth;
        $(_tr).find("input[name$=totalMonth]").val(totalMonth.toFixed(2));
    }
}

function calcDeductTable(_obj) {
    _obj = $(_obj);
    //获取所在行
    var _tr = $(_obj).parents("tr")[0];
    var revenueApply = parseFloat($(_tr).find("input[name$=revenueApply]").val()) || 0;
    var discountApply = parseFloat($(_tr).find("input[name$=discountApply]").val()) || 0;

    if (!revenueApply || !discountApply) {
        return false;
    }

    var square = parseFloat($("#structureSquare").val());
    var taxRate = parseFloat($(_tr).find("input[name$=taxRate]").val());
    var standard = parseFloat($(_tr).find("input[name$=standard]").val() || 0);

    var totalMonth = revenueApply * discountApply / 100;
    var noTaxTotalMonth = totalMonth / (1 + taxRate / 100);
    //var taxMonth = totalMonth * taxRate / 100;
    var taxMonth = totalMonth - noTaxTotalMonth;
    var discountRate = ($(_tr).find("input[name$=standard]").val() && standard != 0) ? ( totalMonth / (standard * square) * 100).toFixed(2) : "";

    $(_tr).find("input[name$=noTaxTotalMonth]").val(noTaxTotalMonth.toFixed(2));
    $(_tr).find("input[name$=taxMonth]").val(taxMonth.toFixed(2));
    $(_tr).find("input[name$=discountRate]").val(discountRate);
}

function calcBothTable(_obj) {
    _obj = $(_obj);
    //获取所在行
    var _tr = $(_obj).parents("tr")[0];
    var revenueApply = parseFloat($(_tr).find("input[name$=revenueApply]").val()) || 0;
    var discountApply = parseFloat($(_tr).find("input[name$=discountApply]").val()) || 0;
    var apply = parseFloat($(_tr).find("input[name$=apply]").val() || 0);

    if (!revenueApply || !discountApply) {
        return false;
    }

    var square = parseFloat($("#structureSquare").val());
    var taxRate = parseFloat($(_tr).find("input[name$=taxRate]").val());
    var standard = parseFloat($(_tr).find("input[name$=standard]").val() || 0);

    var totalMonth = revenueApply * discountApply / 100;
    var noTaxTotalMonth = totalMonth / (1 + taxRate / 100);
    //var taxMonth = totalMonth * taxRate / 100;
    var taxMonth = totalMonth - noTaxTotalMonth;
    var discountRate = ($(_tr).find("input[name$=standard]").val() && standard != 0) ? (totalMonth / (standard * square) * 100).toFixed(2) : "";
    var totalMonthApply = apply * square;

    $(_tr).find("input[name$=noTaxTotalMonth]").val(noTaxTotalMonth.toFixed(2));
    $(_tr).find("input[name$=taxMonth]").val(taxMonth.toFixed(2));
    $(_tr).find("input[name$=discountRate]").val(discountRate);
    $(_tr).find("input[name$=totalMonth]").val(totalMonthApply.toFixed(2));
}

//价格格式
function priceFormat() {
	// 单价格式(两位小数)
	unitPriceList = $("input[class='unitPrice']");
	for (var i = 0; i < unitPriceList.length; i++) {
		unitPrice = parseFloat($(unitPriceList[i]).val()).toFixed(2);
		if(!isNaN(unitPrice)){
			$(unitPriceList[i]).val(unitPrice);
		}
	}
	// 年价格式(取整)
	yearPriceList = $("input[class='yearPrice']");
	for (var i = 0; i < yearPriceList.length; i++) {
		yearPrice = parseFloat($(yearPriceList[i]).val()).toFixed(0);
		if(!isNaN(yearPrice)){
			$(yearPriceList[i]).val(yearPrice);
		}
	}
}
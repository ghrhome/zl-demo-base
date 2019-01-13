var pageView=(function($){
    var pageView={};
    var container=$("#contract_change_add");
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        bindEvent();
    };
    function bindEvent(){
        //主体变更类型单选
        container.on("click",".contract_change_radio_group .input-addon",function(){
            var rentId=$(this).find("input[type=radio]").attr("id");
            $(".contract_change_section").removeClass("show");
            $(".contract_change_section[data-id="+rentId+"]").addClass("show");
        });

        //租金方式单选
    	container.on("click",".rent_way_radio_group .input-addon",function(){
    		var rentId=$(this).find("input[type=radio]").attr("id");
    		$("#rental-table-wrapper table").removeClass("show");
    		$("#rental-table-wrapper table[data-id="+rentId+"]").addClass("show");
            if(rentId!="gdRent") {
                container.find(".point_way_radio_group .input-addon").show();
            }else{
                container.find(".point_way_radio_group .input-addon").hide();
            }
    	});

        //物业管理费单选
        container.on("click",".property_management_fee_radio .input-addon",function(){
            var rentId=$(this).find("input[type=radio]").attr("id");
            $("#property-table-wrapper table").removeClass("show");
            $("#property-table-wrapper table[data-id="+rentId+"]").addClass("show");
        });

        //宣传推广费单选
        container.on("click",".promote_fee_radio .input-addon",function(){
            var rentId=$(this).find("input[type=radio]").attr("id");
            $("#promote-table-wrapper table").removeClass("show");
            $("#promote-table-wrapper table[data-id="+rentId+"]").addClass("show");
        });
    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});
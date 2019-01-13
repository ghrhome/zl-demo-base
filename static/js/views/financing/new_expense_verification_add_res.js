var pageView=(function($){
    var pageView={};
    var container=$("#new_expense_verification_add");
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var ys_main_swiper_2 = new Swiper('#zl-floor-main-table-2', {
	        scrollbar: '.swiper-scrollbar-b',
	        slidesPerView: 'auto',
	        freeMode: true,
	        scrollbarHide:false
    	});
    	var ys_main_swiper = new Swiper('#zl-floor-main-table', {
	        scrollbar: '.swiper-scrollbar-a',
	        slidesPerView: 'auto',
	        freeMode: true,
	        scrollbarHide:false
    	});
    	$(".zl-datetimepicker input").datetimepicker({
    		format:"yyyy-mm",
            todayBtn:"linked",
            startView:3,
            minView:3,
            autoclose: true,
            language:"zh-CN"
    	}).on("changeDate",function(){
    		console.log(123);
    	})
    };
    pageView.bindEvent=function(){
        var dataIdArr=[];
        var operationArr=[];
        //点击左侧
        $("body").on("click",".receipt_table tbody tr",function(e){
            $("td.td_content").css("background-color","white");
            $(this).find("td.td_content").css("background-color","lightBlue");
            e.stopPropagation();
            console.log($(this).offset().top);
            var dataId=$(this).data("id");
            if(dataIdArr.indexOf(dataId)>=0) return;
            dataIdArr.push(dataId);
            var html='<tr data-id="'+dataId+'"><td>公共事业费保证金</td>'+
                    '<td class="zl-edit">'+
                    '<input type="text" class="form-control special-input">'+
                    '</td>'+
                    '<td class="leiji">0</td>'+
                    '<td class="all">2000</td>'+
                    '<td class="shengyu">2000</td></tr>';
            $(".expense_statement_right table tbody").append(html);
        });
        //右侧blur
        $("body").on("blur",".expense_statement_right table tbody input",function(){
            var dataId=$(this).parents("tr").data("id");
            var amount=$(this).val();
            var html2='<tr data-id="'+dataId+'">'+
                        '<td>收款单单号：PM-0725006，核销应收单号：A0456432，核销金额：<span class="reduceValue">'+amount+'</span></td>'+
                        '<td><em class="glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red"></em></td>'+
                        '</tr>';
            if(amount!=""){                
                $(this).parents("tr").find(".leiji").html(amount);
                $(this).parents("tr").find(".shengyu").html(parseFloat($(this).parents("tr").find(".all").html())-parseFloat(amount));
                if(operationArr.indexOf(dataId)<0){
                    operationArr.push(dataId);
                    $(".operationTable tbody").append(html2);
                }else{
                    $(".operationTable tbody tr[data-id="+dataId+"] .reduceValue").html(amount);
                }
               
            }
            $(this).val("");
            
        });
        //删除按钮
        $("body").on("click",".operationTable .glyphicon-minus-sign",function(){
            var dataId=$(this).parents("tr").data("id");
            var reduceValue=parseFloat($(this).parents("tr").find(".reduceValue").html());
            $(".expense_statement_right table tbody tr[data-id="+dataId+"] .leiji").html(0);
            $(".expense_statement_right table tbody tr[data-id="+dataId+"] .shengyu").html(parseFloat($(".expense_statement_right table tbody tr[data-id="+dataId+"] .shengyu").html())+reduceValue);
            $(this).parents("tr").remove();
            operationArr.splice($.inArray(dataId,operationArr),1);
            console.log(operationArr);
        });
        $("body").on("click",function(e){
            if(!$(e.target).hasClass("expense_statement_info")){
                $(".expense_statement_info").hide();
            }
        });
        $(".expense_statement_info").on("click",function(e){
            e.stopPropagation();
        });
        //点击详情按钮
        $("body").on("click",".receipt_table tbody tr .detail",function(e){
            e.stopPropagation();
            $(".expense_statement_info").show().css("top",$(this).parents("tr").offset().top-355+"px");
        })
    }

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
    pageView.bindEvent();
    console.log("")
});


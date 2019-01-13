(function(){
    $("#preloader").fadeOut("fast");
    var page = $("#sale-detail");

    $(".js-warn-text").tooltip({
        placement:"right",
        html:true,
        template:'<div class="tooltip tooltip-warn" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });

    $(".js-alert-text").tooltip({
        placement:"right",
        html:true,
        template:'<div class="tooltip tooltip-alert" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });

    $(".js-info-text").tooltip({
        placement:"right",
        html:true,
        template:'<div class="tooltip tooltip-info" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });


    $("#js-net-sales").on("input",function(e){
        $(this).next(".zl-linkable").removeAttr("disabled");
    });

    $("#js-net-sales-save").on("click",function(e){

        if($(this).attr("disabled")){
            return;
        }

        $(".zl-loading").fadeIn();
        var $elem=$(this);
        setTimeout(function(){
            $elem.attr("disabled","disabled");
            $(".zl-loading").fadeOut();
        },600)
    })

    /* ======================================== zl-table-block ======================================== */
    page.on("click",".zl-table-block .zl-edit-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest("td").addClass("editing");
        $(this).closest("td").find("input").removeAttr("readonly");

        $(this).hide();
        $(this).closest("td").find(".resolve-btn").hide();
        $(this).closest("td").find(".zl-save-btn").show();
        $(this).closest("td").find(".zl-cancel-btn").show();
    });


    page.on("focus",".js-edit-turnover input",function(e){
        e.stopPropagation();
        e.preventDefault();

        $(this).closest("tr").find(".js-edit-turnover").addClass("editing");
        $(this).data("tmpValue",$(this).val()).removeAttr("readonly");
        console.log( $(this).data("tmpValue"))
    });

    page.on("focus",".js-edit-forecast input",function(e){
        e.stopPropagation();
        e.preventDefault();

        $(this).closest("tr").find(".js-edit-forecast").addClass("editing");
        $(this).data("tmpValue",$(this).val()).removeAttr("readonly");
    });



    page.on("click",".js-edit-turnover .zl-save-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".zl-loading").fadeIn();
        var $elem=$(this);
        setTimeout(function(){
            console.log( $elem.closest("td"))
            $elem.closest("td").removeClass("editing");
            $elem.closest("tr").find(".js-edit-turnover input").attr("readonly","readonly").data("tmpValue",null);
            $(".zl-loading").fadeOut();
        },600)

    });

    page.on("click",".js-edit-turnover .zl-cancel-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        var $elem=$(this);
        $elem.closest("td").removeClass("editing");

        $elem.closest("tr").find(".js-edit-turnover input").each(function(i,e){
            $(this).attr("readonly","readonly").val(
                    $(this).data("tmpValue")
                ).data("tmpValue",null);
            })
    });


    page.on("click",".js-edit-forecast .zl-save-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".zl-loading").fadeIn();
        var $elem=$(this);
        setTimeout(function(){
            console.log( $elem.closest("td"))
            $elem.closest("td").removeClass("editing");
            $elem.closest("tr").find(".js-edit-forecast input").attr("readonly","readonly").data("tmpValue",null);
            $(".zl-loading").fadeOut();
        },600)

    });

    page.on("click",".js-edit-forecast .zl-cancel-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        var $elem=$(this);
        $elem.closest("td").removeClass("editing");

        $elem.closest("tr").find(".js-edit-forecast input").each(function(i,e){
            $(this).attr("readonly","readonly").val(
                $(this).data("tmpValue")
            ).data("tmpValue",null);
        })
    });


    page.on("click","#zl-date-next",function(e){
        e.preventDefault();
        location.href="sale_detail_04.html";
    });
    page.on("click","#js-date-pre",function(e){
        e.preventDefault();
        location.href="sale_detail.html";
    });


    page.on("focus","input.js-contract-modal",function(){

        if($(this).attr("readonly")){
            return
        }
        $("#js-contract-category-dialog").modal("show");
    });

})();

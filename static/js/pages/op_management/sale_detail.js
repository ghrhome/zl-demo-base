(function(){
    $("#preloader").fadeOut("fast");
    var page = $("#sale-detail");

    var tmplHtml = page.find("#tmpl").html();


    $(".js-warn-text").tooltip();

    page.on("click","a.remove-record-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest("tr").remove();
    });

    page.on("click","a.add-record-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        page.find(".sale-source-dialog tbody").append(tmplHtml);
    });

    page.on("click","a.dialog-link-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        page.find(".sale-dialog").modal("show");
    });


    page.on("click",".switch-btn button",function(e){
        e.stopPropagation();
        e.preventDefault();
        var type = $(this).attr("data-type");
        if(type=="day"){
            page.find(".zl-table-block").show();
            page.find(".zl-panel-block").hide();
        }else{
            page.find(".zl-table-block").hide();
            page.find(".zl-panel-block").show();
        }
        $(this).parent().find("button").removeClass("active");
        $(this).addClass("active");
    });

    page.on("click",".zl-dropdown-inline .dropdown-menu li a",function(e){
        e.preventDefault();
        var text = $(this).html();
        $(this).closest(".zl-dropdown-inline").find("button").html(text);
    });

    page.on("click",".zl-dropdown .dropdown-menu li a",function(e){
        e.preventDefault();
        var text = $(this).html();
        $(this).closest(".zl-dropdown").find("button").html(text);
        if(text=="按月"){
            $(this).html("按日");
            page.find(".zl-table-block").hide();
            page.find(".zl-panel-block").show();
        }else{
            $(this).html("按月");


            page.find(".zl-table-block").show();
            page.find(".zl-panel-block").hide();
        }
    });


    /* ======================================== zl-table-block ======================================== */
    page.on("click",".zl-table-block .zl-edit-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest("td").addClass("editing");
        $(this).closest("td").find(".zl-edit input").removeAttr("readonly");

        $(this).hide();
        $(this).closest("td").find(".resolve-btn").hide();
        $(this).closest("td").find(".zl-save-btn").show();
        $(this).closest("td").find(".zl-cancel-btn").show();
    });

    page.on("click",".zl-table-block .zl-save-btn,.zl-table-block .zl-cancel-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest("td").removeClass("editing");
        $(this).closest("td").find(".zl-edit input").attr("readonly","readonly");
        $(this).closest("td").find(".resolve-btn").show();
        $(this).closest("td").find(".zl-edit-btn").show();
        $(this).closest("td").find(".zl-save-btn").hide();
        $(this).closest("td").find(".zl-cancel-btn").hide();
    });

    page.on("click","[name=show-contract-dialog]",function(e){
        e.stopPropagation();
        e.preventDefault();
        if(!$(this).closest("tr").hasClass("editing")){
            return;
        }
        page.find(".zl-contract-category-dialog").modal("show");
    });


    page.on("click",".zl-contract-category-dialog",function(e){
        e.stopPropagation();
        e.preventDefault();
        if(!$(this).closest("tr").hasClass("editing")){
            return;
        }
        page.find(".zl-contract-category-dialog").modal("show");
    });

    page.on("click",".zl-contract-category-dialog .zl-dialog-btn-ok",function(e){
        e.preventDefault();
        e.stopPropagation();
        var total = 0;
        page.find(".zl-contract-category-dialog input").each(function(){
            var val = $(this).val();
            val = parseFloat(val);
            if(!isNaN(val)){
                total+=val;
            }
        });

        page.find(".zl-contract-category-dialog").modal("hide");
        page.find("[name=show-contract-dialog]").val(total);
    });

    /* ======================================== zl-panel-block ======================================== */
    page.on("click",".zl-panel-block .zl-edit-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest("tr").addClass("editing");
        $(this).closest("tr").find(".zl-edit input").removeAttr("readonly");

        $(this).hide();
        $(this).closest("td").find(".zl-save-btn").show();
        $(this).closest("td").find(".zl-cancel-btn").show();
    });

    page.on("click",".zl-panel-block .zl-save-btn,.zl-panel-block .zl-cancel-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest("tr").removeClass("editing");
        $(this).closest("tr").find(".zl-edit input").attr("readonly","readonly");

        $(this).closest("td").find(".zl-edit-btn").show();
        $(this).closest("td").find(".zl-save-btn").hide();
        $(this).closest("td").find(".zl-cancel-btn").hide();
    });

    page.on("click","a.resolve-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        page.find(".sale-source-dialog").modal("show");
    });

    page.on("click","#zl-date-next",function(e){
        e.preventDefault();
        location.href="sale_detail_04.html";
    });
    page.on("click","#js-date-pre",function(e){
        e.preventDefault();
        location.href="sale_detail.html";
    });

})();

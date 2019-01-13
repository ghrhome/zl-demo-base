(function(){
    $("#preloader").fadeOut("fast");

    $(".js-btn-edit").on("click",function(e){
        e.preventDefault();
        $(this).closest("tr").find(".zl-input-wrapper>input").removeAttr("disabled");
        $(this).css({"display":"none"}).next(".js-btn-wrapper").css("display","block");
    });


    $(".js-btn-save").on("click",function(e){
        e.preventDefault();
        $(this).closest("tr").find(".zl-input-wrapper>input").attr("disabled",true);
        $(this).closest(".js-btn-wrapper").css("display","none");
        $(this).closest("td").find(".js-btn-edit").css("display","inline-block");
    });

    $(".js-btn-cancel").on("click",function(e){
        e.preventDefault();
        $(this).closest("tr").find(".zl-input-wrapper>input").attr("disabled",true);
        $(this).closest(".js-btn-wrapper").css("display","none");
        $(this).closest("td").find(".js-btn-edit").css("display","inline-block");
    });



})();



$(function(){
    var container = $("#business-situation");
    $("#preloader").fadeOut("fast");
    // 在营项目
    var moreOpenProjectList = []; // need to be loaded 
    var moreOpenProjectTemplate = container.find("[name=more-open-project-template]");
    var moreOpenProjectHtml = null;

    // 筹备项目
    var moreUnopenProjectList = []; // need to be loaded 
    var moreUnopenProjectTemplate = container.find("[name=more-unopen-project-template]");
    var moreUnopenProjectHtml = null;



    /* ======================================== init the page view ======================================== */

    /* ======================================== bind the event ======================================== */

    function bindPageEvents(){

        container.on("click",".summary-head li a",function(e){
            e.stopPropagation();
            e.preventDefault();
            if($(this).hasClass("not-show")){
                var href=$(this).attr("href");
                window.location.href=href;
                return;
            }
            if($(this).attr("id")!=="to-oa"){

                $(this).closest(".summary-head").find("li a").removeClass("active");
                $(this).addClass("active");

                var href= $(this).attr("data-href");
                container.find(".summary-content .shopping-mall").addClass("zl-display-none");
                container.find(".summary-content").find(href).removeClass("zl-display-none");

            }else{

                window.parent.document.location.href='/work/demoframe/main/main.html';
            }

        });

        container.on("click",".zl-clickable",function(e){
            e.stopPropagation();
            e.preventDefault();
            var dataHref = $(this).attr("data-href");
            if(dataHref==""||dataHref==null){
                return;
            }
            window.location = dataHref;
        });

        container.on("click",".project-category-area .project-item",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".project-category-area").addClass("zl-display-none");
            $(".project-category-business").removeClass("zl-display-none");
            $("[name=project-count]").html(11);
        });

        container.on("click",".zl-dropdown-group .zl-dropdown .zl-dropdown-menu a",function(e){
            var text = $(this).html();

            $(this).closest(".zl-dropdown").find(".zl-dropdown-btn").html(text);
            $(".project-category-area").addClass("zl-display-none");
            $(".project-category-business").removeClass("zl-display-none");
            $("[name=project-count]").html(11);
        });


        container.on("click",".project-category-business .project-item",function(e){
            e.stopPropagation();
            e.preventDefault();
            window.location = "project_open.html";
        });

        container.on("click",".project-category-prepare .project-item",function(e){
            e.stopPropagation();
            e.preventDefault();
            window.location = "project_unopen_new.html";
        });

        container.on("click","a.view-more-open-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            container.find(".project-category-business .project-item-list").append(moreOpenProjectHtml);
            $(this).removeClass("view-more-open-btn");
        });

        container.on("click","a.view-more-unopen-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            container.find(".project-category-prepare .project-item-list").append(moreUnopenProjectHtml);
            $(this).removeClass("view-more-unopen-btn");
        });

        container.on("click","#js-avg-rent",function(e){
            e.preventDefault();
            location.href="average_rent_all.html"
        })
    }

    
    // init the page
    function init(result){

        moreOpenProjectList = result.moreOpenProjectList;
        moreOpenProjectHtml = moreOpenProjectTemplate.tmpl(moreOpenProjectList);


        moreUnopenProjectList = result.moreUnopenProjectList;
        moreUnopenProjectHtml = moreUnopenProjectTemplate.tmpl(moreUnopenProjectList);


        bindPageEvents();
    }


    /* ======================================== methods ======================================== */
    $.get("../../data/service/business_situation.json",function(result){
        init(result);
    });

});
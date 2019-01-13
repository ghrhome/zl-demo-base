/**
 * Created by user on 2016/10/18.
 */

var amp_main=(function($,menu,am){
    var amp_main=am;

    var menu_list=menu;

    amp_main.menu_init=function(sys){
        var menu=menu_list[sys];
        var $main_nav_container=$(".nav-bracket");
        var main_navs=[];
        $.each(menu,function(i,e){

                var main_nav_name= e.name;
                var main_nav_target= e.target;
                var main_nav_links= e.links;
                var boolean_show_sub= e.show_sub_menu;
                var boolean_re_locate= e.re_locate;
                var sub_menu= e.sub_menu;
                var sub_menu_length=sub_menu.length;
                var main_index= e.index;
                var main_id=i;
                var icon= e.icon;
                if(boolean_show_sub==false){
                   var li_item=[
                       '<li>',
                       '<a href="'+main_nav_links,
                        '" class="zl-menu-link"',
                       ' id="'+main_index+'"',
                        'data-relocate="'+boolean_re_locate+'">',
                        '<em class="zl-icon-spirit '+icon+'"></em>',
                        '<span>'+main_nav_name+'</span>',
                           '</a></li>'
                   ].join("");

                    main_navs.push(li_item);
                }else{
                    var sub_ul=[];
                    if(sub_menu_length>=1){
                        $.each(sub_menu,function(i,e){
                            var sub_id=i
                            var sub_li=[
                                '<li>',
                                    '<a href="'+ e.links+'" target="'+ e.target+'" data-relocate="'+ e.re_locate+'" id="sub-'+ main_id+'-'+sub_id+'">'+ e.name+'</a>',
                                '</li>'
                            ].join("");
                            sub_ul.push(sub_li);
                        });
                    }

                    var li_item=[
                        '<li class="nav-parent">',
                        '<a href="#header-tabs-'+i+'" class="zl-menu-link" id="'+main_index+'">',
                         '<em class="zl-icon-spirit '+icon+'"></em>',
                         '<span>'+main_nav_name+'</span>',
                        '</a>',
                          '<ul class="children">',
                               sub_ul.join(""),
                            '</ul>',
                        '</li>'
                    ].join("");

                    main_navs.push(li_item);
                }
        });

        $main_nav_container.empty().append(main_navs.join(""));
    };

    amp_main.header_tab_init=function(sys){
        var menu=menu_list[sys];
        var $header_tab_container=$(".head-main-menu");
        var $page_header=$(".pageheader");
        var tab_navs=[];
        var tab_content=[];

        $.each(menu,function(i,e){
            var main_nav_target= e.target;
            var sub_menu= e.sub_menu;
            var sub_menu_length=sub_menu.length;
            var main_index=i;
            var sub_li=[];
            var tab_pane=[];
            $.each(sub_menu,function(i,e){
                var sub_index=i;
               var li_item=[
                   '<li role="presentation" id="nav-tabs-item-'+main_index+'-'+sub_index+'">',
                   '<a href="#pane-sub-'+main_index+'-'+sub_index+'" role="tab" data-toggle="tab" data-href="'+ e.links+'" data-relocate="'+ e.re_locate+'" id="nav-'+main_index+'-'+sub_index+'">'+ e.name+'</a>',
                   '</li>',
               ];

                sub_li.push(li_item.join(""));
                var tri_item=[];
                $.each(e.sub_menu,function(i,e){
                    var tri_index=i;
                    var tri_item_li=[
                        '<li>',
                        '<a href="'+ e.links+'" id="tri-'+main_index+'-'+sub_index+'-'+tri_index+'" class="header-subnav-item" target="'+ e.target+'">'+ e.name+'</a>',
                        '</li>'
                    ];

                   tri_item.push(tri_item_li.join(""));
                });

                var tabpanel_item=[
                    '<div role="tabpanel" class="tab-pane" id="pane-sub-'+main_index+'-'+sub_index+'">',
                        '<ul class="header-nav-sub clearfix">',
                           tri_item.join(""),
                        '</ul>',
                    '</div>'
                ];
               // console.log(tabpanel_item.join(""));
                tab_pane.push(tabpanel_item.join(""));
            });
            var sub_menu_item=[
                '<ul class="nav nav-tabs animated" role="tablist" id="'+'header-tabs-'+main_index+'">',
                    sub_li.join(""),
                '</ul>'
            ];

            var tab_content_item=[
                '<div class="tab-content animated" id="tab-menu-content-'+ main_index+'">',
                tab_pane.join(""),
                '</div>',
            ];

            tab_navs.push(sub_menu_item.join(""));
            tab_content.push(tab_content_item.join(""));
        });

        $(".head-main-menu").empty().append(tab_navs.join(""));
        $(".pageheader").empty().append(tab_content.join(""));
    };




    function closeVisibleSubMenu() {
        $('.nav-parent').each(function() {
            var $item = $(this);
            if($item.hasClass('nav-active')) {
                $item.find('> ul').slideUp(200, function(){
                    $item.removeClass('nav-active');
                });
            }
        });
    }

    function adjustmainpanelheight() {
        // 展开子菜单检查页面高度
        var docHeight = $(document).height();
        if(docHeight > $('.mainpanel').height())
            $('.mainpanel').height(docHeight);
    }
    amp_main.sideNav_init=function(){
        // hover
        $('.nav-bracket > li').hover(function(){
            $(this).addClass('nav-hover');
        }, function(){
            $(this).removeClass('nav-hover');
        });

        // Toggle 展开
        $('.nav-parent > a').click(function(e) {
            e.preventDefault();
            var $parent = $(this).parent();
            var $sub = $parent.find('> ul');

            // Dropdown works only when leftpanel is not collapsed
            if(!$('body').hasClass('leftpanel-collapsed')) {
                if($sub.is(':visible')) {
                    $sub.slideUp(200, function(){
                        $parent.removeClass('nav-active');
                        $('.mainpanel').css({height: ''});
                        adjustmainpanelheight();
                    });
                } else {
                    closeVisibleSubMenu();
                    $parent.addClass('nav-active');
                    $sub.slideDown(200, function(){
                        adjustmainpanelheight();
                    });
                }
            }
            return false;
        });

    };

    function render_menu(id){
        var id_array=id.split("-");
        if(!$("#"+id).hasClass("active")){
            if(id_array[0]=="main"){
                $(".head-main-menu .nav-tabs").removeClass("active fadeIn");
                $("#header-tabs-"+id_array[1]).addClass("active fadeIn").find("li").removeClass("active");
                $(".tab-content").removeClass("active fadeIn");
                $("#tab-menu-content-"+id_array[1]).addClass("active fadeIn").find("a").removeClass("active");

                $("#nav-tabs-item-"+id_array[1]+"-"+0).addClass("active");
                $(".tab-pane").removeClass("active");
                $("#pane-sub-"+id_array[1]+"-"+0).addClass("active");

            }else if(id_array[0]=="sub"){
              //  console.log("sub--------------");
                if(!$("#"+id).closest(".nav-parent").hasClass("active")) {
                    $(".head-main-menu .nav-tabs").removeClass("active fadeIn");
                    $("#header-tabs-"+id_array[1]).addClass("active fadeIn").find("li").removeClass("active");
                    $(".tab-content").removeClass("active fadeIn");
                    $("#tab-menu-content-"+id_array[1]).addClass("active fadeIn").find("a").removeClass("active");
                }else{
                    $("#header-tabs-"+id_array[1]).find("li").removeClass("active");
                    $("#tab-menu-content-"+id_array[1]).find("a").removeClass("active");
                }
                    $("#nav-tabs-item-"+id_array[1]+"-"+id_array[2]).addClass("active");
                    $(".tab-pane").removeClass("active");
                    $("#pane-sub-"+id_array[1]+"-"+id_array[2]).addClass("active");
            }
        }



    }
    function re_locate(id,href){
        var boolean_re_locate=$("#"+id).data("relocate");
        var id_array=id.split("-");
        if(boolean_re_locate==true){
            $("#page-frame").attr("src",href);
            if(id_array[0]=="main"){
                $("#tri-"+id_array[1]+"-"+0+"-"+0).addClass("active");
            }else if(id_array[0]=="sub" ||"nav"){
                $(".pageheader a").removeClass("active");
                $("#tri-"+id_array[1]+"-"+id_array[2]+"-"+0).addClass("active");
            }
        }else if(typeof boolean_re_locate=="undefined"){
            $("#"+"id").addClass("active");
           $("#page-frame").attr("src",href);

        }

    }

    amp_main.sideNav_nav=function(){
        $('.nav-bracket  a').click(function(e){
            e.preventDefault();
            $(".data-chart-report-container").hide();
            $(".mainpanel").show();


            if($(this).hasClass("zl-menu-link")){
                //一级目录
                var $parent=$(this).parent("li");
                if(!$parent.hasClass("active") &&  !$parent.hasClass("nav-parent")){
                   // $(".nav-parent").removeClass("nav-active");
                    $(".nav-bracket li").removeClass("active");
                    $(this).parent("li").addClass("active");
                    $(".nav-active>ul").slideUp(200, function(){
                        $(this).parent().removeClass('nav-active');
                        $('.mainpanel').css({height: ''});
                        adjustmainpanelheight();
                    });
                    //relocate & render menu
                    var href=$(this).attr("href");
                    var id=$(this).attr("id");
                    render_menu(id);
                    re_locate(id,href);

                }
            }else{
                //二级目录
                var href=$(this).attr("href");
                var id=$(this).attr("id");
                render_menu(id);
                re_locate(id,href);

                if(!$(this).closest("li.nav-parent").hasClass("active")){
                    $(".nav-bracket li").removeClass("active");
                    //$(".nav-parent").removeClass("nav-active");
                    $(this).parent("li").addClass("active").closest(".nav-parent").addClass("active");
                    //relocate & render menu

                }else{
                    if(!$(this).parent("li").hasClass("active")){
                        $("ul.children li").removeClass("active");
                        $(this).parent("li").addClass("active");
                        //relocate & render menu
                      /*  var href=$(this).attr("href");
                        var id=$(this).attr("id");
                        render_menu(id);
                        re_locate(id,href);*/

                    }
                }
            }
        });
    };

    amp_main.subNav_init=function(){
      $(".header-nav-sub").on("click","a.header-subnav-item",function(e){
          e.preventDefault();
          if(!$(this).hasClass("active")){
              $(".header-nav-sub a.header-subnav-item").removeClass("active");
              $(this).addClass("active");
              var id=$(this).attr("id");
              var href=$(this).attr("href");
              re_locate(id,href);
          }
      })

    };
    amp_main.collapse_init=function(){
        // Menu Toggle
        $('.menutoggle').click(function(){

            var $body = $('body');
            var bodypos = $body.css('position');

            if(bodypos != 'relative') {
                 if(!$body.hasClass('leftpanel-collapsed')) {
                     $body.addClass('leftpanel-collapsed');
                     $('.nav-bracket ul').attr('style','');

                     $(this).addClass('menu-collapsed');
                 } else {
                     $body.removeClass('leftpanel-collapsed');
                     $('.nav-bracket li.active ul').css({display: 'block'});
                     $(this).removeClass('menu-collapsed');
                 }
             } else {
                 if($body.hasClass('leftpanel-show'))
                 $body.removeClass('leftpanel-show');
                 else
                 $body.addClass('leftpanel-show');

                 adjustmainpanelheight();
             }
        });

    };

    amp_main.leftPanel_init=function(){
        var h=parseInt($(window).height());
        $(".leftpanelinner").css({
            height:(h-145)+"px",
            "overflow":"hidden"
        });
        left_panel_scroll = new IScroll('.leftpanelinner', {
            mouseWheel: true,
            scrollbars: false
        });

        var defer=null;
        var scrollUpdate=function(){
            var h=parseInt($(window).height());
            $(".leftpanelinner").css({
                height:(h-145)+"px",
                "overflow":"hidden"
            });
            left_panel_scroll.refresh();
        };

        $(window).resize(function(){
            if(!defer){
                defer=setTimeout(function(){
                    scrollUpdate();
                    defer=null;
                },200);
            }else{
                clearTimeout(defer);
                defer=setTimeout(function(){
                    scrollUpdate();
                    defer=null;
                },200);
            }

        });
        setTimeout(scrollUpdate,300);
    };

    amp_main.leftPanel_update=function(){
        var h=parseInt($(window).height());
        $(".leftpanelinner").css({
            height:(h-145)+"px",
            "overflow":"hidden"
        });
        left_panel_scroll.refresh();
    };
    /*right panel 调用*/
    amp_main.rightPanel_open=function(){
        $("body,html").css("overflow","hidden");
        $("body").addClass("open open-panel");
        $(".zl-amp").trigger("right_panel_open");
    };


    amp_main.checkCookie=function(){
        // Sticky Header
        if($.cookie('sticky-header')){
            $('body').addClass('stickyheader');
        }
        // Sticky Left Panel
        if($.cookie('sticky-leftpanel')) {
            $('body').addClass('stickyheader');
            $('.leftpanel').addClass('sticky-leftpanel');
        }
        // Left Panel Collapsed
        if($.cookie('leftpanel-collapsed')) {
            $('body').addClass('leftpanel-collapsed');
            $('.menutoggle').addClass('menu-collapsed');
        }
        // Check if leftpanel is collapsed
        if($('body').hasClass('leftpanel-collapsed'))
            $('.nav-bracket .children').css({display: ''});
    };

    amp_main.placeholder_init=function(){
        // Page Preloader
        // $('#status').fadeOut();
        var body_height=parseInt($("body").css("height"));
        var content_height=body_height-88;
        $(".contentpanel").css("height",content_height+"px");
        $("#page-frame").css("height",content_height+"px");
        $('#preloader').delay(350).fadeOut(function(){
           // $('body').delay(350).css({'overflow':'visible'});
        });
    };

    function _isPC()
    {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var isPC= true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { isPC = false; break; }
        }
        return isPC;
    }
    amp_main.init=function(sys,callback){
        if(!sys){
            sys="amp_menu";
        }
        amp_main.menu_init(sys);
        amp_main.header_tab_init(sys);
        amp_main.collapse_init();
        amp_main.sideNav_init();
        amp_main.sideNav_nav();
        amp_main.subNav_init();
        amp_main.leftPanel_init();
        $("#main-0").trigger("click");

        $(".head-main-menu").on("click","a",function(e){
            e.preventDefault();
           if($(this).data("relocate")==true){
               var href=$(this).data("href");
               var id=$(this).attr("id");
               re_locate(id,href);
           }
        });
    };
    return amp_main;
})(jQuery,menu_list,amp_main||{});


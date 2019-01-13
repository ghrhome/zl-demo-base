/**
 * Created by whobird on 2018/4/13.
 */
var selectShopList=(function($,selectShopList){
    var su=selectShopList;

    var selectCallback=undefined;
    var itemTemp;

    var $container;
    var dataOri={};
    var shopList={};
    var shopSelectMod;

    var selectedShops={};


    function _insertTemp(){
        $.get("../common/shopSelectModal.html",function(tmpl){
            $("body").append(tmpl);
            var _itemTempHtml=$("#shop-item-template").html();
            itemTemp=Handlebars.compile(_itemTempHtml);
            _render();

            $container=$("#shopSelectModal");

            su.eventInit();
        });
    }

    function _render(){

        var source   = $("#shop-select-template").html();
        var template = Handlebars.compile(source)
        var context = {
            shopList:shopList
        };

        var html = template(context);
        $(".zl-page").append(html);

    }


    function _setShopsChecked(){

        var _shopsList= shopList;

        //当渲染完Shoplist后，根据selectedShops渲染当前item的selected状态
        $.each(_shopsList,function(i,shop){
            if(shop.id && typeof selectedShops[shop.id]!=="undefined"){
                var _index=i;
                $container.find(".js-modal-shop-list li").eq(_index).addClass("selected");
            }
        })

    };

    function _setSelectedShops(selectedShops){
        var _shopList=[];

        $.each(selectedShops,function(shopId,shop){
            _shopList.push(shop);
        });

        var _html=itemTemp({
            shopList:_shopList
        });

        $container.find(".js-modal-shop-selected").empty().append(_html);
    };

    var defer=undefined;
    su.search=function(){

       if(typeof defer!=="undefined"){
           clearTimeout(defer);
           defer=undefined;
       }

        defer=setTimeout(function(){
            clearTimeout(defer);
            defer=undefined;
            var _input=$container.find("#js-shop-select-modal-search").val().trim();

            if(_input==""){
               $container.find(".js-modal-shop-list li").removeClass("hide");
            }else{

                var _patt = new RegExp(_input);
                /*$.each(shopList,function(k,shop){
                    if(!_patt.test(shop.name)){
                        $container.find(".js-modal-shop-list li[data-id="+shop.id+"]").addClass("hide")
                    }else{
                        $container.find(".js-modal-shop-list li[data-id="+shop.id+"]").removeClass("hide")
                    }

                })*/
                var $lists=$container.find(".js-modal-shop-list li");
                $lists.each(function(i,elem){
                    var $elem=$(elem);
                    var _name=$elem.data("name");
                    if(!_patt.test(_name)){
                        $elem.addClass("hide")
                    }else{
                        $elem.removeClass("hide")
                    }
                })
            }

        },300);
    }

    su.eventInit=function(){

        //选取账期，单选/多选形式
        $container.on("click",".js-modal-shop-list>li",function(e){
            e.preventDefault();

            if($(this).hasClass("selected")){
                var _id=$(this).data("id");
                delete selectedShops[_id];

                if(shopSelectMod=="single"){
                    $container.find(".js-modal-shop-list>li").removeClass("selected");
                }else{
                    $(this).removeClass("selected");
                }

            }else{

                var _id=$(this).data("id");
                var _index=$(this).data("index");
                var _name=$(this).data("name");

                if(shopSelectMod=="single"){
                    selectedShops={};
                    $container.find(".js-modal-shop-list>li").removeClass("selected");
                }
                selectedShops[_id]={
                    id:_id,
                    name:_name,
                    index:_index,
                }

                $(this).addClass("selected");
            }


            _setSelectedShops(selectedShops);

        });

        //删除账期
        $container.on("click",".js-modal-shop-selected>li",function(e){
            e.preventDefault();
            var $item=$(this);

            var _id=$item.data("id");

            var item=selectedShops[_id];

            delete selectedShops[_id];
            $item.remove();

            $container.find(".js-modal-shop-list").find("li").each(function(i,item){
                if($(this).data("id")==_id){
                    $(this).removeClass("selected");
                }
            })

        });

        //确定
        $container.on("click",".js-submit",function(e){
            e.preventDefault();
            var _selectedShops=$.extend(true,{},selectedShops);
            selectCallback(_selectedShops);
            su.modalHide();
        })

        //取消
        $container.on("click",".js-cancel",function(e){
            e.preventDefault();
            su.modalHide();
        })

        //重置
        $container.on("click",".js-reset",function(e){
            e.preventDefault();
            su.reset();
        });

        $container.on("input","#js-shop-select-modal-search",function(e){
            su.search();
        })

    }

    su.modalShow=function(callback,data){
        $("#shopSelectModal").modal("show");

        if(typeof callback!=="undefined"){
            selectCallback=callback;
        }
        if(typeof data !=='undefined'){
            selectedShops=$.extend(selectedShops,data);
            _setSelectedShops(selectedShops);
            _setShopsChecked();
        }

    }
    
    
    su.reset=function(){
        selectedShops={};
        //$(".js-Shop-list").empty();
        $container.find(".js-modal-shop-selected").empty();

        //_setShopsChecked();
        $container.find("#js-shop-select-modal-search").val("");
        $container.find(".js-modal-shop-list li").removeClass("hide");

        $container.find(".js-modal-shop-list li").removeClass("selected");
    }
    su.modalHide=function(){
        $("#shopSelectModal").modal("hide");
        su.reset();
        selectCallback=undefined;
    }


    su.update=function(data,mod){
        dataOri=$.extend(true,{},data);
        shopList=$.extend(true,{},dataOri.shopList);
        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            shopSelectMod=mod
        }else{
            shopSelectMod="single";
        }

        $("#shopSelectModal").remove();

        var _itemTempHtml=$("#shop-item-template").html();
        itemTemp=Handlebars.compile(_itemTempHtml);
        _render();

        $container=$("#shopSelectModal");

        su.eventInit();

    }

    su.init=function(data,mod){

        dataOri=$.extend(true,{},data);
        shopList=$.extend(true,{},dataOri.shopList);

        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            shopSelectMod=mod
        }else{
            shopSelectMod="single";
        }
        _insertTemp();
    };

    return su;
})(jQuery,selectShopList||{});


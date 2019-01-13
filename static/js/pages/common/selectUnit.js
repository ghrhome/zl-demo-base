/**
 * Created by whobird on 2018/4/13.
 */
var selectUnit=(function($,selectUnit){
    var su=selectUnit;

    var selectCallback=undefined;
    var itemTemp;
    var dataOri={};
    var shopSelectMod;

    var selectedBuilding,selectedFloors=[],floorShops={},selectedShops={};

    var _dropdown, _qSearch;

    function _insertTemp(){

        $.get("../common/unitSelectModal.html",function(tmpl){
            $("body").append(tmpl);
            var _itemTempHtml=$("#unit-item-template").html();
            itemTemp=Handlebars.compile(_itemTempHtml);
            _render();
            su.eventInit();
        });
    }

    function _render(){

        var source   = $("#unit-select-template").html();
        var template = Handlebars.compile(source);
        var context = {
            buildingList:dataOri.buildingList
        };

        var html = template(context);
        $(".zl-page").append(html);
    }

    su.setSelected=function(selectedShops){
      //初始化时判断选中。

    };

    function _setFloors(building){
        selectedFloors= dataOri.buildings[building].floors;
      var _dataList=[];

      $.each(selectedFloors,function(i,data){
          _dataList.push({
              id:data.id,
              name:data.name
          })
      });
        var _html=itemTemp({
            dataList:_dataList
        });

        $(".js-floor-list").empty().append(_html);

        //清空shoplist,
        floorShops={};
        $(".js-shop-list").empty();
    };

    function _setShops(floors){

        var _shopList=[];

        $.each(floors,function(floor,shops){
            _shopList=_shopList.concat(shops);
        });

        var _html=itemTemp({
            dataList:_shopList
        });

        $(".js-shop-list").empty().append(_html);

        //当渲染完shoplist后，根据selectedshops渲染当前item的selected状态

        $.each(_shopList,function(i,shop){
            if(shop.id && typeof selectedShops[shop.id]!=="undefined"){
                var _index=i;

                $(".js-shop-list").find("li").eq(_index).addClass("selected");
            }
        })

    };
    function _setSelectedShops(selectShops){
        var _shopList=[];

        $.each(selectShops,function(shopid,shop){
            _shopList.push(shop);
        });

        var _html=itemTemp({
            dataList:_shopList
        });

        $(".js-shop-selected").empty().append(_html);

    };

    su.eventInit=function(){

        $(".js-dropdown-buildings").ysdropdown({
            callback:function(value){
                selectedBuilding=value;

                _setFloors(selectedBuilding);
            }
        });
        //选取楼层，单选形式
        $("body").on("click",".js-floor-list>li",function(e){
            e.preventDefault();
            if($(this).hasClass("selected")){
                var _id=$(this).data("id")
                delete floorShops[_id];
                $(".js-floor-list>li").removeClass("selected");

            }else{

                var _id=$(this).data("id");
                var _index=parseInt($(this).data("index"));
                //目前逻辑楼层单选
                floorShops={};
                floorShops[_id]=selectedFloors[_index].shops;

                $(".js-floor-list>li").removeClass("selected");
                $(this).addClass("selected");
            }

            _setShops(floorShops);

        });

        //选取店铺，单选/多选形式
        $("body").on("click",".js-shop-list>li",function(e){
            e.preventDefault();

            if($(this).hasClass("selected")){
                var _id=$(this).data("id");
                delete selectedShops[_id];

                if(shopSelectMod=="single"){
                    $(".js-shop-list>li").removeClass("selected");
                }else{
                    $(this).removeClass("selected");
                }

            }else{
                var _id=$(this).data("id");
                var _index=$(this).data("index");
                var _name=$(this).find("span").text();

                if(shopSelectMod=="single"){
                    selectedShops={};
                    $(".js-shop-list>li").removeClass("selected");
                }
                selectedShops[_id]={
                    id:_id,
                    name:_name,
                    index:_index
                }

                $(this).addClass("selected");
            }



            _setSelectedShops(selectedShops);

        });

        //删除店铺
        $("body").on("click",".js-shop-selected>li",function(e){
            e.preventDefault();
            var $item=$(this);

            var _id=$item.data("id");

            var item=selectedShops[_id];
            var _index=item.index;

            delete selectedShops[_id];
            $item.remove();

            $(".js-shop-list").find("li").each(function(i,item){
                if($(this).data("id")==_id){
                    $(this).removeClass("selected");
                }
            })

        });

        //确定
        $("body").on("click","#unitSelectModal .js-submit",function(e){
            e.preventDefault();
            var _selectedShops=$.extend(true,{},selectedShops);
            selectCallback(_selectedShops);
            su.modalHide();
        })

        //取消
        $("body").on("click","#unitSelectModal .js-cancel",function(e){
            e.preventDefault();
            su.modalHide();
        })

        //重置
        $("body").on("click","#unitSelectModal .js-reset",function(e){
            e.preventDefault();
            su.reset();
        })

    }

    su.modalShow=function(callback,data){
        $("#unitSelectModal").modal("show");

        if(typeof callback!=="undefined"){
            selectCallback=callback;
        }
        if(typeof data !=='undefined'){
            selectedShops=$.extend(selectedShops, data);
            _setSelectedShops(selectedShops)
        }
    }
    su.reset=function(){
        selectedBuilding=undefined;
        selectedFloors=[];
        floorShops={};
        selectedShops={};
        $(".js-dropdown-buildings").find("button").text("楼栋");
        $(".js-shop-list").empty();
        $(".js-floor-list").empty();
        $(".js-shop-selected").empty();
    }
    su.modalHide=function(){
        $("#unitSelectModal").modal("hide");


        su.reset();
        selectCallback=undefined;

    }


    su.init=function(data,mod){
        dataOri=$.extend(true,{},data);
        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            shopSelectMod=mod
        }else{
            shopSelectMod="single";
        }
        _insertTemp();
    };

    return su;
})(jQuery,selectUnit||{});


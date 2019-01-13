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
            var _itemTempHtml=$("#unit-item-template").html()
            itemTemp=Handlebars.compile(_itemTempHtml);
            _render();
            su.eventInit();
        });
    }

    function _updateTemp(){
        var _buildingList=dataOri.buildingList;
        var $ul=$("#unitSelectModal").find("div[data-id='js-dropdown-buildings'] ul.dropdown-menu");
        $ul.empty();
            var _str=""
            _str+='<li class="dropdown-header">选择楼栋</li>'
        $.each(_buildingList,function(i,building){
            var addonStr="<li><a data-value="+building.id+">"+building.name+"</a></li>"

            _str+=addonStr;
        })
        $ul.append(_str);
        $(".zl-shop-list").html("");
        _inputFilter();    

    }

    function _inputFilter(){
        $.each(dataOri.buildings,function(i,building){
                $.each(building.floors,function(index,floor){
                    $.each(floor.shops,function(y,shop){
                        console.log(shop);
                        // if(shop.name.indexOf($(".zl-shop-filter").val())<0){
                            $(".js-shop-list").append('<li data-index="" data-id="'+shop.id+'" class="zl-select-item"><span>'+shop.name+'/'+floor.name+'</span></li>');
                        // };
                    })
                })
            });
    }

    function _render(){

        var source   = $("#unit-select-template").html();
        var template = Handlebars.compile(source)
        var context = {
            buildingList:dataOri.buildingList
        };

        var html = template(context);
        $(".zl-page").append(html);
        _inputFilter();
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
        console.log(floors);
        var _shopList=[];

        $.each(floors,function(floor,shops){
            console.log(shops);
            _shopList=_shopList.concat(shops);
        });

        var _html=itemTemp({
            dataList:_shopList
        });

        $(".js-shop-list").empty().append(_html);

        //当渲染完shoplist后，根据selectedshops渲染当前item的selected状态
        if(!floors){
            $.each(_shopList,function(i,shop){
                if(shop.id && typeof selectedShops[shop.id]!=="undefined"){
                    var _index=i;

                    $(".js-shop-list").find("li").eq(_index).addClass("selected");
                }
            });
        }
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
        });

        //模糊搜索
        $(".zl-shop-filter").on("input",function(){
            console.log(123);
            $(".js-shop-list li").each(function(){
                console.log($(this).find("span").html());
                if($(this).find("span").html().indexOf($(".zl-shop-filter").val())<0){
                    $(this).addClass("hide");
                }else{
                    $(this).removeClass("hide");
                }
            })

        });

    }

    su.modalShow=function(callback,data){
        $("#unitSelectModal").modal("show");

        if(typeof callback!=="undefined"){
            selectCallback=callback;
        }
        if(typeof data !=='undefined'){
            selectedShops=$.extend(selectedShops,data);
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
        _inputFilter();
    }
    su.modalHide=function(){
        $("#unitSelectModal").modal("hide");


        su.reset();
        selectCallback=undefined;

    }

    su.update=function(data,mod){
        dataOri=$.extend(true,{},data);
        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            shopSelectMod=mod
        }else{
            shopSelectMod="single";
        }
        _updateTemp();
    };


    su.init=function(data,mod){
        dataOri=$.extend(true,{},data);
        console.log(dataOri);
        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            shopSelectMod=mod
        }else{
            shopSelectMod="single";
        }
        _insertTemp();
    };

    return su;
})(jQuery,selectUnit||{});


/**
 * Created by whobird on 2018/4/9.
 */

var selectModalView=(function($){
    var selectModalView={};


    var _selectedShops={
        "s001-001":{
            "id":"s001-001",
            "name":"001-101"
        }
    };
    var _selectedAccounts={
        "b01":{
            "id":"b01",
            "name":"B01",
            "value":"租金/2016-01/3,517.45元/3,517.45元"
        }
    }

    var _selectedShops={
        "s01":{
            "id":"s01",
            "name":"S01",
            "value":"租金/2016-01/3,517.45元/3,517.45元"
        }
    }

    var _selectedForms={
        "519":  {
            "nodeId": 519,
            "nodeName": "测试三级业态"
        }
    }

    function _setInput(_selectedShops){
        var _nameList=[];
        $.each(_selectedShops,function(id,shop){
            _nameList.push(shop.name);
        })


        $("#js-unit-select").val(_nameList.join(","));
    }
    selectModalView.eventInit=function(){
        $("#js-view").on("click",function(e){
            selectUnit.modalShow(
                function(selectedShops){
                    _selectedShops=selectedShops;
                    _setInput(_selectedShops)
                },_selectedShops)
        });


        $("#js-account-view").on("click",function(e){
            selectAccountList.modalShow(
                function(selectedAccounts){
                    _selectedAccounts=selectedAccounts;
                    //console.log(_selectedAccounts);
                },_selectedAccounts)
        });


        $("#js-form-view").on("click",function(e){
            selectForm.modalShow(
                function(selectedForms){
                    _selectedForms=selectedForms;
                    //console.log(_selectedForms);
                },_selectedForms)
        });

        $("#js-shop-view").on("click",function(e){
            selectShopList.modalShow(
                function(selectedShops){
                    _selectedShops=selectedShops;
                    //console.log(_selectedShops);
                },_selectedShops)
        });
    };



    selectModalView.init=function(){
        $("#preloader").fadeOut("fast");
        $.get("../common/unit_select_data.json",function(data,status){
            console.log("select uint init")
            selectUnit.init(data,"multi");
        });


        $.get("../common/account_select_data.json",function(data,status){
            //console.log(data);
            //console.log(status)
            selectAccountList.init(data,"multi");
        });

        $.get("../common/form_data.json",function(data,status){
            //console.log(data);
            //console.log(status)
            selectForm.init(data,"single");
        });

        $.get("../common/shop_select_data.json",function(data,status){
            //console.log(data);
            //console.log(status)
            selectShopList.init(data,"multi");
        });

        //test
        setTimeout(function(){
            $.get("../common/account_select_data2.json",function(data,status){
                console.log(data);
                console.log(status)
                selectAccountList.update(data,"multi");
            });
        },8000);

        /* setTimeout(function(){
            $.get("../common/unit_select_data2.json",function(data,status){
                //console.log(data);
                //console.log(status)
                selectUnit.update(data,"multi");
            });
        },3000);*/

        selectModalView.eventInit();

    };

    return selectModalView;

})(jQuery);


$(document).ready(function(){
    selectModalView.init();
});
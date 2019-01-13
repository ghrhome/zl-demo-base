var pageView = (function ($) {
    var pageView = {};

    //初始化
    pageView.init = function () {
        pageView.nweData();
        pageView.loaunitIn();
        pageView.loud();
        pageView.dropDown();
        pageView.bindingStoreNo();
        pageView.bindingSubmit();
        pageView.ajaxSelect();
        $("#berth").hide();

        $("#sourceType").parent().on('click',function (e) {
            let target=$(e.target);
            if(target.is('a')&&target.text()=='租户'){
                $("#berth").show(500);
                $('#applyIdDiv').find('ul li').remove();
                $('#applyIdDiv').find('.zl-dropdown-btn')[0].innerHTML = '请选择';
                $("#applyId").val("");
                $($('#applyIdDiv').find('.zl-dropdown-btn')[0]).attr("disabled",false);
            }else if(target.is('a')){
                $("#berth").hide(500);
                dataQuery = {
                    mallId: $('#mallId').val(),
                    departmentName:$("#sourceTypeButton").val()
                };
                $.ajax({
                    cache: false,
                    type: "POST",
                    url: merchantWeb_Path+"repair/loggedInInformation",
                    data: dataQuery,
                    async: false,
                    dataType: "JSON",
                    async: false,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("系统异常");
                    },
                    success: function (authorization) {
                        console.log(authorization);
                        $('#applyIdDiv').find('ul li').remove();
                        // let li = `<li><a href="#" data-value="${authorization['id']}">${authorization['realname']}</a></li>`;
                        // $('#applyIdDiv').find('ul').append(li);
                        $('#applyIdDiv').find('.zl-dropdown-btn')[0].innerHTML = authorization.realname;
                        $('#applyIdDiv').find('.zl-dropdown-btn')[0].disabled='ture';
                        $("#applyId").val(authorization.id);

                    }
                });
            }
        })

        $(".btn-group").ysdropdown({
            callback: function () {
            }
        });
    };

    //绑定增加提交按钮
    pageView.bindingSubmit = function () {
        $("#submit").on("click", pageView.eventInit);
    }

    //绑定显示选择获取商铺号的方法
    pageView.bindingStoreNo = function () {
        $(".required").on("click", pageView.loaunitOut);
        $(".js-cancel").on("click", pageView.loaunitIn);
    }

    //增加方法
    pageView.eventInit = function () {
        var dataQuery = $('#add_form').serialize();
        var imgUrl = new Array()
        $("#zl-img-id").find('em').each(function () {
            imgUrl.push($(this).attr("data-mfp-src"));
        });
        if($($('#applyIdDiv').find('input')[0]).val() != ''){
            dataQuery = dataQuery+"&applyName="+ $('#applyIdDiv').find('.zl-dropdown-btn')[0].innerHTML;
        }else{
            dataQuery = dataQuery+"&applyName=";
        }
        dataQuery = dataQuery + '&imgUrl=' + imgUrl;
        console.log(dataQuery);

        var url = "repairAdd";
        $.ajax({
            cache: true,
            type: "POST",
            url: url,
            data: dataQuery,
            async: false,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("系统异常");
            },
            success: function (resultData) {
                console.log(resultData.code);
                if (resultData.code == 0) {
                    alert("保存成功");
                    window.location = merchantWeb_Path + "repair/init";
                } else {
                    alert("保存失败！");
                    window.location = merchantWeb_Path + "repair/init";
                }
            }
        });
    };

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();

    }

    //弹出层
    pageView.loaunitOut = function () {
        $('#unitSelectModal').slideDown();
        $('.modal-backdrop').show();

    }

    //隐蔽
    pageView.loaunitIn = function () {
        $('#unitSelectModal').slideUp();
        $('.modal-backdrop').hide();
    }

    pageView.nweData = function () {
        $(".zl-repair-date-add").find("input").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        });

        $(".zl-repair-date-add").find("input").datetimepicker({
            format: "yyyy-mm-dd ",
            todayBtn: "linked",
            startView: 0,
            minView: 0,
            autoclose: true,
            language: "zh-CN",
        });
    }
    //下拉选项
    pageView.dropDown = function () {
        $('#zl-section-collapse-table-1').on('click', function (event) {
            var target = $(event.target);
            if (target.is('a') && target.attr('data-id') != undefined) {
                var txt = target.text();
                var id = target.attr('data-value');
                target.parents('ul').prev().text(txt);
                target.parents('ul').prev().prev().val(id);
            }
        })
    }

    //内容改变时查询商铺号
    $("#textboxID").bind("input propertychange", function () {
        alert($(this).val());
    });

    //楼栋效果
    pageView.loud = function () {
        var _selectedShops = {};
        var mallId = $("#mallId").val();
        var data = {
            mallId: mallId
        }

        // $.post(accessUrl + 'merchant_web/merAnnouncement/tenantListAjaxNew2.htm', data, function (result) {
        //     console.log(result);
        //     var resultData = eval('(' + result + ')');
        //     // 楼层列表
        //     var listFloors = resultData.list;
        //     for (var i = 0; i < listFloors.length; i++) {
        //         var listStores = resultData["store_" + listFloors[i].id];
        //         for (var j = 0; j < listStores.length; j++) {
        //             $("body").data("_store_" + listStores[j].id, listStores[j]);
        //         }
        //     }
        //     selectUnit.init(data, "single");
        // });

        var data = {
            "buildings": {
                "6": {
                    "id": 6,
                    "floors": [],
                    "name": "MB"
                },
                "7": {
                    "id": 7,
                    "floors": [
                        {
                            "id": 61,
                            "shops": [
                                {
                                    "id": "1CYHT10200263",
                                    "name": "深圳静港门诊部有限公司"
                                },
                                {
                                    "id": "1CYHT10201926",
                                    "name": "深圳静港门诊部有限公司"
                                },
                                {
                                    "id": "1CYHT10201927",
                                    "name": "杨帆"
                                },
                                {
                                    "id": "1CYHT10201929",
                                    "name": "深圳第一健康医疗管理有限公司"
                                }
                            ],
                            "name": "F10"
                        },
                        {
                            "id": 62,
                            "shops": [
                                {
                                    "id": "1CYHT10201928",
                                    "name": "杨帆"
                                }
                            ],
                            "name": "F11"
                        },
                        {
                            "id": 63,
                            "shops": [
                                {
                                    "id": "1CYHT10200292",
                                    "name": "深圳市永鑫伟业投资管理有限公司"
                                },
                                {
                                    "id": "1CYHT10200493",
                                    "name": "三九企业集团（深圳南方制药厂）"
                                },
                                {
                                    "id": "1CYHT10200601",
                                    "name": "深圳市融辉投资发展有限公司"
                                },
                                {
                                    "id": "1CYHT10200688",
                                    "name": "三九药业"
                                },
                                {
                                    "id": "1CYHT10201776",
                                    "name": "深圳市科睿机械人教育科技有限公司"
                                },
                                {
                                    "id": "1CYHT10201960",
                                    "name": "三九企业集团（深圳南方制药厂）"
                                },
                                {
                                    "id": "1CYHT10201960",
                                    "name": "三九企业集团（深圳南方制药厂）"
                                },
                                {
                                    "id": "1CYHT10201985",
                                    "name": "中国电信股份有限公司深圳分公司"
                                }
                            ],
                            "name": "F12"
                        },
                        {
                            "id": 53,
                            "shops": [
                                {
                                    "id": "1CYHT10201151",
                                    "name": "深圳康睿仕运动康复门诊部有限公司"
                                },
                                {
                                    "id": "1CYHT10201151",
                                    "name": "深圳康睿仕运动康复门诊部有限公司"
                                },
                                {
                                    "id": "1CYHT10201151",
                                    "name": "深圳康睿仕运动康复门诊部有限公司"
                                },
                                {
                                    "id": "1CYHT10201450",
                                    "name": "上善齿科"
                                }
                            ],
                            "name": "F2"
                        },
                        {
                            "id": 54,
                            "shops": [
                                {
                                    "id": "1CYHT10201852",
                                    "name": "Gymboree 金宝贝"
                                }
                            ],
                            "name": "F3"
                        },
                        {
                            "id": 55,
                            "shops": [
                                {
                                    "id": "1CYHT10200812",
                                    "name": "深圳市福田区瑞思培训中心-深圳"
                                },
                                {
                                    "id": "1CYHT10201289",
                                    "name": "深圳市借山馆艺术有限公司"
                                }
                            ],
                            "name": "F4"
                        },
                        {
                            "id": 56,
                            "shops": [
                                {
                                    "id": "1CYHT10201754",
                                    "name": "中国平安财产保险股份有限公司深圳分公司"
                                }
                            ],
                            "name": "F5"
                        },
                        {
                            "id": 57,
                            "shops": [
                                {
                                    "id": "1CYHT10201754",
                                    "name": "中国平安财产保险股份有限公司深圳分公司"
                                }
                            ],
                            "name": "F6"
                        },
                        {
                            "id": 58,
                            "shops": [
                                {
                                    "id": "1CYHT10201754",
                                    "name": "中国平安财产保险股份有限公司深圳分公司"
                                }
                            ],
                            "name": "F7"
                        },
                        {
                            "id": 59,
                            "shops": [
                                {
                                    "id": "1CYHT10201401",
                                    "name": "华泰证券股份有限公司深圳分公司-深圳"
                                },
                                {
                                    "id": "1CYHT10201582",
                                    "name": "深圳市派特森培训中心"
                                }
                            ],
                            "name": "F8"
                        },
                        {
                            "id": 60,
                            "shops": [
                                {
                                    "id": "1CYHT10201785",
                                    "name": "万科企业股份有限公司"
                                }
                            ],
                            "name": "F9"
                        }
                    ],
                    "name": "OA"
                },
                "8": {
                    "id": 8,
                    "floors": [
                        {
                            "id": 64,
                            "name": "F1"
                        },
                        {
                            "id": 73,
                            "shops": [
                                {
                                    "id": "1CYHT10201448",
                                    "name": "印力商用置业有限公司"
                                },
                                {
                                    "id": "1CYHT10201913",
                                    "name": "百思买国际贸易(上海)有限公司"
                                }
                            ],
                            "name": "F10"
                        },
                        {
                            "id": 74,
                            "shops": [
                                {
                                    "id": "1CYHT10201448",
                                    "name": "印力商用置业有限公司"
                                },
                                {
                                    "id": "1CYHT10201448",
                                    "name": "印力商用置业有限公司"
                                },
                                {
                                    "id": "1CYHT10201448",
                                    "name": "印力商用置业有限公司"
                                },
                                {
                                    "id": "1CYHT10201448",
                                    "name": "印力商用置业有限公司"
                                }
                            ],
                            "name": "F11"
                        },
                        {
                            "id": 75,
                            "shops": [
                                {
                                    "id": "1CYHT10201448",
                                    "name": "印力商用置业有限公司"
                                },
                                {
                                    "id": "1CYHT10201448",
                                    "name": "印力商用置业有限公司"
                                },
                                {
                                    "id": "1201800013",
                                    "name": "CQ测试品牌"
                                }
                            ],
                            "name": "F12"
                        },
                        {
                            "id": 65,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F2"
                        },
                        {
                            "id": 66,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F3"
                        },
                        {
                            "id": 67,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F4"
                        },
                        {
                            "id": 68,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F5"
                        },
                        {
                            "id": 69,
                            "shops": [
                                {
                                    "id": "1CYHT10200186",
                                    "name": "Tera Wellness 一兆韦德"
                                },
                                {
                                    "id": "1CYHT10201955",
                                    "name": "广州伟吉贸易有限公司深圳分公司"
                                },
                                {
                                    "id": "1CYHT10201972",
                                    "name": "深圳云逸共享科技有限公司"
                                },
                                {
                                    "id": "1CYHT10201979",
                                    "name": "马锦山"
                                },
                                {
                                    "id": "1CYHT10201980",
                                    "name": "丸来玩趣"
                                },
                                {
                                    "id": "1CYHT10201981",
                                    "name": "杨姐自造"
                                },
                                {
                                    "id": "1CYHT10201982",
                                    "name": "牛哥的凉皮铺"
                                },
                                {
                                    "id": "1CYHT10201988",
                                    "name": "深圳市易乐娱乐科技有限公司"
                                }
                            ],
                            "name": "F6"
                        },
                        {
                            "id": 70,
                            "shops": [
                                {
                                    "id": "1CYHT10201760",
                                    "name": "深圳市嘉信诺家具有限公司"
                                },
                                {
                                    "id": "1CYHT10201774",
                                    "name": "深圳市歌志轩餐饮有限公司-深圳"
                                }
                            ],
                            "name": "F7"
                        },
                        {
                            "id": 71,
                            "shops": [
                                {
                                    "id": "1CYHT10200213",
                                    "name": "普洛斯投资（上海）有限公司"
                                },
                                {
                                    "id": "1CYHT10200578",
                                    "name": "深圳深国投商用置业有限公司"
                                },
                                {
                                    "id": "1CYHT10200878",
                                    "name": "深圳至尚敏贸易有限公司"
                                },
                                {
                                    "id": "1CYHT10200879",
                                    "name": "兴业证券股份有限公司深圳分公司"
                                },
                                {
                                    "id": "1CYHT10201906",
                                    "name": "Meten English 美联英语"
                                }
                            ],
                            "name": "F8"
                        },
                        {
                            "id": 72,
                            "shops": [
                                {
                                    "id": "1CYHT10201448",
                                    "name": "印力商用置业有限公司"
                                }
                            ],
                            "name": "F9"
                        }
                    ],
                    "name": "OB"
                },
                "9": {
                    "id": 9,
                    "floors": [
                        {
                            "id": 76,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                },
                                {
                                    "id": "10011800634",
                                    "name": "四方谷翠"
                                },
                                {
                                    "id": "10011800636",
                                    "name": "五谷渔粉"
                                },
                                {
                                    "id": "10011800636",
                                    "name": "五谷渔粉"
                                },
                                {
                                    "id": "10011800689",
                                    "name": "Oversea Dragon 四海游龙"
                                },
                                {
                                    "id": "10011800705",
                                    "name": "JOJO/四季熊"
                                },
                                {
                                    "id": "10011800741",
                                    "name": "五谷日记"
                                }
                            ],
                            "name": "B1"
                        },
                        {
                            "id": 77,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F1"
                        },
                        {
                            "id": 86,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F10"
                        },
                        {
                            "id": 87,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F11"
                        },
                        {
                            "id": 88,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F12"
                        },
                        {
                            "id": 78,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F2"
                        },
                        {
                            "id": 79,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F3"
                        },
                        {
                            "id": 80,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F4"
                        },
                        {
                            "id": 81,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F5"
                        },
                        {
                            "id": 82,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F6"
                        },
                        {
                            "id": 83,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F7"
                        },
                        {
                            "id": 84,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F8"
                        },
                        {
                            "id": 85,
                            "shops": [
                                {
                                    "id": "1CYHT10200217",
                                    "name": "Wal-Mart 沃尔玛"
                                }
                            ],
                            "name": "F9"
                        }
                    ],
                    "name": "OC"
                },
                "10": {
                    "id": 10,
                    "floors": [
                        {
                            "id": 89,
                            "shops": [
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1201800004",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800092",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800100",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800104",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800115",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800115",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800124",
                                    "name": "云南特产"
                                },
                                {
                                    "id": "10011800133",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800133",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800136",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800154",
                                    "name": "REC"
                                },
                                {
                                    "id": "10011800281",
                                    "name": "619品牌2"
                                },
                                {
                                    "id": "10011800434",
                                    "name": "七星会所"
                                },
                                {
                                    "id": "10011800469",
                                    "name": "翡記1982"
                                },
                                {
                                    "id": "10011800478",
                                    "name": "七田阳光"
                                },
                                {
                                    "id": "10011800523",
                                    "name": "WSFM 五色风马"
                                },
                                {
                                    "id": "10011800530",
                                    "name": "五分钟米饭"
                                },
                                {
                                    "id": "10011800538",
                                    "name": "WSFM 五色风马"
                                },
                                {
                                    "id": "10011800566",
                                    "name": "JOJO/四季熊"
                                },
                                {
                                    "id": "10011800586",
                                    "name": "五洲会"
                                },
                                {
                                    "id": "10011800592",
                                    "name": "四条小鱼"
                                },
                                {
                                    "id": "10011800594",
                                    "name": "超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长"
                                },
                                {
                                    "id": "10011800595",
                                    "name": "四方谷翠"
                                },
                                {
                                    "id": "10011800596",
                                    "name": "超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长"
                                },
                                {
                                    "id": "10011800597",
                                    "name": "JOJO/四季熊"
                                },
                                {
                                    "id": "10011800598",
                                    "name": "Oversea Dragon 四海游龙"
                                },
                                {
                                    "id": "10011800599",
                                    "name": "华飞四季旺"
                                },
                                {
                                    "id": "10011800604",
                                    "name": "JOJO/四季熊"
                                },
                                {
                                    "id": "10011800637",
                                    "name": "四方谷翠"
                                },
                                {
                                    "id": "10011800641",
                                    "name": "五洲会"
                                },
                                {
                                    "id": "10011800666",
                                    "name": "超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长"
                                },
                                {
                                    "id": "10011800688",
                                    "name": "超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长"
                                },
                                {
                                    "id": "10011800750",
                                    "name": "JOJO/四季熊"
                                },
                                {
                                    "id": "10011800761",
                                    "name": "四喜玩具"
                                },
                                {
                                    "id": "10011800772",
                                    "name": ""
                                }
                            ],
                            "name": "B1"
                        },
                        {
                            "id": 90,
                            "shops": [
                                {
                                    "id": "1CYHT10200244",
                                    "name": "CMBC 招商银行"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200935",
                                    "name": "Adidas 阿迪达斯"
                                },
                                {
                                    "id": "1CYHT10200998",
                                    "name": "Nike 耐克"
                                },
                                {
                                    "id": "1CYHT10201531",
                                    "name": "华润堂"
                                },
                                {
                                    "id": "1201800001",
                                    "name": "APPLE电脑"
                                },
                                {
                                    "id": "10011800250",
                                    "name": "KGK1905"
                                },
                                {
                                    "id": "10011800384",
                                    "name": "Nike360 耐克360"
                                },
                                {
                                    "id": "10011800400",
                                    "name": "Nike360 耐克360"
                                },
                                {
                                    "id": "10011800411",
                                    "name": "Peace Bird 太平鸟男装"
                                },
                                {
                                    "id": "10011800418",
                                    "name": "Nike360 耐克360"
                                },
                                {
                                    "id": "10011800431",
                                    "name": "adidas、nike360、puma"
                                },
                                {
                                    "id": "10011800470",
                                    "name": "翡記1982"
                                },
                                {
                                    "id": "10011800476",
                                    "name": "七分屋"
                                },
                                {
                                    "id": "10011800489",
                                    "name": "翡記1982"
                                },
                                {
                                    "id": "10011800497",
                                    "name": "翡記1982"
                                },
                                {
                                    "id": "10011800505",
                                    "name": "超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长"
                                },
                                {
                                    "id": "10011800571",
                                    "name": "四方谷翠"
                                },
                                {
                                    "id": "10011800589",
                                    "name": "五分钟米饭"
                                },
                                {
                                    "id": "10011800600",
                                    "name": "Oversea Dragon 四海游龙"
                                },
                                {
                                    "id": "10011800690",
                                    "name": "超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长测试超长"
                                },
                                {
                                    "id": "10011800749",
                                    "name": "五洲会"
                                },
                                {
                                    "id": "10011800802",
                                    "name": "一品面"
                                }
                            ],
                            "name": "L1"
                        },
                        {
                            "id": 91,
                            "shops": [
                                {
                                    "id": "1CYHT10200935",
                                    "name": "Adidas 阿迪达斯"
                                },
                                {
                                    "id": "1CYHT10200998",
                                    "name": "Nike 耐克"
                                }
                            ],
                            "name": "L1M"
                        },
                        {
                            "id": 92,
                            "shops": [
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "1CYHT10200245",
                                    "name": "Sam's Club 山姆会员店"
                                },
                                {
                                    "id": "10011800132",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800143",
                                    "name": "CQ测试品牌"
                                },
                                {
                                    "id": "10011800555",
                                    "name": "五洲会"
                                },
                                {
                                    "id": "10011800626",
                                    "name": "四方谷翠"
                                }
                            ],
                            "name": "L2"
                        },
                        {
                            "id": 93,
                            "name": "L3"
                        }
                    ],
                    "name": "MA"
                }
            },
            "projectId": "1",
            "buildingList": [
                {
                    "id": 9,
                    "name": "OC"
                },
                {
                    "id": 8,
                    "name": "OB"
                },
                {
                    "id": 7,
                    "name": "OA"
                },
                {
                    "id": 6,
                    "name": "MB"
                },
                {
                    "id": 10,
                    "name": "MA"
                }]
        };

        selectUnit.init(data, "single");

        $('#storeNamesShow').on('click', function () {
            selectUnit.modalShow(
                function (selectedShops) {
                    _selectedShops = selectedShops;
                    _setInput(_selectedShops)
                }, _selectedShops)
        })

        //点击确定后的操作
        function _setInput(data) {
            for (var i in data) {
                $('input[name=storeNamesShow]').val(data[i].id);
                $('input[name=brandName]').val(data[i].name);

                dataQuery={'contNo': data[i].id};
                $.ajax({
                    cache: false,
                    type: "POST",
                    url: merchantWeb_Path+"repair/queryTenant",
                    data: dataQuery,
                    async: false,
                    dataType: "JSON",
                    async: false,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("系统异常");
                    },
                    success: function (queryTenant) {
                        console.log(queryTenant);
                        $('#applyIdDiv').find('ul li').remove();

                        for(var tenant in queryTenant){
                            console.log(queryTenant[tenant].id);
                            let li = `<li><a href="#"  data-value="${queryTenant[tenant].id}">${queryTenant[tenant].clerkName}</a></li>`;
                            $('#applyIdDiv').find('ul').append(li);
                        }
                    }
                });
            }
        }
    }

    pageView.ajaxSelect = function (url, data, callback) {
        $.ajax({
            cache: true,
            type: "POST",
            dataType: "json",
            data: {mallId: ""},
            url: netcommentWeb_Path + "netcomment/selectFeeType.htm",
            async: true,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if (resultData) {
                    var availableTags = resultData.data;
                    $("body").data("_feeTypeList", availableTags);
                    $(".js-account-fee-types").autocomplete({
                        source: availableTags,
                        minLength: 0,
                        select: function (event, ui) {
                            var feeCode = ui.item.value;
                            this.value = ui.item.label;
                            return false;
                        }
                    });
                }
            }
        });
    }

    return pageView;

})(jQuery);


$(document).ready(function () {
    pageView.init();

    $('.zl-img-wrapper').on("click", ".zl-icon-btn-del", function (e) {
        e.preventDefault();
        //ajax and warning callback
        $(this).closest("li").remove();
    })

    function _getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    $('#fileupload').fileupload({
        //url: url,
        dataType: 'json',
        add: function (e, data) {
            $.each(data.files, function (index, file) {
                //_preview(file)
                uploadFiles(file);
            });
            data.submit();
        },
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                //$('<p/>').text(file.name).appendTo('#files');
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css('width', progress + '%'
            );
        }
    })

    function uploadFiles(file) {
        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "FILE_MER_REPAIR_APPLY");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
            //url: 'http://localhost:1024/file_web/sdk/platform/file',
            url: fileWeb_Path + '/sdk/platform/file',
            type: 'POST',
            dataType: "json",
            cache: false,
            async: true,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            if (response.success) {
                var url = accessUrl + response.data.path;
                var _tmp =
                    " <li>" +
                    "   <div class=\"zl-thumbnail-wrapper\">" +
                    "       <em class='zl-thumbnail' data-mfp-src='" + url + "' style='background-image:url( " + url + ")'" +
                    "        ></em>" +
                    "       <a class=\"zl-icon-btn zl-icon-btn-del\" href='javascript:void(0)'></a>" +
                    "   </div>" +
                    "</li>";

                //将图片动态添加到图片展示区
                $(".zl-img-wrapper>ul").append(_tmp);
                $('.zl-thumbnail').magnificPopup({
                    type: 'image',
                });
            } else {
                alert(response.message);
            }
        });
    }

});


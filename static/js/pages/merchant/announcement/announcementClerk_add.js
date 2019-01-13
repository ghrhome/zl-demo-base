var pageView = (function ($) {
    var pageView = {};
    var container = $("#page-announcement");
    var _selectedShops={};
    //
    var mydata={
        "projectId": "pid001",
        "buildingList":[
            {
                "name":"B01",
                "id":"b01"
            },{
                "name":"B02",
                "id":"b02"
            }
        ],
        "buildings":{
            "b01":{
                "name":"B01",
                "id":"b01",
                "floors":[
                    {
                        "name":"F1",
                        "id":"b01-f1",
                        "shops":[
                            {
                                "name":"001-101",
                                "id":"s001-001"
                            },
                            {
                                "name":"001-102",
                                "id":"s001-002"
                            },
                            {
                                "name":"001-103",
                                "id":"s001-003"
                            }
                        ]
                    }
                ]
            },
            "b02":{
                "name":"B02",
                "id":"b02",
                "floors":[
                    {
                        "name":"F1",
                        "id":"b02-f1",
                        "shops":[
                            {
                                "name":"002-101",
                                "id":"s002-001"
                            },
                            {
                                "name":"002-102",
                                "id":"s002-002"
                            }
                        ]
                    }
                ]
            }
        }
    };
   selectUnit.init(mydata,"multi");


    pageView.init = function () {
        pageView.sendDate();
        // 业态多选实现方法
        $('#userSelectLayoutModal .zl-checkbox').on('click',function () {
            $(this).toggleClass('checked');
        });

        // 这是业态将选中的文本放入输入框中的显示的方法
        $("#userSelectLayoutModal .js-submit").on("click",function(){
           // var str="";
            var layoutCds = "";
            var names="";
            var mallId=$("#mallId>input").val();
            $("#userSelectLayoutModal li").each(function(){
                if($(this).find("em").hasClass("checked")){
                    names+=$(this).find("span").html()+",";
                    layoutCds+=$(this).find("span").attr("data-id")+",";
                };
            });
            names=names.substr(0,names.length-1);
            $.ajax({
                cache: true,
                type: "post",
                url: "layoutfindzuhu.htm",
                data: {'mallId':mallId,"layoutCds":layoutCds},
                datatype:'json',
                async: false,
                error: function (request) {
                    alert("系统异常");
                    pageView.loadingHide();
                },
                success: function (data) {
                    if(null==data||data==""){
                        alert("未查询到该业态的租户，请检查是否已在租户管理中添加了该租户");//要获取到业态id和合同号。
                    }else{
                        $("#clerkOpenIds").val(data);
                        $("#js-user-select").val(names);//显示名称。
                    }

                }
            });
            // 将业态选择的获取到的租户id返回到前台

            $("#userSelectLayoutModal").modal("hide");
        });
        // 业态取消的方法
         $("#userSelectLayoutModal .js-cancelBlock").on("click",function(){
                $("#userSelectLayoutModal").modal("hide");
           });

        //  这是楼层将选中的文本放入选入框中显示的方法,
        $("#userSelectFloorModal .js-submit").on("click",function(){
            var str="";
            var ids = "";
            var mallId=$("#mallId>input").val();
            $("#userSelectFloorModal li").each(function(){
                if($(this).find("em").hasClass("checked")){
                    str+=$(this).find("span").html()+" ";
                    ids+=$(this).find("span").data("id")+",";
                }
            });
            // 根据楼层id查找到租户
            ids=ids.substr(0,ids.length-1);
            str=str.substr(0,str.length-1);
            $.ajax({
                cache: true,
                type: "post",
                url: "floorsfindzuhu.htm",
                data: {'ids':ids,'mallId':mallId},
                datatype:'json',
                async: false,
                error: function (request) {
                    alert("系统异常");
                    pageView.loadingHide();
                },
                success: function (data) {
                    if(null==data||data==""){
                        alert("未查询到该楼层的租户，请检查是否已在租户管理中添加了该租户");//要获取到业态id和合同号。
                    }else{
                        $("#js-user-select").val(str);//要获取到业态id和合同号。
                        $("#clerkOpenIds").val(data);
                    }

                }
            });
            //$("#js-user-select").val(ids);
            $("#userSelectFloorModal").modal("hide");
        });

        //楼层取消的方法
         $("#userSelectFloorModal .js-cancelFloor").on("click",function(){
                 $("#userSelectFloorModal").modal("hide");
         });


       // 选楼层的方法userSelectFloorModal
        $('body').on('click','#userSelectFloorModal .zl-checkbox',function () {
            $(this).toggleClass('checked');
        })

                  // 选项目的的方法
                $('body').on('click','#userSelectProjectModal .zl-checkbox',function () {
                    $(this).toggleClass('checked');
                })
    };

    //时间插件初始化
    pageView.sendDate =function(){
        $(".zl-datetimepicker-sendDate input").datetimepicker({
            language: 'zh-CN',
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            forceParse: 0
        });
    }

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    //打印获取到的前端值
    pageView.opened = function () {
        $("#js-user-select").on("click",function(e){
            // 这是判断项目是否选择的方法
            if($("#mallId>button").html()=="--请选择项目--"){
                alert("请选择项目");
                return;
            }

            console.log($("input[name=selectPeopleType]:checked").attr("id"));
            var selectTypeId=$("input[name=selectPeopleType]:checked").attr("id");
            //业态
            if(selectTypeId=="select-people-layout"){
                $("#userSelectLayoutModal").modal("show");
                return;
            }
            //这是楼层下拉框的方法
            if(selectTypeId=="select-people-floor"){
                $("#userSelectFloorModal").modal("show");
                return;
            }
            //租户
            selectUnit.modalShow(
                function(selectedShops){
                    _selectedShops=selectedShops;
                    _setInput(_selectedShops)
                },_selectedShops)
        });
        //试题选择下拉框
        $(".zl-dropdown-inline-exam").ysdropdown({
            callback:function(val, $elem){
               /* if ($elem.data("id") == "page-limit"){
                    $("#search").find("input[name=page]").val(1);
                    $("#search").find("input[name=itemsPerPage]").val(val);
                }
                $("#search").submit();*/
            }
        });
        //类型下拉
        $(".zl-dropdown-inline-informationType").ysdropdown({
            callback:function(val, $elem){
                if(val=='2012'){
                    $("#sourceType").val(12);
                    $(".zl-edit-require-exam").show();
                }else{

                    $("#sourceType").val(13);
                    $(".zl-edit-require-exam").hide();
                }
                /* if ($elem.data("id") == "page-limit"){
                     $("#search").find("input[name=page]").val(1);
                     $("#search").find("input[name=itemsPerPage]").val(val);
                 }
                 $("#search").submit();*/
            }
        });
        //楼栋下拉框
        $(".zl-dropdown-btn-block").ysdropdown({
            callback:function(val, $elem){
                $.ajax({
                    cache: true,
                    type: "post",
                    url: "announcementfindBlockId.htm",
                    data: {id:val},
                    datatype:'json',
                    async: false,
                    error: function (request) {
                        alert("系统异常");
                        pageView.loadingHide();
                    },
                    success: function (data) {
                        /*$(".zl-dropdown-inline").append(data);*/
                        $("#userSelectFloorModal .modal-body>ul").html("");
                        console.log(JSON.parse(data));
                        var result=JSON.parse(data);
                        var html="";
                        if(result.data){
                            $.each(result.data.BsFloorList,function(i,v){
                                 html+='<li style="margin-bottom:5px;"><em class="zl-checkbox" style="vertical-align:-2px;">' +
                                    '</em><span style="margin-left:15px;" data-id="'+v.id+'">'+v.floorName+'</span></li>';

                            })
                        }
                        $("#userSelectFloorModal .modal-body>ul").html(html);
                    }
                });
            }
        });



        //项目下拉框
        $(".zl-dropdown-inline-mallId").ysdropdown({
            callback:function(val,$elem){

                console.log("===================")
                console.log($elem);
                console.log(val);  //此处拿到楼栋值

                if($elem.data("id")=="mallId"){
                    console.log("选择的mallid值"+$("#mallId>input").val());
                    //根据项目id获取楼栋
                    $.ajax({
                        cache: true,
                        type: "post",
                        url: "announcementfindBlockByMallId.htm",
                        data: {mallId:val},
                        datatype:'json',
                        async: false,
                        error: function (request) {
                            alert("系统异常");
                            pageView.loadingHide();
                        },
                        success: function (data) {
                            // $(".zl-dropdown-inline").append(data);
                            //$("#userSelectFloorModal .modal-body>ul").html("");
                            console.log(JSON.parse(data));
                            var result=JSON.parse(data);
                            var html="";
                            if(result.data){

                               $.each(result.data.BsBlockList,function(i,v){
                                   //console.log("================222222==============================i:"+i);
                                   //console.log(v);

                                   html+='<li><a data-value="'+v.id+'" name="floorids">'+v.blockName+'</a>'
                               })
                           }

                            $(".modal-body .zl-dropdown-inline>ul").html(html);
                            /*$('body').on('click','#userSelectFloorModal .zl-checkbox',function () {
                                $(this).toggleClass('checked');
                            })*/
                        }
                    });

                    // 拿到项目值后启动获取json的方法
                  pageView.announcementCommit(val);
                    return;
                };

                //---------------------------------------------------------------
               // console.log($elem);
            }
        });
    }

    // 将立即制定时间显示再input内并设定为只读
    var dat = new Date();
    console.log(dat.getDate());
    $("input[name=sendTime]").val(dat.getFullYear()+"-"+(parseInt(dat.getMonth())+1)+"-"+dat.getDate());
    // $("input[name=sendTime]").val("1111");
    $("#sendTimeRadio>div").on("click",function(){
        if($("#sent-time-0").prop("checked")==true){
           $("input[name=sendTime]").val(dat.getFullYear()+"-"+dat.getMonth()+"-"+dat.getDay());
        };
    });

    //信息增加提交确认(提交表单)
    pageView.announcementCommit = function (mallId) {
        // 验证测试json数据
            $.ajax({
                cache: true,
                type: "post",
                url: "tenantListAjaxNew2.htm",
                data: {'mallId':mallId},
                dataType: "json",
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (data) {
                    //$(".zl-body-list").append(data);

                    console.log(data);
                   console.log("检测楼栋"+data.buildingList)
                    if(data.buildingList==undefined){
                       alert("该项目楼栋没有录入,请重新选择项目")
                        return;
                    }
                    // console.log($('#addAnnouncementForm').serialize())
                    // alert(data.data);
                    // pageView.loadingHide();
                  // selectUnit.init(data,"multi");
                    selectUnit.update(data,"multi");
                }
            });
}
                    /*这是增加判断选择项目的方法,提交失败重新提交*/
        $(".announcement-add-button").on("click", function () {

            if($("#theme").val().trim()==""||$("#theme").val().trim()==null||$("#theme").val().trim()==undefined){
                alert("请填写主题或输入内容为空");
                console.log("请填写主题或输入内容为空");
                return;
            }
            if($("#informationType").val()==""){
                alert("请选择类型");
                console.log("请选择项目");
                return;
            }

            if($("#mallId>button").html()=="--请选择项目--"){
                alert("请选择项目");
                console.log("请选择项目");
                return;}
             /*if($("#clerkOpenIds").val()==""||$("#clerkOpenIds").val()==null||$("#clerkOpenIds").val()==undefined){
                 alert("请选择租户");
                 console.log("请选择租户");
                 return;
             }*/
            if($("#informationType").val()=="2012"){
                    if(!$("#qrCodeName").val()||$("#qrCodeName").val()==null){
                        alert("请选择考试试题！");
                        return;
                    }
            }

            if($("#content").val().trim()==""||$("#content").val().trim()==null||$("#content").val().trim()==undefined){
                alert("消息内容不能为空！");
                console.log("消息内容不能为空");
                return;
            }

            //=================================================================
            confirm("确认要提交吗？", "", "", function (type) {
                if (type == "dismiss") {
                    return;
                }
                if(pageView.validateForm()){
                    return;
                };
                console.log("---------------------------------");
                pageView.loadingShow();
                var params = {};

                $.ajax({
                    cache: true,
                    type: "post",
                    url: "insertAnnouncement.htm",
                    data: $('#addAnnouncementForm').serialize(),
                    dataType: "json",
                    async: false,
                    error: function (request) {
                        console.log(request);
                        alert("系统异常");
                        pageView.loadingHide();
                    },
                    success: function (data) {
                        //$(".zl-body-list").append(data);
                        console.log(data);
                        console.log($('#addAnnouncementForm').serialize())
                        pageView.loadingHide();
                        window.location.href="merAnnouncementIndex.htm"
                    }
                });
            });
        });
        $("#leixing>div").on("click",function(){
            if($(this).find("label").attr("for")=="msg-type-0"){
                $("#serviceType input[type=text]").val("员工考试");
                $("#serviceType input[type=hidden]").val("1");
                $("#informationType").val("2012");
                $("#sourceType").val("12");
                console.log("选择了1");
            }else{
                $("#serviceType input[type=text]").val("证件到期通知");
                $("#serviceType input[type=hidden]").val("2");
                $("#informationType").val("2014");
                $("#sourceType").val("13");
                console.log("选择了2");

            }
        })

    //验证必填项
    pageView.validateForm = function () {
        //主题
        var theme = $("input[name=theme]").val();
        //内容
        var content = $("textarea[name=content]").val();

        if (theme == "" || theme == null) {
            alert("主题不能为空！！！");
            return true;
        }

        if (content == "" || content == null) {
            alert("内容不能为空");
            return true;
        }
        return false;
    }

    //json回调事件
    function _setInput(a){
        console.log("合同号1"+a);
        var contractIdStr="";
        var contractNames="";
        for(var key in a){
            contractIdStr+=key+",";
            contractNames+=a[key]["name"]+",";
        }
        console.log("合同号2"+contractIdStr);
        if(contractNames.length>0){
            contractNames=contractNames.substr(0,contractNames.length-1);
        }

        if(contractIdStr.length>0){
            contractIdStr=contractIdStr.substr(0,contractIdStr.length-1);
        }
        var mallId=$("#mallId>input").val();

        $("#js-user-select").val(contractNames);//要获取到业态id和合同号。
        $("#clerkOpenIds").val(contractIdStr);
        // $.ajax({
        //     cache: true,
        //     type: "post",
        //     url: "contsfindzuhu.htm",
        //     data: {'id':contractIdStr,"mallId":mallId},
        //     datatype:'json',
        //     async: false,
        //     error: function (request) {
        //         alert("系统异常");
        //         pageView.loadingHide();
        //     },
        //     success: function (data) {
        //         console.log("返回的租户"+data);
        //         if(null==data||data==""){
        //             alert("未查询到该合同对应的租户，请检查是否已在租户管理中添加了该租户");
        //         }else{
        //             $("#js-user-select").val(contractNames);//要获取到业态id和合同号。
        //             $("#clerkOpenIds").val(data);
        //         }
        //
        //     }
        // });

        $("#userSelectFloorModal").modal("hide");
        var str="";
        for(var key in a){
            str+=a[key].name+',';
        }
       //$("#js-user-select").val(str);
    }
    return pageView;
})(jQuery);

$(document).ready(function () {
    pageView.loadingHide();
    pageView.init();

    pageView.opened();
});







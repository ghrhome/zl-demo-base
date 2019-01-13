//加载机构树形结构数据
var orgData = null;
var storage = {};
var loading = false;

(function ($) {
    /* ============================== common methods start ============================== */
    function getOrgDate(settings,target){
        $.ajax({
            cache: true,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            url: enrolmentWeb_Path + "common/getOrgTree.htm",
            async: false,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                orgData = jQuery.parseJSON(resultData);
                render(settings,target);
            }
        });
    }

    function addUser(containerId, userId, userName) {
        if (userId == null) {
            return;
        }
        storage[containerId].selectedUserMap[userId] = userName;
    }

    function removeUser(containerId, userId) {
        if (userId == null) {
            return;
        }
        delete storage[containerId].selectedUserMap[userId];
    }

    function removeAllUsers(containerId) {
        storage[containerId].selectedUserMap = {};
    }

    function addObject(containerId, objectId, objectName) {
        if (objectId == null) {
            return;
        }
        storage[containerId].selectedObjectMap[objectId] = objectName;
    }

    function removeObject(containerId, objectId) {
        if (objectId == null) {
            return;
        }
        delete storage[containerId].selectedObjectMap[objectId];
    }

    function removeAllObjects(containerId) {
        storage[containerId].selectedObjectMap = {};
    }


    /* ============================== common methods end ============================== */
    var renderHtml = "<div class='zl-user-selector modal fade in zl-dialog' tabindex='-5' role='dialog' aria-labelledby='exampleModalLabel' style='display: none; padding-right: 17px;'> " +
        "    <div class='modal-dialog' role='document'>                                                                                                            " +
        "        <div class='modal-content'>                                                                                                                       " +
        "            <div class='modal-header clearfix' style='border-bottom-width:0'>                                                                             " +
        "                <button type='button' class='close' data-dismiss='modal' aria-label='Close'></button>                    " +
        "                <h3 class='modal-title'>请选择人员</h3>                                                                                                   " +
        "                <div class='zl-search-bar-grey clearfix' style='padding-top:9px;'>                                                                                                          " +
        "                    <input type='text' placeholder='快速搜索' id='searchUser'>                                                                                            " +
        "                    <span></span>                                                                                                                         " +
        "                </div>                                                                                                                                    " +
        "            </div>                                                                                                                                        " +
        "            <div class='modal-body' style='padding:0'>                                                                                                    " +
        "                <div class='zl-user-selector-block clearfix'>                                                                                             " +
        "                    <div class='zl-user-selector-toolbar'>                                                                                                " +
        "                        <div class='zl-user-selector-toolbar-title clearfix'>                                                                             " +
        "                            <ul>                                                                                                                          " +
        "                                <li class='active department'>按部门</li>                                                                                 " +
        "                            </ul>                                                                                                                         " +
        "                        </div>                                                                                                                            " +
        "                        <div class='zl-user-selector-toolbar-content' style='overflow-y: auto'>                                                           " +
        "                            <div class='zl-user-selector-toolbar-content-department' ></div>                                                              " +
        "                        </div>                                                                                                                            " +
        "                    </div>                                                                                                                                " +
        "                    <div class='zl-user-selector-result'>                                                                                                 " +
        "                        <div class='zl-user-selector-result-title'>                                                                                       " +
        "                            <a>已选人员</a>                                                                                                               " +
        "                            <span></span>                                                                                                                 " +
        "                        </div>                                                                                                                            " +
        "                        <div class='zl-user-selector-result-content'>                                                                                     " +
        "                            <ul>                                                                                                                          " +
        "                            </ul>                                                                                                                         " +
        "                        </div>                                                                                                                            " +
        "                                                                                                                                                          " +
        "                        <div class='zl-user-selector-result-content-for-search'>                                                                          " +
        "                            <ul>                                                                                                                          " +
        "                            </ul>                                                                                                                         " +
        "                        </div>                                                                                                                            " +
        "                    </div>                                                                                                                                " +
        "                </div>                                                                                                                                    " +
        "                                                                                                                                                          " +
        "            </div>                                                                                                                                        " +
        "            <div class='modal-footer' style='border-top:1px solid #cccccc'>                                                                                                                    " +

        "                <button type='button' class='zl-dialog-btn-close' data-dismiss='modal'>取消</button>                                                          " +
        "                <button type='button' class='zl-dialog-btn-ok zl-user-selector-ok' >确认</button>                                                                               " +
        "            </div>                                                                                                                                        " +
        "        </div>                                                                                                                                            " +
        "    </div>                                                                                                                                                " +
        "</div>                                                                                                                                                    ";

    function render(settings,target) {
        var mergedSettings = {};
        $.extend(mergedSettings, defaultSettings, settings);

        var id = initContainer(target);
        var container = renderUserSelector(id); // 渲染
        bindEventHandlers(target, container, mergedSettings); // 绑定事件

        $(container).on('hidden.bs.modal', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        $(target).on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            renderUserSelectorResultContent(container);
            if(!container.initClick){
                container.initClick = true;
                $(container).find(".zl-tree-node-title").eq(0).click();
            }
            $(container).modal();
        });

        $(target).click();
    }

    // 渲染 zl-user-selector-result-content
    function renderUserSelectorResultContent(container) {

        var containerId = $(container).attr("id");
        var html = "";
        for (var key in storage[containerId].selectedUserMap) {
            var userId = key;
            var userName = storage[containerId].selectedUserMap[key];
            html += "<li><span>" + userName + "</span><em userId='" + userId + "' userName='" + userName + "' class='zl-user-selector-checkbox user-checked'></em></li> ";
        }

        for (var key in storage[containerId].selectedObjectMap) {
            var objectId = key;
            var objectName = storage[containerId].selectedObjectMap[key];
            html += "<li><span>" + objectName + "</span><em objectId='" + objectId + "' objectName='" + objectName + "' class='zl-user-selector-checkbox user-checked'></em></li> ";
        }
        $(container).find(".zl-user-selector-result-content>ul").html(html);
    }

    function genDialogId() {
        return "user_selector_" + new Date().getTime() + "" + parseInt(Math.random() * 10000);
    }
    
    function initContainer(target) {
        // 生成dialog唯一标识
        var id = genDialogId();
        $(target).attr("user_selector_id", id);
        $(renderHtml).attr("id", id).appendTo("html"); // 添加到文档中去
        storage[id] = {};
        storage[id].selectedUserMap = {};
        storage[id].selectedObjectMap = {};
        return id;
    }

    function renderUserSelector(id) {
        var users = null;
        var container = $("#" + id);
        var settings = {
            callback: {
                onClick: function (nodeId, nodeName) {
                    // TODO 通过nodeId获取相应数据
                    //2016-1-29 增加通过机构ID查询对应的人员信息
                    $.ajax({
                        cache: true,
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: enrolmentWeb_Path + "common/getUserListByOrg.htm?orgId=" + nodeId,
                        dataType: "jsonp",
                        async: false,
                        error: function (request) {
                            alert("系统异常");
                        },
                        success: function (result) {
                            users = jQuery.parseJSON(result);

                            // 填充zl-user-selector-result-content
                            var html = "";
                            for (var i = 0; i < users.length; i++) {
                                var userId = users[i].userId;
                                var userName = users[i].userName;
                                html += "<li><span>" + userName + "</span><em userId='" + userId + "' userName='" + userName + "' class='zl-user-selector-checkbox'></em></li>";
                            }
                            $(container).find(".zl-user-selector-result-content-for-search>ul").html(html);
                            $(container).find(".zl-user-selector-result-title em.zl-user-selector-checkbox").removeClass("checked"); // 取消全选
                            $(container).find(".zl-user-selector-result-title>div").show(); // 显示全选
                            $(container).find(".zl-user-selector-result-title>span").html(nodeName);
                            $(container).find(".zl-user-selector-result-title>span").show();

                            $(container).find(".zl-user-selector-result-content").hide();
                            $(container).find(".zl-user-selector-result-content-for-search").show();
                        }
                    });

                }
            }
        };

        $(container).find(".zl-user-selector-toolbar-content>.zl-user-selector-toolbar-content-department").ysTree("init", settings);
        $(container).find(".zl-user-selector-toolbar-content>.zl-user-selector-toolbar-content-department").ysTree("render", orgData);
        return container;
    }

    function bindEventHandlers(target, container, settings) {
        var multipleSelect = settings.multipleSelect; // 是否多选
        var containerId = $(container).attr("id"); // 容器id编号
        var timeout = null;

        // 绑定 按部门/选职级/按自定义组 事件
        $(container).on("click", ".zl-user-selector-toolbar-title li", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(".zl-user-selector-toolbar-title li").removeClass("active");// 移除active
            $(this).addClass("active");

            $(".zl-user-selector-toolbar-content>div").hide();
            if ($(this).hasClass("department")) {
                $(".zl-user-selector-toolbar-content>div.zl-user-selector-toolbar-content-department").show();

                $(container).find(".zl-user-selector-toolbar-content-department .zl-tree-node-selected>.zl-tree-node-title").click();

                $(container).find(".zl-user-selector-result-content").hide();
                $(container).find(".zl-user-selector-result-content-for-search").show();

            } else if ($(this).hasClass("position")) {
                $(".zl-user-selector-toolbar-content>div.zl-user-selector-toolbar-content-position").show();

                $(container).find(".zl-user-selector-result-title>a").click();// 触发已选人员点击事件

                // 职位列表 与 已选 列表同步
                $(container).find(".zl-user-selector-toolbar-content-position em.zl-user-selector-checkbox").removeClass("checked");
                for (var key in storage[containerId].selectedObjectMap) {
                    $(container).find(".zl-user-selector-toolbar-content-position em.zl-user-selector-checkbox[objectId=" + key + "]").addClass("checked");
                }
                $(container).find(".zl-user-selector-result-content").show();
                $(container).find(".zl-user-selector-result-content-for-search").hide();

            } else if ($(this).hasClass("custom")) {
                $(".zl-user-selector-toolbar-content>div.zl-user-selector-toolbar-content-custom").show();
            }
        });

        // 绑定 选职级 li 事件
        $(container).on("click", ".zl-user-selector-toolbar-content-position>ul>li", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $containedCheckbox = $(this).children("em.zl-user-selector-checkbox");
            var isChecked = $containedCheckbox.hasClass("checked");
            var objectId = $containedCheckbox.attr("objectId");
            var objectName = $containedCheckbox.attr("objectName");

            if (isChecked) {
                $containedCheckbox.removeClass("checked");// 取消选中
                $(container).find(".zl-user-selector-result-content>ul>li>em.zl-user-selector-checkbox[objectId=" + objectId + "]").each(function () {
                    $(this).parent().remove();
                    removeObject(containerId, objectId); // 在选列表中删除职级
                });
            } else {
                if (!multipleSelect) { // 如果单选
                    removeAllObjects(containerId);
                    $(container).find(".zl-user-selector-toolbar-content-position>ul>li em.zl-user-selector-checkbox").removeClass("checked");
                    $(container).find(".zl-user-selector-result-content>ul").empty();
                }

                $containedCheckbox.addClass("checked");// 选中

                // 如果已选人员 中已有 则标为选中状态 否则做添加处理
                if ($(container).find(".zl-user-selector-result-content>ul>li>em.zl-user-selector-checkbox[objectId=" + objectId + "]").length > 0) {
                    $(container).find(".zl-user-selector-result-content>ul>li>em.zl-user-selector-checkbox[objectId=" + objectId + "]").removeClass("user-checked-nor");
                } else {
                    var html = "<li><span>" + objectName + "</span><em objectId='" + objectId + "' objectName='" + objectName + "' class='user-checked zl-user-selector-checkbox'></em></li>";
                    $(container).find(".zl-user-selector-result-content>ul").append(html);
                }
                addObject(containerId, objectId, objectName); // 在选列表添加职级
            }


        });

        // 绑定 选择结果中 li 事件 (zl-user-selector-result-content-for-search)
        $(container).on("click", ".zl-user-selector-result-content-for-search>ul>li", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $containedCheckbox = $(this).children("em.zl-user-selector-checkbox");
            var isChecked = $containedCheckbox.hasClass("checked");
            var userId = $containedCheckbox.attr("userId");
            var userName = $containedCheckbox.attr("userName");
            var objectId = $containedCheckbox.attr("objectId");
            var objectName = $containedCheckbox.attr("objectName");

            if (isChecked) {
                $containedCheckbox.removeClass("checked");// 取消选中
                removeUser(containerId, userId);
            } else {
                if (!multipleSelect) { // 如果单选
                    removeAllUsers(containerId);
                    removeAllObjects(containerId);
                    $(container).find(".zl-user-selector-result-content-for-search>ul>li em.zl-user-selector-checkbox").removeClass("checked");
                }
                $containedCheckbox.addClass("checked");// 选中
                addUser(containerId, userId, userName);
            }
        });

        // 绑定 选择结果中 li 事件
        $(container).on("click", ".zl-user-selector-result-content>ul>li", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $containedCheckbox = $(this).children("em.zl-user-selector-checkbox");
            var isChecked = $containedCheckbox.hasClass("user-checked-nor");
            var userId = $containedCheckbox.attr("userId");
            var userName = $containedCheckbox.attr("userName");
            var objectId = $containedCheckbox.attr("objectId");
            var objectName = $containedCheckbox.attr("objectName");

            if (!isChecked) {
                $containedCheckbox.addClass("user-checked-nor");// 取消选中
                removeUser(containerId, userId);
                removeObject(containerId, objectId);
                $(container).find(".zl-user-selector-toolbar-content-position em.zl-user-selector-checkbox[objectId=" + objectId + "]").removeClass("checked");

            } else {

                $containedCheckbox.removeClass("user-checked-nor");// 选中
                addUser(containerId, userId, userName);
                addObject(containerId, objectId, objectName);
            }
        });

        // 绑定 已选人员 事件 zl-user-selector-result-title>a
        $(container).on("click", ".zl-user-selector-result-title>a", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).nextAll().hide();// 隐藏 选择的部门 全部选择
            renderUserSelectorResultContent(container);
            $(container).find(".zl-user-selector-result-title em.zl-user-selector-checkbox").removeClass("checked"); // 取消全选
            $(container).find(".zl-user-selector-result-content").show();
            $(container).find(".zl-user-selector-result-content-for-search").hide();
        });

        // 绑定 全选 事件 zl-user-selector-result-title>div
        $(container).on("click", ".zl-user-selector-result-title>div", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var containedCheckbox = $(this).find("em.zl-user-selector-checkbox");
            if ($(containedCheckbox).hasClass("checked")) {
                $(containedCheckbox).removeClass("checked");
                $(container).find(".zl-user-selector-result-content-for-search>ul>li>em.zl-user-selector-checkbox").removeClass("checked");
                $(container).find(".zl-user-selector-result-content-for-search>ul>li>em.zl-user-selector-checkbox").each(function () {
                    var userId = $(this).attr("userId");
                    var objectId = $(this).attr("objectId");
                    removeUser(containerId, userId);// 删除已选中用户
                    removeObject(containerId, objectId); // 删除已选中职级
                });

            } else {
                $(containedCheckbox).addClass("checked");
                $(container).find(".zl-user-selector-result-content-for-search>ul>li>em.zl-user-selector-checkbox").addClass("checked");
                $(container).find(".zl-user-selector-result-content-for-search>ul>li>em.zl-user-selector-checkbox").each(function () {
                    var userId = $(this).attr("userId");
                    var userName = $(this).attr("userName");
                    var objectId = $(this).attr("objectId");
                    var objectName = $(this).attr("objectName");
                    addUser(containerId, userId, userName);
                    addObject(containerId, objectId, objectName);
                });
            }
        });


        $(container).on("keydown", ".zl-search-bar-grey>input", function (e) {
            e.stopPropagation();
            clearTimeout(timeout);

            var _this = $(this);
            timeout=setTimeout(function(){
                $(_this).next("span").click();
            }, 400);
        });


        // 绑定查询确认按钮
        $(container).on("click", ".zl-search-bar-grey>span", function (e) {
            e.stopPropagation();
            e.preventDefault();

            var userName = $(this).prev().val();
            // TODO 从后台获取数据
            var users = null;
            //2016-1-29通过名称模糊查询人员信息
            $.ajax({
                cache: true,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "jsonp",
                url: enrolmentWeb_Path + "common/getUserListByName.htm?userName=" + userName,
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (result) {
                    users = jQuery.parseJSON(result);

                    // 填充zl-user-selector-result-content
                    var html = "";
                    for (var i = 0; i < users.length; i++) {
                        var userId = users[i].userId;
                        var userName = users[i].userName;
                        html += "<li><span>" + userName + "</span><em userId='" + userId + "' userName='" + userName + "' class='zl-user-selector-checkbox'></em></li>";
                    }
                    $(container).find(".zl-user-selector-result-content-for-search>ul").html(html);
                    $(container).find(".zl-user-selector-result-title em.zl-user-selector-checkbox").removeClass("checked"); // 取消全选
                }
            });
        });

        $(container).on("keyup", ".zl-search-bar-grey>input", function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.keyCode == 13) { // Enter
                $(this).blur();
                $(container).find(".zl-search-bar-grey>span").click();
            }
        });

        // 绑定确认按钮
        $(container).on("click", ".zl-user-selector-ok", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var containerId = $(container).attr("id");

            var displayId = "";
            var displayName = "";

            var count = 0;
            for (var key in storage[containerId].selectedUserMap) {
                var userName = storage[containerId].selectedUserMap[key];
                if(count > 0){
                    displayName += ";" + userName;
                    displayId += ";" + key;
                }else{
                    displayName = userName;
                    displayId = key;
                }
                count++;
            }

            for (var key in storage[containerId].selectedObjectMap) {
                if (displayId == "") {
                    displayId = key;
                }
                if (displayName == "") {
                    var userName = storage[containerId].selectedUserMap[key];
                    displayName = userName;
                }
            }
            $(container).modal("hide");
            $(target).val(displayName);
            $(target).data("selectedUserMap", storage[containerId].selectedUserMap);
            $(target).data("selectedObjectMap", storage[containerId].selectedObjectMap);

            $(target).siblings("[name$='Id'],[name$='Ids']").val(displayId);
            $(target).siblings("[name$='Name'],[name$='Names']").val(displayName);

            $(target).focus(); // 让目标元素获取焦点,解决safari上字体重叠的bug
        });

        $(container).on('hidden.bs.modal', function (e) {
            $("body").removeClass();
        })

    }

    var defaultSettings = {
        multipleSelect: true
    }; // 默认设置

    var options = {
        userSelect: function (settings) {
            var containerId = $(this).attr("user_selector_id");
            if(!containerId){
                if(this.loading){
                    return false;
                }
                this.loading = true;
                if(orgData==null || orgData==""){
                    getOrgDate(settings,$(this));
                }else{
                    render(settings,$(this))
                }
            }else{
                var container = $("#"+containerId);
                $(container).modal();
            }
        }
    };

    $.fn.extend(options);
})(jQuery);

//$("#test").userSelect({});
//$("input[type=text]").userSelect({multipleSelect:true});

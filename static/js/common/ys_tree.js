(function ($) {

    var PADDING_SIZE = 20;

    // 默认配置
    var defaultSettings = {
        callback: {
            onClick: function (nodeId, nodeName, nodePath) {
            },
            checkboxChecked: function (nodeId, nodeName, nodePath) {
            },
            checkboxUnchecked: function (nodeId, nodeName, nodePath) {
            }
        },
        startOffset: 0,
        multiple: false,
        hasCheck: false,
        expanded: false,
        readonly: false
    };

    // render related methods start
    function isExpanded(settings, node) {
        var expanded = settings.expanded || node.expanded;
        if (expanded == true) {
            return true;
        }
        return false;
    }

    function hasCheckbox(settings, node) {
        var hasCheck = settings.hasCheck || node.hasCheck;

        if (hasCheck == true) {
            return true;
        }
        return false;
    }

    // render related methods end
    function renderTree(settings, data, resultHtml, deep, nodePath) {
        if (data instanceof Array) {
            var childNodes = data;
            for (var i = 0; i < data.length; i++) {
                var tempHtml = renderTree(settings, childNodes[i], "", deep, nodePath);
                resultHtml += "<li>" + tempHtml + "</li>";
            }
        } else if (data instanceof Object) {
            var node = data;
            var nodeId = node.nodeId;
            var nodeName = node.nodeName;
            var children = node.children || [];
            var nodeValue = node.nodeValue;
            var hasChildren = false;
            if (children.length > 0) {
                hasChildren = true;
            }
            var checked = node.checked;
            var isRootNode = node.isRootNode;

            var expanded = isExpanded(settings, node);
            var hasCheck = hasCheckbox(settings, node);

            var nodeClass = "";
            var childrenClass = "zl-tree-children";
            var childrenHtml = "";
            var checkboxHtml = "";

            var paddingWidth = PADDING_SIZE * deep + settings.startOffset;
            var nodeTitleStyle = "style='padding-left:" + paddingWidth + "px;'";

            if (isRootNode) {
                nodeClass = " zl-tree-node-root";
                nodePath = nodeName;
            } else {
                nodePath += "-" + nodeName;
            }

            if (hasChildren) {
                nodeClass += " zl-tree-node-parent";

                if (expanded) {
                    nodeClass += " zl-tree-node-open";
                } else {
                    nodeClass += " zl-tree-node-close";
                    childrenClass += " zl-tree-node-shrink";
                }

                childrenHtml = "<ul class='" + childrenClass + "'>" +
                    renderTree(settings, children, resultHtml, deep + 1, nodePath) +
                    "</ul>";
            } else {
                nodeClass = "zl-tree-node-leaf"
            }

            if (hasCheck) {
                checkboxHtml = "<em class='zl-tree-node-checkbox'></em>";
                if (checked) {
                    checkboxHtml = "<em class='zl-tree-node-checkbox checked'></em>";
                }
                if (!hasChildren) {
                    nodeClass += " zl-tree-node-leaf-checkbox";
                }
            }

            var treeToggleBtn = "<em class='zl-tree-toggle-btn'></em>";


            resultHtml += "<div class='zl-tree-node " + nodeClass + "'>" +
                "   <div class='zl-tree-node-title ' nodeValue='" + nodeValue + "' deep='" + deep + "' nodeId='" + nodeId + "' nodePath='" + nodePath + "' " + nodeTitleStyle + ">" +
                treeToggleBtn +
                checkboxHtml +
                "<span>" + nodeName + "</span>" +
                "   </div>" +
                childrenHtml +
                "</div>";
        }


        return resultHtml;
    }

    /* 向上查找并 选中/取消选中 节点 */
    function toggleAncestorCheckbox(selector) {
        $(selector).parent().parent().parents(".zl-tree-node").each(function () {
            var parentNodeCount = 0;
            var parentNodeCheckedCount = 0;

            $(this).find(".zl-tree-node-parent").each(function () {
                if ($(this).children("ul").children().length == 0) {
                    parentNodeCount++;

                    if ($(this).children(".zl-tree-node-title").find("em.zl-tree-node-checkbox").hasClass("checked")) {
                        parentNodeCheckedCount++;
                    }
                }
            });

            var allCount = $(this).find(".zl-tree-node-leaf>.zl-tree-node-title>em.zl-tree-node-checkbox").length + parentNodeCount;
            var checkedCount = $(this).find(".zl-tree-node-leaf>.zl-tree-node-title>em.zl-tree-node-checkbox.checked").length + parentNodeCheckedCount;

            if (checkedCount == allCount) {
                $(this).children("div.zl-tree-node-title").find("em.zl-tree-node-checkbox").removeClass("half-checked");
                $(this).children("div.zl-tree-node-title").find("em.zl-tree-node-checkbox").addClass("checked");
            } else if (checkedCount == 0) {
                $(this).children("div.zl-tree-node-title").find("em.zl-tree-node-checkbox").removeClass("checked");
                $(this).children("div.zl-tree-node-title").find("em.zl-tree-node-checkbox").removeClass("half-checked");
            } else if (checkedCount < allCount) {
                $(this).children("div.zl-tree-node-title").find("em.zl-tree-node-checkbox").removeClass("checked");
                $(this).children("div.zl-tree-node-title").find("em.zl-tree-node-checkbox").addClass("half-checked");
            }

        });
    }

    function resetCheckBox() {
        $(this).find(".zl-tree-node-checkbox.checked").each(function (i, item) {
            toggleAncestorCheckbox(item);
        });
    }


    function bindHandlers(settings) {
        // onclick
        var onclickHandler = settings.callback.onClick;

        var checkboxChecked = settings.callback.checkboxChecked;
        var checkboxUnchecked = settings.callback.checkboxUnchecked;
        var multiple = settings.multiple;
        var hasCheck = settings.hasCheck;

        var container = this;
        $(this).on("click", "em.zl-tree-toggle-btn", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var treeNode = $(this).parent().parent();
            if ($(treeNode).hasClass("zl-tree-node-open")) {
                $(treeNode).removeClass("zl-tree-node-open");
                $(treeNode).addClass("zl-tree-node-close");
                $(treeNode).children(".zl-tree-children").slideUp("fast");
            } else if ($(treeNode).hasClass("zl-tree-node-close")) {
                $(treeNode).removeClass("zl-tree-node-close");
                $(treeNode).addClass("zl-tree-node-open");
                $(treeNode).children(".zl-tree-children").slideDown("fast");
            }
        });

        // default click handler
        $(this).on("click", ".zl-tree-node-title", function () {
            var treeNode = $(this).parent();

            var nodeId = $(this).attr("nodeId");
            var nodeName = $(this).find("span").html();
            var deep = parseInt($(this).attr("deep"));
            var nodePath = $(this).attr("nodePath");
            var _this = $(this);
            onclickHandler(nodeId, nodeName, nodePath, deep, _this); // click callback

            if (!hasCheck) {
                // 是否多选
                if (multiple) { // 多选
                    $(treeNode).toggleClass("zl-tree-node-selected");
                } else { // 单选
                    $(container).find(".zl-tree-node").removeClass("zl-tree-node-selected");
                    $(treeNode).addClass("zl-tree-node-selected");
                }
            }


            toggleCheckbox($(this).find("em.zl-tree-node-checkbox"), multiple);


        });


        // default checkbox handler
        function toggleCheckbox(target, mutiple) {

            // 如果是单选
            if (!mutiple) {

                $(target).closest(".zl-tree-node-root").find(".zl-tree-node-checkbox").removeClass("checked");
                $(target).addClass("checked");
                // 如果是单选 则不触发 checkboxUnchecked
                checkboxChecked.call($(target).parent().parent(), nodeId, nodeName, nodePath);
                return;
            }

            $(target).removeClass("half-checked");

            var hasChecked = false;
            if ($(target).hasClass("checked")) {
                hasChecked = true;
            }

            var nodeId = $(target).parent().attr("nodeId");
            var nodePath = $(target).parent().attr("nodePath");
            var nodeName = $(target).next().html();

            if (hasChecked) {
                $(target).removeClass("checked"); // 自身选中或取消
                $(target).parent().next().find("em.zl-tree-node-checkbox").removeClass("half-checked");
                $(target).parent().next().find("em.zl-tree-node-checkbox").removeClass("checked"); // 子孙元素选中或取消
                // 父祖先元素选中、部分选中、取消
                toggleAncestorCheckbox(target);
                checkboxUnchecked.call($(target).parent().parent(), nodeId, nodeName, nodePath);
            } else {
                $(target).addClass("checked"); // 自身选中或取消
                $(target).parent().next().find("em.zl-tree-node-checkbox").removeClass("half-checked");
                $(target).parent().next().find("em.zl-tree-node-checkbox").addClass("checked"); // 子孙元素选中或取消
                // 父祖先元素选中、部分选中、取消
                toggleAncestorCheckbox(target);
                checkboxChecked.call($(target).parent().parent(), nodeId, nodeName, nodePath);
            }
        }
    }

    var tree = {
        ysTree: function (options) {
            var mergedSettings = {};
            $.extend(true, mergedSettings, defaultSettings, options);
            var data = options.data;
            if (data == undefined) {
                return;
            }
            console.log(this);
            console.log($(this));

            $(this).each(function () {
                $(this).off();
                console.log("=======================")
                console.log(this)
                var resultHtml = "";
                data.isRootNode = true; // 第一个为根节点
                resultHtml = renderTree(mergedSettings, data, resultHtml, 0, "");
                $(this).addClass("zl-tree");
                $(this).html(resultHtml);

                resetCheckBox.call(this, mergedSettings);


                if (mergedSettings.readonly) {
                    $(this).addClass("zl-tree-readonly");
                    return;
                }
                // 绑定事件
                bindHandlers.call(this, mergedSettings);
            });
        }
    };
    $.fn.extend(tree);

})(jQuery);

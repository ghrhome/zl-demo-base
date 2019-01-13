$app.bootstrap({
    sessionUrl: "finance_web/sdk/init.htm",
    loading: true,
    ready: function ($app) {
    }
}, [function ($app) {
    $app.controller("MainController", ["$scope", "FinApplyService", function ($scope, finApplyService) {
        var filter = $scope.filter = angular.extend({
            startOptions: {showWeeks: false}, endOptions: {showWeeks: false}
        }, $app.session.getAttr("fee_apply_index_filter"));

        $scope.reload = function () {
            $app.loading(true);
            finApplyService.findPager(filter).then(function ($response) {
                $scope.pager = $response.data.data;
                filter.page = $scope.pager.page;
            }).finally(function () {
                $app.loading(false);
            })
        }

        // 监听条件
        $scope.$watch("filter.projectId+filter.startDate+filter.endDate+filter.approvalStatusId+filter.startDate+filter.endDate+filter.page+filter._", $scope.reload)


        // 清空查询条件
        $scope.clear = function () {
            filter = $scope.filter = {_:new Date()};
            $scope.gotoPager(1);
        }

        // 详情
        $scope.detail = function (item) {
            $app.helper.redirect("../apply2/detail.htm?id=" + item.id);
        }

        // 分页
        $scope.gotoPager = function (page) {
            filter.page = page;
            // 缓存分页数据
            $app.session.setAttr("fee_apply_index_filter", filter)
        }

    }])
}])
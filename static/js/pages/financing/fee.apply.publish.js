$app.bootstrap({
    sessionUrl: "finance_web/sdk/init.htm",
    loading: true,
    ready: function ($app) {
        // $app.$("#preloader").fadeOut();
    }
}, [function ($app) {
    $app.controller("MainController", ["$scope", "$timeout", "FinApplyService", "$q", function ($scope, $timeout, finApplyService, $q) {
        var input = $scope.input = {
            id: $app.url.getParams("id"), approvalStatusId: 1001, details: [], receivableAmount: 0
        };
        if (input.id) {
            finApplyService.detail(input.id).then(function ($response) {
                input = $scope.input = $response.data.data;
                $app.loading(false);
            })
        } else {
            $app.loading(false);
        }
        $scope.chooseProject = function () {

            if(input.approvalStatusId!=1001){
                return;
            }

            $app.contract.dialog.choose({width: 790}).then(function ($result) {
                if ($result.execute) {
                    angular.forEach($result.values, function (result) {
                        input.mallId = result.mallId;
                        input.contId = result.id;
                        input.contNo = result.no;
                        input.brandId = result.brandId;
                        input.brandName = result.brandName;
                        input.layoutId = result.layoutId;
                        input.layoutName = result.layoutName;
                        input.storeNames = result.storeNos;
                        input.tenantId = result.tenantId;
                        input.tenantName = result.tenantName;
                    });
                }
            })
        }
        $scope.addDetail = function () {
            input.details.push({})
        }
        $scope.removeDetail = function (detail) {
            input.details.remove(detail);
        }
        $scope.$watch("input.details", function (nv, ov) {
            var amount = 0;
            angular.forEach(input.details, function (item) {
                amount = $app.number.add(amount, item.receivableAmount, 2)
                // console.log(item)
            })
            input.receivableAmount = amount;
        }, true);

        function save() {
            var deferred = $q.defer();
            input.errorCode = undefined;
            $timeout(function () {
                try {
                    $app.assert.isEmpty(input.contId, "未选择合同！", 9001);
                    $app.assert.isEmpty(input.details, "请添加费用明细！", 9002)
                    angular.forEach(input.details, function (item) {
                        try {
                            item.error = false;
                            $app.assert.isEmpty(item.chargeId, "未选择收款项目！", 9003);
                            $app.assert.isEmpty(item.receivableDate, "未选择应收日期！", 9004);
                            $app.assert.isEmpty(item.receivableAmount, "未填写应收金额！", 9005);
                        } catch (ex) {
                            item.error = true;
                            var error = new Error(ex.message);
                            error.code = ex.code;
                            throw error;
                        }
                    })
                    $app.loading(true)
                    finApplyService.publish(input).then(function ($response) {
                        if (!$response.data.success) {
                            $app.tip.error({message: $response.data.message});
                        } else {
                            if (!input.id) {
                                input.id = $response.data.data;
                            }
                            deferred.resolve()
                        }
                    }).finally(function () {
                        $app.loading(false)
                    })
                } catch (ex) {
                    input.errorCode = ex.code;
                    $app.tip.error({message: ex.message});
                }
            })
            return deferred.promise;
        }

        // 保存
        $scope.save = function () {
            save().then(function () {
                $app.tip.success({message: "保存成功！"});
            })
        }
        // 驳回
        $scope.reject = function () {
            finApplyService.reject(input.id).then(function ($response) {
                if ($response.data.success) {
                    $app.tip.success({message: "保存成功！"});
                    input.approvalStatusId = 1004;
                } else {
                    $app.tip.error({message: $response.data.message});
                }
            })
        }
        // 同意
        $scope.agree = function () {
            finApplyService.agree(input.id).then(function ($response) {
                if ($response.data.success) {
                    $app.tip.success({message: "保存成功！"});
                    input.approvalStatusId = 1007;
                } else {
                    $app.tip.error({message: $response.data.message});
                }
            })
        }
        // 提交
        $scope.submit = function () {
            save().then(function () {
                finApplyService.submit(input.id).then(function ($response) {
                    if ($response.data.success) {
                        input.approvalStatusId = 1003;
                        $app.tip.success({message: "提交成功！"});
                    } else {
                        $app.tip.error({message: $response.data.message});
                    }
                })
            })
        }

        $scope.setRequired = function(){
            if(input.approvalStatusId == 1001) {return "required";}
            return "";
        }
    }])
}])
/**
 * Created by user on 2016/10/18.
 */
var menu_list={

    busi_sys_menu:[
        {
            name:"营运",
            index:"main-0",
            icon:"busi-icon-opt",
            links:"../views/sample/pageSample.html",
            target:"#page-frame",
            show_sub_menu:true,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"经营总况",
                    index:"sub-0",
                    links:"../views/sample/pageSample.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"经营总况",
                            index:"tri-0",
                            //links:"../mainPage.html",
                            links:"../views/sample/pageSample.html",
                            target:"#page-frame"
                        },

                        {
                            name:"绩效",
                            index:"tri-1",
                            links:"../views/sample/datePickerSample.html",
                            target:"#page-frame"
                        },
                        {
                            name:"营收",
                            index:"tri-2",
                            links:"../pages/service/business_income.html",
                            target:"#page-frame"
                        },
                        {
                            name:"客流",
                            index:"tri-3",
                            links:"../demo_data_passenger_flow_statistics.html",
                            target:"#page-frame"
                        },
                        {
                            name:"平效",
                            index:"tri-4",
                            links:"../pages/service/business_flat.html",
                            target:"#page-frame"
                        },
                        {
                            name:"租金预测(在营)",
                            index:"tri-5",
                            links:"../pages/service/rent_expect_open.html",
                            target:"#page-frame"
                        },
                        {
                            name:"租金预测(筹备)",
                            index:"tri-6",
                            links:"../pages/service/rent_expect_unopen.html",
                            target:"#page-frame"
                        }

                    ]
                },
                {
                    name:"空间管理",
                    index:"sub-0",
                    links:"../floor.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"空间管理",
                            index:"tri-0",
                            links:"../floor.html",
                            target:"#page-frame"
                        }
                    ]
                },
                {
                    name:"商户管理",
                    index:"sub-0",
                    links:"../pages/service/business_management_operation.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"台帐",
                            index:"tri-0",
                            links:"../pages/service/business_management_operation.html",
                            target:"#page-frame"
                        },
                        {
                            name:"商户经营",
                            index:"tri-1",
                            links:"../pages/service/business_amount_enrolment.html",
                            target:"#page-frame"
                        },
                        {
                            name:"欠费",
                            index:"tri-3",
                            links:"../pages/service/business_arrears.html",
                            target:"#page-frame"
                        },
                        {
                            name:"销售额",
                            index:"tri-4",
                            links:"../pages/service/business_sale.html",
                            target:"#page-frame"
                        }

                    ]
                },

                {
                    name:"现场管理",
                    index:"sub-0",
                    links:"../pages/service/inspection_all_projects.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"巡场",
                            index:"tri-1",
                            links:"../pages/service/inspection_all_projects.html",
                            target:"#page-frame"
                        },

                        {
                            name:"缴费单",
                            index:"tri-3",
                            links:"../pages/service/business_payment_bill.html",
                            target:"#page-frame"
                        }
                    ]
                },
                {
                    name:"报表中心",
                    index:"sub-3",
                    links:"../pages/management/report_center_fee.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        //{
                        //    name:"自定义报表",
                        //    index:"tri-1",
                        //    links:"../pages/management/report_center_fee.html",
                        //    target:"#page-frame"
                        //},

                        {
                            name:"两费",
                            index:"tri-3",
                            links:"../pages/management/report_center_fee.html",
                            target:"#page-frame"
                        },
                        {
                            name:"多经",
                            index:"tri-4",
                            links:"../pages/management/report_center_diversification.html",
                            target:"#page-frame"
                        },
                        {
                            name:"自定义报表",
                            index:"tri-5",
                            links:"../pages/service/customizing_report.html",
                            target:"#page-frame"
                        }

                    ]
                }
            ]
        },
        {
            name:"招商",
            index:"main-1",
            icon:"busi-icon-merchant",
            links:"../pages/investment/merchant_plan_main.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"招商计划",
                    index:"sub-1",
                    links:"../pages/investment/merchant_plan_main.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"招商计划",
                            index:"tri-1",
                            links:"../pages/investment/merchant_plan_main.html",
                            target:"#page-frame"
                        }

                    ]
                },
                {
                    name:"商务审批",
                    index:"sub-1",
                    links:"../net_comment_busi_condition.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"商务审批",
                            index:"tri-1",
                            links:"../net_comment_busi_condition.html",
                            target:"#page-frame"
                        }
                    ]
                },
                {
                    name:"商家库",
                    index:"sub-1",
                    links:"../merchant_main.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"商家库",
                            index:"tri-1",
                            links:"../merchant_main.html",
                            target:"#page-frame"
                        }
                    ]
                },
                {
                    name:"合同库",
                    index:"sub-1",
                    links:"../pages/investment/contract_enrolment.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"合同库",
                            index:"tri-1",
                            links:"../pages/investment/contract_enrolment.html",
                            target:"#page-frame"
                        },
                        {
                            name:"标准合同模板",
                            index:"tri-2",
                            links:"../standard_contract_template.html",
                            target:"#page-frame"
                        }
                    ]
                }
            ]
        },
        {
            name:"财务",
            index:"main-2",
            icon:"busi-icon-finacial",
            links:"../pages/budget/budget_overview.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                //{
                //    name:"资产负债表",
                //    index:"sub-2",
                //    links:"../acg.html",
                //    target:"#page-frame",
                //    show_sub_menu:true,
                //    re_locate:true,//点击一级目录直接跳转
                //    sub_menu:[
                //        {
                //            name:"资产负债表",
                //            index:"tri-2",
                //            links:"../acg.html",
                //            target:"#page-frame"
                //        }
                //
                //    ]
                //},
                {
                    name:"预算",
                    index:"sub-2",
                    links:"../pages/budget/budget_overview.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"预算概况",
                            index:"tri-1",
                            links:"../pages/budget/budget_overview.html",
                            target:"#page-frame"
                        },
                        {
                            name:"预算申报进度",
                            index:"tri-2",
                            links:"../pages/budget/budget_declaration_progress.html",
                            target:"#page-frame"
                        },
                        {
                            name:"审核中心",
                            index:"tri-3",
                            links:"../pages/budget/budget_approval_projects.html",
                            target:"#page-frame"
                        },
                        {
                            name:"保底预算",
                            index:"tri-4",
                            links:"../pages/budget/budget_minimun.html",
                            target:"#page-frame"
                        },
                        {
                            name:"商业目标预算",
                            index:"tri-5",
                            links:"../pages/budget/budget_business_target.html",
                            target:"#page-frame"
                        },
                        {
                            name:"项目预算编制中心",
                            index:"tri-6",
                            links:"../pages/budget/budget_project_index.html",
                            target:"#page-frame"
                        }

                    ]
                }
                //{
                //    name:"成本费用表",
                //    index:"sub-2",
                //    links:"../pages/finance/cost_fee.html",
                //    target:"#page-frame",
                //    show_sub_menu:true,
                //    re_locate:true,//点击一级目录直接跳转
                //    sub_menu:[
                //        {
                //            name:"成本费用表",
                //            index:"tri-2",
                //            links:"../pages/finance/cost_fee.html",
                //            target:"#page-frame"
                //        }
                //    ]
                //},
                //{
                //    name:"风险控制",
                //    index:"sub-2",
                //    links:"../pages/finance/mgt_analysis_case.html",
                //    target:"#page-frame",
                //    show_sub_menu:true,
                //    re_locate:true,//点击一级目录直接跳转
                //    sub_menu:[
                //        //{
                //        //    name:"管理分析方案",
                //        //    index:"tri-2",
                //        //    links:"../pages/finance/risk_control_receive.html",
                //        //    target:"#page-frame"
                //        //}
                //        {
                //            name:"管理分析方案",
                //            index:"tri-2",
                //            links:"../pages/finance/mgt_analysis_case.html",
                //            target:"#page-frame"
                //        }
                //
                //    ]
                //}
            ]
        },
        {
            name:"管理",
            index:"main-3",
            icon:"busi-icon-manage",
            links:"../pages/management/admin_recruit.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"行政人事",
                    index:"sub-1",
                    links:"../pages/management/admin_recruit.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"招聘",
                            index:"tri-1",
                            links:"../pages/management/admin_recruit.html",
                            target:"#page-frame"
                        },
                        {
                            name:"培训",
                            index:"tri-2",
                            links:"../pages/management/training_statistics.html",
                            target:"#page-frame"
                        },
                        {
                            name:"人事",
                            index:"tri-3",
                            links:"../pages/management/arrange_work.html",
                            target:"#page-frame"
                        }
                    ]
                },
                {
                    name:"业务网批",
                    index:"sub-3",
                    links:"../pages/management/business_net_approval.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"业务网批",
                            index:"tri-3",
                            links:"../pages/management/business_net_approval.html",
                            target:"#page-frame"
                        }
                    ]
                }
            ]
        },
        {
            name:"工程",
            index:"main-4",
            icon:"busi-icon-project",
            links:"../pages/project/project_contract_ledger.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"工程",
                    index:"sub-1",
                    links:"../pages/project/project_contract_ledger.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"合同台帐",
                            index:"tri-1",
                            links:"../pages/project/project_contract_ledger.html",
                            target:"#page-frame"
                        },

                        {
                            name:"维保计划",
                            index:"tri-2",
                            links:"../pages/project/project_repair_plan_platform.html",
                            target:"#page-frame"
                        },

                        {
                            name:"维保预算",
                            index:"tri-3",
                            links:"../pages/project/project_repair_budget_platform.html",
                            target:"#page-frame"
                        },

                        {
                            name:"设备",
                            index:"tri-4",
                            links:"../pages/project/project_device_platform.html",
                            target:"#page-frame"
                        },
                        {
                            name:"工程改造报表",
                            index:"tri-5",
                            links:"../pages/project/project_rebuild_platform.html",
                            target:"#page-frame"
                        },
                        {
                            name:"工程工具采购",
                            index:"tri-6",
                            links:"../pages/project/project_tool_procurement.html",
                            target:"#page-frame"
                        },
                        {
                            name:"水电表录入",
                            index:"tri-7",
                            links:"../pages/project/water_electricity_enrolment.html",
                            target:"#page-frame"
                        },
                        {
                            name:"能耗录入",
                            index:"tri-8",
                            links:"../pages/project/energy_consumption_enrolment.html",
                            target:"#page-frame"
                        },
                        {
                            name:"商户装修平台",
                            index:"tri-9",
                            links:"../pages/project/store_decoration_platform.html",
                            target:"#page-frame"
                        },
                        {
                            name:"消防安全管理",
                            index:"tri-10",
                            links:"../pages/project/fire_control_safety_mgt.html",
                            target:"#page-frame"
                        }
                    ]
                }
            ]
        },
        {
            name:"物业",
            index:"main-5",
            icon:"busi-icon-property",
            links:"../pages/property/repair_application.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"综合服务",
                    index:"sub-1",
                    links:"../pages/property/repair_application.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"商户报修申请",
                            index:"tri-1",
                            links:"../pages/property/repair_application.html",
                            target:"#page-frame"
                        },
                        {
                            name:"投诉建议",
                            index:"tri-2",
                            links:"../pages/property/complaint_list.html",
                            target:"#page-frame"
                        },
                        {
                            name:"物品借用",
                            index:"tri-3",
                            links:"../pages/property/article_borrowing.html",
                            target:"#page-frame"
                        },
                        {
                            name:"外包考核",
                            index:"tri-4",
                            links:"../pages/project/outsourcing_assessment.html",
                            target:"#page-frame"
                        }
                    ]
                },
                {
                    name:"物料管理",
                    index:"sub-2",
                    links:"../pages/property/warehouse_data.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"仓库资料",
                            index:"tri-1",
                            links:"../pages/property/warehouse_data.html",
                            target:"#page-frame"
                        },
                        {
                            name:"物料资料",
                            index:"tri-2",
                            links:"../pages/property/material_data.html",
                            target:"#page-frame"
                        },

                        {
                            name:"入库单",
                            index:"tri-3",
                            links:"../pages/property/warehouse_warrant.html",
                            target:"#page-frame"
                        },
                        {
                            name:"出库单",
                            index:"tri-4",
                            links:"../pages/property/delivery_order.html",
                            target:"#page-frame"
                        }
                    ]
                }
            ]
        },
        {
            name:"成本",
            index:"main-6",
            icon:"busi-icon-cost",
            links:"../pages/costing_system/use_recruitment_plan.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"网上招标",
                    index:"sub-4",
                    links:"../pages/costing_system/use_recruitment_plan.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"采招计划",
                            index:"tri-1",
                            links:"../pages/costing_system/use_recruitment_plan.html",
                            target:"#page-frame"
                        },
                        {
                            name:"招标平台",
                            index:"tri-2",
                            links:"../pages/costing_system/bid_platform.html",
                            target:"#page-frame"
                        },
                        {
                            name:"过程控制-目标成本",
                            index:"tri-3",
                            links:"../pages/costing_system/process_target_cost.html",
                            target:"#page-frame"
                        },
                        {
                            name:"过程控制-合同台帐",
                            index:"tri-4",
                            links:"../pages/costing_system/process_contract_accounts.html",
                            target:"#page-frame"
                        },
                        {
                            name:"过程控制-甲供料台账",
                            index:"tri-5",
                            links:"../pages/costing_system/supplier_accounts.html",
                            target:"#page-frame"
                        }

                    ]
                },
                {
                    name:"供方库",
                    index:"sub-4",
                    links:"../pages/costing_system/supplier_warehouse.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"供方库",
                            index:"tri-1",
                            links:"../pages/costing_system/supplier_warehouse.html",
                            target:"#page-frame"
                        },
                        {
                            name:"行政供应商平台",
                            index:"tri-2",
                            links:"../pages/costing_system/admin_supplier_platform.html",
                            target:"#page-frame"
                        },
                        {
                            name:"战略价格平台",
                            index:"tri-3",
                            links:"../pages/costing_system/strategy_price_platform.html",
                            target:"#page-frame"
                        }
                    ]
                },
                {
                    name:"预决算",
                    index:"sub-4",
                    links:"../pages/costing_system/costing_database_aggregate.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"成本数据库汇总表",
                            index:"tri-1",
                            links:"../pages/costing_system/costing_database_aggregate.html",
                            target:"#page-frame"
                        },
                        {
                            name:"定标数据库",
                            index:"tri-2",
                            links:"../pages/costing_system/costing_proposal_determine.html",
                            target:"#page-frame"
                        },
                        {
                            name:"含量指标数据库",
                            index:"tri-3",
                            links:"../pages/costing_system/costing_content_level.html",
                            target:"#page-frame"
                        },
                        {
                            name:"工料分析数据库",
                            index:"tri-4",
                            links:"../pages/costing_system/databases_content_glfx.html",
                            target:"#page-frame"
                        },
                        {
                            name:"年度预算",
                            index:"tri-5",
                            links:"../pages/costing_system/databases_budget.html",
                            target:"#page-frame"
                        }
                    ]
                }
            ]
        },
        {
            name:"营销",
            index:"main-7",
            icon:"busi-icon-marketing",
            links:"../pages/sale/crm_report.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"CRM",
                    index:"sub-5",
                    links:"../pages/sale/crm_report.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"统计报表",
                            index:"tri-0",
                            links:"../pages/sale/crm_report.html",
                            target:"#page-frame"
                        },
                        {
                            name:"会员管理",
                            index:"tri-1",
                            links:"../pages/sale/crm_member_mgt.html",
                            target:"#page-frame"
                        },
                        {
                            name:"会员标签",
                            index:"tri-2",
                            links:"../pages/sale/crm_member.html",
                            target:"#page-frame"
                        },
                        {
                            name:"兑换礼品",
                            index:"tri-3",
                            links:"../pages/sale/crm_gift_exchange.html",
                            target:"#page-frame"
                        },
                        {
                            name:"上架礼品管理",
                            index:"tri-4",
                            links:"../pages/sale/crm_online_gift_mgt.html",
                            target:"#page-frame"
                        },
                        {
                            name:"礼品维护",
                            index:"tri-5",
                            links:"../pages/sale/crm_gift_mgt.html",
                            target:"#page-frame"
                        },
                        {
                            name:"礼品领取",
                            index:"tri-6",
                            links:"../pages/sale/crm_gift_take.html",
                            target:"#page-frame"
                        },
                        {
                            name:"礼品类别管理",
                            index:"tri-7",
                            links:"../pages/sale/crm_gift_category_mgt.html",
                            target:"#page-frame"
                        },
                        {
                            name:"会员报表",
                            index:"tri-8",
                            links:"../pages/sale/crm_member_report.html",
                            target:"#page-frame"
                        },
                        {
                            name:"商场报表",
                            index:"tri-9",
                            links:"../pages/sale/crm_mall_report.html",
                            target:"#page-frame"
                        },
                        {
                            name:"黑卡预警",
                            index:"tri-10",
                            links:"../pages/sale/crm_black_warning.html",
                            target:"#page-frame"
                        },
                        {
                            name:"活卡报表",
                            index:"tri-11",
                            links:"../pages/sale/live_card_report.html",
                            target:"#page-frame"
                        }

                    ]
                },
                {
                    name:"企划",
                    index:"sub-5",
                    links:"../pages/sale/sale_planning_approval.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"企划库-审批",
                            index:"tri-5",
                            links:"../pages/sale/sale_planning_approval.html",
                            target:"#page-frame"
                        },
                        {
                            name:"预算",
                            index:"tri-5",
                            links:"../pages/finance/cost_fee.html",
                            target:"#page-frame"
                        }
                    ]
                }

            ]
        },
        {
            name:"数据中心",
            index:"main-8",
            icon:"busi-icon-dcenter",
            links:"../pages/data_center/enrolment_project.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"项目数据",
                    index:"sub-6",
                    links:"../pages/data_center/enrolment_project.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"项目信息",
                            index:"tri-2",
                            links:"../pages/data_center/enrolment_project.html",
                            target:"#page-frame"
                        },
                        {
                            name:"楼层信息",
                            index:"tri-3",
                            links:"../pages/data_center/enrolment_floor.html",
                            target:"#page-frame"
                        },
                        {
                            name:"商铺信息",
                            index:"tri-4",
                            links:"../pages/data_center/enrolment_store.html",
                            target:"#page-frame"
                        },
                        {
                            name:"多经信息",
                            index:"tri-5",
                            links:"../pages/data_center/enrolment_diversified_business.html",
                            target:"#page-frame"
                        },
                        {
                            name:"停车场信息",
                            index:"tri-6",
                            links:"../pages/data_center/enrolment_park.html",
                            target:"#page-frame"
                        },
                        {
                            name:"产权信息",
                            index:"tri-7",
                            links:"../pages/data_center/enrolment_interest.html",
                            target:"#page-frame"
                        }

                    ]
                },
                {
                    name:"指标",
                    index:"sub-2",
                    links:"../pages/service/business_index.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"预算",
                            index:"tri-1",
                            links:"../pages/service/business_index.html",
                            target:"#page-frame"
                        }

                    ]
                }

            ]
        },
        {
            name:"开发系统",
            index:"main-9",
            icon:"busi-icon-dev",
            links:"http://crm.powerlong.com/plan/plan!getPlan.action",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"开发计划",
                    index:"sub-7",
                    links:"http://crm.powerlong.com/plan/plan!getPlan.action",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"开发计划",
                            index:"tri-7",
                            links:"http://crm.powerlong.com/plan/plan!getPlan.action",
                            target:"#page-frame"
                        }

                    ]
                },
                {
                    name:"成本系统",
                    index:"sub-7",
                    links:"../pages/costing_system/financing_plan_list.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"动态资金表",
                            index:"tri-5",
                            links:"../pages/costing_system/financing_plan_list.html",
                            target:"#page-frame"
                        },
                        {
                            name:"招采",
                            index:"tri-2",
                            links:"../pages/dev_system/cost_work_mgt.html",
                            target:"#page-frame"
                        },
                        {
                            name:"工程",
                            index:"tri-3",
                            links:"../pages/project/project_rebuild_platform.html",
                            target:"#page-frame"
                        },
                        {
                            name:"结算",
                            index:"tri-4",
                            links:"../pages/costing_system/process_contract_accounts.html",
                            target:"#page-frame"
                        },
                        {
                            name:"装修",
                            index:"tri-1",
                            links:"../pages/costing_system/databases_content_glfx.html",
                            target:"#page-frame"
                        }
                    ]
                }
            ]
        },
        {"name":"BI驾驶舱",
            index:"main-10",
            icon:"busi-icon-bi",
            links:"../pages/bi/culture/main.html",
            target:"#page-frame",
            show_sub_menu:false,
            re_locate:true,//点击一级目录直接跳转
            sub_menu:[
                {
                    name:"BI驾驶舱",
                    index:"sub-1",
                    links:"../pages/bi/culture/main.html",
                    target:"#page-frame",
                    show_sub_menu:true,
                    re_locate:true,//点击一级目录直接跳转
                    sub_menu:[
                        {
                            name:"文旅",
                            index:"tri-1",
                            links:"../pages/bi/culture/main.html",
                            target:"#page-frame"
                        },
                        {
                            name:"地产营销",
                            index:"tri-2",
                            links:"../pages/bi/asset/main.html",
                            target:"#page-frame"
                        }

                    ]
                },

            ]
        },
    ]
};
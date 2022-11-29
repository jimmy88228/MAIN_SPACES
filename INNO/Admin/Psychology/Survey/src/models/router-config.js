const routeMenusKey = {
    inventoryManagement: "inventoryManagement",
    appraisalActivity: "appraisalActivity",
    studentFile: "studentFile",
    assessmentTasks: "assessmentTasks",
    streetMaintenance: "streetMaintenance",
    classMaintenance: "classMaintenance",
    schoolMaintenance: "schoolMaintenance",
    forewarningManagement: "forewarningManagement",
    forewarningSurvey: "forewarningSurvey",
    pageManagement: "pageManagement",
    dataDriveCompartment: "dataDriveCompartment",
    manualMental: "manualMental",
    pageMaintenance: "pageMaintenance",
    personalCenter: "personalCenter",
    peopleManagement: "peopleManagement",
    contentRepository: "contentRepository", 
    reservationConsultation: "reservationConsultation", 
    psychologicalSupervisor: "psychologicalSupervisor",
    psychologicalConsultant: "psychologicalConsultant",
    transferCourtyard: "transferCourtyard",
    studyTask: "studyTask",
    teacherManagement: "teacherManagement",
    basicSetting: "basicSetting",
    operationLog: "operationLog"
}
/**
 * meta code ==>该页面的acitonCode（只为菜单跳转, 并非必须）
 * meta menu ==>隶属于的菜单（多个页面可属于一个菜单）
 */
const homeRoutes = [{
    name: "home",
    path: "/home",
    component: () => import(/*webpackChunkName: "page-home"*/"@/models/home/home"),
    meta: {
        isHome: 1,
        menu: routeMenusKey['pageHome'],
        title: "首页"
    }
}]

// 量表管理
const gaugeRoutes = [{
    name: "gauge",
    path: "/gauge",
    component: () => import(/*webpackChunkName: "gauge-index"*/"@/models/survey/gauge/index"),
    meta: {
        menu: routeMenusKey['inventoryManagement'],
        title: "量表管理"
    }
}]
// 测评活动
const surveyActivityRoutes = [

    {
        name: "surveyActivity",
        path: "/surveyActivity",
        component: () => import(/*webpackChunkName: "survey-activity"*/"@/models/survey/activity/index"),
        meta: {
            menu: routeMenusKey['appraisalActivity'],
            title: "测评活动"
        }
    },
    {
        name: "editSurveyActivity",
        path: "/editSurveyActivity",
        component: () => import(/*webpackChunkName: "edit-survey-activity"*/"@/models/survey/activity/edit-activity/index"),
        meta: {
            menu: routeMenusKey['appraisalActivity'],
            title: "编辑活动"
        }
    },
    {
        name: "addSurveyActivity",
        path: "/addSurveyActivity",
        component: () => import(/*webpackChunkName: "edit-survey-activity"*/"@/models/survey/activity/edit-activity/index"),
        meta: {
            menu: routeMenusKey['appraisalActivity'],
            title: "创建活动"
        }
    },
    {
        name: "relateSchool",
        path: "/relateSchool",
        component: () => import(/*webpackChunkName: "relate-school"*/"@/models/survey/activity/relate-school/index"),
        meta: {
            menu: routeMenusKey['appraisalActivity'],
            title: "关联学校"
        }
    },
    {
        name: "assessProgress",
        path: "/assessProgress",
        component: () => import(/*webpackChunkName: "assess-progress"*/"@/models/survey/activity/assess/progress/index"),
        meta: {
            removeBg: true,
            menu: routeMenusKey['appraisalActivity'],
            title: "测评进度"
        }
    },
    {
        name: "assessOverview",
        path: "/assessOverview",
        component: () => import(/*webpackChunkName: "aassess-overview"*/"@/models/survey/activity/assess/overview/index"),
        meta: {
            removeBg: true,
            menu: routeMenusKey['appraisalActivity'],
            title: "活动概况"
        }
    },
    {
        name: "assessEarlyWarnExamine",
        path: "/assessEarlyWarnExamine",
        component: () => import(/*webpackChunkName: "assess-early-warn-examine"*/"@/models/early-warn/examine/index"),
        meta: {
            menu: routeMenusKey['appraisalActivity'],
            title: "审核预警列表"
        } 
    },
    {
        name: "assessResult",
        path: "/assessResult",
        component: () => import(/*webpackChunkName: "assess-result"*/"@/models/survey/activity/assess/result/index"),
        meta: {
            menu: routeMenusKey['appraisalActivity'],
            title: "测评结果"
        }
    },
    {
        name: "assessReport",
        path: "/assessReport",
        component: () => import(/*webpackChunkName: "assess-report"*/"@/models/survey/activity/assess/report/index"),
        meta: {
            menu: routeMenusKey['appraisalActivity'],
            // watermark: true,
            title: "测评报告"
        }
    },
    {
        name: "assessAnswer",
        path: "/assessAnswer",
        component: () => import(/*webpackChunkName: "assess-answer"*/"@/models/survey/activity/assess/answer/index"),
        meta: {
            menu: routeMenusKey['appraisalActivity'],
            watermark: true,
            title: "量表答案"
        }
    },
]
//
const studentFileRoutes = [
    {
        name: "studentFile",
        path: "/studentFile",
        component: () => import(/*webpackChunkName: "student-file"*/"@/models/shcool-work/student/index"),
        meta: {
            code: "",
            menu: routeMenusKey['studentFile'],
            title: "学生档案"
        }
    },
    {
        name: "memberPsychicFiles",
        path: "/memberPsychicFiles",
        component: () => import(/*webpackChunkName: "student-psychic-file"*/"@/models/shcool-work/psychic-files/index"),
        meta: {
            removeBg: true,
            hideTitle: true, 
            menu: routeMenusKey['studentFile'],
            watermark: true,
            title: "心理档案"
        }
    },
    {
        name: "psychicFilesReport",
        path: "/psychicFilesReport",
        component: () => import(/*webpackChunkName: "psychic-file-report"*/"@/models/survey/activity/assess/report/index"),
        meta: { 
            menu: routeMenusKey['studentFile'],
            // watermark: true,
            title: "心理档案报告"
        }
    },
    {
        name: "psychicFilesDetail",
        path: "/psychicFilesDetail",
        component: () => import(/*webpackChunkName: "psychic-files-detail"*/"@/models/shcool-work/psychic-files/psychic-detail/index"),
        meta: {
            removeBg: true,
            hideTitle: true, 
            menu: routeMenusKey['studentFile'],
            watermark: true,
            title: "心理档案详情"
        }
    },
    {
        name: "psychicFilesAnswer",
        path: "/psychicFilesAnswer",
        component: () => import(/*webpackChunkName: "psychic-files-answer"*/"@/models/survey/activity/assess/answer/index"),
        meta: {
            menu: routeMenusKey['studentFile'],
            watermark: true,
            title: "量表答案"
        }
    },
    {
        name: "psychicFilesMeddle",
        path: "/psychicFilesMeddle",
        component: () => import(/*webpackChunkName: "early-warn-meddle"*/"@/models/early-warn/meddle/index"),
        meta: {
            menu: routeMenusKey['studentFile'],
            watermark: true,
            title: "干预记录"
        } 
    },
]

const assessTastRoutes = [
    {
        name: "assessTast",
        path: "/assessTast",
        component: () => import(/*webpackChunkName: "assess-tast"*/"@/models/shcool-work/assess-task/index"),
        meta: {
            menu: routeMenusKey['assessmentTasks'],
            title: "测评任务"
        } 
    },
    {
        name: "addAssessTast",
        path: "/addAssessTast",
        component: () => import(/*webpackChunkName: "add-assess-tast"*/"@/models/survey/activity/edit-activity/index"),
        meta: {
            menu: routeMenusKey['assessmentTasks'],
            title: "新增测评任务"
        }
    },
    {
        name: "editAssessTast",
        path: "/editAssessTast",
        component: () => import(/*webpackChunkName: "edit-assess-tast"*/"@/models/survey/activity/edit-activity/index"),
        meta: {
            menu: routeMenusKey['assessmentTasks'],
            title: "编辑测评任务"
        }
    },
    {
        name: "assessRelateClass",
        path: "/assessRelateClass",
        component: () => import(/*webpackChunkName: "assess-relate-tast"*/"@/models/shcool-work/assess-task/relate-class/index"),
        meta: {
            menu: routeMenusKey['assessmentTasks'],
            title: "关联班级"
        } 
    },
    {
        name: "assessTaskOverview",
        path: "/assessTaskOverview",
        component: () => import(/*webpackChunkName: "aassess-task-overview"*/"@/models/survey/activity/assess/overview/index"),
        meta: {
            removeBg: true,
            menu: routeMenusKey['assessmentTasks'],
            title: "活动概况"
        }
    },
    {
        name: "assessTasksEarlyWarnExamine",
        path: "/assessTasksEarlyWarnExamine",
        component: () => import(/*webpackChunkName: "assesstask-early-warn-examine"*/"@/models/early-warn/examine/index"),
        meta: {
            menu: routeMenusKey['assessmentTasks'],
            title: "审核预警列表"
        } 
    },
    {
        name: "assessTaskProgress",
        path: "/assessTaskProgress",
        component: () => import(/*webpackChunkName: "assess-task-progress"*/"@/models/survey/activity/assess/progress/index"),
        meta: {
            removeBg: true,
            menu: routeMenusKey['assessmentTasks'],
            title: "测评进度"
        }
    },
    {
        name: "assessTaskResult",
        path: "/assessTaskResult",
        component: () => import(/*webpackChunkName: "assess-task-result"*/"@/models/survey/activity/assess/result/index"),
        meta: {
            menu: routeMenusKey['assessmentTasks'],
            title: "测评结果"
        }
    },
    {
        name: "assessTaskReport",
        path: "/assessTaskReport",
        component: () => import(/*webpackChunkName: "assess-task-report"*/"@/models/survey/activity/assess/report/index"),
        meta: {
            menu: routeMenusKey['assessmentTasks'],
            // watermark: true,
            title: "测评报告"
        }
    },
    {
        name: "assessTaskAnswer",
        path: "/assessTaskAnswer",
        component: () => import(/*webpackChunkName: "assess-task-answer"*/"@/models/survey/activity/assess/answer/index"),
        meta: {
            menu: routeMenusKey['assessmentTasks'],
            watermark: true,
            title: "量表答案"
        }
    },
]

const classMaintRoutes = [
    {
        name: "classMaint",
        path: "/classMaint",
        component: () => import(/*webpackChunkName: "class-maint"*/"@/models/shcool-work/class/index"),
        meta: {
            menu: routeMenusKey['classMaintenance'],
            title: "班级维护"
        }  
    }
]

const schoolMaintRoutes = [
    {
        name: "schoolMaint",
        path: "/schoolMaint",
        component: () => import(/*webpackChunkName: "school-maint"*/"@/models/organize/school/index"),
        meta: {
            menu: routeMenusKey['schoolMaintenance'],
            title: "学校维护"
        } 
    },
    {
        name: "editSchoolMaint",
        path: "/editSchoolMaint",
        component: () => import(/*webpackChunkName: "edit-school-maint"*/"@/models/organize/school/edit-school/index"),
        meta: {
            menu: routeMenusKey['schoolMaintenance'],
            title: "学校编辑"
        } 
    }
]

const streetMaintRoutes = [
    {
        name: "streetMaint",
        path: "/streetMaint",
        component: () => import(/*webpackChunkName: "street-maint"*/"@/models/organize/street/index"),
        meta: {
            menu: routeMenusKey['streetMaintenance'],
            title: "街道维护"
        } 
    },
    {
        name: "editStreetMaint",
        path: "/editStreetMaint",
        component: () => import(/*webpackChunkName: "edit-street-maint"*/"@/models/organize/street/edit-street/index"),
        meta: {
            menu: routeMenusKey['streetMaintenance'],
            title: "街道编辑"
        } 
    }
]

const earlyWarnRoutes = [
    // {
    //     name: "earlyWarnStudent",
    //     path: "/earlyWarnStudent",
    //     component: () => import(/*webpackChunkName: "early-warn-student"*/"@/models/early-warn/student/index"),
    //     meta: {
    //         menu: routeMenusKey['forewarningSurvey'],
    //         title: "预警学生列表"
    //     } 
    // },
    {
        name: "earlyWarnIndex",
        path: "/earlyWarnIndex",
        component: () => import(/*webpackChunkName: "early-warn-index"*/"@/models/early-warn/index"),
        meta: {
            removeBg: true,
            menu: routeMenusKey['forewarningSurvey'],
            title: "预警概况"
        } 
    },
    {
        name: "earlyWarnExamine",
        path: "/earlyWarnExamine",
        component: () => import(/*webpackChunkName: "early-warn-examine"*/"@/models/early-warn/examine/index"),
        meta: {
            menu: routeMenusKey['forewarningSurvey'],
            title: "审核预警列表"
        } 
    },
    {
        name: "earlyWarnFormal",
        path: "/earlyWarnFormal",
        component: () => import(/*webpackChunkName: "early-warn-formal"*/"@/models/early-warn/formal/index"),
        meta: {
            menu: routeMenusKey['forewarningSurvey'],
            title: "正式预警人员列表"
        } 
    },
    {
        name: "earlyWarnMeddle",
        path: "/earlyWarnMeddle",
        component: () => import(/*webpackChunkName: "early-warn-meddle"*/"@/models/early-warn/meddle/index"),
        meta: {
            menu: routeMenusKey['forewarningSurvey'],
            watermark: true,
            title: "干预记录"
        } 
    },
    {
        name: "earlyWarnPsychicFiles",
        path: "/earlyWarnPsychicFiles",
        component: () => import(/*webpackChunkName: "earlywarn-psychic-file"*/"@/models/shcool-work/psychic-files/index"),
        meta: {
            removeBg: true,
            hideTitle: true, 
            menu: routeMenusKey['forewarningSurvey'],
            watermark: true,
            title: "心理档案"
        }
    },
    {
        name: "earlyWarnPsychicFilesReport",
        path: "/earlyWarnPsychicFilesReport",
        component: () => import(/*webpackChunkName: "earlyWarn-psychic-file-report"*/"@/models/survey/activity/assess/report/index"),
        meta: { 
            menu: routeMenusKey['forewarningSurvey'],
            // watermark: true,
            title: "心理档案报告"
        }
    },
    {
        name: "earlyWarnPsychicFilesDetail",
        path: "/earlyWarnPsychicFilesDetail",
        component: () => import(/*webpackChunkName: "earlyWarn-psychic-files-detail"*/"@/models/shcool-work/psychic-files/psychic-detail/index"),
        meta: {
            removeBg: true,
            hideTitle: true, 
            menu: routeMenusKey['forewarningSurvey'],
            watermark: true,
            title: "心理档案详情"
        }
    },
    {
        name: "earlyWarnPsychicFilesAnswer",
        path: "/earlyWarnPsychicFilesAnswer",
        component: () => import(/*webpackChunkName: "earlyWarn-psychic-files-answer"*/"@/models/survey/activity/assess/answer/index"),
        meta: {
            menu: routeMenusKey['forewarningSurvey'],
            watermark: true,
            title: "量表答案"
        }
    },
]

const customManageRoutes = [
    {
        name: "customPage",
        path: "/customPage",
        component: () => import(/*webpackChunkName: "custom-page"*/"@/models/pages/custom-page/index"),
        meta: {
            hideTitle: true, 
            menu: routeMenusKey['pageMaintenance'],
            title: "自定义页面"
        } 
    },
    {
        name: "editCustomPage",
        path: "/editCustomPage",
        component: () => import(/*webpackChunkName: "edit-custom-page"*/"@/models/pages/custom-page/edit-page/index"),
        meta: {
            hideTitle: true, 
            menu: routeMenusKey['pageMaintenance'],
            title: "编辑页面"
        } 
    },
    {
        name: "psychologyPage",
        path: "/psychologyPage",
        component: () => import(/*webpackChunkName: "psychology-page"*/"@/models/pages/psychology-page/index"),
        meta: {
            hideTitle: true, 
            menu: routeMenusKey['manualMental'],
            title: "心理手册"
        } 
    },
    {
        name: "userCenter",
        path: "/userCenter",
        component: () => import(/*webpackChunkName: "user-center"*/"@/models/pages/user-center/index"),
        meta: {
            hideTitle: true, 
            menu: routeMenusKey['personalCenter'],
            title: "个人中心"
        } 
    },
]

const recordsCenterRoutes = [
    {
        name: "dataCockpit",
        path: "/dataCockpit",
        component: () => import(/*webpackChunkName: "data-cockpit"*/"@/models/data/data-cockpit/index"),
        meta: {
            hideTitle: true, 
            hideBreadcrumb: true,
            menu: routeMenusKey['dataDriveCompartment'],
            title: "数据驾驶舱"
        } 
    }
]

const memberManageRoutes = [
    {
        name: "memberManage",
        path: "/memberManage",
        component: () => import(/*webpackChunkName: "member-manage"*/"@/models/system/member/index"),
        meta: {
            menu: routeMenusKey['peopleManagement'],
            title: "人员管理"
        } 
    },
    // {
    //     name: "editMemberManage",
    //     path: "/editMemberManage",
    //     component: () => import(/*webpackChunkName: "edit-member-manage"*/"@/models/system/member/edit-member/index"),
    //     meta: {
    //         menu: routeMenusKey['peopleManagement'],
    //         title: "编辑人员"
    //     } 
    // },
    {
        name: "resetMemberPwd",
        path: "/resetMemberPwd",
        component: () => import(/*webpackChunkName: "reset-member-pwd"*/"@/models/system/member/reset-pwd/index"),
        meta: {
            menu: routeMenusKey['peopleManagement'],
            title: "重置密码"
        } 
    }
]
const contentRepositoryRoutes = [ 
    {
        name: "contentRepository",
        path: "/contentRepository",
        component: () => import(/*webpackChunkName: "content-repository"*/"@/models/pages/content-repository/index"),
        meta: {
            menu: routeMenusKey['contentRepository'],
            title: "内容库"
        } 
    }
]

const psychServiceRoutes = [ 
    {
        name: "subscribe",
        path: "/subscribe",
        component: () => import(/*webpackChunkName: "subscribe-index"*/"@/models/psych-service/subscribe/index"),
        meta: {
            menu: routeMenusKey['reservationConsultation'],
            title: "预约咨询"
        } 
    },
    // {
    //     name: "subscribe",
    //     path: "/subscribe",
    //     component: () => import(/*webpackChunkName: "subscribe-index"*/"@/models/psych-service/subscribe/index"),
    //     meta: {
    //         menu: routeMenusKey['reservationConsultation'],
    //         title: "预约咨询"
    //     } 
    // },

]

const psychSuperviseRoutes = [
    {
        name: "supervise",
        path: "/supervise",
        component: () => import(/*webpackChunkName: "supervise-index"*/"@/models/psych-service/supervise/index"),
        meta: {
            menu: routeMenusKey['psychologicalSupervisor'],
            title: "预约督导"
        } 
    },
]

const psychologicalConsultantRoutes = [
    {
        name: "psychological",
        path: "/psychological",
        component: () => import(/*webpackChunkName: "psychiatrist-index"*/"@/models/psych-service/psychiatrist/index"),
        meta: {
            menu: routeMenusKey['psychologicalConsultant'],
            title: "心理咨询师"
        } 
    },
    {
        name: "psychiatristDetail",
        path: "/psychiatristDetail",
        component: () => import(/*webpackChunkName: "psychiatrist-detail"*/"@/models/psych-service/psychiatrist/psychiatrist-detail/index"),
        meta: {
            menu: routeMenusKey['psychologicalConsultant'],
            title: "详情"
        } 
    },
]

const transferChannelRoutes = [
    {
        name: "transferChannel",
        path: "/transferChannel",
        component: () => import(/*webpackChunkName: "transfer-channel-index"*/"@/models/transfer-channel/index"),
        meta: {
            menu: routeMenusKey['transferCourtyard'],
            title: "转院列表"
        } 
    },
    {
        name: "transferChannelAdd",
        path: "/transferChannelAdd",
        component: () => import(/*webpackChunkName: "transfer-channel-add"*/"@/models/transfer-channel/edit-channel/index"),
        meta: {
            menu: routeMenusKey['transferCourtyard'],
            title: "机构录入"
        } 
    },
    {
        name: "transferChannelDetail",
        path: "/transferChannelDetail",
        component: () => import(/*webpackChunkName: "transfer-channel-detail"*/"@/models/transfer-channel/edit-channel/index"),
        meta: {
            menu: routeMenusKey['transferCourtyard'],
            title: "机构录入"
        } 
    }
]

const curriculumRoutes = [
    {
        name: "curriculumTask",
        path: "/curriculumTask",
        component: () => import(/*webpackChunkName: "curriculum-task"*/"@/models/curriculum/task/index"),
        meta: {
            menu: routeMenusKey['studyTask'],
            title: "课程任务"
        } 
    },
    {
        name: "curriculumTaskSituation",
        path: "/curriculumTaskSituation",
        component: () => import(/*webpackChunkName: "curriculum-task-situation"*/"@/models/curriculum/task/situation/index"),
        meta: {
            menu: routeMenusKey['studyTask'],
            title: "课程概况"
        } 
    },
    {
        name: "addCurriculumTask",
        path: "/addCurriculumTask",
        component: () => import(/*webpackChunkName: "add-curriculum-task"*/"@/models/curriculum/task/edit-task/index"),
        meta: {
            menu: routeMenusKey['studyTask'],
            title: "创建学习任务"
        } 
    },
    {
        name: "editCurriculumTask",
        path: "/editCurriculumTask",
        component: () => import(/*webpackChunkName: "edit-curriculum-task"*/"@/models/curriculum/task/edit-task/index"),
        meta: {
            menu: routeMenusKey['studyTask'],
            title: "编辑学习任务"
        } 
    }
]

const teacherRoutes = [
    {
        name: "teacherList",
        path: "/teacherList",
        component: () => import(/*webpackChunkName: "teacher-list"*/"@/models/shcool-work/teacher/index"),
        meta: {
            menu: routeMenusKey['teacherManagement'],
            title: "教师管理"
        } 
    },
]

const baseConfigRoutes = [
    {
        name: "baseConfig",
        path: "/baseConfig",
        component: () => import(/*webpackChunkName: "basic-config"*/"@/models/basic-config/index"),
        meta: {
            menu: routeMenusKey['basicSetting'],
            title: "基础设置"
        } 
    },
]

const operateLogsRoutes = [
    {
        name: "operateLogList",
        path: "/operateLogList",
        component: () => import(/*webpackChunkName: "operate-log-list"*/"@/models/log/operate-log-list/index"),
        meta: {
            menu: routeMenusKey['operationLog'],
            title: "操作日志"
        } 
    },
]




const routes = [
    ...homeRoutes,
    ...gaugeRoutes,
    ...surveyActivityRoutes,
    ...studentFileRoutes,
    ...assessTastRoutes,
    ...classMaintRoutes,
    ...schoolMaintRoutes,
    ...streetMaintRoutes,
    ...earlyWarnRoutes,
    ...customManageRoutes,
    ...recordsCenterRoutes,
    ...memberManageRoutes,
    ...contentRepositoryRoutes,
    ...psychServiceRoutes,
    ...psychSuperviseRoutes,
    ...psychologicalConsultantRoutes,
    ...transferChannelRoutes,
    ...curriculumRoutes,
    ...teacherRoutes,
    ...baseConfigRoutes,
    ...operateLogsRoutes
]

function setMenuRoutes(){
    // 菜单默认跳转同菜单第一项
    let routesMenuMap = {};
    
    if(routes.length > 0){
        for(let i = 0; i < routes.length; i++){
            let item = routes[i] || {};
            let menu = (item.meta && item.meta.menu) || ''
            if(menu && !routesMenuMap[menu]){
                let meta = item.meta || {}
                routesMenuMap[menu] = {
                    path: item.path,
                    name: item.name,
                    title: meta.title
                }
            }
        }
    }
    return routesMenuMap;
    
}

export default {
    routes,
    routesMenuMap: setMenuRoutes()
};
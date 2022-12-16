const routeMenusKey = {
    inventoryManagement: "inventoryManagement",
    appraisalActivity: "appraisalActivity",
    psychologicalFile: "psychologicalFile",
    psychicFiles: "psychicFiles",
    assessmentTasks: "assessmentTasks",
    classMaintenance: "classMaintenance",
    schoolMaintenance: "schoolMaintenance",
    forewarningManagement: "forewarningManagement",
    forewarningSurvey: "forewarningSurvey",
    pageManagement: "pageManagement",
    pageMaintenance: "pageMaintenance",
    personalCenter: "personalCenter",
    contentRepository: "contentRepository",
    peopleMaintain: "peopleMaintain",
    systemSettings: "systemSettings",
    adminUserRoleSetting: "adminUserRoleSetting",
    organizationalManagement: "organizationalManagement",
    reservationConsultation: "reservationConsultation",
    psychologicalConsultant: "psychologicalConsultant",
    psychologicalSupervisor: "psychologicalSupervisor",
    manualMental: "manualMental",
    transferCourtyard: "transferCourtyard",
    zoneSet: "zoneSet",
    studyTask: "studyTask",
    
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
        path: "/aassessOverview",
        component: () => import(/*webpackChunkName: "aassess-overview"*/"@/models/survey/activity/assess/overview/index"),
        meta: {
            removeBg: true,
            menu: routeMenusKey['appraisalActivity'],
            title: "活动概况"
        }
    },
    {
        name: "assessResult",
        path: "/assessResult",
        component: () => import(/*webpackChunkName: "assess-result"*/"@/models/survey/activity/assess/result/index"),
        meta: {
            hideTitle: true, 
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
            title: "测评报告"
        }
    },
    {
        name: "assessAnswer",
        path: "/assessAnswer",
        component: () => import(/*webpackChunkName: "assess-answer"*/"@/models/survey/activity/assess/answer/index"),
        meta: {
            watermark: true,
            menu: routeMenusKey['appraisalActivity'],
            title: "量表答案"
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
]

const psychicFilesRoutes = [
    {
        name: "psychicFiles",
        path: "/psychicFiles",
        component: () => import(/*webpackChunkName: "psychic-file"*/"@/models/psych-service/psychic/index"),
        meta: {
            code: "",
            menu: routeMenusKey['psychologicalFile'],
            title: "档案管理"
        } 
    },
    {
        name: "memberPsychicFiles",
        path: "/memberPsychicFiles",
        component: () => import(/*webpackChunkName: "student-psychic-file"*/"@/models/psych-service/psychic/psychic-files/index"),
        meta: {
            removeBg: true,
            hideTitle: true, 
            watermark: true,
            menu: routeMenusKey['psychologicalFile'],
            title: "心理档案"
        }
    },
    {
        name: "psychicFilesReport",
        path: "/psychicFilesReport",
        component: () => import(/*webpackChunkName: "psychic-file-report"*/"@/models/survey/activity/assess/report/index"),
        meta: { 
            menu: routeMenusKey['psychologicalFile'],
            title: "心理档案报告"
        }
    },
    {
        name: "psychicFilesDetail",
        path: "/psychicFilesDetail",
        component: () => import(/*webpackChunkName: "psychic-files-detail"*/"@/models/psych-service/psychic/psychic-files/psychic-detail/index"),
        meta: {
            removeBg: true,
            hideTitle: true,
            watermark: true, 
            menu: routeMenusKey['psychologicalFile'],
            title: "心理档案详情"
        }
    },
    {
        name: "psychicFilesAnswer",
        path: "/psychicFilesAnswer",
        component: () => import(/*webpackChunkName: "psychic-files-answer"*/"@/models/survey/activity/assess/answer/index"),
        meta: {
            watermark: true,
            menu: routeMenusKey['psychologicalFile'],
            title: "量表答案"
        }
    },
    {
        name: "psychicFilesMeddle",
        path: "/psychicFilesMeddle",
        component: () => import(/*webpackChunkName: "early-warn-meddle"*/"@/models/early-warn/meddle/index"),
        meta: {
            watermark: true,
            menu: routeMenusKey['psychologicalFile'],
            title: "干预记录"
        } 
    },
]


const earlyWarnRoutes = [
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
            watermark: true,
            menu: routeMenusKey['forewarningSurvey'],
            title: "干预记录"
        } 
    },
    {
        name: "earlyWarnPsychicFiles",
        path: "/earlyWarnPsychicFiles",
        component: () => import(/*webpackChunkName: "earlywarn-psychic-file"*/"@/models/psych-service/psychic/psychic-files/index"),
        meta: {
            removeBg: true,
            hideTitle: true, 
            watermark: true,
            menu: routeMenusKey['forewarningSurvey'],
            title: "心理档案"
        }
    },
    {
        name: "earlyWarnPsychicFilesReport",
        path: "/earlyWarnPsychicFilesReport",
        component: () => import(/*webpackChunkName: "earlyWarn-psychic-file-report"*/"@/models/survey/activity/assess/report/index"),
        meta: { 
            watermark: true,
            menu: routeMenusKey['forewarningSurvey'],
            title: "心理档案报告"
        }
    },
    {
        name: "earlyWarnPsychicFilesAnswer",
        path: "/earlyWarnPsychicFilesAnswer",
        component: () => import(/*webpackChunkName: "earlyWarn-psychic-files-answer"*/"@/models/survey/activity/assess/answer/index"),
        meta: {
            watermark: true,
            menu: routeMenusKey['forewarningSurvey'],
            title: "量表答案"
        }
    },
    {
        name: "earlyWarnPsychicFilesDetail",
        path: "/earlyWarnPsychicFilesDetail",
        component: () => import(/*webpackChunkName: "earlyWarn-psychic-files-detail"*/"@/models/psych-service/psychic/psychic-files/psychic-detail/index"),
        meta: {
            removeBg: true,
            hideTitle: true, 
            watermark: true,
            menu: routeMenusKey['forewarningSurvey'],
            title: "心理档案详情"
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
            keepAlive: true,
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
        name: "userCenter",
        path: "/userCenter",
        component: () => import(/*webpackChunkName: "user-center"*/"@/models/pages/user-center/index"),
        meta: {
            hideTitle: true, 
            menu: routeMenusKey['personalCenter'],
            title: "个人中心"
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

const memberManageRoutes = [
    {
        name: "memberManage",
        path: "/memberManage",
        component: () => import(/*webpackChunkName: "member-manage"*/"@/models/organize/member/index"),
        meta: {
            menu: routeMenusKey['peopleMaintain'],
            title: "人员管理"
        } 
    },
    {
        name: "resetMemberPwd",
        path: "/resetMemberPwd",
        component: () => import(/*webpackChunkName: "reset-member-pwd"*/"@/models/organize/member/reset-pwd/index"),
        meta: {
            menu: routeMenusKey['peopleMaintain'],
            title: "重置密码"
        } 
    }
]
 
const organizeManageRoute = [
    {
        name: "organizational-index",
        path: "/organizational-index",
        component: () => import(/*webpackChunkName: "organizational-index"*/"@/models/organize/index"),
        meta: {
            menu: routeMenusKey['organizationalManagement'],
            title: "组织管理"
        } 
    }
]
const systemSettingsRoutes = [
    {
        name: "powerManager",
        path: "/powerManager",
        component: () => import(/*webpackChunkName: "power-manager"*/"@/models/system/power/index"),
        meta: {
            menu: routeMenusKey['adminUserRoleSetting'],
            title: "权限管理"
        } 
    },
]

const reservationConsultationRoutes = [
    {
        name: "subscribe",
        path: "/subscribe",
        component: () => import(/*webpackChunkName: "subscribe-index"*/"@/models/psych-service/subscribe/index"),
        meta: {
            menu: routeMenusKey['reservationConsultation'],
            title: "预约咨询"
        } 
    },
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
const zoneSetRoutes = [
    {
        name: "zoneSetList",
        path: "/zoneSetList",
        component: () => import(/*webpackChunkName: "zone-set-list"*/"@/models/zone-set/index"),
        meta: {
            menu: routeMenusKey['zoneSet'],
            title: "专区设置"
        } 
    },
    {
        name: "zoneSetDetail",
        path: "/zoneSetDetail",
        component: () => import(/*webpackChunkName: "zone-set-detail"*/"@/models/zone-set/detail"),
        meta: {
            menu: routeMenusKey['zoneSet'],
            title: "趣味测试专区"
        } 
    },
]


const routes = [
    ...homeRoutes,
    ...gaugeRoutes,
    ...surveyActivityRoutes,
    ...psychicFilesRoutes,
    // ...assessTastRoutes,
    ...earlyWarnRoutes,
    ...customManageRoutes,
    ...contentRepositoryRoutes,
    ...memberManageRoutes,
    ...organizeManageRoute,
    ...systemSettingsRoutes,
    ...reservationConsultationRoutes,
    ...psychologicalConsultantRoutes,
    ...transferChannelRoutes,
    ...curriculumRoutes,
    ...zoneSetRoutes
    // ...contentManageRoutes
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
    console.log("routesMenuMap", routesMenuMap)
    return routesMenuMap;
    
}

export default {
    routes,
    routesMenuMap: setMenuRoutes()
};
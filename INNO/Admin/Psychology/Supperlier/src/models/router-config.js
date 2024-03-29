const routeMenusKey = {
    pageHome: "pageHome",
    peopleMaintain: "peopleMaintain",
    systemSettings: "systemSettings",
    adminUserRoleSetting: "adminUserRoleSetting",
    organizationalManagement: "organizationalManagement",
    
    videoManagement: "videoManagement",
    audioManagement: "audioManagement",
    articleManagement: "articleManagement",
    psychologicalCounselor: "psychologicalCounselor",
    clientResource: "clientResource",
    reservationSupervisor: "reservationSupervisor",
    reservationConsultation: "reservationConsultation",
    adminSetting: "adminSetting",
    referralCase: "referralCase",
    pageMaintenance: "pageMaintenance",
    personalCenter: "personalCenter",
    courseManagement: "courseManagement",
    tasteTest: "tasteTest",
    supplierSetting: "supplierSetting",
    scaleMaintenance: "scaleMaintenance",
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
]


// 第三方管理平台路由

const contentManageRoutes = [
    // 视频
    {
        name: "videoManageIndex",
        path: "/videoManageIndex",
        component: () => import(/*webpackChunkName: "video-manage-index"*/"@/models/content-manage/video/index"),
        meta: {
            hideTitle: true,
            menu: routeMenusKey['videoManagement'],
            title: "视频管理"
        } 
    },
    {
        name: "videoManageAdd",
        path: "/videoManageAdd",
        component: () => import(/*webpackChunkName: "video-manage-add"*/"@/models/content-manage/video/edit-video/index"),
        meta: {
            menu: routeMenusKey['videoManagement'],
            title: "添加视频"
        } 
    },
    {
        name: "videoManageDetail",
        path: "/videoManageDetail",
        component: () => import(/*webpackChunkName: "video-manage-detail"*/"@/models/content-manage/video/edit-video/index"),
        meta: {
            menu: routeMenusKey['videoManagement'],
            title: "编辑视频"
        } 
    },
    // 音频
    {
        name: "audioManageIndex",
        path: "/audioManageIndex",
        component: () => import(/*webpackChunkName: "audio-manage-index"*/"@/models/content-manage/audio/index"),
        meta: {
            hideTitle: true,
            menu: routeMenusKey['audioManagement'],
            title: "音频管理"
        } 
    },
    {
        name: "audioManageAdd",
        path: "/audioManageAdd",
        component: () => import(/*webpackChunkName: "audio-manage-add"*/"@/models/content-manage/audio/edit-audio/index"),
        meta: {
            menu: routeMenusKey['audioManagement'],
            title: "添加音频"
        } 
    },
    {
        name: "audioManageDetail",
        path: "/audioManageDetail",
        component: () => import(/*webpackChunkName: "audio-manage-detail"*/"@/models/content-manage/audio/edit-audio/index"),
        meta: {
            menu: routeMenusKey['audioManagement'],
            title: "编辑音频"
        } 
    },
    // 文章
    {
        name: "articleManageIndex",
        path: "/articleManageIndex",
        component: () => import(/*webpackChunkName: "article-manage-index"*/"@/models/content-manage/article/index"),
        meta: {
            hideTitle: true,
            menu: routeMenusKey['articleManagement'],
            title: "文章管理"
        } 
    },
    {
        name: "articleManageAdd",
        path: "/articleManageAdd",
        component: () => import(/*webpackChunkName: "article-manage-add"*/"@/models/content-manage/article/edit-article/index"),
        meta: {
            menu: routeMenusKey['articleManagement'],
            title: "添加文章"
        } 
    },
    {
        name: "articleManageDetail",
        path: "/articleManageDetail",
        component: () => import(/*webpackChunkName: "article-manage-detail"*/"@/models/content-manage/article/edit-article/index"),
        meta: {
            menu: routeMenusKey['articleManagement'],
            title: "编辑文章"
        } 
    },
    // 课程
    {
        name: "courseManageIndex",
        path: "/courseManageIndex",
        component: () => import(/*webpackChunkName: "course-manage-index"*/"@/models/content-manage/course/index"),
        meta: {
            hideTitle: true,
            menu: routeMenusKey['courseManagement'],
            title: "课程管理"
        } 
    },
    {
        name: "courseManageAdd",
        path: "/courseManageAdd",
        component: () => import(/*webpackChunkName: "course-manage-add"*/"@/models/content-manage/course/edit-course/index"),
        meta: {
            hideTitle: true,
            menu: routeMenusKey['courseManagement'],
            title: "添加课程"
        } 
    },
    {
        name: "courseManageDetail",
        path: "/courseManageDetail",
        component: () => import(/*webpackChunkName: "course-manage-detail"*/"@/models/content-manage/course/edit-course/index"),
        meta: {
            hideTitle: true,
            menu: routeMenusKey['courseManagement'],
            title: "编辑课程"
        } 
    },
]

export const customerSupportRoutes = [
    // 资源管理
    {
        name: "resourceManageIndex",
        path: "/resourceManageIndex",
        component: () => import(/*webpackChunkName: "resource-manage-index"*/"@/models/customer-support/resource/index"),
        meta: {
            menu: routeMenusKey['clientResource'],
            title: "客户管理"
        } 
    },
    {
        name: "resourceManageDetail",
        path: "/resourceManageDetail",
        component: () => import(/*webpackChunkName: "resource-manage-detail"*/"@/models/customer-support/resource/edit-resource/index"),
        meta: {
            menu: routeMenusKey['clientResource'],
            title: "资源管理"
        } 
    },
    // 预约咨询
    {
        name: "subscribeManageIndex",
        path: "/subscribeManageIndex",
        component: () => import(/*webpackChunkName: "subscribe-manage-index"*/"@/models/customer-support/subscribe/index"),
        meta: {
            menu: routeMenusKey['reservationConsultation'],
            title: "预约咨询"
        } 
    },
    // 预约督导
    {
        name: "superviseManageIndex",
        path: "/superviseManageIndex",
        component: () => import(/*webpackChunkName: "supervise-manage-index"*/"@/models/customer-support/supervise/index"),
        meta: {
            menu: routeMenusKey['reservationSupervisor'],
            title: "预约督导"
        } 
    },
    // 功能配置
    {
        name: "functionConfig",
        path: "/functionConfig",
        component: () => import(/*webpackChunkName: "function-config-index"*/"@/models/customer-support/function-config/index"),
        meta: {
            menu: routeMenusKey['clientResource'],
            title: "功能配置"
        } 
    },
    // 基础设置
    {
        name: "baseConfig",
        path: "/baseConfig",
        component: () => import(/*webpackChunkName: "base-config-index"*/"@/models/customer-support/base-config/index"),
        meta: {
            menu: routeMenusKey['clientResource'],
            title: "基础设置"
        } 
    },
]

export const psychicManageRoutes = [
    // 心理咨询师
    {
        name: "psychiatristIndex",
        path: "/psychiatristIndex",
        component: () => import(/*webpackChunkName: "psychiatrist-manage-index"*/"@/models/psychiatrist/index"),
        meta: {
            menu: routeMenusKey['psychologicalCounselor'],
            title: "心理咨询师"
        } 
    },
    {
        name: "psychiatristAdd",
        path: "/psychiatristAdd",
        component: () => import(/*webpackChunkName: "psychiatrist-manage-add"*/"@/models/psychiatrist/psychiatrist-detail/index"),
        meta: {
            menu: routeMenusKey['psychologicalCounselor'],
            title: "新增人员"
        } 
    },
    {
        name: "psychiatristDetail",
        path: "/psychiatristDetail",
        component: () => import(/*webpackChunkName: "psychiatrist-manage-detail"*/"@/models/psychiatrist/psychiatrist-detail/index"),
        meta: {
            menu: routeMenusKey['psychologicalCounselor'],
            title: "编辑人员"
        } 
    },
    
]


export const referManageRoutes = [
    {
        name: "referIndex",
        path: "/referIndex",
        component: () => import(/*webpackChunkName: "refer-manage-index"*/"@/models/refer/index"),
        meta: {
            menu: routeMenusKey['referralCase'],
            title: "转介案例"
        } 
    },
]

export const systemManageRoutes = [
    {
        name: "systemPowerIndex",
        path: "/systemPowerIndex",
        component: () => import(/*webpackChunkName: "system-power-index"*/"@/models/system/power/index"),
        meta: {
            menu: routeMenusKey['adminSetting'],
            title: "管理员设置"
        } 
    }
]

export const funnyTestRoutes= [
    {
        name: "funnyTestIndex",
        path: "/funnyTestIndex",
        component: () => import(/*webpackChunkName: "funny-test-index"*/"@/models/funny-test/index"),
        meta: {
            menu: routeMenusKey['tasteTest'],
            title: "趣味测试"
        }
    },
    {
        name: "funnyTestDetail",
        path: "/funnyTestDetail",
        component: () => import(/*webpackChunkName: "funny-test-detail"*/"@/models/funny-test/test-detail/index"),
        meta: {
            menu: routeMenusKey['tasteTest'],
            title: "趣味测试"
        }
    },
    {
        name: "funnyTestProblems",
        path: "/funnyTestProblems",
        component: () => import(/*webpackChunkName: "funny-test-problems"*/"@/models/funny-test/problems-detail/index"),
        meta: {
            menu: routeMenusKey['tasteTest'],
            hideTitle: true,
            removeBg: true,
            title: "题目编辑"
        }
    }
]

// 量表管理
const gaugeRoutes = [
    {
        name: "gauge",
        path: "/gauge",
        component: () => import(/*webpackChunkName: "gauge-index"*/"@/models/survey/gauge/index"),
        meta: {
            menu: routeMenusKey['scaleMaintenance'],
            title: "量表管理"
        }
    },
    
    {
        name: "gaugeEdit",
        path: "/gauge/edit",
        component: () => import(/*webpackChunkName: "edit-gauge-index"*/"@/models/survey/gauge/edit-gauge/index"),
        meta: {
            menu: routeMenusKey['scaleMaintenance'],
            title: "量表维护"
        }
    }, 
    {
        name: "resultEdit",
        path: "/gauge/resultEdit",
        component: () => import(/*webpackChunkName: "edit-result-index"*/"@/models/survey/gauge/edit-gauge/index"),
        meta: {
            menu: routeMenusKey['scaleMaintenance'],
            title: "结果管理"
        }
    },

]

const baseConfigRoutes = [
    {
        name: "platformBaseConfig",
        path: "/platformBaseConfig",
        component: () => import(/*webpackChunkName: "basic-config"*/"@/models/basic-config/index"),
        meta: {
            menu: routeMenusKey['supplierSetting'],
            title: "基础设置"
        } 
    },
]



const routes = [
    ...homeRoutes,
    // ...psychicFilesRoutes,
    // ...earlyWarnRoutes,
    ...systemSettingsRoutes,
    ...contentManageRoutes,
    ...customerSupportRoutes,
    ...psychicManageRoutes,
    ...referManageRoutes,
    ...systemManageRoutes,
    ...customManageRoutes,
    ...funnyTestRoutes,
	...gaugeRoutes,
    ...baseConfigRoutes
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
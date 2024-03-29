const AdminApi = {
    adminLogin: {
        u: "/pt_v1/admin/loginInit",
        m: "post"
    },
    adminLoginOut: {
        u: "/pt_v1/admin/loginOut",
        m: "post"
    },
    editInitpasswd: { // oldpasswd, newpasswd, notarizepasswd
        u: "/pt_v1/admin/editInitpasswd",
        m: "post"
    },
    selectSupplierLogin: {
        u: "/pt_v1/admin/selectSupplierLogin",
        m: "post"
    },
}

export const pagesApi = {
    pageList: {
        u: "/pt_v1/pageMaintenance/list",
        m: "post"
    },
    pageAdd: {
        u: "/pt_v1/pageMaintenance/add",
        m: "post"
    },
    pageInfo: {
        u: "/pt_v1/pageMaintenance/Info",
        m: "post"
    },
    pageUpdate: {
        u: "/pt_v1/pageMaintenance/update",
        m: "post"
    },
    pageRemove: {
        u: "/pt_v1/pageMaintenance/remove",
        m: "post"
    },
    pageSort: {
        u: "/pt_v1/pageMaintenance/sort",
        m: "post"
    },
    setHomePage: {
        u: "/pt_v1/pageMaintenance/homePage",
        m: "post"
    },
}

export const componentsApi = {
    inventoryComponentList: {
        u: "/pt_v1/custom/componentData",
        m: "post"
    },
    adminRoleData: {
        u: "/pt_v1/custom/adminRoleData",
        m: "post"
    },
    adminAreaData: {
        u: "/pt_v1/custom/adminAreaData",
        m: "post"
    },
    adminSchoolData: {
        u: "/pt_v1/custom/adminSchoolData",
        m: "post"
    },
    adminCampusData: {
        u: "/pt_v1/custom/adminCampusData",
        m: "post"
    },
    adminGradeData: {
        u: "/pt_v1/custom/adminGradeData",
        m: "post"
    },
    addCampus: {
        u: "/pt_v1/classMaintenance/addCampus",
        m: "post"
    },
    updateCampus: {
        u: "/pt_v1/classMaintenance/updateCampus",
        m: "post"
    },
    ImageUplode: {
        u: "/pt_v1/custom/ImageUplode",
        m: "post"
    },
    mqProgress: {
        u: "/pt_v1/custom/mqProgress",
        m: "post"
    },
    getAppletList: {
        u: "/pt_v1/custom/getAppletList",
        m: "post"
    },
    qrcode: {
        u: "/pt_v1/custom/qrcode",
        m: "post"
    },
    surveyLevel: {
        u: "/pt_v1/custom/surveyLevel",
        m: "post"
    },
    surveyIntervention: {
        u: "/pt_v1/custom/surveyIntervention",
        m: "post"
    },
    schoolStudentData: {
        u: "/pt_v1/custom/schoolStudentData",
        m: "post"
    },
    getStudent: {
        u: "/pt_v1/custom/getStudent",
        m: "post"
    },
    adminOrganizationData: {
        u: "/pt_v1/custom/adminOrganizationData",
        m: "post"
    },



    specializeInSkilled: {
        u: "/pt_v1/custom/specializeInSkilled",
        m: "post"
    },
    multimediaUplode: {
        u: "/pt_v1/custom/MultimediaUplode",
        m: "post"
    },
    getCustomerGroupType: {
        u: "/pt_v1/customer/getCustomerGroupType",
        m: "post"
    },
    getTargetList: { // 参数page  pageSize 或则 is_all 可选参数：searchq、customer_ids、customer_id
        u: "/pt_v1/target/getTargetList",
        m: "post"
    },
    counselorMember: {
        u: "/pt_v1/custom/counselorMember",
        m: "post"
    },
    counselorService: {
        u: "/pt_v1/custom/counselorService",
        m: "post"
    },
    //
    getRoleData: {
        u: "/pt_v1/custom/getRoleData",
        m: "post"
    },
    // 
    getExamList: {
        u: "/pt_v1/custom/getExamList",
        m: "post"
    },
    // 配置时间模板
    getReservationTimeview: {
        u: "/pt_v1/custom/getReservationTimeview",
        m: "post"
    }
}



export const peopleManagementApi = {
    peopleList: {
        u: "/pt_v1/peopleManagement/list",
        m: "post"
    },
    peopleAdd: {
        u: "/pt_v1/peopleManagement/add",
        m: "post"
    },
    peopleInfo: {
        u: "/pt_v1/peopleManagement/Info",
        m: "post"
    },
    peopleUpdate: {
        u: "/pt_v1/peopleManagement/update",
        m: "post"
    },
    peopleRemove: {
        u: "/pt_v1/peopleManagement/remove",
        m: "post"
    },
    peopleRest: {
        u: "/pt_v1/peopleManagement/rest",
        m: "post"
    },
    peopleState: {
        u: "/pt_v1/peopleManagement/state",
        m: "post"
    }
}

export const userCenterApi = {
    viewUserCenter: {
        u: "/pt_v1/personalCenter/view",
        m: "post"
    },
    saveUserCenter: {
        u: "/pt_v1/personalCenter/save",
        m: "post"
    },

}

export const videoManageApiList = {
    getVideoGroupList: {
        u: "/pt_v1/videoManage/getVideoGroupList",
        m: "post"
    },
    getVideoGroupInfo: {
        u: "/pt_v1/videoManage/getVideoGroupInfo",
        m: "post"
    },
    videoGroupAdd: {
        u: "/pt_v1/videoManage/videoGroupAdd",
        m: "post"
    },
    videoGroupUpdate: {
        u: "/pt_v1/videoManage/videoGroupUpdate",
        m: "post"
    },
    getVideoList: {
        u: "/pt_v1/videoManage/getVideoList",
        m: "post"
    },
    getVideoInfo: {
        u: "/pt_v1/videoManage/getVideoInfo",
        m: "post"
    },
    videoAdd: {
        u: "/pt_v1/videoManage/videoAdd",
        m: "post"
    },
    videoUpdate: {
        u: "/pt_v1/videoManage/videoUpdate",
        m: "post"
    },
    videoChangeGroup: {
        u: "/pt_v1/videoManage/videoChangeGroup",
        m: "post"
    },
    distributeVideo: {
        u: "/pt_v1/videoManage/distributeVideo",
        m: "post"
    }
}

export const audioManageApiList = {
    getAudioGroupList: {
        u: "/pt_v1/audioManage/getAudioGroupList",
        m: "post"
    },
    getAudioGroupInfo: {
        u: "/pt_v1/audioManage/getAudioGroupInfo",
        m: "post"
    },
    audioGroupAdd: {
        u: "/pt_v1/audioManage/audioGroupAdd",
        m: "post"
    },
    audioGroupUpdate: {
        u: "/pt_v1/audioManage/audioGroupUpdate",
        m: "post"
    },
    getAudioList: {
        u: "/pt_v1/audioManage/getAudioList",
        m: "post"
    },
    getAudioInfo: {
        u: "/pt_v1/audioManage/getAudioInfo",
        m: "post"
    },
    audioAdd: {
        u: "/pt_v1/audioManage/audioAdd",
        m: "post"
    },
    audioUpdate: {
        u: "/pt_v1/audioManage/audioUpdate",
        m: "post"
    },
    audioChangeGroup: {
        u: "/pt_v1/audioManage/audioChangeGroup",
        m: "post"
    },
    distributeAudio: {
        u: "/pt_v1/audioManage/distributeAudio",
        m: "post"
    }
}

export const articleManageApiList = {
    getArticleGroupList: {
        u: "/pt_v1/articleManage/getArticleGroupList",
        m: "post"
    },
    getArticleGroupInfo: {
        u: "/pt_v1/articleManage/getArticleGroupInfo",
        m: "post"
    },
    articleGroupAdd: {
        u: "/pt_v1/articleManage/articleGroupAdd",
        m: "post"
    },
    articleGroupUpdate: {
        u: "/pt_v1/articleManage/articleGroupUpdate",
        m: "post"
    },
    getArticleList: {
        u: "/pt_v1/articleManage/getArticleList",
        m: "post"
    },
    getArticleInfo: {
        u: "/pt_v1/articleManage/getArticleInfo",
        m: "post"
    },

    articleAdd: {
        u: "/pt_v1/articleManage/articleAdd",
        m: "post"
    },
    articleUpdate: {
        u: "/pt_v1/articleManage/articleUpdate",
        m: "post"
    },
    articleChangeGroup: {
        u: "/pt_v1/articleManage/articleChangeGroup",
        m: "post"
    },
    distributeArticle: {
        u: "/pt_v1/articleManage/distributeArticle",
        m: "post"
    }

}

export const subscribeApiList = {
    reservationList: {
        u: "/pt_v1/reservationConsultation/list",
        m: "post"
    },
    reservationDispose: {
        u: "/pt_v1/reservationConsultation/dispose",
        m: "post"
    },
    reservationBatchDispose: {
        u: "/pt_v1/reservationConsultation/batchDispose",
        m: "post"
    },
    reservationView: {
        u: "/pt_v1/reservationConsultation/view",
        m: "post"
    },
    reservationRefuse: {
        u: "/pt_v1/reservationConsultation/refuse",
        m: "post"
    },
}

export const psychologicalApiList = {
    psychologicalList: {
        u: "/pt_v1/psychologicalCounselor/list",
        m: "post"
    },
    psychologicalInfo: {
        u: "/pt_v1/psychologicalCounselor/Info",
        m: "post"
    },
    psychologicalAdd: {
        u: "/pt_v1/psychologicalCounselor/add",
        m: "post"
    },
    psychologicalUpdate: {
        u: "/pt_v1/psychologicalCounselor/update",
        m: "post"
    },
    distributeConsultant: {
        u: "/pt_v1/psychologicalCounselor/distributeConsultant",
        m: "post"
    },
    // 保存心理咨询师时间表
    psychologicalWorking: {
        u: "/pt_v1/psychologicalCounselor/working",
        m: "post"
    },
    psychologicalBatchWorking: {
        u: "/pt_v1/psychologicalCounselor/batchWorking",
        m: "post"
    },
}

export const superviseApiList = {
    supervisorList: {
        u: "/pt_v1/reservationSupervisor/list",
        m: "post"
    },
    supervisorAllocation: {
        u: "/pt_v1/reservationSupervisor/allocation",
        m: "post"
    },
    supervisorView: {
        u: "/pt_v1/reservationSupervisor/view",
        m: "post"
    },
}

export const referApiList = {
    referralList: {
        u: "/pt_v1/referralCase/list",
        m: "post"
    },
    referralAccomplish: {
        u: "/pt_v1/referralCase/accomplish",
        m: "post"
    },
    referralView: {
        u: "/pt_v1/referralCase/view",
        m: "post"
    },
}

export const systemApiList = {
    adminSettingList: {
        u: "/pt_v1/adminSetting/list",
        m: "post"
    },
    adminSettingAdd: {
        u: "/pt_v1/adminSetting/add",
        m: "post"
    },
    adminSettingUpdate: {
        u: "/pt_v1/adminSetting/update",
        m: "post"
    },
    adminSettingReset: {
        u: "/pt_v1/adminSetting/rest",
        m: "post"
    },
    adminSettingState: {
        u: "/pt_v1/adminSetting/state",
        m: "post"
    },
    // 
}

export const commApiList = {
    getEapToken: {
        u: "/pt_v1/custom/getEapToken",
        m: "post"
    },
    getEapApi: {
        u: "/pt_v1/custom/getEapApi",
        m: "post"
    },
    getBackstageToken: {
        u: "/pt_v1/custom/getBackstageToken",
        m: "post"
    },
    getBackstageApi: {
        u: "/pt_v1/custom/getBackstageApi",
        m: "post"
    },
    getArticlePreview: {
        u: "/pt_v1/custom/getArticlePreview",
        m: "post"
    },
}

export const customerApiList = {
    setAppointmentIsLimitCount: {
        u: "/pt_v1/customer/setAppointmentIsLimitCount",
        m: "post"
    },
    getAppointmentConfig: {
        u: "/pt_v1/customer/getAppointmentConfig",
        m: "post"
    },
}

export const consultantApiList = {
    getConsultantAppointmentOrderList: {
        u: "/pt_v1/consultant/getConsultantAppointmentOrderList",
        m: "post"
    },
    getConsultantAppointmentOrderInfo: {
        u: "/pt_v1/consultant/getConsultantAppointmentOrderInfo",
        m: "post"
    },
    consultantAppointmentOrderAdd: {
        u: "/pt_v1/consultant/consultantAppointmentOrderAdd",
        m: "post"
    },
    consultantAppointmentOrderUpdate: {
        u: "/pt_v1/consultant/consultantAppointmentOrderUpdate",
        m: "post"
    },
    setConsultantAppointmentOrderLimitTime: {
        u: "/pt_v1/consultant/setConsultantAppointmentOrderLimitTime",
        m: "post"
    },
    basicSettinglist: {
        u: "/pt_v1/consultant/basicSettinglist",
        m: "post"
    },
    basicSettingSave: {
        u: "/pt_v1/consultant/basicSettingSave",
        m: "post"
    },
    // 活动次数配置
    getConsultantEvaluateOrderList: {
        u: "/pt_v1/consultant/getConsultantEvaluateOrderList",
        m: "post"
    },
    getConsultantEvaluateOrderInfo: {
        u: "/pt_v1/consultant/getConsultantEvaluateOrderInfo",
        m: "post"
    },
    consultantEvaluateOrderAdd: {
        u: "/pt_v1/consultant/consultantEvaluateOrderAdd",
        m: "post"
    },
    consultantEvaluateOrderUpdate: {
        u: "/pt_v1/consultant/consultantEvaluateOrderUpdate",
        m: "post"
    },
    getEvaluateConfig: {
        u: "/pt_v1/consultant/getEvaluateConfig",
        m: "post"
    },
    consultantEvaluateOrderConfig: {
        u: "/pt_v1/consultant/consultantEvaluateOrderConfig",
        m: "post"
    },
}

export const courseManagementApiList = {
    courseManagementGroupList: {
        u: "/pt_v1/courseManagement/groupList",
        m: "post"
    },
    courseManagementGroupAdd: {
        u: "/pt_v1/courseManagement/groupAdd",
        m: "post"
    },
    courseManagementUpdateName: {
        u: "/pt_v1/courseManagement/updateName",
        m: "post"
    },
    courseManagementUpdateGroup: {
        u: "/pt_v1/courseManagement/updateGroup",
        m: "post"
    },
    courseManagementList: {
        u: "/pt_v1/courseManagement/list",
        m: "post"
    },
    courseManagementInfo: {
        u: "/pt_v1/courseManagement/Info",
        m: "post"
    },
    courseManagemenAdd: {
        u: "/pt_v1/courseManagement/add",
        m: "post"
    },
    courseManagementUpdate: {
        u: "/pt_v1/courseManagement/update",
        m: "post"
    }, 
    courseManagementAllocation: {
        u: "/pt_v1/courseManagement/allocation",
        m: "post"
    },
}

export const tasteTestApiList = {
    tasteTestList: {
        u: "/pt_v1/tasteTest/list",
        m: "post"
    },
    issueTasteTest: {
        u: "/pt_v1/tasteTest/Issue",
        m: "post"
    },
    tasteTestInfo: {
        u: "/pt_v1/tasteTest/Info",
        m: "post"
    },
    saveTasteTest: {
        u: "/pt_v1/tasteTest/save",
        m: "post"
    },

    tasteTestResultList: {
        u: "/pt_v1/tasteTest/resultList",
        m: "post"
    },
    tasteTestResultAdd: {
        u: "/pt_v1/tasteTest/resultAdd",
        m: "post"
    },
    tasteTestResultUpdate: {
        u: "/pt_v1/tasteTest/resultUpdate",
        m: "post"
    },

    tasteTestTypeList: {
        u: "/pt_v1/tasteTest/typeList",
        m: "post"
    },
    tasteTestTypeAdd: {
        u: "/pt_v1/tasteTest/typeAdd",
        m: "post"
    },
    tasteTestTypeUpdate: {
        u: "/pt_v1/tasteTest/typeUpdate",
        m: "post"
    },

    tasteTestSubjectManagementInfo: {
        u: "/pt_v1/tasteTest/subjectManagementInfo",
        m: "post"
    },
    tasteTestSubjectManagementSave: {
        u: "/pt_v1/tasteTest/subjectManagementSave",
        m: "post"
    },
    // 分配
    tasteTestAllocation: {
        u: "/pt_v1/tasteTest/allocation",
        m: "post"
    },
    tasteTestTypeSave: {
        u: "/pt_v1/tasteTest/typeSave",
        m: "post"
    },
}


export const scaleMaintenanceApi = {
    scaleList: {
        u: "/pt_v1/scaleMaintenance/list",
        m: "post"
    },
    setPublishState: {
        u: "/pt_v1/scaleMaintenance/setPublishState",
        m: "post"
    },
    scaleUpdate: {
        u: "/pt_v1/scaleMaintenance/update",
        m: "post"
    }, 
    scaleInfo: {
        u: "/pt_v1/scaleMaintenance/Info",
        m: "post"
    },
    scaleReportInfo: {
        u: "/pt_v1/scaleMaintenance/reportInfo",
        m: "post"
    },
    scaleReportSave: {
        u: "/pt_v1/scaleMaintenance/reportSave",
        m: "post"
    },
    scaleDimensionInfo: {
        u: "/pt_v1/scaleMaintenance/dimensionInfo",
        m: "post"
    },
    scaleDimensionAdd: {
        u: "/pt_v1/scaleMaintenance/add",
        m: "post"
    },
    scaleDimensionSave: {
        u: "/pt_v1/scaleMaintenance/dimensionSave",
        m: "post"
    },
    scaleSubjectInfo: {
        u: "/pt_v1/scaleMaintenance/subjectInfo",
        m: "post"
    },
    scaleSubjectSave: {
        u: "/pt_v1/scaleMaintenance/subjectSave",
        m: "post"
    },
    setStatRule: {
        u: "/pt_v1/scaleMaintenance/setStatRule",
        m: "post"
    },
    setStatRuleRange: {
        u: "/pt_v1/scaleMaintenance/setStatRuleRange",
        m: "post"
    },
    getStatRuleRangeList: {
        u: "/pt_v1/scaleMaintenance/getStatRuleRangeList",
        m: "post"
    },
    delStatRuleRange: {
        u: "/pt_v1/scaleMaintenance/delStatRuleRange",
        m: "post"
    },
    // 导入，下载量表excel模板
    scaleBatchImportTpl: {
        u: "/pt_v1/scaleMaintenance/batchImportTpl",
        m: "post"
    },
    scaleBatchImport: {
        u: "/pt_v1/scaleMaintenance/batchImport",
        m: "post"
    },
    // T分数
    scaleTscoreList: {
        u: "/pt_v1/scaleMaintenance/tscoreList",
        m: "post"
    },
    batchImportTscoreTpl: {
        u: "/pt_v1/scaleMaintenance/batchImportTscoreTpl",
        m: "post"
    },
    batchImportTscore: {
        u: "/pt_v1/scaleMaintenance/batchImportTscore",
        m: "post"
    }
}

export const supplierSettingApiList = {
    supplierSettingList: {
        u: "/pt_v1/supplierSetting/list",
        m: "post"
    },
    supplierSettingSave: {
        u: "/pt_v1/supplierSetting/save",
        m: "post"
    },
}


export const WebApiList = {}

export default {
    ...AdminApi,
    ...pagesApi,
    ...componentsApi,
    ...peopleManagementApi,
    ...userCenterApi,
    ...videoManageApiList,
    ...audioManageApiList,
    ...articleManageApiList,
    ...subscribeApiList,
    ...psychologicalApiList,
    ...superviseApiList,
    ...referApiList,
    ...systemApiList,
    ...commApiList,
    ...customerApiList,
    ...consultantApiList,
	...courseManagementApiList,
    ...tasteTestApiList,
	...scaleMaintenanceApi,
    ...supplierSettingApiList
};
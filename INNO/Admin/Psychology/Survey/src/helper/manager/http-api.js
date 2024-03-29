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
    // 选择主体
    selectCustomerLogin: {
        u: "/pt_v1/admin/selectCustomerLogin",
        m: "post"
    },
    // 选择组织
    selectStructureLogin: {
        u: "/pt_v1/admin/selectStructureLogin",
        m: "post"
    },
    // 获取手机验证码
    sendLoginVcode: {
        u:"/pt_v1/admin/sendLoginVcode",
        m: "post"
    },
    // 验证码登录
    loginByVcode: {
        u:"/pt_v1/admin/loginByVcode",
        m: "post"
    },
}
const inventoryManagementApi = {
    inventoryList: {
        u: "/pt_v1/inventoryManagement/list",
        m: "post"
    },
    inventoryView: {
        u: "/pt_v1/inventoryManagement/view",
        m: "post"
    }
}
const appraisalActivityApi = {
    appraisalActList: {
        u: "/pt_v1/appraisalActivity/list",
        m: "post"
    },
    appraisalActAdd: {
        u: "/pt_v1/appraisalActivity/add",
        m: "post"
    },
    appraisalActRemove: {
        u: "/pt_v1/appraisalActivity/remove",
        m: "post"
    },
    appraisalActInfo: {
        u: "/pt_v1/appraisalActivity/Info",
        m: "post"
    },
    appraisalActCustomSave: {
        u: "/pt_v1/appraisalActivity/customSave",
        m: "post"
    },
    appraisalActUpdate: {
        u: "/pt_v1/appraisalActivity/update",
        m: "post"
    },
    //关联学校
    appraisalSchool:{
        u: "/pt_v1/appraisalActivity/school",
        m: "post"  
    },
    batchAddAppraisalSchool:{
        u: "/pt_v1/appraisalActivity/batchAddSchool",
        m: "post"  
    },
    batchCancelAppraisalSchool:{
        u: "/pt_v1/appraisalActivity/batchCancelSchool",
        m: "post"  
    },
    batchTplAppraisalSchool:{
        u: "/pt_v1/appraisalActivity/batchTplSchool",
        m: "post"  
    },
    batchImportAppraisalSchool:{
        u: "/pt_v1/appraisalActivity/batchImportSchool",
        m: "post"  
    },
    // 测评进度
    appraisalSchedule:{
        u: "/pt_v1/appraisalActivity/schedule",
        m: "post"  
    },
    // 测评进度结果
    appraisalScheduleResult:{
        u: "/pt_v1/appraisalActivity/result",
        m: "post"  
    },
    // 测评报告
    appraisalScheduleReport:{
        u: "/pt_v1/appraisalActivity/report",
        m: "post"  
    },
    // 测评答案
    appraisalScheduleAnswer:{
        u: "/pt_v1/appraisalActivity/answer",
        m: "post"  
    },
    // 活动概况
    appraisalScheduleInfo: {
        u: "/pt_v1/appraisalActivity/scheduleInfo",
        m: "post"
    },
    appraisalScheduleList: {
        u: "/pt_v1/appraisalActivity/scheduleList",
        m: "post"
    },
    // 量表答案
    appraisalTabControl: {
        u: "/pt_v1/appraisalActivity/tabControl",
        m: "post"
    },
    // 结果导出
    appraisalResultExport: {
        u: "/pt_v1/appraisalActivity/resultExport",
        m: "post"
    },
    // 重测结果
    appraisalResetResult: {
        u: "/pt_v1/appraisalActivity/resetResult",
        m: "post"
    },
    // 活动概况关联的学校
    appraisalScheduleReportSchool: {
        u: "/pt_v1/appraisalActivity/scheduleReportSchool",
        m: "post"
    },
}

const schoolMaintApi = {
    // 学校管理
    schoolMaintList:{
        u: "/pt_v1/schoolMaintenance/list",
        m: "post"  
    },
    addSchoolMaint:{
        u: "/pt_v1/schoolMaintenance/add",
        m: "post"  
    },
    schoolMaintInfo:{
        u: "/pt_v1/schoolMaintenance/Info",
        m: "post"  
    },
    updateSchoolMaint:{
        u: "/pt_v1/schoolMaintenance/update",
        m: "post"  
    },
    batchRemoveSchoolMaint:{
        u: "/pt_v1/schoolMaintenance/batchRemove",
        m: "post"  
    },
    batchTplSchoolMaint:{
        u: "/pt_v1/schoolMaintenance/batchTpl",
        m: "post"  
    },
    batchImportSchoolMaint:{
        u: "/pt_v1/schoolMaintenance/batchImport",
        m: "post"  
    },
    //管理员
    schoolMaintBindAdmin:{
        u: "/pt_v1/schoolMaintenance/bindAdmin",
        m: "post"  
    },
    schoolMaintAdminAdd:{
        u: "/pt_v1/schoolMaintenance/adminAdd",
        m: "post"  
    },
    schoolMaintAdminInfo:{
        u: "/pt_v1/schoolMaintenance/adminInfo",
        m: "post"  
    },
    schoolMaintAdminUpdate:{
        u: "/pt_v1/schoolMaintenance/adminUpdate",
        m: "post"  
    },
    schoolMaintAdminRemove:{
        u: "/pt_v1/schoolMaintenance/adminRemove",
        m: "post"  
    },
    schoolMaintAdminRest:{
        u: "/pt_v1/schoolMaintenance/adminRest",
        m: "post"  
    },
    schoolMaintAdminState:{
        u: "/pt_v1/schoolMaintenance/adminState",
        m: "post"  
    },
    // 添加学校年级管理
    schoolMaintGradeAdd:{
        u: "/pt_v1/schoolMaintenance/gradeAdd",
        m: "post"  
    },
}

// 街道
const streetMaintApi = {
    // 学校管理
    streetMaintList:{
        u: "/pt_v1/streetMaintenance/list",
        m: "post"  
    },
    addStreetMaint:{
        u: "/pt_v1/streetMaintenance/add",
        m: "post"  
    },
    streetMaintInfo:{
        u: "/pt_v1/streetMaintenance/Info",
        m: "post"  
    },
    updateStreetMaint:{
        u: "/pt_v1/streetMaintenance/update",
        m: "post"  
    },
    batchRemoveStreetMaint:{
        u: "/pt_v1/streetMaintenance/batchRemove",
        m: "post"  
    },
    batchTplStreetMaint:{
        u: "/pt_v1/streetMaintenance/batchTpl",
        m: "post"  
    },
    batchImportStreetMaint:{
        u: "/pt_v1/streetMaintenance/batchImport",
        m: "post"  
    },
    //管理员
    streetMaintBindAdmin:{
        u: "/pt_v1/streetMaintenance/bindAdmin",
        m: "post"  
    },
    streetMaintAdminAdd:{
        u: "/pt_v1/streetMaintenance/adminAdd",
        m: "post"  
    },
    streetMaintAdminInfo:{
        u: "/pt_v1/streetMaintenance/adminInfo",
        m: "post"  
    },
    streetMaintAdminUpdate:{
        u: "/pt_v1/streetMaintenance/adminUpdate",
        m: "post"  
    },
    streetMaintAdminRemove:{
        u: "/pt_v1/streetMaintenance/adminRemove",
        m: "post"  
    },
    streetMaintAdminRest:{
        u: "/pt_v1/streetMaintenance/adminRest",
        m: "post"  
    },
    streetMaintAdminState:{
        u: "/pt_v1/streetMaintenance/adminState",
        m: "post"  
    },
}

// 街道
const areaMaintApi = {
    // 学校管理
    areaMaintList:{
        u: "/pt_v1/areaMaintenance/list",
        m: "post"  
    },
    addAreaMaint:{
        u: "/pt_v1/areaMaintenance/add",
        m: "post"  
    },
    areaMaintInfo:{
        u: "/pt_v1/areaMaintenance/Info",
        m: "post"  
    },
    updateAreaMaint:{
        u: "/pt_v1/areaMaintenance/update",
        m: "post"  
    },
    batchRemoveAreaMaint:{
        u: "/pt_v1/areaMaintenance/batchRemove",
        m: "post"  
    },
    batchTplAreaMaint:{
        u: "/pt_v1/areaMaintenance/batchTpl",
        m: "post"  
    },
    batchImportAreaMaint:{
        u: "/pt_v1/areaMaintenance/batchImport",
        m: "post"  
    },
    //管理员
    areaMaintBindAdmin:{
        u: "/pt_v1/areaMaintenance/bindAdmin",
        m: "post"  
    },
    areaMaintAdminAdd:{
        u: "/pt_v1/areaMaintenance/adminAdd",
        m: "post"  
    },
    areaMaintAdminInfo:{
        u: "/pt_v1/areaMaintenance/adminInfo",
        m: "post"  
    },
    areaMaintAdminUpdate:{
        u: "/pt_v1/areaMaintenance/adminUpdate",
        m: "post"  
    },
    areaMaintAdminRemove:{
        u: "/pt_v1/areaMaintenance/adminRemove",
        m: "post"  
    },
    areaMaintAdminRest:{
        u: "/pt_v1/areaMaintenance/adminRest",
        m: "post"  
    },
    areaMaintAdminState:{
        u: "/pt_v1/areaMaintenance/adminState",
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
    adminAreaData:{
        u: "/pt_v1/custom/adminAreaData",
        m: "post" 
    },
    adminStreetData:{
        u: "/pt_v1/custom/adminStreetData",
        m: "post" 
    },
    adminSchoolData:{
        u: "/pt_v1/custom/adminSchoolData",
        m: "post" 
    },
    adminCampusData:{
        u: "/pt_v1/custom/adminCampusData",
        m: "post" 
    },
    adminGradeData:{
        u: "/pt_v1/custom/adminGradeData",
        m: "post" 
    },
    adminGSyClassData:{
        u: "/pt_v1/custom/adminGSyClassData",
        m: "post" 
    },
    adminGdClassData:{
        u: "/pt_v1/custom/adminGdClassData",
        m: "post" 
    },
    getSchoolGradeType:{
        u: "/pt_v1/custom/getSchoolGradeType",
        m: "post" 
    },
    getSchoolGradeData:{
        u: "/pt_v1/custom/getSchoolGradeData",
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
    qrcode: {
        u: "/pt_v1/custom/qrcode",
        m: "post" 
    },
    wxcode: {
        u: "/pt_v1/custom/wxCode",
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
    getStructureData: {
        u: "/pt_v1/custom/getStructureData",
        m: "post" 
    },
    getLoginWay: {
        u: "/pt_v1/custom/getLoginWay",
        m: "post"
    },
    getAddressList: {
        u: "/pt_v1/custom/getAddressList",
        m: "post"
    },
    getEduTeacher: {
        u: "/pt_v1/custom/getEduTeacher",
        m: "post"
    },
    getAppletList:{
        u:"/pt_v1/custom/getAppletList",
        m: "post"
    },
    getAssignModelList:{
        u:"/pt_v1/custom/getAssignModelList",
        m:"post"
    },
    // 量表维度
    getAssignModelRuleList:{
        u:"/pt_v1/custom/getAssignModelRuleList",
        m:"post"
    },
    // 数据仓报告量表列表
    getGroupReportModelList:{
        u:"/pt_v1/custom/getGroupReportModelList",
        m:"post"
    },
    getWarningModelList:{
        u:"/pt_v1/custom/getWarningModelList",
        m: "post"
    },
    putLog:{
        u:"/pt_v1/custom/putLog",
        m: "post"
    },
    // 获取登录验证图
    getVerify:{
        u:"/pt_v1/custom/getVerify",
        m: "post"
    },
    schoolInitGrade:{
        u:"/pt_v1/custom/schoolInitGrade",
        m: "post"
    },
    // 升级班级，设置毕业
    setSchoolUpgrade:{
        u:"/pt_v1/custom/setSchoolUpgrade",
        m: "post"
    },
    // 暂不设置升级
    isSetSchoolUpgrade:{
        u:"/pt_v1/custom/isSetSchoolUpgrade",
        m: "post"
    },
    // 判断是否有公众号
    getOffiaccountInfo:{
        u:"/pt_v1/custom/getOffiaccountInfo",
        m: "post"
    },
}

export const studentFileApi= {
    studentList: {
        u: "/pt_v1/studentFile/list",
        m: "post" 
    },
    studentUpdate: {
        u: "/pt_v1/studentFile/update",
        m: "post" 
    },
    studentAdd: {
        u: "/pt_v1/studentFile/add",
        m: "post" 
    },
    studentBatchRemove: {
        u: "/pt_v1/studentFile/batchRemove",
        m: "post" 
    },
    studentBatchTpl: {
        u: "/pt_v1/studentFile/batchTpl",
        m: "post" 
    },
    studentBatchImport: {
        u: "/pt_v1/studentFile/batchImport",
        m: "post" 
    },
    psychologyFiles: {
        u: "/pt_v1/studentFile/psychologyFiles",
        m: "post" 
    },
    psychologyFilesActivity: {
        u: "/pt_v1/studentFile/psychologyFilesActivity",
        m: "post" 
    },
    psychologyFilesPsychic: {
        u: "/pt_v1/studentFile/psychologyFilesPsychic",
        m: "post" 
    },
    psychologyDetails: {
        u: "/pt_v1/studentFile/psychologyDetails",
        m: "post" 
    },
    psychologyDetailsActivity: {
        u: "/pt_v1/studentFile/psychologyDetailsActivity",
        m: "post" 
    },
    psychologyReport: {
        u: "/pt_v1/studentFile/psychologyReport",
        m: "post" 
    },
    psychologyAnswer: {
        u: "/pt_v1/studentFile/psychologyAnswer",
        m: "post" 
    },
    psychologyFilesExport: {
        u: "/pt_v1/studentFile/psychologyFilesExport",
        m: "post" 
    }, 
}

export const studentManagementApi = {
    studentManagementList: {
        u: "/pt_v1/studentManagement/list",
        m: "post" 
    }, 
    studentManagementAdd: {
        u: "/pt_v1/studentManagement/add",
        m: "post" 
    }, 
    studentManagementUpdate: {
        u: "/pt_v1/studentManagement/update",
        m: "post" 
    }, 
    studentManagementMigration: {
        u: "/pt_v1/studentManagement/migration",
        m: "post" 
    }, 
    studentManagementBatchTpl: {
        u: "/pt_v1/studentManagement/batchTpl",
        m: "post" 
    },
    studentManagementBatchImport: {
        u: "/pt_v1/studentManagement/batchImport",
        m: "post" 
    },
    studentManagementExport: {
        u: "/pt_v1/studentManagement/export ",
        m: "post" 
    },
}

export const classMaintApi = {
    classMaintList: {
        u: "/pt_v1/classMaintenance/list",
        m: "post"
    },
    addClassMaint: {
        u: "/pt_v1/classMaintenance/add",
        m: "post"
    },
    updateClassMaint: {
        u: "/pt_v1/classMaintenance/update",
        m: "post"
    },
    batchRemoveClassMaint: {
        u: "/pt_v1/classMaintenance/batchRemove",
        m: "post"
    },
    classMaintBatchTpl: {
        u: "/pt_v1/classMaintenance/batchTpl",
        m: "post"
    },
    classMaintBatchImport: {
        u: "/pt_v1/classMaintenance/batchImport",
        m: "post"
    },
    classMaintBindAdmin: {
        u: "/pt_v1/classMaintenance/bindAdmin",
        m: "post"
    },
    classMaintAdminAdd: {
        u: "/pt_v1/classMaintenance/adminAdd",
        m: "post"
    },
    classMaintAdminInfo: {
        u: "/pt_v1/classMaintenance/adminInfo",
        m: "post"
    },
    classMaintAdminUpdate: {
        u: "/pt_v1/classMaintenance/adminUpdate",
        m: "post"
    },
    classMaintAdminRemove: {
        u: "/pt_v1/classMaintenance/adminRemove",
        m: "post"
    },
    classMaintAdminRest: {
        u: "/pt_v1/classMaintenance/adminRest",
        m: "post"
    },
    classMaintAdminState: {
        u: "/pt_v1/classMaintenance/adminState",
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

export const assessmentTasksApi = {
    assessmentTaskList: {
        u: "/pt_v1/assessmentTasks/list",
        m: "post"
    },
    assessmentTaskAdd: {
        u: "/pt_v1/assessmentTasks/add",
        m: "post"
    },
    assessmentTaskInfo: {
        u: "/pt_v1/assessmentTasks/Info",
        m: "post"
    },
    assessmentTaskCustomSave: {
        u: "/pt_v1/assessmentTasks/customSave",
        m: "post"
    },
    assessmentTaskUpdate: {
        u: "/pt_v1/assessmentTasks/update",
        m: "post"
    },
    assessmentTaskRemove: {
        u: "/pt_v1/assessmentTasks/remove",
        m: "post"
    },

    assessmentTaskSchedule:{
        u: "/pt_v1/assessmentTasks/schedule",
        m: "post"
    },
    assessmentTaskResult:{
        u: "/pt_v1/assessmentTasks/result",
        m: "post"
    },
    assessmentTaskReport:{
        u: "/pt_v1/assessmentTasks/report",
        m: "post"
    },
    assessmentTaskAnswer:{
        u: "/pt_v1/assessmentTasks/answer",
        m: "post"
    },

    createSchoolCode: {
        u: "/pt_v1/assessmentTasks/schoolCode",
        m: "post"
    },
    createSchoolLink: {
        u: "/pt_v1/assessmentTasks/schoolLink",
        m: "post"
    },
    relateClassList: {
        u: "/pt_v1/assessmentTasks/classList",
        m: "post"
    },
    relateClassAdd: {
        u: "/pt_v1/assessmentTasks/classAdd",
        m: "post"
    },
    relateClassCancel: {
        u: "/pt_v1/assessmentTasks/classCancel",
        m: "post"
    },
    batchClassCode: {
        u: "/pt_v1/assessmentTasks/batchClassCode",
        m: "post"
    },
    batchClassLink: {
        u: "/pt_v1/assessmentTasks/batchClassLink",
        m: "post"
    },
    // 活动概况
    assessmentTasksScheduleInfo: {
        u: "/pt_v1/assessmentTasks/scheduleInfo",
        m: "post"
    },
    assessmentTasksScheduleList: {
        u: "/pt_v1/assessmentTasks/scheduleList",
        m: "post"
    },
    // 结果导出
    assessmentTasksResultExport: {
        u: "/pt_v1/assessmentTasks/resultExport",
        m: "post"
    },
    // 活动概况导出
    assessmentTasksScheduleExport: {
        u: "/pt_v1/assessmentTasks/scheduleExport",
        m: "post"
    },
    // 重置结果
    assessmentTasksResetResult: {
        u: "/pt_v1/assessmentTasks/resetResult",
        m: "post"
    },
    scheduleReportGrage: {
        u: "/pt_v1/assessmentTasks/scheduleReportGrage",
        m: "post"
    },
    scheduleReportExport: {
        u: "/pt_v1/assessmentTasks/scheduleReportExport",
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

export const manualMentalApi = {
    manualMentalView:{
        u:"/pt_v1/manualMental/view",
        m:"post"
    },
    manualMentalSave:{
        u:"/pt_v1/manualMental/save",
        m:"post"
    },
}


export const forewarningSurveyApi = {
    forewarningList: {
        u: "/pt_v1/forewarningSurvey/view",
        m: "post"
    },
    forewarningExamineList: {
        u: "/pt_v1/forewarningSurvey/checkList",
        m: "post"
    },
    forewarningSignGrade: {
        u: "/pt_v1/forewarningSurvey/signGrade",
        m: "post"
    },
    forewarningPeopleList: {
        u: "/pt_v1/forewarningSurvey/warningPeopleList",
        m: "post"
    },
    forewarningAddPeople: {
        u: "/pt_v1/forewarningSurvey/addPeople",
        m: "post"
    },
    forewarningInterveneRecord: {
        u: "/pt_v1/forewarningSurvey/interveneRecord",
        m: "post"
    },
    forewarningAddRecord: {
        u: "/pt_v1/forewarningSurvey/addRecord",
        m: "post"
    },
    forewarningCheckExport: {
        u: "/pt_v1/forewarningSurvey/checkExport",
        m: "post"
    }
}

export const contentRepositoryApi = {
    contentList:{
        u: "/pt_v1/contentRepository/list",
        m: "post"
    },
    contentSourceList: {
        u: "/pt_v1/contentRepository/sourceList",
        m: "post"
    }, 
}
export const reservationConsultationApi = {
    reservationList: {
        u: "/pt_v1/reservationConsultation/list",
        m: "post"
    },
    reservationDetails: {
        u: "/pt_v1/reservationConsultation/details",
        m: "post"
    },  
    reservationData: {
        u: "/pt_v1/reservationConsultation/data",
        m: "post"
    }
}

export const psychologicalConsultantApi = {
    psychologicalList: {
        u: "/pt_v1/psychologicalConsultant/list",
        m: "post"
    },
    psychologicalDetails: {
        u: "/pt_v1/psychologicalConsultant/details",
        m: "post"
    }, 
    psychologicalSourceList: {
        u: "/pt_v1/psychologicalConsultant/sourceList",
        m: "post"
    }, 
}

export const subscribeApi = {
    psychologicalSupervisorList: {
        u: "/pt_v1/psychologicalSupervisor/list",
        m: "post"
    },
    psychologicalSupervisorDetails: {
        u: "/pt_v1/psychologicalSupervisor/details",
        m: "post"
    },
    psychologicalSupervisorSourceList: {
        u: "/pt_v1/psychologicalSupervisor/sourceList",
        m: "post"
    },
}

export const transferCourtyardApi = {
    transferCourtyardList: {
        u: "/pt_v1/transferCourtyard/list",
        m: "post"
    },
    transferCourtyardInfo: {
        u: "/pt_v1/transferCourtyard/Info",
        m: "post"
    },
    addTransferCourtyard: {
        u: "/pt_v1/transferCourtyard/add",
        m: "post"
    },
    updateTransferCourtyard: {
        u: "/pt_v1/transferCourtyard/update",
        m: "post"
    },
}

export const teacherManagementApi = {
    teacherManagementList: {
        u: "/pt_v1/teacherManagement/list",
        m: "post"
    },
    teacherManagementAdd: {
        u: "/pt_v1/teacherManagement/add",
        m: "post"
    },
    teacherManagementUpdate: {
        u: "/pt_v1/teacherManagement/update",
        m: "post"
    },
    teacherManagementBatchTpl: {
        u: "/pt_v1/teacherManagement/batchTpl",
        m: "post"
    },
    teacherManagementBatchImport: {
        u: "/pt_v1/teacherManagement/batchImport",
        m: "post"
    },
    teacherManagementState: {
        u: "/pt_v1/teacherManagement/state",
        m: "post"
    }
}

export const studyTaskApi = {
    studyTaskList: {
        u: "/pt_v1/studyTask/list",
        m: "post"
    },
    studyTaskAdd: {
        u: "/pt_v1/studyTask/add",
        m: "post"
    },
    studyTaskUpdate: {
        u: "/pt_v1/studyTask/update",
        m: "post"
    },
    studyTaskInfo: {
        u: "/pt_v1/studyTask/Info",
        m: "post"
    },
    studyTaskGeneralTotal: {
        u: "/pt_v1/studyTask/generalTotal",
        m: "post"
    },
    generalList: {
        u: "/pt_v1/studyTask/generalList",
        m: "post"
    },
    studyTaskStatus: {
        u: "/pt_v1/studyTask/status",
        m: "post"
    },
    studyTaskClassAdd: {
        u: "/pt_v1/studyTask/classAdd",
        m: "post"
    },
    studyTaskClassList: {
        u: "/pt_v1/studyTask/classList",
        m: "post"
    },
    studyTaskStructureList: {
        u: "/pt_v1/studyTask/structureList",
        m: "post"
    },
    // 批量生成二维码
    studyTaskBatchCode: {
        u: "/pt_v1/studyTask/batchCode",
        m: "post"
    },
    
}
export const configApi = {
    basicSettingList: {
        u: "/pt_v1/basicSetting/list",
        m: "post"
    }, 
    basicSettingSave: {
        u: "/pt_v1/basicSetting/save",
        m: "post"
    }, 
}

export const dataDriveCompartmentApi = {
    dataDriveCompartment: {
        u: "/pt_v1/dataDriveCompartment/list",
        m: "post"
    },
}

export const operationLogApi = {
    operationLogList: {
        u: "/pt_v1/operationLog/list",
        m: "post"
    }
}

export const zoneSetApi = {
    zoneSetList: {
        u: "/pt_v1/zoneSet/list",
        m: "post"
    },
    zoneSetInfo: {
        u: "/pt_v1/zoneSet/Info",
        m: "post"
    },
    zoneSetSave: {
        u: "/pt_v1/zoneSet/save",
        m: "post"
    },
    getFunList: {
        u: "/pt_v1/zoneSet/getFunList",
        m: "post"
    }
}




const localhostBaseUrl = "http://10.1.1.66:8089";

export const localhostApi = {
    localhostLoginIn: {
        b: localhostBaseUrl,
        u: "/loginApi/loginIn",
        m: "post"
    },
    localhostUpload: {
        b: localhostBaseUrl,
        u: "/uplodaApi/upload",
        m: "post"
    }
  }

export const WebApiList = {}

export default {
    ...appraisalActivityApi,
    ...AdminApi,
    ...inventoryManagementApi,
    ...areaMaintApi,
    ...streetMaintApi,
    ...schoolMaintApi,
    ...studentFileApi,
    ...componentsApi,
    ...classMaintApi,
    ...peopleManagementApi,
    ...assessmentTasksApi,
    ...pagesApi,
    ...userCenterApi,
    ...forewarningSurveyApi,
    ...contentRepositoryApi,
    ...reservationConsultationApi,
    ...psychologicalConsultantApi,
    ...subscribeApi,
    ...manualMentalApi,
    ...transferCourtyardApi,
    ...teacherManagementApi,
    ...studyTaskApi,
    ...configApi,
    ...dataDriveCompartmentApi,
    ...operationLogApi,
    ...zoneSetApi,
    ...studentManagementApi,
    ...localhostApi
};
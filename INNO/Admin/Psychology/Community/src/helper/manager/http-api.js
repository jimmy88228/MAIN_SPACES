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
    selectCustomerLogin: {
        u: "/pt_v1/admin/selectCustomerLogin",
        m: "post"
    }
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
    appraisalActUpdate: {
        u: "/pt_v1/appraisalActivity/update",
        m: "post"
    },
    // 推广组织列表
    organizationalList: {
        u: "/pt_v1/appraisalActivity/organizationalList",
        m: "post"
    },
    // 测评进度
    appraisalSchedule: {
        u: "/pt_v1/appraisalActivity/schedule",
        m: "post"
    },
    // 测评进度结果
    appraisalScheduleResult: {
        u: "/pt_v1/appraisalActivity/result",
        m: "post"
    },
    // 测评报告
    appraisalScheduleReport: {
        u: "/pt_v1/appraisalActivity/report",
        m: "post"
    },
    // 测评答案
    appraisalScheduleAnswer: {
        u: "/pt_v1/appraisalActivity/answer",
        m: "post"
    },
    // 查看具体答案
    appraisalTabControl: {
        u: "/pt_v1/appraisalActivity/tabControl",
        m: "post"
    },
    // 活动概况
    appraisalScheduleInfo: {
        u: "/pt_v1/appraisalActivity/scheduleInfo",
        m: "post"
    },
    // 组织概况
    appraisalScheduleList: {
        u: "/pt_v1/appraisalActivity/scheduleList",
        m: "post"
    },
    // 批量生成二维码
    batchQrCode: {
        u: "/pt_v1/appraisalActivity/batchQrCode",
        m: "post"
    },
    // 未知人员
    unknownStructureList: {
        u: "/pt_v1/appraisalActivity/unknownList",
        m: "post"
    },
    getActivityMemberList: {
        u: "/pt_v1/appraisalActivity/getActivityMemberList",
        m: "post"
    },
    getActivityMemberConfig: {
        u: "/pt_v1/appraisalActivity/getActivityMemberConfig",
        m: "post"
    },

    appraisalActivityCustomSave: {
        u: "/pt_v1/appraisalActivity/customSave",
        m: "post"
    },

    // 活动概况导出
    appraisalActivityScheduleExport: {
        u: "/pt_v1/appraisalActivity/scheduleExport",
        m: "post"
    },
    // 结果导出
    appraisalActivityResultExport: {
        u: "/pt_v1/appraisalActivity/resultExport",
        m: "post"
    },
    // 重置结果
    appraisalActivityResetResult: {
        u: "/pt_v1/appraisalActivity/resetResult",
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
    getUserInfo: {
        u: "/pt_v1/custom/getUserInfo",
        m: "post"
    },
    adminOrganizationData: {
        u: "/pt_v1/custom/adminOrganizationData",
        m: "post"
    },
    pageStructureData: {
        u: "/pt_v1/custom/pageStructureData",
        m: "post"
    },
    getLoginWay: {
        u: "/pt_v1/custom/getLoginWay",
        m: "post"
    },
    getStructureUserData: {
        u: "/pt_v1/custom/getStructureUserData",
        m: "post"
    },
    getAddressList: {
        u: "/pt_v1/custom/getAddressList",
        m: "post"
    },
    getAssignModelList:{
        u:"/pt_v1/custom/getAssignModelList",
        m: "post"
    },
    getDemographicList:{
        u:"/pt_v1/custom/getDemographicList",
        m: "post"
    },
    getWarningModelList:{
        u:"/pt_v1/custom/getWarningModelList",
        m: "post"
    },
    // 量表维度
    getAssignModelRuleList:{
        u:"/pt_v1/custom/getAssignModelRuleList",
        m:"post"
    },
    // 获取登录验证图
    getVerify:{
        u:"/pt_v1/custom/getVerify",
        m: "post"
    },
    //
    getBackstageToken:{
        u:"/pt_v1/custom/getBackstageToken",
        m: "post"
    }
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

export const studentFileApi = {
    memberList: {
        u: "/pt_v1/memberFile/list",
        m: "post"
    },
    psychologyFiles: {
        u: "/pt_v1/memberFile/psychologyFiles",
        m: "post"
    },
    psychologyFilesActivity: {
        u: "/pt_v1/memberFile/psychologyFilesActivity",
        m: "post"
    },
    psychologyFilesPsychic: {
        u: "/pt_v1/memberFile/psychologyFilesPsychic",
        m: "post"
    },
    psychologyDetails: {
        u: "/pt_v1/memberFile/psychologyDetails",
        m: "post"
    },
    psychologyDetailsActivity: {
        u: "/pt_v1/memberFile/psychologyDetailsActivity",
        m: "post"
    },
    psychologyReport: {
        u: "/pt_v1/memberFile/psychologyReport",
        m: "post"
    },
    psychologyAnswer: {
        u: "/pt_v1/memberFile/psychologyAnswer",
        m: "post"
    },
    followRecord: {
        u: "/pt_v1/memberFile/followRecord",
        m: "post"
    },
    followRecordView: {
        u: "/pt_v1/memberFile/followRecordView",
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
    assessmentTaskUpdate: {
        u: "/pt_v1/assessmentTasks/update",
        m: "post"
    },
    assessmentTaskRemove: {
        u: "/pt_v1/assessmentTasks/remove",
        m: "post"
    },

    assessmentTaskSchedule: {
        u: "/pt_v1/assessmentTasks/schedule",
        m: "post"
    },
    assessmentTaskResult: {
        u: "/pt_v1/assessmentTasks/result",
        m: "post"
    },
    assessmentTaskReport: {
        u: "/pt_v1/assessmentTasks/report",
        m: "post"
    },
    assessmentTaskAnswer: {
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

export const structureApiList = {
    getStructureListByIDS: {
        u: "/pt_v1/structure/getStructureListByIDS",
        m: "post"
    },
    getStructureInfo: {
        u: "/pt_v1/structure/getStructureInfo",
        m: "post"
    },
    structureAdd: {
        u: "/pt_v1/structure/structureAdd",
        m: "post"
    },
    structureUpdate: {
        u: "/pt_v1/structure/structureUpdate",
        m: "post"
    },
    structureDelete: {
        u: "/pt_v1/structure/structureDelete",
        m: "post"
    },
    structureDownloadBatchTpl:{
        u:"/pt_v1/structure/downloadBatchTpl",
        m:"post"
    },
    structureBatchImport:{
        u:"/pt_v1/structure/batchImport",
        m:"post"
    },
    structureUpdateName: {
        u: "/pt_v1/structure/structureUpdateName",
        m: "post"
    }
}
export const adminUserRoleSettingApi = {
    getAdminUserList:{
        u:"/pt_v1/adminUserRoleSetting/getAdminUserList",
        m:"post"
    },
    getAdminUserInfo:{
        u:"/pt_v1/adminUserRoleSetting/getAdminUserInfo",
        m:"post"
    },
    adminUserAdd:{
        u:"/pt_v1/adminUserRoleSetting/adminUserAdd",
        m:"post"
    },
    adminUserUpdate:{
        u:"/pt_v1/adminUserRoleSetting/adminUserUpdate",
        m:"post"
    },
    adminUserDelete:{
        u:"/pt_v1/adminUserRoleSetting/adminUserDelete",
        m:"post"
    },
    adminUserPasswordReset:{
        u:"/pt_v1/adminUserRoleSetting/adminUserPasswordReset",
        m:"post"
    },
    setAdminUserState:{
        u:"/pt_v1/adminUserRoleSetting/setAdminUserState",
        m:"post"
    },
}

export const memberApiList = {
    getMemberGroupByStructure: {
        u: "/pt_v1/structureMember/getStructureMemberGroupByStructure",
        m: "post"
    },
    getStructureMemberList: {
        u: "/pt_v1/structureMember/getStructureMemberList",
        m: "post"
    },
    getStructureMemberInfo: {
        u: "/pt_v1/structureMember/getStructureMemberInfo",
        m: "post"
    },
    structureMemberAdd: {
        u: "/pt_v1/structureMember/structureMemberAdd",
        m: "post"
    },
    structureMemberUpdate: {
        u: "/pt_v1/structureMember/structureMemberUpdate",
        m: "post"
    },
    batchTplStructureMember: {
        u: "/pt_v1/structureMember/downloadBatchTpl",
        m: "post"
    },
    batchImportStructureMember: {
        u: "/pt_v1/structureMember/batchImport",
        m: "post"
    },

}

export const structureGroupMemberApi = {
    structureGroupList: {
        u: "/pt_v1/structureGroupMember/structureGroupList",
        m: "post"
    },
    structureGroupAdd: {
        u: "/pt_v1/structureGroupMember/structureGroupAdd",
        m: "post"
    },
    structureGroupUpdate: {
        u: "/pt_v1/structureGroupMember/structureGroupUpdate",
        m: "post"
    },
    getStructureGroupMemberList: {
        u: "/pt_v1/structureGroupMember/getStructureGroupMemberList",
        m: "post"
    },
    structureGroupMemberAdd: {
        u: "/pt_v1/structureGroupMember/structureGroupMemberAdd",
        m: "post"
    },
    structureGroupMemberUpdate: {
        u: "/pt_v1/structureGroupMember/structureGroupMemberUpdate",
        m: "post"
    },
    downloadBatchTplGroupMember: {
        u: "/pt_v1/structureGroupMember/downloadBatchTpl",
        m: "post"
    },
    batchImportGroupMember: {
        u: "/pt_v1/structureGroupMember/batchImport",
        m: "post"
    }
}

export const registerMemberApi = {
    registeredUserList: {
        u: "/pt_v1/registeredUser/registeredUserList",
        m: "post"
    },
    registeredUserView: {
        u: "/pt_v1/registeredUser/registeredUserView",
        m: "post"
    }
}


export const contentRepositoryApi = {
    contentList: {
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

export const specialLectureApi = {
    specialLectureList: {
        u: "/pt_v1/specialLecture/list",
        m: "post"
    },
    addSpecialLecture: {
        u: "/pt_v1/specialLecture/add",
        m: "post"
    },
    updateSpecialLecture: {
        u: "/pt_v1/specialLecture/update",
        m: "post"
    },
    specialLectureStatus: {
        u: "/pt_v1/specialLecture/status",
        m: "post"
    },
    specialLectureInfo: {
        u: "/pt_v1/specialLecture/Info",
        m: "post"
    },
    specialLectureOrganizeList: {
        u: "/pt_v1/specialLecture/organizationalList",
        m: "post"
    },
    specialLectureBatchQrCode: {
        u: "/pt_v1/specialLecture/batchQrCode",
        m: "post"
    },
    specialLectureCourseInfo: {
        u: "/pt_v1/specialLecture/courseInfo",
        m: "post"
    },
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
    studyTaskOrgnList: {
        u: "/pt_v1/studyTask/organizationalList",
        m: "post"
    }, 
    studyTaskBatchQrCode: {
        u: "/pt_v1/studyTask/batchQrCode",
        m: "post"
    }, 
    studyTaskCourseInfo: {
        u: "/pt_v1/studyTask/courseInfo",
        m: "post"
    }, 
    
}

export const WebApiList = {}

export default {
    ...appraisalActivityApi,
    ...AdminApi,
    ...inventoryManagementApi,
    ...studentFileApi,
    ...componentsApi,
    ...peopleManagementApi,
    ...assessmentTasksApi,
    ...pagesApi,
    ...userCenterApi,
    ...forewarningSurveyApi,
    ...structureApiList,
    ...memberApiList,
	...adminUserRoleSettingApi,
    ...contentRepositoryApi,
    ...reservationConsultationApi,
    ...psychologicalConsultantApi,
    ...manualMentalApi,
    ...subscribeApi,
    ...structureGroupMemberApi,
    ...registerMemberApi,
    ...transferCourtyardApi,
    ...zoneSetApi,
    ...specialLectureApi,
    ...studyTaskApi
};
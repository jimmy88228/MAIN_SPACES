// 请求url配置
export const apiUrl = {}

export const UserApiList = {
	businessUserLogin: {
		u: '/user/businessUserLogin',
		m: "post"
	},
	getAuthUserInfo: "/user/getAuthUserInfo",
}


export const WechatApiList = {
	login: {
		u: "/user/login",
		m: "post"
	},
	createSession: {
		u: "/wechat/createSession",
		m: "post"
	},
	createSessionV2: {
		u: "/wechat/createSessionV2",
		m: "post"
	},
	register: {
		u: "/wechat/register",
		m: "post"
	},
	getAppletCode: "/wechat/getAppletCode",
	getPhoneNumber: {
		u: '/wechat/getPhoneNumber',
		m: "post"
	},
	updateUserProfile: {
		u: "/wechat/updateUserProfile",
		m: "post"
	},
	
	uploadWxAvatarUrl: {
		u: "/wechat/uploadWxAvatarUrl",
		m: "post"
	},
	createActivityAppletCode: {
		u: "/wechat/createActivityAppletCode",
		m: "post"
	},
}

export const EduApiList = {
	getSchoolClassList: "/edu/getSchoolClassList?schoolId={schoolId}",
	getSchoolClassListWithActivity: "/edu/getSchoolClassListWithActivity?schoolId={schoolId}&activityId={activityId}&campusId={campusId}",
	getSchoolList: "/edu/getSchoolList",
	getSchoolListInfo: "/edu/getSchoolListInfo",
	getRelateStudentList: "/edu/getRelateStudentList",
	getSchoolClassInfo: "/edu/getSchoolClassInfo",
	getUserInfo: "/user/getUserInfo",
	getUserInfoByToken: "/edu/getUserInfoByToken",
	bindStudent: {
		u: "/edu/bindStudent",
		m: "post"
	},
	deleteRelateStudent: {
		u: "/edu/deleteRelateStudent",
		m: "post"
	},
	updateUserInfo: {
		u: "/wechat/updateUserInfo",
		m: "post"
	},
	bindStudentByPwd: {
		u: "/edu/bindStudentByPwd",
		m: "post"
	},
	//
	getClassInfo: "/edu/getClassInfo",
	getSchoolInfo: "/edu/getSchoolInfo",
	loginByH5: {
		u: "/edu/loginByH5",
		m: "post"
	},
	getLoginConfig: "/edu/getLoginConfig?schoolId={schoolId}",
	checkStudentByClass: {
		u: "/edu/checkStudentByClass",
		m: "post"
	},
	loginByClassH5: {
		u: "/edu/loginByClassH5",
		m: "post"
	}
}

export const EvaluateApiList = {
	getActivityBaseInfo: "/evaluate/getActivityBaseInfo",
	getActivityInfo: "/evaluate/getActivityInfo",
	getActivityList: "/evaluate/getActivityList",
	getQuestionList: "/evaluate/getQuestionList",
	getActivityListByStructure: "/evaluate/getActivityListByStructure",
	getActivityParticipation: "/evaluate/getActivityParticipations",
	submitAnswer: {
		u: "/evaluate/submitAnswer",
		m: "post"
	},
	finishSurvey: {
		u: "/evaluate/finishSurvey",
		m: "post"
	},
	updateEvaluateUsedTime: {
		u: "/evaluate/updateEvaluateUsedTime",
		m: "post"
	},
	getEvaluateRecordList: "/evaluate/getEvaluateRecordList"

}

export const pageManageApiList = {
	getGameResultPage: "/page/getGameResultPage",
	getPageDetail: "/page/getHomePage",
	getMinePageDetail: "/page/getMinePage",
	getTargetDetail: "/page/getTargetPage",
	getPsycHandbook: "/page/getPsycHandbook",
}

export const resourceApiList = {
	getArticle: "/resource/getArticle",
	getAudio: "/resource/getAudio",
	getVideo: "/resource/getVideo"
}

export const consultantApiList = {
	appointConsultant: {
		u: "/consultant/appointment/appointConsultant",
		m: "post"
	},
	selectAllConsultantService: "/consultant/appointment/selectAllConsultantService",
	selectConsultantAppointmentByPage: "/consultant/appointment/selectConsultantAppointmentByPage",
	selectSelfConsultantAppointmentByPage: "/consultant/appointment/selectSelfConsultantAppointmentByPage",
	getConsultantById: "/consultant/getConsultantById",
	selectConsultantByPage: "/consultant/selectConsultantByPage",
	getRemainingCount: "/consultant/appointment/getRemainingCount",
}
export const supervisionApiList = {
	selectSupervisorAppointmentByPage: "/supervision/selectSupervisorAppointmentByPage",
	getAllSupervisorField: "/supervision/getAllSupervisorField",
	supervisionInsert: {
		u: "/supervision/insert",
		m: "post"
	},
	submitReferral: {
		u: "/supervision/submitReferral",
		m: "post"
	},
}

export const commonApiList = {
	getSystemConfig: "/common/getSystemConfig?name={name}",
	getCustomerInfo: "/common/getCustomerInfo"
}

export const interveneApiList = {
	getAllWarningInterventionInfos: "/warning/getAllWarningInterventionInfos",
	selectCareWorkerByPage: "/warning/selectCareWorkerByPage",
	getWarningInterventionShortcutList: "/warning/getWarningInterventionShortcutList",
	submitRecord: {
		u: "/warning/submitRecord",
		m: "post"
	},
}

export const archivesApiList = {
	getPersonalInfo: "/archives/getPersonalInfo",
	getPersonalInformation: "/archives/getPersonalInformation",
	selectScaleModelByPage: "/archives/selectScaleModelByPage",
	selectWarningInterventionRecordByPage: "/archives/selectWarningInterventionRecordByPage",
	selectWarningPsychologicTrackByPage: "/archives/selectWarningPsychologicTrackByPage",
}

export const commissionerApiList = {
	getAdminStructureList: "/commissioner/getAdminStructureList",
	getActivityStructureList: "/commissioner/getActivityStructureList",
}

export const psyserviceApiList = {
	getPsyServiceStationList: "/psyservice/getPsyServiceStationList",
	getPsyServiceStationById: "/psyservice/getPsyServiceStationById"
}

export const teacherApiList = {
	bindTeacherByPhone: {
		u: "/teacher/bindTeacherByPhone",
		m: "post"
	},
	checkBindTeacher: "/teacher/checkBindTeacher",
	getActivityListByClassTeacher: "/teacher/getActivityListByClassTeacher",
	getActivityListByPsycTeacher: "/teacher/getActivityListByPsycTeacher",
	getStructureParticipations: "/teacher/getStructureParticipations",
	getWarningParticipateList: "/teacher/getWarningParticipateList",
	getClazzList: "/teacher/getClazzList",
	getWarningLevelList: "/teacher/getWarningLevelList",
	submitAudit: {
		u: "/teacher/submitAudit",
		m: "post"
	}
}

export const reportApiList = {
	// 获取报告列表
	getReportList: "/report/getReportList",
	getReportDetail: "/report/getReportDetail",
	getReportDetailByAdmin: "/report/getReportDetailByAdmin"
}

export const examApiList = {
	getAnswerCoupon: "/course/exam/getAnswerCoupon",
	getCourseExamRecordInfo: "/course/exam/getCourseExamRecordInfo",
	getExamModel: "/course/exam/getExamModel",
	getExamQuestionList: "/course/exam/getQuestionList",
	createExamRecord: {
		u: "/course/exam/createExamRecord",
		m: "post"
	},
	submitExam: {
		u: "/course/exam/submitExam",
		m: "post"
	},
	finishExam: {
		u: "/course/exam/finishExam",
		m: "post"
	}
}

export const courseApiList = {
	getCourse: "/course/getCourse",
	getCourseContent: "/course/getCourseContent",
	selectCourseListByPage: "/course/selectCourseListByPage",
	createCourseUserRecord: {
		u: "/course/createCourseUserRecord",
		m: "post"
	},
	punchCard: {
		u: "/course/punchCard",
		m: "post"
	}

}

export const classManageApiList = {
	getClazzInfo: "/classManage/getClazzInfo",
	getStudentInfo: "/classManage/getStudentInfo",
	getStudentDetail: "/classManage/getStudentDetail",
	getBindMessageList: "/classManage/getBindMessageList",
	applyBind: {
		u: "/classManage/applyBind",
		m: "post"
	},
	updateAdmin: {
		u: "/classManage/updateAdmin",
		m: "post"
	},
	updateStudentDetail: {
		u: "/classManage/updateStudentDetail",
		m: "post"
	},
	deleteParent: {
		u: "/classManage/deleteParent",
		m: "post"
	},
}

export const funTestApiList = {
	getFunTestPage: "/funtest/getFunTestPage",
	getFunTestQuestionListByPage: "/funtest/getFunTestQuestionListByPage",
	getFunTestResultPage: "/funtest/getFunTestResultPage",
	finishFunTest: {
		u: "/funtest/finishFunTest",
		m: "post"
	},
	submitFunTest: {
		u: "/funtest/submitFunTest",
		m: "post"
	},
}

export const specialSectionApiList = {
	getFunTestListByPage: "/specialSection/getFunTestListByPage",
	getSpecialSectionInfo: "/specialSection/getSpecialSectionInfo"
}

export const logApiList = {
	createLogSession: {
		u: "/log/createLogSession",
		m: "post"
	},
	uploadLogActionList: {
		u: "/log/uploadLogActionList",
		m: "post"
	},
	uploadLogVisitList: {
		u: "/log/uploadLogVisitList",
		m: "post"
	},
}

export const gameApiList = {
	getGameActivityBaseInfo: "/game/getGameActivityBaseInfo",
	getGameMainInfo: "/game/getGameMainInfo",
	getUserNickName: "/game/getUserNickName",
	selectRankingListByPage: "/game/selectRankingListByPage",
	setGameLike: {
		u: "/game/like",
		m: "post"
	},
	saveGameUserInfo: {
		u: "/game/saveGameUserInfo",
		m: "post"
	},
	submitResult: {
		u: "/game/submitResult",
		m: "post"
	},
}

export const authApiList = {
	createRsaKey: {
		u: "/auth/createRsaKey",
		m: "post"
	},
}
//
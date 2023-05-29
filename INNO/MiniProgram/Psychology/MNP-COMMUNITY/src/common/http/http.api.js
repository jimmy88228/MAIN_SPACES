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
	getSchoolClassListWithActivity: "/edu/getSchoolClassListWithActivity?activityId={activityId}&schoolId={schoolId}",
	getSchoolList: "/edu/getSchoolList",
	getRelateStudentList: "/edu/getRelateStudentList",
	getUserInfo: "/user/getUserInfo",
	getStructureWithChild: "/user/getStructureWithChild",
	getUserInfoByToken: "/edu/getUserInfoByToken",
	updateUserInfo: {
		u: "/wechat/updateUserInfo",
		m: "post"
	},
	bindStudentByPwd: {
		u: "/edu/bindStudentByPwd",
		m: "post"
	},
	getClassInfo: "/edu/getClassInfo",
	getSchoolInfo: "/edu/getSchoolInfo",
	loginByH5: {
		u: "/edu/loginByH5",
		m: "post"
	},
	// 获取报告列表
	getReportList: "/getReportList",
	getReportDetail: "/getReportDetail"
}
export const EvaluateApiList = {
	getActivityBaseInfo: "/evaluate/getActivityBaseInfo",
	getActivityInfo: "/evaluate/getActivityInfo",
	getActivityList: "/evaluate/getActivityList",
	getQuestionList: "/evaluate/getQuestionList",
	getActivityListByStructure:"/evaluate/getActivityListByStructure",
	getActivityParticipation:"/evaluate/getActivityParticipations",
	submitAnswer: {
		u: "/evaluate/submitAnswer",
		m: "post"
	},
	finishSurvey: {
		u: "/evaluate/finishSurvey",
		m: "post"
	},
	getDemographicQuestionList: "/evaluate/getDemographicQuestionList",
	submitDemographic: {
		u: "/evaluate/submitDemographic",
		m: "post"
	},
	updateEvaluateUsedTime: {
		u: "/evaluate/updateEvaluateUsedTime",
		m: "post"
	},
	getEvaluateRecordList: "/evaluate/getEvaluateRecordList"
}

export const pageManageApiList = {
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
	cancelAppoint: {
		u: "/consultant/appointment/cancelAppoint",
		m: "post"
	},
	selectAllConsultantService:"/consultant/appointment/selectAllConsultantService",
	selectAllConsultantServiceById:"/consultant/appointment/selectAllConsultantServiceById",
	selectConsultantAppointmentByPage:"/consultant/appointment/selectConsultantAppointmentByPage",
	selectSelfConsultantAppointmentByPage:"/consultant/appointment/selectSelfConsultantAppointmentByPage",
	getConsultantById:"/consultant/getConsultantById",
	selectConsultantByPage:"/consultant/selectConsultantByPage",
	getConsultantScheduleById:"/consultant/getConsultantScheduleById",
	getRemainingCount:"/consultant/appointment/getRemainingCount",
}
export const supervisionApiList = {
	selectSupervisorAppointmentByPage:"/supervision/selectSupervisorAppointmentByPage",
	getAllSupervisorField:"/supervision/getAllSupervisorField",
	supervisionInsert: {
		u: "/supervision/insert",
		m: "post"
	},
	submitReferral:{
		u:"/supervision/submitReferral",
		m:"post"
	},
}

export const commonApiList = {
	getCustomerConfig: "/common/getCustomerConfig",
	getCustomerInfo: "/common/getCustomerInfo"
}

export const interveneApiList = {
	getAllWarningInterventionInfos:"/warning/getAllWarningInterventionInfos",
	selectCareWorkerByPage:"/warning/selectCareWorkerByPage",
	getWarningInterventionShortcutList:"/warning/getWarningInterventionShortcutList",
	submitRecord:{
		u:"/warning/submitRecord",
		m:"post"
	},
} 

export const archivesApiList = {
	getPersonalInfo:"/archives/getPersonalInfo",
	getPersonalInformation:"/archives/getPersonalInformation",
	selectScaleModelByPage:"/archives/selectScaleModelByPage",
	selectWarningInterventionRecordByPage:"/archives/selectWarningInterventionRecordByPage",
	selectWarningPsychologicTrackByPage:"/archives/selectWarningPsychologicTrackByPage",
}

export const commissionerApiList = {
	getAdminStructureList:"/commissioner/getAdminStructureList",
	getActivityStructureList:"/commissioner/getActivityStructureList",
}

export const treeHoleApiList = {
	uploadText: {
		u: "/treehole/uploadText",
		m: "post"
	},
	uploadVoice: {
		u: "/treehole/uploadVoice",
		m: "post"
	},
	selectPourOutListByPage: "/treehole/selectPourOutListByPage",
	getVoice: "/treehole/getVoice",
	getHugInfo: "/treehole/getHugInfo",
}
export const psyserviceApiList = {
	getPsyServiceStationList: "/psyservice/getPsyServiceStationList",
	getPsyServiceStationById: "/psyservice/getPsyServiceStationById"
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

export const wxSubscribeApiList = {
	getWxSubMsgTplCustomerList:"/wxSubscribe/getWxSubMsgTplCustomerList",
	submitSubscribe: {
		u: "/wxSubscribe/submitSubscribe",
		m: "post"
	},
}

export const lectureApiList = {
	getLectureAnswerCoupon: "/lecture/getAnswerCoupon",
	getLectureCourseExamRecordInfo: "/lecture/getCourseExamRecordInfo",
	getLectureExamModel: "/lecture/getExamModel",
	getLectureExamQuestionList: "/lecture/getQuestionList",
	getLectureCourseContent: "/lecture/getCourseContent",
	selectLectureCourseListByPage: "/lecture/selectCourseListByPage",
	punchCardLecture: {
		u: "/lecture/punchCard",
		m: "post"
	},
	submitExamLecture: {
		u: "/lecture/submitExam",
		m: "post"
	},
	finishExamLecture: {
		u: "/lecture/finishExam",
		m: "post"
	},
	getLectureDetailInfo:"/lecture/getLectureDetailInfo",
	sign: {
		u: "/lecture/sign",
		m: "post"
	},
}

export const examApiList = {
	getAnswerCoupon: "/course/exam/getAnswerCoupon",
	getCourseExamRecordInfo: "/course/exam/getCourseExamRecordInfo",
	getExamModel: "/course/exam/getExamModel",
	getExamQuestionList: "/course/exam/getQuestionList",
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
	punchCard: {
		u: "/course/punchCard",
		m: "post"
	}

}
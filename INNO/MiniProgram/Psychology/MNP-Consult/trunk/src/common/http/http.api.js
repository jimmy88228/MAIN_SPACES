// 请求url配置
export const apiUrl = {}

export const WechatApiList = { 
	login:{
		u:"/user/login",
		m:"post"
	},
	createSession:{
		u:"/wechat/createSession",
		m:"post"
	},
	getPhoneNumber:{
		u:"/wechat/getPhoneNumber",
		m:"post"
	},
	register:{
		u:"/wechat/register",
		m:"post"
	}, 
	bindMobilePhone:{
		u:"/wechat/bindMobilePhone",
		m:"post"
	}, 
}

export const UserApiList = { 
	getUserInfo: "/user/getUserInfo",
	auditLogin: {
		u:"/user/auditLogin",
		m:"post"
	},
}

export const ConsultList = {
	getConsultantScheduleById:"/consultant/getConsultantScheduleById",
	getServiceTypeById:"/consultant/getServiceTypeById", 
	getAllSource:"/consultant/getAllSource", 
	getAppointmentRoomInfo:"/consultant/getAppointmentRoomInfo", 
	getConsultantAppointmentByPage:"/consultant/getConsultantAppointmentByPage", 
	getCurConsultantAppointmentByPage:"/consultant/getCurConsultantAppointmentByPage",
	checkRoomUserState:"/consultant/checkRoomUserState",
	changeRoomUserState:{
		u:"/consultant/changeRoomUserState",
		m:"post"
	},
	
	getTemplateTimeGroup:"/consultant/getTemplateTimeGroup",
	insertSchedule:{
		u:"/consultant/insertSchedule",
		m:"post"
	}, 
	updateServiceType:{
		u:"/consultant/updateServiceType",
		m:"post"
	},
	updateOneDaySchedule:{
		u:"/consultant/updateOneDaySchedule",
		m:"post"
	}
}

export const SupplierList = {
	getCoverInfo:"/supplier/getCoverInfo",
	getConfigValue:"/supplier/getConfigValue",
	getArticleInfo: "/supplier/getArticleInfo"
}

export const commonApiList={
	getTime:"/common/getTime",

}
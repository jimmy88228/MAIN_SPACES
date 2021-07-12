export default {
  // 基础 api
  login: '/adminAccount/getToken',
  loginInit: '/adminAccount/loginInit',
  logout: '/adminAccount/logout',
  unlock: '/adminAccount/unlock',
  sendVcode: '/adminAccount/sendVcode', // 发送找回密码的验证码
  postCode: '/adminAccount/postResetCode',
  resetPassword: '/adminAccount/reset',
  getLoginQrcode: '/adminAccount/getLoginQrcode',
  loginSSE: '/adminAccount/sse',
  ownspace: '/adminAccount/ownspace',
  ownspaceSave: '/adminAccount/ownspaceSave',
  wxbind: '/adminAccount/wxbind',
  wxbindCb: '/adminAccount/wxbindCb',
  bindEmail: '/adminAccount/bindEmail',
  sendEmailCode: '/adminAccount/sendEmailCode',
  getCaptcha: '/adminAccount/captcha',
  adminUserSetMobile: '/adminAccount/setMobile',
  adminUserSendSms: '/adminAccount/sendSms',
  sendRegisterVcode: '/adminAccount/registerVcode',
  cUserRegister: '/adminAccount/cUserRegister',
  bUserRegister: '/adminAccount/bUserRegister',
  registerResult: '/adminAccount/registerResult',
  mqProgress: '/adminAccount/mqProgress',
  jobsList: '/adminAccount/jobsList',
  
  // 公共的活动选择源
  sourceList: '/adminAccount/sourceList',
  // 主页初始化
  consoleInit: '/adminAccount/consoleInit',
  homeTables: '/adminAccount/tableData',
  registerInit: '/adminAccount/registerInit',
  // 管理员
  adminUserAdd: '/adminUser/add',
  adminUserEdit: '/adminUser/edit',
  adminUserStatus: '/adminUser/status',
  adminUserRemove: '/adminUser/remove',
  adminUserResetPassword: '/adminUser/reset',
  // 角色
  adminRoleList: '/adminRole/list',
  adminRoleEdit: '/adminRole/edit',
  adminRoleAdd: '/adminRole/add',
  adminRoleStatus: '/adminRole/status',
  
  // 管理员消息
  adminMessageList: '/adminMessage/list',
  adminMessageEdit: '/adminMessage/edit',
  adminMessageSend: '/adminMessage/send',
  adminMessageAdd: '/adminMessage/add',
  adminMessageRemove: '/adminMessage/remove',
  systemMessageList: '/adminMessage/systemMessageList',
  systemMessageEdit: '/adminMessage/systemMessageEdit',
  systemMessageSend: '/adminMessage/systemMessageSend',
  systemMessageAdd: '/adminMessage/systemMessageAdd',
  systemMessageRemove: '/adminMessage/systemMessageRemove',
  // 后台个人消息
  userMessageList: '/adminMessage/userMessageList',
  userMessageEdit: '/adminMessage/userMessageEdit',
  // 管理员操作日志
  adminLogList: '/adminLog/list'
}

export default {
  dataBoard: '/DataDashboard/DataDashboardList',
  //手动标签
  ManualLabelList: '/ManualLabel/ManualLabelList',
  ManualLabelAddGroup: '/ManualLabel/ManualLabelAddGroup',
  ManualLabelAdd: '/ManualLabel/ManualLabelAdd',
  ManualLabelEdit: '/ManualLabel/ManualLabelEdit',
  ManualLabelRemove: '/ManualLabel/ManualLabelRemove',
  ManualLabelDown: "/ManualLabel/ManualLabelDown",
  ManualLabelImport: "/ManualLabel/ManualLabelImport",
  ManualLabelUserList: "/ManualLabel/ManualLabelUserList",
  ManualLabelUserExport: "/ManualLabel/ManualLabelUserExport",
  ManualLabelUserAdd: "/ManualLabel/ManualLabelUserAdd",
  ManualLabelUserRemove: "/ManualLabel/ManualLabelUserRemove",
  ManualLabelUserSend: "/ManualLabel/ManualLabelUserSend",
  //基础标签
  BasicLabelList: '/BasicLabel/BasicLabelList', //参数  分页
  BasicLabelAddGroup: '/BasicLabel/BasicLabelAddGroup', //添加分组  参数 cat_name 分组名称
  BasicLabelAdd: '/BasicLabel/BasicLabelAdd',
  BasicLabelEdit: '/BasicLabel/BasicLabelEdit',//
  BasicLabelInfo:'/BasicLabel/BasicLabelInfo',
  BasicLabelRemove:"/BasicLabel/BasicLabelRemove", //id 
  BasicLabelStatus:"/BasicLabel/BasicLabelStatus", //参数  id  标签id      type 1是执行和开始  2是停止
  BasicLabelUserList:"/BasicLabel/BasicLabelUserList",
  BasicLabelUserExport: "/BasicLabel/BasicLabelUserExport",//
  BasicLabelUserSend: "/BasicLabel/BasicLabelUserSend",//
  //消费标签
  ConsumeLabelList: '/ConsumeLabel/ConsumeLabelList', // 参数 分页
  ConsumeLabelAddGroup: '/ConsumeLabel/ConsumeLabelAddGroup', //参数  cat_name: 分组名
  ConsumeLabelAdd: '/ConsumeLabel/ConsumeLabelAdd', //
  ConsumeLabelEdit: '/ConsumeLabel/ConsumeLabelEdit',
  ConsumeLabelInfo: '/ConsumeLabel/ConsumeLabelInfo', //id 标签id
  ConsumeLabelRemove:'/ConsumeLabel/ConsumeLabelRemove',  // id
  ConsumeLabelStatus:"/ConsumeLabel/ConsumeLabelStatus",
  ConsumeLabelUserList:'/ConsumeLabel/ConsumeLabelUserList', //tag_id 标签id pageSize page searchq  搜索值
  ConsumeLabelUserExport: '/ConsumeLabel/ConsumeLabelUserExport', //搜索参数
  ConsumeLabelUserSend: '/ConsumeLabel/ConsumeLabelUserSend', 
  //商品标签
  SaleLabelList: '/SaleLabel/SaleLabelList', //分页
  SaleLabelAddGroup: '/SaleLabel/SaleLabelAddGroup', // 参数 cat_name 分组名称
  SaleLabelAdd: '/SaleLabel/SaleLabelAdd',
  SaleLabelEdit: '/SaleLabel/SaleLabelEdit',
  SaleLabelRemove: '/SaleLabel/SaleLabelRemove',
  SaleLabelStatus:"/SaleLabel/SaleLabelStatus",
  SaleLabelInfo: '/SaleLabel/SaleLabelInfo',  //参数 id 标签数据id
  SaleLabelUserList: '/SaleLabel/SaleLabelUserList', //参数 tag_id 标签id pageSize page searchq  搜索值
  SaleLabelUserExport: '/SaleLabel/SaleLabelUserExport',
  SaleLabelUserSend:'/SaleLabel/SaleLabelUserSend', //fast_name  任务名称,fast_type 任务类型,text 发消息,coupon发优惠卷,fast_content 内容 （发优惠卷内容是选择的优惠卷id，字符串用,分割）tag_id 	标签id
  //营销标签
  MarketingLabelList:'/MarketingLabel/MarketingLabelList',
  MarketingLabelAddGroup:'/MarketingLabel/MarketingLabelAddGroup',
  MarketingLabelAdd:'/MarketingLabel/MarketingLabelAdd',
  MarketingLabelEdit:'/MarketingLabel/MarketingLabelEdit',
  MarketingLabelInfo:'/MarketingLabel/MarketingLabelInfo',
  MarketingLabelRemove:'/MarketingLabel/MarketingLabelRemove',
  MarketingLabelStatus:"/MarketingLabel/MarketingLabelStatus",
  MarketingLabelUserList:'/MarketingLabel/MarketingLabelUserList',
  MarketingLabelUserExport:'/MarketingLabel/MarketingLabelUserExport',
  MarketingLabelUserSend:'/MarketingLabel/MarketingLabelUserSend',
  //访问标签
  VisitLabelList:'/VisitLabel/VisitLabelList',
  VisitLabelAddGroup:'/VisitLabel/VisitLabelAddGroup',
  VisitLabelAdd:'/VisitLabel/VisitLabelAdd',
  VisitLabelEdit:'/VisitLabel/VisitLabelEdit',
  VisitLabelInfo:'/VisitLabel/VisitLabelInfo',
  VisitLabelRemove:'/VisitLabel/VisitLabelRemove',
  VisitLabelStatus:'/VisitLabel/VisitLabelStatus',
  VisitLabelUserList:'/VisitLabel/VisitLabelUserList',
  VisitLabelUserExport:'/VisitLabel/VisitLabelUserExport',
  VisitLabelUserSend:'/VisitLabel/VisitLabelUserSend',
  //导购标签
  ShoppingGuideLabelList:'/ShoppingGuideLabel/ShoppingGuideLabelList',
  ShoppingGuideLabelAddGroup:'/ShoppingGuideLabel/ShoppingGuideLabelAddGroup',
  ShoppingGuideLabelAdd:'/ShoppingGuideLabel/ShoppingGuideLabelAdd',
  ShoppingGuideLabelEdit:'/ShoppingGuideLabel/ShoppingGuideLabelEdit',
  ShoppingGuideLabelRemove:'/ShoppingGuideLabel/ShoppingGuideLabelRemove',
  ShoppingLabelStatus:"/ShoppingLabel/ShoppingLabelStatus",
  ShoppingGuideLabelUserList:'/ShoppingGuideLabel/ShoppingGuideLabelUserList',
  ShoppingGuideLabelUserExport:'/ShoppingGuideLabel/ShoppingGuideLabelUserExport',
  ShoppingGuideLabelUserSend:'/ShoppingGuideLabel/ShoppingGuideLabelUserSend',
  //erp标签
  ErpTagLabelList:'/ErpTagLabel/ErpTagLabelList',
  ErpTagLabelAddGroup:'/ErpTagLabel/ErpTagLabelAddGroup',
  ErpTagLabelAdd:'/ErpTagLabel/ErpTagLabelAdd',
  ErpTagLabelEdit:'/ErpTagLabel/ErpTagLabelEdit',
  ErpTagLabelRemove:'/ErpTagLabel/ErpTagLabelRemove',
  ErpTagLabelStatus:"/ErpTagLabel/ErpTagLabelStatus",
  ErpTagLabelUserList:'/ErpTagLabel/ErpTagLabelUserList',
  ErpTagLabelUserExport:'/ErpTagLabel/ErpTagLabelUserExport',
  ErpTagLabelUserSend:'/ErpTagLabel/ErpTagLabelUserSend',
  //智能营销
  OnceMarketingList: '/OnceMarketing/OnceMarketingList',
  OnceMarketingInfo: '/OnceMarketing/OnceMarketingInfo',
  OnceMarketingSendQwMsq: '/OnceMarketing/OnceMarketingSendQwMsq',
  OnceMarketingAdd: '/OnceMarketing/OnceMarketingAdd',
	OnceMarketingEdit:'/OnceMarketing/OnceMarketingEdit',
  OnceMarketingissue: '/OnceMarketing/OnceMarketingissue',
  OnceMarketingRemove: '/OnceMarketing/OnceMarketingRemove',
  CycleMarketingList: '/CycleMarketing/CycleMarketingList',
  CycleMarketingInfo: '/CycleMarketing/CycleMarketingInfo',
  CycleMarketingAdd: '/CycleMarketing/CycleMarketingAdd',
  CycleMarketingEdit: '/CycleMarketing/CycleMarketingEdit',
  CycleMarketingIssue: '/CycleMarketing/CycleMarketingIssue',
  CycleMarketingRemove: '/CycleMarketing/CycleMarketingRemove',
	CycleMarketingEdit:'/CycleMarketing/CycleMarketingEdit',
	
	//
	getRFMList:'/OnceMarketing/rfmList',
  //快捷筛选
  QuickFiltrateSearchq: '/Quick/QuickFiltrateSearchq',
  QuickFiltrateList: '/Quick/QuickFiltrateList',
  QuickFiltrateExport: '/Quick/QuickFiltrateExport',
  QuickFiltrateSendNews: '/Quick/QuickFiltrateSendNews',
  QuickFiltrateSendBouns: '/Quick/QuickFiltrateSendBouns',
  //快捷任务
  QuickTaskList: '/Quick/QuickTaskList',
  QuickTaskState: '/Quick/QuickTaskState',
  QuickTaskRemove: '/Quick/QuickTaskRemove',
	//会员分组
	BrandGroupList: '/MemberGroup/BrandGroupList',
	SystemGroupList:'/MemberGroup/SystemGroupList',
	AllGroupList:'/MemberGroup/AllGroupList',
	//
	GetMemberGroupMap:'/MemberGroup/Getmap',
	GetMemberGroupMessageurl:'/MemberGroup/Getmessageurl',
	GetMemberGroupGetall:'/MemberGroup/Getall',
	GetMemberGroupBasicsumType:'/MemberGroup/getUserBasicsumType',
	getMemberGroupRfmReportByType:'/MemberGroup/getRfmReportByType',
	//
	GetMemberGroupUserlist:'/MemberGroup/Userlist',
	GetMemberGroupRightmessage:'/MemberGroup/GetRightmessage', // type: 2: 会员等级, 3:星座, 5:生日, 8:年龄, 9: 会龄, 10:来源   ref指标
	GetMemberGroupTagMessages:'/MemberGroup/getTagMessages', // 标签系统
	GetMemberGroupCity:'/MemberGroup/Getcity', // 城市
	//
	getMemberGroupUserList:'/MemberGroup/Userlist',
	SaveMemberGroupmessage:'/MemberGroup/Savemessage', // 保存分组数据
	//RFM
	RfmStructureList:'/RfmSystem/StructureList',
	RfmStructureSave:'/RfmSystem/StructureSave',
	RfmReportList:'/RfmSystem/ReportList',
	RfmUsersList:'/RfmSystem/RfmUsersList',
	RfmGeneralList:'/RfmSystem/GeneralList',
	RfmGeneralDetailReport:'/RfmSystem/GeneralDetailReport'
	

}

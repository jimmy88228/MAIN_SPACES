export default {
	// 门店管理
	storeEdit: '/store/edit',
	storeAdd: '/store/storeAdd',
	storeEdit: '/store/storeEdit',
	storeRemove: '/store/storeRemove',
	storeChange: '/store/storeOne',
	storeInfo: '/store/storeInfo',
	storeDownload: '/store/storeDownload',
	storeImport: '/store/storeImport',
	storeExplode: '/store/storeExplode',
	storeBatchModification: '/store/storeBatchModification',
	storeWeixinQrcode: '/store/storeWeixinQrcode',
	appletQrcode: '/store/appletQrcode',
	storeReply: '/store/storeReply',
	storeCodeDown: '/store/storeCodeDown',
	storeCodeList: '/store/codelist',
	storeHomePageEdit: '/store/homePageEdit',
	storeSearchImport: '/store/storeSearchImport',
	storeSearchTpl: '/store/storeSearchTpl',


	// 导购管理
	staffList: '/staff/list',
	staffEdit: '/staff/edit',
	staffAdd: '/staff/add',
	staffRemove: '/staff/remove',
	staffTrashAction: '/staff/trashAction',
	staffStationList: '/staff/stationList',
	staffStationAdd: '/staff/stationAdd',
	staffStationEdit: '/staff/stationEdit',
	staffCodeList: '/staff/staffCodeList',
	staffReply: '/staff/staffReply',
	staffBgList: '/staff/staffBgList',
	staffBgSave: '/staff/staffBgSave',
	createStaffCode:'/staff/createCode',
	// 区域列表
	channelAreaList: '/channel/list',
	channelAdd: '/channel/add',
	channelEdit: '/channel/edit',
	channelRemove: '/channel/remove',
	shiftstorelist: '/channel/shiftstorelist',
	channelShift: '/channel/shift',
	// 导购组设置
	shopSettingList: '/shoppers/settingList',
	shopSettingAdd: '/shoppers/settingAdd',
	shopSettingEdit: '/shoppers/settingEdit',
	shopSettingRemove: '/shoppers/settingRemove',
	shopSettingImport: '/shoppers/settingImport',
	shopformBoard: '/shoppers/formBoard',
	shopSettingExport: '/shoppers/settingExport',
	shopSettingAddgroup: '/shoppers/settingAddgroup',
	shopSettingSort: '/shoppers/settingSort',
	shopSettingAddselect: '/shoppers/settingAddselect',
	shopSettingAddjoin: '/shoppers/settingAddjoin',
	shopSettingAddremove: '/shoppers/settingAddremove',
	
	// 吸粉统计报表
	fansReportList: '/shoppers/fansReportList',
	fansReportExport: '/shoppers/fansReportExport',
	// pk统计报表
	pkReportList: '/shoppers/pkReportList',
	pkReportExport: '/shoppers/pkReportExport',
	
	storeNavigationGroupList: '/storeNavigation/storeNavigationGroupList', //店铺导航分组列表 参数:分页
	storeNavigationGroupInfo: '/storeNavigation/storeNavigationGroupInfo', // 店铺导航分组列表 如果做成弹窗就不用 参数：id
	storeNavigationDistanceInfo: '/storeNavigation/storeNavigationDistanceInfo', // 店铺导航距离显示 参数：无
	storeNavigationDistanceSave: '/storeNavigation/storeNavigationDistanceSave', // 店铺导航距离显示保存  参数：showshop_dist 显示公里内的店铺 isforgotdstbysearch 允许搜索到公里数范围外的店铺
	
	storeNavigationGroupAdd: '/storeNavigation/storeNavigationGroupAdd', // 店铺导航分组 添加 参数：group_name 分组名称 is_enabled （整形） is_enabled
	storeNavigationGroupEdit: '/storeNavigation/storeNavigationGroupEdit', //店铺导航分组 编辑 参数：id (整形) group_name 分组名称 is_enabled （整形） is_enabled
	storeNavigationGroupRemove: '/storeNavigation/storeNavigationGroupRemove', //店铺导航分组 移除 参数：id (整形)
	storeNavigationGroupImport: '/storeNavigation/storeNavigationGroupImport', //
	storeNavigationGroupTpl: '/storeNavigation/storeNavigationGroupTpl', //
	storeNavigationGroupStore: '/storeNavigation/storeNavigationGroupStore', //
	storeNavigationGroupStoreRemove: '/storeNavigation/storeNavigationGroupStoreRemove', //
	storeNavigationGroupStoreBatch: '/storeNavigation/storeNavigationGroupStoreBatch', //
	
	//首页分组
	storeIndexGroupList: 'storeIndex/storeIndexGroupList',//店铺首页分组列表 参数:分页
	storeIndexGroupAdd: 'storeIndex/storeIndexGroupAdd',//店铺首页分组 添加 参数：name 分组名称 is_enabled （整形） page_id 自定义页id
	storeIndexGroupEdit: 'storeIndex/storeIndexGroupEdit',//店铺首页分组 编辑 参数：id (整形) name 分组名称 is_enabled （整形） page_id 自定义页id
	storeIndexGroupRemove: 'storeIndex/storeIndexGroupRemove',//店铺首页分组 移除 参数：id (整形)
	storeIndexGroupImport:'storeIndex/storeIndexGroupImport',//店铺导入 参数 file 文件 id
	storeIndexGroupTpl:'storeIndex/storeIndexGroupTpl',//店铺导入模板
	storeIndexGroupStore:'storeIndex/storeIndexGroupStore',//店铺列表 参数 id  searchq 搜索值
	storeIndexGroupStoreRemove:'storeIndex/storeIndexGroupStoreRemove',//店铺移除 id 店铺列表ID group_id 分组ID
	storeIndexGroupStoreBatch: 'storeIndex/storeIndexGroupStoreBatch',//批量操作 ids 店铺列表ID集合 group_id 分组ID shift_group_id 转移的分组ID（type为1时必传） type 1 为转移 2为移除

    /*自提商品分组*/
    pickupGoodsGroupList: '/pickupGoods/pickupGoodsGroupList',
    pickupGoodsGroupMsg: '/pickupGoods/pickupGoodsGroupMessage',
    pickupStoreDownload: '/pickupGoods/storeDownload',//门店模板下载
    pickupGoodsDownload: '/pickupGoods/goodsDownload',//商品模板下载
    pickupStoreGoodsUpload: '/pickupGoods/storeGoodsUpload',
    pickupGroupStoreRemove: '/pickupGoods/pickupGroupStoreRemove', //删除分组
    groupStoreList: '/pickupGoods/groupStoreList',//获取门店列表数据
    groupStoreRemove: '/pickupGoods/groupStoreRemove', //删除店铺数据
    groupGoodsList: '/pickupGoods/groupGoodsList',//获取商品列表数据
    groupGoodsRemove: '/pickupGoods/groupGoodsRemove', //删除商品数据

    pickupGoodsGroupInfo: '/pickupGoods/pickupGoodsGroupInfo',
    pickupGoodsDistanceInfo: '/pickupGoods/pickupGoodsDistanceInfo',
    pickupGoodsDistanceSave: '/pickupGoods/pickupGoodsDistanceSave',
    pickupGoodsGroupAdd: '/pickupGoods/pickupGoodsGroupAdd',
    pickupGoodsGroupEdit: '/pickupGoods/pickupGoodsGroupEdit',
}

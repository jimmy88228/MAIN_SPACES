// api: 接口, title: 弹框标题
export default {
  store: {
    api: 'storeList',
    title: '选择门店'
  },
  adminstor: {
    api: 'adminUserList',
    title: '选择管理员'
  },
  user: {
    api: 'userList',
    title: '选择会员'
  },
  goods: {
    api: 'goodsList',
    title: '选择商品'
  },
  'cloud-goods': {
    api: 'ShopGoodsList',
    title: '选择商品'
  },
  'full-reduction-goods': {
    api: 'goodsList',
    title: '选择满减商品'
  },
  protocol: {
    api: 'protocolArticleList',
    title: '选择协议'
  },
  staff: {
    api: 'staffList',
    title: '选择店员'
  },
  brand: {
    api: 'goodsBrandList',
    title: '选择品牌'
  },
  article: {
    api: 'articleList',
    title: '选择试题'
  },
  pages: {
    api: 'customPagesList',
    title: '选择自定义页'
  },
  group: {
    api: 'weChatGroup',
    title: '微信群选择'
  },
  tag: {
    api: 'selectTab',
    title: '选择标签'
  },
  coupon: {
    api: 'couponsList',
    title: '选择优惠券'
  },
  gift: {
    api: 'sendGift',
    title: '选择赠品'
  },
  pin: {
    api: 'GroupActivityList',
    title: '选择拼团商品'
  },
  lottery: {
    api: 'lotteryActivityList',
    title: '选择抽奖活动'
  },
  presale: {
    api: 'presaleActivityList',
    title: '选择预售活动'
  },
  limit: {
    api: 'timeLimitActivityList',
    title: '选择限时特惠活动'
  },
  seckill: {
    api: 'seckillActivityList',
    title: '选择秒杀活动'
  },
  imagetext: {
    api: '',
    title: '选择图文'
  },
  subbrand:{
    api:'GetSubBrandList',
    title: '选择品牌'
  },
  catTree: {
    api: 'catTree',
    title: '选择标准分类'
  },
  vcatTree: {
    api: 'vcatTree',
    title: '选择自定义分类'
  },
  size: {
    api: 'SaleLabelGoodsSize',
    title: '选择商品颜色'
  },
  color: {
    api: 'SaleLabelGoodsColor',
    title: '选择商品尺码'
  },
  distributionStaff: {
    api: 'distributionSearchqStaffs',
    title: '分销员列表'
  },
  redPacket: {
    api: 'redPacketList',
    title: '选择红包'
  },
  userRank: {
    api: 'userRankElementData',
    title: '选择会员等级'
  },
	
  userbrand: {
	  api: 'marketBrandList',
	  title: '品牌分组'
  },
  usersystem: {
		api: 'marketBrandList',
		title: '品牌分组'
  },
	'goods-brand':{
		api: 'goodsBrandList',
		title: '选择品牌'
	},
  'brand-goods': {
    api: 'brandGoodsSyncGoodsList',
    title: '选择父级品牌商品'
  },
	// matrix
	'matrix-coupon': {
		api: 'MatrixBonusElement',
		title: '选择优惠券'
	},
	'matrix-gift': {
		api: 'MatrixGoodsElement',
		title: '选择商品'
	}
}

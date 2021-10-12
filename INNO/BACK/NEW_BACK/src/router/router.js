import Main from '@/views/Main.vue';

/**
 * 路由配置参数说明
 * meta.title 是浏览器title 显示
 * title 是面包屑名称显示
 */
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
	path: '/login',
	name: 'login',
	meta: {
		title: '用户登录'
	},
	title: '用户登录',
	component: () => import('@/views/login/login.vue')
};

export const page404 = {
	path: '/*',
	name: 'error-404',
	meta: {
		title: '404-页面不存在'
	},
	title: '404-页面不存在',
	component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
	path: '/403',
	name: 'error-403',
	meta: {
		title: '403-权限不足'
	},
	title: '403-权限不足',
	component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
	path: '/500',
	name: 'error-500',
	meta: {
		title: '500-服务端错误'
	},
	title: '500-服务端错误',
	component: () => import('@/views/error-page/500.vue')
};

// 锁屏
export const locking = {
	path: '/locking',
	name: 'locking',
	meta: {
		title: '锁屏'
	},
	title: '锁屏',
	component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
	path: '/',
	name: 'otherRouter',
	redirect: '/home',
	component: Main,
	children: [{
		path: 'home',
		meta: {
			title: '主页'
		},
		title: '主页',
		name: 'home_index',
		component: () => import('@/views/home/home.vue')
	}]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里 [后台主要的菜单树]
export const appRouter = [
	// 错误页面
	{
		path: '/error-page',
		icon: 'android-sad',
		title: '错误页面',
		name: 'errorpage',
		component: Main,
		children: [{
			path: 'index',
			meta: {
				title: '错误页面'
			},
			title: '错误页面',
			name: 'errorpage_index',
			component: () => import('@/views/error-page/error-page.vue')
		}]
	},
	// 下面是新增的路由(菜单的循序要和后台的配置一样)
	// 单层路由,不带main 的就不再后台的主frame 内嵌，而是独立页

	// 登陆中
	{
		path: '/login/:code',
		icon: '',
		meta: {
			title: '登录中'
		},
		title: '登录中',
		name: 'login-code',
		component: () => import('@/views/login/login_by_token.vue')
	},
	// 忘记密码
	{
		path: '/forget-password',
		icon: '',
		meta: {
			title: '忘记密码'
		},
		title: '忘记密码',
		name: 'forget-password',
		component: () => import('@/views/login/forget-password.vue')
	},
	// 用户注册
	{
		path: '/register',
		icon: '',
		meta: {
			title: '用户注册'
		},
		title: '用户注册',
		name: 'register',
		component: () => import('@/views/login/register-switch.vue')
	},
	// 个人用户注册
	{
		path: '/register-personal-user',
		icon: '',
		meta: {
			title: '个人用户注册'
		},
		title: '个人用户注册',
		name: 'register-personal-user',
		component: () => import('@/views/login/register-cuser.vue')
	},
	// 企业用户注册
	{
		path: '/register-enterprise-user',
		icon: '',
		meta: {
			title: '企业用户注册'
		},
		title: '企业用户注册',
		name: 'register-enterprise-user',
		component: () => import('@/views/login/register-buser.vue')
	},
	// 品牌审核结果
	{
		path: '/register-result',
		icon: '',
		meta: {
			title: '品牌审核结果'
		},
		title: '品牌审核结果',
		name: 'register-result',
		component: () => import('@/views/login/register-result.vue')
	},
	// 多层路由
	// 管理员
	{
		path: '/admin-user',
		icon: '',
		title: '管理员',
		name: 'admin-user',
		component: Main,
		children: [{
				path: 'admin-list',
				icon: '',
				name: 'admin-list',
				meta: {
					title: '管理员列表'
				},
				title: '管理员列表',
				component: () => import('@/views/admin-user/admin-list/admin-list.vue')
			},
			{
				path: 'organize-list',
				icon: '',
				name: 'organize-list',
				meta: {
					title: '组织架构管理'
				},
				title: '组织架构管理',
				component: () => import('@/views/admin-user/organize-list/organize-list.vue')
			},
			{
				path: 'role-list',
				icon: '',
				name: 'role-list',
				meta: {
					title: '角色权限'
				},
				title: '角色权限',
				component: () => import('@/views/admin-user/role-list/role-list.vue')
			},
			{
				path: 'log-list',
				icon: '',
				name: 'log-list',
				meta: {
					title: '操作日志'
				},
				title: '操作日志',
				component: () => import('@/views/admin-user/log-list/log-list.vue')
			},
			{
				path: 'admin-message',
				icon: '',
				name: 'admin-message',
				meta: {
					title: '管理员站内消息'
				},
				title: '管理员站内消息',
				component: () => import('@/views/admin-user/admin-message/admin-message.vue')
			}
		]
	},
	// 会员管理
	{
		path: '/user',
		icon: '',
		title: '会员管理',
		name: 'user',
		component: Main,
		children: [{
				path: 'user-list',
				icon: '',
				name: 'user-list',
				meta: {
					title: '会员列表',
					groups: 'user'
				},
				title: '会员列表',
				component: () => import('@/views/user/user-list/user-list.vue')
			},
			{
				path: 'membership',
				icon: '',
				name: 'membership',
				meta: {
					title: '会员归属'
				},
				title: '会员归属',
				component: () => import('@/views/user/user-ship/user-ship.vue')
			},
			{
				path: 'user-view/:id',
				props: true,
				icon: '',
				name: 'user-view',
				meta: {
					title: '会员详情',
					groups: 'user'
				},
				title: '会员详情',
				component: () => import('@/views/user/user-list/user-form.vue')
			},
			{
				path: 'user-log',
				icon: '',
				name: 'user-log',
				meta: {
					title: '会员操作日志'
				},
				title: '会员操作日志',
				component: () => import('@/views/user/user-log/user-log.vue')
			},
			{
				path: 'user-message',
				icon: '',
				name: 'user-message',
				meta: {
					title: '会员消息'
				},
				title: '会员消息',
				component: () => import('@/views/user/user-message/user-message.vue')
			},
			{
				path: 'user-rank',
				icon: '',
				name: 'user-rank',
				meta: {
					title: '用户等级'
				},
				title: '用户等级',
				component: () => import('@/views/user/user-level/user-level-list.vue')
			},
			{
				path: 'user-level-create',
				name: 'user-level-create',
				meta: {
					title: '会员等级创建'
				},
				title: '会员等级创建',
				component: () => import('@/views/user/user-level/user-level-form.vue')
			},
			{
				path: 'user-level-edit/:id',
				props: true,
				name: 'user-level-edit',
				meta: {
					title: '会员等级编辑'
				},
				title: '会员等级编辑',
				component: () => import('@/views/user/user-level/user-level-form.vue')
			},
			{
				path: 'protocol-agreement',
				name: 'protocol-agreement',
				meta: {
					title: '协议及注册'
				},
				title: '协议及注册',
				component: () => import('@/views/user/agreement/index.vue')
			},
			{
				path: 'protocol-article',
				name: 'protocol-article',
				meta: {
					title: '协议文章管理'
				},
				title: '协议文章管理',
				component: () => import('@/views/user/article-protocol/article-list.vue')
			},
			{
				path: 'protocol-article-add',
				name: 'protocol-article-add',
				meta: {
					title: '协议文章创建'
				},
				title: '协议文章创建',
				component: () => import('@/views/user/article-protocol/article-form.vue')
			},
			{
				path: 'protocol-article-edit/:id',
				props: true,
				name: 'protocol-article-edit',
				meta: {
					title: '协议文章编辑'
				},
				title: '协议文章编辑',
				component: () => import('@/views/user/article-protocol/article-form.vue')
			},
			{
				path: 'protocol-editInfopage',
				name: 'protocol-editInfopage',
				meta: {
					title: '个人资料自定义'
				},
				title: '个人资料自定义',
				component: () => import('@/views/user/user-info-setting/index.vue')
			},
			{
				path: 'userbarcode-bgList',
				name: 'userbarcode-bgList',
				meta: {
					title: '我的二维码设置'
				},
				title: '我的二维码设置',
				component: () => import('@/views/user/qrcode-setting/index.vue')
			},
			{
				path: 'resetMember',
				name: 'resetMember',
				meta: {
					title: '重置会员'
				},
				title: '重置会员',
				component: () => import('@/views/user/reset-user/index.vue')
			},
			{
				path: 'credits',
				icon: '',
				name: 'credits',
				meta: {
					title: '成长值设置'
				},
				title: '成长值设置',
				component: () => import('@/views/user/credits/credits.vue')
			},
			{
				path: 'integral',
				icon: '',
				name: 'integral',
				meta: {
					title: '积分设置'
				},
				title: '积分设置',
				component: () => import('@/views/user/integral/integral.vue')
			},
			{
				path: 'coin',
				icon: '',
				name: 'coin',
				meta: {
					title: '虚拟币设置'
				},
				title: '虚拟币设置',
				component: () => import('@/views/user/coin/coin.vue')
			}
		]
	},
	// 云店
	{
		path: '/cloud-shop',
		icon: '',
		title: '云店',
		name: 'cloud-shop',
		component: Main,
		children: [{
				path: 'shop-goods-list',
				icon: '',
				name: 'shop-goods-list',
				meta: {
					title: '商品管理'
				},
				title: '商品管理',
				component: () => import('@/views/cloud-shop/shop-goods/goods-list/goods-list.vue')
			},
			{
				path: 'shop-goods-create',
				icon: '',
				name: 'shop-goods-create',
				meta: {
					title: '发布商品'
				},
				title: '发布商品',
				component: () => import('@/views/cloud-shop/shop-goods/goods-list/goods-editor.vue')
			},
			{
				path: 'shop-goods-edit/:id',
				icon: '',
				name: 'shop-goods-edit',
				meta: {
					title: '编辑商品'
				},
				title: '编辑商品',
				component: () => import('@/views/cloud-shop/shop-goods/goods-list/goods-editor.vue')
			},
			{
				path: 'shop-goods-cat',
				icon: '',
				name: 'shop-goods-cat',
				meta: {
					title: '商品分类'
				},
				title: '商品分类',
				component: () => import('@/views/cloud-shop/shop-goods/goods-cat/goods-all-cat.vue')
			},
			{
				path: 'shop-goods-allocation/:type',
				props: true,
				icon: '',
				name: 'shop-goods-allocation',
				meta: {
					title: '转移商品分类'
				},
				title: '转移商品分类',
				component: () => import('@/views/cloud-shop/shop-goods/goods-cat/goods-allocation.vue')
			},
			{
				path: 'shop-goods-distribute/:data',
				props: true,
				icon: '',
				name: 'shop-goods-distribute',
				meta: {
					title: '快速分配商品分类'
				},
				title: '快速分配商品分类',
				component: () => import('@/views/cloud-shop/shop-goods/goods-cat/goods-distribute.vue')
			},
			{
				path: 'shop-spec-list',
				icon: '',
				name: 'shop-spec-list',
				meta: {
					title: '规格管理'
				},
				title: '规格管理',
				component: () => import('@/views/cloud-shop/shop-goods/goods-spec/goods-spec.vue')
			},
			{
				path: 'shop-color-spec-list/:id',
				props: true,
				icon: '',
				name: 'shop-color-spec-list',
				meta: {
					title: '颜色规格管理'
				},
				title: '颜色规格管理',
				component: () => import('@/views/cloud-shop/shop-goods/goods-spec/color-norms/color-spec-list.vue')
			},
			{
				path: 'shop-size-spec-list/:id',
				props: true,
				icon: '',
				name: 'shop-size-spec-list',
				meta: {
					title: '尺寸规格管理'
				},
				title: '尺寸规格管理',
				component: () => import('@/views/cloud-shop/shop-goods/goods-spec/size-norms/size-spec-list.vue')
			},
			{
				path: 'shop-attr-list',
				icon: '',
				name: 'shop-attr-list',
				meta: {
					title: '属性管理'
				},
				title: '属性管理',
				component: () => import('@/views/cloud-shop/shop-goods/goods-attr/attr-list.vue')
			},
			{
				path: 'shop-attr-value-list/:id',
				props: true,
				icon: '',
				name: 'shop-attr-value-list',
				meta: {
					title: '属性值管理'
				},
				title: '属性值管理',
				component: () => import('@/views/cloud-shop/shop-goods/goods-attr/attr-value-list/attr-value-list.vue')
			},
			{
				path: 'shop-goods-Tag',
				icon: '',
				name: 'shop-goods-Tag',
				meta: {
					title: '商品标签'
				},
				title: '商品标签',
				component: () => import('@/views/cloud-shop/shop-goods/goods-tag/goods-tag-list.vue')
			},
			{
				path: 'shop-goods-tag-link/:id',
				props: true,
				icon: '',
				name: 'shop-goods-tag-link',
				meta: {
					title: '商品标签商品',
					groups: 'goods-Tag'
				},
				title: '商品标签商品',
				component: () => import('@/views/cloud-shop/shop-goods/goods-tag/goods-list/goods-list.vue')
			},
			{
				path: 'shop-goods-brand',
				icon: '',
				name: 'shop-goods-brand',
				meta: {
					title: '商品品牌'
				},
				title: '商品品牌',
				component: () => import('@/views/cloud-shop/shop-goods/goods-brand/brand-list.vue')
			},
			{
				path: 'shop-goods-service',
				icon: '',
				name: 'shop-goods-service',
				meta: {
					title: '商品服务'
				},
				title: '商品服务',
				component: () => import('@/views/cloud-shop/shop-goods/goods-service/service-list.vue')
			},
			{
				path: 'shop-goods-log/:id?',
				props: true,
				icon: '',
				name: 'shop-goods-log',
				meta: {
					title: '商品修改日志',
				},
				title: '商品修改日志',
				component: () => import('@/views/cloud-shop/shop-goods/goods-log/log-list.vue')
			},
			{
				path: 'shop-goods-export',
				icon: '',
				name: 'shop-goods-export',
				meta: {
					title: '商品批量处理'
				},
				title: '商品批量处理',
				component: () => import('@/views/cloud-shop/shop-goods/goods-export/goods-export.vue')
			},
			{
				path: 'shop-goods-push',
				icon: '',
				name: 'shop-goods-push',
				meta: {
					title: '商品下发'
				},
				title: '商品下发',
				component: () => import('@/views/cloud-shop/shop-goods/goods-push/goods-push.vue')
			},
			{
				path: 'shop-goods-push-add',
				icon: '',
				name: 'shop-goods-push-add',
				meta: {
					title: '商品下发创建任务'
				},
				title: '商品下发创建任务',
				component: () => import('@/views/cloud-shop/shop-goods/goods-push/goods-push-form.vue')
			},
			{
				path: 'shop-goods-push-edit/:id',
				props: true,
				icon: '',
				name: 'shop-goods-push-edit',
				meta: {
					title: '商品下发查看'
				},
				title: '商品下发查看',
				component: () => import('@/views/cloud-shop/shop-goods/goods-push/goods-push-form.vue')
			},
			{
				path: 'shop-goods-push-log/:id',
				props: true,
				icon: '',
				name: 'shop-goods-push-log',
				meta: {
					title: '商品下发日志'
				},
				title: '商品下发日志',
				component: () => import('@/views/cloud-shop/shop-goods/goods-push/log/log-list.vue')
			},
			// shop-goods-push 商品下发
			{
				path: 'store-goods-list',
				icon: '',
				name: 'store-goods-list',
				meta: {
					title: '店铺商品列表',
					groups: 'goods-list'
				},
				title: '店铺商品列表',
				component: () => import('@/views/cloud-shop/store-goods/goods-list/goods-list.vue')
			},
			{
				path: 'store-goods-info/:id',
				props: true,
				icon: '',
				name: 'store-goods-info',
				meta: {
					title: '店铺商品详情'
				},
				title: '店铺商品详情',
				component: () => import('@/views/cloud-shop/store-goods/goods-list/goods-editor.vue')
			},
			{
				path: 'shop-order-list/:userId?',
				props: true,
				icon: '',
				name: 'shop-order-list',
				meta: {
					title: '订单列表'
				},
				title: '订单列表',
				component: () => import('@/views/cloud-shop/shop-order/order-list/order-list.vue')
			},
			{
				path: 'shop-order-info/:sn',
				props: true,
				name: 'shop-order-info',
				meta: {
					title: '订单详情'
				},
				title: '订单详情',
				component: () => import('@/views/cloud-shop/shop-order/order-info/order-info.vue')
			},
			{
				path: 'shop-return-order-list',
				icon: '',
				name: 'shop-return-order-list',
				meta: {
					title: '退货单列表'
				},
				title: '退货单列表',
				component: () => import('@/views/cloud-shop/shop-order/return-order-list/return-order-list.vue')
			},
			{
				path: 'shop-return-order-info/:sn',
				props: true,
				icon: '',
				name: 'shop-return-order-info',
				meta: {
					title: '退货单详情'
				},
				title: '退货单详情',
				component: () => import('@/views/cloud-shop/shop-order/return-order-info/return-order-info.vue')
			},
			{
				path: 'shop-delivery-order-list/:sn?',
				props: true,
				icon: '',
				name: 'shop-delivery-order-list',
				meta: {
					title: '发货单列表'
				},
				title: '发货单列表',
				component: () => import('@/views/cloud-shop/shop-order/delivery-order-list/delivery-order-list.vue')
			},
			{
				path: 'shop-delivery-order-info/:sn',
				props: true,
				name: 'shop-delivery-order-info',
				meta: {
					title: '发货单详情'
				},
				title: '发货单详情',
				component: () => import('@/views/cloud-shop/shop-order/delivery-order-info/delivery-order-info.vue')
			},
			{
			 	path: 'shop-ship-order-info/:sn',
			 	props: true,
			 	name: 'shop-ship-order-info',
				meta: {
					title: '生成发货单详情'
			 	},
			 	title: '生成发货单详情',
			 	component: () => import('@/views/cloud-shop/shop-order/ship-order-info/ship-order-info.vue')
			},
			{
				path: 'shop-return-money-list',
				icon: '',
				name: 'shop-return-money-list',
				meta: {
					title: '退款单列表'
				},
				title: '退款单列表',
				component: () => import('@/views/cloud-shop/shop-order/refund-list/refund-list.vue')
			},
			{
				path: 'shop-refund-info/:sn',
				props: true,
				name: 'shop-refund-info',
				meta: {
					title: '退款单详情'
				},
				title: '退款单详情',
				component: () => import('@/views/cloud-shop/shop-order/refund-info/refund-info.vue')
			},
			{
				path: 'shop-exchange-goods-list',
				icon: '',
				name: 'shop-exchange-goods-list',
				meta: {
					title: '换货单列表'
				},
				title: '换货单列表',
				component: () => import('@/views/cloud-shop/shop-order/exchange-goods-list/exchange-goods-list.vue')
			},
			{
				path: 'shop-exchange-info/:sn',
				props: true,
				name: 'shop-exchange-info',
				meta: {
					title: '换货单详情'
				},
				title: '换货单详情',
				component: () => import('@/views/cloud-shop/shop-order/exchange-info/exchange-info.vue')
			},
			{
				path: 'shop-recycle-bin-list',
				icon: '',
				name: 'shop-recycle-bin-list',
				meta: {
					title: '回收站列表'
				},
				title: '回收站列表',
				component: () => import('@/views/cloud-shop/shop-order/recycle-bin-list/recycle-bin-list.vue')
			},
			{
				path: 'shop-recycle-info/:sn',
				props: true,
				name: 'shop-recycle-info',
				meta: {
					title: '回收站详情'
				},
				title: '回收站详情',
				component: () => import('@/views/cloud-shop/shop-order/recycle-info/recycle-info.vue')
			},
			{
				path: 'cloud-shop-settings',
				props: true,
				name: 'cloud-shop-settings',
				meta: {
					title: '进店规则设置'
				},
				title: '进店规则设置',
				component: () => import('@/views/cloud-shop/settings/cloud-shop-settings.vue')
			},
			// 云店微页面
			{
				path: 'cloud-goods-page',
				icon: '',
				name: 'cloud-goods-page',
				meta: {
					title: '微页面'
				},
				title: '微页面',
				component: () => import('@/views/cloud-shop/pages/page-list.vue')
			},
			{
				path: 'cloud-goods-page-cat',
				icon: '',
				name: 'cloud-goods-page-cat',
				meta: {
					title: '微页面分类',
				},
				title: '微页面分类',
				component: () => import('@/views/cloud-shop/pages/page-cat-list.vue')
			},
			{
				path: 'cloud-page-store-list',
				icon: '',
				name: 'cloud-page-store-list',
				meta: {
					title: '微页面关联店铺列表',
				},
				title: '微页面关联店铺列表',
				component: () => import('@/views/cloud-shop/pages/page-store-list.vue')
			},
			{
				path: 'cloud-user-center',
				icon: '',
				name: 'cloud-user-center',
				meta: {
					title: '云店个人中心'
				},
				title: '云店个人中心',
				component: () => import('@/views/cloud-shop/settings/weapp-user-center.vue')
			},
			{
				path: 'cloud-goods-cat-page',
				icon: '',
				name: 'cloud-goods-cat-page',
				meta: {
					title: '云店商品类目页面设置'
				},
				title: '云店商品类目页面设置',
				component: () => import('@/views/cloud-shop/settings/goods-cat-page.vue')
			},
			{
				path: 'cloud-comment-list',
				icon: '',
				name: 'cloud-comment-list',
				meta: {
					title: '商品评论'
				},
				title: '商品评论',
				component: () => import('@/views/cloud-shop/goods-comment/goods-comment-list.vue')
			},
			{
				path: 'cloud-comment-setting',
				icon: '',
				name: 'cloud-comment-setting',
				meta: {
					title: '评论设置'
				},
				title: '评论设置',
				component: () => import('@/views/cloud-shop/goods-comment/comment-setting.vue')
			},
			// 满减组件
			{
				path: 'full-reduction-list',
				icon: '',
				name: 'cloud-full-reduction-list',
				meta: {
					title: '满减活动'
				},
				title: '满减活动',
				component: () => import('@/views/cloud-shop/plugins/full-reduction/full-reduction-list.vue')
			},
			{
				path: 'full-reduction-add',
				icon: '',
				name: 'cloud-full-reduction-add',
				meta: {
					title: '满减活动创建'
				},
				title: '满减活动创建',
				component: () => import('@/views/cloud-shop/plugins/full-reduction/activity/full-reduction.vue')
			},
			{
				path: 'full-reduction-edit/:id',
				props: true,
				icon: '',
				name: 'cloud-full-reduction-edit',
				meta: {
					title: '满减活动编辑'
				},
				title: '满减活动编辑',
				component: () => import('@/views/cloud-shop/plugins/full-reduction/activity/full-reduction.vue')
			},
			{
				path: 'full-numbers-add',
				icon: '',
				name: 'cloud-full-numbers-add',
				meta: {
					title: '满件活动创建'
				},
				title: '满件活动创建',
				component: () => import('@/views/cloud-shop/plugins/full-reduction/activity/full-reduction.vue')
			},
			{
				path: 'full-numbers-edit/:id',
				props: true,
				icon: '',
				name: 'cloud-full-numbers-edit',
				meta: {
					title: '满件活动编辑'
				},
				title: '满件活动编辑',
				component: () => import('@/views/cloud-shop/plugins/full-reduction/activity/full-reduction.vue')
			},
			{
				path: 'cloud-full-reduction-store-list/:id',
				props: true,
				icon: '',
				name: 'cloud-full-reduction-store-list',
				meta: {
					title: '活动关联门店'
				},
				title: '活动关联门店',
				component: () => import('@/views/cloud-shop/plugins/full-reduction/full-reduction-store-list.vue')
			},
			{
				path: 'cloud-goods-coupons-activity',
				icon: '',
				name: 'cloud-goods-coupons-activity',
				meta: {
					title: '单品领券活动'
				},
				title: '单品领券活动',
				component: () => import('@/views/cloud-shop/plugins/shop-activity/goods-coupons/goods-coupons-activity.vue')
			},
			{
				path: 'cloud-goods-coupons-activity-add',
				icon: '',
				name: 'cloud-goods-coupons-activity-add',
				meta: {
					title: '单品领券活动创建'
				},
				title: '单品领券活动创建',
				component: () => import('@/views/cloud-shop/plugins/shop-activity/goods-coupons/goods-coupons-form.vue')
			},
			{
				path: 'cloud-goods-coupons-activity-edit/:id',
				props: true,
				icon: '',
				name: 'cloud-goods-coupons-activity-edit',
				meta: {
					title: '单品领券活动编辑'
				},
				title: '单品领券活动编辑',
				component: () => import('@/views/cloud-shop/plugins/shop-activity/goods-coupons/goods-coupons-form.vue')
			},
			{
				path: 'cloud-goods-coupons-activity-goods/:id',
				props: true,
				icon: '',
				name: 'cloud-goods-coupons-activity-goods',
				meta: {
					title: '绑定商品'
				},
				title: '绑定商品',
				component: () => import('@/views/cloud-shop/plugins/shop-activity/goods-coupons/binding/binding-goods.vue')
			},
			{
				path: 'cloud-goods-recommend-list',
				icon: '',
				name: 'cloud-goods-recommend-list',
				meta: {
					title: '单品推荐活动'
				},
				title: '单品推荐活动',
				component: () => import('@/views/cloud-shop/plugins/shop-activity/goods-recommend/goods-recommend-activity.vue')
			},
			{
				path: 'cloud-goods-recommend-add',
				icon: '',
				name: 'cloud-goods-recommend-add',
				meta: {
					title: '单品推荐活动创建'
				},
				title: '单品推荐活动创建',
				component: () => import('@/views/cloud-shop/plugins/shop-activity/goods-recommend/goods-recommend-form.vue')
			},
			{
				path: 'cloud-goods-recommend-edit/:id',
				props: true,
				icon: '',
				name: 'cloud-goods-recommend-edit',
				meta: {
					title: '单品推荐活动编辑'
				},
				title: '单品推荐活动编辑',
				component: () => import('@/views/cloud-shop/plugins/shop-activity/goods-recommend/goods-recommend-form.vue')
			},
			{
				path: 'cloud-goods-recommend-activity-goods/:id',
				props: true,
				icon: '',
				name: 'cloud-goods-recommend-activity-goods',
				meta: {
					title: '单品推荐活动绑定商品'
				},
				title: '单品推荐活动绑定商品',
				component: () => import('@/views/cloud-shop/plugins/shop-activity/goods-recommend/binding/binding-goods.vue')
			},
			// 弹窗广告
			{
				path: 'cloud-popup-advert-list',
				props: true,
				icon: '',
				name: 'cloud-popup-advert-list',
				meta: {
					title: '弹窗广告'
				},
				title: '弹窗广告',
				component: () => import('@/views/cloud-shop/plugins/popup-advert/popup-advert-list.vue')
			},
			{
				path: 'cloud-popup-activity-add',
				props: true,
				icon: '',
				name: 'cloud-popup-activity-add',
				meta: {
					title: '弹窗广告活动创建'
				},
				title: '弹窗广告活动创建',
				component: () => import('@/views/cloud-shop/plugins/popup-advert/activity/activity-form.vue')
			},
			{
				path: 'cloud-popup-activity-edit/:id',
				props: true,
				icon: '',
				name: 'cloud-popup-activity-edit',
				meta: {
					title: '弹窗广告活动编辑'
				},
				title: '弹窗广告活动编辑',
				component: () => import('@/views/cloud-shop/plugins/popup-advert/activity/activity-form.vue')
			},
			{
				path: 'cloud-popup-activity-store-list/:id',
				props: true,
				icon: '',
				name: 'cloud-popup-activity-store-list',
				meta: {
					title: '活动关联门店'
				},
				title: '活动关联门店',
				component: () => import('@/views/cloud-shop/plugins/popup-advert/activity/store-list.vue')
			},
			{
				path: 'cloud-popup-assets-add',
				icon: '',
				name: 'cloud-popup-assets-add',
				meta: {
					title: '资产提醒活动创建'
				},
				title: '资产提醒活动创建',
				component: () => import('@/views/cloud-shop/plugins/popup-advert/assets/assets-form.vue')
			},
			{
				path: 'cloud-popup-assets-edit/:id',
				props: true,
				icon: '',
				name: 'cloud-popup-assets-edit',
				meta: {
					title: '资产提醒活动编辑'
				},
				title: '资产提醒活动编辑',
				component: () => import('@/views/cloud-shop/plugins/popup-advert/assets/assets-form.vue')
			},
			{
				path: 'cloud-popup-assets-store-list/:id',
				props: true,
				icon: '',
				name: 'cloud-popup-assets-store-list',
				meta: {
					title: '活动关联门店'
				},
				title: '活动关联门店',
				component: () => import('@/views/cloud-shop/plugins/popup-advert/assets/store-list.vue')
			},
			
			
			// 数据报表
			{
				path: 'cloud-today-visit',
				props: true,
				icon: '',
				name: 'cloud-today-visit',
				meta: {
					title: '当日访问'
				},
				title: '当日访问',
				component: () => import('@/views/cloud-shop/data/visit/today-visit.vue')
			},
			{
				path: 'cloud-page-visit',
				icon: '',
				name: 'cloud-page-visit',
				meta: {
					title: '页面访问统计'
				},
				title: '页面访问统计',
				component: () => import('@/views/cloud-shop/data/visit/page-visit.vue')
			},
			{
				path: 'cloud-history-visit',
				icon: '',
				name: 'cloud-history-visit',
				meta: {
					title: '历史访问统计'
				},
				title: '历史访问统计',
				component: () => import('@/views/cloud-shop/data/visit/history-visit.vue')
			},
			{
				path: 'cloud-goods-visit',
				icon: '',
				name: 'cloud-goods-visit',
				meta: {
					title: '商品访问统计'
				},
				title: '商品访问统计',
				component: () => import('@/views/cloud-shop/data/visit/goods-visit.vue')
			},
			{
				path: 'cloud-behavior-visit',
				icon: '',
				name: 'cloud-behavior-visit',
				meta: {
					title: '行为统计'
				},
				title: '行为统计',
				component: () => import('@/views/cloud-shop/data/visit/behavior-visit.vue')
			},
			{
				path: 'cloud-sales-stats',
				icon: '',
				name: 'cloud-sales-stats',
				meta: {
					title: '销售统计'
				},
				title: '销售统计',
				component: () => import('@/views/cloud-shop/data/sales-stats/sales-stats.vue')
			},
			{
				path: 'cloud-sales-detail',
				icon: '',
				name: 'cloud-sales-detail',
				meta: {
					title: '销售明细'
				},
				title: '销售明细',
				component: () => import('@/views/cloud-shop/data/sales-stats/sales-detail.vue')
			},
			
			{
				path: 'cloud-user-total-stats',
				icon: '',
				name: 'cloud-user-total-stats',
				meta: {
					title: '会员总量统计'
				},
				title: '会员总量统计',
				component: () => import('@/views/cloud-shop/data/member/total-detail-stats/total-detail-stats.vue')
			},
			{
				path: 'cloud-user-dynamic',
				icon: '',
				name: 'cloud-user-dynamic',
				meta: {
					title: '会员动态分析'
				},
				title: '会员动态分析',
				component: () => import('@/views/cloud-shop/data/member/total-dynamic-stats/total-dynamic-stats.vue')
			},
			{
				path: 'cloud-new-user-list',
				icon: '',
				name: 'cloud-new-user-list',
				meta: {
					title: '会员平台来源'
				},
				title: '会员平台来源',
				component: () => import('@/views/cloud-shop/data/member/total-source-stats/total-source-stats.vue')
			},
			//分销
			// {
			// 	path: 'cloud-distribution-setting',
			// 	icon: '',
			// 	name: 'cloud-distribution-setting',
			// 	meta: {
			// 		title: '分销设置'
			// 	},
			// 	title: '分销设置',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-setting.vue')
			// },
			// {
			// 	path: 'cloud-distribution-staff',
			// 	icon: '',
			// 	name: 'cloud-distribution-staff',
			// 	meta: {
			// 		title: '分销员管理'
			// 	},
			// 	title: '分销员管理',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-staff/distribution-staff.vue')
			// },
			// {
			// 	path: 'cloud-distribution-staff-add',
			// 	icon: '',
			// 	name: 'cloud-distribution-staff-add',
			// 	meta: {
			// 		title: '分销员创建'
			// 	},
			// 	title: '分销员管理创建',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-staff/manager/manager-form.vue')
			// },
			// {
			// 	path: 'cloud-distribution-staff-edit/:id',
			// 	props: true,
			// 	icon: '',
			// 	name: 'cloud-distribution-staff-edit',
			// 	meta: {
			// 		title: '分销员编辑 '
			// 	},
			// 	title: '分销员管理编辑 ',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-staff/manager/manager-form.vue')
			// },
			// {
			// 	path: 'cloud-distribution-yeji/:id',
			// 	props: true,
			// 	icon: '',
			// 	name: 'cloud-distribution-yeji',
			// 	meta: {
			// 		title: '分销员业绩'
			// 	},
			// 	title: '分销员业绩',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-staff/manager/ye-ji/ye-ji-list.vue')
			// },
			// {
			// 	path: 'cloud-distribution-yeer/:id',
			// 	props: true,
			// 	icon: '',
			// 	name: 'cloud-distribution-yeer',
			// 	meta: {
			// 		title: '分销员余额'
			// 	},
			// 	title: '分销员余额',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-staff/manager/yu-er/yu-er-list.vue')
			// },
			{
				path: 'cloud-staff-reports',
				icon: '',
				name: 'cloud-staff-reports',
				meta: {
					title: '分销提成报表'
				},
				title: '分销提成报表',
				component: () => import('@/views/cloud-shop/distribution/staff/staff-reports/staff-reports.vue')
			},
			// {
			// 	path: 'cloud-staff-cashout',
			// 	icon: '',
			// 	name: 'cloud-staff-cashout',
			// 	meta: {
			// 		title: '分销提现管理'
			// 	},
			// 	title: '分销提现管理',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/staff-cashout/staff-cashout.vue')
			// },
			// {
			// 	path: 'cloud-distribution-activity-list',
			// 	icon: '',
			// 	name: 'cloud-distribution-activity-list',
			// 	meta: {
			// 		title: '分销活动管理'
			// 	},
			// 	title: '分销活动管理',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-activity/distribution-activity-list.vue')
			// },
			// {
			// 	path: 'cloud-distribution-activity-config',
			// 	icon: '',
			// 	name: 'cloud-distribution-activity-config',
			// 	meta: {
			// 		title: '分销活动属性配置'
			// 	},
			// 	title: '分销活动属性配置',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-activity-config/distribution-activity-list.vue')
			// },
			// {
			// 	path: 'cloud-distribution-activity-award',
			// 	icon: '',
			// 	name: 'cloud-distribution-activity-award',
			// 	meta: {
			// 		title: '分销活动奖励'
			// 	},
			// 	title: '分销活动奖励',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/staff_activity_reward/activity_reward.vue')
			// },
			// {
			// 	path: 'cloud-distribution-activity-award-message',
			// 	icon: '',
			// 	name: 'cloud-distribution-activity-award-message',
			// 	meta: {
			// 		title: '分销活动编辑'
			// 	},
			// 	title: '分销活动编辑',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/staff_activity_reward/message.vue')
			// },
			// {
			// 	path: 'cloud-distribution-activity-award-record',
			// 	icon: '',
			// 	name: 'cloud-distribution-activity-award-record',
			// 	meta: {
			// 		title: '分销活动记录'
			// 	},
			// 	title: '分销活动记录',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/staff_activity_reward/record.vue')
			// },
			// {
			// 	path: 'cloud-distribution-goods-add',
			// 	icon: '',
			// 	name: 'cloud-distribution-goods-add',
			// 	meta: {
			// 		title: '热销商品创建'
			// 	},
			// 	title: '热销商品创建',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-activity/hot-goods/hot-goods-form.vue')
			// },
			// {
			// 	path: 'cloud-distribution-goods-edit/:id',
			// 	props: true,
			// 	icon: '',
			// 	name: 'cloud-distribution-goods-edit',
			// 	meta: {
			// 		title: '热销商品编辑'
			// 	},
			// 	title: '热销商品编辑',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-activity/hot-goods/hot-goods-form.vue')
			// },
			// {
			// 	path: 'cloud-distribution-activity-add',
			// 	icon: '',
			// 	name: 'cloud-distribution-activity-add',
			// 	meta: {
			// 		title: '热销活动创建'
			// 	},
			// 	title: '热销活动创建',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-activity/hot-activity/hot-activity-form.vue')
			// },
			// {
			// 	path: 'cloud-distribution-activity-edit/:id',
			// 	props: true,
			// 	icon: '',
			// 	name: 'cloud-distribution-activity-edit',
			// 	meta: {
			// 		title: '热销活动编辑'
			// 	},
			// 	title: '热销活动编辑',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-activity/hot-activity/hot-activity-form.vue')
			// },
			// {
			// 	path: 'cloud-distribution-apply-setting',
			// 	icon: '',
			// 	name: 'cloud-distribution-apply-setting',
			// 	meta: {
			// 		title: '申请分销员'
			// 	},
			// 	title: '申请分销员',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-apply-setting.vue')
			// },
			// {
			// 	path: 'cloud-distributor-report',
			// 	icon: '',
			// 	name: 'cloud-distributor-report',
			// 	meta: {
			// 		title: '付费分销员报表'
			// 	},
			// 	title: '付费分销员报表',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distributor-report/distributor-report.vue')
			// },
			// {
			// 	path: 'cloud-reward-report',
			// 	icon: '',
			// 	name: 'cloud-reward-report',
			// 	meta: {
			// 		title: '分销奖励报表'
			// 	},
			// 	title: '分销奖励报表',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/reward-report/reward-report.vue')
			// },
			// {
			// 	path: 'cloud-distributor-reports',
			// 	icon: '',
			// 	name: 'cloud-distributor-reports',
			// 	meta: {
			// 		title: '分销员报表'
			// 	},
			// 	title: '分销员报表',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distributor-reports/distributor-reports.vue')
			// },
			// {
			// 	path: 'cloud-cashout-report',
			// 	icon: '',
			// 	name: 'cloud-cashout-report',
			// 	meta: {
			// 		title: '分销提现报表'
			// 	},
			// 	title: '分销提现报表',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/cashout-report/cashout-report.vue')
			// },
			// {
			// 	path: 'cloud-distribution-summary-report',
			// 	icon: '',
			// 	name: 'cloud-distribution-summary-report',
			// 	meta: {
			// 		title: '分销汇总报表'
			// 	},
			// 	title: '分销汇总报表',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-summary-report/index.vue')
			// },
			// {
			// 	path: 'cloud-distribution-balance-list',
			// 	icon: '',
			// 	name: 'cloud-distribution-balance-list',
			// 	meta: {
			// 		title: '分销余额流水'
			// 	},
			// 	title: '分销余额流水',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-balance/distribution-balance-list.vue')
			// },
			// {
			// 	path: 'cloud-distribution-rank-list',
			// 	icon: '',
			// 	name: 'cloud-distribution-rank-list',
			// 	meta: {
			// 		title: '分销等级'
			// 	},
			// 	title: '分销等级',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-rank/distribution-rank-list.vue')
			// },
			// {
			// 	path: 'cloud-distribution-rank-setting',
			// 	icon: '',
			// 	name: 'cloud-distribution-rank-setting',
			// 	meta: {
			// 		title: '分销等级设置'
			// 	},
			// 	title: '分销等级设置',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-rank-setting/distribution-rank-setting.vue')
			// },
			// {
			// 	path: 'cloud-distribution-rank-add/:id',
			// 	props: true,
			// 	icon: '',
			// 	name: 'cloud-distribution-rank-add',
			// 	meta: {
			// 		title: '分销等级设置创建'
			// 	},
			// 	title: '分销等级设置创建',
			// 	component: () => import('@/views/cloud-shop/distribution/staff/distribution-rank-setting/distribution-rank-form.vue')
			// },
			//云店预售组件
			{
				path: 'shop-presale-activity-list',
				icon: '',
				name: 'shop-presale-activity-list',
				meta: {
					title: '云店预售活动列表'
				},
				title: '云店预售活动列表',
				component: () => import('@/views/cloud-shop/plugins/presale/activity/presale-activity-list.vue')
			},
			{
				path: 'shop-presale-activity-add',
				icon: '',
				name: 'shop-presale-activity-add',
				meta: {
					title: '云店预售活动创建'
				},
				title: '云店预售活动创建',
				component: () => import('@/views/cloud-shop/plugins/presale/activity/presale-activity-form.vue')
			},
			{
				path: 'shop-presale-activity-edit/:id',
				props: true,
				icon: '',
				name: 'shop-presale-activity-edit',
				meta: {
					title: '云店预售活动编辑'
				},
				title: '云店预售活动编辑',
				component: () => import('@/views/cloud-shop/plugins/presale/activity/presale-activity-form.vue')
			},
			{
				path: 'shop-presale-order-list',
				icon: '',
				name: 'shop-presale-order-list',
				meta: {
					title: '云店预售订单列表'
				},
				title: '云店预售订单列表',
				component: () => import('@/views/cloud-shop/plugins/presale/order/presale-order-info.vue')
			},
			{
				path: 'shop-presale-order-info/:sn',
				props: true,
				icon: '',
				name: 'shop-presale-order-info',
				meta: {
					title: '云店预售订单详情'
				},
				title: '云店预售订单详情',
				component: () => import('@/views/cloud-shop/plugins/presale/order/order-info/order-info.vue')
			},
			{
				path: 'cloud-presale-activity-store-list/:id',
				props: true,
				icon: '',
				name: 'cloud-presale-activity-store-list',
				meta: {
					title: '活动关联门店'
				},
				title: '活动关联门店',
				component: () => import('@/views/cloud-shop/plugins/presale/activity/store-list.vue')
			},
		],
	},
	// 矩阵
	{
		path: '/matrix',
		icon: '',
		title: '矩阵',
		name: 'matrix',
		component: Main,
		children: [
			// 抽奖活动
			{
				path: 'matrix-lottery-activity',
				icon: '',
				name: 'matrix-lottery-activity',
				meta: {
					title: '抽奖活动'
				},
				title: '抽奖活动',
				component: () => import('@/views/matrix/plugins/lottery/lottery-type/lottery-type.vue')
			},
			{
				path: 'matrix-lottery-activity-list',
				icon: '',
				name: 'matrix-lottery-activity-list',
				meta: {
					title: '抽奖列表'
				},
				title: '抽奖列表',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/lottery-activity-list.vue')
			},
			{
				path: 'matrix-fan-details-add',
				icon: '',
				name: 'matrix-fan-details-add',
				meta: {
					title: '生肖翻一翻创建'
				},
				title: '生肖翻一翻创建',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/fan/fan-details.vue')
			},
			{
				path: 'matrix-fan-details-edit/:id',
				props: true,
				icon: '',
				name: 'matrix-fan-details-edit',
				meta: {
					title: '生肖翻一番编辑'
				},
				title: '生肖翻一番编辑',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/fan/fan-details.vue')
			},
			{
				path: 'matrix-fruit-details-add',
				icon: '',
				name: 'matrix-fruit-details-add',
				meta: {
					title: '水果机创建'
				},
				title: '水果机创建',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/fruit/fruit-details.vue')
			},
			{
				path: 'matrix-fruit-details-edit/:id',
				props: true,
				icon: '',
				name: 'matrix-fruit-details-edit',
				meta: {
					title: '水果机编辑'
				},
				title: '水果机编辑',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/fruit/fruit-details.vue')
			},
			{
				path: 'matrix-yao-details-add',
				icon: '',
				name: 'matrix-yao-details-add',
				meta: {
					title: '摇一摇创建'
				},
				title: '摇一摇创建',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/yao/yao-details.vue')
			},
			{
				path: 'matrix-yao-details-edit/:id',
				props: true,
				icon: '',
				name: 'matrix-yao-details-edit',
				meta: {
					title: '摇一摇编辑'
				},
				title: '摇一摇编辑',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/yao/yao-details.vue')
			},
			{
				path: 'matrix-egg-details-add',
				icon: '',
				name: 'matrix-egg-details-add',
				meta: {
					title: '砸金蛋创建'
				},
				title: '砸金蛋创建',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/egg/egg-details.vue')
			},
			{
				path: 'matrix-egg-details-edit/:id',
				props: true,
				icon: '',
				name: 'matrix-egg-details-edit',
				meta: {
					title: '砸金蛋编辑'
				},
				title: '砸金蛋编辑',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/egg/egg-details.vue')
			},
			{
				path: 'matrix-kaixiangzi-details-add',
				icon: '',
				name: 'matrix-kaixiangzi-details-add',
				meta: {
					title: '开箱子创建'
				},
				title: '开箱子创建',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/kaixiangzi/kaixiangzi-details.vue')
			},
			{
				path: 'matrix-kaixiangzi-details-edit/:id',
				props: true,
				icon: '',
				name: 'matrix-kaixiangzi-details-edit',
				meta: {
					title: '开箱子编辑'
				},
				title: '开箱子编辑',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/kaixiangzi/kaixiangzi-details.vue')
			},
			{
				path: 'matrix-pan-details-add',
				icon: '',
				name: 'matrix-pan-details-add',
				meta: {
					title: '大转盘创建'
				},
				title: '大转盘创建',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/pan/pan-details.vue')
			},
			{
				path: 'matrix-pan-details-edit/:id',
				props: true,
				icon: '',
				name: 'matrix-pan-details-edit',
				meta: {
					title: '大转盘编辑'
				},
				title: '大转盘编辑',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/pan/pan-details.vue')
			},
			{
				path: 'matrix-coupon-details-add',
				icon: '',
				name: 'matrix-coupon-details-add',
				meta: {
					title: '一点领券创建'
				},
				title: '一点领券创建',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/coupon/coupon-details.vue')
			},
			{
				path: 'matrix-coupon-details-edit/:id',
				props: true,
				icon: '',
				name: 'matrix-coupon-details-edit',
				meta: {
					title: '一点领券编辑'
				},
				title: '一点领券编辑',
				component: () => import('@/views/matrix/plugins/lottery/lottery-activity/coupon/coupon-details.vue')
			},
			{
				path: 'matrix-lottery-order',
				icon: '',
				name: 'matrix-lottery-order',
				meta: {
					title: '抽奖订单'
				},
				title: '抽奖订单',
				component: () => import('@/views/matrix/plugins/lottery/lottery-order/lottery-order.vue')
			},
			{
				path: 'matrix-lottery-log',
				icon: '',
				name: 'matrix-lottery-log',
				meta: {
					title: '抽奖记录'
				},
				title: '抽奖记录',
				component: () => import('@/views/matrix/plugins/lottery/lottery-log/lottery-log.vue')
			},
			{
				path: 'matrix-lottery-log-details/:id',
				props: true,
				icon: '',
				name: 'matrix-lottery-log-details',
				meta: {
					title: '抽奖记录明细'
				},
				title: '抽奖记录明细',
				component: () => import('@/views/matrix/plugins/lottery/lottery-log/details/lottery-details.vue')
			},
			{
				path: 'matrix-lottery-template',
				icon: '',
				name: 'matrix-lottery-template',
				meta: {
					title: '抽奖活动模板'
				},
				title: '抽奖活动模板',
				component: () => import('@/views/matrix/plugins/lottery/lottery-template/lottery-template.vue')
			},
			{
				path: 'matrix-sharing-rules',
				icon: '',
				name: 'matrix-sharing-rules',
				meta: {
					title: '分享规则'
				},
				title: '分享规则',
				component: () => import('@/views/matrix/plugins/lottery/share-rule/rule-list.vue')
			},
			{
				path: 'matrix-edit-sharing-rules',
				icon: '',
				name: 'matrix-edit-sharing-rules',
				meta: {
					title: '编辑分享规则'
				},
				title: '编辑分享规则',
				component: () => import('@/views/matrix/plugins/lottery/share-rule/edit-rule/edit-rule-form.vue')
			},
			{
				path: 'matrix-check-sharing-rules',
				icon: '',
				name: 'matrix-check-sharing-rules',
				meta: {
					title: '查看分享规则明细'
				},
				title: '查看分享规则明细',
				component: () => import('@/views/matrix/plugins/lottery/share-rule/rule-detail/rule-detail.vue')
			},
			
			{
				path: 'matrix-bonus-type',
				icon: '',
				name: 'matrix-bonus-type',
				meta: {
					title: '奖项优惠券列表'
				},
				title: '奖项优惠券列表',
				component: () => import('@/views/matrix/plugins/lottery/lottery-prize/coupon/index.vue')
			},
			{
				path: 'matrix-goods',
				icon: '',
				name: 'matrix-goods',
				meta: {
					title: '奖项实物列表'
				},
				title: '奖项实物列表',
				component: () => import('@/views/matrix/plugins/lottery/lottery-prize/goods/index.vue')
			},
			{
				path: 'matrix-user-list',
				icon: '',
				name: 'matrix-user-list',
				meta: {
					title: '矩阵用户列表'
				},
				title: '矩阵用户列表',
				component: () => import('@/views/matrix/plugins/user/user-list/user-list.vue')
			},
			//个人中心
			{
				path: 'matrix-weapp-user-center',
				icon: '',
				name: 'matrix-weapp-user-center',
				meta: {
					title: '小程序个人中心'
				},
				title: '小程序个人中心',
				component: () => import('@/views/matrix/plugins/weapp/weapp-user-center.vue')
			},
			// 订单管理
			{
					path: 'matrix-order-list/:userId?',
					props: true,
					icon: '',
					name: 'matrix-order-list',
					meta: {
						title: '订单列表',
						groups: 'orderList'
					},
					title: '订单列表',
					component: () => import('@/views/matrix/plugins/orders/order-list/order-list.vue')
				},
				{
					path: 'matrix-order-info/:sn',
					props: true,
					name: 'matrix-order-info',
					meta: {
						title: '订单详情',
						groups: 'orderList'
					},
					title: '订单详情',
					component: () => import('@/views/matrix/plugins/orders/order-info/order-info.vue')
				},
				{
					path: 'matrix-customer-service',
					icon: '',
					name: 'matrix-customer-service',
					meta: {
						title: '手工客服订单'
					},
					title: '手工客服订单',
					component: () => import('@/views/matrix/plugins/orders/customer-service/index.vue')
				},
				{
					path: 'matrix-return-order-list',
					icon: '',
					name: 'matrix-return-order-list',
					meta: {
						title: '退货单列表'
					},
					title: '退货单列表',
					component: () => import('@/views/matrix/plugins/orders/return-order-list/return-order-list.vue')
				},
				{
					path: 'matrix-return-order-info/:sn',
					props: true,
					icon: '',
					name: 'matrix-return-order-info',
					meta: {
						title: '退货单详情'
					},
					title: '退货单详情',
					component: () => import('@/views/matrix/plugins/orders/return-order-info/return-order-info.vue')
				},
				{
					path: 'matrix-delivery-order-list/:sn?',
					props: true,
					icon: '',
					name: 'matrix-delivery-order-list',
					meta: {
						title: '发货单列表'
					},
					title: '发货单列表',
					component: () => import('@/views/matrix/plugins/orders/delivery-order-list/delivery-order-list.vue')
				},
				{
					path: 'matrix-delivery-order-info/:sn',
					props: true,
					name: 'matrix-delivery-order-info',
					meta: {
						title: '发货单详情'
					},
					title: '发货单详情',
					component: () => import('@/views/matrix/plugins/orders/delivery-order-info/delivery-order-info.vue')
				},
				{
					path: 'matrix-ship-order-info/:sn',
					props: true,
					name: 'matrix-ship-order-info',
					meta: {
						title: '生成发货单详情'
					},
					title: '生成发货单详情',
					component: () => import('@/views/matrix/plugins/orders/ship-order-info/ship-order-info.vue')
				},
				{
					path: 'matrix-return-money-list',
					icon: '',
					name: 'matrix-return-money-list',
					meta: {
						title: '退款单列表'
					},
					title: '退款单列表',
					component: () => import('@/views/matrix/plugins/orders/refund-list/refund-list.vue')
				},
				{
					path: 'matrix-refund-info/:sn',
					props: true,
					name: 'matrix-refund-info',
					meta: {
						title: '退款单详情'
					},
					title: '退款单详情',
					component: () => import('@/views/matrix/plugins/orders/refund-info/refund-info.vue')
				},
				{
					path: 'matrix-exchange-goods-list',
					icon: '',
					name: 'matrix-exchange-goods-list',
					meta: {
						title: '换货单列表'
					},
					title: '换货单列表',
					component: () => import('@/views/matrix/plugins/orders/exchange-goods-list/exchange-goods-list.vue')
				},
				{
					path: 'matrix-exchange-info/:sn',
					props: true,
					name: 'matrix-exchange-info',
					meta: {
						title: '换货单详情'
					},
					title: '换货单详情',
					component: () => import('@/views/matrix/plugins/orders/exchange-info/exchange-info.vue')
				},
				{
					path: 'matrix-big-screen-list',
					icon: '',
					name: 'matrix-big-screen-list',
					meta: {
						title: '大屏订单列表'
					},
					title: '大屏订单列表',
					component: () => import('@/views/matrix/plugins/orders/big-screen-list/order-list.vue')
				},
			
				// {
				//   path: 'matrix-big-screen-info/:sn',
				//   props: true,
				//   name: 'matrix-big-screen-info',
				//   meta: {
				//     title: '大屏订单详情'
				//   },
				//   title: '大屏订单详情',
				//   component: () => import('@/views/matrix/plugins/orders/big-screen-info/big-screen-info.vue')
				// }
				{
					path: 'matrix-recycle-bin-list',
					icon: '',
					name: 'matrix-recycle-bin-list',
					meta: {
						title: '回收站列表'
					},
					title: '回收站列表',
					component: () => import('@/views/matrix/plugins/orders/recycle-bin-list/recycle-bin-list.vue')
				},
				{
					path: 'matrix-recycle-info/:sn',
					props: true,
					name: 'matrix-recycle-info',
					meta: {
						title: '回收站详情'
					},
					title: '回收站详情',
					component: () => import('@/views/matrix/plugins/orders/recycle-info/recycle-info.vue')
				},
				
		]
	},
	// 商品
	{
		path: '/goods',
		icon: '',
		title: '商品',
		name: 'goods',
		component: Main,
		children: [{
				path: 'goods-list',
				icon: '',
				name: 'goods-list',
				meta: {
					title: '商品管理',
					groups: 'goods-list'
				},
				title: '商品管理',
				component: () => import('@/views/goods/goods-list/goods-list.vue')
			},
			{
				path: 'goods-create',
				icon: '',
				name: 'goods-create',
				meta: {
					title: '发布商品',
					groups: 'goods-list'
				},
				title: '发布商品',
				component: () => import('@/views/goods/goods-list/goods-editor.vue')
			},
			{
				path: 'goods-edit/:id',
				icon: '',
				name: 'goods-edit',
				meta: {
					title: '编辑商品',
					groups: 'goods-list'
				},
				title: '编辑商品',
				component: () => import('@/views/goods/goods-list/goods-editor.vue')
			},
			{
				path: 'goods-cat',
				icon: '',
				name: 'goods-cat',
				meta: {
					title: '商品分类',
					groups: 'goods-cat'
				},
				title: '商品分类',
				component: () => import('@/views/goods/goods-cat/goods-all-cat.vue')
			},
			{
				path: 'goods-allocation/:type',
				props: true,
				icon: '',
				name: 'goods-allocation',
				meta: {
					title: '转移商品分类',
					groups: 'goods-cat'
				},
				title: '转移商品分类',
				component: () => import('@/views/goods/goods-cat/goods-allocation.vue')
			},
			{
				path: 'goods-distribute/:data',
				props: true,
				icon: '',
				name: 'goods-distribute',
				meta: {
					title: '快速分配商品分类',
					groups: 'goods-cat'
				},
				title: '快速分配商品分类',
				component: () => import('@/views/goods/goods-cat/goods-distribute.vue')
			},
			{
				path: 'goods-cat-label-goods',
				icon: '',
				name: 'goods-cat-label-goods',
				meta: {
					title: '商品分类标签商品'
				},
				title: '商品分类标签商品',
				component: () => import('@/views/goods/goods-cat/cat-label-goods/cat-label-goods.vue')
			},
			{
				path: 'goods-cat-goods',
				icon: '',
				name: 'goods-cat-goods',
				meta: {
					title: '商品分类商品'
				},
				title: '商品分类商品',
				component: () => import('@/views/goods/goods-cat/cat-goods/cat-goods.vue')
			},
			{
				path: 'choose-custom-label',
				icon: '',
				name: 'choose-custom-label',
				meta: {
					title: '选择自定义标签',
					groups: 'goods-cat'
				},
				title: '选择自定义标签',
				component: () => import('@/views/goods/goods-cat/choose-custom-label/index.vue')
			},
			{
				path: 'spec-list',
				icon: '',
				name: 'spec-list',
				meta: {
					title: '规格管理',
					groups: 'spec-list'
				},
				title: '规格管理',
				component: () => import('@/views/goods/goods-spec/goods-spec.vue')
			},
			{
				path: 'color-spec-list/:id',
				props: true,
				icon: '',
				name: 'color-spec-list',
				meta: {
					title: '颜色规格管理',
					groups: 'spec-list'
				},
				title: '颜色规格管理',
				component: () => import('@/views/goods/goods-spec/color-norms/color-spec-list.vue')
			},
			{
				path: 'size-spec-list/:id',
				props: true,
				icon: '',
				name: 'size-spec-list',
				meta: {
					title: '尺寸规格管理',
					groups: 'spec-list'
				},
				title: '尺寸规格管理',
				component: () => import('@/views/goods/goods-spec/size-norms/size-spec-list.vue')
			},
			{
				path: 'attr-list',
				icon: '',
				name: 'attr-list',
				meta: {
					title: '属性管理',
					groups: 'attr-list'
				},
				title: '属性管理',
				component: () => import('@/views/goods/goods-attr/attr-list.vue')
			},
			{
				path: 'attr-value-list/:id',
				props: true,
				icon: '',
				name: 'attr-value-list',
				meta: {
					title: '属性值管理',
					groups: 'attr-list'
				},
				title: '属性值管理',
				component: () => import('@/views/goods/goods-attr/attr-value-list/attr-value-list.vue')
			},
			{
				path: 'goods-Tag',
				icon: '',
				name: 'goods-Tag',
				meta: {
					title: '商品标签',
					groups: 'goods-Tag'
				},
				title: '商品标签',
				component: () => import('@/views/goods/goods-tag/goods-tag-list.vue')
			},
			{
				path: 'goods-tag-link/:id',
				props: true,
				icon: '',
				name: 'goods-tag-link',
				meta: {
					title: '商品标签商品',
					groups: 'goods-Tag'
				},
				title: '商品标签商品',
				component: () => import('@/views/goods/goods-tag/goods-list/goods-list.vue')
			},
			{
				path: 'goods-price-explain',
				icon: '',
				name: 'goods-price-explain',
				meta: {
					title: '商品价格说明',
					groups: 'goods-price-explain'
				},
				title: '商品价格说明',
				component: () => import('@/views/goods/goods-price-explain/goods-price-explain.vue')
			},
			{
				path: 'goods-size-explain',
				icon: '',
				name: 'goods-size-explain',
				meta: {
					title: '商品尺码说明',
					groups: 'goods-size-explain'
				},
				title: '商品尺码说明',
				component: () => import('@/views/goods/goods-size-explain/goods-size-explain.vue')
			},
			{
				path: 'goods-size-explain-add',
				icon: '',
				name: 'goods-size-explain-add',
				meta: {
					title: '商品尺码说明创建'
				},
				title: '商品尺码说明创建',
				component: () => import('@/views/goods/goods-size-explain/goods-size-explain-form.vue')
			},
			{
				path: 'goods-size-explain-edit/:id',
				props: true,
				icon: '',
				name: 'goods-size-explain-edit',
				meta: {
					title: '商品尺码说明编辑'
				},
				title: '商品尺码说明编辑',
				component: () => import('@/views/goods/goods-size-explain/goods-size-explain-form.vue')
			},
			{
				path: 'goods-size-explain-cat',
				icon: '',
				name: 'goods-size-explain-cat',
				meta: {
					title: '商品尺码说明分类',
					groups: 'goods-size-explain'
				},
				title: '商品尺码说明分类',
				component: () => import('@/views/goods/goods-size-explain/goods-size-explain-cat.vue')
			},
			{
				path: 'goods-size-explain-cat-add',
				icon: '',
				name: 'goods-size-explain-cat-add',
				meta: {
					title: '商品尺码说明分类创建'
				},
				title: '商品尺码说明分类创建',
				component: () => import('@/views/goods/goods-size-explain/goods-size-explain-cat-form.vue')
			},
			{
				path: 'goods-size-explain-cat-edit/:id',
				props: true,
				icon: '',
				name: 'goods-size-explain-cat-edit',
				meta: {
					title: '商品尺码说明分类编辑'
				},
				title: '商品尺码说明分类编辑',
				component: () => import('@/views/goods/goods-size-explain/goods-size-explain-cat-form.vue')
			},
			// 微页面 路由
			{
				path: 'goods-page',
				icon: '',
				name: 'goods-page',
				meta: {
					title: '微页面'
				},
				title: '微页面',
				component: () => import('@/views/plugins/pages/page-list.vue')
			},
			{
				path: 'goods-page-cat',
				icon: '',
				name: 'goods-page-cat',
				meta: {
					title: '微页面分类',
				},
				title: '微页面分类',
				component: () => import('@/views/plugins/pages/page-cat-list.vue')
			},
			{
				path: 'goods-brand',
				icon: '',
				name: 'goods-brand',
				meta: {
					title: '商品品牌'
				},
				title: '商品品牌',
				component: () => import('@/views/goods/goods-brand/brand-list.vue')
			},
			{
				path: 'goods-supplier',
				icon: '',
				name: 'goods-supplier',
				meta: {
					title: '商品供应商'
				},
				title: '商品供应商',
				component: () => import('@/views/goods/goods-supplier/supplier-list.vue')
			},
			{
				path: 'goods-service',
				icon: '',
				name: 'goods-service',
				meta: {
					title: '商品服务'
				},
				title: '商品服务',
				component: () => import('@/views/goods/goods-service/service-list.vue')
			},
			{
				path: 'goods-watermark',
				icon: '',
				name: 'goods-watermark',
				meta: {
					title: '商品水印列表',
					groups: 'goods-watermark'
				},
				title: '商品水印列表',
				component: () => import('@/views/goods/goods-watermark/watermark-list.vue')
			},
			{
				path: 'watermark-manager',
				icon: '',
				name: 'watermark-manager',
				meta: {
					title: '商品水印管理',
					groups: 'goods-watermark'
				},
				title: '商品水印管理',
				component: () => import('@/views/goods/goods-watermark/manager/watermark-manager.vue')
			},
			{
				path: 'goods-stock',
				icon: '',
				name: 'goods-stock',
				meta: {
					title: '库存查询',
					groups: 'goods-stock'
				},
				title: '库存查询',
				component: () => import('@/views/goods/goods-stock/goods-stock.vue')
			},
			{
				path: 'goods-product/:data',
				props: true,
				icon: '',
				name: 'goods-product',
				meta: {
					title: '库存查询明细',
					groups: 'goods-stock'
				},
				title: '库存查询明细',
				component: () => import('@/views/goods/goods-stock/product.vue')
			},
			{
				path: 'goods-RelatedInformation',
				icon: '',
				name: 'goods-RelatedInformation',
				meta: {
					title: '商品关联信息',
					groups: 'goods-RelatedInformation'
				},
				title: '商品关联信息',
				component: () => import('@/views/goods/goods-related/goods-related.vue')
			},
			{
				path: 'goods-Related-supply/:id',
				props: true,
				icon: '',
				name: 'goods-Related-supply',
				meta: {
					title: '商品关联供应商',
					groups: 'goods-RelatedInformation'
				},
				title: '商品关联供应商',
				component: () => import('@/views/goods/goods-related/supply-select/supply-select.vue')
			},
			{
				path: 'goods-autosyn',
				icon: '',
				name: 'goods-autosyn',
				meta: {
					title: '库存同步'
				},
				title: '库存同步',
				component: () => import('@/views/goods/goods-autosyn/goods-autosyn.vue')
			},
			{
				path: 'goods-qrcode',
				icon: '',
				name: 'goods-qrcode',
				meta: {
					title: '商品二维码'
				},
				title: '商品二维码',
				component: () => import('@/views/goods/goods-qrcode/goods-qrcode.vue')
			},
			{
				path: 'goods-AppletCode',
				icon: '',
				name: 'goods-AppletCode',
				meta: {
					title: '商品二维码'
				},
				title: '商品二维码',
				component: () => import('@/views/goods/goods-appletcode/goods-appletcode.vue')
			},
			{
				path: 'goods-export',
				icon: '',
				name: 'goods-export',
				meta: {
					title: '商品批量处理'
				},
				title: '商品批量处理',
				component: () => import('@/views/goods/goods-export/goods-export.vue')
			},
			{
				path: 'goods-commentManagement',
				icon: '',
				name: 'goods-commentManagement',
				meta: {
					title: '商品评论'
				},
				title: '商品评论',
				component: () => import('@/views/goods/goods-comment/goods-comment-list.vue')
			},
			{
				path: 'goods-commentSetting',
				icon: '',
				name: 'goods-commentSetting',
				meta: {
					title: '评论设置'
				},
				title: '评论设置',
				component: () => import('@/views/goods/goods-comment/comment-setting.vue')
			},
			// 商品日志
			{
				path: 'goods-log/:id?',
				props: true,
				icon: '',
				name: 'goods-log',
				meta: {
					title: '商品修改日志',
				},
				title: '商品修改日志',
				component: () => import('@/views/goods/goods-log/log-list.vue')
			},
			{
				path: 'brand-goods-sync',
				props: true,
				icon: '',
				name: 'brand-goods-sync',
				meta: {
					title: '跨品牌商品同步',
				},
				title: '跨品牌商品同步',
				component: () => import('@/views/goods/brand-goods-sync/brand-goods-sync.vue')
			},
			{
				path: 'brand-goods-sync-add',
				icon: '',
				name: 'brand-goods-sync-add',
				meta: {
					title: '跨品牌商品同步任务创建'
				},
				title: '跨品牌商品同步任务创建',
				component: () => import('@/views/goods/brand-goods-sync/brand-goods-sync-form.vue')
			},

		]
	},
	// 订单
	{
		path: '/orders',
		icon: '',
		title: '订单',
		name: 'orders',
		component: Main,
		children: [{
				path: 'order-list/:userId?',
				props: true,
				icon: '',
				name: 'order-list',
				meta: {
					title: '订单列表',
					groups: 'orderList'
				},
				title: '订单列表',
				component: () => import('@/views/orders/order-list/order-list.vue')
			},
			{
				path: 'order-info/:sn',
				props: true,
				name: 'order-info',
				meta: {
					title: '订单详情',
					groups: 'orderList'
				},
				title: '订单详情',
				component: () => import('@/views/orders/order-info/order-info.vue')
			},
			{
				path: 'customer-service',
				icon: '',
				name: 'customer-service',
				meta: {
					title: '手工客服订单'
				},
				title: '手工客服订单',
				component: () => import('@/views/orders/customer-service/index.vue')
			},
			{
				path: 'return-order-list',
				icon: '',
				name: 'return-order-list',
				meta: {
					title: '退货单列表'
				},
				title: '退货单列表',
				component: () => import('@/views/orders/return-order-list/return-order-list.vue')
			},
			{
				path: 'return-order-info/:sn',
				props: true,
				icon: '',
				name: 'return-order-info',
				meta: {
					title: '退货单详情'
				},
				title: '退货单详情',
				component: () => import('@/views/orders/return-order-info/return-order-info.vue')
			},
			{
				path: 'delivery-order-list/:sn?',
				props: true,
				icon: '',
				name: 'delivery-order-list',
				meta: {
					title: '发货单列表'
				},
				title: '发货单列表',
				component: () => import('@/views/orders/delivery-order-list/delivery-order-list.vue')
			},
			{
				path: 'delivery-order-info/:sn',
				props: true,
				name: 'delivery-order-info',
				meta: {
					title: '发货单详情'
				},
				title: '发货单详情',
				component: () => import('@/views/orders/delivery-order-info/delivery-order-info.vue')
			},
			{
				path: 'ship-order-info/:sn',
				props: true,
				name: 'ship-order-info',
				meta: {
					title: '生成发货单详情'
				},
				title: '生成发货单详情',
				component: () => import('@/views/orders/ship-order-info/ship-order-info.vue')
			},
			{
				path: 'return-money-list',
				icon: '',
				name: 'return-money-list',
				meta: {
					title: '退款单列表'
				},
				title: '退款单列表',
				component: () => import('@/views/orders/refund-list/refund-list.vue')
			},
			{
				path: 'refund-info/:sn',
				props: true,
				name: 'refund-info',
				meta: {
					title: '退款单详情'
				},
				title: '退款单详情',
				component: () => import('@/views/orders/refund-info/refund-info.vue')
			},
			{
				path: 'exchange-goods-list',
				icon: '',
				name: 'exchange-goods-list',
				meta: {
					title: '换货单列表'
				},
				title: '换货单列表',
				component: () => import('@/views/orders/exchange-goods-list/exchange-goods-list.vue')
			},
			{
				path: 'exchange-info/:sn',
				props: true,
				name: 'exchange-info',
				meta: {
					title: '换货单详情'
				},
				title: '换货单详情',
				component: () => import('@/views/orders/exchange-info/exchange-info.vue')
			},
			{
				path: 'big-screen-list',
				icon: '',
				name: 'big-screen-list',
				meta: {
					title: '大屏订单列表'
				},
				title: '大屏订单列表',
				component: () => import('@/views/orders/big-screen-list/order-list.vue')
			},

			// {
			//   path: 'big-screen-info/:sn',
			//   props: true,
			//   name: 'big-screen-info',
			//   meta: {
			//     title: '大屏订单详情'
			//   },
			//   title: '大屏订单详情',
			//   component: () => import('@/views/orders/big-screen-info/big-screen-info.vue')
			// }
			{
				path: 'recycle-bin-list',
				icon: '',
				name: 'recycle-bin-list',
				meta: {
					title: '退货单回收站列表'
				},
				title: '退货单回收站列表',
				component: () => import('@/views/orders/recycle-bin-list/recycle-bin-list.vue')
			},
			{
				path: 'recycle-info/:sn',
				props: true,
				name: 'recycle-info',
				meta: {
					title: '退货单回收站详情'
				},
				title: '退货单回收站详情',
				component: () => import('@/views/orders/recycle-info/recycle-info.vue')
			},
			{
				path: 'refund-recycle-bin-list',
				icon: '',
				name: 'refund-recycle-bin-list',
				meta: {
					title: '退款单回收站列表'
				},
				title: '退款单回收站列表',
				component: () => import('@/views/orders/refund-recycle-bin-list/recycle-bin-list.vue')
			},
			{
				path: 'refund-recycle-info/:sn',
				props: true,
				name: 'refund-recycle-info',
				meta: {
					title: '退款单回收站详情'
				},
				title: '退款单回收站详情',
				component: () => import('@/views/orders/refund-recycle-info/recycle-info.vue')
			},
		]
	},
	// 设置
	{
		path: '/settings',
		icon: '',
		title: '设置',
		name: 'settings',
		component: Main,
		children: [{
				path: 'options',
				icon: '',
				name: 'options',
				meta: {
					title: '参数设置'
				},
				title: '参数设置',
				component: () => import('@/views/settings/options/options.vue')
			},
			{
				path: 'shop-setting',
				icon: '',
				name: 'shop-setting',
				meta: {
					title: '商城设置'
				},
				title: '商城设置',
				component: () => import('@/views/goods/shop-setting/shop-setting.vue')
			},
			{
				path: 'ownspace',
				icon: '',
				name: 'ownspace',
				meta: {
					title: '账号设置'
				},
				title: '账号设置',
				component: () => import('@/views/settings/own-space/own-space.vue')
			},
			{
				path: 'message',
				icon: '',
				name: 'message',
				meta: {
					title: '消息中心'
				},
				title: '消息中心',
				component: () => import('@/views/settings/message/message-list.vue')
			},
			// 任务日志
			{
				path: 'jobs-list',
				icon: '',
				name: 'jobs-list',
				meta: {
					title: '任务日志',
				},
				title: '任务日志',
				component: () => import('@/views/settings/jobs-list/jobs-list.vue')
			},
			{
				path: 'brand-info',
				icon: '',
				name: 'brand-info',
				meta: {
					title: '企业信息'
				},
				title: '企业信息',
				component: () => import('@/views/settings/brand-info/brand-info.vue')
			},
			{
				path: 'user-images',
				icon: '',
				name: 'user-images',
				meta: {
					title: '素材管理'
				},
				title: '素材管理',
				component: () => import('@/views/settings/user-images-list/user-images-list.vue')
			},
			// 帮助中心
			{
				path: 'help-center',
				icon: '',
				name: 'help-center',
				meta: {
					title: '帮助中心'
				},
				title: '帮助中心',
				component: () => import('@/views/system/doc/help-center.vue')
			},
			// 历史更新说明
			{
				path: 'release-notes',
				icon: '',
				name: 'release-notes',
				meta: {
					title: '历史更新说明'
				},
				title: '历史更新说明',
				component: () => import('@/views/settings/release-notes/release-notes')
			},
			// 微页面文档
			{
				path: 'page-docs',
				icon: '',
				name: 'page-docs',
				meta: {
					title: '微页面文档'
				},
				title: '微页面文档',
				component: () => import('@/views/plugins/pages/page-docs.vue')
			}
		]
	},
	// 分销
	{
		path: '/distribution',
		icon: '',
		title: '分销',
		name: 'distribution',
		component: Main,
		children: [
			{
				path: 'distribution-setting',
				icon: '',
				name: 'distribution-setting',
				meta: {
					title: '分销设置'
				},
				title: '分销设置',
				component: () => import('@/views/distribution/staff/distribution-setting.vue')
			},
			{
				path: 'distribution-staff',
				icon: '',
				name: 'distribution-staff',
				meta: {
					title: '分销员管理'
				},
				title: '分销员管理',
				component: () => import('@/views/distribution/staff/distribution-staff/distribution-staff.vue')
			},
			{
				path: 'distribution-staff-add',
				icon: '',
				name: 'distribution-staff-add',
				meta: {
					title: '分销员创建'
				},
				title: '分销员管理创建',
				component: () => import('@/views/distribution/staff/distribution-staff/manager/manager-form.vue')
			},
			{
				path: 'distribution-staff-edit/:id',
				props: true,
				icon: '',
				name: 'distribution-staff-edit',
				meta: {
					title: '分销员编辑 '
				},
				title: '分销员管理编辑 ',
				component: () => import('@/views/distribution/staff/distribution-staff/manager/manager-form.vue')
			},
			{
				path: 'distribution-yeji/:id',
				props: true,
				icon: '',
				name: 'distribution-yeji',
				meta: {
					title: '分销员业绩'
				},
				title: '分销员业绩',
				component: () => import('@/views/distribution/staff/distribution-staff/manager/ye-ji/ye-ji-list.vue')
			},
			{
				path: 'distribution-yeer/:id',
				props: true,
				icon: '',
				name: 'distribution-yeer',
				meta: {
					title: '分销员余额'
				},
				title: '分销员余额',
				component: () => import('@/views/distribution/staff/distribution-staff/manager/yu-er/yu-er-list.vue')
			},
			{
				path: 'staff-reports',
				icon: '',
				name: 'staff-reports',
				meta: {
					title: '分销提成报表'
				},
				title: '分销提成报表',
				component: () => import('@/views/distribution/staff/staff-reports/staff-reports.vue')
			},
			{
				path: 'staff-cashout',
				icon: '',
				name: 'staff-cashout',
				meta: {
					title: '分销提现管理'
				},
				title: '分销提现管理',
				component: () => import('@/views/distribution/staff/staff-cashout/staff-cashout.vue')
			},
			{
				path: 'distribution-activity-list',
				icon: '',
				name: 'distribution-activity-list',
				meta: {
					title: '分销活动管理'
				},
				title: '分销活动管理',
				component: () => import('@/views/distribution/staff/distribution-activity/distribution-activity-list.vue')
			},
			{
				path: 'distribution-activity-config',
				icon: '',
				name: 'distribution-activity-config',
				meta: {
					title: '分销活动属性配置'
				},
				title: '分销活动属性配置',
				component: () => import('@/views/distribution/staff/distribution-activity-config/distribution-activity-list.vue')
			},
			{
				path: 'distribution-activity-report',
				icon: '',
				name: 'distribution-activity-report',
				meta: {
					title: '活动数据报表'
				},
				title: '分销活动数据报表',
				component: () => import('@/views/distribution/staff/distribution-activity-report/distribution-activity-report.vue')
			},
			{
				path: 'distribution-activity-award',
				icon: '',
				name: 'distribution-activity-award',
				meta: {
					title: '分销活动奖励'
				},
				title: '分销活动奖励',
				component: () => import('@/views/distribution/staff/staff_activity_reward/activity_reward.vue')
			},
			{
				path: 'distribution-activity-award-message',
				icon: '',
				name: 'distribution-activity-award-message',
				meta: {
					title: '分销活动编辑'
				},
				title: '分销活动编辑',
				component: () => import('@/views/distribution/staff/staff_activity_reward/message.vue')
			},
			{
				path: 'distribution-activity-award-record',
				icon: '',
				name: 'distribution-activity-award-record',
				meta: {
					title: '分销活动记录'
				},
				title: '分销活动记录',
				component: () => import('@/views/distribution/staff/staff_activity_reward/record.vue')
			},
			{
				path: 'distribution-goods-add',
				icon: '',
				name: 'distribution-goods-add',
				meta: {
					title: '热销商品创建'
				},
				title: '热销商品创建',
				component: () => import('@/views/distribution/staff/distribution-activity/hot-goods/hot-goods-form.vue')
			},
			{
				path: 'distribution-goods-edit/:id',
				props: true,
				icon: '',
				name: 'distribution-goods-edit',
				meta: {
					title: '热销商品编辑'
				},
				title: '热销商品编辑',
				component: () => import('@/views/distribution/staff/distribution-activity/hot-goods/hot-goods-form.vue')
			},
			{
				path: 'distribution-activity-add',
				icon: '',
				name: 'distribution-activity-add',
				meta: {
					title: '热销活动创建'
				},
				title: '热销活动创建',
				component: () => import('@/views/distribution/staff/distribution-activity/hot-activity/hot-activity-form.vue')
			},
			{
				path: 'distribution-activity-edit/:id',
				props: true,
				icon: '',
				name: 'distribution-activity-edit',
				meta: {
					title: '热销活动编辑'
				},
				title: '热销活动编辑',
				component: () => import('@/views/distribution/staff/distribution-activity/hot-activity/hot-activity-form.vue')
			},
			{
				path: 'distribution-apply-setting',
				icon: '',
				name: 'distribution-apply-setting',
				meta: {
					title: '申请分销员'
				},
				title: '申请分销员',
				component: () => import('@/views/distribution/staff/distribution-apply-setting.vue')
			},
			{
				path: 'distributor-report',
				icon: '',
				name: 'distributor-report',
				meta: {
					title: '付费分销员报表'
				},
				title: '付费分销员报表',
				component: () => import('@/views/distribution/staff/distributor-report/distributor-report.vue')
			},
			{
				path: 'reward-report',
				icon: '',
				name: 'reward-report',
				meta: {
					title: '分销奖励报表'
				},
				title: '分销奖励报表',
				component: () => import('@/views/distribution/staff/reward-report/reward-report.vue')
			},
			{
				path: 'distributor-reports',
				icon: '',
				name: 'distributor-reports',
				meta: {
					title: '分销员报表'
				},
				title: '分销员报表',
				component: () => import('@/views/distribution/staff/distributor-reports/distributor-reports.vue')
			},
			{
				path: 'cashout-report',
				icon: '',
				name: 'cashout-report',
				meta: {
					title: '分销提现报表'
				},
				title: '分销提现报表',
				component: () => import('@/views/distribution/staff/cashout-report/cashout-report.vue')
			},
			{
				path: 'distribution-summary-report',
				icon: '',
				name: 'distribution-summary-report',
				meta: {
					title: '分销汇总报表'
				},
				title: '分销汇总报表',
				component: () => import('@/views/distribution/staff/distribution-summary-report/index.vue')
			},
			{
				path: 'distribution-balance-list',
				icon: '',
				name: 'distribution-balance-list',
				meta: {
					title: '分销余额流水'
				},
				title: '分销余额流水',
				component: () => import('@/views/distribution/staff/distribution-balance/distribution-balance-list.vue')
			},
			{
				path: 'distribution-rank-list',
				icon: '',
				name: 'distribution-rank-list',
				meta: {
					title: '分销等级'
				},
				title: '分销等级',
				component: () => import('@/views/distribution/staff/distribution-rank/distribution-rank-list.vue')
			},
			{
				path: 'distribution-rank-setting',
				icon: '',
				name: 'distribution-rank-setting',
				meta: {
					title: '分销等级设置'
				},
				title: '分销等级设置',
				component: () => import('@/views/distribution/staff/distribution-rank-setting/distribution-rank-setting.vue')
			},
			{
				path: 'distribution-rank-add/:id',
				props: true,
				icon: '',
				name: 'distribution-rank-add',
				meta: {
					title: '分销等级设置创建'
				},
				title: '分销等级设置创建',
				component: () => import('@/views/distribution/staff/distribution-rank-setting/distribution-rank-form.vue')
			},
			{
				path: 'distribution-coupons-activity',
				icon: '',
				name: 'distribution-coupons-activity',
				meta: {
					title: '分销派券活动'
				},
				title: '分销派券活动',
				component: () => import('@/views/distribution/coupon/distribution-coupons-activity/index.vue')
			},
			{
				path: 'distribution-coupons-form',
				icon: '',
				name: 'distribution-coupons-form',
				meta: {
					title: '创建分销派券活动'
				},
				title: '创建分销派券活动',
				component: () => import('@/views/distribution/coupon/distribution-coupons-activity/distribution-form.vue')
			},
			{
				path: 'distribution-coupons-edit/:id',
				props: true,
				icon: '',
				name: 'distribution-coupons-edit',
				meta: {
					title: '编辑分销派券活动'
				},
				title: '编辑分销派券活动',
				component: () => import('@/views/distribution/coupon/distribution-coupons-activity/distribution-form.vue')
			}, 
			{
				path: 'pai-coupons-form/:id',
				props: true,
				icon: '',
				name: 'pai-coupons-form',
				meta: {
					title: '派券活动'
				},
				title: '派券活动',
				component: () => import('@/views/distribution/coupon/distribution-coupons-activity/pai-form.vue')
			},
			{
				path: 'pai-water-form/:id',
				props: true,
				icon: '',
				name: 'pai-water-form',
				meta: {
					title: '派券活动流水账'
				},
				title: '派券活动流水账',
				component: () => import('@/views/distribution/coupon/distribution-coupons-activity/water-zhan.vue')
			},
			{
				path: 'distribution-coupons-report',
				icon: '',
				name: 'distribution-coupons-report',
				meta: {
					title: '派券活动报表'
				},
				title: '派券活动报表',
				component: () => import('@/views/distribution/coupon/distribution-coupons-report/index.vue')
			},
			{
				path: 'distribution-tpl-setting',
				icon: '',
				name: 'distribution-tpl-setting',
				meta: {
					title: '模板维护'
				},
				title: '模板维护',
				component: () => import('@/views/distribution/message/distribution-tpl-setting/distribution-tpl-setting.vue')
			},
			{
				path: 'distribution-tpl-push',
				icon: '',
				name: 'distribution-tpl-push',
				meta: {
					title: '模板推送'
				},
				title: '模板推送',
				component: () => import('@/views/distribution/message/distribution-tpl-push/distribution-tpl-push.vue')
			},
			{
				path: 'distribution-tpl-form-add',
				icon: '',
				name: 'distribution-tpl-form-add',
				meta: {
					title: '模板推送创建'
				},
				title: '模板推送创建',
				component: () => import('@/views/distribution/message/distribution-tpl-push/distribution-tpl-form.vue')
			},
		],
	},
	// 数据
	{
		path: '/data',
		icon: '',
		title: '数据',
		name: 'data',
		component: Main,
		children: [{
				path: 'today-visit',
				icon: '',
				name: 'today-visit',
				meta: {
					title: '当日访问统计'
				},
				title: '当日访问统计',
				component: () => import('@/views/data/visit/today-visit.vue')
			},
			{
				path: 'tags-user-list/:id',
				icon: '',
				name: 'tags-user-list',
				meta: {
					title: '标签用户列表'
				},
				title: '标签用户列表',
				component: () => import('@/views/data/tags/tags-user-list.vue')
			},
			{
				path: 'history-visit',
				icon: '',
				name: 'history-visit',
				meta: {
					title: '历史访问统计'
				},
				title: '历史访问统计',
				component: () => import('@/views/data/visit/history-visit.vue')
			},
			{
				path: 'page-visit',
				icon: '',
				name: 'page-visit',
				meta: {
					title: '页面访问统计'
				},
				title: '页面访问统计',
				component: () => import('@/views/data/visit/page-visit.vue')
			},
			{
				path: 'basic-channel',
				icon: '',
				name: 'basic-channel',
				meta: {
					title: '来源列表'
				},
				title: '来源列表',
				component: () => import('@/views/data/source/source-list.vue')
			},
			{
				path: 'channel-stats',
				icon: '',
				name: 'channel-stats',
				meta: {
					title: '来源访问统计'
				},
				title: '来源访问统计',
				component: () => import('@/views/data/source/source-stats.vue')
			},
			{
				path: 'custom-channel',
				icon: '',
				name: 'custom-channel',
				meta: {
					title: '自定义渠道统计'
				},
				title: '自定义渠道统计',
				component: () => import('@/views/data/source/custom-source.vue')
			},
			{
				path: 'custom-channel-details',
				icon: '',
				name: 'custom-channel-details',
				meta: {
					title: '自定义渠道详情'
				},
				title: '自定义渠道详情',
				component: () => import('@/views/data/source/custom-stats.vue')
			},
			{
				path: 'code-channel',
				icon: '',
				name: 'code-channel',
				meta: {
					title: '二维码渠道'
				},
				title: '二维码渠道',
				component: () => import('@/views/data/source/code-source.vue')
			},
			{
				path: 'code-channel-details',
				icon: '',
				name: 'code-channel-details',
				meta: {
					title: '二维码渠道详情'
				},
				title: '二维码渠道详情',
				component: () => import('@/views/data/source/code-source-stats.vue')
			},
			{
				path: 'behavior-visit',
				icon: '',
				name: 'behavior-visit',
				meta: {
					title: '行为统计'
				},
				title: '行为统计',
				component: () => import('@/views/data/visit/behavior-visit.vue')
			},

			{
				path: 'goods-visit',
				icon: '',
				name: 'goods-visit',
				meta: {
					title: '商品访问统计'
				},
				title: '商品访问统计',
				component: () => import('@/views/data/visit/goods-visit.vue')
			},
			// {
			// 	path: 'develop-ranking',
			// 	icon: '',
			// 	name: 'develop-ranking',
			// 	meta: {
			// 		title: '会员发展排名'
			// 	},
			// 	title: '会员发展排名',
			// 	component: () => import('@/views/data/user-stats/develop-ranking.vue')
			// },
			{
				path: 'user-total-stats',
				icon: '',
				name: 'user-total-stats',
				meta: {
					title: '会员总量统计'
				},
				title: '会员总量统计',
				component: () => import('@/views/data/member/total-detail-stats/total-detail-stats.vue')
			},
			{
				path: 'new-user-list',
				icon: '',
				name: 'new-user-list',
				meta: {
					title: '会员平台来源'
				},
				title: '会员平台来源',
				component: () => import('@/views/data/member/total-source-stats/total-source-stats.vue')
			},
			{
				path: 'new-user-care-list',
				icon: '',
				name: 'new-user-care-list',
				meta: {
					title: '会员关怀统计'
				},
				title: '会员关怀统计',
				component: () => import('@/views/data/member/total-care-stats/total-care-stats.vue')
			},
			{
				path: 'user-dynamic',
				icon: '',
				name: 'user-dynamic',
				meta: {
					title: '会员动态分析'
				},
				title: '会员动态分析',
				component: () => import('@/views/data/member/total-dynamic-stats/total-dynamic-stats.vue')
			},
			{
				path: 'coupons-stats',
				icon: '',
				name: 'coupons-stats',
				meta: {
					title: '优惠券统计'
				},
				title: '优惠券统计',
				component: () => import('@/views/data/assets-stats/coupon/coupons-stats.vue')
			},
			{
				path: 'sales-stats',
				icon: '',
				name: 'sales-stats',
				meta: {
					title: '销售统计'
				},
				title: '销售统计',
				component: () => import('@/views/data/sales-stats/sales-stats.vue')
			},
			{
				path: 'sales-detail',
				icon: '',
				name: 'sales-detail',
				meta: {
					title: '销售明细'
				},
				title: '销售明细',
				component: () => import('@/views/data/sales-stats/sales-detail.vue')
			},
			{
				path: 'return-stats',
				icon: '',
				name: 'return-stats',
				meta: {
					title: '退货统计'
				},
				title: '退货统计',
				component: () => import('@/views/data/sales-stats/return-stats.vue')
			},
			{
				path: 'sales-order_list',
				icon: '',
				name: 'sales-order_list',
				meta: {
					title: '订单统计'
				},
				title: '订单统计',
				component: () => import('@/views/data/sales-stats/order-stats.vue')
			},
			{
				path: 'goods-comment-stats',
				icon: '',
				name: 'goods-comment-stats',
				meta: {
					title: '商品评论统计'
				},
				title: '商品评论统计',
				component: () => import('@/views/data/comment-stats/goods-comment-stats.vue')
			},
			{
				path: 'store-comment-stats',
				icon: '',
				name: 'store-comment-stats',
				meta: {
					title: '店铺评论统计'
				},
				title: '店铺评论统计',
				component: () => import('@/views/data/comment-stats/store-comment-stats.vue')
			},
			{
				path: 'ad-space-stats',
				icon: '',
				name: 'ad-space-stats',
				meta: {
					title: '广告位统计'
				},
				title: '广告位统计',
				component: () => import('@/views/data/ad-space/ad-space-stats.vue')
			},
			{
				path: 'other-finance-stats-list',
				icon: '',
				name: 'other-finance-stats-list',
				meta: {
					title: '财务报表'
				},
				title: '财务报表',
				component: () => import('@/views/data/other/finance/finance-report.vue')
			},
		]
	},
	// 门店
	{
		path: '/stores',
		icon: '',
		title: '门店',
		name: 'stores',
		component: Main,
		children: [{
				path: 'store-list',
				icon: '',
				name: 'store-list',
				meta: {
					title: '门店列表'
				},
				title: '门店列表',
				component: () => import('@/views/stores/store-info/store-info.vue')
			},
			{
				path: 'store-add',
				props: true,
				name: 'store-add',
				meta: {
					title: '门店添加'
				},
				title: '门店添加',
				component: () => import('@/views/stores/store-info/store-list/store-form.vue')
			},
			{
				path: 'store-edit/:id',
				props: true,
				name: 'store-edit',
				meta: {
					title: '门店编辑'
				},
				title: '门店编辑',
				component: () => import('@/views/stores/store-info/store-list/store-form.vue')
			},
			{
				path: 'staff-list',
				icon: '',
				name: 'staff-list',
				meta: {
					title: '店员列表'
				},
				title: '店员列表',
				component: () => import('@/views/stores/staff-info/staff-info.vue')
			},
			{
				path: 'staff-create',
				icon: '',
				name: 'staff-create',
				meta: {
					title: '店员创建'
				},
				title: '店员创建',
				component: () => import('@/views/stores/staff-info/staff-list/staff-form.vue')
			},
			{
				path: 'staff-edit/:id',
				props: true,
				icon: '',
				name: 'staff-edit',
				meta: {
					title: '店员编辑'
				},
				title: '店员编辑',
				component: () => import('@/views/stores/staff-info/staff-list/staff-form.vue')
			},
			{
				path: 'shoppers-setting',
				icon: '',
				name: 'shoppers-setting',
				meta: {
					title: '导购组设置'
				},
				title: '导购组设置',
				component: () => import('@/views/stores/guide-group/guide-group-list.vue')
			},
			{
				path: 'member-list/:id',
				props: true,
				icon: '',
				name: 'member-list',
				meta: {
					title: '导购员列表'
				},
				title: '导购员列表',
				component: () => import('@/views/stores/guide-group/group-member/member-list.vue')
			},
			{
				path: 'fansreport-list',
				icon: '',
				name: 'fansreport-list',
				meta: {
					title: '吸粉统计报表'
				},
				title: '吸粉统计报表',
				component: () => import('@/views/stores/fan-statistics/fan-list.vue')
			},
			{
				path: 'pkreport-list',
				icon: '',
				name: 'pkreport-list',
				meta: {
					title: 'pk报表'
				},
				title: 'pk报表',
				component: () => import('@/views/stores/pk-statistics/pk-list.vue')
			},
			{
				path: 'channel-list',
				icon: '',
				name: 'channel-list',
				meta: {
					title: '渠道列表'
				},
				title: '渠道列表',
				component: () => import('@/views/stores/area-list/area-list.vue')
			},
			{
				path: 'area-allocation/:agent',
				props: true,
				icon: '',
				name: 'area-allocation',
				meta: {
					title: '转移店铺'
				},
				title: '转移店铺',
				component: () => import('@/views/stores/area-list/area-allocation.vue')
			},
			{
				path: 'store-navigation-group',
				props: true,
				icon: '',
				name: 'store-navigation-group',
				meta: {
					title: '店铺导航分组'
				},
				title: '店铺导航分组',
				component: () => import('@/views/stores/store-nav-group/store-group.vue')
			},
			{
				path: 'store-nav-list',
				props: true,
				icon: '',
				name: 'store-nav-list',
				meta: {
					title: '导航店铺列表'
				},
				title: '导航店铺列表',
				component: () => import('@/views/stores/store-nav-group/store-list.vue')
			},
			
			{
				path: 'store-index-group',
				props: true,
				icon: '',
				name: 'store-index-group',
				meta: {
					title: '店铺首页分组'
				},
				title: '店铺首页分组',
				component: () => import('@/views/stores/homepage-group/store-homepage-group.vue')
			},
			{
				path: 'store-index-list',
				props: true,
				icon: '',
				name: 'store-index-list',
				meta: {
				},
				title: '首页店铺列表',
				component: () => import('@/views/stores/homepage-group/store-list.vue')
			},

            {
                path: 'pickup-goods-group',
                props: true,
                icon: '',
                name: 'pickup-goods-group',
                meta: {
                    title: '自提商品分组'
                },
                title: '自提商品分组',
                component: () => import('@/views/stores/pickup-goods-group/store-group.vue')
            },
			{
                path: 'store-group-list',
                props: true,
                icon: '',
                name: 'store-group-list',
                meta: {
                    title: '自提商品分组-店铺列表'
                },
                title: '自提商品分组-店铺列表',
                component: () => import('@/views/stores/pickup-goods-group/pickup-store-list.vue')
            },
			{
                path: 'goods-group-list',
                props: true,
                icon: '',
                name: 'goods-group-list',
                meta: {
                    title: '自提商品分组-商品列表'
                },
                title: '自提商品分组-商品列表',
                component: () => import('@/views/stores/pickup-goods-group/pickup-goods-list.vue')
            },
			
		]
	},
	// 文章详情
	{
		path: '/article/info/:code',
		icon: '',
		name: 'article-info',
		meta: {
			title: '文章详情'
		},
		title: '文章详情',
		component: () => import('@/views/plugins/articles/article-info.vue')
	},
	// 组件
	{
		path: '/plugins',
		icon: '',
		title: '组件',
		name: 'plugins',
		component: Main,
		children: [{
				path: 'plugin-list',
				icon: '',
				name: 'plugin-list',
				meta: {
					title: '组件列表'
				},
				title: '组件列表',
				component: () => import('@/views/plugins/plugin-list/plugin-list.vue')
			},
			// 组件的路由
			{
				path: 'weixin',
				icon: '',
				name: 'weixin',
				meta: {
					title: '微信公众号'
				},
				title: '微信公众号',
				component: () => import('@/views/plugins/weixin/index.vue')
			},
			{
				path: 'weapp',
				icon: '',
				name: 'weapp',
				meta: {
					title: '微信小程序'
				},
				title: '微信小程序',
				component: () => import('@/views/plugins/weapp/weapp.vue')
			},
			{
				path: 'weapp-user-center',
				icon: '',
				name: 'weapp-user-center',
				meta: {
					title: '小程序个人中心'
				},
				title: '小程序个人中心',
				component: () => import('@/views/plugins/weapp/weapp-user-center.vue')
			},
			{
				path: 'weapp-goods-cat-page',
				icon: '',
				name: 'weapp-goods-cat-page',
				meta: {
					title: '小程序商品类目页面设置'
				},
				title: '小程序商品类目页面设置',
				component: () => import('@/views/plugins/weapp/weapp-goods-cat-page.vue')
			},
			{
				path: 'weapp-goods-qrcode',
				icon: '',
				name: 'weapp-goods-qrcode',
				meta: {
					title: '小程序商品二维码'
				},
				title: '小程序商品二维码',
				component: () => import('@/views/plugins/weapp/weapp-goods-qrcode.vue')
			},
			{
				path: 'weapp-visit-stats',
				icon: '',
				name: 'weapp-visit-stats',
				meta: {
					title: '小程序访问统计'
				},
				title: '小程序访问统计',
				component: () => import('@/views/plugins/weapp/weapp-visit-stats.vue')
			},
			{
				path: 'weapp-history-visit',
				icon: '',
				name: 'weapp-history-visit',
				meta: {
					title: '小程序历史访问统计'
				},
				title: '小程序历史访问统计',
				component: () => import('@/views/plugins/weapp/weapp-history-visit.vue')
			},
			{
				path: 'weapp-goods-visit',
				icon: '',
				name: 'weapp-goods-visit',
				meta: {
					title: '小程序商品访问统计'
				},
				title: '小程序商品访问统计',
				component: () => import('@/views/plugins/weapp/weapp-goods-visit.vue')
			},
			{
				path: 'weixin-pay',
				icon: '',
				name: 'weixin-pay',
				meta: {
					title: '微信支付设置',
				},
				title: '微信支付设置',
				component: () => import('@/views/plugins/weixin/weixin-pay.vue')
			},
			{
				path: 'user-feedback',
				icon: '',
				name: 'user-feedback',
				meta: {
					title: '会员意见反馈'
				},
				title: '会员意见反馈',
				component: () => import('@/views/plugins/user-feedback/user-feedback.vue')
			},
			{
				path: 'turntable',
				icon: '',
				name: 'turntable',
				meta: {
					title: '大转盘'
				},
				title: '大转盘',
				component: () => import('@/views/plugins/turntable/turntable.vue')
			},
			{
				path: 'turntable/:page_id',
				icon: '',
				name: 'turntable-info',
				meta: {
					title: '大转盘活动设置'
				},
				title: '大转盘活动设置',
				component: () => import('@/views/plugins/turntable/turntable.vue')
			},
			{
				path: 'turntable/log/:page_id',
				icon: '',
				name: 'turntable-log',
				meta: {
					title: '大转盘数据'
				},
				title: '大转盘数据',
				component: () => import('@/views/plugins/turntable/turntable-log.vue')
			},

			// 砍价活动组件
			{
				path: 'kan-activity-list',
				icon: '',
				name: 'kan-activity-list',
				meta: {
					title: '砍价活动'
				},
				title: '砍价活动',
				component: () => import('@/views/plugins/kan-activity/activity/kan-activity-list.vue')
			},
			{
				path: 'kan-activity-add',
				icon: '',
				name: 'kan-activity-add',
				meta: {
					title: '砍价活动创建'
				},
				title: '砍价活动创建',
				component: () => import('@/views/plugins/kan-activity/activity/kan-activity-form.vue')
			},
			{
				path: 'kan-activity-edit/:id',
				props: true,
				icon: '',
				name: 'kan-activity-edit',
				meta: {
					title: '砍价活动编辑'
				},
				title: '砍价活动编辑',
				component: () => import('@/views/plugins/kan-activity/activity/kan-activity-form.vue')
			},
			{
				path: 'kan-activity-statistics/:id',
				props: true,
				icon: '',
				name: 'kan-activity-statistics',
				meta: {
					title: '砍价活动数据统计'
				},
				title: '砍价活动数据统计',
				component: () => import('@/views/plugins/kan-activity/statistics/statistics.vue')
			},
			{
				path: 'kan-order-list',
				icon: '',
				name: 'kan-order-list',
				meta: {
					title: '砍价订单'
				},
				title: '砍价订单',
				component: () => import('@/views/plugins/kan-activity/order/kan-order-list.vue')
			},
			{
				path: 'kan-order-info/:sn',
				props: true,
				icon: '',
				name: 'kan-order-info',
				meta: {
					title: '砍价订单详情'
				},
				title: '砍价订单详情',
				component: () => import('@/views/plugins/kan-activity/order/order-info/order-info.vue')
			},
			{
				path: 'kan-report',
				icon: '',
				name: 'kan-report',
				meta: {
					title: '砍价报表'
				},
				title: '砍价报表',
				component: () => import('@/views/plugins/kan-activity/report/bargin-report.vue')
			},

			//砍价活动（云店）
            {
                path: 'shop-kan-activity-list',
                icon: '',
                name: 'shop-kan-activity-list',
                meta: {
                    title: '砍价活动'
                },
                title: '砍价活动',
                component: () => import('@/views/cloud-shop/plugins/kan-activity/activity/kan-activity-list.vue')
            },
            {
                path: 'shop-kan-activity-add',
                icon: '',
                name: 'shop-kan-activity-add',
                meta: {
                    title: '砍价活动创建'
                },
                title: '砍价活动创建',
                component: () => import('@/views/cloud-shop/plugins/kan-activity/activity/kan-activity-form.vue')
            },
            {
                path: 'shop-kan-activity-edit/:id',
                props: true,
                icon: '',
                name: 'shop-kan-activity-edit',
                meta: {
                    title: '砍价活动编辑'
                },
                title: '砍价活动编辑',
                component: () => import('@/views/cloud-shop/plugins/kan-activity/activity/kan-activity-form.vue')
            },
            {
                path: 'shop-kan-activity-statistics/:id',
                props: true,
                icon: '',
                name: 'shop-kan-activity-statistics',
                meta: {
                    title: '砍价活动数据统计'
                },
                title: '砍价活动数据统计',
                component: () => import('@/views/cloud-shop/plugins/kan-activity/statistics/statistics.vue')
            },
            {
                path: 'shop-kan-order-list',
                icon: '',
                name: 'shop-kan-order-list',
                meta: {
                    title: '砍价订单'
                },
                title: '砍价订单',
                component: () => import('@/views/cloud-shop/plugins/kan-activity/order/kan-order-list.vue')
            },
            {
                path: 'shop-kan-order-info/:sn',
                props: true,
                icon: '',
                name: 'shop-kan-order-info',
                meta: {
                    title: '砍价订单详情'
                },
                title: '砍价订单详情',
                component: () => import('@/views/cloud-shop/plugins/kan-activity/order/order-info/order-info.vue')
            },
            {
                path: 'shop-kan-report',
                icon: '',
                name: 'shop-kan-report',
                meta: {
                    title: '砍价报表'
                },
                title: '砍价报表',
                component: () => import('@/views/cloud-shop/plugins/kan-activity/report/bargin-report.vue')
            },


			// 积分商城
			{
				path: 'integral-goods',
				icon: '',
				name: 'integral-goods',
				meta: {
					title: '积分商品'
				},
				title: '积分商品',
				component: () => import('@/views/plugins/integral-mall/activity/integral-goods-list.vue')
			},
			{
				path: 'integral-goods-add',
				icon: '',
				name: 'integral-goods-add',
				meta: {
					title: '积分商品创建'
				},
				title: '积分商品创建',
				component: () => import('@/views/plugins/integral-mall/activity/integral-goods-form.vue')
			},
			{
				path: 'integral-goods-edit/:id',
				props: true,
				icon: '',
				name: 'integral-goods-edit',
				meta: {
					title: '积分商品编辑'
				},
				title: '积分商品编辑',
				component: () => import('@/views/plugins/integral-mall/activity/integral-goods-form.vue')
			},
			{
				path: 'integral-coupons',
				icon: '',
				name: 'integral-coupons',
				meta: {
					title: '积分换券'
				},
				title: '积分换券',
				component: () => import('@/views/plugins/integral-mall/exchange/integral-coupons-list.vue')
			},
			{
				path: 'integral-coupons-add',
				icon: '',
				name: 'integral-coupons-add',
				meta: {
					title: '积分换券创建'
				},
				title: '积分换券创建',
				component: () => import('@/views/plugins/integral-mall/exchange/integral-coupons-form.vue')
			},
			{
				path: 'integral-coupons-edit/:id',
				props: true,
				icon: '',
				name: 'integral-coupons-edit',
				meta: {
					title: '积分换券编辑'
				},
				title: '积分换券编辑',
				component: () => import('@/views/plugins/integral-mall/exchange/integral-coupons-form.vue')
			},
			{
				path: 'integral-exchange-log',
				icon: '',
				name: 'integral-exchange-log',
				meta: {
					title: '兑换记录'
				},
				title: '兑换记录',
				component: () => import('@/views/plugins/integral-mall/record/integral-exchange-log.vue')
			},

			// 秒杀组件
			{
				path: 'seckill-activity',
				icon: '',
				name: 'seckill-activity',
				meta: {
					title: '秒杀活动'
				},
				title: '秒杀活动',
				component: () => import('@/views/plugins/seckill/seckill-activity/seckill-activity.vue')
			},
			{
				path: 'seckill-activity-add',
				icon: '',
				name: 'seckill-activity-add',
				meta: {
					title: '秒杀活动创建'
				},
				title: '秒杀活动创建',
				component: () => import('@/views/plugins/seckill/seckill-activity/activity/seckill-activity-form.vue')
			},
			{
				path: 'seckill-activity-edit/:id',
				props: true,
				icon: '',
				name: 'seckill-activity-edit',
				meta: {
					title: '秒杀活动编辑'
				},
				title: '秒杀活动编辑',
				component: () => import('@/views/plugins/seckill/seckill-activity/activity/seckill-activity-form.vue')
			},
			{
				path: 'seckill-activity-statistics/:id',
				props: true,
				icon: '',
				name: 'seckill-activity-statistics',
				meta: {
					title: '秒杀活动数据统计'
				},
				title: '秒杀活动创建数据统计',
				component: () => import('@/views/plugins/seckill/statistics/statistics.vue')
			},
			{
				path: 'seckill-group',
				icon: '',
				name: 'seckill-group',
				meta: {
					title: '秒杀分组'
				},
				title: '秒杀分组',
				component: () => import('@/views/plugins/seckill/seckill-group/seckill-group.vue')
			},
			{
				path: 'seckill-order',
				icon: '',
				name: 'seckill-order',
				meta: {
					title: '秒杀订单'
				},
				title: '秒杀订单',
				component: () => import('@/views/plugins/seckill/seckill-order/seckill-order-list.vue')
			},
			{
				path: 'seckill-order-details/:sn',
				props: true,
				icon: '',
				name: 'seckill-order-details',
				meta: {
					title: '秒杀订单详情'
				},
				title: '秒杀订单详情',
				component: () => import('@/views/plugins/seckill/seckill-order/order-info/order-info.vue')
			},
			{
				path: 'official-account',
				props: true,
				icon: '',
				name: 'official-account',
				meta: {
					title: '关注公众号提醒'
				},
				title: '关注公众号提醒',
				component: () => import('@/views/plugins/seckill/official-account/official-account.vue')
			},
			{
					path: 'seckill-activity-report',
					icon: '',
					name: 'seckill-activity-report',
					meta: {
							title: '秒杀活动报表'
					},
					title: '秒杀活动报表',
					component: () => import('@/views/plugins/seckill/seckill-activity-report/seckill-activity.vue')
			},

			//助力秒杀（云店模块）
            {
                path: 'shop-seckill-activity',
                icon: '',
                name: 'shop-seckill-activity',
                meta: {
                    title: '秒杀活动'
                },
                title: '秒杀活动',
                component: () => import('@/views/cloud-shop/plugins/seckill/seckill-activity/seckill-activity.vue')
            },
            {
                path: 'shop-seckill-activity-add',
                icon: '',
                name: 'shop-seckill-activity-add',
                meta: {
                    title: '秒杀活动创建'
                },
                title: '秒杀活动创建',
                component: () => import('@/views/cloud-shop/plugins/seckill/seckill-activity/activity/seckill-activity-form.vue')
            },
            {
                path: 'shop-seckill-activity-edit/:id',
                props: true,
                icon: '',
                name: 'shop-seckill-activity-edit',
                meta: {
                    title: '秒杀活动编辑'
                },
                title: '秒杀活动编辑',
                component: () => import('@/views/cloud-shop/plugins/seckill/seckill-activity/activity/seckill-activity-form.vue')
            },
            {
                path: 'shop-seckill-activity-statistics/:id',
                props: true,
                icon: '',
                name: 'shop-seckill-activity-statistics',
                meta: {
                    title: '秒杀活动数据统计'
                },
                title: '秒杀活动创建数据统计',
                component: () => import('@/views/cloud-shop/plugins/seckill/statistics/statistics.vue')
            },
            {
                path: 'shop-seckill-group',
                icon: '',
                name: 'shop-seckill-group',
                meta: {
                    title: '秒杀分组'
                },
                title: '秒杀分组',
                component: () => import('@/views/cloud-shop/plugins/seckill/seckill-group/seckill-group.vue')
            },
            {
                path: 'shop-seckill-order',
                icon: '',
                name: 'shop-seckill-order',
                meta: {
                    title: '秒杀订单'
                },
                title: '秒杀订单',
                component: () => import('@/views/cloud-shop/plugins/seckill/seckill-order/seckill-order-list.vue')
            },
            {
                path: 'shop-seckill-order-details/:sn',
                props: true,
                icon: '',
                name: 'shop-seckill-order-details',
                meta: {
                    title: '秒杀订单详情'
                },
                title: '秒杀订单详情',
                component: () => import('@/views/cloud-shop/plugins/seckill/seckill-order/order-info/order-info.vue')
            },
            {
                path: 'shop-official-account',
                props: true,
                icon: '',
                name: 'shop-official-account',
                meta: {
                    title: '关注公众号提醒'
                },
                title: '关注公众号提醒',
                component: () => import('@/views/cloud-shop/plugins/seckill/official-account/official-account.vue')
            },
			{
				path: 'shop-seckill-activity-report',
				icon: '',
				name: 'shop-seckill-activity-report',
				meta: {
						title: '秒杀活动报表'
				},
				title: '秒杀活动报表',
				component: () => import('@/views/cloud-shop/plugins/seckill/seckill-activity-report/seckill-activity.vue')
			},
			// 种草社区

			// 预存营销 - 店铺充值卡
			{
				path: 'store-rechargecard',
				icon: '',
				name: 'store-rechargecard',
				meta: {
					title: '店铺充值卡'
				},
				title: '店铺充值卡',
				component: () => import('@/views/plugins/marketing/rechargecard/rechargecard-activity.vue')
			},
			{
				path: 'store-rechargecard-add',
				icon: '',
				name: 'store-rechargecard-add',
				meta: {
					title: '店铺充值卡创建'
				},
				title: '店铺充值卡创建',
				component: () => import('@/views/plugins/marketing/rechargecard/rechargecard-activity-form.vue')
			},
			{
				path: 'store-rechargecard-edit/:id',
				props: true,
				icon: '',
				name: 'store-rechargecard-edit',
				meta: {
					title: '店铺充值卡编辑'
				},
				title: '店铺充值卡编辑',
				component: () => import('@/views/plugins/marketing/rechargecard/rechargecard-activity-form.vue')
			},
			{
				path: 'store-rechargecard-goods',
				icon: '',
				name: 'store-rechargecard-goods',
				meta: {
					title: '店铺充值卡商品'
				},
				title: '店铺充值卡商品',
				component: () => import('@/views/plugins/marketing/rechargecard/goods/rechargecard-activity-goods.vue')
			},
			{
				path: 'store-rechargecard-activity',
				icon: '',
				name: 'store-rechargecard-activity',
				meta: {
					title: '店铺充值活动'
				},
				title: '店铺充值活动',
				component: () => import('@/views/plugins/marketing/rechargecard-activity/rechargecard-activity.vue')
			},
			{
				path: 'store-rechargecard-activity-add',
				icon: '',
				name: 'store-rechargecard-activity-add',
				meta: {
					title: '店铺充值活动创建'
				},
				title: '店铺充值活动创建',
				component: () => import('@/views/plugins/marketing/rechargecard-activity/rechargecard-activity-form.vue')
			},
			{
				path: 'store-rechargecard-activity-edit/:id',
				props: true,
				icon: '',
				name: 'store-rechargecard-activity-edit',
				meta: {
					title: '店铺充值活动编辑'
				},
				title: '店铺充值活动编辑',
				component: () => import('@/views/plugins/marketing/rechargecard-activity/rechargecard-activity-form.vue')
			},
			{
				path: 'store-rechargecard-coupons',
				icon: '',
				name: 'store-rechargecard-coupons',
				meta: {
					title: '店铺充值送券'
				},
				title: '店铺充值送券',
				component: () => import('@/views/plugins/marketing/rechargecard-setting/rechargecard-setting.vue' )
			},
			{
				path: 'store-rechargecard-coupons-add',
				icon: '',
				name: 'store-rechargecard-coupons-add',
				meta: {
					title: '店铺充值送券创建'
				},
				title: '店铺充值送券创建',
				component: () => import('@/views/plugins/marketing/rechargecard-setting/rechargecard-setting-form.vue' )
			},
			{
				path: 'store-rechargecard-coupons-edit/:id',
				props: true,
				icon: '',
				name: 'store-rechargecard-coupons-edit',
				meta: {
					title: '店铺充值送券编辑'
				},
				title: '店铺充值送券编辑',
				component: () => import('@/views/plugins/marketing/rechargecard-setting/rechargecard-setting-form.vue' )
			},
			// 注册营销
			{
				path: 'register-rule',
				icon: '',
				name: 'register-rule',
				meta: {
					title: '新会员营销规则'
				},
				title: '新会员营销规则',
				component: () => import('@/views/plugins/register-activity/rules/register-rule.vue')
			},
			{
				path: 'register-activity',
				icon: '',
				name: 'register-activity',
				meta: {
					title: '注册大礼包活动'
				},
				title: '注册大礼包活动',
				component: () => import('@/views/plugins/register-activity/activity/register-activity.vue')
			},
			{
				path: 'register-activity-add',
				icon: '',
				name: 'register-activity-add',
				meta: {
					title: '注册大礼包活动创建'
				},
				title: '注册大礼包活动创建',
				component: () => import('@/views/plugins/register-activity/activity/register-activity-form.vue')
			},
			{
				path: 'register-activity-edit/:id',
				props: true,
				icon: '',
				name: 'register-activity-edit',
				meta: {
					title: '注册大礼包活动编辑'
				},
				title: '注册大礼包活动编辑',
				component: () => import('@/views/plugins/register-activity/activity/register-activity-form.vue')
			},
			{
				path: 'register-activity-record/:id',
				props: true,
				icon: '',
				name: 'register-activity-record',
				meta: {
					title: '注册大礼包活动记录'
				},
				title: '注册大礼包活动记录',
				component: () => import('@/views/plugins/register-activity/activity/record/record-list.vue')
			},
			{
				path: 'register-activity-qrcode/:id',
				props: true,
				icon: '',
				name: 'register-activity-qrcode',
				meta: {
					title: '注册大礼包二维码'
				},
				title: '注册大礼包二维码',
				component: () => import('@/views/plugins/register-activity/activity/qrcode/qrcode-list.vue')
			},
			// 注册营销-- 邀请有奖
			{
				path: 'invite-prize-list',
				props: true,
				icon: '',
				name: 'invite-prize-list',
				meta: {
					title: '邀请有奖'
				},
				title: '邀请有奖',
				component: () => import('@/views/plugins/register-activity/invite-reward/invite-list.vue')
			},
			{
				path: 'invite-prize-detail',
				props: true,
				icon: '',
				name: 'invite-prize-detail',
				meta: {
					title: '邀请有奖详情'
				},
				title: '邀请有奖详情',
				component: () => import('@/views/plugins/register-activity/invite-reward/invite-list-form.vue')
			},
			// 分享有礼
			{
					path: 'share-activity',
					icon: '',
					name: 'share-activity',
					meta: {
							title: '分享有礼活动列表'
					},
					title: '分享有礼活动列表',
					component: () => import('@/views/plugins/share-activity/activity/share-activity.vue')
			},
			{
					path: 'share-activity-add',
					icon: '',
					name: 'share-activity-add',
					meta: {
							title: '分享有礼活动创建'
					},
					title: '分享有礼活动创建',
					component: () => import('@/views/plugins/share-activity/activity/share-activity-form.vue')
			},
			{
					path: 'share-activity-edit/:id',
					props: true,
					icon: '',
					name: 'share-activity-edit',
					meta: {
							title: '分享有礼活动编辑'
					},
					title: '分享有礼活动编辑',
					component: () => import('@/views/plugins/share-activity/activity/share-activity-form.vue')
			},

			// 邀请有礼
			{
				path: 'invitation-activity',
				icon: '',
				name: 'invitation-activity',
				meta: {
					title: '邀请有礼活动'
				},
				title: '邀请有礼活动',
				component: () => import('@/views/plugins/invitation-activity/activity/invitation-activity.vue')
			},
			{
				path: 'invitation-activity-add',
				icon: '',
				name: 'invitation-activity-add',
				meta: {
					title: '邀请有礼活动创建'
				},
				title: '邀请有礼活动创建',
				component: () => import('@/views/plugins/invitation-activity/activity/invitation-activity-form.vue')
			},
			{
				path: 'record-list',
				icon: '',
				name: 'record-list',
				meta: {
					title: '邀请有礼活动创建'
				},
				title: '邀请有礼活动创建',
				component: () => import('@/views/plugins/invitation-activity/activity/record.vue')
			},
			{
				path: 'invitation-page',
				icon: '',
				name: 'invitation-page',
				meta: {
					title: '邀请页面'
				},
				title: '邀请页面',
				component: () => import('@/views/plugins/invitation-activity/invitation-page.vue')
			},
			
			{
				path: 'invitation-article',
				icon: '',
				name: 'invitation-article',
				meta: {
					title: '文章资讯页'
				},
				title: '文章资讯页',
				component: () => import('@/views/plugins/invitation-activity/invitation-article.vue')
			},

			// 签到活动
			{
				path: 'sign-activity',
				icon: '',
				name: 'sign-activity',
				meta: {
					title: '签到活动'
				},
				title: '签到活动',
				component: () => import('@/views/plugins/sign-activity/activity-list.vue')
			},
			{
				path: 'sign-activity-add',
				icon: '',
				name: 'sign-activity-add',
				meta: {
					title: '签到活动创建'
				},
				title: '签到活动创建',
				component: () => import('@/views/plugins/sign-activity/sign-activity-form.vue')
			},
			{
				path: 'sign-activity-edit/:id',
				props: true,
				icon: '',
				name: 'sign-activity-edit',
				meta: {
					title: '签到活动编辑'
				},
				title: '签到活动编辑',
				component: () => import('@/views/plugins/sign-activity/sign-activity-form.vue')
			},


            //签到下单赠送
            {
                path: 'sign-order-give',
                icon: '',
                name: 'sign-order-give',
                meta: {
                    title: '签到下单赠送'
                },
                title: '签到下单赠送',
                component: () => import('@/views/plugins/sign-order-give/activity-list.vue')
            },
			{
                path: 'activity-log-list/:id',
                props: true,
                icon: '',
                name: 'activity-log-list',
                meta: {
                    title: '签到下单活动记录'
                },
                title: '签到下单活动记录',
                component: () => import('@/views/plugins/sign-order-give/activity-log-list.vue')
            },
            {
                path: 'sign-order-give-add',
                icon: '',
                name: 'sign-order-give-add',
                meta: {
                    title: '签到下单赠送创建'
                },
                title: '签到下单赠送创建',
                component: () => import('@/views/plugins/sign-order-give/sign-activity-form.vue')
            },
            {
                path: 'sign-order-give-edit/:id',
                props: true,
                icon: '',
                name: 'sign-order-give-edit',
                meta: {
                    title: '签到下单赠送编辑'
                },
                title: '签到下单赠送编辑',
                component: () => import('@/views/plugins/sign-order-give/sign-activity-form.vue')
            },


			// 微信群组件
			{
				path: 'weixin-group-list',
				icon: '',
				name: 'weixin-group-list',
				meta: {
					title: '微信群列表'
				},
				title: '微信群列表',
				component: () => import('@/views/plugins/weixin-group/weixin-group-list.vue')
			},

			//推广链接
            {
                path: 'sponsored-link-list',
                icon: '',
                name: 'sponsored-link-list',
                meta: {
                    title: '推广链接列表'
                },
                title: '推广链接列表',
                component: () => import('@/views/plugins/sponsored-link/sponsored-link.vue')
            },
            {
                path: 'sponsored-link-add',
                props: true,
                icon: '',
                name: 'sponsored-link-add',
                meta: {
                    title: '推广链接添加'
                },
                title: '推广链接添加',
                component: () => import('@/views/plugins/sponsored-link/sponsored-link-form.vue')
            },
			{
                path: 'sponsored-link-edit/:id',
                props: true,
                icon: '',
                name: 'sponsored-link-edit',
                meta: {
                    title: '推广链接编辑'
                },
                title: '推广链接编辑',
                component: () => import('@/views/plugins/sponsored-link/sponsored-link-form.vue')
            },

            //千人千面
            {
                path: 'thousand-people-faces-list',
                icon: '',
                name: 'thousand-people-faces-list',
                meta: {
                    title: '千人千面列表'
                },
                title: '千人千面列表',
                component: () => import('@/views/plugins/thousand-people-faces/thousand-people-link.vue')
            },
            {
                path: 'thousand-people-faces-add',
                props: true,
                icon: '',
                name: 'thousand-people-faces-add',
                meta: {
                    title: '千人千面添加'
                },
                title: '千人千面添加',
                component: () => import('@/views/plugins/thousand-people-faces/thousand-people-link-form.vue')
            },
            {
                path: 'thousand-people-faces-edit/:id',
                props: true,
                icon: '',
                name: 'thousand-people-faces-edit',
                meta: {
                    title: '千人千面编辑'
                },
                title: '千人千面编辑',
                component: () => import('@/views/plugins/thousand-people-faces/thousand-people-link-form.vue')
            },



            // 直播组件
			{
				path: 'live-broadcast-square',
				icon: '',
				name: 'live-broadcast-square',
				meta: {
					title: '直播广场'
				},
				title: '直播广场',
				component: () => import('@/views/plugins/live-broadcast/live-broadcast-square/live-broadcast-square.vue')
			},
			{
				path: 'live-broadcast-form/:id',
				props: true,
				icon: '',
				name: 'live-broadcast-form',
				meta: {
					title: '直播广场'
				},
				title: '直播广场',
				component: () => import('@/views/plugins/live-broadcast/live-broadcast-square/live-broadcast-form.vue')
			},
			{
				path: 'live-broadcast-activity',
				icon: '',
				name: 'live-broadcast-activity',
				meta: {
					title: '直播活动'
				},
				title: '直播活动',
				component: () => import('@/views/plugins/live-broadcast/live-broadcast-activity/live-broadcast-activity.vue')
			},
			{
				path: 'live-broadcast-activity-add',
				icon: '',
				name: 'live-broadcast-activity-add',
				meta: {
					title: '直播活动创建'
				},
				title: '直播活动创建',
				component: () => import('@/views/plugins/live-broadcast/live-broadcast-activity/live-broadcast-activity-form.vue')
			},
			{
				path: 'live-broadcast-activity-edit/:id',
				props: true,
				icon: '',
				name: 'live-broadcast-activity-edit',
				meta: {
					title: '直播活动编辑'
				},
				title: '直播活动编辑',
				component: () => import('@/views/plugins/live-broadcast/live-broadcast-activity/live-broadcast-activity-form.vue')
			},
			{
				path: 'live-broadcast-tables',
				icon: '',
				name: 'live-broadcast-tables',
				meta: {
					title: '直播报表'
				},
				title: '直播报表',
				component: () => import('@/views/plugins/live-broadcast/live-broadcast-tables/live-broadcast-tables.vue')
			},

			{
				path: 'live-broadcast-tables-details/:id',
				props: true,
				icon: '',
				name: 'live-broadcast-tables-details',
				meta: {
					title: '直播报表详情'
				},
				title: '直播报表详情',
				component: () => import('@/views/plugins/live-broadcast/live-broadcast-tables/details/live-broadcast-tables-details.vue')
			},

			// 调查问卷组件
			{
				path: 'questionnaire-list',
				icon: '',
				name: 'questionnaire-list',
				meta: {
					title: '调查问卷-列表'
				},
				title: '调查问卷-列表',
				component: () => import('@/views/plugins/questionnaire/questionnaire-list.vue')
			},
			{
				path: 'edit-questionnaire',
				icon: '',
				name: 'edit-questionnaire',
				meta: {
					title: '调查问卷-编辑'
				},
				title: '调查问卷-编辑',
				component: () => import('@/views/plugins/questionnaire/list/edit-questionnaire.vue')
			},
			{
				path: 'questionnaire-tables',
				icon: '',
				name: 'questionnaire-tables',
				meta: {
					title: '调查问卷-报表'
				},
				title: '调查问卷-报表',
				component: () => import('@/views/plugins/questionnaire/questionnaire-tables.vue')
			},

			// 生日营销组件
			{
				path: 'birthday-activity',
				icon: '',
				name: 'birthday-activity',
				meta: {
					title: '生日活动'
				},
				title: '生日活动',
				component: () => import('@/views/plugins/birthday-sale/birthday-love/birthday-love-list.vue')
			},
			{
				path: 'birthday-activity-add',
				icon: '',
				name: 'birthday-activity-add',
				meta: {
					title: '生日活动创建'
				},
				title: '生日活动创建',
				component: () => import('@/views/plugins/birthday-sale/birthday-love/birthday-love-form.vue')
			},
			{
				path: 'birthday-activity-edit/:id',
				props: true,
				icon: '',
				name: 'birthday-activity-edit',
				meta: {
					title: '生日活动编辑'
				},
				title: '生日活动编辑',
				component: () => import('@/views/plugins/birthday-sale/birthday-love/birthday-love-form.vue')
			},
			{
				path: 'birthday-send-list/:id',
				props: true,
				icon: '',
				name: 'birthday-send-list',
				meta: {
					title: '发/领券'
				},
				title: '发/领券',
				component: () => import('@/views/plugins/birthday-sale/birthday-love/send/send-list.vue')
			},
			{
				path: 'birthday-item',
				icon: '',
				name: 'birthday-item',
				meta: {
					title: '生日福利'
				},
				title: '生日福利',
				component: () => import('@/views/plugins/birthday-sale/birthday-fubao/birthday-fubao-list.vue')
			},
			{
				path: 'birthday-item-add',
				icon: '',
				name: 'birthday-item-add',
				meta: {
					title: '生日福利'
				},
				title: '生日福利',
				component: () => import('@/views/plugins/birthday-sale/birthday-fubao/birthday-fubao-form.vue')
			},
			{
				path: 'birthday-item-edit/:id',
				props: true,
				icon: '',
				name: 'birthday-item-edit',
				meta: {
					title: '生日福利'
				},
				title: '生日福利',
				component: () => import('@/views/plugins/birthday-sale/birthday-fubao/birthday-fubao-form.vue')
			},
			// 购券礼包组件
			{
				path: 'coupons-bag-activity',
				icon: '',
				name: 'coupons-bag-activity',
				meta: {
					title: '购券礼包活动'
				},
				title: '购券礼包活动',
				component: () => import('@/views/plugins/coupons-bag/coupons-activity/coupons-activity-list.vue')
			},
			{
				path: 'activity-result/:id',
				props: true,
				icon: '',
				name: 'activity-result',
				meta: {
					title: '购券礼包活动结果'
				},
				title: '购券礼包活动结果',
				component: () => import('@/views/plugins/coupons-bag/coupons-activity/activity-result/activity-result.vue')
			},
			{
				path: 'coupons-bag-activity-add',
				icon: '',
				name: 'coupons-bag-activity-add',
				meta: {
					title: '购券礼包活动创建'
				},
				title: '购券礼包活动创建',
				component: () => import('@/views/plugins/coupons-bag/coupons-activity/coupons-activity-form.vue')
			},
			{
				path: 'coupons-bag-activity-edit/:id',
				props: true,
				icon: '',
				name: 'coupons-bag-activity-edit',
				meta: {
					title: '购券礼包活动编辑'
				},
				title: '购券礼包活动编辑',
				component: () => import('@/views/plugins/coupons-bag/coupons-activity/coupons-activity-form.vue')
			},
			{
				path: 'coupons-bag-refund',
				icon: '',
				name: 'coupons-bag-refund',
				meta: {
					title: '购券礼包退款'
				},
				title: '购券礼包退款',
				component: () => import('@/views/plugins/coupons-bag/coupons-refund/coupons-refund-list.vue')
			},
			{
				path: 'community-setting',
				icon: '',
				name: 'community-setting',
				meta: {
					title: '属性配置'
				},
				title: '属性配置',
				component: () => import('@/views/plugins/grass/configs/grass-list.vue')
			},
			{
				path: 'community-content-list',
				icon: '',
				name: 'community-content-list',
				meta: {
					title: '内容列表'
				},
				title: '内容列表',
				component: () => import('@/views/plugins/grass/content/content-list.vue')
			},
			{
				path: 'communities-form/:id',
				props: true,
				icon: '',
				name: 'communities-form',
				meta: {
					title: '内容查看'
				},
				title: '内容查看',
				component: () => import('@/views/plugins/grass/content/content-form.vue')
			},
			{
				path: 'community-white-book',
				icon: '',
				name: 'community-white-book',
				meta: {
					title: '白名单'
				},
				title: '白名单',
				component: () => import('@/views/plugins/grass/white-list/white-list.vue')
			},
			{
				path: 'community-tables',
				icon: '',
				name: 'community-tables',
				meta: {
					title: '报表统计'
				},
				title: '报表统计',
				component: () => import('@/views/plugins/grass/data/index.vue')
			},
			// 抽奖活动
			{
				path: 'lottery-activity',
				icon: '',
				name: 'lottery-activity',
				meta: {
					title: '抽奖活动'
				},
				title: '抽奖活动',
				component: () => import('@/views/plugins/lottery/lottery-activity/lottery-activity-list.vue')
			},
			{
				path: 'fan-details-add',
				icon: '',
				name: 'fan-details-add',
				meta: {
					title: '生肖翻一翻创建'
				},
				title: '生肖翻一翻创建',
				component: () => import('@/views/plugins/lottery/lottery-activity/fan/fan-details.vue')
			},
			{
				path: 'fan-details-edit/:id',
				props: true,
				icon: '',
				name: 'fan-details-edit',
				meta: {
					title: '生肖翻一番编辑'
				},
				title: '生肖翻一番编辑',
				component: () => import('@/views/plugins/lottery/lottery-activity/fan/fan-details.vue')
			},
			{
				path: 'fruit-details-add',
				icon: '',
				name: 'fruit-details-add',
				meta: {
					title: '水果机创建'
				},
				title: '水果机创建',
				component: () => import('@/views/plugins/lottery/lottery-activity/fruit/fruit-details.vue')
			},
			{
				path: 'fruit-details-edit/:id',
				props: true,
				icon: '',
				name: 'fruit-details-edit',
				meta: {
					title: '水果机编辑'
				},
				title: '水果机编辑',
				component: () => import('@/views/plugins/lottery/lottery-activity/fruit/fruit-details.vue')
			},
			{
				path: 'yao-details-add',
				icon: '',
				name: 'yao-details-add',
				meta: {
					title: '摇一摇创建'
				},
				title: '摇一摇创建',
				component: () => import('@/views/plugins/lottery/lottery-activity/yao/yao-details.vue')
			},
			{
				path: 'yao-details-edit/:id',
				props: true,
				icon: '',
				name: 'yao-details-edit',
				meta: {
					title: '摇一摇编辑'
				},
				title: '摇一摇编辑',
				component: () => import('@/views/plugins/lottery/lottery-activity/yao/yao-details.vue')
			},
			{
				path: 'egg-details-add',
				icon: '',
				name: 'egg-details-add',
				meta: {
					title: '砸金蛋创建'
				},
				title: '砸金蛋创建',
				component: () => import('@/views/plugins/lottery/lottery-activity/egg/egg-details.vue')
			},
			{
				path: 'egg-details-edit/:id',
				props: true,
				icon: '',
				name: 'egg-details-edit',
				meta: {
					title: '砸金蛋编辑'
				},
				title: '砸金蛋编辑',
				component: () => import('@/views/plugins/lottery/lottery-activity/egg/egg-details.vue')
			},
			{
				path: 'pan-details-add',
				icon: '',
				name: 'pan-details-add',
				meta: {
					title: '大转盘创建'
				},
				title: '大转盘创建',
				component: () => import('@/views/plugins/lottery/lottery-activity/pan/pan-details.vue')
			},
			{
				path: 'pan-details-edit/:id',
				props: true,
				icon: '',
				name: 'pan-details-edit',
				meta: {
					title: '大转盘编辑'
				},
				title: '大转盘编辑',
				component: () => import('@/views/plugins/lottery/lottery-activity/pan/pan-details.vue')
			},
			{
				path: 'coupon-details-add',
				icon: '',
				name: 'coupon-details-add',
				meta: {
					title: '一点领券创建'
				},
				title: '一点领券创建',
				component: () => import('@/views/plugins/lottery/lottery-activity/coupon/coupon-details.vue')
			},
			{
				path: 'coupon-details-edit/:id',
				props: true,
				icon: '',
				name: 'coupon-details-edit',
				meta: {
					title: '一点领券编辑'
				},
				title: '一点领券编辑',
				component: () => import('@/views/plugins/lottery/lottery-activity/coupon/coupon-details.vue')
			},
			{
				path: 'lottery-order',
				icon: '',
				name: 'lottery-order',
				meta: {
					title: '抽奖订单'
				},
				title: '抽奖订单',
				component: () => import('@/views/plugins/lottery/lottery-order/lottery-order.vue')
			},
			{
				path: 'lottery-log',
				icon: '',
				name: 'lottery-log',
				meta: {
					title: '抽奖记录'
				},
				title: '抽奖记录',
				component: () => import('@/views/plugins/lottery/lottery-log/lottery-log.vue')
			},
			{
				path: 'lottery-log-details/:id',
				props: true,
				icon: '',
				name: 'lottery-log-details',
				meta: {
					title: '抽奖记录明细'
				},
				title: '抽奖记录明细',
				component: () => import('@/views/plugins/lottery/lottery-log/details/lottery-details.vue')
			},
			{
				path: 'lottery-template',
				icon: '',
				name: 'lottery-template',
				meta: {
					title: '抽奖活动模板'
				},
				title: '抽奖活动模板',
				component: () => import('@/views/plugins/lottery/lottery-template/lottery-template.vue')
			},
			
			// 订阅推送消息通知
			{
				path: 'sub-notice-list',
				icon: '',
				name: 'sub-notice-list',
				meta: {
					title: '订阅消息列表'
				},
				title: '订阅消息列表',
				component: () => import('@/views/plugins/msg-marketing/subscription-notice/notice-list.vue')
			},
			{
				path: 'sub-notice-details',
				icon: '',
				name: 'sub-notice-details',
				meta: {
					title: '订阅消息详情'
				},
				title: '订阅消息详情',
				component: () => import('@/views/plugins/msg-marketing/subscription-notice/notice-details/notice-details.vue')
			},
			{
				path: 'weixin-tpl',
				icon: '',
				name: 'weixin-tpl',
				meta: {
					title: '消息模板设置'
				},
				title: '消息模板设置',
				component: () => import('@/views/plugins/msg-marketing/msg-template-set/index.vue')
			},
			{
				path: 'msg-template-set-detail',
				icon: '',
				name: 'msg-template-set-detail',
				meta: {
					title: '消息模板设置详情'
				},
				title: '消息模板设置详情',
				component: () => import('@/views/plugins/msg-marketing/msg-template-set/set-detail.vue')
			},
			



			// 轮播图管理组件
			{
				path: 'sliders-list',
				icon: '',
				name: 'sliders-list',
				meta: {
					title: '轮播器管理'
				},
				title: '轮播器管理',
				component: () => import('@/views/plugins/sliders/sliders-list.vue')
			},
			{
				path: 'slider-image-list',
				icon: '',
				name: 'slider-image-list',
				meta: {
					title: '轮播图片管理'
				},
				title: '轮播图片管理',
				component: () => import('@/views/plugins/sliders/slider-image-list.vue')
			},

			// 文章管理组件
			{
				path: 'article-list',
				icon: '',
				name: 'article-list',
				meta: {
					title: '文章列表'
				},
				title: '文章列表',
				component: () => import('@/views/plugins/articles/article-list.vue')
			},
			{
				path: 'article-cat',
				icon: '',
				name: 'article-cat',
				meta: {
					title: '文章分类'
				},
				title: '文章分类',
				component: () => import('@/views/plugins/articles/cat-list.vue')
			},
			{
				path: 'article-cat-search/:searchq',
				icon: '',
				name: 'article-cat-search',
				meta: {
					title: '文章分类'
				},
				title: '文章分类',
				component: () => import('@/views/plugins/articles/article-cat-search.vue')
			},
			{
				path: 'article-cat-reload',
				icon: '',
				name: 'article-cat-reload',
				meta: {
					title: '文章分类'
				},
				title: '文章分类',
				component: () => import('@/views/plugins/articles/article-cat-reload.vue')
			},

			// 应用列表
			{
				path: 'apps-list',
				icon: '',
				name: 'apps-list',
				meta: {
					title: '应用列表'
				},
				title: '应用列表',
				component: () => import('@/views/plugins/plugin-list/apps-list.vue')
			},
			// 优惠券
			{
				path: 'coupons-list',
				icon: '',
				name: 'coupons-list',
				meta: {
					title: '优惠券列表'
				},
				title: '优惠券列表',
				component: () => import('@/views/coupons/coupon-manager/coupon-info.vue')
			},
			{
				path: 'coupon-details/:id?',
				props: true,
				icon: '',
				name: 'coupon-details',
				meta: {
					title: '优惠券详情'
				},
				title: '优惠券详情',
				component: () => import('@/views/coupons/coupon-manager/coupon-details/coupon-details.vue')
			},
			{
				path: 'send-coupon/:id',
				props: true,
				icon: '',
				name: 'send-coupon',
				meta: {
					title: '发放优惠券'
				},
				title: '发放优惠券',
				component: () => import('@/views/coupons/coupon-manager/send-coupon/send-coupon.vue')
			},
			{
				path: 'assembly-list/:id',
				props: true,
				icon: '',
				name: 'assembly-list',
				meta: {
					title: '发放流水'
				},
				title: '发放流水',
				component: () => import('@/views/coupons/coupon-manager/assembly-list/assembly-list.vue')
			},
			{
				path: 'offline-coupons-list',
				icon: '',
				name: 'offline-coupons-list',
				meta: {
					title: '线下优惠券列表'
				},
				title: '线下优惠券列表',
				component: () => import('@/views/coupons/offline-coupon/coupon-info.vue')
			},
			// 现金抵扣券
			{
				path: 'money-coupons-list',
				icon: '',
				name: 'money-coupons-list',
				meta: {
					title: '现金抵扣券'
				},
				title: '现金抵扣券',
				component: () => import('@/views/coupons/money-coupons/money-coupon-info.vue')
			},
			{
				path: 'store-coupons-list',
				icon: '',
				name: 'store-coupons-list',
				meta: {
					title: '店铺消费送券'
				},
				title: '店铺消费送券',
				component: () => import('@/views/coupons/store-coupons/store-coupons-list.vue')
			},
			{
				path: 'store-coupons-add',
				icon: '',
				name: 'store-coupons-add',
				meta: {
					title: '店铺消费送券创建'
				},
				title: '店铺消费送券创建',
				component: () => import('@/views/coupons/store-coupons/store-coupons-form.vue')
			},
			{
				path: 'store-coupons-edit/:id',
				props: true,
				icon: '',
				name: 'store-coupons-edit',
				meta: {
					title: '店铺消费送券编辑'
				},
				title: '店铺消费送券编辑',
				component: () => import('@/views/coupons/store-coupons/store-coupons-form.vue')
			},
			{
				path: 'store-assembly-list/:id',
				props: true,
				icon: '',
				name: 'store-assembly-list',
				meta: {
					title: '店铺消费送券发放流水'
				},
				title: '店铺消费送券发放流水',
				component: () => import('@/views/coupons/store-coupons/assembly-list.vue')
			},
			// 红包
			{
				path: 'red-packet-list',
				icon: '',
				name: 'red-packet-list',
				meta: {
					title: '红包列表'
				},
				title: '红包列表',
				component: () => import('@/views/plugins/red-packet/red-packet-list.vue')
			},
			{
				path: 'red-packet-send/:id',
				props: true,
				icon: '',
				name: 'red-packet-send',
				meta: {
					title: '红包发放'
				},
				title: '红包发放',
				component: () => import('@/views/plugins/red-packet/send-envelops/user.vue')
			},
			{
				path: 'red-packet-assembly-list/:id',
				props: true,
				icon: '',
				name: 'red-packet-assembly-list',
				meta: {
					title: '红包发放流水'
				},
				title: '红包发放流水',
				component: () => import('@/views/plugins/red-packet/assembly-list/assembly-list.vue')
			},
			// 弹窗广告
			{
				path: 'popup-advert-list',
				icon: '',
				name: 'popup-advert-list',
				meta: {
					title: '弹窗广告'
				},
				title: '弹窗广告',
				component: () => import('@/views/plugins/popup-advert/popup-advert-list.vue')
			},
			{
				path: 'popup-activity-add',
				icon: '',
				name: 'popup-activity-add',
				meta: {
					title: '弹窗广告活动创建'
				},
				title: '弹窗广告活动创建',
				component: () => import('@/views/plugins/popup-advert/activity/activity-form.vue')
			},
			{
				path: 'popup-activity-edit/:id',
				props: true,
				icon: '',
				name: 'popup-activity-edit',
				meta: {
					title: '弹窗广告活动编辑'
				},
				title: '弹窗广告活动编辑',
				component: () => import('@/views/plugins/popup-advert/activity/activity-form.vue')
			},
			{
				path: 'popup-assets-add',
				icon: '',
				name: 'popup-assets-add',
				meta: {
					title: '资产提醒活动创建'
				},
				title: '资产提醒活动创建',
				component: () => import('@/views/plugins/popup-advert/assets/assets-form.vue')
			},
			{
				path: 'popup-assets-edit/:id',
				props: true,
				icon: '',
				name: 'popup-assets-edit',
				meta: {
					title: '资产提醒活动编辑'
				},
				title: '资产提醒活动编辑',
				component: () => import('@/views/plugins/popup-advert/assets/assets-form.vue')
			},
			// 满减组件
			{
				path: 'full-reduction-list',
				icon: '',
				name: 'full-reduction-list',
				meta: {
					title: '满减活动'
				},
				title: '满减活动',
				component: () => import('@/views/plugins/full-reduction/full-reduction-list.vue')
			},
			{
				path: 'full-reduction-add',
				icon: '',
				name: 'full-reduction-add',
				meta: {
					title: '满减活动创建'
				},
				title: '满减活动创建',
				component: () => import('@/views/plugins/full-reduction/activity/full-reduction.vue')
			},
			{
				path: 'full-reduction-edit/:id',
				props: true,
				icon: '',
				name: 'full-reduction-edit',
				meta: {
					title: '满减活动编辑'
				},
				title: '满减活动编辑',
				component: () => import('@/views/plugins/full-reduction/activity/full-reduction.vue')
			},
			{
				path: 'full-numbers-add',
				icon: '',
				name: 'full-numbers-add',
				meta: {
					title: '满件活动创建'
				},
				title: '满件活动创建',
				component: () => import('@/views/plugins/full-reduction/activity/full-reduction.vue')
			},
			{
				path: 'full-numbers-edit/:id',
				props: true,
				icon: '',
				name: 'full-numbers-edit',
				meta: {
					title: '满件活动编辑'
				},
				title: '满件活动编辑',
				component: () => import('@/views/plugins/full-reduction/activity/full-reduction.vue')
			},

			// 商城活动
			{
				path: 'time-limit-activity',
				icon: '',
				name: 'time-limit-activity',
				meta: {
					title: '限时特惠活动'
				},
				title: '限时特惠活动',
				component: () => import('@/views/plugins/shop-activity/time-limit/time-limit-activity.vue')
			},
			{
				path: 'time-limit-activity-add',
				icon: '',
				name: 'time-limit-activity-add',
				meta: {
					title: '限时特惠活动创建'
				},
				title: '限时特惠活动创建',
				component: () => import('@/views/plugins/shop-activity/time-limit/time-limit-form.vue')
			},
			{
				path: 'time-limit-activity-edit/:id',
				props: true,
				icon: '',
				name: 'time-limit-activity-edit',
				meta: {
					title: '限时特惠活动编辑'
				},
				title: '限时特惠活动编辑',
				component: () => import('@/views/plugins/shop-activity/time-limit/time-limit-form.vue')
			},
			{
				path: 'promotion-rule',
				icon: '',
				name: 'promotion-rule',
				meta: {
					title: '商品促销'
				},
				title: '商品促销',
				component: () => import('@/views/plugins/shop-activity/promotion-rule.vue')
			},
			{
				path: 'pickup-activity',
				icon: '',
				name: 'pickup-activity',
				meta: {
					title: '店铺自提活动'
				},
				title: '店铺自提活动',
				component: () => import('@/views/plugins/shop-activity/pickup-activity.vue')
			},
			{
				path: 'goods-package-list',
				icon: '',
				name: 'goods-package-list',
				meta: {
					title: '商品搭配套餐'
				},
				title: '商品搭配套餐',
				component: () => import('@/views/plugins/shop-activity/goods-package/goods-package-list.vue')
			},
			{
				path: 'goods-package-add',
				icon: '',
				name: 'goods-package-add',
				meta: {
					title: '套餐创建'
				},
				title: '套餐创建',
				component: () => import('@/views/plugins/shop-activity/goods-package/package-detail/package-detail-form.vue')
			},
			{
				path: 'goods-package-edit/:id',
				props: true,
				icon: '',
				name: 'goods-package-edit',
				meta: {
					title: '套餐编辑'
				},
				title: '套餐编辑',
				component: () => import('@/views/plugins/shop-activity/goods-package/package-detail/package-detail-form.vue')
			},
			{
				path: 'video-shopping-list',
				icon: '',
				name: 'video-shopping-list',
				meta: {
					title: '视频购物'
				},
				title: '视频购物',
				component: () => import('@/views/plugins/shop-activity/video-shopping/video-shopping.vue')
			},
			{
				path: 'video-shopping-activity-add',
				icon: '',
				name: 'video-shopping-activity-add',
				meta: {
					title: '视频购物创建'
				},
				title: '视频购物创建',
				component: () => import('@/views/plugins/shop-activity/video-shopping/video-shopping-form.vue')
			},
			{
				path: 'video-shopping-activity-edit/:id',
				props: true,
				icon: '',
				name: 'video-shopping-activity-edit',
				meta: {
					title: '视频购物编辑'
				},
				title: '视频购物编辑',
				component: () => import('@/views/plugins/shop-activity/video-shopping/video-shopping-form.vue')
			},
			{
				path: 'bargain-buy-list',
				icon: '',
				name: 'bargain-buy-list',
				meta: {
					title: '超值购'
				},
				title: '超值购',
				component: () => import('@/views/plugins/shop-activity/discountBuyActivity/discount-buy-activity.vue')
			},
			{
				path: 'bargain-buy-list',
				icon: '',
				name: 'bargain-buy-list',
				meta: {
					title: '超值购'
				},
				title: '超值购',
				component: () => import('@/views/plugins/shop-activity/discountBuyActivity/discount-buy-activity.vue')
			},
			
			{
				path: 'promotions-list',
				icon: '',
				name: 'promotions-list',
				meta: {
					title: '多促销价'
				},
				title: '多促销价',
				component: () => import('@/views/plugins/shop-activity/promotions/promotions-list.vue')
			},
			{
				path: 'goods-recommend-list',
				icon: '',
				name: 'goods-recommend-list',
				meta: {
					title: '单品推荐活动'
				},
				title: '单品推荐活动',
				component: () => import('@/views/plugins/shop-activity/goods-recommend/goods-recommend-activity.vue')
			},
			{
				path: 'goods-recommend-add',
				icon: '',
				name: 'goods-recommend-add',
				meta: {
					title: '单品推荐活动创建'
				},
				title: '单品推荐活动创建',
				component: () => import('@/views/plugins/shop-activity/goods-recommend/goods-recommend-form.vue')
			},
			{
				path: 'goods-recommend-edit/:id',
				props: true,
				icon: '',
				name: 'goods-recommend-edit',
				meta: {
					title: '单品推荐活动编辑'
				},
				title: '单品推荐活动编辑',
				component: () => import('@/views/plugins/shop-activity/goods-recommend/goods-recommend-form.vue')
			},
			{
				path: 'goods-recommend-activity-goods/:id',
				props: true,
				icon: '',
				name: 'goods-recommend-activity-goods',
				meta: {
					title: '单品推荐活动绑定商品'
				},
				title: '单品推荐活动绑定商品',
				component: () => import('@/views/plugins/shop-activity/goods-recommend/binding/binding-goods.vue')
			},
			{
				path: 'cart-recommend-list',
				icon: '',
				name: 'cart-recommend-list',
				meta: {
					title: '购物车推荐'
				},
				title: '购物车推荐',
				component: () => import('@/views/plugins/shop-activity/cart-recommend/cart-recommend-activity.vue')
			},
			{
				path: 'goods-coupons-activity',
				icon: '',
				name: 'goods-coupons-activity',
				meta: {
					title: '单品领券活动'
				},
				title: '单品领券活动',
				component: () => import('@/views/plugins/shop-activity/goods-coupons/goods-coupons-activity.vue')
			},
			{
				path: 'goods-coupons-activity-add',
				icon: '',
				name: 'goods-coupons-activity-add',
				meta: {
					title: '单品领券活动创建'
				},
				title: '单品领券活动创建',
				component: () => import('@/views/plugins/shop-activity/goods-coupons/goods-coupons-form.vue')
			},
			{
				path: 'goods-coupons-activity-edit/:id',
				props: true,
				icon: '',
				name: 'goods-coupons-activity-edit',
				meta: {
					title: '单品领券活动编辑'
				},
				title: '单品领券活动编辑',
				component: () => import('@/views/plugins/shop-activity/goods-coupons/goods-coupons-form.vue')
			},
			{
				path: 'goods-coupons-activity-goods/:id',
				props: true,
				icon: '',
				name: 'goods-coupons-activity-goods',
				meta: {
					title: '绑定商品'
				},
				title: '绑定商品',
				component: () => import('@/views/plugins/shop-activity/goods-coupons/binding/binding-goods.vue')
			},
			// 拼团组件
			{
				path: 'group-activity-list',
				icon: '',
				name: 'group-activity-list',
				meta: {
					title: '拼团活动列表'
				},
				title: '拼团活动列表',
				component: () => import('@/views/plugins/pin-group/activity/group-activity-list.vue')
			},
			{
				path: 'group-activity-add',
				icon: '',
				name: 'group-activity-add',
				meta: {
					title: '拼团活动创建'
				},
				title: '拼团活动创建',
				component: () => import('@/views/plugins/pin-group/activity/group-activity-form.vue')
			},
			{
				path: 'group-activity-edit/:id',
				props: true,
				icon: '',
				name: 'group-activity-edit',
				meta: {
					title: '拼团活动编辑'
				},
				title: '拼团活动编辑',
				component: () => import('@/views/plugins/pin-group/activity/group-activity-form.vue')
			},
			{
				path: 'group-order-list',
				icon: '',
				name: 'group-order-list',
				meta: {
					title: '拼团订单列表'
				},
				title: '拼团订单列表',
				component: () => import('@/views/plugins/pin-group/order/group-order-list.vue')
			},
			{
				path: 'group-order-info/:sn',
				props: true,
				icon: '',
				name: 'group-order-info',
				meta: {
					title: '拼团订单详情'
				},
				title: '拼团订单详情',
				component: () => import('@/views/plugins/pin-group/order/order-info/order-info.vue')
			},

			//云店拼团组件
            {
                path: 'shop-group-activity-list',
                icon: '',
                name: 'shop-group-activity-list',
                meta: {
                    title: '拼团活动列表'
                },
                title: '拼团活动列表',
                component: () => import('@/views/cloud-shop/plugins/pin-group/activity/group-activity-list.vue')
            },
            {
                path: 'shop-group-activity-add',
                icon: '',
                name: 'shop-group-activity-add',
                meta: {
                    title: '拼团活动创建'
                },
                title: '拼团活动创建',
                component: () => import('@/views/cloud-shop/plugins/pin-group/activity/group-activity-form.vue')
            },
            {
                path: 'shop-group-activity-edit/:id',
                props: true,
                icon: '',
                name: 'shop-group-activity-edit',
                meta: {
                    title: '拼团活动编辑'
                },
                title: '拼团活动编辑',
                component: () => import('@/views/cloud-shop/plugins/pin-group/activity/group-activity-form.vue')
            },
            {
                path: 'shop-group-order-list',
                icon: '',
                name: 'shop-group-order-list',
                meta: {
                    title: '拼团订单列表'
                },
                title: '拼团订单列表',
                component: () => import('@/views/cloud-shop/plugins/pin-group/order/group-order-list.vue')
            },
            {
                path: 'shop-group-order-info/:sn',
                props: true,
                icon: '',
                name: 'shop-group-order-info',
                meta: {
                    title: '拼团订单详情'
                },
                title: '拼团订单详情',
                component: () => import('@/views/cloud-shop/plugins/pin-group/order/order-info/order-info.vue')
            },

			// 预售组件
			{
				path: 'presale-activity-list',
				icon: '',
				name: 'presale-activity-list',
				meta: {
					title: '预售活动列表'
				},
				title: '预售活动列表',
				component: () => import('@/views/plugins/presale/activity/presale-activity-list.vue')
			},
			{
				path: 'presale-activity-add',
				icon: '',
				name: 'presale-activity-add',
				meta: {
					title: '预售活动创建'
				},
				title: '预售活动创建',
				component: () => import('@/views/plugins/presale/activity/presale-activity-form.vue')
			},
			{
				path: 'presale-activity-edit/:id',
				props: true,
				icon: '',
				name: 'presale-activity-edit',
				meta: {
					title: '预售活动编辑'
				},
				title: '预售活动编辑',
				component: () => import('@/views/plugins/presale/activity/presale-activity-form.vue')
			},
			{
				path: 'presale-order-list',
				icon: '',
				name: 'presale-order-list',
				meta: {
					title: '预售订单列表'
				},
				title: '预售订单列表',
				component: () => import('@/views/plugins/presale/order/presale-order-info.vue')
			},
			{
				path: 'presale-order-info/:sn',
				props: true,
				icon: '',
				name: 'presale-order-info',
				meta: {
					title: '预售订单详情'
				},
				title: '预售订单详情',
				component: () => import('@/views/plugins/presale/order/order-info/order-info.vue')
			},

			// 视频号-- 商品列表
			{
				path: 'video-number-goods-list',
				props: true,
				icon: '',
				name: 'video-number-goods-list',
				meta: {
					title: '商品列表'
				},
				title: '商品列表',
				component: () => import('@/views/plugins/video-numbers/goods-list/goods-list.vue')
			},

			// 视频号-- 下发日志
			{
				path: 'video-number-issue-log',
				props: true,
				icon: '',
				name: 'video-number-issue-log',
				meta: {
					title: '下发日志'
				},
				title: '下发日志',
				component: () => import('@/views/plugins/video-numbers/issue-log/issue-log.vue')
			},

			// 微信客服组件
			{
				path: 'cs-session',
				icon: '',
				name: 'cs-session',
				meta: {
					title: '客服会话'
				},
				title: '客服会话',
				component: () => import('@/views/plugins/customer-service/cs-session.vue')
			},
			{
				path: 'cs-worker-list',
				icon: '',
				name: 'cs-worker-list',
				meta: {
					title: '客服人员'
				},
				title: '客服人员',
				component: () => import('@/views/plugins/customer-service/cs-worker-list.vue')
			},
			{
				path: 'cs-worker-group-list',
				icon: '',
				name: 'cs-worker-group-list',
				meta: {
					title: '客服分组'
				},
				title: '客服分组',
				component: () => import('@/views/plugins/customer-service/cs-worker-group-list.vue')
			},
			{
				path: 'cs-reply',
				icon: '',
				name: 'cs-reply',
				meta: {
					title: '关键词回复'
				},
				title: '关键词回复',
				component: () => import('@/views/plugins/customer-service/cs-reply-list.vue')
			},
			{
				path: 'cs-material',
				icon: '',
				name: 'cs-material',
				meta: {
					title: '客服素材库'
				},
				title: '客服素材库',
				component: () => import('@/views/plugins/customer-service/cs-material.vue')
			},
			{
				path: 'cs-comment-log',
				icon: '',
				name: 'cs-comment-log',
				meta: {
					title: '客服评分日志'
				},
				title: '客服评分日志',
				component: () => import('@/views/plugins/customer-service/cs-comment-log.vue')
			},
			{
				path: 'cs-setting',
				icon: '',
				name: 'cs-setting',
				meta: {
					title: '客服设置'
				},
				title: '客服设置',
				component: () => import('@/views/plugins/customer-service/cs-setting.vue')
			},
			{
				path: 'cs-comment-table',
				icon: '',
				name: 'cs-comment-table',
				meta: {
					title: '客服评分报表'
				},
				title: '客服评分报表',
				component: () => import('@/views/plugins/customer-service/cs-comment-table.vue')
			},
			{
				path: 'cs-day-data-statistics',
				icon: '',
				name: 'cs-day-data-statistics',
				meta: {
					title: '客服每日数据统计'
				},
				title: '客服每日数据统计',
				component: () => import('@/views/plugins/customer-service/cs-day-data-statistics.vue')
			},
			{
				path: 'cs-worktime-table',
				icon: '',
				name: 'cs-worktime-table',
				meta: {
					title: '客服工时统计报表'
				},
				title: '客服工时统计报表',
				component: () => import('@/views/plugins/customer-service/cs-worktime-table.vue')
			},
			{
				path: 'cs-comment-feedback',
				icon: '',
				name: 'cs-comment-feedback',
				meta: {
					title: '客服反馈'
				},
				title: '客服反馈',
				component: () => import('@/views/plugins/customer-service/cs-comment-feedback.vue')
			},
			{
				path: 'cs-tags-list',
				icon: '',
				name: 'cs-tags-list',
				meta: {
					title: '客服标签管理'
				},
				title: '客服标签管理',
				component: () => import('@/views/plugins/customer-service/cs-tags-list.vue')
			},
			{
				path: 'cs-tags-table',
				icon: '',
				name: 'cs-tags-table',
				meta: {
					title: '客服标签统计'
				},
				title: '客服标签统计',
				component: () => import('@/views/plugins/customer-service/cs-tags-table.vue')
			},
			{
				path: 'cs-tags-session-list',
				icon: '',
				name: 'cs-tags-session-list',
				meta: {
					title: '客服会话标签管理'
				},
				title: '客服会话标签管理',
				component: () => import('@/views/plugins/customer-service/cs-tags-session-list.vue')
			},
			{
				path: 'cs-tags-session-table',
				icon: '',
				name: 'cs-tags-session-table',
				meta: {
					title: '会话标签统计'
				},
				title: '会话标签统计',
				component: () => import('@/views/plugins/customer-service/cs-tags-session-table.vue')
			},
			{
				path: 'cs-comment-task',
				icon: '',
				name: 'cs-comment-task',
				meta: {
					title: '客服工单'
				},
				title: '客服工单',
				component: () => import('@/views/plugins/customer-service/cs-comment-task.vue')
			},
			{
				path: 'cs-feedback-cat',
				icon: '',
				name: 'cs-feedback-cat',
				meta: {
					title: '工单分类'
				},
				title: '工单分类',
				component: () => import('@/views/plugins/user-feedback/cat-list.vue')
			},
			{
				path: 'cs-onlivelog-table',
				icon: '',
				name: 'cs-onlivelog-table',
				meta: {
					title: '工时统计'
				},
				title: '工时统计',
				component: () => import('@/views/plugins/customer-service/cs-onlive-log-table.vue')
			},
			{
				path: 'cs-onlivelog-list/:worker_id',
				icon: '',
				name: 'cs-onlivelog-list',
				meta: {
					title: '工时明细'
				},
				title: '工时明细',
				component: () => import('@/views/plugins/customer-service/cs-onlive-log-list.vue')
			},
			{
				path: 'cs-blackbook-list',
				icon: '',
				name: 'cs-blackbook-list',
				meta: {
					title: '客服黑名单'
				},
				title: '客服黑名单',
				component: () => import('@/views/plugins/customer-service/cs-blackbook-list.vue')
			},
		]
	},
	// 数字屏大模块
	{
		path: '/devices',
		icon: '',
		title: '数字屏',
		name: 'devices',
		component: Main,
		children: [{
				path: 'device-list',
				icon: '',
				name: 'device-list',
				meta: {
					title: '设备管理'
				},
				title: '设备管理',
				component: () => import('@/views/devices/devices-manage/device-list.vue')
			},
			{
				path: 'device-edit/:id',
				icon: '',
				name: 'device-edit',
				meta: {
					title: '设备管理编辑'
				},
				title: '设备管理编辑',
				component: () => import('@/views/devices/devices-manage/device-edit.vue')
			},
			{
				path: 'device-setting',
				icon: '',
				name: 'device-setting',
				meta: {
					title: '数字屏设置'
				},
				title: '数字屏设置',
				component: () => import('@/views/devices/devices-manage/device-setting.vue')
			},
			{
				path: 'ad-space-list',
				icon: '',
				name: 'ad-space-list',
				meta: {
					title: '广告位列表'
				},
				title: '广告位列表',
				component: () => import('@/views/devices/ad-manage/ad-space-list.vue')
			},
			{
				path: 'ad-list',
				icon: '',
				name: 'ad-list',
				meta: {
					title: '广告管理'
				},
				title: '广告管理',
				component: () => import('@/views/devices/ad-manage/ad-list.vue')
			},
			{
				path: 'ad-cat',
				icon: '',
				name: 'ad-cat',
				meta: {
					title: '分类菜单设置'
				},
				title: '分类菜单设置',
				component: () => import('@/views/devices/ad-manage/ad-cat.vue')
			},
		]
	},
	// 智慧支付大模块
	{
		path: '/smart-pay',
		icon: '',
		title: '智慧支付',
		name: 'smart-pay',
		component: Main,
		children: [{
				path: 'qrcode-order',
				icon: '',
				name: 'qrcode-order',
				meta: {
					title: '扫码支付订单'
				},
				title: '扫码支付订单',
				component: () => import('@/views/smart-pay/store-pay/qrcode-order.vue')
			},
			{
				path: 'qrcode-return',
				icon: '',
				name: 'qrcode-return',
				meta: {
					title: '扫码支付退单'
				},
				title: '扫码支付退单',
				component: () => import('@/views/smart-pay/store-pay/qrcode-return.vue')
			},
			{
				path: 'pay-sale',
				icon: '',
				name: 'pay-sale',
				meta: {
					title: '支付营销'
				},
				title: '支付营销',
				component: () => import('@/views/smart-pay/store-pay/pay-sale.vue')
			},
			{
				path: 'pay-rule',
				icon: '',
				name: 'pay-rule',
				meta: {
					title: '支付规则'
				},
				title: '支付规则',
				component: () => import('@/views/smart-pay/store-pay/pay-rule.vue')
			},
			{
				path: 'pay-random-reduce',
				icon: '',
				name: 'pay-random-reduce',
				meta: {
					title: '随机减'
				},
				title: '随机减',
				component: () => import('@/views/smart-pay/store-pay/pay-random-reduce.vue')
			},
		]
	},
	// 智慧营销大模块
	{
		path: '/smart-sale',
		icon: '',
		title: '智慧营销',
		name: 'smart-sale',
		component: Main,
		children: [{
				path: 'data-dashboard',
				icon: '',
				name: 'data-dashboard',
				meta: {
					title: '会员看板'
				},
				title: '会员看板',
				component: () => import('@/views/smart-sale/data-dashboard/member.vue')
			},
			{
				path: 'manual-label',
				icon: '',
				name: 'manual-label',
				meta: {
					title: '手动标签'
				},
				title: '手动标签',
				component: () => import('@/views/smart-sale/label-system/manual-label/index.vue')
			},
			{
				path: 'manual-label-member',
				icon: '',
				name: 'manual-label-member',
				meta: {
					title: '手动标签会员'
				},
				title: '手动标签会员',
				component: () => import('@/views/smart-sale/label-system/manual-label/memberList.vue')
			},
			{
				path: 'basic-label',
				icon: '',
				name: 'basic-label',
				meta: {
					title: '基础标签'
				},
				title: '基础标签',
				component: () => import('@/views/smart-sale/label-system/base-label/index.vue')
			},
			{
				path: 'add-basic-label',
				icon: '',
				name: 'add-basic-label',
				meta: {
					title: '添加基础标签'
				},
				title: '添加基础标签',
				component: () => import('@/views/smart-sale/label-system/base-label/add-label.vue')
			},
			{
				path: 'basic-label-member',
				icon: '',
				name: 'basic-label-member',
				meta: {
					title: '基础标签会员'
				},
				title: '基础标签会员',
				component: () => import('@/views/smart-sale/label-system/base-label/memberList.vue')
			},
			{
				path: 'consume-label',
				icon: '',
				name: 'consume-label',
				meta: {
					title: '消费标签'
				},
				title: '消费标签',
				component: () => import('@/views/smart-sale/label-system/consume-label/index.vue')
			},
			{
				path: 'add-consume-label',
				icon: '',
				name: 'add-consume-label',
				meta: {
					title: '添加消费标签'
				},
				title: '添加消费标签',
				component: () => import('@/views/smart-sale/label-system/consume-label/add-label.vue')
			},
			{
				path: 'consume-label-member',
				icon: '',
				name: 'consume-label-member',
				meta: {
					title: '消费标签会员'
				},
				title: '消费标签会员',
				component: () => import('@/views/smart-sale/label-system/consume-label/memberList.vue')
			},
			{
				path: 'sale-label',
				icon: '',
				name: 'sale-label',
				meta: {
					title: '商品销售标签'
				},
				title: '商品销售标签',
				component: () => import('@/views/smart-sale/label-system/sale-label/index.vue')
			},
			{
				path: 'add-sale-label',
				icon: '',
				name: 'add-sale-label',
				meta: {
					title: '添加商品销售标签'
				},
				title: '添加商品销售标签',
				component: () => import('@/views/smart-sale/label-system/sale-label/add-label.vue')
			},
			{
				path: 'sale-label-member',
				icon: '',
				name: 'sale-label-member',
				meta: {
					title: '商品销售标签会员'
				},
				title: '商品销售标签会员',
				component: () => import('@/views/smart-sale/label-system/sale-label/memberList.vue')
			},
			{
				path: 'marketing-label',
				icon: '',
				name: 'marketing-label',
				meta: {
					title: '营销标签'
				},
				title: '营销标签',
				component: () => import('@/views/smart-sale/label-system/marketing-label/index.vue')
			},
			{
				path: 'add-marketing-label',
				icon: '',
				name: 'add-marketing-label',
				meta: {
					title: '添加营销标签'
				},
				title: '添加营销标签',
				component: () => import('@/views/smart-sale/label-system/marketing-label/add-label.vue')
			},
			{
				path: 'marketing-label-member',
				icon: '',
				name: 'marketing-label-member',
				meta: {
					title: '营销标签会员'
				},
				title: '营销标签会员',
				component: () => import('@/views/smart-sale/label-system/marketing-label/memberList.vue')
			},
			{
				path: 'visit-label',
				icon: '',
				name: 'visit-label',
				meta: {
					title: '访问标签'
				},
				title: '访问标签',
				component: () => import('@/views/smart-sale/label-system/visit-label/index.vue')
			},
			{
				path: 'add-visit-label',
				icon: '',
				name: 'add-visit-label',
				meta: {
					title: '添加访问标签'
				},
				title: '添加访问标签',
				component: () => import('@/views/smart-sale/label-system/visit-label/add-label.vue')
			},
			{
				path: 'visit-label-member',
				icon: '',
				name: 'visit-label-member',
				meta: {
					title: '访问标签会员'
				},
				title: '访问标签会员',
				component: () => import('@/views/smart-sale/label-system/visit-label/memberList.vue')
			},

			{
				path: 'shopping-guide-label',
				icon: '',
				name: 'shopping-guide-label',
				meta: {
					title: '导购标签'
				},
				title: '导购标签',
				component: () => import('@/views/smart-sale/label-system/shopping-guide-label/index.vue')
			},
			{
				path: 'shopping-guide-label-member',
				icon: '',
				name: 'shopping-guide-label-member',
				meta: {
					title: '导购标签'
				},
				title: '导购标签',
				component: () => import('@/views/smart-sale/label-system/shopping-guide-label/memberList.vue')
			},

			{
				path: 'erp-tag-label',
				icon: '',
				name: 'erp-tag-label',
				meta: {
					title: 'erp标签'
				},
				title: 'erp标签',
				component: () => import('@/views/smart-sale/label-system/erp-label/index.vue')
			},
			{
				path: 'erp-tag-label-member',
				icon: '',
				name: 'erp-tag-label-member',
				meta: {
					title: '导购标签'
				},
				title: '导购标签',
				component: () => import('@/views/smart-sale/label-system/erp-label/memberList.vue')
			},

			{
				path: 'cycle-marketing',
				icon: '',
				name: 'cycle-marketing',
				meta: {
					title: '周期营销'
				},
				title: '周期营销',
				component: () => import('@/views/smart-sale/marketing/period-list.vue')
			},
			{
				path: 'once-marketing',
				icon: '',
				name: 'once-marketing',
				meta: {
					title: '单次营销'
				},
				title: '单次营销',
				component: () => import('@/views/smart-sale/marketing/single-list.vue')
			},
			{
				path: 'smart-market',
				icon: '',
				name: 'smart-market',
				meta: {
					title: '智能营销'
				},
				title: '智能营销',
				component: () => import('@/views/smart-sale/marketing/smart-market.vue')
			},
      {
        path: 'quick-task',
        icon: '',
        name: 'quick-task',
        meta: {
          title: '快捷任务'
        },
        title: '快捷任务',
        component: resolve => {
          require(['@/views/smart-sale/shortcut/quick-task/quick-task.vue'], resolve);
        }
      },
      {
        path: 'quick-filtrate',
        icon: '',
        name: 'quick-filtrate',
        meta: {
          title: '快捷筛选'
        },
        title: '快捷筛选',
        component: resolve => {
          require(['@/views/smart-sale/shortcut/quick-filtrate/quick-filtrate.vue'], resolve);
        }
      },
      {
        path: 'rfmsystem-general',
        icon: '',
        name: 'rfmsystem-general',
        meta: {
          title: 'RFM全景'
        },
        title: 'RFM全景',
        component: resolve => {
          require(['@/views/smart-sale/RFM/rfm-general/rfm-general.vue'], resolve);
        }
      },
      {
        path: 'rfmsystem-structure',
        icon: '',
        name: 'rfmsystem-structure',
        meta: {
          title: 'RFM统计周期设定'
        },
        title: 'RFM统计周期设定',
        component: resolve => {
          require(['@/views/smart-sale/RFM/rfm-structure/rfm-structure.vue'], resolve);
        }
      },
			{
			  path: 'rfmsystem-report',
			  icon: '',
			  name: 'rfmsystem-report',
			  meta: {
			    title: 'RFM统计周期设定'
			  },
			  title: 'RFM统计周期设定',
			  component: resolve => {
			    require(['@/views/smart-sale/RFM/rfm-report/rfm-report.vue'], resolve);
			  }
			},
			// 会员分组
			{
			  path: 'brand-group',
			  icon: '',
			  name: 'brand-group',
			  meta: {
			    title: '品牌分组'
			  },
			  title: '品牌分组',
			  component: resolve => {
			    require(['@/views/smart-sale/member-group/brandmember/brand-group.vue'], resolve);
			  }
			},
			{
			  path: 'system-group',
			  icon: '',
			  name: 'system-group',
			  meta: {
			    title: '系统分组'
			  },
			  title: '系统分组',
			  component: resolve => {
			    require(['@/views/smart-sale/member-group/systemmember/system-group.vue'], resolve);
			  }
			},
			{
			  path: 'all-group',
			  icon: '',
			  name: 'all-group',
			  meta: {
			    title: '全部分组'
			  },
			  title: '全部分组',
			  component: resolve => {
			    require(['@/views/smart-sale/member-group/allmember/all-group.vue'], resolve);
			  }
			},
			{
			  path: 'group-message-edit',
			  icon: '',
			  name: 'group-message-edit',
			  meta: {
			    title: '编辑会员分组'
			  },
			  title: '编辑会员分组',
			  component: resolve => {
			    require(['@/views/smart-sale/member-group/group-edit/group-message.vue'], resolve);
			  }
			},
		]
	},
	// 系统管理员模块
	{
		path: '/doc/info/:code',
		icon: '',
		name: 'doc-info',
		meta: {
			title: '文档详情'
		},
		title: '文档详情',
		component: () => import('@/views/system/doc/doc-info.vue')
	},
	// 系统管理员模块
	{
		path: '/system',
		icon: '',
		title: '系统',
		name: 'system',
		component: Main,
		children: [{
				path: 'cuser-list',
				icon: '',
				name: 'cuser-list',
				meta: {
					title: '个人用户'
				},
				title: '个人用户',
				component: () => import('@/views/system/cuser-list/cuser-list.vue')
			},
			{
				path: 'brand-list',
				icon: '',
				name: 'brand-list',
				meta: {
					title: '品牌列表'
				},
				title: '品牌列表',
				component: () => import('@/views/system/brand-list/brand-list.vue')
			},
			{
				path: 'brand-super-admin',
				icon: '',
				name: 'brand-super-admin',
				meta: {
					title: '品牌超管'
				},
				title: '品牌超管',
				component: () => import('@/views/system/brand-list/brand-super-admin.vue')
			},
			// 品牌插件组
			{
				path: 'plugins-group-list',
				icon: '',
				name: 'plugins-group-list',
				meta: {
					title: '系统产品列表'
				},
				title: '系统产品列表',
				component: () => import('@/views/system/plugins-group/plugins-group-list.vue')
			},
			{
				path: 'system-log-list',
				icon: '',
				name: 'system-log-list',
				meta: {
					title: '系统日志'
				},
				title: '系统日志',
				component: () => import('@/views/system/senior/system-log.vue')
			},
			{
				path: 'cron',
				icon: '',
				name: 'cron',
				meta: {
					title: '定时任务'
				},
				title: '定时任务',
				component: () => import('@/views/system/senior/cron.vue')
			},
			{
				path: 'cron-log/:code',
				icon: '',
				name: 'cron-log',
				meta: {
					title: '定时任务日志'
				},
				title: '定时任务日志',
				component: () => import('@/views/system/senior/cron-log.vue')
			},
			{
				path: 'system-tools',
				icon: '',
				name: 'system-tools',
				meta: {
					title: '系统工具'
				},
				title: '系统工具',
				component: () => import('@/views/system/senior/system-tools.vue')
			},
			{
				path: 'global-setting',
				icon: '',
				name: 'global-setting',
				meta: {
					title: '全局设置'
				},
				title: '全局设置',
				component: () => import('@/views/system/senior/global-setting.vue')
			},
			{
				path: 'tips-off',
				icon: '',
				name: 'tips-off',
				meta: {
					title: '举报信息'
				},
				title: '举报信息',
				component: () => import('@/views/system/senior/tips-off.vue')
			},
			{
				path: 'system-admin-message',
				icon: '',
				name: 'system-admin-message',
				meta: {
					title: '管理员站内消息'
				},
				title: '管理员站内消息',
				component: () => import('@/views/admin-user/system-admin-message/admin-message.vue')
			},

			// 文档
			{
				path: 'doc-list',
				icon: '',
				name: 'doc-list',
				meta: {
					title: '文档列表'
				},
				title: '文档列表',
				component: () => import('@/views/system/doc/doc-list.vue')
			},
			{
				path: 'doc-cat',
				icon: '',
				name: 'doc-cat',
				meta: {
					title: '文档分类'
				},
				title: '文档分类',
				component: () => import('@/views/system/doc/doc-cat.vue')
			},
			{
				path: 'faq-list',
				icon: '',
				name: 'faq-list',
				meta: {
					title: 'FAQ列表'
				},
				title: 'FAQ列表',
				component: () => import('@/views/system/doc/faq-list.vue')
			},

			// webapi doc
			{
				path: 'webapi-docs',
				icon: '',
				name: 'webapi-docs',
				meta: {
					title: 'webapi文档'
				},
				title: 'webapi文档',
				component: () => import('@/views/system/webapi-docs/webapi-docs.vue')
			},

			// 更新发布日志
			{
				path: 'release-list',
				icon: '',
				name: 'release-list',
				meta: {
					title: '更新发布日志列表'
				},
				title: '更新发布日志列表',
				component: () => import('@/views/system/release-log/release-list.vue')
			},
			{
				path: 'release-item-list/:id',
				icon: '',
				name: 'release-item-list',
				meta: {
					title: '更新发布明细项'
				},
				title: '更新发布明细项',
				component: () => import('@/views/system/release-log/release-item-list.vue')
			},

		]
	},
	//超管数据报表
	{
		path: '/system-data',
		icon: '',
		title: '数据',
		name: 'system-data',
		component: Main,
		children: [{
				path: 'visit-today',
				icon: '',
				name: 'visit-today',
				meta: {
					title: '今日统计',
					keepAlive: true
				},
				title: '今日统计',
				component: () => import('@/views/data/visit/today-list/today-list.vue')
			},
			{
				path: 'visit-stats',
				icon: '',
				name: 'visit-stats',
				meta: {
					title: '访问统计',
					keepAlive: true
				},
				title: '访问统计',
				component: () => import('@/views/data/visit/visit-list/visit-list.vue')
			},
			{
				path: 'source-stats',
				icon: '',
				name: 'source-stats',
				meta: {
					title: '来源统计',
					keepAlive: true
				},
				title: '来源统计',
				component: () => import('@/views/data/source/brand-source-list/brand-source-list.vue')
			}, 
			{
				path: 'conversion-stats',
				icon: '',
				name: 'conversion-stats',
				meta: {
					title: '转化统计',
					keepAlive: true
				},
				title: '转化统计',
				component: () => import('@/views/data/visit/behavior-list/behavior-list.vue')
			},
			{
				path: 'user-count-stats',
				icon: '',
				name: 'user-count-stats',
				meta: {
					title: '会员总量统计',
					keepAlive: true
				},
				title: '会员总量统计',
				component: () => import('@/views/data/member/total-stats/total-stats.vue')
			},
			{
				path: 'new-user-stats',
				icon: '',
				name: 'new-user-stats',
				meta: {
					title: '新增会员统计',
					keepAlive: true
				},
				title: '新增会员统计',
				component: () => import('@/views/data/member/new-stats/new-stats.vue')
			},
			{
				path: 'goods-stats',
				icon: '',
				name: 'goods-stats',
				meta: {
					title: '商品统计',
					keepAlive: true
				},
				title: '商品统计',
				component: () => import('@/views/data/visit/goods-list/goods-list.vue')
			},
            {
                path: 'brand-list-count',
                icon: '',
                name: 'brand-list-count',
                meta: {
                    title: '品牌信息统计',
                    keepAlive: true
                },
                title: '品牌信息统计',
                component: () => import('@/views/data/visit/brand-list/brand-list.vue')
            },
            {
                path: 'brand-list-edit',
                icon: '',
                name: 'brand-list-edit',
                meta: {
                    title: '品牌编辑'
                },
                title: '品牌编辑',
                component: () => import('@/views/data/visit/brand-list/brand-edit.vue')
            },
			{
				path: 'sale-stats',
				icon: '',
				name: 'sale-stats',
				meta: {
					title: '销售统计',
					keepAlive: true
				},
				title: '销售统计',
				component: () => import('@/views/data/sales-stats/sales-list/sales-list.vue')
			}, {
				path: 'sale-detail',
				icon: '',
				name: 'sale-detail',
				meta: {
					title: '销售明细',
					keepAlive: true
				},
				title: '销售明细',
				component: () => import('@/views/data/sales-stats/sales-detail-list/sales-detail-list.vue')
			}
		]
	},
    //企微
    {
        path: '/qiwei',
        icon: '',
        title: '企微管理',
        name: 'qiwei',
        component: Main,
        children: [
            {
                path: 'qw-reward-list',
                icon: '',
                name: 'qw-reward-list',
                meta: {
                    title: '加新奖励奖励',
                    groups: 'qiwei'
                },
                title: '加新奖励',
                component: () => import('@/views/qiwei/qw-reward-list/reward-list.vue')
            },
			{
                path: 'reward-record-list',
                icon: '',
                name: 'reward-record-list',
                meta: {
                    title: '加新奖励活动记录',
                    groups: 'qiwei'
                },
                title: '加新奖励活动记录',
                component: () => import('@/views/qiwei/reward-record-list/record-list.vue')
            },
            {
                path: 'reward-edit',
                icon: '',
                name: 'reward-edit',
                meta: {
                    title: '加新奖励编辑'
                },
                title: '加新奖励编辑',
                component: () => import('@/views/qiwei/qw-reward-list/reward-edit.vue')
            },
        	{
				path: 'qw-worker-list',
				icon: '',
				name: 'qw-worker-list',
				meta: {
					title: '企微员工列表',
					groups: 'qiwei'
				},
				title: '企微员工列表',
				component: () => import('@/views/qiwei/qw-worker-list/worker-list.vue')
        	},
			{
                path: 'qw-chat-list',
                icon: '',
                name: 'qw-chat-list',
                meta: {
                    title: '企微群列表',
                    groups: 'qiwei'
                },
                title: '企微群列表',
                component: () => import('@/views/qiwei/qw-chat-list/chat-list.vue')
			},
            {
                path: 'chat-list-edit',
                icon: '',
                name: 'chat-list-edit',
                meta: {
                    title: '企微群编辑'
                },
                title: '企微群编辑',
                component: () => import('@/views/qiwei/qw-chat-list/chat-edit.vue')
            },
			{
				path: 'qw-contact-list',
				icon: '',
				name: 'qw-contact-list',
				meta: {
					title: '企微联系方式列表'
				},
				title: '企微联系方式列表',
				component: () => import('@/views/qiwei/qw-contact/contact-list.vue')
			},
			{
				path: 'qw-contact-add',
				icon: '',
				name: 'qw-contact-add',
				meta: {
					title: '企微联系方式创建'
				},
				title: '企微联系方式创建',
				component: () => import('@/views/qiwei/qw-contact/contact-list-form.vue')
			},
			{
				path: 'qw-contact-edit/:id',
				props: true,
				icon: '',
				name: 'qw-contact-edit',
				meta: {
					title: '企微联系方式编辑'
				},
				title: '企微联系方式编辑',
				component: () => import('@/views/qiwei/qw-contact/contact-list-form.vue')
			},
			{
                path: 'qw-phone-call',
                icon: '',
                name: 'qw-phone-call',
                meta: {
                    title: '电话呼出'
                },
                title: '电话呼出',
                component: () => import('@/views/qiwei/phone-call/phone-call-list.vue')
            },
			{
                path: 'phone-call-form',
                icon: '',
                name: 'phone-call-form',
                meta: {
                    title: '电话呼出'
                },
                title: '电话呼出',
                component: () => import('@/views/qiwei/phone-call/phone-call-form.vue')
            },
			{
                path: 'phone-new-notification',
                icon: '',
                name: 'phone-new-notification',
                meta: {
                    title: '消息推送'
                },
                title: '消息推送',
                component: () => import('@/views/qiwei/phone-new-notification/new-notification-list.vue')
            },
			{
                path: 'new-notification-form',
                icon: '',
                name: 'new-notification-form',
                meta: {
                    title: '消息推送'
                },
                title: '消息推送',
                component: () => import('@/views/qiwei/phone-new-notification/new-notification-form.vue')
            },
			{
                path: 'verbal-trick-list',
                icon: '',
                name: 'verbal-trick-list',
                meta: {
                    title: '话术列表'
                },
                title: '话术列表',
                component: () => import('@/views/qiwei/verbal-trick/verbal-trick-list.vue')
            },
			{
                path: 'note-tpl-list',
                icon: '',
                name: 'note-tpl-list',
                meta: {
                    title: '短信模板'
                },
                title: '短信模板',
                component: () => import('@/views/qiwei/note-tpl/note-tpl-list.vue')
            },
			{
                path: 'outbound-routes-list',
                icon: '',
                name: 'outbound-routes-list',
                meta: {
                    title: '外呼线路列表'
                },
                title: '外呼线路列表',
                component: () => import('@/views/qiwei/outbound-routes/outbound-routes-list.vue')
            },
			//ai电话的加微奖励
			{
                path: 'add-wx-award',
                icon: '',
                name: 'add-wx-award',
                meta: {
                    title: '加微奖励',
                    groups: 'qiwei'
                },
                title: '加微奖励',
                component: () => import('@/views/qiwei/add-wx-award/reward-list.vue')
            },
			{
                path: 'add-wx-award-record',
                icon: '',
                name: 'add-wx-award-record',
                meta: {
                    title: '加微奖励活动记录',
                },
                title: '加微奖励活动记录',
                component: () => import('@/views/qiwei/add-wx-award-record/record-list.vue')
            },
            {
                path: 'add-wx-award-edit',
                icon: '',
                name: 'add-wx-award-edit',
                meta: {
                    title: '加微奖励编辑'
                },
                title: '加微奖励编辑',
                component: () => import('@/views/qiwei/add-wx-award/reward-edit.vue')
            },
		]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	loginRouter,
	otherRouter,
	locking,
	...appRouter,
	page500,
	page403,
	page404
];

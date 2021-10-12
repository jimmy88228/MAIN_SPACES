<style lang="less">
	.link-to{
	.ivu-tag{
		text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	    max-width: 200px;
	}
}
</style>

<template>
	<span class="link-to">
		<template v-if="selectLink.code=='' || selectLink.code== null || selectLink.name== null || selectLink.name== '' ">
			<Select v-model="selectLink.code" size="small" style="width:120px;" placeholder="请选择" clearable @on-change="onChange">
				<template v-for="(item,index) in linktoListView">
					<template v-if="isPc == 1 && item.canPc == 1">
						<Option :value="item.code" :name="index">
							{{ item.name }}
						</Option>
					</template>
					<template v-if="isPc == 0">
						<Option :value="item.code" :name="index">
							{{ item.name }}
						</Option>
					</template>
				</template>
			</Select>
		</template>
		<template v-else>
			<Poptip confirm v-model="showPoptip" title="确定删除链接吗？" @on-ok="closeTag">
				<Tag type="border" closable @click.native.stop="showPop" @on-close="showPop" style="cursor: pointer;">
					{{sourceTypeName}} {{selectLink.name}}
				</Tag>
			</Poptip>
		</template>

		<!--选择链接的源-->
		<selectSourceId ref="select-source-id" @on-ok="onSourceOk" @on-cancel="onSourceCancel"></selectSourceId>

		<!--自定义url地址-->
		<customUrl ref="custom-url" @on-ok="onSourceOk" @on-cancel="onSourceCancel"></customUrl>
		
		<!--小程序跳转-->
		<appletJump ref="applet-jump" @on-ok="onSourceOk" @on-cancel="onSourceCancel"></appletJump>
		
		<!--小程序跳转到视频号-->
		<jumpVideo ref="jump-video" @on-ok="onSourceOk" @on-cancel="onSourceCancel"></jumpVideo>
		
		<!--选择商品-->
		<goodsSelect ref="goods-select" @on-ok="onGoodsSelectOk"></goodsSelect>
		<!--选择微页面-->
		<goodsPageSelect ref="page-select" @on-ok="onPagesSelect"></goodsPageSelect>
		<!--选择商品分类-->
		<goodsCatSelect ref="goods-cat-select" @on-ok="onGoodsCatSelectOk"></goodsCatSelect>

		<!--选择商品分类-->
		<goodsVcatSelect ref="goods-vcat-select" @on-ok="onGoodsVcatSelectOk"></goodsVcatSelect>
		
		<!--搭配套餐-->
		<packageGoodsSelect ref="package-goods-select" @on-ok="onPackageGoodsSelectOk"></packageGoodsSelect>
		
		<!--积分商品-->
		<integralGoodsSelect ref="integral-goods-select" @on-ok="onIntegralGoodsSelectOk"></integralGoodsSelect>
		
		<!--砍价商品-->
		<kansaleGoodsSelect ref="kansale-goods-select" @on-ok="onKansaleGoodsSelectOk"></kansaleGoodsSelect>
		
		<!--限时特惠商品选择器-->
		<limitSelect></limitSelect>
		
		<!--秒杀分组选择器-->
		<seckillGroupSelect></seckillGroupSelect>
		
		<!--预售商品选择器-->
		<presaleSelect></presaleSelect>
		
		<!--拼团商品选择器-->
		<pinSelect></pinSelect>
		
		<!--抽奖活动选择器-->
		<lotterySelect></lotterySelect>
		
		<!--商品品牌选择器-->
		<goodsBrandSelect></goodsBrandSelect>
		
		<!--优惠券选择器-->
		<couponSelect></couponSelect>
	</span>
</template>

<script>
	/**
	 * 活动页：链接到，公共组件
	 */
	import selectSourceId from '@/views/my-components/link-to/select-source-id';
	import customUrl from '@/views/my-components/link-to/custom-url';
	import appletJump from '@/views/my-components/link-to/applet-jump';
	import jumpVideo from '@/views/my-components/link-to/jump-video';
	import goodsSelect from '@/views/my-components/goods-select/goods-select';
	import goodsPageSelect from '@/views/my-components/goods-page-select/goods-page-select';
	import goodsCatSelect from '@/views/my-components/goods-cat-select/goods-cat-select';
	import goodsVcatSelect from '@/views/my-components/goods-vcat-select/goods-vcat-select';
	import packageGoodsSelect from '@/views/my-components/packagesale-goods-select/packagesale-goods-select';
	import integralGoodsSelect from '@/views/my-components/integral-goods-select/integral-goods-select';
	import kansaleGoodsSelect from '@/views/my-components/kansale-goods-select/kansale-goods-select';
	
	import limitSelect from '@/views/my-components/list-component/index-edit';
	import seckillGroupSelect from '@/views/my-components/list-component/index-edit';
	import presaleSelect from '@/views/my-components/list-component/index-edit';
	import pinSelect from '@/views/my-components/list-component/index-edit';
	import lotterySelect from '@/views/my-components/list-component/index-edit';
	import goodsBrandSelect from '@/views/my-components/list-component/index-edit';
	import couponSelect from '@/views/my-components/list-component/index-edit';
	
	export default {
		name: 'linkTo',
		components: {
			selectSourceId,
			customUrl,
			appletJump,
			jumpVideo,
			goodsSelect,
			goodsPageSelect,
			goodsCatSelect,
			goodsVcatSelect,
			limitSelect,
			seckillGroupSelect,
			presaleSelect,
			pinSelect,
			lotterySelect,
			goodsBrandSelect,
			packageGoodsSelect,
			integralGoodsSelect,
			kansaleGoodsSelect,
			couponSelect,
		},
		props: {
			// 已选中的
			selectLink: {
				type: [Object, Array],
				default(){
					return {
						code: '',
						id: 0,
						name: ''
					}
				}
			},
			// 父数组索引
			itemIndex: {
				type: Number,
				default(){
					return 0
				}
			},
			// 是否 pc 前端使用的链接
			isPc: {
				type: Number,
				default(){
					return 0
				}
			},
			showLimit: {
				type: Array,
				default(){
					return []
				}
			},
			hideLimit: { // 相对于showLimit,权限最重
				type: Array,
				default(){
					return []
				}
			}
		},
		data() {
			return {
				linktoList: [],
				showPoptip: false,
				// 源类型名称
				sourceTypeName: '',
				modelLink: {
					code: '',
					name: '',
					id: 0
				}
			}
		},
		computed:{
			linktoListView(){
				let linktoList = this.linktoList || [];
				let showLimit = this.showLimit || [];
				let hideLimit = this.hideLimit || [];
				let result = [];
				for(let i = 0; i < linktoList.length; i++){
					let code = linktoList[i].code || "";
					if(code){
						if(showLimit.length > 0 || hideLimit.length > 0){
							if(showLimit.length > 0 && showLimit.indexOf(code) != -1 && hideLimit.length == 0){
								result.push(linktoList[i]);
							}
							if(hideLimit.length > 0 && showLimit.indexOf(code) == -1){
								result.push(linktoList[i]);
							}
						} else {
							result.push(linktoList[i]);
						}
						
					}
				}
				return result;
			}
		},
		methods: {
			// 初始化
			init() {
				this.$nextTick(() => {
					this.initData();
				});
			},
			initData() {
				var mainData = JSON.parse(this.$util.cache.get('mainFrameData'));
				if (mainData != null && typeof(mainData.data) !== 'undefined') {
					this.linktoList = mainData.data.linkTo;
					this.modelLink = this.selectLink;

					for (var i in this.linktoList) {
						if (this.linktoList[i].code == this.selectLink.code) {
							this.sourceTypeName = '[' + this.linktoList[i].name + ']';
							break;
						}
					}
					if (typeof(this.modelLink) === 'undefined') {
						this.modelLink = {
							code: '',
							name: '',
							id: 0,
							sn: ''
						};
					}
				}
			},
			showPop() {
				if (this.showPoptip == false) {
					this.showPoptip = true;
				}
			},
			// 选中了 需要选择源的选项；
			onChange(code) {
				var mustSource = false;
				var selectName = '';
				for (var i in this.linktoList) {
					if (this.linktoList[i].code == code) {
						selectName = this.linktoList[i].name;

						// 判断是否要弹出选项框
						if (this.linktoList[i].mustSourceId == 1) {
							mustSource = true;
						}
						break;
					}
				}

				if (mustSource) {
					// 需要弹出选项框
					switch (code) {
						case 'customUrl':
							// 打开自定义URL的组件
							this.$refs['custom-url'].openBox(code, 0);
							break;
						
						case 'channelsLive':
							this.$refs['jump-video'].openBox(code, 0);
							break;
						
						case 'appletJump':
							this.$refs['applet-jump'].openBox(code, 0);
							break;
								
						case 'goodsUrl':
							this.$refs['goods-select'].openModal([], 'radio');
							break;

						case 'pageUrl':
							this.$refs['page-select'].openModal([], 'radio');
							break;

						case 'goodsCatUrl':
							this.$refs['goods-cat-select'].openModal([], 'radio');
							break;

						case 'goodsVcatUrl':
							this.$refs['goods-vcat-select'].openModal([], 'radio');
							break;
						
						case 'packageGoodsUrl':
							this.$refs['package-goods-select'].openModal([], 'radio');
							break;
						
						case 'integralGoodsUrl':
							this.$refs['integral-goods-select'].openModal([], 'radio');
							break;
						
						case 'kanSaleUrl':
							this.$refs['kansale-goods-select'].openModal([], 'radio');
							break;
									
						case 'limitSaleUrl':
							this.$selectContent({
								mode: 'limit',
								type: 'radio',
								data: [],
								getList: (data) => {
									this.onLimitSelectOk( data );
								}
							})
							break;
							
						case 'presaleUrl':
							this.$selectContent({
								mode: 'presale',
								type: 'radio',
								data: [],
								getList: (data) => {
									this.onPresaleSelectOk( data );
								}
							})
							break;
							
						case 'secKillGroupUrl':
							this.$selectContent({
								mode: 'seckill-group',
								type: 'radio',
								data: [],
								getList: (data) => {
									this.onSeckillGroupSelectOk( data );
								}
							})
							break;
						
						case 'pinSaleUrl':
							this.$selectContent({
								mode: 'pin',
								type: 'radio',
								data: [],
								getList: (data) => {
									this.onPinSaleSelectOk( data );
								}
							})
							break;
								
						case 'lotteryUrl':
							this.$selectContent({
								mode: 'lottery',
								type: 'radio',
								data: [],
								getList: (data) => {
									this.onLotterySelectOk( data );
								}
							})
							break;
						
						case 'goodsBrandUrl':
							this.$selectContent({
								mode: 'goods-brand',
								type: 'radio',
								data: [],
								getList: (data) => {
									this.onGoodsBrandSelectOk( data );
								}
							})
							break;
						
						case 'couponUrl':
							this.$selectContent({
								mode: 'coupon',
								type: 'radio',
								data: [],
								getList: (data) => {
									this.onCouponSelectOk( data );
								}
							})
							break;
							
						default:
							// 打开选择源ID的组件
							this.$refs['select-source-id'].openBox(code, 0, this.isPc);
					}
				} else {
					// 只是单选，无需弹出选项框，无需选择源，传递参数给父组件
					this.$set(this.modelLink, 'name', selectName);
					this.$set(this.modelLink, 'code', code);

					this.$emit('on-selected', this.itemIndex, {
						code: code,
						id: 0,
						name: selectName,
						sn: ''
					});
				}
			},
			// 源取消
			onSourceCancel() {
				this.$set(this.modelLink, 'code', null);
			},
			// 关闭选择的镖旗
			closeTag() {
				this.$set(this.selectLink, 'code', null);
				this.$set(this.selectLink, 'name', null);
				this.showPoptip = false;
				this.$emit('on-reset');
			},
			// 商品选择的，回调
			onGoodsSelectOk(obj) {
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'goodsUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: obj[0].code, // 链接带的参数统一用sn 标识
					typeName: '商品', // 类型名称
				});
			},
			// 微页面的选中回调
			onPagesSelect(obj) {
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'pageUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: obj[0].code, // 链接带的参数统一用sn 标识
					typeName: '微页面', // 类型名称
				});
			},
			// 商品分类选择的，回调
			onGoodsCatSelectOk(obj) {
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'goodsCatUrl',
					id: obj[0].cat_id,
					name: obj[0].cat_name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '商品分类', // 类型名称
				});
			},
			// 商品虚拟分类选择的，回调
			onGoodsVcatSelectOk(obj) {
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'goodsVcatUrl',
					id: obj[0].vcat_id,
					name: obj[0].vcat_name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '商品分类', // 类型名称
				});
			},
			// 商品搭配套餐，回调
			onPackageGoodsSelectOk(obj){
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'packageGoodsUrl',
					id: obj[0].id,
					name: obj[0].package_name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '商品搭配套餐', // 类型名称
				});
			},
			// 积分商品，回调
			onIntegralGoodsSelectOk( obj ){ 
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'integralGoodsUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '积分商品', // 类型名称
				});
			},
			// 砍价商品，回调
			onKansaleGoodsSelectOk( obj ){ console.log( obj );
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'kanSaleUrl',
					id: obj[0].id,
					name: obj[0].goods_name,
					sn: obj[0].goods_sn, // 链接带的参数统一用sn 标识
					typeName: '砍价商品', // 类型名称
				});
			},
			// 限时特惠选择，回调
			onLimitSelectOk( obj ){
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'limitSaleUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '限时特惠', // 类型名称
				});
			},
			// 秒杀分组，回调
			onSeckillGroupSelectOk( obj ){
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'secKillGroupUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '秒杀分组', // 类型名称
				});
			},
			// 预售商品，回调
			onPresaleSelectOk( obj ){
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'presaleUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '预售商品', // 类型名称
				});
			},
			// 拼团商品，回调
			onPinSaleSelectOk( obj ){ 
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'pinSaleUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '拼团商品', // 类型名称
				});
			},
			// 抽奖活动，回调
			onLotterySelectOk( obj ){ 
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'lotteryUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '抽奖活动', // 类型名称
				});
			},
			// 商品品牌，回调
			onGoodsBrandSelectOk( obj ){ 
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'goodsBrandUrl',
					id: obj[0].goods_brand_id,
					name: obj[0].goods_brand_name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '商品品牌', // 类型名称
				});
			},
			// 优惠券选择，回调
			onCouponSelectOk( obj ){
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'couponUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '优惠券', // 类型名称
				});
			},
			// 源框勾选了某项 子组件回调
			onSourceOk(code, row) {
				this.$set(this.modelLink, 'name', row.name);
				this.$set(this.modelLink, 'code', code);

				for (var i in this.linktoList) {
					if (this.linktoList[i].code == code) {
						this.sourceTypeName = '[' + this.linktoList[i].name + (code == 'customUrl' ? row.sn : '') + ']';
						break;
					}
				}

				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: code,
					id: code == 'qmenu' ? row.router : row.id,
					name: row.name,
					sn: row.sn, // 链接带的参数统一用sn 标识
					typeName: this.sourceTypeName // 类型名称
				});
			}
		},
		watch: {
			// 监听菜单是否已经初始化完毕
			'isInitMenu'(to) {
				if (to == true) {
					// 这里异步是防止cook 未写完就去读
					window.setTimeout(() => {
						this.initData();
					}, 500);
				}
			},
			'selectLink'(to) {
				for (var i in this.linktoList) {
					if (this.linktoList[i].code == to.code && to.code != 'customUrl') {
						this.sourceTypeName = '[' + this.linktoList[i].name + ']';
						break;
					}
				}
			},
		},
		mounted() {
			this.init();
		}
	}
</script>

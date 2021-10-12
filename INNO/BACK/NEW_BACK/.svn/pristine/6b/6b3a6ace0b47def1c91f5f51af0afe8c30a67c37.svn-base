<template>
	<Modal
	class-name="product-service-modal"
	v-model="isShowModal"
	:transition-names="['slide-down','fade']"
	:fullscreen="true"
	>
		<div slot="header" class="search-area text-r">
			<Input
			style="width:250px;margin-left: auto;margin-right: 20px;"
			v-model="keyWord"
			placeholder="请输入菜单名称"
			clearable
			search
			enter-button
			@on-search="search"
			@on-clear="search"
			@keydown.native.enter.prevent="search">
			</Input>
		</div>
		<div class="product-service menu-list flex">
			<div class="menu-list-item" v-for="(lItem, lIndex) in adminMenuList" :key="lItem.name" v-show="!lItem.isHide">
				<div class="m-l-title">
					<icon :type="lItem.icon" size="16"/>&nbsp;{{lItem.title}}
				</div>
				<div class="m-l-cont" v-for="(iItem, iIndex) in lItem.children" :key="iItem.name" v-show="!iItem.isHide">
					<div class="m-item-title">{{iItem.title}}</div>
					<div>
						<p class="m-item-cont" v-show="!item.menuHidden && !item.isHide" v-for="(item, index) in iItem.children" :key="item.name" @click="getMenu(item.name)">{{item.title}}</p>
					</div>
				</div>
			</div>
			<div v-if="!hasShow" class="no-product-service">
				暂无匹配菜单
			</div>
		</div>
	</Modal>
</template>
<script>
	export default{
		data(){
			return {
				isShowModal: false,
				adminMenuList: [],
				keyWord: "",
				hasShow: true
			}
		},
		computed:{
			
		},
		methods:{
			initData(adminMenuList){
				console.log("adminMenuList", adminMenuList)
				this.adminMenuList = adminMenuList;
			},
			showModal(){
				this.isShowModal = true;
			},
			search(){
				let keyWord = this.keyWord;
				let adminMenuList = this.adminMenuList || [];
				this.hasShow = this.setMenuHide(adminMenuList, keyWord);
			},
			setMenuHide(data, keyWord){ // 递归循环，父组件isHide通过判断子组件列表所有项isHide
				let isHasShow = false;
				for(let i = 0; i < data.length; i++){
					let item = data[i] || {};
					if(item.children && item.children.length > 0 && item.children[0].name){
						let _itemHasShow = this.setMenuHide(item.children, keyWord);
						this.$set(data[i], 'isHide', !_itemHasShow);
						if(_itemHasShow){
							isHasShow = true;
						}
					} else {
						let title = item.title || "";
						let isHide = keyWord ? ((title.indexOf(keyWord) == -1) ? true : false) : false;
						this.$set(data[i], 'isHide', isHide);
						if(!isHide){
							isHasShow = true;
						}
					}
				}
				return isHasShow;
			},
			getMenu(name){
				if(name){
					this.isShowModal = false;
					this.$nextTick(()=>{
						this.$router.push({
							name: name
						})
					})
				}
			}
		}
	}
</script>
<style lang="less">
	.product-service{
		.menu-list-item{
			line-height: 40px;
			border-right: 1px solid #ddd;
			text-align: center;
			display: inline-block;
			padding: 0px 10px;
			transition: top .35s;
			-moz-transition: top .35s;
			-webkit-transition: top .35s;
			-o-transition: top .35s;
			transition: left .35s;
			-moz-transition: left .35s;
			-webkit-transition: left .35s;
			-o-transition: left .35s;
			vertical-align: top;
			.m-l-title{
				font-weight: bold;
				width:142px;
			}
			.m-l-cont{
				background: #efefef;
				margin-top: 10px;
				.m-item-title{
					width: 142px;
					background: #e4e4e4;
					color: #a6a7a7;
				}
				.m-item-cont{
					display: block;
					width: 142px;
					color: #333;
					cursor:pointer;
				}
				.m-item-cont:hover{
					background-color:#eaeaea;
				}
			}
		}
		.no-product-service{
			width:100%;
			text-align:center;
			padding: 100px 0px;
		}
	}
	.product-service-modal{
		.ivu-modal-body{
			background-color:#F6F6F6;
			position:relative;
		}
	}
</style>
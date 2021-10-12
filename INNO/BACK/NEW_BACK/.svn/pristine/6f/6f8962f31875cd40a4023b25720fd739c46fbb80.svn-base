<style lang="less">
.member-card-form{
	.image-box{
		width:80px;
		height:80px;
		line-height:90px;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    cursor: pointer;
	    background: center center no-repeat;
	    background-size: 100% auto;
	}
}
</style>
	
<template>
	<div class="member-card-form">
	<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="110">
		<Collapse v-model="collapse" accordion @on-change="collapseChange">
			<Panel name="box1">
				卡面信息
				<p slot="content">
					<FormItem label="品牌名称" prop="brand_name">
						<Input v-model="formItem.brand_name" placeholder="例如:海底捞火锅" style="width:210px;" 
						maxlength="12" show-word-limit></Input>
					</FormItem>
					<FormItem label="品牌Logo" prop="logo_url">
						<div class="image-box" 
							@click="openImagesModal('logo_url', formItem.logo_url )" 
							:style="'background-image: url('+formItem.logo_url+');'">
							<Icon type="md-add" size="35" v-show="(formItem.logo_url==''|| formItem.logo_url==null ?true:false)"></Icon>
						</div>
						<div style="width:100%;">建议像素在 300X300</div>
					</FormItem>	
					<FormItem label="卡券名称" prop="title">
						<Input v-model="formItem.title" placeholder="例如:VIP会员卡" style="width:210px;" 
						maxlength="9" show-word-limit></Input>
					</FormItem>
					<FormItem label="卡券整体颜色" prop="color">
						<Select v-model="formItem.color" style="width:160px" @on-change="onColorChange">
							<Option v-for="item in colorList" :key="item.code" :value="item.code">
								<span :style="{padding:'5px 20px','margin-right':'10px','background-color':item.val}"></span>{{ item.code }}
							</Option>
						</Select>
						<span :style="{padding:'5px 20px','margin-left':'10px','background-color':currColor}"></span>
					</FormItem>	
					<FormItem label="会员卡背景图" prop="background_pic_url">
						<div class="image-box"
							@click="openImagesModal('background_pic_url', formItem.background_pic_url )" 
							:style="'background-image: url('+formItem.background_pic_url+');'">
							<Icon type="md-add" size="35" v-show="(formItem.background_pic_url==''|| formItem.background_pic_url==null ?true:false)"></Icon>
						</div>
						<div style="width:100%;float:left;">像素大小控制在 1000X600 以下</div>
					</FormItem>
					<FormItem label="卡码展示方式" prop="code_type">
						<Select v-model="formItem.code_type" style="width:160px">
							<Option v-for="item in codeTypeList" :key="item.code" :value="item.code">
								{{ item.name }}
							</Option>
						</Select>
					</FormItem>	
					
					<FormItem label="客服电话" prop="service_phone">
						<Input v-model="formItem.service_phone" placeholder="" style="width:180px;"></Input>
					</FormItem>
					<FormItem label="使用提醒" prop="notice">
						<Input v-model="formItem.notice" placeholder="例如：使用时向服务员出示此卡" 
						style="width:280px;"
						maxlength="16" show-word-limit></Input>
					</FormItem>
					<FormItem label="会员卡特权说明" prop="prerogative">
						<Input v-model="formItem.prerogative" type="textarea" placeholder="例如：
1.激活送积分；
2.购物享9折；" 
						style="width:280px;" :rows="3"
						maxlength="1024" show-word-limit></Input>
					</FormItem>
					<FormItem label="会员卡使用说明" prop="description">
						<Input v-model="formItem.description" type="textarea" placeholder="例如：
1.积分可兑换商品；
2.积分年末清零；"
						style="width:280px;" :rows="3"
						maxlength="1024" show-word-limit></Input>
					</FormItem>
				</p>
			</Panel>
			
			<Panel name="box2">
				中部菜单
				<p slot="content">
					<FormItem label="显示菜单">
						<CheckboxGroup v-model="formItem.show_menus">
							<Checkbox label="integral">积分</Checkbox>
							<Checkbox label="coupons">优惠券</Checkbox>
							<Checkbox label="balance">余额</Checkbox>
							<Checkbox label="rank">等级</Checkbox>
						</CheckboxGroup>
						<div>最多显示3个</div>
					</FormItem>
					<FormItem label="余额/储值说明">
						<Input v-model="formItem.balance_rules" type="textarea" placeholder="" style="width:280px;"
						maxlength="60" :rows="3" show-word-limit></Input>
					</FormItem>
					<FormItem label="中间大按钮名称">
						<Input v-model="formItem.center_title" placeholder="例如:会员中心" style="width:210px;"
						maxlength="9" show-word-limit></Input>
					</FormItem>
					<FormItem label="大按钮链接地址">
						<linkTo
							:selectLink="( formItem.center_url != null ? formItem.center_url : {})" 
							@on-selected="onSelectCenterUrl">
						</linkTo>
					</FormItem>	
					<FormItem label="大按钮下方提示语">
						<Input v-model="formItem.center_sub_title" placeholder="例如: 请点击进入" style="width:210px;"
						maxlength="12" show-word-limit></Input>
					</FormItem>
				</p>
			</Panel>
			
			<Panel name="box3">
				底部菜单
				<p slot="content">
					<FormItem label="自定义入口1名称">
						<Input v-model="formItem.custom_url_name" placeholder="" style="width:210px;"
						maxlength="7" show-word-limit></Input>
					</FormItem>
					<FormItem label="自定义入口1链接">
						<linkTo
							:selectLink="( formItem.custom_url != null ? formItem.custom_url : {})" 
							@on-selected="onSelectCenterUrl">
						</linkTo>
					</FormItem>	
					<FormItem label="入口1提示语">
						<Input v-model="formItem.custom_url_sub_title" placeholder="" style="width:210px;"
						maxlength="6" show-word-limit></Input>
					</FormItem>
					
					<Divider />
					
					<FormItem label="自定义入口2名称">
						<Input v-model="formItem.custom_cell1_name" placeholder="" style="width:210px;"
						maxlength="7" show-word-limit></Input>
					</FormItem>
					<FormItem label="自定义入口2链接">
						<linkTo
							:selectLink="( formItem.custom_cell1_url != null ? formItem.custom_cell1_url : {})" 
							@on-selected="onSelectCenterUrl">
						</linkTo>
					</FormItem>	
					<FormItem label="入口2提示语">
						<Input v-model="formItem.custom_cell1_tips" placeholder="" style="width:210px;"
						maxlength="6" show-word-limit></Input>
					</FormItem>
					
					<Divider />
					
					<FormItem label="自定义入口3名称">
						<Input v-model="formItem.promotion_url_name" placeholder="" style="width:210px;"
						maxlength="7" show-word-limit></Input>
					</FormItem>
					<FormItem label="自定义入口3链接">
						<linkTo
							:selectLink="( formItem.promotion_url != null ? formItem.promotion_url : {})" 
							@on-selected="onSelectCenterUrl">
						</linkTo>
					</FormItem>	
					<FormItem label="入口3提示语">
						<Input v-model="formItem.promotion_url_sub_title" placeholder="" style="width:210px;"
						maxlength="6" show-word-limit></Input>
					</FormItem>
				</p>	
			</Panel>
			
		</Collapse>
	</Form>	
	
	<!--用户图片管理组件-->
	<userImages ref="userImages" @on-return-url="returnImageUrl"></userImages>
	
	</div>
</template>	

<script>
import userImages from '@/views/my-components/user-images/user-images';
import linkTo from '@/views/my-components/link-to/link-to';

/**
 * 微信会员卡，卡面设置表单
 */	
export default {
	name: 'weixinMemberCardForm',
    components: {
		userImages,
		linkTo,
    },
	props:{

	},
    data() {
    	return {
			id: 0,
			colorList: [],
			codeTypeList: [],
			collapse: 'box1',
			currColor: '',
			
			formItem:{
				center_url: null,
				custom_url: null,
				custom_cell1_url: null,
				promotion_url: null,
			},
			// 表单数据规则
			ruleValidate:{
				brand_name:[{ required: true, message: '品牌名字不能为空', trigger: 'blur' },],
				logo_url:[{ required: true, message: '品牌Logo不能为空', trigger: 'blur' },],
				title:[{ required: true, message: '卡券名称不能为空', trigger: 'blur' },],
				notice: [{ required: true, message: '不能为空', trigger: 'blur' },],
				prerogative: [{ required: true, message: '会员卡特权说明名称不能为空', trigger: 'blur' },],
				description: [{ required: true, message: '会员卡使用说明名称不能为空', trigger: 'blur' },],
			},
		}
	},
	methods: {
		// 提供给父组件使用
		initData( id, data, cardInfo ){
			this.id = id;
			this.formItem = data;
			
			this.colorList = cardInfo.cardColorList;
			this.codeTypeList = cardInfo.codeTypeList;
			
			this.onColorChange( this.formItem.color );
			
			this.$store.commit('setWxCardCurrCollapse', '');
			setTimeout(()=>{
				this.$store.commit('setWxCardCurrCollapse', 'box1' );
			},1000);
		},
		onColorChange( val ){
			this.formItem.color = val;
			for(var i in this.colorList){
				if( this.colorList[i].code == this.formItem.color ){
					this.currColor = this.colorList[i].val;
					this.$store.commit('setWxCardCurrColor', this.currColor );
					break;
				}
			}
		},
		// 调起图片选择器
		openImagesModal( name, url ){
			var obj = {
				name: name,
				selectedImage: url,
			};
			this.$refs['userImages'].showModal( obj );
		},
		// 图片选择组件的回调
		returnImageUrl( obj ){
			this.$set(this.formItem, obj.name, obj.val);	
			// 获取图片的相对名称
			this.$set(this.formItem,obj.name, obj.val);	
			
			// 检查某个字段
			if( obj.name == 'logo_url'){
				this.$refs['formValidate'].validateField('logo_url', ( msg )=>{});
			}
		},
		onSelectCenterUrl( index, selectedLink ){
			this.$set( this.formItem, 'center_url', selectedLink );
		},
		// 变化事件
		collapseChange( arr ){
			if( arr.length > 0 ){
				this.$store.commit('setWxCardCurrCollapse', arr[0] );
			}
		},
		// 保存按钮
		onSave(){
			this.$refs['formValidate'].validate((valid) => {
		        if (valid) {
		        	this.spinShow = true;
		        	
		        	this.formItem.order_price_type == 0 ? this.formItem.order_price = 0 : '';
		        	
					this.$delete( this.formItem, 'access-token');
		        	this.$ajax.post( this.$api.weixinMemberCardSave, {
						id: this.id,
		        		data: JSON.stringify( this.formItem ),
		        	})
		    		.then( (response) => {
		    			var res = response.data;
		    			this.spinShow = false;
		    			
		    			if( res.code ){
		    				this.$Message.success( res.message );
		    			}
						
						this.$emit('on-success');
						
		    		});
				}
				else{
					this.$Message.error('必填项不能为空');
					
					this.$emit('on-success');
				}
		    });    
		},
	},
}	
</script>
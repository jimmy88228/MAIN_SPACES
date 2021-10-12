<template>
	<div class="invite-list-form">
    <pageTopBase :isSave="true" @save="saveInvite">
			<template v-slot:action>
			  <div class="steps">
			    <Steps :current="tabIndex">
			        <Step title="基本详情" @click.native="showAds(0)" style="cursor: pointer;"></Step>
			        <Step title="邀请公众号注册奖励" @click.native="showAds(1)" style="cursor: pointer;"></Step>
							<Step title="邀请新会员首单奖励" @click.native="showAds(2)" style="cursor: pointer;"></Step>
			    </Steps>
			  </div>
			</template>
			<Tabs v-model="tabIndex">
				<TabPane label="基本详情">
					<Form :label-width="150" ref="baseFormItem" :model="formItem" :rules="ruleValidate">
						<FormItem label="活动名称" prop="activity_name">
							<Input v-model.trim="formItem.activity_name" class="basic_input" clearable placeholder="活动名称"></Input>
						</FormItem>
						<FormItem label="活动时间" prop="to_time">
							<dateSelect defaultTime="" :customDate="[formItem.from_time, formItem.to_time]"
								@sT="changeStartDate" @eT="changeEndDate"></dateSelect>
								<Input v-show="false" v-model="formItem.to_time"></Input>
						</FormItem>
						<FormItem label="是否开启">
							<i-switch v-model="formItem.is_enabled" :true-value="1" :false-valie="0">
								<span slot="open">开启</span>
								<span slot="close">关闭</span>
							</i-switch>
						</FormItem>
						<FormItem label="活动页面背景图片" prop="bg_img">
							<div class="flex">
								<div class="f-shrink0">
									<image-edit :img="formItem.bg_img"
										@selectImg="openImagesModal('bg_img', formItem.bg_img)"
										@delImg="handleDelImg('bg_img')" />
										<Input v-model="formItem.bg_img" v-show="false"></Input>
								</div>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<ol class="inline-b p-left-15">
									<li>小于500K的图片</li>
									<li>JPG/PNG格式</li>
								</ol>
							</div>
						</FormItem>
						<FormItem label="福利展示图片" prop="reward_img">
							<div class="flex">
								<div class="f-shrink0">
									<image-edit :img="formItem.reward_img"
										@selectImg="openImagesModal('reward_img', formItem.reward_img)"
										@delImg="handleDelImg('reward_img')" />
										<Input v-model="formItem.reward_img" v-show="false"></Input>
								</div>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<ol class="inline-b p-left-15">
									<li>小于500K的图片</li>
									<li>JPG/PNG格式</li>
								</ol>
							</div>
						</FormItem>
						<FormItem label="分享海报" prop="share_poster">
							<div class="flex">
								<div class="f-shrink0">
									<image-edit :img="formItem.share_poster"
										@selectImg="openImagesModal('share_poster', formItem.share_poster)"
										@delImg="handleDelImg('share_poster')" />
										<Input v-model="formItem.share_poster" v-show="false"></Input>
								</div>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<ol class="inline-b p-left-15">
									<li>小于500K的图片</li>
									<li>JPG/PNG格式</li>
								</ol>
							</div>
						</FormItem>
						<FormItem label="活动规则" prop="activity_rule">
							<Button type="dashed" @click="handleReturnSelected" class="basic_select">{{get_activity.id ?  get_activity.name : '请选择活动规则'}}</Button>
						</FormItem>
					</Form>
				</TabPane>
				<TabPane label="邀请公众号注册奖励">
					<Form :label-width="150">
						<FormItem>
							<div slot="label">
								<Tooltip content="奖励按满足的最高级条件赠送" transfer>
										邀请者奖励<Icon type="ios-help-circle" size="16"/>
								</Tooltip>
							</div>
							<div class="m-bottom-10">
								<rewardSet v-for="(item, index) in formItem.register_rule" :key="item.id" :rewardItem="item" @removeReward="removeReward('register_rule', index)"></rewardSet>
								<div class="p-15 text-c" style="background-color:#efefef;" v-if="formItem.register_rule.length == 0">暂无奖励设置</div>
							</div>
							<div class="m-bottom-10">邀请者允许次数&nbsp;<InputNumber v-model="formItem.register_benefit_count"/>&nbsp;<span class="s-notice">*邀请人数超过允许次数，将不再赠送奖励</span></div>
							<div class="m-bottom-10">
								<Button type="primary" @click="addDiscount('register_rule')">增加一级优惠</Button>
							</div>
						</FormItem>
						<FormItem label="新会员奖励">
							<div class="m-bottom-10"><span class="inline-b" style="width: 60px;">积分</span>&nbsp;<InputNumber v-model="formItem.register_give_point"/></div>
							<div class="flex">
								<span class="inline-b" style="width: 60px;">优惠券</span>&nbsp;
								<selectView :data="register_coupon" type="checkbox" @del-tag="(data)=>handleCouponClose('register_coupon','register_give_coupon_ids', data)"><Button type="primary" @click="chooseCoupon('register_coupon', 'register_give_coupon_ids')">选择优惠券</Button></selectView>
							</div>
						</FormItem>
					</Form>
				</TabPane>
				<TabPane label="邀请新会员首单奖励">
					<Form :label-width="150">
						<FormItem>
							<div slot="label">
								<Tooltip content="奖励按满足的最高级条件赠送" transfer>
										邀请者奖励<Icon type="ios-help-circle" size="16"/>
								</Tooltip>
							</div>
							<div class="m-bottom-10">
								<rewardSet v-for="(item, index) in formItem.order_rule" :key="item.id" type="order" :rewardItem="item" @removeReward="removeReward('order_rule', index)"></rewardSet>
								<div class="p-15 text-c" style="background-color:#efefef;" v-if="formItem.order_rule.length == 0">暂无奖励设置</div>
							</div>
							<div class="m-bottom-10">邀请者允许次数&nbsp;<InputNumber v-model="formItem.order_benefit_count"/>&nbsp;<span class="s-notice">*邀请人数超过允许次数，将不再赠送奖励</span></div>
							<div class="m-bottom-10">
								<Button type="primary" @click="addDiscount('order_rule')">增加一级优惠</Button>
							</div>
						</FormItem>
						<FormItem label="新会员奖励">
							<div class="m-bottom-10"><span class="inline-b" style="width: 60px;">积分</span>&nbsp;<InputNumber v-model="formItem.order_give_point"/></div>
							<div class="flex">
								<span class="inline-b" style="width: 60px;">优惠券</span>&nbsp;
								<selectView :data="order_coupon" type="checkbox" @del-tag="(data)=>handleCouponClose('order_coupon', 'order_give_coupon_ids', data)"><Button type="primary" @click="chooseCoupon('order_coupon', 'order_give_coupon_ids')">选择优惠券</Button></selectView>
							</div>
						</FormItem>
					</Form>
				</TabPane>
			</Tabs>
		</pageTopBase>
	</div>
</template>
<script>
import pageTopBase from '@/views/my-components/page-top-base/index';
import dateSelect from '@/views/my-components/date-select/index.vue';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import rewardSet from './components/reward-set.vue';
import selectView from '@/views/my-components/list-component/index-edit'
export default {
    name: "inviteListForm",
    components: {
        pageTopBase,
				dateSelect,
				ImageEdit,
				rewardSet,
				selectView
    },
    data(){
        return {
					tabIndex: 0,
					id: 0,
					formItem: {
						'activity_name': '',
            'from_time': '',
            'to_time': '',
            'is_enabled': 0,
            'reward_img': '',
            'bg_img': '',
            'share_poster': '',
            'activity_rule': 0,
            'register_rule': [],
            'register_benefit_count': 0,
            'register_give_point': 0,
            'register_give_coupon_ids': '',
            'order_rule': [],
            'order_benefit_count':0,
            'order_give_point': 0,
            'order_give_coupon_ids': ''
					},
					ruleValidate: {
						activity_name: [{ required: true, message: '请完善活动名称', trigger: 'blur' }],
						bg_img: [{ required: true, message: '请完善活动页面背景图', trigger: 'blur' }],
						reward_img: [{ required: true, message: '福利展示图片', trigger: 'blur' }],
					},
					get_activity: {},
					register_coupon: [],
					order_coupon: []
				}
    },
    mounted(){
        this.initParams();
				this.loadData();
    },
    methods:{
        initParams(){
          let query = this.$route.query || {};
					this.id = parseInt(query.id) || 0;
        },
				loadData(){
					if(!this.id) return;
					this.$store.commit("setLoading", true);
					return this.$ajax.post(this.$api.invitePrizeInfo, {
						id: this.id
					}).then((response)=>{
						let res = response.data || {};
						if(res.code){
							let data = res.data || {};
							let items = data.items || {};
							let get_rule = items.get_rule || [];
							this.get_activity = items.get_activity || {};
							this.register_coupon = get_rule[0].bonus_data || [];
							this.order_coupon = get_rule[1].bonus_data || [];
							this.formItem = {
								activity_name: items.activity_name,
								'from_time': items.from_time,
		            'to_time': items.to_time,
		            'is_enabled': parseInt(items.is_enabled),
		            'reward_img': items.reward_img,
		            'bg_img': items.bg_img,
		            'share_poster': items.share_poster,
		            'activity_rule': this.get_activity.id,
		            'register_rule': get_rule[0] && get_rule[0].get_details_rule,
		            'register_benefit_count': get_rule[0] && parseInt(get_rule[0].benefit_count),
		            'register_give_point': get_rule[0] &&  parseInt(get_rule[0].new_user_point),
		            'register_give_coupon_ids': get_rule[0] && get_rule[0].new_user_coupon_ids,
		            'order_rule': get_rule[1] && get_rule[1].get_details_rule,
		            'order_benefit_count': get_rule[1] &&  parseInt(get_rule[1].benefit_count),
		            'order_give_point': get_rule[1] &&  parseInt(get_rule[1].new_user_point),
		            'order_give_coupon_ids': get_rule[1] && get_rule[1].new_user_coupon_ids
							}
							
						}
					}).finally(()=>{
						this.$store.commit("setLoading", false);
					})
				},
				showAds(index) {
					this.tabIndex = index;
				},
				changeStartDate(date) {
					this.formItem.from_time = date;
				},
				changeEndDate(date) {
					this.formItem.to_time = date;
				},
				openImagesModal(name, url) {
					this.$selectMaterial({
						type: 'image',
						selectedData: url,
						getList: (item) => {
							console.log("img",item)
							if(name) this.formItem[name] = item.src;
						}
					});
				},
				handleDelImg(key){
					if(key) this.formItem[key] = ""
				},
				handleReturnSelected () {
				  this.$selectContent({
				    mode: 'protocol',
				    type: 'radio',
				    data: [this.get_activity],
				    getList: (data) => {
				      this.get_activity = data[0];
							this.formItem.activity_rule = data[0].id || 0;
				    }
				  });
				},
				addDiscount(key){
					this.formItem[key].push({
						user_count: 0,
						point: 0,
						point_multiple: 0,
						redpack_activity_ids: '',
						coupon_ids: ''
					})
				},
				removeReward(key, index){
					if(key){
						this.$delete(this.formItem[key], index)
					}
				},
				chooseCoupon(dataKey, idsName){
					this.$selectContent({
						mode: "coupon",
						data: this[dataKey] || [],
						getList:(data)=>{
							this[dataKey] = data || [];
							let ids = "";
							for(let i = 0; i < data.length; i++){
								let id = data[i].id || 0;
								if(id){
									ids = ids ? ids + ',' + id : id;
								}
							}
							this.formItem[idsName] = ids || '';
						}
					})
				},
				handleCouponClose(dataKey, idsName, data){
					this[dataKey] = data;
					let ids = "";
					for(let i = 0; i < data.length; i++){
						let id = data[i].id || 0;
						if(id){
							ids = ids ? ids + ',' + id : id;
						}
					}
					this.formItem[idsName] = ids || '';
				},
				saveInvite(){
					this.$refs["baseFormItem"].validate((valid)=>{
						console.log("valid",valid);
						if(valid){
							let req = this.id ? 'invitePrizeEdit' : 'invitePrizeAdd';
							let params = this.formItem;
							if(this.id) params.id = this.id;
							return this.$ajax.post(this.$api[req], params).then((response)=>{
								let res = response.data || {};
								if(res.code){
									this.$Message.success(res.message);
									this.$router.go(-1);
								} else {
									this.$Message.warning(res.message);
								}
							})
						} else {
							this.$Message.warning("请完善基本信息");
						}
						
					})
				}
    }
}
</script>
<style  lang="less">
    .invite-list-form{
        .steps{
            position: absolute;
						width: 60%;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
        }
				.ivu-tabs{
					.ivu-tabs-bar{
						display:none;
					}
				}
    }
</style>

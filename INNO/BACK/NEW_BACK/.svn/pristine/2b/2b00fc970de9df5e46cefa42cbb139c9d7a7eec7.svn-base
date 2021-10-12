<style lang="less">
	.group_message_edit_area {
		overflow: hidden;
		background-color: #ffffff;
		margin: 10px;
		border-radius: 10px;

		.input_style {
			margin: 5px;
		}

		.input_style_table {
			// margin-top: 10px;
			// margin-left: 20px;
			// margin-right: 20px;
		}

		.page_style {
			text-align: center;
			margin-bottom: 20px;
		}

		.radio_div {
			height: 200px;
			overflow: scroll;
			overflow: auto;
		}

		.colorshow {
			color: #bfc2c5;
			margin-left: 3px;
			height: 20px;
		}
		.group_data_view{
			position: relative;
			padding-left: 160px;
		}
		.card_style {
			position:absolute;
			top:0px;
			left:0px;
			.ivu-collapse {
				overflow: hidden;
			}
			.ivu-collapse-item {
				.ivu-collapse-header {
					width: 160px;
					.ivu-icon-ios-arrow-forward {
						right: 10px;
						margin: 0px;
						margin-top: -7px;
					}
				}

				.ivu-icon {
					position: absolute;
					top: 50%;
					right: 10%;
					margin-top: -4px;
				}

				.ivu-collapse-content {
					padding-left: 25px;
					padding-right: 10px;
					box-sizing: border-box;
					width: 100%;
				}
			}

			.bg_28A5FF {
				.ivu-collapse-header {
					color: #fff;
				}
			}

			.content_mess {
				padding-right: 10px;
				position: relative;

				.ivu-icon {
					position: absolute;
					top: 50%;
					right: 0px;
					margin-top: -6px;
				}

				.ivu-badge {
					position: absolute;
					top: 50%;
					right: 10px;
					transform: translateY(-50%);
					-ms-transform: translateY(-50%);
					-moz-transform: translateY(-50%);
					-webkit-transform: translateY(-50%);
					-o-transform: translateY(-50%);
				}

				.ivu-badge-count {
					border-radius: 4px;
					-moz-border-radius: 4px;
					-webkit-border-radius: 4px;
				}

			}

		}

		.table_tab {
			border-radius: 10px;
			width: 100%;
			display:inline-flex;
			padding:20px 1%;
			box-sizing: border-box;
		}

		.ivu-col-span-11 {
			width: 100%;
		}
		.demo-badge {
			width: 100%;
			line-height: 30px;
			border-radius: 6px;
			display: inline-block;
		}

		.demo-badge-alone {
			background: #29A6FF !important;
		}

		.content_mess {
			line-height: 30px;
			cursor: pointer;
		}

		.ivu-badge-count {
			background: #29A6FF;
		}

		.ivu-badge {
			float: right;
		}

		.grounp_tab_area {
			.ivu-tabs-card{
				width:100%;
			}
			.ivu-tabs-bar {
				margin-bottom: 0px;
				border: 0 none;
			}

			.ivu-tabs-content {
				padding-top: 20px;
				border: 1px solid #dddee1;
				-moz-border-radius: 5px;
				-webkit-border-radius: 5px;
				border-radius: 5px;
			}
		}

	}

	.over_hidden {
		padding: 10px;
		height: 200px;
		overflow: scroll;
		overflow: auto;
		position: relative;
	}

	.check_box_group {
		.check_box_item {
			width: 200px;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}
	.user_tag_checklist{
		.user_tag_checkbox{
			width: 150px;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}
	.user_right_checklist{
		.user_right_checkbox{
			width: 130px;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}
	.has_no_data {
		text-align: center;
		margin-top: 100px;
	}
</style>

<template>
	<pageTopBase :isSave="true" @save="allmessage" class="group_message_edit_area">
		<!-- <div style="">
			<div class="">
				<div class="input_style inline_b" style="margin-left:20px;">
					<Button @click="goback">返回</Button>
					<Button type="primary" @click="allmessage">保存</Button>
				</div>

				<div class="input_style inline_b" style="float:right;margin-right:20px;">

					<Button type="primary" @click="gotoactivity">创建活动</Button>
				</div>
			</div>
			<div class="oh">
				<div class="input_style inline_b" style="margin-left:20px;">
					分组名称 <Input v-model="group_name" placeholder="分组名" clearable style="width: 200px"></Input>
				</div>
			</div>
		</div> -->
		<div class="flex f-just-between m-bottom-15">
			<div>
				分组名称 <Input v-model="group_name" placeholder="分组名" clearable style="width: 200px"></Input>
			</div>
			<div>
				<Button type="primary" @click="gotoactivity">创建活动</Button>
			</div>
		</div>

		<div class="flex group_data_view" style="width:100%;">
			<div class="card_style f-shrink0">
				<Collapse v-model="tag_list">
					<Panel :name="item.id" v-for="(item,c_index)  in taglist" :label="item.id" :key="item.title">
						{{item.title}}
						<p 
						class="content_mess"
						slot="content" 
						v-for="(sonitem,s_index)  in item.son"
						:label="sonitem.son_id" 
						:key="sonitem.son_title" 
						:name="sonitem.son_title"
						@click="showmessage(item.id,sonitem.son_id,c_index,s_index,sonitem.select_have,sonitem.type)">
							{{sonitem.son_title}}
							<Badge :count="sonitem.select"></Badge>
							<Icon type="chevron-right"></Icon>
						</p>
					</Panel>
				</Collapse>
			</div>
			<div class="table_tab grounp_tab_area">
				<Tabs type="card">
					<TabPane label="会员360">
						<dataView :grounpId="groudId"></dataView>
					</TabPane>
					<TabPane label="会员列表">
						<div class="input_style_table">
							<Table border :columns="header" :data="data" width="100%" ref="table"></Table>
						</div>
						<br>
						<div class="page_style">
							<Page :total="number" :page-size="page_size" show-total @on-change="changePage"></Page>
						</div> 
					</TabPane>
				</Tabs>
			</div>
		</div>
		
		
		
		
		<!--用户标签-->
		<Modal v-model="seart_modal" :width="600" @on-ok="asyncOK(typenum,one_index,two_index)">
			<div class="oh flex">
				<div class="input_style">
					<Input v-model="key" placeholder="关键字模糊查询" clearable style="width: 200px"></Input>
				</div>&nbsp;
				<div class="input_style">
					<Button type="primary" icon="ios-search" @click="searttab">搜索</Button>
					<Button type="primary" @click="tagcreate(typenum,one_index,two_index)">重置</Button>
					<Button type="primary" icon="ios-search" @click="searttabshow(usertag)">显示已选择</Button>
				</div>
			</div>&nbsp;
			<div class="over_hidden">
				<Spin size="large" fix v-if="spinShow"></Spin>
				<CheckboxGroup class="user_tag_checklist" v-model="usertag" size="large">
					<Checkbox :title="item.tag_name" class="user_tag_checkbox" style="margin-right:20px;margin-top:10px;" v-for="item in usertag_list" :label="item.id"
						:key="item.id">{{item.tag_name}}</Checkbox>
				</CheckboxGroup>
			</div>

		</Modal>
		<!---->
		<Modal v-model="one_modal" @on-ok="asyncOK(typenum,one_index,two_index)">
			<div class="oh">
				<div class="input_style inline_b">
					<Button type="primary" @click="tagcreate(typenum,one_index,two_index)">重置</Button>
				</div>
			</div>
			<div class="over_hidden">
				<Spin size="large" fix v-if="spinShow"></Spin>
				<CheckboxGroup class="user_right_checklist" v-model="useright" size="large">
					<Checkbox class="user_right_checkbox" :title="item.name" style="margin-right:20px;margin-top:10px;" v-for="item in useright_list" :label="item.id"
						:key="item.id">{{item.name}}</Checkbox>
				</CheckboxGroup>
			</div>
		</Modal>
		<!---->
		<Modal v-model="onecheck_modal" @on-ok="asyncOK(typenum,one_index,two_index)"
			width="300px;" :title="title_show">
			<RadioGroup v-model="radio_type" size="large">
				<Radio label="-1">不限</Radio>
				<Radio label="0">{{radio_one}}</Radio>
				<Radio label="1">{{radio_two}}</Radio>

			</RadioGroup>
		</Modal>
		<!--城市/门店选择  -->
		<Modal v-model="seart_city" width="740">
			<Spin size="large" fix v-if="spinShow"></Spin>
			<div class="flex m-bottom-10">
				<div class="input_style">
					<Input v-model="key_city" placeholder="关键字模糊查询，可以搜索多个,以英文逗号隔开" clearable
						style="width: 200px"></Input>
				</div>&nbsp;
				<Select v-model="searchAgentId" clearable class="input_style" style="width:200px">
					<Option value="0">全部</Option>
					<Option :value="item.agent_id" v-for="(item,index) in agentList" :key="index" :name="index">
						<span v-for="i in item.level">&nbsp; &nbsp;</span>
						{{item.agent_name}}
						<span style="float:right;color:#ccc;" v-if="item.agent_type==1">自营</span>
						<span style="float:right;color:#ccc;" v-if="item.agent_type==2">加盟</span>
						<span style="float:right;color:#ccc;" v-if="item.agent_type==3">代理</span>
					</Option>
				</Select>&nbsp;
				<div class="input_style">
					<Button type="primary" icon="ios-search"
						@click="seartcity(city_val,one_index,two_index,value_type)">搜索</Button>
					<Button type="primary" @click="tagcreate(typenum,one_index,two_index)">重置</Button>
					<Button type="primary" @click="seartcityshow(city_val,value_type)">显示已选择</Button>
				</div>
			</div>
			<div class="over_hidden">
				<CheckboxGroup v-model="city_val" size="large" class="check_box_group" v-if="city_list.length > 0">
					<Checkbox 
					class="check_box_item"
					:title="item.tag_name"
					v-for="item in city_list" :label="item.id" :key="item.id">{{item.tag_name}}</Checkbox>
				</CheckboxGroup>
				<div class="has_no_data" v-else>没有数据</div>
			</div>
			<div slot="footer">
				<div class="flex f-just-between" style="position:relative;z-index:10;">
					<div class="" >
						<p v-if="spinShow">加载数据比较多, 请稍等...</p>
					</div>
					<div>
						<Button type="primary" @click="switchCheckAllStore('select')">全选</Button>
						<Button type="primary" @click="switchCheckAllStore('noSelect')">取消全选</Button>
						<Button @click="seart_city = false">取消</Button>
						<Button type="primary" @click="asyncOK(typenum,one_index,two_index)">确定</Button>
					</div>
				</div>
			</div>
		</Modal>
	</pageTopBase>
</template>
<script>
	import pageTopBase from "@/views/my-components/page-top-base/index.vue";
	import Cookies from 'js-cookie';
	import util from '@/libs/util.js';
	import dataView from './data_view';
	export default {
		components: {
			dataView,
			pageTopBase
		},
		data() {
			return {
				groudId: 0,
				value_type: '',
				spinShow: false,
				group_name: '',
				seartcat_id: '',
				searttable: '',
				one_index: '',
				two_index: '',
				title_show: '',
				radio_one: '',
				radio_two: '',
				radio_type: '',
				key_city: '',
				seart_city: false,
				city_list: [],
				city_val: [],
				searchAgentId: 0,
				agentList: [],
				one_modal: false,
				useright_list: [],
				useright: [],
				onecheck_modal: false,
				one_model: false,
				typeshow: '',
				typenum: '',
				activity_message: [],
				usertag_list: [],
				usertag: [],
				seart_modal: false,
				header: [],
				data: [],
				number: 0,
				page_size: 15,
				datetime: '',
				key: '',
				tag_list: 'base',
				taglist: [],
				formvalue: {
					sex: '',
					user_ranks: '',
					star_sign: '',
					areas: '',
					birth_month: '',
					is_bind_mobile: '',
					is_weixin_subscribe: '',
					usertag_basic: '',
					usertag_buy: '',
					usertag_goods: '',
					smart_mkt_tagids: '',
					visit_tagids: '',
					manual_tagids: '',
					r_ids: '',
					f_ids: '',
					m_ids: '',
				},
			}
		},
		methods: {
			getGrounpId() {
				this.groudId = this.$route.query.id || 0;
				this.editType = this.$route.query.type || "";
			},
			leftmess() { //获取左边信息
				this.$store.commit("setLoading", true);
				return this.$ajax.post(this.$api.GetMemberGroupUserlist,{
					id: this.groudId
				}).then(response => {
					let res = response.data;
					if (res.code) {
						let data = res.data || {};
						this.taglist = data.lefttag;
						let header = data.header || [];
						this.formvalue.sex = data.activity_message.sex;
						this.formvalue.is_bind_mobile = data.activity_message.is_bind_mobile;
						this.formvalue.is_weixin_subscribe = data.activity_message.is_weixin_subscribe;
						this.group_name = data.activity_message.group_name;
						for(let i = 0; i < header.length; i++){
							header[i].minWidth = header[i].width;
							delete header[i].width;
						}
						header[(header.length - 1)]['render'] = (h, params) => {
							const row = params.row;
							let color = row.weixinSubscribe == 1 ? 'success' : 'error';
							let text = row.weixinSubscribe == 1 ? '是' : '否';
							return h('div', [
								h('Button', {
									props: {
										type: color,
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {

									}
								}, text),
							]);
						};
						this.header = header || [];
						console.log("header", header);
					}
				}).finally(() => {
					this.$store.commit("setLoading", false);
				})
			},
			gettablelist() {
				if(!this.groudId){
					return;
				}
				this.$ajax.post(this.$api.GetMemberGroupMessageurl, {
					id: this.groudId,
				}).then((response) => {
					let res = response.data;
					let data = res.data || [];
					this.data = data.message || [];
					this.number = data.count || 0;
				});
			},
			allmessage() { //保存
				if (this.group_name == '' || !this.group_name) {
					this.$Notice.error({
						title: '错误提示！',
						desc: '分组名字不能为空！'
					});
					return false;
				}
				if (!this.checkedTag()) {
					this.$Notice.error({
						title: '错误提示！',
						desc: '请至少设置一个分组条件！'
					});
					return false;
					console.log(this.taglist);
					return false;
				}
				this.$store.commit("setLoading", true);
				return this.$ajax.post(this.$api.SaveMemberGroupmessage, {
					id: this.groudId,
					type: this.editType,
					from_value: this.taglist,
					group_name: this.group_name,
				}).then((response) => {
					let res = response.data || {};
					if(res.code){
						if (this.groudId == '0' || !this.groudId) {
							this.groudId = res.id;
						}
					}
					this.$Message.info(res.message);
				}).finally(()=>{
					this.$store.commit("setLoading", false);
				})
			},
			changePage(page) {
				if(!this.groudId){
					return;
				}
				this.$ajax.post(this.$api.GetMemberGroupMessageurl, {
					id: this.groudId,
					page: page,
				}).then((response) => {
					var res = response.data;
					this.data = res.message;
				});
			},
			showmessage(table, cat, c_index, s_index, select_have, type) {
				console.log('type:', type)
				//获取对应的标签
				if (type == 'one') {
					this.getrightmessage(table, cat, select_have, c_index, s_index);
					this.one_modal = true;
				}
				if (type == 'more') {
					this.searttable = table;
					this.seartcat_id = cat;
					this.key = '';
					this.getusertag(table, cat, c_index, s_index, select_have);
					this.seart_modal = true;
				}
				if (type == 'one_check') {
					this.checkedone(cat, select_have, c_index, s_index);
					this.onecheck_modal = true;
				}
				if (type == 'more_city') {
					if (cat == '11') {
						this.value_type = 'store';
					} else {
						this.value_type = '';
					}
					this.key_city = '';
					this.seartcity(select_have, c_index, s_index, this.value_type);
					this.seart_city = true;
				}
			},
			checkedone(show, select_have, c_index, s_index) { //单项选择
				if (show == '1') { //性别
					this.typenum = 'radio_type';
					this.one_index = c_index;
					this.two_index = s_index;

					this.title_show = '性别';
					this.radio_one = '男';
					this.radio_two = '女';
					this.radio_type = select_have;
				}
				if (show == '6') { //手机
					this.typenum = 'radio_type';
					this.one_index = c_index;
					this.two_index = s_index;

					this.title_show = '是否绑定手机';
					this.radio_one = '未绑定';
					this.radio_two = '已绑定';
					this.radio_type = select_have;
				}
				if (show == '7') { //微信公众号
					this.typenum = 'radio_type';
					this.one_index = c_index;
					this.two_index = s_index;

					this.title_show = '否关注公众号';
					this.radio_one = '未关注';
					this.radio_two = '已关注';
					this.radio_type = select_have;
				}
			},
			seartcity(select_have, c_index, s_index, value_type) { //搜索城市
				this.spinShow = true;
				this.typenum = 'city_val';
				this.one_index = c_index;
				this.two_index = s_index;
				this.$ajax.post(this.$api.GetMemberGroupCity, {
					key: this.key_city || "",
					value_type: value_type || "",
					agentId: this.searchAgentId || 0
				}).then((response) => {
					console.log("response", response)
					let res = response.data || {};
					let data = res.data || {};
					this.city_list = data.message || [];
					this.city_val = select_have;
					this.agentList = data.agentList || [];
				}).finally(()=>{
					this.spinShow = false;
				})
			},
			seartcityshow(value, value_type) {
				this.$ajax.post(this.$api.MemberGroupGetcity, {
					show: 1,
					value: value || "",
					value_type: value_type || "",
					agentId: this.searchAgentId || 0
				}).then((response) => {
					var res = response.data || {};
					this.city_list = res.message;
					//this.agentList=res.agentList || [];
				});
			},
			getusertag(table, cat, c_index, s_index, select_have) { //获取标签数据
				this.typenum = 'usertag';
				this.one_index = c_index;
				this.two_index = s_index;
				console.log("table", table);
				this.spinShow = true;
				this.$ajax.post(this.$api.GetMemberGroupTagMessages, {
					table: table,
					cat_id: cat,
				}).then((response) => {
					let res = response.data || {};
					let data = res.data || []
					this.usertag_list = data;
					this.usertag = select_have;
				}).finally(()=>{
					this.spinShow = false;
				})
			},
			getrightmessage(table, type, select_have, c_index, s_index) { //获取其他杂项数据
				if (table == '1' && type == '2') { //会员等级
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				if (table == '1' && type == '3') { //星座
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				if (table == '1' && type == '5') { //生日
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				if (table == '1' && type == '8') { //年龄
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				if (table == '1' && type == '9') { //会龄
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				if (table == '1' && type == '10') { //会员来源
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				if (table == 'rfm' && type == 'r') { //r
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				if (table == 'rfm' && type == 'f') { //f
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				if (table == 'rfm' && type == 'm') { //m
					this.typenum = 'useright';
					this.one_index = c_index;
					this.two_index = s_index;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.GetMemberGroupRightmessage, {
					type: type
				}).then((response) => {
					var res = response.data;
					if(res.code){
						let data = res.data;
						this.useright_list = data || [];
						this.useright = select_have;
					}
				}).finally(()=>{
					this.spinShow = false;
				})
			},
			tagcreate(num, one, two) { //重置
				if (num == 'useright') {
					this.useright = [];
					this.taglist[one].son[two].select_have = [];
					this.taglist[one].son[two].select = 0;
				}
				if (num == 'radio_type') {
					this.radio_type = '-1';
					this.taglist[one].son[two].select_have = -1;
					this.taglist[one].son[two].select = 0;
				}
				if (num == 'city_val') {
					this.city_val = [];
					this.searchAgentId = 0;
					this.taglist[one].son[two].select_have = [];
					this.taglist[one].son[two].select = 0;
				}
				if (num == 'usertag') {
					this.usertag = [];
					this.taglist[one].son[two].select_have = [];
					this.taglist[one].son[two].select = 0;
				}
			},
			searttabshow(value) { //显示已选择
				this.spinShow = true;
				// MemberGroupGetsearttag
				this.$ajax.post(this.$api.GetMemberGroupTagMessages, {
					show: 1,
					value: value,
					table: this.searttable,
					cat_id: this.seartcat_id,
				}).then((response) => {
					let res = response.data || {};
					let data = res.data || [];
					this.usertag_list = data;
				}).finally(()=>{
					this.spinShow = false
				})
			},
			searttab() { //搜索标签
				this.spinShow = true;
				// MemberGroupGetsearttag
				this.$ajax.post(this.$api.GetMemberGroupTagMessages, {
					key: this.key,
					table: this.searttable,
					cat_id: this.seartcat_id,
				}).then((response) => {
					let res = response.data || {};
					let data = res.data || [];
					this.usertag_list = data;
				}).finally(()=>{
					this.spinShow = false;
				})
			},
			asyncOK(num, one, two) { //type:要选择的选项，num:选择后的内容，one:键值，two:健值
				this.seart_modal = false;
				if (num == 'useright') {
					this.taglist[one].son[two].select_have = this.useright;
					this.taglist[one].son[two].select = this.useright.length;
				}
				if (num == 'radio_type') {
					var num = 0;
					if (this.radio_type > -1) {
						num = 1;
					} else {
						num = 0;
					}
					this.taglist[one].son[two].select_have = this.radio_type;
					this.taglist[one].son[two].select = num;
				}
				if (num == 'city_val') {
					this.seart_city = false;
					this.taglist[one].son[two].select_have = this.city_val;
					this.taglist[one].son[two].select = this.city_val.length;
				}
				if (num == 'usertag') {
					this.taglist[one].son[two].select_have = this.usertag;
					this.taglist[one].son[two].select = this.usertag.length;
				}
				console.log(this.taglist);
			},
			
			//未处理
			gotoactivity() {
				// var type = this.$route.params.type;
				// var id = this.groudId;
				// if (type == 'brand_group') {
				// 	window.location.href = 'http://' + window.location.hostname +
				// 		'/inno/label_voluntary.php?act=voluntary_user&id=' + id + '&type=' + type +
				// 		'&showtype=member_group&t=' + Date.parse(new Date());
				// }
				// if (type == 'system_group') {
				// 	window.location.href = 'http://' + window.location.hostname +
				// 		'/inno/label_voluntary.php?act=voluntary_user&id=' + id + '&type=' + type +
				// 		'&showtype=member_group&t=' + Date.parse(new Date());
				// }
				// if (type == 'all_group') {
				// 	window.location.href = 'http://' + window.location.hostname +
				// 		'/inno/label_voluntary.php?act=voluntary_user&id=' + id + '&type=' + type +
				// 		'&showtype=member_group&t=' + Date.parse(new Date());
				// }
				this.$Message.info()
			},
			// 检测分组是否已经选择条件
			checkedTag() {
				var is_ok = false;
				for (var k in this.taglist) {
					for (var i in this.taglist[k]['son']) {
						if (this.taglist[k]['son'][i]['select'] > 0) {
							is_ok = true;
							return is_ok
						}
					}
				}
				return is_ok;
			},
			switchCheckAllStore(type) {
				let city_list = this.city_list || [];
				if (type == "select") {
					let city_list = this.city_list || [];
					let city_val = this.city_val || [];
					let city_val_str = "," + city_val.join(",") + ",";
					for (let i = 0; i < city_list.length; i++) {
						if (city_val_str.indexOf("," + city_list[i].id + ",") == -1) {
							city_val.push(city_list[i].id);
						}
					}
					this.city_val = city_val;
				} else if (type == "noSelect") {
					this.city_val = [];
				}
			}
		},
		mounted() {
			this.getGrounpId();
			this.leftmess();
			this.gettablelist();
		}
	}
</script>

<style lang="less">
.menu_box{
    border: 1px solid #E8E9EA;
    height: 420px;
    width: 364px;
    padding-top: 100px;
	padding-bottom: 100px;
    position: relative;
    overflow: visible;
    background: url('~@rs/images/weixin_menu.png') left top no-repeat #fff;
	background-size: 100%;

    .menu_icon2{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 62px;
        height: 40px;
        padding-left: 10px;
        padding-right: 10px;
        border-top: 1px solid #E8E9EA;

		background: url('~@rs/images/weixin_menu_kb.png') center no-repeat;
		background-size: 40%;
    }
    .menu_item_box {
        float: left;
        width: 100px;
        height: 93px;
        position: absolute;
        bottom: 0;
    }

    .box0{
        left: 62px;
    }
    .box1 {
        left: 162px;
    }
    .box2 {
        left: 262px;
    }

    .box0 .menu_item,
    .box0 .btn_menu_item_add{
        margin-right: -1px;
    }

    .box1 .menu_item,
    .box2 .btn_menu_item_add {
        margin-left: 0;
    }

    .box2 .menu_item,
    .box2 .btn_menu_item_add {
        margin-left: -1px;
    }

    .menu_c_box {
        position: absolute;
        bottom: 40px;
        left: 0px;
        width:100px;
    }
    .menu_p_box {
        position: absolute;
        bottom: 0px;
        border-bottom: 0;
        left: 0px;
        width:100px;
    }
    .menu_p_box .box0,
    .menu_p_box .box2,{
        width:101px;
    }
    .menu_item {
        border: 1px solid #E8E9EA;
        border-bottom: none;
        cursor: pointer;
        text-align: center;
        height: 40px;
        line-height: 40px;
    }
    .btn_menu_item_add{
        position: relative;
        color: #E8E9EA;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
        border: 1px solid #E8E9EA;
        cursor: pointer;
        height: 40px;
        line-height: 35px;
    }
    .down_arrow {
        position: absolute;
        bottom: 0;
        margin-bottom: -10px;
        left: 50%;
        margin-left: -5px;
        height: 18px;
        width: 10px;

		background:url('~@rs/images/down_arrow.png') center no-repeat;
    }
}

.edit_box{
    margin-left: 20px;
    position: absolute;
	left:380px;
	top:0;
    width:380px;
    margin-top: 80px;

    form{
        border: 1px solid #ddd;
        background: #fff;
        padding: 30px 30px 10px 20px;
        border-radius: 5px;
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .tran-resetform-enter-active {
      transition: all .3s ease;
    }
    .tran-resetform-leave-active {
      transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .tran-resetform-enter, .tran-resetform-leave-to{
      transform: translateX(30px);
      opacity: 0;
    }
}

.rsync_button{
	margin: 20px 0 20px 100px;
}
</style>

<template>
	<div>
		<div class="menu_box">
			<div class="menu_icon2"></div>

			<div v-for="(menu,index) in menus" :key="index" :class="[ 'menu_item_box', 'box'+index ]">
				<div class="menu_c_box">
					<div class="menu_c_item_box">
						<div v-for="(submenu,sindex) in menu.sub_button" :key="sindex"
						class="menu_item"
						@click="editSubMenu(index, sindex)">
							<span class="show_menu_name">{{submenu.name}}</span>
						</div>
					</div>
					<div class="btn_menu_item_add" @click="addSubMenu(index)"> <i class="down_arrow"></i> + </div>
				</div>
				<div class="menu_p_box menu_item"
				:style="index == 2 ? {'margin-left':'-2px',width:'102px'} : ( index == 1 ? {'margin-left': '-1px'} : '')"
				@click="editMenu(index)">
					<span class="show_menu_name">{{menu.name}}</span>
				</div>
			</div>
      
      <!--加载提示-->
      <Spin size="large" fix v-if="spinShow"></Spin>
		</div>

		<!--菜单同步按钮-->
		<div class="rsync_button">
			<Button v-if="canSave"
			v-show="showEditBox==false"
			type="primary"
			:loading="buttonLoading"
			@click="rsyncMenu">修改完毕，同步菜单到微信</Button>
		</div>

		<!--菜单编辑框-->
		<div class="edit_box">
			<transition name="tran-resetform">
			<Form ref="formValidate" v-show="showEditBox" :model="formItem" :rules="ruleValidate" :label-width="80">
				<FormItem label="菜单名称" prop="name">
		            <Input v-model="formItem.name" placeholder="请输入菜单名称" :maxlength="(isEditSubMenu?7:4)" show-word-limit></Input>
		        </FormItem>
				<FormItem v-if="formItem.can_edit_link" label="链接到" prop="link_str">
					<linkTo
					:selectLink="(typeof(formItem.link) != 'undefined' ? formItem.link : {})"
					@on-selected="onSelectLink"
					@on-reset="onResetLink">
					</linkTo>
				</FormItem>

		        <FormItem>
		            <Button type="primary" @click="goSave">确定</Button>
		            <Button type="warning" style="margin-left:5px;" @click="goRemove">删除菜单</Button>
		            <Button style="margin-left:5px;" @click="goCancel">取消</Button>
		        </FormItem>
			</Form>
			</transition>
		</div>

	</div>
</template>

<script>
import linkTo from '@/views/my-components/link-to/link-to';

export default {
	name: 'weixinMenu',
    components: {
        linkTo,
    },
    data () {

    	return {
    		menus: [],

    		formItem:{
    			index: 0,
    			subindex: 0,
				link: {},
				link_str:'',
    			name:'',
				can_edit_link: true,
    		},

    		// 表单数据规则
        	ruleValidate:{
				name:[{ required: true, message: '菜单名不能为空！', trigger: 'blur' }],
				link_str:[{ required: true, message: '链接不能为空！', trigger: 'blur' }],
        	},

        	showEditBox:false,
        	buttonLoading:false,

			isEditSubMenu: false,
        	canSave:true,

          spinShow:true,
    	}
    },
    methods: {
    	// 初始化方法
        init () {
          this.spinShow = true;

			// ajax 请求获取初始化数据
			this.$ajax.post( this.$api.weixinMenuList, {

			})
			.then( (response) => {
        this.spinShow = false;
				var res = response.data;

				if( res.code ){
					// 初始化表单数据
					this.menus = res.data;
				}
				else{
					this.canSave = false;

					this.$Notice.error({
						title: '出错了',
						desc: res.message
					});
				}
			});
        },
        // 添加子菜单
        addSubMenu( index ){

        	if( typeof(this.menus[index].sub_button) == 'undefined'){
        		this.$set(this.menus[index], 'sub_button', []);
        	}

        	if( this.menus[index].sub_button.length < 5 ){
	        	this.menus[index].sub_button.push({
	        		name: '子菜单'+(Number(this.menus[index].sub_button.length)+1),
	        		url: '',
	        		key: '',
					link: {},
	        	});
        	}
        	else{
        		this.$Notice.info({
                    title: '提示',
                    desc: '微信二级菜单不能超过5个！'
                });
        		return ;
        	}
        },
        // 编辑主菜单
        editMenu( index ){
        	this.formItem.index = index;
        	this.formItem.subindex = -1;
        	this.formItem.name = this.menus[index].name;
			this.formItem.link = this.menus[index].link;
			this.formItem.link_str = typeof(this.formItem.link.code) != 'undefined' ? 'ok' : '';

			this.formItem.can_edit_link = this.menus[index].sub_button.length > 0 ? false : true;

        	this.showEditBox = true;
			this.isEditSubMenu = false;
        },
        // 编辑子菜单
        editSubMenu( index, subIndex ){
        	this.formItem.index = index;
        	this.formItem.subindex = subIndex;
        	this.formItem.name = this.menus[index].sub_button[subIndex].name;
			this.formItem.link = this.menus[index].sub_button[subIndex].link;
			this.formItem.link_str = typeof(this.formItem.link.code) != 'undefined' ? 'ok' : '';

			this.formItem.can_edit_link = true;

        	this.showEditBox = true;
			this.isEditSubMenu = true;
        },
		// 链接到 选中后的回调
		onSelectLink( index, selectedLink ){
			this.$set( this.formItem, 'link', selectedLink );
			this.formItem.link_str = 'ok';

			// 检查某个字段
			this.$refs['formValidate'].validateField('link_str', ( msg )=>{});
		},
		// 重设链接
		onResetLink(){
			this.$set( this.formItem, 'link', {} );
			this.formItem.link_str = '';
		},
        // 取消
        goCancel(){
        	this.showEditBox = false;
        },
        // 移除菜单
        goRemove(){
			this.$Modal.confirm({
			    title: '操作提醒',
			    content: '确定删除菜单吗？',
			    okText: '确定删除',
			    cancelText: '取消',
			    onOk: () => {
					if( this.formItem.subindex == -1 ){
						this.$set( this.menus, this.formItem.index, {type:"",name:"新菜单",key:"", link:{} } );
					}
					else{
						this.$delete( this.menus[ this.formItem.index ].sub_button, this.formItem.subindex );
					}
					this.showEditBox = false;
				},
			});
        },
        // 临时保存
        goSave(){
        	this.$refs.formValidate.validate((valid) => {
                if (valid) {
					// 一级菜单
		        	if( this.formItem.subindex == -1 ){
		        		this.menus[ this.formItem.index ].name = this.formItem.name;
						this.menus[ this.formItem.index ].link = this.formItem.link;
		        	}
					// 二级菜单
		        	else{
		        		this.menus[ this.formItem.index ].sub_button[ this.formItem.subindex ].name = this.formItem.name;
						this.menus[ this.formItem.index ].sub_button[ this.formItem.subindex ].link = this.formItem.link;
		        	}

		        	this.showEditBox = false;
	        	}
            });
        },
		// 同步微信菜单
		rsyncMenu(){
			this.buttonLoading = true;

			// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.weixinMenuSave, {
   				menuData: this.menus,
				platform: this.$util.backendType,
        	})
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ){

                    this.$Notice.success({
	                    title: '提示',
	                    desc: res.message
	                });
    			}
    			else{
    				this.$Notice.error({
	                    title: '出错了',
	                    desc: res.message
	                });
    			}

    			this.buttonLoading = false;
			});
		}
    },
    computed: {

    },
    mounted () {
        // 放到了父组件触发 this.init();
    },
}
</script>

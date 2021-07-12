<style lang="less">
.cs-user-info-box{
  position: relative;

	.ivu-form-item{
		margin-bottom: 0;
	}
}
</style>

<template>
	<div class="cs-user-info-box">
		<div v-if="sessInfo.get_user_info != null">
			<Form :label-width="90" label-colon>
				<FormItem label="昵 称">
					{{sessInfo.get_user_info.wx_nick_name}}
				</FormItem>
				<FormItem label="性 别">
					{{sessInfo.get_user_info.gender == 1 ? '男' : (sessInfo.get_user_info.gender == 2 ? '女' : '未设置') }}
				</FormItem>
				<FormItem label="卡 号">
					{{sessInfo.get_user_info.card_num != null ? sessInfo.get_user_info.card_num : '无'}}
				</FormItem>
				<FormItem label="积 分">
					{{sessInfo.get_user_info.pay_points + ' 积分' }}
				</FormItem>
				<FormItem label="等 级">
					{{sessInfo.get_user_info.get_rank_info != null ? sessInfo.get_user_info.get_rank_info.rank_name : '无' }}
				</FormItem>
				<FormItem label="生 日">
					{{sessInfo.get_user_info.birthday != null ? sessInfo.get_user_info.birthday : '未设置' }}
				</FormItem>
				<FormItem label="所在地区">
					{{sessInfo.get_user_info.wx_province != null ? sessInfo.get_user_info.wx_province + ' '+ sessInfo.get_user_info.wx_city : '未设置' }}
				</FormItem>
				<FormItem label="注册时间">
					{{sessInfo.get_user_info.created_at_format}}
				</FormItem>
        <FormItem label="黑名单管理">
          <template v-if="sessInfo.get_user_info.in_blackbook == false">
            <a href="#" style="color:red;" @click.prevent="addBlackbook">
              拉入黑名单
            </a>
          </template>
          <template v-else>
            <a href="#" @click.prevent="removeBlackbook(sessInfo.get_user_info.id)">
              移出黑名单
            </a>
          </template>
        </FormItem>
			</Form>
      <span style="position: absolute;right:10px;top:-12px;font-size: 12px;">
      	<a href="#" @click.prevent="goUserDetail">
      		更多 <Icon type="ios-arrow-forward"></Icon>
      	</a>
      </span>
		</div>

    <!--添加黑名单表单-->
    <csBlackBookForm ref="cs-blackbook-form" @on-success="addBlackBookCallback"></csBlackBookForm>

	</div>
</template>

<script>
import csBlackBookForm from './cs-blackbook-form.vue';

/**
 * 用户详情框组件 组件
 */
export default {
	name:"csUserInfoBox",
    components: {
      csBlackBookForm
	},
	props:{

	},
	data () {
	    return {
			// 会话详情
			sessInfo:{
				get_user_info: null
			},
		}
	},
	methods: {
		goUserDetail(){
			window.open('/user/user-view/'+this.sessInfo.get_user_info.id );
		},
    getUserErpPoint(){
      this.$set(this.sessInfo.get_user_info, 'pay_points', '[正在查询..]' );
      // ajax 请求获取数据
      this.$ajax.post( this.$api.userErpPoint, {
        user_id: this.sessInfo.get_user_info.id
      })
      .then( (response) => {
      	var res = response.data;
      	if( res.code ){
      		// 获取erp积分
          this.$set(this.sessInfo.get_user_info, 'pay_points', res.data );
      	}
        else{
          this.$set(this.sessInfo.get_user_info, 'pay_points', '[查询失败]' );
        }
      });
    },
    // 添加黑名单
    addBlackbook(){
      this.$refs['cs-blackbook-form'].openModal({
        user_id: this.sessInfo.get_user_info.user_id,
        nick_name: this.sessInfo.get_user_info.wx_nick_name,
        avatar: this.sessInfo.get_user_info.wx_avatar,
      });
    },
    // 添加黑名单的回调
    addBlackBookCallback(){
      this.$set(this.sessInfo.get_user_info, 'in_blackbook', true );
    },
    // 移出黑名单
    removeBlackbook( userId ){
      this.$Modal.confirm({
          title: '操作提示',
          content: '确定把用户移出黑名单吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
              // ajax 请求获取数据，然后动态更新下面数据源
              this.$ajax.post( this.$api.csBlackBookRemove, {
                user_id: userId,
              })
            .then( (response) => {
              var res = response.data;
              if( res.code ){
                this.$Message.success( res.message );

                this.$set(this.sessInfo.get_user_info, 'in_blackbook', false );
              }
            });
          },
       });
    }
	},
	watch:{
		'$store.state.app.selectedCsSession' ( to ){
			this.sessInfo = to;
      if( this.$util.cache.get('is_erp_point') == 1 ){
        this.getUserErpPoint();
      }
		}
	}
}
</script>

<template>
  <div>
    <Modal
      class="brand-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="120">
          <FormItem label="等级代码" prop="rank_code">
            <Input v-model="formItem.rank_code" placeholder="等级代码的唯一标识码，数字和字符组成"></Input>
          </FormItem>
          <FormItem label="等级名称" prop="rank_name">
            <Input v-model="formItem.rank_name" placeholder="请输入等级名称"></Input>
          </FormItem>
          <FormItem label="是否启用" prop="is_enabled">
            <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
            <p class="strong_tips">关闭后该等级将失效，不计算分销员提成</p>
          </FormItem>
          <FormItem label="是否默认" prop="is_default">
            <i-switch size="large" v-model="formItem.is_default" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="排序号">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
          <FormItem label="关联用户等级" prop="related_user_rank">
            <UserRank :value.sync="formItem.related_user_rank" :isMulti="false"/>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import UserRank from '@/views/my-components/user-rank/index';

export default {
  mixins: [Dialog],
  components: {
    ImageEdit,
    EditSort,
    UserRank
  },
  data () {
    return {
      formItem: {
        id: 0,
        rank_code: '',
        rank_name: '',
        goods_brand_id: 0,
        is_enabled: '0',
        is_default: '0',
        sort: 0,
        related_user_rank: 0
      },
      sortVaild: false,
      // 表单数据规则
      ruleValidate: {
        rank_code: [
          { required: true, message: '等级代码不能为空', trigger: 'blur' },
          { min: 4, max: 20, message: '等级代码不能小于4个字符，最大20个字符！', trigger: 'blur' }
        ],
        rank_name: [{ required: true, message: '等级名称不能为空', trigger: 'blur' }],
        related_user_rank: [{
          required: true,
          message: '会员等级不能为空',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    handleSort (bool) {
      this.sortVaild = bool;
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        console.log(valid)
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.distributionRankAdd : this.$api.distributionRankEdit), this.formItem)
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success');
	              } else {
		    				this.showLoading();
		    			}
		    		});
        } else {
          // 验证失败，不关闭模态框
          this.showLoading();
        }
      });
    },
    // 打开模态框
    setData (row) {
    // 重置表单
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加会员等级';
      } else {
        this.modalTitle = '编辑会员等级';
        this.formItem = JSON.parse(JSON.stringify(row))
      }
      return this;
    }
  }
}
</script>

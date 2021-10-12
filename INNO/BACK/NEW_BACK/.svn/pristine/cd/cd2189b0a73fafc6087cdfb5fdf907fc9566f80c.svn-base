<style lang="less">
	.seckill-group-form{
		.seckill-activity-item{
			position:relative;
			overflow: hidden;
			.copy-textarea{
				position:absolute;
				top:0px;
				right:0px;
				transform: translate(100%,-100%);
			}
		}
		
	}
</style>
<template>
  <div class="seckill-group-form">
    <Modal
      class="seckill-group-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="80">
          <FormItem label="分组名称" prop="name">
            <Input v-model="formItem.name" placeholder="分组名称"></Input>
          </FormItem>
          <FormItem label="是否开启">
            <i-switch v-model="formItem.enable" size="large" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="秒杀活动">
            <div  v-for="(item,index) in formItem.seckillData" :key="index" class="seckill-activity-item flex f-just-between p-right-15">
                <div>
                    <Tag type="dot" closable color="primary" :name="index" @on-close="handleCloseTag">{{item.name}}</Tag>

                    <Poptip v-model="item.showBool" placement="left" width="300" transfer popper-class="poptip">
                        <div slot="title" class="edit_title">编辑</div>
                        <div style="width: 65px; margin-left: 20px; cursor: pointer;">
                            {{ item.sort }}
                            <Icon type="ios-create-outline" size="16" style="margin-left: 5px;cursor:pointer"></Icon>
                        </div>

                        <div slot="content">
                            <Form :label-width="60">
                                <FormItem label="排序值">
                                    <edit-sort v-model="item.sort" @checkVaild="handleSort"></edit-sort>
                                </FormItem>
                                <div style="text-align: center;">
                                    <Button size="small" @click="onCancel(index)">取消</Button>
                                    <Button type="primary" size="small" @click="onSave(index)">确定</Button>
                                </div>
                            </Form>
                            <!--加载提示-->
                            <Spin size="large" fix v-show="spinShow"></Spin>
                        </div>
                    </Poptip>
                </div>
                <a @click="copyPath(item.id)">复制路径</a>
                <textarea class="copy-textarea" :ref="'copyItem' + item.id" :value="path + '?groupId=' + formItem.id + '&activityId=' + item.id"></textarea>
            </div>
            <!-- <seckill-select :data="formItem.seckillData" type="checkBox" @del-tag="e => handleCloseTag()"> -->
              <Button type="dashed" @click="handleSelect" class="basic_select">选择秒杀活动</Button>
            <!-- </seckill-select> -->
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import SeckillSelect from '@/views/my-components/list-component/index-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
export default {
  mixins: [Dialog],
  components: {
    SeckillSelect,
    EditSort
  },
  data () {
    return {
        showPoptip: false,
        spinShow: false,
        sortVaild: false,
		path: "pages/micro_mall/sk/activity-sk/activity-sk",
      formItem: {
        id: '',
        name: '',
        enable: '0',
        seckillData: [],
      },
      // 表单数据规则
      ruleValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSelect () {
      this.$selectModule({
        mode: 'seckill',
        reqConfig: 'cloudSeckillActivityList',
        groupApi: 'cloudSeckillGroupList',
        type: 'checkbox',
        data: this.formItem.seckillData,
        getList: (data) => {
          console.log("seckillData",data)
          this.formItem.seckillData = data;
        }
      })
    },
    handleCloseTag (event,index) {
      this.formItem.seckillData.splice(index, 1);
    },
    copyPath(id){
        let elem = this.$refs["copyItem" + id];
        if(elem){
            elem[0].select();
            document.execCommand("copy");
            this.$Message.info("复制成功");
        }
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.cloudSeckillGroupAdd : this.$api.cloudSeckillGroupEdit), {
                id: this.formItem.id,
                name: this.formItem.name,
                enable: this.formItem.enable,
                activity_ids: this.formItem.seckillData.map(item => item.id).join(), //暂无数据
                activity_sorts: this.formItem.seckillData.map(item => item.sort).join(),
	          })
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

        let activity_info = row&&row.activity_info||[];
        activity_info.forEach(item=>{
            item.showBool = false;
        })
    // 重置表单
      this.$refs.formValidate.resetFields();

    // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加秒杀分组';
          this.formItem.seckillData = [];
      } else {
        this.modalTitle = '编辑秒杀分组';
        this.formItem.enable =String(row.enable);
        this.formItem.name = row.name;
        this.formItem.seckillData = JSON.parse(JSON.stringify(row.activity_info));
      }
      return this;
    },
      onCancel(e){
          let index = e||0;
          this.formItem.seckillData[index] && (this.formItem.seckillData[index].showBool = false);
      },
      onSave (e) {
          let index = e||0;
          this.formItem.seckillData[index] && (this.formItem.seckillData[index].showBool = false);
      },
      handleSort (bool) {
          this.sortVaild = bool;
      },
  }
}
</script>

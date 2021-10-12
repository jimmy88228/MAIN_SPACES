<template>
	<div class="goods-list-sort">
		<Poptip v-model="showPoptip" placement="left" width="300" transfer popper-class="poptip">
			<span>{{value}}</span>
			<Icon type="ios-create-outline" size="16" style="margin-left: 5px;cursor:pointer"></Icon>
      <div slot="title" class="edit_title">编辑</div>
			<div slot="content" class="content-box_edit">
				<Form ref="formValidate" :model="formItem" :label-width="60">
					<FormItem label="排序值">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
					</FormItem>
					<div style="text-align: center;">
            <Button size="small" @click="onCancel">取消</Button>
						<Button type="primary" size="small" @click="onSave">确定</Button>
					</div>
				</Form>
				<!--加载提示-->
				<Spin size="large" fix v-show="spinShow"></Spin>
			</div>
		</Poptip>
	</div>
</template>

<script>
import EditSort from '@/views/my-components/edit-sort/edit-sort';

export default {
  name: 'PresaleSort',
  components: {
    EditSort
  },
	props: {
		id:{
			type: [String, Number],
			default: 0,
		},
		value:{
			type: [String, Number],
			default: 0,
		}
	},
	data() {
		return {
			showPoptip: false,
			formItem:{
				sort: 0
			},
			spinShow: false,
			sortVaild: false
		}
  },
  watch: {
    value: {
      handler (newValue) {
        this.formItem.sort = String(newValue);
      },
      immediate: true
    }
  },
	methods: {
		// 保存排序
		onSave () {
			if (this.sortVaild) {
        this.spinShow = true;
        this.$ajax.post(this.$api.cloudPresaleActivityEditSort, {
          id: this.id,
          sort: Number( this.formItem.sort )
        })
        .then( (response) => {
          this.spinShow = false;
          var res = response.data;

          if( res.code ){
            this.showPoptip = false;
            this.$emit('edit-success');
          }
        });
      }
		},
		onCancel(){
			this.showPoptip = false;
    },
    handleSort (bool) {
      this.sortVaild = bool;
    }
	},
}
</script>

<style lang="less" scoped>
.poptip{
  .edit_title{
    padding-left: 4px;
  }
}
</style>

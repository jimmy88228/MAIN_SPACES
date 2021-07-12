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

const mapData = {
  colorcat_sort: 'colorcat_id',
  color_sort: 'color_id',
  sizecat_sort: 'sizecat_id',
  size_sort: 'size_id'
};

export default {
  name: 'specSort',
  components: {
    EditSort
  },
	props: {
    type: {
      type: String,
      required: true
    },
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
  computed: {
    isColorType () {
      return this.type === 'colorcat_sort' || this.type === 'color_sort';
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
        this.$ajax.post(this.isColorType ? this.$api.colorOtherEdit : this.$api.sizeOtherEdit, {
          type: this.type,
          value: Number( this.formItem.sort ),
          [mapData[this.type]]: this.id
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

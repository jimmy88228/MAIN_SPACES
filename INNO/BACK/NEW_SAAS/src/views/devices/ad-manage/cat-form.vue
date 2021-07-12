<template>
  <div>
    <Modal
      class="group-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="confirm">
      <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="90">
        <FormItem label="方法名" prop="menuName">
          <Input v-model="formItem.menuName" placeholder="请输入方法名"></Input>
        </FormItem>
        <FormItem label="选择类别">
						<Select v-model="formItem.menuFunc" class="basic_select">
							<Option  :value="'CA'" :key="1">商品分类</Option>
              <Option  :value="'VC'" :key="2">自定义分类</Option>
						</Select>
					</FormItem>
        <FormItem label="选择分类" v-if="formItem.menuFunc == 'CA'">
						<Cascader class="basic_cascader" :data="sortCatList" v-model="currentSort" placeholder="请选择所有分类" filterable
						 change-on-select transfer :clearable="isClear" ref="catRef" :render-format="renderSort" @on-change="selectSortCat"></Cascader>
					</FormItem>
					<FormItem label="选择分类" v-if="formItem.menuFunc == 'VC'">
						<Cascader class="basic_cascader" :data="sortVcatList" v-model="currentVcatSort" placeholder="请选择自定义分类" filterable
						 change-on-select transfer :clearable="isClear" ref="vcatRef" :render-format="renderSort" @on-change="selectSortVcat"></Cascader>
					</FormItem>
        <FormItem label="是否开启" prop="isShow">
          <i-switch v-model="formItem.isShow" size="large" :true-value="1" :false-value="0">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="排序">
          <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
        </FormItem>
        <!-- <FormItem label="图片" prop="pic_path">
          <image-edit :img="formItem.pic_path" @selectImg="openImagesModal('pic_path', formItem.pic_path )" @delImg="handleDelImg">
            <p>建议尺寸：500x500像素，支持jpg、png两种格式，大小不超过500K。</p>
          </image-edit>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>

<script>
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import ImageEdit from '@/views/my-components/image-edit/image-edit';

const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};

export default {
  components: {
    EditSort,
    ImageEdit
  },
  props: {
		},
  data () {
    return {
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      formItem: {
        id: 0,
        menuName: '',
        isShow: 0,
        sort: 0,
        cat_id: 0,
				vcat_id: 0,
        menuFunc: 'CA',

        // id: 0,
        // tagName: '',
        // isShow: 0,
        // tagOrder: 0,
        // pic_path: ''
      },
      sortCatList: [],
			sortVcatList: [],
      currentSort: [],
			currentVcatSort: [],
      isClear: false,
      // 表单数据规则
      ruleValidate: {
        // tagName: [{ required: true, message: '标签名称不能为空', trigger: 'blur'}]
      },
      sortVaild: false
    }
  },
  mounted(){
    this.loadExtraData();
  },
  methods: {
    handleDelImg () {
      this.formItem.pic_path = '';
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid && this.sortVaild) {
          // ajax 保存数据
          this.$ajax.post((this.$api.saveCategoryMenu), {
            id: this.formItem.id,
            menu_name: this.formItem.menuName,
            is_show: this.formItem.isShow,
            sort: this.formItem.sort,
            menu_func: this.formItem.menuFunc,
            cat_id: this.formItem.cat_id,
            vcat_id: this.formItem.vcat_id
	        })
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;
                // 把数据返回给父级
                this.$emit('on-success', {
                  type: this.formItem.id === 0 ? 'add' : 'edit',
                  data: res.data
                });
              } else {
		    				this.modalShow = true;
                this.modalLoading = false;

                setTimeout(() => {
                  this.modalLoading = true;
                }, 50);
		    			}
		    		});
        } else {
          this.modalShow = true;
          this.modalLoading = false;

          setTimeout(() => {
            this.modalLoading = true;
          }, 50);
        }
      });
    },
    // 打开模态框
    openModal (row) {
      // 屏蔽 确定按钮
      this.modalShow = true;
      // 重置表单
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      this.formItem.menuName = '';
      this.formItem.isShow = 0;
      this.formItem.sort = 0;
      this.formItem.menuFunc = 'CA';
      this.formItem.cat_id = 0;
      this.formItem.vcat_id = 0;
      this.currentSort = [];
      this.currentVcatSort = [];
      if (this.formItem.id === 0) {
        this.modalTitle = '添加分类菜单';
      } else {
        this.modalTitle = '编辑分类菜单';
        this.formItem.menuName = row.menu_name;
        this.formItem.isShow = Number(row.is_show);
        this.formItem.sort = Number(row.sort);
        this.formItem.menuFunc = row.menu_func;
        if (row.menu_func == 'CA') {
          this.formItem.cat_id = row.cat_id;
          this.currentSort = row.cat_id_list.map(Number) || [];
        } else {
          this.formItem.vcat_id = row.cat_id;
          this.currentVcatSort = row.cat_id_list.map(Number) || [];
        }
      }
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    selectSortCat(value, selectedData) {
				this.formItem.cat_id = selectedData[selectedData.length - 1].value;
			},
    selectSortVcat(value, selectedData) {
      this.formItem.vcat_id = selectedData[selectedData.length - 1].value;
    },
    renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
    },
    handleSortList(context) {
      const format = context.map(item => {
        return {
          value: item.cat_id || item.vcat_id,
          label: item.cat_name || item.vcat_name,
          parent_id: item.parent_id,
          children: item.children.length ? this.handleSortList(item.children) : []
        }
      });
      return format;
    },
    loadExtraData() {
				this.$ajax.all(
					[
						this.$ajax.post(this.$api.catTree),
						this.$ajax.post(this.$api.vcatTree)
					]
				).then(
					this.$ajax.spread((catData, vcatData) => {
						let catRes = catData.data;
						if (catRes.code) {
              this.sortCatList = this.handleSortList(catRes.data);
					    this.sortCatList.unshift(defaultItem);
						}
						let vcatRes = vcatData.data;
						if (vcatRes.code) {
              this.sortVcatList = this.handleSortList(vcatRes.data);
					    this.sortVcatList.unshift(defaultItem);
						}
					})
				);
			}
  },
  watch: {
	}
}
</script>

<template>
  <div>
    <Modal
      class="jump-set-form"
      v-model="modalShow"
      :title="modalTitle"
      :mask-closable="maskClose"
      width="600">
        <Form ref="formValidate" :model="formItem" :label-width="80">
          <FormItem label="类型">
            <Select v-model="formItem.type" class="basic_select">
              <Option value="CAT">标准分类</Option>
              <Option value="VCAT">自定义分类</Option>
              <Option value="GOODS">单品</Option>
              <Option value="PAGE">自定义页面</Option>
              <Option value="URL">小程序路径</Option>
            </Select>
          </FormItem>
          <FormItem label="链接">
            <template v-if="formItem.type === 'CAT'">
              <Cascader
                class="basic_cascader"
                :data="sortList"
                v-model="currentSort"
                filterable
                change-on-select
                transfer
                :render-format="renderSort"
                ref="sortRef"
                :clearable="isClearable"
                @on-change="selectSort"></Cascader>
            </template>
            <template v-if="formItem.type === 'VCAT'">
              <Cascader
                class="basic_cascader"
                :data="sortCusList"
                v-model="currentCusSort"
                filterable
                change-on-select
                transfer
                :render-format="renderSort"
                ref="sortRef"
                :clearable="isClearable"
                @on-change="selectCusSort"></Cascader>
            </template>
            <template v-if="formItem.type === 'GOODS'">
              <goods-select :data="goodsData" type="radio" @del-tag="handleTag">
                <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
              </goods-select>
            </template>
            <template v-if="formItem.type === 'PAGE'">
              <goods-select :data="pagesData" type="radio" @del-tag="handlePageTag">
                <Button type="dashed" @click="handlePageSelect" class="basic_select">选择自定义页</Button>
              </goods-select>
            </template>
            <template v-if="formItem.type === 'URL'">
              <Input v-model="formItem.url" placeholder="请输入小程序路径" class="basic_input"/>
            </template>
          </FormItem>
          <FormItem label="活动时间">
            <RadioGroup v-model="formItem.timeType" vertical>
              <Radio label="0">
                <span>不限</span>
              </Radio>
              <Radio label="1">
                <span>活动时间</span>
                <DatePicker
                  style="width:340px;"
                  type="datetimerange"
                  placeholder="请选择起始时间"
                  v-model="formItem.time"
                  :disabled="formItem.timeType == 0"
                  confirm
                  transfer></DatePicker>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" @click="confirm">确定</Button>
        </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import GoodsSelect from '@/views/my-components/list-component/index-edit';
import PagesSelect from '@/views/my-components/list-component/index-edit';

const defaultItem = {
  value: '0',
  label: '顶级分类',
  children: []
};
export default {
  mixins: [Dialog],
  components: {
    GoodsSelect,
    PagesSelect
  },
  data () {
    return {
      modalTitle: '跳转设置',
      formItem: {
        timeType: '0',
        time: [],
        type: 'CAT',
        catId: 0,
        vcatId: 0,
        goodsId: 0,
        customPageId: 0,
        url: ''
      },
      goodsData: [],
      sortList: [],
      currentSort: [],
      isClearable: false,
      isSortValid: false,
      sortCusList: [],
      currentCusSort: [],
      isSortCusValid: false,
      pagesData: [],
      spinShow: false
    }
  },
  methods: {
    reset () {
      this.formItem = {
        id: 0,
        timeType: '0',
        time: [],
        type: 'CAT',
        catId: 0,
        vcatId: 0,
        goodsId: 0,
        customPageId: 0,
        url: ''
      };
    },
    confirm () {
      let content;
      switch (this.formItem.type) {
          case 'CAT':
            if (!this.formItem.catId) {
              this.$Message.error('请选择标准分类内容!');
              return false;
            }
            content = this.formItem.catId;
            break;
          case 'VCAT':
            if (!this.formItem.vcatId) {
              this.$Message.error('请选择虚拟分类内容!');
              return false;
            }
            content = this.formItem.vcatId;
            break;
          case 'GOODS':
            if (!this.formItem.goodsId) {
              this.$Message.error('请选择单品内容!');
              return false;
            }
            content = this.formItem.goodsId;
            break;
          case 'PAGE':
            if (!this.formItem.customPageId) {
              this.$Message.error('请选择自定义页内容!');
              return false;
            }
            content = this.formItem.customPageId;
            break;
          case 'URL':
            if (!this.formItem.url) {
              this.$Message.error('请填写小程序路径!');
              return false;
            }
            content = this.formItem.url;
            break;
          default:
            break;
        }
        if (this.formItem.timeType == 1 && (this.formItem.time.length === 0 || this.formItem.time.join() === ',')) {
          this.$Message.error('请选择活动时间!');
          return false;
        }
        this.$ajax.post(this.$api.couponsJumpSet, {
          type_id: this.formItem.id,
          time_type: this.formItem.timeType,
          start_time: this.formItem.time[0] || '',
          end_time: this.formItem.time[1] || '',
          tag: '', //用来标识这是一个接口，需要为空，可以使用缓存的功能，减少服务器负荷，解决高并发问题
          jump_type: this.formItem.type,
          related_content: content
        })
        .then(response => {
          const res = response.data;
          if (res.code) {
            this.$Message.success(res.message);
            this.modalShow = false;
          }
          this.spinShow = false;
        });
    },
    cancel () {
      this.modalShow = false;
    },
    renderSort (labels) {
      return labels.slice(labels.length - 1).join('/');
    },
    // 打开模态框
    setData (row, typeId) {
      this.reset();

      this.formItem.id = typeId;
      this.sortList = this.handleSortList(row.category);
      this.sortList.unshift(defaultItem);
      this.sortCusList = this.handleSortList(row.vcat);
      this.sortCusList.unshift(defaultItem);
      let data = row.info;
      if (Object.keys(data).length) {
        // 编辑
        this.formItem.timeType = data.time_type;
        if (this.formItem.timeType == 0) {
            this.formItem.time = [];
        } else {
            this.formItem.time = [data.start_time, data.end_time];
        }
        
        this.formItem.type = data.jump_type;
        switch (this.formItem.type) {
          case 'CAT':
            this.formItem.catId = data.related_content;
            this.currentSort = data.cascade;
            break;
          case 'VCAT':
            this.formItem.vcatId = data.related_content;
            this.currentCusSort = data.cascade;
            break;
          case 'GOODS':
            this.formItem.goodsId = data.related_content;
            this.goodsData = [data.related_content];
            break;
          case 'PAGE':
            this.formItem.customPageId = data.related_content;
            this.pagesData = [data.related_content];
            break;
          case 'URL':
            this.formItem.url = data.related_content;
            break;
          default:
            break;
        }
      } else {
        // 新增
        this.currentSort = [this.sortList[0].value];
        this.currentCusSort = [this.sortCusList[0].value];
      }
      return this;
    },
    handleSortList (context) {
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
    selectSort (value, selectedData) {
      this.isSortValid = true;
      this.formItem.catId = selectedData[selectedData.length - 1].value;
    },
    selectCusSort (value, selectedData) {
      this.isSortCusValid = true;
      this.formItem.vcatId = selectedData[selectedData.length - 1].value;
    },
    handleSelect () {
      this.$selectContent({
        mode: 'goods',
        type: 'radio',
        data: this.goodsData,
        getList: (data) => {
          this.goodsData = data;
          this.formItem.goodsId = data[0].id;
        }
      })
    },
    handleTag (data) {
      this.goodsData = data;
      this.formItem.goodsId = 0;
    },
    handlePageSelect () {
      this.$selectContent({
        mode: 'pages',
        type: 'radio',
        data: this.pagesData,
        getList: (data) => {
          this.pagesData = data;
          this.formItem.customPageId = data[0].id;
        }
      })
    },
    handlePageTag (data) {
      this.pagesData = data;
      this.formItem.customPageId = 0;
    },
  }
}
</script>

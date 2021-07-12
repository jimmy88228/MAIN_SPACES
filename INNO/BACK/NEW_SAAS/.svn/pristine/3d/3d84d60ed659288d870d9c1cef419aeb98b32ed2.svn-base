<template>
  <div class="goods_spec">
    <Row>
      <Col :lg="4" :xl="4" :xxl="2" class="spec_title">
        <span>商品规格</span>
      </Col>
      <Col :lg="20" :xl="20" :xxl="22">
        <div class="spec_table">
          <div class="spec_table_item">
            <div class="color_header">
              <span>规格名：</span>
              <span><Input type="text" v-model="colorUnitEdit" class="basic_input" @on-change="handleEditColor" placeholder="颜色"/></span>
              <!-- <span class="title">{{colorUnit}}</span> -->
              <!-- 屏蔽该功能 -->
              <!-- <Checkbox v-model="showPic">添加规格图片<span class="tips">(仅支持为第一组规格设置规格图片)</span></Checkbox> -->
            </div>
            <Row class="color_content">
              <Col :lg="4" :xl="4" :xxl="2" class="title">规格值：</Col>
              <Col :lg="20" :xl="20" :xxl="22">
                <div class="sort_list">
                  <SlickList v-model="colorList" :useDragHandle="true" @input="onPageSort($event)" axis="y" class="gallery">
                    <SlickItem v-for="(item, index) in colorList" :index="index" :key="index" class="goods_img_wrapper">
                      <spec-item
                        :key="item.id"
                        :cur-item="item"
                        :cur-index="index"
                        :origin-tree="colorTreeList"
                        :attr-type="colorType"
                        :show-pic="showPic"
                        @selectedChange="handleColorChange"
                        @deleteItem="handleColorDel"
                        @inputChange="handleInputChange"
                        @editGallery="handleGallery">
                          <template #drag>
                            <Icon v-handle class="handle-gallery" type="md-apps" size="18" title="拖动排序"/>
                          </template>
                        </spec-item>
                    </SlickItem>
                  </SlickList>
                    <Button type="text" @click="addColorItem" class="add" :disabled="saleType == 99 && colorList.length === 1">
                      <Icon type="md-add" />
                      <span>添加规格值</span>
                    </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div class="spec_table_item spec_size_item">
            <template v-if="allowShow && toggle">
              <div class="size_header">
                <span>规格名：</span>
                <span><Input type="text" v-model="sizeUnitEdit" class="basic_input" @on-change="handleEditSize" placeholder="尺码"/></span>
                <!-- <span class="title">{{sizeUnit}}</span> -->
                <Icon type="md-close-circle" class="close" size="24" v-if="!isMulti" @click="delSize"/>
              </div>
              <Row class="color_content">
                <Col :lg="4" :xl="4" :xxl="2" class="title">规格值：</Col>
                <Col :lg="20" :xl="20" :xxl="22">
                  <div class="sort_list size_sort_list">
                    <spec-item
                        v-for="(item, index) in sizeList"
                        :key="item.id"
                        :cur-item="item"
                        :cur-index="index"
                        :origin-tree="sizeTreeList"
                        :attr-type="sizeType"
                        @selectedChange="handleSizeChange"
                        @deleteItem="handleSizeDel"
                        @inputChange="handleInputChange"></spec-item>
                    <Button type="text" @click="addSizeItem" class="add" :disabled="saleType == 99 && sizeList.length === 1">
                      <Icon type="md-add" />
                      <span>添加规格值</span>
                    </Button>
                  </div>
                </Col>
              </Row>
            </template>
          </div>
          <Tooltip :content="toolText">
            <Button @click="createNew" :disabled="!allowShow || (allowShow && toggle)">添加规格项目</Button>
          </Tooltip>
        </div>
      </Col>
    </Row>
    <Divider/>
    <Row>
      <Col :lg="4" :xl="4" :xxl="2" class="spec_title">
        <span>规格明细</span>
      </Col>
      <Col :lg="20" :xl="20" :xxl="22">
        <spec-table
          ref="specTable"
          :spec-data="data"
          :change-data="changeData"
          :attr-type="attrType"
          :is-single="isSingle"
          :color-list="filterColorList"
          :size-list="filterSizeList"
          :sale-type="saleType"
          :api-sale-status="saleStatus"
          :color-unit="colorUnitEdit"
          :size-unit="sizeUnitEdit"
          @edit-table="handleTable"></spec-table>
      </Col>
    </Row>
    <Divider/>
  </div>
</template>

<script>
import SpecItem from './spec-item';
import SpecTable from './spec-table';
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort';

export default {
  props: {
    // 用戶已選的顏色屬性數據
    userColorList: {
      type: Array,
      required: true
    },
    userSizeList: {
      type: Array,
      required: true
    },
    // 颜色名称
    colorUnit: {
      type: String,
      required: true
    },
    colorMobileUnit: {
      type: String,
      required: true
    },
    // 尺码名称
    sizeUnit: {
      type: String,
      required: true
    },
    sizeMobileUnit: {
      type: String,
      required: true
    },
    productList: {
      type: Array,
      default () {
        return [];
      }
    },
    saleType: {
      // 4：促销商品; 99: 赠品 1: 正常商品
      type: [Number, String]
    },
    saleStatus: {
      type: [Number, String]
    }
  },
  directives: { handle: HandleDirective },
  components: {
    SpecItem,
    SpecTable,
    SlickList,
    SlickItem
  },
  data () {
    return {
      showPic: false,
      colorList: [],
      // 合法值的列表
      filterColorList: [],
      sizeList: [],
      filterSizeList: [],
      speedColor: 0,
      speedSize: 0,
      colorTreeList: [],
      colorType: 'color',
      sizeTreeList: [],
      sizeType: 'size',
      toggle: false,
      data: [],
      changeData: {},
      attrType: 'color',
      colorUnitEdit: '颜色',
      sizeUnitEdit: '尺码'
    }
  },
  computed: {
    allowShow () {
      let isShow = false;
      if (this.userSizeList.length > 0) {
        // 代表双规格
        isShow = true;
        this.toggle = true;
      } else if (this.userColorList.length > 0) {
        // 代表单规格
        isShow = false;
      } else {
        // 代表刚创建的
        isShow = true;
      }
      return isShow;
    },
    toolText () {
      let text = '';
      if (!this.allowShow) {
        if (this.userSizeList.length > 0) {
          text = '最多只能选两组';
        } else {
          text = '当前是单规格，最多只能选一组';
        }
      } else {
        if (this.toggle) {
          text = '最多只能选两组';
        } else {
          text = '请添加规格数组';
        }
      }
      return text;
    },
    // 是否为单规格
    isSingle () {
      let bool = true;
      if (this.productList.length === 0) {
        // 新增
        if (this.toggle) {
          // 双规格
          bool = false;
        } else {
          // 单规格
          bool = true;
        }
      } else {
        bool = (this.userColorList.length > 0 && this.userSizeList.length === 0);
      }
      return bool;
    },
    isMulti () {
      return this.userSizeList.length > 0;
    }
  },
  methods: {
    onPageSort (arr) {
      this.colorList = arr;
    },
    updateSaleStatus (status) {
      this.$refs.specTable.getSaleStatus(status);
    },
    loadData (page) {
      this.$ajax.all(
        [
          this.$ajax.post(this.$api.colorTree),
          this.$ajax.post(this.$api.sizeTree)
        ]
      ).then(
        this.$ajax.spread((colorData, sizeData) => {
          let colorRes = colorData.data;
          if (colorRes.code) {
            this.colorTreeList = colorRes.data;
          }
          let sizeRes = sizeData.data;
          if (sizeRes.code) {
            this.sizeTreeList = sizeRes.data;
          }
        })
      );
    },
    createNew () {
      if (!this.allowShow) return false;
      this.toggle = true;
    },
    delSize () {
      this.sizeList = [];
      this.toggle = false;
      this.calcTree(this.sizeList, this.sizeTreeList);
    },
    addColorItem () {
      this.speedColor++;
      this.colorList.push({
        cat_id: '',
        // 添加数据时默认id
        id: 'sign' + this.speedColor,
        spec_name: '',
        spec_code: '',
        goods_gallery: [],
        spec_sort: ''
      });
    },
    addSizeItem () {
      this.speedSize++;
      this.sizeList.push({
        cat_id: '',
        // 添加数据时默认id
        id: 'sign' + this.speedSize,
        spec_name: '',
        spec_code: ''
      });
    },
    handleColorChange (item, index) {
      this.colorList.splice(index, 1, item);
      this.calcTree(this.colorList, this.colorTreeList);
    },
    handleColorDel (index) {
      this.colorList.splice(index, 1);
      this.calcTree(this.colorList, this.colorTreeList);
    },
    handleSizeChange (item, index) {
      this.sizeList.splice(index, 1, item);
      this.calcTree(this.sizeList, this.sizeTreeList);
    },
    handleSizeDel (index) {
      this.sizeList.splice(index, 1);
      this.calcTree(this.sizeList, this.sizeTreeList);
    },
    // 不可选的属性值
    calcTree (list, treeList) {
      this.$nextTick(() => {
        let temp = {};
        treeList.forEach((item, index) => {
          temp[`${item.groupId}-${index}`] = item.children;
        });
        treeList.forEach(groupItem => {
          groupItem.children.forEach(item => {
            item.disabled = false;
          });
        });
        list.forEach(userItem => {
          let groupId = userItem.cat_id;
          let id = userItem.id;
          const regex = /^(\w+)-(\d+)$/;
          for (let key in temp) {
            if (regex.test(key)) {
              const curGroupId = RegExp.$1;
              const curGroupIndex = RegExp.$2;
              if (groupId === curGroupId) {
                const children = temp[key];
                children.forEach((item, childIndex) => {
                  if (item.id == id) {
                    treeList[curGroupIndex].children[childIndex].disabled = true;
                  }
                })
              }
            }
          }
        });
      })
    },
    // 修改颜色，尺码规格值内容
    handleInputChange (obj, attrType) {
      if (attrType === 'color') {
        this.colorList.forEach(item => {
          if (item.id == obj.id) {
            item['spec_name'] = obj.spec_name;
          }
        });
      } else {
        this.sizeList.forEach(item => {
          if (item.id == obj.id) {
            item['spec_name'] = obj.spec_name;
          }
        });
      }
      // 修改名称
      this.changeData = obj;
      this.attrType = attrType;
    },
    handleGallery (index, result) {
      this.colorList[index].goods_gallery = result.slice(0, 10);
    },
    handleTable (tableData) {
      this.$emit('get-table-list', tableData);
    },
    handleEditColor () {
      this.$emit('get-color-unit', this.colorUnitEdit || '颜色');
    },
    handleEditSize () {
      this.$emit('get-size-unit', this.sizeUnitEdit || '尺码');
    }
  },
  watch: {
    userColorList: {
      handler (newVal) {
        if (newVal) {
          // 接口返回很多不需要的数据，进行筛选
          this.colorList = newVal.map(item => {
            return {
              cat_id: item.cat_id,
              id: item.id,
              spec_name: item.spec_name,
              spec_code: item.spec_code,
              goods_gallery: item.goods_gallery,
              spec_sort: item.spec_sort
            }
          });
          this.calcTree(this.colorList, this.colorTreeList);
        }
      },
      immediate: true
    },
    userSizeList: {
      handler (newVal) {
        if (newVal) {
          this.attrType = newVal.length > 0 ? 'size' : 'color';
          // 接口返回很多不需要的数据，进行筛选
          this.sizeList = newVal.map(item => {
            return {
              cat_id: item.cat_id,
              id: item.id,
              spec_name: item.spec_name,
              spec_code: item.spec_code
            }
          });
          this.calcTree(this.sizeList, this.sizeTreeList);
        }
      },
      immediate: true
    },
    colorList: {
      handler (newVal) {
        this.filterColorList = newVal;
        this.$emit('get-color-list', this.filterColorList);
      },
      deep: true
    },
    sizeList: {
      handler (newVal) {
        this.filterSizeList = newVal;
        this.$emit('get-size-list', this.filterSizeList);
      },
      deep: true
    },
    productList: {
      handler (newVal) {
        if (newVal) {
          let data = [...newVal].map(item => {
            return {
              product_id: item.product_id,
              goods_id: item.goods_id,
              product_sn: item.product_sn,
              product_number: item.product_number,
              size_id: item.size_id,
              color_id: item.color_id,
              size_name: item.size_name,
              color_name: item.color_name,
              hold_number: item.hold_number,
              alias_goods_sn: item.alias_goods_sn,
              market_price: item.market_price,
              sale_price: item.sale_price,
              goods_weight: item.goods_weight,
              is_onsale: item.is_onsale,
              goods_cost: item.goods_cost,

              rowSpan: 0,
              colSpan: 0
            }
          });
          data.forEach((item, index) => {
            if (Number.isInteger((index + 1) / this.sizeList.length)) {
              item['rowSpan'] = this.sizeList.length;
              item['colSpan'] = 1;
            } else {
              item['rowSpan'] = 0;
              item['colSpan'] = 0;
            }
          });
          this.data = data;
        }
      },
      immediate: true
    },
    colorMobileUnit: {
      handler (newVal) {
        this.colorUnitEdit = newVal;
        this.$emit('get-color-unit', this.colorUnitEdit);
      },
      immediate: true
    },
    sizeMobileUnit: {
      handler (newVal) {
        this.sizeUnitEdit = newVal;
        this.$emit('get-size-unit', this.sizeUnitEdit);
      },
      immediate: true
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
@import './goods-spec.less';
</style>

<style lang="less">
.stock-search{
    .ivu-select-dropdown{
		max-height: 300px;
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
<template>
    <div class="stock-search">
        <Form ref="formSearch" :model="formSearch" inline :label-width="80">
            <FormItem label="选择来源" prop="stock_type">
				<Select v-model="formSearch.stock_type" @on-change="handleReset">
                    <Option value="0">请选择</Option>
					<Option v-for="(value, name) in stockType" :value="name" :key="name">{{value}}</Option>
				</Select>
			</FormItem>
            <template v-if="formSearch.stock_type == 1">
                <FormItem label="所属店铺" prop="store_id">
                    <Select v-model="formSearch.store_id">
                        <Option value="0">请选择</Option>
                        <Option v-for="item in storeList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </template>
            <template v-if="formSearch.stock_type == 2">
                <FormItem label="仓库列表" prop="stock_id">
                    <Select v-model="formSearch.stock_id">
                        <Option value="0">请选择</Option>
                        <Option v-for="item in wareHouse" :value="item.Code" :key="item.Code">{{item.Name}}</Option>
                    </Select>
                </FormItem>
            </template>
            <FormItem :label-width="20">
                <Input
                    v-model="formSearch.goods_sn"
                    style="width:280px;"
                    placeholder="款号查询"
                    clearable
                    search
                    enter-button
                    @on-search="searchPage"
                    @on-clear="searchPage"
                    @keydown.native.enter.prevent ="searchPage"></Input>
            </FormItem>
        </Form>
    </div>
</template>
<script>
export default {
  props: {
    stockType: {
      type: Object,
      default () {
        return {};
      }
    },
    storeList: {
      type: Array,
      default () {
        return [];
      }
    },
    wareHouse: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      formSearch: {
        stock_type: '1',
        store_id: '0',
        stock_id: '0',
        goods_sn: ''
      }
    }
  },
  methods: {
    clearOptions () {
      this.formSearch = {
        stock_type: '1',
        store_id: '0',
        stock_id: '0',
        goods_sn: ''
      };
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleReset () {
      this.formSearch.store_id = '0';
      this.formSearch.stock_id = '0';
    }
  }
}
</script>

<style lang="less" scoped>
.goods-editor-attr{
	.basic_select{
		width: 260px;
	}
	.attr-list{
		width: 480px;
		border: 1px solid #ddd;
		padding: 5px;
		padding: 5px;
		margin-top: 20px;
		.attr-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 3px 10px 3px 5px;
		}
		.attr-item:nth-child(odd) {
			background: #f8f8f8;
		}
	}
}
</style>
<template>
	<div class="goods-editor-attr">
		<Select v-model="groupId" class="basic_select" @on-change="handleType">
			<Option value="0">请选择商品类型</Option>
			<Option v-for="item in groupList" :value="item.cat_id" :key="item.cat_id">{{item.cat_name}}</Option>
		</Select>
		<div class="attr-list" v-if="selectedGroup[groupId] && selectedGroup[groupId].length > 0 && groupId != 0">
			<div v-for="item in selectedGroup[groupId]" :value="item.attr_id" :key="item.attr_id" class="attr-item">
				<div>
					<span>{{item.attr_name}}</span>
					<span>(前端可筛选)</span>
				</div>
				<div>
					<Select v-model="item.defVal" class="basic_select" :multiple="item.attr_input_type == 1" @on-change="handleSelect">
						<Option v-for="(attrVal, attrIndex) in item.get_attr_value" :value="attrIndex" :key="attrIndex">{{attrVal}}</Option>
					</Select>
					<span v-if="item.attr_input_type == 1">(多选)</span>
					<span v-else>(单选)</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'goodsEditorAttr',
  props: ['type'],
  data () {
    return {
      groupId: '0',
      groupList: [],
      selectedGroup: {}
    }
  },
  methods: {
    initData (attr_group_id, groupList) {
      // 所属的管理组
      this.groupId = attr_group_id;
      this.groupList = groupList;
      groupList.forEach(item => {
        this.selectedGroup[item.cat_id] = item.get_attribute_list.map(listItem => {
          let keyCol = [];
          let key = '';
          if (listItem.defVal instanceof Array) {
            listItem.defVal && listItem.defVal.forEach(valItem => {
              listItem.get_attr_value.forEach((attrItem, key) => {
                if (valItem == attrItem) keyCol.push(key);
              });
            });
          } else {
            key = (listItem.get_attr_value.length > 0 && listItem.defVal) ? listItem.get_attr_value.indexOf(listItem.defVal) : -1;
          }
          return {
            ...listItem,
            defVal: keyCol.length > 0 ? keyCol : key
          }
        }) || [];
      });
    },
    handleSelect () {
      // 选了值才上传
      const filterData = this.selectedGroup[this.groupId].filter(item => item.defVal.length > 0 || item.defVal !== -1);
      this.$emit('change-attr', filterData, this.groupId, this.type);
    },
    handleType () {
      this.$emit('change-attr', [], this.groupId, this.type);
    }
  }
}
</script>

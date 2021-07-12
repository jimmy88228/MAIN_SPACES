<template>
	<Card class="advert-list">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="sort" label="分类定义">
        <Sort ref="sort"/>
      </TabPane>
      <TabPane name="tag" label="标签定义">
        <Tag ref="tag"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper';
import Sort from './sort/sort-list';
import Tag from './tag/tag-list';

export default {
  mixins: [TabsHelper],
  components: {
    Sort,
    Tag
  },
  data () {
    return {
      tabName: 'sort'
    }
  }
}
</script>

<style>

</style>

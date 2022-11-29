<template>
  <div class="group-view-area">
    <div class="group-view-list" v-bar>
      <div>
        <div class="group-view-item" :class="chooseGroupId == item.id ? 'selected' : ''" v-for="item in groupList" :key="item.id">
          {{item.name}}
        </div>
      </div>
    </div>
    <Button class="add-group">新建分组</Button>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      chooseGroupId: 1,
      groupList: [
        {
          id: 1,
          name: "EAP学习素材",
        },
        {
          id: 2,
          name: "企业员工心理培训资料",
        },
        {
          id: 3,
          name: "家庭心理教育视频",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.group-view-area {
  .group-view-list {
    .group-view-item {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0px 10px;
      margin-bottom: 10px;
      background-color: #fff;
      cursor: pointer;
    }
    .group-view-item.selected {
      background-color: #f2faff;
      color: #008acb;
    }
  }
  .add-group {
    width: 100%;
    display: block;
    height: 38px;
  }
}
</style>
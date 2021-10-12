<template>
  <div class="distribution_rank_form">
    <PageTopBase isSave @save="handleConfirm">
      <div class="all_wrapper">
        <div class="all_rule_condition" v-show="allRules.length > 1">
          <div class="box_inner"></div>
          <div class="toggle">
            <i-switch v-model="allCondition" size="large" true-value="1" false-value="0">
              <span slot="open">且</span>
              <span slot="close">或</span>
            </i-switch>
          </div>
        </div>
        <div>
          <div v-for="(item, index) in allRules" :key="item.id" class="rule">
            <div class="all_wrapper">
              <div class="all_rule_condition" v-show="item.rules.length > 1">
                <div class="box_inner"></div>
                <div class="toggle">
                  <i-switch v-model="item.condition" size="large" true-value="1" false-value="0">
                    <span slot="open">且</span>
                    <span slot="close">或</span>
                  </i-switch>
                </div>
              </div>
              <div>
                <div v-for="(c, i) in item.rules" :key="i" class="rule rule_inline">
                  <Select v-model="c.type" style="width: 200px; margin-right: 10px;">
                    <Option v-for="item in optionList" :key="item.label" :value="item.label">
                      {{item.name}}
                    </Option>
                  </Select>
                  <InputNumber
                    v-model="c.num"
                    placeholder="请输入数量"
                    style="width: 100px;margin-right: 10px;"
                  />
                  <Button v-show="item.rules.length > 1" @click="handleRuleDel(index, i)">删除</Button>
                </div>
              </div>
            </div>
            <Button type="primary" @click="handleIRules(index)" style="margin-top: 10px;">添加规则</Button>
            <Button type="primary" @click="handleIRulesDel(index)" style="margin-top: 10px;">删除规则</Button>
          </div>
        </div>
      </div>
      <Button type="primary" @click="handleWRules" style="margin-top: 10px;">增加升级规则</Button>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import PageTopBase from "@/views/my-components/page-top-base/index";

export default {
  props: ['id'],
  components: {
    PageTopBase
  },
  data() {
    return {
      allRules: [],
      optionList: [],
      allCondition: "0",
      spinShow: false
    };
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.distributionRankSettingInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          let optionList = res.data && res.data.selectList;
          this.optionList = optionList;
          this.allRules = data.map(item => {
            return {
              condition: item.inner_condition === 'or' ? '0' : '1',
              id: item.id,
              rules: item.select_list.map(i => ({
                num: i.value,
                type: i.label
              }))
            }
          })
        }
        this.spinShow = false;
      });
    },
    handleWRules() {
      this.allRules.push({
        id: Math.random(),
        condition: "0",
        rules: [
          {
            type: 0,
            num: 1
          }
        ]
      });
    },
    handleIRules(index) {
      this.allRules[index].rules.push({
        type: 0,
        num: 1
      });
    },
    handleIRulesDel(index) {
      this.allRules.splice(index, 1);
    },
    handleRuleDel(index, i) {
      this.allRules[index].rules.splice(i, 1);
    },
    handleConfirm () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.distributionRankSettingUpgrade, {
        id: this.id,
        group_condition: this.allCondition === '0' ? 'or' : 'and',
        data: this.allRules.map(item => {
            return {
              inner_condition: item.condition === '0' ? 'or' : 'and',
              id: item.id,
              select_list: item.rules.map(i => ({
                value: i.num,
                label: i.type
              }))
            }
          })
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success('保存成功!');
          this.$router.go(-1);
          this.spinShow = false;
        }
      })
    }
  },
  mounted () {
    this.loadData();
  }
};
</script>

<style lang="less">
.distribution_rank_form {
  .all_wrapper {
    display: flex;
    .all_rule_condition {
      position: relative;
      margin: 20px 0 20px 20px;
      .box_inner {
        width: 60px;
        height: 100%;
        border-radius: 5px 0 0 5px;
        border: 1px solid rgb(192, 177, 177);
        border-right: none;
      }
      .toggle {
        position: absolute;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        padding: 4px;
        border: 1px solid #d2d2d2;
        border-radius: 4px;
        background: #fff;
      }
    }
    .rule {
      border: 1px dashed #000;
      border-radius: 4px;
      padding: 40px;
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
      &.rule_inline {
        display: flex;
        align-items: center;
        padding: 20px;
      }
    }
  }
}
</style>


<template>
  <div>
    <Modal
      class="task-form"
      v-model="modalShow"
      :title="modalTitle"
      width="800"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Table :columns="columns" :data="taskData.data" ref="myTable">
          <template slot-scope="{ row, index }" slot="date">
            <DateCalc :data="taskData" :begin="row.begin_time" :end="row.end_time" :index="index"/>
          </template>
          <template slot-scope="{ row, index }" slot="target_fake_sales">
            <InputNumber v-model="row.target_fake_sales" :min="1" @on-change="val => handleNumber(val, index)"></InputNumber>
          </template>
           <template slot-scope="{ row, index }" slot="handle">
              <template>
                <span><a @click="handleDel(index)">删除</a></span>
              </template>
            </template>
        </Table>
        <Button type="primary" @click="handleAdd">新增托管任务</Button>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import DateCalc from './date-calc';

export default {
  mixins: [Dialog],
  components: {
    DateCalc
  },
  data () {
    return {
      modalTitle: '编辑托管任务',
      columns: [
        {
          title: '日期',
          slot: 'date',
          width: 360
        },
        {
          title: '预期预占数量',
          key: 'target_fake_sales',
          slot: 'target_fake_sales'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      taskData: {
        data: []
      }
    }
  },
  methods: {
    confirm () {
      this.$emit('get-task-data', this.taskData.data);
      this.modalShow = false;
    },
    // 打开模态框
    setData (data) {
      this.taskData.data = JSON.parse(JSON.stringify(data));
      return this;
    },
    handleNumber (val, index) {
      this.taskData.data[index].target_fake_sales = val;
    },
    handleDel (index) {
      this.taskData.data.splice(index, 1);
    },
    handleAdd () {
      this.taskData.data.push({
        begin_time: '',
        end_time: '',
        target_fake_sales: 1
      });
    }
  }
}
</script>

<template>
  <DatePicker v-model="date" type="datetimerange" style="width:340px;" placeholder="请选择时间" class="time_range" transfer @on-change="handleDate"></DatePicker>
</template>

<script>
export default {
  props: ['data', 'begin', 'end', 'index'],
  computed: {
    date: {
      get () {
        return [this.begin, this.end];
      },
      set (val) {}
    }
  },
  methods: {
    handleDate ([begin, end]) {
      this.data.data[this.index]['begin_time'] = begin;
      this.data.data[this.index]['end_time'] = end;
    }
  }
}
</script>

<style>

</style>

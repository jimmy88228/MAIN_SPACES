<template>
    <div>
      <InputNumber
      :max="100"
      v-model="value10"
      :step="10"
      :formatter="value => `${value}%`"
      :parser="value => value.replace('%', '')"></InputNumber>
      <input ref="input" :value="temp" @blur="handleChange"/>
    </div>

</template>
<script>
    export default {
        data () {
            return {
                value10: 0.1,
                temp: 12
            }
        },
        mounted () {

        },
        methods: {
          handleChange(e) {
            if (isNaN(e.target.value)) {
              e.target.value = this.temp;
            }
            this.temp = e.target.value;
          }
        }
    }
</script>

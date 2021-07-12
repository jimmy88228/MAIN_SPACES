<template>
    <Form ref="formValidate" :model="formD" :rules="ruleValidate">
      <Table border :columns="columns12" :data="formD.data">
        <template slot-scope="{ row, index }" slot="name">
            <strong>{{ row.name }}</strong>
            <FormItem :prop="'data.'+index+'.name'" :rules="{required: true, message: '报错了', trigger: 'blur'}">
              <Input v-model="row.name" @on-change="e => handleChange(e.target.value, index)"/>
            </FormItem>
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
            <Button type="error" size="small" @click="remove(index)">Delete</Button>
        </template>
      </Table>
    </Form>
</template>
<script>
    export default {
        data () {
            return {
              ruleValidate: {

              },
                columns12: [
                    {
                        title: 'Name',
                        slot: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    },
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                formD: {
                  data: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park'
                    }
                ]
                }
            }
        },
        methods: {
            show (index) {
                console.log(this.data6)
            },
            remove (index) {
                this.data6.splice(index, 1);
            },
            handleChange(value, index) {
              this.formD.data[index].name = value;
            }
        }
    }
</script>

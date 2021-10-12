<template>
    <Form inline label-position="right">
        <div class="flex f-just-end">
            <FormItem>
                <div>
                    <Button type="primary" @click="create" v-if="canCreate.add">
                        <Icon type="md-add-circle" />
                        创建新的智能营销
                    </Button>
                </div>
            </FormItem>
            <FormItem prop="searchq">
                <Input
                class=""
                style="width:250px"
                v-model="formSearch.searchq"
                placeholder="请输入方案名称"
                clearable
                search
                enter-button
                @on-search="search"
                @on-clear="search"
                @keydown.native.enter.prevent="search">
                </Input>
            </FormItem>
        </div>
    </Form>
</template>
<script>
    export default {
        props:["canCreate"],
        data(){
            return {
                formSearch: {
                    searchq: "",
                }
            }
        },
        methods:{
            search(data){
                this.$emit("search", this.formSearch);
            },
            create(){
                this.$emit("create");
            }
        }
    }
</script>
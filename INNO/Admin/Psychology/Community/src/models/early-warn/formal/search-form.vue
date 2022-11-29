<template>
    <rewrite-area>
        <Form :label-width="80" class="no-tip flex-b-c" inline>
            <div>
                <FormItem label="预警等级">
                  <data-select type="warn-level" class="base-select" valueKey="id" nameKey="level_name" v-model="searchForm.level_state" @change="search">
                      <Option slot="default-option" :value="-1">全部</Option>
                  </data-select>
                </FormItem>
            </div>
            <div class="flex">
                <Button @click="addCaring()" v-hasAction="'forewarning_survey_add_people'">添加关爱人员</Button>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select";
export default {
    name: "formalListSearchForm",
    components: { linkageSelect },
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        search() {
            this.$emit("search");
        },
        addCaring() {
            this.$emit("addCaring");
        },
    },
};
</script>

<style lang="less" scoped></style>
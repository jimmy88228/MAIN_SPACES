 <template>
    <rewrite-area>
        <Form :label-width="80" class="no-tip flex-b-c" inline>
            <div class="flex-s-c flex-wrap">
                <FormItem :label-width="0">
                    <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名或学号进行搜索"></rewrite-search>
                </FormItem>
                <FormItem label="审核状态">
                    <Select class="base-select" @on-change="search" v-model="searchForm.state">
                        <Option v-for="item in stateList" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <linkageSelect class="m-t-10 m-b-10" :isShowSchoolYear="true" :searchForm="searchForm" @on-change="search" :hideSelect="['area', 'street', 'grade-type']"></linkageSelect>
                <gauge-range class="m-t-10 m-b-10" :searchForm="searchForm" @on-change="search"></gauge-range>
            </div>
            <div>
                <Button @click="exportHandle"><Icon type="md-cloud-download" /> 导出结果</Button>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select";
import gaugeRange from "./cps/gauge-range.vue";
export default {
    name: "earlyWarnExamineSearchForm",
    components: {linkageSelect,gaugeRange},
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
        stateList: {
            type: Array,
            default:()=>{
                return []
            }
        }
    },
    methods: {
        search(e) {
            this.$emit("search");
        },
        exportHandle(){
          this.$emit("exportHandle")
        }
    },
};
</script>

<style lang="less" scoped></style>
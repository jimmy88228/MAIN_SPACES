<template>
    <Card>
        <Divider class="i-flex" orientation="left">RFM全景</Divider>
        <div>
            <Tabs value="tab1" type="card">
                <TabPane label="客户数占比" name="tab1">
                    <div class="p-15">*功能描述：R(Recency)最近一次购买，F(Frequency)购买次数，M(monetary)购买金额</div>
                    <Table :max-height="600" :loading="tableLoading" :columns="columns1" height="600" :data="tableData"  ref="myTable1" @on-cell-click="">
                        <!-- <template slot-scope="{ row }" slot="goods_thumb">
                            <div class="img_list_wrap">
                                <div class="img_fixed">
                                    <img :src="row.goods_thumb" v-if="row.goods_thumb" :alt="row.real_name" v-viewer/>
                                    <img src="@rs/images/default-img.jpg" :alt="row.real_name" v-viewer v-else></img>
                                </div>
                            </div>
                        </template> -->
                    </Table>
                </TabPane>
                <TabPane label="累计购买金额" name="tab2">
                    <div class="p-15">*功能描述：R(Recency)最近一次购买，F(Frequency)购买次数，M(monetary)购买金额</div>
                    <Table :max-height="600" :loading="tableLoading" :columns="columns2" height="600" :data="tableData" ref="myTable2" @on-cell-click="">
                        <!-- <template slot-scope="{ row }" slot="goods_thumb">
                            <div class="img_list_wrap">
                                <div class="img_fixed">
                                    <img :src="row.goods_thumb" v-if="row.goods_thumb" :alt="row.real_name" v-viewer/>
                                    <img src="@rs/images/default-img.jpg" :alt="row.real_name" v-viewer v-else></img>
                                </div>
                            </div>
                        </template> -->
                    </Table>
                </TabPane>
            </Tabs>
        </div>
    </Card>
</template>
<script>
    // import echart from 'echart';
    import PageHelper from '@/libs/page-helper.js';
    import mixins from "./mixins.js";
    export default {
        name: "rfmGeneral",
        mixins: [ PageHelper, mixins],
        data(){
            return {
                tableData: []
            }
        },
        mounted(){

        },
        methods:{

        }
    }
</script>
<style lang="less">

</style>
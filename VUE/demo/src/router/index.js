import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import opsElse from "../components/opsElse.vue";

import ExtendDemo from "@/components/extend.vue";
import GlobalApi from "@/components/globalApi.vue";
import OpsData from "@/components/opsData.vue";
import OpsDom from "@/components/opsDom.vue";
import Lifecycle from "@/components/lifecycle.vue";
import OpsResource from "@/components/opsResource.vue";
import Combination from "@/components/combination.vue";
import InstanceProperty from "@/components/instance_property.vue";
import InstanceData from "@/components/instance_data.vue";
import InstanceEmit from "@/components/instance_emit.vue";
import instanceLifeCycle from "@/components/instance_life_cycle.vue";
import vInstructions from "@/components/v_instructions.vue";
import spAttribute from "@/components/sp_attribute.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index
  },
  {
    path: "/opsElse",
    name: "opsElse",
    component: opsElse
  },
  {
    path: "/ExtendDemo",
    name: "ExtendDemo",
    component: ExtendDemo
  },
  {
    path: "/GlobalApi",
    name: "GlobalApi",
    component: GlobalApi
  },
  {
    path: "/OpsData",
    name: "OpsData",
    component: OpsData
  },
  {
    path: "/Lifecycle",
    name: "Lifecycle",
    component: Lifecycle
  },
  {
    path: "/OpsResource",
    name: "OpsResource",
    component: OpsResource
  },
  {
    path: "/Combination",
    name: "Combination",
    component: Combination
  },
  {
    path: "/OpsDom",
    name: "OpsDom",
    component: OpsDom
  },
  {
    path: "/InstanceProperty",
    name: "InstanceProperty",
    component: InstanceProperty
  },
  {
    path: "/InstanceData",
    name: "InstanceData",
    component: InstanceData
  },
  {
    path: "/InstanceEmit",
    name: "InstanceEmit",
    component: InstanceEmit
  },
  {
    path: "/instanceLifeCycle",
    name: "instanceLifeCycle",
    component: instanceLifeCycle
  },
  {
    path: "/vInstructions",
    name: "vInstructions",
    component: vInstructions
  },
  {
    path: "/spAttribute",
    name: "spAttribute",
    component: spAttribute
  },



  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes
});

export default router;

import ModuleManager from "@/support/libs/module-manager";

import sort from "./menus-sort";
import groups from "./menus-group";
import admins from "./admins/config";
import customlayout from "./custom-layout/config";
import article from "./article/config";
import user from "./user/config";
import activitylottery from "./activity-lottery/config";
import chosenone from "./chosen-one/config";
import Authority from "./authority/config";

const modules = new ModuleManager()
    .addModule(user)
    .addModule(admins)
    .addModule(customlayout)
    .addModule(article)
    .addModule(activitylottery)
    .addModule(chosenone)
    .addModule(Authority)
    .addMenusGroup(groups)
    .setSort(sort)
    .create();
export default modules;

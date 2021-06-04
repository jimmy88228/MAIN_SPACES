import BehaviorOptionItem from "../../behavior-option-item";
Component({
    behaviors: [BehaviorOptionItem],
    relations: {
        '../input-list': {
            type: 'parent',
            linked(target) {
                this.linked(target);
            },
            unlinked(target) {
                this.unlinked(target);
            }
        }
    }
});
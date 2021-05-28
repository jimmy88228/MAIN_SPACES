Component({
    options: {
        styleIsolation: "apply-shared"
    },
    properties: {
        msg: {
            type: String
        }
    },
    methods: {
        onAuthed() {
            this.triggerEvent("authed");
        }
    }
});
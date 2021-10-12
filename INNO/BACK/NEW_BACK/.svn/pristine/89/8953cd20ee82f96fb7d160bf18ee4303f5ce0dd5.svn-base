export default {
  data () {
    return {
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      maskClose: false
    }
  },
  methods: {
    show () {
      this.modalShow = true;
      return this;
    },
    hide () {
      this.modalShow = false;
      return this;
    },
    showLoading () {
      this.modalShow = true;
      this.modalLoading = false;

      setTimeout(() => {
        this.modalLoading = true;
      }, 50);
    }
  }
}

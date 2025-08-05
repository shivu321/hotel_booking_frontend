<template>
  <div v-if="isShowModal">
    <div class="modal fade wb-modal-wrapper" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="changePass"
      aria-hidden="true" style="pointer-events: none">
      <div class="modal-dialog modal-dialog-centered modal-md" role="document">
        <div class="modal-content">
          <a class="close mr-3 mt-3 text-right" @click="closeModal()" aria-label="Close">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
          </a>
          <div class="modal-header justify-content-center">
            <h5 class="modal-title font-22">
              <span>{{ title }}</span>
            </h5>
          </div>
          <div class="modal-body form-style pt-0 px-lg-5">
            <div class="row">
              <div class="col-lg-12 text-center">
                <h5>{{ body }}</h5>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-center mb-3">
            <button id="cancel-btn" @click="closeModal()" type="button"
              class="btn btn-brand-01 wb-cancel-btn wb_disable_btn mr-lg-3 mr-2">
              {{ leftButton }}
            </button>
            <button type="submit" class="btn btn-brand-01 wb-save-btn" @click="onClick()" id="confirmation-btn">
              {{ rightButton }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import $ from "jquery";
export default {
  name: "AlertMessage",
  data() {
    return {
      isShowModal: false,
      showLoader: false,
      rightButton: "Yes",
      leftButton: "No",
      title: "Alert",
      body: "Are you sure you want to delete",
      obj: {},
    };
  },

  methods: {
    showModal(title, body, obj) {
      this.isShowModal = true;
      window.$("#confirmationModal").modal("show");
      this.title = title;
      this.body = body;
      this.obj = obj;
    },
    closeModal() {
      this.isShowModal = false;
      window.$("#confirmationModal").modal("hide");
      this.removeLoader();
    },
    onClick() {
      this.$emit("remove", this.obj);
      this.showLoader = true;
    },
    removeLoader() {
      this.showLoader = false;
    },
  }
};
</script>
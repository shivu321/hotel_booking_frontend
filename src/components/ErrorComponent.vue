<template>
  <div v-if="showMessage" class="text-center">
    <div class="w-50 d-inline-block pt-5 pb-5 mt-5 mb-5">
      <h3 class="mb-4">
        <strong>{{title}}</strong>
      </h3>
      <p v-if="subtitle">{{subtitle}}</p>
      <a
        v-if="subtitle"
        class="btn btn-link"
        @click="onClick()"
        href="javascript: void(0);"
      >
      <!-- {{$lang.messages.retry}} -->
      Retry
    </a>
    </div>
  </div>
</template>
<script>
export default {
  name: "ErrorComponent",
  data() {
    return {
      title: "",
      subTitle: "",
      showMessage: false
    };
  },
  methods: {
    onClick() {
      this.updateShowMessage();
      this.$emit("retry");
    },
    updateShowMessage() {
      this.showMessage = !this.showMessage;
    },
    setTitle(title,boolean) {

      if (title) {
        this.showMessage = boolean;
        this.setSubtitle();
        this.title = title;
      } else {
        this.setSubtitle(boolean);
        this.title = "Error";
        this.updateShowMessage();
      }
    },
    isShowMessage() {
      return this.showMessage;
    },
    setSubtitle(isShowSubtitle) {
      this.subtitle = isShowSubtitle
        ? "Looks like something went wrong!"
        : undefined;
    }
  }
};
</script>

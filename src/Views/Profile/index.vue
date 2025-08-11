<template>
  <div>
    <div class="content-body mx-2">
      <div class="component-section no-code">
    
        <div class="row row-sm bg-white profile-form">
          <div class="col-lg-2">
            <div class="picture mb-3">
              <img :src="user.profile_image
                  ? user.profile_image
                  : '/static/img/profile-placeholder.jpg'
                " class="image" id="img_hoder_1" />
              <input type="file" id="AddPhoto" accept="image/*" @change="onChange($event)" />
            </div>
            <h6 class="text-primary text-center">
              <a href="javascript:void(0)" @click="OpenSelectImage($event)">Choose Picture</a>
            </h6>
          </div>
          <div class="col-lg-10">
            <Form @submit="onUpdateForm" class="columns column" data-vv-scope="ProfileSave" ref="profileSubmit">
              <div class="profile-right">
                <div class="row">
                  <div class="col-sm-6 mb-3">
                    <label>
                      Name
                      <span class="text-danger">*</span>
                    </label>
                    <Field name="name" v-model="user.name" rules="required" class="form-control" type="text"
                      v-bind:placeholder="'Name'" />
                    <ErrorMessage name="name" class="validation-msg" />
                  </div>
                  
                  <div class="col-sm-6 mb-3">
                    <label>
                      Email
                      <span class="text-danger">*</span>
                    </label>
                    <input name="email" v-model="user.email" rules="required|email" type="email" class="form-control"
                      autocomplete="off" v-bind:placeholder="'Email'" />
                    <ErrorMessage name="email" class="validation-msg" />
                  </div>

                  <div class="col-lg-12 text-right">
                    <a href="javascript:void(0)" @click="openChangePassModal()" class="change-pass">Change Password</a>
                  </div>
                </div>
              </div>
              <div class="col-12 text-center">
                <button type="submit" class="btn btn-info wb-save-btn mt-5 mb-5" id="save-btn">
                  Save
                </button>
                <!-- <button type="button" class="btn btn-outline-secondary">Cancel</button> -->
              </div>
            </Form>
          </div>
        </div>
        <!-- row -->
      </div>
      <div class="modal fade wb-modal-wrapper" id="changePass" tabindex="-1" role="dialog" aria-labelledby="changePass"
        aria-hidden="true" style="pointer-events: none">
        <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
            <a class="close mr-3 mt-3 text-right" @click="closeModal()" aria-label="Close">
              <i class="fa fa-times-circle" aria-hidden="true"></i>  
            </a>
            <div class="modal-header justify-content-center">
              <h5 class="modal-title font-22">
                <span>Change Password </span>
              </h5>
            </div>
            <Form @submit="onChangePassword" class="columns column is-multiline is-12" ref="frmChangePassword">
              <div class="modal-body form-style pb-0 px-lg-5">
                <div class="signin-form">
                  <div class="form-group">
                    <div class="login-field">
                      <label for="current_password">Current Password<span class="text-danger">*</span></label>
                      <Field rules="required" class="form-control" name="current_password" id="current_password"
                        v-model="changePassword.current_password" type="password" placeholder="Current Password" />
                        <i id="button" class="show-icon fa fa-eye-slash" alt=""></i>
                    </div>
                    <ErrorMessage name="current_password" class="validation-msg" />
                  </div>

                  <div class="form-group">
                    <div class="login-field">
                      <label for="Password">Password<span class="text-danger">*</span></label>
                      <Field name="password" type="password" id="password" v-model="changePassword.password"
                        class="form-control" v-on:keydown.space="$event.preventDefault()"
                        rules="required:password|minLength:6|password" :validateOnInput="true" placeholder="Password"
                        autocapitalize="false" />
                        <i id="button" class="show-icon fa fa-eye-slash" alt=""></i>
                    </div>
                    <ErrorMessage name="password" class="validation-msg" />
                  </div>

                  <div class="form-group">
                    <div class="login-field">
                      <label for="conf_password">Confirm Password<span class="text-danger">*</span></label>
                      <Field name="confirm_password" type="password" id="conf_password"
                        v-model="changePassword.confirm_password" v-on:keydown.space="$event.preventDefault()"
                        rules="required:confirm password|confirmed:@password" class="form-control" :validateOnInput="true"
                        placeholder="Confirm Password" autocapitalize="false" />
                        <i id="button" class="show-icon fa fa-eye-slash" alt=""></i>
                    </div>
                    <ErrorMessage name="confirm_password" class="validation-msg" />
                  </div>
                </div>
              </div>
              <div class="modal-footer border-0 justify-content-center mb-3">
                <button id="cancel-btn" @click="closeModal()" type="button"
                  class="btn btn-brand-01 wb-cancel-btn wb_disable_btn mr-lg-3 mr-2">
                  Cancel
                </button>
                <button type="submit" class="btn btn-brand-01 wb-save-btn" id="update-password">
                  Save
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- content-body -->
</template>
<style>
.picture {
  width: 175px;
  height: 175px;
  background-color: #999999;
  position: relative;
  color: #ffffff;
  border-radius: 50%;
  margin: 0px auto;
  overflow: hidden;
  transition: all 0.2s;
  -webkit-transition: all 0.2s;
}

.choose-img {
  position: absolute;
  right: 55px;
  bottom: 20px;
  background: #00205b;
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
}

.profile-right {
  padding-right: 180px;
}

.picture:hover {
  border-color: #2ca8ff;
}

.content.ct-wizard-green .picture:hover {
  border-color: #05ae0e;
}

.content.ct-wizard-blue .picture:hover {
  border-color: #3472f7;
}

.content.ct-wizard-orange .picture:hover {
  border-color: #ff9500;
}

.content.ct-wizard-red .picture:hover {
  border-color: #ff3b30;
}

.picture input[type="file"] {
  cursor: pointer;
  display: block;
  height: 100%;
  left: 0;
  opacity: 0 !important;
  position: absolute;
  top: 0;
  width: 100%;
}
.show-icon{
  top:35px !important;
}
.image {
  width: auto;
  height: 100%;
  margin: auto;
}
</style>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import $ from "jquery";

export default {
  name: "ProfileSection",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      user: {
        email: "",
        name:"",
      },
      changePassword: {
        current_password: "",
        password: "",
        confirm_password: "",
      },
      current_date: new Date(),
    };
  },
  methods: {
    onClearForm(formRefName) {
      this.$refs[formRefName].resetForm();
    },
    openChangePassModal() {
      window.$('#changePass').modal('show')
    },
    closeModal() {
      window.$('#changePass').modal('hide');
      this.onClearForm("frmChangePassword");
    },
    OpenSelectImage(e) {
      e.stopImmediatePropagation();
      window.$("#AddPhoto").click();
    },
    onUpdateForm() {
      this.$api
        .webRequest({
          _method: "PUT",
          _action: "update-profile",
          _body: this.user,
          _buttonId: "save-btn",
          _hide_loader: true,
        })
        .then((res) => {
          this.$toast.success(res.message, {
            postion: "top-right"
          });

          this.getMe();
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            postion: "top-right"
          });
        });
    },
    onChangePassword() {
      this.$api
        .webRequest({
          _method: "POST",
          _action: "reset-password",
          _body: this.changePassword,
          _buttonId: "update-password",
          _hide_loader: true,
        })
        .then((res) => {
          this.$toast.success(res.message, {
            postion: "top-right"
          });
          this.closeModal();
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            postion: "top-right"
          });
        });
    },
    getMe() {
      this.$api
        .webRequest({
          _method: "GET",
          _action: "me",
        })
        .then((res) => {
          this.user = res.info;
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            postion: "top-right"
          });
        });
    },
    onChange(e) {
      let files = e.target.files;
      this.file = files[0];
      if (e.target.files && e.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          window.$("#img_hoder_1").attr("src", e.target.result);
        };
      }
      reader.readAsDataURL(e.target.files[0]);
      this.uploadFile();
    },

    uploadFile() {
      console.log("profile_image file", this.file);
      this.$api
        .uploadImageAPI({
          _action: "upload-profile-image",
          _key: "image",
          _file: this.file,
        })
        .then((res) => {
          this.$toast.success(res.message, {
            postion: "top-right"
          });

          this.emitter.emit("profile_image", res);
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            postion: "top-right"
          });
        });
    },
  },
  mounted() {
    this.getMe();
    this.$storeService.commit("setTitle", "Profile Section");

    $(document).ready(function () {
      $(".show-icon").on("click", function (event) {
        event.preventDefault();
        console.log("type : ", $(this).parent().find("input").attr("type"));
        var input = $(this).parent().find("input");
        var icon = $(this).parent().find("i");

        if (input.attr("type") == "text") {
          input.attr("type", "password");
          icon.addClass("fa-eye-slash");
          icon.removeClass("fa-eye");
        } else if (input.attr("type") == "password") {
          input.attr("type", "text");
          icon.removeClass("fa-eye-slash");
          icon.addClass("fa-eye");
        }
      });
    });
  },
};
</script>

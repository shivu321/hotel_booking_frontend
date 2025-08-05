<template>
  <div class="signin-panel">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
           <div class="m-3 text-center">
            <img src="/static/img/logo.png" width="200">
          </div>
          <div class="card card-body rounded-20 p-0">
            <div class="signin-sidebar-body">
              <div class="col-md-6 pr-2">
                <!-- <h2 class="content-title">
                  <a @click="$router.go(-1)" style="cursor: pointer"
                    ><i class="fas fa-angle-left mr-2"></i>Back</a
                  >
                </h2> -->
              </div>
              <h4 class="forget-title pt-5">Reset Password</h4>
              <Form @submit="onResetPassword()" class="signin-form">
                <div class="signin-form">
                  <div class="form-group">
                    <div class="login-field">
                      <label for="Password">Password<span class="text-danger">*</span></label>
                      <Field
                        name="password"
                        :type="passwordFieldType"
                        id="password"
                        v-model="resetPassword.password"
                        class="form-control"
                        v-on:keydown.space="$event.preventDefault()"
                          rules="required:password|minLength:6|password"
                        :validateOnInput="true"
                        placeholder="Password"
                        autocapitalize="false"
                      />
                      <i id="button" alt="" class="show-icon fa fa-eye-slash"></i>
                    </div>
                    <ErrorMessage name="password" class="validation-msg" />
                  </div>

                  <div class="form-group">
                    <div class="login-field">
                      <label for="conf_password">Confirm Password<span class="text-danger">*</span></label>
                      <Field
                        name="confirm_password"
                        :type="passwordFieldType"
                        id="conf_password"
                        v-model="resetPassword.confirm_password"
                        v-on:keydown.space="$event.preventDefault()"
                          rules="required:confirm password|confirmed:@password"
                        class="form-control"
                        :validateOnInput="true"
                        placeholder="Confirm Password"
                        autocapitalize="false"
                      />
                      
                      <i id="button" alt="" class="show-icon fa fa-eye-slash"></i>
                    </div>
                    <ErrorMessage name="confirm_password" class="validation-msg" />
                  </div>
                  <div class="d-flex justify-content-center">
                    <button
                      id="cancel-btn"
                      type="button"
                      data-dismiss="modal"
                      class="btn btn-brand-01 wb-cancel-btn mr-lg-3 mr-2"
                      @click="redirectToLogin()"
                    >
                      Cancel
                    </button>
                    <button
                      
                      type="submit"
                      class="btn btn-brand-01  wb-save-btn"
                      id="save-btn"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Form>  
            </div>

            <!-- signin-sidebar-body -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
<script>
import $ from "jquery";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  name: "ResetPass",
  components: { Form,
    Field,
    ErrorMessage,},

  data() {
    return {
      email: "",
      resetPassword: {},
      passwordFieldType: "password",
      image: "/static/img/password.svg",
      token: this.$route.params.token,
    };
  },

  mounted() {
    var VerifyToken = localStorage.getItem("token");
    var access_token = localStorage.getItem("access_token");
    if (VerifyToken == null || VerifyToken == undefined || VerifyToken == "") {
      this.$router.push("/login");
      if (access_token != null || access_token != undefined) {
        this.$shareService.onSuccessToast("Please logout first.");
      } 
    }
    // if (access_token == null || access_token == undefined || access_token == "") {
    //   this.$router.push("/login");
    // } else {
    //   this.$router.push("/profile");
    // }
    $(document).ready(function () {
      $(".show-icon").on("click", function (event) {
        event.preventDefault();
        console.log("type : ", $(this).parent().find("input").attr("type"));
        var input = $(this).parent().find("input");
        if (input.attr("type") == "text") {
          input.attr("type", "password");
          $(this).parent().find("i").removeClass("fa-eye").addClass("fa-eye-slash");
        } else if (input.attr("type") == "password") {
          input.attr("type", "text");
          $(this).parent().find("i").removeClass("fa-eye-slash").addClass("fa-eye");
        }
      });
    });
  },
  methods: {
    redirectToLogin(){
      this.$router.push("/login");
      localStorage.clear();
    },
    onResetPassword() {
      this.$api
        .webRequest({
          _method: "POST",
          _action: "reset-password/" + this.token,
          _body: this.resetPassword,
          _buttonId: "save-btn",
          _hide_loader: true,
        })
        .then((res) => {
          localStorage.clear();
          this.$router.push("/login");
          this.$toast.success(res.message, {
              position: 'top-right'
          });
        })
        .catch((e) => {
          this.$toast.error(e.message, {
              position: 'top-right'
            });
        });
    },
    
  },
};
</script>

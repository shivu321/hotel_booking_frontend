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
              <h4 class="signin-title mb-0">Welcome to user portal</h4>
              <Form @submit="onRegister" ref="registerForm" class="signin-form">
                <div class="form-group">
                  <div class="login-field">
                    <Field name="name" v-model="name" rules="required" class="form-control"
                      id="name" :validateOnInput="true" type="text" placeholder="Enter Name"
                      autocapitalize="false" />
                  </div>
                  <ErrorMessage name="name" class="validation-msg" />
                </div>
                <div class="form-group">
                  <div class="login-field">
                    <Field name="Username" v-model="email" rules="required|email" class="form-control"
                      id="username" :validateOnInput="true" type="text" placeholder="Email Address"
                      autocapitalize="false" />
                  </div>
                  <ErrorMessage name="Username" class="validation-msg" />
                </div>
                <div class="form-group">
                  <div class="login-field">
                    <Field name="Password" :type="passwordFieldType" id="Password" v-model="password" class="form-control"
                      rules="required|password" :validateOnInput="true" placeholder="Password" autocapitalize="false" />
                    <i id="button" alt="" class="show-icon fa fa-eye-slash" style=" top:15px !important"></i>
                  </div>
                  <ErrorMessage name="Password" class="validation-msg" />
                </div>
                <div class="form-group d-flex mg-b-0">
                  <button class="btn btn-brand-01 btn-uppercase flex-fill" type="submit" id="save-btn">
                    Create
                  </button>
                </div>
              </Form>
              <div class="row">
                <div class="col-lg-12 text-center">
                  <div class="wb-forgotPass">
                    <a style="cursor:pointer" v-on:click="onRegisterPage()">Already have account?</a>
                  </div>
                </div>
              </div>
            </div>
            <!-- signin-sidebar-body -->
          </div>
        </div>
      </div>
    </div>
    <!-- signin-sidebar -->
  </div>
  <!-- signin-panel -->
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import $ from "jquery"
export default {
  name: "RegisterPage",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      passwordFieldType: "password",
      image: "/static/img/password.svg",
    };
  },
  mounted() {
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
    onClearForm(formRefName) {
      this.$refs[formRefName].resetForm();
    },
    onRegister() {
      this.errorMessage = "";
      this.$api
        .getAccesstoken({
          _action: "register",
          _buttonId: "save-btn",
          _body: { email: this.email, password: this.password,name:this.name },
          _hide_loader: true,
        })
        .then((res) => {
          if (res && res.access_token) {
            localStorage.setItem("access_token", res.access_token);
            this.$toast.success(res.message, { position: "top-right" });
            this.onGetMe();
            this.onClearForm("registerForm");
           this.$router.push("/home");
          }
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            position: 'top-right'
          });
        });
    },
    onSwitchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
      this.image =
        this.image === "/static/img/password.svg" ? "/static/img/password.svg" : "/static/img/password.svg";
    },
    onRegisterPage() {
      this.$router.push("/login");
    },
    onGetMe() {
      var method = "GET";
      this.$api
        .webRequest({
          _method: method,
          _action: "me",
          _hide_loader: true,
        }).then((res) => {
          this.$notify({
            type: "success",
            text: res.message,
          });
        })
        .catch((e) => {
          this.$toast.error(e.message, { position: "top-right" });
        });
    },
  },
};
</script>


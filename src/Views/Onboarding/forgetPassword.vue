<template>
  <div class="signin-panel">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="m-3 text-center">
            <img src="/static/img/logo.png" width="200">
          </div>
          <div class="card card-body rounded-20 p-0">
            <div class="signin-sidebar-body" v-show="showEmail">
              <!--<div class="col-md-12 px-0">
                <h2 class="content-title">
                  <a @click="$router.go(-1)" style="cursor: pointer"
                    ><i class="fas fa-angle-left mr-2"></i>Back</a
                  >
                </h2>
              </div> -->
              <h4 class="forget-title mb-0">Forgot Password</h4>
              <!-- <h5 class="signin-subtitle text-secondary pt-2">
                Please enter mobile number to continue.
              </h5> -->

              <div class="signin-form my-0">
                <Form @submit="onSendOtp()" class="signin-form">
                  <div class="form-group">
                    <div class="login-field">
                      <!-- <label for="username">Mobile Number <span class="text-danger">*</span></label> -->
                      <Field name="email" v-model="email" rules="required|email" class="form-control"
                        id="email" :validateOnInput="true" type="email" placeholder="Email"
                        autocapitalize="false" />
                    </div>
                    <ErrorMessage name="email" class="validation-msg" />
                  </div>
                  <div class="form-group d-flex mg-b-0 mb-0">
                    <button class="btn btn-brand-01 btn-uppercase flex-fill" id="save-btn" type="submit">
                      Send OTP
                    </button>
                  </div>
                </Form>

                <div class="row">
                  <div class="col-lg-12 text-center">
                    <div class="wb-forgotPass">

                      <a style="cursor:pointer" v-on:click="$router.go(-1)">Back to Login</a>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="signin-sidebar-body" v-show="showOtp">
              <Form @submit="validateOtp()" class="signin-form">
                <h4 class="forget-title">Forgot Password</h4>
                <h5 class="forget-subtitle">
                  Your OTP for forgot password verification has been sent to your email address valid for 10 minutes
                </h5>
                <br />
                <div class="d-flex justify-content-center">
                  <vue3-otp-input ref="otpInput" input-classes="otp-input"
                    :conditionalClass="['one', 'two', 'three', 'four','five','six']" separator="-" inputType="letter-numeric"
                    :num-inputs="6" v-model:value="bindValue" :should-auto-focus="true" @on-change="handleOnChange"
                    @on-complete="handleOnComplete" :placeholder="['*', '*', '*', '*','*','*']" />
                </div>
                <p class="text-center mt-3 mb-4" id="counterTime"></p>
                <p style="cursor: pointer" v-show="showResendOtp == true" class="text-center btn mt-3 mb-4"
                  @click="onReSendOtp()" id="resendOtpDisplay">
                  Resend Otp
                </p>
                <div class="form-group d-flex mg-b-0 pt-2">
                  <button class="btn btn-brand-01 btn-uppercase flex-fill" id="verify-otp" type="submit">
                    Verify
                  </button>
                </div>
              </Form>
            </div>

            <!-- signin-sidebar-body -->
          </div>
        </div>
      </div>
    </div>

    <!-- signin-sidebar -->

  </div>
</template>
<style>
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}

.otp-input.is-complete {
  background-color: #e4e4e4;
}

.otp-input.error {
  border: 1px solid red !important;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input::placeholder {
  font-size: 15px;
  text-align: left;
  font-weight: 600;
}
</style>
<script>
import Vue3OtpInput from "vue3-otp-input";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  name: "ForgetPass",
  components: {
    Form,
    Field,
    ErrorMessage,
    Vue3OtpInput
  },
  data() {
    return {
      email: "",
      id: this.$route.params.id,
      isCodeValid: true,
      showOtp: false,
      showEmail: true,
      bindValue: "",
      otp: "",
      ref_no: "",
      token: "",
      resetPassword: {},
      showResendOtp: false,
    };
  },

  mounted() {
  },
  methods: {
    onClearForm(formRefName) {
      this.$refs[formRefName].resetForm();
    },
    changeOtp() {
      this.showOtp = true;
    },
    handleOnComplete(value) {
      console.log("value from otp input:", value, this.bindValue)
    },
    handleOnChange(value) {
      this.otp = value;
    },
    validateOtp() {
      if (this.otp == null) {
        return false;
        //this.$shareService.onErrorToast(e.message);("Please enter otp");
      }
      this.$api
        .webRequest({
          _method: "POST",
          _action: "forgot-password/verify",
          _buttonId: "verify-otp",
          _hide_loader: true,
          _body: {
            otp: this.otp,
            email: this.email,
            ref_no: this.ref_no
          },
        })
        .then((res) => {
          this.token = res.remember_token;
          if (res.has_verified == true) {
            this.$toast.success(res.message, {
              position: 'top-right'
            });
            this.$router.push("/reset-password/" + res.remember_token);
            this.showOtp = true;
            this.showEmail = false;
            this.setCounter();
          }
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            position: 'top-right'
          });
          //this.$shareService.onErrorToast(e.message);(e.message);
        });
    },

    onReSendOtp() {
      var counterDisplay = window.$("#counterTime");
      var resendOtpDisplay = window.$("#resendOtpDisplay");
      if (counterDisplay.hasClass("d-none")) {
        counterDisplay.removeClass("d-none");
        counterDisplay.addClass("d-block");
        counterDisplay.text("");
      } else {
        counterDisplay.addClass("d-block");
      }
      if (resendOtpDisplay.hasClass("d-block")) {
        resendOtpDisplay.removeClass("d-block");
        resendOtpDisplay.addClass("d-none");
      } else {
        resendOtpDisplay.addClass("d-none");
      }

      this.onSendOtp("RESEND");
    },
    onSendOtp(type) {
      if (type == "RESEND") {
        var counterDisplay = window.$("#counterTime");
        counterDisplay.append(
          `<span class="spinner-border text-info" role="status"></span>`
        );
      }
      this.$api
        .webRequest({
          _method: "POST",
          _action: "forgot-password",
          _buttonId: "save-btn",
          _hide_loader: true,
          _body: { email: this.email },
        })
        .then((res) => {
          if (res.has_send_otp == true) {
            this.showOtp = true;
            this.ref_no = res.ref_no;
            this.showEmail = false;
            this.$toast.success(res.message, {
              position: 'top-right'
            });
            this.setCounter();

          }
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            position: 'top-right'
          });
        });
    },
    onCompleteHandler(code) {
      console.log("code completed", code);
      this.isCodeValid = false;
      this.otp = code;
    },

    onChangedHandler(lastEnteredCode) {
      console.log("code changed", lastEnteredCode);
      this.isCodeValid = true;
    },

    onPasteHandler(code) {
      console.log("code pasted", code);
    },

    onSwitchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
      this.image =
        this.image === "/static/img/password.svg" ? "/static/img/password.svg" : "/static/img/password.svg";
    },
    setCounter() {
      var counter = 59;
      var interval = setInterval(function () {
        counter--;
        if (counter < 0) {
          var counterDisplay = window.$("#counterTime");
          var resendOtpDisplay = window.$("#resendOtpDisplay");
          if (counterDisplay.hasClass("d-block")) {
            counterDisplay.removeClass("d-block");
            counterDisplay.addClass("d-none");
          } else {
            counterDisplay.addClass("d-none");
          }
          if (resendOtpDisplay.hasClass("d-none")) {
            resendOtpDisplay.removeClass("d-none");
            resendOtpDisplay.addClass("d-block");
          } else {
            resendOtpDisplay.addClass("d-block");
          }
          this.showResendOtp = true;
          clearInterval(interval);
          return;
        } else {
          window.$("#counterTime").text("Resend OTP in 00:" + counter);
          console.log("Timer --> " + counter);
        }

      }, 1000);
    },

  },
};
</script>

<template>
  <div>
    <div class="header" style="background-color: 'linear-gradient(270deg, #0F4C81 0%, #3B81BE 98.83%)'">
      <div class="header-left "  >
         <a href="javascript:void(0)" class="sidebar-logo mb-0" >
          <img src="/static/img/logo.png" alt="Logo" width="156" height="" />
        </a>
        <h2 class="content-title pt-3 pl-0">{{ title }}</h2>
      </div>
      <div class="header-right">
        <div class="dropdown dropdown-loggeduser">
          <a href class="dropdown-link" data-toggle="dropdown">
            <div class="avatar avatar-sm">
              <img :src="user.profile_image
                ? user.profile_image
                : '/static/img/placeholder.png'
                " class="rounded-circle" />
            </div>
            <i class="fa fa-angle-down"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <div class="dropdown-menu-body">
              <router-link to="/profile">
                <a href class="dropdown-item">
                  <img src="static/img/profile-icon.svg" alt="" class="mr-2" /> My Profile
                </a>
              </router-link>
              <router-link to="/my-booking">
                <a href class="dropdown-item">
                  <img src="static/img/profile-icon.svg" alt="" class="mr-2" /> My Booking
                </a>
              </router-link>
              <router-link to="/home">
                <a href class="dropdown-item">
                  <img src="static/img/profile-icon.svg" alt="" class="mr-2" /> Search Hotel
                </a>
              </router-link>
              <a href class="dropdown-item" @click="logout()">
                <img src="static/img/logout-icon.svg" class="mr-2" alt="" /> Sign Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css"
// import { Field, } from "vee-validate";
export default {
  name: "HeaderTop",

  components: {
    // Multiselect, Field,
  },

  data() {
    return {
      user: {
        name: "",
        email: "",
        profile_image: "",
      },
    };
  },

  computed: {
    title() {
      return this.$storeService.getters.getTitle ;
    }
  },

  mounted() {
    this.getMe();
    this.emitter.on("profile_image", isOpen => {
      console.log(isOpen);
      this.getMe();
    });
  },
  methods: {
    addToggleClass() {
      window.$('body').toggleClass('toggle-sidebar');
    },
    updateBranch() {
      location.reload();
    },
    getMe() {
      var method = "GET";
      this.$api
        .webRequest({
          _method: method,
          _action: "me",
        })
        .then((res) => {
          this.user = res.info;
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            position: 'top-right'
          });
        });
    },
    logout() {
      this.$api.logout();
    },
  }
};
</script>


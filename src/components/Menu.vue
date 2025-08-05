<template>
  <div class="sidebar">
    <div class="sidebar-header" style="background-color: 'linear-gradient(270deg, #0F4C81 0%, #3B81BE 98.83%)'">
      <div class="text-center">
        <a href="javascript:void(0)" class="sidebar-logo mb-0">
          <img src="/static/img/logo.png" alt="Logo" width="156" height="" />
        </a>
      </div>
    </div>
    <!-- sidebar-header -->
    <div id="dpSidebarBody" class="sidebar-body" style="overflow-y: scroll;">
      <ul class="nav nav-sidebar">
        <li class="nav-item" v-for="(data, index) in menus" :key="index" @click="removeActiveTab()">
          <a style="cursor: pointer" @click="removeActiveTab()" :class="data.sub_menus ? 'nav-link' : 'nav-link'"
            aria-expanded="false" v-on:click="redirect('menu-' + index, data.url)">
            <div class="parent-icon icon-color-1">
              <img class="img-fluid" style="padding-right: 3px" :src="'/../static/img/icons/' + data.icon_class"  width="30"/>
            </div>
            <div class="menu-title">{{ data.name }} </div>
          </a>

          <ul :id="'menu-' + index" class="mm-collapse" v-show="data.sub_menus" @click="removeActiveTab()">
            <li class="nav-item pt-1" v-for="(sub_menu, sub_index) in data.sub_menus" :key="sub_index"
              @click="removeActiveTab()">
              <a style="cursor: pointer" :class="sub_menu.sub_menus ? 'nav-link' : 'nav-link'"
                v-on:click="redirect('sub-menu-' + index + sub_index, sub_menu.url)">
                <div class="parent-icon icon-color-1">
                  <img class="img-fluid px-3" style="padding-right: 3px"
                    :src="'/../static/img/icons/' + sub_menu.icon_class" />
                </div>
                <div class="menu-title" @click="removeActiveTab()">{{ sub_menu.name }}</div>
              </a>
              <ul :id="'sub-menu-' + index + sub_index" class="mm-collapse" v-show="sub_menu.sub_menus">
                <li v-for="(sub_sub_menu, sub_sub_index) in sub_menu.sub_menus" :key="sub_sub_index">
                  <a style="cursor: pointer" :id="'sub-sub-menu-' + index + sub_index + sub_sub_index"
                    :class="sub_sub_menu.sub_menus ? 'has-arrow' : ''" v-on:click="
                      redirect(
                        'sub-sub-menu-' + index + sub_index + sub_sub_index,
                        sub_sub_menu.url
                      )
                      ">
                    <div class="parent-icon icon-color-1">
                      <i style="font-size: 13px" class="bx bx-right-arrow-alt"></i>
                    </div>

                    <div class="menu-title">{{ sub_sub_menu.name }} </div>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- sidebar-body -->
  </div>
  <!-- sidebar -->
</template>
<script>
import router from "@/router";
// import EventBus from "../eventBus";
import $ from "jquery";
export default {
  name: "LeftMenu",

  data() {
    return {
      user: {
        name: "",
        email: "",
        profile_image: "",
      },

      menus: [],
      portalType: ""
    };
  },

  mounted() {
    this.getMe();
    this.getMenu();
  },

  methods: {
    redirect(id, url) {
      localStorage.setItem("active_menu_id", id);
      var elems = document.querySelector(".mm-active");
      if (elems !== null) {
        elems.classList.remove("mm-active");
      }
      var element = document.getElementById(id);
      if (element) {
        element.parentElement.classList.add("mm-active");
      }

      if (url == "#") {
        if (id) {
          if (element) {
            if (element.className.indexOf("mm-show") == -1) {
              element.classList.add("mm-show");
            } else {
              element.classList.remove("mm-show");
            }
          }
        }
      } else {
        url = url.replace("#", "");
        if (window.location.pathname != url) {
          router.push(url);
        }
      }
    },
    removeActiveTab() {
      localStorage.removeItem("active_tab");
    },
    getMenu() {
      var method = "GET";
      this.$api
        .webRequest({
          _method: method,
          _action: "left-menus",
        }).then((res) => {
          if (res && res.list) {
            this.menus = res.list;
            for (var i = 0; i < this.menus.length; i++) {
              if (this.menus[i].access) {
                this.menuList.push(this.getMenuDetail(this.menus[i]));
              }

              if (this.menus[i].sub_menus) {
                for (var j = 0; j < this.menus[i].sub_menus.length; j++) {
                  if (this.menus[i].sub_menus[j].access) {
                    this.menuList.push(this.getMenuDetail(this.menus[i].sub_menus[j]));
                  }

                  if (this.menus[i].sub_menus[j].sub_menus) {
                    for (
                      var k = 0;
                      k < this.menus[i].sub_menus[j].sub_menus.length;
                      k++
                    ) {
                      if (this.menus[i].sub_menus[j].sub_menus[k].access) {
                        this.menuList.push(
                          this.getMenuDetail(this.menus[i].sub_menus[j].sub_menus[k])
                        );
                      }
                    }
                  }
                }
              }
            }
            if (window.location.pathname == "/access-denied") {
              this.$router.go(-1);
            }
            if (
              localStorage.getItem("active_menu_id") != "" ||
              localStorage.getItem("active_menu_id") != undefined ||
              localStorage.getItem("active_menu_id") != null
            ) {
              var menu_element = document.getElementById(
                localStorage.getItem("active_menu_id")
              );
              menu_element.classList.add("mm-active");
            }
          }
        })
        .catch((e) => { e });
    },
    getMe() {
      var method = "GET";
      this.$api
        .webRequest({
          _method: method,
          _action: "me",
        }).then((res) => {
          this.user = res.info;

        })
        .catch(() => {
        });
    },
    setA(e) {
      $(e.target).parent().toggleClass("show");
      $(e.target).parent().siblings().removeClass("show");
    },
  }
};
</script>

<style scoped>
.nav-sidebar .nav-item .router-link-exact-active .nav-link {
  background: #b7b7e457;
  color: #fff;
}

.menu-title {
  margin-left: 10px;
}
</style>
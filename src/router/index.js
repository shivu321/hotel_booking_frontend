import { createWebHistory, createRouter } from "vue-router";
import Login from "@/Views/Onboarding/login.vue";
import Register from "@/Views/Onboarding/register.vue";
import Profile from "@/Views/Profile/index.vue";
import ForgetPassword from "@/Views/Onboarding/forgetPassword.vue";
import ResetPassword from "@/Views/Onboarding/resetPassword.vue";
import MainView from "@/Views/main.vue";
import HomePage from "@/Views/HomePage/index.vue";
import MyBookings from "@/Views/MyBookings/index.vue";
import BookingDetail from "@/Views/MyBookings/details.vue";
import HotelDetails from "@/Views/HomePage/details.vue";
// import NotFound from "@/Views/NotFound.vue";
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/create-account",
    name: "Register",
    component: Register,
  },

  {
    path: "/forget-password",
    name: "ForgetPassword",
    component: ForgetPassword,
  },
  {
    path: "/reset-password/:token",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "",
    name: "Main",
    component: MainView,
    meta: {
      requiresAuth: true,
    },
    children: [
      // {
      //   path: "/:pathMatch(.*)*",
      //   name: "NotFound",
      //   component: NotFound,
      // },
      {
        path: "/:pathMatch(.*)*",
        redirect: "/home", // ✅ Redirect to home instead of showing NotFound
      },
      {
        path: "/profile",
        name: "ProfileSection",
        component: Profile,
      },
      {
        path: "/home",
        name: "HomePage",
        component: HomePage,
      },
      {
        path: "/hotel-detail/:uuid",
        name: "HotelDetails",
        component: HotelDetails,
      },
      {
        path: "/my-booking",
        name: "MyBookings",
        component: MyBookings,
      },
      {
        path: "/booking-detail/:id",
        name: "BookingDetail",
        component: BookingDetail,
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: "/login",
        query: { nextUrl: to.fullPath }, 
      });
    } else {
      next();
    }
  } else {
    if (
      isAuthenticated &&
      [
        "/",
        "/login",
        "/create-account",
        "/forget-password",
        "/reset-password",
      ].includes(to.path)
    ) {
      next({ path: "/home" });
    } else {
      next();
    }
  }
});

export default router;

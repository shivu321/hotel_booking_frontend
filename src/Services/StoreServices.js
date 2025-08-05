import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state() {
    return {
      title: "",
      bookingInfo: {},
    };
  },
  mutations: {
    setTitle(state, payload) {
      state.title = payload;
    },
    setBookingInfo(state, payload) {
      state.bookingInfo = payload;
    },
  },
  getters: {
    getTitle(state) {
      return state.title;
    },
    getBookingInfo(state) {
      return state.bookingInfo;
    },
  },
  actions: {},
  plugins: [
    createPersistedState({
      paths: ["bookingInfo"]  
    }),
  ],
});

export default store;

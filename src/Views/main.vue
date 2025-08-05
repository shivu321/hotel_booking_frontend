<template>
    <div>
      <!-- <Menu /> -->
      <div class="content">
        <Header />
        <router-view></router-view>
      </div>
    </div>
  </template>
  <style>
  .sorting {
    white-space: nowrap !important;
  }
  </style>
  <script>
 
  import Header from "@/components/Header";
  export default {
    name: "MainPage",
    components: {
      Header
    },
  };
  </script>
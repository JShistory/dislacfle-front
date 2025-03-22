<template>
    <v-app-bar app>
      <v-toolbar-title>Dislacfle</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="authStore.user">
        <v-btn @click="authStore.logout">로그아웃</v-btn>
        <v-btn to="/profile">내 정보</v-btn>
      </template>
      <template v-else>
        <v-btn to="/login">로그인</v-btn>
        <v-btn to="/signup">회원가입</v-btn>
      </template>
    </v-app-bar>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/store';
  const authStore = useAuthStore();
  </script>
<template>
  <v-container>
    <v-card>
      <v-card-title>로그인</v-card-title>
      <v-card-text>
        <v-text-field v-model="username" label="아이디"></v-text-field>
        <v-text-field v-model="password" label="비밀번호" type="password"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="handleLogin">로그인</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';
import userService from '@/services/user/userService';

const username = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    const response = await userService.login(username.value, password.value);
    const token = response.data.data;
    authStore.login(token); // ✅ 토큰 저장
    router.push('/');
  } catch (error) {
    alert(error.response.data.message);
    console.error('로그인 실패', error.response.data.message);
  }
};
</script>
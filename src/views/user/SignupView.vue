<template>
  <div class="signup-container">
    <v-card class="signup-card">
      <v-card-title>회원가입</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="username"
            label="아이디"
            :rules="[rules.required]"
            required
          />
          <v-text-field
            v-model="password"
            label="비밀번호"
            type="password"
            :rules="[rules.required, rules.password]"
            required
          />
          <v-text-field
            v-model="passwordConfirm"
            label="비밀번호 확인"
            type="password"
            :rules="[rules.required, rules.passwordMatch]"
            required
          />
          <v-text-field
            v-model="nickname"
            label="닉네임"
            :rules="[rules.required]"
            required
          />
          <v-btn :disabled="!isValid" color="primary" block @click="signup">
            회원가입
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/user/userService';

const router = useRouter();
const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const nickname = ref('');
const form = ref(null);

const rules = {
  required: (v) => !!v || '필수 입력 항목입니다.',
  password: (v) => (v.length >= 6) || '비밀번호는 최소 6자 이상이어야 합니다.',
  passwordMatch: (v) => (v === password.value) || '비밀번호가 일치하지 않습니다.',
};

// 모든 필드가 유효하면 회원가입 버튼 활성화
const isValid = computed(() => {
  return username.value && password.value && passwordConfirm.value && nickname.value &&
         password.value.length >= 6 && password.value === passwordConfirm.value;
});

const signup = async () => {
  try {
    await UserService.signup(username.value, password.value, nickname.value, "USER");
    router.push('/login'); // 성공 시 로그인 페이지로 이동
  } catch (error) {
    console.error('회원가입 실패', error);
    alert(error.response?.data?.message || '회원가입에 실패했습니다.');
  }
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin-top: 100px;
  padding: 20px;
}
</style>

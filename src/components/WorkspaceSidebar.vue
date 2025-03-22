<template>
    <v-navigation-drawer v-if="workspaceId" app permanent right>
      <v-list>
        <v-list-item-group>
          <v-subheader>워크스페이스 멤버</v-subheader>
          <v-list-item v-for="user in users" :key="user.id">
            <v-list-item-title> {{ user.username }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
  
      <!-- 사용자 초대 버튼 -->
      <v-btn color="primary" block class="invite-button" @click="inviteDialog = true">
        사용자 초대하기
      </v-btn>
  
      <!-- 사용자 초대 모달 -->
      <v-dialog v-model="inviteDialog" max-width="400px">
        <v-card>
          <v-card-title>사용자 초대</v-card-title>
          <v-card-text>
            <v-text-field v-model="inviteUsername" label="사용자 이름 입력" outlined dense></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="inviteUser">초대하기</v-btn>
            <v-btn color="grey" @click="inviteDialog = false">취소</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { defineProps, ref, watch } from 'vue';
  import workSpaceService from '@/services/workspace/workSpaceService';
  
  const props = defineProps({
    workspaceId: Number, // 부모에서 workspaceId를 전달받음
  });
  watch(() => props.workspaceId, (newId) => {
    if (newId) {
      console.log("🔄 workspaceId 변경됨:", newId);
      fetchUsers();
    }
  }, { immediate: true });
  const inviteDialog = ref(false);
  const inviteUsername = ref('');
  const users = ref([]);
  
  // 워크스페이스의 사용자 목록 가져오기
  const fetchUsers = async () => {
    if (!props.workspaceId) return;
    try {
      const response = await workSpaceService.getUser(props.workspaceId);
      console.log("RES", response.data.data);
      users.value = response.data.data; // API에서 받은 사용자 리스트 저장
      console.log("USER", users);
    } catch (error) {
      console.error('워크스페이스 유저 목록을 불러오는 중 오류 발생:', error);
    }
  };
  
  // workspaceId가 변경될 때마다 사용자 목록 업데이트
  watch(() => props.workspaceId, fetchUsers, { immediate: true });
  
  const inviteUser = async () => {
    if (!inviteUsername.value.trim()) return;
    try {
      const response = await workSpaceService.inviteUser(props.workspaceId, inviteUsername.value);
      console.log(response)
      alert("success")
    } catch (error) {
      alert(error.response.data.message);
    }
  
    inviteUsername.value = ''; // 입력 필드 초기화
    inviteDialog.value = false;
  };
  
  </script>
  
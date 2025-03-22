<template>
  <v-navigation-drawer app>
    <v-list>
      <template v-if="workspaces.length > 0">
        <v-list-item 
          v-for="workspace in workspaces" 
          :key="workspace.id" 
          @click="selectWorkspace(workspace)"
          class="workspace-item"
        >
          <v-list-item-title>{{ workspace.spaceName }}</v-list-item-title>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item>
          <v-list-item-subtitle class="text-center">등록된 워크스페이스가 없습니다.</v-list-item-subtitle>
        </v-list-item>
      </template>
    </v-list>

    <v-divider></v-divider>
    <v-list>
      <v-list-item>
        <v-btn color="primary" block @click="openAddWorkspaceModal">워크스페이스 추가</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-dialog v-model="isModalOpen" max-width="400px">
    <v-card>
      <v-card-title>새 워크스페이스 추가</v-card-title>
      <v-card-text>
        <v-text-field v-model="newWorkspaceName" label="워크스페이스 이름" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey" @click="isModalOpen = false">취소</v-btn>
        <v-btn color="primary" @click="addWorkspace">추가</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import userService from '@/services/user/userService';
import workSpaceService from '@/services/workspace/workSpaceService';
import { useAuthStore } from '@/store';

const workspaces = ref([]);
const isModalOpen = ref(false);
const newWorkspaceName = ref('');
const authStore = useAuthStore();
const emit = defineEmits(['workspaceSelected']); // 선택된 워크스페이스 전달 이벤트

onMounted(async () => {
  try {
    const userId = authStore.userId;
    const response = await userService.getWorkSpace(userId);
    console.log("workspace", response.data)
    workspaces.value = response.data.data || []; // 데이터가 없으면 빈 배열
  } catch (error) {
    console.error('워크스페이스 불러오기 실패:', error);
    workspaces.value = []; // 에러 발생 시 빈 배열 유지
  }
});

// 워크스페이스 선택 시 부모 컴포넌트로 이벤트 전달
const selectWorkspace = (workspace) => {
  emit('workspaceSelected', workspace);
};

// 모달 열기
const openAddWorkspaceModal = () => {
  isModalOpen.value = true;
};

// 워크스페이스 추가
const addWorkspace = async () => {
  if (!newWorkspaceName.value.trim()) {
    alert('워크스페이스 이름을 입력해주세요.');
    return;
  }

  try {
    const userId = authStore.userId;
    const response = await workSpaceService.createWorkSpace(userId, newWorkspaceName.value);
    
    workspaces.value.push(response.data.data);
    newWorkspaceName.value = '';
    isModalOpen.value = false;
  } catch (error) {
    alert(error.response?.data?.message || '워크스페이스 추가 실패');
    console.error('워크스페이스 추가 실패:', error);
  }
};
</script>

<style scoped>
.workspace-item {
  cursor: pointer;
}

.text-center {
  text-align: center;
  color: gray;
  font-size: 14px;
}
</style>

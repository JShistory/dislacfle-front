<template>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item-group>
          <v-subheader>채널 목록</v-subheader>
          <template v-if="channels.length > 0">
            <v-list-item
              v-for="channel in channels"
              :key="channel.id"
              @click="selectChannel(channel)"
              class="channel-item"
            >
              <v-list-item-title># {{ channel.channelName }}</v-list-item-title>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item>
              <v-list-item-subtitle class="text-center">등록된 채널이 없습니다.</v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
  
      <v-divider></v-divider>
  
      <v-list>
        <v-list-item>
          <v-btn color="primary" block @click="openAddChannelModal">채널 추가</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  
    <!-- 채널 추가 모달 -->
    <v-dialog v-model="isModalOpen" max-width="400px">
      <v-card>
        <v-card-title>새 채널 추가</v-card-title>
        <v-card-text>
          <v-text-field v-model="newChannelName" label="채널 이름" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="isModalOpen = false">취소</v-btn>
          <v-btn color="primary" @click="addChannel">추가</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { watch, ref, defineProps, defineEmits, onMounted } from 'vue';
  import channelService from '@/services/workspace/workSpaceService';
  import { useAuthStore } from '@/store';
  
  const props = defineProps({
    workspaceId: Number, // 현재 선택된 워크스페이스 ID
  });
  watch(() => props.workspaceId, (newWorkspace) => {
    console.log("🔄 channel 변경됨:", newWorkspace);
  }, { immediate: true });
  const emit = defineEmits(['channel-selected', 'channel-added']);
  const authStore = useAuthStore();
  
  const channels = ref([]);
  const isModalOpen = ref(false);
  const newChannelName = ref('');
  
  // 채널 목록 불러오기
  onMounted(async () => {
    await fetchChannels();
  });
  
  const fetchChannels = async () => {
    try {
      const response = await channelService.getChannel(props.workspaceId);
      channels.value = response.data.data || [];
      console.log("channels", channels)
    } catch (error) {
      console.error('채널 목록 불러오기 실패:', error);
      channels.value = [];
    }
  };
  
  const selectChannel = (channel) => {
    emit('channel-selected', channel);
  };
  
  // 모달 열기
  const openAddChannelModal = () => {
    isModalOpen.value = true;
  };
  
  // 채널 추가 기능 (API 연동)
  const addChannel = async () => {
    if (!newChannelName.value.trim()) {
      alert('채널 이름을 입력해주세요.');
      return;
    }
  
    try {
      const userId = authStore.userId;
      const response = await channelService.createChannel(userId, props.workspaceId, newChannelName.value);
      
      channels.value.push(response.data.data);
      emit('channel-added', response.data.data);
      
      newChannelName.value = '';
      isModalOpen.value = false;
    } catch (error) {
      alert(error.response?.data?.message || '채널 추가 실패');
      console.error('채널 추가 실패:', error);
    }
  };
  </script>
  
  <style scoped>
  .channel-item {
    cursor: pointer;
  }
  
  .text-center {
    text-align: center;
    color: gray;
    font-size: 14px;
  }
  </style>
  
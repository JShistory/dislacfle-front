<template>
    <v-main class="main-content">
      <v-container class="main-container">
        <div v-if="selectedWorkspace">
          <h1>{{ selectedWorkspace.spaceName }} 워크스페이스</h1>
          <p>워크스페이스 ID: {{ selectedWorkspace.id }}</p>
  
          <div v-if="selectedChannel">
            <h2>{{ selectedChannel.channelName }} 채널</h2>
            <p>채널 ID: {{ selectedChannel.id }}</p>
  
            <!-- 채팅 메시지 목록 -->
            <v-card class="chat-box">
              <v-list dense>
                <v-list-item v-for="(message, index) in messages" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>
                      <strong>{{ message.nickname }}</strong>: {{ message.content }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
  
            <!-- 메시지 입력창 -->
            <v-text-field
              v-model="newMessage"
              label="메시지 입력..."
              outlined
              dense
              @keyup.enter="sendMessage"
            ></v-text-field>
  
            <v-btn color="primary" @click="sendMessage">전송</v-btn>
          </div>
          <div v-else>
            <h2>채널을 선택해주세요.</h2>
          </div>
        </div>
        <div v-else>
          <h2>워크스페이스를 선택해주세요.</h2>
        </div>
      </v-container>
    </v-main>
  </template>
  
  <script setup>
  import { defineProps, ref, watch, onUnmounted } from 'vue';
  import { Client } from '@stomp/stompjs';
  import channelService from '@/services/channel/channelService';
  import { useAuthStore } from '@/store';
  
  const props = defineProps({
    selectedWorkspace: Object,
    selectedChannel: Object,
  });
  
  const messages = ref([]);  // 메시지 목록
  const newMessage = ref('');
  const stompClient = ref(null);
  const authStore = useAuthStore();
  
  // 📌 채널 메시지 가져오기
  const fetchMessages = async () => {
    if (!props.selectedChannel) return;
    try {
      const response = await channelService.getMessages(props.selectedChannel.id);
      console.log("response", response)
      messages.value = response.data.data; // ✅ 기존 메시지 추가
    } catch (error) {
      console.error("❌ 메시지 가져오기 실패:", error);
    }
  };
  
  // 📌 WebSocket 연결 함수
  const connectWebSocket = () => {
    if (!props.selectedChannel) return;
  
    fetchMessages(); // ✅ WebSocket 연결 전에 기존 메시지 로드
  
    stompClient.value = new Client({
      brokerURL: 'ws://localhost:8080/ws-stomp',
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`✅ ${props.selectedChannel.channelName} 채널에 WebSocket 연결됨`);
        stompClient.value.subscribe(`/sub/${props.selectedChannel.uuid}`, (message) => {
          messages.value.push(JSON.parse(message.body)); // ✅ 새 메시지 추가
        });
      },
      onDisconnect: () => console.log('❌ WebSocket 연결 해제됨'),
      onStompError: (frame) => console.error('❌ STOMP 오류', frame),
    });
  
    stompClient.value.activate();
  };
  
  // 📌 메시지 전송 함수
  const sendMessage = () => {
    const userId = authStore.userId;
    if (!newMessage.value.trim() || !stompClient.value?.connected || !userId) {
        console.log("오류 발생: 메시지를 보낼 수 없습니다.", { userId });
        return;
    }

  
    const messagePayload = {
      content: newMessage.value,
      userId,
      channelUUID: props.selectedChannel.uuid,
    };
  
    stompClient.value.publish({
      destination: `/pub/${props.selectedChannel.uuid}/message`,
      body: JSON.stringify(messagePayload),
    });
  
    newMessage.value = '';
  };
  
  // 📌 채널 변경 감지 후 WebSocket 및 메시지 로드
  watch(() => props.selectedChannel, (newChannel, oldChannel) => {
    if (oldChannel && stompClient.value) {
      stompClient.value.deactivate(); // 기존 WebSocket 연결 해제
    }
  
    if (newChannel) {
      connectWebSocket(); // ✅ 새 채널 연결 및 메시지 로드
    }
  });
  
  // 📌 컴포넌트 해제 시 WebSocket 정리
  onUnmounted(() => {
    if (stompClient.value) {
      stompClient.value.deactivate();
    }
  });
  </script>
  
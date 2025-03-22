<template>
  <v-app>
    <AppHeader />
    <v-container class="layout">
      <!-- 🔹 왼쪽: 워크스페이스 선택 -->
      <SideMenu @workspaceSelected="handleWorkspaceSelected" />

      <!-- 🔹 왼쪽 사이드바: 채널 목록 -->
      <v-navigation-drawer v-if="selectedWorkspace" app permanent>
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="channel in selectedWorkspace.channels"
              :key="channel.id"
              @click="selectChannel(channel)"
            >
              <v-list-item-title>{{ channel.channelName }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <!-- 🔹 메인 컨텐츠 (채팅 영역) -->
      <v-main class="main-content">
        <v-container class="main-container">
          <div v-if="selectedWorkspace">
            <h1>{{ selectedWorkspace.spaceName }} 워크스페이스</h1>
            <p>워크스페이스 ID: {{ selectedWorkspace.id }}</p>

            <div v-if="selectedChannel">
              <h2>{{ selectedChannel.channelName }} 채널</h2>
              <p>채널 ID: {{ selectedChannel.id }}</p>

              <!-- 🔹 채팅 메시지 목록 -->
              <v-card class="chat-box">
                <v-list dense>
                  <v-list-item v-for="(message, index) in messages" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>
                        <strong>{{ message.sender }}</strong>: {{ message.text }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>

              <!-- 🔹 메시지 입력창 -->
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

      <!-- 🔹 오른쪽 사이드바 (맨 오른쪽) - 워크스페이스 사용자 목록 -->
      <v-navigation-drawer v-if="selectedWorkspace" app permanent right>
        <v-list>
          <v-list-item-group>
            <v-subheader>워크스페이스 멤버</v-subheader>
            <v-list-item v-for="user in selectedWorkspace.users" :key="user.id">
              <v-list-item-title>👤 사용자 {{ user.id }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <!-- 🔹 사용자 초대 버튼 -->
        <v-btn
          color="primary"
          block
          class="invite-button"
          @click="inviteUser"
        >
          사용자 초대하기
        </v-btn>
      </v-navigation-drawer>
      <!-- 🔹 사용자 초대 모달 -->
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
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import SideMenu from '@/components/SideMenu.vue';

const selectedWorkspace = ref(null);
const selectedChannel = ref(null);
const messages = ref([]); // 채팅 메시지 목록
const newMessage = ref('');

// 워크스페이스 선택 시 업데이트
const handleWorkspaceSelected = (workspace) => {
  selectedWorkspace.value = workspace;
  selectedChannel.value = null;
  messages.value = [];
};

// 채널 선택 시 업데이트
const selectChannel = (channel) => {
  selectedChannel.value = channel;
  messages.value = []; // 채팅 초기화 (백엔드 연결 시 기존 메시지 불러오기 가능)
};

// 메시지 전송
const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  messages.value.push({
    sender: '나',
    text: newMessage.value
  });

  newMessage.value = ''; // 입력창 초기화
};
// 🔹 사용자 초대하기 로직
const inviteUser = () => {
  console.log("사용자 초대 로직 실행!");
  alert("사용자 초대 기능이 곧 추가됩니다! 🚀");
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-container {
  padding-top: 64px;
}

.chat-box {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
}

</style>

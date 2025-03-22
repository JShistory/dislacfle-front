<template>
  <v-app>
    <router-view></router-view>

    <AppHeader />
    <v-container class="layout">
      <div v-if="isLoggedIn">
        <SideMenu @workspaceSelected="handleWorkspaceSelected" />
        <ChannelList
          v-if="selectedWorkspace"
          :channels="selectedWorkspace.channels"
          :workspaceId="selectedWorkspace.id"
          @channel-selected="selectChannel"
          @channel-added="addNewChannel"
        />
        <WorkspaceSidebar :workspaceId="selectedWorkspace ? selectedWorkspace.id : 0" @channelSelected="selectChannel" />
        <ChatArea :selectedWorkspace="selectedWorkspace" :selectedChannel="selectedChannel" />
        <WorkspaceUsers :selectedWorkspace="selectedWorkspace" />
      </div>
    </v-container>
  </v-app>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store'; // ✅ authStore 가져오기
import AppHeader from '@/components/AppHeader.vue';
import SideMenu from '@/components/SideMenu.vue';
import WorkspaceSidebar from '@/components/WorkspaceSidebar.vue';
import ChatArea from '@/components/ChatArea.vue';
import ChannelList from '@/components/ChannelList.vue';

const authStore = useAuthStore(); // ✅ 로그인 정보 관리하는 store
const selectedWorkspace = ref(null);
const selectedChannel = ref(null);
const isLoggedIn = computed(() => !!authStore.user); 

const handleWorkspaceSelected = (workspace) => {
  console.log("✅ Workspace Selected:", workspace); // 확인
  selectedWorkspace.value = workspace;
  selectedChannel.value = null;
};


const selectChannel = (channel) => {
  selectedChannel.value = channel;
};

const addNewChannel = (channel) => {
  if (selectedWorkspace.value) {
    selectedWorkspace.value.channels.push(channel);
  }
};
</script>

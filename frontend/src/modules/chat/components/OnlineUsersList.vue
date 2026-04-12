<template>
  <q-card flat bordered class="fit column">
    <q-card-section class="q-px-md q-py-sm">
      <div class="text-subtitle2 text-weight-bold">Online</div>
      <div class="text-caption text-grey-7">Currently connected participants</div>
    </q-card-section>

    <q-separator />

    <q-list class="col overflow-auto">
      <q-item v-for="user in props.onlineUsers" :key="user.userId">
        <q-item-section avatar>
          <q-avatar size="40px">
            <img :src="user.avatar" :alt="user.username" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.username }}</q-item-label>
          <q-item-label caption>Online now</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge rounded color="positive" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { UiUser } from '../types/uiUser';

const props = defineProps({
  onlineUsers: {
    type: Array as PropType<UiUser[]>,
    required: true,
  },
});
</script>

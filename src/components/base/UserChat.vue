<template>
  <v-form v-click-outside="closeChat" class="chat" :class="{ chat_mobile: isMobile }">
    <div class="chat-box">
      <div class="chat__title">
        <span>Чат с поддержкой</span>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </div>

      <div ref="chatBoxRef" class="chat-messages">
        <template v-if="chatStore.isLoading && !chatStore.messages.length">
          <div class="chat-spinner">
            <v-progress-circular indeterminate color="rgba(169, 55, 244, 1)" size="40" />
          </div>
        </template>

        <template v-else-if="chatStore.filteredMessages.length">
          <transition-group name="fade-slide">
            <div
              v-for="msg in chatStore.filteredMessages"
              :key="chatStore.getMessageKey(msg)"
              class="chat-messages-item"
              :class="{
                'chat-messages-item_your': msg.is_your,
                'chat-messages-item_unread': !msg.is_your && !msg.is_read
              }"
            >
              <div class="chat-messages-item__role">{{ msg?.user?.name ?? '' }}</div>
              <div class="chat-messages-item__msg">{{ msg.content }}</div>
              <div class="chat-messages-item__time">{{ chatStore.getTime(msg.created_at) }}</div>
            </div>
          </transition-group>
        </template>

        <h3 v-else class="chat-messages__empty">Пока нет сообщений</h3>
      </div>
    </div>

    <v-form ref="formRef" class="chat__actions" @submit.prevent>
      <VCustomInput
        v-model.trim="newMessage"
        autofocus
        label="Введите текст"
        class="mr-1"
        :rules="[requiredRules.maxLength]"
        @input="removeEmoji"
        @keyup.enter="sendMessage"
      />
      <SvgIcon class="chat__actions-send" name="send" @click="sendMessage" />
    </v-form>
  </v-form>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import VCustomInput from '@/components/base/VCustomInput.vue'
import { useDeviceDetection } from '@/composables/useDeviceDetection'
import { useChatSocketStore } from '@/stores/ChatSocket'
import { useChatStore } from '@/stores/UserChat.ts'
import { useUserInfo } from '@/stores/UserInfo'
import { throttle } from '@/utils/optimize'
import { requiredRules } from '@/utils/validators.ts'

defineProps<{ showChat: boolean }>()
const emit = defineEmits(['update:showChat'])

const chatStore = useChatStore()
const chatSocket = useChatSocketStore()
const userInfoStore = useUserInfo()
const { isMobile } = useDeviceDetection()
const formRef = ref(null)

const chatBoxRef = ref<HTMLElement | null>(null)
const newMessage = ref('')
let scrollListenerAttached = false
let initialScrollDone = false

const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTo({
        top: chatBoxRef.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  const isValid = await formRef?.value?.validate()
  if (isValid.valid) {
    await chatStore.sendMessage(newMessage.value)
    newMessage.value = ''
    scrollToBottom()
  }
}

const removeEmoji = (e) => {
  const cleaned = e.target.value.replace(/[^a-zA-Zа-яА-Я0-9\s.,!?'"()\-:;@]/g, '')
  newMessage.value = cleaned
}

const onScroll = throttle(() => {
  if (!chatBoxRef.value) return
  if (chatStore.isLoading || !chatStore.hasMore) return
  if (!initialScrollDone) {
    initialScrollDone = true
    return
  }

  if (chatBoxRef.value.scrollTop <= 50) {
    const el = chatBoxRef.value
    const distanceFromBottom = el.scrollHeight - el.scrollTop
    chatStore.getMessages(true).then(() => {
      nextTick(() => {
        el.scrollTop = el.scrollHeight - distanceFromBottom
      })
    })
  }
}, 500)

const closeChat = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('update:showChat', false)
}
const close = () => emit('update:showChat', false)

watch(
  () => chatStore.filteredMessages.length,
  () => {
    scrollToBottom()
  }
)

// скроллим и отмечаем как прочитанные при открытии
watch(
  () => userInfoStore.showChat,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      await chatStore.markAllAsRead()
      scrollToBottom()
      if (!scrollListenerAttached && chatBoxRef.value) {
        chatBoxRef.value.addEventListener('scroll', onScroll)
        scrollListenerAttached = true
      }
    }
  }
)

watch(
  () => chatSocket.messages,
  (newMessages) => {
    const last = newMessages[newMessages.length - 1]
    if (last) chatStore.handleIncomingMessage(last)
  },
  { deep: true }
)

onMounted(async () => {
  chatSocket.connect()
  await chatStore.initializeChat()
  document.addEventListener('keydown', closeChat)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', closeChat)
  if (chatBoxRef.value) chatBoxRef.value.removeEventListener('scroll', onScroll)
  if (chatStore.roomId) chatSocket.unsubscribeChannel(`chat.${chatStore.roomId}`)
  chatStore.resetDateFrom()
})
</script>

<style scoped lang="scss">
.chat {
  bottom: 87px;
  right: 24px;
  position: fixed;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  width: 432px;
  border-radius: 16px;
  z-index: 9999;

  &_mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 90vh;
  }

  &__title {
    font-weight: 500;
    font-size: 18px;
  }

  &-messages {
    &-item {
      max-width: 350px;
    }
  }
}
</style>

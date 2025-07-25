<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { getChatQuery, sendMessageQuery, getMessagesQuery } from '@/api/chat.ts'
import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import VCustomInput from '@/components/base/VCustomInput.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'
import { useChatSocketStore } from '@/stores/chatSocket'

defineProps({ showChat: Boolean })
const emit = defineEmits(['update:showChat'])

const chatStore = useChatSocketStore()
const { isMobile } = useDeviceDetection()

const roomId = ref<number | null>(null)
const newMessage = ref('')
const userMessages = ref<any[]>([])
const chatBoxRef = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    chatBoxRef.value?.scrollTo(0, chatBoxRef.value.scrollHeight)
  })
}

const getTime = (time: string) => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function sendMessage() {
  if (!newMessage.value.trim() || !roomId.value) return
  // chatStore.sendMessage(`chat.${roomId.value}`, 'new-message', {
  //   text: newMessage.value,
  //   sent_by: 'User'
  // })
  userMessages.value.push({
    content: newMessage.value,
    created_at: new Date().toISOString(),
    is_your: true
  })
  sendMessageRest()
}

const getMessages = async () => {
  try {
    const { data } = await getMessagesQuery(roomId.value)
    if (data.code === 200) {
      userMessages.value = data.data.messages ?? []
    }
  } catch (error) {
    console.log(error)
  }
}

const sendMessageRest = async () => {
  if (!newMessage.value.trim()) return
  try {
    const newData = {
      chatRoomId: roomId.value,
      message: newMessage.value
    }
    await sendMessageQuery(newData)
    newMessage.value = ''
    // await getMessages()
    scrollToBottom()
  } catch (err) {
    console.log(err)
  }
}

const closeChat = (event: MouseEvent | KeyboardEvent) => {
  if (event.type === 'click' || (event as KeyboardEvent).key === 'Escape') {
    emit('update:showChat', false)
  }
}

onMounted(async () => {
  const wsUrl = 'ws://localhost:8080/app/mthueomipj7f2dhac0g1?protocol=7&client=js&version=4.4.0'

  chatStore.connect(wsUrl)

  const { data } = await getChatQuery()
  if (data.code === 200) {
    roomId.value = data.data.chat_room_id
    userMessages.value = data.data.messages ?? []

    const channel = `chat.${roomId.value}`
    chatStore.subscribeChannel(channel)
    await getMessages()
    scrollToBottom()
  }

  document.addEventListener('keydown', closeChat)
})

watch(
  () => chatStore.messages[chatStore.messages.length - 1],
  (msg) => {
    if (!msg || msg.channel !== `chat.${roomId.value}` || msg.event !== 'MessageSent') return

    const parsed = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
    console.warn('parsed', parsed)
    if (parsed.senderId === 2) return

    userMessages.value.push({
      content: parsed.content,
      created_at: parsed.timestamp,
      is_your: false
    })
    scrollToBottom()
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', closeChat)
})
</script>

<template>
  <div v-click-outside="closeChat" class="chat" :class="{ chat_mobile: isMobile }">
    <div class="chat-box">
      <div class="chat__title">
        <span>Чат с поддержкой</span>
        <v-btn icon="mdi-close" variant="text" @click="closeChat" />
      </div>
      <div v-if="userMessages.length" ref="chatBoxRef" class="chat-messages">
        <div
          v-for="msg in userMessages"
          :key="msg.id"
          class="chat-messages-item"
          :class="{ 'chat-messages-item_your': msg.is_your }"
        >
          <div class="chat-messages-item__role">
            {{ msg.is_your ? 'Вы' : 'Поддержка' }}
          </div>
          <div class="chat-messages-item__msg">{{ msg.content }}</div>
          <div class="chat-messages-item__time">{{ getTime(msg.created_at) }}</div>
        </div>
      </div>
      <h3 v-else class="chat-messages">Пока нет сообщений</h3>
    </div>
    <div class="chat__actions">
      <VCustomInput
        v-model="newMessage"
        :hideDetails="true"
        autofocus
        label="Введите текст"
        class="mr-1"
        @keyup.enter="sendMessage"
      />
      <SvgIcon class="chat__actions-send" name="send" @click="sendMessage" />
    </div>
  </div>
</template>

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

  &__actions {
    display: flex;
    align-items: center;
    padding: 20px;

    &-send {
      cursor: pointer;
      transition: opacity 0.15s ease-in;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  &__title {
    display: flex;
    justify-content: space-between;
    height: 64px;
    border-bottom: 1px solid rgba(229, 236, 253, 1);
    align-items: center;
    padding: 0 20px;
    color: rgba(17, 17, 17, 1);
    font-weight: 500;
    font-size: 18px;
    font-weight: 400;
  }

  &-messages {
    max-height: 450px;
    min-height: 450px;
    overflow-y: scroll;
    padding: 20px;
    display: flex;
    flex-direction: column;

    &-item {
      max-width: 350px;
      width: 100%;
      background: rgba(179, 246, 255, 1);
      padding: 16px;
      border-radius: 16px;
      border-top-left-radius: 4px;
      border-top-right-radius: 16px;
      position: relative;

      &:first-child {
        margin-top: 10px;
      }

      &__msg {
        color: rgba(17, 17, 17, 1);
        font-size: 14px;
        line-height: 140%;
        margin-bottom: 10px;
        font-weight: 400;
      }

      &__role {
        color: rgba(0, 0, 0, 1);
        font-weight: 500;
        font-size: 12px;
        font-weight: 400;
        position: absolute;
        left: 0;
        top: -22px;
      }

      &__time {
        font-weight: 500;
        font-size: 12px;
        color: rgba(143, 150, 165, 1);
        text-align: right;
      }

      &_your {
        background: rgba(34, 93, 255, 1);
        align-self: flex-end;
        border-top-right-radius: 4px;
        border-top-left-radius: 16px;

        .chat-messages-item__msg {
          color: rgba(255, 255, 255, 1);
        }

        .chat-messages-item__time {
          color: rgba(211, 219, 237, 1);
          text-align: left;
        }

        .chat-messages-item__role {
          left: auto;
          right: 0;
        }
      }

      & + .chat-messages-item {
        margin-top: 40px;
      }
    }
  }
}
</style>

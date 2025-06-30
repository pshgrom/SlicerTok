<template>
  <v-dialog v-model="dialogModel" max-width="600px">
    <v-card>
      <v-card-title>Детали видео</v-card-title>
      <!--  <v-card-text>-->
      <!--    <v-list>-->
      <!--      <v-list-item>-->
      <!--        <v-list-item-title><strong>ID:</strong> {{ selectedItem.id }}</v-list-item-title>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item>-->
      <!--        <v-list-item-title><strong>Identifier:</strong> {{ selectedItem.identifier }}</v-list-item-title>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item>-->
      <!--        <v-list-item-title><strong>Key:</strong> {{ selectedItem.key }}</v-list-item-title>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item>-->
      <!--        <v-list-item-title><strong>Resource:</strong> {{ selectedItem.resource }}</v-list-item-title>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item>-->
      <!--        <v-list-item-title><strong>Status:</strong> {{ selectedItem.status }}</v-list-item-title>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item>-->
      <!--        <v-list-item-title><strong>Комментарий:</strong> {{ selectedItem.status_comment }}</v-list-item-title>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item>-->
      <!--        <v-list-item-title>-->
      <!--          <strong>URL:</strong>-->
      <!--          <a :href="selectedItem.url" target="_blank">{{ formatUrl(selectedItem.url) }}</a>-->
      <!--        </v-list-item-title>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item>-->
      <!--        <v-list-item-title>-->
      <!--          <strong>Video Stat Link:</strong>-->
      <!--          <a :href="selectedItem.video_stat_link" target="_blank">{{ formatUrl(selectedItem.video_stat_link) }}</a>-->
      <!--        </v-list-item-title>-->
      <!--      </v-list-item>-->
      <!--    </v-list>-->
      <!--  </v-card-text>-->

      <!--  <v-card-actions>-->
      <!--    <v-spacer />-->
      <!--    <v-btn text @click="isModalOpen = false">Закрыть</v-btn>-->
      <!--  </v-card-actions>-->
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  selectedItem: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue'])

const dialogModel = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped lang="scss"></style>

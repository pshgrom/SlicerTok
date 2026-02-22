<template>
  <transition name="fade" mode="out-in">
    <SupportChat />
  </transition>
</template>

<script setup lang="ts">
import { SupportChat } from '@/widgets/support-chat'
</script>

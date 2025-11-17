<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">ID: {{ idItemHistory }}. Повторная подача</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <template v-for="item in itemHistory" :key="item">
          <div class="old-history">
            <div class="old-history__top">
              <div class="old-history-item w-50">
                <div class="old-history-item__title">Коэффициент:</div>
                <div class="old-history-item__value">
                  {{ item.coefficient?.rate ?? '-' }}
                </div>
              </div>
              <div class="old-history-item w-50">
                <div class="old-history-item__title">Кол-во просмотров:</div>
                <div class="old-history-item__value">
                  {{ formatNumber(item.number_views_moderation) ?? '-' }}
                </div>
              </div>
            </div>
            <div class="old-history__top">
              <div class="old-history-item w-50">
                <div class="old-history-item__title">Статус:</div>
                <div class="old-history-item__value">
                  <div
                    v-if="item.status"
                    class="custom-table-chip"
                    :style="{
                      'background-color': getStatusColor(item.status),
                      color: getColor(item.status)
                    }"
                  >
                    <div class="custom-table-chip__icon">
                      <SvgIcon :name="getIcon(item.status)" />
                    </div>
                    <div class="custom-table-chip__status">
                      {{ getTextStatus(item.status) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="old-history-item w-50">
                <div class="old-history-item__title">Причины:</div>
                <div class="old-history-item__value">
                  <v-menu
                    v-if="item.rules?.length"
                    location="bottom"
                    open-on-hover
                    :close-on-content-click="false"
                    offset="4"
                  >
                    <template #activator="{ props: menuProps }">
                      <SvgIcon v-bind="menuProps" name="eye" @click.stop />
                    </template>
                    <div class="tooltip-content" v-html="showViolations(item.rules)"></div>
                  </v-menu>
                  <div v-else>-</div>
                </div>
              </div>
            </div>
            <div class="old-history-item mb-1">
              <div class="old-history-item__title">Комментарий:</div>
              <div class="old-history-item__value">
                {{ item.status_comment ?? '-' }}
              </div>
            </div>
            <v-divider class="mt-5" />
          </div>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <VCusomButton :custom-class="['light', 'avg']" @click="closeModal"> Закрыть </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import { formatNumber } from '@/utils/formatNumbers.ts'
import { getColor, getIcon, getStatusColor, getTextStatus } from '@/utils/socials.ts'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  itemHistory: {
    type: Object,
    default: () => ({})
  },
  idItemHistory: {
    type: [String, Number],
    default: 0
  }
})
const emit = defineEmits(['update:modelValue', 'save'])

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const closeModal = () => {
  dialog.value = false
}

type Violation = { name_reverse: string }
const showViolations = (rules: Violation[]) => {
  return rules.map((el, index) => `${index + 1}. ${el.name_reverse}`).join('<br>') || '-'
}
</script>

<style lang="scss" scoped>
.old-history {
  display: flex;
  flex-direction: column;
  width: 100%;

  &:last-child {
    .v-divider {
      display: none;
    }
  }

  & + .old-history {
    margin-top: 20px;
  }

  &__top {
    display: flex;
    width: 100%;
    gap: 4px;
    margin-bottom: 4px;
  }

  &-item {
    background: rgba(242, 246, 254, 1);
    border-radius: 16px;
    padding: 12px;

    &__title {
      color: rgba(143, 150, 165, 1);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0;
      margin-bottom: 6px;
    }

    &__value {
      font-size: 14px;
    }
  }
}

:deep(.v-card-title) {
  padding-bottom: 0 !important;
  position: sticky;
  top: 0;
  background: #fff !important;
  z-index: 1;
}

:deep(.v-card-text) {
  max-height: 450px;
  min-height: 450px;
  overflow-y: scroll;
}
</style>

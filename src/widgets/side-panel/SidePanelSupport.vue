<template>
  <v-card class="side-panel">
    <v-card-title>
      <div>
        <v-btn icon size="small" variant="text" :disabled="isFirst" @click="$emit('prev')">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" :disabled="isLast" @click="$emit('next')">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </div>
      <span class="headline"># {{ currentItem.id }}</span>
      <v-btn icon="mdi-close" variant="text" @click="activePanelVal = false" />
    </v-card-title>
    <v-card-text>
      <div v-if="currentItem.is_bonus" class="bonus-video">
        <div class="bonus-video__img">
          <SvgIcon name="gift" />
        </div>
        <div class="bonus-video__text">Бонусное видео</div>
      </div>
      <v-card class="user-card" flat>
        <v-row class="user-card__row" align="center" no-gutters>
          <v-avatar class="user-card__avatar" size="50">
            <img src="@/shared/assets/images/avatar.png" alt="аватарка" />
          </v-avatar>
          <v-col class="user-card__info">
            <div class="user-card__name">{{ userName }}</div>

            <div class="user-card__status">
              <div class="user-card__stat user-card__stat--success">
                <SvgIcon name="video-approved" />
                <span>{{ videoApprover }}</span>
              </div>

              <div class="user-card__stat user-card__stat--time">
                <SvgIcon name="time" />
                <span>{{ videoModeration }}</span>
              </div>

              <div class="user-card__stat user-card__stat--error">
                <SvgIcon name="video-declined" />
                <span>{{ videoRejected }}</span>
              </div>
            </div>
          </v-col>
          <v-col class="user-card__actions" cols="auto">
            <VCusomButton :custom-class="['light', 'avg', 'with-icon']" @click="goToChat">
              <SvgIcon name="message-circle" />
              Чат
            </VCusomButton>
            <VCusomButton :custom-class="['light', 'avg', 'only-icon']" @click="goToUser">
              <SvgIcon name="arrow-right" />
            </VCusomButton>
          </v-col>
        </v-row>
      </v-card>
      <v-form ref="formRef">
        <v-row no-gutters class="custom-modal__row flex-nowrap">
          <template
            v-for="(group, groupName) in currentItem.status_moderation_admins"
            :key="groupName"
          >
            <v-col
              v-if="
                groupName.toString() === 'group_a_current' ||
                groupName.toString() === 'group_b_current'
              "
              style="margin: 0 2px"
            >
              <v-card
                class="info-admin info-admin_dialog"
                variant="outlined"
                rounded
                style="border: none !important; border-radius: 16px"
              >
                <div class="info-admin__title">{{ formatLabel(groupName) }}</div>
                <div class="info-admin-comment d-flex">
                  <div
                    v-if="group.status"
                    class="custom-table-chip mr-1"
                    :style="{
                      'background-color': getStatusColor(group.status),
                      color: getColor(group.status)
                    }"
                  >
                    <div class="custom-table-chip__icon">
                      <SvgIcon :name="getIcon(group.status)" />
                    </div>
                    <div class="custom-table-chip__status">
                      {{ getTextStatus(group.status) }}
                    </div>
                  </div>
                  <v-menu
                    v-if="group.rules?.length"
                    location="bottom"
                    open-on-hover
                    :close-on-content-click="false"
                    offset="4"
                  >
                    <template #activator="{ props: menuProps }">
                      <SvgIcon
                        v-bind="menuProps"
                        :class="{
                          icon_light: themeStore.current !== 'dark'
                        }"
                        name="show"
                        @click.stop
                      />
                    </template>
                    <div
                      class="tooltip-content"
                      v-html="sanitizeHtml(showViolations(group.rules))"
                    ></div>
                  </v-menu>
                </div>
                <div class="info-admin-comment">
                  <div class="info-admin-comment__label">Просмотры:</div>
                  <div class="info-admin-comment__value">
                    {{ formatNumber(group?.number_views_moderation) || '-' }}
                  </div>
                </div>
                <div class="info-admin-comment">
                  <div class="info-admin-comment__label">Коэффициент:</div>
                  <div class="info-admin-comment__value">
                    {{ group.coefficient?.rate || '-' }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </template>
        </v-row>

        <div v-if="showActions" class="info-admin__title info-admin__title_offset">
          Итоговые значения
        </div>
        <VCustomSelect
          v-if="!sameStatuses"
          v-model="currentStatus"
          :rules="[videoRules.required]"
          :items="allStatuses"
          class="mb-6"
          :label="'Статус'"
        >
          <template #item="{ item, props: slotProps }">
            <v-list-item v-bind="slotProps">
              {{ item.text }}
            </v-list-item>
          </template>
        </VCustomSelect>
        <ViewsSelectField
          v-if="!sameViews"
          v-model="currentNumberViews"
          label="Количество просмотров по факту"
          :rules="[videoRules.quantityViews, videoRules.required, videoRules.quantityViewsMin]"
        />
        <VCustomSelect
          v-if="!sameCoeffs"
          v-model="currentCoefficient"
          :rules="[videoRules.required]"
          label="Коэффициенты"
          class="mb-4"
          :items="coeffs"
        >
          <template #item="{ item, props: slotProps }">
            <v-list-item v-bind="slotProps">
              {{ item.text }}
            </v-list-item>
          </template>
        </VCustomSelect>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <div>
        <VCusomButton :custom-class="['light', 'avg']" class="mr-2" @click="closeDialog">
          Отмена
        </VCusomButton>
        <VCusomButton v-if="showActions" :custom-class="['dark', 'avg']" @click="change">
          Сохранить
        </VCusomButton>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useThemeStore } from '@/app/stores'
import { useAdminInfo } from '@/entities/admin'
import { useSupportUsers } from '@/entities/support'
import {
  formatLabel,
  formatNumber,
  getColor,
  getIcon,
  getStatusColor,
  getTextStatus,
  sanitizeHtml,
  videoRules
} from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import VCustomSelect from '@/shared/ui/VCustomSelect.vue'
import ViewsSelectField from '@/shared/ui/ViewsSelectField.vue'

import { useSidePanelDrawer } from './composables/useSidePanelDrawer'

const props = defineProps({
  isFirst: {
    type: Boolean,
    default: false
  },
  activePanel: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  },
  currentItem: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'update:activePanel',
  'changeFinalValues',
  'update:currentItem',
  'prev',
  'next'
])

const { activePanelVal, currentItem, formRef, closeDialog, validateAndScroll } = useSidePanelDrawer(
  props,
  emit
)

const supportUsersStore = useSupportUsers()
const themeStore = useThemeStore()
const router = useRouter()
const adminInfo = useAdminInfo()

const allStatuses = [
  { label: 'Одобрено', value: 'approved' },
  { label: 'Отклонено', value: 'rejected' }
]

const currentStatus = computed({
  get: () => currentItem.value?.status_moderation_support?.current?.status || '',
  set: (val) => (currentItem.value.status_moderation_support.current.status = val)
})

const currentNumberViews = computed({
  get: () => currentItem.value?.status_moderation_support?.current?.number_views_moderation || '',
  set: (val) => (currentItem.value.status_moderation_support.current.number_views_moderation = val)
})

const currentCoefficient = computed({
  get: () => {
    return (
      currentItem.value?.status_moderation_support?.current?.coefficient?.id ||
      currentItem.value?.status_moderation_support?.current?.coefficient ||
      ''
    )
  },
  set: (val) => (currentItem.value.status_moderation_support.current.coefficient = val)
})

const coeffs = computed(() => adminInfo.coeffs ?? [])
const showActions = computed(() => !sameViews.value || !sameCoeffs.value || !sameStatuses.value)

const sameStatuses = computed(() => {
  if (Object.keys(currentItem.value).length) {
    const values = Object.keys(currentItem.value?.status_moderation_admins)
      .filter((key) => key === 'group_a_current' || key === 'group_b_current')
      .map((item) => currentItem.value.status_moderation_admins[item].status)

    const firstValue = values[0]
    const allEqual = values.every((value) => value === firstValue)
    const twoNa = values.filter((v) => v === 'na').length === 2

    if (twoNa) return false

    return allEqual
  }
  return false
})

const sameViews = computed(() => {
  if (Object.keys(currentItem.value).length) {
    const values = Object.keys(currentItem.value.status_moderation_admins)
      .filter((key) => key === 'group_a_current' || key === 'group_b_current')
      .map((item) => currentItem.value.status_moderation_admins[item].number_views_moderation)
    const firstValue = values[0]
    return values.every((value) => value === firstValue)
  }
  return false
})

const sameCoeffs = computed(() => {
  if (Object.keys(currentItem.value).length) {
    const values = Object.keys(currentItem.value.status_moderation_admins)
      .filter((key) => key === 'group_a_current' || key === 'group_b_current')
      .map((item) => currentItem.value.status_moderation_admins[item].coefficient?.rate)
    const firstValue = values[0]
    return values.every((value) => {
      if (value === undefined && firstValue === undefined) return false
      return value === firstValue
    })
  }
  return false
})

const cleanNumber = (str: string) => str.replace(/\D/g, '')

const change = async () => {
  const isValid = await validateAndScroll()
  if (!isValid) return
  const { status } = currentItem.value?.status_moderation_support?.current ?? {}
  const data = {
    id: props.currentItem.id,
    status: !sameStatuses.value ? status : undefined,
    coefficient_id: !sameCoeffs.value ? currentCoefficient.value : undefined,
    number_views_moderation: !sameViews.value ? cleanNumber(currentNumberViews.value) : undefined
  }
  emit('changeFinalValues', data)
  closeDialog()
}

const videoApprover = computed(
  () => props.currentItem.slicer?.user_approved_publications_count ?? 0
)

const videoModeration = computed(
  () => props.currentItem.slicer?.user_moderation_publications_count ?? 0
)

const userName = computed(() => props.currentItem.slicer?.name ?? '-')
const userId = computed(() => props.currentItem.slicer?.id)

const videoRejected = computed(
  () => props.currentItem.slicer?.user_rejected_publications_count ?? 0
)

const showViolations = (rules: any) => {
  const taskRules = props.currentItem?.task?.rules
  return taskRules
    .filter((tr) => rules.includes(tr.key))
    .map((tr) => tr.name_reverse)
    .map((name, index) => `${index + 1}. ${name}`)
    .join('<br>')
}

const goToChat = async () => {
  const resp = await supportUsersStore.getChatByUser(userId.value)
  const { chat_room_id } = resp
  if (chat_room_id) await router.push({ name: 'SupportChat', params: { id: chat_room_id } })
}

const goToUser = async () => {
  await router.push({ name: 'User', params: { id: userId.value } })
}
</script>

<style scoped lang="scss">
.user-card {
  background: rgb(var(--v-theme-chipBg));
  padding: 16px;
  height: 82px;
  margin-bottom: 4px;
  border-radius: 16px;
}

.user-card__row {
  display: flex;
  align-items: center;
}

.user-card__avatar {
  margin-right: 15px;
}

.user-card__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-card__name {
  font-size: 14px;
  margin-bottom: 8px;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0;
}

.user-card__status {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-card__stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}

.user-card__stat--success {
  color: #2e7d32;
}

.user-card__stat--time {
  color: #888;
}

.user-card__stat--error {
  color: #888;
}

.user-card__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.custom-modal {
  &__row {
    margin-bottom: 32px;
    overflow-x: auto;
    white-space: nowrap;
    justify-content: space-around;
  }
}

.info-admin {
  padding: 12px 12px 12px 0;

  &__wrap {
    display: flex;
  }

  &__title {
    font-weight: 500;
    font-size: 14px;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 12px;
    letter-spacing: 0;

    &_offset {
      margin-bottom: 25px;
    }
  }

  &-comment {
    margin-top: 10px;

    &__label {
      color: rgba(143, 150, 165, 1);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0;
      margin-bottom: 5px;
    }
    &__value {
      color: rgb(var(--v-theme-primary));
      font-size: 14px;
      line-height: 140%;
    }
  }

  &_dialog {
    background: rgb(var(--v-theme-chipBg));
    padding: 16px;
  }
}

.bonus-video {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-chipBg));
  border-radius: 16px;
  margin-bottom: 4px;

  &__img {
    margin-right: 10px;
  }

  &__text {
    color: rgba(169, 55, 244, 1);
    font-size: 12px;
    letter-spacing: 0;
    position: relative;
    top: 1px;
  }
}
</style>

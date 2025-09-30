<template>
  <v-container
    class="d-flex justify-center align-center auth-container"
    fill-height
    style="height: 100vh"
  >
    <v-card class="pa-6 login-view" max-width="400" min-width="400">
      <SvgIcon class="login-view__logo" name="logo" />

      <h3 class="login-view__title">
        {{ stepTitle }}
      </h3>

      <p class="login-view__description">
        {{ stepDescription }}
      </p>

      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <div class="login-view__content">
          <template v-if="isPhoneStep">
            <div class="d-flex flex-column">
              <!--              <VCustomSelect-->
              <!--                v-model="currentCountryCode"-->
              <!--                label="Код страны"-->
              <!--                :items="countryCodes"-->
              <!--                style="min-width: 120px; max-width: 120px"-->
              <!--                class="mr-2"-->
              <!--                item-title="label"-->
              <!--                item-value="value"-->
              <!--                searchable-->
              <!--              >-->
              <!--                <template #prepend-item>-->
              <!--                  <v-text-field-->
              <!--                    v-model="search"-->
              <!--                    placeholder="Поиск..."-->
              <!--                    density="compact"-->
              <!--                    clearable-->
              <!--                    class="ma-2"-->
              <!--                    hide-details-->
              <!--                  />-->
              <!--                  <v-divider />-->
              <!--                </template>-->
              <!--                <template #item="{ item, props }">-->
              <!--                  <v-list-item v-bind="props">-->
              <!--                    {{ item.text }}-->
              <!--                  </v-list-item>-->
              <!--                </template>-->
              <!--              </VCustomSelect>-->
              <v-autocomplete
                v-model="currentCountryCode"
                label="Код страны"
                :items="countryCodes"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="comfortable"
                class="custom-autocomplete"
                clearable
                hide-details
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    {{ item.raw.text }}
                  </v-list-item>
                </template>
              </v-autocomplete>
              <VCustomInput
                :key="currentCountryCode"
                v-model="phone"
                label="Номер телефона"
                autofocus
                :placeholder="placeholderPhone"
                :rules="phoneRulesWithRequired"
                required
              />
              <!--              v-mask="currentMask"-->
            </div>
          </template>

          <template v-else>
            <VCustomInput
              v-model="code"
              label="Код подтверждения"
              placeholder="123456"
              class="mb-4"
              autofocus
              :rules="[codeValidationRule]"
              required
            />
            <VCustomInput
              v-if="isGoogle2faEnabled"
              v-model="googleCodeAuth"
              label="Гугл код"
              placeholder="123456"
              :rules="[codeValidationRule]"
              required
            />
          </template>
        </div>

        <div class="login-view__actions">
          <VCusomButton
            v-if="!isPhoneStep"
            class="mr-1"
            :custom-class="['light', 'avg']"
            @click="handleBack"
          >
            Назад
          </VCusomButton>
          <VCusomButton type="submit" :custom-class="['dark', 'avg']" :loading="isLoading">
            {{ submitButtonText }}
          </VCusomButton>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import type { IAuthByPhone, IAuthConfirmation } from '@/interfaces/Auth'
import { useAuth } from '@/stores/Auth'
import { useError } from '@/stores/Errors'
import { cleanPhoneNumber } from '@/utils/formatNumbers'
import { infoRules, requiredRules } from '@/utils/validators.ts'

const PHONE_STEP = 1
const CODE_STEP = 2
const CODE_LENGTH = 6

const step = ref(PHONE_STEP)
const formRef = ref<HTMLFormElement | null>(null)
const code = ref('')
const googleCodeAuth = ref('')
const isLoading = ref(false)
const isGoogle2faEnabled = ref(false)

const authStore = useAuth()
const errorStore = useError()
const router = useRouter()
const search = ref('')
console.warn('authStore.countryCodes1', authStore.countryCodes)
const countryCodes = computed(() => authStore.countryCodes ?? [])
const currentCountryCode = computed({
  get: () => authStore.currentCountryCode ?? 1,
  set: (value) => {
    authStore.currentCountryCode = value
  }
})

const phone = computed({
  get: () => authStore.phone,
  set: (value) => authStore.setPhone(value)
})

const isPhoneStep = computed(() => step.value === PHONE_STEP)

const stepTitle = computed(() =>
  isPhoneStep.value ? 'Вход по номеру телефона' : 'Подтвердите код'
)

const stepDescription = computed(() => {
  if (isPhoneStep.value) {
    return 'Введите свой номер телефона, который привязан к Telegram и мы вышлем вам код для входа.'
  }
  return `Мы выслали вам код на указанный вами номер: ${phone.value}`
})

const submitButtonText = computed(() => (isPhoneStep.value ? 'Отправить код' : 'Подтвердить'))

// const phoneRulesWithRequired = computed(() => [...phoneRules.value, requiredRules.required])
const phoneRulesWithRequired = computed(() => [requiredRules.required, infoRules.phone])

const codeValidationRule = (value: string) => {
  return value.length === CODE_LENGTH || 'Код должен быть из 6 цифр'
}

const currentCountry = computed(
  () => countryCodes.value.find((c) => c.value === currentCountryCode.value) || null
)

// const currentMask = computed(() => {
//   if (!currentCountry.value) return ''
//   return currentCountry.value.placeholder.replace(/0/g, '#')
// })

const placeholderPhone = computed(() => currentCountry.value?.placeholder || '')

// const phoneRules = computed(() => {
//   if (!currentCountry.value) return []
//
//   const requiredLength = (currentCountry.value.placeholder.match(/0/g) || []).length
//   const onlyDigits = phone.value.replace(/\D/g, '')
//
//   return [() => onlyDigits.length === requiredLength || `Введите ${requiredLength} цифр`]
// })

const handleBack = () => {
  step.value = PHONE_STEP
  code.value = ''
  googleCodeAuth.value = ''
}

const handlePhoneSubmit = async () => {
  try {
    const dataQuery: IAuthByPhone = {
      country_calling_codes_id: Number(currentCountryCode.value),
      phone: cleanPhoneNumber(phone.value)
    }

    isLoading.value = true
    const { data } = await authStore.loginByPhone(dataQuery)

    isGoogle2faEnabled.value = Boolean(data?.data?.is_enable_google2fa)
    errorStore.setErrors(data?.message, 'success')

    if (data.status === 'Success') {
      step.value = CODE_STEP
    }
  } catch (error: any) {
    errorStore.setErrors(error)
  } finally {
    isLoading.value = false
  }
}

const handleCodeSubmit = async () => {
  try {
    const dataQuery: IAuthConfirmation = {
      country_calling_codes_id: Number(currentCountryCode.value),
      phone: cleanPhoneNumber(phone.value),
      key: code.value,
      google2fa_key: isGoogle2faEnabled.value ? Number(googleCodeAuth.value) : undefined
    }

    isLoading.value = true
    const { data } = await authStore.loginConfirmation(dataQuery)

    errorStore.setErrors(data?.message, 'success')

    const { token: tokenValue, role } = data?.data ?? {}
    if (tokenValue && role?.length) {
      await handleSuccessfulLogin(tokenValue, role[0])
    }
  } catch (error: any) {
    errorStore.setErrors(error)
  } finally {
    isLoading.value = false
  }
}

const handleSuccessfulLogin = async (tokenValue: string, userRole: number) => {
  localStorage.setItem('authToken', tokenValue)
  authStore.token = tokenValue
  authStore.role = userRole
  localStorage.setItem('role', userRole.toString())

  await router.push({ name: 'UserInfo' })
}

const handleSubmit = async () => {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  if (isPhoneStep.value) {
    await handlePhoneSubmit()
  } else {
    await handleCodeSubmit()
  }
}

watch(
  () => currentCountryCode.value,
  () => {
    phone.value = ''
  },
  { immediate: true }
)

onMounted(() => {
  authStore.getCountryCodes()
})
</script>

<style scoped lang="scss">
.auth-container {
  height: 100vh;
  position: relative;
  top: -16px;
}

.login-view {
  box-shadow: none !important;
  border-radius: 12px;

  &__logo {
    margin-bottom: 40px;
  }

  &__title {
    font-weight: 500;
    font-size: 18px;
    letter-spacing: 0;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 1);
  }

  &__description {
    font-size: 14px;
    margin-bottom: 40px;
    color: rgba(17, 17, 17, 1);
    font-weight: 400;
  }

  &__content {
    margin-bottom: 20px;
  }

  &__actions {
    display: flex;
    justify-content: end;
  }
}
</style>

<style lang="scss">
.custom-autocomplete {
  margin-bottom: 30px;
  height: 40px;

  :deep(input) {
    font-size: 14px !important;
    color: rgba(17, 17, 17, 1);
  }

  :deep(.v-field--outlined) {
    --v-field-border-opacity: 1;
    border-color: rgba(100, 100, 100, 1) !important;
    outline: none;
  }

  :deep(.v-label) {
    font-weight: 500;
    color: rgba(143, 150, 165, 1) !important;
    font-size: 14px !important;
  }

  :deep(.v-field--focused .v-field__outline__start),
  :deep(.v-field--focused .v-field__outline__notch::before),
  :deep(.v-field--focused .v-field__outline__notch::after),
  :deep(.v-field--focused .v-field__outline__end) {
    border-color: rgb(169, 55, 244) !important;
    --v-field-border-width: 1px !important;
  }
}
</style>

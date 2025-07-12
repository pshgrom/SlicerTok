<template>
  <v-container
    class="d-flex justify-center align-center auth-container"
    fill-height
    style="height: 100vh"
  >
    <v-card class="pa-6 login-view" max-width="400" min-width="400">
      <SvgIcon class="login-view__logo" name="logo" :width="120" :height="31" />
      <h3 class="login-view__title">
        <template v-if="step === 1"> Вход по номеру телефона </template>
        <template v-else> Подтвердите код </template>
      </h3>
      <p class="login-view__description">
        <template v-if="step === 1">
          Введите свой номер телефона, который привязан <br />
          к Telegram и мы вышлем вам код для входа.
        </template>
        <template v-else>
          Мы выслали вам код на указанный вами номер: <br />
          {{ phone }}
        </template>
      </p>

      <v-form ref="formRef" @submit.prevent="handleLoginByPhone">
        <div class="login-view__content">
          <template v-if="step === 1">
            <div class="d-flex">
              <VCustomSelect
                v-model="currentCountryCode"
                label="Код страны"
                :items="countryCodes"
                style="width: 120px"
                class="mr-2"
              />
              <VCustomInput
                :key="currentCountryCode"
                v-model="phone"
                v-mask="currentMask"
                label="Номер телефона"
                autofocus
                :placeholder="placeholderPhone"
                :rules="[...phoneRules, requiredRules.required]"
                required
              />
            </div>
          </template>
          <template v-else>
            <VCustomInput
              v-model="code"
              label="Код подтверждения"
              placeholder="123456"
              autofocus
              :rules="[validateCode]"
              required
            />
          </template>
        </div>
        <div class="login-view__actions">
          <VCusomButton
            v-if="step === 2"
            class="mr-1"
            :customClass="['light', 'avg']"
            @click="reset"
          >
            Назад
          </VCusomButton>
          <VCusomButton type="submit" :customClass="['dark', 'avg']" :loading="loading">
            {{ step === 1 ? 'Отправить код' : 'Подтвердить' }}
          </VCusomButton>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/Auth'
import type { IAuthByPhone, IAuthConfirmation } from '@/interfaces/Auth'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useError } from '@/stores/Errors'
import VCustomSelect from '@/components/base/VCustomSelect.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import { requiredRules } from '@/utils/validators.ts'

const authStore = useAuth()
const errorStore = useError()
const router = useRouter()
const step = ref(1)
const formRef = ref(null)
const code = ref('')
const loading = ref(false)

const countryCodes = computed(() => authStore.countryCodes ?? [])
const currentCountryCode = computed({
  get() {
    return authStore.currentCountryCode ?? 1
  },
  set(val) {
    authStore.currentCountryCode = val
  }
})

const token = computed({
  get() {
    return authStore.token
  },
  set(val) {
    authStore.token = val
  }
})

const phone = computed({
  get() {
    return authStore.phone
  },
  set(val) {
    authStore.setPhone(val)
  }
})

const placeholderPhone = computed(() => {
  switch (currentCountryCode.value) {
    case 1:
      return '(__) ___-__-__'
    case 2:
      return '(___) ___-__-__'
    default:
      return ''
  }
})

const currentMask = computed(() => {
  if (!currentCountryCode.value) return ''
  if (currentCountryCode.value === 1) return '(##) ###-##-##'
  if (currentCountryCode.value === 2) return '(###) ###-##-##'
  return ''
})

const phoneRules = computed(() => {
  if (!currentCountryCode.value) return []
  const code = currentCountryCode.value
  const onlyDigits = phone.value.replace(/\D/g, '')
  if (code === 1) {
    return [() => onlyDigits.length === 9 || 'Введите 9 цифр для РБ']
  } else if (code === 2) {
    return [() => onlyDigits.length === 10 || 'Введите 10 цифр для РФ']
  }
  return []
})

const validateCode = (value: string) => {
  return value.length === 6 || 'Код должен быть из 6 цифр'
}

const reset = () => {
  step.value = 1
  code.value = ''
}

const cleanNumber = (str: string) => {
  return str.replace(/\D/g, '')
}

const handleLoginByPhone = async () => {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    if (step.value === 1) {
      try {
        const dataQuery: IAuthByPhone = {
          country_calling_codes_id: +currentCountryCode.value,
          phone: cleanNumber(phone.value)
        }
        loading.value = true
        const { data } = await authStore.loginByPhone(dataQuery)
        if (data.status === 'Success') {
          step.value = 2
        }
      } catch (error: any) {
        errorStore.setErrors(error)
      } finally {
        loading.value = false
      }
    } else {
      try {
        const dataQuery: IAuthConfirmation = {
          country_calling_codes_id: +currentCountryCode.value,
          phone: cleanNumber(phone.value),
          key: code.value
        }
        loading.value = true
        const { data } = await authStore.loginConfirmation(dataQuery)
        const { token: tokenValue, role } = data?.data
        if (tokenValue && role?.length) {
          localStorage.setItem('authToken', tokenValue)
          token.value = tokenValue
          authStore.role = role[0]
          if (authStore.role) localStorage.setItem('role', authStore.role.toString())
          await router.push({ name: 'UserInfo' })
        }
      } catch (error: any) {
        errorStore.setErrors(error)
      } finally {
        loading.value = false
      }
    }
  }
}

watch(
  () => currentCountryCode.value,
  (newVal) => {
    if (newVal) {
      phone.value = ''
    }
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
    font-family: 'Inter Medium', sans-serif;
    font-size: 18px;
    font-weight: 400;
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

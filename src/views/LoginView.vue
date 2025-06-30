<template>
  <v-container
    class="d-flex justify-center align-center auth-container"
    fill-height
    style="height: 100vh"
  >
    <v-card class="pa-6" max-width="400" min-width="400">
      <v-card-title class="text-h5">
        {{ step === 1 ? 'Вход по номеру телефона' : 'Подтвердите код' }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleLoginByPhone">
          <template v-if="step === 1">
            <VCustomSelect
              v-model="currentCountry"
              label="Выбор страны"
              :items="countryIds"
              class="mb-5"
            />
            <div class="d-flex">
              <VCustomSelect
                v-model="currentCountryCode"
                label="Код страны"
                :items="countryCodes"
                style="width: 70px"
                class="mr-5"
                readonly
              />
              <VCustomInput
                v-model="phone"
                label="Номер телефона"
                autofocus
                v-mask="currentMask"
                :placeholder="placeholderPhone"
                :rules="phoneRules"
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

          <v-btn type="submit" color="primary" class="mt-4" :loading="loading" block>
            {{ step === 1 ? 'Отправить код' : 'Подтвердить' }}
          </v-btn>

          <v-btn v-if="step === 2" class="mt-2" variant="text" @click="reset" block> Назад </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/Auth'
import { IAuthByPhone, IAuthConfirmation } from '@/interfaces/Auth'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useError } from '@/stores/Errors'
import VCustomSelect from '@/components/base/VCustomSelect.vue'

const authStore = useAuth()
const errorStore = useError()
const router = useRouter()
const step = ref(1)
const code = ref('')
const loading = ref(false)
const currentCountry = ref(1)
const currentCountryCode = ref<string | null>(null)

const countryCodes = computed(() => authStore.countryCodes ?? [])
const countryIds = computed(() => authStore.countryIds ?? [])

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
  switch (currentCountry.value) {
    case 1:
      return '(__) ___-__-__'
    case 2:
      return '(___) ___-__-__'
    default:
      return ''
  }
})

const currentMask = computed(() => {
  if (!currentCountry.value) return ''
  if (currentCountry.value === 1) return '(##) ###-##-##'
  if (currentCountry.value === 2) return '(###) ###-##-##'
  return ''
})

const phoneRules = computed(() => {
  if (!currentCountry.value) return []
  const code = currentCountry.value
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

const handleLoginByPhone = async () => {
  if (step.value === 1) {
    try {
      const dataQuery: IAuthByPhone = {
        country_calling_codes_id: currentCountry.value,
        phone: phone.value
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
        country_calling_codes_id: currentCountry.value,
        phone: phone.value,
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

watch(
  () => currentCountry.value,
  (newVal) => {
    if (newVal) {
      currentCountryCode.value = countryCodes.value?.find((v) => v.value === newVal)?.label ?? ''
      phone.value = ''
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.auth-container {
  height: 100vh;
  position: relative;
  top: -16px;
}
</style>

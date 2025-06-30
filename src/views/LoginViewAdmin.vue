<template>
  <v-container
    class="d-flex justify-center align-center auth-container"
    fill-height
    style="height: 100vh"
  >
    <v-card max-width="400" min-width="400" class="pa-6">
      <v-card-title class="text-h5 text-center"> Вход в аккаунт </v-card-title>
      <v-card-subtitle class="text-center mb-6">
        Введите свои учетные данные, чтобы войти
      </v-card-subtitle>
      <v-form ref="formRef" @submit.prevent="handleLogin">
        <VCustomInput
          v-model.trim="login"
          label="Имя"
          autofocus
          :rules="[requiredRules.required]"
          class="mb-3"
        />
        <VCustomInput
          v-model.trim="password"
          label="Пароль"
          :rules="[requiredRules.required]"
          class="mb-3"
        />
        <v-btn type="submit" color="primary">Войти</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/Auth'
import { IAuth } from '@/interfaces/Auth'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useError } from '@/stores/Errors'
import { ROLES } from '@/constants/roles'
import { requiredRules } from '@/utils/validators'

const authStore = useAuth()
const errorStore = useError()
const router = useRouter()
const formRef = ref(null)
const login = ref('adminGroupA')
const phone = ref('')
const password = ref('adminGroupA')
const currentCountry = ref(1)
const currentCountryCode = ref<string | null>(null)

const countryCodes = computed(() => authStore.countryCodes ?? [])

const handleLogin = async () => {
  const isValid = await formRef?.value?.validate()
  if (isValid.valid) {
    try {
      const data: IAuth = {
        login: login.value,
        password: password.value
      }
      const { token, role } = await authStore.login(data)
      if (token && role) {
        switch (role) {
          case ROLES.ADMIN:
            await router.push({ name: 'AdminInfo' })
            break
          case ROLES.ADMIN_FINANCE:
            await router.push({ name: 'AdminPaymentsFinance' })
            break
          case ROLES.ADMIN_MAIN:
            await router.push({ name: 'AdminMain' })
            break
          case ROLES.SUPPORT:
            await router.push({ name: 'Support' })
            break
        }
      }
    } catch (error: any) {
      errorStore.setErrors(error)
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

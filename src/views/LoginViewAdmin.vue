<template>
  <v-container
    class="d-flex justify-center align-center auth-container"
    fill-height
    style="height: 100vh"
  >
    <v-card max-width="400" min-width="400" class="pa-6 login-admin">
      <SvgIcon class="login-admin__logo" name="logo" />
      <h3 class="login-admin__title">Введите свои учетные данные</h3>

      <v-form ref="formRef" @submit.prevent="handleLogin">
        <VCustomInput
          v-model.trim="credentials.login"
          label="Имя пользователя"
          autofocus
          :rules="[requiredRules.required]"
          class="mb-3"
        />

        <VCustomInput
          v-model.trim="credentials.password"
          label="Пароль"
          type="password"
          :rules="[requiredRules.required]"
          class="mb-3"
        />

        <div class="login-admin__actions">
          <VCusomButton type="submit" :custom-class="['dark', 'avg']" :loading="isLoading">
            Войти
          </VCusomButton>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { ROLES } from '@/constants/roles'
import { ADMIN_ROUTE_MAP } from '@/constants/routes'
import type { IAuth } from '@/interfaces/Auth'
import { useAuth } from '@/stores/Auth'
import { useError } from '@/stores/Errors'
import { handleApiError } from '@/utils/errorHandler'
import { requiredRules } from '@/utils/validators'

interface LoginCredentials {
  login: string
  password: string
}

const formRef = ref<HTMLFormElement | null>(null)
const isLoading = ref(false)

const credentials = reactive<LoginCredentials>({
  login: '',
  password: ''
})

const authStore = useAuth()
const errorStore = useError()
const router = useRouter()

// const isFormValid = computed(() => credentials.login.trim() && credentials.password.trim())

const getRouteForRole = (role: number): string => {
  const routeMap: Record<number, string> = {
    [ROLES.ADMIN]: ADMIN_ROUTE_MAP.ADMIN,
    [ROLES.ADMIN_FINANCE]: ADMIN_ROUTE_MAP.FINANCE,
    [ROLES.ADMIN_MAIN]: ADMIN_ROUTE_MAP.MAIN,
    [ROLES.SUPPORT]: ADMIN_ROUTE_MAP.SUPPORT
  }

  return routeMap[role] || ADMIN_ROUTE_MAP.DEFAULT
}

const handleSuccessfulLogin = async (token: string, role: number) => {
  const routeName = getRouteForRole(role)

  if (routeName === ADMIN_ROUTE_MAP.DEFAULT) {
    errorStore.setErrors('Неизвестная роль пользователя')
    return
  }

  await router.push({ name: routeName })
}

const handleLogin = async (): Promise<void> => {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    isLoading.value = true

    const authData: IAuth = {
      login: credentials.login.trim(),
      password: credentials.password.trim()
    }

    const { token, role } = await authStore.login(authData)

    if (token && role) {
      await handleSuccessfulLogin(token, role)
    }
  } catch (error: unknown) {
    const errorMessage = handleApiError(error)
    errorStore.setErrors(errorMessage)
  } finally {
    isLoading.value = false
  }
}
console.log('admin auth')
</script>

<style scoped lang="scss">
.auth-container {
  height: 100vh;
  position: relative;
  top: -16px;
}

.login-admin {
  box-shadow: none !important;
  border-radius: 12px;

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__logo {
    margin-bottom: 25px;
  }

  &__title {
    font-weight: 500;
    font-size: 18px;
    letter-spacing: 0;
    color: rgba(0, 0, 0, 1);
    margin-bottom: 25px;
  }
}
</style>

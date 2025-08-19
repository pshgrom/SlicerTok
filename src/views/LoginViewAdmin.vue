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
        <div class="login-admin__actions">
          <VCusomButton type="submit" :customClass="['dark', 'avg']" :loading="loading">
            Войти
          </VCusomButton>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/Auth'
import { type IAuth } from '@/interfaces/Auth'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useError } from '@/stores/Errors'
import { ROLES } from '@/constants/roles'
import { requiredRules } from '@/utils/validators'
import VCusomButton from '@/components/base/VCusomButton.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'

const authStore = useAuth()
const errorStore = useError()
const router = useRouter()
const formRef = ref(null)
const login = ref('')
const phone = ref('')
const password = ref('')
const currentCountry = ref(1)
const loading = ref(false)
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
      loading.value = true
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
          default:
            await router.push({ name: 'Login' })
            break
        }
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

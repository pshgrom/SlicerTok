<template>
  <!--  <Test />-->
  <div class="user-info">
    <div class="user-info__wrapper">
      <ProfileCard v-model:dialog="editDialog" :user="user" />
      <WalletsCard
        :wallets="sortedWallets"
        @set-as-main="setAsMain"
        @remove-wallet="removeWallet"
        @open-modal-wallet="openModalWallet"
      />
      <EditProfileDialog
        v-if="editDialog"
        v-model:dialog="editDialog"
        :end-date="endDate"
        :user="user"
        @update="updateUser"
      />
    </div>

    <WalletModal v-if="isModalOpen" v-model="isModalOpen" @save="saveWallet" />

    <div class="table-actions">
      <div class="table-actions__left">
        <div class="table-actions__label">Ваши видео</div>
      </div>
      <div class="table-actions__right">
        <VCusomButton :custom-class="['dark']" @click="handlePaymentRequest">
          Подать заявку
        </VCusomButton>
      </div>
    </div>

    <TableUserInfo
      :headers="headers"
      :is-loading="isLoading"
      :items="userInfoData"
      :items-per-page="queryParams.perPage"
      @resubmission-publication="resubmissionPublication"
    />

    <div v-if="showPagination" class="sticky-pagination custom-pagination">
      <TablePagination
        v-model:query-params="queryParams"
        :loading="isLoading"
        :total-pages="totalPages"
        @change-page="handlePageChange"
      />
    </div>

    <AddVideoDialog
      v-if="dialogVideo"
      v-model="dialogVideo"
      :wallet="mainWallet"
      :loading="isSubmittingVideo"
      :edit-mode="editMode"
      :video-link="videoLink"
      @submit="handleVideoSubmit"
    />
  </div>
  <RulesDialog v-if="showRules" v-model="showRules" @save="saveWallet" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import VCusomButton from '@/components/base/VCusomButton.vue'
import AddVideoDialog from '@/components/modals/AddVideoDialog.vue'
import EditProfileDialog from '@/components/modals/EditProfileDialog.vue'
import RulesDialog from '@/components/modals/RulesDialog.vue'
import WalletModal from '@/components/modals/WalletModal.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import TablePagination from '@/components/tables/TablePagination.vue'
import TableUserInfo from '@/components/tables/TableUserInfo.vue'
import WalletsCard from '@/components/wallets/WalletsCard.vue'
import { userInfoHeaders } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import type { IUploadVideo, IUser, IWallet } from '@/interfaces/Slicer'
import { useAuth } from '@/stores/Auth'
import { useError } from '@/stores/Errors'
import { useRequestSocket } from '@/stores/RequestsSocket.ts'
import { useUserInfo } from '@/stores/UserInfo'

const headers = ref<ITableHeaders[]>(userInfoHeaders)

const authStore = useAuth()
const userInfoStore = useUserInfo()
const errorStore = useError()
const router = useRouter()

const wallets = ref<IWallet[]>([])
const isModalOpen = ref(false)
const videoLink = ref('')
const editMode = ref(false)
const isSubmittingVideo = ref(false)
const requestSocketStore = useRequestSocket()
const editDialog = ref(false)
const dialogVideo = ref(false)
const endDate = ref<string | null>(null)

const userId = ref<string | null | number>(null)

const user = ref<IUser>({
  name: '',
  phone: authStore.phone || '',
  email: '',
  telegram: ''
})

const isLoading = computed(() => userInfoStore.isLoading)

const showRules = computed({
  get() {
    return userInfoStore.showRules
  },
  set(val) {
    userInfoStore.showRules = val
  }
})
const userInfoData = computed<IUserInfoData[]>(() => userInfoStore.userInfoData)

const mainWallet = computed(() => wallets.value.find((wallet) => wallet.is_main))

const sortedWallets = computed(() =>
  [...wallets.value].sort((a, b) => (b.is_main ? 1 : a.is_main ? -1 : 0))
)

const resubmissionPublication = (item) => {
  dialogVideo.value = true
  videoLink.value = item.url
  editMode.value = true
}

const queryParams = computed<ITableParams>({
  get() {
    return userInfoStore.queryParams
  },
  set(val) {
    userInfoStore.setQueryParams(val)
  }
})

const totalPages = computed(() => {
  const { total, perPage } = queryParams.value
  return total && perPage ? Math.ceil(total / perPage) : 0
})

const showPagination = computed(() => totalPages.value > 0)

const cleanNumber = (str: string): string => {
  return str.replace(/\D/g, '')
}

const updateUser = async (newData: IUser) => {
  user.value = { ...newData }
  await userInfoStore.updateContact(newData)
  await fetchUserInfo()
}

const openModalWallet = () => {
  isModalOpen.value = true
}

const closeVideoDialog = () => {
  dialogVideo.value = false
}

const handleVideoSubmit = async (videoData: IUploadVideo) => {
  const { videoFile, videoLink, number_views, isBonus } = videoData
  const formData = new FormData()

  formData.append('link', videoLink)
  formData.append('video_stat', videoFile)
  formData.append('is_bonus', Boolean(isBonus))
  formData.append('number_views', cleanNumber(number_views))

  try {
    isSubmittingVideo.value = true
    resetToFirstPage()
    editMode.value
      ? await userInfoStore.resubmissionPublication(formData)
      : await userInfoStore.createPublication(formData)
  } catch (error: any) {
    errorStore.setErrors(error)
  } finally {
    closeVideoDialog()
    isSubmittingVideo.value = false
  }
}

const resetToFirstPage = () => {
  const newParams = {
    ...queryParams.value,
    page: 1
  }

  queryParams.value = newParams
  updateRouteQuery(newParams)
}

const updateRouteQuery = (params: ITableParams) => {
  router.push({
    query: {
      page: params.page,
      perPage: params.perPage
    }
  })
}

const setAsMain = async (walletId: number) => {
  const walletIndex = wallets.value.findIndex((wallet) => wallet.id === walletId)
  if (walletIndex === -1) return

  wallets.value = wallets.value.map((wallet) => ({
    ...wallet,
    is_main: wallet.id === walletId
  }))

  await userInfoStore.setWalletMain(walletId)
}

const saveWallet = async (wallet: IWallet) => {
  const newWallet = {
    address: wallet.address,
    type: 'tron' as const
  }

  try {
    const { data } = await userInfoStore.addWallet(newWallet)

    if (data?.data) {
      wallets.value.push(data.data)
    }

    const message = data?.message ?? 'Кошелек успешно добавлен'
    errorStore.setErrors(message, 'success')
    isModalOpen.value = false
  } catch (error: any) {
    errorStore.setErrors(error)
  }
}

const removeWallet = async (index: number, walletId: number, isMain: boolean) => {
  if (wallets.value.length <= 1 || isMain) return

  wallets.value.splice(index, 1)
  await userInfoStore.removeWallet(walletId)
}

const handlePaymentRequest = () => {
  const { phone, telegram, name } = user.value

  const missingFields: string[] = []

  if (!name) missingFields.push('Имя')
  if (!phone) missingFields.push('Телефон')
  if (!telegram) missingFields.push('Telegram')
  if (wallets.value.length === 0) missingFields.push('Кошелек')

  if (missingFields.length) {
    const word = missingFields.length === 1 ? 'обязательное поле' : 'обязательные поля'

    errorStore.setErrors(`Пожалуйста, заполните ${word}: ${missingFields.join(', ')}`)
    return
  }

  editMode.value = false
  videoLink.value = ''
  dialogVideo.value = true
}

const handlePageChange = (pageNumber: number) => {
  queryParams.value = {
    ...queryParams.value,
    page: +pageNumber
  }
  const { page, perPage } = queryParams.value
  updateRouteQuery({ page, perPage })
}

const fetchPublications = () => {
  userInfoStore.getPublicationsList(queryParams.value)
}

const fetchUserInfo = async () => {
  try {
    const response = await userInfoStore.getInfo()
    const { contacts, name: userName, key } = response?.data?.profile ?? {}
    endDate.value = response.data?.inf_updated_at
    userId.value = response.data?.id

    user.value = {
      ...contacts,
      name: userName,
      key
    }
  } catch (error) {
    console.error('Ошибка загрузки информации пользователя:', error)
  }
}

const fetchWallets = async () => {
  try {
    const response = await userInfoStore.getWallets()
    if (response.data?.data?.length) {
      wallets.value = response.data.data
    }
  } catch (error) {
    console.error('Ошибка загрузки кошельков:', error)
  }
}

watch(
  () => router.currentRoute.value.query,
  (newQuery) => {
    const { page = 1, perPage = 20 } = newQuery
    queryParams.value = {
      ...queryParams.value,
      page: Number(page),
      perPage: Number(perPage)
    }
    fetchPublications()
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    await Promise.all([fetchUserInfo(), fetchWallets()])
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
    errorStore.setErrors('Не удалось загрузить данные пользователя')
  }
  requestSocketStore.setChannel(`publication.status.${userId.value}`)
  requestSocketStore.connect()
})
</script>

<style scoped lang="scss">
.user-info {
  &__wrapper {
    display: flex;
    margin-bottom: 14px;
    gap: 14px;
    align-items: stretch;

    @media (max-width: 767px) {
      flex-direction: column;
    }
  }
}
</style>

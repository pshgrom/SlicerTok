<template>
  <div class="main-info">
    <div class="user-info">
      <div class="user-info__wrapper">
        <ProfileCard v-model:dialog="editDialog" :user="user" :is-loading="isLoading" />
        <WalletsCard
          :wallets="sortedWallets"
          :is-loading="loadingWallets"
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
    </div>
    <div class="table-wrap">
      <div class="table-actions">
        <div class="table-actions__left">
          <div class="table-actions__label">Заявки</div>
        </div>
        <div class="table-actions__right">
          <VCusomButton :custom-class="['dark', 'avg']" @click="handlePaymentRequest">
            Подать заявку
          </VCusomButton>
        </div>
      </div>

      <TableUserInfo
        :headers="headers"
        :is-loading="loadingUser"
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
    </div>
  </div>
  <WalletModal v-if="isModalOpen" v-model="isModalOpen" @save="saveWallet" />
  <AddVideoDialog
    v-if="dialogVideo"
    v-model="dialogVideo"
    :wallet="mainWallet"
    :loading="isSubmittingVideo"
    :edit-mode="editMode"
    :video-link="videoLink"
    @submit="handleVideoSubmit"
  />
  <RulesDialog v-if="showRules" v-model="showRules" @save="saveWallet" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useError } from '@/app/stores'
import { useRequestSocket } from '@/entities/chat'
import { useUserInfo } from '@/entities/user'
import { userInfoHeaders } from '@/shared/config'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/shared/config/types/app-model'
import type { IUploadVideo, IUser, IWallet } from '@/shared/config/types/slicer'
import AddVideoDialog from '@/widgets/modals/AddVideoDialog.vue'
import EditProfileDialog from '@/widgets/modals/EditProfileDialog.vue'
import WalletModal from '@/widgets/modals/WalletModal.vue'
import { ProfileCard } from '@/widgets/profile-card'
import { TablePagination } from '@/shared/ui'
import { TableUserInfo } from '@/widgets/tables'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import { WalletsCard } from '@/widgets/wallets'
const RulesDialog = defineAsyncComponent(() => import('@/widgets/modals/RulesDialog.vue'))

const headers = ref<ITableHeaders[]>(userInfoHeaders)

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
const publicationId = ref(null)
const endDate = ref<string | null>(null)
const loadingWallets = ref<boolean>(false)
const loadingUser = ref<boolean>(false)

const userId = ref<string | null | number>(null)

const isLoading = computed(() => userInfoStore.isLoading)

const user = computed({
  get() {
    return userInfoStore.user
  },
  set(val) {
    userInfoStore.user = val
  }
})

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
  publicationId.value = item.id
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
  const { videoFile, videoLink, number_views, isBonus, blogger } = videoData
  const formData = new FormData()

  formData.append('video_stat', videoFile)
  formData.append('streamer_id', +blogger)
  formData.append('is_bonus', Boolean(isBonus))
  formData.append('number_views', cleanNumber(number_views))
  editMode.value
    ? formData.append('publication_id', publicationId.value)
    : formData.append('link', videoLink)

  try {
    isSubmittingVideo.value = true
    if (editMode.value) {
      const { code } = await userInfoStore.resubmissionPublication(formData)
      if (code === 200) {
        closeVideoDialog()
        fetchPublications()
      }
    } else {
      const { code } = await userInfoStore.createPublication(formData)
      if (code === 200) {
        closeVideoDialog()
        queryParams.value.page === 1 ? fetchPublications() : resetToFirstPage()
      }
    }
  } catch (error: any) {
    errorStore.setErrors(error)
  } finally {
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
    loadingUser.value = true
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
  } finally {
    loadingUser.value = false
  }
}

const fetchWallets = async () => {
  try {
    loadingWallets.value = true
    const response = await userInfoStore.getWallets()
    if (response.data?.data?.length) {
      wallets.value = response.data.data
    }
  } catch (error) {
    console.error('Ошибка загрузки кошельков:', error)
  } finally {
    loadingWallets.value = false
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
.main-info {
  display: flex;
  width: 100%;

  @media (max-width: 1440px) {
    flex-direction: column;
  }
}

.table-wrap {
  width: 100%;
}

.user-info {
  display: flex;
  margin-right: 16px;

  @media (max-width: 1440px) {
    margin-right: 0;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
    gap: 8px;

    @media (max-width: 1440px) {
      flex-direction: row;
      width: 100%;
      margin-bottom: 8px;
    }

    @media (max-width: 767px) {
      flex-direction: column;
    }
  }
}
</style>

<template>
  <div class="user-info">
    <div class="user-info__wrapper">
      <!--        v-model:imageFile="imageFile"-->
      <ProfileCard v-model:dialog="editDialog" :user="user" />
      <WalletsCard
        :wallets="wallets"
        @set-as-main="setAsMain"
        @remove-wallet="removeWallet"
        @open-modal-wallet="openModalWallet"
      />
      <EditProfileDialog
        v-if="editDialog"
        v-model:dialog="editDialog"
        :endDate="endDate"
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
        <VCusomButton :customClass="['dark']" @click="openPaymentDialog">
          Подать заявку
        </VCusomButton>
      </div>
    </div>
    <TableUserInfo
      :headers="headers"
      :isLoading="isLoading"
      :items="calcDataItems"
      :itemsPerPage="queryParams.perPage"
    ></TableUserInfo>
    <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
      <TablePagination
        v-model:queryParams="queryParams"
        :loading="isLoading"
        :totalPages="totalPages"
        @change-page="changePage"
      />
    </div>
    <AddVideoDialog
      v-if="dialogVideo"
      v-model="dialogVideo"
      :wallet="currentWallet"
      :loading="loading"
      @submit="submitVideo"
    />
  </div>
</template>

<script setup lang="ts">
import TablePagination from '@/components/tables/TablePagination.vue'
import { computed, ref, onMounted } from 'vue'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { userInfoHeaders } from '@/constants/tableHeaders'
import { useUserInfo } from '@/stores/UserInfo'
import TableUserInfo from '@/components/tables/TableUserInfo.vue'
import { useRouter } from 'vue-router'
import { useError } from '@/stores/Errors'
import EditProfileDialog from '@/components/modals/EditProfileDialog.vue'
import AddVideoDialog from '@/components/modals/AddVideoDialog.vue'
import WalletModal from '@/components/modals/WalletModal.vue'
import type { IUploadVideo, IUser, IWallet } from '@/interfaces/Slicer'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import WalletsCard from '@/components/wallets/WalletsCard.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import { useAuth } from '@/stores/Auth'

const headers = ref<ITableHeaders[]>(userInfoHeaders)
const authStore = useAuth()

const wallets = ref<IWallet[]>([])
const isModalOpen = ref(false)
const loading = ref(false)

const phoneStore = computed(() => authStore.phone)

const user = ref<IUser>({
  name: '',
  phone: phoneStore.value ? phoneStore.value : '',
  email: '',
  telegram: ''
})

const endDate = ref('0')

const userInfo = useUserInfo()
const errorStore = useError()
const editDialog = ref(false)
// const imageFile = ref<File | null>(null)

const isLoading = computed(() => userInfo.isLoading)
const router = useRouter()
const dialogVideo = ref(false)

const calcDataItems = computed<IUserInfoData[]>(() => userInfo.userInfoData)

const currentWallet = computed(() => wallets.value.find((wallet) => wallet.is_main))

const closeDialog = () => {
  dialogVideo.value = false
}

const updateUser = async (newData) => {
  user.value = { ...newData }
  await userInfo.updateContact(newData)
}

const openModalWallet = () => {
  isModalOpen.value = true
}

const cleanNumber = (str: string) => {
  return str.replace(/\D/g, '')
}

const submitVideo = async ({ videoFile, videoLink, number_views }: IUploadVideo) => {
  const formData = new FormData()
  formData.append('link', videoLink)
  formData.append('video_stat', videoFile)
  formData.append('number_views', cleanNumber(number_views))
  try {
    loading.value = true
    resetPage()
    await userInfo.createPublication(formData)
  } catch (e: any) {
    errorStore.setErrors(e)
  } finally {
    closeDialog()
    loading.value = false
  }
}

const resetPage = () => {
  queryParams.value = {
    ...queryParams.value,
    page: 1
  }
  const { page, perPage } = queryParams.value
  router.push({
    query: {
      page,
      perPage
    }
  })
}

const setAsMain = async (id: number) => {
  const index = wallets.value.findIndex((wallet) => wallet.id === id)
  if (index === -1) return
  wallets.value.forEach((wallet) => (wallet.is_main = false))
  const selected = wallets.value.splice(index, 1)[0]
  selected.is_main = true
  wallets.value.unshift(selected)
  await userInfo.setWalletMain(id)
}

const sortWallets = () => {
  wallets.value.sort((a, b) => {
    return b.is_main ? 1 : a.is_main ? -1 : 0
  })
}

const saveWallet = async (wallet: IWallet) => {
  const newWallet = {
    address: wallet.address,
    type: 'tron'
  }
  const { data } = await userInfo.addWallet(newWallet)
  if (data?.data) {
    wallets.value.push({
      ...data.data
    })
  }
  const msg = data?.message ?? ''
  errorStore.setErrors(msg, 'success')
}

const removeWallet = async (index: number, id: number, is_main: boolean) => {
  if (wallets.value.length <= 1 || is_main) return
  wallets.value.splice(index, 1)
  await userInfo.removeWallet(id)
}

const queryParams = computed<ITableParams>({
  get() {
    return userInfo.queryParams
  },
  set(val) {
    userInfo.setQueryParams(val)
  }
})

const totalPages = computed(() =>
  queryParams.value?.total && queryParams.value?.perPage
    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
    : 0
)

const openPaymentDialog = () => {
  const { phone, telegram } = user.value
  if (!phone || !telegram || !wallets.value.length) {
    errorStore.setErrors(
      'Пожалуйста, заполните поля: <br> Имя <br> Телефон <br> Telegram <br> и добавьте хотя бы один кошелёк.'
    )
    return
  }
  dialogVideo.value = true
}

const changePage = (page: number) => {
  queryParams.value = {
    ...queryParams.value,
    page: +page
  }
  getRequest()
}

const getRequest = () => {
  const { page, perPage } = queryParams.value
  router.push({
    query: {
      page: page ?? 1,
      perPage
    }
  })
  userInfo.getPublicationsList(queryParams.value)
}

const getInfo = async () => {
  const resp = await userInfo.getInfo()
  endDate.value = resp.data?.inf_updated_at ?? '0'
  const { contacts, name: userName, key } = resp.data?.profile ?? {}
  user.value = {
    ...contacts,
    name: userName,
    key
  }
}

const getWallets = async () => {
  const { data } = await userInfo.getWallets()
  if (data?.data?.length) {
    wallets.value = data?.data
    sortWallets()
  }
}

onMounted(() => {
  const { page = 1, perPage = 20 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
  getInfo()
  getWallets()
})
</script>

<style scoped lang="scss">
.user-info {
  &__wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 14px;

    @media (max-width: 767px) {
      flex-direction: column;
    }
  }
}
</style>

<template>
  <v-container class="custom-container" fluid style="max-width: 1000px">
    <div class="user-info">
      <VCusomButton
        v-if="!currentUser.is_verified"
        class="mb-4"
        :customClass="['light']"
        @click="verifyUser(true)"
        >Верифицировать
      </VCusomButton>
      <VCusomButton v-else class="mb-4" :customClass="['light']" @click="verifyUser(false)">
        Аннулировать верификацию
      </VCusomButton>
      <div class="user-info__wrapper">
        <ProfileCard v-model:dialog="editDialog" :user="currentUser" :readonly="true" />
        <WalletsCard :wallets="wallets" :readonly="true" />
      </div>
      <div class="table-actions">
        <div class="table-actions__left">
          <div class="table-actions__label">Ваши видео</div>
        </div>
      </div>
      <TableUserInfo
        class="table-settings__table"
        :headers="headers"
        :isLoading="isLoading"
        :items="calcDataItems"
      ></TableUserInfo>
      <!--    <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">-->
      <!--      <TablePagination-->
      <!--        v-model:queryParams="queryParams"-->
      <!--        :loading="isLoading"-->
      <!--        :totalPages="totalPages"-->
      <!--        @change-page="changePage"-->
      <!--      />-->
      <!--    </div>-->
    </div>
  </v-container>
</template>

<script setup lang="ts">
import TablePagination from '@/components/tables/TablePagination.vue'
import { computed, ref, onMounted } from 'vue'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import WalletsCard from '@/components/wallets/WalletsCard.vue'
import { userInfoHeaders } from '@/constants/tableHeaders'
import { useUserInfo } from '@/stores/UserInfo'
import TableUserInfo from '@/components/tables/TableUserInfo.vue'
import { useRouter, useRoute } from 'vue-router'
import { useError } from '@/stores/Errors'
import type { IUploadVideo, IUser, IWallet } from '@/interfaces/Slicer'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import { useAuth } from '@/stores/Auth'
import { useSupport } from '@/stores/Support.ts'
import VCusomButton from '@/components/base/VCusomButton.vue'

const headers = ref<ITableHeaders[]>(userInfoHeaders)
const authStore = useAuth()

const wallets = ref<IWallet[]>([])

const phoneStore = computed(() => authStore.phone)
const calcDataItems = ref([])
const currentUserStore = useSupport()
const errorStore = useError()
const editDialog = ref(false)
// const imageFile = ref<File | null>(null)

const isLoading = computed(() => currentUserStore.isLoading)
const currentUser = computed(() => currentUserStore.currentUser)
const route = useRoute()
const router = useRouter()

// const queryParams = computed<ITableParams>({
//   get() {
//     return userInfo.queryParams
//   },
//   set(val) {
//     userInfo.setQueryParams(val)
//   }
// })

// const totalPages = computed(() =>
//   queryParams.value?.total && queryParams.value?.perPage
//     ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
//     : 0
// )

// const changePage = (page: number) => {
//   queryParams.value = {
//     ...queryParams.value,
//     page: +page
//   }
//   getRequest()
// }

const getSlicer = async (id: number) => {
  await currentUserStore.getSlicer(id)
}

const verifyUser = async (value: boolean) => {
  const id = currentUser.value.id
  const newData = {
    id,
    is_verified: value
  }
  const resp = await currentUserStore.verifyUser(newData)
  if (resp) await router.push({ name: 'SupportUsers' })
}

onMounted(() => {
  const id = Number(route.params.id)
  getSlicer(id)
  // getInfo()
  // getWallets()
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

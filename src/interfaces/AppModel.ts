import type { LocationQueryValue } from 'vue-router'

type Location = LocationQueryValue | LocationQueryValue[]

export interface ITableHeaders {
  title: string
  value: string
}

interface IPublications {
  id: string | number
  url: string
  identifier: string
  resource: string
}

export interface ITableItems {
  actual_status: string
  amount: string
  declared_status: string
  id: number
  nikname: string
  number_views: string
  wallet_id: string
  viewsDialog?: boolean
  showWallet?: boolean
  suspicion_status: string
}

export interface ITableParams {
  page: number | Location
  perPage: number | string | Location
  total?: number
  status?: string
  declaredStatus?: string | Location
  actualStatus?: string | Location
  walletId?: string | Location
  suspicionStatus?: string | Location
  tab?: string | Location
}

export interface ITableParamsAdmin extends ITableParams {
  sort_user_created_at?: string | Location
  sort_created_at?: string | Location
  user_created_at?: string | Location
  created_at?: string | Location
}

export interface IAmountListItems {
  id: string | number
  wallet_id: string
  wallet_transfer_list_link: string
  total_amount: number
  declared_amount_paid: string
  left_amount_pay: string
  revenues_found_amount: boolean
  status: {
    name: string
    amount: string
  }
}

export interface IPayoutListItems {
  id: string | number
  wallet: {
    address: string
    type: string
  }
  nikname: string
  number_views: string
  amount: string
  publications: IPublications[]
  viewsDialog?: boolean
}

export interface IWalletListItems {
  wallet_id_interaction: string
  count_wallet: string | number
  wallet_id_out: string[]
}

export interface IAmountListParams {
  page: number | Location
  perPage: number | Location
  walletId?: string | Location
  total?: number
  status?: string | Location
  declared_amount_paid?: string | Location
  left_amount_pay?: string | Location
  revenues_found_amount?: string | Location
}

export interface IUserInfo {
  id: string | number
  key: string
}

export interface IUserInfoData {
  id: string | number
  url: string
  identifier: string
  resource: string
  key: string
  number_views: number
  number_views_moderation: number
  status: string
  status_comment: string
  video_stat_link: string
}
/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IAdminInfoData extends IUserInfoData {}

export interface INewPublication {
  id: string | number
  key: string
  link: string
}

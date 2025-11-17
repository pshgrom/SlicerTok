export interface IUploadVideo {
  videoLink: string
  videoFile: null | File | string
  number_views: number | string
  isBonus: boolean
  blogger?: string | number
}

export interface IUser {
  name: string
  phone: string
  email: string
  telegram: string
}

export interface IWallet {
  address: string
  id: number
  is_main: boolean
  type: string
}

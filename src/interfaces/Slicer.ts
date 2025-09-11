export interface IUploadVideo {
  videoLink: string
  videoFile: null | File | string
  number_views: number | string
  isBonusVideo: boolean
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

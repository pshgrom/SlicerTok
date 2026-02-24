interface IPaymentVideo {
  id: string | number
  url: string
}

export interface IPayout {
  wallet_address: string
  nikname: string
  number_views: number | null
  amount: number | null
  publications: IPaymentVideo[] | string[]
}

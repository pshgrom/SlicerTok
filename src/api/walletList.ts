import type { AxiosResponse } from 'axios'

import api from './axios'

export const getDataWalletList = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/interaction-wallet-list')

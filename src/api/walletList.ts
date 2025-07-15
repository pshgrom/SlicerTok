import api from './axios'

export const getDataWalletList = () => api.get('/admin/interaction-wallet-list')

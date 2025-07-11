import axios from 'axios'

export const getDataWalletList = () => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/interaction-wallet-list')
}

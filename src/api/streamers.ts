import type { AxiosResponse } from 'axios'

import api from './axios'

export const streamerListQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/get-streamer-list')

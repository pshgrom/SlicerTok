import type { AxiosResponse } from 'axios'

import api from '@/shared/api'

export const streamerListQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/get-streamer-list')

export const finishCheckStreamerQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/streamer/publication/complete-moderation', { id })

export const getStreamerDailyStatsQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/statistic/get-statistic-daily')

export const getStreamerInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/profile/get-info')

export const getStreamerAllStatsQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/statistic/get-all-statistic')

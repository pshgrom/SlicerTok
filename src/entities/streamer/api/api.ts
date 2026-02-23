import type { AxiosResponse } from 'axios'

import api from '@/shared/api'
import type { ITableParams } from '@/shared/config/types/app-model.ts'

export const streamerListQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/get-streamer-list')

export const finishCheckStreamerQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/streamer/publication/complete-moderation', { id })

export const getStreamerDailyStatsQuery = (
  params: ITableParams
): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/statistic/get-statistic-daily', {
    params: { page: params.page ?? 1, perPage: params.perPage ?? 50 }
  })

export const getStreamerInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/profile/get-info')

export const getStreamerAllStatsQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/statistic/get-all-statistic')

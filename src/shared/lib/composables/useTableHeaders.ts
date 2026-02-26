import { computed, ref } from 'vue'

import type { ITableHeaders } from '@/shared/config/types/app-model'

/**
 * Общая логика заголовков таблицы (v-data-table): локальное состояние для сортировки/перестановки.
 * Используется в виджетах таблиц.
 */
export function useTableHeaders(initialHeaders: ITableHeaders[] = []) {
  const headersData = ref<ITableHeaders[]>([...initialHeaders])

  const computedHeaders = computed<ITableHeaders[]>({
    get: () => headersData.value,
    set: (val) => {
      headersData.value = val
    }
  })

  return { computedHeaders }
}
